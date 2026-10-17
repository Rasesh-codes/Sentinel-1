"""
ScamShield AI - Comprehensive Automated Test Suite
Covers all 18 test cases specified in the Hackathon Requirements:
1. Empty message
2. Legitimate message
3. KYC scam
4. OTP scam
5. Fake job scam
6. Investment scam
7. Threat detection
8. Safe URL detection
9. Hindi language support
10. Hinglish language support
11. Malformed AI response handling
12. Fabricated evidence rejection (CRITICAL)
13. Duplicate tactics deduplication (CRITICAL)
14. Gemini failure / local fallback
15. Deterministic score calculation
16. Risk level boundaries
17. Recommendation engine
18. Warning-card data generation
"""
import unittest
import sys
import os

# Ensure parent directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from python_engine.pipeline import run_pipeline
from python_engine.evidence_validator import validate_evidence, validate_single_evidence
from python_engine.risk_engine import calculate_deterministic_risk, calculate_risk_level
from python_engine.url_detector import detect_urls
from python_engine.recommendation_engine import generate_recommendations

class TestScamShieldAI(unittest.TestCase):

    # 1. Empty message
    def test_01_empty_message(self):
        with self.assertRaises(ValueError):
            run_pipeline("")
        with self.assertRaises(ValueError):
            run_pipeline("   \n\t  ")

    # 2. Legitimate message
    def test_02_legitimate_message(self):
        msg = "Your Amazon order #482731 has been shipped and is expected to arrive tomorrow. You can track your delivery through the Amazon app. Thank you for shopping with Amazon."
        res = run_pipeline(msg)
        self.assertEqual(res["risk_level"], "LOW")
        self.assertLessEqual(res["risk_score"], 29)
        self.assertIn("Amazon", res["original_message"])

    # 3. KYC scam
    def test_03_kyc_scam(self):
        msg = "URGENT: Your SBI account will be permanently suspended today due to incomplete KYC. To avoid account closure, verify your KYC immediately by clicking https://sbi-kyc-verify.example.com and entering the OTP sent to your mobile. Failure to complete verification within 30 minutes may result in legal action."
        res = run_pipeline(msg)
        self.assertIn(res["risk_level"], ("HIGH", "CRITICAL"))
        self.assertGreaterEqual(res["risk_score"], 60)
        self.assertTrue(any(t in res["detected_tactics"] for t in ("THREAT", "OTP_REQUEST", "URGENCY")))

    # 4. OTP scam
    def test_04_otp_scam(self):
        msg = "Please share the OTP sent to your mobile to verify your card."
        res = run_pipeline(msg)
        self.assertIn("OTP_REQUEST", res["detected_tactics"])
        self.assertGreaterEqual(res["risk_score"], 25)

    # 5. Fake job scam
    def test_05_fake_job_scam(self):
        msg = "Congratulations! Your profile has been selected for a Work From Home Data Entry job paying ₹45,000 per month. To confirm your position today, pay a refundable registration fee of ₹1,499 through UPI to secure your slot. Only 5 positions are remaining."
        res = run_pipeline(msg)
        self.assertIn(res["risk_level"], ("HIGH", "MEDIUM"))
        self.assertTrue(any(t in res["detected_tactics"] for t in ("FINANCIAL_REQUEST", "UNREALISTIC_REWARD", "URGENCY")))

    # 6. Investment scam
    def test_06_investment_scam(self):
        msg = "Exclusive investment opportunity! Invest ₹10,000 today and receive guaranteed returns of ₹50,000 within 7 days. This offer is available only until midnight. Send your payment immediately to reserve your position."
        res = run_pipeline(msg)
        self.assertIn(res["risk_level"], ("HIGH", "MEDIUM"))
        self.assertTrue(any(t in res["detected_tactics"] for t in ("UNREALISTIC_REWARD", "FINANCIAL_REQUEST", "URGENCY")))

    # 7. Threat detection
    def test_07_threat_detection(self):
        msg = "Your electricity power connection will be permanently disconnected tonight at 9:30 PM due to pending bill payment. Call 9876543210 immediately."
        res = run_pipeline(msg)
        self.assertTrue(any(t in res["detected_tactics"] for t in ("THREAT", "URGENCY")))

    # 8. Safe URL detection
    def test_08_safe_url_detection(self):
        msg = "Click https://bit.ly/secure-login or visit http://fake-bank-login.xyz to update."
        urls = detect_urls(msg)
        self.assertGreaterEqual(len(urls), 2)
        bitly = next((u for u in urls if "bit.ly" in u.domain), None)
        self.assertIsNotNone(bitly)
        self.assertTrue(bitly.is_shortened)
        self.assertEqual(bitly.safety_note, "External link detected. Verify the destination independently.")

    # 9. Hindi language support
    def test_09_hindi_language(self):
        msg = "URGENT: Your SBI account will be permanently suspended today due to incomplete KYC. Verify OTP immediately."
        res = run_pipeline(msg, language="hi")
        # Original message must remain unchanged
        self.assertEqual(res["original_message"], msg)
        # Recommendations must be in Hindi
        self.assertTrue(any("ओटीपी" in r or "साझा" in r or "धमकी" in r for r in res["recommended_actions"]))

    # 10. Hinglish language support
    def test_10_hinglish_language(self):
        msg = "URGENT: Your SBI account will be permanently suspended today due to incomplete KYC. Verify OTP immediately."
        res = run_pipeline(msg, language="hinglish")
        self.assertEqual(res["original_message"], msg)
        self.assertTrue(any("share na karein" in r or "parivaar" in r or "action" in r for r in res["recommended_actions"]))

    # 11. Malformed AI response handling
    def test_11_malformed_ai_response(self):
        msg = "Your account will be suspended today. Click http://bank.com"
        # Simulated broken AI output with missing fields or corrupt types
        malformed_ai = {
            "classification": None,
            "risk_signals": "Not a list",
            "tactics": 12345
        }
        # Pipeline must handle gracefully without crashing
        res = run_pipeline(msg, simulated_ai_output=malformed_ai)
        self.assertIn("risk_score", res)
        self.assertIn("risk_level", res)
        self.assertIsInstance(res["score_breakdown"], list)

    # 12. CRITICAL TEST: Fabricated evidence rejection
    def test_12_fabricated_evidence_rejection(self):
        original = "Your account will be suspended today."
        # AI returns fabricated span that does not exist in the original text!
        signals = [
            {
                "text": "Your account will be permanently deleted.",
                "reason": "Threatens permanent deletion",
                "tactic": "THREAT",
                "severity": "HIGH"
            }
        ]
        validation_results = validate_evidence(original, signals)
        self.assertEqual(len(validation_results), 1)
        self.assertFalse(validation_results[0]["validated"], "Fabricated text MUST be rejected!")
        self.assertIn("Fabricated evidence", validation_results[0]["rejection_reason"])

        # Test valid evidence against same original
        valid_signal = [
            {
                "text": "suspended today",
                "reason": "Threatens account suspension",
                "tactic": "THREAT",
                "severity": "HIGH"
            }
        ]
        valid_results = validate_evidence(original, valid_signal)
        self.assertTrue(valid_results[0]["validated"], "Genuine substring MUST be accepted!")

    # 13. CRITICAL TEST: Duplicate tactics deduplication
    def test_13_duplicate_tactics_deduplication(self):
        # AI returns URGENCY 3 times
        tactics = ["URGENCY", "URGENCY", "URGENCY"]
        score, risk_level, breakdown = calculate_deterministic_risk(tactics)
        # URGENCY has weight 10. Must only contribute +10 once!
        self.assertEqual(score, 10, "Duplicate URGENCY tactics must only contribute +10 once!")
        urgency_item = next((b for b in breakdown if b["tactic"] == "URGENCY"), None)
        self.assertIsNotNone(urgency_item)
        self.assertEqual(urgency_item["points_contributed"], 10)
        self.assertEqual(urgency_item["occurrences"], 3)

    # 14. Gemini failure simulation / local fallback
    def test_14_gemini_failure_fallback(self):
        msg = "Exclusive investment opportunity! Invest ₹10,000 today and receive guaranteed returns of ₹50,000 within 7 days."
        res = run_pipeline(msg, force_source="local_fallback")
        self.assertEqual(res["analysis_source"], "local_fallback")
        self.assertGreater(res["risk_score"], 0)
        self.assertIn(res["risk_level"], ("MEDIUM", "HIGH"))

    # 15. Deterministic score calculation and clamping
    def test_15_deterministic_score_clamping(self):
        # All possible tactics together:
        # OTP(25) + FINANCIAL(20) + THREAT(15) + URGENCY(10) + EXTERNAL(10) + AUTHORITY(10) + REWARD(10) + SECRECY(10) + IDENTITY(10) = 120
        all_tactics = [
            "OTP_REQUEST", "FINANCIAL_REQUEST", "THREAT", "URGENCY",
            "EXTERNAL_ACTION", "AUTHORITY_IMPERSONATION", "UNREALISTIC_REWARD",
            "SECRECY_PRESSURE", "IDENTITY_PRESSURE"
        ]
        score, level, breakdown = calculate_deterministic_risk(all_tactics)
        self.assertEqual(score, 100, "Score exceeding 100 must be clamped to 100")
        self.assertEqual(level, "CRITICAL")
        self.assertEqual(len(breakdown), 9)

    # 16. Risk level boundaries
    def test_16_risk_level_boundaries(self):
        self.assertEqual(calculate_risk_level(0), "LOW")
        self.assertEqual(calculate_risk_level(29), "LOW")
        self.assertEqual(calculate_risk_level(30), "MEDIUM")
        self.assertEqual(calculate_risk_level(59), "MEDIUM")
        self.assertEqual(calculate_risk_level(60), "HIGH")
        self.assertEqual(calculate_risk_level(79), "HIGH")
        self.assertEqual(calculate_risk_level(80), "CRITICAL")
        self.assertEqual(calculate_risk_level(100), "CRITICAL")

    # 17. Recommendation engine
    def test_17_recommendation_engine(self):
        recs = generate_recommendations(["OTP_REQUEST", "THREAT"], "HIGH", "en")
        self.assertTrue(any("Never share an OTP" in r for r in recs))
        self.assertTrue(any("threatens account suspension" in r for r in recs))
        self.assertTrue(any("family member" in r for r in recs))

    # 18. Warning-card data generation
    def test_18_warning_card_data(self):
        msg = "URGENT: Your SBI account will be permanently suspended today. Click https://sbi-kyc.com and verify OTP."
        res = run_pipeline(msg)
        card_data = {
            "title": "SCAMSHIELD ALERT",
            "category": res["classification"],
            "risk_label": f"{res['risk_level']} — {res['risk_score']}/100",
            "suspicious_reasons": [b["label"] for b in res["score_breakdown"]],
            "actions": res["recommended_actions"][:3],
            "footer": "AI analysis is not absolute proof of fraud. Verify independently."
        }
        self.assertEqual(card_data["title"], "SCAMSHIELD ALERT")
        self.assertIn("/100", card_data["risk_label"])
        self.assertGreater(len(card_data["suspicious_reasons"]), 0)
        self.assertGreater(len(card_data["actions"]), 0)
        self.assertEqual(card_data["footer"], "AI analysis is not absolute proof of fraud. Verify independently.")

if __name__ == "__main__":
    unittest.main()
