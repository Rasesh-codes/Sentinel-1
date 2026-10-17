import { GoogleGenAI, Type } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export interface RawAiOutput {
  classification: string;
  risk_signals: Array<{
    text: string;
    reason: string;
    tactic: string;
    severity: string;
  }>;
  tactics: string[];
  ai_confidence: number;
  explanation: string;
  uncertainty: string;
}

const SYSTEM_INSTRUCTION = `You are the semantic analysis component of SENTINEL, a consumer security application that helps users understand suspicious SMS, WhatsApp, and email messages before they click, pay, reply, or share.
Your job is to identify semantic social-engineering tactics, classify the message into a specific category, and EXTRACT EXACT TEXT SPANS from the user message.

CRITICAL REQUIREMENT ON EVIDENCE:
- You must ONLY extract exact words and phrases that literally appear in the original message.
- NEVER rephrase, summarize, fabricate, or invent evidence text.
- If you quote something in "text", it MUST exist verbatim in the message.

Supported Categories (Select the MOST SPECIFIC applicable category):
- Delivery / Parcel Scam (e.g. package undelivered, redelivery fee, parcel returned)
- Banking / KYC Scam (e.g. SBI/HDFC/bank account suspended, KYC verification)
- Phishing (e.g. deceptive links asking for login credentials)
- Job / Recruitment Scam (e.g. work from home, high salary, registration fee)
- Investment Scam (e.g. guaranteed returns, crypto, trading)
- Payment / UPI Scam (e.g. send money to receive refund, UPI PIN requests)
- Prize / Reward Scam (e.g. won ₹10,000, lottery, lucky draw)
- Government Impersonation (e.g. police, customs, tax department, arrest threat)
- Account Security Scam (e.g. unauthorized login, password reset fraud)
- OTP / Credential Theft (e.g. asking for OTP, PIN, 2FA code)
- Romance / Social Engineering
- Tech Support Scam (e.g. computer infected, call toll-free support)
- Loan Scam (e.g. instant loan approved, advance fee)
- Charity Scam
- Subscription / Billing Scam (e.g. fake invoice, renewal fee)
- Threat / Extortion
- Suspicious / Other (use ONLY if none of the above specific categories apply)
- Legitimate (normal, benign messages e.g. real shipment notices without threats/fees)

Permitted Tactics:
- OTP_REQUEST: Asking for one-time passwords, verification codes, PINs
- FINANCIAL_REQUEST: Demanding direct money transfers, UPI payments, registration fees, redelivery fees
- THREAT: Claiming impending account suspension, parcel destruction/return, police arrest, legal penalty
- URGENCY: Imposing artificial deadlines ("immediately", "today", "within 2 hours", "within 30 mins")
- EXTERNAL_ACTION: Directing to external links, unverified URLs
- AUTHORITY_IMPERSONATION: Claiming to be Bank, Police, Amazon, Postal Service, Government
- UNREALISTIC_REWARD: Promising massive returns, unearned lottery prizes, inflated salaries
- SECRECY_PRESSURE: Asking the user not to tell family or bank
- IDENTITY_PRESSURE: Pressuring to verify KYC, Aadhaar, PAN or artificial quota limit

Human-Readable Explanations:
- Avoid robotic corporate labels. Write clear, conversational explanations in the voice of SENTINEL.
- Example: "SENTINEL noticed that the sender is asking you to make a payment and is using a short deadline to pressure you into acting quickly."
- If the message is legitimate: "SENTINEL did not find any coercive pressure, unexpected payment requests, or suspicious links in this message."

Confidence must represent your semantic analysis confidence (0.0 to 1.0).
Do NOT calculate risk scores. The backend will calculate the risk score deterministically.`;

// Models to try in order of priority. If primary experiences 503 (high demand) or 429, fall back seamlessly.
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

async function callModelWithTimeout(
  client: GoogleGenAI,
  modelName: string,
  prompt: string,
  timeoutMs: number = 10000
): Promise<string | null> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
  });

  const apiPromise = client.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.1,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: {
            type: Type.STRING,
            description: 'Scam category or Probably Legitimate',
          },
          risk_signals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING,
                  description: 'Exact verbatim substring copied directly from user message',
                },
                reason: {
                  type: Type.STRING,
                  description: 'Why this phrase is suspicious or what tactic it uses',
                },
                tactic: {
                  type: Type.STRING,
                  description: 'One of the permitted social engineering tactics',
                },
                severity: {
                  type: Type.STRING,
                  description: 'LOW, MEDIUM, HIGH, or CRITICAL',
                },
              },
              required: ['text', 'reason', 'tactic', 'severity'],
            },
          },
          tactics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of unique detected social engineering tactics',
          },
          ai_confidence: {
            type: Type.NUMBER,
            description: 'AI analysis confidence between 0.0 and 1.0',
          },
          explanation: {
            type: Type.STRING,
            description: 'Plain language explanation of why the message is or is not suspicious',
          },
          uncertainty: {
            type: Type.STRING,
            description: 'Uncertainty statement noting this is risk analysis, not absolute proof',
          },
        },
        required: [
          'classification',
          'risk_signals',
          'tactics',
          'ai_confidence',
          'explanation',
          'uncertainty',
        ],
      },
    },
  });

  const response = await Promise.race([apiPromise, timeoutPromise]);
  return response.text?.trim() || null;
}

export async function analyzeWithGemini(message: string, language: string = 'en'): Promise<RawAiOutput | null> {
  const client = getGeminiClient();
  if (!client) {
    console.log('[SENTINEL] Gemini API key not configured. Using deterministic local fallback.');
    return null;
  }

  const prompt = `Language requested: ${language}\n\nAnalyze this message carefully for SENTINEL:\n"""\n${message}\n"""`;

  let lastErrorMsg = '';

  for (let i = 0; i < CANDIDATE_MODELS.length; i++) {
    const model = CANDIDATE_MODELS[i];
    try {
      const responseText = await callModelWithTimeout(client, model, prompt, 12000);
      if (responseText) {
        const parsed = JSON.parse(responseText) as RawAiOutput;
        if (parsed && parsed.classification) {
          return parsed;
        }
      }
    } catch (err: unknown) {
      lastErrorMsg = err instanceof Error ? err.message : String(err);
      // If error is high demand (503), rate limit (429), or unavailable, attempt fallback model
      const isTransient =
        lastErrorMsg.includes('503') ||
        lastErrorMsg.includes('429') ||
        lastErrorMsg.includes('high demand') ||
        lastErrorMsg.includes('UNAVAILABLE') ||
        lastErrorMsg.includes('Timeout');

      if (isTransient && i < CANDIDATE_MODELS.length - 1) {
        // Brief delay before trying alternate model
        await new Promise((resolve) => setTimeout(resolve, 600));
        continue;
      }
    }
  }

  console.log(`[SENTINEL] Remote AI services temporarily busy (${lastErrorMsg.slice(0, 120)}). Engaging deterministic verification engine.`);
  return null;
}
