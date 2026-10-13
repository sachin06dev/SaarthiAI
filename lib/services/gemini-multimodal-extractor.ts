import { CandidateExtractionRow } from '../types/report.types';
import { normalizeCandidateRow } from './normalization-service';

export interface RawExtractedParameter {
  testName?: string;
  test_name?: string;
  name?: string;
  parameter?: string;
  test?: string;
  observedValue?: string | number;
  value?: string | number;
  result?: string | number;
  observed_value?: string | number;
  unit?: string;
  units?: string;
  measurement_unit?: string;
  referenceRange?: string;
  reference_range?: string;
  range?: string;
  normal_range?: string;
  interval?: string;
}

/**
 * Uses Google Gemini 3.1 Flash Lite Multimodal API to extract
 * structured laboratory parameters directly from images or PDF documents.
 */
export async function extractParametersWithGemini(
  fileBuffer: ArrayBuffer,
  mimeType: string,
  fileName: string,
  documentId: string = `doc_${Date.now()}`
): Promise<CandidateExtractionRow[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 5) {
    throw new Error('GEMINI_API_KEY is not configured on server.');
  }

  // Convert buffer to Base64
  const base64Data = Buffer.from(fileBuffer).toString('base64');

  // Normalize mime type for Gemini
  let effectiveMime = mimeType || 'image/jpeg';
  if (fileName.toLowerCase().endsWith('.pdf')) {
    effectiveMime = 'application/pdf';
  } else if (fileName.toLowerCase().endsWith('.png')) {
    effectiveMime = 'image/png';
  } else if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) {
    effectiveMime = 'image/jpeg';
  } else if (fileName.toLowerCase().endsWith('.webp')) {
    effectiveMime = 'image/webp';
  }

  const prompt = `You are SaarthiAI Medical Document Extraction Specialist.
Carefully examine this laboratory report image or document.
Extract all test investigations, observed values, measurement units, and reference intervals into a structured JSON array.

CRITICAL INSTRUCTIONS:
1. Extract the exact printed test names and observed numbers/text.
2. If reference interval is printed on the report, extract it (e.g. "12.0 - 15.0" or "< 100"). If missing, set "referenceRange" to null.
3. Do NOT invent, guess, or infer clinical values.
4. Output MUST be ONLY a raw JSON array matching this schema:
[
  {
    "testName": "Hemoglobin",
    "observedValue": "14.2",
    "unit": "g/dL",
    "referenceRange": "13.0 - 17.0"
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000); // 25 second ceiling

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: effectiveMime,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2000,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errBody = await response.text();
      console.warn('Gemini multimodal extraction HTTP error:', response.status, errBody);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Gemini returned empty extraction text.');
    }

    // Clean JSON markdown code fences and isolate the JSON array
    let cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBracket = cleanJson.indexOf('[');
    const lastBracket = cleanJson.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
    }

    const parsedArray = JSON.parse(cleanJson) as RawExtractedParameter[];

    if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
      throw new Error('Gemini output could not be parsed as a valid parameter array.');
    }

    // Convert raw parameters to Saarthi candidate rows with deterministic normalization
    const candidateRows: CandidateExtractionRow[] = parsedArray.map((p, index) => {
      const rawName = String(
        p.testName || p.test_name || p.name || p.parameter || p.test || `Parameter ${index + 1}`
      ).trim();
      const rawVal = String(
        p.observedValue ?? p.value ?? p.result ?? p.observed_value ?? ''
      ).trim();
      const rawUnit = String(
        p.unit || p.units || p.measurement_unit || ''
      ).trim();
      const rawRange = p.referenceRange || p.reference_range || p.range || p.normal_range || p.interval
        ? String(p.referenceRange || p.reference_range || p.range || p.normal_range || p.interval).trim()
        : '';

      const normalized = normalizeCandidateRow({
        documentId,
        pageNumber: 1,
        rowId: `gemini_row_${index + 1}_${Date.now()}`,
        rawTestName: rawName,
        rawValueText: rawVal,
        rawUnitText: rawUnit,
        rawRangeText: rawRange,
        confidenceScore: 0.96,
      });

      return normalized;
    });

    return candidateRows;
  } catch (err: any) {
    clearTimeout(timeout);
    console.error('Gemini Multimodal Extractor Error:', err);
    throw err;
  }
}

