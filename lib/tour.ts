import type { TourStep } from '@/types/tour';

/**
 * Tour content — the single source of truth for every guided walkthrough.
 *
 * Two levels:
 *  - HOME_TOUR: how to move around the suite (landing page).
 *  - TOOL_TOURS: one short tour per tool, rendered over the suite shell.
 *
 * Note on scope: every tool runs as its own Next.js app inside an iframe
 * (see components/ToolFrame.tsx), so the shell cannot highlight elements
 * *inside* a tool. Tool tours therefore explain the tool while pointing at
 * the shell affordances around it — sidebar entry, the tool surface, the
 * open-in-new-tab actions and full screen. If a tool later needs an in-app
 * tour, it ships inside that tool's own repo using the same TourProvider.
 *
 * Targets are matched with [data-tour="<key>"]. A step whose target is not
 * present in the DOM is skipped automatically, so the same tour survives
 * responsive layouts where an element is hidden.
 */

export const HOME_TOUR: TourStep[] = [
  {
    kicker: 'Welcome',
    title: '12 PO tools, one shell',
    body:
      'A 30-second tour of how to move around the suite: filter by product phase, open a tool and work with it without leaving this page.',
  },
  {
    target: 'filters',
    kicker: 'Step 1',
    title: 'Filter the catalogue by phase',
    body:
      'Discovery, Definition, Prioritization, Delivery, Measurement and Validation. When you know where you are in the cycle but not which tool you need, filter and keep only what is relevant.',
  },
  {
    target: 'tool-card',
    kicker: 'Step 2',
    title: 'Each card states the work it saves you',
    body:
      'Phase, what the tool does and the output it produces. Open one and it loads inside the suite with sample data ready, so you can see the result before typing anything.',
  },
  {
    target: 'nav-cta',
    kicker: 'Step 3',
    title: 'No login, nothing stored',
    body:
      'Every tool is free and runs without an account. Open one from here and its own short tour will walk you through it.',
    place: 'left',
  },
  {
    target: 'roadmap-link',
    kicker: 'Step 4',
    title: 'The roadmap is public',
    body:
      'What is planned and what is still being considered, for the shell and for each tool. It is the same roadmap I prioritize from.',
    place: 'left',
  },
];

/** Per-tool copy. Keys are tool slugs from lib/tools.ts. */
interface ToolTourCopy {
  /** Opening step: what this tool is for, in one sentence. */
  intro: string;
  /** Shown on the tool surface step: how to actually use it. */
  howToUse: string;
}

export const TOOL_TOURS: Record<string, ToolTourCopy> = {
  'interview-insights': {
    intro:
      'Turns a raw user interview into insights, verbatim quotes and recurring themes you can bring to a prioritization discussion.',
    howToUse:
      'Paste the transcript, add product context if you have it, and extract. Every insight keeps the quote and timestamp it came from, so it stays defensible.',
  },
  'competitor-monitor': {
    intro:
      'Tracks changes on competitor websites and gives you a digest of what actually matters to your product.',
    howToUse:
      'Add the URLs you care about and pick what counts as a relevant change — pricing, positioning, new features. The digest ignores the rest.',
  },
  'user-stories-generator': {
    intro:
      'Splits a feature description into sprint-ready user stories with acceptance criteria.',
    howToUse:
      'Describe the feature once. Choose the story format and detail level, then export straight to your tracker with criteria intact.',
  },
  'prd-builder': {
    intro:
      'Turns a plain-language brief into a structured PRD: problem, scope, non-goals, requirements and open questions.',
    howToUse:
      'Describe the feature the way you would explain it to a colleague. Target user and success metric are what keep the draft from being generic.',
  },
  'story-map-builder': {
    intro:
      'Builds a user story map of the whole journey, then slices it into releasable increments.',
    howToUse:
      'Start from the user activities, add the steps underneath, and cut horizontal slices until each one is a release you would actually ship.',
  },
  'rice-jira': {
    intro:
      'Scores and ranks your backlog with RICE, and re-cuts the same list as MoSCoW when numbers are not the right language.',
    howToUse:
      'One item per line, or paste a CSV straight out of Jira. Missing scores are estimated and flagged as low confidence, and the arithmetic behind each position stays visible.',
  },
  'stakeholder-updates': {
    intro:
      'Converts sprint status into an update a non-technical stakeholder will actually read.',
    howToUse:
      'Paste the board summary as it is. Audience and tone decide how much translation the draft does; blockers always come out with an owner and a date.',
  },
  'release-notes-generator': {
    intro:
      'Turns a list of merged tickets into release notes written for users, not for the team that closed them.',
    howToUse:
      'Paste the tickets, pick the audience, and the notes come back grouped by what changed for the user rather than by component.',
  },
  'metrics-dashboard': {
    intro:
      'Visualizes your key product metrics in a clean dashboard, with no BI tool and no SQL.',
    howToUse:
      'Connect a source or upload a CSV, choose the metrics that matter and the dashboard renders trends against the baseline you set.',
  },
  'okr-generator': {
    intro:
      'Turns a fuzzy strategic goal into an objective and key results you can actually grade at the end of the quarter.',
    howToUse:
      'State the goal in plain language. A baseline is optional but it is what makes the targets arguable — each KR comes with a source and a counter-metric.',
  },
  'hypothesis-validator': {
    intro:
      'Designs experiments, calculates statistical significance and documents what you learned.',
    howToUse:
      'Define the hypothesis and the metric first, then enter the results. It tells you whether you can call it, and what sample size you still need.',
  },
  'feature-validation-canvas': {
    intro:
      'Pressure-tests a feature idea against desirability, viability and feasibility before anyone builds it.',
    howToUse:
      'Answer the prompts on each axis. Weak spots are surfaced as the assumptions you should test first, not as a verdict.',
  },
};

/**
 * Build the tour for a tool page. Shared structure, per-tool copy.
 * `toolName` is passed in so the welcome step reads naturally.
 */
export function getToolTour(slug: string, toolName: string): TourStep[] {
  const copy = TOOL_TOURS[slug];
  if (!copy) return [];

  return [
    {
      kicker: 'Welcome',
      title: toolName,
      body: copy.intro,
    },
    {
      target: 'sidebar',
      kicker: 'Step 1',
      title: 'The sidebar is always one click away',
      body:
        'Tools are grouped by product phase and the dot colour matches the phase badge. Switching tools never takes you back to the index.',
      place: 'right',
    },
    {
      target: 'tool-surface',
      kicker: 'Step 2',
      title: 'How to use it',
      body: copy.howToUse,
      place: 'left',
    },
    {
      target: 'tool-actions',
      kicker: 'Step 3',
      title: 'Open it standalone when you need room',
      body:
        '"About this tool" explains the problem it solves and its own roadmap. "Open in new tab" runs it full size, outside the suite.',
      place: 'left',
    },
    {
      target: 'fullscreen',
      kicker: 'Step 4',
      title: 'Hide the sidebar for a wider canvas',
      body:
        'Full screen gives the tool the whole viewport. Nothing is stored on the server, so you can close the tab whenever you are done.',
      place: 'left',
    },
  ];
}
