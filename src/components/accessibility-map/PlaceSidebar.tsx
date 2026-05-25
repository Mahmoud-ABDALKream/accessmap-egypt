'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  X,
  Share2,
  PenLine,
  MessageSquare,
  Star,
  MapPin,
  Navigation,
} from 'lucide-react';
import { toast } from 'sonner';

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

function getScoreLabelBg(score: number): string {
  if (score >= 4) return 'bg-green-50 text-green-700 border-green-200';
  if (score >= 2.5) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  return 'bg-red-50 text-red-600 border-red-200';
}

function getScoreGradientClass(score: number): string {
  if (score >= 4) return 'from-green-400 to-emerald-600';
  if (score >= 2.5) return 'from-yellow-400 to-amber-500';
  return 'from-red-400 to-rose-600';
}

function getScoreBarGradient(score: number): string {
  if (score >= 4) return 'from-green-400 to-emerald-500';
  if (score >= 2.5) return 'from-yellow-400 to-amber-500';
  return 'from-red-400 to-rose-500';
}

function getAccessLevelText(score: number, language: 'en' | 'ar'): string {
  if (score >= 4) return language === 'en' ? 'Good Access' : 'وصول جيد';
  if (score >= 2.5) return language === 'en' ? 'Moderate Access' : 'وصول متوسط';
  return language === 'en' ? 'Poor Access' : 'وصول ضعيف';
}

function getCityName(city: string, lang: 'en' | 'ar') {
  if (city === 'alexandria') return lang === 'ar' ? 'الإسكندرية' : 'Alexandria';
  if (city === 'cairo') return lang === 'ar' ? 'القاهرة' : 'Cairo';
  if (city === 'giza') return lang === 'ar' ? 'الجيزة' : 'Giza';
  return city;
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

function formatDate(dateStr: string, lang: 'en' | 'ar') {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getScoreEmoji(score: number): string {
  if (score >= 4) return '✅';
  if (score >= 2.5) return '⚠️';
  return '❌';
}

function ScoreBar({ label, score, emoji }: { label: string; score: number; emoji?: string }) {
  return (
    <div className="flex items-center gap-2.5" role="group" aria-label={`${label}: ${score} out of 5`}>
      {emoji && <span className="text-xs shrink-0">{emoji}</span>}
      <span className="text-xs text-gray-500 min-w-[90px] truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getScoreBarGradient(score)}`}
          style={{ width: `${(score / 5) * 100}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={5}
        />
      </div>
      <span className={`text-xs font-bold min-w-[24px] text-right ${getScoreColor(score)}`}>{score}</span>
    </div>
  );
}

function getReviewerInitial(text: string): string {
  if (!text) return '?';
  const words = text.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0][0].toUpperCase();
}

export default function PlaceSidebar() {
  const { selectedPlace, sidebarOpen, setSidebarOpen, setSelectedPlace, language } = useAppStore();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editField, setEditField] = useState('');
  const [editSuggestedValue, setEditSuggestedValue] = useState('');
  const [editReason, setEditReason] = useState('');

  if (!sidebarOpen || !selectedPlace) return null;

  const place = selectedPlace;
  const isArabic = language === 'ar';
  const displayName = isArabic && place.nameAr ? place.nameAr : place.name;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;

  const handleShare = async () => {
    const url = `${window.location.origin}?place=${place.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('linkCopied', language));
    } catch {
      // fallback
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/places/${place.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reviewText, rating: reviewRating }),
      });
      if (res.ok) {
        setReviewText('');
        setReviewRating(3);
        toast.success(t('submitReview', language));
        const placeRes = await fetch(`/api/places/${place.id}`);
        if (placeRes.ok) {
          const updated = await placeRes.json();
          setSelectedPlace(updated);
        }
      }
    } catch {
      // ignore
    }
    setIsSubmitting(false);
  };

  const handleSubmitEdit = async () => {
    if (!editField || !editSuggestedValue) return;
    try {
      await fetch(`/api/places/${place.id}/edit-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: editField,
          currentValue: '',
          suggestedValue: editSuggestedValue,
          reason: editReason,
        }),
      });
      toast.success(t('submitEdit', language));
      setEditField('');
      setEditSuggestedValue('');
      setEditReason('');
    } catch {
      // ignore
    }
  };

  // Edit dialog content shared between mobile and desktop
  const editDialog = (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-9 text-sm gap-2 border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all"
        >
          <PenLine className="h-3.5 w-3.5" />
          {t('suggestEdit', language)}
        </Button>
      </DialogTrigger>
      <DialogContent dir={isArabic ? 'rtl' : 'ltr'} className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">{t('suggestEdit', language)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">{t('editField', language)}</Label>
            <Select value={editField} onValueChange={setEditField}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t('editField', language)} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="rampScore">{t('rampScore', language)}</SelectItem>
                <SelectItem value="elevatorScore">{t('elevatorScore', language)}</SelectItem>
                <SelectItem value="bathroomScore">{t('bathroomScore', language)}</SelectItem>
                <SelectItem value="parkingScore">{t('parkingScore', language)}</SelectItem>
                <SelectItem value="entranceScore">{t('entranceScore', language)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t('editSuggestedValue', language)}</Label>
            <Input
              value={editSuggestedValue}
              onChange={(e) => setEditSuggestedValue(e.target.value)}
              placeholder={t('editSuggestedValue', language)}
              className="h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">{t('editReason', language)}</Label>
            <Textarea
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              placeholder={t('editReasonPlaceholder', language)}
              className="min-h-[60px] text-sm"
              dir={isArabic ? 'rtl' : 'ltr'}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="text-sm">{t('cancel', language)}</Button>
          </DialogClose>
          <Button onClick={handleSubmitEdit} size="sm" className="text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 border-0">
            {t('submitEdit', language)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Review stars display component
  const ReviewStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  // Review card with avatar initial
  const ReviewCard = ({ review }: { review: { id: string; text: string; rating: number; createdAt: string } }) => {
    const initial = getReviewerInitial(review.text);
    const bgColor = review.rating >= 4
      ? 'bg-gradient-to-br from-green-400 to-emerald-500'
      : review.rating >= 2.5
        ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
        : 'bg-gradient-to-br from-red-400 to-rose-500';
    return (
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
        <div className="flex items-start gap-2.5 mb-1.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm ${bgColor}`}>
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <ReviewStars rating={review.rating} />
              <span className="text-[10px] text-gray-400 shrink-0">
                {formatDate(review.createdAt, language)}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed pl-9">{review.text}</p>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/50 z-[1000] sm:hidden transition-opacity duration-300"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          Mobile: Bottom Sheet
         ═══════════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-16 left-0 right-0 z-[1001] sm:hidden bg-white rounded-t-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.15)] flex flex-col"
        style={{ maxHeight: '75vh' }}
        role="dialog"
        aria-label={t('placeDetails', language)}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1.5">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{getCategoryIcon(place.category)}</span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-800 truncate">{displayName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] gap-1 h-5 border-gray-200">
                  <MapPin className="h-2.5 w-2.5" />
                  {getCityName(place.city, language)}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="shrink-0 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            aria-label={t('closeSidebar', language)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto panel-scroll px-4 pb-4 space-y-3" dir={isArabic ? 'rtl' : 'ltr'}>
          {/* Score display */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 border border-gray-100 view-fade-in">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-extrabold bg-gradient-to-br ${getScoreGradientClass(place.overallScore)} shadow-lg shrink-0`}
              role="img"
              aria-label={`${t('overallScore', language)}: ${place.overallScore.toFixed(1)}`}
            >
              {place.overallScore.toFixed(1)}
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{t('overallScore', language)}</p>
              <p className={`text-sm font-bold ${getScoreColor(place.overallScore)}`}>
                {getAccessLevelText(place.overallScore, language)}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 view-fade-in">
            <ScoreBar label={t('rampScore', language)} score={place.rampScore} emoji="🦽" />
            <ScoreBar label={t('elevatorScore', language)} score={place.elevatorScore} emoji="🛗" />
            <ScoreBar label={t('bathroomScore', language)} score={place.bathroomScore} emoji="🚻" />
            <ScoreBar label={t('parkingScore', language)} score={place.parkingScore} emoji="🅿️" />
            <ScoreBar label={t('entranceScore', language)} score={place.entranceScore} emoji="🚪" />
          </div>

          {/* Description */}
          {place.reviewText && (
            <p className="text-xs text-gray-600 leading-relaxed">{place.reviewText}</p>
          )}

          {/* Reviews */}
          {place.reviews && place.reviews.length > 0 && (
            <div className="view-fade-in">
              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3" />
                {t('reviews', language)} ({place.reviews.length})
              </p>
              <div className="space-y-2 max-h-36 overflow-y-auto panel-scroll">
                {place.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          {/* Add Review */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-3 space-y-2 border border-teal-100/60">
            <p className="text-xs font-semibold text-teal-700">{t('addReview', language)}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-teal-600">{t('reviewRating', language)}:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-0 transition-transform hover:scale-110"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`h-5 w-5 transition-colors ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t('reviewPlaceholder', language)}
              className="min-h-[60px] text-sm bg-white/80"
              dir={isArabic ? 'rtl' : 'ltr'}
            />
            <Button
              onClick={handleSubmitReview}
              disabled={!reviewText.trim() || isSubmitting}
              size="sm"
              className="w-full h-8 text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 border-0 shadow-sm"
            >
              {isSubmitting ? t('loading', language) : t('submitReview', language)}
            </Button>
          </div>

          {/* Actions */}
          <div className="space-y-2 view-fade-in">
            {/* Get Directions */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-9 text-sm font-semibold rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm transition-all"
            >
              <Navigation className="h-4 w-4" />
              {language === 'en' ? 'Get Directions' : 'اتجاهات'}
            </a>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 h-9 text-sm gap-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300">
                <Share2 className="h-3.5 w-3.5" />
                {t('sharePlace', language)}
              </Button>
              {editDialog}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Desktop: Right Sidebar
         ═══════════════════════════════════════════════════════════════════════ */}
      <div
        className={`hidden sm:flex fixed top-14 ${isArabic ? 'left-0 shadow-[4px_0_20px_rgba(0,0,0,0.08)]' : 'right-0 shadow-[-4px_0_20px_rgba(0,0,0,0.08)]'} h-[calc(100dvh-56px-32px)] w-[400px] bg-white z-[1001] flex-col transition-transform duration-300 ease-out panel-slide-right ${
          sidebarOpen
            ? 'translate-x-0'
            : isArabic
            ? '-translate-x-full'
            : 'translate-x-full'
        }`}
        role="complementary"
        aria-label={t('placeDetails', language)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0 bg-gradient-to-r from-white to-gray-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{getCategoryIcon(place.category)}</span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-800 truncate">{displayName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] gap-1 h-5 border-gray-200">
                  <MapPin className="h-2.5 w-2.5 text-gray-400" />
                  {getCityName(place.city, language)}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="shrink-0 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t('closeSidebar', language)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto panel-scroll">
          <div className="p-5 space-y-5" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Overall Score — Gradient Circle */}
            <div className="flex items-center gap-5 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 view-fade-in">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold bg-gradient-to-br ${getScoreGradientClass(place.overallScore)} shadow-lg shrink-0 relative`}
                role="img"
                aria-label={`${t('overallScore', language)}: ${place.overallScore.toFixed(1)}`}
              >
                {place.overallScore.toFixed(1)}
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-full bg-white/10" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{t('overallScore', language)}</p>
                <p className={`text-base font-bold ${getScoreColor(place.overallScore)} mt-0.5`}>
                  {getAccessLevelText(place.overallScore, language)}
                </p>
                <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getScoreLabelBg(place.overallScore)}`}>
                  <Star className="h-2.5 w-2.5 fill-current" />
                  {place.overallScore.toFixed(1)} / 5
                </div>
              </div>
            </div>

            {/* Breakdown — Gradient Bars with Emoji */}
            <div className="view-fade-in">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t('breakdownScores', language)}</p>
              <div className="space-y-3">
                <ScoreBar label={t('rampScore', language)} score={place.rampScore} emoji="🦽" />
                <ScoreBar label={t('elevatorScore', language)} score={place.elevatorScore} emoji="🛗" />
                <ScoreBar label={t('bathroomScore', language)} score={place.bathroomScore} emoji="🚻" />
                <ScoreBar label={t('parkingScore', language)} score={place.parkingScore} emoji="🅿️" />
                <ScoreBar label={t('entranceScore', language)} score={place.entranceScore} emoji="🚪" />
              </div>
            </div>

            {/* Photo */}
            {place.photoPath && (
              <div className="view-fade-in rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <img
                  src={place.photoPath}
                  alt={displayName}
                  className="w-full h-44 object-cover"
                />
              </div>
            )}

            {/* Description */}
            {place.reviewText && (
              <div className="view-fade-in">
                <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">{t('reviewTextLabel', language)}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{place.reviewText}</p>
              </div>
            )}

            <Separator />

            {/* Reviews */}
            <div className="view-fade-in">
              <p className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <MessageSquare className="h-3 w-3" />
                {t('reviews', language)} ({place.reviews?.length || 0})
              </p>
              {place.reviews && place.reviews.length > 0 ? (
                <div className="space-y-2.5 max-h-52 overflow-y-auto panel-scroll">
                  {place.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-2">{t('noReviews', language)}</p>
              )}
            </div>

            {/* Add Review */}
            <div className="bg-gradient-to-br from-teal-50/80 to-emerald-50/60 rounded-xl p-4 space-y-2.5 border border-teal-100/50 view-fade-in">
              <p className="text-xs font-semibold text-teal-700">{t('addReview', language)}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-teal-600">{t('reviewRating', language)}:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)} className="p-0 transition-transform hover:scale-110" aria-label={`${star}`}>
                      <Star className={`h-5 w-5 transition-colors ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t('reviewPlaceholder', language)}
                className="min-h-[60px] text-sm bg-white/80"
                dir={isArabic ? 'rtl' : 'ltr'}
              />
              <Button
                onClick={handleSubmitReview}
                disabled={!reviewText.trim() || isSubmitting}
                size="sm"
                className="w-full h-9 text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 border-0 shadow-sm"
              >
                {isSubmitting ? t('loading', language) : t('submitReview', language)}
              </Button>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-2.5 view-fade-in">
              {/* Get Directions — Primary action */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full h-10 text-sm font-semibold rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md shadow-teal-200/50 transition-all hover:shadow-lg hover:shadow-teal-200/60 hover:-translate-y-0.5"
              >
                <Navigation className="h-4 w-4" />
                {language === 'en' ? 'Get Directions' : 'اتجاهات'}
              </a>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 h-9 text-sm gap-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <Share2 className="h-3.5 w-3.5" />
                  {t('sharePlace', language)}
                </Button>
                {editDialog}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
