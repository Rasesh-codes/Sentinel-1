import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#D8D3BC] rounded-2xl p-6 shadow-xl space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#62665D] hover:text-[#20231F] hover:bg-[#FAF8EF] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FAF8EF] text-[#536B4F] border border-[#D8D3BC]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#20231F] font-['Manrope']">
              Privacy Architecture
            </h3>
            <p className="text-xs text-[#62665D]">
              How SENTINEL protects your communications
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[#62665D] leading-relaxed pt-2 border-t border-[#D8D3BC]">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8EF] border border-[#D8D3BC]">
            <ServerOff className="w-4 h-4 text-[#536B4F] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#20231F] font-semibold block mb-0.5">
                In-Memory Analysis
              </span>
              Messages submitted for risk evaluation are processed entirely in-memory and discarded upon completion of the request.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8EF] border border-[#D8D3BC]">
            <EyeOff className="w-4 h-4 text-[#536B4F] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#20231F] font-semibold block mb-0.5">
                No Public Model Training
              </span>
              User inputs are never contributed to public AI model training pools or shared with third-party advertisers.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8EF] border border-[#D8D3BC]">
            <Lock className="w-4 h-4 text-[#536B4F] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#20231F] font-semibold block mb-0.5">
                Client-Side History
              </span>
              Your analysis history is stored only in your local browser storage and can be wiped instantly with one click.
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FAF8EF] hover:bg-[#FFFFFF] text-[#20231F] text-xs font-semibold border border-[#D8D3BC] cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
