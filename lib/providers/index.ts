import { AIProvider } from './ai-provider.interface';
import { MockAIProvider } from './mock-ai-provider';
import { GeminiAIProvider } from './gemini-ai-provider';
import { getAppConfig } from '../config';

export function getAIProvider(): AIProvider {
  const config = getAppConfig();
  if (config.aiProvider === 'gemini' && config.isGeminiConfigured) {
    return new GeminiAIProvider(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL);
  }
  return new MockAIProvider();
}

export * from './ai-provider.interface';
export * from './mock-ai-provider';
export * from './gemini-ai-provider';
