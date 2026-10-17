import React, { useRef, useState } from 'react';
import { X, Download, Share2, Copy, Check, ShieldAlert, AlertTriangle, Shield } from 'lucide-react';
import html2canvas from 'html2canvas';
import { AnalyzeResponse } from '../types';

interface WarningCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalyzeResponse;
}

export const WarningCardModal: React.FC<WarningCardModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { classification, risk_level, risk_score, score_breakdown, recommended_actions } = result;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#080B10',
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `VERA-Alert-${classification.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = async () => {
    const text = `VERA SAFETY ALERT:
Pause before you act.

Category: ${classification}
Risk Level: ${risk_level} (${risk_score}/100)

Why this message is suspicious:
${score_breakdown.map((b) => `• ${b.label}`).join('\n')}

3 Important Safety Actions:
${recommended_actions.slice(0, 3).map((a) => `✓ ${a}`).join('\n')}

Verified by VERA — Before you trust a message, understand it.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `VERA Alert: ${classification}`,
      text: `⚠️ VERA Message Safety Alert: ${classification} (Risk: ${risk_level} - ${risk_score}/100). Pause before you act. Never share an OTP or make payments without verifying independently.`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      // Graceful fallback to downloading or copying
      handleDownload();
    }
  };

  const isHighOrCritical = risk_level === 'HIGH' || risk_level === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141C] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0B0F17]">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-sm text-white font-mono">
              VERA — Warn My Family
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content: Card Preview */}
        <div className="p-5 overflow-y-auto flex-1 bg-[#080B10]/80 flex justify-center">
          {/* Card target for html2canvas */}
          <div
            ref={cardRef}
            id="vera-warning-card-render"
            className="w-full max-w-md bg-[#0D121B] border-2 border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col justify-between space-y-4"
          >
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black tracking-wider text-white font-mono">
                    VERA
                  </h4>
                  <p className="text-[10px] text-cyan-400 font-mono">
                    Pause before you act.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  Category
                </span>
                <span className="text-xs font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {classification}
                </span>
              </div>
            </div>

            {/* Risk Badge Bar */}
            <div
              className={`p-3 rounded-xl flex items-center justify-between ${
                isHighOrCritical
                  ? 'bg-red-950/60 border border-red-600/40'
                  : 'bg-amber-950/60 border border-amber-600/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle
                  className={`w-4 h-4 ${isHighOrCritical ? 'text-red-400' : 'text-amber-400'}`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  RISK LEVEL:
                </span>
              </div>
              <span
                className={`text-sm font-extrabold font-mono ${
                  isHighOrCritical ? 'text-red-300' : 'text-amber-300'
                }`}
              >
                {risk_level} — {risk_score}/100
              </span>
            </div>

            {/* Why Suspicious */}
            <div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 block mb-1">
                WHY THE MESSAGE IS SUSPICIOUS:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {score_breakdown.length > 0 ? (
                  score_breakdown.slice(0, 4).map((b, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{b.label}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 text-xs">No high-risk manipulation tactics detected.</li>
                )}
              </ul>
            </div>

            {/* What to Do */}
            <div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                3 IMPORTANT SAFETY ACTIONS:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {recommended_actions.slice(0, 3).map((act, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center leading-tight">
              Before you trust a message, understand it. • AI risk assessment, not absolute proof.
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#0B0F17] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              id="btn-download-alert-card"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition disabled:opacity-50 shadow-md shadow-cyan-950/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating PNG...' : 'Download Image'}</span>
            </button>

            <button
              id="btn-copy-alert-summary"
              onClick={handleCopySummary}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 transition border border-slate-700/80"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>

          <button
            id="btn-share-alert"
            onClick={handleShare}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 transition border border-slate-700"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
