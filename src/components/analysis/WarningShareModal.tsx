import React, { useRef, useState } from 'react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { AnalyzeResponse } from '../../types';
import { SentinelLogo } from '../brand/SentinelLogo';

interface WarningShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalyzeResponse;
}

export const WarningShareModal: React.FC<WarningShareModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { classification, risk_level, risk_score, score_breakdown, recommended_actions } = result;

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#080B0A',
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SENTINEL-Advisory-${classification.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = async () => {
    const text = `SENTINEL ADVISORY
Protect someone you care about.

Summary: ${classification}
Risk level: ${risk_level} (${risk_score}/100)

Noticeable signs:
${score_breakdown.slice(0, 3).map((b) => `• ${b.label}`).join('\n')}

Simple advice:
${recommended_actions.slice(0, 3).map((a) => `✓ ${a}`).join('\n')}

Please stay safe and verify before responding or making payments.
Checked via Sentinel Consumer Security.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleWebShare = async () => {
    const shareData = {
      title: `Sentinel Advisory: ${classification}`,
      text: `Sentinel Advisory: ${classification} (${risk_level} Risk). Please check before clicking links or sending payments.`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Cancelled
      }
    } else {
      handleCopySummary();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#D8D3BC] rounded-2xl p-6 shadow-xl select-none">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#62665D] hover:text-[#20231F] hover:bg-[#FAF8EF] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#536B4F] font-semibold">
            PROTECT SOMEONE YOU CARE ABOUT
          </span>
          <h2 className="text-base font-bold text-[#20231F] font-['Manrope'] mt-0.5">
            Share a simple warning with someone who might need it.
          </h2>
          <p className="text-xs text-[#62665D] mt-0.5">
            A polite, calm advisory card designed for family and friends.
          </p>
        </div>

        {/* The Exportable Visual Card */}
        <div
          ref={cardRef}
          className="p-5 rounded-2xl bg-[#FAF8EF] border border-[#D8D3BC] my-4 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between border-b border-[#D8D3BC] pb-3">
            <SentinelLogo size="sm" showWordmark={true} showTagline={true} />
            <div className="text-right">
              <span className="text-[9px] font-mono uppercase text-[#62665D] block">
                SAFETY ADVISORY
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  risk_level === 'CRITICAL' || risk_level === 'HIGH'
                    ? 'text-[#B65353]'
                    : 'text-[#B68A3E]'
                }`}
              >
                {risk_level} RISK ({risk_score}/100)
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#20231F] font-['Manrope'] mb-1">
              {classification}
            </h3>
            <p className="text-xs text-[#62665D] leading-relaxed">
              Deceptive patterns were detected in this message.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D8D3BC] space-y-1.5 text-[11px]">
            <div className="font-mono text-[10px] uppercase text-[#62665D] font-semibold">
              KEY WARNING SIGNS:
            </div>
            {score_breakdown.slice(0, 3).map((b, i) => (
              <div key={i} className="text-[#20231F] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B65353]" />
                <span className="font-medium">{b.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[10px] font-mono text-[#62665D] flex items-center justify-between border-t border-[#D8D3BC]">
            <span>sentinel.security</span>
            <span>Verify before paying or sharing credentials</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#536B4F] hover:bg-[#435840] text-[#FFFFFF] font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generating...' : 'Download Card'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="py-2.5 px-4 rounded-xl bg-[#FAF8EF] hover:bg-[#FFFFFF] text-[#20231F] border border-[#D8D3BC] font-medium text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#4F8061]" /> : <Copy className="w-3.5 h-3.5 text-[#62665D]" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleWebShare}
            className="py-2.5 px-3 rounded-xl bg-[#FAF8EF] hover:bg-[#FFFFFF] text-[#20231F] border border-[#D8D3BC] font-medium text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            title="Share Advisory"
          >
            <Share2 className="w-3.5 h-3.5 text-[#62665D]" />
          </button>
        </div>
      </div>
    </div>
  );
};
