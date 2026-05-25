'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Search,
  PenLine,
  Shield,
  Users,
  Accessibility,
  ChevronLeft,
} from 'lucide-react';

export default function AboutSection() {
  const { language, setCurrentView } = useAppStore();
  const isArabic = language === 'ar';

  return (
    <div className="max-w-2xl mx-auto p-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Back button */}
      <button
        onClick={() => setCurrentView('map')}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-600 mb-3 transition-colors"
      >
        <ChevronLeft className={`h-3.5 w-3.5 ${isArabic ? 'rotate-180' : ''}`} />
        {t('navMap', language)}
      </button>

      {/* Hero */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-50 rounded-full mb-2">
          <Accessibility className="h-6 w-6 text-teal-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">{t('aboutTitle', language)}</h1>
      </div>

      {/* Mission */}
      <div className="bg-teal-50/70 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-teal-600" />
          <h2 className="text-sm font-semibold text-teal-800">{t('aboutMission', language)}</h2>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{t('aboutMissionText', language)}</p>
      </div>

      {/* How It Works */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Users className="h-4 w-4 text-teal-600" />
          {t('aboutHowItWorks', language)}
        </h2>
        <div className="space-y-2">
          {[
            { icon: Search, text: t('aboutHowItWorksText1', language) },
            { icon: PenLine, text: t('aboutHowItWorksText2', language) },
            { icon: Shield, text: t('aboutHowItWorksText3', language) },
            { icon: Users, text: t('aboutHowItWorksText4', language) },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-gray-50 rounded-lg p-2.5">
              <div className="p-1.5 bg-white rounded-md shrink-0">
                <item.icon className="h-3.5 w-3.5 text-teal-600" />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Criteria */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Accessibility className="h-4 w-4 text-teal-600" />
          {t('aboutCriteria', language)}
        </h2>
        <div className="space-y-1.5">
          {[
            { icon: '🦽', text: t('aboutRamp', language) },
            { icon: '🛗', text: t('aboutElevator', language) },
            { icon: '🚻', text: t('aboutBathroom', language) },
            { icon: '🅿️', text: t('aboutParking', language) },
            { icon: '🚪', text: t('aboutDoorways', language) },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-lg">
              <span className="text-base">{item.icon}</span>
              <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contribute CTA */}
      <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-4 text-center border border-teal-100">
        <h3 className="text-sm font-bold text-teal-800 mb-1">{t('aboutContribute', language)}</h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">{t('aboutContributeText', language)}</p>
        <Button
          onClick={() => setCurrentView('submit')}
          className="bg-teal-600 hover:bg-teal-700 text-white h-9 text-sm"
        >
          {t('navSubmit', language)}
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-400 text-center mt-4">
        {t('aboutDisclaimer', language)}
      </p>
    </div>
  );
}
