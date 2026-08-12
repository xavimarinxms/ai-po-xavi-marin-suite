'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { TourContextValue, TourStep } from '@/types/tour';

const TourContext = createContext<TourContextValue | null>(null);

/** Access the tour from any client component below the provider. */
export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used inside <TourProvider>');
  return ctx;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TOOLTIP_WIDTH = 340;
const TOOLTIP_HEIGHT = 210;
const SPOT_PADDING = 8;
const MARGIN = 16;

function findTarget(step: TourStep | undefined): HTMLElement | null {
  if (!step?.target) return null;
  return document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
}

/**
 * Guided tour overlay: a spotlight cut out of a dimmed backdrop plus a
 * tooltip that follows the highlighted element.
 *
 * Deliberately not persisted — a tour only runs when the user asks for it
 * (see components/tour/TourButton.tsx). No cookies, no localStorage, no
 * "first visit" heuristics that fire at the wrong moment.
 */
export default function TourProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const frame = useRef<number | null>(null);

  const isRunning = steps.length > 0;
  const step = isRunning ? steps[Math.min(index, steps.length - 1)] : undefined;

  const stopTour = useCallback(() => {
    setSteps([]);
    setIndex(0);
    setRect(null);
  }, []);

  const startTour = useCallback((next: TourStep[]) => {
    if (!next.length) return;
    setSteps(next);
    setIndex(0);
    setRect(null);
  }, []);

  /**
   * Measure the step's target. The index is passed explicitly rather than
   * read from state so a measurement scheduled from an event handler cannot
   * race the state update it was queued alongside.
   */
  const measure = useCallback(
    (list: TourStep[], i: number) => {
      const el = findTarget(list[i]);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      // Bring the target into view without scrollIntoView, which fights
      // sticky headers and can scroll the wrong scroll container.
      if (r.top < MARGIN || r.bottom > window.innerHeight - MARGIN) {
        window.scrollTo({
          top: window.scrollY + r.top - window.innerHeight / 2 + r.height / 2,
          behavior: 'smooth',
        });
        window.setTimeout(() => {
          const after = el.getBoundingClientRect();
          setRect({ top: after.top, left: after.left, width: after.width, height: after.height });
        }, 320);
        return;
      }
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    },
    [],
  );

  const scheduleMeasure = useCallback(
    (list: TourStep[], i: number) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() =>
        requestAnimationFrame(() => measure(list, i)),
      );
    },
    [measure],
  );

  const goTo = useCallback(
    (next: number) => {
      if (next >= steps.length) {
        stopTour();
        return;
      }
      const i = Math.max(0, next);
      setIndex(i);
      scheduleMeasure(steps, i);
    },
    [steps, stopTour, scheduleMeasure],
  );

  useLayoutEffect(() => {
    setViewport({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    scheduleMeasure(steps, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      measure(steps, index);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stopTour();
      if (e.key === 'ArrowRight' || e.key === 'Enter') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
    };
  }, [isRunning, steps, index, measure, goTo, stopTour]);

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  const value = useMemo<TourContextValue>(
    () => ({ startTour, stopTour, isRunning }),
    [startTour, stopTour, isRunning],
  );

  const tooltipPosition = (): { top: number; left: number } => {
    if (!rect) {
      return {
        top: Math.max(MARGIN, viewport.h / 2 - TOOLTIP_HEIGHT / 2),
        left: Math.max(MARGIN, viewport.w / 2 - TOOLTIP_WIDTH / 2),
      };
    }
    const place = step?.place ?? 'bottom';
    let top = rect.top + rect.height + 18;
    let left = rect.left;

    if (place === 'right') {
      left = rect.left + rect.width + 20;
      top = rect.top;
    } else if (place === 'left') {
      left = rect.left - TOOLTIP_WIDTH - 20;
      top = rect.top;
    } else if (place === 'top') {
      top = rect.top - TOOLTIP_HEIGHT - 18;
    }

    if (left + TOOLTIP_WIDTH > viewport.w - MARGIN) left = viewport.w - TOOLTIP_WIDTH - MARGIN;
    if (left < MARGIN) left = MARGIN;
    if (top + TOOLTIP_HEIGHT > viewport.h - MARGIN) top = viewport.h - TOOLTIP_HEIGHT - MARGIN;
    if (top < MARGIN) top = MARGIN;

    return { top: Math.round(top), left: Math.round(left) };
  };

  const tip = tooltipPosition();
  const isLast = index >= steps.length - 1;

  return (
    <TourContext.Provider value={value}>
      {children}

      {isRunning && step && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Guided tour">
          {/* Backdrop. With a target, the dim comes from the spotlight's
              outer shadow so the highlighted element stays fully lit. */}
          <div
            onClick={stopTour}
            className={`absolute inset-0 ${rect ? '' : 'bg-gray-900/60'}`}
          />

          {rect && (
            <div
              className="absolute rounded-2xl border-2 border-brand-500 pointer-events-none transition-all duration-300 ease-out"
              style={{
                top: rect.top - SPOT_PADDING,
                left: rect.left - SPOT_PADDING,
                width: rect.width + SPOT_PADDING * 2,
                height: rect.height + SPOT_PADDING * 2,
                boxShadow: '0 0 0 9999px rgba(17, 24, 39, 0.6)',
              }}
            />
          )}

          <div
            className="absolute w-[340px] bg-white border border-gray-200 rounded-2xl p-5 shadow-xl transition-all duration-300 ease-out"
            style={{ top: tip.top, left: tip.left }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                {step.kicker}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                {index + 1} / {steps.length}
              </span>
            </div>

            <p className="mt-2.5 text-[15px] font-bold text-gray-900 leading-snug">{step.title}</p>
            <p className="mt-1.5 text-[13px] text-gray-600 leading-relaxed">{step.body}</p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      i === index ? 'w-4 bg-brand-500' : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={stopTour}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 px-1.5 py-1.5 transition-colors"
                >
                  Skip
                </button>
                {index > 0 && (
                  <button
                    onClick={() => goTo(index - 1)}
                    className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => goTo(index + 1)}
                  className="text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg px-3.5 py-1.5 transition-colors whitespace-nowrap"
                >
                  {isLast ? 'Get started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TourContext.Provider>
  );
}
