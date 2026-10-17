import React from 'react';

interface SentinelLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * SENTINEL Brand Logo
 * Minimal, distinctive mark representing:
 * PAUSE (dual precision vertical pillars) + VERIFY (central aperture nexus) + PROTECTION (architectural perimeter)
 * Styled in Dark Charcoal and Deep Emerald (#147A55 / #1B9A6A).
 */
export const SentinelLogo: React.FC<SentinelLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  animated = false,
  className = '',
}) => {
  const iconDimensions = {
    xs: 18,
    sm: 22,
    md: 28,
    lg: 36,
    xl: 48,
  }[size];

  const wordmarkSizes = {
    xs: 'text-xs tracking-wider',
    sm: 'text-sm tracking-wide',
    md: 'text-base sm:text-lg tracking-tight font-bold',
    lg: 'text-xl sm:text-2xl tracking-tight font-extrabold',
    xl: 'text-2xl sm:text-3xl tracking-tight font-extrabold',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Symbol: PAUSE + VERIFY + PROTECTION */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: iconDimensions, height: iconDimensions }}
      >
        <svg
          width={iconDimensions}
          height={iconDimensions}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? 'animate-pulse' : ''}
          aria-label="SENTINEL Logo"
        >
          {/* Outer Protective Perimeter (rx 7) */}
          <rect
            x="1.5"
            y="1.5"
            width="29"
            height="29"
            rx="7"
            fill="#FCFAF3"
            stroke="#DCD5BE"
            strokeWidth="1.25"
          />

          {/* Left Vertical Pillar (Pause element 1) */}
          <rect
            x="9.5"
            y="8.5"
            width="3.5"
            height="15"
            rx="1.75"
            fill="#136343"
          />

          {/* Right Vertical Pillar (Pause element 2) */}
          <rect
            x="19"
            y="8.5"
            width="3.5"
            height="15"
            rx="1.75"
            fill="#1B7A53"
          />

          {/* Central Verification Aperture Nexus */}
          <circle
            cx="16"
            cy="16"
            r="2"
            fill="#20231F"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-['Manrope'] font-bold text-[#20231F] ${wordmarkSizes}`}
            >
              SENTINEL
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] font-['Inter'] font-normal text-[#4D534C] tracking-normal mt-0.5">
              Think twice. Click once.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
