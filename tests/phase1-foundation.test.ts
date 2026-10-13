import { describe, it, expect } from 'vitest';
import { MockAIProvider } from '@/lib/providers/mock-ai-provider';
import { getAppConfig } from '@/lib/config';
import { CandidateExtractionRow } from '@/lib/types/report.types';

describe('Phase 1: Foundation, Safety Contract & Mock AI Provider', () => {
  const mockProvider = new MockAIProvider();

  it('defaults to mock AI provider when no keys are configured', () => {
    const config = getAppConfig();
    expect(config.aiProvider).toBe('mock');
    expect(config.isGeminiConfigured).toBe(false);
  });

  it('refuses dangerous diagnostic questions in English', async () => {
    const response = await mockProvider.askDoubtEngine(
      'Do I have cancer and which medicine should I take?',
      [],
      'en'
    );
    expect(response.isRefusal).toBe(true);
    expect(response.responseText).toContain('SaarthiAI cannot diagnose conditions');
    expect(response.responseText).toContain('prescribe medications');
  });

  it('refuses dangerous prescription questions in Hindi', async () => {
    const response = await mockProvider.askDoubtEngine(
      'मुझे कौन सी दवाई खानी चाहिए?',
      [],
      'hi'
    );
    expect(response.isRefusal).toBe(true);
    expect(response.responseText).toContain('सारथी एआई');
    expect(response.responseText).toContain('दवा');
  });

  it('provides safe, grounded educational explanation of laboratory units', async () => {
    const response = await mockProvider.askDoubtEngine(
      'What does mg/dL mean?',
      [],
      'en'
    );
    expect(response.isRefusal).toBe(false);
    expect(response.responseText).toContain('mg/dL');
    expect(response.responseText).toContain('concentration');
  });

  it('generates respectful doctor questions without altering medical facts', async () => {
    const sampleParam: CandidateExtractionRow = {
      rowId: 'row-1',
      documentId: 'doc-1',
      pageNumber: 1,
      rawTestName: 'Fasting Blood Glucose',
      rawValueText: '125',
      rawUnitText: 'mg/dL',
      rawRangeText: '70 - 100',
      canonicalId: 'FASTING_GLUCOSE',
      category: 'DIABETES_GLUCOSE',
      resultType: 'NUMERIC',
      parsedNumericValue: 125,
      parsedUnit: 'mg/dL',
      isReviewRequired: false,
      isUserVerified: true,
      referenceRangeOrigin: {
        sourceType: 'REPORT_PRINTED',
        lowValue: 70,
        highValue: 100,
        unit: 'mg/dL',
        rawRangeText: '70 - 100',
      },
      comparisonStatus: 'ABOVE_RANGE',
      statusExplanation: 'Result is above the printed report interval (70 - 100 mg/dL)',
    };

    const questions = await mockProvider.generateDoctorQuestions([sampleParam], 'en');
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toContain('Doctor');

    const explanation = await mockProvider.generateExplanation(sampleParam, 'en');
    expect(explanation.reportedResultSummary).toBe('Fasting Blood Glucose: 125 mg/dL');
    expect(explanation.rangeContext).toContain('above the reference interval');
  });
});
