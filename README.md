# AI PO Xavi Marín Suite

A navigation shell that unifies 13 AI-powered Product Owner tools into a single product. It does not reimplement any tool's logic — each tool stays its own independent Next.js app; the suite loads it inside an iframe behind a persistent, phase-grouped sidebar.

Built by [Xavi Marín](https://xavimarin.net) as the entry point for his Product Builder portfolio.

**Problem:** repetitive PO work steals time that should go to strategy.
**Solution:** a suite of AI tools that automate that load, built and used daily by a real PM.
**Impact:** hours become seconds on user stories, PRDs and stakeholder updates.

## How it works

- `/` — landing page with a phase filter and a 3-column grid of all 13 tools.
- `/tools/[slug]` — the shell: sidebar (grouped by Discovery / Definition / Prioritization / Delivery / Measurement / Validation) + the tool loaded in an iframe.
- Each tool's URL comes from a `NEXT_PUBLIC_TOOL_*` environment variable. If a variable is empty, that tool shows a "not deployed yet" card instead of a broken iframe — so you can deploy tools one at a time.
- The top bar has a **full screen** toggle that hides the sidebar so a tool gets the whole viewport. On mobile, the sidebar is a drawer opened from a hamburger button.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS, no UI component library
- No AI calls, no external dependencies beyond Next/React — the suite is pure navigation
- Zero cost to host

## Local development

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000` by default.

### Running tools alongside the suite

Each tool is a separate app in a sibling folder (`../user-stories-generator`, `../rice-jira`, etc). To see them inside the suite locally, run each one on its own port and point the matching env var at it:

```bash
cd ../user-stories-generator && npm run dev -- -p 3004
```

Then in `.env.local`:

```
NEXT_PUBLIC_TOOL_USER_STORIES=http://localhost:3004
```

See `.env.example` for the full list of variables — one per tool, with the suggested local port.

## Required patch on each individual tool (for clean embedding)

The suite requests each tool with `?embed=1` appended to the URL. Each tool's own `Header.tsx` (and `Footer.tsx`, if present) should read that query param and skip rendering its own nav/footer chrome when it's set, so you don't get two headers stacked on top of each other inside the iframe.

Example patch, in each tool's `components/Header.tsx`:

```tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function Header() {
  const params = useSearchParams();
  if (params.get('embed') === '1') return null;
  // ...existing header markup
}
```

This is a 5-minute change per tool and is not required for the suite shell itself to work — without it, a tool just shows its own header on top of the suite's header when opened inside the frame.

Also recommended once a tool is deployed: allow it to be framed only by your own domain, by adding response headers in that tool's `next.config.js`:

```js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://suite.xavimarin.net https://*.xavimarin.net" },
      ],
    },
  ];
}
```

## Deploying to Vercel

1. Push this repo (or this folder as its own repo) to GitHub.
2. In Vercel, **New Project** → import the repo.
3. Framework preset: Next.js (auto-detected). No build command changes needed.
4. Add the environment variables from `.env.example`, pointing each `NEXT_PUBLIC_TOOL_*` at that tool's production subdomain once it's deployed (e.g. `https://rice.xavimarin.net`). Leave any not-yet-deployed tool's variable empty — it will show the "not deployed yet" state instead of breaking the build.
5. Deploy. Suggested subdomain for the suite itself: `suite.xavimarin.net` or `ai-po.xavimarin.net`.
6. Deploy is also possible from the CLI: `vercel deploy` from this folder, once linked with `vercel link`.

No other environment variables, database, or paid API are required — the suite itself makes no external calls.

## Project structure

```
app/
  layout.tsx            # Inter font, metadata, branding
  page.tsx               # Landing: hero, stats, phase filter, tool grid, roadmap
  globals.css
  tools/[slug]/page.tsx   # Resolves a tool from the registry, renders SuiteShell
components/
  Sidebar.tsx             # Persistent nav, grouped by phase, mobile drawer
  SuiteShell.tsx          # Top bar + sidebar + content layout, fullscreen toggle
  ToolFrame.tsx           # Iframe loader, loading state, "not deployed" fallback
  ToolCard.tsx            # Grid card on the landing page
  ToolExplorer.tsx        # Client-side phase filter + grid
  Footer.tsx              # Problem / Solution / Impact narrative
  icons.tsx               # Dependency-free inline SVG icon set
lib/
  tools.ts                # Single source of truth: all 13 tools, phases, styles
types/
  index.ts
```

## Roadmap

See the Roadmap section on the landing page for what's planned next: a command palette, cross-tool workflows, pinned tools, and a guided first-run tour.

## License

MIT — see `LICENSE`.
