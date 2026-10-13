'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import {
  validateUploadedFile,
  formatFileSize,
  MAX_FILES_PER_SESSION,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/services/document-service';
import { UploadedDocument } from '@/lib/types/report.types';
import {
  CLEAN_DEMO_TEXT,
  MIXED_DEMO_TEXT,
  UNCERTAIN_DEMO_TEXT,
} from '@/lib/services/ocr-service';

interface FileQueueItem {
  id: string;
  file: File;
  docInfo: UploadedDocument;
  sampleType?: 'clean' | 'mixed' | 'uncertain';
}

interface UploadErrorItem {
  id: string;
  fileName: string;
  message: string;
}

export function MultiFileDropzone() {
  const router = useRouter();
  const [queue, setQueue] = useState<FileQueueItem[]>([]);
  const [errors, setErrors] = useState<UploadErrorItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newQueueItems: FileQueueItem[] = [];
    const newErrors: UploadErrorItem[] = [];

    Array.from(files).forEach((file) => {
      const validation = validateUploadedFile(
        { name: file.name, size: file.size, type: file.type },
        queue.length + newQueueItems.length
      );

      if (validation.isValid && validation.document) {
        newQueueItems.push({
          id: validation.document.documentId,
          file,
          docInfo: validation.document,
        });
      } else {
        newErrors.push({
          id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          fileName: file.name,
          message: validation.errorMessage || 'Invalid file',
        });
      }
    });

    if (newQueueItems.length > 0) {
      setQueue((prev) => [...prev, ...newQueueItems]);
    }
    if (newErrors.length > 0) {
      setErrors((prev) => [...prev, ...newErrors]);
    }
  };

  const loadSampleFile = (type: 'clean' | 'mixed' | 'uncertain') => {
    let name = 'CBC_Report_DrLalPathLabs.pdf';
    let text = CLEAN_DEMO_TEXT;

    if (type === 'mixed') {
      name = 'Metabolic_Panel_Thyrocare.pdf';
      text = MIXED_DEMO_TEXT;
    } else if (type === 'uncertain') {
      name = 'Ambiguous_Faint_Scan.pdf';
      text = UNCERTAIN_DEMO_TEXT;
    }

    const blob = new Blob([text], { type: 'application/pdf' });
    const mockFile = new File([blob], name, { type: 'application/pdf', lastModified: Date.now() });

    const docInfo: UploadedDocument = {
      documentId: `doc_${type}_${Date.now()}`,
      fileName: name,
      fileSizeBytes: blob.size + 42000,
      mimeType: 'application/pdf',
      pageCount: 1,
      uploadedAt: new Date().toISOString(),
      isSimulatedDemo: true,
    };

    setQueue((prev) => [
      ...prev,
      {
        id: docInfo.documentId,
        file: mockFile,
        docInfo,
        sampleType: type,
      },
    ]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const dismissError = (id: string) => {
    setErrors((prev) => prev.filter((err) => err.id !== id));
  };

  const handleStartAnalysis = async () => {
    if (queue.length === 0) return;
    setIsProcessing(true);
    setProcessingStatus('Initializing extraction pipeline...');

    const firstItem = queue[0];
    const sampleType = firstItem.sampleType || 'mixed';

    try {
      // If user uploaded a real file (not demo), run live Gemini Multimodal extraction
      if (!firstItem.docInfo.isSimulatedDemo) {
        setProcessingStatus('Analyzing report with Google Gemini Multimodal Vision...');
        const formData = new FormData();
        formData.append('file', firstItem.file);
        formData.append('documentId', firstItem.docInfo.documentId);

        const res = await fetch('/api/reports/ocr', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.rows && data.rows.length > 0) {
            setProcessingStatus(`Successfully extracted ${data.rows.length} parameters! Finalizing...`);
            if (typeof window !== 'undefined') {
              localStorage.setItem('saarthi_active_candidate_rows', JSON.stringify(data.rows));
              localStorage.setItem('saarthi_active_fixture_id', 'uploaded');
              localStorage.setItem('saarthi_uploaded_report_name', firstItem.file.name);
            }
            setTimeout(() => {
              router.push('/review?fixture=uploaded');
            }, 300);
            return;
          } else {
            throw new Error('No structured laboratory parameters could be identified from this document.');
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server extraction returned error ${res.status}`);
        }
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrors((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          fileName: firstItem.file.name,
          message: err?.message || 'Failed to extract laboratory report. Please check the file or try another image/PDF.',
        },
      ]);
      setIsProcessing(false);
      setProcessingStatus(null);
      return;
    }

    // Default or sample fallback
    setProcessingStatus('Finalizing candidate parameter rows...');
    setTimeout(() => {
      router.push(`/review?fixture=${sampleType}`);
    }, 400);
  };


  return (
    <div className="space-y-6">
      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-4 ${
          isDragging
            ? 'border-sky-400 bg-sky-950/40 scale-[1.01]'
            : 'border-slate-800 dark:border-slate-800 border-slate-300 bg-slate-900/40 dark:bg-slate-900/40 bg-white hover:border-slate-700'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-inner">
          <Upload className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-white dark:text-white text-slate-900">
            Drag &amp; drop laboratory reports here, or choose an option
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 max-w-md mx-auto">
            Upload single or multi-page documents. Supported formats: PDF, JPG, PNG, WEBP (up to 20MB).
          </p>
        </div>

        {/* Action Buttons: Browse and Camera */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Browse Files</span>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 dark:text-slate-200 text-slate-700 bg-slate-800 dark:bg-slate-800 bg-slate-100 hover:bg-slate-700 dark:hover:bg-slate-700 hover:bg-slate-200 border border-slate-700 dark:border-slate-700 border-slate-300 transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Mobile Camera</span>
          </button>
        </div>

        {/* Fast-Track Demo Report Buttons Inside Uploader */}
        <div className="pt-3 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-200 w-full max-w-lg">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 text-slate-500 block mb-2">
            Or quickly add pre-configured demo reports to test uploader:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => loadSampleFile('clean')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-sky-950/40 dark:bg-sky-950/40 bg-sky-50 text-sky-400 hover:bg-sky-900/40 border border-sky-800/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Sample CBC Report</span>
            </button>
            <button
              type="button"
              onClick={() => loadSampleFile('mixed')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-950/40 dark:bg-indigo-950/40 bg-indigo-50 text-indigo-400 hover:bg-indigo-900/40 border border-indigo-800/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Sample Metabolic Panel</span>
            </button>
            <button
              type="button"
              onClick={() => loadSampleFile('uncertain')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-950/40 dark:bg-amber-950/40 bg-amber-50 text-amber-400 hover:bg-amber-900/40 border border-amber-800/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Ambiguous Scan</span>
            </button>
          </div>
        </div>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((err) => (
            <div
              key={err.id}
              className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-between text-xs text-red-200"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white mr-1">{err.fileName}:</span>
                  <span>{err.message}</span>
                </div>
              </div>
              <button
                onClick={() => dismissError(err.id)}
                className="text-red-400 hover:text-white ml-2 text-sm font-bold"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selected File Queue Preview */}
      {queue.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white dark:text-white text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Selected Reports for this Session ({queue.length})</span>
            </h4>
            <button
              onClick={() => setQueue([])}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {queue.map((item) => {
              const isPdf = item.file.type === 'application/pdf' || item.file.name.endsWith('.pdf');
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 bg-white border border-slate-800 dark:border-slate-800 border-slate-200 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-slate-800 dark:bg-slate-800 bg-slate-100 text-sky-400 shrink-0">
                      {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 text-slate-800 truncate">
                        {item.file.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {formatFileSize(item.file.size)} &bull; {isPdf ? 'Document PDF' : 'Image'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 dark:hover:bg-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action CTA & Processing state */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {processingStatus || 'Files validated &bull; Ready for layout-aware parsing'}
            </span>

            <button
              onClick={handleStartAnalysis}
              disabled={isProcessing}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
            >
              {isProcessing && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isProcessing ? 'Processing Report...' : `Analyze ${queue.length} Report(s)`}</span>
              {!isProcessing && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
