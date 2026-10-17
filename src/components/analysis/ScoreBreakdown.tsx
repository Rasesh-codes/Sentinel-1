import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Cpu } from 'lucide-react';
import { ScoreBreakdownItem } from '../../types';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownItem[];
  totalScore: number;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  breakdown,
  totalScore,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#FFFFFF] border border-[#D8D3BC] rounded-2xl overflow-hidden transition-all select-none shadow-sm">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF8EF] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#FAF8EF] text-[#536B4F] border border-[#D8D3BC]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#20231F] font-['Manrope']">
              How this score was calculated
            </div>
            <div className="text-[11px] text-[#62665D]">
              AI extracts evidence. SENTINEL's scoring engine calculates risk deterministically.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#536B4F]">
            {totalScore} / 100
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-[#62665D]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#62665D]" />
          )}
        </div>
      </button>

      {/* Expanded Calculations Table */}
      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-[#D8D3BC] bg-[#FAF8EF]">
          <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D8D3BC] mb-3 text-[11px] text-[#62665D] flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#536B4F] shrink-0" />
            <span>
              Tactic deduplication is enforced: duplicate occurrences of the same tactic do not artificially stack scores.
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {breakdown && breakdown.length > 0 ? (
              breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-[#D8D3BC]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#20231F] font-medium truncate">
                      {item.label || item.tactic.replace(/_/g, ' ')}
                    </span>
                    {item.occurrences > 1 && (
                      <span className="text-[10px] text-[#8C9287]">
                        ({item.occurrences} mentions, counted once)
                      </span>
                    )}
                  </div>
                  <span className="text-[#B65353] font-semibold shrink-0 ml-2">
                    +{item.points_contributed}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-2 text-[#8C9287] text-center">
                0 points added — no malicious signals detected.
              </div>
            )}

            {/* Total Math Rule */}
            <div className="flex items-center justify-between pt-2.5 text-[#20231F] font-bold text-xs border-t border-[#D8D3BC]">
              <span>Deterministic Risk Score</span>
              <span className="text-[#536B4F] font-mono">{totalScore} / 100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
