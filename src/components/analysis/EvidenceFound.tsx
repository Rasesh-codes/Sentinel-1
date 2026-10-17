import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { ValidatedEvidence } from '../../types';

interface EvidenceFoundProps {
  evidence: ValidatedEvidence[];
  selectedEvidenceIndex: number | null;
  onSelectEvidence: (index: number | null) => void;
}

export const EvidenceFound: React.FC<EvidenceFoundProps> = ({
  evidence,
  selectedEvidenceIndex,
  onSelectEvidence,
}) => {
  if (!evidence || evidence.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5 select-none">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#20231F] font-semibold">
            VALIDATED EVIDENCE QUOTES
          </span>
          <span className="text-[10px] font-mono text-[#536B4F] bg-[#536B4F]/10 px-2 py-0.5 rounded border border-[#536B4F]/30 font-bold">
            {evidence.length} validated
          </span>
        </div>
        <span className="text-[11px] text-[#8C9287] font-mono">
          Verbatim text matches only
        </span>
      </div>

      <div className="space-y-2">
        {evidence.map((item, idx) => {
          const isSelected = selectedEvidenceIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => onSelectEvidence(isSelected ? null : idx)}
              className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#536B4F] ring-2 ring-[#536B4F]/30 shadow-xs'
                  : 'bg-[#FFFFFF] hover:bg-[#FAF8EF] border-[#D8D3BC]'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4F8061] shrink-0 mt-0.5" />
                <div className="min-w-0 space-y-0.5">
                  <div className="text-xs font-mono text-[#20231F] font-semibold leading-snug break-words">
                    "{item.text}"
                  </div>
                  <div className="text-[11px] text-[#62665D] font-['Inter']">
                    {item.reason}
                  </div>
                  {item.char_span && (
                    <div className="text-[10px] text-[#8C9287] font-mono">
                      Location: index {item.char_span[0]}–{item.char_span[1]}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8EF] border border-[#D8D3BC] text-[#62665D]">
                  {item.tactic.replace(/_/g, ' ')}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                    item.severity === 'CRITICAL'
                      ? 'bg-[#A83F47]/10 text-[#A83F47] border border-[#A83F47]/20'
                      : item.severity === 'HIGH'
                      ? 'bg-[#B65353]/10 text-[#B65353] border border-[#B65353]/20'
                      : 'bg-[#B68A3E]/10 text-[#B68A3E] border border-[#B68A3E]/20'
                  }`}
                >
                  {item.severity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
