'use client';

import { useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { t, type Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchFilterBar from '@/components/accessibility-map/SearchFilterBar';
import PlaceSidebar from '@/components/accessibility-map/PlaceSidebar';
import SubmitForm from '@/components/accessibility-map/SubmitForm';
import StatsDashboard from '@/components/accessibility-map/StatsDashboard';
import AboutSection from '@/components/accessibility-map/AboutSection';
import AdminSection from '@/components/accessibility-map/AdminSection';
import {
  Map,
  PlusCircle,
  BarChart3,
  Info,
  Shield,
  Languages,
  Accessibility,
  Menu,
  X,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/accessibility-map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Accessibility className="h-12 w-12 text-teal-400 mx-auto mb-2 animate-pulse" />
        <p className="text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

function LanguageToggle() {
  const { language, setLanguage } = useAppStore();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="gap-1 text-sm font-medium"
      aria-label={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
    >
      <Languages className="h-4 w-4" />
      {language === 'en' ? 'عربي' : 'EN'}
    </Button>
  );
}

export default function Home() {
  const {
    currentView, setCurrentView,
    language, setLanguage,
    fetchPlaces,
    places,
    sidebarOpen, setSidebarOpen,
  } = useAppStore();
  const { toast } = useToast();
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
    { view: 'map' as const, icon: Map, label: t('navMap', language) },
    { view: 'submit' as const, icon: PlusCircle, label: t('navSubmit', language) },
    { view: 'stats' as const, icon: BarChart3, label: t('navStats', language) },
    { view: 'about' as const, icon: Info, label: t('navAbout', language) },
    { view: 'admin' as const, icon: Shield, label: t('navAdmin', language) },
  ];

  return (
    <div className="min-h-screen flex flex-col" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-50 sticky top-0">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Accessibility className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-teal-700 hidden sm:block">
              {t('appName', language)}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Button
                key={item.view}
                variant={currentView === item.view ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView(item.view)}
                className={`gap-1.5 ${
                  currentView === item.view
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right side: Language toggle + Mobile menu */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-100 bg-white px-2 py-2" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.view}
                  variant={currentView === item.view ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setCurrentView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`justify-start gap-2 ${
                    currentView === item.view
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Map View */}
        {currentView === 'map' && (
          <div className="flex-1 flex flex-col relative">
            <SearchFilterBar />
            <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 112px)' }}>
              <MapView />
              {/* Places count badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
                <Badge
                  variant="secondary"
                  className="bg-white/95 backdrop-blur-sm shadow-lg px-4 py-2 text-sm"
                >
                  {places.length} {language === 'en' ? 'places' : 'مكان'}
                </Badge>
              </div>
            </div>
            <PlaceSidebar />
          </div>
        )}

        {/* Other Views */}
        {currentView === 'submit' && (
          <div className="flex-1">
            <div className="relative" style={{ height: '200px' }}>
              <MapView />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>
            <SubmitForm />
          </div>
        )}

        {currentView === 'stats' && (
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 'calc(100vh - 112px)' }}>
            <StatsDashboard />
          </div>
        )}

        {currentView === 'about' && (
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 'calc(100vh - 112px)' }}>
            <AboutSection />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 'calc(100vh - 112px)' }}>
            <AdminSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-3 px-4 text-center">
        <p className="text-xs text-gray-400">
          {t('appName', language)} — {t('appTagline', language)}
        </p>
      </footer>
    </div>
  );
}
