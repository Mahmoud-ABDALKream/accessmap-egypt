'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, BarChart3, MessageSquare, TrendingUp, Clock } from 'lucide-react';

function getScoreColor(score: number): string {
  if (score >= 4) return 'text-green-600';
  if (score >= 2.5) return 'text-yellow-500';
  return 'text-red-500';
}

function getScoreBg(score: number): string {
  if (score >= 4) return 'bg-green-500';
  if (score >= 2.5) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'mosque': return '🕌';
    case 'hospital': return '🏥';
    case 'cafe': return '☕';
    case 'school': return '🏫';
    case 'government': return '🏛️';
    case 'transport': return '🚉';
    default: return '📍';
  }
}

export default function StatsDashboard() {
  const { stats, fetchStats, language } = useAppStore();
  const isArabic = language === 'ar';

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]" dir={isArabic ? 'rtl' : 'ltr'}>
        <p className="text-gray-400">{t('loading', language)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('statsTitle', language)}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-100 rounded-lg">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('statsTotalPlaces', language)}</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalPlaces}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('statsTotalReviews', language)}</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('statsAvgScore', language)}</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score by Category */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            {t('statsByCategory', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.scoresByCategory && stats.scoresByCategory.length > 0 ? (
            <div className="space-y-4">
              {stats.scoresByCategory.map((item) => (
                <div key={item.category} className="flex items-center gap-4">
                  <span className="text-2xl min-w-[36px]">{getCategoryIcon(item.category)}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {t(`filter${item.category.charAt(0).toUpperCase() + item.category.slice(1)}` as keyof typeof import('@/lib/i18n').translations.en, language)}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(item.avgScore)}`}>
                        {item.avgScore.toFixed(1)} ({item.count})
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
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
            <p className="text-gray-400 text-center py-8">{t('statsNoData', language)}</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Places */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-teal-600" />
            {t('statsRecentPlaces', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentPlaces && stats.recentPlaces.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getCategoryIcon(place.category)}</span>
                    <div>
                      <p className="font-medium text-gray-800">
                        {isArabic && place.nameAr ? place.nameAr : place.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">
                          {place.city === 'alexandria' ? t('filterAlexandria', language) : t('filterCairo', language)}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(place.submittedAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${getScoreColor(place.overallScore)}`}>
                    {place.overallScore.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">{t('statsNoData', language)}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
