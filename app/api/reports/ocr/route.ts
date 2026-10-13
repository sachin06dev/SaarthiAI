import { NextRequest, NextResponse } from 'next/server';
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
    const docInfo: UploadedDocument = {
      documentId,
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type,
      pageCount: 1,
      uploadedAt: new Date().toISOString(),
    };

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
      { error: err?.message || 'Failed to process document OCR' },
      { status: 500 }
    );
  }
}
