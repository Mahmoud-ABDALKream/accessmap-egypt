'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useAppStore, type PlaceData } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
  List,
  Filter,
  Accessibility,
} from 'lucide-react';

// ─── Props ───────────────────────────────────────────────────────────────────

interface PlacesListPanelProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

// ─── Category icon helper ────────────────────────────────────────────────────

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    museum: '🏛️',
    monument: '🗿',
    mosque: '🕌',
    park: '🌳',
    mall: '🛍️',
    hotel: '🏨',
    market: '🏪',
    hospital: '🏥',
    cafe: '☕',
    school: '🏫',
    government: '🏛️',
    transport: '🚉',
    entertainment: '🎭',
    other: '📍',
  };
  return icons[category] || '📍';
}

// ─── City name helper ────────────────────────────────────────────────────────

function getCityName(city: string, lang: 'en' | 'ar'): string {
  const names: Record<string, { en: string; ar: string }> = {
    alexandria: { en: 'Alexandria', ar: 'الإسكندرية' },
    cairo: { en: 'Cairo', ar: 'القاهرة' },
    giza: { en: 'Giza', ar: 'الجيزة' },
  };
  return names[city]?.[lang] ?? city;
}

// ─── Score color helpers ─────────────────────────────────────────────────────

function getScoreBadgeClasses(score: number): string {
  if (score >= 4) return 'bg-green-50 text-green-700 border-green-200';
  if (score >= 2.5) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-600 border-red-200';
}

function getScoreBarColor(score: number): string {
  if (score >= 4) return 'bg-green-500';
  if (score >= 2.5) return 'bg-amber-400';
  return 'bg-red-400';
}

// ─── Filter categories & cities ──────────────────────────────────────────────

const FILTER_CATEGORIES = [
  'all',
  'museum',
  'monument',
  'mosque',
  'park',
  'mall',
  'hotel',
  'market',
  'hospital',
  'cafe',
  'school',
  'government',
  'transport',
  'entertainment',
  'other',
] as const;

const FILTER_CITIES = ['all', 'alexandria', 'cairo', 'giza'] as const;

// ─── Category translation key helper ─────────────────────────────────────────

function getCategoryKey(cat: string): string {
  const map: Record<string, string> = {
    all: 'filterAll',
    museum: 'filterMuseum',
    monument: 'filterMonument',
    mosque: 'filterMosque',
    park: 'filterPark',
    mall: 'filterMall',
    hotel: 'filterHotel',
    market: 'filterMarket',
    hospital: 'filterHospital',
    cafe: 'filterCafe',
    school: 'filterSchool',
    government: 'filterGovernment',
    transport: 'filterTransport',
    entertainment: 'filterEntertainment',
    other: 'filterOther',
  };
  return map[cat] || 'filterOther';
}

function getCityKey(city: string): string {
  const map: Record<string, string> = {
    all: 'filterAll',
    alexandria: 'filterAlexandria',
    cairo: 'filterCairo',
    giza: 'filterGiza',
  };
  return map[city] || 'filterAll';
}

// ─── Mini accessibility bar ──────────────────────────────────────────────────

function MiniScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={`${label}: ${score}/5`}>
      <span className="text-[10px] text-gray-400 min-w-[16px] truncate">{label}</span>
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getScoreBarColor(score)}`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Place card ──────────────────────────────────────────────────────────────

function PlaceCard({
  place,
  isSelected,
  onClick,
  language,
}: {
  place: PlaceData;
  isSelected: boolean;
  onClick: () => void;
  language: 'en' | 'ar';
}) {
  const isArabic = language === 'ar';
  const displayName = isArabic && place.nameAr ? place.nameAr : place.name;
  const secondaryName =
    isArabic
      ? place.name
      : place.nameAr || '';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl p-3 transition-all duration-200 border group ${
        isSelected
          ? 'border-teal-400 bg-teal-50/60 shadow-sm shadow-teal-100'
          : 'border-transparent bg-white hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
      }`}
      aria-pressed={isSelected}
      aria-label={`${displayName} — ${place.overallScore.toFixed(1)} stars`}
    >
      {/* Top row: emoji + name + score */}
      <div className="flex items-start gap-2.5">
        <span className="text-xl shrink-0 mt-0.5">{getCategoryIcon(place.category)}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {displayName}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold border ${getScoreBadgeClasses(place.overallScore)}`}
            >
              {place.overallScore.toFixed(1)}
            </span>
          </div>

          {/* Secondary name (Arabic/English) */}
          {secondaryName && secondaryName !== displayName && (
            <p className="text-[11px] text-gray-400 truncate mt-0.5" dir={isArabic ? 'ltr' : 'rtl'}>
              {secondaryName}
            </p>
          )}

          {/* City badge */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <Badge variant="outline" className="text-[10px] gap-1 h-4 px-1.5 font-normal">
              <MapPin className="h-2.5 w-2.5" />
              {getCityName(place.city, language)}
            </Badge>
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal capitalize">
              {t(getCategoryKey(place.category) as keyof typeof import('@/lib/i18n').translations.en, language)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Mini accessibility bars */}
      <div className="mt-2.5 space-y-1 pl-[32px]">
        <MiniScoreBar score={place.rampScore} label={isArabic ? 'رامب' : 'Ramp'} />
        <MiniScoreBar score={place.elevatorScore} label={isArabic ? 'مصعد' : 'Elev'} />
        <MiniScoreBar score={place.bathroomScore} label={isArabic ? 'حمام' : 'Bath'} />
        <MiniScoreBar score={place.parkingScore} label={isArabic ? 'موقف' : 'Park'} />
        <MiniScoreBar score={place.entranceScore} label={isArabic ? 'باب' : 'Door'} />
      </div>
    </button>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function PlacesListPanel({ collapsed, onToggleCollapse }: PlacesListPanelProps) {
  const {
    places,
    selectedPlace,
    searchQuery,
    setSearchQuery,
    cityFilter,
    setCityFilter,
    categoryFilter,
    setCategoryFilter,
    fetchPlaces,
    language,
    setSelectedPlace,
  } = useAppStore();

  const isArabic = language === 'ar';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced fetch
  const debouncedFetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const city = cityFilter === 'all' ? '' : cityFilter;
      const category = categoryFilter === 'all' ? '' : categoryFilter;
      fetchPlaces({ search: searchQuery, city, category });
    }, 300);
  }, [searchQuery, cityFilter, categoryFilter, fetchPlaces]);

  // Trigger fetch when filters change
  useEffect(() => {
    debouncedFetch();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedFetch]);

  const hasActiveFilter =
    (cityFilter && cityFilter !== 'all') ||
    (categoryFilter && categoryFilter !== 'all') ||
    searchQuery.length > 0;

  const clearFilters = () => {
    setSearchQuery('');
    setCityFilter('all');
    setCategoryFilter('all');
  };

  const handlePlaceClick = (place: PlaceData) => {
    if (selectedPlace?.id === place.id) {
      setSelectedPlace(null);
    } else {
      setSelectedPlace(place);
    }
  };

  // Don't render on mobile
  return (
    <div className="hidden md:block" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toggle button — visible when panel is collapsed */}
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-3 z-[999] bg-white hover:bg-gray-50 shadow-lg rounded-lg p-2 border border-gray-200 transition-all duration-200 hover:shadow-xl"
          style={{ [isArabic ? 'right' : 'left']: '12px' }}
          aria-label={isArabic ? 'فتح لوحة الأماكن' : 'Open places panel'}
        >
          <List className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Panel */}
      <div
        className={`h-full bg-white border-${
          isArabic ? 'l' : 'r'
        } border-gray-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          collapsed ? 'w-0' : 'w-[360px]'
        }`}
        role="complementary"
        aria-label={isArabic ? 'قائمة الأماكن' : 'Places list'}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="shrink-0 border-b border-gray-100">
          {/* Title row */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src="/favicon-1024.png"
                alt="AccessMap Egypt"
                width={28}
                height={28}
                className="rounded-lg shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-800 truncate">
                  {t('appName', language)}
                </h2>
                <p className="text-[10px] text-gray-400">
                  {places.length}{' '}
                  {isArabic ? 'مكان' : places.length === 1 ? 'place' : 'places'}
                </p>
              </div>
            </div>
            <button
              onClick={onToggleCollapse}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
              aria-label={isArabic ? 'إغلاق اللوحة' : 'Collapse panel'}
            >
              {isArabic ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* ── Search ──────────────────────────────────────────── */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${
                  isArabic ? 'right-3' : 'left-3'
                }`}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder', language)}
                className={`${isArabic ? 'pr-9' : 'pl-9'} h-9 text-sm bg-gray-50/80 border-gray-200 focus:bg-white focus:border-teal-300 focus:ring-1 focus:ring-teal-200 rounded-xl transition-all`}
                dir={isArabic ? 'rtl' : 'ltr'}
                aria-label={t('searchPlaceholder', language)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 hover:text-gray-500 transition-colors ${
                    isArabic ? 'left-3' : 'right-3'
                  }`}
                  aria-label={isArabic ? 'مسح البحث' : 'Clear search'}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ── Filters row ─────────────────────────────────────── */}
          <div className="px-3 pb-3 flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />

            <Select value={cityFilter || 'all'} onValueChange={setCityFilter}>
              <SelectTrigger
                className="flex-1 h-8 text-xs rounded-xl border-gray-200 bg-gray-50/80 focus:ring-1 focus:ring-teal-200"
                aria-label={t('filterCity', language)}
              >
                <SelectValue placeholder={t('filterCity', language)} />
              </SelectTrigger>
              <SelectContent>
                {FILTER_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {t(getCityKey(city) as keyof typeof import('@/lib/i18n').translations.en, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
              <SelectTrigger
                className="flex-1 h-8 text-xs rounded-xl border-gray-200 bg-gray-50/80 focus:ring-1 focus:ring-teal-200"
                aria-label={t('filterCategory', language)}
              >
                <SelectValue placeholder={t('filterCategory', language)} />
              </SelectTrigger>
              <SelectContent>
                {FILTER_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all'
                      ? t('filterAll', language)
                      : `${getCategoryIcon(cat)} ${t(getCategoryKey(cat) as keyof typeof import('@/lib/i18n').translations.en, language)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="shrink-0 h-8 px-2 text-[11px] text-teal-600 hover:text-teal-700 hover:bg-teal-50 font-medium"
              >
                {isArabic ? 'مسح' : 'Clear'}
              </Button>
            )}
          </div>
        </div>

        {/* ── Scrollable places list ────────────────────────────── */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {places.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  {isArabic ? 'لا توجد أماكن' : 'No places found'}
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  {isArabic
                    ? 'جرّب تغيير عوامل التصفية'
                    : 'Try adjusting your filters'}
                </p>
              </div>
            )}

            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSelected={selectedPlace?.id === place.id}
                onClick={() => handlePlaceClick(place)}
                language={language}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
