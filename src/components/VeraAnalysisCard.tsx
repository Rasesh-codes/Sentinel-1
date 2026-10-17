import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Info,
  CreditCard,
  Clock,
  ExternalLink,
  Lock,
  Award,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Check,
  Globe,
  Sliders,
  Sparkles,
  Eye
} from 'lucide-react';
import { AnalyzeResponse, ValidatedEvidence } from '../types';

interface VeraAnalysisCardProps {
  result: AnalyzeResponse;
  onOpenWarningModal: () => void;
  onReset?: () => void;
}

export const VeraAnalysisCard: React.FC<VeraAnalysisCardProps> = ({
  result,
  onOpenWarningModal,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState<number | null>(null);

  // Animated score counter
  useEffect(() => {
    let start = 0;
    const end = result.risk_score;
    if (end === 0) {
      setDisplayScore(0);
      return;
    }
    const duration = 700;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result.risk_score]);

  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          color: 'text-red-400',
          bg: 'bg-red-950/40',
          border: 'border-red-600/50',
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          progress: 'bg-red-500',
          icon: AlertOctagon,
          summary: 'Critical danger detected. Do not interact.',
        };
      case 'HIGH':
        return {
          color: 'text-orange-400',
          bg: 'bg-orange-950/40',
          border: 'border-orange-600/50',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          progress: 'bg-orange-500',
          icon: AlertTriangle,
          summary: 'High social-engineering pressure detected.',
        };
      case 'MEDIUM':
        return {
          color: 'text-amber-400',
          bg: 'bg-amber-950/40',
          border: 'border-amber-600/50',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          progress: 'bg-amber-500',
          icon: AlertTriangle,
          summary: 'Several warning signs appear in this message.',
        };
      case 'LOW':
      default:
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-600/50',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          progress: 'bg-emerald-500',
          icon: CheckCircle2,
          summary: 'No high-risk manipulation tactics detected.',
        };
    }
  };

  const config = getRiskConfig(result.risk_level);
  const RiskIcon = config.icon;

  const getTacticIcon = (tactic: string) => {
    switch (tactic) {
      case 'FINANCIAL_REQUEST':
        return <CreditCard className="w-4 h-4 text-orange-400" />;
      case 'URGENCY':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'EXTERNAL_ACTION':
        return <ExternalLink className="w-4 h-4 text-cyan-400" />;
      case 'OTP_REQUEST':
        return <Lock className="w-4 h-4 text-red-400" />;
      case 'THREAT':
        return <AlertOctagon className="w-4 h-4 text-red-400" />;
      case 'UNREALISTIC_REWARD':
        return <Award className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTacticLabel = (tactic: string) => {
    switch (tactic) {
      case 'FINANCIAL_REQUEST':
        return 'Payment request';
      case 'URGENCY':
        return 'Urgency & short deadline';
      case 'EXTERNAL_ACTION':
        return 'External unverified link';
      case 'OTP_REQUEST':
        return 'OTP or credential demand';
      case 'THREAT':
        return 'Consequence pressure or threat';
      case 'AUTHORITY_IMPERSONATION':
        return 'Authority impersonation';
      case 'UNREALISTIC_REWARD':
        return 'Unrealistic reward or prize';
      case 'IDENTITY_PRESSURE':
        return 'Identity or KYC verification demand';
      case 'SECRECY_PRESSURE':
        return 'Secrecy pressure';
      default:
        return tactic.replace('_', ' ').toLowerCase();
    }
  };

  const handleCopySummary = () => {
    const text = `VERA Security Analysis:
Category: ${result.classification}
Risk Level: ${result.risk_level} (${result.risk_score}/100)
Summary: ${result.explanation}

Recommended Actions:
${result.recommended_actions.map((a) => `• ${a}`).join('\n')}

Verified by VERA — Before you trust a message, understand it.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render original message with verbatim highlight spans
  const renderHighlightedMessage = () => {
    const text = result.original_message;
    if (!result.validated_evidence || result.validated_evidence.length === 0) {
      return <p className="text-sm text-slate-300 leading-relaxed font-sans">{text}</p>;
    }

    // Sort evidence by start_index
    const sorted = [...result.validated_evidence]
      .filter((e) => e.start_index !== undefined && e.end_index !== undefined)
      .sort((a, b) => (a.start_index ?? 0) - (b.start_index ?? 0));

    if (sorted.length === 0) {
      return <p className="text-sm text-slate-300 leading-relaxed font-sans">{text}</p>;
    }

    const segments = [];
    let lastIndex = 0;

    sorted.forEach((ev, idx) => {
      const start = ev.start_index ?? 0;
      const end = ev.end_index ?? 0;

      if (start > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>{text.substring(lastIndex, start)}</span>
        );
      }

      const isFocused = activeEvidenceIndex === idx;

      segments.push(
        <mark
          key={`mark-${idx}`}
          onClick={() => setActiveEvidenceIndex(isFocused ? null : idx)}
          className={`cursor-pointer px-1 py-0.5 rounded transition-all font-medium ${
            isFocused
              ? 'bg-red-500 text-slate-950 ring-2 ring-red-400'
              : 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border-b-2 border-amber-500/60'
          }`}
          title={`Click to inspect: ${ev.tactic}`}
        >
          {text.substring(start, end)}
        </mark>
      );

      lastIndex = end;
    });

    if (lastIndex < text.length) {
      segments.push(
        <span key={`text-end`}>{text.substring(lastIndex)}</span>
      );
    }

    return <p className="text-sm text-slate-200 leading-relaxed font-sans">{segments}</p>;
  };

  return (
    <div className="flex items-start space-x-3 my-4 px-2 sm:px-4 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* VERA Avatar */}
      <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-950 to-slate-900 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg mt-1">
        <Shield className="h-4.5 w-4.5 text-cyan-400" />
      </div>

      {/* Main Analysis Card Container */}
      <div className="flex-1 max-w-3xl bg-[#0F141F] border border-slate-800 rounded-2xl rounded-tl-xs shadow-2xl overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/90 to-[#0F141F] flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-400">VERA</span>
              <span className="text-slate-500">•</span>
              <span className="text-sm font-semibold text-white">Here's what I found.</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{config.summary}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wide border flex items-center space-x-1.5 ${config.badge}`}
            >
              <RiskIcon className="w-3.5 h-3.5" />
              <span>{result.risk_level} RISK</span>
            </span>
            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 font-mono text-xs font-bold text-white">
              <span>{displayScore}</span>
              <span className="text-slate-500 text-[10px]"> / 100</span>
            </div>
          </div>
        </div>

        {/* Primary Category Banner */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Classification:</span>
            <span className="text-xs font-bold font-mono text-cyan-300 px-2 py-0.5 bg-cyan-950/60 rounded border border-cyan-800/40">
              {result.classification}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 font-mono">
            <span>Confidence:</span>
            <span className="text-slate-200 font-bold">{Math.round(result.ai_confidence * 100)}%</span>
            {result.analysis_source === 'local_fallback' && (
              <span className="text-[10px] text-amber-400/80 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-800/40 ml-1">
                Local Engine
              </span>
            )}
          </div>
        </div>

        {/* Explanation Section */}
        <div className="p-5 border-b border-slate-800/60 space-y-3">
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {result.explanation}
          </p>

          {result.detected_tactics.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Why this matters
              </span>
              <p className="text-xs text-slate-300 leading-normal">
                Scammers frequently combine artificial urgency with payment demands or threats to rush you into acting before you have time to independently verify with the real organization.
              </p>
            </div>
          )}
        </div>

        {/* Verbatim Evidence Section ("Why VERA flagged this") */}
        <div className="p-5 border-b border-slate-800/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Why VERA flagged this
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/40 font-mono">
                {result.validated_evidence.length} validated signals
              </span>
            </div>
            <span className="text-[10px] text-slate-500 italic hidden sm:inline">
              Click highlights to inspect
            </span>
          </div>

          {/* Interactive Message Span Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-4 font-mono text-xs">
            {renderHighlightedMessage()}
          </div>

          {/* Evidence Details Cards */}
          {result.validated_evidence.length === 0 ? (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>No coercive, fraudulent, or deceptive text spans were validated.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.validated_evidence.map((ev, idx) => {
                const isFocused = activeEvidenceIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveEvidenceIndex(isFocused ? null : idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isFocused
                        ? 'bg-slate-800/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                        : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center space-x-1.5 truncate">
                        {getTacticIcon(ev.tactic)}
                        <span className="text-xs font-semibold text-slate-200 capitalize truncate">
                          {getTacticLabel(ev.tactic)}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                        {ev.severity}
                      </span>
                    </div>

                    <div className="bg-slate-950/70 rounded px-2 py-1 mb-1.5 font-mono text-xs text-amber-300 border border-amber-500/20 truncate">
                      "{ev.text}"
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">
                      {ev.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* URL Inspector (if URLs exist) */}
        {result.detected_urls && result.detected_urls.length > 0 && (
          <div className="p-5 border-b border-slate-800/60 bg-slate-950/30">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  URL Inspector
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Safe inspection (no remote requests)</span>
            </div>

            <div className="space-y-2">
              {result.detected_urls.map((u, idx) => (
                <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-cyan-300 truncate max-w-sm">{u.raw_url}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${u.is_https ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' : 'bg-red-950/60 text-red-300 border border-red-800/40'}`}>
                      {u.is_https ? 'HTTPS' : 'INSECURE HTTP'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{u.safety_note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Actions ("What To Do") */}
        <div className="p-5 border-b border-slate-800/60">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-3">
            What to do
          </span>
          <div className="space-y-2">
            {result.recommended_actions.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200 leading-normal font-sans">
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deterministic Mathematical Breakdown (Collapsible) */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800/60">
          <button
            onClick={() => setShowMathDetails(!showMathDetails)}
            className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center space-x-2 font-mono">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deterministic Risk Engine Math</span>
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] text-slate-500 font-mono">Fixed Weights & Deduplication</span>
              {showMathDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showMathDetails && (
            <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2 font-mono text-[11px]">
              <p className="text-slate-400 italic">
                AI extracts evidence. Software evaluates evidence with fixed mathematical rules:
              </p>
              <div className="space-y-1">
                {result.score_breakdown.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-slate-300">{b.label}</span>
                    <span className="font-bold text-amber-400">{b.rule}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-1 text-slate-300 font-bold border-t border-slate-800">
                <span>Total Clamped Score:</span>
                <span className="text-cyan-400">{result.risk_score} / 100 ({result.risk_level})</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Warn Family, Copy, Reset */}
        <div className="p-4 bg-[#0B0F17] flex flex-wrap items-center justify-between gap-3">
          <button
            id="warn-family-btn"
            onClick={onOpenWarningModal}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-red-950/40 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Warn My Family</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs transition-colors flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>

            {onReset && (
              <button
                onClick={onReset}
                className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
