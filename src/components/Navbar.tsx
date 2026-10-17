import React from 'react';
import { Shield, ShieldAlert, Cpu, Globe, Info } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface NavbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  serverStatus: {
    ready: boolean;
    gemini: boolean;
    python: boolean;
  };
  onOpenPrinciples: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  serverStatus,
  onOpenPrinciples,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">
                SCAMSHIELD <span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                UPAI-Hackdays 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Explainable AI Safety & Deterministic Risk Engine
            </p>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Status Indicator */}
          <div
            id="status-pill"
            className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
            title={
              serverStatus.gemini
                ? 'Connected to Gemini 3.8 Flash & Python Risk Engine'
                : 'Python Risk Engine Ready (Local fallback active)'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                serverStatus.ready ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] font-medium text-slate-300">
              {serverStatus.gemini ? 'Gemini 3.8 + Python Engine' : 'Python Risk Engine Active'}
            </span>
          </div>

          {/* Architecture / Principles button */}
          <button
            id="btn-architecture-info"
            onClick={onOpenPrinciples}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">How It Works</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              id="language-select"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none pr-2 py-0.5 cursor-pointer"
            >
              <option value="en" className="bg-slate-900 text-white">
                English
              </option>
              <option value="hi" className="bg-slate-900 text-white">
                हिन्दी (Hindi)
              </option>
              <option value="hinglish" className="bg-slate-900 text-white">
                Hinglish
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
