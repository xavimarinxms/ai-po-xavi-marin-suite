import Link from 'next/link';
import type { Tool } from '@/types';
import { PHASE_STYLES } from '@/lib/tools';
import { ICONS, IconArrowRight } from './icons';

export default function ToolCard({ tool }: { tool: Tool }) {
  const style = PHASE_STYLES[tool.phase];
  const Icon = ICONS[tool.icon];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      data-phase={tool.phase}
      className="tool-card bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.icon}`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${style.badge}`}>
          {tool.phase}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-snug">{tool.name}</p>
      <p className="text-xs text-gray-500 leading-relaxed flex-1">{tool.description}</p>
      <div className="flex items-center gap-1 text-xs font-medium text-brand-600 pt-2 border-t border-gray-100">
        Open tool
        <IconArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
