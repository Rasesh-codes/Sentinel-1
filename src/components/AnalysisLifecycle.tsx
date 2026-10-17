import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Shield, Terminal } from 'lucide-react';

const PIPELINE_STEPS = [
  { id: 'read', label: 'Reading message & safe text normalization' },
  { id: 'urls', label: 'Inspecting links & safe URL extraction' },
  { id: 'semantic', label: 'Semantic tactic extraction' },
  { id: 'evidence', label: 'Validating evidence spans against original text' },
  { id: 'risk', label: 'Calculating deterministic risk score (Python Engine)' },
  { id: 'safety', label: 'Generating safe action guidance' },
];

interface AnalysisLifecycleProps {
  isLoading: boolean;
}

export const AnalysisLifecycle: React.FC<AnalysisLifecycleProps> = ({ isLoading }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="w-full my-6 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
          <Terminal className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            EXECUTING SCAMSHIELD SAFETY PIPELINE
          </h3>
          <p className="text-xs text-slate-400">
            AI identifies evidence. Deterministic software evaluates evidence.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl border text-xs transition-all duration-300 ${
                isDone
                  ? 'bg-slate-950/60 border-emerald-500/30 text-slate-200'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/30 border-slate-900 text-slate-500'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px]">
                    {idx + 1}
                  </div>
                )}
              </div>
              <span className={`font-medium ${isCurrent ? 'text-cyan-200 font-semibold' : ''}`}>
                {step.label}
              </span>
              {isCurrent && (
                <span className="ml-auto text-[10px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
                  Processing...
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
