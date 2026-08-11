/**
 * Shared types for the AI PO Suite shell.
 * The suite is a navigation shell: it does not implement tool logic itself,
 * it loads each tool (its own Next.js app) into the content area.
 */

/** Phases of the product lifecycle a tool can belong to. */
export type Phase =
  | 'Discovery'
  | 'Definition'
  | 'Prioritization'
  | 'Delivery'
  | 'Measurement'
  | 'Validation';

/**
 * Deployment state of a tool.
 * - 'live'    -> a URL is configured, the tool loads inside the suite
 * - 'local'   -> only reachable on localhost during development
 * - 'planned' -> not built yet, shown greyed out in the sidebar
 */
export type ToolStatus = 'live' | 'local' | 'planned';

export interface Tool {
  /** URL segment: /tools/<slug> */
  slug: string;
  /** Display name shown in the sidebar and cards */
  name: string;
  /** Short name used in the sidebar where space is tight */
  shortName: string;
  /** One-line value proposition shown on the landing grid */
  description: string;
  /** Product lifecycle phase, used for grouping and filtering */
  phase: Phase;
  /** Key of the icon in components/icons.tsx */
  icon: string;
  /**
   * Public URL of the deployed tool. Resolved at build time from env vars
   * so the same code works in local dev (localhost ports) and production
   * (subdomains of xavimarin.net). Empty string means "not configured".
   */
  url: string;
  /** Folder name of the tool in the repo, shown in the not-deployed state */
  repoFolder: string;
}

/** Visual treatment per phase. Kept in one place so colors never drift. */
export interface PhaseStyle {
  /** Badge classes: background + text + border */
  badge: string;
  /** Icon container classes: background + text */
  icon: string;
  /** Solid dot color used in the sidebar */
  dot: string;
}
