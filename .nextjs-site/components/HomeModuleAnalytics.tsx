'use client';

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

import { HomeAnalyticsEvents, type HomeModule } from '@/lib/analytics';
import { getReadingHistory } from '@/lib/reading-state';

interface HomeModuleAnalyticsProps {
  module: HomeModule;
  children: ReactNode;
}

function hasReadingHistory(): boolean {
  return getReadingHistory().length > 0;
}

export function useHomeModuleImpression<T extends HTMLElement>(module: HomeModule) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let impressionTimer: number | undefined;
    let hasTrackedImpression = false;

    const trackImpression = () => {
      if (hasTrackedImpression) return;
      hasTrackedImpression = true;
      HomeAnalyticsEvents.trackModuleImpression(module, {
        hasReadingHistory: hasReadingHistory(),
      });
    };

    if (!('IntersectionObserver' in window)) {
      trackImpression();
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry || hasTrackedImpression) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          window.clearTimeout(impressionTimer);
          impressionTimer = window.setTimeout(trackImpression, 600);
        } else {
          window.clearTimeout(impressionTimer);
        }
      },
      { threshold: [0.25], rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(element);
    return () => {
      window.clearTimeout(impressionTimer);
      observer.disconnect();
    };
  }, [module]);

  return elementRef;
}

export function trackHomeModuleClick(
  module: HomeModule,
  options: { position?: number; itemSlug?: string } = {}
) {
  HomeAnalyticsEvents.trackModuleClick(module, {
    ...options,
    hasReadingHistory: hasReadingHistory(),
  });
}

export default function HomeModuleAnalytics({ module, children }: HomeModuleAnalyticsProps) {
  const containerRef = useHomeModuleImpression<HTMLDivElement>(module);

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const interactive = target.closest<HTMLElement>('a, button, [data-home-module]');
    if (!interactive || !containerRef.current?.contains(interactive)) return;
    if (interactive.dataset.homeAnalyticsDirect === 'true') return;

    const eventModule = (interactive.dataset.homeModule || module) as HomeModule;
    const rawPosition = interactive.dataset.homePosition;
    const position = rawPosition ? Number.parseInt(rawPosition, 10) : undefined;

    trackHomeModuleClick(eventModule, {
      position: Number.isFinite(position) ? position : undefined,
      itemSlug: interactive.dataset.homeItemSlug,
    });
  };

  return (
    <div ref={containerRef} onClickCapture={handleClickCapture}>
      {children}
    </div>
  );
}
