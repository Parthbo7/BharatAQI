"use client";
import React, { useState, useMemo } from "react";
import { REGIONS, RegionData } from "@/lib/regions";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Flame, CheckCircle, Crosshair, Wind, AlertTriangle, MapPin } from "lucide-react";
import India from "@svg-maps/india";
import modelResults from "@/lib/model_results.json";

interface StatePrediction {
  aqi: number;
  hcho: number;
  isHotspot: boolean;
  hchoIntensity: number;
  fireCount: number;
  sourceType: string;
}

// We'll use the generated predictions from the backend pipeline
const modelPredictions = (modelResults as Record<string, unknown>).state_predictions as Record<string, StatePrediction>;

// Approximate centroids for annotating fire markers on the SVG
const STATE_SVG_CENTROIDS: Record<string, { cx: number; cy: number }> = {
  dl: { cx: 222, cy: 220 }, pb: { cx: 180, cy: 185 }, hr: { cx: 210, cy: 235 },
  up: { cx: 295, cy: 260 }, br: { cx: 385, cy: 275 }, jh: { cx: 375, cy: 320 },
  wb: { cx: 415, cy: 340 }, or: { cx: 365, cy: 385 }, mp: { cx: 270, cy: 340 },
  rj: { cx: 170, cy: 285 }, gj: { cx: 140, cy: 360 }, mh: { cx: 210, cy: 420 },
  ct: { cx: 325, cy: 380 }, ap: { cx: 290, cy: 470 }, tg: { cx: 265, cy: 440 },
  ka: { cx: 220, cy: 500 }, tn: { cx: 265, cy: 545 }, kl: { cx: 215, cy: 565 },
  as: { cx: 480, cy: 250 }, ut: { cx: 250, cy: 185 },
};

export const SpatialMap: React.FC<{ globalSelectedMonth?: number }> = ({ globalSelectedMonth = 9 }) => {
  const [mapMode, setMapMode] = useState<"aqi_pred" | "hcho_hotspot" | "cpcb_ground">("aqi_pred");
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mapScale, setMapScale] = useState(1);

  // Seasonal AQI multipliers (0=Jan, 11=Dec)
  const SEASONAL_MULTIPLIERS = [1.3, 1.2, 1.0, 0.85, 0.75, 0.6, 0.55, 0.6, 0.75, 1.1, 1.35, 1.4];
  const seasonalFactor = SEASONAL_MULTIPLIERS[globalSelectedMonth];



  // Ranked hotspot list (sorted by HCHO descending)
  const hotspotRanking = useMemo(() => {
    return Object.entries(modelPredictions)
      .map(([id, pred]) => ({ id, name: REGIONS[id]?.name || id, ...pred }))
      .filter(r => REGIONS[r.id])
      .sort((a, b) => b.hcho - a.hcho)
      .slice(0, 8);
  }, []);

  // HCHO gradient color (green -> yellow -> orange -> red)
  const getHchoColor = (intensity: number) => {
    if (intensity > 0.75) return "#dc2626";
    if (intensity > 0.55) return "#f97316";
    if (intensity > 0.35) return "#eab308";
    if (intensity > 0.15) return "#84cc16";
    return "#064e3b";
  };

  // Map Color Generator with seasonal adjustment
  const getRegionColors = (regionId: string, region: RegionData) => {
    if (!region) return { base: "rgba(255,255,255,0.02)", hover: "rgba(255,255,255,0.08)", selected: "rgba(255,255,255,0.15)" };
    const pred = modelPredictions[regionId];

    if (mapMode === "hcho_hotspot") {
      const baseColor = getHchoColor(pred?.hchoIntensity || 0);
      return { base: baseColor + "55", hover: baseColor + "cc", selected: baseColor };
    } else {
      const rawAqi = mapMode === "cpcb_ground" ? region.aqi : (pred?.aqi || region.aqi);
      const displayAqi = Math.min(500, Math.round(rawAqi * seasonalFactor));
      if (displayAqi > 400) return { base: "#7f1d1d88", hover: "#b91c1c", selected: "#ef4444" };
      if (displayAqi > 300) return { base: "#b91c1c88", hover: "#dc2626", selected: "#ef4444" };
      if (displayAqi > 200) return { base: "#c2410c88", hover: "#ea580c", selected: "#f97316" };
      if (displayAqi > 100) return { base: "#a1620788", hover: "#ca8a04", selected: "#eab308" };
      return { base: "#15803d88", hover: "#16a34a", selected: "#22c55e" };
    }
  };

  const filteredRegions = Object.values(REGIONS).filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-full glass-panel border border-white/10 rounded-xl overflow-hidden bg-black/40 flex flex-col items-center justify-center min-h-0">
      
      {/* HUD HEADER: Mode Toggle */}
      <div className="absolute top-4 left-4 z-40 flex bg-black/60 p-1 rounded-lg border border-white/10 gap-1 backdrop-blur-md shadow-2xl">
        <button 
          onClick={() => { setMapMode("aqi_pred"); setSelectedRegion(null); }} 
          className={`px-4 py-2 rounded text-[10px] font-orbitron font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${mapMode === "aqi_pred" ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
        >
          <Layers className="w-3.5 h-3.5" />
          Surface AQI (Obj-1)
        </button>
        <button 
          onClick={() => { setMapMode("hcho_hotspot"); setSelectedRegion(null); }} 
          className={`px-4 py-2 rounded text-[10px] font-orbitron font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${mapMode === "hcho_hotspot" ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
        >
          <Flame className="w-3.5 h-3.5" />
          HCHO Hotspots (Obj-2)
        </button>
        <button 
          onClick={() => { setMapMode("cpcb_ground"); setSelectedRegion(null); }} 
          className={`px-4 py-2 rounded text-[10px] font-orbitron font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${mapMode === "cpcb_ground" ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Ground Truth (CPCB)
        </button>
      </div>

      {/* SEARCH BAR (Added to match Mission Control) */}
      <div className="absolute top-4 right-4 z-50 w-64">
        <div className="relative flex items-center">
          <MapPin className="absolute left-2.5 w-4 h-4 text-white/50 pointer-events-none" />
          <input 
            type="text"
            value={isSearchOpen ? searchQuery : selectedRegion?.name || ""}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!isSearchOpen) setIsSearchOpen(true);
            }}
            onFocus={() => { setIsSearchOpen(true); setSearchQuery(""); }}
            onBlur={() => { setTimeout(() => setIsSearchOpen(false), 200); }}
            placeholder="Search Region..."
            className="w-full bg-black/60 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs font-mono text-white outline-none focus:border-emerald-500 transition-colors backdrop-blur-md shadow-2xl"
          />
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 w-full mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl max-h-48 overflow-y-auto z-50 overflow-x-hidden"
            >
              {filteredRegions.length === 0 ? (
                <div className="p-3 text-xs text-white/40 font-mono text-center">No regions found</div>
              ) : (
                filteredRegions.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedRegion(r);
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors"
                  >
                    {r.name}
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ZOOM CONTROLS */}
      <div className="absolute top-20 right-4 z-40 flex flex-col bg-black/60 p-1 rounded-lg border border-white/10 gap-1 backdrop-blur-md shadow-2xl">
        <button 
          onClick={() => setMapScale(prev => Math.min(prev + 0.25, 3))}
          className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          +
        </button>
        <button 
          onClick={() => setMapScale(prev => Math.max(prev - 0.25, 0.5))}
          className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          -
        </button>
        <button 
          onClick={() => setMapScale(1)}
          className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[10px] font-mono transition-colors"
        >
          RST
        </button>
      </div>

      {/* Background Map Wrapper */}
      <div className="flex-1 w-full relative flex items-center justify-center min-h-0 overflow-hidden cursor-move">
        <motion.div 
          drag 
          dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
          animate={{ scale: mapScale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 612 696"
            className="w-full h-full max-h-[85%] object-contain select-none z-10 relative min-h-0 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          {/* Defs for glow filters */}
          <defs>
            <filter id="fire-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {(India.locations as Array<{ id: string; path: string; name: string }>).map((location) => {
            const region = REGIONS[location.id];
            const isSelected = selectedRegion?.id === location.id;
            const isHovered = hoveredRegion?.id === location.id && !isSelected;
            const colors = getRegionColors(location.id, region);

            const fill = isSelected ? colors.selected : isHovered ? colors.hover : colors.base;
            const strokeColor = isSelected ? "#ffffff" : isHovered ? "rgba(255,255,255,0.5)" :
              (mapMode === "hcho_hotspot" && modelPredictions[location.id]?.isHotspot) ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)";
            const strokeWidth = isSelected ? "2" : isHovered ? "1" :
              (mapMode === "hcho_hotspot" && modelPredictions[location.id]?.isHotspot) ? "0.8" : "0.4";

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
                onMouseEnter={() => setHoveredRegion(region || null)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
            );
          })}

          {/* Animated fire markers on hotspot centroids */}
          <AnimatePresence>
            {mapMode === "hcho_hotspot" && Object.entries(modelPredictions).map(([id, pred]) => {
              if (!pred.isHotspot || !STATE_SVG_CENTROIDS[id]) return null;
              const { cx, cy } = STATE_SVG_CENTROIDS[id];
              return (
                <motion.g key={`fire-${id}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} filter="url(#fire-glow)">
                  <motion.circle
                    cx={cx} cy={cy} r={4 + pred.hchoIntensity * 6}
                    fill="#ef4444"
                    opacity={0.8}
                    animate={{ r: [4 + pred.hchoIntensity * 4, 4 + pred.hchoIntensity * 8, 4 + pred.hchoIntensity * 4], opacity: [0.9, 0.4, 0.9] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <circle cx={cx} cy={cy} r={3} fill="#fbbf24" opacity={0.9} />
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* Wind transport vectors */}
          <AnimatePresence>
            {mapMode === "hcho_hotspot" && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none">
                {/* Punjab -> UP (main crop burning transport) */}
                <motion.path d="M 190 190 C 250 220, 300 240, 380 270" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="6 4"
                  initial={{ strokeDashoffset: 60 }} animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ filter: "drop-shadow(0 0 4px rgba(96,165,250,0.6))" }} />
                {/* Arrow head */}
                <motion.polygon points="378,264 388,272 376,276" fill="#60a5fa" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />

                {/* Haryana -> MP/Rajasthan corridor */}
                <motion.path d="M 200 240 C 210 290, 230 330, 260 370" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5 4"
                  initial={{ strokeDashoffset: 50 }} animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  style={{ filter: "drop-shadow(0 0 3px rgba(96,165,250,0.5))" }} />
                <motion.polygon points="256,366 264,374 252,376" fill="#60a5fa" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />

                {/* Bihar -> WB (eastern corridor) */}
                <motion.path d="M 385 280 C 400 300, 410 320, 415 345" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4"
                  initial={{ strokeDashoffset: 40 }} animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ filter: "drop-shadow(0 0 3px rgba(96,165,250,0.4))" }} />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
        </motion.div>
      </div>

      {/* ========== RIGHT SIDE PANEL (HCHO MODE) — Hotspot Leaderboard ========== */}
      <AnimatePresence>
        {mapMode === "hcho_hotspot" && !selectedRegion && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-16 right-3 z-40 bg-[#03050a]/95 backdrop-blur-xl border border-white/15 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.9)] w-64 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="font-orbitron font-bold text-white text-xs uppercase tracking-wider">Top HCHO Hotspots</h3>
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase -mt-1 mb-2">Oct-Nov 2023 | Biomass Burning Season</span>

            {hotspotRanking.map((state, idx) => (
              <button
                key={state.id}
                onClick={() => { if (REGIONS[state.id]) setSelectedRegion(REGIONS[state.id]); }}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-left group
                  ${state.isHotspot 
                    ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/50" 
                    : "border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/15"}`}
              >
                <span className={`text-[10px] font-orbitron font-bold w-5 text-center ${idx < 3 ? "text-red-400" : "text-white/40"}`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-white block truncate group-hover:text-red-300 transition-colors">{state.name}</span>
                  <span className="text-[8px] font-mono text-white/40">{state.sourceType}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[11px] font-orbitron font-bold ${state.isHotspot ? "text-red-400" : "text-yellow-500"}`}>
                    {state.hcho}
                  </span>
                  <span className="text-[7px] font-mono text-white/30">DU</span>
                </div>
                {state.isHotspot && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"></div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== SELECTED REGION DETAIL CARD ========== */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-16 right-3 z-40 bg-[#03050a]/95 backdrop-blur-xl border border-white/20 p-5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.9)] w-72 flex flex-col"
          >
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-display font-extrabold text-white text-lg">{selectedRegion.name}</h3>
                <span className="text-[9px] font-mono text-white/50 uppercase block">
                  {mapMode === "hcho_hotspot" ? "HCHO Analysis" : "Validation Metrics"}
                </span>
              </div>
              <button onClick={() => setSelectedRegion(null)} className="text-white/40 hover:text-white transition-colors p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="mt-3 flex flex-col gap-3">
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                <h4 className="text-[10px] font-bold text-white/60 mb-2 flex items-center gap-1"><Crosshair className="w-3 h-3 text-emerald-400"/> Predicted AQI (Model)</h4>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-orbitron font-bold text-emerald-400">{modelPredictions[selectedRegion.id]?.aqi || "N/A"}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-emerald-400">RMSE: 24.1</span>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10">
                  <h4 className="text-[10px] font-bold text-white/60 mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-blue-400"/> Ground Truth (CPCB)</h4>
                  <span className="text-lg font-orbitron font-bold text-white">{selectedRegion.aqi}</span>
                </div>
              </div>

              {/* Health Advisory */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <h4 className="text-[10px] font-bold text-white/60 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-400"/> Health Advisory</h4>
                <span className="text-xs font-mono text-white/80">
                  {selectedRegion.aqi > 300 ? "Severe Alert: Everyone should avoid outdoor physical activity. Extremely toxic air quality." 
                  : selectedRegion.aqi > 200 ? "Very Poor: People with respiratory illness should remain indoors. Significant health risk."
                  : selectedRegion.aqi > 100 ? "Poor: Sensitive groups may experience health effects. Limit prolonged outdoor exertion."
                  : "Moderate/Good: Air quality is acceptable. Favorable conditions."}
                </span>
              </div>

              {/* HCHO Detail */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${modelPredictions[selectedRegion.id]?.isHotspot ? "bg-red-500 animate-pulse" : "bg-orange-500"}`}></div>
                <h4 className="text-[10px] font-bold text-white/60 mb-2 flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400"/> TROPOMI HCHO Column</h4>
                <div className="flex items-baseline justify-between">
                  <span className={`text-xl font-orbitron font-bold ${modelPredictions[selectedRegion.id]?.isHotspot ? "text-red-400" : "text-orange-400"}`}>
                    {modelPredictions[selectedRegion.id]?.hcho || 0} <span className="text-[9px] text-white/50">DU</span>
                  </span>
                  {modelPredictions[selectedRegion.id]?.isHotspot && (
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse uppercase">Hotspot</span>
                  )}
                </div>
                
                {/* Extra HCHO details */}
                <div className="mt-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[8px] font-mono text-white/40 block">Fire Count</span>
                    <span className="text-xs font-bold text-orange-400">{modelPredictions[selectedRegion.id]?.fireCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-white/40 block">Source</span>
                    <span className="text-[9px] font-bold text-white/70">{modelPredictions[selectedRegion.id]?.sourceType || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-white/40 block">Intensity</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-1.5 rounded-full bg-white/10 w-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(modelPredictions[selectedRegion.id]?.hchoIntensity || 0) * 100}%`,
                            backgroundColor: getHchoColor(modelPredictions[selectedRegion.id]?.hchoIntensity || 0)
                          }} 
                        />
                      </div>
                      <span className="text-[8px] font-mono text-white/50">{Math.round((modelPredictions[selectedRegion.id]?.hchoIntensity || 0) * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-white/40 block">Wind</span>
                    <span className="text-[9px] font-bold text-blue-400 flex items-center gap-0.5"><Wind className="w-3 h-3" />{selectedRegion.wind}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== BOTTOM LEGEND ========== */}
      <div className="absolute bottom-4 left-4 z-40 bg-black/70 backdrop-blur-sm border border-white/10 p-3 rounded-lg flex flex-col gap-2">
        {mapMode === "aqi_pred" || mapMode === "cpcb_ground" ? (
          <>
            <span className="text-[9px] font-mono text-white/50 uppercase">{mapMode === "cpcb_ground" ? "CPCB Ground AQI Scale" : "Predicted AQI Scale"}</span>
            <div className="flex h-2 w-36 rounded overflow-hidden border border-white/10 mt-1">
              <div className="w-1/6 bg-[#22c55e]"></div>
              <div className="w-1/6 bg-[#84cc16]"></div>
              <div className="w-1/6 bg-[#eab308]"></div>
              <div className="w-1/6 bg-[#f97316]"></div>
              <div className="w-1/6 bg-[#ef4444]"></div>
              <div className="w-1/6 bg-[#990000]"></div>
            </div>
            <div className="flex justify-between text-[8px] font-mono text-white/40 mt-0.5">
              <span>Good (0)</span><span>Severe (500+)</span>
            </div>
          </>
        ) : (
          <>
            <span className="text-[9px] font-mono text-white/50 uppercase">HCHO Column Density (DU)</span>
            <div className="flex h-2 w-36 rounded overflow-hidden border border-white/10 mt-1">
              <div className="w-1/4 bg-[#064e3b]"></div>
              <div className="w-1/4 bg-[#84cc16]"></div>
              <div className="w-1/4 bg-[#eab308]"></div>
              <div className="w-1/4 bg-[#dc2626]"></div>
            </div>
            <div className="flex justify-between text-[8px] font-mono text-white/40 mt-0.5">
              <span>Low</span><span>Extreme</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[9px] font-mono text-red-400">Active Fire Marker</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-4 border-t-2 border-dashed border-blue-400"></div>
              <span className="text-[9px] font-mono text-blue-400">ERA5 Wind Transport</span>
            </div>
          </>
        )}
      </div>

      {/* ========== HOVER TOOLTIP ========== */}
      <AnimatePresence>
        {hoveredRegion && hoveredRegion.id !== selectedRegion?.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-6 right-6 bg-[#03050a]/95 backdrop-blur-md border border-white/20 p-3 rounded-xl pointer-events-none z-30 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          >
            <span className="font-orbitron font-bold text-white text-sm block">{hoveredRegion.name}</span>
            {mapMode === "hcho_hotspot" ? (
              <div className="mt-1.5 flex flex-col gap-1">
                <div className="flex justify-between gap-4 text-[10px] font-mono">
                  <span className="text-white/50">HCHO:</span>
                  <span className={`font-bold ${modelPredictions[hoveredRegion.id]?.isHotspot ? "text-red-400" : "text-orange-400"}`}>
                    {modelPredictions[hoveredRegion.id]?.hcho} DU
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-[10px] font-mono">
                  <span className="text-white/50">Fires:</span>
                  <span className="text-orange-400 font-bold">{modelPredictions[hoveredRegion.id]?.fireCount}</span>
                </div>
                <div className="flex justify-between gap-4 text-[10px] font-mono">
                  <span className="text-white/50">Source:</span>
                  <span className="text-white/70">{modelPredictions[hoveredRegion.id]?.sourceType}</span>
                </div>
              </div>
            ) : (
              <div className="mt-1.5 flex flex-col gap-1">
                <div className="flex justify-between gap-4 text-[10px] font-mono">
                  <span className="text-white/50">AQI:</span>
                  <span className="text-emerald-400 font-bold">{modelPredictions[hoveredRegion.id]?.aqi}</span>
                </div>
                <div className="text-[9px] font-mono text-white/40 mt-0.5">Click to compare with CPCB</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
