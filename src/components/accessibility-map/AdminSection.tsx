'use client';

import { useState, useEffect } from 'react';
import { useAppStore, type PlaceData } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock, Check, Trash2, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

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

function getScoreBg(score: number): string {
  if (score >= 4) return 'bg-green-500';
  if (score >= 2.5) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function AdminSection() {
  const { language } = useAppStore();

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
      <div className="max-w-md mx-auto p-4 sm:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <Lock className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t('adminTitle', language)}</h1>
        </div>
        <form onSubmit={handleLogin}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="admin-pwd">{t('adminPassword', language)}</Label>
                <Input
                  id="admin-pwd"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('adminPasswordPlaceholder', language)}
                  className="mt-1"
                  dir="ltr"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={!password || isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {isLoading ? t('loading', language) : t('adminLogin', language)}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="h-7 w-7 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-800">{t('adminTitle', language)}</h1>
        <Badge variant="secondary" className="ml-auto">
          {unapproved.length} {t('adminUnapproved', language)}
        </Badge>
      </div>

      {unapproved.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Check className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-500">{t('adminNoPending', language)}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {unapproved.map((place) => (
            <Card key={place.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getCategoryIcon(place.category)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{place.name}</h3>
                        {place.nameAr && (
                          <p className="text-sm text-gray-500" dir="rtl">{place.nameAr}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {place.city === 'alexandria' ? t('filterAlexandria', language) : t('filterCairo', language)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {t(`filter${place.category.charAt(0).toUpperCase() + place.category.slice(1)}` as keyof typeof import('@/lib/i18n').translations.en, language)}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(place.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getScoreBg(place.overallScore)}`}>
                      {place.overallScore.toFixed(1)}
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-5 gap-2 mt-3 text-center">
                    {[
                      { label: t('rampScore', language), score: place.rampScore },
                      { label: t('elevatorScore', language), score: place.elevatorScore },
                      { label: t('bathroomScore', language), score: place.bathroomScore },
                      { label: t('parkingScore', language), score: place.parkingScore },
                      { label: t('entranceScore', language), score: place.entranceScore },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500 truncate">{item.label}</p>
                        <p className={`font-bold ${item.score >= 4 ? 'text-green-600' : item.score >= 2.5 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {item.score}
                        </p>
                      </div>
                    ))}
                  </div>

                  {place.reviewText && (
                    <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-2 rounded">{place.reviewText}</p>
                  )}
                </div>

                <Separator />

                <div className="flex">
                  <Button
                    onClick={() => handleApprove(place.id)}
                    className="flex-1 rounded-none bg-green-600 hover:bg-green-700 h-10"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {t('adminApprove', language)}
                  </Button>
                  <Separator orientation="vertical" />
                  <Button
                    onClick={() => handleDelete(place.id)}
                    variant="ghost"
                    className="flex-1 rounded-none text-red-500 hover:bg-red-50 hover:text-red-600 h-10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t('adminDelete', language)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
