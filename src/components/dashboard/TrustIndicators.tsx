import React from 'react';
import { Cpu, CheckCircle2, Calculator, ShieldCheck } from 'lucide-react';

export const TrustIndicators: React.FC = () => {
  const pillars = [
    {
      title: 'AI-assisted analysis',
      desc: 'Semantic pattern detection identifies suspect language and social-engineering tactics.',
      icon: Cpu,
    },
    {
      title: 'Evidence verified',
      desc: 'All highlighted excerpts are verbatim validated against the original text.',
      icon: CheckCircle2,
    },
    {
      title: 'Deterministic risk scoring',
      desc: 'Mathematical rules evaluate verified tactics with deduplication to prevent inflated scores.',
      icon: Calculator,
    },
    {
      title: 'Privacy-first design',
      desc: 'Scanned messages are processed in-memory and are never sold or used for public training.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.06)] select-none">
      <div className="text-[10px] font-mono uppercase tracking-wider text-[#66727F] mb-4">
        VERIFICATION ARCHITECTURE
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="p-3.5 rounded-xl bg-[#11161D] border border-[rgba(255,255,255,0.05)] flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#171D25] text-[#7CE38B]">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-medium text-[#F4F7FA] font-['Manrope']">
                  {pillar.title}
                </h4>
              </div>
              <p className="text-[11px] text-[#9AA6B2] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
