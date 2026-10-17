import React from 'react';
import { Sparkles, FileCheck, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';

interface VerificationPipelineBadgeProps {
  currentStage?: 'AI_ANALYSIS' | 'EVIDENCE_VALIDATION' | 'RISK_ENGINE' | 'SAFETY_ACTIONS' | 'COMPLETE';
}

export const VerificationPipelineBadge: React.FC<VerificationPipelineBadgeProps> = ({
  currentStage = 'COMPLETE',
}) => {
  const steps = [
    {
      id: 'AI_ANALYSIS',
      title: 'AI ANALYSIS',
      subtitle: 'Semantic signals extracted',
      icon: Sparkles,
    },
    {
      id: 'EVIDENCE_VALIDATION',
      title: 'EVIDENCE VALIDATION',
      subtitle: 'Signals matched against message',
      icon: FileCheck,
    },
    {
      id: 'RISK_ENGINE',
      title: 'RISK ENGINE',
      subtitle: 'Deterministic score calculated',
      icon: Sliders,
    },
    {
      id: 'SAFETY_ACTIONS',
      title: 'SAFETY ACTIONS',
      subtitle: 'Recommendations generated',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full bg-[#0F141C] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            VERA Verification Pipeline
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
            Engine Architecture
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
          AI extracts evidence • Software evaluates evidence
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between relative group hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-950/70 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-200 tracking-tight">
                    {step.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">✓</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-snug">
                {step.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
