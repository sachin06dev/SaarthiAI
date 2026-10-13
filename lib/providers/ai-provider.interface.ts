import { CandidateExtractionRow } from '../types/report.types';
import { ParameterExplanation } from '../types/test.types';

export interface AIProvider {
  name: string;
  isReady: boolean;

  /**
   * Generates a grounded, plain-language explanation for a laboratory parameter.
   * Crucial rule: Medical comparison status and numerical values are NEVER altered by the LLM.
   */
  generateExplanation(
    param: CandidateExtractionRow,
    language: 'en' | 'hi'
  ): Promise<ParameterExplanation>;

  /**
   * Generates neutral, respectful questions for the upcoming doctor consultation.
   */
  generateDoctorQuestions(
    params: CandidateExtractionRow[],
    language: 'en' | 'hi'
  ): Promise<string[]>;

  /**
   * Responds to patient queries about laboratory concepts and report fields.
   * MUST safely refuse any diagnostic or treatment/medication advice.
   */
  askDoubtEngine(
    query: string,
    reportContext: CandidateExtractionRow[],
    language: 'en' | 'hi'
  ): Promise<{
    responseText: string;
    isRefusal: boolean;
    educationalNotes?: string[];
  }>;
}
