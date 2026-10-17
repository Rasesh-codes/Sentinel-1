import React, { useState, useEffect } from 'react';
import { SentinelLogo } from '../brand/SentinelLogo';
import { Check } from 'lucide-react';

interface AnalysisLoadingTransitionProps {
  onCancel?: () => void;
}

export const AnalysisLoadingTransition: React.FC<AnalysisLoadingTransitionProps> = () => {
  const steps = [
    'Reading the message...',
    'Checking for pressure tactics...',
    'Looking for hidden patterns...',
    'Verifying the evidence...',
    'Calculating the risk...',
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStepIndex(1), 600);
    const timer2 = setTimeout(() => setActiveStepIndex(2), 1200);
    const timer3 = setTimeout(() => setActiveStepIndex(3), 1800);
    const timer4 = setTimeout(() => setActiveStepIndex(4), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div
      id="analysis-loading-state"
      className="w-full max-w-md mx-auto my-12 p-8 rounded-2xl bg-[#FFFFFF] border border-[#D8D3BC] shadow-sm text-center select-none animate-in fade-in duration-200"
    >
      <div className="flex justify-center mb-5">
        <SentinelLogo size="md" showWordmark={false} animated={true} />
      </div>

      <span className="text-[10px] font-mono uppercase tracking-widest text-[#536B4F] font-semibold block mb-1">
        SECURITY SCANNING
      </span>

      <h3 className="text-base font-bold text-[#20231F] font-['Manrope'] mb-6">
        {steps[activeStepIndex]}
      </h3>

      {/* Sequenced Security Steps */}
      <div className="space-y-2.5 max-w-xs mx-auto text-left mb-6">
        {steps.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;
          const isPending = idx > activeStepIndex;

          return (
            <div
              key={step}
              className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                isPending ? 'opacity-35' : 'opacity-100'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono transition-colors ${
                  isDone
                    ? 'bg-[#536B4F] text-[#FFFFFF]'
                    : isCurrent
                    ? 'border-2 border-[#536B4F] border-t-transparent animate-spin'
                    : 'border border-[#D8D3BC] text-[#8C9287]'
                }`}
              >
                {isDone && <Check className="w-3 h-3 stroke-[2.5]" />}
              </div>

              <span
                className={`font-medium ${
                  isCurrent
                    ? 'text-[#20231F]'
                    : isDone
                    ? 'text-[#62665D]'
                    : 'text-[#8C9287]'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Subtle Progress Bar */}
      <div className="w-full h-1 bg-[#FAF8EF] rounded-full overflow-hidden border border-[#D8D3BC]">
        <div
          className="h-full bg-[#536B4F] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, (activeStepIndex + 1) * 20)}%` }}
        />
      </div>

      <p className="text-[10px] font-mono text-[#8C9287] mt-4">
        Deterministic verification • Spans validated against original text
      </p>
    </div>
  );
};
