"use client";

import React, { useState, useEffect, useRef } from "react";
import { StateSearch } from "./StateSearch";
import { AQIPredictorMode } from "./AQIPredictorMode";
import { RegionData, REGIONS } from "@/lib/regions";
import India from "@svg-maps/india";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Satellite,
  Compass,
  Flame,
  Radio,
  Clock,
  MapPin,
  Cpu,
  Layers,
  Database,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
interface LogEntry {
  id: string;
  time: string;
  type: "info" | "warn" | "success";
  text: string;
}

export const Dashboard: React.FC<{ initialMode?: "mission" | "predictor" }> = ({ initialMode = "mission" }) => {

  const activeMode = initialMode;
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(9);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stateParam = params.get("state");
      const monthParam = params.get("month");
      if (stateParam && REGIONS[stateParam]) setSelectedRegion(REGIONS[stateParam]);
      if (monthParam) {
        const m = parseInt(monthParam);
        if (!isNaN(m) && m >= 0 && m <= 11) setSelectedMonth(m);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && selectedRegion && 'id' in selectedRegion) {
      const url = new URL(window.location.href);
      url.searchParams.set("state", selectedRegion.id);
      url.searchParams.set("month", selectedMonth.toString());
      window.history.replaceState({}, "", url.toString());
    }
  }, [selectedRegion, selectedMonth]);

  const [currentTime, setCurrentTime] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [satelliteAngle, setSatelliteAngle] = useState(0);
  const [telemetryState, setTelemetryState] = useState({
    altitude: 824.2,
    speed: 7.55,
    latency: 84,
  });

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Time ticker
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

  // Log Stream Simulator
  useEffect(() => {
    const initialLogs: LogEntry[] = [
      { id: "1", time: "23:28:02", type: "info", text: "Initializing atmospheric telemetry feed..." },
      { id: "2", time: "23:28:10", type: "success", text: "TROPOMI connection established on band 7 (SWIR)." },
      { id: "3", time: "23:28:15", type: "info", text: "Retrieving HCHO columnar density dataset..." },
      { id: "4", time: "23:28:22", type: "success", text: "Sentinel-5p calibration finished successfully." },
      { id: "5", time: "23:28:35", type: "info", text: "Fusing MODIS active fires records..." },
      { id: "6", time: "23:28:40", type: "info", text: "Fusing meteorological winds & temperature models..." },
      { id: "7", time: "23:28:45", type: "success", text: "Subcontinent neural network grid mapping complete (1km)." },
    ];
    setLogs(initialLogs);

    const logTexts = [
      "Acquiring Sentinel-5P overpass coordinates: 28.61N, 77.20E.",
      "Recalculating HCHO column density over Gangetic Plains.",
      "Syncing ground station validation points in Delhi, Agra, Lucknow.",
      "Updated wind drift prediction vector: WNW at 15 km/h.",
      "MODIS detects 42 active stubble burns in Punjab/Haryana region.",
      "AI model confidence interval: 94.6% (RMSE 3.2).",
      "Streaming real-time air quality index estimates to dashboard client.",
      "Telemetry Sync: Altitude 824.18 km, Speed 7.548 km/s.",
    ];

    const logTypes: ("info" | "success" | "warn")[] = ["info", "success", "info", "info", "warn", "info", "success", "info"];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * logTexts.length);
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
      const newLog: LogEntry = {
        id: Math.random().toString(),
        time: timeStr,
        type: logTypes[idx],
        text: logTexts[idx],
      };

      setLogs((prev) => [...prev.slice(-30), newLog]); // Keep last 30 logs

      // Update telemetry slightly
      setTelemetryState((prev) => ({
        altitude: parseFloat((prev.altitude + (Math.random() - 0.5) * 0.05).toFixed(3)),
        speed: parseFloat((prev.speed + (Math.random() - 0.5) * 0.002).toFixed(3)),
        latency: Math.floor(80 + Math.random() * 10),
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Autoscroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Rotate satellite graphic
  useEffect(() => {
    const anim = requestAnimationFrame(function rotate() {
      setSatelliteAngle((prev) => (prev + 0.3) % 360);
      requestAnimationFrame(rotate);
    });
    return () => cancelAnimationFrame(anim);
  }, []);

  return (
    <div className={`w-full ${activeMode === "mission" ? "h-screen overflow-hidden" : "min-h-screen"} bg-[#03050a] text-white flex flex-col font-body selection:bg-orange/30`}>
      
      {/* Background Graphic overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-30 z-0" 
        style={{ backgroundImage: "url('/assets/background.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#03050a]/80 via-[#03050a]/95 to-[#03050a] pointer-events-none z-0" />

      {/* TOP NAVBAR */}
      <header className="z-20 h-16 border-b border-white/10 glass-panel flex items-center justify-between px-4 md:px-8 shrink-0">
        <div className="flex items-center gap-3">
          {/* Recreated ISRO Icon for Header */}
          <div className="w-8 h-8 relative flex items-center justify-center">
            {/* Simple vectors for navbar logo */}
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
        </div>

        {/* Live System Badges (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-mono">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            TROPOMI S5P: ACTIVE
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            MODIS FIRE LINK: SYNCED
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-orange/10 border border-orange/20 text-orange-flame">
            <Cpu className="w-3.5 h-3.5" />
            DEEP LEARNING MODEL: FUSED (1KM)
          </div>
        </div>

        {/* Navigation and Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            <Link 
              href="/missioncontrol" 
              className={`px-3 py-1.5 rounded-md text-xs font-orbitron font-bold tracking-wider transition-colors ${activeMode === 'mission' ? 'bg-orange text-white shadow-[0_0_10px_rgba(255,106,0,0.4)]' : 'text-white/40 hover:text-white/80'}`}
            >
              MISSION CONTROL
            </Link>
            <Link 
              href="/aqi" 
              className={`px-3 py-1.5 rounded-md text-xs font-orbitron font-bold tracking-wider transition-colors ${activeMode === 'predictor' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'text-white/40 hover:text-white/80'}`}
            >
              AQI PREDICTOR
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/70 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Clock className="w-3.5 h-3.5 text-orange-flame" />
            <span>{currentTime || "00:00:00 IST"}</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT GRID */}
      {activeMode === "mission" ? (
      <main className="z-10 flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* LEFT COLUMN: LIVE TELEMETRY & CITY REPORT (Span 3) */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col gap-3 shrink-0 overflow-visible relative" style={{ zIndex: 9999 }}>
            <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-orange-flame flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange" />
              Sensor Selection Node
            </h3>
            <StateSearch
              selected={selectedRegion && 'id' in selectedRegion ? selectedRegion.id : ""}
              onChange={(val) => setSelectedRegion(REGIONS[val as string])}
              placeholder="Search State or Territory..."
              className="w-full z-[60]"
            />
          </div>

          {/* Active Sensor Node Reading Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex-1 flex flex-col justify-between relative overflow-hidden group min-h-0">
            {selectedRegion ? (
              <div key={selectedRegion.name} className="h-full flex flex-col justify-between animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-white/30 uppercase">
                  NODE: {selectedRegion.id.toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-display font-extrabold text-xl text-white truncate max-w-[80%]">
                      {selectedRegion.name}
                    </h2>
                    <span className="text-[10px] font-mono text-white/50">INDIA</span>
                  </div>
                  <p className="text-[10px] font-mono text-white/40 uppercase mb-4">
                    Fused Regional Telemetry Matrix
                  </p>

                  <div className="flex flex-col items-center justify-center my-4 relative shrink-0">
                    <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-36 md:h-36 drop-shadow-xl">
                      <circle cx="60" cy="60" r="48" fill="none" stroke="#1e293b" strokeWidth="10" strokeDasharray="225" strokeLinecap="round" transform="rotate(135 60 60)" />
                      <circle cx="60" cy="60" r="48" fill="none" stroke={selectedRegion.color} strokeWidth="10" strokeLinecap="round" transform="rotate(135 60 60)" style={{ strokeDasharray: `${(selectedRegion.aqi / 500) * 225} 300`, filter: `drop-shadow(0 0 8px ${selectedRegion.color}99)` }} className="transition-all duration-1000 ease-out" />
                    </svg>

                    <div className="absolute flex flex-col items-center mt-2">
                      <span className="text-4xl font-orbitron font-extrabold tracking-tighter">
                        {selectedRegion.aqi}
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-white/60 uppercase">AQI Value</span>
                      <span className="mt-1.5 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold" style={{ backgroundColor: `${selectedRegion.color}20`, color: selectedRegion.color, border: `1px solid ${selectedRegion.color}40` }}>
                        {selectedRegion.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 shrink-0">
                  <div className="bg-black/30 border border-white/5 p-2 rounded-lg hover:border-white/10 transition-colors">
                    <div className="text-[8px] font-mono text-white/40 uppercase">PM2.5 Density</div>
                    <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1">
                      <span>{selectedRegion.pm25}</span><span className="text-[9px] font-mono text-white/40">µg/m³</span>
                    </div>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-2 rounded-lg hover:border-white/10 transition-colors">
                    <div className="text-[8px] font-mono text-white/40 uppercase">PM10 Density</div>
                    <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1">
                      <span>{selectedRegion.pm10}</span><span className="text-[9px] font-mono text-white/40">µg/m³</span>
                    </div>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-2 rounded-lg hover:border-white/10 transition-colors">
                    <div className="text-[8px] font-mono text-white/40 uppercase">HCHO Column</div>
                    <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1 text-orange-flame">
                      <span>{selectedRegion.hcho}</span><span className="text-[9px] font-mono text-white/45">DU</span>
                    </div>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-2 rounded-lg hover:border-white/10 transition-colors">
                    <div className="text-[8px] font-mono text-white/40 uppercase">NO2 Level</div>
                    <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1">
                      <span>{selectedRegion.no2}</span><span className="text-[9px] font-mono text-white/40">ppb</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 flex justify-between text-[10px] font-mono text-white/50 shrink-0">
                  <div className="flex flex-col">
                    <span>TEMP</span>
                    <span className="text-white font-semibold">{selectedRegion.temp}°C</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>HUMIDITY</span>
                    <span className="text-white font-semibold">{selectedRegion.humidity}%</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>WIND DRIFT</span>
                    <span className="text-white font-semibold">{selectedRegion.wind}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40 text-sm font-mono text-center">
                <ShieldCheck className="w-8 h-8 mb-4 opacity-50" />
                <p>No region selected.<br/>Search for a state to view telemetry data.</p>
              </div>
            )}
          </div>
        </section>

        {/* CENTER COLUMN: INTERACTIVE MAP & AQI HEATMAP (Span 6) */}
        <section className="lg:col-span-6 flex flex-col gap-4 lg:gap-6 overflow-hidden min-h-0 order-1 lg:order-2 h-[50vh] lg:h-auto">
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex-1 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3 shrink-0">
              <div>
                <h3 className="text-sm font-orbitron font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-orange" />
                  National Air Quality Grid
                </h3>
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  TROPOMI Formaldehyde (HCHO) Column Density Fused with surface particulate matter
                </span>
              </div>
              {/* Heatmap Legend */}
              <div className="flex items-center gap-2 text-[9px] font-mono">
                <span className="text-white/40">AQI:</span>
                <div className="flex h-2 w-24 rounded overflow-hidden border border-white/10">
                  <div className="w-1/5 bg-emerald-500"></div>
                  <div className="w-1/5 bg-[#ffb428]"></div>
                  <div className="w-1/5 bg-[#f59e0b]"></div>
                  <div className="w-1/5 bg-[#ff6a00]"></div>
                  <div className="w-1/5 bg-red-600"></div>
                </div>
                <span className="text-white/70">50 - 500+</span>
              </div>
            </div>

            {/* Interactive Vector Outline Map of India with pulsing AQI heatmaps */}
            <div className="flex-1 w-full relative flex items-center justify-center min-h-0 overflow-hidden cursor-move">
              
              {/* Outer compass grid backdrop */}
              <div className="absolute w-72 h-72 rounded-full border border-white/5 flex items-center justify-center animate-[spin_120s_linear_infinite] pointer-events-none">
                <div className="w-48 h-48 rounded-full border border-dashed border-white/10" />
              </div>

              {/* Real @svg-maps/india vector map integration */}
              <svg
                viewBox="0 0 612 696"
                className="w-full h-full max-h-[85%] object-contain select-none z-10 relative min-h-0 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {(India.locations as Array<{ id: string; path: string; name: string }>).map((location) => {
                  const region = REGIONS[location.id];
                  const isSelected = selectedRegion && 'id' in selectedRegion ? selectedRegion.id === location.id : false;
                  let baseColor = "rgba(255,255,255,0.02)";
                                    let selectedColor = "rgba(255,255,255,0.15)";

                  if (region) {
                    const aqi = region.aqi;
                    if (aqi > 400) { baseColor = "#7f1d1d88"; selectedColor = "#ef4444"; }
                    else if (aqi > 300) { baseColor = "#b91c1c88"; selectedColor = "#ef4444"; }
                    else if (aqi > 200) { baseColor = "#c2410c88"; selectedColor = "#f97316"; }
                    else if (aqi > 100) { baseColor = "#a1620788"; selectedColor = "#eab308"; }
                    else { baseColor = "#15803d88"; selectedColor = "#22c55e"; }
                  }

                  const fill = isSelected ? selectedColor : baseColor;
                  const strokeColor = isSelected ? "#ffffff" : "rgba(255,255,255,0.1)";
                  const strokeWidth = isSelected ? "2" : "0.4";

                  return (
                    <motion.path
                      key={location.id}
                      d={location.path}
                      animate={{ fill, stroke: strokeColor }}
                      transition={{ duration: 0.2 }}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      className={`outline-none ${region ? "cursor-pointer" : "cursor-not-allowed"}`}
                      onClick={() => { if (region) setSelectedRegion(region); }}
                    />
                  );
                })}
              </svg>

              {/* Holographic HUD UI element overlaying map */}
              <div className="absolute top-2 left-2 p-2 bg-black/40 border border-white/5 rounded-lg text-[9px] font-mono flex flex-col gap-0.5 pointer-events-none">
                <span className="text-white/40">GRID RESOLUTION:</span>
                <span className="text-white">1.2 km² (Deep Fused)</span>
                <span className="text-white/40 mt-1">SWEEP CYCLE:</span>
                <span className="text-white">Every 24h (TROPOMI orbit)</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: SATELLITE TELEMETRY & EVENT LOG (Span 3) */}
        <section className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          
          {/* Orbit Telemetry Widget */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col gap-3 relative">
            <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-orange-flame flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-orange" />
              S5P Orbit Vector
            </h3>

            {/* Orbit vector graphics */}
            <div className="h-24 bg-white/[0.02] border border-white/5 rounded-lg relative overflow-hidden flex items-center justify-center">
              
              {/* Curved orbit path */}
              <div className="absolute w-32 h-32 rounded-full border border-dashed border-white/10" />

              {/* Earth representation inside */}
              <div className="w-10 h-10 rounded-full bg-blue-isro/30 border border-blue-light/50 flex items-center justify-center text-[7px] font-bold font-mono">
                EARTH
              </div>

              {/* Rotating satellite node */}
              <div
                className="absolute w-2.5 h-2.5 bg-orange rounded-full border border-white shadow-[0_0_5px_#ff6a00]"
                style={{
                  transform: `rotate(${satelliteAngle}deg) translate(22px) rotate(-${satelliteAngle}deg)`,
                }}
              />
            </div>

            {/* Stats list */}
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

          {/* Running Mission Logs Terminal */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex-1 flex flex-col overflow-hidden relative min-h-[200px]">
            <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-orange-flame flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 shrink-0">
              <Radio className="w-3.5 h-3.5 text-orange" />
              Satellite Telemetry Stream
            </h3>

            {/* Simulated Live scrolling logs container */}
            <div
              ref={logContainerRef}
              className="flex-1 overflow-y-auto font-mono text-[9px] md:text-[10px] flex flex-col gap-2.5 pr-1 py-1 scrollbar-thin"
            >
              {logs.map((log) => {
                let badgeColor = "text-blue-light";
                if (log.type === "success") badgeColor = "text-emerald-400";
                if (log.type === "warn") badgeColor = "text-orange-flame";

                return (
                  <div key={log.id} className="flex gap-1.5 border-b border-white/[0.02] pb-1.5 last:border-b-0 leading-normal">
                    <span className="text-white/40 shrink-0 select-none">[{log.time}]</span>
                    <span className={`font-bold shrink-0 uppercase select-none ${badgeColor}`}>
                      {log.type === "info" ? "INFO" : log.type === "success" ? "SYNC" : "WARN"}
                    </span>
                    <span className="text-white/80">{log.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      ) : (
        <main className="z-10 flex-1 p-4 md:p-6 flex flex-col overflow-hidden animate-in fade-in duration-500">
          <AQIPredictorMode />
        </main>
      )}

      {/* BOTTOM PANEL: FUSION FLOW & DATASOURCES (Span 12) */}
      <footer className="z-10 px-4 md:px-6 pb-6 shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        <div className="lg:col-span-12 glass-panel p-4 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Data Fusion Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-orange" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm">AI Data Fusion Pipeline</h4>
              <p className="text-[10px] font-mono text-white/45">Multi-source environmental data synthesis</p>
            </div>
          </div>

          {/* Fusion Pipeline Steps */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-lg hover:bg-white/[0.08] transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-blue-light" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">Sentinel-5P TROPOMI</span>
                  <span className="text-[9px] font-mono text-white/40">HCHO / NO2 / UV Column</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>

            <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-lg hover:bg-white/[0.08] transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">MODIS / VIIRS</span>
                  <span className="text-[9px] font-mono text-white/40">Active fires / Radiative power</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>

            <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-lg hover:bg-white/[0.08] transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">CPCB Ground Stations</span>
                  <span className="text-[9px] font-mono text-white/40">PM2.5 calibration dataset</span>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};
