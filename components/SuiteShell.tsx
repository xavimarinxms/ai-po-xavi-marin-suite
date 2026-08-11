'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Tool } from '@/types';
import { PHASE_STYLES } from '@/lib/tools';
import Sidebar from './Sidebar';
import ToolFrame from './ToolFrame';
import { IconMenu, IconArrowLeft, IconExpand, IconCollapse } from './icons';

interface SuiteShellProps {
  tool: Tool;
}

/**
 * The shell every tool route renders inside: sidebar (desktop persistent,
 * mobile drawer) + a top bar with the fullscreen toggle + the tool itself.
 *
 * Fullscreen mode hides the sidebar entirely so the tool gets the whole
 * viewport — useful on smaller laptop screens or when demoing a single tool.
 * The choice is kept in component state, so it resets on navigation; that's
 * intentional, each tool visit starts in the default (sidebar) layout.
 */
export default function SuiteShell({ tool }: SuiteShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const style = PHASE_STYLES[tool.phase];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {!fullscreen && (
        <Sidebar
          activeSlug={tool.slug}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {!fullscreen && (
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-900 p-1 flex-shrink-0"
                aria-label="Open menu"
              >
                <IconMenu className="w-4.5 h-4.5" />
              </button>
            )}
            {fullscreen && (
              <Link
                href="/"
                className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors flex-shrink-0"
              >
                <IconArrowLeft className="w-3.5 h-3.5" />
                Home
              </Link>
            )}
            <span
              className={`hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${style.badge}`}
            >
              {tool.phase}
            </span>
            <p className="text-sm font-semibold text-gray-900 truncate">{tool.name}</p>
          </div>

          <button
            onClick={() => setFullscreen((v) => !v)}
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors flex-shrink-0"
          >
            {fullscreen ? (
              <>
                <IconCollapse className="w-3.5 h-3.5" />
                Show sidebar
              </>
            ) : (
              <>
                <IconExpand className="w-3.5 h-3.5" />
                Full screen
              </>
            )}
          </button>
        </header>

        <ToolFrame tool={tool} />
      </div>
    </div>
  );
}
