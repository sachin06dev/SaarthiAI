'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { DoubtEngineChat } from '@/components/doubt-engine/DoubtEngineChat';
import { CandidateExtractionRow } from '@/lib/types/report.types';
import { MIXED_DEMO_TEXT } from '@/lib/services/ocr-service';
import { parseReportTextToCandidateRows } from '@/lib/services/report-parser';

export default function DoubtEnginePage() {
  const [reportContext, setReportContext] = useState<CandidateExtractionRow[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saarthi_active_candidate_rows');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReportContext(parsed);
            return;
          }
        } catch {}
      }
    }
    // Default fallback to mixed demo panel
    const defaultRows = parseReportTextToCandidateRows(MIXED_DEMO_TEXT, 'doc_mixed_default', 1);
    setReportContext(defaultRows);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/60 text-sky-400 text-xs font-medium">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Patient-Centered Clarification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Voice-Enabled Doubt Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Ask questions about technical terms, units, or values on your report in English or Hindi.
          Built strictly for patient education—not an AI doctor.
        </p>
      </div>

      <DoubtEngineChat reportContext={reportContext} />
    </div>
  );
}
