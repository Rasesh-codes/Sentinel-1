"""
ScamShield AI - Evidence Validation Engine
Validates that every AI-reported evidence span genuinely exists in the original message.
Rejects fabricated or hallucinated text spans.
"""
import re
import unicodedata
from typing import List, Dict, Any, Tuple, Optional

def normalize_text(text: str) -> str:
    """
    Normalizes unicode characters, curly quotes, dashes, and whitespace.
    """
    if not text:
        return ""
    # NFKD normalization
    s = unicodedata.normalize("NFKD", text)
    # Normalize quotation marks
    s = s.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
    s = s.replace("«", '"').replace("»", '"').replace("`", "'")
    # Normalize dashes and hyphens
    s = s.replace("—", "-").replace("–", "-")
    return s

def find_normalized_span(original: str, query: str) -> Optional[Tuple[int, int]]:
    """
    Attempts to locate query within original message:
    1. Exact case-sensitive match
    2. Exact case-insensitive match
    3. Whitespace & punctuation-relaxed match
    Returns (start, end) character offsets in the ORIGINAL string, or None if not found.
    """
    if not original or not query:
        return None
        
    # 1. Exact match
    pos = original.find(query)
    if pos != -1:
        return (pos, pos + len(query))
        
    # 2. Case-insensitive exact match
    pos = original.lower().find(query.lower())
    if pos != -1:
        return (pos, pos + len(query))
        
    # 3. Normalized matching (handles curly quotes, whitespace differences)
    norm_orig = normalize_text(original)
    norm_query = normalize_text(query).strip()
    
    pos = norm_orig.lower().find(norm_query.lower())
    if pos != -1 and len(norm_orig) == len(original):
        return (pos, pos + len(norm_query))
        
    # 4. Whitespace collapsed regex search
    # Escape query words and allow flexible whitespace between tokens
    tokens = [re.escape(t) for t in norm_query.split() if t]
    if not tokens:
        return None
    pattern_str = r'\s+'.join(tokens)
    try:
        match = re.search(pattern_str, original, re.IGNORECASE)
        if match:
            return (match.start(), match.end())
    except re.error:
        pass
        
    return None

def validate_single_evidence(original_message: str, signal: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validates a single risk signal.
    Returns the signal dictionary with 'validated' boolean and location if found.
    Fabricated or non-existent evidence is marked validated=False.
    """
    candidate_text = str(signal.get("text", "")).strip()
    reason = str(signal.get("reason", "")).strip()
    tactic = str(signal.get("tactic", "UNKNOWN")).strip().upper()
    severity = str(signal.get("severity", "MEDIUM")).strip().upper()
    
    if not candidate_text:
        return {
            "text": "",
            "reason": reason,
            "tactic": tactic,
            "severity": severity,
            "validated": False,
            "rejection_reason": "Empty text span provided."
        }
        
    span = find_normalized_span(original_message, candidate_text)
    if span is not None:
        start, end = span
        # Extract the exact substring from the original message to preserve original casing & characters
        exact_text = original_message[start:end]
        return {
            "text": exact_text,
            "reason": reason,
            "tactic": tactic,
            "severity": severity,
            "validated": True,
            "start_index": start,
            "end_index": end
        }
    else:
        # Rejected! The evidence does not exist in the original text.
        return {
            "text": candidate_text,
            "reason": reason,
            "tactic": tactic,
            "severity": severity,
            "validated": False,
            "rejection_reason": "Fabricated evidence: span does not exist in original user message."
        }

def validate_evidence(original_message: str, signals: Any) -> List[Dict[str, Any]]:
    """
    Validates all signals against the original message.
    Only validated evidence may appear in UI and affect the risk engine.
    Gracefully handles malformed input structures.
    """
    if not isinstance(signals, list):
        return []
    validated_list = []
    for sig in signals:
        if not isinstance(sig, dict):
            continue
        res = validate_single_evidence(original_message, sig)
        validated_list.append(res)
    return validated_list
