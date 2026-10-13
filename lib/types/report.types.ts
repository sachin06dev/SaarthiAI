import {
  TestCategory,
  ComparisonStatus,
  ResultType,
  ReferenceRangeOrigin,
  ParameterExplanation,
} from './test.types';

export interface UploadedDocument {
  documentId: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  pageCount: number;
  uploadedAt: string;
  isSimulatedDemo?: boolean;
}

export interface CandidateExtractionRow {
  rowId: string;
  documentId: string;
  pageNumber: number;
  rawTestName: string;
  rawValueText: string;
  rawUnitText: string;
  rawRangeText: string;
  rawFlagText?: string;
  // Normalized & parsed
  canonicalId: string;
  category: TestCategory;
  resultType: ResultType;
  parsedNumericValue?: number;
  parsedCategoricalValue?: string;
  parsedUnit: string;
  parsedRange?: {
    low?: number;
    high?: number;
    comparator?: '<' | '<=' | '>' | '>=' | '=' | 'RANGE';
  };
  // Confidence & Verification
  extractionConfidenceScore?: number; // Real OCR confidence only if available
  isReviewRequired: boolean;
  reviewReason?: string;
  isUserVerified: boolean;
  userCorrectionAudit?: {
    originalRawValue: string;
    correctedValue: string;
    originalUnit: string;
    correctedUnit: string;
    editedAt: string;
  };
  // Comparison & Rules
  referenceRangeOrigin: ReferenceRangeOrigin;
  comparisonStatus: ComparisonStatus;
  statusExplanation: string;
  // Grounded Education
  explanation?: ParameterExplanation;
}

export interface ReportAnalysisSummary {
  reportId: string;
  documentId: string;
  fileName: string;
  reportDate?: string;
  totalTests: number;
  verifiedCount: number;
  inRangeCount: number;
  aboveRangeCount: number;
  belowRangeCount: number;
  reviewRequiredCount: number;
  noVerifiedRangeCount: number;
  items: CandidateExtractionRow[];
}

export interface MultiReportSessionSummary {
  sessionId: string;
  createdAt: string;
  totalDocuments: number;
  totalParameters: number;
  totalVerified: number;
  totalInRange: number;
  totalAboveRange: number;
  totalBelowRange: number;
  totalReviewRequired: number;
  totalNoVerifiedRange: number;
  reports: ReportAnalysisSummary[];
}

export interface DoubtEngineMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: 'en' | 'hi';
  relatedTestId?: string;
  isRefusal?: boolean;
}
