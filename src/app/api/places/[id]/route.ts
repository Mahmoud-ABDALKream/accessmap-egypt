import { NextRequest, NextResponse } from 'next/server';
import { fallbackPlaces } from '@/lib/fallback-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const { db } = await import('@/lib/db');
      const place = await db.place.findUnique({
        where: { id },
        include: {
          reviews: {
            orderBy: { createdAt: 'desc' },
          },
          edits: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!place) {
        return NextResponse.json(
          { error: 'Place not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(place);
    } catch {
      // Database not available, try fallback
      const place = fallbackPlaces.find((p) => p.id === id);
      if (!place) {
        return NextResponse.json(
          { error: 'Place not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(place);
    }
  } catch (error) {
    console.error('Error fetching place:', error);
    return NextResponse.json(
      { error: 'Failed to fetch place' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    try {
      const { db } = await import('@/lib/db');
      const existingPlace = await db.place.findUnique({ where: { id } });
      if (!existingPlace) {
        return NextResponse.json(
          { error: 'Place not found' },
          { status: 404 }
        );
      }

      const {
        name,
        nameAr,
        category,
        city,
        latitude,
        longitude,
        rampScore,
        elevatorScore,
        bathroomScore,
        parkingScore,
        entranceScore,
        reviewText,
        photoPath,
        approved,
      } = body;

      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (nameAr !== undefined) updateData.nameAr = nameAr;
      if (category !== undefined) updateData.category = category;
      if (city !== undefined) updateData.city = city;
      if (latitude !== undefined) updateData.latitude = parseFloat(String(latitude));
      if (longitude !== undefined) updateData.longitude = parseFloat(String(longitude));
      if (rampScore !== undefined) updateData.rampScore = parseInt(String(rampScore));
      if (elevatorScore !== undefined) updateData.elevatorScore = parseInt(String(elevatorScore));
      if (bathroomScore !== undefined) updateData.bathroomScore = parseInt(String(bathroomScore));
      if (parkingScore !== undefined) updateData.parkingScore = parseInt(String(parkingScore));
      if (entranceScore !== undefined) updateData.entranceScore = parseInt(String(entranceScore));
      if (reviewText !== undefined) updateData.reviewText = reviewText;
      if (photoPath !== undefined) updateData.photoPath = photoPath;
      if (approved !== undefined) updateData.approved = Boolean(approved);

      // Recalculate overallScore if any score fields were updated
      const newRamp = rampScore !== undefined ? parseInt(String(rampScore)) : existingPlace.rampScore;
      const newElevator = elevatorScore !== undefined ? parseInt(String(elevatorScore)) : existingPlace.elevatorScore;
      const newBathroom = bathroomScore !== undefined ? parseInt(String(bathroomScore)) : existingPlace.bathroomScore;
      const newParking = parkingScore !== undefined ? parseInt(String(parkingScore)) : existingPlace.parkingScore;
      const newEntrance = entranceScore !== undefined ? parseInt(String(entranceScore)) : existingPlace.entranceScore;

      updateData.overallScore = (newRamp + newElevator + newBathroom + newParking + newEntrance) / 5;

      const updatedPlace = await db.place.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json(updatedPlace);
    } catch {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error updating place:', error);
    return NextResponse.json(
      { error: 'Failed to update place' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const { db } = await import('@/lib/db');
      const existingPlace = await db.place.findUnique({ where: { id } });
      if (!existingPlace) {
        return NextResponse.json(
          { error: 'Place not found' },
          { status: 404 }
        );
      }

      await db.place.delete({ where: { id } });

      return NextResponse.json({ message: 'Place deleted successfully' });
    } catch {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error deleting place:', error);
    return NextResponse.json(
      { error: 'Failed to delete place' },
      { status: 500 }
    );
  }
}
