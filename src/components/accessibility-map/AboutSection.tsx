'use client';

import Image from 'next/image';
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
  Code2,
  Eye,
  Github,
} from 'lucide-react';

const stepItems = [
  { icon: Search, text: 'aboutHowItWorksText1' },
  { icon: PenLine, text: 'aboutHowItWorksText2' },
  { icon: Shield, text: 'aboutHowItWorksText3' },
  { icon: Users, text: 'aboutHowItWorksText4' },
] as const;

const criteriaItems = [
  { icon: '🦽', titleKey: 'aboutRamp', desc: 'Ramp access for wheelchair users' },
  { icon: '🛗', titleKey: 'aboutElevator', desc: 'Elevator availability and accessibility' },
  { icon: '🚻', titleKey: 'aboutBathroom', desc: 'Accessible bathroom facilities' },
  { icon: '🅿️', titleKey: 'aboutParking', desc: 'Designated accessible parking' },
  { icon: '🚪', titleKey: 'aboutDoorways', desc: 'Wide doorways for easy passage' },
] as const;

export default function AboutSection() {
  const { language, setCurrentView } = useAppStore();
  const isArabic = language === 'ar';

  return (
    <div className="view-fade-in max-w-4xl mx-auto p-4 pb-8" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Back button */}
      <button
        onClick={() => setCurrentView('map')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-600 mb-4 transition-colors group"
      >
        <ChevronLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-0.5 ${isArabic ? 'rotate-180' : ''}`} />
        {t('navMap', language)}
      </button>

      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 rounded-2xl p-8 text-center mb-8 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 p-2">
            <Image
              src="/favicon-1024.jpg"
              alt="AccessMap Egypt"
              width={60}
              height={60}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('aboutTitle', language)}</h1>
          <p className="text-teal-100 text-sm max-w-md mx-auto">
            {t('aboutMissionText', language)}
          </p>
        </div>
      </div>

      {/* Mission Card with Left Border Accent */}
      <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100 shadow-sm border-l-4 border-l-teal-500">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-50 rounded-lg">
            <Heart className="h-5 w-5 text-teal-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{t('aboutMission', language)}</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{t('aboutMissionText', language)}</p>
      </div>

      {/* How It Works - Numbered Steps */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
          <Users className="h-5 w-5 text-teal-600" />
          {t('aboutHowItWorks', language)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stepItems.map((item, i) => (
            <div
              key={i}
              className="relative flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all group"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <item.icon className="h-5 w-5 text-teal-500 mb-1.5 group-hover:text-teal-600 transition-colors" />
                <p className="text-sm text-gray-600 leading-relaxed">{t(item.text, language)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Criteria - Grid Layout */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-teal-600" />
          {t('aboutCriteria', language)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {criteriaItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all group"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1.5 group-hover:text-teal-700 transition-colors">
                {t(item.titleKey, language)}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contribute CTA - Bigger and Prominent */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-500 to-green-500 rounded-2xl p-8 text-center shadow-lg mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-2">{t('aboutContribute', language)}</h3>
          <p className="text-sm text-teal-100 leading-relaxed mb-5 max-w-md mx-auto">{t('aboutContributeText', language)}</p>
          <Button
            onClick={() => setCurrentView('submit')}
            className="bg-white text-teal-700 hover:bg-teal-50 font-semibold h-12 px-8 text-base rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {t('navSubmit', language)}
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-gray-400 text-center leading-relaxed">
        {t('aboutDisclaimer', language)}
      </p>

      {/* Creator & Branding Section */}
      <div className="mt-10 border-t border-gray-100 pt-8">
        {/* About the Creator */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100 shadow-sm border-l-4 border-l-teal-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Code2 className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{t('aboutCreatorTitle', language)}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{t('aboutCreatorText', language)}</p>
          <div className="flex items-start gap-2 bg-teal-50/50 rounded-lg p-3">
            <Eye className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
            <p className="text-sm text-teal-700 leading-relaxed font-medium">{t('aboutCreatorVision', language)}</p>
          </div>
        </div>

        {/* Built With */}
        <div className="bg-gradient-to-r from-gray-50 to-teal-50/20 rounded-xl p-5 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Github className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">{t('aboutTechTitle', language)}</h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{t('aboutTechDesc', language)}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Next.js', 'React', 'TypeScript', 'Leaflet', 'Prisma', 'shadcn/ui', 'Tailwind CSS'].map((tech) => (
              <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-medium text-gray-600">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Ownership Stamp */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <Image
              src="/favicon-1024.jpg"
              alt="AccessMap Egypt"
              width={32}
              height={32}
              className="rounded-xl shadow-md shadow-teal-200/50"
            />
            <span className="text-sm font-bold text-gray-800">{t('appName', language)}</span>
          </div>
          <p className="text-xs text-gray-400">{t('footerMadeWith', language)}</p>
          <p className="text-[10px] text-gray-300 mt-1">{t('footerCopyright', language)}</p>
          <p className="text-[10px] text-teal-500 font-medium mt-0.5">{t('footerOpenSource', language)}</p>
        </div>
      </div>
    </div>
  );
}
