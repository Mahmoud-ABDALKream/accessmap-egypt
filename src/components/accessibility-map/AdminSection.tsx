'use client';

import { useState } from 'react';
import { useAppStore, type PlaceData } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock, Check, Trash2, AlertCircle, ShieldCheck, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

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

function getScoreBg(score: number): string {
  if (score >= 4) return 'bg-green-500';
  if (score >= 2.5) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getScoreLabelBg(score: number): string {
  if (score >= 4) return 'bg-green-50 text-green-700 border-green-200';
  if (score >= 2.5) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  return 'bg-red-50 text-red-600 border-red-200';
}

export default function AdminSection() {
  const { language, setCurrentView } = useAppStore();
  const isArabic = language === 'ar';

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unapproved, setUnapproved] = useState<PlaceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUnapproved = async (pwd: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin?password=${encodeURIComponent(pwd)}`);
      if (res.ok) {
        const data = await res.json();
        setUnapproved(data);
        setIsAuthenticated(true);
        setError('');
      } else {
        setError(t('adminWrongPassword', language));
        setIsAuthenticated(false);
      }
    } catch {
      setError(t('error', language));
    }
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUnapproved(password);
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      if (res.ok) {
        setUnapproved((prev) => prev.filter((p) => p.id !== id));
        toast.success('Approved');
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      if (res.ok) {
        setUnapproved((prev) => prev.filter((p) => p.id !== id));
        toast.success('Deleted');
      }
    } catch {
      // ignore
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto p-4" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Back button */}
        <button
          onClick={() => setCurrentView('map')}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-600 mb-4 transition-colors"
        >
          <ChevronLeft className={`h-3.5 w-3.5 ${isArabic ? 'rotate-180' : ''}`} />
          {t('navMap', language)}
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-2">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">{t('adminTitle', language)}</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="space-y-3">
            <div>
              <Label htmlFor="admin-pwd" className="text-xs">{t('adminPassword', language)}</Label>
              <Input
                id="admin-pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('adminPasswordPlaceholder', language)}
                className="h-8 text-xs mt-0.5"
                dir="ltr"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-red-500 text-xs">
                <AlertCircle className="h-3 w-3" />
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={!password || isLoading}
              className="w-full h-9 text-sm bg-teal-600 hover:bg-teal-700"
            >
              {isLoading ? t('loading', language) : t('adminLogin', language)}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-5 w-5 text-teal-600" />
        <h1 className="text-lg font-bold text-gray-800">{t('adminTitle', language)}</h1>
        <Badge variant="secondary" className={`text-[10px] ${isArabic ? 'mr-auto' : 'ml-auto'}`}>
          {unapproved.length}
        </Badge>
      </div>

      {unapproved.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <Check className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-xs text-gray-500">{t('adminNoPending', language)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unapproved.map((place) => (
            <div key={place.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-lg shrink-0">{getCategoryIcon(place.category)}</span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-gray-800 truncate">{place.name}</h3>
                      {place.nameAr && (
                        <p className="text-[10px] text-gray-400" dir="rtl">{place.nameAr}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <Badge variant="outline" className="text-[10px] h-4 px-1">
                          {getCityName(place.city, language)}
                        </Badge>
                        <span className={`px-1 py-0 rounded text-[10px] font-bold border ${getScoreLabelBg(place.overallScore)}`}>
                          {place.overallScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scores grid */}
                <div className="grid grid-cols-5 gap-1.5 mt-2">
                  {[
                    { label: t('rampScore', language), score: place.rampScore },
                    { label: t('elevatorScore', language), score: place.elevatorScore },
                    { label: t('bathroomScore', language), score: place.bathroomScore },
                    { label: t('parkingScore', language), score: place.parkingScore },
                    { label: t('entranceScore', language), score: place.entranceScore },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded p-1.5 text-center">
                      <p className="text-[9px] text-gray-400 truncate">{item.label}</p>
                      <p className={`text-xs font-bold ${item.score >= 4 ? 'text-green-600' : item.score >= 2.5 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {item.score}
                      </p>
                    </div>
                  ))}
                </div>

                {place.reviewText && (
                  <p className="text-[10px] text-gray-500 mt-2 bg-gray-50 p-1.5 rounded">{place.reviewText}</p>
                )}
              </div>

              <Separator />

              <div className="flex">
                <Button
                  onClick={() => handleApprove(place.id)}
                  className="flex-1 rounded-none bg-green-600 hover:bg-green-700 h-9 text-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className={isArabic ? 'mr-1' : 'ml-1'}>{t('adminApprove', language)}</span>
                </Button>
                <Separator orientation="vertical" />
                <Button
                  onClick={() => handleDelete(place.id)}
                  variant="ghost"
                  className="flex-1 rounded-none text-red-500 hover:bg-red-50 hover:text-red-600 h-9 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className={isArabic ? 'mr-1' : 'ml-1'}>{t('adminDelete', language)}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
