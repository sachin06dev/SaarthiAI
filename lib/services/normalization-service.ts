import { ResultType, ReferenceRangeOrigin } from '../types/test.types';
import { CandidateExtractionRow } from '../types/report.types';
import { matchTestToCanonical } from '../knowledge/synonym-matcher';
import { CANONICAL_TEST_CATALOG } from '../knowledge/test-catalog';

export const KNOWN_CATEGORICAL_VALUES = [
  'positive',
  'negative',
  'reactive',
  'non-reactive',
  'nonreactive',
  'detected',
  'not detected',
  'not-detected',
  'present',
  'absent',
  'trace',
  'nil',
  'normal',
  'abnormal',
  'a+',
  'a-',
  'b+',
  'b-',
  'ab+',
  'ab-',
  'o+',
  'o-',
  'b positive',
  'b negative',
  'a positive',
  'a negative',
  'o positive',
  'o negative',
  'ab positive',
  'ab negative',
  'rh positive',
  'rh negative',
];

/**
 * Checks whether raw result text represents a qualitative / categorical result.
 */
export function isCategoricalResultText(raw: string): boolean {
  if (!raw) return false;
  const cleaned = raw.trim().toLowerCase();
  return KNOWN_CATEGORICAL_VALUES.some((val) => cleaned === val || cleaned.startsWith(val));
}

/**
 * Parses numeric string safely, supporting commas, decimals, and comparator signs.
 */
export function parseNumericValue(raw: string): {
  isNumeric: boolean;
  value?: number;
  comparator?: '<' | '<=' | '>' | '>=' | '=';
} {
  if (!raw || typeof raw !== 'string') {
    return { isNumeric: false };
  }

  const cleaned = raw.trim().replace(/,/g, '');

  // Detect one-sided comparator operators
  let comparator: '<' | '<=' | '>' | '>=' | '=' | undefined;
  let numberPart = cleaned;

  if (cleaned.startsWith('<=')) {
    comparator = '<=';
    numberPart = cleaned.slice(2).trim();
  } else if (cleaned.startsWith('<')) {
    comparator = '<';
    numberPart = cleaned.slice(1).trim();
  } else if (cleaned.startsWith('>=')) {
    comparator = '>=';
    numberPart = cleaned.slice(2).trim();
  } else if (cleaned.startsWith('>')) {
    comparator = '>';
    numberPart = cleaned.slice(1).trim();
  } else if (cleaned.startsWith('=')) {
    comparator = '=';
    numberPart = cleaned.slice(1).trim();
  }

  const num = parseFloat(numberPart);
  if (!isNaN(num) && isFinite(num)) {
    return { isNumeric: true, value: num, comparator };
  }

  return { isNumeric: false };
}

/**
 * Parses printed reference interval text safely into bounds.
 */
export function parseReferenceRangeString(rawRange: string): {
  low?: number;
  high?: number;
  comparator?: '<' | '<=' | '>' | '>=' | '=' | 'RANGE';
} | undefined {
  if (!rawRange || typeof rawRange !== 'string') return undefined;

  const cleaned = rawRange.trim().replace(/,/g, '');

  // Format: "low - high" or "low to high"
  const rangeMatch = cleaned.match(/([\d\.]+)\s*(?:-|to)\s*([\d\.]+)/i);
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]);
    const high = parseFloat(rangeMatch[2]);
    if (!isNaN(low) && !isNaN(high) && low <= high) {
      return { low, high, comparator: 'RANGE' };
    }
  }

  // Format: "< high" or "<= high"
  const upperMatch = cleaned.match(/(?:<|<=|less than)\s*([\d\.]+)/i);
  if (upperMatch) {
    const high = parseFloat(upperMatch[1]);
    if (!isNaN(high)) {
      return { high, comparator: '<=' };
    }
  }

  // Format: "> low" or ">= low"
  const lowerMatch = cleaned.match(/(?:>|>=|greater than)\s*([\d\.]+)/i);
  if (lowerMatch) {
    const low = parseFloat(lowerMatch[1]);
    if (!isNaN(low)) {
      return { low, comparator: '>=' };
    }
  }

  return undefined;
}

/**
 * Main normalization pipeline for a single candidate row.
 */
export function normalizeCandidateRow(input: {
  documentId: string;
  pageNumber: number;
  rowId: string;
  rawTestName: string;
  rawValueText: string;
  rawUnitText?: string;
  rawRangeText?: string;
  rawFlagText?: string;
  confidenceScore?: number;
}): CandidateExtractionRow {
  const match = matchTestToCanonical(input.rawTestName);
  const def = match.definition;

  // 1. Result type determination
  const isCategorical =
    def?.resultType === 'CATEGORICAL' || isCategoricalResultText(input.rawValueText);
  const resultType: ResultType = isCategorical ? 'CATEGORICAL' : 'NUMERIC';

  let parsedNumeric: number | undefined;
  let parsedCategorical: string | undefined;

  if (isCategorical) {
    parsedCategorical = input.rawValueText.trim();
  } else {
    const numParse = parseNumericValue(input.rawValueText);
    if (numParse.isNumeric) {
      parsedNumeric = numParse.value;
    }
  }

  // 2. Unit parsing
  let parsedUnit = (input.rawUnitText || '').trim();
  if (/^[\d\.]+$/.test(parsedUnit)) {
    parsedUnit = '';
  }

  // 3. Range parsing
  const rawRange = (input.rawRangeText || '').trim();
  const parsedRange = parseReferenceRangeString(rawRange);

  // 4. Uncertainty & verification flags
  let isReviewRequired = false;
  let reviewReason = '';

  if (!match.matched) {
    isReviewRequired = true;
    reviewReason = 'Unrecognized laboratory test analyte — verification required';
  } else if (!isCategorical && parsedNumeric === undefined) {
    isReviewRequired = true;
    reviewReason = 'Unable to parse numeric result unambiguously';
  } else if (!isCategorical && !parsedUnit) {
    isReviewRequired = true;
    reviewReason = 'Missing unit of measurement';
  }

  // Build Reference Range Origin
  const referenceRangeOrigin: ReferenceRangeOrigin = {
    sourceType: parsedRange ? 'REPORT_PRINTED' : 'NONE',
    lowValue: parsedRange?.low,
    highValue: parsedRange?.high,
    comparator: parsedRange?.comparator,
    unit: parsedUnit,
    rawRangeText: rawRange,
  };

  return {
    rowId: input.rowId,
    documentId: input.documentId,
    pageNumber: input.pageNumber,
    rawTestName: input.rawTestName,
    rawValueText: input.rawValueText,
    rawUnitText: input.rawUnitText || '',
    rawRangeText: rawRange,
    rawFlagText: input.rawFlagText,
    canonicalId: match.canonicalId,
    category: def ? def.category : 'UNMAPPED',
    resultType,
    parsedNumericValue: parsedNumeric,
    parsedCategoricalValue: parsedCategorical,
    parsedUnit,
    parsedRange,
    extractionConfidenceScore: input.confidenceScore,
    isReviewRequired,
    reviewReason,
    isUserVerified: false,
    referenceRangeOrigin,
    comparisonStatus: isReviewRequired
      ? 'REVIEW_REQUIRED'
      : isCategorical
      ? 'CATEGORICAL_REVIEW'
      : 'NO_VERIFIED_RANGE',
    statusExplanation: isReviewRequired
      ? reviewReason
      : isCategorical
      ? 'Qualitative / Categorical laboratory result'
      : 'Awaiting deterministic rule comparison against applicable reference interval',
  };
}
