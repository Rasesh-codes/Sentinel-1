import React from 'react';
import { AlertCircle, CheckCircle, Users, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface SafetyRecommendationsProps {
  explanation: string;
  recommendedActions: string[];
  uncertainty: string;
  onOpenWarningCard: () => void;
  riskLevel: string;
}

export const SafetyRecommendations: React.FC<SafetyRecommendationsProps> = ({
  explanation,
  recommendedActions,
  uncertainty,
  onOpenWarningCard,
  riskLevel,
}) => {
  const isHighOrCritical = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Why it is suspicious card */}
      <div
        id="why-suspicious-card"
        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              WHY IT IS SUSPICIOUS
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
            {explanation}
          </p>
        </div>

        {/* Responsible AI statement */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="leading-snug italic">
            {uncertainty}
          </p>
        </div>
      </div>

      {/* What should you do card */}
      <div
        id="recommended-actions-card"
        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                WHAT SHOULD YOU DO?
              </h3>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
              Safety Advice
            </span>
          </div>

          <ul className="space-y-2.5 mt-2">
            {recommendedActions.map((action, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warn My Family CTA */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <button
            id="btn-warn-my-family"
            onClick={onOpenWarningCard}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-lg ${
              isHighOrCritical
                ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-900/30 ring-1 ring-red-500/50'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Warn My Family — Generate Safety Alert Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
