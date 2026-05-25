import { create } from 'zustand';
import type { Language } from './i18n';

export type ViewMode = 'map' | 'submit' | 'stats' | 'about' | 'admin';

export interface PlaceData {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  city: string;
  latitude: number;
  longitude: number;
  overallScore: number;
  rampScore: number;
  elevatorScore: number;
  bathroomScore: number;
  parkingScore: number;
  entranceScore: number;
  reviewText: string;
  photoPath: string;
  submittedAt: string;
  approved: boolean;
  reviews: ReviewData[];
  edits: EditSuggestionData[];
}

export interface ReviewData {
  id: string;
  placeId: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface EditSuggestionData {
  id: string;
  placeId: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  reason: string;
  createdAt: string;
  resolved: boolean;
}

export interface StatsData {
  totalPlaces: number;
  totalReviews: number;
  averageScore: number;
  scoresByCategory: { category: string; avgScore: number; count: number }[];
  recentPlaces: PlaceData[];
}

interface AppState {
  // View
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Places
  places: PlaceData[];
  setPlaces: (places: PlaceData[]) => void;
  fetchPlaces: (filters?: { search?: string; city?: string; category?: string }) => Promise<void>;

  // Selected Place
  selectedPlace: PlaceData | null;
  setSelectedPlace: (place: PlaceData | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;

  // Map position for submit
  submitLat: number | null;
  submitLng: number | null;
  setSubmitCoords: (lat: number | null, lng: number | null) => void;

  // Stats
  stats: StatsData | null;
  fetchStats: () => Promise<void>;

  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Helper to safely parse API response as array
function ensureArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  return [];
}

export const useAppStore = create<AppState>((set, get) => ({
  // View
  currentView: 'map',
  setCurrentView: (view) => set({ currentView: view }),

  // Language
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  // Places
  places: [],
  setPlaces: (places) => set({ places }),
  fetchPlaces: async (filters) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.city) params.set('city', filters.city);
      if (filters?.category) params.set('category', filters.category);
      const res = await fetch(`/api/places?${params.toString()}`);
      if (!res.ok) {
        set({ places: [], isLoading: false });
        return;
      }
      const data = await res.json();
      set({ places: ensureArray<PlaceData>(data), isLoading: false });
    } catch {
      set({ places: [], isLoading: false });
    }
  },

  // Selected Place
  selectedPlace: null,
  setSelectedPlace: (place) => set({ selectedPlace: place, sidebarOpen: !!place }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open, selectedPlace: open ? get().selectedPlace : null }),

  // Filters
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  cityFilter: '',
  setCityFilter: (city) => set({ cityFilter: city }),
  categoryFilter: '',
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  // Map position for submit
  submitLat: null,
  submitLng: null,
  setSubmitCoords: (lat, lng) => set({ submitLat: lat, submitLng: lng }),

  // Stats
  stats: null,
  fetchStats: async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) return;
      const data = await res.json();
      // Ensure the stats object has the correct shape
      if (data && typeof data === 'object' && !data.error) {
        set({
          stats: {
            totalPlaces: data.totalPlaces ?? 0,
            totalReviews: data.totalReviews ?? 0,
            averageScore: data.averageScore ?? 0,
            scoresByCategory: ensureArray(data.scoresByCategory),
            recentPlaces: ensureArray(data.recentPlaces),
          },
        });
      }
    } catch {
      // ignore
    }
  },

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
