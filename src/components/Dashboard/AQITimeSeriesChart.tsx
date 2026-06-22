"use client";
import React, { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import modelResults from "@/lib/model_results.json";
import type { CustomTooltipProps } from "@/lib/chart-types";
import { REGIONS } from "@/lib/regions";
import { StateSearch } from "./StateSearch";

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#03050a]/95 backdrop-blur border border-white/20 p-4 rounded-lg shadow-2xl">
        <p className="font-orbitron font-bold text-white mb-2">{label}</p>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between gap-4">
             <span className="text-white/60 font-mono">Actual PM2.5:</span>
             <span className="text-white font-bold">{payload[0].payload.ground_pm25 as number} µg/m³</span>
          </div>
          <div className="flex justify-between gap-4">
             <span className="text-emerald-400 font-mono">Predicted PM2.5:</span>
             <span className="text-emerald-400 font-bold">{payload[0].payload.predicted_pm25 as number} µg/m³</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const downloadCSV = (city: string, data: Record<string, unknown>[]) => {
  const headers = ["date","city","ground_pm25","predicted_pm25","ground_aqi","predicted_aqi"];
  const rows = data.map((d) => headers.map(h => (d as Record<string, unknown>)[h] ?? "").join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "bharat_aqi_timeseries.csv"; a.click();
  URL.revokeObjectURL(url);
};

export const AQITimeSeriesChart: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const data = ((modelResults as Record<string, unknown>).time_series_states as Record<string, Record<string, unknown>[]>)?.[selectedCity] ?? [];
  return (
    <div className="w-full h-full flex flex-col p-4 bg-black/40 rounded-xl border border-white/10 min-h-0 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h3 className="font-display font-extrabold text-white text-xl">30-Day Predictive Analysis</h3>
          <p className="text-[11px] font-mono text-white/50 uppercase mt-1">Objective-1: Spatio-Temporal Prediction Sequence ({REGIONS[selectedCity]?.name ?? selectedCity})</p>
        </div>
        <div className="flex items-center gap-2">
          {/* State Search Bar */}
          <StateSearch 
            selected={selectedCity} 
            onChange={(val) => setSelectedCity(val as string)} 
            className="w-[180px] z-[60]"
          />
          <button
            onClick={() => downloadCSV(selectedCity, data)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-[10px] font-mono transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> CSV
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}
              tickMargin={10}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            
            <Tooltip cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }} content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} 
              iconType="circle"
            />
            
            <Line 
              type="monotone" 
              dataKey="ground_pm25" 
              name="Ground Truth (CPCB)" 
              stroke="rgba(255,255,255,0.6)" 
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 6, fill: 'white' }}
              animationDuration={1500}
            />
            
            <Line 
              type="monotone" 
              dataKey="predicted_pm25" 
              name="Predicted (CNN-LSTM)" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#10b981' }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
