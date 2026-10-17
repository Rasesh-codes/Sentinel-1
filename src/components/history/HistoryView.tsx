import React, { useState } from 'react';
import { Search, Trash2, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { HistoryItem, AnalyzeResponse } from '../../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectResult: (result: AnalyzeResponse) => void;
  onClearHistory: () => void;
  onNavigateToCheck: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onNavigateToCheck,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.classification.toLowerCase().includes(q) ||
      item.message_preview.toLowerCase().includes(q) ||
      item.risk_level.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 select-none animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8D3BC]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#536B4F] font-semibold">
            LOCAL AUDIT LOG
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#20231F] font-['Manrope'] mt-0.5">
            Previous Checks
          </h2>
          <p className="text-xs text-[#62665D] mt-0.5">
            Local device audit history of analyzed communications.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8EF] text-[#62665D] hover:text-[#B65353] border border-[#D8D3BC] text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear history</span>
          </button>
        )}
      </div>

      {/* Filter search if items exist */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C9287] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter previous checks by keyword or risk..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8D3BC] text-xs text-[#20231F] placeholder-[#8C9287] focus:outline-none focus:border-[#536B4F] transition-colors shadow-2xs"
          >
          </input>
        </div>
      )}

      {/* History Items List */}
      {filtered.length > 0 ? (
        <div className="space-y-2.5">
          {filtered.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectResult(item.result)}
                className="w-full p-4 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8EF] border border-[#D8D3BC] hover:border-[#536B4F] transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group shadow-2xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      item.risk_level === 'CRITICAL' || item.risk_level === 'HIGH'
                        ? 'bg-[#B65353]/10 text-[#B65353]'
                        : item.risk_level === 'MEDIUM'
                        ? 'bg-[#B68A3E]/10 text-[#B68A3E]'
                        : 'bg-[#536B4F]/10 text-[#536B4F]'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#20231F] font-['Manrope'] truncate">
                        {item.classification}
                      </span>
                      <span className="text-[10px] text-[#8C9287] font-mono">
                        {dateStr}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#62665D] font-mono truncate mt-0.5 max-w-xl">
                      "{item.message_preview}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold ${
                        item.risk_level === 'CRITICAL' || item.risk_level === 'HIGH'
                          ? 'text-[#B65353]'
                          : item.risk_level === 'MEDIUM'
                          ? 'text-[#B68A3E]'
                          : 'text-[#536B4F]'
                      }`}
                    >
                      {item.risk_level} · {item.risk_score}/100
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-[#8C9287] group-hover:text-[#536B4F] transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 rounded-2xl bg-[#FFFFFF] border border-[#D8D3BC] text-center max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8EF] border border-[#D8D3BC] flex items-center justify-center text-[#536B4F] mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#20231F] font-['Manrope'] mb-1">
            No previous checks recorded
          </h3>
          <p className="text-xs text-[#62665D] mb-5">
            Your recent security checks will appear here on this device.
          </p>
          <button
            type="button"
            onClick={onNavigateToCheck}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#536B4F] hover:bg-[#435840] text-[#FFFFFF] font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <span>Scan a message</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
