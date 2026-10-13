import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
} from 'lucide-react';
import { CandidateExtractionRow } from '@/lib/types/report.types';
import { RangeBar } from './RangeBar';

interface Props {
  row: CandidateExtractionRow;
}

export function ParameterCard({ row }: Props) {
  const [expanded, setExpanded] = useState(false);

  const isNumeric = row.resultType === 'NUMERIC' && row.parsedNumericValue !== undefined;
  const valDisplay = isNumeric
    ? `${row.parsedNumericValue} ${row.parsedUnit}`
    : row.parsedCategoricalValue || row.rawValueText;

  const getStatusBadge = () => {
    switch (row.comparisonStatus) {
      case 'IN_RANGE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>IN RANGE</span>
          </span>
        );
      case 'ABOVE_RANGE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950 text-red-400 border border-red-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>ABOVE RANGE</span>
          </span>
        );
      case 'BELOW_RANGE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>BELOW RANGE</span>
          </span>
        );
      case 'CATEGORICAL_REVIEW':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950 text-purple-400 border border-purple-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>CATEGORICAL</span>
          </span>
        );
      case 'UNIT_MISMATCH':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-950 text-orange-400 border border-orange-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span>UNIT MISMATCH</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <span>NO VERIFIED RANGE</span>
          </span>
        );
    }
  };

  const getSourceBadge = () => {
    const src = row.referenceRangeOrigin;
    if (src.sourceType === 'REPORT_PRINTED') {
      return (
        <span className="text-[10px] text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
          Report Printed Range: {src.rawRangeText} {src.unit}
        </span>
      );
    }
    if (src.sourceType === 'CURATED_INDIAN_FALLBACK') {
      return (
        <a
          href={src.urlOrDoi || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded inline-flex items-center space-x-1 hover:text-white"
        >
          <span>Fallback Range: {src.rawRangeText}</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      );
    }
    return (
      <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
        No verified applicable interval found
      </span>
    );
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4 shadow-lg">
      {/* Top Header: Names & Status */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {row.rawTestName}
            </h3>
            {row.canonicalId !== 'UNMAPPED' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {row.canonicalId}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs text-slate-400 font-medium">{row.category}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[11px] text-slate-500">
              Source: Pg. {row.pageNumber} ({row.documentId})
            </span>
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Primary Value Callout & Source Reference */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Observed Value</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {valDisplay}
            </div>
          </div>
          <div className="sm:text-right">{getSourceBadge()}</div>
        </div>

        {/* Visual Scale Bar */}
        {isNumeric && (
          <RangeBar
            value={row.parsedNumericValue!}
            unit={row.parsedUnit}
            rangeOrigin={row.referenceRangeOrigin}
            status={row.comparisonStatus}
          />
        )}
      </div>

      {/* Plain Language Explanation */}
      {row.explanation && (
        <div className="space-y-2 text-xs">
          <p className="text-slate-300 leading-relaxed">
            {row.explanation.whatItMeasures}
          </p>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {row.explanation.rangeContext}
          </p>
        </div>
      )}

      {/* Expandable Doctor Questions & Clinical Limitations */}
      {row.explanation && (
        <div className="border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            <span className="flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions to ask your doctor ({row.explanation.neutralDoctorQuestions.length})</span>
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 pt-2 text-xs border-t border-slate-800/40">
              <div className="space-y-1.5">
                {row.explanation.neutralDoctorQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-sky-200"
                  >
                    &ldquo;{q}&rdquo;
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-500 leading-tight">
                {row.explanation.limitationsNote}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
