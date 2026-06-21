"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { CityData, CITIES } from "@/lib/data";

interface CityReportProps {
  selectedCity: CityData;
  onCitySelect: (city: CityData) => void;
}

export const CityReport: React.FC<CityReportProps> = ({ selectedCity, onCitySelect }) => {
  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      {/* Dynamic City Telemetry Selector */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col gap-3">
        <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-orange-flame flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-orange" />
          Sensor Selection Node
        </h3>
        <div className="grid grid-cols-5 gap-1.5">
          {Object.keys(CITIES).map((cKey) => {
            const isSelected = CITIES[cKey].name === selectedCity.name;
            return (
              <button
                key={cKey}
                onClick={() => onCitySelect(CITIES[cKey])}
                className={`py-1 text-[10px] md:text-xs font-mono uppercase font-bold rounded border transition-all duration-300 ${
                  isSelected
                    ? "bg-orange/20 text-orange-flame border-orange"
                    : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cKey.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Sensor Node Reading Card */}
      <div className="glass-panel p-5 rounded-xl border border-white/10 flex-1 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-white/30">
          NODE_ID: {selectedCity.name.toUpperCase().slice(0, 3)}_08
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="font-display font-extrabold text-xl text-white">
              {selectedCity.name}
            </h2>
            <span className="text-[10px] font-mono text-white/50">INDIA</span>
          </div>
          <p className="text-[10px] font-mono text-white/40 uppercase mb-4">
            Fused Satellite & Surface Sensor telemetry
          </p>

          <div className="flex flex-col items-center justify-center my-4 relative">
            <svg viewBox="0 0 120 120" className="w-36 h-36">
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
                strokeDasharray="225"
                strokeLinecap="round"
                transform="rotate(135 60 60)"
              />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke={selectedCity.color}
                strokeWidth="10"
                strokeDasharray={`${(selectedCity.aqi / 500) * 225} 300`}
                strokeLinecap="round"
                transform="rotate(135 60 60)"
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 6px ${selectedCity.color}77)` }}
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-orbitron font-extrabold tracking-tighter">
                {selectedCity.aqi}
              </span>
              <span className="text-[8px] font-mono tracking-widest text-white/60 uppercase">
                AQI Value
              </span>
              <span
                className="mt-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold"
                style={{ backgroundColor: `${selectedCity.color}15`, color: selectedCity.color }}
              >
                {selectedCity.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: "PM2.5 Density", value: selectedCity.pm25, unit: "µg/m³", color: "text-white" },
            { label: "PM10 Density", value: selectedCity.pm10, unit: "µg/m³", color: "text-white" },
            { label: "HCHO Column", value: selectedCity.hcho, unit: "DU", color: "text-orange-flame" },
            { label: "NO2 Level", value: selectedCity.no2, unit: "ppb", color: "text-white" },
          ].map((item, id) => (
            <div key={id} className="bg-white/5 border border-white/5 p-2 rounded-lg">
              <div className="text-[8px] font-mono text-white/40 uppercase">{item.label}</div>
              <div className={`text-sm font-semibold mt-0.5 flex items-baseline gap-1 ${item.color}`}>
                <span>{item.value}</span>
                <span className="text-[9px] font-mono text-white/40">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-3 mt-4 flex justify-between text-[10px] font-mono text-white/50">
          <div className="flex flex-col">
            <span>TEMP</span>
            <span className="text-white font-semibold">{selectedCity.temp}°C</span>
          </div>
          <div className="flex flex-col items-center">
            <span>HUMIDITY</span>
            <span className="text-white font-semibold">{selectedCity.humidity}%</span>
          </div>
          <div className="flex flex-col items-end">
            <span>WIND DRIFT</span>
            <span className="text-white font-semibold">{selectedCity.wind}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
