"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Radio } from "lucide-react";

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString("en-US", { hour12: false }) +
          " IST | " +
          d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="z-20 h-16 border-b border-white/10 glass-panel flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_5px_rgba(255,106,0,0.5)]">
              <path d="M 50,85 C 50,75 52,60 58,40 L 50,15 L 42,40 C 48,60 50,75 50,85 Z" fill="#FF6A00" />
              <path d="M 50,75 C 40,75 30,70 25,60 C 28,70 38,80 50,81 Z" fill="#0054A6" />
              <path d="M 50,75 C 60,75 70,70 75,60 C 72,70 62,80 50,81 Z" fill="#0054A6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-extrabold tracking-widest text-base text-white">
              BHARAT<span className="text-orange glow-text-orange">AQI</span>
            </span>
            <span className="text-[9px] tracking-widest text-white/50 uppercase font-mono">
              SATELLITE ENVIRONMENTAL INTELLIGENCE
            </span>
          </div>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 ml-10">
        <Link href="/missioncontrol" className="text-xs font-orbitron font-bold tracking-widest text-white/60 hover:text-orange transition-colors">
          MISSION CONTROL
        </Link>
        <Link href="/aqidata" className="text-xs font-orbitron font-bold tracking-widest text-white/60 hover:text-orange transition-colors">
          AQI DATA
        </Link>
      </nav>

      <div className="hidden lg:flex items-center gap-6 text-[10px] font-mono">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          TROPOMI S5P: ACTIVE
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          MODIS FIRE LINK: SYNCED
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-white/70 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
          <Clock className="w-3.5 h-3.5 text-orange-flame" />
          <span>{currentTime || "00:00:00 IST"}</span>
        </div>
      </div>
    </header>
  );
};
