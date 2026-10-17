"""
ScamShield AI - Safe URL Detector
Extracts and inspects URLs purely as text without network fetching.
"""
import re
from typing import List
from urllib.parse import urlparse
from .models import DetectedUrl

KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly",
    "cutt.ly", "rb.gy", "shorturl.at", "tiny.cc", "goo.gl", "rebrand.ly"
}

# Regex to detect URLs or web links in text safely
URL_PATTERN = re.compile(
    r'(?:https?:\/\/|www\.)[^\s<>"\']+|[a-zA-Z0-9][-a-zA-Z0-9]{1,62}\.(?:com|org|net|in|co|xyz|info|biz|top|live|online|club|site|app|cc|link|tk|ml|ga|cf|gq)(?:\/[^\s<>"\']*)?',
    re.IGNORECASE
)

def detect_urls(message: str) -> List[DetectedUrl]:
    """
    Detects URLs in text. Never fetches or opens them.
    Returns domain, HTTPS status, and shortening detection.
    """
    results: List[DetectedUrl] = []
    seen = set()
    
    for match in URL_PATTERN.finditer(message):
        raw = match.group(0).strip(".,!?;:()[]'\"")
        if not raw or raw.lower() in seen:
            continue
        seen.add(raw.lower())
        
        # Prepare for urlparse
        parse_target = raw
        if not parse_target.startswith(("http://", "https://")):
            parse_target = "http://" + parse_target
            
        try:
            parsed = urlparse(parse_target)
            domain = parsed.netloc or parsed.path.split("/")[0]
            domain = domain.lower()
            if domain.startswith("www."):
                domain = domain[4:]
        except Exception:
            domain = raw.split("/")[0].lower()
            
        is_https = raw.lower().startswith("https://")
        is_shortened = domain in KNOWN_SHORTENERS or any(domain.endswith("." + s) for s in KNOWN_SHORTENERS)
        
        results.append(DetectedUrl(
            raw_url=raw,
            domain=domain,
            is_https=is_https,
            is_shortened=is_shortened,
            safety_note="External link detected. Verify the destination independently."
        ))
        
    return results
