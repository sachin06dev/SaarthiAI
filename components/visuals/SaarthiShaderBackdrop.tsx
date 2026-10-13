'use client';

import React from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

interface Props {
  children?: React.ReactNode;
}

export function SaarthiShaderBackdrop({ children }: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Restrained healthcare atmosphere backdrop */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          prefersReducedMotion ? 'opacity-40' : 'opacity-60'
        }`}
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 95, 225, 0.18), rgba(6, 182, 212, 0.08) 50%, transparent 100%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
