import React, { useState } from 'react';
import { ValidatedEvidence } from '../types';
import { CheckCircle2, XCircle, Info, AlertOctagon, HelpCircle } from 'lucide-react';

interface EvidenceHighlightViewProps {
  originalMessage: string;
  validatedEvidence: ValidatedEvidence[];
  rejectedEvidence?: ValidatedEvidence[];
}

export const EvidenceHighlightView: React.FC<EvidenceHighlightViewProps> = ({
  originalMessage,
  validatedEvidence,
  rejectedEvidence = [],
}) => {
  const [activeEvidence, setActiveEvidence] = useState<ValidatedEvidence | null>(
    validatedEvidence.length > 0 ? validatedEvidence[0] : null
  );

  // Compute non-overlapping spans
  const validSpans: Array<{ start: number; end: number; ev: ValidatedEvidence }> = [];

  validatedEvidence.forEach((ev) => {
    if (!ev.validated || !ev.text) return;
    const textToFind = ev.text;
    let idx = originalMessage.indexOf(textToFind);
    while (idx !== -1) {
      const end = idx + textToFind.length;
      // Check if overlaps with already recorded span
      const overlaps = validSpans.some(
        (s) => Math.max(s.start, idx) < Math.min(s.end, end)
      );
      if (!overlaps) {
        validSpans.push({ start: idx, end, ev });
        break; // Only mark one prominent occurrence per evidence signal
      }
      idx = originalMessage.indexOf(textToFind, idx + 1);
    }
  });

  // Sort spans by start index
  validSpans.sort((a, b) => a.start - b.end);

  // Build segments to render
  const segments: Array<{ text: string; isHighlight: boolean; ev?: ValidatedEvidence }> = [];
  let currentPos = 0;

  validSpans.forEach((span) => {
    if (span.start > currentPos) {
      segments.push({
        text: originalMessage.slice(currentPos, span.start),
        isHighlight: false,
      });
    }
    segments.push({
      text: originalMessage.slice(span.start, span.end),
      isHighlight: true,
      ev: span.ev,
    });
    currentPos = span.end;
  });

  if (currentPos < originalMessage.length) {
    segments.push({
      text: originalMessage.slice(currentPos),
      isHighlight: false,
    });
  }

  const getTacticColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-red-500/20 text-red-200 border-b-2 border-red-500 hover:bg-red-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-200 border-b-2 border-amber-500 hover:bg-amber-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-200 border-b-2 border-cyan-500 hover:bg-cyan-500/30';
    }
  };

  return (
    <div
      id="evidence-highlight-card"
      className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center space-x-2">
            <span>ORIGINAL MESSAGE & VALIDATED EVIDENCE</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              Verified Verbatim
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any highlighted phrase to inspect the specific social-engineering tactic.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Validated Spans: <strong className="text-cyan-400">{validatedEvidence.length}</strong>
        </div>
      </div>

      {/* Message Box with highlights */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 text-slate-200 text-sm font-sans leading-relaxed whitespace-pre-wrap selection:bg-cyan-900">
        {segments.map((seg, idx) => {
          if (!seg.isHighlight || !seg.ev) {
            return <span key={idx}>{seg.text}</span>;
          }

          const isSelected = activeEvidence?.text === seg.ev.text;
          const colorClass = getTacticColor(seg.ev.severity);

          return (
            <mark
              key={idx}
              onClick={() => setActiveEvidence(seg.ev!)}
              className={`cursor-pointer px-1 py-0.5 rounded transition-all duration-150 ${colorClass} ${
                isSelected ? 'ring-2 ring-cyan-400 shadow-md font-semibold' : ''
              }`}
              title="Click to view tactic explanation"
            >
              {seg.text}
            </mark>
          );
        })}
      </div>

      {/* Selected Evidence Inspector Box */}
      {activeEvidence ? (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/40 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 border border-cyan-700 text-cyan-300 uppercase">
                TACTIC: {activeEvidence.tactic.replace(/_/g, ' ')}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 uppercase">
                {activeEvidence.severity} SEVERITY
              </span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Evidence Validated</span>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
              Flagged Phrase in Message:
            </span>
            <p className="text-slate-200 font-medium font-mono text-xs bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800 mt-1">
              "{activeEvidence.text}"
            </p>
          </div>

          <div className="mt-2.5 text-xs text-slate-300">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block">
              Why this is suspicious:
            </span>
            <p className="mt-0.5 leading-relaxed text-slate-200">
              {activeEvidence.reason}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>No high-risk phrase spans flagged in this message.</span>
        </div>
      )}

      {/* Fabricated Evidence Rejection Alert (if any AI hallucinations were caught) */}
      {rejectedEvidence && rejectedEvidence.length > 0 && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-300">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertOctagon className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>AI Evidence Validation Filter Intervened</span>
          </div>
          <p className="text-[11px] text-amber-400/90 mt-1 leading-relaxed">
            {rejectedEvidence.length} candidate span(s) proposed by the model were
            rejected because they did not exist verbatim in your submitted message.
            ScamShield strictly rejects hallucinated or altered evidence before calculating risk.
          </p>
        </div>
      )}
    </div>
  );
};
