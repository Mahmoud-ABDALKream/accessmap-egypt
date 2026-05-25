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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle, ChevronLeft, MapPin, Accessibility, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const scoreColor = value >= 4 ? 'text-green-600' : value >= 2.5 ? 'text-yellow-600' : value > 0 ? 'text-red-500' : 'text-gray-300';
  const scoreBg = value >= 4 ? 'bg-green-500' : value >= 2.5 ? 'bg-yellow-500' : value > 0 ? 'bg-red-500' : 'bg-gray-200';
  const scoreRing = value >= 4 ? 'ring-green-200' : value >= 2.5 ? 'ring-yellow-200' : value > 0 ? 'ring-red-200' : 'ring-gray-100';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ring-2 ${scoreRing} ${scoreBg} transition-all duration-300`}>
            <span className="text-[10px] font-bold text-white">{value}</span>
          </div>
          <span className={`text-xs font-semibold ${scoreColor} transition-colors`}>/5</span>
        </div>
      </div>
      <div className="relative pt-1">
        {/* Color track background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-full overflow-hidden pointer-events-none">
          <div className="flex h-full w-full">
            <div className="flex-[2] bg-red-300/60" />
            <div className="flex-[1] bg-yellow-300/60" />
            <div className="flex-[2] bg-green-300/60" />
          </div>
        </div>
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={0}
          max={5}
          step={1}
          aria-label={label}
          className="relative z-10"
        />
      </div>
    </div>
  );
}

const STEPS = [
  { key: 'basic', icon: MapPin, labelEn: 'Basic Info', labelAr: 'معلومات أساسية' },
  { key: 'accessibility', icon: Accessibility, labelEn: 'Accessibility', labelAr: 'إمكانية الوصول' },
  { key: 'review', icon: Camera, labelEn: 'Review & Photo', labelAr: 'مراجعة وصورة' },
];

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

  // Determine active step
  const activeStep = !name || !category || !city || !latitude || !longitude ? 0
    : !rampScore && !elevatorScore && !bathroomScore && !parkingScore && !entranceScore ? 1
    : 2;

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
      <div className="view-fade-in flex flex-col items-center justify-center min-h-[60vh] p-6" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Animated confetti dots */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="absolute -top-6 left-6 w-2 h-2 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="absolute -top-3 -right-4 w-2.5 h-2.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <div className="absolute -top-5 right-2 w-2 h-2 bg-teal-300 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center shadow-lg shadow-green-100/50">
            <CheckCircle className="h-12 w-12 text-green-500 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
          {language === 'en' ? 'Thank you!' : 'شكراً لك!'}
        </h2>
        <p className="text-sm text-gray-500 mb-8 text-center max-w-xs leading-relaxed">
          {t('submitSuccess', language)}
        </p>
        <Button
          onClick={() => setCurrentView('map')}
          className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 h-12 text-base px-8 rounded-xl font-semibold shadow-lg shadow-teal-200/50 transition-all hover:shadow-xl hover:shadow-teal-300/50"
        >
          {t('navMap', language)}
        </Button>
      </div>
    );
  }

  return (
    <div className="view-fade-in max-w-lg mx-auto p-4 pb-8" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Back button */}
      <button
        onClick={() => setCurrentView('map')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-600 mb-5 transition-colors group"
      >
        <ChevronLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-0.5 ${isArabic ? 'rotate-180' : ''}`} />
        {t('navMap', language)}
      </button>

      {/* Professional header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-1">
          {t('submitTitle', language)}
        </h1>
        <p className="text-sm text-muted-foreground">{t('submitSubtitle', language)}</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = idx <= activeStep;
          const isCurrent = idx === activeStep;
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                isCurrent
                  ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200 shadow-sm'
                  : isActive
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-50 text-gray-400'
              }`}>
                <StepIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isArabic ? step.labelAr : step.labelEn}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full transition-colors duration-300 ${
                  idx < activeStep ? 'bg-teal-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Basic Info */}
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-5 bg-gradient-to-r from-teal-50/60 to-emerald-50/40 border-b border-gray-100/60">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPin className="h-4 w-4 text-teal-600" />
              {isArabic ? 'معلومات أساسية' : 'Basic Info'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">{t('placeName', language)} *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('placeNamePlaceholder', language)}
                required
                dir="ltr"
                className="h-11 text-sm mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="nameAr" className="text-sm font-medium">{t('placeNameAr', language)}</Label>
              <Input
                id="nameAr"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={t('placeNameArPlaceholder', language)}
                dir="rtl"
                className="h-11 text-sm mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">{t('placeCategory', language)} *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 text-sm mt-1.5">
                    <SelectValue placeholder={t('selectCategory', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="museum">🏛️ {t('filterMuseum', language)}</SelectItem>
                    <SelectItem value="monument">🗿 {t('filterMonument', language)}</SelectItem>
                    <SelectItem value="mosque">🕌 {t('filterMosque', language)}</SelectItem>
                    <SelectItem value="park">🌳 {t('filterPark', language)}</SelectItem>
                    <SelectItem value="mall">🛍️ {t('filterMall', language)}</SelectItem>
                    <SelectItem value="hotel">🏨 {t('filterHotel', language)}</SelectItem>
                    <SelectItem value="market">🏪 {t('filterMarket', language)}</SelectItem>
                    <SelectItem value="hospital">🏥 {t('filterHospital', language)}</SelectItem>
                    <SelectItem value="cafe">☕ {t('filterCafe', language)}</SelectItem>
                    <SelectItem value="school">🏫 {t('filterSchool', language)}</SelectItem>
                    <SelectItem value="government">🏛️ {t('filterGovernment', language)}</SelectItem>
                    <SelectItem value="transport">🚉 {t('filterTransport', language)}</SelectItem>
                    <SelectItem value="entertainment">🎭 {t('filterEntertainment', language)}</SelectItem>
                    <SelectItem value="other">📍 {t('filterOther', language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">{t('placeCity', language)} *</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-11 text-sm mt-1.5">
                    <SelectValue placeholder={t('selectCity', language)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alexandria">{t('filterAlexandria', language)}</SelectItem>
                    <SelectItem value="cairo">{t('filterCairo', language)}</SelectItem>
                    <SelectItem value="giza">{t('filterGiza', language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-teal-600 mb-1.5">{t('clickMap', language)}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="lat" className="text-xs text-gray-400">{t('latitude', language)} *</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="31.2001"
                    required
                    dir="ltr"
                    className="h-11 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-xs text-gray-400">{t('longitude', language)} *</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="29.9187"
                    required
                    dir="ltr"
                    className="h-11 text-sm mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Accessibility Scores */}
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-5 bg-gradient-to-r from-amber-50/60 to-yellow-50/40 border-b border-gray-100/60">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Accessibility className="h-4 w-4 text-amber-600" />
              {t('accessibilityScores', language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-xs text-gray-400 mb-5">{t('scoreLabel', language)}</p>
            <div className="space-y-5">
              <ScoreSlider label={t('rampScore', language)} value={rampScore} onChange={setRampScore} />
              <ScoreSlider label={t('elevatorScore', language)} value={elevatorScore} onChange={setElevatorScore} />
              <ScoreSlider label={t('bathroomScore', language)} value={bathroomScore} onChange={setBathroomScore} />
              <ScoreSlider label={t('parkingScore', language)} value={parkingScore} onChange={setParkingScore} />
              <ScoreSlider label={t('entranceScore', language)} value={entranceScore} onChange={setEntranceScore} />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Review & Photo */}
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-5 bg-gradient-to-r from-purple-50/60 to-pink-50/40 border-b border-gray-100/60">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Camera className="h-4 w-4 text-purple-600" />
              {isArabic ? 'مراجعة وصورة' : 'Review & Photo'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label htmlFor="review" className="text-sm font-medium">{t('reviewTextLabel', language)}</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t('reviewTextPlaceholder', language)}
                className="min-h-[100px] text-sm mt-1.5"
                dir={isArabic ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">{t('photoUpload', language)}</Label>
              <label
                htmlFor="photo"
                className={`mt-2 flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all duration-200 group ${
                  photo
                    ? 'border-teal-300 bg-teal-50/40'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  photo ? 'bg-teal-100' : 'bg-gray-100 group-hover:bg-teal-100'
                }`}>
                  <Upload className={`h-5 w-5 transition-colors ${photo ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-500'}`} />
                </div>
                <span className={`text-sm font-medium ${photo ? 'text-teal-700' : 'text-gray-500'}`}>
                  {photo ? photo.name : t('photoDropzone', language)}
                </span>
                <span className="text-[11px] text-gray-400 mt-1">{t('photoFormats', language)}</span>
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting || !name || !category || !city || !latitude || !longitude}
          className="w-full h-12 text-base bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl font-semibold shadow-lg shadow-teal-200/40 transition-all hover:shadow-xl hover:shadow-teal-300/40 disabled:opacity-50 disabled:shadow-none"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('loading', language)}
            </span>
          ) : t('submitPlace', language)}
        </Button>
      </form>
    </div>
  );
}
