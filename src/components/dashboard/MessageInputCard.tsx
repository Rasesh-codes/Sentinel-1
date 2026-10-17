import React, { useRef, useEffect } from 'react';
import { ArrowRight, Globe, AlertCircle, X, ShieldCheck, Check } from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface MessageInputCardProps {
  message: string;
  onChangeMessage: (msg: string) => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error?: string | null;
  onSelectScenario?: (text: string) => void;
}

const EXAMPLE_SCENARIOS = [
  {
    label: 'Banking Alert',
    sample:
      'Dear SBI Customer, your YONO account has been suspended due to pending KYC update. Please click https://sbi-kyc-reactivate.info to complete instant verification today to prevent permanent debit freeze.',
  },
  {
    label: 'Delivery',
    sample:
      'IndiaPost Alert: Your package #IN-88921 could not be delivered due to an unpaid customs redelivery charge of ₹49. To prevent return to sender, update your address and pay within 2 hours at https://postal-track-update.com/pay',
  },
  {
    label: 'Job Offer',
    sample:
      'Hi, Amazon Hiring Team has shortlisted your resume for Part-Time Task Specialist. Work 1 hour daily and earn ₹3,500 - ₹8,000. To confirm your position, transfer ₹499 refundable equipment fee on Telegram @hr_recruit_team within 30 minutes.',
  },
  {
    label: 'Prize',
    sample:
      'Congratulations! Your mobile number was selected in KBC Lucky Draw for a cash prize of ₹25,00,000! Call KBC manager on WhatsApp immediately to pay the 1% processing tax and claim your prize before it expires today.',
  },
];

export const MessageInputCard: React.FC<MessageInputCardProps> = ({
  message,
  onChangeMessage,
  language,
  onChangeLanguage,
  onAnalyze,
  isLoading,
  error,
  onSelectScenario,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 4000;
  const charCount = message.length;
  const isOverLimit = charCount > maxLength;
  const canAnalyze = message.trim().length > 0 && !isOverLimit && !isLoading;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(140, textareaRef.current.scrollHeight)}px`;
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (canAnalyze) {
        onAnalyze();
      }
    }
  };

  const handleScenarioClick = (sample: string) => {
    onChangeMessage(sample);
    if (onSelectScenario) {
      onSelectScenario(sample);
    }
  };

  return (
    <div
      id="check-message-section"
      className="w-full max-w-3xl mx-auto bg-[#FFFFFF] border border-[#D8D3BC] rounded-2xl p-5 sm:p-7 shadow-sm select-none"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D8D3BC]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#536B4F]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#20231F] font-semibold">
            MESSAGE SCANNER
          </span>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#62665D]" />
          <div className="inline-flex rounded-lg bg-[#FAF8EF] p-0.5 border border-[#D8D3BC] text-xs">
            {(
              [
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'Hindi' },
                { id: 'hinglish', label: 'Hinglish' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeLanguage(opt.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  language === opt.id
                    ? 'bg-[#FFFFFF] text-[#20231F] border border-[#D8D3BC] shadow-xs'
                    : 'text-[#62665D] hover:text-[#20231F]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="message-textarea"
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a message you're unsure about..."
          disabled={isLoading}
          rows={5}
          className="w-full bg-[#FAF8EF] border border-[#D8D3BC] focus:border-[#536B4F] rounded-xl p-4 text-xs sm:text-sm text-[#20231F] placeholder-[#8C9287] focus:outline-none transition-colors resize-none leading-relaxed font-['Inter']"
        />

        {message && !isLoading && (
          <button
            type="button"
            onClick={() => onChangeMessage('')}
            title="Clear text"
            className="absolute top-3 right-3 p-1 rounded-md bg-[#FFFFFF] text-[#62665D] hover:text-[#20231F] border border-[#D8D3BC] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Subtle Quick Examples */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-mono text-[#62665D] mr-1">Try example:</span>
        {EXAMPLE_SCENARIOS.map((sc) => (
          <button
            key={sc.label}
            type="button"
            onClick={() => handleScenarioClick(sc.sample)}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8EF] hover:bg-[#FFFFFF] border border-[#D8D3BC] hover:border-[#536B4F] text-[11px] font-medium text-[#42473F] hover:text-[#20231F] transition-colors cursor-pointer shadow-2xs"
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Error notification if any */}
      {error && (
        <div className="mt-3.5 p-3 rounded-xl bg-[#B65353]/10 border border-[#B65353]/30 text-xs text-[#A83F47] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Footer Controls & Primary CTA */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#D8D3BC]">
        <div className="flex items-center gap-2 text-xs text-[#62665D] font-mono">
          <span className={isOverLimit ? 'text-[#A83F47] font-bold' : ''}>
            {charCount.toLocaleString()} / {maxLength.toLocaleString()} chars
          </span>
          <span className="hidden sm:inline">• ⌘+Enter to scan</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            id="btn-analyze-message"
            type="button"
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className={`inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-150 select-none cursor-pointer ${
              canAnalyze
                ? 'bg-[#536B4F] hover:bg-[#435840] text-[#FFFFFF] shadow-sm active:scale-[0.98]'
                : 'bg-[#FAF8EF] text-[#8C9287] cursor-not-allowed border border-[#D8D3BC]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>SCAN MESSAGE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trust Signal / Product Advantage below CTA */}
      <div className="mt-3 pt-2 flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[11px] text-[#62665D] border-t border-[#D8D3BC]/40 font-mono">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-[#4F8061]" />
          <span>Scan instantly — no account required</span>
        </div>
        <div className="text-[10px] text-[#8C9287]">
          Your message stays in memory • Never stored
        </div>
      </div>
    </div>
  );
};
