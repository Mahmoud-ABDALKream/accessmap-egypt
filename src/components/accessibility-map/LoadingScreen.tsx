'use client';

import { useEffect, useState } from 'react';
import { Accessibility } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';

interface LoadingScreenProps {
  /**
   * Full-screen overlay (default) or compact inline variant used inside the
   * map container while Leaflet boots up.
   */
  variant?: 'fullscreen' | 'inline';
  /** Optional override for the active step (0, 1, 2). Auto-cycles when omitted. */
  activeStep?: number;
}

/**
 * AccessMap Egypt themed animated loading screen.
 *
 * Visual concept:
 *  - A radar "scanning" the map for accessible places (rotating conic sweep + pulse rings)
 *  - An accessibility icon in the centre that gently bobs and pulses
 *  - Map pins orbiting the radar and dropping in sequence
 *  - A route-style progress bar with a travelling map pin
 *  - Subtle Egyptian pyramid silhouettes + a drifting map grid in the background
 *
 * Shows up while the initial `/api/places` fetch is in flight (no places yet)
 * or while the Leaflet map bundle is being dynamically imported.
 */
export default function LoadingScreen({ variant = 'fullscreen', activeStep }: LoadingScreenProps) {
  const language = useAppStore((s) => s.language);
  const isArabic = language === 'ar';

  // Cycle through the three loading steps every ~900ms to give a sense of progress.
  // If the caller passes an explicit `activeStep`, we use that directly and skip
  // the auto-cycling (no setState is needed in that case).
  const [autoStep, setAutoStep] = useState(0);
  useEffect(() => {
    if (activeStep !== undefined) return;
    const id = setInterval(() => {
      setAutoStep((prev) => (prev + 1) % 3);
    }, 900);
    return () => clearInterval(id);
  }, [activeStep]);
  const step = activeStep !== undefined ? activeStep : autoStep;

  const steps = [
    t('loadingStep1', language),
    t('loadingStep2', language),
    t('loadingStep3', language),
  ];

  return (
    <div
      className={`am-loader ${variant === 'inline' ? 'am-loader--inline' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={t('loadingStatus', language)}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background: drifting map grid + subtle landmark silhouettes */}
      {variant === 'fullscreen' && (
        <>
          <div className="am-loader__grid" aria-hidden="true" />
          {/* Pyramids silhouette — left */}
          <svg
            className="am-loader__landmark am-loader__landmark--pyramids"
            viewBox="0 0 220 110"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 110 L70 20 L140 110 Z" />
            <path d="M90 110 L150 45 L210 110 Z" opacity="0.7" />
            <rect x="0" y="104" width="220" height="6" />
          </svg>
          {/* Pyramids silhouette — right */}
          <svg
            className="am-loader__landmark am-loader__landmark--pyramids-right"
            viewBox="0 0 180 100"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 100 L60 25 L120 100 Z" />
            <path d="M100 100 L140 50 L180 100 Z" opacity="0.7" />
            <rect x="0" y="94" width="180" height="6" />
          </svg>
        </>
      )}

      <div className="am-loader__inner flex flex-col items-center">
        {/* Radar stage */}
        <div className="am-loader__stage">
          {/* Expanding pulse rings */}
          <span className="am-radar-ring" aria-hidden="true" />
          <span className="am-radar-ring am-radar-ring--2" aria-hidden="true" />
          <span className="am-radar-ring am-radar-ring--3" aria-hidden="true" />

          {/* Rotating radar sweep */}
          <span className="am-radar-sweep" aria-hidden="true" />

          {/* Orbiting map pins (two counter-rotating rings) */}
          <div className="am-orbit" aria-hidden="true">
            <div className="am-pin-wrap" style={{ transform: 'rotate(0deg) translateY(-130px)' }}>
              <span className="am-pin" style={{ animationDelay: '0.2s, 1s' }} />
            </div>
            <div className="am-pin-wrap" style={{ transform: 'rotate(180deg) translateY(-130px)' }}>
              <span className="am-pin" style={{ animationDelay: '0.5s, 1.4s' }} />
            </div>
          </div>
          <div className="am-orbit am-orbit--rev" aria-hidden="true">
            <div className="am-pin-wrap" style={{ transform: 'rotate(90deg) translateY(-130px)' }}>
              <span className="am-pin" style={{ animationDelay: '0.8s, 1.8s' }} />
            </div>
            <div className="am-pin-wrap" style={{ transform: 'rotate(270deg) translateY(-130px)' }}>
              <span className="am-pin" style={{ animationDelay: '1.1s, 2.2s' }} />
            </div>
          </div>

          {/* Central accessibility disc */}
          <div className="am-loader__disc">
            <Accessibility className="am-loader__icon" style={{ width: '46%', height: '46%' }} strokeWidth={2.2} />
          </div>
        </div>

        {/* Brand */}
        <div className="am-loader__brand">
          <h1 className="am-loader__title">{t('loadingTitle', language)}</h1>
          <p className="am-loader__subtitle">{t('loadingSubtitle', language)}</p>
        </div>

        {/* Status with animated dots */}
        <div className="am-loader__status">
          <span>{t('loadingStatus', language)}</span>
          <span className="am-loader__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>

        <p className="am-loader__hint">{t('loadingHint', language)}</p>

        {/* Route-style progress bar with travelling pin */}
        <div className="am-loader__route" aria-hidden="true">
          <span className="am-loader__route-fill" />
          <span className="am-loader__route-pin" />
        </div>

        {/* Steps indicator */}
        <div className="am-loader__steps">
          {steps.map((label, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span className={`am-step ${step === i ? 'am-step--active' : ''}`}>
                <span className="am-step__dot" />
                {label}
              </span>
              {i < steps.length - 1 && <span className="am-step__sep" />}
            </span>
          ))}
        </div>
      </div>

      <span className="sr-only">{t('loading', language)}</span>
    </div>
  );
}
