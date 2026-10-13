import { AIProvider } from './ai-provider.interface';
import { MockAIProvider } from './mock-ai-provider';
import { CandidateExtractionRow } from '../types/report.types';
import { ParameterExplanation } from '../types/test.types';

export class GeminiAIProvider implements AIProvider {
  name = 'Google Gemini (Live API)';
  isReady: boolean;
  private apiKey?: string;
  private modelName: string;
  private fallbackMock: MockAIProvider;

  constructor(apiKey?: string, modelName: string = 'gemini-3-flash-preview') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.modelName = modelName;
    this.isReady = Boolean(this.apiKey && this.apiKey.length > 5);
    this.fallbackMock = new MockAIProvider();
  }

  private async callGemini(prompt: string): Promise<string | null> {
    if (!this.apiKey) return null;

    const modelsToTry = [this.modelName, 'gemini-3.1-flash-lite-preview'];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 500,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          continue; // Try fallback model
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && typeof text === 'string') {
          return text.trim();
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  async generateExplanation(
    param: CandidateExtractionRow,
    language: 'en' | 'hi' = 'en'
  ): Promise<ParameterExplanation> {
    if (!this.isReady) {
      return this.fallbackMock.generateExplanation(param, language);
    }

    try {
      const isHi = language === 'hi';
      const prompt = `You are SaarthiAI, a medical report explanation assistant.
CRITICAL MEDICAL SAFETY:
1. DO NOT diagnose diseases or suggest medications.
2. DO NOT change the numeric value or status.
Explain what "${param.rawTestName}" (${param.canonicalId}) measures for a patient in plain ${isHi ? 'Hindi' : 'English'}.
Value observed: ${param.rawValueText} ${param.parsedUnit || ''}. Reference range: ${param.rawRangeText || 'Not specified'}.

Format your response as a valid JSON object with keys:
"simpleExplanation": "2 sentence explanation of what this test measures",
"clinicalContext": "Why doctors routinely evaluate this analyte",
"questionsForDoctor": ["1 relevant neutral question for the doctor"]

Return ONLY the JSON object.`;

      const geminiText = await this.callGemini(prompt);
      if (geminiText) {
        // Strip markdown code fences if present
        const cleanJson = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.simpleExplanation || parsed.whatItMeasures) {
          return {
            canonicalId: param.canonicalId,
            testName: param.rawTestName,
            whatItMeasures: parsed.whatItMeasures || parsed.simpleExplanation || param.rawTestName,
            reportedResultSummary: `Reported value: ${param.rawValueText} ${param.parsedUnit || ''}`,
            rangeContext: param.rawRangeText ? `Printed laboratory range: ${param.rawRangeText}` : 'Evaluated against clinical guidelines',
            neutralDoctorQuestions: Array.isArray(parsed.questionsForDoctor) ? parsed.questionsForDoctor : ['What does this parameter mean for my general health?'],
            limitationsNote: 'Laboratory values are only meaningful in the context of an overall clinical evaluation by your doctor.',
          };
        }
      }
    } catch {
      // Fallback cleanly to reviewed mock catalog
    }

    return this.fallbackMock.generateExplanation(param, language);
  }

  async generateDoctorQuestions(
    params: CandidateExtractionRow[],
    language: 'en' | 'hi' = 'en'
  ): Promise<string[]> {
    if (!this.isReady) {
      return this.fallbackMock.generateDoctorQuestions(params, language);
    }

    try {
      const testNames = params.slice(0, 5).map((p) => p.rawTestName).join(', ');
      const isHi = language === 'hi';
      const prompt = `Generate 3 neutral, non-diagnostic questions in ${isHi ? 'Hindi' : 'English'} that a patient can ask their doctor during their appointment about their tests (${testNames}). Return as a JSON array of strings: ["question 1", "question 2", "question 3"]. Return ONLY JSON.`;

      const geminiText = await this.callGemini(prompt);
      if (geminiText) {
        const cleanJson = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }

    return this.fallbackMock.generateDoctorQuestions(params, language);
  }

  async askDoubtEngine(
    query: string,
    reportContext: CandidateExtractionRow[],
    language: 'en' | 'hi' = 'en'
  ): Promise<{
    responseText: string;
    isRefusal: boolean;
    educationalNotes?: string[];
  }> {
    // Medical safety guardrail always checks refusal first
    const isDangerous = /diagnos|cancer|tumou?r|medicine|medication|drug|prescri|dos(e|age)|pill|दवा|दवाई|इलाज/i.test(query);
    if (isDangerous) {
      return this.fallbackMock.askDoubtEngine(query, reportContext, language);
    }

    if (!this.isReady) {
      return this.fallbackMock.askDoubtEngine(query, reportContext, language);
    }

    try {
      const isHi = language === 'hi';
      const prompt = `You are SaarthiAI Doubt Engine, an educational assistant for patients reading their laboratory reports.
STRICT SAFETY CONTRACT:
1. NEVER diagnose disease.
2. NEVER prescribe medicine or change dosages.
3. Keep answers concise, patient-friendly, and educational.

User query: "${query}"
Language: ${isHi ? 'Hindi' : 'English'}

Answer clearly:`;

      const geminiText = await this.callGemini(prompt);
      if (geminiText) {
        return {
          responseText: geminiText,
          isRefusal: false,
          educationalNotes: ['Generated using live Google Gemini with SaarthiAI safety guardrails.'],
        };
      }
    } catch {
      // Fallback
    }

    return this.fallbackMock.askDoubtEngine(query, reportContext, language);
  }
}
