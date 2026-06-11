'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore, type PlaceData } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Lock,
  Check,
  Trash2,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  LogOut,
  Mail,
  KeyRound,
} from 'lucide-react';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [unapproved, setUnapproved] = useState<PlaceData[]>([]);
  const [error, setError] = useState('');

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin');
        if (res.ok) {
          const data = await res.json();
          setUnapproved(Array.isArray(data) ? data : []);
          setIsAdmin(true);
        }
      } catch {
        // Not authenticated
      }
      setIsCheckingSession(false);
    }
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    try {
      // Sign in with NextAuth credentials
      const { signIn } = await import('next-auth/react');
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(isArabic ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Fetch unapproved places
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        setUnapproved(Array.isArray(data) ? data : []);
        setIsAdmin(true);
        toast.success(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
      } else {
        setError(isArabic ? 'ليس لديك صلاحيات الإدارة' : 'You do not have admin privileges');
      }
    } catch {
      setError(t('error', language));
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import('next-auth/react');
      await signOut({ redirect: false });
      setIsAdmin(false);
      setUnapproved([]);
      setEmail('');
      setPassword('');
      toast.success(isArabic ? 'تم تسجيل الخروج' : 'Logged out');
    } catch {
      // ignore
    }
  };

  const fetchUnapproved = useCallback(async () => {
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        setUnapproved(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setUnapproved((prev) => prev.filter((p) => p.id !== id));
        toast.success(isArabic ? 'تمت الموافقة' : 'Approved');
        fetchUnapproved();
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isArabic ? 'حذف هذا الإرسال؟' : 'Delete this submission?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setUnapproved((prev) => prev.filter((p) => p.id !== id));
        toast.success(isArabic ? 'تم الحذف' : 'Deleted');
        fetchUnapproved();
      }
    } catch {
      // ignore
    }
  };

  // Loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="view-fade-in flex items-center justify-center min-h-[60vh]" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">{t('loading', language)}</p>
        </div>
      </div>
    );
  }

  // Login form
  if (!isAdmin) {
    return (
      <div className="view-fade-in max-w-sm mx-auto p-4 min-h-[60vh] flex flex-col justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Back button */}
        <button
          onClick={() => setCurrentView('map')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-600 mb-6 transition-colors group"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-0.5 ${isArabic ? 'rotate-180' : ''}`} />
          {t('navMap', language)}
        </button>

        <Card className="border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/80 rounded-2xl shadow-sm mb-4">
              <Lock className="h-7 w-7 text-teal-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t('adminTitle', language)}</h1>
            <p className="text-xs text-gray-500 mt-1">
              {isArabic ? 'سجّل دخولك للوصول إلى لوحة الإدارة' : 'Sign in to access the admin panel'}
            </p>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-email" className="text-sm font-medium">
                    {isArabic ? 'البريد الإلكتروني' : 'Email'}
                  </Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isArabic ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                      className="h-12 text-sm pl-10"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="admin-pwd" className="text-sm font-medium">
                    {isArabic ? 'كلمة المرور' : 'Password'}
                  </Label>
                  <div className="relative mt-1.5">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin-pwd"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'}
                      className="h-12 text-sm pl-10"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={!email || !password || isLoading}
                  className="w-full h-12 text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl font-semibold shadow-lg shadow-teal-200/40 transition-all hover:shadow-xl hover:shadow-teal-300/40 disabled:opacity-50 disabled:shadow-none"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('loading', language)}
                    </span>
                  ) : t('adminLogin', language)}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="view-fade-in max-w-2xl mx-auto p-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-200/40">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-800">{t('adminTitle', language)}</h1>
          <p className="text-xs text-gray-400">{isArabic ? 'مراجعة الأماكن المعلقة' : 'Review pending submissions'}</p>
        </div>
        <Badge className={`text-xs font-bold px-3 py-1 h-7 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm ${
          isArabic ? 'mr-auto' : 'ml-auto'
        }`}>
          {unapproved.length} {isArabic ? 'معلق' : 'pending'}
        </Badge>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 gap-1.5 h-8 px-2"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="text-xs">{isArabic ? 'خروج' : 'Logout'}</span>
        </Button>
      </div>

      {unapproved.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">{t('adminNoPending', language)}</h3>
          <p className="text-sm text-gray-400">{isArabic ? 'جميع الأماكن تمت مراجعتها' : 'All submissions have been reviewed'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {unapproved.map((place) => (
            <div key={place.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Gradient left border effect */}
              <div className="flex">
                <div className="w-1 bg-gradient-to-b from-teal-500 to-emerald-400 shrink-0" />
                <div className="flex-1">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-2xl shrink-0 mt-0.5">{getCategoryIcon(place.category)}</span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">{place.name}</h3>
                          {place.nameAr && (
                            <p className="text-xs text-gray-400 mt-0.5" dir="rtl">{place.nameAr}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge variant="outline" className="text-[11px] h-5 px-2 font-medium">
                              {getCityName(place.city, language)}
                            </Badge>
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getScoreLabelBg(place.overallScore)}`}>
                              ⭐ {place.overallScore.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scores grid */}
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {[
                        { label: t('rampScore', language), score: place.rampScore },
                        { label: t('elevatorScore', language), score: place.elevatorScore },
                        { label: t('bathroomScore', language), score: place.bathroomScore },
                        { label: t('parkingScore', language), score: place.parkingScore },
                        { label: t('entranceScore', language), score: place.entranceScore },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50/80 rounded-lg p-2 text-center border border-gray-100/50">
                          <p className="text-[10px] text-gray-400 truncate mb-0.5">{item.label}</p>
                          <div className="flex items-center justify-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getScoreBg(item.score)}`} />
                            <p className={`text-xs font-bold ${item.score >= 4 ? 'text-green-600' : item.score >= 2.5 ? 'text-yellow-600' : 'text-red-500'}`}>
                              {item.score}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {place.reviewText && (
                      <p className="text-xs text-gray-500 mt-3 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100/50 leading-relaxed">
                        &ldquo;{place.reviewText}&rdquo;
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Action buttons */}
                  <div className="flex">
                    <Button
                      onClick={() => handleApprove(place.id)}
                      className="flex-1 rounded-none bg-green-600 hover:bg-green-700 h-11 text-sm font-semibold shadow-none transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span className={isArabic ? 'mr-2' : 'ml-2'}>{t('adminApprove', language)}</span>
                    </Button>
                    <Separator orientation="vertical" />
                    <Button
                      onClick={() => handleDelete(place.id)}
                      variant="ghost"
                      className="flex-1 rounded-none text-red-500 hover:bg-red-50 hover:text-red-600 h-11 text-sm font-semibold transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className={isArabic ? 'mr-2' : 'ml-2'}>{t('adminDelete', language)}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
