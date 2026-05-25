'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function SearchFilterBar() {
  const {
    searchQuery, setSearchQuery,
    cityFilter, setCityFilter,
    categoryFilter, setCategoryFilter,
    fetchPlaces, language,
  } = useAppStore();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const city = cityFilter === 'all' ? '' : cityFilter;
      const category = categoryFilter === 'all' ? '' : categoryFilter;
      fetchPlaces({ search: searchQuery, city, category });
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, cityFilter, categoryFilter, fetchPlaces]);

  const isArabic = language === 'ar';

  return (
    <div className="bg-white border-b border-gray-100" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Search row */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 ${isArabic ? 'right-2.5' : 'left-2.5'}`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder', language)}
            className={`${isArabic ? 'pr-8' : 'pl-8'} h-8 text-xs bg-gray-50 border-gray-100 focus:bg-white`}
            dir={isArabic ? 'rtl' : 'ltr'}
            aria-label={t('searchPlaceholder', language)}
          />
        </div>
        {/* Filter toggle for mobile */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`sm:hidden flex items-center justify-center h-8 w-8 rounded-md border text-xs transition-colors ${
            filtersOpen ? 'bg-teal-50 border-teal-200 text-teal-600' : 'bg-gray-50 border-gray-100 text-gray-500'
          }`}
          aria-label={t('filterCategory', language)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </button>
        {/* Desktop filters */}
        <div className="hidden sm:flex items-center gap-2">
          <Select value={cityFilter || 'all'} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[130px] h-8 text-xs" aria-label={t('filterCity', language)}>
              <SelectValue placeholder={t('filterCity', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll', language)}</SelectItem>
              <SelectItem value="alexandria">{t('filterAlexandria', language)}</SelectItem>
              <SelectItem value="cairo">{t('filterCairo', language)}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px] h-8 text-xs" aria-label={t('filterCategory', language)}>
              <SelectValue placeholder={t('filterCategory', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll', language)}</SelectItem>
              <SelectItem value="mosque">🕌 {t('filterMosque', language)}</SelectItem>
              <SelectItem value="hospital">🏥 {t('filterHospital', language)}</SelectItem>
              <SelectItem value="cafe">☕ {t('filterCafe', language)}</SelectItem>
              <SelectItem value="school">🏫 {t('filterSchool', language)}</SelectItem>
              <SelectItem value="government">🏛️ {t('filterGovernment', language)}</SelectItem>
              <SelectItem value="transport">🚉 {t('filterTransport', language)}</SelectItem>
              <SelectItem value="other">📍 {t('filterOther', language)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile filters (collapsible) */}
      {filtersOpen && (
        <div className="flex items-center gap-2 px-3 pb-2 sm:hidden">
          <Select value={cityFilter || 'all'} onValueChange={setCityFilter}>
            <SelectTrigger className="flex-1 h-8 text-xs" aria-label={t('filterCity', language)}>
              <SelectValue placeholder={t('filterCity', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll', language)}</SelectItem>
              <SelectItem value="alexandria">{t('filterAlexandria', language)}</SelectItem>
              <SelectItem value="cairo">{t('filterCairo', language)}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
            <SelectTrigger className="flex-1 h-8 text-xs" aria-label={t('filterCategory', language)}>
              <SelectValue placeholder={t('filterCategory', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll', language)}</SelectItem>
              <SelectItem value="mosque">🕌 {t('filterMosque', language)}</SelectItem>
              <SelectItem value="hospital">🏥 {t('filterHospital', language)}</SelectItem>
              <SelectItem value="cafe">☕ {t('filterCafe', language)}</SelectItem>
              <SelectItem value="school">🏫 {t('filterSchool', language)}</SelectItem>
              <SelectItem value="government">🏛️ {t('filterGovernment', language)}</SelectItem>
              <SelectItem value="transport">🚉 {t('filterTransport', language)}</SelectItem>
              <SelectItem value="other">📍 {t('filterOther', language)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
