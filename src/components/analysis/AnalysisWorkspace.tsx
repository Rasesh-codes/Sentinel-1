import React, { useState } from 'react';
import { ArrowLeft, Users, ShieldAlert, Share2 } from 'lucide-react';
import { AnalyzeResponse } from '../../types';
import { RiskPanel } from './RiskPanel';
import { OriginalMessagePanel } from './OriginalMessagePanel';
import { RiskSignals } from './RiskSignals';
import { EvidenceFound } from './EvidenceFound';
import { ScoreBreakdown } from './ScoreBreakdown';
import { VerificationPipeline } from './VerificationPipeline';
import { ActionRecommendations } from './ActionRecommendations';
import { WarningShareModal } from './WarningShareModal';

interface AnalysisWorkspaceProps {
  result: AnalyzeResponse;
  onReset: () => void;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  result,
  onReset,
}) => {
  const [selectedEvidenceIndex, setSelectedEvidenceIndex] = useState<number | null>(null);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const {
    classification,
    risk_level,
    risk_score,
    explanation,
    validated_evidence,
    score_breakdown,
    recommended_actions,
  } = result;

  const originalMessageText = result.original_message || (result as any).original_text || '';
  const detectedTacticsList = result.detected_tactics || (result as any).tactics || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150 select-none">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8D3BC]">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8EF] text-[#20231F] border border-[#D8D3BC] text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Scan another message</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Protect Someone Else Primary CTA */}
          <button
            type="button"
            id="btn-create-warning"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#536B4F] hover:bg-[#435840] text-[#FFFFFF] font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Protect someone you care about</span>
          </button>
        </div>
      </div>

      {/* 1. RISK SCORE + 2. ONE SHORT VERDICT */}
      <RiskPanel
        score={risk_score}
        level={risk_level}
        classification={classification}
        explanation={explanation}
      />

      {/* 3. WHAT SENTINEL FOUND */}
      <RiskSignals
        tactics={detectedTacticsList}
        evidence={validated_evidence}
        selectedTactic={selectedTactic}
        onSelectTactic={(tac) => {
          setSelectedTactic(tac);
          setSelectedEvidenceIndex(null);
        }}
      />

      {/* 4. SHOW THE ACTUAL EVIDENCE (Highlighted Message + Quotes) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Original Message with Verbatim Highlights */}
        <div>
          <OriginalMessagePanel
            originalText={originalMessageText}
            evidence={validated_evidence}
            selectedEvidenceIndex={selectedEvidenceIndex}
            selectedTactic={selectedTactic}
            onSelectEvidence={(idx) => {
              setSelectedEvidenceIndex(idx);
              setSelectedTactic(null);
            }}
          />
        </div>

        {/* Right: Verified Evidence Quotes */}
        <div>
          <EvidenceFound
            evidence={validated_evidence}
            selectedEvidenceIndex={selectedEvidenceIndex}
            onSelectEvidence={(idx) => {
              setSelectedEvidenceIndex(idx);
              setSelectedTactic(null);
            }}
          />
        </div>
      </div>

      {/* 5. WHAT TO DO NOW (Max 3 concise actions) */}
      <ActionRecommendations actions={recommended_actions} />

      {/* PROTECT SOMEONE ELSE BANNER */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D3BC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-[#20231F] font-['Manrope']">
            Protect someone you care about
          </div>
          <div className="text-xs text-[#62665D]">
            Share a simple, polite warning with someone who might need it.
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8EF] hover:bg-[#FFFFFF] text-[#20231F] border border-[#D8D3BC] hover:border-[#536B4F] text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5 text-[#536B4F]" />
          <span>Share Warning</span>
        </button>
      </div>

      {/* Transparency: Pipeline & Mathematical Score Breakdown */}
      <div className="space-y-4 pt-2">
        <VerificationPipeline completed={true} />
        <ScoreBreakdown
          breakdown={score_breakdown}
          totalScore={risk_score}
        />
      </div>

      {/* Share / Warning Modal */}
      <WarningShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={result}
      />
    </div>
  );
};
