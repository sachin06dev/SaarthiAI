import { UploadedDocument } from '../types/report.types';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_FILES_PER_SESSION = 10;
export const MAX_PDF_PAGES = 30;

export interface FileValidationResult {
  isValid: boolean;
  errorCode?: 'INVALID_TYPE' | 'EXCEEDS_SIZE' | 'EXCEEDS_FILE_LIMIT' | 'CORRUPT_OR_EMPTY';
  errorMessage?: string;
  document?: UploadedDocument;
}

/**
 * Validates a submitted file against SaarthiAI privacy and capacity constraints.
 */
export function validateUploadedFile(
  file: { name: string; size: number; type: string },
  currentFileCount: number = 0
): FileValidationResult {
  if (currentFileCount >= MAX_FILES_PER_SESSION) {
    return {
      isValid: false,
      errorCode: 'EXCEEDS_FILE_LIMIT',
      errorMessage: `Maximum of ${MAX_FILES_PER_SESSION} files allowed per session to protect privacy and system memory.`,
    };
  }

  if (!file || file.size === 0) {
    return {
      isValid: false,
      errorCode: 'CORRUPT_OR_EMPTY',
      errorMessage: 'The selected file is empty or corrupted.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      errorCode: 'EXCEEDS_SIZE',
      errorMessage: `File size (${sizeMb} MB) exceeds the maximum allowed limit of 20 MB.`,
    };
  }

  const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());
  const hasAllowedExt = /\.(pdf|jpe?g|png|webp)$/i.test(file.name);

  if (!isAllowedMime && !hasAllowedExt) {
    return {
      isValid: false,
      errorCode: 'INVALID_TYPE',
      errorMessage: `Unsupported file type (${file.type || 'unknown'}). Please upload a PDF or an image (JPG, PNG, WEBP).`,
    };
  }

  const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    isValid: true,
    document: {
      documentId,
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type || 'application/octet-stream',
      pageCount: file.type === 'application/pdf' ? 1 : 1, // updated on parse
      uploadedAt: new Date().toISOString(),
      isSimulatedDemo: false,
    },
  };
}

/**
 * Formats byte size for friendly display (KB / MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
