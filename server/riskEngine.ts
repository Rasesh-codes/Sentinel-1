import { ScoreBreakdownItem } from './types.js';

export const TACTIC_WEIGHTS: Record<string, number> = {
  OTP_REQUEST: 25,
  FINANCIAL_REQUEST: 20,
  THREAT: 15,
  URGENCY: 10,
  EXTERNAL_ACTION: 10,
  AUTHORITY_IMPERSONATION: 10,
  UNREALISTIC_REWARD: 10,
  SECRECY_PRESSURE: 10,
  IDENTITY_PRESSURE: 10,
};

export const TACTIC_DISPLAY_NAMES: Record<string, string> = {
  OTP_REQUEST: 'OTP / Credential Request',
  FINANCIAL_REQUEST: 'Direct Payment / Financial Transfer Demand',
  THREAT: 'Account Suspension / Legal Penalty Threat',
  URGENCY: 'Artificial Time Urgency / Deadline',
  EXTERNAL_ACTION: 'External Link / Out-of-channel Action',
  AUTHORITY_IMPERSONATION: 'Authority / Institutional Impersonation',
  UNREALISTIC_REWARD: 'Unrealistic Reward / Guaranteed Returns',
  SECRECY_PRESSURE: 'Secrecy / Concealment Pressure',
  IDENTITY_PRESSURE: 'Identity / Registration Pressure',
};

export const VALID_CATEGORIES: string[] = [
  'Delivery / Parcel Scam',
  'Banking / KYC Scam',
  'Phishing',
  'Job / Recruitment Scam',
  'Investment Scam',
  'Payment / UPI Scam',
  'Prize / Reward Scam',
  'Government Impersonation',
  'Account Security Scam',
  'OTP / Credential Theft',
  'Romance / Social Engineering',
  'Tech Support Scam',
  'Loan Scam',
  'Charity Scam',
  'Subscription / Billing Scam',
  'Threat / Extortion',
  'Suspicious / Other',
  'Legitimate',
];

export function normalizeCategory(cat?: string | null): string {
  if (!cat || !String(cat).trim()) {
    return 'Suspicious / Other';
  }
  const c = String(cat).trim();
  if (VALID_CATEGORIES.includes(c)) {
    return c;
  }
  const low = c.toLowerCase();
  if (low.includes('deliver') || low.includes('parcel') || low.includes('package') || low.includes('courier') || low.includes('shipment')) {
    return 'Delivery / Parcel Scam';
  }
  if (low.includes('bank') || low.includes('kyc') || low.includes('sbi') || low.includes('hdfc') || low.includes('icici')) {
    return 'Banking / KYC Scam';
  }
  if (low.includes('job') || low.includes('recruitment') || low.includes('work from home') || low.includes('hiring')) {
    return 'Job / Recruitment Scam';
  }
  if (low.includes('invest') || low.includes('crypto') || low.includes('trading') || low.includes('forex')) {
    return 'Investment Scam';
  }
  if (low.includes('payment') || low.includes('upi') || low.includes('refund')) {
    return 'Payment / UPI Scam';
  }
  if (low.includes('prize') || low.includes('reward') || low.includes('lottery') || low.includes('congrat') || low.includes('won')) {
    return 'Prize / Reward Scam';
  }
  if (low.includes('govt') || low.includes('government') || low.includes('tax') || low.includes('police') || low.includes('customs')) {
    return 'Government Impersonation';
  }
  if (low.includes('otp') || low.includes('credential')) {
    return 'OTP / Credential Theft';
  }
  if (low.includes('account') || low.includes('takeover') || low.includes('security')) {
    return 'Account Security Scam';
  }
  if (low.includes('romance') || low.includes('dating')) {
    return 'Romance / Social Engineering';
  }
  if (low.includes('tech') || low.includes('support')) {
    return 'Tech Support Scam';
  }
  if (low.includes('loan')) {
    return 'Loan Scam';
  }
  if (low.includes('charity') || low.includes('donation')) {
    return 'Charity Scam';
  }
  if (low.includes('bill') || low.includes('subscription')) {
    return 'Subscription / Billing Scam';
  }
  if (low.includes('threat') || low.includes('extort') || low.includes('blackmail')) {
    return 'Threat / Extortion';
  }
  if (low.includes('phish')) {
    return 'Phishing';
  }
  if (low.includes('legit') || low.includes('safe') || low.includes('normal') || low.includes('benign')) {
    return 'Legitimate';
  }
  return 'Suspicious / Other';
}

export function calculateRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}

export interface DeterministicRiskResult {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  breakdown: ScoreBreakdownItem[];
}

export function calculateDeterministicRisk(validatedTactics: string[]): DeterministicRiskResult {
  // Count occurrences for transparency
  const tacticCounts: Record<string, number> = {};
  for (const t of validatedTactics) {
    const normalized = t.trim().toUpperCase();
    if (normalized in TACTIC_WEIGHTS) {
      tacticCounts[normalized] = (tacticCounts[normalized] || 0) + 1;
    }
  }

  let totalScore = 0;
  const breakdown: ScoreBreakdownItem[] = [];

  // Score only unique tactics
  for (const [tactic, weight] of Object.entries(TACTIC_WEIGHTS)) {
    if (tactic in tacticCounts) {
      const count = tacticCounts[tactic];
      const points = weight; // Each tactic only scores its single weight once
      totalScore += points;
      breakdown.push({
        tactic,
        label: TACTIC_DISPLAY_NAMES[tactic] || tactic,
        weight,
        occurrences: count,
        points_contributed: points,
        rule: `+${weight} (counted once despite ${count} mention${count > 1 ? 's' : ''})`,
      });
    }
  }

  // Clamp score to 0-100
  const clampedScore = Math.max(0, Math.min(100, totalScore));
  const riskLevel = calculateRiskLevel(clampedScore);

  return {
    score: clampedScore,
    level: riskLevel,
    breakdown,
  };
}
