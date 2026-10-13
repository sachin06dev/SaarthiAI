'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  Sparkles,
  Download,
  Share2,
  Calendar,
  MessageSquareQuote,
  RefreshCw,
} from 'lucide-react';
import { CandidateExtractionRow, ReportAnalysisSummary } from '@/lib/types/report.types';
import { buildEvaluatedReportSummary } from '@/lib/services/report-summary-service';
import {
  CLEAN_DEMO_TEXT,
  MIXED_DEMO_TEXT,
  UNCERTAIN_DEMO_TEXT,
} from '@/lib/services/ocr-service';
import { parseReportTextToCandidateRows } from '@/lib/services/report-parser';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { ExportModal } from '@/components/results/ExportModal';

function ResultsContent() {
  const searchParams = useSearchParams();
  const fixtureParam = searchParams.get('fixture') || 'mixed';

  const [activeFixture, setActiveFixture] = useState(fixtureParam);
  const [summary, setSummary] = useState<ReportAnalysisSummary | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportDefaultTab, setExportDefaultTab] = useState<'pdf' | 'whatsapp'>('pdf');

  const loadData = (fixture: string) => {
    setActiveFixture(fixture);

    // First try localStorage if matching active fixture or if uploaded
    if (typeof window !== 'undefined') {
      const savedFixture = localStorage.getItem('saarthi_active_fixture_id');
      const savedRowsStr = localStorage.getItem('saarthi_active_candidate_rows');
      const uploadedName = localStorage.getItem('saarthi_uploaded_report_name') || 'Uploaded_Clinical_Report.pdf';

      if ((fixture === 'uploaded' || savedFixture === fixture || (!savedFixture && fixture === 'uploaded')) && savedRowsStr) {
        try {
          const parsed = JSON.parse(savedRowsStr) as CandidateExtractionRow[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            const fileName =
              fixture === 'clean'
                ? 'CBC_Report_DrLalPathLabs.pdf'
                : fixture === 'uncertain'
                ? 'Ambiguous_Faint_Scan.pdf'
                : fixture === 'uploaded'
                ? uploadedName
                : 'Metabolic_Panel_Thyrocare.pdf';

            const evaluated = buildEvaluatedReportSummary(parsed, `doc_${fixture}`, fileName);
            setSummary(evaluated);
            return;
          }
        } catch {
          // Fallback to fresh fixture parsing
        }
      }
    }

    // Default: generate from synthetic fixture
    let text = MIXED_DEMO_TEXT;
    let fileName = 'Metabolic_Panel_Thyrocare.pdf';
    let docId = 'doc_mixed_01';

    if (fixture === 'clean') {
      text = CLEAN_DEMO_TEXT;
      fileName = 'CBC_Report_DrLalPathLabs.pdf';
      docId = 'doc_clean_01';
    } else if (fixture === 'uncertain') {
      text = UNCERTAIN_DEMO_TEXT;
      fileName = 'Ambiguous_Faint_Scan.pdf';
      docId = 'doc_uncertain_01';
    }

    const rows = parseReportTextToCandidateRows(text, docId, 1);
    const evaluated = buildEvaluatedReportSummary(rows, docId, fileName);
    setSummary(evaluated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_active_candidate_rows', JSON.stringify(rows));
      localStorage.setItem('saarthi_active_fixture_id', fixture);
    }
  };

  useEffect(() => {
    loadData(fixtureParam);
  }, [fixtureParam]);

  const handleExportPdf = () => {
    setExportDefaultTab('pdf');
    setExportModalOpen(true);
  };

  const handleShareWhatsApp = () => {
    setExportDefaultTab('whatsapp');
    setExportModalOpen(true);
  };

  if (!summary) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Evaluating deterministic reference intervals...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Secondary Subheader / Fixture Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Link
            href={`/review?fixture=${activeFixture}`}
            className="inline-flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Field Review</span>
          </Link>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Active Dataset:</span>
          <span className="text-sky-300 font-semibold">{summary.fileName}</span>
        </div>

        {/* Quick Demo Switcher */}
        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          {(activeFixture === 'uploaded' || (typeof window !== 'undefined' && localStorage.getItem('saarthi_uploaded_report_name'))) && (
            <button
              onClick={() => loadData('uploaded')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                activeFixture === 'uploaded'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-sky-300" />
              <span>Uploaded Report</span>
            </button>
          )}
          <span className="text-slate-500 font-medium mr-1">Switch Sample:</span>
          <button
            onClick={() => loadData('mixed')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              activeFixture === 'mixed'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Mixed Panel
          </button>
          <button
            onClick={() => loadData('clean')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              activeFixture === 'clean'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Clean CBC
          </button>
          <button
            onClick={() => loadData('uncertain')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              activeFixture === 'uncertain'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Uncertain OCR
          </button>
        </div>
      </div>

      {/* Main Results Dashboard Component */}
      <ResultsDashboard
        summary={summary}
        onExportPdf={handleExportPdf}
        onShareWhatsApp={handleShareWhatsApp}
      />

      {/* Export / Share Modal */}
      <ExportModal
        summary={summary}
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        defaultTab={exportDefaultTab}
      />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto py-20 text-center text-slate-400">
          Loading report parameters...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
