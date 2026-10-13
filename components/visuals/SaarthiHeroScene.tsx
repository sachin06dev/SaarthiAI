'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, ShieldCheck, Activity, Cpu, CheckCircle2, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

export function SaarthiHeroScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -((y - centerY) / centerY) * 12; // tilt max 12 deg
    const rotY = ((x - centerX) / centerX) * 14;
    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      role="img"
      aria-label="Interactive 3D medical document decoding and structured telemetry scanner"
      className="relative w-full h-[390px] sm:h-[450px] flex items-center justify-center [perspective:1200px]"
    >
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-sky-500/15 dark:bg-sky-500/15 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/15 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Transform Container Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: mounted && !prefersReducedMotion
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? 'scale3d(1.02, 1.02, 1.02)' : ''}`
            : 'none',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="relative w-full max-w-md h-[360px] sm:h-[400px] rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-950/95 from-white via-slate-50 to-white p-5 border border-slate-700/60 dark:border-slate-800/80 border-slate-200/90 shadow-2xl shadow-sky-950/30 dark:shadow-black/60 flex flex-col justify-between overflow-hidden cursor-crosshair select-none"
      >
        {/* Subtle grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Animated Scanning Beam */}
        <div
          className="absolute left-0 right-0 h-28 pointer-events-none -translate-y-full animate-[scan_4s_easeInOut_infinite]"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.08), rgba(56, 189, 248, 0.35))',
            borderBottom: '2px solid rgba(56, 189, 248, 0.9)',
            boxShadow: '0 4px 20px -2px rgba(56, 189, 248, 0.5)',
          }}
        />

        {/* Top Header Row with status & provenance */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800 dark:border-slate-800 border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white dark:text-white text-slate-900 flex items-center gap-1.5">
                <span>Clinical Report Slate</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 text-slate-500">
                Provenance: Verified Laboratory PDF
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sky-950/70 dark:bg-sky-950/70 bg-sky-100 border border-sky-800/60 dark:border-sky-800/60 border-sky-300 text-[10px] font-semibold text-sky-400 dark:text-sky-400 text-sky-700">
            <Sparkles className="w-3 h-3" />
            <span>AI Multimodal Vision</span>
          </div>
        </div>

        {/* Centerpiece: Decoded Parameters with 3D Depth */}
        <div className="relative z-10 my-auto space-y-2.5 py-2">
          {/* Item 1: Hemoglobin */}
          <div
            style={{ transform: 'translateZ(25px)' }}
            className="p-2.5 rounded-xl bg-slate-800/70 dark:bg-slate-800/70 bg-slate-100/90 border border-slate-700/60 dark:border-slate-700/60 border-slate-300 flex items-center justify-between transition-all hover:border-sky-500/70"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 text-slate-800">
                  Hemoglobin (Hb)
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 text-slate-500">
                  Report Range: 13.0 &ndash; 17.0 g/dL
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white dark:text-white text-slate-900 bg-emerald-950/60 dark:bg-emerald-950/60 bg-emerald-50 text-emerald-400 dark:text-emerald-400 text-emerald-700 px-2 py-0.5 rounded border border-emerald-800/50">
                14.2 g/dL &bull; In Range
              </span>
            </div>
          </div>

          {/* Item 2: Fasting Blood Glucose */}
          <div
            style={{ transform: 'translateZ(35px)' }}
            className="p-2.5 rounded-xl bg-slate-800/70 dark:bg-slate-800/70 bg-slate-100/90 border border-sky-700/50 dark:border-sky-700/50 border-sky-300 flex items-center justify-between shadow-lg shadow-sky-950/40 transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
              <div>
                <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 text-slate-800 flex items-center gap-1.5">
                  <span>Fasting Blood Glucose</span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 text-slate-500">
                  Report Range: 70 &ndash; 99 mg/dL
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold bg-amber-950/60 dark:bg-amber-950/60 bg-amber-50 text-amber-400 dark:text-amber-400 text-amber-700 px-2 py-0.5 rounded border border-amber-800/50">
                118 mg/dL &bull; Above Range
              </span>
            </div>
          </div>

          {/* Item 3: Serum Creatinine */}
          <div
            style={{ transform: 'translateZ(20px)' }}
            className="p-2.5 rounded-xl bg-slate-800/70 dark:bg-slate-800/70 bg-slate-100/90 border border-slate-700/60 dark:border-slate-700/60 border-slate-300 flex items-center justify-between transition-all hover:border-indigo-500/70"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 text-slate-800">
                  Serum Creatinine
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 text-slate-500">
                  Report Range: 0.7 &ndash; 1.3 mg/dL
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold bg-emerald-950/60 dark:bg-emerald-950/60 bg-emerald-50 text-emerald-400 dark:text-emerald-400 text-emerald-700 px-2 py-0.5 rounded border border-emerald-800/50">
                0.9 mg/dL &bull; In Range
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Safety & Engine Badge */}
        <div
          style={{ transform: 'translateZ(15px)' }}
          className="relative z-10 pt-2.5 border-t border-slate-800 dark:border-slate-800 border-slate-200 flex items-center justify-between text-[11px]"
        >
          <div className="flex items-center space-x-1.5 text-slate-400 dark:text-slate-400 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deterministic Rule Comparison</span>
          </div>
          <div className="text-sky-400 dark:text-sky-400 text-sky-600 font-semibold flex items-center space-x-1">
            <Cpu className="w-3 h-3" />
            <span>Doctors Diagnose</span>
          </div>
        </div>
      </div>
    </div>
  );
}
