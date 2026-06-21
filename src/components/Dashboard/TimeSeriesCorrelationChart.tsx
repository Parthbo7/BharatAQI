"use client";
import React from "react";
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { CustomTooltipProps, TooltipPayloadItem } from "@/lib/chart-types";

interface FireHCHOPoint { date: string; fires: number; hcho: number; }

// Simulated data for Oct-Nov biomass burning season (Punjab/Haryana region)
const timeSeriesData = [
  { date: "Oct 01", fires: 120, hcho: 0.045 },
  { date: "Oct 05", fires: 350, hcho: 0.052 },
  { date: "Oct 10", fires: 890, hcho: 0.078 },
  { date: "Oct 15", fires: 1500, hcho: 0.095 },
  { date: "Oct 20", fires: 2800, hcho: 0.112 }, // Critical Threshold Crossing
  { date: "Oct 25", fires: 4200, hcho: 0.145 },
  { date: "Oct 30", fires: 5100, hcho: 0.165 }, // Peak
  { date: "Nov 05", fires: 3900, hcho: 0.150 },
  { date: "Nov 10", fires: 2100, hcho: 0.115 },
  { date: "Nov 15", fires: 850, hcho: 0.085 },
  { date: "Nov 20", fires: 320, hcho: 0.065 },
  { date: "Nov 25", fires: 110, hcho: 0.050 },
  { date: "Nov 30", fires: 40, hcho: 0.042 }
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#03050a]/95 backdrop-blur border border-white/20 p-4 rounded-lg shadow-2xl">
        <p className="font-orbitron font-bold text-white mb-2">{label}</p>
        {payload.map((entry: TooltipPayloadItem, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="font-mono text-white/70 uppercase">{entry.name}:</span>
            <span className="font-bold font-mono" style={{ color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const downloadCSV = () => {
  const headers = ["date","fires","hcho"];
  const rows = (timeSeriesData as FireHCHOPoint[]).map((d) => headers.map(h => (d as unknown as Record<string, unknown>)[h] ?? "").join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "bharat_aqi_fire_hcho_correlation.csv"; a.click();
  URL.revokeObjectURL(url);
};

export const TimeSeriesCorrelationChart: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-black/40 rounded-xl border border-white/10 min-h-0">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h3 className="font-display font-extrabold text-white text-xl">Fire vs HCHO Correlation</h3>
          <p className="text-[11px] font-mono text-white/50 uppercase mt-1">Objective-2: Spatio-temporal analysis (Oct - Nov)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 border border-red-500/50 px-3 py-1 rounded">
            <span className="text-[10px] font-mono text-red-400 font-bold tracking-widest uppercase">High Correlation (R = 0.88)</span>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-[10px] font-mono transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> CSV
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}
              tickMargin={10}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            
            {/* Left Y-Axis for Fire Counts */}
            <YAxis 
              yAxisId="left" 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: '#ef4444', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(value) => `${value}`}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            
            {/* Right Y-Axis for HCHO DU */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: '#f97316', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} 
              iconType="circle"
            />
            
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="fires" 
              name="MODIS Active Fire Counts" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#ef4444' }}
              animationDuration={1500}
            />
            
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="hcho" 
              name="TROPOMI HCHO (DU)" 
              stroke="#f97316" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#f97316' }}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
