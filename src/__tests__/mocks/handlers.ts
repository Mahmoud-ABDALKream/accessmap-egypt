import { http, HttpResponse } from 'msw';
import { fallbackPlaces } from '@/lib/fallback-data';

const fallbackStats = {
  totalPlaces: fallbackPlaces.length,
  totalReviews: fallbackPlaces.reduce((sum, p) => sum + (p.reviews?.length || 0), 0),
  averageScore: Math.round(
    (fallbackPlaces.reduce((sum, p) => sum + p.overallScore, 0) / fallbackPlaces.length) * 100
  ) / 100,
  scoresByCategory: [],
  recentPlaces: fallbackPlaces.slice(0, 5),
};

export const handlers = [
  // GET /api/places
  http.get('/api/places', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const city = url.searchParams.get('city')?.toLowerCase() || '';
    const category = url.searchParams.get('category')?.toLowerCase() || '';

    let filtered = [...fallbackPlaces];

    if (city) {
      filtered = filtered.filter((p) => p.city === city);
    }
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.nameAr.includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }

    return HttpResponse.json(filtered);
  }),

  // POST /api/places
  http.post('/api/places', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const { name, category, city, latitude, longitude } = body;

    if (!name || !category || !city || latitude === undefined || longitude === undefined) {
      return HttpResponse.json(
        { error: 'Missing required fields: name, category, city, latitude, longitude' },
        { status: 400 }
      );
    }

    const rampScore = Number(body.rampScore || 0);
    const elevatorScore = Number(body.elevatorScore || 0);
    const bathroomScore = Number(body.bathroomScore || 0);
    const parkingScore = Number(body.parkingScore || 0);
    const entranceScore = Number(body.entranceScore || 0);

    const newPlace = {
      id: 'test-new-place-id',
      name: String(name),
      nameAr: String(body.nameAr || ''),
      category: String(category),
      city: String(city),
      latitude: Number(latitude),
      longitude: Number(longitude),
      rampScore,
      elevatorScore,
      bathroomScore,
      parkingScore,
      entranceScore,
      overallScore: (rampScore + elevatorScore + bathroomScore + parkingScore + entranceScore) / 5,
      reviewText: String(body.reviewText || ''),
      photoPath: String(body.photoPath || ''),
      submittedAt: new Date().toISOString(),
      approved: false,
      reviews: [],
      edits: [],
    };

    return HttpResponse.json(newPlace, { status: 201 });
  }),

  // GET /api/places/:id
  http.get('/api/places/:id', ({ params }) => {
    const { id } = params;
    const place = fallbackPlaces.find((p) => p.id === id);
    if (!place) {
      return HttpResponse.json({ error: 'Place not found' }, { status: 404 });
    }
    return HttpResponse.json(place);
  }),

  // POST /api/places/:id/reviews
  http.post('/api/places/:id/reviews', async ({ request, params }) => {
    const { id } = params;
    const body = await request.json() as Record<string, unknown>;
    const { text, rating } = body;

    if (!text || rating === undefined) {
      return HttpResponse.json(
        { error: 'Missing required fields: text, rating' },
        { status: 400 }
      );
    }

    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return HttpResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const place = fallbackPlaces.find((p) => p.id === id);
    if (!place) {
      return HttpResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    const review = {
      id: 'test-review-id',
      placeId: String(id),
      text: String(text),
      rating: parsedRating,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(review, { status: 201 });
  }),

  // GET /api/stats
  http.get('/api/stats', () => {
    return HttpResponse.json(fallbackStats);
  }),

  // GET /api/admin
  http.get('/api/admin', () => {
    return HttpResponse.json(
      { error: 'Unauthorized: Admin access required' },
      { status: 401 }
    );
  }),
];
