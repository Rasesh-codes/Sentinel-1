"""
ScamShield AI - Deterministic Risk Engine
Calculates deterministic risk scores based on validated social-engineering tactics.
Applies deduplication and clamps scores between 0 and 100.
"""
from typing import List, Dict, Any, Tuple
from .models import TACTIC_WEIGHTS

TACTIC_DISPLAY_NAMES = {
    "OTP_REQUEST": "OTP / Credential Request",
    "FINANCIAL_REQUEST": "Direct Payment / Financial Transfer Demand",
    "THREAT": "Account Suspension / Legal Penalty Threat",
    "URGENCY": "Artificial Time Urgency / Deadline",
    "EXTERNAL_ACTION": "External Link / Out-of-channel Action",
    "AUTHORITY_IMPERSONATION": "Authority / Institutional Impersonation",
    "UNREALISTIC_REWARD": "Unrealistic Reward / Guaranteed Returns",
    "SECRECY_PRESSURE": "Secrecy / Concealment Pressure",
    "IDENTITY_PRESSURE": "Identity / Registration Pressure",
}

def calculate_risk_level(score: int) -> str:
    """
    Returns risk level category:
    0–29 = LOW
    30–59 = MEDIUM
    60–79 = HIGH
    80–100 = CRITICAL
    """
    if score >= 80:
        return "CRITICAL"
    elif score >= 60:
        return "HIGH"
    elif score >= 30:
        return "MEDIUM"
    else:
        return "LOW"

def calculate_deterministic_risk(validated_tactics: List[str]) -> Tuple[int, str, List[Dict[str, Any]]]:
    """
    Calculates deterministic risk score, risk level, and itemized breakdown.
    Crucial: Deduplicates tactics so duplicate detections do not multiply points.
    """
    # Count occurrences for transparency
    tactic_counts: Dict[str, int] = {}
    for t in validated_tactics:
        normalized = t.strip().upper()
        if normalized in TACTIC_WEIGHTS:
            tactic_counts[normalized] = tactic_counts.get(normalized, 0) + 1

    total_score = 0
    breakdown: List[Dict[str, Any]] = []

    # Score only unique tactics
    for tactic, weight in TACTIC_WEIGHTS.items():
        if tactic in tactic_counts:
            count = tactic_counts[tactic]
            points = weight  # Each tactic only scores its single weight once
            total_score += points
            breakdown.append({
                "tactic": tactic,
                "label": TACTIC_DISPLAY_NAMES.get(tactic, tactic),
                "weight": weight,
                "occurrences": count,
                "points_contributed": points,
                "rule": f"+{weight} (counted once despite {count} mention{'s' if count > 1 else ''})"
            })

    # Clamp score to 0-100
    clamped_score = max(0, min(100, total_score))
    risk_level = calculate_risk_level(clamped_score)

    return clamped_score, risk_level, breakdown
