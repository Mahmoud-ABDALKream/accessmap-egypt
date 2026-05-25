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
import { MapPin, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <Label className="text-sm">{label}</Label>
        <span className={`text-sm font-bold ${value >= 4 ? 'text-green-600' : value >= 2.5 ? 'text-yellow-500' : value > 0 ? 'text-red-500' : 'text-gray-400'}`}>
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
          name,
          nameAr,
          category,
          city,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          rampScore,
          elevatorScore,
          bathroomScore,
          parkingScore,
          entranceScore,
          reviewText,
          photoPath,
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('submitSuccess', language)}</h2>
        <Button
          onClick={() => setCurrentView('map')}
          className="mt-4 bg-teal-600 hover:bg-teal-700"
        >
          {t('navMap', language)}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('submitTitle', language)}</h1>
        <p className="text-gray-500 mt-1">{t('submitSubtitle', language)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              {t('placeLocation', language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('placeName', language)} *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('placeNamePlaceholder', language)}
                  required
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="nameAr">{t('placeNameAr', language)}</Label>
                <Input
                  id="nameAr"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder={t('placeNameArPlaceholder', language)}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t('placeCategory', language)} *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
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
                <Label>{t('placeCity', language)} *</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
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
              <Label className="text-sm text-teal-700">{t('clickMap', language)}</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="lat">{t('latitude', language)} *</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="31.2001"
                    required
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="lng">{t('longitude', language)} *</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="29.9187"
                    required
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Scores */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('accessibilityScores', language)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">{t('scoreLabel', language)}</p>
            <ScoreSlider label={t('rampScore', language)} value={rampScore} onChange={setRampScore} />
            <ScoreSlider label={t('elevatorScore', language)} value={elevatorScore} onChange={setElevatorScore} />
            <ScoreSlider label={t('bathroomScore', language)} value={bathroomScore} onChange={setBathroomScore} />
            <ScoreSlider label={t('parkingScore', language)} value={parkingScore} onChange={setParkingScore} />
            <ScoreSlider label={t('entranceScore', language)} value={entranceScore} onChange={setEntranceScore} />
          </CardContent>
        </Card>

        {/* Review & Photo */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label htmlFor="review">{t('reviewTextLabel', language)}</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t('reviewTextPlaceholder', language)}
                className="min-h-[100px] mt-1"
                dir={isArabic ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <Label>{t('photoUpload', language)}</Label>
              <div className="mt-1 flex items-center gap-4">
                <label
                  htmlFor="photo"
                  className="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-teal-400 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{t('photoDropzone', language)}</span>
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {photo && (
                  <span className="text-sm text-teal-600">{photo.name}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{t('photoFormats', language)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !name || !category || !city || !latitude || !longitude}
          className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700"
        >
          {isSubmitting ? t('loading', language) : t('submitPlace', language)}
        </Button>
      </form>
    </div>
  );
}
