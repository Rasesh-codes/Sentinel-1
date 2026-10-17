import React from 'react';
import { Info, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskPanelProps {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  classification: string;
  explanation: string;
}

export const RiskPanel: React.FC<RiskPanelProps> = ({
  score,
  level,
  classification,
  explanation,
}) => {
  // Light, warm semantic palette mapping
  const levelConfig = {
    LOW: {
      label: 'LOW RISK',
      color: '#4F8061',
      bgClass: 'bg-[#4F8061]/10',
      borderClass: 'border-[#4F8061]/30',
      textClass: 'text-[#4F8061]',
      shortVerdict: 'Looks normal. Stay aware.',
      description: 'Benign communication pattern detected',
    },
    MEDIUM: {
      label: 'CAUTION',
      color: '#B68A3E',
      bgClass: 'bg-[#B68A3E]/10',
      borderClass: 'border-[#B68A3E]/30',
      textClass: 'text-[#B68A3E]',
      shortVerdict: "Something doesn't add up.",
      description: 'Suspicious elements identified — verify before acting',
    },
    HIGH: {
      label: 'HIGH RISK',
      color: '#B65353',
      bgClass: 'bg-[#B65353]/10',
      borderClass: 'border-[#B65353]/30',
      textClass: 'text-[#B65353]',
      shortVerdict: 'Think before you respond.',
      description: 'Multiple deceptive tactics detected in this message',
    },
    CRITICAL: {
      label: 'CRITICAL RISK',
      color: '#A83F47',
      bgClass: 'bg-[#A83F47]/10',
      borderClass: 'border-[#A83F47]/30',
      textClass: 'text-[#A83F47]',
      shortVerdict: "Stop. Don't act yet.",
      description: 'Severe financial demand or credential threat pattern',
    },
  }[level];

  // Segmented meter markers
  const segments = [
    { id: 'LOW', label: 'LOW', range: '0–29', active: level === 'LOW', color: '#4F8061' },
    { id: 'MEDIUM', label: 'CAUTION', range: '30–59', active: level === 'MEDIUM', color: '#B68A3E' },
    { id: 'HIGH', label: 'HIGH', range: '60–79', active: level === 'HIGH', color: '#B65353' },
    { id: 'CRITICAL', label: 'CRITICAL', range: '80–100', active: level === 'CRITICAL', color: '#A83F47' },
  ];

  return (
    <div
      id="risk-assessment-panel"
      className="bg-[#FFFFFF] border border-[#D8D3BC] rounded-2xl p-5 sm:p-7 shadow-sm select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#D8D3BC]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: levelConfig.color }} />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#62665D] font-semibold">
            DETERMINISTIC EVALUATION
          </span>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider ${levelConfig.bgClass} ${levelConfig.borderClass} border ${levelConfig.textClass}`}
        >
          {levelConfig.label}
        </div>
      </div>

      {/* 1. HERO RISK SCORE */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-4">
        <div className="flex items-baseline gap-2">
          <span
            className="font-['Manrope'] text-5xl sm:text-6xl font-extrabold tracking-tight"
            style={{ color: levelConfig.color }}
          >
            {score}
          </span>
          <span className="text-sm text-[#62665D] font-mono">/ 100</span>
          <span className="text-sm font-semibold ml-2 font-mono" style={{ color: levelConfig.color }}>
            {levelConfig.label}
          </span>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs text-[#62665D] font-mono">Confidence Level</div>
          <div className="text-xs text-[#20231F] font-medium mt-0.5">{levelConfig.description}</div>
        </div>
      </div>

      {/* Segmented Horizontal Meter */}
      <div className="mb-5">
        <div className="grid grid-cols-4 gap-1.5 h-2 rounded-full overflow-hidden p-0.5 bg-[#FAF8EF] border border-[#D8D3BC]">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className={`h-full rounded-full transition-all duration-300 ${
                seg.active ? 'opacity-100' : 'opacity-25'
              }`}
              style={{ backgroundColor: seg.color }}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center mt-1.5">
          {segments.map((seg) => (
            <div key={seg.id} className="flex flex-col items-center">
              <span
                className={`text-[10px] font-mono font-semibold ${
                  seg.active ? 'text-[#20231F]' : 'text-[#8C9287]'
                }`}
              >
                {seg.label}
              </span>
              <span className="text-[9px] font-mono text-[#8C9287]">{seg.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ONE SHORT VERDICT */}
      <div className="p-4 rounded-xl bg-[#FAF8EF] border border-[#D8D3BC] mb-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#536B4F] font-semibold mb-1">
          VERDICT
        </div>
        <div className="text-base font-bold text-[#20231F] font-['Manrope'] leading-snug">
          {levelConfig.shortVerdict}
        </div>
        {classification && classification !== levelConfig.shortVerdict && (
          <div className="text-xs text-[#62665D] mt-1 font-medium">
            {classification}
          </div>
        )}
      </div>

      {/* Key context / explanation */}
      {explanation && (
        <div className="px-4 py-3 rounded-xl bg-[#FAF8EF]/60 border border-[#D8D3BC]/70">
          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono uppercase tracking-wider text-[#62665D]">
            <Info className="w-3.5 h-3.5 text-[#536B4F]" />
            <span>Why this matters</span>
          </div>
          <p className="text-xs text-[#42473F] leading-relaxed font-normal">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
