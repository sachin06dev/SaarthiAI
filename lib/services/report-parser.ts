import { CandidateExtractionRow } from '../types/report.types';
import { normalizeCandidateRow } from './normalization-service';

export interface ParsedRawLine {
  rawLine: string;
  testNameCandidate: string;
  valueCandidate: string;
  unitCandidate: string;
  rangeCandidate: string;
  flagCandidate?: string;
  confidence?: number;
  isAmbiguous: boolean;
}

/**
 * Regex patterns for standard tabular laboratory rows.
 * Typical patterns:
 * [Test Name]  [Value]  [Unit]  [Reference Range]  [Flag/Status]
 * Example: "Hemoglobin  14.2  g/dL  13.0 - 17.0"
 * Example: "FASTING BLOOD SUGAR  118  mg/dL  70 - 100  H"
 */
export function parseTabularLine(line: string): ParsedRawLine | null {
  if (!line || line.trim().length < 4) return null;

  const trimmed = line.trim();

  // Ignore header rows and footers
  const headerPatterns = [
    /^(investigation|test name|parameter|analyte)\s+/i,
    /^(page \d+|date:|dr\.|sample collected)/i,
    /^(end of report|nabl|accredited)/i,
  ];
  if (headerPatterns.some((p) => p.test(trimmed))) {
    return null;
  }

  // Standard laboratory line regex
  // 1: Test Name, 2: Value, 3: Unit, 4: Range
  const standardPattern = /^([A-Za-z0-9\s\(\)\/\-\.\,\+]+?)\s{2,}([<>]?[\d\.,]+|[A-Za-z\+\-]+)\s+([a-zA-Z\/\%\^0-9\.\-]+)?\s*(?:(?:reference|range|normal)?[:\s]*)?([\d\.]+\s*(?:-|to)\s*[\d\.]+|[<>]\s*[\d\.]+)?\s*([LHlh]|high|low)?$/;

  const match = trimmed.match(standardPattern);

  if (match) {
    const testName = match[1].trim();
    const value = match[2].trim();
    let unit = (match[3] || '').trim();
    let range = (match[4] || '').trim();
    const flag = (match[5] || '').trim();

    // If unit candidate is a number or start of a range (e.g. "30" with range "- 120")
    if (/^[\d\.]+$/.test(unit)) {
      if (range) {
        range = `${unit} ${range}`;
      } else {
        range = unit;
      }
      unit = '';
    } else if (/^[\d\.]+\s*(?:-|to)\s*[\d\.]+$/.test(unit)) {
      range = unit;
      unit = '';
    }

    return {
      rawLine: trimmed,
      testNameCandidate: testName,
      valueCandidate: value,
      unitCandidate: unit,
      rangeCandidate: range,
      flagCandidate: flag,
      confidence: 0.95,
      isAmbiguous: false,
    };
  }

  // Fallback for tab-separated or pipe-separated lines
  if (trimmed.includes('\t') || trimmed.includes('|')) {
    const parts = trimmed.split(/[\t|]+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return {
        rawLine: trimmed,
        testNameCandidate: parts[0],
        valueCandidate: parts[1],
        unitCandidate: parts[2] || '',
        rangeCandidate: parts[3] || '',
        confidence: 0.85,
        isAmbiguous: parts.length < 3,
      };
    }
  }

  // Detect single-space separated rows with numbers
  const spaceParts = trimmed.split(/\s+/);
  if (spaceParts.length >= 2) {
    const numIdx = spaceParts.findIndex((part) => /^[\d\.,]+$/.test(part));
    if (numIdx > 0) {
      const testName = spaceParts.slice(0, numIdx).join(' ');
      const val = spaceParts[numIdx];
      const remainder = spaceParts.slice(numIdx + 1);
      return {
        rawLine: trimmed,
        testNameCandidate: testName,
        valueCandidate: val,
        unitCandidate: remainder[0] || '',
        rangeCandidate: remainder.slice(1).join(' '),
        confidence: 0.7,
        isAmbiguous: true, // Flag single-space heuristically parsed rows for review
      };
    }
  }

  return null;
}

/**
 * Extracts candidate structured rows from plain text or OCR text.
 */
export function parseReportTextToCandidateRows(
  documentText: string,
  documentId: string,
  pageNumber: number = 1
): CandidateExtractionRow[] {
  const lines = documentText.split(/\r?\n/);
  const rows: CandidateExtractionRow[] = [];

  let rowIndex = 1;
  for (const line of lines) {
    const parsedLine = parseTabularLine(line);
    if (!parsedLine) continue;

    const rowId = `${documentId}_p${pageNumber}_r${rowIndex++}`;

    const normalizedRow = normalizeCandidateRow({
      documentId,
      pageNumber,
      rowId,
      rawTestName: parsedLine.testNameCandidate,
      rawValueText: parsedLine.valueCandidate,
      rawUnitText: parsedLine.unitCandidate,
      rawRangeText: parsedLine.rangeCandidate,
      rawFlagText: parsedLine.flagCandidate,
      confidenceScore: parsedLine.confidence,
    });

    if (parsedLine.isAmbiguous) {
      normalizedRow.isReviewRequired = true;
      normalizedRow.reviewReason =
        normalizedRow.reviewReason || 'Ambiguous column spacing detected — please verify parsed values';
      normalizedRow.comparisonStatus = 'REVIEW_REQUIRED';
    }

    rows.push(normalizedRow);
  }

  return rows;
}
