"use client";

import React, { forwardRef } from "react";

interface SVGLogoProps {
  className?: string;
  id?: string;
}

export const SVGLogo = forwardRef<HTMLDivElement, SVGLogoProps>(
  ({ className = "", id }, ref) => {
    return (
      <div ref={ref} id={id} className={`flex flex-col items-center justify-center ${className}`}>
      {/* Reconstructed Vector ISRO Logo */}
      <svg
        viewBox="0 0 200 200"
        className="w-32 h-32 md:w-40 md:h-40 filter drop-shadow-[0_0_15px_rgba(45,156,219,0.15)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Glow Filters */}
        <defs>
          <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Globe (Central blue circle/semi-sphere) */}
        <path
          className="logo-globe fill-blue-isro opacity-0 origin-center"
          d="M 100,105 A 25,25 0 0,0 125,130 A 25,25 0 0,0 100,105 Z"
          fill="#0054A6"
        />
        <circle
          className="logo-globe-core fill-blue-light opacity-0 origin-center"
          cx="100"
          cy="117"
          r="10"
          fill="#2D9CDB"
        />

        {/* Blue Left Wing Element (Stylized Orbit/Wing) */}
        <path
          className="logo-left-wing fill-blue-isro opacity-0 origin-center"
          d="M 100,117 C 80,117 65,108 55,95 C 60,110 75,125 100,127 Z"
          fill="#0054A6"
        />
        <path
          className="logo-left-wing-accent fill-blue-light opacity-0 origin-center"
          d="M 100,120 C 85,120 73,113 65,103 C 70,113 82,123 100,124 Z"
          fill="#2D9CDB"
        />

        {/* Blue Right Wing Element (Stylized Orbit/Wing) */}
        <path
          className="logo-right-wing fill-blue-isro opacity-0 origin-center"
          d="M 100,117 C 120,117 135,108 145,95 C 140,110 125,125 100,127 Z"
          fill="#0054A6"
        />
        <path
          className="logo-right-wing-accent fill-blue-light opacity-0 origin-center"
          d="M 100,120 C 115,120 127,113 135,103 C 130,113 118,123 100,124 Z"
          fill="#2D9CDB"
        />

        {/* Central Orange Staitle/Arrow Shape (Prepared for detachment/rocket conversion) */}
        <g className="logo-staitle-group origin-center">
          {/* Flame/Ignition Core (behind staitle, visible during ignition) */}
          <path
            className="logo-staitle-flame fill-orange-flame opacity-0"
            d="M 100,135 L 96,145 L 100,152 L 104,145 Z"
            filter="url(#glow-orange)"
          />
          <path
            className="logo-staitle-flame-core fill-orange-core opacity-0"
            d="M 100,135 L 98,141 L 100,146 L 102,141 Z"
          />

          {/* Staitle Body */}
          <path
            className="logo-staitle fill-orange opacity-0"
            d="M 100,132 C 100,115 103,90 114,62 L 100,25 L 86,62 C 97,90 100,115 100,132 Z"
            fill="#FF6A00"
            filter="url(#glow-orange)"
          />
          {/* Staitle Core Streak (Adds visual depth) */}
          <path
            className="logo-staitle-core fill-orange-core opacity-0"
            d="M 100,125 C 100,112 102,93 108,70 L 100,45 L 92,70 C 98,93 100,112 100,125 Z"
            fill="#FFD15C"
          />
        </g>
      </svg>

      {/* Typography: ISRO Text below, styled to look modern, clean, aerospace-aligned */}
      <div className="logo-text flex items-center gap-1.5 mt-4 text-xl md:text-2xl font-orbitron tracking-[0.25em] pl-[0.25em] font-bold text-white/90">
        <span className="logo-text-letter opacity-0 inline-block hover:text-orange-flame transition-colors duration-300">I</span>
        <span className="logo-text-letter opacity-0 inline-block hover:text-orange-flame transition-colors duration-300">S</span>
        <span className="logo-text-letter opacity-0 inline-block hover:text-orange-flame transition-colors duration-300">R</span>
        <span className="logo-text-letter opacity-0 inline-block hover:text-orange-flame transition-colors duration-300">O</span>
      </div>
    </div>
  );
});

SVGLogo.displayName = "SVGLogo";
