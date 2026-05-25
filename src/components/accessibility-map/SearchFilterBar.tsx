'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function SearchFilterBar() {
  const {
    searchQuery, setSearchQuery,
    cityFilter, setCityFilter,
    categoryFilter, setCategoryFilter,
    fetchPlaces, language,
  } = useAppStore();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    <div
      className="flex flex-col sm:flex-row gap-2 p-3 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative flex-1">
        <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder', language)}
          className={`${isArabic ? 'pr-10' : 'pl-10'} h-10`}
          dir={isArabic ? 'rtl' : 'ltr'}
          aria-label={t('searchPlaceholder', language)}
        />
      </div>
      <Select value={cityFilter || 'all'} onValueChange={setCityFilter}>
        <SelectTrigger className="w-full sm:w-[160px] h-10" aria-label={t('filterCity', language)}>
          <SelectValue placeholder={t('filterCity', language)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filterAll', language)}</SelectItem>
          <SelectItem value="alexandria">{t('filterAlexandria', language)}</SelectItem>
          <SelectItem value="cairo">{t('filterCairo', language)}</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full sm:w-[160px] h-10" aria-label={t('filterCategory', language)}>
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
  );
}
