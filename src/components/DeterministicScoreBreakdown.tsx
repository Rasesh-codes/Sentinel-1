import React from 'react';
import { Calculator, Check, AlertCircle, Shield, Info } from 'lucide-react';
import { ScoreBreakdownItem } from '../types';

interface DeterministicScoreBreakdownProps {
  scoreBreakdown: ScoreBreakdownItem[];
  riskScore: number;
  riskLevel: string;
}

export const DeterministicScoreBreakdown: React.FC<DeterministicScoreBreakdownProps> = ({
  scoreBreakdown,
  riskScore,
  riskLevel,
}) => {
  return (
    <div
      id="score-breakdown-card"
      className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              DETERMINISTIC RISK SCORE BREAKDOWN
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated strictly by software rules — AI does not invent or guess scores.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Final Score:</span>
          <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 font-mono font-bold text-cyan-400 text-sm">
            {riskScore} / 100
          </span>
        </div>
      </div>

      {/* Itemized Table / List */}
      {scoreBreakdown.length > 0 ? (
        <div className="space-y-2.5">
          <div className="grid grid-cols-12 text-[11px] font-mono text-slate-500 px-3 pb-1 border-b border-slate-800/50">
            <span className="col-span-6 sm:col-span-5">DETECTED TACTIC</span>
            <span className="col-span-3 sm:col-span-4 text-center sm:text-left">DEDUPLICATION RULE</span>
            <span className="col-span-3 text-right">POINTS ADDED</span>
          </div>

          {scoreBreakdown.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 items-center px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs transition hover:border-slate-700"
            >
              <div className="col-span-6 sm:col-span-5 font-semibold text-slate-200 truncate">
                {item.label}
              </div>

              <div className="col-span-3 sm:col-span-4 text-[11px] font-mono text-slate-400 text-center sm:text-left">
                {item.occurrences > 1 ? (
                  <span className="text-cyan-400 font-medium">
                    {item.occurrences}x detected → counted once
                  </span>
                ) : (
                  <span>Standard weight</span>
                )}
              </div>

              <div className="col-span-3 text-right font-mono font-bold text-cyan-300">
                +{item.points_contributed}
              </div>
            </div>
          ))}

          {/* Total summary bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between px-3 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
              <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>
                Scores clamp automatically between 0 and 100.
              </span>
            </div>
            <div className="font-mono text-xs">
              <span className="text-slate-400 mr-2">Total Computed Score:</span>
              <strong className="text-white font-bold text-sm">{riskScore} / 100</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            No social-engineering manipulation tactics were detected. Risk baseline remains 0/100.
          </span>
        </div>
      )}
    </div>
  );
};
