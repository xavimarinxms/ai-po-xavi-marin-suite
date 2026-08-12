'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTour } from './TourProvider';
import { getToolTour, HOME_TOUR } from '@/lib/tour';

interface TourButtonProps {
  /**
   * Omit `slug` for the suite tour (landing page). Pass a tool slug and name
   * on a tool page: the button first asks the embedded tool to run its own
   * tour, and only falls back to the shell tour if the tool has none.
   */
  slug?: string;
  toolName?: string;
  label?: string;
  className?: string;
}

const BASE =
  'text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap';

/**
 * Trigger for a guided tour. Nothing runs until the user clicks it.
 *
 * On a tool page the tour that matters lives inside the tool's own app (it is
 * the only code that can highlight the tool's form, sample-data button and
 * results). We post `po-tour:start` into the iframe and wait briefly for a
 * `po-tour:ready` answer; if the tool is an older build with no tour, the
 * shell tour runs instead so the button is never a dead end.
 */
export default function TourButton({ slug, toolName, label, className }: TourButtonProps) {
  const { startTour } = useTour();
  const answered = useRef(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { type?: string; hasTour?: boolean } | null;
      if (data?.type === 'po-tour:ready' && data.hasTour !== false) answered.current = true;
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const handleClick = useCallback(() => {
    if (!slug) {
      startTour(HOME_TOUR);
      return;
    }

    const iframe = document.querySelector<HTMLIFrameElement>('iframe[data-tour-target]');
    if (!iframe?.contentWindow) {
      startTour(getToolTour(slug, toolName ?? ''));
      return;
    }

    answered.current = false;
    iframe.contentWindow.postMessage({ type: 'po-tour:start' }, '*');
    window.setTimeout(() => {
      if (!answered.current) startTour(getToolTour(slug, toolName ?? ''));
    }, 500);
  }, [slug, toolName, startTour]);

  return (
    <button type="button" onClick={handleClick} className={className ?? BASE}>
      {label ?? (slug ? 'Tour this tool' : 'Take the tour')}
    </button>
  );
}
