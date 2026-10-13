import { NextRequest, NextResponse } from 'next/server';
import { extractParametersWithGemini } from '@/lib/services/gemini-multimodal-extractor';
import { OcrSpaceDocumentExtractionProvider } from '@/lib/services/ocr-space-provider';
import { LocalDocumentExtractionProvider } from '@/lib/services/ocr-service';
import { UploadedDocument } from '@/lib/types/report.types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const documentId = (formData.get('documentId') as string) || `doc_${Date.now()}`;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const effectiveMime = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
    const docInfo: UploadedDocument = {
      documentId,
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: effectiveMime,
      pageCount: 1,
      uploadedAt: new Date().toISOString(),
    };

    // 1. PRIMARY: Analyze with Google Gemini Multimodal API (supports PDF, PNG, JPG, WEBP directly)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.length > 5) {
      try {
        console.log(`Analyzing ${file.name} (${effectiveMime}) with Google Gemini Multimodal Vision API...`);
        const geminiRows = await extractParametersWithGemini(fileBuffer, effectiveMime, file.name, documentId);
        if (geminiRows.length > 0) {
          return NextResponse.json({
            success: true,
            documentId,
            fileName: file.name,
            extractedCount: geminiRows.length,
            provider: 'Google Gemini 3.1 Flash Lite (Multimodal Vision)',
            rows: geminiRows,
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini vision extraction failed, falling back to secondary OCR:', geminiErr?.message || geminiErr);
      }
    }

    // 2. SECONDARY: Fall back to OCR.space
    const ocrKey = process.env.OCR_API_KEY;
    const provider = ocrKey && ocrKey.length > 3
      ? new OcrSpaceDocumentExtractionProvider(ocrKey)
      : new LocalDocumentExtractionProvider();

    const rows = await provider.extractRows(docInfo, fileBuffer);

    return NextResponse.json({
      success: true,
      documentId,
      fileName: file.name,
      extractedCount: rows.length,
      provider: provider.name,
      rows,
    });
  } catch (err: any) {
    console.error('API /api/reports/ocr error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process document extraction' },
      { status: 500 }
    );
  }
}
