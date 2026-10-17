import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    'Reading the message...',
    'Checking for warning signs...',
    'Validating evidence verbatim...',
    'Building your safety report...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start space-x-3 my-4 px-2 sm:px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* VERA Avatar */}
      <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-950 to-slate-900 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-md">
        <Shield className="h-4 w-4 text-cyan-400 animate-pulse" />
      </div>

      {/* Bubble */}
      <div className="bg-[#101725] border border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 shadow-lg max-w-md">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xs font-mono font-bold text-cyan-400">VERA</span>
          <span className="text-[10px] text-slate-500 font-mono">analyzing</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* 3 bouncing dots */}
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-slate-300 font-sans tracking-wide">
            {steps[stepIndex]}
          </span>
        </div>
      </div>
    </div>
  );
};
