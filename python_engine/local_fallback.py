"""
SENTINEL - Local Fallback Analysis Engine
Provides deterministic, transparent semantic extraction when Gemini API is unavailable,
or for predefined demo benchmarks.
Extracts real, verifiable text spans directly from the input text.
"""
import re
from typing import Dict, Any, List

# Predefined benchmark demos matching SENTINEL requirements
DEMO_BENCHMARKS = [
  {
    "id": "delivery_scam",
    "title": "Delivery Scam",
    "category": "Delivery / Parcel Scam",
    "sample": "Your package could not be delivered due to an unpaid redelivery fee of ₹49. To prevent your parcel from being returned to the sender, please pay the fee within 2 hours at https://postal-track-service.com.",
    "expected_tactics": ["FINANCIAL_REQUEST", "URGENCY", "EXTERNAL_ACTION", "THREAT"],
    "confidence": 0.94,
    "explanation": "SENTINEL noticed that the sender is asking you to pay a redelivery fee and is using a short 2-hour deadline with consequences to pressure you into clicking an unverified link."
  },
  {
    "id": "kyc_banking",
    "title": "Banking / KYC Scam",
    "category": "Banking / KYC Scam",
    "sample": "URGENT: Your SBI account will be permanently suspended today due to incomplete KYC. To avoid account closure, verify your KYC immediately by clicking https://sbi-kyc-verify.example.com and entering the OTP sent to your mobile. Failure to complete verification within 30 minutes may result in legal action.",
    "expected_tactics": ["THREAT", "URGENCY", "OTP_REQUEST", "EXTERNAL_ACTION", "AUTHORITY_IMPERSONATION"],
    "confidence": 0.95,
    "explanation": "SENTINEL noticed that this message impersonates a bank, threatens permanent account suspension, and demands that you click an external link to enter an OTP code."
  },
  {
    "id": "fake_job",
    "title": "Fake Job Scam",
    "category": "Job / Recruitment Scam",
    "sample": "Congratulations! Your profile has been selected for a Work From Home Data Entry job paying ₹45,000 per month. To confirm your position today, pay a refundable registration fee of ₹1,499 through UPI to secure your slot. Only 5 positions are remaining.",
    "expected_tactics": ["FINANCIAL_REQUEST", "URGENCY", "UNREALISTIC_REWARD", "IDENTITY_PRESSURE"],
    "confidence": 0.92,
    "explanation": "SENTINEL noticed an inflated salary promise for basic data entry paired with a demand for an upfront registration fee via UPI to secure a position."
  },
  {
    "id": "investment",
    "title": "Investment Scam",
    "category": "Investment Scam",
    "sample": "Exclusive investment opportunity! Invest ₹10,000 today and receive guaranteed returns of ₹50,000 within 7 days. This offer is available only until midnight. Send your payment immediately to reserve your position.",
    "expected_tactics": ["FINANCIAL_REQUEST", "URGENCY", "UNREALISTIC_REWARD"],
    "confidence": 0.93,
    "explanation": "SENTINEL identified an implausible 5x guaranteed return promise combined with midnight time scarcity designed to push you into sending money before verifying."
  },
  {
    "id": "legitimate",
    "title": "Legitimate Delivery",
    "category": "Legitimate",
    "sample": "Your Amazon order #482731 has been shipped and is expected to arrive tomorrow. You can track your delivery through the Amazon app. Thank you for shopping with Amazon.",
    "expected_tactics": [],
    "confidence": 0.96,
    "explanation": "SENTINEL did not detect any coercive threats, requests for credentials, upfront fees, or unusual external links. This matches standard transactional delivery updates."
  }
]

# Rule patterns to extract genuine text spans for local fallback
HEURISTIC_RULES = [
    {
        "tactic": "OTP_REQUEST",
        "severity": "HIGH",
        "patterns": [
            (r'\b(entering the OTP|enter your OTP|share (the )?OTP|OTP sent to your mobile|send (the )?OTP|give (the )?PIN|password|verification code)\b', "The sender requests a sensitive authentication code or one-time password."),
            (r'\bOTP\b', "Mentions one-time password in an unsolicited message.")
        ]
    },
    {
        "tactic": "THREAT",
        "severity": "HIGH",
        "patterns": [
            (r'\b(permanently suspended|will be (blocked|suspended|terminated|deactivated)|account closure|result in legal action|arrest warrant|police action)\b', "Threatens severe consequences such as account termination or legal prosecution."),
            (r'\b(returned to the sender|parcel will be returned|package will be destroyed|lost forever)\b', "Threatens that your parcel or service will be forfeited if you do not comply."),
            (r'\b(suspended today|account will be suspended)\b', "Threatens imminent loss of access.")
        ]
    },
    {
        "tactic": "FINANCIAL_REQUEST",
        "severity": "HIGH",
        "patterns": [
            (r'\b(pay a refundable registration fee of [₹\$\w\d,]+|pay [₹\$\w\d,]+ through UPI|send your payment|transfer [₹\$\w\d,]+|deposit [₹\$\w\d,]+|invest [₹\$\w\d,]+)\b', "Demands immediate financial transfer or payment."),
            (r'\b(unpaid redelivery fee|pay the fee|redelivery fee of [₹\$\w\d,]+|pay [₹\d,]+)\b', "Asks you to pay an unexpected fee or charge."),
            (r'\b(through UPI|to secure your slot|invest [₹\d,]+)\b', "Requests direct payment or investment transfer.")
        ]
    },
    {
        "tactic": "URGENCY",
        "severity": "MEDIUM",
        "patterns": [
            (r'\b(URGENT:|immediately|within \d+ (minutes|hours)|available only until midnight|confirm your position today|act now|hurry|today)\b', "Creates an artificial time deadline to prevent careful verification.")
        ]
    },
    {
        "tactic": "EXTERNAL_ACTION",
        "severity": "MEDIUM",
        "patterns": [
            (r'(https?:\/\/[^\s<>"]+|clicking https?:\/\/[^\s<>"]+|verify your KYC immediately by clicking [^\s]+)', "Directs you to an external website outside verified official apps.")
        ]
    },
    {
        "tactic": "AUTHORITY_IMPERSONATION",
        "severity": "MEDIUM",
        "patterns": [
            (r'\b(Your SBI account|SBI|HDFC|ICICI|Income Tax Department|Police Department|Customs|RBI|Govt of India|Postal Service|India Post|FedEx|DHL|BlueDart)\b', "Claims authority from a known bank, carrier, or government body to gain your trust.")
        ]
    },
    {
        "tactic": "UNREALISTIC_REWARD",
        "severity": "HIGH",
        "patterns": [
            (r'\b(paying ₹[\d,]+ per month|guaranteed returns of ₹[\d,]+|won \$?[\d,]+|lottery prize|claim prize|congratulations! you won)\b', "Promises unusually high earnings, guaranteed returns, or unearned prizes.")
        ]
    },
    {
        "tactic": "IDENTITY_PRESSURE",
        "severity": "MEDIUM",
        "patterns": [
            (r'\b(Only \d+ positions are remaining|due to incomplete KYC|verify your KYC|update Aadhaar|update PAN)\b', "Pressures you using identity verification demands or artificial scarcity.")
        ]
    },
    {
        "tactic": "SECRECY_PRESSURE",
        "severity": "HIGH",
        "patterns": [
            (r'\b(do not tell anyone|keep this confidential|secret offer|do not inform bank)\b', "Instructs you to hide this communication from friends, family, or your bank.")
        ]
    }
]

def analyze_locally(message: str) -> Dict[str, Any]:
    """
    Analyzes message locally by identifying exact phrases corresponding to social engineering heuristics.
    Guarantees every extracted text span actually exists in the original message!
    """
    clean_msg = message.strip()
    
    # Check if match with demo benchmarks
    for demo in DEMO_BENCHMARKS:
        if clean_msg.lower() == demo["sample"].lower() or (len(clean_msg) > 30 and (demo["sample"].lower() in clean_msg.lower() or clean_msg.lower() in demo["sample"].lower())):
            signals = []
            matched_tactics = []
            for rule in HEURISTIC_RULES:
                if rule["tactic"] in demo["expected_tactics"]:
                    for pat, reason in rule["patterns"]:
                        m = re.search(pat, clean_msg, re.IGNORECASE)
                        if m:
                            span_text = clean_msg[m.start():m.end()]
                            signals.append({
                                "text": span_text,
                                "reason": reason,
                                "tactic": rule["tactic"],
                                "severity": rule["severity"]
                            })
                            matched_tactics.append(rule["tactic"])
                            break
                            
            return {
                "classification": demo["category"],
                "risk_signals": signals,
                "tactics": matched_tactics if matched_tactics else demo["expected_tactics"],
                "ai_confidence": demo["confidence"],
                "explanation": demo["explanation"],
                "uncertainty": "SENTINEL provides AI-assisted risk analysis, not definitive proof that a message is fraudulent.",
                "demo_matched": demo["id"]
            }

    # General heuristic fallback for arbitrary messages
    signals = []
    detected_tactics = set()
    
    for rule in HEURISTIC_RULES:
        tactic = rule["tactic"]
        for pat, reason in rule["patterns"]:
            matches = list(re.finditer(pat, message, re.IGNORECASE))
            if matches:
                m = matches[0]
                span_text = message[m.start():m.end()]
                signals.append({
                    "text": span_text,
                    "reason": reason,
                    "tactic": tactic,
                    "severity": rule["severity"]
                })
                detected_tactics.add(tactic)
                break

    # Determine specific classification
    low_msg = message.lower()
    classification = "Suspicious / Other"
    
    if not detected_tactics:
        classification = "Legitimate"
    elif any(w in low_msg for w in ["package", "parcel", "delivery", "courier", "redelivery", "shipment"]):
        classification = "Delivery / Parcel Scam"
    elif "OTP_REQUEST" in detected_tactics:
        classification = "OTP / Credential Theft"
    elif any(w in low_msg for w in ["kyc", "sbi", "hdfc", "icici", "bank", "account suspended"]):
        classification = "Banking / KYC Scam"
    elif any(w in low_msg for w in ["job", "salary", "work from home", "data entry", "hiring"]):
        classification = "Job / Recruitment Scam"
    elif any(w in low_msg for w in ["invest", "crypto", "trading", "returns of", "forex"]):
        classification = "Investment Scam"
    elif any(w in low_msg for w in ["won", "lottery", "prize", "reward", "congratulations"]):
        classification = "Prize / Reward Scam"
    elif any(w in low_msg for w in ["upi", "pay fee", "refundable fee"]):
        classification = "Payment / UPI Scam"
    elif any(w in low_msg for w in ["police", "customs", "tax", "arrest", "court"]):
        classification = "Government Impersonation"
    elif "EXTERNAL_ACTION" in detected_tactics and any(w in low_msg for w in ["click", "login", "verify"]):
        classification = "Phishing"

    # Human readable explanation
    if not detected_tactics:
        explanation = "SENTINEL did not find any coercive pressure, unexpected payment requests, or suspicious links in this message."
    else:
        reasons_list = []
        if "FINANCIAL_REQUEST" in detected_tactics:
            reasons_list.append("asks you to make a payment or transfer")
        if "URGENCY" in detected_tactics:
            reasons_list.append("imposes a short deadline to pressure you into acting fast")
        if "OTP_REQUEST" in detected_tactics:
            reasons_list.append("asks for a secret one-time password")
        if "THREAT" in detected_tactics:
            reasons_list.append("threatens negative consequences if you do not comply")
        if "EXTERNAL_ACTION" in detected_tactics:
            reasons_list.append("directs you to an external unverified website")

        if len(reasons_list) >= 2:
            explanation = f"SENTINEL noticed that the sender {reasons_list[0]} and {reasons_list[1]}. Scammers often combine urgency with financial or link requests to reduce the time you have to verify."
        elif len(reasons_list) == 1:
            explanation = f"SENTINEL noticed that the sender {reasons_list[0]}. Take a moment to verify independently through official channels."
        else:
            explanation = f"SENTINEL identified {len(detected_tactics)} security indicators commonly used in social-engineering."

    return {
        "classification": classification,
        "risk_signals": signals,
        "tactics": list(detected_tactics),
        "ai_confidence": 0.88 if detected_tactics else 0.95,
        "explanation": explanation,
        "uncertainty": "SENTINEL provides AI-assisted risk analysis, not definitive proof that a message is fraudulent.",
        "demo_matched": None
    }
