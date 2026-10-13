import { describe, it, expect } from 'vitest';
import {
  evaluateResultAgainstReferenceInterval,
  areUnitsCompatible,
} from '@/lib/services/rule-engine';
import { CandidateExtractionRow } from '@/lib/types/report.types';

describe('Phase 6: Reference-Source Registry & Deterministic Rule Engine', () => {
  it('detects unit compatibility accurately', () => {
    expect(areUnitsCompatible('g/dL', 'g/dL')).toBe(true);
    expect(areUnitsCompatible('g/dL', 'gm/dl')).toBe(true);
    expect(areUnitsCompatible('U/L', 'IU/L')).toBe(true);
    expect(areUnitsCompatible('mg/dL', 'mmol/L')).toBe(false);
  });

  it('classifies exact boundary values as IN_RANGE (inclusive bounds)', () => {
    const lowerBoundaryRow: CandidateExtractionRow = {
      rowId: 'row-1',
      documentId: 'doc-1',
      pageNumber: 1,
      rawTestName: 'Hemoglobin',
      rawValueText: '13.0',
      rawUnitText: 'g/dL',
      rawRangeText: '13.0 - 17.0',
      canonicalId: 'HEMOGLOBIN',
      category: 'CBC',
      resultType: 'NUMERIC',
      parsedNumericValue: 13.0,
      parsedUnit: 'g/dL',
      parsedRange: { low: 13.0, high: 17.0, comparator: 'RANGE' },
      isReviewRequired: false,
      isUserVerified: true,
      referenceRangeOrigin: { sourceType: 'REPORT_PRINTED', unit: 'g/dL', rawRangeText: '13.0 - 17.0' },
      comparisonStatus: 'REVIEW_REQUIRED',
      statusExplanation: '',
    };

    const resLower = evaluateResultAgainstReferenceInterval(lowerBoundaryRow);
    expect(resLower.comparisonStatus).toBe('IN_RANGE');

    // Upper boundary
    const upperBoundaryRow = { ...lowerBoundaryRow, parsedNumericValue: 17.0, rawValueText: '17.0' };
    const resUpper = evaluateResultAgainstReferenceInterval(upperBoundaryRow);
    expect(resUpper.comparisonStatus).toBe('IN_RANGE');
  });

  it('classifies values below and above reference intervals', () => {
    const baseRow: CandidateExtractionRow = {
      rowId: 'row-2',
      documentId: 'doc-1',
      pageNumber: 1,
      rawTestName: 'Fasting Blood Glucose',
      rawValueText: '64',
      rawUnitText: 'mg/dL',
      rawRangeText: '70 - 100',
      canonicalId: 'FASTING_GLUCOSE',
      category: 'DIABETES_GLUCOSE',
      resultType: 'NUMERIC',
      parsedNumericValue: 64,
      parsedUnit: 'mg/dL',
      parsedRange: { low: 70, high: 100, comparator: 'RANGE' },
      isReviewRequired: false,
      isUserVerified: true,
      referenceRangeOrigin: { sourceType: 'REPORT_PRINTED', unit: 'mg/dL', rawRangeText: '70 - 100' },
      comparisonStatus: 'REVIEW_REQUIRED',
      statusExplanation: '',
    };

    // Below
    const resBelow = evaluateResultAgainstReferenceInterval(baseRow);
    expect(resBelow.comparisonStatus).toBe('BELOW_RANGE');

    // Above
    const resAbove = evaluateResultAgainstReferenceInterval({
      ...baseRow,
      parsedNumericValue: 135,
      rawValueText: '135',
    });
    expect(resAbove.comparisonStatus).toBe('ABOVE_RANGE');
  });

  it('uses curated Indian fallback when report range is missing, preserving full provenance', () => {
    const rowWithoutReportRange: CandidateExtractionRow = {
      rowId: 'row-3',
      documentId: 'doc-1',
      pageNumber: 1,
      rawTestName: 'Serum Creatinine',
      rawValueText: '1.8',
      rawUnitText: 'mg/dL',
      rawRangeText: '',
      canonicalId: 'CREATININE',
      category: 'KIDNEY',
      resultType: 'NUMERIC',
      parsedNumericValue: 1.8,
      parsedUnit: 'mg/dL',
      isReviewRequired: false,
      isUserVerified: true,
      referenceRangeOrigin: { sourceType: 'NONE', unit: 'mg/dL', rawRangeText: '' },
      comparisonStatus: 'REVIEW_REQUIRED',
      statusExplanation: '',
    };

    const res = evaluateResultAgainstReferenceInterval(rowWithoutReportRange);
    expect(res.appliedRangeOrigin.sourceType).toBe('CURATED_INDIAN_FALLBACK');
    expect(res.appliedRangeOrigin.sourceOrganization).toContain('PubMed 30074895');
    expect(res.comparisonStatus).toBe('ABOVE_RANGE'); // 1.8 > 1.3
  });

  it('detects UNIT_MISMATCH when report unit conflicts with fallback range', () => {
    const mismatchRow: CandidateExtractionRow = {
      rowId: 'row-4',
      documentId: 'doc-1',
      pageNumber: 1,
      rawTestName: 'Total Cholesterol',
      rawValueText: '5.2',
      rawUnitText: 'mmol/L', // European unit, fallback uses mg/dL
      rawRangeText: '',
      canonicalId: 'TOTAL_CHOLESTEROL',
      category: 'LIPID_PROFILE',
      resultType: 'NUMERIC',
      parsedNumericValue: 5.2,
      parsedUnit: 'mmol/L',
      isReviewRequired: false,
      isUserVerified: true,
      referenceRangeOrigin: { sourceType: 'NONE', unit: 'mmol/L', rawRangeText: '' },
      comparisonStatus: 'REVIEW_REQUIRED',
      statusExplanation: '',
    };

    const res = evaluateResultAgainstReferenceInterval(mismatchRow);
    expect(res.comparisonStatus).toBe('UNIT_MISMATCH');
    expect(res.statusExplanation).toContain('incompatible');
  });

  it('returns NO_VERIFIED_RANGE for unknown/unmapped tests without fabricating numbers', () => {
    const unmappedRow: CandidateExtractionRow = {
      rowId: 'row-5',
      documentId: 'doc-1',
      pageNumber: 1,
      rawTestName: 'Mystery Biomarker Beta',
      rawValueText: '45',
      rawUnitText: 'ng/mL',
      rawRangeText: '',
      canonicalId: 'UNMAPPED',
      category: 'UNMAPPED',
      resultType: 'NUMERIC',
      parsedNumericValue: 45,
      parsedUnit: 'ng/mL',
      isReviewRequired: false,
      isUserVerified: true,
      referenceRangeOrigin: { sourceType: 'NONE', unit: 'ng/mL', rawRangeText: '' },
      comparisonStatus: 'REVIEW_REQUIRED',
      statusExplanation: '',
    };

    const res = evaluateResultAgainstReferenceInterval(unmappedRow);
    expect(res.comparisonStatus).toBe('NO_VERIFIED_RANGE');
    expect(res.statusExplanation).toContain('No verified applicable reference range found');
  });

  it('returns CATEGORICAL_REVIEW for Blood Group without coercing to numbers', () => {
    const catRow: CandidateExtractionRow = {
      rowId: 'row-6',
      documentId: 'doc-1',
      pageNumber: 1,
      rawTestName: 'ABO Blood Group',
      rawValueText: 'B+',
      rawUnitText: '',
      rawRangeText: '',
      canonicalId: 'BLOOD_GROUP_ABO_RH',
      category: 'CBC',
      resultType: 'CATEGORICAL',
      parsedCategoricalValue: 'B+',
      parsedUnit: '',
      isReviewRequired: false,
      isUserVerified: true,
      referenceRangeOrigin: { sourceType: 'NONE', unit: '', rawRangeText: '' },
      comparisonStatus: 'CATEGORICAL_REVIEW',
      statusExplanation: '',
    };

    const res = evaluateResultAgainstReferenceInterval(catRow);
    expect(res.comparisonStatus).toBe('CATEGORICAL_REVIEW');
    expect(res.statusExplanation).toContain('Qualitative / Categorical result');
  });
});
