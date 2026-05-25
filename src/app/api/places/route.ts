import { NextRequest, NextResponse } from 'next/server';
import { fallbackPlaces } from '@/lib/fallback-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const city = searchParams.get('city')?.toLowerCase() || '';
    const category = searchParams.get('category')?.toLowerCase() || '';

    // Try database first, fall back to static data
    let places;
    try {
      const { db } = await import('@/lib/db');
      const where: Record<string, unknown> = {
        approved: true,
      };

      if (city) {
        where.city = city;
      }

      if (category) {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { nameAr: { contains: search } },
          { category: { contains: search } },
        ];
      }

      places = await db.place.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        include: {
          reviews: {
            orderBy: { createdAt: 'desc' },
          },
          edits: {
            where: { resolved: false },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } catch {
      // Database not available (e.g., on Vercel), use fallback data
      places = fallbackPlaces.filter((p) => {
        if (city && p.city !== city) return false;
        if (category && p.category !== category) return false;
        if (search) {
          const s = search.toLowerCase();
          return p.name.toLowerCase().includes(s) || p.nameAr.includes(search) || p.category.toLowerCase().includes(s);
        }
        return true;
      });
    }

    return NextResponse.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json(fallbackPlaces);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      nameAr = '',
      category,
      city,
      latitude,
      longitude,
      rampScore = 0,
      elevatorScore = 0,
      bathroomScore = 0,
      parkingScore = 0,
      entranceScore = 0,
      reviewText = '',
      photoPath = '',
    } = body;

    if (!name || !category || !city || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, city, latitude, longitude' },
        { status: 400 }
      );
    }

    const overallScore =
      (rampScore + elevatorScore + bathroomScore + parkingScore + entranceScore) / 5;

    try {
      const { db } = await import('@/lib/db');
      const place = await db.place.create({
        data: {
          name,
          nameAr,
          category,
          city,
          latitude: parseFloat(String(latitude)),
          longitude: parseFloat(String(longitude)),
          rampScore: parseInt(String(rampScore)),
          elevatorScore: parseInt(String(elevatorScore)),
          bathroomScore: parseInt(String(bathroomScore)),
          parkingScore: parseInt(String(parkingScore)),
          entranceScore: parseInt(String(entranceScore)),
          overallScore,
          reviewText,
          photoPath,
          approved: false,
        },
      });

      return NextResponse.json(place, { status: 201 });
    } catch {
      // Database not available
      return NextResponse.json(
        { error: 'Database not available. Submissions are not accepted in demo mode.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error creating place:', error);
    return NextResponse.json(
      { error: 'Failed to create place' },
      { status: 500 }
    );
  }
}
