import Link from 'next/link';
import { PHASE_ORDER, getPhaseCounts, getLiveToolCount, getVisibleTools } from '@/lib/tools';
import ToolExplorer from '@/components/ToolExplorer';
import Footer from '@/components/Footer';
import { IconRobot, IconArrowRight, IconComponents } from '@/components/icons';

const ROADMAP: {
  category: string;
  items: { label: string; desc: string; status: 'planned' | 'considering' }[];
}[] = [
  {
    category: 'Suite navigation',
    items: [
      {
        label: 'Command palette (⌘K)',
        desc: 'Jump to any tool instantly with a fuzzy search launcher, like Linear or Notion.',
        status: 'planned',
      },
      {
        label: 'Recently used tools',
        desc: 'Surface your 3 most recently opened tools at the top of the sidebar.',
        status: 'considering',
      },
      {
        label: 'Cross-tool search',
        desc: 'Search inside the content you generated across every tool in the suite, not just one.',
        status: 'considering',
      },
    ],
  },
  {
    category: 'Onboarding & demo',
    items: [
      {
        label: 'Guided first-run tour',
        desc: 'A 30-second walkthrough highlighting the sidebar, filters and sample data button.',
        status: 'planned',
      },
      {
        label: 'One-click "load all sample data"',
        desc: 'Pre-fill every tool at once so a recruiter can browse the whole suite pre-populated.',
        status: 'planned',
      },
      {
        label: 'Shareable demo snapshots',
        desc: 'Generate a link that reproduces a specific tool output, for sharing in interviews.',
        status: 'considering',
      },
    ],
  },
  {
    category: 'Cross-tool workflows',
    items: [
      {
        label: 'Pipe output between tools',
        desc: 'Send a PRD Builder output directly into User Story Generator without copy-pasting.',
        status: 'planned',
      },
      {
        label: 'Unified export history',
        desc: 'One place to find everything you exported across all 13 tools this week.',
        status: 'considering',
      },
      {
        label: 'Suite-wide activity log',
        desc: 'A lightweight timeline of what you generated and when, per tool.',
        status: 'considering',
      },
    ],
  },
  {
    category: 'Personalization',
    items: [
      {
        label: 'Favorite / pin tools',
        desc: 'Pin your most-used tools to the top of the sidebar, above the phase groups.',
        status: 'planned',
      },
      {
        label: 'Custom phase ordering',
        desc: 'Reorder the sidebar to match your own team\'s process instead of the default PO phases.',
        status: 'considering',
      },
      {
        label: 'Dark mode',
        desc: 'A dark theme for the shell and every embedded tool, toggled from the top bar.',
        status: 'considering',
      },
    ],
  },
];

const STATUS_BADGE: Record<string, string> = {
  planned: 'bg-blue-50 text-blue-700 border-blue-200',
  considering: 'bg-gray-100 text-gray-600 border-gray-200',
};
const STATUS_LABEL: Record<string, string> = {
  planned: 'Planned',
  considering: 'Considering',
};

export default function HomePage() {
  const tools = getVisibleTools();
  const phaseCounts = getPhaseCounts();
  const liveCount = getLiveToolCount();

  return (
    <>
      {/* Nav */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
              <IconComponents className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">AI PO Xavi Marín Suite</p>
              <a
                href="https://xavimarin.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-gray-500 hover:text-brand-600 transition-colors"
              >
                by Xavi Marín
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#tools" className="text-xs text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
              Tools
            </a>
            <a href="#roadmap" className="text-xs text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
              Roadmap
            </a>
            <Link
              href={`/tools/${tools[0].slug}`}
              className="text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg px-3.5 py-1.5 transition-colors"
            >
              Try a tool
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center pt-20 pb-16 px-6 bg-white border-b border-gray-200">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full mb-5">
          <IconRobot className="w-3.5 h-3.5" />
          AI-powered · Free · No login
        </span>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4 max-w-2xl mx-auto">
          The <span className="text-brand-600">PO toolkit</span> I built for my own work
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
          {tools.length} AI tools that automate the repetitive side of Product Management —
          from discovery to delivery. Built and used daily by a real PO.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="#tools"
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl py-3 px-6 transition-colors shadow-sm inline-flex items-center gap-2"
          >
            Explore tools
            <IconArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium rounded-xl py-3 px-6 transition-colors bg-white"
          >
            View source
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-5">
          No data stored on our servers · Open source · MIT License
        </p>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200">
          <Stat value={tools.length} label="AI tools" />
          <Stat value={PHASE_ORDER.length} label="PO phases covered" />
          <Stat value={liveCount} label="Deployed today" />
          <Stat value="0€" label="Cost to use" />
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">All tools</h2>
          <p className="text-sm text-gray-500">Filter by phase, then open any tool with sample data preloaded.</p>
        </div>
        <ToolExplorer tools={tools} phaseCounts={phaseCounts} />
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Roadmap</h2>
            <p className="text-sm text-gray-500">What&apos;s coming next to the suite shell</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_BADGE.planned}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Planned
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_BADGE.considering}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Considering
              </span>
            </div>
          </div>

          <div className="space-y-10">
            {ROADMAP.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {group.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.items.map((item) => (
                    <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{item.label}</p>
                        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_BADGE[item.status]}`}>
                          {STATUS_LABEL[item.status]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center py-6 px-4">
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
