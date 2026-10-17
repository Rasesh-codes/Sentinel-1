import React from 'react';
import { CheckCheck, Clock } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  timestamp?: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, timestamp = Date.now() }) => {
  const timeString = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex justify-end w-full my-4 px-2 sm:px-4">
      <div className="max-w-xl sm:max-w-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-700/80 rounded-2xl rounded-tr-xs p-4 shadow-xl text-slate-100 relative group">
        <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-slate-800/60">
          <span className="text-[11px] font-mono font-medium text-cyan-400 flex items-center space-x-1.5">
            <span>You</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Suspicious message received</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
            <Clock className="w-2.5 h-2.5" />
            <span>{timeString}</span>
          </span>
        </div>

        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
          {message}
        </p>

        <div className="flex justify-end items-center mt-2 space-x-1 text-[10px] text-slate-500">
          <span>Sent to VERA for verification</span>
          <CheckCheck className="w-3.5 h-3.5 text-cyan-400 inline" />
        </div>
      </div>
    </div>
  );
};
