import { ValidatedEvidence } from './types.js';

export function normalizeText(text: string): string {
  if (!text) return '';
  let s = text.normalize('NFKD');
  // Normalize quotation marks
  s = s.replace(/[“”«»]/g, '"').replace(/[‘’`]/g, "'");
  // Normalize dashes and hyphens
  s = s.replace(/[—–]/g, '-');
  return s;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function findNormalizedSpan(original: string, query: string): [number, number] | null {
  if (!original || !query) return null;

  // 1. Exact match
  const exactPos = original.indexOf(query);
  if (exactPos !== -1) {
    return [exactPos, exactPos + query.length];
  }

  // 2. Case-insensitive exact match
  const lowerOrig = original.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const casePos = lowerOrig.indexOf(lowerQuery);
  if (casePos !== -1) {
    return [casePos, casePos + query.length];
  }

  // 3. Normalized matching (handles curly quotes, whitespace differences)
  const normOrig = normalizeText(original);
  const normQuery = normalizeText(query).trim();

  const normPos = normOrig.toLowerCase().indexOf(normQuery.toLowerCase());
  if (normPos !== -1 && normOrig.length === original.length) {
    return [normPos, normPos + normQuery.length];
  }

  // 4. Whitespace collapsed regex search
  const tokens = normQuery
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegex);
  if (tokens.length === 0) return null;

  try {
    const pattern = tokens.join('\\s+');
    const regex = new RegExp(pattern, 'i');
    const match = regex.exec(original);
    if (match) {
      return [match.index, match.index + match[0].length];
    }
  } catch {
    // ignore regex errors
  }

  return null;
}

export function validateSingleEvidence(originalMessage: string, signal: any): ValidatedEvidence {
  const candidateText = String(signal?.text || '').trim();
  const reason = String(signal?.reason || '').trim();
  const tactic = String(signal?.tactic || 'UNKNOWN').trim().toUpperCase();
  const severity = (String(signal?.severity || 'MEDIUM').trim().toUpperCase() as any) || 'MEDIUM';

  if (!candidateText) {
    return {
      text: '',
      reason,
      tactic,
      severity,
      validated: false,
      rejection_reason: 'Empty text span provided.',
    };
  }

  const span = findNormalizedSpan(originalMessage, candidateText);
  if (span !== null) {
    const [start, end] = span;
    // Extract exact substring from original message to preserve original casing & characters
    const exactText = originalMessage.slice(start, end);
    return {
      text: exactText,
      reason,
      tactic,
      severity,
      validated: true,
      start_index: start,
      end_index: end,
    };
  } else {
    // Rejected! The evidence does not exist in the original text.
    return {
      text: candidateText,
      reason,
      tactic,
      severity,
      validated: false,
      rejection_reason: 'Fabricated evidence: span does not exist in original user message.',
    };
  }
}

export function validateEvidence(originalMessage: string, signals: any): ValidatedEvidence[] {
  if (!Array.isArray(signals)) {
    return [];
  }
  const validatedList: ValidatedEvidence[] = [];
  for (const sig of signals) {
    if (!sig || typeof sig !== 'object') continue;
    const res = validateSingleEvidence(originalMessage, sig);
    validatedList.push(res);
  }
  return validatedList;
}
