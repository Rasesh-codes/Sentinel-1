import React from 'react';
import { Link2, ShieldAlert, Lock, AlertTriangle, ExternalLink } from 'lucide-react';
import { DetectedUrlInfo } from '../types';

interface UrlInspectorProps {
  detectedUrls: DetectedUrlInfo[];
}

export const UrlInspector: React.FC<UrlInspectorProps> = ({ detectedUrls }) => {
  if (!detectedUrls || detectedUrls.length === 0) {
    return null;
  }

  return (
    <div
      id="url-inspector-card"
      className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center space-x-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <Link2 className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            SAFE URL SECURITY INSPECTOR
          </h3>
          <p className="text-xs text-slate-400">
            Pure text-based link parsing. ScamShield NEVER fetches or resolves remote links.
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {detectedUrls.map((url, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-slate-200 truncate select-all bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {url.raw_url}
                </span>
                {url.is_shortened && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                    Shortened URL
                  </span>
                )}
                {!url.is_https && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-950 text-red-300 border border-red-800">
                    Insecure HTTP
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                <span>Domain:</span>
                <strong className="text-slate-300 font-mono">{url.domain}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-600/30 text-amber-300 text-[11px] flex-shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span>{url.safety_note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
