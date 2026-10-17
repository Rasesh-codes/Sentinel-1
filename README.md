# ScamShield AI — Explainable AI Safety & Fraud Prevention

**Hackathon Submission for UPAI-Hackdays 2026**

---

## 1. Executive Summary

**ScamShield AI** is an explainable AI safety application engineered to protect vulnerable populations—such as elderly citizens, students, and new digital consumers—from deceptive social-engineering attacks (KYC scams, fake job offers, investment fraud, and urgent OTP theft).

### Core Architectural Philosophy
> **"AI identifies evidence. Software evaluates evidence."**

Traditional AI safety applications often ask LLMs to output subjective risk numbers directly, leading to arithmetic hallucinations, confidence drift, and non-reproducible scores. ScamShield resolves this by decoupling **semantic extraction** from **risk evaluation**:
1. **Gemini 3.8 Flash** extracts semantic tactics and candidate quotes.
2. **Deterministic Python Engine** validates quotes verbatim against the raw user input, eliminates fabricated phrases, applies deduplication logic, and computes the mathematically bounded risk score.

---

## 2. Key Capabilities & Technical Features

- **Verbatim Evidence Validation**:
  Every phrase flagged by the AI is mathematically verified against the original text using NFKD/NFC unicode normalization and span alignment. Any AI-hallucinated or paraphrased evidence is rejected before risk calculation.
- **Deterministic Risk Engine**:
  Fixed weights calculate the score (`OTP_REQUEST`: +25, `FINANCIAL_REQUEST`: +20, `THREAT`: +15, `URGENCY`: +10, `EXTERNAL_ACTION`: +10, `AUTHORITY_IMPERSONATION`: +10, `UNREALISTIC_REWARD`: +10, `SECRECY_PRESSURE`: +10, `IDENTITY_PRESSURE`: +10). Clamped between 0 and 100.
- **Tactic Deduplication**:
  Multiple occurrences of the same tactic (e.g. three urgent words like "URGENT", "immediately", "today") are counted once (+10) rather than artificially inflating the score to 100.
- **Safe, Non-Invasive URL Inspector**:
  Extracts links via regex and inspects IP addresses, suspicious TLDs, and URL shorteners. ScamShield **never** makes network requests to, scrapes, or resolves suspicious links.
- **Resilient Multi-Tier Fallback**:
  If the Gemini API key is missing or rate-limited, ScamShield automatically and transparently switches to the local deterministic heuristic engine without crashing or displaying empty screens.
- **Interactive Evidence Inspector**:
  Users can click any highlighted span in their original message to reveal the exact tactic, severity level, and plain-language explanation of why it is dangerous.
- **"Warn My Family" Alert Card**:
  Generates a high-contrast safety card exportable to PNG (via `html2canvas`) and shareable directly to WhatsApp or family messaging groups using the Web Share API.
- **Multi-Lingual Safety Guidance**:
  Provides actionable recommendations in English, Hindi (हिन्दी), and conversational Hinglish.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, `html2canvas`.
- **Backend Server**: Node.js, Express, `tsx`, `@google/genai` (Gemini 3.8 Flash).
- **Evaluation Engine**: Python 3 standard library (no external heavy dependencies needed for zero-latency execution).
- **Bundler & Build**: Vite 6, `esbuild` for CommonJS server compilation (`dist/server.cjs`).

---

## 4. API Endpoints

### `GET /health`
Returns system operational state:
```json
{
  "status": "ok",
  "app": "ScamShield AI",
  "version": "1.0.0",
  "python_engine": true,
  "gemini_configured": true,
  "model": "gemini-3.8-flash",
  "timestamp": "2026-09-09T04:30:00.000Z"
}
```

### `GET /api/demos`
Returns the 4 standard benchmark test cases (KYC Banking Scam, Fake Job Scam, Investment Scam, Legitimate Message).

### `POST /api/analyze`
**Request Body**:
```json
{
  "message": "URGENT: Your SBI account will be permanently suspended today. Click https://sbi.com and verify OTP.",
  "language": "en"
}
```

**Response Format**:
```json
{
  "classification": "Banking/UPI",
  "risk_score": 70,
  "risk_level": "HIGH",
  "ai_confidence": 0.88,
  "validated_evidence": [
    {
      "text": "permanently suspended",
      "reason": "Threatens severe consequences such as account termination",
      "tactic": "THREAT",
      "severity": "HIGH",
      "validated": true,
      "start_index": 33,
      "end_index": 54
    }
  ],
  "rejected_evidence": [],
  "detected_tactics": ["OTP_REQUEST", "THREAT", "URGENCY", "EXTERNAL_ACTION", "AUTHORITY_IMPERSONATION"],
  "score_breakdown": [
    {
      "tactic": "OTP_REQUEST",
      "label": "OTP / Credential Request",
      "weight": 25,
      "occurrences": 1,
      "points_contributed": 25,
      "rule": "+25 (counted once despite 1 mention)"
    }
  ],
  "explanation": "ScamShield local analysis identified 5 security signals...",
  "recommended_actions": [
    "Never share an OTP, PIN, or authentication code with someone who contacted you unexpectedly."
  ],
  "detected_urls": [
    {
      "raw_url": "https://sbi.com",
      "domain": "sbi.com",
      "is_https": true,
      "is_shortened": false,
      "safety_note": "External link detected. Verify the destination independently."
    }
  ],
  "uncertainty": "ScamShield provides AI-assisted risk analysis, not definitive proof that a message is fraudulent.",
  "analysis_source": "gemini",
  "demo_mode": false,
  "original_message": "...",
  "language": "en"
}
```

---

## 5. Automated Testing Suite

ScamShield includes automated test suites covering all 18 test scenarios:

```bash
# Run all tests (Python unit tests + TypeScript integration pipeline)
npm test

# Run Python engine tests directly
python3 tests/test_scamshield.py
```

### Verified Test Cases
1. Empty / whitespace message validation
2. Legitimate message evaluation (score 0-29, LOW risk)
3. KYC bank scam detection (score 60+, HIGH/CRITICAL)
4. OTP credential theft detection (+25 weight)
5. Fake job scam evaluation (unrealistic reward + UPI fee)
6. High-yield investment scam evaluation (guaranteed returns + urgency)
7. Threat & coercive legal penalty detection
8. Non-invasive URL detection (no fetching, shortener flags)
9. Hindi language recommendations
10. Hinglish conversational guidance
11. Resilient handling of malformed AI responses
12. **Fabricated evidence rejection** (rejecting ungrounded hallucinated phrases)
13. **Duplicate tactic deduplication** (preventing multiple identical tactic inflations)
14. Seamless local fallback during simulated API unavailability
15. Deterministic score calculation and clamping (0-100)
16. Risk level boundary verification (LOW / MEDIUM / HIGH / CRITICAL)
17. Recommendation engine relevance
18. Warning Card schema generation for family alerts

---

## 6. Responsible AI & Privacy Notice

ScamShield is designed around **Privacy by Default**:
- User messages are analyzed in-memory and are **not persistently stored**.
- ScamShield provides probabilistic risk indicators to assist user judgment, not legal determinations of fraud.
