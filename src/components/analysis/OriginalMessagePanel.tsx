import React, { useMemo } from 'react';
import { Copy, Check, FileText, CheckCircle2 } from 'lucide-react';
import { ValidatedEvidence } from '../../types';

interface OriginalMessagePanelProps {
  originalText: string;
  evidence: ValidatedEvidence[];
  selectedEvidenceIndex: number | null;
  selectedTactic: string | null;
  onSelectEvidence: (index: number | null) => void;
}

export const OriginalMessagePanel: React.FC<OriginalMessagePanelProps> = ({
  originalText,
  evidence,
  selectedEvidenceIndex,
  selectedTactic,
  onSelectEvidence,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(originalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  // Find occurrences of verified evidence text in the original string
  const renderedMessageParts = useMemo(() => {
    if (!evidence || evidence.length === 0 || !originalText) {
      return [{ text: originalText, isHighlighted: false, evidenceIndex: -1 }];
    }

    // Collect all valid spans
    const spans: { start: number; end: number; index: number; tactic: string }[] = [];

    evidence.forEach((ev, idx) => {
      const needle = ev.text.trim();
      if (!needle) return;

      let pos = 0;
      while (pos < originalText.length) {
        const found = originalText.toLowerCase().indexOf(needle.toLowerCase(), pos);
        if (found === -1) break;

        spans.push({
          start: found,
          end: found + needle.length,
          index: idx,
          tactic: ev.tactic,
        });
        pos = found + needle.length;
      }
    });

    if (spans.length === 0) {
      return [{ text: originalText, isHighlighted: false, evidenceIndex: -1 }];
    }

    // Sort spans by start index
    spans.sort((a, b) => a.start - b.start);

    // Filter overlapping spans
    const nonOverlapping: typeof spans = [];
    let lastEnd = 0;
    for (const span of spans) {
      if (span.start >= lastEnd) {
        nonOverlapping.push(span);
        lastEnd = span.end;
      }
    }

    const parts: {
      text: string;
      isHighlighted: boolean;
      evidenceIndex: number;
      tactic?: string;
    }[] = [];

    let currentCursor = 0;
    for (const span of nonOverlapping) {
      if (span.start > currentCursor) {
        parts.push({
          text: originalText.slice(currentCursor, span.start),
          isHighlighted: false,
          evidenceIndex: -1,
        });
      }

      parts.push({
        text: originalText.slice(span.start, span.end),
        isHighlighted: true,
        evidenceIndex: span.index,
        tactic: span.tactic,
      });

      currentCursor = span.end;
    }

    if (currentCursor < originalText.length) {
      parts.push({
        text: originalText.slice(currentCursor),
        isHighlighted: false,
        evidenceIndex: -1,
      });
    }

    return parts;
  }, [originalText, evidence]);

  return (
    <div
      id="original-message-panel"
      className="bg-[#FFFFFF] border border-[#D8D3BC] rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col justify-between select-none"
    >
      <div>
        {/* Document Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D8D3BC]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#536B4F]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#20231F] font-semibold">
              EVIDENCE HIGHLIGHTED IN MESSAGE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-[#62665D] hover:text-[#20231F] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg bg-[#FAF8EF] border border-[#D8D3BC] cursor-pointer"
              title="Copy message"
            >
              {copied ? <Check className="w-3 h-3 text-[#4F8061]" /> : <Copy className="w-3 h-3" />}
              <span className="text-[10px] font-mono">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Message Document View with Clear Verbatim Highlighting */}
        <div className="p-4 rounded-xl bg-[#FAF8EF] border border-[#D8D3BC] font-mono text-xs leading-relaxed text-[#20231F] whitespace-pre-wrap select-text max-h-[360px] overflow-y-auto">
          {renderedMessageParts.map((part, idx) => {
            if (!part.isHighlighted) {
              return <span key={idx}>{part.text}</span>;
            }

            const isSelected =
              selectedEvidenceIndex === part.evidenceIndex ||
              (selectedTactic !== null && part.tactic === selectedTactic);

            return (
              <mark
                key={idx}
                onClick={() =>
                  onSelectEvidence(
                    selectedEvidenceIndex === part.evidenceIndex ? null : part.evidenceIndex
                  )
                }
                className={`cursor-pointer rounded px-1.5 py-0.5 font-semibold transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#B65353]/30 text-[#A83F47] ring-2 ring-[#B65353]'
                    : 'bg-[#E5D7A3] text-[#20231F] hover:bg-[#D8C78B]'
                }`}
                title={`Evidence phrase: "${part.text}"`}
              >
                {part.text}
              </mark>
            );
          })}
        </div>
      </div>

      {/* Verifiable Excerpt Count Badge */}
      <div className="mt-4 pt-3 border-t border-[#D8D3BC] flex items-center justify-between text-xs font-mono text-[#62665D]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4F8061]" />
          <span>{evidence.length} verified verbatim phrases</span>
        </div>
        <span className="text-[10px] text-[#8C9287]">Exact quotes from original text</span>
      </div>
    </div>
  );
};
