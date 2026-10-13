/**
 * SaarthiAI Domain Types: Test Definitions, Categories, and Result Enums
 */

export type TestCategory =
  | 'CBC'
  | 'DIABETES_GLUCOSE'
  | 'LIVER'
  | 'KIDNEY'
  | 'THYROID'
  | 'LIPID_PROFILE'
  | 'UNMAPPED';

export type ComparisonStatus =
  | 'IN_RANGE'
  | 'BELOW_RANGE'
  | 'ABOVE_RANGE'
  | 'REVIEW_REQUIRED'
  | 'NO_VERIFIED_RANGE'
  | 'UNIT_MISMATCH'
  | 'CATEGORICAL_REVIEW';

export type ResultType = 'NUMERIC' | 'CATEGORICAL';

export interface ReferenceRangeOrigin {
  sourceType: 'REPORT_PRINTED' | 'CURATED_INDIAN_FALLBACK' | 'NONE';
  sourceTitle?: string;
  sourceOrganization?: string;
  urlOrDoi?: string;
  retrievalDate?: string;
  reviewStatus?: 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'RETIRED';
  applicabilityNote?: string;
  lowValue?: number;
  highValue?: number;
  comparator?: '<' | '<=' | '>' | '>=' | '=' | 'RANGE';
  unit?: string;
  rawRangeText?: string;
}

export interface CuratedTestDefinition {
  canonicalId: string;
  displayName: string;
  category: TestCategory;
  synonyms: string[];
  recognizedUnits: string[];
  resultType: ResultType;
  descriptionEn: string;
  descriptionHi: string;
  clinicalContextEn: string;
  clinicalContextHi: string;
  educationalSources: {
    title: string;
    url: string;
  }[];
}

export interface ParameterExplanation {
  canonicalId: string;
  testName: string;
  whatItMeasures: string;
  reportedResultSummary: string;
  rangeContext: string;
  neutralDoctorQuestions: string[];
  limitationsNote: string;
}
