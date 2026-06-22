"use client";
import React, { useState } from "react";
import {
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine
} from "recharts";
import { StateSearch } from "./StateSearch";
import modelResults from "@/lib/model_results.json";
import { AlertTriangle, TrendingUp, Download } from "lucide-react";
import type { CustomTooltipProps, TooltipPayloadItem } from "@/lib/chart-types";

interface ForecastPoint {
  hour: string;
  label: string;
  ground_aqi: number | null;
  predicted_aqi: number | null;
  forecast_aqi: number | null;
  lower_ci: number | null;
  upper_ci: number | null;
}

const forecastData = (modelResults as Record<string, unknown>).forecast_48h as Record<string, ForecastPoint[]> | undefined;

const AQI_CATEGORIES = [
  { label: "Good",      max: 50,  color: "#10b981" },
  { label: "Moderate",  max: 100, color: "#ffb428" },
  { label: "Poor",      max: 200, color: "#f59e0b" },
  { label: "Very Poor", max: 300, color: "#ff6a00" },
  { label: "Severe",    max: 500, color: "#ef4444" },
];

const getAQIColor = (aqi: number) => {
  for (const cat of AQI_CATEGORIES) if (aqi <= cat.max) return cat.color;
  return "#990000";
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const forecastVal = payload.find((p: TooltipPayloadItem) => p.dataKey === "forecast_aqi")?.value;
    const groundVal  = payload.find((p: TooltipPayloadItem) => p.dataKey === "ground_aqi")?.value;
    const val = forecastVal ?? groundVal;
    return (
      <div className="bg-[#03050a]/95 backdrop-blur border border-white/20 p-3 rounded-lg shadow-2xl text-xs font-mono min-w-[160px]">
        <div className="text-white/60 mb-2 font-bold">{label}</div>
        {payload.map((p: TooltipPayloadItem) => p.value !== null && (
          <div key={p.name} className="flex justify-between gap-4" style={{ color: p.color }}>
            <span>{p.name}:</span>
            <span className="font-bold">{p.value}</span>
          </div>
        ))}
        {val && (
          <div className="mt-1.5 pt-1.5 border-t border-white/10 text-[10px]" style={{ color: getAQIColor(val) }}>
            ⬤ {AQI_CATEGORIES.find(c => val <= c.max)?.label ?? "Severe"}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const downloadCSV = (city: string, data: ForecastPoint[]) => {
  const headers = ["hour","label","ground_aqi","predicted_aqi","forecast_aqi","lower_ci","upper_ci"];
  const rows = data.map(d => headers.map(h => (d as unknown as Record<string, unknown>)[h] ?? "").join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `bharat_aqi_forecast_${city}_48h.csv`; a.click();
  URL.revokeObjectURL(url);
};

export const ForecastChart: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const data = forecastData?.[selectedCity] ?? [];
  const currentForecast = data.find((d: ForecastPoint) => d.hour === "Now")?.forecast_aqi ?? 0;

  return (
    <div className="w-full h-full flex flex-col p-4 bg-black/40 rounded-xl border border-white/10 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h3 className="font-display font-extrabold text-white text-xl">48-Hour AQI Forecast</h3>
          <p className="text-[11px] font-mono text-white/50 uppercase mt-0.5">
            CNN-LSTM autoregressive prediction · ±1σ confidence band
          </p>
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
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-[10px] font-mono transition-colors"
          >
            <Download className="w-3 h-3" /> CSV
          </button>
        </div>
      </div>

      {/* Alert banner if forecast is severe */}
      {currentForecast > 300 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono mb-3 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Forecast predicts <strong>Severe AQI ({currentForecast})</strong> conditions within 12h. Sensitive groups should stay indoors.</span>
        </div>
      )}

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="hour"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace" }}
              stroke="rgba(255,255,255,0.1)"
            />
            <YAxis
              domain={[0, 500]}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace" }}
              stroke="rgba(255,255,255,0.1)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 9, fontFamily: "monospace", paddingTop: 8 }}
              formatter={(val) => <span style={{ color: "rgba(255,255,255,0.6)" }}>{val}</span>}
            />

            {/* AQI category reference lines */}
            <ReferenceLine y={50}  stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: "Good",      fill: "#10b981", fontSize: 8, fontFamily: "monospace" }} />
            <ReferenceLine y={100} stroke="#ffb428" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: "Moderate", fill: "#ffb428", fontSize: 8, fontFamily: "monospace" }} />
            <ReferenceLine y={200} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: "Poor",     fill: "#f59e0b", fontSize: 8, fontFamily: "monospace" }} />
            <ReferenceLine y={300} stroke="#ff6a00" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: "Very Poor",fill: "#ff6a00", fontSize: 8, fontFamily: "monospace" }} />

            {/* "Now" divider */}
            <ReferenceLine x="Now" stroke="rgba(255,255,255,0.4)" strokeWidth={2} strokeDasharray="4 2"
              label={{ value: "NOW", fill: "rgba(255,255,255,0.7)", fontSize: 9, fontFamily: "monospace", position: "top" }} />

            {/* Confidence band (forecast zone only) */}
            <Area
              dataKey="upper_ci"
              fill="rgba(16,185,129,0.08)"
              stroke="none"
              name="Upper CI"
              legendType="none"
            />
            <Area
              dataKey="lower_ci"
              fill="rgba(16,185,129,0.00)"
              stroke="none"
              name="Lower CI"
              legendType="none"
            />

            {/* Ground truth */}
            <Line
              dataKey="ground_aqi"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ r: 3, fill: "#60a5fa" }}
              name="Ground (CPCB)"
              connectNulls={false}
            />

            {/* Model predictions (historical) */}
            <Line
              dataKey="predicted_aqi"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: "#10b981" }}
              name="CNN-LSTM Predicted"
              connectNulls={false}
            />

            {/* Forecast */}
            <Line
              dataKey="forecast_aqi"
              stroke="#f97316"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              dot={{ r: 3, fill: "#f97316" }}
              name="48h Forecast"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/30 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="inline-block w-6 border-t-2 border-blue-400"></span> CPCB Ground Truth</span>
          <span className="flex items-center gap-1"><span className="inline-block w-6 border-t-2 border-emerald-400"></span> CNN-LSTM Predicted</span>
          <span className="flex items-center gap-1"><span className="inline-block w-6 border-t-2 border-dashed border-orange-400"></span> 48h Forecast ± 1σ</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          MC-Dropout uncertainty (50 forward passes)
        </div>
      </div>
    </div>
  );
};
