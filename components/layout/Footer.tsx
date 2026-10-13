import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      {/* Non-Negotiable Medical Safety Contract Banner */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">Non-Negotiable Safety Contract:</span>
            <span className="text-sky-300">AI explains &bull; Rules compare &bull; Doctors diagnose.</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-amber-400/90 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-md">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>SaarthiAI does NOT diagnose, prescribe, or replace clinical care.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About SaarthiAI */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-sm">
                S
              </div>
              <span className="font-bold text-white text-base">SaarthiAI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              A patient-centered laboratory report understanding platform. Transforming complex clinical
              terminology into plain language and neutral questions for your doctor.
            </p>
          </div>

          {/* Col 2: Supported 6 MVP Categories */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Supported MVP Categories</h4>
            <ul className="space-y-1 text-slate-400">
              <li>&bull; Complete Blood Count (CBC)</li>
              <li>&bull; Diabetes & Glucose Profile</li>
              <li>&bull; Liver Function Panel (LFT)</li>
              <li>&bull; Kidney Function Panel (KFT)</li>
              <li>&bull; Thyroid Profile (TSH, T3, T4)</li>
              <li>&bull; Lipid Profile (Cholesterol, HDL, LDL)</li>
            </ul>
          </div>

          {/* Col 3: Key Safety Guarantees */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Safety Guarantees</h4>
            <ul className="space-y-1 text-slate-400">
              <li>&bull; No fabricated reference intervals</li>
              <li>&bull; Report-printed ranges prioritized</li>
              <li>&bull; Strict deterministic rule comparison</li>
              <li>&bull; Auditable user verification</li>
              <li>&bull; In-memory temporary file retention</li>
            </ul>
          </div>

          {/* Col 4: Links & Privacy */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Navigation & Policies</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-sky-400 transition-colors">
                  Privacy Policy & Retention Notice
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-sky-400 transition-colors">
                  Upload & Analyze Report
                </Link>
              </li>
              <li>
                <Link href="/doubt-engine" className="hover:text-sky-400 transition-colors">
                  Voice-Enabled Doubt Engine
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-sky-400 transition-colors">
                  Doctor Consultation Flow
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>&copy; {new Date().getFullYear()} SaarthiAI. Built for patient empowerment and education.</p>
          <div className="flex items-center space-x-1 text-slate-400">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>Dedicated to transparent healthcare communication.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
