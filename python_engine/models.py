"""
ScamShield AI - Python Core Engine Models
"""
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

TACTIC_WEIGHTS: Dict[str, int] = {
    "OTP_REQUEST": 25,
    "FINANCIAL_REQUEST": 20,
    "THREAT": 15,
    "URGENCY": 10,
    "EXTERNAL_ACTION": 10,
    "AUTHORITY_IMPERSONATION": 10,
    "UNREALISTIC_REWARD": 10,
    "SECRECY_PRESSURE": 10,
    "IDENTITY_PRESSURE": 10,
}

VALID_CATEGORIES = [
    "Delivery / Parcel Scam",
    "Banking / KYC Scam",
    "Phishing",
    "Job / Recruitment Scam",
    "Investment Scam",
    "Payment / UPI Scam",
    "Prize / Reward Scam",
    "Government Impersonation",
    "Account Security Scam",
    "OTP / Credential Theft",
    "Romance / Social Engineering",
    "Tech Support Scam",
    "Loan Scam",
    "Charity Scam",
    "Subscription / Billing Scam",
    "Threat / Extortion",
    "Suspicious / Other",
    "Legitimate",
]

def normalize_category(cat: Optional[str]) -> str:
    """Normalizes any category candidate into one of the supported categories."""
    if not cat or not str(cat).strip():
        return "Suspicious / Other"
    c = str(cat).strip()
    if c in VALID_CATEGORIES:
        return c
    low = c.lower()
    if "deliver" in low or "parcel" in low or "package" in low or "courier" in low or "shipment" in low:
        return "Delivery / Parcel Scam"
    if "bank" in low or "kyc" in low or "sbi" in low or "hdfc" in low or "icici" in low:
        return "Banking / KYC Scam"
    if "job" in low or "recruitment" in low or "work from home" in low or "hiring" in low:
        return "Job / Recruitment Scam"
    if "invest" in low or "crypto" in low or "trading" in low or "forex" in low:
        return "Investment Scam"
    if "payment" in low or "upi" in low or "refund" in low:
        return "Payment / UPI Scam"
    if "prize" in low or "reward" in low or "lottery" in low or "congrat" in low or "won" in low:
        return "Prize / Reward Scam"
    if "govt" in low or "government" in low or "tax" in low or "police" in low or "customs" in low:
        return "Government Impersonation"
    if "otp" in low or "credential" in low:
        return "OTP / Credential Theft"
    if "account" in low or "takeover" in low or "security" in low:
        return "Account Security Scam"
    if "romance" in low or "dating" in low:
        return "Romance / Social Engineering"
    if "tech" in low or "support" in low:
        return "Tech Support Scam"
    if "loan" in low:
        return "Loan Scam"
    if "charity" in low or "donation" in low:
        return "Charity Scam"
    if "bill" in low or "subscription" in low:
        return "Subscription / Billing Scam"
    if "threat" in low or "extort" in low or "blackmail" in low:
        return "Threat / Extortion"
    if "phish" in low:
        return "Phishing"
    if "legit" in low or "safe" in low or "normal" in low or "benign" in low:
        return "Legitimate"
    return "Suspicious / Other"

@dataclass
class RiskSignal:
    text: str
    reason: str
    tactic: str
    severity: str = "MEDIUM"
    validated: bool = False
    start_index: Optional[int] = None
    end_index: Optional[int] = None

@dataclass
class DetectedUrl:
    raw_url: str
    domain: str
    is_https: bool
    is_shortened: bool
    safety_note: str = "External link detected. Verify the destination independently."

@dataclass
class ScoreItem:
    tactic: str
    weight: int
    count: int
    points: int
    description: str

@dataclass
class AnalysisResult:
    classification: str
    risk_score: int
    risk_level: str
    ai_confidence: float
    validated_evidence: List[Dict[str, Any]]
    detected_tactics: List[str]
    score_breakdown: List[Dict[str, Any]]
    explanation: str
    recommended_actions: List[str]
    detected_urls: List[Dict[str, Any]]
    uncertainty: str
    analysis_source: str
    demo_mode: bool
