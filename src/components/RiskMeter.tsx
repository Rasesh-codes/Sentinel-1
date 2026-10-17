import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Flame, Sparkles, Cpu } from 'lucide-react';
import { AnalyzeResponse } from '../types';

interface RiskMeterProps {
  result: AnalyzeResponse;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ result }) => {
  const { risk_score, risk_level, classification, ai_confidence, analysis_source, demo_mode } =
    result;

  const getRiskConfig = () => {
    switch (risk_level) {
      case 'CRITICAL':
        return {
          color: 'text-red-400',
          bgBadge: 'bg-red-950/60 border-red-600/50 text-red-300',
          gaugeBg: 'bg-red-500',
          glow: 'shadow-red-900/30',
          icon: Flame,
          label: 'CRITICAL RISK',
          sub: 'High likelihood of malicious social-engineering. Immediate caution required.',
        };
      case 'HIGH':
        return {
          color: 'text-amber-400',
          bgBadge: 'bg-amber-950/60 border-amber-600/50 text-amber-300',
          gaugeBg: 'bg-amber-500',
          glow: 'shadow-amber-900/30',
          icon: AlertTriangle,
          label: 'HIGH RISK',
          sub: 'Multiple suspicious deception patterns detected. Do not click links or share codes.',
        };
      case 'MEDIUM':
        return {
          color: 'text-yellow-400',
          bgBadge: 'bg-yellow-950/60 border-yellow-600/50 text-yellow-300',
          gaugeBg: 'bg-yellow-500',
          glow: 'shadow-yellow-900/30',
          icon: AlertTriangle,
          label: 'MEDIUM RISK',
          sub: 'Ambiguous or pressured characteristics. Verify independently before proceeding.',
        };
      case 'LOW':
      default:
        return {
          color: 'text-emerald-400',
          bgBadge: 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300',
          gaugeBg: 'bg-emerald-500',
          glow: 'shadow-emerald-900/30',
          icon: ShieldCheck,
          label: 'LOW RISK',
          sub: 'Standard transactional message. No high-risk extraction patterns detected.',
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  const getSourceLabel = () => {
    if (demo_mode || analysis_source === 'demo') {
      return {
        text: 'Demo Mode — Synthetic Example',
        badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50',
      };
    }
    if (analysis_source === 'gemini') {
      return {
        text: 'Gemini AI Semantic Analysis',
        badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-700/50',
      };
    }
    return {
      text: 'AI service unavailable — local safety analysis',
      badge: 'bg-amber-950/70 text-amber-300 border-amber-700/50',
    };
  };

  const sourceConfig = getSourceLabel();

  return (
    <div
      id="risk-meter-card"
      className={`w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden ${config.glow}`}
    >
      {/* Top badges bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Category:
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200">
            {classification}
          </span>
        </div>

        {/* Transparent source badge */}
        <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${sourceConfig.badge}`}>
          {sourceConfig.text}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          {/* Radial / Boxed score display */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            <div className="text-center">
              <span className={`text-3xl font-extrabold tracking-tight ${config.color}`}>
                {risk_score}
              </span>
              <span className="text-xs text-slate-500 font-mono block">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${config.bgBadge}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{config.label}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 max-w-md leading-relaxed">
              {config.sub}
            </p>
          </div>
        </div>

        {/* AI Analysis Confidence Card */}
        <div className="w-full md:w-auto bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 min-w-[220px]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">AI analysis confidence:</span>
            <span className="font-mono font-bold text-cyan-300">
              {Math.round(ai_confidence * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, ai_confidence * 100))}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Confidence in semantic signal extraction
          </span>
        </div>
      </div>

      {/* Linear Visual Risk Scale Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/60">
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
          <span>0 (SAFE)</span>
          <span className="text-emerald-400">LOW (0-29)</span>
          <span className="text-yellow-400">MEDIUM (30-59)</span>
          <span className="text-amber-400">HIGH (60-79)</span>
          <span className="text-red-400">CRITICAL (80-100)</span>
          <span>100</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden relative">
          <div
            className={`h-full ${config.gaugeBg} rounded-full transition-all duration-700`}
            style={{ width: `${Math.max(5, risk_score)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
