'use client';

import React from 'react';
import { Info, Sparkles } from 'lucide-react';

interface Props {
  isDemo?: boolean;
}

export function BannerNotice({ isDemo = true }: Props) {
  return (
    <aside aria-label="System status notice" className="bg-sky-950/40 border-b border-sky-800/40 text-xs text-sky-200 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong className="font-semibold text-white">Safe Sandbox Mode:</strong>{' '}
            SaarthiAI is operating with reviewed deterministic rules and traceable Indian reference intervals.
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-1 text-[11px] text-sky-300/80">
          <Info className="w-3.5 h-3.5" />
          <span>Zero external keys required &bull; 1-hour in-memory retention</span>
        </div>
      </div>
    </aside>
  );
}
