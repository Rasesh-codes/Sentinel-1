import React from 'react';
import { ShieldCheck, Cpu, Sliders, CheckCircle2, Lock, FileSearch, ArrowRight } from 'lucide-react';

interface HowItWorksViewProps {
  onGoToScanner: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onGoToScanner }) => {
  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto py-2">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          Core System Architecture
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-mono text-white">
          Understand → Verify → Score → Protect
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          "AI identifies evidence. Software evaluates evidence." VERA separates semantic natural-language extraction from deterministic, auditable risk scoring.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F141C] border border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              01
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">
                Understand: Semantic Signal Extraction
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Gemini AI Engine</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            The incoming message is analyzed by Gemini to recognize natural language tactics: urgency manipulation, consequence threats, payment demands, credential/OTP requests, and authority impersonation.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F141C] border border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              02
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">
                Verify: Verbatim Evidence Validation
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Anti-Hallucination Guard</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Before any extracted signal is accepted, our Python engine normalizes unicode and verifies that the candidate substring exists verbatim within the original user message. Fabricated or hallucinated quotes are discarded immediately.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F141C] border border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              03
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">
                Score: Deterministic Risk Engine
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Auditable Fixed Weights</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Risk scores (0–100) are computed mathematically using fixed rule weights (e.g., OTP_REQUEST = +25, FINANCIAL_REQUEST = +20, THREAT = +15). Signals of the same tactic are deduplicated to prevent score gaming.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F141C] border border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              04
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">
                Protect: Safe Actions & Family Alert
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Zero-Risk Safety Layer</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            VERA never executes or fetches remote URLs. Clear immediate actions guide the user, and the "Warn My Family" alert card allows instant export and sharing to protect vulnerable contacts.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-2xl bg-[#0F141C] border border-slate-800 text-center space-y-3">
        <h4 className="text-base font-bold font-mono text-white">
          Ready to scan a suspicious message?
        </h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Test any SMS, WhatsApp notification, or email to inspect its verified evidence.
        </p>
        <button
          onClick={onGoToScanner}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono transition-all inline-flex items-center space-x-2 shadow-lg shadow-cyan-950/40"
        >
          <span>Open Security Scanner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
