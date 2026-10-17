import React from 'react';
import {
  CreditCard,
  Clock,
  ShieldAlert,
  Building,
  KeyRound,
  ExternalLink,
  Receipt,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { ValidatedEvidence } from '../../types';

interface RiskSignalsProps {
  tactics: string[];
  evidence: ValidatedEvidence[];
  selectedTactic: string | null;
  onSelectTactic: (tactic: string | null) => void;
}

const TACTIC_METADATA: Record<
  string,
  {
    name: string;
    icon: React.FC<{ className?: string }>;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }
> = {
  FINANCIAL_REQUEST: {
    name: 'Payment Request',
    icon: CreditCard,
    severity: 'HIGH',
  },
  URGENCY: {
    name: 'Artificial Urgency',
    icon: Clock,
    severity: 'MEDIUM',
  },
  THREAT: {
    name: 'Consequence Threat',
    icon: ShieldAlert,
    severity: 'HIGH',
  },
  AUTHORITY_IMPERSONATION: {
    name: 'Authority Impersonation',
    icon: Building,
    severity: 'HIGH',
  },
  OTP_REQUEST: {
    name: 'OTP / PIN Demand',
    icon: KeyRound,
    severity: 'CRITICAL',
  },
  EXTERNAL_ACTION: {
    name: 'Suspicious Link',
    icon: ExternalLink,
    severity: 'MEDIUM',
  },
  PAYMENT_PROOF: {
    name: 'Payment Proof Request',
    icon: Receipt,
    severity: 'MEDIUM',
  },
};

export const RiskSignals: React.FC<RiskSignalsProps> = ({
  tactics,
  evidence,
  selectedTactic,
  onSelectTactic,
}) => {
  if (!tactics || tactics.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D8D3BC] text-xs text-[#62665D]">
        No high-risk deception patterns detected in this text.
      </div>
    );
  }

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#20231F] font-semibold">
            WHAT SENTINEL FOUND
          </span>
          <span className="text-[10px] font-mono text-[#536B4F] bg-[#536B4F]/10 px-2 py-0.5 rounded border border-[#536B4F]/30 font-bold">
            {tactics.length} tactics
          </span>
        </div>
        <span className="text-[11px] text-[#8C9287] font-mono">
          Select chip to highlight
        </span>
      </div>

      {/* Compact Visual Chips / Cards (Avoid paragraphs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tactics.map((tac) => {
          const meta = TACTIC_METADATA[tac] || {
            name: tac.replace(/_/g, ' '),
            icon: AlertCircle,
            severity: 'MEDIUM',
          };
          const Icon = meta.icon;
          const isSelected = selectedTactic === tac;
          const matchingEvidence = evidence.filter((e) => e.tactic === tac);

          return (
            <button
              key={tac}
              type="button"
              onClick={() => onSelectTactic(isSelected ? null : tac)}
              className={`p-3 rounded-xl text-left transition-all duration-150 border flex items-center justify-between gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#536B4F] ring-2 ring-[#536B4F]/30 shadow-xs'
                  : 'bg-[#FFFFFF] hover:bg-[#FAF8EF] border-[#D8D3BC]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    meta.severity === 'CRITICAL'
                      ? 'bg-[#A83F47]/10 text-[#A83F47]'
                      : meta.severity === 'HIGH'
                      ? 'bg-[#B65353]/10 text-[#B65353]'
                      : 'bg-[#B68A3E]/10 text-[#B68A3E]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-[#20231F] font-['Manrope'] truncate">
                    {meta.name}
                  </div>
                  {matchingEvidence.length > 0 && (
                    <div className="text-[10px] text-[#62665D] font-mono truncate">
                      "{matchingEvidence[0].text}"
                    </div>
                  )}
                </div>
              </div>

              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold shrink-0 ${
                  meta.severity === 'CRITICAL'
                    ? 'bg-[#A83F47]/10 text-[#A83F47] border border-[#A83F47]/20'
                    : meta.severity === 'HIGH'
                    ? 'bg-[#B65353]/10 text-[#B65353] border border-[#B65353]/20'
                    : 'bg-[#B68A3E]/10 text-[#B68A3E] border border-[#B68A3E]/20'
                }`}
              >
                {meta.severity}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
