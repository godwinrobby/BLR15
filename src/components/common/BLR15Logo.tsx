import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BLR15Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  showTagline = true,
  size = 'md',
}) => {
  const isWhite = variant === 'white';
  const navyColor = isWhite ? '#FFFFFF' : '#0B1B3D';
  const amberColor = '#D98200'; // Exact warm gold hue from uploaded BLR15 logo
  const goldWaveColor = '#E59114';
  const taglineColor = isWhite ? '#CBD5E1' : '#0B1B3D';
  const ruleLineColor = isWhite ? '#E59114' : '#C48118';

  // Height mappings based on size prop
  const heightClass =
    size === 'sm'
      ? 'h-8 sm:h-9'
      : size === 'lg'
      ? 'h-12 sm:h-14 md:h-16'
      : 'h-10 sm:h-12';

  // If tagline is hidden, crop the bottom viewbox for tighter alignment
  const viewBox = showTagline ? '0 0 460 120' : '0 0 460 96';

  return (
    <div className={`inline-flex flex-col justify-center select-none ${className}`}>
      <svg
        viewBox={viewBox}
        className={`${heightClass} w-auto max-w-full drop-shadow-xs transition-transform duration-200`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="BLR15 Home Loans - Your Dream Home, Our Commitment"
      >
        {/* ========================================================= */}
        {/* LEFT EMBLEM: House Icon with Chimney, Window & Swoosh     */}
        {/* ========================================================= */}
        <g id="house-emblem">
          {/* Main Roof Gable & House Body */}
          <path
            d="M 52 10 L 9 52 L 23 52 L 23 88 L 81 88 L 81 52 L 95 52 Z"
            fill={navyColor}
          />

          {/* Roof Chimney */}
          <path
            d="M 68 28 L 68 18 L 78 18 L 78 37 Z"
            fill={navyColor}
          />

          {/* Attic Triangle Cutout */}
          <path
            d="M 52 26 L 33 46 L 71 46 Z"
            fill={isWhite ? '#0B1B3D' : '#FFFFFF'}
          />

          {/* 4-Pane Window Grid */}
          <rect x="36" y="55" width="13" height="12" rx="1.5" fill={isWhite ? '#0B1B3D' : '#FFFFFF'} />
          <rect x="53" y="55" width="13" height="12" rx="1.5" fill={isWhite ? '#0B1B3D' : '#FFFFFF'} />
          <rect x="36" y="70" width="13" height="12" rx="1.5" fill={isWhite ? '#0B1B3D' : '#FFFFFF'} />
          <rect x="53" y="70" width="13" height="12" rx="1.5" fill={isWhite ? '#0B1B3D' : '#FFFFFF'} />

          {/* Golden Dynamic Swoosh Wave Base */}
          <path
            d="M 2 86 C 18 78, 38 88, 62 82 C 84 76, 98 62, 106 59 C 104 68, 92 84, 68 88 C 42 93, 20 90, 2 86 Z"
            fill={goldWaveColor}
          />
        </g>

        {/* ========================================================= */}
        {/* TYPOGRAPHY: BLR (Navy) + 15 (Golden Honey)                */}
        {/* ========================================================= */}
        <g id="brand-typography">
          {/* Letter 'B' */}
          <text
            x="116"
            y="78"
            fill={navyColor}
            fontFamily="'Impact', 'Arial Black', 'Outfit', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="-1"
          >
            B
          </text>

          {/* Letter 'L' */}
          <text
            x="184"
            y="78"
            fill={navyColor}
            fontFamily="'Impact', 'Arial Black', 'Outfit', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="-1"
          >
            L
          </text>

          {/* Letter 'R' */}
          <text
            x="244"
            y="78"
            fill={navyColor}
            fontFamily="'Impact', 'Arial Black', 'Outfit', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="-1"
          >
            R
          </text>

          {/* Number '1' */}
          <text
            x="320"
            y="78"
            fill={amberColor}
            fontFamily="'Impact', 'Arial Black', 'Outfit', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="-1"
          >
            1
          </text>

          {/* Number '5' */}
          <text
            x="368"
            y="78"
            fill={amberColor}
            fontFamily="'Impact', 'Arial Black', 'Outfit', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="-1"
          >
            5
          </text>
        </g>

        {/* ========================================================= */}
        {/* TAGLINE: YOUR DREAM HOME, OUR COMMITMENT                  */}
        {/* ========================================================= */}
        {showTagline && (
          <g id="brand-tagline">
            {/* Left Accent Rule Line */}
            <line
              x1="38"
              y1="102"
              x2="78"
              y2="102"
              stroke={ruleLineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Centered Tagline */}
            <text
              x="248"
              y="106"
              textAnchor="middle"
              fill={taglineColor}
              fontFamily="'Outfit', 'Plus Jakarta Sans', 'Segoe UI', sans-serif"
              fontWeight="800"
              fontSize="14.5"
              letterSpacing="3.5"
            >
              YOUR DREAM HOME, OUR COMMITMENT
            </text>

            {/* Right Accent Rule Line */}
            <line
              x1="418"
              y1="102"
              x2="456"
              y2="102"
              stroke={ruleLineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
