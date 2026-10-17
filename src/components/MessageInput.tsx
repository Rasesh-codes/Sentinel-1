import React from 'react';
import { Sparkles, Clipboard, Trash2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { DEMO_BENCHMARKS } from '../data/demos';
import { DemoBenchmark } from '../types';

interface MessageInputProps {
  message: string;
  onChange: (value: string) => void;
  onAnalyze: (customSource?: 'gemini' | 'local_fallback') => void;
  isLoading: boolean;
  selectedDemoId: string | null;
  onSelectDemo: (demo: DemoBenchmark) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onChange,
  onAnalyze,
  isLoading,
  selectedDemoId,
  onSelectDemo,
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Demo Benchmark Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Quick Hackathon Benchmark Scenarios:
          </span>
          <span className="text-[11px] text-cyan-400/80 font-mono">
            4 verified test cases
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEMO_BENCHMARKS.map((demo) => {
            const isSelected = selectedDemoId === demo.id;
            const isLegit = demo.id === 'legitimate';
            return (
              <button
                key={demo.id}
                id={`demo-btn-${demo.id}`}
                onClick={() => onSelectDemo(demo)}
                className={`text-left p-2.5 rounded-xl border text-xs transition relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? isLegit
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 ring-1 ring-emerald-500/50'
                      : 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold truncate">{demo.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {demo.category}
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-1.5 flex items-center text-[10px] font-mono text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1 animate-pulse" />
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950/80 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/40 transition">
        <textarea
          id="message-textarea"
          value={message}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type any suspicious SMS, WhatsApp message, email, or investment offer here..."
          rows={5}
          maxLength={4000}
          className="w-full bg-transparent px-4 pt-3.5 pb-10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none font-sans leading-relaxed"
        />

        {/* Action icons bar inside textarea */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2">
          <div className="flex items-center space-x-2">
            <button
              id="btn-paste-message"
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span className="text-[11px]">Paste</span>
            </button>
            {message && (
              <button
                id="btn-clear-message"
                type="button"
                onClick={handleClear}
                className="inline-flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-300 transition"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Clear</span>
              </button>
            )}
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            {message.length} / 4000
          </div>
        </div>
      </div>

      {/* Bottom controls & CTA */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Privacy Note */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-[11px] leading-tight">
            Messages are processed for current analysis and are{' '}
            <strong className="text-slate-300 font-medium">not intentionally stored</strong>.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            id="btn-analyze-message"
            type="button"
            onClick={() => onAnalyze()}
            disabled={isLoading || !message.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Analyzing Message...' : 'Analyze Message'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
