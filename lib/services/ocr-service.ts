import { CandidateExtractionRow, UploadedDocument } from '../types/report.types';
import { parseReportTextToCandidateRows } from './report-parser';

export interface DocumentExtractionProvider {
  name: string;
  extractRows(
    document: UploadedDocument,
    fileBuffer?: ArrayBuffer
  ): Promise<CandidateExtractionRow[]>;
}

// =========================================================================
// SYNTHETIC DEMO FIXTURE 1: CLEAN DIGITAL REPORT (CBC + Fasting Glucose)
// High-confidence digital extraction with clear report-printed ranges
// =========================================================================
export const CLEAN_DEMO_TEXT = `
APOLLO DIAGNOSTICS & PATHOLOGY LABS
Patient Name: Demo Patient (Synthetic)    Age/Sex: 34 Y / Male
Sample Collected: 12-Oct-2026 08:30 AM    Report Status: Final
---------------------------------------------------------------------------------
Investigation                      Observed Value  Unit         Reference Interval
---------------------------------------------------------------------------------
Hemoglobin                         14.8            g/dL         13.0 - 17.0
RBC Count                          4.9             million/mcL  4.5 - 5.9
Total Leukocyte Count (TLC)        6800            cells/mcL    4000 - 11000
Platelet Count                     240000          /mcL         150000 - 450000
Packed Cell Volume (PCV)           44.0            %            40.0 - 50.0
Mean Corpuscular Volume (MCV)      88.0            fL           82.0 - 98.0
Fasting Blood Sugar (FBS)          88              mg/dL        70 - 100
Serum Creatinine                   0.9             mg/dL        0.7 - 1.2
---------------------------------------------------------------------------------
`;

// =========================================================================
// SYNTHETIC DEMO FIXTURE 2: MIXED REPORT (Out-of-range Glucose & LFT, Blood Group B+)
// Tests deterministic above/below range rules & categorical value preservation
// =========================================================================
export const MIXED_DEMO_TEXT = `
METROPOLIS HEALTHCARE CLINICAL PANEL
Patient Name: Demo Patient 2 (Synthetic)    Age/Sex: 48 Y / Female
Sample Collected: 11-Oct-2026 09:15 AM    Report Status: Final
---------------------------------------------------------------------------------
Investigation                      Observed Value  Unit         Reference Interval
---------------------------------------------------------------------------------
Hemoglobin                         11.2            g/dL         12.0 - 15.0
Fasting Blood Glucose              132             mg/dL        70 - 100
Glycated Hemoglobin (HbA1c)        6.8             %            < 5.7
ALT (SGPT)                         58              U/L          10 - 40
AST (SGOT)                         46              U/L          10 - 35
Total Cholesterol                  228             mg/dL        < 200
HDL Cholesterol                    42              mg/dL        > 50
Serum Triglycerides                190             mg/dL        < 150
Blood Group and Rh                 B+                           Reported
---------------------------------------------------------------------------------
`;

// =========================================================================
// SYNTHETIC DEMO FIXTURE 3: LOW-CONFIDENCE / AMBIGUOUS SCAN
// Ambiguous spacing, missing unit, and unrecognized analyte -> triggers review
// =========================================================================
export const UNCERTAIN_DEMO_TEXT = `
MAX LAB SCAN (LOW CONTRAST SCAN)
Patient Name: Demo Patient 3 (Synthetic)
---------------------------------------------------------------------------------
Investigation                      Observed Value  Unit         Reference Interval
---------------------------------------------------------------------------------
Platelet Count                     95000           /mcL         150000 - 450000
Total Bilirubin                    2.4             mg/dL        0.2 - 1.2
Serum Creatinine 1.8               mg/dL           0.7 - 1.2
Unrecognized Novel Biomarker Alpha 45.0            ng/mL
Alkaline Phosphatase               185                          30 - 120
---------------------------------------------------------------------------------
`;

export class LocalDocumentExtractionProvider implements DocumentExtractionProvider {
  name = 'Saarthi Local / Fixture Extraction Provider';

  async extractRows(
    document: UploadedDocument,
    fileBuffer?: ArrayBuffer
  ): Promise<CandidateExtractionRow[]> {
    // If client requested a specific demo fixture
    if (document.fileName.includes('clean') || document.isSimulatedDemo) {
      return parseReportTextToCandidateRows(CLEAN_DEMO_TEXT, document.documentId, 1);
    }
    if (document.fileName.includes('mixed')) {
      return parseReportTextToCandidateRows(MIXED_DEMO_TEXT, document.documentId, 1);
    }
    if (document.fileName.includes('uncertain')) {
      return parseReportTextToCandidateRows(UNCERTAIN_DEMO_TEXT, document.documentId, 1);
    }

    // Default: generate clean digital panel for local demo testing
    return parseReportTextToCandidateRows(CLEAN_DEMO_TEXT, document.documentId, 1);
  }
}
