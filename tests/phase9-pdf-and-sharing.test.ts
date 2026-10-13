import { describe, it, expect } from 'vitest';
import {
  formatReportTextForWhatsApp,
  generateWhatsAppShareUrl,
  generatePrintableReportHtml,
} from '../lib/services/pdf-export-service';
import { ReportAnalysisSummary, CandidateExtractionRow } from '../lib/types/report.types';

describe('Phase 9: PDF Export and WhatsApp Sharing Flow', () => {
  const mockRows: CandidateExtractionRow[] = [
    {
      rowId: 'row_1',
      documentId: 'doc_1',
      pageNumber: 1,
      rawTestName: 'Hemoglobin',
      canonicalId: 'HEMOGLOBIN',
      category: 'CBC',
      resultType: 'NUMERIC',
      rawValueText: '10.2',
      parsedNumericValue: 10.2,
      parsedUnit: 'g/dL',
      rawUnitText: 'g/dL',
      rawRangeText: '12.0 - 16.0',
      parsedRange: { low: 12.0, high: 16.0 },
      referenceRangeOrigin: {
        sourceType: 'REPORT_PRINTED',
        lowValue: 12.0,
        highValue: 16.0,
      },
      comparisonStatus: 'BELOW_RANGE',
      statusExplanation: 'Below reference interval',
      isReviewRequired: false,
      isUserVerified: true,
      explanation: {
        canonicalId: 'HEMOGLOBIN',
        testName: 'Hemoglobin',
        whatItMeasures: 'Oxygen transport protein',
        reportedResultSummary: '10.2 g/dL',
        rangeContext: '12.0 - 16.0 g/dL',
        neutralDoctorQuestions: ['Could you check if my low hemoglobin indicates iron deficiency?'],
        limitationsNote: 'Requires physician review',
      },
    },
    {
      rowId: 'row_2',
      documentId: 'doc_1',
      pageNumber: 1,
      rawTestName: 'Fasting Blood Glucose',
      canonicalId: 'FASTING_BLOOD_SUGAR',
      category: 'DIABETES_GLUCOSE',
      resultType: 'NUMERIC',
      rawValueText: '142',
      parsedNumericValue: 142,
      parsedUnit: 'mg/dL',
      rawUnitText: 'mg/dL',
      rawRangeText: '70 - 99',
      parsedRange: { low: 70, high: 99 },
      referenceRangeOrigin: {
        sourceType: 'REPORT_PRINTED',
        lowValue: 70,
        highValue: 99,
      },
      comparisonStatus: 'ABOVE_RANGE',
      statusExplanation: 'Above reference interval',
      isReviewRequired: false,
      isUserVerified: true,
      explanation: {
        canonicalId: 'FASTING_BLOOD_SUGAR',
        testName: 'Fasting Blood Glucose',
        whatItMeasures: 'Circulating fasting glucose',
        reportedResultSummary: '142 mg/dL',
        rangeContext: '70 - 99 mg/dL',
        neutralDoctorQuestions: ['Should we repeat this fasting glucose with an HbA1c test?'],
        limitationsNote: 'Requires physician review',
      },
    },
  ];

  const mockSummary: ReportAnalysisSummary = {
    reportId: 'rep_test_01',
    documentId: 'doc_1',
    fileName: 'Patient_Report_Sample.pdf',
    totalTests: 2,
    verifiedCount: 2,
    inRangeCount: 0,
    aboveRangeCount: 1,
    belowRangeCount: 1,
    reviewRequiredCount: 0,
    noVerifiedRangeCount: 0,
    items: mockRows,
  };

  it('formats clean, structured WhatsApp summary with objective parameter counts', () => {
    const text = formatReportTextForWhatsApp(mockSummary);

    expect(text).toContain('SaarthiAI Decoded Report Summary');
    expect(text).toContain('Patient_Report_Sample.pdf');
    expect(text).toContain('Total Parameters: 2');
    expect(text).toContain('Below Reference Range: 1');
    expect(text).toContain('Above Reference Range: 1');
    expect(text).toContain('Hemoglobin');
    expect(text).toContain('Fasting Blood Glucose');
    expect(text).toContain('Medical Disclaimer:');
    expect(text).toContain('AI explains, rules compare, doctors diagnose');
  });

  it('generates a properly encoded WhatsApp URL', () => {
    const url = generateWhatsAppShareUrl(mockSummary);

    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    expect(url).toContain(encodeURIComponent('SaarthiAI Decoded Report Summary'));
  });

  it('generates printable HTML report containing non-negotiable safety disclaimer', () => {
    const html = generatePrintableReportHtml(mockSummary);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('SaarthiAI &bull; Laboratory Report Explanation Summary');
    expect(html).toContain('Patient_Report_Sample.pdf');
    expect(html).toContain('Hemoglobin');
    expect(html).toContain('10.2 g/dL');
    expect(html).toContain('Below Range');
    expect(html).toContain('Above Range');
    expect(html).toContain('Non-Negotiable Medical Safety Contract');
    expect(html).toContain('educational software assistant');
  });
});
