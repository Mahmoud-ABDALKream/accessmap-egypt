import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Auth check is handled by middleware, but we double-check here
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    try {
      const { db } = await import('@/lib/db');
      const unapprovedPlaces = await db.place.findMany({
        where: { approved: false },
        orderBy: { submittedAt: 'desc' },
        include: {
          reviews: true,
          edits: true,
        },
      });

      return NextResponse.json(unapprovedPlaces);
    } catch {
      // Database not available
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching unapproved places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unapproved places' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
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

      const updatedPlace = await db.place.update({
        where: { id },
        data: { approved: true },
      });

      return NextResponse.json(updatedPlace);
    } catch {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error approving place:', error);
    return NextResponse.json(
      { error: 'Failed to approve place' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
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
