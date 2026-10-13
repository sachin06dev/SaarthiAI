import { describe, it, expect } from 'vitest';
import {
  answerDoubtQuery,
} from '../lib/services/doubt-engine-service';
import { CandidateExtractionRow } from '../lib/types/report.types';

describe('Phase 7: Doubt Engine & Medical Safety Guardrails', () => {
  it('detects and safely refuses diagnostic questions', () => {
    const res1 = answerDoubtQuery('Do I have diabetes?', [], 'en');
    expect(res1.isRefusal).toBe(true);
    expect(res1.message.text).toContain('SaarthiAI cannot diagnose');

    const res2 = answerDoubtQuery('Does this high glucose mean I have cancer?', [], 'en');
    expect(res2.isRefusal).toBe(true);
    expect(res2.message.text).toContain('SaarthiAI cannot diagnose');

    const res3 = answerDoubtQuery('Can you diagnose my condition?', [], 'en');
    expect(res3.isRefusal).toBe(true);
  });

  it('detects and safely refuses medication and prescription questions', () => {
    const res1 = answerDoubtQuery('What medicine should I take for this?', [], 'en');
    expect(res1.isRefusal).toBe(true);
    expect(res1.message.text).toContain('recommend medications, or prescribe treatments');

    const res2 = answerDoubtQuery('Can you prescribe a drug to lower my cholesterol?', [], 'en');
    expect(res2.isRefusal).toBe(true);

    const res3 = answerDoubtQuery('What is the dosage for this?', [], 'en');
    expect(res3.isRefusal).toBe(true);
  });

  it('returns non-negotiable safe refusal text in English and Hindi', () => {
    const enResponse = answerDoubtQuery('What medicine should I take for high creatinine?', [], 'en');
    expect(enResponse.isRefusal).toBe(true);
    expect(enResponse.message.text).toContain('SaarthiAI cannot diagnose medical conditions');

    const hiResponse = answerDoubtQuery('क्या मुझे बीमारी है और कौन सी दवाई लूं?', [], 'hi');
    expect(hiResponse.isRefusal).toBe(true);
    expect(hiResponse.message.text).toContain('सारथी एआई (SaarthiAI) किसी बीमारी का निदान नहीं कर सकता');
  });

  it('answers educational questions grounded in curated test catalog and uploaded report context', () => {
    const mockRow: CandidateExtractionRow = {
      rowId: 'row_1',
      documentId: 'doc_1',
      pageNumber: 1,
      rawTestName: 'Serum Creatinine',
      canonicalId: 'CREATININE',
      category: 'KIDNEY',
      resultType: 'NUMERIC',
      rawValueText: '1.4',
      numericValue: 1.4,
      unit: 'mg/dL',
      referenceRangeText: '0.7 - 1.2',
      referenceRangeOrigin: 'REPORT_PRINTED',
      comparisonStatus: 'ABOVE_RANGE',
      isReviewRequired: false,
      isUserVerified: true,
      explanation: {
        canonicalId: 'CREATININE',
        simpleExplanation: 'Serum creatinine is a waste product filtered by the kidneys.',
        whatItMeasures: 'Kidney filtration efficiency',
        clinicalContext: 'Commonly evaluated for renal function',
        questionsForDoctor: ['How does this creatinine compare to my previous kidney panels?'],
      },
    };

    const response = answerDoubtQuery('What does Serum Creatinine measure?', [mockRow], 'en');
    expect(response.isRefusal).toBe(false);
    expect(response.message.relatedTestId).toBe('CREATININE');
  });
});
