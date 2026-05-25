'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { MapPin, BarChart3, MessageSquare, TrendingUp, Clock, ChevronLeft } from 'lucide-react';

function getScoreColor(score: number): string {
  if (score >= 4) return 'text-green-600';
  if (score >= 2.5) return 'text-yellow-600';
  return 'text-red-500';
}

function getScoreBg(score: number): string {
  if (score >= 4) return 'bg-green-500';
  if (score >= 2.5) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'museum': return '🏛️';
    case 'monument': return '🗿';
    case 'mosque': return '🕌';
    case 'park': return '🌳';
    case 'mall': return '🛍️';
    case 'hotel': return '🏨';
    case 'market': return '🏪';
    case 'hospital': return '🏥';
    case 'cafe': return '☕';
    case 'school': return '🏫';
    case 'government': return '🏛️';
    case 'transport': return '🚉';
    case 'entertainment': return '🎭';
    default: return '📍';
  }
}

function getCityName(city: string, lang: 'en' | 'ar') {
  if (city === 'alexandria') return lang === 'ar' ? 'الإسكندرية' : 'Alexandria';
  if (city === 'cairo') return lang === 'ar' ? 'القاهرة' : 'Cairo';
  if (city === 'giza') return lang === 'ar' ? 'الجيزة' : 'Giza';
  return city;
}

export default function StatsDashboard() {
  const { stats, fetchStats, language, setCurrentView } = useAppStore();
  const isArabic = language === 'ar';

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]" dir={isArabic ? 'rtl' : 'ltr'}>
        <p className="text-sm text-gray-400">{t('loading', language)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-8" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Back button */}
      <button
        onClick={() => setCurrentView('map')}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-teal-600 mb-4 transition-colors"
      >
        <ChevronLeft className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
        {t('navMap', language)}
      </button>

      <h1 className="text-xl font-bold text-gray-800 mb-5">{t('statsTitle', language)}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-teal-50 rounded-xl p-4 text-center">
          <MapPin className="h-5 w-5 text-teal-500 mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-gray-800">{stats.totalPlaces}</p>
          <p className="text-[11px] text-gray-500">{t('statsTotalPlaces', language)}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <MessageSquare className="h-5 w-5 text-green-500 mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-gray-800">{stats.totalReviews}</p>
          <p className="text-[11px] text-gray-500">{t('statsTotalReviews', language)}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <TrendingUp className="h-5 w-5 text-amber-500 mx-auto mb-1.5" />
          <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore.toFixed(1)}
          </p>
          <p className="text-[11px] text-gray-500">{t('statsAvgScore', language)}</p>
        </div>
      </div>

      {/* Score by Category */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-teal-500" />
          {t('statsByCategory', language)}
        </p>
        {stats.scoresByCategory && stats.scoresByCategory.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {stats.scoresByCategory.map((item) => (
              <div key={item.category} className="flex items-center gap-3 px-4 py-3">
                <span className="text-lg">{getCategoryIcon(item.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {t(`filter${item.category.charAt(0).toUpperCase() + item.category.slice(1)}` as keyof typeof import('@/lib/i18n').translations.en, language)}
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(item.avgScore)}`}>
                      {item.avgScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreBg(item.avgScore)}`}
                      style={{ width: `${(item.avgScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">{t('statsNoData', language)}</p>
        )}
      </div>

      {/* Recent Places */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-teal-500" />
          {t('statsRecentPlaces', language)}
        </p>
        {stats.recentPlaces && stats.recentPlaces.length > 0 ? (
          <div className="space-y-2">
            {stats.recentPlaces.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => {
                  useAppStore.getState().setSelectedPlace(place);
                  setCurrentView('map');
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-base">{getCategoryIcon(place.category)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {isArabic && place.nameAr ? place.nameAr : place.name}
                    </p>
                    <span className="text-[11px] text-gray-400">
                      {getCityName(place.city, language)}
                    </span>
                  </div>
                </div>
                <div className={`text-sm font-bold ${getScoreColor(place.overallScore)}`}>
                  {place.overallScore.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">{t('statsNoData', language)}</p>
        )}
      </div>
    </div>
  );
}
