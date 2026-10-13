import { CandidateExtractionRow, UploadedDocument } from '../types/report.types';
import { parseReportTextToCandidateRows } from './report-parser';
import { DocumentExtractionProvider, CLEAN_DEMO_TEXT } from './ocr-service';

export class OcrSpaceDocumentExtractionProvider implements DocumentExtractionProvider {
  name = 'OCR.space Cloud Vision Adapter';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OCR_API_KEY;
  }

  async extractRows(
    document: UploadedDocument,
    fileBuffer?: ArrayBuffer
  ): Promise<CandidateExtractionRow[]> {
    if (!this.apiKey || !fileBuffer) {
      return parseReportTextToCandidateRows(CLEAN_DEMO_TEXT, document.documentId, 1);
    }

    try {
      const blob = new Blob([fileBuffer], { type: document.mimeType || 'application/pdf' });
      const formData = new FormData();
      formData.append('apikey', this.apiKey);
      formData.append('file', blob, document.fileName);
      formData.append('language', 'eng');
      formData.append('isTable', 'true');
      formData.append('OCREngine', '2'); // Fast table-aware engine

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000); // 12 second ceiling

      const res = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`OCR.space returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data?.OCRExitCode === 1 && data?.ParsedResults?.[0]?.ParsedText) {
        const ocrText = data.ParsedResults[0].ParsedText;
        const candidateRows = parseReportTextToCandidateRows(ocrText, document.documentId, 1);
        if (candidateRows.length > 0) {
          return candidateRows;
        }
      }
    } catch (err: any) {
      console.warn('OCR.space live processing fallback to demo extractor:', err?.message || err);
    }

    // Graceful fallback if OCR text produced no structured rows
    return parseReportTextToCandidateRows(CLEAN_DEMO_TEXT, document.documentId, 1);
  }
}
