import React, { useState } from 'react';
import { TopNavbar, NavTab } from './components/navigation/TopNavbar';
import { HeroSection } from './components/dashboard/HeroSection';
import { MessageInputCard } from './components/dashboard/MessageInputCard';
import { AnalysisWorkspace } from './components/analysis/AnalysisWorkspace';
import { AnalysisLoadingTransition } from './components/analysis/AnalysisLoadingTransition';
import { HistoryView } from './components/history/HistoryView';
import { HowItWorksView } from './components/howitworks/HowItWorksView';
import { PrivacyModal } from './components/modals/PrivacyModal';
import { AnalyzeResponse, SupportedLanguage, HistoryItem } from './types';

export default function App() {
  // App Navigation & Workspace State
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [message, setMessage] = useState<string>('');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  // Modals
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Local Audit History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved =
        localStorage.getItem('sentinel_audit_history') ||
        localStorage.getItem('vera_audit_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Perform Analysis
  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please paste a message to inspect.');
      return;
    }

    const textToAnalyze = message.trim();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToAnalyze,
          language,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data: AnalyzeResponse = await response.json();
      setResult(data);

      // Save to local history
      const historyItem: HistoryItem = {
        id: 'chk_' + Date.now(),
        timestamp: Date.now(),
        message_preview:
          textToAnalyze.length > 70 ? textToAnalyze.substring(0, 70) + '...' : textToAnalyze,
        full_message: textToAnalyze,
        classification: data.classification,
        risk_level: data.risk_level,
        risk_score: data.risk_score,
        result: data,
      };

      setHistory((prev) => {
        const updated = [
          historyItem,
          ...prev.filter((h) => h.full_message !== textToAnalyze).slice(0, 30),
        ];
        localStorage.setItem('sentinel_audit_history', JSON.stringify(updated));
        return updated;
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Analysis failed:', err);
      setError("SENTINEL could not complete the scan. Please check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('sentinel_audit_history');
    localStorage.removeItem('vera_audit_history');
    setHistory([]);
  };

  // Reset to empty scan mode
  const handleNewScan = () => {
    setResult(null);
    setMessage('');
    setError(null);
    setActiveTab('check');
  };

  return (
    <div className="min-h-screen bg-[#F5F1DF] text-[#20231F] flex flex-col selection:bg-[#536B4F]/20 selection:text-[#20231F]">
      {/* Top Navbar */}
      <TopNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'check' && !result) {
            setError(null);
          }
        }}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* If loading is active, show the dedicated Security Analysis Transition */}
        {isLoading ? (
          <AnalysisLoadingTransition />
        ) : result && (activeTab === 'overview' || activeTab === 'check') ? (
          <AnalysisWorkspace result={result} onReset={handleNewScan} />
        ) : (
          <>
            {/* View Tab 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="w-full space-y-8 animate-in fade-in duration-150">
                <HeroSection
                  onCheckClick={() => {
                    const el = document.getElementById('check-message-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onHowItWorksClick={() => setActiveTab('how_it_works')}
                />

                <MessageInputCard
                  message={message}
                  onChangeMessage={(msg) => setMessage(msg)}
                  language={language}
                  onChangeLanguage={(lang) => setLanguage(lang)}
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            )}

            {/* View Tab 2: CHECK A MESSAGE */}
            {activeTab === 'check' && (
              <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
                <div className="pb-3 border-b border-[#D8D3BC]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#536B4F] font-semibold">
                    SECURITY SCANNER
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#20231F] mt-0.5">
                    Scan a Message
                  </h2>
                  <p className="text-xs text-[#62665D] mt-1">
                    Paste any suspicious message to extract verifiable evidence and compute its deterministic risk.
                  </p>
                </div>

                <MessageInputCard
                  message={message}
                  onChangeMessage={(msg) => setMessage(msg)}
                  language={language}
                  onChangeLanguage={(lang) => setLanguage(lang)}
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            )}

            {/* View Tab 3: HISTORY */}
            {activeTab === 'history' && (
              <HistoryView
                history={history}
                onSelectResult={(selectedResult) => {
                  setResult(selectedResult);
                  setActiveTab('check');
                }}
                onClearHistory={handleClearHistory}
                onNavigateToCheck={() => setActiveTab('check')}
              />
            )}

            {/* View Tab 4: HOW IT WORKS */}
            {activeTab === 'how_it_works' && (
              <HowItWorksView
                onCheckClick={() => {
                  setActiveTab('check');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Global Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
