import React, { useRef, useEffect } from 'react';
import { Search, Clipboard, AlertCircle, ShieldAlert, Languages, Sparkles } from 'lucide-react';
import { DemoBenchmark, SupportedLanguage } from '../types';

interface MessageInputPanelProps {
  message: string;
  setMessage: (msg: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  demos: DemoBenchmark[];
  onSelectDemo: (demo: DemoBenchmark) => void;
  error?: string | null;
  onRetryDemo?: () => void;
}

export const MessageInputPanel: React.FC<MessageInputPanelProps> = ({
  message,
  setMessage,
  language,
  setLanguage,
  onAnalyze,
  isLoading,
  demos,
  onSelectDemo,
  error,
  onRetryDemo,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
      }
    } catch {
      // Clipboard permission fallback
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onAnalyze();
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Headings */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
          Check before you trust.
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Paste a message and VERA will identify manipulation, suspicious requests, and social-engineering signals before you act.
        </p>
      </div>

      {/* Main Investigation Panel */}
      <div className="bg-[#0F141C] border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 relative">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              MESSAGE TO CHECK
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Paste an SMS, WhatsApp message, email, job offer, payment request, or suspicious notification.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePaste}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors flex items-center space-x-1.5"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">Paste</span>
          </button>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="investigation-message-input"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="e.g. URGENT: Your SBI account will be suspended today due to incomplete KYC. Verify immediately at https://... or pay ₹49 delivery fee within 2 hours..."
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed transition-all resize-y min-h-[140px]"
          />
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="mt-3 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-200 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            {onRetryDemo && (
              <button
                onClick={onRetryDemo}
                className="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-white rounded-lg text-[11px] font-mono shrink-0"
              >
                Load Sample
              </button>
            )}
          </div>
        )}

        {/* Bottom Controls Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Character Count & Language Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-slate-400">
              {message.length} <span className="text-slate-500">characters</span>
            </span>

            <div className="flex items-center space-x-1.5 pl-3 border-l border-slate-800">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 text-[11px] rounded font-medium transition-all ${
                    language === 'en'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-0.5 text-[11px] rounded font-medium transition-all ${
                    language === 'hi'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hinglish')}
                  className={`px-2 py-0.5 text-[11px] rounded font-medium transition-all ${
                    language === 'hinglish'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hinglish
                </button>
              </div>
            </div>
          </div>

          {/* Right: Primary CTA */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="hidden md:inline text-[10px] text-slate-500 font-mono">
              ⌘/Ctrl + Enter
            </span>

            <button
              id="btn-analyze-message"
              type="button"
              onClick={onAnalyze}
              disabled={!message.trim() || isLoading}
              className={`w-full sm:w-auto py-2.5 px-6 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg ${
                !message.trim() || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-950/50 active:scale-98'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Scanning message...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Try An Example Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            Try an example
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Loads into scanner for review
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {demos.map((d) => (
            <button
              key={d.id}
              id={`chip-demo-${d.id}`}
              type="button"
              onClick={() => onSelectDemo(d)}
              className="px-3 py-1.5 rounded-xl bg-[#0F141C] hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>{d.title}</span>
              <span className="text-[10px] text-slate-500 font-mono">({d.category})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
