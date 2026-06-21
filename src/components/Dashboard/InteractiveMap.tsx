"use client";

import React from "react";
import { Layers } from "lucide-react";
import { CityData, CITIES } from "@/lib/data";

interface InteractiveMapProps {
  selectedCity: CityData;
  onCitySelect: (city: CityData) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ selectedCity, onCitySelect }) => {
  return (
    <div className="glass-panel p-5 rounded-xl border border-white/10 flex-1 flex flex-col relative w-full h-full">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div>
          <h3 className="text-sm font-orbitron font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-orange" />
            Satellite Subcontinent Heatmap
          </h3>
          <span className="text-[10px] font-mono text-white/40 uppercase">
            TROPOMI Formaldehyde (HCHO) Column Density Fused with surface particulates
          </span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-white/40">AQI:</span>
          <div className="flex h-2 w-20 rounded overflow-hidden">
            <div className="w-1/4 bg-emerald-500"></div>
            <div className="w-1/4 bg-yellow-400"></div>
            <div className="w-1/4 bg-orange"></div>
            <div className="w-1/4 bg-red-600"></div>
          </div>
          <span className="text-white/70">50 - 500+</span>
        </div>
      </div>

      <div className="flex-1 w-full relative flex items-center justify-center min-h-[400px]">
        <div className="absolute w-72 h-72 rounded-full border border-white/5 flex items-center justify-center animate-[spin_120s_linear_infinite] pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-dashed border-white/10" />
        </div>

        <svg
          viewBox="0 0 350 400"
          className="w-full h-full max-h-[500px] select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M175,40 L195,50 L205,45 L200,60 L215,62 L225,50 L220,70 L210,85 L225,95 L250,90 L275,120 L270,135 L285,145 L295,135 L300,150 L285,160 L280,180 L295,190 L280,195 L255,185 L250,190 L258,200 L250,210 L228,212 L215,225 L218,240 L235,248 L220,260 L208,245 L202,260 L200,285 L182,310 L168,340 L158,365 L158,380 L150,380 L145,355 L135,320 L128,300 L122,270 L115,250 L108,230 L108,210 L125,200 L115,190 L105,185 L95,195 L88,185 L98,170 L92,150 L105,145 L102,130 L120,130 L135,145 L145,130 L150,140 L158,110 L165,95 L158,80 L165,70 Z"
            fill="rgba(255, 255, 255, 0.02)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="glow-blue"
          />

          <circle cx="155" cy="130" r="50" fill="url(#delhi-heat)" className="animate-pulse opacity-85" style={{ animationDuration: "3s" }} />
          <circle cx="115" cy="255" r="30" fill="url(#mumbai-heat)" className="animate-pulse opacity-70" style={{ animationDuration: "4s" }} />
          <circle cx="250" cy="190" r="35" fill="url(#kolkata-heat)" className="animate-pulse opacity-75" style={{ animationDuration: "3.5s" }} />
          <circle cx="160" cy="325" r="25" fill="url(#south-heat)" className="animate-pulse opacity-60" style={{ animationDuration: "5s" }} />

          <defs>
            <radialGradient id="delhi-heat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4f00" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#03050a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mumbai-heat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff9e00" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#03050a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="kolkata-heat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#03050a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="south-heat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#03050a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {Object.values(CITIES).map((city) => {
            const markerX = (city.coords.x / 100) * 350;
            const markerY = (city.coords.y / 100) * 400;
            const isSelected = city.name === selectedCity.name;
            return (
              <g key={city.name} className="cursor-pointer group" onClick={() => onCitySelect(city)}>
                <circle cx={markerX} cy={markerY} r="18" fill="transparent" />
                {isSelected && (
                  <circle cx={markerX} cy={markerY} r="10" stroke={city.color} strokeWidth="1" fill="transparent" className="animate-ping" style={{ transformOrigin: `${markerX}px ${markerY}px`, animationDuration: "1.8s" }} />
                )}
                <circle cx={markerX} cy={markerY} r={isSelected ? "5" : "3.5"} fill={city.color} stroke="#ffffff" strokeWidth={isSelected ? "1.5" : "1"} className="transition-all duration-300 group-hover:scale-125" />
                <text x={markerX + 8} y={markerY + 3} fill={isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.6)"} className="text-[9px] font-mono font-bold tracking-tight select-none pointer-events-none transition-colors duration-300">
                  {city.name.split(" ")[1] || city.name} ({city.aqi})
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute top-2 left-2 p-2 bg-black/40 border border-white/5 rounded-lg text-[9px] font-mono flex flex-col gap-0.5 pointer-events-none">
          <span className="text-white/40">GRID RESOLUTION:</span>
          <span className="text-white">1.2 km² (Deep Fused)</span>
          <span className="text-white/40 mt-1">SWEEP CYCLE:</span>
          <span className="text-white">Every 24h (TROPOMI orbit)</span>
        </div>
      </div>
    </div>
  );
};
