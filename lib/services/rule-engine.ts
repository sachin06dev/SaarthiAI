import {
  CandidateExtractionRow,
} from '../types/report.types';
import {
  ComparisonStatus,
  ReferenceRangeOrigin,
} from '../types/test.types';
import {
  CURATED_INDIAN_REFERENCE_INTERVALS,
  CuratedIndianReferenceRecord,
} from '../knowledge/reference-sources';

export interface EvaluationResult {
  comparisonStatus: ComparisonStatus;
  statusExplanation: string;
  appliedRangeOrigin: ReferenceRangeOrigin;
}

/**
 * Normalizes unit string for compatibility checking (case-insensitive, trims slashes/spaces).
 */
export function areUnitsCompatible(unitA?: string, unitB?: string): boolean {
  if (!unitA || !unitB) return false;
  const a = unitA.toLowerCase().replace(/\s+/g, '');
  const b = unitB.toLowerCase().replace(/\s+/g, '');
  if (a === b) return true;

  // Known clinically interchangeable unit representations
  if ((a === 'g/dl' || a === 'gm/dl' || a === 'gm%') && (b === 'g/dl' || b === 'gm/dl' || b === 'gm%')) return true;
  if ((a === 'cells/mcl' || a === '/uL' || a === '/cumm') && (b === 'cells/mcl' || b === '/uL' || b === '/cumm')) return true;
  if ((a === 'u/l' || a === 'iu/l') && (b === 'u/l' || b === 'iu/l')) return true;

  return false;
}

/**
 * Deterministic Rule Engine for SaarthiAI.
 * Non-negotiable rule: Rules compare against verified ranges. AI never decides status.
 */
export function evaluateResultAgainstReferenceInterval(
  row: CandidateExtractionRow
): EvaluationResult {
  // 1. Categorical handling (Must never be coerced into numeric rules)
  if (row.resultType === 'CATEGORICAL') {
    return {
      comparisonStatus: 'CATEGORICAL_REVIEW',
      statusExplanation: `Qualitative / Categorical result (${row.parsedCategoricalValue || row.rawValueText}). Requires clinical review with your physician.`,
      appliedRangeOrigin: row.referenceRangeOrigin,
    };
  }

  // 2. Validate numeric value
  const val = row.parsedNumericValue;
  if (val === undefined || isNaN(val)) {
    return {
      comparisonStatus: 'REVIEW_REQUIRED',
      statusExplanation: 'Numerical result could not be parsed unambiguously. User verification required.',
      appliedRangeOrigin: row.referenceRangeOrigin,
    };
  }

  // 3. Priority 1: Report-Printed Reference Range
  if (row.parsedRange && (row.parsedRange.low !== undefined || row.parsedRange.high !== undefined)) {
    const origin: ReferenceRangeOrigin = {
      sourceType: 'REPORT_PRINTED',
      lowValue: row.parsedRange.low,
      highValue: row.parsedRange.high,
      comparator: row.parsedRange.comparator,
      unit: row.parsedUnit,
      rawRangeText: row.rawRangeText,
      reviewStatus: 'APPROVED',
      sourceTitle: 'Patient Laboratory Report (Printed)',
      applicabilityNote: 'Directly extracted from submitted laboratory report.',
    };

    return compareValueWithRange(val, origin);
  }

  // 4. Priority 2: Curated Indian Fallback Reference Record
  const fallbackRecord = CURATED_INDIAN_REFERENCE_INTERVALS.find(
    (rec) => rec.canonicalId === row.canonicalId
  );

  if (fallbackRecord) {
    // Check unit compatibility
    if (!areUnitsCompatible(row.parsedUnit, fallbackRecord.unit)) {
      return {
        comparisonStatus: 'UNIT_MISMATCH',
        statusExplanation: `Report unit (${row.parsedUnit || 'none'}) is incompatible with verified reference interval unit (${fallbackRecord.unit}). Unverified comparison avoided.`,
        appliedRangeOrigin: {
          sourceType: 'CURATED_INDIAN_FALLBACK',
          unit: fallbackRecord.unit,
          rawRangeText: `${fallbackRecord.lowValue ?? ''} - ${fallbackRecord.highValue ?? ''} ${fallbackRecord.unit}`,
          sourceTitle: fallbackRecord.sourceTitle,
          sourceOrganization: fallbackRecord.sourceOrganization,
          urlOrDoi: fallbackRecord.urlOrDoi,
          reviewStatus: fallbackRecord.reviewStatus,
          applicabilityNote: fallbackRecord.applicabilityNote,
        },
      };
    }

    const origin: ReferenceRangeOrigin = {
      sourceType: 'CURATED_INDIAN_FALLBACK',
      lowValue: fallbackRecord.lowValue,
      highValue: fallbackRecord.highValue,
      comparator: fallbackRecord.comparator,
      unit: fallbackRecord.unit,
      rawRangeText: `${fallbackRecord.lowValue ?? ''} - ${fallbackRecord.highValue ?? ''} ${fallbackRecord.unit}`.trim(),
      sourceTitle: fallbackRecord.sourceTitle,
      sourceOrganization: fallbackRecord.sourceOrganization,
      urlOrDoi: fallbackRecord.urlOrDoi,
      retrievalDate: fallbackRecord.retrievalDate,
      reviewStatus: fallbackRecord.reviewStatus,
      applicabilityNote: fallbackRecord.applicabilityNote,
    };

    return compareValueWithRange(val, origin);
  }

  // 5. Priority 3: No verified applicable reference range found
  return {
    comparisonStatus: 'NO_VERIFIED_RANGE',
    statusExplanation: 'No verified applicable reference range found for this specific analyte and population. Numeric classification safely withheld.',
    appliedRangeOrigin: {
      sourceType: 'NONE',
      unit: row.parsedUnit,
      rawRangeText: 'None available',
    },
  };
}

/**
 * Pure mathematical comparator against verified interval bounds.
 */
function compareValueWithRange(val: number, origin: ReferenceRangeOrigin): EvaluationResult {
  const low = origin.lowValue;
  const high = origin.highValue;
  const comparator = origin.comparator;

  // Case A: Inclusive Standard Range [low, high]
  if (low !== undefined && high !== undefined) {
    if (val < low) {
      return {
        comparisonStatus: 'BELOW_RANGE',
        statusExplanation: `Result (${val} ${origin.unit}) is below the reference interval (${low} - ${high} ${origin.unit}).`,
        appliedRangeOrigin: origin,
      };
    }
    if (val > high) {
      return {
        comparisonStatus: 'ABOVE_RANGE',
        statusExplanation: `Result (${val} ${origin.unit}) is above the reference interval (${low} - ${high} ${origin.unit}).`,
        appliedRangeOrigin: origin,
      };
    }
    return {
      comparisonStatus: 'IN_RANGE',
      statusExplanation: `Result (${val} ${origin.unit}) is within the reference interval (${low} - ${high} ${origin.unit}).`,
      appliedRangeOrigin: origin,
    };
  }

  // Case B: One-sided Upper Bound (< high or <= high)
  if (high !== undefined && low === undefined) {
    if (val > high) {
      return {
        comparisonStatus: 'ABOVE_RANGE',
        statusExplanation: `Result (${val} ${origin.unit}) exceeds the reference threshold (<= ${high} ${origin.unit}).`,
        appliedRangeOrigin: origin,
      };
    }
    return {
      comparisonStatus: 'IN_RANGE',
      statusExplanation: `Result (${val} ${origin.unit}) meets the reference threshold (<= ${high} ${origin.unit}).`,
      appliedRangeOrigin: origin,
    };
  }

  // Case C: One-sided Lower Bound (> low or >= low)
  if (low !== undefined && high === undefined) {
    if (val < low) {
      return {
        comparisonStatus: 'BELOW_RANGE',
        statusExplanation: `Result (${val} ${origin.unit}) is below the target reference threshold (>= ${low} ${origin.unit}).`,
        appliedRangeOrigin: origin,
      };
    }
    return {
      comparisonStatus: 'IN_RANGE',
      statusExplanation: `Result (${val} ${origin.unit}) meets the target reference threshold (>= ${low} ${origin.unit}).`,
      appliedRangeOrigin: origin,
    };
  }

  return {
    comparisonStatus: 'NO_VERIFIED_RANGE',
    statusExplanation: 'Incomplete reference bounds. Classification withheld.',
    appliedRangeOrigin: origin,
  };
}
