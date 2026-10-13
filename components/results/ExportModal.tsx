'use client';

import React, { useState } from 'react';
import {
  Download,
  Share2,
  X,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ReportAnalysisSummary } from '@/lib/types/report.types';
import {
  formatReportTextForWhatsApp,
  generateWhatsAppShareUrl,
  triggerBrowserPrintReport,
  shareReportViaWebShare,
} from '@/lib/services/pdf-export-service';

interface Props {
  summary: ReportAnalysisSummary;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'pdf' | 'whatsapp';
}

export function ExportModal({ summary, isOpen, onClose, defaultTab = 'pdf' }: Props) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'whatsapp'>(defaultTab);
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const formattedText = formatReportTextForWhatsApp(summary);
  const waUrl = generateWhatsAppShareUrl(summary);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrintPdf = () => {
    triggerBrowserPrintReport(summary);
  };

  const handleNativeShare = async () => {
    setShareStatus('Attempting device share...');
    const res = await shareReportViaWebShare(summary);
    if (res.success) {
      setShareStatus('Shared successfully via device share!');
      setTimeout(() => setShareStatus(null), 3000);
    } else if (res.fallbackNeeded) {
      setShareStatus('Direct share unavailable on this device. Opening WhatsApp chat link...');
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => setShareStatus(null), 3000);
    } else {
      setShareStatus(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            {activeTab === 'pdf' ? (
              <Download className="w-5 h-5 text-sky-400" />
            ) : (
              <Share2 className="w-5 h-5 text-emerald-400" />
            )}
            <h2 className="text-base font-bold text-white">
              {activeTab === 'pdf' ? 'Export Report PDF' : 'Share to WhatsApp'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/30 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`py-2.5 flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'pdf'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-sky-950/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Printable / PDF Export</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2.5 flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'whatsapp'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Summary</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'pdf' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-200 block text-sm">Clean Document Export</span>
                <p className="text-slate-400 leading-relaxed">
                  Generates an educational summary containing all {summary.totalTests} verified test parameters,
                  reference range origins, plain-language insights, and neutral questions prepared for your doctor.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">IN RANGE</span>
                    <span className="text-emerald-400 font-bold">{summary.inRangeCount}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">OUT OF RANGE</span>
                    <span className="text-amber-400 font-bold">
                      {summary.aboveRangeCount + summary.belowRangeCount}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">REVIEW / NO RANGE</span>
                    <span className="text-slate-400 font-bold">
                      {summary.reviewRequiredCount + summary.noVerifiedRangeCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-sky-300 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Print to PDF Guide:</strong> Clicking &quot;Print / Save as PDF&quot; opens your system print dialog.
                  Select <em>&quot;Save as PDF&quot;</em> as destination to save a clean offline copy.
                </span>
              </div>

              <button
                onClick={handlePrintPdf}
                className="w-full py-3 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>WhatsApp Sharing Policy:</strong> A web link does not automatically attach a PDF file.
                  We prepare a clean, formatted text summary of your verified parameters and doctor questions.
                  To share the full PDF file, save the PDF first and attach it to the chat.
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Message Preview:</span>
                  <button
                    onClick={handleCopyText}
                    className="text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
                  {formattedText}
                </div>
              </div>

              {shareStatus && (
                <div className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-800 text-sky-300 text-center font-medium">
                  {shareStatus}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Device Share</span>
                </button>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-900/60 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Non-Negotiable Medical Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500 leading-normal">
            <span className="font-semibold text-slate-400 block mb-0.5">Non-Negotiable Medical Safety Contract:</span>
            SaarthiAI does not diagnose, prescribe, or provide clinical treatments. AI explains, rules compare, and licensed doctors diagnose.
          </div>
        </div>
      </div>
    </div>
  );
}
