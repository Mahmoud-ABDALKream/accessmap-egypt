import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const city = searchParams.get('city')?.toLowerCase() || '';
    const category = searchParams.get('category')?.toLowerCase() || '';

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

    const places = await db.place.findMany({
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

    return NextResponse.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
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
  } catch (error) {
    console.error('Error creating place:', error);
    return NextResponse.json(
      { error: 'Failed to create place' },
      { status: 500 }
    );
  }
}
