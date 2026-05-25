'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/lib/i18n';
import SearchFilterBar from '@/components/accessibility-map/SearchFilterBar';
import PlacesListPanel from '@/components/accessibility-map/PlacesListPanel';
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
  const [listPanelCollapsed, setListPanelCollapsed] = useState(false);

  // Sync HTML lang/dir attributes with language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [language, isArabic]);

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
    <ErrorBoundary>
    <div className="h-dvh flex flex-col bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="header-gradient border-b border-gray-200/60 z-50 shrink-0">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/favicon-1024.jpg"
              alt="AccessMap Egypt"
              width={36}
              height={36}
              className="rounded-xl shadow-md shadow-teal-200/50"
              priority
            />
            <div className="hidden sm:block">
              <span className="text-base font-bold text-gray-800 tracking-tight">
                {t('appName', language)}
              </span>
              <span className="block text-[10px] text-gray-400 -mt-0.5 font-medium">
                {t('appTagline', language)}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 rounded-xl p-1 border border-gray-200/50" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center gap-2 text-sm h-9 px-4 rounded-lg transition-all duration-200 ${
                  currentView === item.view
                    ? 'bg-white text-teal-700 font-semibold shadow-sm border border-teal-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 text-sm h-9 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              aria-label={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            >
              <Languages className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{language === 'en' ? 'عربي' : 'EN'}</span>
            </button>
            <button
              className="md:hidden h-9 w-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
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
                  className={`flex items-center gap-3 text-sm h-11 px-4 rounded-xl transition-colors ${
                    currentView === item.view
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {/* Map View — Professional split layout */}
        {currentView === 'map' && (
          <div className="h-full flex flex-col md:flex-row">
            {/* Desktop: Left Panel with Places List */}
            <PlacesListPanel
              collapsed={listPanelCollapsed}
              onToggleCollapse={() => setListPanelCollapsed(!listPanelCollapsed)}
            />

            {/* Map Area */}
            <div className="flex-1 relative">
              {/* Mobile: Search bar at top */}
              <div className="md:hidden shrink-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
                <SearchFilterBar />
              </div>

              <div className="h-full relative">
                <MapView />

                {/* Mobile: Places count badge */}
                <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
                  <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 text-xs text-gray-600 font-medium border border-gray-200 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-teal-500" />
                    {places.length} {language === 'en' ? 'places' : 'مكان'}
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Sidebar */}
            <PlaceSidebar />
          </div>
        )}

        {/* Submit View */}
        {currentView === 'submit' && (
          <div className="h-full overflow-y-auto view-fade-in">
            <SubmitForm />
          </div>
        )}

        {/* Stats View */}
        {currentView === 'stats' && (
          <div className="h-full overflow-y-auto view-fade-in">
            <StatsDashboard />
          </div>
        )}

        {/* About View */}
        {currentView === 'about' && (
          <div className="h-full overflow-y-auto view-fade-in">
            <AboutSection />
          </div>
        )}

        {/* Admin View */}
        {currentView === 'admin' && (
          <div className="h-full overflow-y-auto view-fade-in">
            <AdminSection />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex items-center justify-around border-t border-gray-200 bg-white/95 backdrop-blur-md h-16 shrink-0 safe-area-bottom shadow-[0_-1px_3px_rgba(0,0,0,0.05)]" role="navigation" aria-label="Bottom navigation">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 ${
              currentView === item.view
                ? 'text-teal-600'
                : 'text-gray-400 active:text-gray-600'
            }`}
            aria-label={item.label}
            aria-current={currentView === item.view ? 'page' : undefined}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${
              currentView === item.view ? 'bg-teal-50' : ''
            }`}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className={`text-[10px] leading-tight ${
              currentView === item.view ? 'font-bold' : 'font-medium'
            }`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gradient-to-r from-gray-50 to-teal-50/30 border-t border-gray-100 py-3 px-4 shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon-1024.jpg"
              alt="AccessMap Egypt"
              width={24}
              height={24}
              className="rounded-lg"
            />
            <div>
              <p className="text-xs font-semibold text-gray-700 leading-tight">
                {t('appName', language)}
              </p>
              <p className="text-[10px] text-gray-400">{t('footerTagline', language)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-gray-400">{t('footerBuiltBy', language)}</p>
            <span className="text-[10px] text-gray-300">•</span>
            <p className="text-[10px] text-gray-400">{t('footerCopyright', language)}</p>
            <span className="text-[10px] text-gray-300">•</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-teal-600 font-medium bg-teal-50 px-1.5 py-0.5 rounded">
              {t('footerVersion', language)}
            </span>
          </div>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
}
