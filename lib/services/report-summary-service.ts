import {
  CandidateExtractionRow,
  ReportAnalysisSummary,
  MultiReportSessionSummary,
} from '../types/report.types';
import { evaluateResultAgainstReferenceInterval } from './rule-engine';
import { generateGroundedExplanation } from './explanation-service';

/**
 * Evaluates candidate rows through the rule engine and compiles
 * objective summary metrics without generating health scores or diagnoses.
 */
export function buildEvaluatedReportSummary(
  rows: CandidateExtractionRow[],
  documentId: string = 'doc_01',
  fileName: string = 'Laboratory_Report.pdf',
  language: 'en' | 'hi' = 'en'
): ReportAnalysisSummary {
  const evaluatedRows: CandidateExtractionRow[] = rows.map((row) => {
    // Run deterministic rule engine
    const evalRes = evaluateResultAgainstReferenceInterval(row);
    const updatedRow: CandidateExtractionRow = {
      ...row,
      comparisonStatus: evalRes.comparisonStatus,
      statusExplanation: evalRes.statusExplanation,
      referenceRangeOrigin: evalRes.appliedRangeOrigin,
    };

    // Attach grounded explanation
    updatedRow.explanation = generateGroundedExplanation(updatedRow, language);
    return updatedRow;
  });

  const inRangeCount = evaluatedRows.filter((r) => r.comparisonStatus === 'IN_RANGE').length;
  const aboveRangeCount = evaluatedRows.filter((r) => r.comparisonStatus === 'ABOVE_RANGE').length;
  const belowRangeCount = evaluatedRows.filter((r) => r.comparisonStatus === 'BELOW_RANGE').length;
  const reviewRequiredCount = evaluatedRows.filter((r) => r.isReviewRequired || r.comparisonStatus === 'REVIEW_REQUIRED').length;
  const noVerifiedRangeCount = evaluatedRows.filter((r) => r.comparisonStatus === 'NO_VERIFIED_RANGE').length;
  const verifiedCount = evaluatedRows.filter((r) => r.isUserVerified).length;

  return {
    reportId: `rep_${Date.now()}`,
    documentId,
    fileName,
    totalTests: evaluatedRows.length,
    verifiedCount,
    inRangeCount,
    aboveRangeCount,
    belowRangeCount,
    reviewRequiredCount,
    noVerifiedRangeCount,
    items: evaluatedRows,
  };
}

/**
 * Combines multiple reports into a multi-report session summary while strictly
 * preserving per-document, per-page, and per-date provenance.
 */
export function buildMultiReportSessionSummary(
  reports: ReportAnalysisSummary[]
): MultiReportSessionSummary {
  let totalParameters = 0;
  let totalVerified = 0;
  let totalInRange = 0;
  let totalAboveRange = 0;
  let totalBelowRange = 0;
  let totalReviewRequired = 0;
  let totalNoVerifiedRange = 0;

  for (const rep of reports) {
    totalParameters += rep.totalTests;
    totalVerified += rep.verifiedCount;
    totalInRange += rep.inRangeCount;
    totalAboveRange += rep.aboveRangeCount;
    totalBelowRange += rep.belowRangeCount;
    totalReviewRequired += rep.reviewRequiredCount;
    totalNoVerifiedRange += rep.noVerifiedRangeCount;
  }

  return {
    sessionId: `session_${Date.now()}`,
    createdAt: new Date().toISOString(),
    totalDocuments: reports.length,
    totalParameters,
    totalVerified,
    totalInRange,
    totalAboveRange,
    totalBelowRange,
    totalReviewRequired,
    totalNoVerifiedRange,
    reports,
  };
}
