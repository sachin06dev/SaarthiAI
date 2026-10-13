import React from 'react';
import { FileText, ShieldCheck, Activity, Cpu } from 'lucide-react';

export function SaarthiHeroFallback() {
  return (
    <div
      role="img"
      aria-label="SaarthiAI decorative medical report understanding illustration"
      className="relative w-full h-[380px] md:h-[440px] rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-hidden"
    >
      {/* Ambient gradient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Document Silhouette */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-medium text-sky-400 bg-sky-950/60 border border-sky-800/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>Patient-First Report Intelligence</span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Deterministic Rules</span>
        </div>
      </div>

      {/* Centerpiece: Abstract Report with Decoded Nodes */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        <div className="relative p-5 bg-slate-800/70 border border-slate-700/80 rounded-xl shadow-inner max-w-sm w-full backdrop-blur-md">
          <div className="flex items-center space-x-3 mb-3 border-b border-slate-700/60 pb-2">
            <div className="p-2 bg-sky-500/20 text-sky-300 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-200">Laboratory Panel</div>
              <div className="text-xs text-slate-400">Preserving original test provenance</div>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-300 font-medium">Hemoglobin</span>
              <span className="text-emerald-400 font-semibold">Report-sourced Range</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-300 font-medium">Fasting Blood Glucose</span>
              <span className="text-sky-400 font-semibold">Strict Rule Comparison</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded border border-slate-800">
              <span className="text-slate-300 font-medium">Creatinine</span>
              <span className="text-indigo-300 font-semibold">Doctor Question Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Core Safety Motto */}
      <div className="relative z-10 text-center border-t border-slate-800/80 pt-3">
        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span className="tracking-wide">AI Explains &bull; Rules Compare &bull; Doctors Diagnose</span>
        </div>
      </div>
    </div>
  );
}
