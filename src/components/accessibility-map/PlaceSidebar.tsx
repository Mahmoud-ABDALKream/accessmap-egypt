'use client';

import { useState } from 'react';
import { useAppStore, type PlaceData } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  X,
  Share2,
  PenLine,
  MessageSquare,
  Star,
  MapPin,
  Building,
  Calendar,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

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

function ScoreBar({ label, score, lang }: { label: string; score: number; lang: 'en' | 'ar' }) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label={`${label}: ${score} out of 5`}>
      <span className={`text-sm min-w-[120px] ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        {label}
      </span>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getScoreBg(score)}`}
          style={{ width: `${(score / 5) * 100}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={5}
        />
      </div>
      <span className={`text-sm font-bold min-w-[24px] ${getScoreColor(score)}`}>
        {score}
      </span>
    </div>
  );
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

export default function PlaceSidebar() {
  const { selectedPlace, sidebarOpen, setSidebarOpen, setSelectedPlace, language } = useAppStore();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editField, setEditField] = useState('');
  const [editCurrentValue, setEditCurrentValue] = useState('');
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
        // Refresh place data
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
          currentValue: editCurrentValue,
          suggestedValue: editSuggestedValue,
          reason: editReason,
        }),
      });
      toast.success(t('submitEdit', language));
      setEditField('');
      setEditCurrentValue('');
      setEditSuggestedValue('');
      setEditReason('');
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full sm:w-[420px] bg-white shadow-2xl z-[1001] flex flex-col transition-transform duration-300 ${
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
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-teal-600 to-teal-500 text-white">
        <h2 className="text-lg font-bold truncate pr-2">{displayName}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="text-white hover:bg-teal-700 shrink-0"
          aria-label={t('closeSidebar', language)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5" dir={isArabic ? 'rtl' : 'ltr'}>
          {/* Category & City */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-sm gap-1">
              <span>{getCategoryIcon(place.category)}</span>
              {t(`filter${place.category.charAt(0).toUpperCase() + place.category.slice(1)}` as keyof typeof import('@/lib/i18n').translations.en, language)}
            </Badge>
            <Badge variant="outline" className="text-sm gap-1">
              <MapPin className="h-3 w-3" />
              {place.city === 'alexandria' ? t('filterAlexandria', language) : t('filterCairo', language)}
            </Badge>
            <Badge variant="outline" className="text-sm gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(place.submittedAt, language)}
            </Badge>
          </div>

          {/* Overall Score */}
          <Card className="border-0 shadow-none bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getScoreBg(place.overallScore)}`}
                  role="img"
                  aria-label={`${t('overallScore', language)}: ${place.overallScore.toFixed(1)} out of 5`}
                >
                  {place.overallScore.toFixed(1)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{t('overallScore', language)}</p>
                  <p className={`text-sm ${getScoreColor(place.overallScore)}`}>
                    {t(`score${Math.round(place.overallScore)}` as keyof typeof import('@/lib/i18n').translations.en, language)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown Scores */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">{t('breakdownScores', language)}</h3>
            <div className="space-y-3">
              <ScoreBar label={t('rampScore', language)} score={place.rampScore} lang={language} />
              <ScoreBar label={t('elevatorScore', language)} score={place.elevatorScore} lang={language} />
              <ScoreBar label={t('bathroomScore', language)} score={place.bathroomScore} lang={language} />
              <ScoreBar label={t('parkingScore', language)} score={place.parkingScore} lang={language} />
              <ScoreBar label={t('entranceScore', language)} score={place.entranceScore} lang={language} />
            </div>
          </div>

          {/* Photo */}
          {place.photoPath && (
            <div>
              <img
                src={place.photoPath}
                alt={displayName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Initial Review */}
          {place.reviewText && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('reviewTextLabel', language)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{place.reviewText}</p>
            </div>
          )}

          <Separator />

          {/* Reviews */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('reviews', language)} ({place.reviews?.length || 0})
            </h3>
            {place.reviews && place.reviews.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {place.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(review.createdAt, language)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t('noReviews', language)}</p>
            )}
          </div>

          {/* Add Review */}
          <Card className="border-0 shadow-none bg-teal-50">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-medium text-teal-800">{t('addReview', language)}</h4>
              <div>
                <Label className="text-sm text-teal-700">{t('reviewRating', language)}: {reviewRating}/5</Label>
                <Slider
                  value={[reviewRating]}
                  onValueChange={([v]) => setReviewRating(v)}
                  min={1}
                  max={5}
                  step={1}
                  className="mt-1"
                  aria-label={t('reviewRating', language)}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                </div>
              </div>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t('reviewPlaceholder', language)}
                className="min-h-[80px]"
                dir={isArabic ? 'rtl' : 'ltr'}
              />
              <Button
                onClick={handleSubmitReview}
                disabled={!reviewText.trim() || isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {isSubmitting ? t('loading', language) : t('submitReview', language)}
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            {/* Share Button */}
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-1 gap-2"
              aria-label={t('sharePlace', language)}
            >
              <Share2 className="h-4 w-4" />
              {t('sharePlace', language)}
            </Button>

            {/* Suggest Edit */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 gap-2">
                  <PenLine className="h-4 w-4" />
                  {t('suggestEdit', language)}
                </Button>
              </DialogTrigger>
              <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
                <DialogHeader>
                  <DialogTitle>{t('suggestEdit', language)}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>{t('editField', language)}</Label>
                    <Select value={editField} onValueChange={setEditField}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('editField', language)} />
                      </SelectTrigger>
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
                    <Label>{t('editCurrentValue', language)}</Label>
                    <Input
                      value={editCurrentValue}
                      onChange={(e) => setEditCurrentValue(e.target.value)}
                      placeholder={t('editCurrentValue', language)}
                    />
                  </div>
                  <div>
                    <Label>{t('editSuggestedValue', language)}</Label>
                    <Input
                      value={editSuggestedValue}
                      onChange={(e) => setEditSuggestedValue(e.target.value)}
                      placeholder={t('editSuggestedValue', language)}
                    />
                  </div>
                  <div>
                    <Label>{t('editReason', language)}</Label>
                    <Textarea
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      placeholder={t('editReasonPlaceholder', language)}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t('cancel', language)}</Button>
                  </DialogClose>
                  <Button onClick={handleSubmitEdit} className="bg-teal-600 hover:bg-teal-700">
                    {t('submitEdit', language)}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
