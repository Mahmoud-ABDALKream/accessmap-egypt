import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { field, currentValue, suggestedValue, reason = '' } = body;

    if (!field || currentValue === undefined || suggestedValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: field, currentValue, suggestedValue' },
        { status: 400 }
      );
    }

    try {
      const { db } = await import('@/lib/db');

      const place = await db.place.findUnique({ where: { id } });
      if (!place) {
        return NextResponse.json(
          { error: 'Place not found' },
          { status: 404 }
        );
      }

      const editSuggestion = await db.editSuggestion.create({
        data: {
          placeId: id,
          field,
          currentValue: String(currentValue),
          suggestedValue: String(suggestedValue),
          reason,
        },
      });

      return NextResponse.json(editSuggestion, { status: 201 });
    } catch {
      return NextResponse.json(
        { error: 'Database not available. Edit suggestions are not accepted in demo mode.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error creating edit suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to create edit suggestion' },
      { status: 500 }
    );
  }
}
