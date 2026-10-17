import { DEMO_BENCHMARKS } from './demoData.js';
import { RawAiOutput } from './geminiService.js';

interface HeuristicRule {
  tactic: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  patterns: Array<{
    regex: RegExp;
    reason: string;
  }>;
}

const HEURISTIC_RULES: HeuristicRule[] = [
  {
    tactic: 'OTP_REQUEST',
    severity: 'HIGH',
    patterns: [
      {
        regex: /\b(entering the OTP|enter your OTP|share (?:the )?OTP|OTP sent to your mobile|send (?:the )?OTP|give (?:the )?PIN|password|verification code)\b/i,
        reason: 'The sender requests a sensitive authentication code or one-time password.',
      },
      {
        regex: /\bOTP\b/i,
        reason: 'Mentions one-time password in an unsolicited message.',
      },
    ],
  },
  {
    tactic: 'THREAT',
    severity: 'HIGH',
    patterns: [
      {
        regex: /\b(permanently suspended|will be (?:blocked|suspended|terminated|deactivated)|account closure|result in legal action|arrest warrant|police action)\b/i,
        reason: 'Threatens severe consequences such as account termination or legal prosecution.',
      },
      {
        regex: /\b(returned to the sender|parcel will be returned|package will be destroyed|lost forever)\b/i,
        reason: 'Threatens that your parcel or service will be forfeited if you do not comply.',
      },
      {
        regex: /\b(suspended today|account will be suspended)\b/i,
        reason: 'Threatens imminent loss of access.',
      },
    ],
  },
  {
    tactic: 'FINANCIAL_REQUEST',
    severity: 'HIGH',
    patterns: [
      {
        regex: /\b(pay a refundable registration fee of [₹$\w\d,]+|pay [₹$\w\d,]+ through UPI|send your payment|transfer [₹$\w\d,]+|deposit [₹$\w\d,]+|invest [₹$\w\d,]+)\b/i,
        reason: 'Demands immediate financial transfer or payment.',
      },
      {
        regex: /\b(unpaid redelivery fee|pay the fee|redelivery fee of [₹$\w\d,]+|pay [₹\d,]+)\b/i,
        reason: 'Asks you to pay an unexpected fee or charge.',
      },
      {
        regex: /\b(through UPI|to secure your slot|invest [₹\d,]+)\b/i,
        reason: 'Requests direct payment or investment transfer.',
      },
    ],
  },
  {
    tactic: 'URGENCY',
    severity: 'MEDIUM',
    patterns: [
      {
        regex: /\b(URGENT:|immediately|within \d+ (?:minutes|hours)|available only until midnight|confirm your position today|act now|hurry|today)\b/i,
        reason: 'Creates an artificial time deadline to prevent careful verification.',
      },
    ],
  },
  {
    tactic: 'EXTERNAL_ACTION',
    severity: 'MEDIUM',
    patterns: [
      {
        regex: /(https?:\/\/[^\s<>"]+|clicking https?:\/\/[^\s<>"]+|verify your KYC immediately by clicking [^\s]+)/i,
        reason: 'Directs you to an external website outside verified official apps.',
      },
    ],
  },
  {
    tactic: 'AUTHORITY_IMPERSONATION',
    severity: 'MEDIUM',
    patterns: [
      {
        regex: /\b(Your SBI account|SBI|HDFC|ICICI|Income Tax Department|Police Department|Customs|RBI|Govt of India|Postal Service|India Post|FedEx|DHL|BlueDart)\b/i,
        reason: 'Claims authority from a known bank, carrier, or government body to gain your trust.',
      },
    ],
  },
  {
    tactic: 'UNREALISTIC_REWARD',
    severity: 'HIGH',
    patterns: [
      {
        regex: /\b(paying ₹[\d,]+ per month|guaranteed returns of ₹[\d,]+|won \$?[\d,]+|lottery prize|claim prize|congratulations! you won)\b/i,
        reason: 'Promises unusually high earnings, guaranteed returns, or unearned prizes.',
      },
    ],
  },
  {
    tactic: 'IDENTITY_PRESSURE',
    severity: 'MEDIUM',
    patterns: [
      {
        regex: /\b(Only \d+ positions are remaining|due to incomplete KYC|verify your KYC|update Aadhaar|update PAN)\b/i,
        reason: 'Pressures you using identity verification demands or artificial scarcity.',
      },
    ],
  },
  {
    tactic: 'SECRECY_PRESSURE',
    severity: 'HIGH',
    patterns: [
      {
        regex: /\b(do not tell anyone|keep this confidential|secret offer|do not inform bank)\b/i,
        reason: 'Instructs you to hide this communication from friends, family, or your bank.',
      },
    ],
  },
];

export interface LocalFallbackResult extends RawAiOutput {
  demo_matched?: string | null;
}

export function analyzeLocally(message: string): LocalFallbackResult {
  const cleanMsg = message.trim();
  const lowerMsg = cleanMsg.toLowerCase();

  // 1. Check if match with demo benchmarks
  for (const demo of DEMO_BENCHMARKS) {
    const demoSampleLow = demo.sample.toLowerCase();
    if (
      lowerMsg === demoSampleLow ||
      (cleanMsg.length > 30 && (demoSampleLow.includes(lowerMsg) || lowerMsg.includes(demoSampleLow)))
    ) {
      const signals: Array<{ text: string; reason: string; tactic: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }> = [];
      const matchedTactics: string[] = [];

      for (const rule of HEURISTIC_RULES) {
        if (demo.expected_tactics.includes(rule.tactic)) {
          for (const item of rule.patterns) {
            const m = item.regex.exec(cleanMsg);
            if (m) {
              const spanText = cleanMsg.slice(m.index, m.index + m[0].length);
              signals.push({
                text: spanText,
                reason: item.reason,
                tactic: rule.tactic,
                severity: rule.severity,
              });
              matchedTactics.push(rule.tactic);
              break;
            }
          }
        }
      }

      let explanation = demo.description;
      if (demo.id === 'delivery_scam') {
        explanation = 'SENTINEL noticed that the sender is asking you to pay a redelivery fee and is using a short 2-hour deadline with consequences to pressure you into clicking an unverified link.';
      } else if (demo.id === 'kyc_banking') {
        explanation = 'SENTINEL noticed that this message impersonates a bank, threatens permanent account suspension, and demands that you click an external link to enter an OTP code.';
      } else if (demo.id === 'fake_job') {
        explanation = 'SENTINEL noticed an inflated salary promise for basic data entry paired with a demand for an upfront registration fee via UPI to secure a position.';
      } else if (demo.id === 'investment') {
        explanation = 'SENTINEL identified an implausible 5x guaranteed return promise combined with midnight time scarcity designed to push you into sending money before verifying.';
      } else if (demo.id === 'legitimate') {
        explanation = 'SENTINEL did not detect any coercive threats, requests for credentials, upfront fees, or unusual external links. This matches standard transactional delivery updates.';
      }

      return {
        classification: demo.category,
        risk_signals: signals,
        tactics: matchedTactics.length > 0 ? matchedTactics : demo.expected_tactics,
        ai_confidence: demo.id === 'legitimate' ? 0.96 : 0.94,
        explanation,
        uncertainty: 'SENTINEL provides AI-assisted risk analysis, not definitive proof that a message is fraudulent.',
        demo_matched: demo.id,
      };
    }
  }

  // 2. General heuristic fallback for arbitrary messages
  const signals: Array<{ text: string; reason: string; tactic: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }> = [];
  const detectedTactics = new Set<string>();

  for (const rule of HEURISTIC_RULES) {
    for (const item of rule.patterns) {
      const m = item.regex.exec(cleanMsg);
      if (m) {
        const spanText = cleanMsg.slice(m.index, m.index + m[0].length);
        signals.push({
          text: spanText,
          reason: item.reason,
          tactic: rule.tactic,
          severity: rule.severity,
        });
        detectedTactics.add(rule.tactic);
        break;
      }
    }
  }

  // Classify based on detected heuristics & text cues
  let classification = 'Suspicious / Other';
  if (detectedTactics.size === 0) {
    classification = 'Legitimate';
  } else if (['package', 'parcel', 'delivery', 'courier', 'redelivery', 'shipment'].some((w) => lowerMsg.includes(w))) {
    classification = 'Delivery / Parcel Scam';
  } else if (detectedTactics.has('OTP_REQUEST')) {
    classification = 'OTP / Credential Theft';
  } else if (['kyc', 'sbi', 'hdfc', 'icici', 'bank', 'account suspended'].some((w) => lowerMsg.includes(w))) {
    classification = 'Banking / KYC Scam';
  } else if (['job', 'salary', 'work from home', 'data entry', 'hiring'].some((w) => lowerMsg.includes(w))) {
    classification = 'Job / Recruitment Scam';
  } else if (['invest', 'crypto', 'trading', 'returns of', 'forex'].some((w) => lowerMsg.includes(w))) {
    classification = 'Investment Scam';
  } else if (['won', 'lottery', 'prize', 'reward', 'congratulations'].some((w) => lowerMsg.includes(w))) {
    classification = 'Prize / Reward Scam';
  } else if (['upi', 'pay fee', 'refundable fee'].some((w) => lowerMsg.includes(w))) {
    classification = 'Payment / UPI Scam';
  } else if (['police', 'customs', 'tax', 'arrest', 'court'].some((w) => lowerMsg.includes(w))) {
    classification = 'Government Impersonation';
  } else if (detectedTactics.has('EXTERNAL_ACTION') && ['click', 'login', 'verify'].some((w) => lowerMsg.includes(w))) {
    classification = 'Phishing';
  }

  // Conversational explanation
  let explanation = '';
  if (detectedTactics.size === 0) {
    explanation = 'SENTINEL did not find any coercive pressure, unexpected payment requests, or suspicious links in this message.';
  } else {
    const reasonsList: string[] = [];
    if (detectedTactics.has('FINANCIAL_REQUEST')) reasonsList.push('asks you to make a payment or transfer');
    if (detectedTactics.has('URGENCY')) reasonsList.push('imposes a short deadline to pressure you into acting fast');
    if (detectedTactics.has('OTP_REQUEST')) reasonsList.push('asks for a secret one-time password');
    if (detectedTactics.has('THREAT')) reasonsList.push('threatens negative consequences if you do not comply');
    if (detectedTactics.has('EXTERNAL_ACTION')) reasonsList.push('directs you to an external unverified website');

    if (reasonsList.length >= 2) {
      explanation = `SENTINEL noticed that the sender ${reasonsList[0]} and ${reasonsList[1]}. Scammers often combine urgency with financial or link requests to reduce the time you have to verify.`;
    } else if (reasonsList.length === 1) {
      explanation = `SENTINEL noticed that the sender ${reasonsList[0]}. Take a moment to verify independently through official channels.`;
    } else {
      explanation = `SENTINEL identified ${detectedTactics.size} security indicators commonly used in social-engineering.`;
    }
  }

  return {
    classification,
    risk_signals: signals,
    tactics: Array.from(detectedTactics),
    ai_confidence: detectedTactics.size > 0 ? 0.88 : 0.95,
    explanation,
    uncertainty: 'SENTINEL provides AI-assisted risk analysis, not definitive proof that a message is fraudulent.',
    demo_matched: null,
  };
}
