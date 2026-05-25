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

function formatDate(dateStr: string, lang: 'en' | 'ar') {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label={`${label}: ${score} out of 5`}>
      <span className="text-xs text-gray-500 min-w-[100px] truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getScoreBg(score)}`}
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

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/40 z-[1000] sm:hidden"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile: Bottom Sheet */}
      <div
        className="fixed bottom-14 left-0 right-0 z-[1001] sm:hidden bg-white rounded-t-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '70vh' }}
        role="dialog"
        aria-label={t('placeDetails', language)}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0">{getCategoryIcon(place.category)}</span>
            <h2 className="text-sm font-bold text-gray-800 truncate">{displayName}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="shrink-0 h-8 w-8"
            aria-label={t('closeSidebar', language)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {/* Score badge row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreLabelBg(place.overallScore)}`}>
              {place.overallScore.toFixed(1)} ★
            </div>
            <Badge variant="outline" className="text-[10px] gap-1 h-5">
              <MapPin className="h-2.5 w-2.5" />
              {place.city === 'alexandria' ? t('filterAlexandria', language) : t('filterCairo', language)}
            </Badge>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            <ScoreBar label={t('rampScore', language)} score={place.rampScore} />
            <ScoreBar label={t('elevatorScore', language)} score={place.elevatorScore} />
            <ScoreBar label={t('bathroomScore', language)} score={place.bathroomScore} />
            <ScoreBar label={t('parkingScore', language)} score={place.parkingScore} />
            <ScoreBar label={t('entranceScore', language)} score={place.entranceScore} />
          </div>

          {/* Description */}
          {place.reviewText && (
            <p className="text-xs text-gray-600 leading-relaxed">{place.reviewText}</p>
          )}

          {/* Reviews */}
          {place.reviews && place.reviews.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {t('reviews', language)} ({place.reviews.length})
              </p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {place.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {formatDate(review.createdAt, language)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Review */}
          <div className="bg-teal-50 rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-teal-700">{t('addReview', language)}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-teal-600">{t('reviewRating', language)}:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-0"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
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
              className="min-h-[60px] text-sm"
              dir={isArabic ? 'rtl' : 'ltr'}
            />
            <Button
              onClick={handleSubmitReview}
              disabled={!reviewText.trim() || isSubmitting}
              size="sm"
              className="w-full h-8 text-sm bg-teal-600 hover:bg-teal-700"
            >
              {isSubmitting ? t('loading', language) : t('submitReview', language)}
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 h-8 text-xs gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              {t('sharePlace', language)}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5">
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
                  <Button onClick={handleSubmitEdit} size="sm" className="text-sm bg-teal-600 hover:bg-teal-700">
                    {t('submitEdit', language)}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Desktop: Right Sidebar */}
      <div
        className={`hidden sm:flex fixed top-12 ${isArabic ? 'left-0' : 'right-0'} h-[calc(100dvh-48px-32px)] w-[380px] bg-white shadow-2xl z-[1001] flex-col transition-transform duration-300 ease-out ${
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
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl shrink-0">{getCategoryIcon(place.category)}</span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-800 truncate">{displayName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${getScoreLabelBg(place.overallScore)}`}>
                  {place.overallScore.toFixed(1)}
                </div>
                <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {place.city === 'alexandria' ? t('filterAlexandria', language) : t('filterCairo', language)}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="shrink-0 h-8 w-8 text-gray-400 hover:text-gray-600"
            aria-label={t('closeSidebar', language)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Overall Score */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getScoreBg(place.overallScore)}`}
                role="img"
                aria-label={`${t('overallScore', language)}: ${place.overallScore.toFixed(1)}`}
              >
                {place.overallScore.toFixed(1)}
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('overallScore', language)}</p>
                <p className={`text-sm font-semibold ${getScoreColor(place.overallScore)}`}>
                  {place.overallScore >= 4 ? (language === 'en' ? 'Good Access' : 'وصول جيد') :
                   place.overallScore >= 2.5 ? (language === 'en' ? 'Moderate Access' : 'وصول متوسط') :
                   (language === 'en' ? 'Poor Access' : 'وصول ضعيف')}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">{t('breakdownScores', language)}</p>
              <div className="space-y-2.5">
                <ScoreBar label={t('rampScore', language)} score={place.rampScore} />
                <ScoreBar label={t('elevatorScore', language)} score={place.elevatorScore} />
                <ScoreBar label={t('bathroomScore', language)} score={place.bathroomScore} />
                <ScoreBar label={t('parkingScore', language)} score={place.parkingScore} />
                <ScoreBar label={t('entranceScore', language)} score={place.entranceScore} />
              </div>
            </div>

            {/* Photo */}
            {place.photoPath && (
              <img
                src={place.photoPath}
                alt={displayName}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            {/* Description */}
            {place.reviewText && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">{t('reviewTextLabel', language)}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{place.reviewText}</p>
              </div>
            )}

            <Separator />

            {/* Reviews */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {t('reviews', language)} ({place.reviews?.length || 0})
              </p>
              {place.reviews && place.reviews.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {place.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {formatDate(review.createdAt, language)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">{t('noReviews', language)}</p>
              )}
            </div>

            {/* Add Review */}
            <div className="bg-teal-50/80 rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-teal-700">{t('addReview', language)}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-teal-600">{t('reviewRating', language)}:</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)} className="p-0" aria-label={`${star}`}>
                      <Star className={`h-5 w-5 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t('reviewPlaceholder', language)}
                className="min-h-[60px] text-sm"
                dir={isArabic ? 'rtl' : 'ltr'}
              />
              <Button
                onClick={handleSubmitReview}
                disabled={!reviewText.trim() || isSubmitting}
                size="sm"
                className="w-full h-8 text-sm bg-teal-600 hover:bg-teal-700"
              >
                {isSubmitting ? t('loading', language) : t('submitReview', language)}
              </Button>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 h-9 text-sm gap-1.5">
                <Share2 className="h-3.5 w-3.5" />
                {t('sharePlace', language)}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 h-9 text-sm gap-1.5">
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
                      <Input value={editSuggestedValue} onChange={(e) => setEditSuggestedValue(e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">{t('editReason', language)}</Label>
                      <Textarea value={editReason} onChange={(e) => setEditReason(e.target.value)} className="min-h-[60px] text-sm" dir={isArabic ? 'rtl' : 'ltr'} />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild><Button variant="outline" size="sm" className="text-sm">{t('cancel', language)}</Button></DialogClose>
                    <Button onClick={handleSubmitEdit} size="sm" className="text-sm bg-teal-600 hover:bg-teal-700">{t('submitEdit', language)}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
