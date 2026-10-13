'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Share2,
  Calendar,
  MessageSquareQuote,
  Filter,
  Search,
  FileText,
  Sparkles,
} from 'lucide-react';
import { ReportAnalysisSummary, CandidateExtractionRow } from '@/lib/types/report.types';
import { TestCategory, ComparisonStatus } from '@/lib/types/test.types';
import { ParameterCard } from './ParameterCard';

interface Props {
  summary: ReportAnalysisSummary;
  onExportPdf?: () => void;
  onShareWhatsApp?: () => void;
}

export function ResultsDashboard({ summary, onExportPdf, onShareWhatsApp }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: string; label: string }[] = [
    { key: 'ALL', label: 'All Tests' },
    { key: 'CBC', label: 'Complete Blood Count' },
    { key: 'DIABETES_GLUCOSE', label: 'Diabetes / Glucose' },
    { key: 'LIVER', label: 'Liver Panel (LFT)' },
    { key: 'KIDNEY', label: 'Kidney Panel (KFT)' },
    { key: 'THYROID', label: 'Thyroid Profile' },
    { key: 'LIPID_PROFILE', label: 'Lipid Profile' },
  ];

  const filteredItems = summary.items.filter((item) => {
    // Category match
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }

    // Status filter match
    if (statusFilter === 'IN_RANGE' && item.comparisonStatus !== 'IN_RANGE') return false;
    if (statusFilter === 'OUT_OF_RANGE' && item.comparisonStatus !== 'ABOVE_RANGE' && item.comparisonStatus !== 'BELOW_RANGE') return false;
    if (statusFilter === 'REVIEW' && item.comparisonStatus !== 'REVIEW_REQUIRED' && !item.isReviewRequired) return false;
    if (statusFilter === 'NO_RANGE' && item.comparisonStatus !== 'NO_VERIFIED_RANGE') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = item.rawTestName.toLowerCase().includes(q) || item.canonicalId.toLowerCase().includes(q);
      if (!matchesName) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold mb-1">
            <Activity className="w-4 h-4" />
            <span>Step 3: Decoded Laboratory Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Results Dashboard</h1>
          <p className="text-xs text-slate-400">
            Document: {summary.fileName} &bull; Deterministic range comparisons &bull; Provenance preserved
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportPdf}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={onShareWhatsApp}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Share Summary</span>
          </button>

          <Link
            href="/appointments"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Consult Doctor</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards Grid (Objective Counts Only, Zero Health Scores) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Extracted</span>
          <div className="text-2xl font-bold text-white">{summary.totalTests}</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 block">Within Range</span>
          <div className="text-2xl font-bold text-emerald-300">{summary.inRangeCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 space-y-1">
          <span className="text-[11px] font-semibold text-red-400 block">Above Range</span>
          <div className="text-2xl font-bold text-red-300">{summary.aboveRangeCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-1">
          <span className="text-[11px] font-semibold text-amber-400 block">Below Range</span>
          <div className="text-2xl font-bold text-amber-300">{summary.belowRangeCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-1">
          <span className="text-[11px] font-semibold text-purple-400 block">Review Flagged</span>
          <div className="text-2xl font-bold text-purple-300">{summary.reviewRequiredCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block">No Verified Range</span>
          <div className="text-2xl font-bold text-slate-300">{summary.noVerifiedRangeCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parameters or canonical IDs..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_RANGE">In Range Only</option>
              <option value="OUT_OF_RANGE">Above/Below Range</option>
              <option value="REVIEW">Review Required</option>
              <option value="NO_RANGE">No Verified Range</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredItems.length} of {summary.items.length} parameters</span>
          <Link href="/doubt-engine" className="text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Have doubts about these? Open Doubt Engine</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <ParameterCard key={item.rowId} row={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
