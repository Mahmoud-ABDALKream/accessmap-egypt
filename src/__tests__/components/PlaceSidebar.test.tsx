import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { server } from '../mocks/server';
import { useAppStore, type PlaceData } from '@/lib/store';
import PlaceSidebar from '@/components/accessibility-map/PlaceSidebar';

const mockPlace: PlaceData = {
  id: 'test-1',
  name: 'Test Museum',
  nameAr: 'متحف الاختبار',
  category: 'museum',
  city: 'cairo',
  latitude: 30.0478,
  longitude: 31.2336,
  overallScore: 4.2,
  rampScore: 5,
  elevatorScore: 4,
  bathroomScore: 4,
  parkingScore: 4,
  entranceScore: 4,
  reviewText: 'A great accessible museum.',
  photoPath: '',
  submittedAt: '2024-01-15T10:00:00.000Z',
  approved: true,
  reviews: [
    {
      id: 'review-1',
      placeId: 'test-1',
      text: 'Wonderful experience',
      rating: 5,
      createdAt: '2024-01-16T10:00:00.000Z',
    },
    {
      id: 'review-2',
      placeId: 'test-1',
      text: 'Good but could improve',
      rating: 3,
      createdAt: '2024-01-17T10:00:00.000Z',
    },
  ],
  edits: [],
};

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PlaceSidebar', () => {
  it('renders nothing when no place is selected', () => {
    useAppStore.setState({
      selectedPlace: null,
      sidebarOpen: false,
      language: 'en',
    });

    const { container } = render(<PlaceSidebar />);
    expect(container.innerHTML).toBe('');
  });

  it('renders place name when a place is selected', () => {
    useAppStore.setState({
      selectedPlace: mockPlace,
      sidebarOpen: true,
      language: 'en',
    });

    render(<PlaceSidebar />);
    // Component renders both mobile + desktop versions, so use getAllBy
    const names = screen.getAllByText('Test Museum');
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Arabic name when language is Arabic', () => {
    useAppStore.setState({
      selectedPlace: mockPlace,
      sidebarOpen: true,
      language: 'ar',
    });

    render(<PlaceSidebar />);
    const names = screen.getAllByText('متحف الاختبار');
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  it('displays overall score', () => {
    useAppStore.setState({
      selectedPlace: mockPlace,
      sidebarOpen: true,
      language: 'en',
    });

    render(<PlaceSidebar />);
    // Score appears in mobile and desktop views
    const scores = screen.getAllByText('4.2');
    expect(scores.length).toBeGreaterThanOrEqual(1);
  });

  it('displays reviews count', () => {
    useAppStore.setState({
      selectedPlace: mockPlace,
      sidebarOpen: true,
      language: 'en',
    });

    render(<PlaceSidebar />);
    const reviewsLabels = screen.getAllByText(/Reviews/);
    expect(reviewsLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('displays review text', () => {
    useAppStore.setState({
      selectedPlace: mockPlace,
      sidebarOpen: true,
      language: 'en',
    });

    render(<PlaceSidebar />);
    // Reviews appear in both mobile and desktop views
    const wonderfulReviews = screen.getAllByText('Wonderful experience');
    expect(wonderfulReviews.length).toBeGreaterThanOrEqual(1);

    const improveReviews = screen.getAllByText('Good but could improve');
    expect(improveReviews.length).toBeGreaterThanOrEqual(1);
  });

  it('shows city name', () => {
    useAppStore.setState({
      selectedPlace: mockPlace,
      sidebarOpen: true,
      language: 'en',
    });

    render(<PlaceSidebar />);
    const cityNames = screen.getAllByText('Cairo');
    expect(cityNames.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Get Directions link', () => {
    useAppStore.setState({
      selectedPlace: mockPlace,
      sidebarOpen: true,
      language: 'en',
    });

    render(<PlaceSidebar />);
    const directionsLinks = screen.getAllByText('Get Directions');
    expect(directionsLinks.length).toBeGreaterThanOrEqual(1);
    // Verify at least one has the correct Google Maps link
    const firstLink = directionsLinks[0].closest('a');
    expect(firstLink).toHaveAttribute(
      'href',
      'https://www.google.com/maps/dir/?api=1&destination=30.0478,31.2336'
    );
  });

  it('renders accessibility breakdown labels', () => {
    useAppStore.setState({
      selectedPlace: mockPlace,
      sidebarOpen: true,
      language: 'en',
    });

    render(<PlaceSidebar />);
    // These labels appear in both mobile and desktop
    expect(screen.getAllByText('Entrance Ramp').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Elevator').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Accessible Bathroom').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Accessible Parking').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Wide Doorways').length).toBeGreaterThanOrEqual(1);
  });
});
