'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Edit3,
  FileText,
  Search,
  Filter,
  Layers,
  History,
  Check,
  X,
} from 'lucide-react';
import { CandidateExtractionRow } from '@/lib/types/report.types';
import { applyUserCorrectionToRow, UserCorrectionInput } from '@/lib/services/correction-service';

interface Props {
  initialRows: CandidateExtractionRow[];
  onRowsUpdated?: (rows: CandidateExtractionRow[]) => void;
  onProceed?: () => void;
}

export function ExtractionReviewTable({ initialRows, onRowsUpdated, onProceed }: Props) {
  const [rows, setRows] = useState<CandidateExtractionRow[]>(initialRows);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNeedsReviewOnly, setFilterNeedsReviewOnly] = useState(false);
  const [editingRow, setEditingRow] = useState<CandidateExtractionRow | null>(null);

  // Edit form state
  const [formName, setFormName] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formRange, setFormRange] = useState('');

  const openEditModal = (row: CandidateExtractionRow) => {
    setEditingRow(row);
    setFormName(row.rawTestName);
    setFormValue(row.rawValueText);
    setFormUnit(row.rawUnitText);
    setFormRange(row.rawRangeText);
  };

  const handleSaveCorrection = () => {
    if (!editingRow) return;

    const correction: UserCorrectionInput = {
      rowId: editingRow.rowId,
      correctedTestName: formName,
      correctedValue: formValue,
      correctedUnit: formUnit,
      correctedRange: formRange,
    };

    const updatedRow = applyUserCorrectionToRow(editingRow, correction);
    const updatedRows = rows.map((r) => (r.rowId === editingRow.rowId ? updatedRow : r));

    setRows(updatedRows);
    if (onRowsUpdated) onRowsUpdated(updatedRows);
    setEditingRow(null);
  };

  const handleVerifyRow = (rowId: string) => {
    const updatedRows = rows.map((r) => {
      if (r.rowId === rowId) {
        return {
          ...r,
          isUserVerified: true,
          isReviewRequired: false,
          reviewReason: undefined,
          comparisonStatus: r.comparisonStatus === 'REVIEW_REQUIRED' ? 'NO_VERIFIED_RANGE' : r.comparisonStatus,
        };
      }
      return r;
    });
    setRows(updatedRows);
    if (onRowsUpdated) onRowsUpdated(updatedRows);
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.rawTestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.canonicalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterNeedsReviewOnly) {
      return matchesSearch && (row.isReviewRequired || !row.isUserVerified);
    }
    return matchesSearch;
  });

  const needsReviewCount = rows.filter((r) => r.isReviewRequired || !r.isUserVerified).length;
  const verifiedCount = rows.filter((r) => r.isUserVerified).length;

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extracted tests, canonical IDs, or categories..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterNeedsReviewOnly(!filterNeedsReviewOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              filterNeedsReviewOnly
                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Needs Review ({needsReviewCount})</span>
          </button>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Verified: {verifiedCount} / {rows.length}
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/50 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-3 px-4">Test Name (Extracted / Normalized)</th>
              <th className="py-3 px-4">Observed Value</th>
              <th className="py-3 px-4">Unit</th>
              <th className="py-3 px-4">Report Range</th>
              <th className="py-3 px-4">Provenance</th>
              <th className="py-3 px-4">Status &amp; Verification</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredRows.map((row) => (
              <tr key={row.rowId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white">{row.rawTestName}</div>
                  <div className="text-[11px] text-sky-400/80 font-mono flex items-center space-x-1 mt-0.5">
                    <span>{row.canonicalId}</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-slate-400">{row.category}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="text-sm font-bold text-slate-100">
                    {row.resultType === 'CATEGORICAL'
                      ? row.parsedCategoricalValue
                      : row.parsedNumericValue ?? row.rawValueText}
                  </span>
                  {row.userCorrectionAudit && (
                    <div className="text-[10px] text-sky-400 flex items-center space-x-1 mt-0.5">
                      <History className="w-3 h-3" />
                      <span>Original: {row.userCorrectionAudit.originalRawValue}</span>
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {row.parsedUnit || <span className="text-slate-500 italic">None</span>}
                </td>

                <td className="py-3.5 px-4 text-slate-300 font-mono">
                  {row.rawRangeText || <span className="text-slate-500 italic">Not printed</span>}
                </td>

                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  <div>Pg. {row.pageNumber}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[100px]">{row.documentId}</div>
                </td>

                <td className="py-3.5 px-4">
                  {row.isReviewRequired ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-950 text-purple-300 border border-purple-800/60">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Review Required</span>
                    </span>
                  ) : row.isUserVerified ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300">
                      <span>Parsed</span>
                    </span>
                  )}
                  {row.reviewReason && (
                    <div className="text-[10px] text-purple-400 mt-1 max-w-[180px] leading-tight">
                      {row.reviewReason}
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right space-x-1">
                  {!row.isUserVerified && (
                    <button
                      onClick={() => handleVerifyRow(row.rowId)}
                      title="Confirm this extraction is accurate"
                      className="p-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-400 hover:bg-emerald-900 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(row)}
                    title="Correct test name, value, or range"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredRows.map((row) => (
          <div
            key={row.rowId}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{row.rawTestName}</h4>
                <div className="text-[11px] text-sky-400 font-mono mt-0.5">
                  {row.canonicalId} &bull; {row.category}
                </div>
              </div>
              <button
                onClick={() => openEditModal(row)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 block">Observed Value</span>
                <span className="font-bold text-white text-sm">
                  {row.parsedNumericValue ?? row.parsedCategoricalValue ?? row.rawValueText}
                </span>
                {row.userCorrectionAudit && (
                  <span className="text-[10px] text-sky-400 block">
                    Edited (Orig: {row.userCorrectionAudit.originalRawValue})
                  </span>
                )}
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Unit</span>
                <span className="font-mono text-slate-300">{row.parsedUnit || 'None'}</span>
              </div>
              <div className="col-span-2 border-t border-slate-800/60 pt-1.5">
                <span className="text-[10px] text-slate-500 block">Report Range</span>
                <span className="font-mono text-slate-300">{row.rawRangeText || 'Not printed'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {row.isReviewRequired ? (
                <span className="text-[11px] text-purple-400 font-semibold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Review Required</span>
                </span>
              ) : row.isUserVerified ? (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Parsed Extraction</span>
              )}

              {!row.isUserVerified && (
                <button
                  onClick={() => handleVerifyRow(row.rowId)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950 border border-emerald-800 text-emerald-300"
                >
                  Confirm Accurate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Correction Modal */}
      {editingRow && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Correct Extraction Row</h3>
                <p className="text-xs text-slate-400">
                  Original extraction is permanently preserved in the audit log.
                </p>
              </div>
              <button
                onClick={() => setEditingRow(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Test Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Observed Value</label>
                  <input
                    type="text"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Unit</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Reference Range (on Report)</label>
                <input
                  type="text"
                  value={formRange}
                  onChange={(e) => setFormRange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  placeholder="e.g. 13.0 - 17.0 or < 100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setEditingRow(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCorrection}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20"
              >
                Save &amp; Revalidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          {needsReviewCount > 0 ? (
            <span className="text-purple-400 font-medium">
              &bull; {needsReviewCount} item(s) flagged for review. You can edit or verify them.
            </span>
          ) : (
            <span className="text-emerald-400 font-medium">
              &bull; All extracted parameters are verified and ready for rule comparison.
            </span>
          )}
        </div>

        <button
          onClick={onProceed}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-sky-500/20"
        >
          Confirm &amp; Run Rule Engine &rarr;
        </button>
      </div>
    </div>
  );
}
