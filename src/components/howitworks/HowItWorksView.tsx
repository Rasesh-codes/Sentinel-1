import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Shield,
  FileText,
  Sparkles,
  Filter,
  CheckCircle2,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

interface HowItWorksViewProps {
  onCheckClick: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onCheckClick }) => {
  const pipelineSteps = [
    {
      step: '01',
      title: 'MESSAGE',
      desc: 'Raw message intake (SMS, WhatsApp forward, bank alert, email, job offer).',
      icon: FileText,
    },
    {
      step: '02',
      title: 'AI UNDERSTANDING',
      desc: 'Multilingual semantic parsing detects subtle deceptive intentions and tactics.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'EVIDENCE EXTRACTION',
      desc: 'Extracts verbatim quotes responsible for triggers like urgency or financial demand.',
      icon: Filter,
    },
    {
      step: '04',
      title: 'EVIDENCE VALIDATION',
      desc: 'Strict substring grounding rejects any hallucinated or fabricated claims.',
      icon: CheckCircle2,
    },
    {
      step: '05',
      title: 'DETERMINISTIC RISK ENGINE',
      desc: 'Authoritative rules evaluate verified evidence. Deduplication prevents fake score stacking.',
      icon: Cpu,
    },
    {
      step: '06',
      title: 'ACTIONABLE RESULT',
      desc: 'Calculates the 0–100 score, clear verdict, practical actions, and family warning cards.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-16 select-none animate-in fade-in duration-150">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#536B4F] font-semibold">
          SYSTEM ARCHITECTURE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20231F] font-['Manrope'] tracking-tight">
          How SENTINEL Works
        </h1>
        <p className="text-xs sm:text-sm text-[#62665D] leading-relaxed">
          SENTINEL is not a simple chatbot. It is a verifiable security pipeline pairing semantic AI with a deterministic software engine.
        </p>
      </div>

      {/* Core Principle Callout */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D8D3BC] text-center max-w-xl mx-auto space-y-2 shadow-sm">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8C9287] font-semibold">
          CORE PRINCIPLE
        </div>
        <div className="text-base sm:text-lg font-bold text-[#20231F] font-['Manrope']">
          "AI identifies evidence.
          <br />
          Software evaluates the evidence."
        </div>
        <p className="text-xs text-[#62665D]">
          This prevents hallucinated risks while ensuring mathematical consistency across millions of checks.
        </p>
      </div>

      {/* Vertical Step Pipeline */}
      <div className="max-w-md mx-auto space-y-3">
        {pipelineSteps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={s.step}>
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D8D3BC] flex items-start gap-4 shadow-2xs">
                <div className="p-2 rounded-lg bg-[#FAF8EF] border border-[#D8D3BC] text-[#536B4F] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#536B4F]">
                      {s.step}
                    </span>
                    <h3 className="text-xs font-bold text-[#20231F] font-mono tracking-wide">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#62665D] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>

              {idx < pipelineSteps.length - 1 && (
                <div className="flex justify-center py-0.5 text-[#D8D3BC]">
                  <ArrowDown className="w-4 h-4 text-[#8C9287]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Deterministic Scoring Thresholds */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D8D3BC] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#20231F] font-semibold">
            DETERMINISTIC THRESHOLDS
          </h3>
          <span className="text-[10px] font-mono text-[#8C9287]">Authoritative rulebook</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAF8EF] border border-[#536B4F]/30">
            <span className="text-[10px] font-mono text-[#536B4F] font-bold block">
              0 – 29 • LOW
            </span>
            <span className="text-[#20231F] font-medium block mt-1">Benign communication</span>
            <span className="text-[11px] text-[#62665D]">No suspicious tactics verified.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8EF] border border-[#B68A3E]/30">
            <span className="text-[10px] font-mono text-[#B68A3E] font-bold block">
              30 – 59 • CAUTION
            </span>
            <span className="text-[#20231F] font-medium block mt-1">Needs verification</span>
            <span className="text-[11px] text-[#62665D]">Unverified links or pressure tactics.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8EF] border border-[#B65353]/30">
            <span className="text-[10px] font-mono text-[#B65353] font-bold block">
              60 – 79 • HIGH
            </span>
            <span className="text-[#20231F] font-medium block mt-1">Deceptive attempt</span>
            <span className="text-[11px] text-[#62665D]">Direct fee or account demands.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8EF] border border-[#A83F47]/30">
            <span className="text-[10px] font-mono text-[#A83F47] font-bold block">
              80 – 100 • CRITICAL
            </span>
            <span className="text-[#20231F] font-medium block mt-1">Dangerous threat</span>
            <span className="text-[11px] text-[#62665D]">Urgent OTP harvest or impersonation.</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#D8D3BC] flex items-center justify-between">
          <span className="text-xs text-[#62665D]">
            Ready to test a message against the pipeline?
          </span>
          <button
            type="button"
            onClick={onCheckClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#536B4F] hover:bg-[#435840] text-[#FFFFFF] font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <span>Scan a message</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
