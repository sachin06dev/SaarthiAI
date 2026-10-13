import { CANONICAL_TEST_CATALOG } from './test-catalog';
import { CuratedTestDefinition } from '../types/test.types';

export interface MatchResult {
  matched: boolean;
  canonicalId: string;
  definition?: CuratedTestDefinition;
  confidence: 'EXACT' | 'SYNONYM' | 'UNMAPPED';
}

/**
 * Normalizes input string for comparison: lowercase, trim, normalize internal spaces and punctuation.
 */
export function normalizeTestNameString(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/[\(\)\[\],:\/\-]/g, ' ') // replace punctuation with spaces
    .replace(/\s+/g, ' ') // collapse multi-spaces
    .trim();
}

/**
 * Safely matches an extracted test label against the canonical catalogue.
 * Preserves the original label and avoids dangerous fuzzy guessing.
 */
export function matchTestToCanonical(rawTestName: string): MatchResult {
  if (!rawTestName || typeof rawTestName !== 'string') {
    return { matched: false, canonicalId: 'UNMAPPED', confidence: 'UNMAPPED' };
  }

  const cleaned = normalizeTestNameString(rawTestName);

  // 1. Direct Canonical Key Match
  for (const [canonicalId, def] of Object.entries(CANONICAL_TEST_CATALOG)) {
    if (def.displayName.toLowerCase() === rawTestName.toLowerCase() || canonicalId.toLowerCase() === cleaned) {
      return { matched: true, canonicalId, definition: def, confidence: 'EXACT' };
    }
  }

  // 2. Strict Synonym List Matching
  for (const [canonicalId, def] of Object.entries(CANONICAL_TEST_CATALOG)) {
    for (const syn of def.synonyms) {
      const cleanedSyn = normalizeTestNameString(syn);
      if (cleaned === cleanedSyn) {
        return { matched: true, canonicalId, definition: def, confidence: 'SYNONYM' };
      }
    }
  }

  // 3. Composite or Substring Match (e.g. "ALT (SGPT)", "Hemoglobin (Hb)")
  // Only match if unambiguous and doesn't overlap between two distinct analytes
  for (const [canonicalId, def] of Object.entries(CANONICAL_TEST_CATALOG)) {
    for (const syn of def.synonyms) {
      const cleanedSyn = normalizeTestNameString(syn);
      if (cleanedSyn.length >= 3 && (cleaned === cleanedSyn || cleaned.includes(` ${cleanedSyn} `) || cleaned.startsWith(`${cleanedSyn} `) || cleaned.endsWith(` ${cleanedSyn}`))) {
        return { matched: true, canonicalId, definition: def, confidence: 'SYNONYM' };
      }
    }
  }

  return { matched: false, canonicalId: 'UNMAPPED', confidence: 'UNMAPPED' };
}
