import { describe, it, expect } from 'vitest';
import {
  validateUploadedFile,
  formatFileSize,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_PER_SESSION,
} from '@/lib/services/document-service';

describe('Phase 3: Multi-file Upload & Document Preparation', () => {
  it('validates supported document formats (PDF, JPG, PNG, WEBP)', () => {
    const pdfRes = validateUploadedFile({ name: 'cbc_report.pdf', size: 1024 * 500, type: 'application/pdf' });
    expect(pdfRes.isValid).toBe(true);
    expect(pdfRes.document?.documentId).toMatch(/^doc_/);
    expect(pdfRes.document?.fileName).toBe('cbc_report.pdf');

    const jpgRes = validateUploadedFile({ name: 'lft_scan.jpg', size: 1024 * 200, type: 'image/jpeg' });
    expect(jpgRes.isValid).toBe(true);

    const pngRes = validateUploadedFile({ name: 'kft_photo.png', size: 1024 * 300, type: 'image/png' });
    expect(pngRes.isValid).toBe(true);

    const webpRes = validateUploadedFile({ name: 'thyroid.webp', size: 1024 * 150, type: 'image/webp' });
    expect(webpRes.isValid).toBe(true);
  });

  it('rejects unsupported file formats safely', () => {
    const docxRes = validateUploadedFile({
      name: 'notes.docx',
      size: 1024 * 100,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    expect(docxRes.isValid).toBe(false);
    expect(docxRes.errorCode).toBe('INVALID_TYPE');
    expect(docxRes.errorMessage).toContain('Unsupported file type');

    const exeRes = validateUploadedFile({ name: 'malicious.exe', size: 1024 * 50, type: 'application/x-msdownload' });
    expect(exeRes.isValid).toBe(false);
    expect(exeRes.errorCode).toBe('INVALID_TYPE');
  });

  it('rejects files exceeding the 20MB limit', () => {
    const hugeRes = validateUploadedFile({
      name: 'huge_scan.pdf',
      size: MAX_FILE_SIZE_BYTES + 1024,
      type: 'application/pdf',
    });
    expect(hugeRes.isValid).toBe(false);
    expect(hugeRes.errorCode).toBe('EXCEEDS_SIZE');
    expect(hugeRes.errorMessage).toContain('exceeds the maximum allowed limit of 20 MB');
  });

  it('rejects empty or 0-byte corrupted files', () => {
    const emptyRes = validateUploadedFile({ name: 'empty.pdf', size: 0, type: 'application/pdf' });
    expect(emptyRes.isValid).toBe(false);
    expect(emptyRes.errorCode).toBe('CORRUPT_OR_EMPTY');
  });

  it('enforces maximum 10 files per session limit', () => {
    const limitRes = validateUploadedFile(
      { name: 'eleventh.pdf', size: 1024 * 100, type: 'application/pdf' },
      MAX_FILES_PER_SESSION
    );
    expect(limitRes.isValid).toBe(false);
    expect(limitRes.errorCode).toBe('EXCEEDS_FILE_LIMIT');
  });

  it('isolates partial failures so good files are preserved when a bad file is submitted', () => {
    const filesToTest = [
      { name: 'valid_report.pdf', size: 1024 * 200, type: 'application/pdf' },
      { name: 'bad_file.exe', size: 1024 * 50, type: 'application/x-msdownload' },
      { name: 'valid_image.png', size: 1024 * 300, type: 'image/png' },
    ];

    const results = filesToTest.map((f, i) => validateUploadedFile(f, i));

    expect(results[0].isValid).toBe(true);
    expect(results[1].isValid).toBe(false);
    expect(results[2].isValid).toBe(true);
  });

  it('formats byte sizes cleanly for human readability', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1024 * 250)).toBe('250.0 KB');
    expect(formatFileSize(1024 * 1024 * 3.5)).toBe('3.5 MB');
  });
});
