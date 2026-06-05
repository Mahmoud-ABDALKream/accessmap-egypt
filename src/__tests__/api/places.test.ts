import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GET /api/places', () => {
  it('returns an array of places', async () => {
    const res = await fetch('/api/places');
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('returns places with expected shape', async () => {
    const res = await fetch('/api/places');
    const data = await res.json();

    const place = data[0];
    expect(place).toHaveProperty('id');
    expect(place).toHaveProperty('name');
    expect(place).toHaveProperty('category');
    expect(place).toHaveProperty('city');
    expect(place).toHaveProperty('latitude');
    expect(place).toHaveProperty('longitude');
    expect(place).toHaveProperty('overallScore');
  });

  it('filters by city query parameter', async () => {
    const res = await fetch('/api/places?city=cairo');
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
    data.forEach((place: { city: string }) => {
      expect(place.city).toBe('cairo');
    });
  });

  it('filters by category query parameter', async () => {
    const res = await fetch('/api/places?category=museum');
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
    data.forEach((place: { category: string }) => {
      expect(place.category).toBe('museum');
    });
  });

  it('filters by search query parameter', async () => {
    const res = await fetch('/api/places?search=bibliotheca');
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    data.forEach((place: { name: string }) => {
      expect(place.name.toLowerCase()).toContain('bibliotheca');
    });
  });

  it('returns empty array for non-matching search', async () => {
    const res = await fetch('/api/places?search=zzznonexistent');
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it('combines multiple filters', async () => {
    const res = await fetch('/api/places?city=cairo&category=museum');
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
    data.forEach((place: { city: string; category: string }) => {
      expect(place.city).toBe('cairo');
      expect(place.category).toBe('museum');
    });
  });
});

describe('POST /api/places', () => {
  it('creates a place with valid data', async () => {
    const newPlace = {
      name: 'Test Place',
      category: 'hospital',
      city: 'alexandria',
      latitude: 31.2,
      longitude: 29.9,
      rampScore: 4,
      elevatorScore: 3,
      bathroomScore: 4,
      parkingScore: 3,
      entranceScore: 5,
    };

    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlace),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe('Test Place');
    expect(data.category).toBe('hospital');
    expect(data.city).toBe('alexandria');
    expect(data.approved).toBe(false);
    expect(data.overallScore).toBe((4 + 3 + 4 + 3 + 5) / 5);
  });

  it('rejects missing required fields', async () => {
    const incompletePlace = {
      name: 'Missing Fields Place',
      // missing category, city, latitude, longitude
    };

    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompletePlace),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Missing required fields');
  });

  it('rejects missing name', async () => {
    const noName = {
      category: 'museum',
      city: 'cairo',
      latitude: 30.0,
      longitude: 31.2,
    };

    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noName),
    });

    expect(res.status).toBe(400);
  });

  it('creates place with default scores of 0', async () => {
    const minimalPlace = {
      name: 'Minimal Place',
      category: 'park',
      city: 'giza',
      latitude: 29.98,
      longitude: 31.13,
    };

    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minimalPlace),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.rampScore).toBe(0);
    expect(data.elevatorScore).toBe(0);
    expect(data.bathroomScore).toBe(0);
    expect(data.parkingScore).toBe(0);
    expect(data.entranceScore).toBe(0);
    expect(data.overallScore).toBe(0);
  });
});

describe('GET /api/places/:id', () => {
  it('returns a single place by ID', async () => {
    const res = await fetch('/api/places/fallback-1');
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.id).toBe('fallback-1');
    expect(data.name).toBe('Mosque of Abu al-Abbas al-Mursi');
  });

  it('returns 404 for non-existent place', async () => {
    const res = await fetch('/api/places/non-existent-id');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/places/:id/reviews', () => {
  it('creates a review with valid data', async () => {
    const review = {
      text: 'Great accessibility!',
      rating: 4,
    };

    const res = await fetch('/api/places/fallback-1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.text).toBe('Great accessibility!');
    expect(data.rating).toBe(4);
  });

  it('rejects review without text', async () => {
    const review = {
      rating: 4,
    };

    const res = await fetch('/api/places/fallback-1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });

    expect(res.status).toBe(400);
  });

  it('rejects review with invalid rating', async () => {
    const review = {
      text: 'Invalid rating',
      rating: 6,
    };

    const res = await fetch('/api/places/fallback-1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });

    expect(res.status).toBe(400);
  });

  it('rejects review with rating below 1', async () => {
    const review = {
      text: 'Zero rating',
      rating: 0,
    };

    const res = await fetch('/api/places/fallback-1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });

    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent place review', async () => {
    const review = {
      text: 'Non-existent place',
      rating: 3,
    };

    const res = await fetch('/api/places/non-existent-id/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });

    expect(res.status).toBe(404);
  });
});
