import React, { useState } from 'react';
import {
  Menu,
  X,
  ShieldCheck,
  HelpCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { SentinelLogo } from '../brand/SentinelLogo';

export type NavTab = 'overview' | 'check' | 'history' | 'how_it_works';

interface TopNavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPrivacy?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenPrivacy,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview' as NavTab, label: 'Scan' },
    { id: 'how_it_works' as NavTab, label: 'How It Works' },
    { id: 'history' as NavTab, label: 'History' },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5F1DF]/90 backdrop-blur-md border-b border-[#D8D3BC] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand Logo + SENTINEL */}
        <button
          type="button"
          onClick={() => handleTabClick('overview')}
          className="flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <SentinelLogo size="sm" showWordmark={true} showTagline={false} />
        </button>

        {/* Center: Subtle Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF8EF] p-1 rounded-xl border border-[#D8D3BC]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#20231F] border border-[#D8D3BC] shadow-xs'
                    : 'text-[#62665D] hover:text-[#20231F] hover:bg-[#FFFFFF]/60 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#536B4F]" />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}

          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#62665D] hover:text-[#20231F] hover:bg-[#FFFFFF]/60 border border-transparent transition-all duration-150 cursor-pointer flex items-center gap-1"
            >
              <span>Why Sentinel</span>
            </button>
          )}
        </nav>

        {/* Right: Small Security Status Indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8EF] border border-[#D8D3BC] text-xs font-medium text-[#20231F]">
            <span className="w-2 h-2 rounded-full bg-[#4F8061] animate-pulse" />
            <span className="font-['Manrope'] font-semibold text-[11px] tracking-wide text-[#20231F]">
              Protection Ready
            </span>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8EF] border border-[#D8D3BC] text-[10px] font-medium text-[#20231F] mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F8061]" />
            <span>Ready</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-[#FAF8EF] border border-[#D8D3BC] text-[#62665D] hover:text-[#20231F] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8EF] border-b border-[#D8D3BC] px-4 pt-3 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#20231F] border border-[#D8D3BC]'
                      : 'text-[#62665D] hover:text-[#20231F] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#536B4F]" />
                  )}
                </button>
              );
            })}

            {onOpenPrivacy && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPrivacy();
                }}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-medium text-left text-[#62665D] hover:text-[#20231F] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
              >
                Why Sentinel (Privacy Architecture)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
