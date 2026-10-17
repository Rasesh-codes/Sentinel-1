import React from 'react';
import { Check, Sparkles, Filter, CheckCircle2, ShieldCheck } from 'lucide-react';

interface VerificationPipelineProps {
  completed?: boolean;
}

export const VerificationPipeline: React.FC<VerificationPipelineProps> = ({
  completed = true,
}) => {
  const steps = [
    { label: 'ANALYZED', icon: Sparkles, detail: 'Semantic Scan' },
    { label: 'EVIDENCE EXTRACTED', icon: Filter, detail: 'Verbatim Spans' },
    { label: 'EVIDENCE VERIFIED', icon: CheckCircle2, detail: 'Original Match' },
    { label: 'RISK EVALUATED', icon: ShieldCheck, detail: 'Deterministic Engine' },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#D8D3BC] rounded-2xl p-4 select-none mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          return (
            <React.Fragment key={step.label}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#FAF8EF] border border-[#536B4F]/40 text-[#4F8061] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="hidden lg:block min-w-0">
                  <div className="text-[10px] font-mono font-bold tracking-wider text-[#20231F]">
                    {step.label}
                  </div>
                  <div className="text-[9px] text-[#62665D] font-mono truncate">
                    {step.detail}
                  </div>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex-1 h-px bg-[#D8D3BC] mx-1 sm:mx-2 min-w-[8px]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
