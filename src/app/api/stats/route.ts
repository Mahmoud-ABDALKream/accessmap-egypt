import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Total approved places
    const totalPlaces = await db.place.count({
      where: { approved: true },
    });

    // Get all approved places with scores
    const places = await db.place.findMany({
      where: { approved: true },
      select: {
        category: true,
        overallScore: true,
      },
    });

    // Average score by category
    const categoryMap = new Map<string, { total: number; count: number }>();
    let overallTotal = 0;
    for (const place of places) {
      overallTotal += place.overallScore;
      const existing = categoryMap.get(place.category) || { total: 0, count: 0 };
      existing.total += place.overallScore;
      existing.count += 1;
      categoryMap.set(place.category, existing);
    }

    const scoresByCategory: { category: string; avgScore: number; count: number }[] = [];
    for (const [category, data] of categoryMap.entries()) {
      scoresByCategory.push({
        category,
        avgScore: data.count > 0 ? Math.round((data.total / data.count) * 100) / 100 : 0,
        count: data.count,
      });
    }

    // Sort by avgScore descending
    scoresByCategory.sort((a, b) => b.avgScore - a.avgScore);

    // Overall average score
    const averageScore = totalPlaces > 0 ? Math.round((overallTotal / totalPlaces) * 100) / 100 : 0;

    // Most recently added 5 places
    const recentPlaces = await db.place.findMany({
      where: { approved: true },
      orderBy: { submittedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        nameAr: true,
        category: true,
        city: true,
        overallScore: true,
        submittedAt: true,
        photoPath: true,
        latitude: true,
        longitude: true,
        rampScore: true,
        elevatorScore: true,
        bathroomScore: true,
        parkingScore: true,
        entranceScore: true,
        reviewText: true,
        approved: true,
      },
    });

    // Total reviews count
    const totalReviews = await db.review.count();

    return NextResponse.json({
      totalPlaces,
      totalReviews,
      averageScore,
      scoresByCategory,
      recentPlaces,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
