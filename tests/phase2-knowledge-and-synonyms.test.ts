import { describe, it, expect } from 'vitest';
import { CANONICAL_TEST_CATALOG } from '@/lib/knowledge/test-catalog';
import { matchTestToCanonical } from '@/lib/knowledge/synonym-matcher';
import {
  normalizeCandidateRow,
  isCategoricalResultText,
  parseNumericValue,
  parseReferenceRangeString,
} from '@/lib/services/normalization-service';

describe('Phase 2: Canonical Knowledge Catalogue & Normalization', () => {
  it('covers all 6 required MVP categories', () => {
    const categories = new Set(Object.values(CANONICAL_TEST_CATALOG).map((t) => t.category));
    expect(categories.has('CBC')).toBe(true);
    expect(categories.has('DIABETES_GLUCOSE')).toBe(true);
    expect(categories.has('LIVER')).toBe(true);
    expect(categories.has('KIDNEY')).toBe(true);
    expect(categories.has('THYROID')).toBe(true);
    expect(categories.has('LIPID_PROFILE')).toBe(true);
  });

  describe('Synonym Mapping and Canonical IDs', () => {
    it('maps SGPT / ALT variations to canonical ALT_SGPT', () => {
      expect(matchTestToCanonical('SGPT').canonicalId).toBe('ALT_SGPT');
      expect(matchTestToCanonical('ALT').canonicalId).toBe('ALT_SGPT');
      expect(matchTestToCanonical('Alanine Transaminase').canonicalId).toBe('ALT_SGPT');
      expect(matchTestToCanonical('ALT (SGPT)').canonicalId).toBe('ALT_SGPT');
      expect(matchTestToCanonical('SGPT / ALT').canonicalId).toBe('ALT_SGPT');
    });

    it('maps SGOT / AST variations to canonical AST_SGOT', () => {
      expect(matchTestToCanonical('SGOT').canonicalId).toBe('AST_SGOT');
      expect(matchTestToCanonical('AST').canonicalId).toBe('AST_SGOT');
      expect(matchTestToCanonical('Aspartate Aminotransferase').canonicalId).toBe('AST_SGOT');
      expect(matchTestToCanonical('AST (SGOT)').canonicalId).toBe('AST_SGOT');
    });

    it('maps Creatinine variations to canonical CREATININE', () => {
      expect(matchTestToCanonical('Serum Creatinine').canonicalId).toBe('CREATININE');
      expect(matchTestToCanonical('Blood Creatinine').canonicalId).toBe('CREATININE');
      expect(matchTestToCanonical('Creatinine').canonicalId).toBe('CREATININE');
      expect(matchTestToCanonical('S. Creatinine').canonicalId).toBe('CREATININE');
    });

    it('maps Hemoglobin variations to canonical HEMOGLOBIN', () => {
      expect(matchTestToCanonical('Hemoglobin').canonicalId).toBe('HEMOGLOBIN');
      expect(matchTestToCanonical('Haemoglobin').canonicalId).toBe('HEMOGLOBIN');
      expect(matchTestToCanonical('Hb').canonicalId).toBe('HEMOGLOBIN');
      expect(matchTestToCanonical('Hemoglobin (Hb)').canonicalId).toBe('HEMOGLOBIN');
    });

    it('maps Glucose and HbA1c variations', () => {
      expect(matchTestToCanonical('Fasting Blood Sugar').canonicalId).toBe('FASTING_GLUCOSE');
      expect(matchTestToCanonical('FBS').canonicalId).toBe('FASTING_GLUCOSE');
      expect(matchTestToCanonical('HbA1c').canonicalId).toBe('HBA1C');
      expect(matchTestToCanonical('Glycated Hemoglobin').canonicalId).toBe('HBA1C');
    });

    it('marks unknown/unmapped tests safely without guessing', () => {
      const match = matchTestToCanonical('Random Unrecognized Chemical XYZ');
      expect(match.matched).toBe(false);
      expect(match.canonicalId).toBe('UNMAPPED');
    });
  });

  describe('Categorical vs. Numeric Separation (Non-negotiable rule)', () => {
    it('detects qualitative categorical strings accurately', () => {
      expect(isCategoricalResultText('Positive')).toBe(true);
      expect(isCategoricalResultText('Negative')).toBe(true);
      expect(isCategoricalResultText('Reactive')).toBe(true);
      expect(isCategoricalResultText('Non-Reactive')).toBe(true);
      expect(isCategoricalResultText('Detected')).toBe(true);
      expect(isCategoricalResultText('Not Detected')).toBe(true);
      expect(isCategoricalResultText('B+')).toBe(true);
      expect(isCategoricalResultText('O Positive')).toBe(true);
      expect(isCategoricalResultText('14.2')).toBe(false);
    });

    it('does NOT coerce categorical blood group or qualitative markers to numbers', () => {
      const row = normalizeCandidateRow({
        documentId: 'doc-1',
        pageNumber: 1,
        rowId: 'row-1',
        rawTestName: 'Blood Group',
        rawValueText: 'B+',
        rawUnitText: '',
      });

      expect(row.resultType).toBe('CATEGORICAL');
      expect(row.parsedNumericValue).toBeUndefined();
      expect(row.parsedCategoricalValue).toBe('B+');
      expect(row.comparisonStatus).toBe('CATEGORICAL_REVIEW');
    });

    it('does NOT coerce "Positive" into a number', () => {
      const row = normalizeCandidateRow({
        documentId: 'doc-1',
        pageNumber: 1,
        rowId: 'row-2',
        rawTestName: 'Urine Albumin',
        rawValueText: 'Positive',
        rawUnitText: '',
      });

      expect(row.resultType).toBe('CATEGORICAL');
      expect(row.parsedNumericValue).toBeUndefined();
      expect(row.parsedCategoricalValue).toBe('Positive');
    });
  });

  describe('Numeric & Reference Range Parsing', () => {
    it('parses numbers with decimals, commas, and operators safely', () => {
      expect(parseNumericValue('14.2').value).toBe(14.2);
      expect(parseNumericValue('1,50,000').value).toBe(150000);
      expect(parseNumericValue('< 0.5')).toEqual({ isNumeric: true, value: 0.5, comparator: '<' });
      expect(parseNumericValue('> 100')).toEqual({ isNumeric: true, value: 100, comparator: '>' });
    });

    it('parses standard printed range intervals', () => {
      const range = parseReferenceRangeString('13.0 - 17.0');
      expect(range?.low).toBe(13.0);
      expect(range?.high).toBe(17.0);
      expect(range?.comparator).toBe('RANGE');
    });

    it('parses one-sided upper limit range intervals', () => {
      const range = parseReferenceRangeString('< 100');
      expect(range?.high).toBe(100);
      expect(range?.comparator).toBe('<=');
    });

    it('preserves the original raw test name and raw value verbatim in the candidate row', () => {
      const row = normalizeCandidateRow({
        documentId: 'doc-abc',
        pageNumber: 2,
        rowId: 'row-99',
        rawTestName: 'S.G.P.T. (ALT)',
        rawValueText: '42.5',
        rawUnitText: 'U/L',
        rawRangeText: '10 - 40',
      });

      expect(row.rawTestName).toBe('S.G.P.T. (ALT)');
      expect(row.rawValueText).toBe('42.5');
      expect(row.canonicalId).toBe('ALT_SGPT');
      expect(row.parsedNumericValue).toBe(42.5);
      expect(row.referenceRangeOrigin.rawRangeText).toBe('10 - 40');
    });
  });
});
