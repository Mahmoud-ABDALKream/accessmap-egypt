import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../mocks/server';
import { useAppStore } from '@/lib/store';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  // Reset store state between tests
  useAppStore.setState({
    places: [],
    searchQuery: '',
    cityFilter: '',
    categoryFilter: '',
    selectedPlace: null,
    sidebarOpen: false,
    language: 'en',
    currentView: 'map',
    isLoading: false,
    stats: null,
    submitLat: null,
    submitLng: null,
  });
});
afterAll(() => server.close());

describe('useAppStore — Search & Filter', () => {
  it('has correct initial state', () => {
    const state = useAppStore.getState();
    expect(state.searchQuery).toBe('');
    expect(state.cityFilter).toBe('');
    expect(state.categoryFilter).toBe('');
    expect(state.places).toEqual([]);
    expect(state.language).toBe('en');
    expect(state.currentView).toBe('map');
  });

  it('sets search query', () => {
    useAppStore.getState().setSearchQuery('museum');
    expect(useAppStore.getState().searchQuery).toBe('museum');
  });

  it('sets city filter', () => {
    useAppStore.getState().setCityFilter('cairo');
    expect(useAppStore.getState().cityFilter).toBe('cairo');
  });

  it('sets category filter', () => {
    useAppStore.getState().setCategoryFilter('hospital');
    expect(useAppStore.getState().categoryFilter).toBe('hospital');
  });

  it('fetches places and updates state', async () => {
    await useAppStore.getState().fetchPlaces();
    const state = useAppStore.getState();
    expect(state.places.length).toBeGreaterThan(0);
  });

  it('filters places by search term', async () => {
    await useAppStore.getState().fetchPlaces({ search: 'bibliotheca' });
    const state = useAppStore.getState();
    expect(state.places.length).toBeGreaterThan(0);
    state.places.forEach((place) => {
      expect(
        place.name.toLowerCase().includes('bibliotheca') ||
        place.nameAr.includes('bibliotheca') ||
        place.category.toLowerCase().includes('bibliotheca')
      ).toBe(true);
    });
  });

  it('filters places by city', async () => {
    await useAppStore.getState().fetchPlaces({ city: 'cairo' });
    const state = useAppStore.getState();
    expect(state.places.length).toBeGreaterThan(0);
    state.places.forEach((place) => {
      expect(place.city).toBe('cairo');
    });
  });

  it('filters places by category', async () => {
    await useAppStore.getState().fetchPlaces({ category: 'museum' });
    const state = useAppStore.getState();
    expect(state.places.length).toBeGreaterThan(0);
    state.places.forEach((place) => {
      expect(place.category).toBe('museum');
    });
  });

  it('returns empty array for non-matching filters', async () => {
    await useAppStore.getState().fetchPlaces({ search: 'zzznonexistent' });
    const state = useAppStore.getState();
    expect(state.places).toEqual([]);
  });
});

describe('useAppStore — Language', () => {
  it('toggles language from en to ar', () => {
    useAppStore.getState().setLanguage('ar');
    expect(useAppStore.getState().language).toBe('ar');
  });

  it('toggles language from ar to en', () => {
    useAppStore.getState().setLanguage('ar');
    useAppStore.getState().setLanguage('en');
    expect(useAppStore.getState().language).toBe('en');
  });
});

describe('useAppStore — View', () => {
  it('switches current view', () => {
    useAppStore.getState().setCurrentView('submit');
    expect(useAppStore.getState().currentView).toBe('submit');
  });

  it('switches to stats view', () => {
    useAppStore.getState().setCurrentView('stats');
    expect(useAppStore.getState().currentView).toBe('stats');
  });

  it('switches to admin view', () => {
    useAppStore.getState().setCurrentView('admin');
    expect(useAppStore.getState().currentView).toBe('admin');
  });
});

describe('useAppStore — Selected Place', () => {
  it('sets selected place and opens sidebar', () => {
    const mockPlace = {
      id: 'test-1',
      name: 'Test Place',
      nameAr: '',
      category: 'museum',
      city: 'cairo',
      latitude: 30.0,
      longitude: 31.2,
      overallScore: 3.5,
      rampScore: 4,
      elevatorScore: 3,
      bathroomScore: 3,
      parkingScore: 4,
      entranceScore: 4,
      reviewText: '',
      photoPath: '',
      submittedAt: '2024-01-15T10:00:00.000Z',
      approved: true,
      reviews: [],
      edits: [],
    };

    useAppStore.getState().setSelectedPlace(mockPlace);
    expect(useAppStore.getState().selectedPlace).toEqual(mockPlace);
    expect(useAppStore.getState().sidebarOpen).toBe(true);
  });

  it('clears selected place and closes sidebar', () => {
    const mockPlace = {
      id: 'test-1',
      name: 'Test Place',
      nameAr: '',
      category: 'museum',
      city: 'cairo',
      latitude: 30.0,
      longitude: 31.2,
      overallScore: 3.5,
      rampScore: 4,
      elevatorScore: 3,
      bathroomScore: 3,
      parkingScore: 4,
      entranceScore: 4,
      reviewText: '',
      photoPath: '',
      submittedAt: '2024-01-15T10:00:00.000Z',
      approved: true,
      reviews: [],
      edits: [],
    };

    useAppStore.getState().setSelectedPlace(mockPlace);
    useAppStore.getState().setSelectedPlace(null);
    expect(useAppStore.getState().selectedPlace).toBeNull();
    expect(useAppStore.getState().sidebarOpen).toBe(false);
  });
});
