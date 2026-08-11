'use client';

import Link from 'next/link';
import { getToolsByPhase, PHASE_STYLES } from '@/lib/tools';
import { IconArrowLeft, IconX } from './icons';
import type { Tool } from '@/types';

interface SidebarProps {
  activeSlug: string;
  /** Mobile drawer open state, controlled by the parent shell. */
  open: boolean;
  onClose: () => void;
}

/**
 * Persistent left navigation, grouped by product lifecycle phase.
 * Desktop: always visible, 240px, part of the flex layout.
 * Mobile: slides in as a drawer over a dimmed overlay, controlled by `open`.
 */
export default function Sidebar({ activeSlug, open, onClose }: SidebarProps) {
  const groups = getToolsByPhase();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 flex-shrink-0 bg-white border-r border-gray-200
          flex flex-col h-screen lg:h-auto
          transform transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center flex-shrink-0">
              <IconArrowLeft className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">AI PO Suite</p>
              <p className="text-[10px] text-gray-500 truncate">Xavi Marín</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close menu"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto sidebar-scroll py-3">
          {groups.map((group) => (
            <div key={group.phase} className="mb-4 last:mb-0">
              <p className="px-4 mb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {group.phase}
              </p>
              <div className="space-y-0.5 px-2">
                {group.tools.map((tool) => (
                  <SidebarItem
                    key={tool.slug}
                    tool={tool}
                    active={tool.slug === activeSlug}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100">
          <a
            href="https://xavimarin.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-gray-400 hover:text-brand-600 transition-colors"
          >
            xavimarin.net →
          </a>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  tool,
  active,
  onNavigate,
}: {
  tool: Tool;
  active: boolean;
  onNavigate: () => void;
}) {
  const style = PHASE_STYLES[tool.phase];
  const isPlanned = tool.url === '';

  return (
    <Link
      href={`/tools/${tool.slug}`}
      onClick={onNavigate}
      className={`
        flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium
        transition-colors group
        ${active ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
      <span className="truncate flex-1">{tool.shortName}</span>
      {isPlanned && (
        <span className="text-[9px] text-gray-400 flex-shrink-0">soon</span>
      )}
    </Link>
  );
}
