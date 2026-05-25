'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { MapPin, BarChart3, MessageSquare, TrendingUp, Clock, ChevronLeft, Trophy } from 'lucide-react';

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

function getMedalStyle(index: number) {
  switch (index) {
    case 0: return { border: 'border-yellow-400', bg: 'bg-yellow-50', badge: 'bg-yellow-400 text-yellow-900', label: '🥇' };
    case 1: return { border: 'border-gray-300', bg: 'bg-gray-50', badge: 'bg-gray-300 text-gray-700', label: '🥈' };
    case 2: return { border: 'border-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-600 text-white', label: '🥉' };
    default: return { border: 'border-gray-200', bg: 'bg-white', badge: 'bg-gray-200 text-gray-600', label: '' };
  }
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

  const topPlaces = [...(stats.recentPlaces || [])]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);

  return (
    <div className="view-fade-in max-w-4xl mx-auto p-4 pb-8" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Professional Header */}
      <div className="mb-6">
        <button
          onClick={() => setCurrentView('map')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-600 mb-4 transition-colors group"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-0.5 ${isArabic ? 'rotate-180' : ''}`} />
          {t('navMap', language)}
        </button>
        <h1 className="text-2xl font-bold text-gray-800 pb-2 relative">
          {t('statsTitle', language)}
          <span className="absolute bottom-0 left-0 h-1 w-24 rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-green-400" />
        </h1>
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card relative overflow-hidden bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-400 to-teal-600" />
          <MapPin className="h-8 w-8 text-teal-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-800">{stats.totalPlaces}</p>
          <p className="text-sm text-gray-500 mt-1">{t('statsTotalPlaces', language)}</p>
        </div>
        <div className="stat-card relative overflow-hidden bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-green-400 to-green-600" />
          <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-800">{stats.totalReviews}</p>
          <p className="text-sm text-gray-500 mt-1">{t('statsTotalReviews', language)}</p>
        </div>
        <div className="stat-card relative overflow-hidden bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
          <TrendingUp className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <p className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore.toFixed(1)}
          </p>
          <p className="text-sm text-gray-500 mt-1">{t('statsAvgScore', language)}</p>
        </div>
      </div>

      {/* Top Accessible Places */}
      {topPlaces.length > 0 && (
        <div className="mb-8">
          <p className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {isArabic ? 'أكثر الأماكن سهولة' : 'Top Accessible Places'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topPlaces.map((place, index) => {
              const medal = getMedalStyle(index);
              return (
                <div
                  key={place.id}
                  className={`relative bg-white rounded-xl border-2 ${medal.border} p-4 hover:shadow-lg transition-all cursor-pointer group`}
                  onClick={() => {
                    useAppStore.getState().setSelectedPlace(place);
                    setCurrentView('map');
                  }}
                >
                  <div className="absolute -top-2.5 -right-2.5 text-2xl z-10">{medal.label}</div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getCategoryIcon(place.category)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-teal-700 transition-colors">
                        {isArabic && place.nameAr ? place.nameAr : place.name}
                      </p>
                      <span className="text-xs text-gray-400">{getCityName(place.city, language)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getScoreBg(place.overallScore)}`}
                        style={{ width: `${(place.overallScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`ml-3 text-sm font-bold ${getScoreColor(place.overallScore)} ${isArabic ? 'mr-3 ml-0' : ''}`}>
                      {place.overallScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Score by Category */}
      <div className="mb-8">
        <p className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-teal-500" />
          {t('statsByCategory', language)}
        </p>
        {stats.scoresByCategory && stats.scoresByCategory.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {stats.scoresByCategory.map((item) => (
              <div key={item.category} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <span className="text-2xl w-8 text-center shrink-0">{getCategoryIcon(item.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {t(`filter${item.category.charAt(0).toUpperCase() + item.category.slice(1)}` as keyof typeof import('@/lib/i18n').translations.en, language)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getScoreBg(item.avgScore)}`}
                        style={{ width: `${(item.avgScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold min-w-[2.5rem] text-right ${getScoreColor(item.avgScore)} ${isArabic ? 'text-left' : 'text-right'}`}>
                      {item.avgScore.toFixed(1)}
                    </span>
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
        <p className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-teal-500" />
          {t('statsRecentPlaces', language)}
        </p>
        {stats.recentPlaces && stats.recentPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.recentPlaces.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group"
                onClick={() => {
                  useAppStore.getState().setSelectedPlace(place);
                  setCurrentView('map');
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl">{getCategoryIcon(place.category)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-teal-700 transition-colors">
                      {isArabic && place.nameAr ? place.nameAr : place.name}
                    </p>
                    <span className="text-xs text-gray-400">{getCityName(place.city, language)}</span>
                  </div>
                </div>
                <div className={`shrink-0 ml-3 px-2.5 py-1 rounded-full text-sm font-bold ${getScoreColor(place.overallScore)} ${
                  place.overallScore >= 4 ? 'bg-green-50' : place.overallScore >= 2.5 ? 'bg-yellow-50' : 'bg-red-50'
                } ${isArabic ? 'mr-3 ml-0' : ''}`}>
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
