'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, AlertCircle, FileText } from 'lucide-react';
import { MultiFileDropzone } from '@/components/upload/MultiFileDropzone';

export default function AnalyzePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/60 text-sky-400 text-xs font-medium">
          <FileText className="w-3.5 h-3.5" />
          <span>Step 1: Multi-Document Submission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Upload &amp; Analyze Laboratory Reports
        </h1>
        <p className="text-sm text-slate-400">
          Upload one or multiple clinical reports (PDF or images) or explore with synthetic demo fixtures.
        </p>
      </div>

      {/* Demo Fixtures Fast-Track */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/50 via-indigo-950/40 to-slate-900 border border-sky-800/40 space-y-3">
        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Instant Demo Fixtures (Zero Upload Needed)</span>
        </div>
        <p className="text-xs text-slate-300">
          Select one of our three synthetic clinical scenarios to test the end-to-end extraction, verification,
          and deterministic rule engine:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Link
            href="/review?fixture=clean"
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-sky-500 text-left transition-all group"
          >
            <div className="text-xs font-semibold text-white group-hover:text-sky-300">
              1. Clean CBC &amp; Glucose
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              High confidence, digital PDF with report-printed ranges.
            </div>
          </Link>
          <Link
            href="/review?fixture=mixed"
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-sky-500 text-left transition-all group"
          >
            <div className="text-xs font-semibold text-white group-hover:text-sky-300">
              2. Mixed Out-of-Range Panel
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Elevated Glucose &amp; LFT, normal CBC, plus B+ Blood Group.
            </div>
          </Link>
          <Link
            href="/review?fixture=uncertain"
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-sky-500 text-left transition-all group"
          >
            <div className="text-xs font-semibold text-white group-hover:text-sky-300">
              3. Low-Confidence / Flagged
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Triggers mandatory user verification and unverified range states.
            </div>
          </Link>
        </div>
      </div>

      {/* Interactive Multi-File Dropzone */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Upload Your Documents</h2>
        <MultiFileDropzone />
      </div>

      {/* Security & Retention Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
        <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Privacy Guarantee:</strong> Uploaded reports are retained in
          temporary memory only for the duration of this active session (maximum 1 hour) and are then purged.
          We never store or share your medical data without explicit booking consent.
        </p>
      </div>
    </div>
  );
}
