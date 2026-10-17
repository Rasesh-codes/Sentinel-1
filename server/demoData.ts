import { DemoBenchmark } from './types.js';

export const DEMO_BENCHMARKS: DemoBenchmark[] = [
  {
    id: 'delivery_scam',
    title: 'Delivery Scam',
    category: 'Delivery / Parcel Scam',
    sample:
      'Your package could not be delivered due to an unpaid redelivery fee of ₹49. To prevent your parcel from being returned to the sender, please pay the fee within 2 hours at https://postal-track-service.com.',
    expected_tactics: ['FINANCIAL_REQUEST', 'URGENCY', 'EXTERNAL_ACTION', 'THREAT'],
    description: 'Fake postal parcel alert demanding immediate fee payment under threat of package return.',
  },
  {
    id: 'kyc_banking',
    title: 'Banking / KYC Scam',
    category: 'Banking / KYC Scam',
    sample:
      'URGENT: Your SBI account will be permanently suspended today due to incomplete KYC. To avoid account closure, verify your KYC immediately by clicking https://sbi-kyc-verify.example.com and entering the OTP sent to your mobile. Failure to complete verification within 30 minutes may result in legal action.',
    expected_tactics: ['THREAT', 'URGENCY', 'OTP_REQUEST', 'EXTERNAL_ACTION', 'AUTHORITY_IMPERSONATION'],
    description: 'High-risk bank impersonation threatening account suspension and demanding OTP entry.',
  },
  {
    id: 'fake_job',
    title: 'Fake Job Scam',
    category: 'Job / Recruitment Scam',
    sample:
      'Congratulations! Your profile has been selected for a Work From Home Data Entry job paying ₹45,000 per month. To confirm your position today, pay a refundable registration fee of ₹1,499 through UPI to secure your slot. Only 5 positions are remaining.',
    expected_tactics: ['FINANCIAL_REQUEST', 'URGENCY', 'UNREALISTIC_REWARD', 'IDENTITY_PRESSURE'],
    description: 'High salary promise demanding upfront UPI registration fee to reserve a quota slot.',
  },
  {
    id: 'investment',
    title: 'Investment Scam',
    category: 'Investment Scam',
    sample:
      'Exclusive investment opportunity! Invest ₹10,000 today and receive guaranteed returns of ₹50,000 within 7 days. This offer is available only until midnight. Send your payment immediately to reserve your position.',
    expected_tactics: ['FINANCIAL_REQUEST', 'URGENCY', 'UNREALISTIC_REWARD'],
    description: 'Guaranteed 5x returns in 7 days coupled with artificial midnight deadline pressure.',
  },
  {
    id: 'legitimate',
    title: 'Legitimate Delivery',
    category: 'Legitimate',
    sample:
      'Your Amazon order #482731 has been shipped and is expected to arrive tomorrow. You can track your delivery through the Amazon app. Thank you for shopping with Amazon.',
    expected_tactics: [],
    description: 'Standard benign transactional order update with no threats, payment links, or OTP requests.',
  },
];
