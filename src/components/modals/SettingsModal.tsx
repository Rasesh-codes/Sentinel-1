import React from 'react';
import { X, Globe, Settings, Cpu, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onChangeLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#11161D] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-2xl space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#66727F] hover:text-[#F4F7FA] hover:bg-[#171D25] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#171D25] text-[#7CE38B] border border-[rgba(255,255,255,0.06)]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F4F7FA] font-['Manrope']">
              Platform Settings
            </h3>
            <p className="text-xs text-[#9AA6B2]">
              Analysis preferences and engine diagnostics
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-[rgba(255,255,255,0.06)] text-xs">
          <div>
            <label className="block text-[11px] font-mono text-[#9AA6B2] mb-1.5">
              Default Target Language
            </label>
            <div className="grid grid-cols-3 gap-2">
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
                  className={`py-2 px-3 rounded-xl font-medium transition-all text-center ${
                    language === opt.id
                      ? 'bg-[#171D25] border border-[#7CE38B] text-[#7CE38B]'
                      : 'bg-[#171D25] border border-[rgba(255,255,255,0.06)] text-[#9AA6B2] hover:text-[#F4F7FA]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#171D25] border border-[rgba(255,255,255,0.05)] space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#7CE38B]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Engine Status</span>
            </div>
            <div className="text-[11px] text-[#9AA6B2] leading-relaxed">
              SENTINEL v2.0 deterministic pipeline active. Backend endpoint: <code className="text-[#F4F7FA] font-mono">/api/analyze</code>.
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#7CE38B] hover:bg-[#72E6A5] text-[#0B0F14] text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
