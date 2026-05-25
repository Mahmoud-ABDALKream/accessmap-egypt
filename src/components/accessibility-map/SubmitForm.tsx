'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Upload, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <Label className="text-xs text-gray-600">{label}</Label>
        <span className={`text-xs font-bold min-w-[24px] text-right ${value >= 4 ? 'text-green-600' : value >= 2.5 ? 'text-yellow-600' : value > 0 ? 'text-red-500' : 'text-gray-300'}`}>
          {value}/5
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={5}
        step={1}
        aria-label={label}
      />
    </div>
  );
}

export default function SubmitForm() {
  const { language, submitLat, submitLng, setCurrentView } = useAppStore();
  const isArabic = language === 'ar';

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(submitLat?.toString() || '');
  const [longitude, setLongitude] = useState(submitLng?.toString() || '');
  const [rampScore, setRampScore] = useState(0);
  const [elevatorScore, setElevatorScore] = useState(0);
  const [bathroomScore, setBathroomScore] = useState(0);
  const [parkingScore, setParkingScore] = useState(0);
  const [entranceScore, setEntranceScore] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let photoPath = '';
      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          photoPath = uploadData.path;
        }
      }

      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, nameAr, category, city,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          rampScore, elevatorScore, bathroomScore, parkingScore, entranceScore,
          reviewText, photoPath,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        toast.success(t('submitSuccess', language));
      } else {
        const data = await res.json();
        setErrorMsg(data.error || t('submitError', language));
      }
    } catch {
      setErrorMsg(t('submitError', language));
    }
    setIsSubmitting(false);
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-3">
          <CheckCircle className="h-7 w-7 text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">{t('submitSuccess', language)}</h2>
        <Button
          onClick={() => setCurrentView('map')}
          className="mt-3 bg-teal-600 hover:bg-teal-700 h-9 text-sm"
        >
          {t('navMap', language)}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Back button */}
      <button
        onClick={() => setCurrentView('map')}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-600 mb-3 transition-colors"
      >
        <ChevronLeft className={`h-3.5 w-3.5 ${isArabic ? 'rotate-180' : ''}`} />
        {t('navMap', language)}
      </button>

      <h1 className="text-lg font-bold text-gray-800 mb-0.5">{t('submitTitle', language)}</h1>
      <p className="text-xs text-gray-400 mb-4">{t('submitSubtitle', language)}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="text-xs">{t('placeName', language)} *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('placeNamePlaceholder', language)}
                required
                dir="ltr"
                className="h-8 text-xs mt-0.5"
              />
            </div>
            <div>
              <Label htmlFor="nameAr" className="text-xs">{t('placeNameAr', language)}</Label>
              <Input
                id="nameAr"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={t('placeNameArPlaceholder', language)}
                dir="rtl"
                className="h-8 text-xs mt-0.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{t('placeCategory', language)} *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-8 text-xs mt-0.5">
                  <SelectValue placeholder={t('selectCategory', language)} />
                </SelectTrigger>
                <SelectContent>
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
            <div>
              <Label className="text-xs">{t('placeCity', language)} *</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-8 text-xs mt-0.5">
                  <SelectValue placeholder={t('selectCity', language)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alexandria">{t('filterAlexandria', language)}</SelectItem>
                  <SelectItem value="cairo">{t('filterCairo', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-teal-600">{t('clickMap', language)}</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div>
                <Label htmlFor="lat" className="text-[10px] text-gray-400">{t('latitude', language)} *</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="31.2001"
                  required
                  dir="ltr"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="lng" className="text-[10px] text-gray-400">{t('longitude', language)} *</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="29.9187"
                  required
                  dir="ltr"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Accessibility Scores */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">{t('accessibilityScores', language)}</p>
          <p className="text-[10px] text-gray-400 mb-2">{t('scoreLabel', language)}</p>
          <div className="space-y-2.5">
            <ScoreSlider label={t('rampScore', language)} value={rampScore} onChange={setRampScore} />
            <ScoreSlider label={t('elevatorScore', language)} value={elevatorScore} onChange={setElevatorScore} />
            <ScoreSlider label={t('bathroomScore', language)} value={bathroomScore} onChange={setBathroomScore} />
            <ScoreSlider label={t('parkingScore', language)} value={parkingScore} onChange={setParkingScore} />
            <ScoreSlider label={t('entranceScore', language)} value={entranceScore} onChange={setEntranceScore} />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Review & Photo */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="review" className="text-xs">{t('reviewTextLabel', language)}</Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t('reviewTextPlaceholder', language)}
              className="min-h-[72px] text-xs mt-0.5"
              dir={isArabic ? 'rtl' : 'ltr'}
            />
          </div>
          <div>
            <Label className="text-xs">{t('photoUpload', language)}</Label>
            <label
              htmlFor="photo"
              className="mt-0.5 flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-gray-200 p-3 hover:border-teal-300 hover:bg-teal-50/30 transition-colors"
            >
              <Upload className="h-4 w-4 text-gray-300" />
              <span className="text-xs text-gray-400">
                {photo ? photo.name : t('photoDropzone', language)}
              </span>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-2.5 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs">{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting || !name || !category || !city || !latitude || !longitude}
          className="w-full h-10 text-sm bg-teal-600 hover:bg-teal-700"
        >
          {isSubmitting ? t('loading', language) : t('submitPlace', language)}
        </Button>
      </form>
    </div>
  );
}
