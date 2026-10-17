import React from 'react';
import {
  Package,
  Building2,
  Briefcase,
  TrendingUp,
  Gift,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  sampleText: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'delivery',
    title: 'Delivery',
    subtitle: 'Your package needs an urgent payment.',
    icon: Package,
    sampleText:
      'IndiaPost Alert: Your package #IN-88921 could not be delivered due to an unpaid customs redelivery charge of ₹49. To prevent your parcel from being returned to the sender, update your address and pay the fee within 2 hours at https://postal-track-update.com/pay',
  },
  {
    id: 'banking',
    title: 'Banking',
    subtitle: 'Account suspended. Verify KYC immediately.',
    icon: Building2,
    sampleText:
      'Dear SBI Customer, your YONO account has been suspended due to pending PAN/KYC update. Please click https://sbi-kyc-reactivate.info to complete instant verification today to prevent permanent debit freeze.',
  },
  {
    id: 'job',
    title: 'Job Offer',
    subtitle: 'Part-time remote work. Pay initial registration fee.',
    icon: Briefcase,
    sampleText:
      'Hi, Amazon Hiring Team has shortlisted your resume for Part-Time Social Media Task Specialist. Work 1 hour daily and earn ₹3,500 - ₹8,000. Immediate joining! To confirm your seat, transfer ₹499 refundable equipment fee on Telegram @hr_recruit_team within 30 minutes.',
  },
  {
    id: 'investment',
    title: 'Investment',
    subtitle: 'Guaranteed 300% return on VIP crypto group.',
    icon: TrendingUp,
    sampleText:
      'URGENT VIP SIGNAL: Our automated AI arbitrage pool guarantees 300% profit within 24 hours. Invest ₹10,000 today and receive ₹40,000 guaranteed payout. Only 3 slots left before closing. Send funds via USDT to our verified agent now.',
  },
  {
    id: 'prize',
    title: 'Prize',
    subtitle: 'You won a lottery/gift card. Claim within 1 hour.',
    icon: Gift,
    sampleText:
      'Congratulations! Your mobile number was selected in KBC Lucky Draw 2026 for a cash prize of ₹25,00,000! Call KBC manager Rana Pratap on WhatsApp immediately to pay the 1% processing tax and claim your prize before it expires today.',
  },
  {
    id: 'emergency',
    title: 'Something else',
    subtitle: 'Suspicious family emergency asking for money.',
    icon: HelpCircle,
    sampleText:
      'Hey mom, I lost my phone and wallet in an accident and this is my friend’s number. I am stranded at the hospital clinic and need ₹7,500 urgently for emergency medical clearance. Please UPI the doctor right now at clinic-pay@upi, hurry please!',
  },
];

interface ScenarioCardsProps {
  onSelectScenario: (text: string) => void;
}

export const ScenarioCards: React.FC<ScenarioCardsProps> = ({ onSelectScenario }) => {
  return (
    <section className="mt-8 select-none">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#9AA6B2]">
            TRY A SCENARIO
          </h3>
          <p className="text-xs text-[#66727F] mt-0.5">
            Load realistic test cases directly into the scanner.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {SCENARIOS.map((sc) => {
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              id={`scenario-btn-${sc.id}`}
              type="button"
              onClick={() => onSelectScenario(sc.sampleText)}
              className="group p-3.5 rounded-xl bg-[#171D25] hover:bg-[#1D2530] border border-[rgba(255,255,255,0.06)] hover:border-[#7CE38B]/40 transition-all text-left flex items-start justify-between gap-3 cursor-pointer shadow-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-[#11161D] border border-[rgba(255,255,255,0.06)] text-[#7CE38B] group-hover:text-[#F4F7FA] transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#F4F7FA] font-['Manrope']">
                    {sc.title}
                  </div>
                  <div className="text-[11px] text-[#9AA6B2] truncate mt-0.5 font-normal">
                    {sc.subtitle}
                  </div>
                </div>
              </div>

              <ArrowUpRight className="w-3.5 h-3.5 text-[#66727F] group-hover:text-[#7CE38B] transition-colors shrink-0 mt-1" />
            </button>
          );
        })}
      </div>
    </section>
  );
};
