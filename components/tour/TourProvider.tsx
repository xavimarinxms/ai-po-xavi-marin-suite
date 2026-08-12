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
  /** The target's own corner radius, so the ring is framed to its shape. */
  radius: number;
}

const TOOLTIP_WIDTH = 340;
const FALLBACK_TOOLTIP_HEIGHT = 210;
const MARGIN = 16;
const GAP = 16;

type Side = 'top' | 'bottom' | 'left' | 'right';
const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, Math.max(lo, hi)));

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
  const [tooltipHeight, setTooltipHeight] = useState(FALLBACK_TOOLTIP_HEIGHT);
  const frame = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

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
      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      // Bring a partially visible target fully into view before measuring,
      // otherwise the ring clamps against the edge and crops the element it
      // is framing. Instant, not smooth: a smooth scroll would still be
      // running when we re-read the rect. Pinned elements (sticky header,
      // fixed bars) are skipped — scrolling moves the page but not them,
      // which only knocks the ring out of place.
      let pinned = false;
      for (let node: HTMLElement | null = el; node && node !== document.body; node = node.parentElement) {
        const pos = getComputedStyle(node).position;
        if (pos === 'fixed' || pos === 'sticky') {
          pinned = true;
          break;
        }
      }
      if (!pinned && (r.top < 60 || r.bottom > window.innerHeight - 24)) {
        window.scrollTo(
          0,
          Math.max(0, window.scrollY + r.top - (window.innerHeight - r.height) / 2),
        );
        const a = el.getBoundingClientRect();
        setRect({ top: a.top, left: a.left, width: a.width, height: a.height, radius });
        return;
      }
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height, radius });
    },
    [],
  );

  /**
   * rAF alone is unreliable in a throttled or offscreen frame (the suite
   * embeds tools in an iframe), so a timer backs it up. Measuring twice is
   * harmless. The index is passed explicitly so a queued measurement cannot
   * race the state update it was scheduled alongside.
   */
  const scheduleMeasure = useCallback(
    (list: TourStep[], i: number) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      if (timer.current) window.clearTimeout(timer.current);
      frame.current = requestAnimationFrame(() =>
        requestAnimationFrame(() => measure(list, i)),
      );
      timer.current = window.setTimeout(() => measure(list, i), 60);
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
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const value = useMemo<TourContextValue>(
    () => ({ startTour, stopTour, isRunning }),
    [startTour, stopTour, isRunning],
  );

  /** Measure the card so tall copy never gets clamped over its own target. */
  useLayoutEffect(() => {
    if (!tooltipRef.current) return;
    const h = tooltipRef.current.getBoundingClientRect().height;
    if (h && Math.abs(h - tooltipHeight) > 1) setTooltipHeight(h);
  });

  /**
   * The ring, clamped to the viewport: a target taller than the screen (the
   * sidebar, the tool surface) still reads as a framed region.
   */
  const padding = rect && (rect.height > viewport.h * 0.6 || rect.width > viewport.w * 0.6) ? 4 : 8;
  const ring = rect
    ? {
        top: Math.max(MARGIN / 2, rect.top - padding),
        left: Math.max(MARGIN / 2, rect.left - padding),
        right: Math.min(viewport.w - MARGIN / 2, rect.left + rect.width + padding),
        bottom: Math.min(viewport.h - MARGIN / 2, rect.top + rect.height + padding),
      }
    : null;

  /**
   * Pick the side that actually has room for the card, rather than clamping
   * a fixed side back into the viewport — clamping is what used to drop the
   * tooltip on top of the element it was pointing at.
   */
  const tooltipPosition = (): { top: number; left: number } => {
    if (!ring) {
      return {
        top: Math.max(MARGIN, viewport.h / 2 - tooltipHeight / 2),
        left: Math.max(MARGIN, viewport.w / 2 - TOOLTIP_WIDTH / 2),
      };
    }

    const room: Record<Side, number> = {
      right: viewport.w - ring.right - GAP - MARGIN,
      left: ring.left - GAP - MARGIN,
      bottom: viewport.h - ring.bottom - GAP - MARGIN,
      top: ring.top - GAP - MARGIN,
    };
    const preferred = (step?.place ?? 'bottom') as Side;
    const order: Side[] = [preferred, OPPOSITE[preferred], 'bottom', 'top', 'right', 'left'];
    const fits = (s: Side) => (s === 'left' || s === 'right' ? room[s] >= TOOLTIP_WIDTH : room[s] >= tooltipHeight);

    const place = (s: Side) => {
      let top: number;
      let left: number;
      if (s === 'right') {
        left = ring.right + GAP;
        top = clamp(ring.top, MARGIN, viewport.h - tooltipHeight - MARGIN);
      } else if (s === 'left') {
        left = ring.left - GAP - TOOLTIP_WIDTH;
        top = clamp(ring.top, MARGIN, viewport.h - tooltipHeight - MARGIN);
      } else if (s === 'top') {
        top = ring.top - GAP - tooltipHeight;
        left = clamp(ring.left, MARGIN, viewport.w - TOOLTIP_WIDTH - MARGIN);
      } else {
        top = ring.bottom + GAP;
        left = clamp(ring.left, MARGIN, viewport.w - TOOLTIP_WIDTH - MARGIN);
      }
      return {
        side: s,
        top: clamp(top, MARGIN, viewport.h - tooltipHeight - MARGIN),
        left: clamp(left, MARGIN, viewport.w - TOOLTIP_WIDTH - MARGIN),
      };
    };

    const overlap = (p: { top: number; left: number }) =>
      Math.max(0, Math.min(p.left + TOOLTIP_WIDTH, ring.right) - Math.max(p.left, ring.left)) *
      Math.max(0, Math.min(p.top + tooltipHeight, ring.bottom) - Math.max(p.top, ring.top));

    // When a side genuinely fits, use it. When none does (short viewport,
    // large target — the common case inside the suite's iframe) pick the
    // candidate that covers the target the least, rather than clamping a
    // preferred side back on top of it.
    const fitting = order.find(fits);
    const pos = fitting
      ? place(fitting)
      : (['bottom', 'top', 'right', 'left'] as Side[])
          .map(place)
          .sort((a, b) => overlap(a) - overlap(b) || room[b.side] - room[a.side])[0];

    return { top: Math.round(pos.top), left: Math.round(pos.left) };
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

          {ring && (
            <div
              className="absolute border-2 border-brand-500 pointer-events-none transition-all duration-300 ease-out"
              style={{
                top: ring.top,
                left: ring.left,
                width: ring.right - ring.left,
                height: ring.bottom - ring.top,
                borderRadius: Math.min((rect?.radius ?? 6) + padding, (ring.bottom - ring.top) / 2),
                boxShadow: '0 0 0 9999px rgba(17, 24, 39, 0.6)',
              }}
            />
          )}

          <div
            ref={tooltipRef}
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
