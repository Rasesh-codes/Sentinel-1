"""
ScamShield AI - Unified Processing Pipeline
Orchestrates:
1. Input Validation
2. Text Normalization
3. URL Detection
4. Semantic Analysis
5. Pydantic / Schema Validation
6. Evidence Validation against Original Message
7. Tactic Normalization
8. Deterministic Risk Engine
9. Safety Recommendations
10. Final Standardized API Output
"""
import unicodedata
from typing import Dict, Any, Optional, List
from .models import AnalysisResult, VALID_CATEGORIES, normalize_category
from .url_detector import detect_urls
from .evidence_validator import validate_evidence
from .risk_engine import calculate_deterministic_risk
from .recommendation_engine import generate_recommendations
from .local_fallback import analyze_locally, DEMO_BENCHMARKS

MAX_MESSAGE_LENGTH = 4000

def normalize_input_text(text: str) -> str:
    """Safely normalizes input characters and removes control characters."""
    if not text:
        return ""
    # Normalize unicode to NFC for consistent text representation
    norm = unicodedata.normalize("NFC", text)
    # Strip null bytes or risky control chars
    return "".join(ch for ch in norm if ch == "\n" or ch == "\r" or ch == "\t" or unicodedata.category(ch)[0] != "C")

def run_pipeline(message: str, language: str = "en", simulated_ai_output: Optional[Dict[str, Any]] = None, force_source: Optional[str] = None) -> Dict[str, Any]:
    """
    Executes the complete deterministic ScamShield pipeline.
    """
    # 1. Input Validation
    if not message or not message.strip():
        raise ValueError("Message input cannot be empty or whitespace-only.")
        
    if len(message) > MAX_MESSAGE_LENGTH:
        raise ValueError(f"Message exceeds maximum allowed length of {MAX_MESSAGE_LENGTH} characters.")

    # 2. Text Normalization
    clean_msg = normalize_input_text(message)

    # 3. URL Detection (Safe, purely text-based)
    detected_urls = detect_urls(clean_msg)
    url_data = [
        {
            "raw_url": u.raw_url,
            "domain": u.domain,
            "is_https": u.is_https,
            "is_shortened": u.is_shortened,
            "safety_note": u.safety_note
        }
        for u in detected_urls
    ]

    # 4. Semantic Extraction
    demo_mode = False
    source = force_source or "local_fallback"
    
    if simulated_ai_output:
        raw_ai = simulated_ai_output
        source = force_source or "gemini"
    else:
        raw_ai = analyze_locally(clean_msg)
        if raw_ai.get("demo_matched"):
            demo_mode = True
            source = force_source or "demo"
        else:
            source = force_source or "local_fallback"

    # 5. Evidence Validation (Core Feature - validates spans against original message)
    raw_signals = raw_ai.get("risk_signals", [])
    all_evidence = validate_evidence(clean_msg, raw_signals)
    
    # Only validated evidence can influence the risk engine or appear as actionable
    validated_evidence = [e for e in all_evidence if e.get("validated")]
    rejected_evidence = [e for e in all_evidence if not e.get("validated")]

    # 6. Tactic Normalization: Extract tactics ONLY from validated evidence
    validated_tactics: List[str] = []
    for ev in validated_evidence:
        tac = ev.get("tactic", "").upper().strip()
        if tac:
            validated_tactics.append(tac)

    # If external link was detected in URL detector, ensure EXTERNAL_ACTION is considered if link is present
    if detected_urls and not any(t == "EXTERNAL_ACTION" for t in validated_tactics):
        # Only add if the message contains explicit urgency or actions
        if any(t in ("THREAT", "URGENCY", "OTP_REQUEST", "FINANCIAL_REQUEST") for t in validated_tactics):
            validated_tactics.append("EXTERNAL_ACTION")

    # 7. Deterministic Risk Engine (Calculated in Python, NEVER by the AI)
    risk_score, risk_level, score_breakdown = calculate_deterministic_risk(validated_tactics)

    # Classification normalization using supported categories
    raw_cat = raw_ai.get("classification", "")
    classification = normalize_category(raw_cat)
    if risk_score == 0 and not validated_evidence:
        classification = "Legitimate"

    # 8. Safety Recommendations
    recommendations = generate_recommendations(validated_tactics, risk_level, language)

    # 9. Explanation & Uncertainty
    explanation = raw_ai.get("explanation", "SENTINEL analyzed the message structure and social-engineering tactics.")
    uncertainty = raw_ai.get(
        "uncertainty",
        "SENTINEL provides AI-assisted risk analysis, not definitive proof that a message is fraudulent."
    )

    # Confidence formatting
    ai_confidence = float(raw_ai.get("ai_confidence", 0.85))

    return {
        "classification": classification,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "ai_confidence": round(ai_confidence, 2),
        "validated_evidence": validated_evidence,
        "rejected_evidence": rejected_evidence,
        "detected_tactics": list(dict.fromkeys(validated_tactics)),  # deduplicated order-preserving list
        "score_breakdown": score_breakdown,
        "explanation": explanation,
        "recommended_actions": recommendations,
        "detected_urls": url_data,
        "uncertainty": uncertainty,
        "analysis_source": source,
        "demo_mode": demo_mode,
        "original_message": clean_msg,
        "language": language
    }
