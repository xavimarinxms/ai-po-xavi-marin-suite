import type { Tool, Phase, PhaseStyle } from '@/types';

/**
 * Tool registry — the single source of truth for the whole suite.
 *
 * Each tool lives in its own Next.js project (sibling folder in this repo) and
 * is deployed independently. The suite loads it into the content area, so the
 * only thing the shell needs to know is where each tool is reachable.
 *
 * URLs come from NEXT_PUBLIC_* env vars. Next.js inlines these at build time,
 * which is why each one is referenced statically instead of via a dynamic key.
 * If a var is missing the tool renders a friendly "not deployed yet" state
 * instead of an empty iframe — see components/ToolFrame.tsx.
 *
 * Local dev: point each var at the port that tool runs on (see .env.example).
 * Production: point each var at its subdomain, e.g. https://rice.xavimarin.net
 */

const env = (value: string | undefined): string => value?.trim() ?? '';

export const TOOLS: Tool[] = [
  // ---------------------------------------------------------------- Discovery
  {
    slug: 'feedback-synthesizer',
    name: 'Feedback Synthesizer',
    shortName: 'Feedback Synth',
    description:
      'Upload a CSV of user responses and extract patterns, pain points and opportunities with AI.',
    phase: 'Discovery',
    icon: 'messages',
    url: env(process.env.NEXT_PUBLIC_TOOL_FEEDBACK_SYNTHESIZER),
    repoFolder: 'feedback-synthesizer',
  },
  {
    slug: 'interview-insights',
    name: 'Interview Insights Extractor',
    shortName: 'Interview Insights',
    description:
      'Paste a user interview transcript and get actionable insights, quotes and themes in seconds.',
    phase: 'Discovery',
    icon: 'microphone',
    url: env(process.env.NEXT_PUBLIC_TOOL_INTERVIEW_INSIGHTS),
    repoFolder: 'interview-insights',
  },
  {
    slug: 'competitor-monitor',
    name: 'Competitor Monitor',
    shortName: 'Competitor Monitor',
    description:
      'Track changes on competitor websites and get a digest of what is relevant to your product.',
    phase: 'Discovery',
    icon: 'eye',
    url: env(process.env.NEXT_PUBLIC_TOOL_COMPETITOR_MONITOR),
    repoFolder: 'competitor-monitor',
  },

  // --------------------------------------------------------------- Definition
  {
    slug: 'user-stories-generator',
    name: 'User Story Generator',
    shortName: 'User Stories',
    description:
      'Turn features into structured user stories with acceptance criteria, ready for sprint planning.',
    phase: 'Definition',
    icon: 'fileText',
    url: env(process.env.NEXT_PUBLIC_TOOL_USER_STORIES),
    repoFolder: 'user-stories-generator',
  },
  {
    slug: 'prd-builder',
    name: 'PRD Builder',
    shortName: 'PRD Builder',
    description:
      'Generate structured Product Requirements Documents from a plain-language brief in seconds.',
    phase: 'Definition',
    icon: 'layoutList',
    url: env(process.env.NEXT_PUBLIC_TOOL_PRD_BUILDER),
    repoFolder: 'prd-builder',
  },
  {
    slug: 'story-map-builder',
    name: 'Story Map Builder',
    shortName: 'Story Map',
    description:
      'Build a user story map that shows the whole journey, then slice it into releasable increments.',
    phase: 'Definition',
    icon: 'map',
    url: env(process.env.NEXT_PUBLIC_TOOL_STORY_MAP),
    repoFolder: 'story-map-builder',
  },

  // ----------------------------------------------------------- Prioritization
  {
    slug: 'rice-jira',
    name: 'RICE / MoSCoW Calculator',
    shortName: 'RICE / MoSCoW',
    description:
      'Score and rank your backlog with the most widely used PM prioritization frameworks.',
    phase: 'Prioritization',
    icon: 'chartBar',
    url: env(process.env.NEXT_PUBLIC_TOOL_RICE_JIRA),
    repoFolder: 'rice-jira',
  },

  // ----------------------------------------------------------------- Delivery
  {
    slug: 'stakeholder-updates',
    name: 'Stakeholder Update Generator',
    shortName: 'Stakeholder Updates',
    description:
      'Convert sprint status into a clear, executive-friendly update for non-technical stakeholders.',
    phase: 'Delivery',
    icon: 'send',
    url: env(process.env.NEXT_PUBLIC_TOOL_STAKEHOLDER_UPDATES),
    repoFolder: 'stakeholder-updates',
  },
  {
    slug: 'release-notes-generator',
    name: 'Release Notes Generator',
    shortName: 'Release Notes',
    description:
      'Turn a list of merged tickets into release notes your users will actually understand.',
    phase: 'Delivery',
    icon: 'notes',
    url: env(process.env.NEXT_PUBLIC_TOOL_RELEASE_NOTES),
    repoFolder: 'release-notes-generator',
  },

  // -------------------------------------------------------------- Measurement
  {
    slug: 'metrics-dashboard',
    name: 'Product Metrics Dashboard',
    shortName: 'Metrics Dashboard',
    description:
      'Visualize your key product metrics in a clean dashboard — no BI tool or SQL knowledge needed.',
    phase: 'Measurement',
    icon: 'chartLine',
    url: env(process.env.NEXT_PUBLIC_TOOL_METRICS_DASHBOARD),
    repoFolder: 'metrics-dashboard',
  },
  {
    slug: 'okr-generator',
    name: 'OKR Generator',
    shortName: 'OKR Generator',
    description:
      'Turn a fuzzy strategic goal into objectives and measurable key results with clear targets.',
    phase: 'Measurement',
    icon: 'target',
    url: env(process.env.NEXT_PUBLIC_TOOL_OKR_GENERATOR),
    repoFolder: 'okr-generator',
  },

  // --------------------------------------------------------------- Validation
  {
    slug: 'hypothesis-validator',
    name: 'A/B Hypothesis Validator',
    shortName: 'A/B Validator',
    description:
      'Design experiments, calculate statistical significance and document what you learned.',
    phase: 'Validation',
    icon: 'testPipe',
    url: env(process.env.NEXT_PUBLIC_TOOL_HYPOTHESIS_VALIDATOR),
    repoFolder: 'hypothesis-validator',
  },
  {
    slug: 'feature-validation-canvas',
    name: 'Feature Validation Canvas',
    shortName: 'Validation Canvas',
    description:
      'Pressure-test a feature idea against desirability, viability and feasibility before you build it.',
    phase: 'Validation',
    icon: 'checklist',
    url: env(process.env.NEXT_PUBLIC_TOOL_VALIDATION_CANVAS),
    repoFolder: 'feature-validation-canvas',
  },
];

/** Canonical phase order — used by the sidebar and the filter chips. */
export const PHASE_ORDER: Phase[] = [
  'Discovery',
  'Definition',
  'Prioritization',
  'Delivery',
  'Measurement',
  'Validation',
];

/**
 * Visual language per phase. Defined once so the sidebar dot, the card icon
 * and the badge can never drift out of sync.
 */
export const PHASE_STYLES: Record<Phase, PhaseStyle> = {
  Discovery: {
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    icon: 'bg-violet-50 text-violet-600',
    dot: 'bg-violet-500',
  },
  Definition: {
    badge: 'bg-brand-50 text-brand-700 border-brand-200',
    icon: 'bg-brand-50 text-brand-600',
    dot: 'bg-brand-500',
  },
  Prioritization: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'bg-amber-50 text-amber-600',
    dot: 'bg-amber-500',
  },
  Delivery: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'bg-emerald-50 text-emerald-600',
    dot: 'bg-emerald-500',
  },
  Measurement: {
    badge: 'bg-green-50 text-green-700 border-green-200',
    icon: 'bg-green-50 text-green-600',
    dot: 'bg-green-500',
  },
  Validation: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: 'bg-rose-50 text-rose-600',
    dot: 'bg-rose-500',
  },
};

/** Look up a single tool by its URL slug. Returns undefined if not found. */
export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

/** Group tools by phase, preserving PHASE_ORDER and skipping empty phases. */
export function getToolsByPhase(): { phase: Phase; tools: Tool[] }[] {
  return PHASE_ORDER.map((phase) => ({
    phase,
    tools: TOOLS.filter((tool) => tool.phase === phase),
  })).filter((group) => group.tools.length > 0);
}

/** Count of tools per phase, used for the filter chip counters. */
export function getPhaseCounts(): Record<string, number> {
  const counts: Record<string, number> = { all: TOOLS.length };
  PHASE_ORDER.forEach((phase) => {
    counts[phase] = TOOLS.filter((tool) => tool.phase === phase).length;
  });
  return counts;
}

/** How many tools actually have a URL configured. Drives the landing stats. */
export function getLiveToolCount(): number {
  return TOOLS.filter((tool) => tool.url !== '').length;
}
