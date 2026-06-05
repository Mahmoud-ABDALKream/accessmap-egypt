import '@testing-library/jest-dom/vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock Leaflet — it requires a DOM with window/document
vi.mock('leaflet', () => {
  const mockMap = {
    setView: vi.fn().mockReturnThis(),
    addLayer: vi.fn().mockReturnThis(),
    removeLayer: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    flyTo: vi.fn().mockReturnThis(),
    getCenter: vi.fn(() => ({ lat: 31.2, lng: 29.9 })),
    getZoom: vi.fn(() => 12),
    invalidateSize: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  };
  const mockLayerGroup = {
    addLayer: vi.fn().mockReturnThis(),
    removeLayer: vi.fn().mockReturnThis(),
    clearLayers: vi.fn().mockReturnThis(),
  };
  return {
    map: vi.fn(() => mockMap),
    tileLayer: vi.fn(() => ({ addTo: vi.fn().mockReturnThis() })),
    marker: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
      setIcon: vi.fn().mockReturnThis(),
    })),
    divIcon: vi.fn(() => ({})),
    icon: vi.fn(() => ({})),
    layerGroup: vi.fn(() => mockLayerGroup),
    markerClusterGroup: vi.fn(() => mockLayerGroup),
    latLngBounds: vi.fn(() => ({
      extend: vi.fn().mockReturnThis(),
    })),
    control: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
    })),
  };
});

vi.mock('leaflet.markercluster', () => ({}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="marker" />,
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    setView: vi.fn(),
    flyTo: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    getCenter: vi.fn(() => ({ lat: 31.2, lng: 29.9 })),
    getZoom: vi.fn(() => 12),
    invalidateSize: vi.fn(),
    on: vi.fn(),
  }),
  useMapEvents: () => ({
    setView: vi.fn(),
    flyTo: vi.fn(),
  }),
}));
