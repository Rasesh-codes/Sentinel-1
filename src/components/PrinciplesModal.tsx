import React from 'react';
import { X, Cpu, CheckCircle2, Shield, Lock } from 'lucide-react';

interface PrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrinciplesModal: React.FC<PrinciplesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F141C] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F17]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-mono">
                How VERA Works
              </h3>
              <p className="text-xs text-cyan-400 font-mono">
                VERA = Verify Before You Trust
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 font-sans">
          {/* Core Philosophy Banner */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200">
            <h4 className="font-bold text-sm text-cyan-300 mb-1 font-mono">
              Core Architectural Principle
            </h4>
            <p className="leading-relaxed">
              <strong>"AI identifies evidence. Software evaluates evidence."</strong>
              <br />
              Large Language Models are effective at natural language understanding, but prone to hallucinations, arithmetic drift, and subjective scoring. VERA decouples semantic extraction from deterministic risk evaluation.
            </p>
          </div>

          {/* Key Pillars */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
              System Guarantees
            </h4>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>1. Verbatim Evidence Validation (Anti-Hallucination)</span>
              </div>
              <p className="text-slate-400 pl-6 leading-relaxed">
                Before any highlighted span is accepted, our Python engine normalizes unicode and strictly verifies that the candidate substring exists verbatim within the original user message. Fabricated or paraphrased phrases are discarded immediately.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>2. Deterministic Risk Engine & Deduplication</span>
              </div>
              <p className="text-slate-400 pl-6 leading-relaxed">
                Risk scores (0–100) are calculated with fixed mathematical weights: OTP_REQUEST (+25), FINANCIAL_REQUEST (+20), THREAT (+15), URGENCY (+10), EXTERNAL_ACTION (+10), etc. Duplicate tactics are deduplicated to prevent score inflation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>3. Non-Invasive URL Inspection</span>
              </div>
              <p className="text-slate-400 pl-6 leading-relaxed">
                VERA extracts web links via safe regex patterns to inspect protocols, domains, and URL shorteners. VERA never sends network requests to, scrapes, or executes suspicious external links.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>4. Privacy & Consumer Security</span>
              </div>
              <p className="text-slate-400 pl-6 leading-relaxed">
                VERA never requests or stores passwords, OTPs, or banking credentials. Your message analysis is performed in-memory and recent analysis history is stored only in your local browser storage.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#0B0F17] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
