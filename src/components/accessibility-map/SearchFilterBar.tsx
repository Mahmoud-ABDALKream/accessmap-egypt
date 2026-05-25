'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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
  const isArabic = language === 'ar';

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

  const hasActiveFilter = (cityFilter && cityFilter !== 'all') || (categoryFilter && categoryFilter !== 'all');

  const clearFilters = () => {
    setSearchQuery('');
    setCityFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div className="px-3 py-2.5" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder', language)}
            className={`${isArabic ? 'pr-9' : 'pl-9'} h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:border-teal-300 rounded-lg`}
            dir={isArabic ? 'rtl' : 'ltr'}
            aria-label={t('searchPlaceholder', language)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 hover:text-gray-500 ${isArabic ? 'left-3' : 'right-3'}`}
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center justify-center h-9 w-9 rounded-lg border text-sm transition-colors shrink-0 ${
            filtersOpen || hasActiveFilter
              ? 'bg-teal-50 border-teal-300 text-teal-600'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        {/* Desktop: City and Category selects inline */}
        <div className="hidden sm:flex items-center gap-2">
          <Select value={cityFilter || 'all'} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[140px] h-9 text-sm rounded-lg border-gray-200" aria-label={t('filterCity', language)}>
              <SelectValue placeholder={t('filterCity', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll', language)}</SelectItem>
              <SelectItem value="alexandria">{t('filterAlexandria', language)}</SelectItem>
              <SelectItem value="cairo">{t('filterCairo', language)}</SelectItem>
              <SelectItem value="giza">{t('filterGiza', language)}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-9 text-sm rounded-lg border-gray-200" aria-label={t('filterCategory', language)}>
              <SelectValue placeholder={t('filterCategory', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll', language)}</SelectItem>
              <SelectItem value="museum">🏛️ {t('filterMuseum', language)}</SelectItem>
              <SelectItem value="monument">🗿 {t('filterMonument', language)}</SelectItem>
              <SelectItem value="mosque">🕌 {t('filterMosque', language)}</SelectItem>
              <SelectItem value="park">🌳 {t('filterPark', language)}</SelectItem>
              <SelectItem value="mall">🛍️ {t('filterMall', language)}</SelectItem>
              <SelectItem value="hotel">🏨 {t('filterHotel', language)}</SelectItem>
              <SelectItem value="market">🏪 {t('filterMarket', language)}</SelectItem>
              <SelectItem value="hospital">🏥 {t('filterHospital', language)}</SelectItem>
              <SelectItem value="cafe">☕ {t('filterCafe', language)}</SelectItem>
              <SelectItem value="school">🏫 {t('filterSchool', language)}</SelectItem>
              <SelectItem value="government">🏛️ {t('filterGovernment', language)}</SelectItem>
              <SelectItem value="transport">🚉 {t('filterTransport', language)}</SelectItem>
              <SelectItem value="entertainment">🎭 {t('filterEntertainment', language)}</SelectItem>
              <SelectItem value="other">📍 {t('filterOther', language)}</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
            >
              {isArabic ? 'مسح الفلاتر' : 'Clear filters'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile: Collapsible filters */}
      {filtersOpen && (
        <div className="flex items-center gap-2 mt-2 sm:hidden">
          <Select value={cityFilter || 'all'} onValueChange={setCityFilter}>
            <SelectTrigger className="flex-1 h-9 text-sm rounded-lg border-gray-200" aria-label={t('filterCity', language)}>
              <SelectValue placeholder={t('filterCity', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll', language)}</SelectItem>
              <SelectItem value="alexandria">{t('filterAlexandria', language)}</SelectItem>
              <SelectItem value="cairo">{t('filterCairo', language)}</SelectItem>
              <SelectItem value="giza">{t('filterGiza', language)}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
            <SelectTrigger className="flex-1 h-9 text-sm rounded-lg border-gray-200" aria-label={t('filterCategory', language)}>
              <SelectValue placeholder={t('filterCategory', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filterAll', language)}</SelectItem>
              <SelectItem value="museum">🏛️ {t('filterMuseum', language)}</SelectItem>
              <SelectItem value="monument">🗿 {t('filterMonument', language)}</SelectItem>
              <SelectItem value="mosque">🕌 {t('filterMosque', language)}</SelectItem>
              <SelectItem value="park">🌳 {t('filterPark', language)}</SelectItem>
              <SelectItem value="mall">🛍️ {t('filterMall', language)}</SelectItem>
              <SelectItem value="hotel">🏨 {t('filterHotel', language)}</SelectItem>
              <SelectItem value="market">🏪 {t('filterMarket', language)}</SelectItem>
              <SelectItem value="hospital">🏥 {t('filterHospital', language)}</SelectItem>
              <SelectItem value="cafe">☕ {t('filterCafe', language)}</SelectItem>
              <SelectItem value="school">🏫 {t('filterSchool', language)}</SelectItem>
              <SelectItem value="government">🏛️ {t('filterGovernment', language)}</SelectItem>
              <SelectItem value="transport">🚉 {t('filterTransport', language)}</SelectItem>
              <SelectItem value="entertainment">🎭 {t('filterEntertainment', language)}</SelectItem>
              <SelectItem value="other">📍 {t('filterOther', language)}</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap shrink-0"
            >
              {isArabic ? 'مسح' : 'Clear'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
