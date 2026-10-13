'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckSquare, ArrowLeft, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { ExtractionReviewTable } from '@/components/review/ExtractionReviewTable';
import { CandidateExtractionRow } from '@/lib/types/report.types';
import {
  CLEAN_DEMO_TEXT,
  MIXED_DEMO_TEXT,
  UNCERTAIN_DEMO_TEXT,
} from '@/lib/services/ocr-service';
import { parseReportTextToCandidateRows } from '@/lib/services/report-parser';

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fixtureParam = searchParams.get('fixture') || 'mixed';

  const [rows, setRows] = useState<CandidateExtractionRow[]>([]);
  const [activeFixture, setActiveFixture] = useState(fixtureParam);

  const loadFixtureRows = (fixture: string) => {
    setActiveFixture(fixture);
    let text = MIXED_DEMO_TEXT;
    let docId = 'doc_mixed_01';

    if (fixture === 'uploaded') {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('saarthi_active_candidate_rows');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRows(parsed);
              return;
            }
          } catch {}
        }
      }
    }

    if (fixture === 'clean') {
      text = CLEAN_DEMO_TEXT;
      docId = 'doc_clean_01';
    } else if (fixture === 'uncertain') {
      text = UNCERTAIN_DEMO_TEXT;
      docId = 'doc_uncertain_01';
    }

    const parsedRows = parseReportTextToCandidateRows(text, docId, 1);
    setRows(parsedRows);

    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_active_candidate_rows', JSON.stringify(parsedRows));
      localStorage.setItem('saarthi_active_fixture_id', fixture);
    }
  };

  useEffect(() => {
    loadFixtureRows(fixtureParam);
  }, [fixtureParam]);

  const handleRowsUpdated = (updatedRows: CandidateExtractionRow[]) => {
    setRows(updatedRows);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_active_candidate_rows', JSON.stringify(updatedRows));
    }
  };

  const handleProceed = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_active_candidate_rows', JSON.stringify(rows));
      localStorage.setItem('saarthi_active_fixture_id', activeFixture);
    }
    router.push(`/results?fixture=${activeFixture}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Step 2: Transparent Extraction Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Review &amp; Verify Fields</h1>
          <p className="text-xs text-slate-400">
            Confirm extracted numbers, units, and ranges before deterministic comparison rules execute.
          </p>
        </div>

        {/* Fixture Selector Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(activeFixture === 'uploaded' || (typeof window !== 'undefined' && localStorage.getItem('saarthi_uploaded_report_name'))) && (
            <button
              onClick={() => loadFixtureRows('uploaded')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                activeFixture === 'uploaded'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Uploaded Report</span>
            </button>
          )}
          <button
            onClick={() => loadFixtureRows('clean')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFixture === 'clean'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clean CBC
          </button>
          <button
            onClick={() => loadFixtureRows('mixed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFixture === 'mixed'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mixed Panel
          </button>
          <button
            onClick={() => loadFixtureRows('uncertain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFixture === 'uncertain'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Low-Confidence
          </button>
        </div>
      </div>

      {/* Main Review Table Component */}
      <ExtractionReviewTable
        initialRows={rows}
        onRowsUpdated={handleRowsUpdated}
        onProceed={handleProceed}
      />
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading review interface...</div>}>
      <ReviewContent />
    </Suspense>
  );
}
