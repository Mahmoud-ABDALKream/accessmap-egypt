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
      const data = await res.json();
      set({ places: data, isLoading: false });
    } catch {
      set({ isLoading: false });
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
      const data = await res.json();
      set({ stats: data });
    } catch {
      // ignore
    }
  },

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
