import { AnalyzeResponse } from './types.js';
import { detectUrls } from './urlDetector.js';
import { validateEvidence } from './evidenceValidator.js';
import { calculateDeterministicRisk, normalizeCategory } from './riskEngine.js';
import { generateRecommendations } from './recommendationEngine.js';
import { analyzeLocally } from './localFallback.js';
import { analyzeWithGemini, RawAiOutput } from './geminiService.js';

export const MAX_MESSAGE_LENGTH = 4000;

export function normalizeInputText(text: string): string {
  if (!text) return '';
  // Normalize unicode to NFC for consistent text representation
  const norm = text.normalize('NFC');
  // Strip null bytes or risky control characters while preserving newlines and tabs
  let result = '';
  for (const ch of norm) {
    const code = ch.charCodeAt(0);
    if (ch === '\n' || ch === '\r' || ch === '\t' || (code >= 32 && code !== 127)) {
      result += ch;
    }
  }
  return result;
}

export interface PipelineOptions {
  message: string;
  language?: string;
  simulated_ai_output?: RawAiOutput;
  force_source?: 'gemini' | 'local_fallback' | 'demo';
}

export async function runPipeline(options: PipelineOptions): Promise<AnalyzeResponse> {
  const { message, language = 'en', simulated_ai_output, force_source } = options;

  // 1. Input Validation
  if (!message || !message.trim()) {
    throw new Error('Message input cannot be empty or whitespace-only.');
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`);
  }

  // 2. Text Normalization
  const cleanMsg = normalizeInputText(message);

  // 3. URL Detection (Safe, purely text-based)
  const detectedUrls = detectUrls(cleanMsg);

  // 4. Semantic Extraction
  let rawAi: RawAiOutput | null = null;
  let demoMode = false;
  let source: 'gemini' | 'local_fallback' | 'demo' = force_source || 'local_fallback';

  if (simulated_ai_output) {
    rawAi = simulated_ai_output;
    source = force_source || 'gemini';
  } else if (force_source === 'local_fallback') {
    const localRes = analyzeLocally(cleanMsg);
    rawAi = localRes;
    demoMode = Boolean(localRes.demo_matched);
    source = demoMode ? 'demo' : 'local_fallback';
  } else {
    // Attempt Gemini semantic analysis
    try {
      rawAi = await analyzeWithGemini(cleanMsg, language);
      if (rawAi) {
        source = 'gemini';
      }
    } catch (geminiErr) {
      console.warn('[SENTINEL] Gemini semantic call encountered error, falling back locally:', geminiErr);
      rawAi = null;
    }

    // If Gemini was offline, key missing, or timed out, engage deterministic local fallback
    if (!rawAi) {
      const localRes = analyzeLocally(cleanMsg);
      rawAi = localRes;
      demoMode = Boolean(localRes.demo_matched);
      source = demoMode ? 'demo' : 'local_fallback';
    }
  }

  // 5. Evidence Validation (Core Feature - validates spans against original message)
  const rawSignals = rawAi.risk_signals || [];
  const allEvidence = validateEvidence(cleanMsg, rawSignals);

  // Only validated evidence can influence the risk engine or appear as actionable
  const validatedEvidence = allEvidence.filter((e) => e.validated);
  const rejectedEvidence = allEvidence.filter((e) => !e.validated);

  // 6. Tactic Normalization: Extract tactics ONLY from validated evidence
  const validatedTactics: string[] = [];
  for (const ev of validatedEvidence) {
    const tac = ev.tactic?.toUpperCase().trim();
    if (tac) {
      validatedTactics.push(tac);
    }
  }

  // If external link was detected in URL detector, ensure EXTERNAL_ACTION is considered if link is present with pressure
  if (detectedUrls.length > 0 && !validatedTactics.includes('EXTERNAL_ACTION')) {
    if (validatedTactics.some((t) => ['THREAT', 'URGENCY', 'OTP_REQUEST', 'FINANCIAL_REQUEST'].includes(t))) {
      validatedTactics.push('EXTERNAL_ACTION');
    }
  }

  // 7. Deterministic Risk Engine (Calculated in TypeScript, NEVER by the AI)
  const { score: riskScore, level: riskLevel, breakdown: scoreBreakdown } = calculateDeterministicRisk(validatedTactics);

  // Classification normalization using supported categories
  let classification = normalizeCategory(rawAi.classification);
  if (riskScore === 0 && validatedEvidence.length === 0) {
    classification = 'Legitimate';
  }

  // 8. Safety Recommendations
  const recommendations = generateRecommendations(validatedTactics, riskLevel, language);

  // 9. Explanation & Uncertainty
  const explanation = rawAi.explanation || 'SENTINEL analyzed the message structure and social-engineering tactics.';
  const uncertainty =
    rawAi.uncertainty ||
    'SENTINEL provides AI-assisted risk analysis, not definitive proof that a message is fraudulent.';

  const aiConfidence = Number(rawAi.ai_confidence ?? 0.85);

  // Preserve unique detected tactics list in order
  const uniqueTactics: string[] = Array.from(new Set(validatedTactics));

  return {
    classification,
    risk_score: riskScore,
    risk_level: riskLevel,
    ai_confidence: Math.round(aiConfidence * 100) / 100,
    validated_evidence: validatedEvidence,
    rejected_evidence: rejectedEvidence,
    detected_tactics: uniqueTactics,
    score_breakdown: scoreBreakdown,
    explanation,
    recommended_actions: recommendations,
    detected_urls: detectedUrls,
    uncertainty,
    analysis_source: source,
    demo_mode: demoMode,
    original_message: cleanMsg,
    language,
  };
}
