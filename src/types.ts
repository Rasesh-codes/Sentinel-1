export interface ValidatedEvidence {
  text: string;
  reason: string;
  tactic: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  validated: boolean;
  start_index?: number;
  end_index?: number;
  rejection_reason?: string;
}

export interface ScoreBreakdownItem {
  tactic: string;
  label: string;
  weight: number;
  occurrences: number;
  points_contributed: number;
  rule: string;
}

export interface DetectedUrlInfo {
  raw_url: string;
  domain: string;
  is_https: boolean;
  is_shortened: boolean;
  safety_note: string;
}

export interface AnalyzeResponse {
  classification: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ai_confidence: number;
  validated_evidence: ValidatedEvidence[];
  rejected_evidence?: ValidatedEvidence[];
  detected_tactics: string[];
  score_breakdown: ScoreBreakdownItem[];
  explanation: string;
  recommended_actions: string[];
  detected_urls: DetectedUrlInfo[];
  uncertainty: string;
  analysis_source: 'gemini' | 'local_fallback' | 'demo';
  demo_mode: boolean;
  original_message: string;
  language: string;
}

export interface DemoBenchmark {
  id: string;
  title: string;
  category: string;
  sample: string;
  expected_tactics: string[];
  description: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'hinglish';

export interface HistoryItem {
  id: string;
  timestamp: number;
  message_preview: string;
  full_message: string;
  classification: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  result: AnalyzeResponse;
}
