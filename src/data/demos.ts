import { DemoBenchmark } from '../types';

export const DEMO_BENCHMARKS: DemoBenchmark[] = [
  {
    id: 'delivery_scam',
    title: 'Delivery Scam',
    category: 'Delivery / Parcel Scam',
    sample:
      'Your package could not be delivered due to an unpaid redelivery fee of ₹49. To prevent your parcel from being returned to the sender, please pay the fee within 2 hours at https://postal-track-service.com.',
    expected_tactics: ['FINANCIAL_REQUEST', 'URGENCY', 'EXTERNAL_ACTION', 'THREAT'],
    description: 'Fake delivery fee alert using short 2-hour deadline and threat of parcel forfeiture.',
  },
  {
    id: 'kyc_banking',
    title: 'Banking Scam',
    category: 'Banking / KYC Scam',
    sample:
      'URGENT: Your SBI account will be permanently suspended today due to incomplete KYC. To avoid account closure, verify your KYC immediately by clicking https://sbi-kyc-verify.example.com and entering the OTP sent to your mobile. Failure to complete verification within 30 minutes may result in legal action.',
    expected_tactics: ['THREAT', 'URGENCY', 'OTP_REQUEST', 'EXTERNAL_ACTION', 'AUTHORITY_IMPERSONATION'],
    description: 'Account suspension threat demanding urgent link click and OTP code submission.',
  },
  {
    id: 'fake_job',
    title: 'Job Scam',
    category: 'Job / Recruitment Scam',
    sample:
      'Congratulations! Your profile has been selected for a Work From Home Data Entry job paying ₹45,000 per month. To confirm your position today, pay a refundable registration fee of ₹1,499 through UPI to secure your slot. Only 5 positions are remaining.',
    expected_tactics: ['FINANCIAL_REQUEST', 'URGENCY', 'UNREALISTIC_REWARD', 'IDENTITY_PRESSURE'],
    description: 'High salary promise requiring upfront UPI registration payment to reserve a quota slot.',
  },
  {
    id: 'prize_scam',
    title: 'Prize Scam',
    category: 'Prize / Lottery Scam',
    sample:
      'Dear customer, you have won ₹25,00,000 in the National Grand Lucky Draw! To claim your cash prize today, transfer a processing fee of ₹2,500 via UPI and send confirmation to rewards@claim-bonus.net before midnight.',
    expected_tactics: ['UNREALISTIC_REWARD', 'FINANCIAL_REQUEST', 'URGENCY', 'EXTERNAL_ACTION'],
    description: 'Fake lottery winning demanding upfront processing fee before midnight.',
  },
  {
    id: 'legitimate',
    title: 'Legitimate Message',
    category: 'Legitimate',
    sample:
      'Your Amazon order #482731 has been shipped and is expected to arrive tomorrow. You can track your delivery through the Amazon app. Thank you for shopping with Amazon.',
    expected_tactics: [],
    description: 'Benign delivery confirmation with no demands for credentials, money, or external clicks.',
  },
];
