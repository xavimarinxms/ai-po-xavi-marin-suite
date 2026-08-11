'use client';

import { useState } from 'react';
import type { Phase, Tool } from '@/types';
import { PHASE_ORDER, PHASE_STYLES } from '@/lib/tools';
import ToolCard from './ToolCard';

interface ToolExplorerProps {
  tools: Tool[];
  phaseCounts: Record<string, number>;
}

/**
 * Client-side filter over the tool grid. Filtering happens in the browser
 * (13 items, no need for a server round-trip) so switching phases is instant.
 */
export default function ToolExplorer({ tools, phaseCounts }: ToolExplorerProps) {
  const [activePhase, setActivePhase] = useState<Phase | 'all'>('all');

  const visibleTools =
    activePhase === 'all' ? tools : tools.filter((t) => t.phase === activePhase);

  return (
    <div id="tools">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <FilterChip
          label="All"
          count={phaseCounts.all}
          active={activePhase === 'all'}
          onClick={() => setActivePhase('all')}
        />
        {PHASE_ORDER.map((phase) => (
          <FilterChip
            key={phase}
            label={phase}
            count={phaseCounts[phase]}
            active={activePhase === phase}
            onClick={() => setActivePhase(phase)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors
        ${active ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'}
      `}
    >
      {label}
      <span
        className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/25' : 'bg-gray-100 text-gray-500'}`}
      >
        {count}
      </span>
    </button>
  );
}
