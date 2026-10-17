import { runPipeline } from '../server/pipeline.js';
import { calculateDeterministicRisk, calculateRiskLevel } from '../server/riskEngine.js';
import { validateEvidence } from '../server/evidenceValidator.js';
import { detectUrls } from '../server/urlDetector.js';
import { generateRecommendations } from '../server/recommendationEngine.js';
import { DEMO_BENCHMARKS } from '../server/demoData.js';

async function runTests() {
  console.log('=== Running SENTINEL Full Comprehensive Test Suite ===\n');

  // Test 1: Empty message rejection
  console.log('[Test 1] Testing Empty Message Rejection...');
  try {
    await runPipeline({ message: '' });
    throw new Error('Should have failed on empty string');
  } catch (err: any) {
    if (!err.message.includes('cannot be empty')) throw err;
    console.log('✓ Successfully caught empty string error');
  }
  try {
    await runPipeline({ message: '   \n\t  ' });
    throw new Error('Should have failed on whitespace string');
  } catch (err: any) {
    if (!err.message.includes('cannot be empty')) throw err;
    console.log('✓ Successfully caught whitespace error');
  }

  // Test 2: Legitimate message
  console.log('\n[Test 2] Testing Legitimate Message...');
  const legSample = DEMO_BENCHMARKS.find((d) => d.id === 'legitimate')!.sample;
  const legResult = await runPipeline({
    message: legSample,
    force_source: 'local_fallback',
  });
  if (legResult.risk_level !== 'LOW' || legResult.risk_score > 29) {
    throw new Error(`Legitimate message failed: expected LOW risk, got ${legResult.risk_level} (${legResult.risk_score})`);
  }
  console.log(`✓ Legitimate message correctly identified as ${legResult.risk_level} (${legResult.risk_score}/100)`);

  // Test 3: KYC Banking Scam
  console.log('\n[Test 3] Testing KYC Banking Scam Benchmark...');
  const kycSample = DEMO_BENCHMARKS.find((d) => d.id === 'kyc_banking')!.sample;
  const kycResult = await runPipeline({
    message: kycSample,
    force_source: 'local_fallback',
  });
  if (kycResult.risk_score < 60 || !['HIGH', 'CRITICAL'].includes(kycResult.risk_level)) {
    throw new Error(`KYC scam failed: expected HIGH/CRITICAL, got ${kycResult.risk_level} (${kycResult.risk_score})`);
  }
  console.log(`✓ KYC scam correctly identified as ${kycResult.risk_level} (${kycResult.risk_score}/100)`);

  // Test 4: OTP Scam
  console.log('\n[Test 4] Testing OTP Scam...');
  const otpMsg = 'Dear customer, please share the OTP sent to your mobile to verify your transaction.';
  const otpResult = await runPipeline({
    message: otpMsg,
    force_source: 'local_fallback',
  });
  if (!otpResult.detected_tactics.includes('OTP_REQUEST')) {
    throw new Error('Expected OTP_REQUEST tactic');
  }
  if (otpResult.risk_score < 25) {
    throw new Error(`Expected score >= 25 for OTP request, got ${otpResult.risk_score}`);
  }
  console.log(`✓ OTP scam identified: score ${otpResult.risk_score}/100, tactics: ${otpResult.detected_tactics.join(', ')}`);

  // Test 5: Fake Job Scam
  console.log('\n[Test 5] Testing Fake Job Scam...');
  const jobSample = DEMO_BENCHMARKS.find((d) => d.id === 'fake_job')!.sample;
  const jobResult = await runPipeline({
    message: jobSample,
    force_source: 'local_fallback',
  });
  if (jobResult.classification !== 'Job / Recruitment Scam') {
    throw new Error(`Expected Job scam classification, got ${jobResult.classification}`);
  }
  console.log(`✓ Fake job scam correctly classified (${jobResult.classification}, score: ${jobResult.risk_score}/100)`);

  // Test 6: Investment Scam
  console.log('\n[Test 6] Testing Investment Scam...');
  const investSample = DEMO_BENCHMARKS.find((d) => d.id === 'investment')!.sample;
  const investResult = await runPipeline({
    message: investSample,
    force_source: 'local_fallback',
  });
  if (investResult.classification !== 'Investment Scam') {
    throw new Error(`Expected Investment Scam classification, got ${investResult.classification}`);
  }
  console.log(`✓ Investment scam correctly classified (${investResult.classification}, score: ${investResult.risk_score}/100)`);

  // Test 7: Threat Detection
  console.log('\n[Test 7] Testing Threat Detection...');
  const threatMsg = 'Your account will be permanently suspended today unless you act immediately.';
  const threatResult = await runPipeline({
    message: threatMsg,
    force_source: 'local_fallback',
  });
  if (!threatResult.detected_tactics.includes('THREAT')) {
    throw new Error('Expected THREAT tactic to be detected');
  }
  console.log(`✓ Threat detected: score ${threatResult.risk_score}/100`);

  // Test 8: Safe URL Detection
  console.log('\n[Test 8] Testing Safe URL Detection...');
  const urls = detectUrls('Visit bit.ly/test and https://secure-bank.com/login today');
  if (urls.length !== 2) throw new Error(`Expected 2 URLs, found ${urls.length}`);
  const shortUrl = urls.find((u) => u.domain === 'bit.ly');
  if (!shortUrl?.is_shortened) throw new Error('bit.ly should be detected as shortened');
  const httpsUrl = urls.find((u) => u.domain === 'secure-bank.com');
  if (!httpsUrl?.is_https) throw new Error('secure-bank.com should be detected as HTTPS');
  console.log('✓ Safe URL detection verified domain parsing and shortening detection');

  // Test 9: Hindi Language Support
  console.log('\n[Test 9] Testing Hindi Language Recommendations...');
  const hiResult = await runPipeline({
    message: kycSample,
    language: 'hi',
    force_source: 'local_fallback',
  });
  if (!hiResult.recommended_actions.some((r) => /[\u0900-\u097F]/.test(r))) {
    throw new Error('Hindi recommendations should contain Devanagari script');
  }
  console.log('✓ Hindi recommendation generated:', hiResult.recommended_actions[0]);

  // Test 10: Hinglish Language Support
  console.log('\n[Test 10] Testing Hinglish Language Recommendations...');
  const hinglishResult = await runPipeline({
    message: kycSample,
    language: 'hinglish',
    force_source: 'local_fallback',
  });
  if (!hinglishResult.recommended_actions.some((r) => r.includes('karein') || r.includes('na karein') || r.includes('batayein'))) {
    throw new Error('Hinglish recommendations should contain transliterated phrasing');
  }
  console.log('✓ Hinglish recommendation generated:', hinglishResult.recommended_actions[0]);

  // Test 11: Malformed AI Response Handling
  console.log('\n[Test 11] Testing Malformed AI Response Handling...');
  const malformedResult = await runPipeline({
    message: 'Hello world test',
    simulated_ai_output: {
      classification: null as any,
      risk_signals: 'invalid_type' as any,
      tactics: null as any,
      ai_confidence: 'invalid' as any,
      explanation: '',
      uncertainty: '',
    },
  });
  if (malformedResult.risk_level !== 'LOW') {
    throw new Error('Malformed input should fall back safely to LOW risk');
  }
  console.log('✓ Malformed AI output handled gracefully with robust fallback');

  // Test 12: Fabricated Evidence Rejection (CRITICAL)
  console.log('\n[Test 12] Testing Fabricated Evidence Rejection...');
  const fabResult = await runPipeline({
    message: 'Your account will be suspended today.',
    simulated_ai_output: {
      classification: 'Banking/UPI',
      risk_signals: [
        {
          text: 'Your account will be permanently deleted and you will be arrested.',
          reason: 'Hallucinated phrase not in input',
          tactic: 'THREAT',
          severity: 'HIGH',
        },
      ],
      tactics: ['THREAT'],
      ai_confidence: 0.9,
      explanation: 'Test explanation',
      uncertainty: 'Test uncertainty',
    },
  });
  if (fabResult.validated_evidence.length > 0) {
    throw new Error('Fabricated evidence was NOT rejected!');
  }
  if (!fabResult.rejected_evidence || fabResult.rejected_evidence.length === 0) {
    throw new Error('Fabricated evidence should be in rejected_evidence list');
  }
  console.log(`✓ Fabricated evidence successfully caught and rejected (${fabResult.rejected_evidence[0].rejection_reason})`);

  // Test 13: Duplicate Tactics Deduplication (CRITICAL)
  console.log('\n[Test 13] Testing Duplicate Tactics Deduplication...');
  const dupResult = await runPipeline({
    message: 'URGENT: Hurry today, act immediately!',
    simulated_ai_output: {
      classification: 'Phishing',
      risk_signals: [
        { text: 'URGENT:', reason: 'urgency 1', tactic: 'URGENCY', severity: 'MEDIUM' },
        { text: 'Hurry today', reason: 'urgency 2', tactic: 'URGENCY', severity: 'MEDIUM' },
        { text: 'act immediately', reason: 'urgency 3', tactic: 'URGENCY', severity: 'MEDIUM' },
      ],
      tactics: ['URGENCY', 'URGENCY', 'URGENCY'],
      ai_confidence: 0.9,
      explanation: 'Multiple urgent phrases',
      uncertainty: 'Uncertainty note',
    },
  });
  if (dupResult.risk_score !== 10) {
    throw new Error(`Duplicate tactics failed: expected score 10 for single URGENCY weight, got ${dupResult.risk_score}`);
  }
  console.log(`✓ Duplicate tactics deduplicated: 3 URGENCY instances yielded score of ${dupResult.risk_score}/100`);

  // Test 14: Local Fallback when Gemini offline
  console.log('\n[Test 14] Testing Deterministic Local Fallback...');
  const fallbackResult = await runPipeline({
    message: 'Your package is pending delivery. Pay redelivery fee of ₹49 at http://post-track.com now.',
    force_source: 'local_fallback',
  });
  if (fallbackResult.analysis_source !== 'local_fallback' && fallbackResult.analysis_source !== 'demo') {
    throw new Error('Source should be local_fallback or demo');
  }
  console.log(`✓ Local fallback analyzed message successfully (score: ${fallbackResult.risk_score}/100)`);

  // Test 15: Deterministic Score Calculation
  console.log('\n[Test 15] Testing Deterministic Score Calculation...');
  const calc1 = calculateDeterministicRisk(['OTP_REQUEST', 'FINANCIAL_REQUEST']);
  if (calc1.score !== 45) { // 25 + 20 = 45
    throw new Error(`Expected score 45, got ${calc1.score}`);
  }
  console.log(`✓ Deterministic scoring calculated exactly: 25 + 20 = ${calc1.score}/100`);

  // Test 16: Risk Level Boundaries
  console.log('\n[Test 16] Testing Risk Level Boundaries...');
  if (calculateRiskLevel(0) !== 'LOW') throw new Error('0 should be LOW');
  if (calculateRiskLevel(29) !== 'LOW') throw new Error('29 should be LOW');
  if (calculateRiskLevel(30) !== 'MEDIUM') throw new Error('30 should be MEDIUM');
  if (calculateRiskLevel(59) !== 'MEDIUM') throw new Error('59 should be MEDIUM');
  if (calculateRiskLevel(60) !== 'HIGH') throw new Error('60 should be HIGH');
  if (calculateRiskLevel(79) !== 'HIGH') throw new Error('79 should be HIGH');
  if (calculateRiskLevel(80) !== 'CRITICAL') throw new Error('80 should be CRITICAL');
  if (calculateRiskLevel(100) !== 'CRITICAL') throw new Error('100 should be CRITICAL');
  console.log('✓ All risk level boundaries verified: 0-29 LOW, 30-59 MEDIUM, 60-79 HIGH, 80-100 CRITICAL');

  // Test 17: Recommendation Engine
  console.log('\n[Test 17] Testing Recommendation Engine...');
  const recs = generateRecommendations(['OTP_REQUEST'], 'HIGH', 'en');
  if (!recs.some((r) => r.includes('Never share an OTP'))) {
    throw new Error('Expected OTP recommendation');
  }
  if (!recs.some((r) => r.includes('warning a family member'))) {
    throw new Error('Expected family warning for HIGH risk');
  }
  console.log('✓ Recommendation engine generated tailored advice and family alert');

  // Test 18: Complete API Response Structure
  console.log('\n[Test 18] Testing Complete Response Schema...');
  const fullRes = await runPipeline({
    message: kycSample,
    force_source: 'local_fallback',
  });
  const requiredKeys = [
    'classification',
    'risk_score',
    'risk_level',
    'ai_confidence',
    'validated_evidence',
    'detected_tactics',
    'score_breakdown',
    'explanation',
    'recommended_actions',
    'detected_urls',
    'uncertainty',
    'analysis_source',
    'original_message',
  ];
  for (const k of requiredKeys) {
    if (!(k in fullRes)) throw new Error(`Missing key ${k} in response`);
  }
  console.log('✓ Complete standardized response schema validated');

  console.log('\n============================================================');
  console.log('✓ ALL 18 COMPREHENSIVE INTEGRATION TESTS PASSED IN TYPESCRIPT');
  console.log('============================================================\n');
}

runTests().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
