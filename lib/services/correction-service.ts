import { CandidateExtractionRow } from '../types/report.types';
import { normalizeCandidateRow } from './normalization-service';

export interface UserCorrectionInput {
  rowId: string;
  correctedTestName?: string;
  correctedValue?: string;
  correctedUnit?: string;
  correctedRange?: string;
}

/**
 * Applies an auditable user correction to an extracted row.
 * Non-negotiable rule: Original raw text and source provenance are NEVER overwritten.
 * Re-runs normalization to re-validate parsed values and types from scratch.
 */
export function applyUserCorrectionToRow(
  originalRow: CandidateExtractionRow,
  correction: UserCorrectionInput
): CandidateExtractionRow {
  const newRawName = correction.correctedTestName ?? originalRow.rawTestName;
  const newRawValue = correction.correctedValue ?? originalRow.rawValueText;
  const newRawUnit = correction.correctedUnit ?? originalRow.rawUnitText;
  const newRawRange = correction.correctedRange ?? originalRow.rawRangeText;

  // Re-run normalization with the updated candidate inputs
  const revalidated = normalizeCandidateRow({
    documentId: originalRow.documentId,
    pageNumber: originalRow.pageNumber,
    rowId: originalRow.rowId,
    rawTestName: newRawName,
    rawValueText: newRawValue,
    rawUnitText: newRawUnit,
    rawRangeText: newRawRange,
    rawFlagText: originalRow.rawFlagText,
    confidenceScore: 1.0, // User verified
  });

  // Preserve the original extraction fields and append the audit record
  return {
    ...revalidated,
    rawTestName: originalRow.rawTestName, // Keep original extraction intact
    rawValueText: originalRow.rawValueText, // Keep original extraction intact
    rawUnitText: originalRow.rawUnitText, // Keep original extraction intact
    rawRangeText: originalRow.rawRangeText, // Keep original extraction intact
    isUserVerified: true,
    isReviewRequired: false,
    reviewReason: undefined,
    userCorrectionAudit: {
      originalRawValue: originalRow.rawValueText,
      correctedValue: newRawValue,
      originalUnit: originalRow.rawUnitText,
      correctedUnit: newRawUnit,
      editedAt: new Date().toISOString(),
    },
  };
}
