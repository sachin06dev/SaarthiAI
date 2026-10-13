import { describe, it, expect } from 'vitest';
import {
  parseTabularLine,
  parseReportTextToCandidateRows,
} from '@/lib/services/report-parser';
import {
  CLEAN_DEMO_TEXT,
  MIXED_DEMO_TEXT,
  UNCERTAIN_DEMO_TEXT,
  LocalDocumentExtractionProvider,
} from '@/lib/services/ocr-service';

describe('Phase 4: Structured Report Parsing & OCR Fixtures', () => {
  it('parses standard clinical tabular rows', () => {
    const parsed = parseTabularLine('Hemoglobin                         14.8            g/dL         13.0 - 17.0');
    expect(parsed).not.toBeNull();
    expect(parsed?.testNameCandidate).toBe('Hemoglobin');
    expect(parsed?.valueCandidate).toBe('14.8');
    expect(parsed?.unitCandidate).toBe('g/dL');
    expect(parsed?.rangeCandidate).toBe('13.0 - 17.0');
    expect(parsed?.isAmbiguous).toBe(false);
  });

  it('ignores metadata and header lines', () => {
    expect(parseTabularLine('APOLLO DIAGNOSTICS & PATHOLOGY LABS')).toBeNull();
    expect(parseTabularLine('Investigation                      Observed Value  Unit         Reference Interval')).toBeNull();
    expect(parseTabularLine('Page 1 of 2')).toBeNull();
  });

  it('extracts candidate rows from Clean Demo fixture', () => {
    const rows = parseReportTextToCandidateRows(CLEAN_DEMO_TEXT, 'doc_clean_1', 1);
    expect(rows.length).toBeGreaterThanOrEqual(6);

    const hbRow = rows.find((r) => r.canonicalId === 'HEMOGLOBIN');
    expect(hbRow).toBeDefined();
    expect(hbRow?.parsedNumericValue).toBe(14.8);
    expect(hbRow?.parsedUnit).toBe('g/dL');
    expect(hbRow?.referenceRangeOrigin.rawRangeText).toBe('13.0 - 17.0');
    expect(hbRow?.pageNumber).toBe(1);
    expect(hbRow?.documentId).toBe('doc_clean_1');
  });

  it('extracts candidate rows from Mixed Demo fixture and preserves B+ Blood Group', () => {
    const rows = parseReportTextToCandidateRows(MIXED_DEMO_TEXT, 'doc_mixed_1', 1);
    expect(rows.length).toBeGreaterThanOrEqual(7);

    // Glucose row
    const fbsRow = rows.find((r) => r.canonicalId === 'FASTING_GLUCOSE');
    expect(fbsRow).toBeDefined();
    expect(fbsRow?.parsedNumericValue).toBe(132);

    // ALT row
    const altRow = rows.find((r) => r.canonicalId === 'ALT_SGPT');
    expect(altRow).toBeDefined();
    expect(altRow?.parsedNumericValue).toBe(58);

    // Blood group
    const bgRow = rows.find((r) => r.canonicalId === 'BLOOD_GROUP_ABO_RH');
    expect(bgRow).toBeDefined();
    expect(bgRow?.resultType).toBe('CATEGORICAL');
    expect(bgRow?.parsedCategoricalValue).toBe('B+');
  });

  it('flags ambiguous rows and unrecognized analytes for user review in Uncertain Demo fixture', () => {
    const rows = parseReportTextToCandidateRows(UNCERTAIN_DEMO_TEXT, 'doc_uncertain_1', 1);

    // Unrecognized biomarker
    const unmappedRow = rows.find((r) => r.canonicalId === 'UNMAPPED');
    expect(unmappedRow).toBeDefined();
    expect(unmappedRow?.isReviewRequired).toBe(true);
    expect(unmappedRow?.comparisonStatus).toBe('REVIEW_REQUIRED');

    // Missing unit on Alkaline Phosphatase
    const alpRow = rows.find((r) => r.canonicalId === 'ALP');
    expect(alpRow).toBeDefined();
    expect(alpRow?.isReviewRequired).toBe(true);
    expect(alpRow?.reviewReason).toContain('Missing unit');
  });

  it('LocalDocumentExtractionProvider serves fixtures correctly', async () => {
    const provider = new LocalDocumentExtractionProvider();
    const rows = await provider.extractRows({
      documentId: 'doc_test',
      fileName: 'clean_report.pdf',
      fileSizeBytes: 1024,
      mimeType: 'application/pdf',
      pageCount: 1,
      uploadedAt: new Date().toISOString(),
      isSimulatedDemo: true,
    });

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].documentId).toBe('doc_test');
  });
});
