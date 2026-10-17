import React from 'react';
import { History, Trash2, ArrowUpRight, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryTableViewProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onGoToScanner: () => void;
}

export const HistoryTableView: React.FC<HistoryTableViewProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onGoToScanner,
}) => {
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-300 bg-red-950/60 border-red-800/60';
      case 'HIGH':
        return 'text-orange-300 bg-orange-950/60 border-orange-800/60';
      case 'MEDIUM':
        return 'text-amber-300 bg-amber-950/60 border-amber-800/60';
      case 'LOW':
      default:
        return 'text-emerald-300 bg-emerald-950/60 border-emerald-800/60';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const elapsed = Math.floor((Date.now() - timestamp) / 1000);
    if (elapsed < 60) return 'Just now';
    const minutes = Math.floor(elapsed / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-white">
            Recent checks
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit history of messages investigated in your current local session.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-800/50 text-xs text-slate-400 hover:text-red-400 font-mono transition-colors flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center bg-[#0F141C] border border-dashed border-slate-800 rounded-2xl space-y-3">
          <History className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-mono text-slate-300">No message analyses recorded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Run an analysis from the scanner and your security reports will be cataloged here.
          </p>
          <button
            onClick={onGoToScanner}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold font-mono transition-all inline-flex items-center space-x-1.5"
          >
            <span>Scan a message</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#0F141C] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0B0F17] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Category</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 hidden md:table-cell">Message Snippet</th>
                  <th className="py-3 px-4 text-right">Time</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectHistoryItem(item)}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.classification}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getRiskBadge(
                          item.risk_level
                        )}`}
                      >
                        {item.risk_level}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-300">
                      {item.risk_score} / 100
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-sans truncate max-w-xs hidden md:table-cell italic">
                      "{item.message_preview}"
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 whitespace-nowrap">
                      {formatTimestamp(item.timestamp)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 text-cyan-400 group-hover:underline text-[11px]">
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
