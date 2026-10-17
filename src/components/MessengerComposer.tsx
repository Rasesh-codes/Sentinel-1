import React, { useRef, useEffect } from 'react';
import { Send, Clipboard, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { DemoBenchmark } from '../types';

interface MessengerComposerProps {
  message: string;
  setMessage: (msg: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  demos: DemoBenchmark[];
  onSelectDemo: (demo: DemoBenchmark) => void;
  error?: string | null;
  onRetryDemo?: () => void;
}

export const MessengerComposer: React.FC<MessengerComposerProps> = ({
  message,
  setMessage,
  onAnalyze,
  isLoading,
  demos,
  onSelectDemo,
  error,
  onRetryDemo,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [message]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
      }
    } catch {
      // Fallback if permission denied
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
    <div className="border-t border-slate-800/80 bg-[#0B0F17]/95 backdrop-blur-md p-3 sm:p-4 shrink-0 z-20">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Error Notification with fallback button */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-200 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            {onRetryDemo && (
              <button
                onClick={onRetryDemo}
                className="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-white rounded-lg text-[11px] font-mono shrink-0"
              >
                Try Demo Message
              </button>
            )}
          </div>
        )}

        {/* Quick Demo Pills (Above Composer) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-slate-500 font-mono shrink-0 pl-1">Samples:</span>
          {demos.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDemo(d)}
              className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-300 transition-all shrink-0 flex items-center space-x-1"
            >
              <span>{d.title}</span>
            </button>
          ))}
        </div>

        {/* Composer Input Area */}
        <div className="relative bg-[#0F141F] border border-slate-700/80 focus-within:border-cyan-500/80 rounded-2xl p-2 sm:p-2.5 transition-all shadow-lg shadow-black/40">
          <textarea
            ref={textareaRef}
            id="message-composer-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            placeholder="Paste a suspicious message (SMS, WhatsApp, email) to verify with VERA..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none px-2 py-1 max-h-36 leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 px-1 text-xs">
            {/* Left helpers */}
            <div className="flex items-center space-x-2 text-slate-400">
              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="hover:text-slate-200 transition-colors flex items-center space-x-1 py-1 px-1.5 rounded hover:bg-slate-800/50"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline text-[11px]">Paste</span>
              </button>

              <span className="text-[11px] text-slate-500 font-mono">
                {message.length} chars
              </span>
            </div>

            {/* Right: Submit Button */}
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline text-[10px] text-slate-500 font-mono">
                Press ⌘/Ctrl + Enter
              </span>
              <button
                id="analyze-submit-btn"
                type="button"
                onClick={onAnalyze}
                disabled={!message.trim() || isLoading}
                className={`py-2 px-4 rounded-xl font-medium text-xs transition-all flex items-center space-x-2 ${
                  !message.trim() || isLoading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold shadow-md shadow-cyan-950/50 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Consumer Privacy Note */}
        <p className="text-[10px] sm:text-[11px] text-slate-500 text-center leading-normal">
          Your messages are analyzed to identify potential safety risks. VERA does not need your passwords, OTPs, or banking credentials.
        </p>
      </div>
    </div>
  );
};
