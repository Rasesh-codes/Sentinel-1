import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Globe,
  Sliders,
  Sparkles,
  ExternalLink,
  CreditCard,
  Clock,
  Lock,
  Award,
  ChevronDown,
  ChevronUp,
  FileSearch,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { AnalyzeResponse, ValidatedEvidence } from '../types';
import { VerificationPipelineBadge } from './VerificationPipelineBadge';

interface SecurityReportViewProps {
  result: AnalyzeResponse;
  onOpenWarningModal: () => void;
  onAnalyzeAnother: () => void;
}

export const SecurityReportView: React.FC<SecurityReportViewProps> = ({
  result,
  onOpenWarningModal,
  onAnalyzeAnother,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCalculationDetails, setShowCalculationDetails] = useState(true);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Score counter animation
  useEffect(() => {
    let start = 0;
    const target = result.risk_score;
    if (target === 0) {
      setAnimatedScore(0);
      return;
    }
    const duration = 600;
    const stepTime = 20;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result.risk_score]);

  const getRiskDetails = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          textColor: 'text-red-400',
          bgColor: 'bg-red-950/40',
          borderColor: 'border-red-600/60',
          badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: AlertOctagon,
          summary: 'Critical danger detected. Coercive manipulation and account compromise tactics.',
        };
      case 'HIGH':
        return {
          textColor: 'text-orange-400',
          bgColor: 'bg-orange-950/40',
          borderColor: 'border-orange-600/60',
          badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          icon: AlertTriangle,
          summary: 'High social-engineering pressure and deceptive demands detected.',
        };
      case 'MEDIUM':
        return {
          textColor: 'text-amber-400',
          bgColor: 'bg-amber-950/40',
          borderColor: 'border-amber-600/60',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertTriangle,
          summary: 'Multiple social-engineering signals were detected in this message.',
        };
      case 'LOW':
      default:
        return {
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-950/40',
          borderColor: 'border-emerald-600/60',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
          summary: 'No high-risk manipulation tactics or fraudulent demands detected.',
        };
    }
  };

  const risk = getRiskDetails(result.risk_level);
  const RiskIcon = risk.icon;

  const handleCopyReport = () => {
    const text = `VERA SECURITY REPORT
Classification: ${result.classification}
Risk Level: ${result.risk_level} (${result.risk_score}/100)
Assessment: ${result.explanation}

Validated Evidence Signals:
${result.validated_evidence.map((e) => `• [${e.tactic}] "${e.text}" — ${e.reason}`).join('\n')}

What You Should Do:
${result.recommended_actions.map((a) => `✓ ${a}`).join('\n')}

Scanned by VERA — Before you trust a message, understand it.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render message text with interactive highlight spans
  const renderInteractiveEvidenceSpans = () => {
    const text = result.original_message;
    if (!result.validated_evidence || result.validated_evidence.length === 0) {
      return <p className="text-sm text-slate-300 font-mono leading-relaxed">{text}</p>;
    }

    const sorted = [...result.validated_evidence]
      .filter((e) => e.start_index !== undefined && e.end_index !== undefined)
      .sort((a, b) => (a.start_index ?? 0) - (b.start_index ?? 0));

    if (sorted.length === 0) {
      return <p className="text-sm text-slate-300 font-mono leading-relaxed">{text}</p>;
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

      const isFocused = activeHighlightIndex === idx;

      segments.push(
        <mark
          key={`mark-${idx}`}
          onClick={() => setActiveHighlightIndex(isFocused ? null : idx)}
          className={`cursor-pointer px-1 py-0.5 rounded transition-all font-mono font-medium ${
            isFocused
              ? 'bg-red-500 text-slate-950 ring-2 ring-red-400 font-bold'
              : 'bg-amber-500/25 text-amber-200 hover:bg-amber-500/40 border-b-2 border-amber-500/80'
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

    return <p className="text-sm text-slate-200 font-mono leading-relaxed">{segments}</p>;
  };

  return (
    <div className="w-full space-y-6 pt-4 animate-in fade-in duration-300">
      {/* 1. SECURITY STATUS HEADER */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0F141C] border border-slate-800">
        <div className="flex items-center space-x-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            VERA SECURITY CHECK
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            Analysis complete
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyReport}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>
        </div>
      </div>

      {/* 2. TECHNICAL VERIFICATION PIPELINE BADGE */}
      <VerificationPipelineBadge currentStage="COMPLETE" />

      {/* 3. PRIMARY RISK SUMMARY PANEL */}
      <div className="bg-[#0F141C] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
              SECURITY ANALYSIS
            </span>
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                {result.classification}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-normal">
              "{result.explanation}"
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto shrink-0">
            <div
              className={`px-4 py-2.5 rounded-2xl border flex items-center space-x-2.5 ${risk.badgeColor}`}
            >
              <RiskIcon className="w-5 h-5" />
              <div>
                <span className="text-[10px] font-mono block uppercase tracking-wider">
                  RISK LEVEL
                </span>
                <span className="text-sm font-black font-mono tracking-wide">
                  {result.risk_level}
                </span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                RISK SCORE
              </span>
              <span className="text-lg font-black text-cyan-400">
                {animatedScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-mono">
          Detection source: {result.analysis_source === 'local_fallback' ? 'Local Deterministic Engine' : 'Gemini AI + Rule Engine'}.
          Calculated deterministically using fixed threat weights.
        </p>
      </div>

      {/* 4. HERO FEATURE: EVIDENCE FOUND */}
      <div className="bg-[#0F141C] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                EVIDENCE FOUND
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
                {result.validated_evidence.length} validated text spans
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Original message with verified suspicious phrases highlighted. Click any highlight to inspect.
            </p>
          </div>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Subject: User-provided artifact
          </span>
        </div>

        {/* The Document Panel: MESSAGE UNDER REVIEW */}
        <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-xl relative">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-800/60 pb-2 mb-3">
            <span>MESSAGE UNDER REVIEW</span>
            <span>Source: User Input • Verified Verbatim</span>
          </div>

          {renderInteractiveEvidenceSpans()}

          <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Status: Analyzed by Evidence Validator</span>
            <span>No paraphrasing or simulated quotes</span>
          </div>
        </div>

        {/* Beside / Below: Highlighted Phrase Cards with Signal, Severity, Reason */}
        <div className="space-y-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Extracted Evidence Spans
          </span>

          {result.validated_evidence.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No fraudulent or manipulative phrases were validated in this message.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.validated_evidence.map((ev, idx) => {
                const isFocused = activeHighlightIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveHighlightIndex(isFocused ? null : idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isFocused
                        ? 'bg-slate-800/95 border-amber-500 shadow-lg ring-1 ring-amber-500/50'
                        : 'bg-slate-950/70 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-amber-300 truncate">
                        "{ev.text}"
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                          ev.severity === 'CRITICAL' || ev.severity === 'HIGH'
                            ? 'bg-red-950/60 text-red-300 border-red-800/40'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                        }`}
                      >
                        {ev.severity}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-cyan-300 mb-1">
                      Signal: {ev.tactic.replace(/_/g, ' ')}
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-normal">
                      {ev.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 5. SAFE URL INSPECTOR (if URLs exist) */}
      {result.detected_urls && result.detected_urls.length > 0 && (
        <div className="bg-[#0F141C] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Safe URL Inspection
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              Zero network requests (safe offline regex parser)
            </span>
          </div>

          <div className="space-y-2">
            {result.detected_urls.map((u, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-cyan-300 break-all">{u.raw_url}</span>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                        u.is_https
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : 'bg-red-950/60 text-red-300 border-red-800/40'
                      }`}
                    >
                      {u.is_https ? 'HTTPS' : 'INSECURE HTTP'}
                    </span>
                    {u.is_shortened && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-orange-950/60 text-orange-300 border border-orange-800/40">
                        SHORTENER
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-slate-400 text-[11px] leading-normal">{u.safety_note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. DETERMINISTIC RISK ENGINE BREAKDOWN */}
      <div className="bg-[#0F141C] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div
          onClick={() => setShowCalculationDetails(!showCalculationDetails)}
          className="flex items-center justify-between cursor-pointer group select-none"
        >
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 group-hover:text-cyan-300 transition-colors">
              How was this score calculated?
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-500">
              Calculated by VERA's risk engine
            </span>
            {showCalculationDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {showCalculationDetails && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-in fade-in">
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Calculated deterministically: fixed mathematical weights, deduplicated per tactic (no AI confidence drift).
            </p>

            <div className="space-y-1.5 font-mono text-xs">
              {result.score_breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-bold text-amber-400">{item.rule}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between font-mono font-bold text-xs pt-2">
              <span className="text-white">Final Risk Score</span>
              <span className="text-cyan-400 text-sm">
                {result.risk_score} / 100 ({result.risk_level})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 7. SAFETY ACTIONS ("WHAT YOU SHOULD DO") */}
      <div className="bg-[#0F141C] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            WHAT YOU SHOULD DO
          </span>
          <p className="text-xs text-slate-400">
            Recommended immediate protective actions based on detected risks.
          </p>
        </div>

        <div className="space-y-2.5">
          {result.recommended_actions.map((act, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800"
            >
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-slate-200 leading-normal font-sans">
                {act}
              </span>
            </div>
          ))}
        </div>

        {/* Primary Action Controls */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            id="btn-warn-my-family-primary"
            type="button"
            onClick={onOpenWarningModal}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-red-950/50 active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>Warn My Family</span>
          </button>

          <button
            id="btn-analyze-another-message"
            type="button"
            onClick={onAnalyzeAnother}
            className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Analyze another message</span>
          </button>
        </div>
      </div>
    </div>
  );
};
