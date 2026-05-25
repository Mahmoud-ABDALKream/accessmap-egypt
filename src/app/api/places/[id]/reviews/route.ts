import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, rating } = body;

    if (!text || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: text, rating' },
        { status: 400 }
      );
    }

    const parsedRating = parseInt(String(rating));
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const place = await db.place.findUnique({ where: { id } });
    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    const review = await db.review.create({
      data: {
        placeId: id,
        text,
        rating: parsedRating,
      },
    });

    // Recalculate the place's overallScore as the average of all review ratings
    const allReviews = await db.review.findMany({
      where: { placeId: id },
    });

    let newOverallScore: number;
    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      newOverallScore = avgRating;
    } else {
      // Fallback to breakdown scores average
      newOverallScore =
        (place.rampScore + place.elevatorScore + place.bathroomScore + place.parkingScore + place.entranceScore) / 5;
    }

    await db.place.update({
      where: { id },
      data: { overallScore: newOverallScore },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
