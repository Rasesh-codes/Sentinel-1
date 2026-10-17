import React from 'react';
import { Check } from 'lucide-react';

interface ActionRecommendationsProps {
  actions: string[];
}

export const ActionRecommendations: React.FC<ActionRecommendationsProps> = ({ actions }) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  // Maximum 3 concise actions as per product specifications
  const displayActions = actions.slice(0, 3);

  return (
    <div
      id="action-recommendations-panel"
      className="bg-[#FFFFFF] border border-[#D8D3BC] rounded-2xl p-5 sm:p-7 shadow-sm select-none"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D8D3BC]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#536B4F]" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#20231F] font-semibold">
            WHAT TO DO NOW
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#62665D]">
          {displayActions.length} immediate steps
        </span>
      </div>

      <div className="space-y-2.5">
        {displayActions.map((act, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#FAF8EF] border border-[#D8D3BC] flex items-center gap-3 text-xs leading-relaxed"
          >
            <div className="w-5 h-5 rounded-full bg-[#536B4F] text-[#FFFFFF] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="text-[#20231F] font-medium font-['Inter']">{act}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
