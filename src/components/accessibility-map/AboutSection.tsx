'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Search,
  PenLine,
  Shield,
  Users,
  Accessibility,
  Car,
  DoorOpen,
  Bath,
  Elevator,
} from 'lucide-react';

export default function AboutSection() {
  const { language, setCurrentView } = useAppStore();
  const isArabic = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
          <Accessibility className="h-8 w-8 text-teal-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{t('aboutTitle', language)}</h1>
      </div>

      {/* Mission */}
      <Card className="mb-6 border-l-4 border-l-teal-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-teal-600" />
            {t('aboutMission', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">{t('aboutMissionText', language)}</p>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-600" />
            {t('aboutHowItWorks', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: Search, text: t('aboutHowItWorksText1', language) },
              { icon: PenLine, text: t('aboutHowItWorksText2', language) },
              { icon: Shield, text: t('aboutHowItWorksText3', language) },
              { icon: Users, text: t('aboutHowItWorksText4', language) },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="p-2 bg-teal-100 rounded-lg shrink-0">
                  <item.icon className="h-5 w-5 text-teal-600" />
                </div>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Criteria */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-teal-600" />
            {t('aboutCriteria', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: '🦽', text: t('aboutRamp', language) },
              { icon: '🛗', text: t('aboutElevator', language) },
              { icon: '🚻', text: t('aboutBathroom', language) },
              { icon: '🅿️', text: t('aboutParking', language) },
              { icon: '🚪', text: t('aboutDoorways', language) },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contribute CTA */}
      <Card className="mb-6 bg-gradient-to-br from-teal-50 to-green-50 border-teal-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-teal-800 mb-3">{t('aboutContribute', language)}</h3>
          <p className="text-gray-600 leading-relaxed mb-4">{t('aboutContributeText', language)}</p>
          <Button
            onClick={() => setCurrentView('submit')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8"
            size="lg"
          >
            {t('navSubmit', language)}
          </Button>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-center text-sm text-gray-400 mt-8 p-4 border-t border-gray-100">
        <p>{t('aboutDisclaimer', language)}</p>
      </div>
    </div>
  );
}
