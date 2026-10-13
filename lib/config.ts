/**
 * SaarthiAI Application Configuration
 * Server-side secret validation and safe public configuration.
 */

export interface AppConfig {
  nodeEnv: string;
  appBaseUrl: string;
  aiProvider: 'mock' | 'gemini';
  isGeminiConfigured: boolean;
  ocrProvider: 'local' | 'external';
  isOcrConfigured: boolean;
  maxUploadMb: number;
  maxFilesPerSession: number;
  maxPdfPages: number;
  reportRetentionHours: number;
}

/**
 * Returns safe server-side configuration.
 * Sensitive API keys are never exposed in return values sent to the client.
 */
export function getAppConfig(): AppConfig {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const ocrKey = process.env.OCR_API_KEY?.trim();
  const requestedAiProvider = (process.env.AI_PROVIDER || 'mock').toLowerCase();

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
    aiProvider: requestedAiProvider === 'gemini' && geminiKey ? 'gemini' : 'mock',
    isGeminiConfigured: Boolean(geminiKey && geminiKey.length > 5),
    ocrProvider: (process.env.OCR_PROVIDER === 'external' || process.env.OCR_PROVIDER === 'ocrspace') && ocrKey ? 'external' : 'local',
    isOcrConfigured: Boolean(ocrKey && ocrKey.length > 5),
    maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 20,
    maxFilesPerSession: Number(process.env.MAX_FILES_PER_SESSION) || 10,
    maxPdfPages: Number(process.env.MAX_PDF_PAGES) || 30,
    reportRetentionHours: Number(process.env.REPORT_RETENTION_HOURS) || 1,
  };
}

/**
 * Safe public status for UI display (no credentials)
 */
export function getPublicSystemStatus() {
  const config = getAppConfig();
  return {
    isDemoMode: config.aiProvider === 'mock',
    aiProviderName: config.aiProvider === 'gemini' ? 'Google Gemini' : 'Saarthi Curated Mock Engine (Offline/Demo)',
    isOcrLive: config.ocrProvider === 'external',
    maxUploadMb: config.maxUploadMb,
    retentionPolicy: `${config.reportRetentionHours} hour in-memory retention (Zero permanent storage without consent)`,
  };
}
