'use client';

import { useState } from 'react';
import type { Tool } from '@/types';
import { IconExternalLink, IconClock } from './icons';

interface ToolFrameProps {
  tool: Tool;
}

/**
 * Loads the tool inside an iframe, with a loading spinner while it boots
 * and a friendly fallback when the tool has no URL configured yet (local
 * dev not running, or not deployed to production).
 *
 * Every tool's functional entry point lives at /demo (its landing page at
 * "/" is a separate marketing page meant to be visited standalone, not
 * embedded). The suite always deep-links straight into /demo.
 *
 * The `?embed=1` query param is a convention the individual tools should
 * read to hide their own header/footer chrome — see README for the patch.
 */
export default function ToolFrame({ tool }: ToolFrameProps) {
  const [loaded, setLoaded] = useState(false);
  const demoUrl = tool.url ? `${tool.url.replace(/\/$/, '')}/demo` : '';

  if (!tool.url) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm px-6">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <IconClock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1.5">
            {tool.name} isn&apos;t deployed yet
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            This tool lives at <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded">tools/{tool.repoFolder}</code> in
            the repo. Run it locally or deploy it, then set its URL in the suite&apos;s environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-gray-50">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin" />
            <p className="text-xs text-gray-400">Loading {tool.shortName}…</p>
          </div>
        </div>
      )}
      <iframe
        src={`${demoUrl}?embed=1`}
        title={tool.name}
        onLoad={() => setLoaded(true)}
        className="w-full h-full border-0"
        style={{ minHeight: 'calc(100vh - 49px)' }}
        allow="clipboard-write"
      />
      <a
        href={demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex absolute top-3 right-4 z-20 items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-gray-900 bg-white/90 backdrop-blur border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
      >
        <IconExternalLink className="w-3 h-3" />
        Open in new tab
      </a>
    </div>
  );
}
