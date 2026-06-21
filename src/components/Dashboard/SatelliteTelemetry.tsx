"use client";

import React, { useState, useEffect } from "react";
import { Satellite } from "lucide-react";

export const SatelliteTelemetry: React.FC = () => {
  const [satelliteAngle, setSatelliteAngle] = useState(0);
  const [telemetryState, setTelemetryState] = useState({
    altitude: 824.2,
    speed: 7.55,
    latency: 84,
  });

  useEffect(() => {
    const anim = requestAnimationFrame(function rotate() {
      setSatelliteAngle((prev) => (prev + 0.3) % 360);
      requestAnimationFrame(rotate);
    });
    const interval = setInterval(() => {
      setTelemetryState((prev) => ({
        altitude: parseFloat((prev.altitude + (Math.random() - 0.5) * 0.05).toFixed(3)),
        speed: parseFloat((prev.speed + (Math.random() - 0.5) * 0.002).toFixed(3)),
        latency: Math.floor(80 + Math.random() * 10),
      }));
    }, 4000);
    return () => {
      cancelAnimationFrame(anim);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col gap-3 relative">
      <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-orange-flame flex items-center gap-1.5">
        <Satellite className="w-3.5 h-3.5 text-orange" />
        S5P Orbit Vector
      </h3>

      <div className="h-40 bg-white/[0.02] border border-white/5 rounded-lg relative overflow-hidden flex items-center justify-center">
        <div className="absolute w-48 h-48 rounded-full border border-dashed border-white/10" />
        <div className="w-16 h-16 rounded-full bg-blue-isro/30 border border-blue-light/50 flex items-center justify-center text-[10px] font-bold font-mono">
          EARTH
        </div>
        <div
          className="absolute w-3 h-3 bg-orange rounded-full border border-white shadow-[0_0_5px_#ff6a00]"
          style={{
            transform: `rotate(${satelliteAngle}deg) translate(35px) rotate(-${satelliteAngle}deg)`,
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="p-2 bg-white/5 rounded border border-white/5">
          <span className="text-white/40 uppercase block">ALTITUDE</span>
          <span className="text-white font-bold">{telemetryState.altitude} KM</span>
        </div>
        <div className="p-2 bg-white/5 rounded border border-white/5">
          <span className="text-white/40 uppercase block">VELOCITY</span>
          <span className="text-white font-bold">{telemetryState.speed} KM/S</span>
        </div>
        <div className="p-2 bg-white/5 rounded border border-white/5">
          <span className="text-white/40 uppercase block">LATENCY</span>
          <span className="text-white font-bold text-emerald-400">{telemetryState.latency} MS</span>
        </div>
        <div className="p-2 bg-white/5 rounded border border-white/5">
          <span className="text-white/40 uppercase block">HEADING</span>
          <span className="text-white font-bold">148.5° SSE</span>
        </div>
      </div>
    </div>
  );
};
