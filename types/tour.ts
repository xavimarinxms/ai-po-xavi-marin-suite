/** Types for the guided tours. See lib/tour.ts for the content. */

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TourStep {
  /**
   * Value of the [data-tour="..."] attribute this step highlights.
   * Omit for a centred step with no spotlight (welcome / closing steps).
   * If the element is not in the DOM the step is skipped automatically.
   */
  target?: string;
  /** Small uppercase label above the title, e.g. "Step 2". */
  kicker: string;
  title: string;
  body: string;
  /** Preferred tooltip side. Defaults to 'bottom'. */
  place?: TourPlacement;
}

export interface TourContextValue {
  /** Start a tour. Passing an empty array is a no-op. */
  startTour: (steps: TourStep[]) => void;
  stopTour: () => void;
  isRunning: boolean;
}
