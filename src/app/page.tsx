'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import SearchFilterBar from '@/components/accessibility-map/SearchFilterBar';
import PlaceSidebar from '@/components/accessibility-map/PlaceSidebar';
import SubmitForm from '@/components/accessibility-map/SubmitForm';
import StatsDashboard from '@/components/accessibility-map/StatsDashboard';
import AboutSection from '@/components/accessibility-map/AboutSection';
import AdminSection from '@/components/accessibility-map/AdminSection';
import {
  MapPin,
  PlusCircle,
  BarChart3,
  Info,
  Shield,
  Languages,
  Accessibility,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/accessibility-map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Accessibility className="h-10 w-10 text-teal-400 mx-auto mb-2 animate-pulse" />
        <p className="text-gray-400 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const {
    currentView, setCurrentView,
    language, setLanguage,
    fetchPlaces,
    places,
  } = useAppStore();
  const isArabic = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch places on mount
  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Check for place ID in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const placeId = params.get('place');
    if (placeId) {
      fetch(`/api/places/${placeId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            useAppStore.getState().setSelectedPlace(data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const navItems = [
    { view: 'map' as const, icon: MapPin, label: t('navMap', language) },
    { view: 'submit' as const, icon: PlusCircle, label: t('navSubmit', language) },
    { view: 'stats' as const, icon: BarChart3, label: t('navStats', language) },
    { view: 'about' as const, icon: Info, label: t('navAbout', language) },
    { view: 'admin' as const, icon: Shield, label: t('navAdmin', language) },
  ];

  return (
    <div className="h-dvh flex flex-col bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shrink-0">
        <div className="flex items-center justify-between px-4 h-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-sm shadow-teal-200">
              <Accessibility className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-gray-800 tracking-tight">
                {t('appName', language)}
              </span>
              <span className="block text-[9px] text-gray-400 -mt-0.5 font-medium">
                {t('appTagline', language)}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 bg-gray-50/80 rounded-xl p-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center gap-1.5 text-xs h-8 px-3 rounded-lg transition-all duration-200 ${
                  currentView === item.view
                    ? 'bg-white text-teal-700 font-semibold shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 text-xs h-8 px-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
              aria-label={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            >
              <Languages className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-600">{language === 'en' ? 'عربي' : 'EN'}</span>
            </button>
            <button
              className="md:hidden h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4 text-gray-600" /> : <Menu className="h-4 w-4 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-3 py-2 shadow-lg" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    setCurrentView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 text-sm h-10 px-3 rounded-xl transition-colors ${
                    currentView === item.view
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {/* Map View */}
        {currentView === 'map' && (
          <div className="h-full flex flex-col">
            {/* Search & Filter Bar - always visible at top */}
            <div className="shrink-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
              <SearchFilterBar />
            </div>
            {/* Map takes remaining space */}
            <div className="flex-1 relative">
              <MapView />
              {/* Places count badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
                <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-4 py-1.5 text-xs text-gray-600 font-medium border border-gray-200">
                  {places.length} {language === 'en' ? 'places on map' : 'مكان على الخريطة'}
                </div>
              </div>
            </div>
            <PlaceSidebar />
          </div>
        )}

        {/* Submit View */}
        {currentView === 'submit' && (
          <div className="h-full overflow-y-auto">
            <SubmitForm />
          </div>
        )}

        {/* Stats View */}
        {currentView === 'stats' && (
          <div className="h-full overflow-y-auto">
            <StatsDashboard />
          </div>
        )}

        {/* About View */}
        {currentView === 'about' && (
          <div className="h-full overflow-y-auto">
            <AboutSection />
          </div>
        )}

        {/* Admin View */}
        {currentView === 'admin' && (
          <div className="h-full overflow-y-auto">
            <AdminSection />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex items-center justify-around border-t border-gray-100 bg-white/95 backdrop-blur-md h-14 shrink-0 safe-area-bottom" role="navigation" aria-label="Bottom navigation">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 ${
              currentView === item.view
                ? 'text-teal-600'
                : 'text-gray-400 active:text-gray-600'
            }`}
            aria-label={item.label}
            aria-current={currentView === item.view ? 'page' : undefined}
          >
            <div className={`p-1 rounded-lg transition-all duration-200 ${
              currentView === item.view ? 'bg-teal-50' : ''
            }`}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className={`text-[10px] leading-tight ${
              currentView === item.view ? 'font-semibold' : 'font-medium'
            }`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gray-50/80 border-t border-gray-100 py-2 px-4 text-center shrink-0">
        <p className="text-[11px] text-gray-400">
          {t('appName', language)} &middot; {t('appTagline', language)}
        </p>
      </footer>
    </div>
  );
}
