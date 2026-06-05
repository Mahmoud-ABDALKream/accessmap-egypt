import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GET /api/stats', () => {
  it('returns a stats object', async () => {
    const res = await fetch('/api/stats');
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data).toHaveProperty('totalPlaces');
    expect(data).toHaveProperty('totalReviews');
    expect(data).toHaveProperty('averageScore');
    expect(data).toHaveProperty('scoresByCategory');
    expect(data).toHaveProperty('recentPlaces');
  });

  it('totalPlaces is a non-negative number', async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();

    expect(typeof data.totalPlaces).toBe('number');
    expect(data.totalPlaces).toBeGreaterThanOrEqual(0);
  });

  it('totalReviews is a non-negative number', async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();

    expect(typeof data.totalReviews).toBe('number');
    expect(data.totalReviews).toBeGreaterThanOrEqual(0);
  });

  it('averageScore is a number between 0 and 5', async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();

    expect(typeof data.averageScore).toBe('number');
    expect(data.averageScore).toBeGreaterThanOrEqual(0);
    expect(data.averageScore).toBeLessThanOrEqual(5);
  });

  it('scoresByCategory is an array', async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();

    expect(Array.isArray(data.scoresByCategory)).toBe(true);
  });

  it('recentPlaces is an array', async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();

    expect(Array.isArray(data.recentPlaces)).toBe(true);
  });

  it('recentPlaces contains at most 5 items', async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();

    expect(data.recentPlaces.length).toBeLessThanOrEqual(5);
  });
});
