import React from 'react';
import { ArrowDown, Shield, Check, Eye, Lock } from 'lucide-react';

interface HeroSectionProps {
  onCheckClick: () => void;
  onHowItWorksClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onCheckClick,
}) => {
  return (
    <section className="pt-4 sm:pt-6 pb-6 select-none max-w-3xl mx-auto text-center">
      {/* Editorial Headline */}
      <h1 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#20231F] tracking-tight leading-[1.12] mb-3">
        Before you trust it, scan it.
      </h1>

      {/* Supporting Line */}
      <p className="text-base sm:text-lg text-[#536B4F] font-medium font-['Manrope'] mb-3">
        Know what's hiding behind the message.
      </p>

      {/* Subtle Microcopy Trust Philosophy */}
      <p className="text-xs sm:text-sm text-[#62665D] font-normal leading-relaxed max-w-md mx-auto mb-6">
        Protection shouldn't start with a password. Open Sentinel, paste the message, and know what to do.
      </p>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <button
          id="btn-hero-check"
          type="button"
          onClick={onCheckClick}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#536B4F] hover:bg-[#435840] text-[#FFFFFF] font-semibold text-xs transition-all duration-150 active:scale-[0.98] shadow-sm cursor-pointer"
        >
          <span>Scan a Message</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#62665D]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F8061]" />
          <span>No sign-in required • Free to use</span>
        </div>
      </div>

      {/* 3 Quiet Protective Pillars (Minimal, Refined row) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D8D3BC] shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#536B4F]" />
            <h3 className="text-xs font-semibold text-[#20231F] font-['Manrope']">
              Detect Pressure
            </h3>
          </div>
          <p className="text-[11px] text-[#62665D] leading-relaxed">
            Identifies urgent countdowns, fake authority claims, and emotional manipulation.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D8D3BC] shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#536B4F]" />
            <h3 className="text-xs font-semibold text-[#20231F] font-['Manrope']">
              Verified Evidence
            </h3>
          </div>
          <p className="text-[11px] text-[#62665D] leading-relaxed">
            Quotes exact phrases from the original text. Never invents fabricated claims.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D8D3BC] shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#536B4F]" />
            <h3 className="text-xs font-semibold text-[#20231F] font-['Manrope']">
              Immediate Clarity
            </h3>
          </div>
          <p className="text-[11px] text-[#62665D] leading-relaxed">
            Provides concise safety actions and instant shareable alerts for loved ones.
          </p>
        </div>
      </div>
    </section>
  );
};
