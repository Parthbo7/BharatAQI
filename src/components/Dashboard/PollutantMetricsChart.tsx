"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
import modelResults from "@/lib/model_results.json";
import { Download } from "lucide-react";
import type { CustomTooltipProps, TooltipPayloadItem, PollutantMetrics } from "@/lib/chart-types";

const perPollutant = (modelResults as Record<string, unknown>).per_pollutant_metrics as Record<string, PollutantMetrics> ?? {};

const tableData = Object.entries(perPollutant).map(([pollutant, m]: [string, PollutantMetrics]) => ({
  pollutant,
  mae: m.MAE,
  rmse: m.RMSE,
  r2: m.R2,
  r: m.R,
}));

const COLORS = ["#ef4444","#f97316","#eab308","#84cc16","#10b981","#3b82f6"];

const radarData = tableData.map(d => ({
  subject: d.pollutant,
  "R²": Math.round(d.r2 * 100),
}));

const downloadCSV = () => {
  const headers = ["Pollutant","MAE","RMSE","R²","Pearson R"];
  const rows = tableData.map(d => [d.pollutant, d.mae, d.rmse, d.r2, d.r].join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "bharat_aqi_pollutant_metrics.csv"; a.click();
  URL.revokeObjectURL(url);
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#03050a]/95 backdrop-blur border border-white/20 p-3 rounded-lg shadow-2xl text-xs font-mono">
        <div className="text-white font-bold mb-1">{label}</div>
        {payload.map((p: TooltipPayloadItem) => (
          <div key={p.name} className="flex justify-between gap-4" style={{ color: p.fill }}>
            <span>R²:</span><span className="font-bold">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const PollutantMetricsChart: React.FC = () => (
  <div className="w-full h-full flex flex-col p-4 bg-black/40 rounded-xl border border-white/10 min-h-0 overflow-auto">
    <div className="flex items-center justify-between mb-4 shrink-0">
      <div>
        <h3 className="font-display font-extrabold text-white text-xl">Per-Pollutant Validation Metrics</h3>
        <p className="text-[11px] font-mono text-white/50 uppercase mt-0.5">CNN-LSTM — test set performance across all 6 output targets</p>
      </div>
      <button
        onClick={downloadCSV}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-[10px] font-mono transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> CSV
      </button>
    </div>

    {/* Table */}
    <div className="mb-4 shrink-0 overflow-x-auto">
      <table className="w-full text-[10px] font-mono border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-white/50 uppercase">Pollutant</th>
            <th className="text-right py-2 px-3 text-white/50 uppercase">R²</th>
            <th className="text-right py-2 px-3 text-white/50 uppercase">Pearson R</th>
            <th className="text-right py-2 px-3 text-white/50 uppercase">RMSE</th>
            <th className="text-right py-2 px-3 text-white/50 uppercase">MAE</th>
            <th className="text-right py-2 px-3 text-white/50 uppercase">Grade</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => {
            const grade = row.r2 >= 0.95 ? { label: "Excellent", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" }
              : row.r2 >= 0.90 ? { label: "Good",      cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" }
              : { label: "Acceptable", cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
            return (
              <tr key={row.pollutant} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-2 px-3 font-bold" style={{ color: COLORS[i] }}>{row.pollutant}</td>
                <td className="py-2 px-3 text-right text-white">{row.r2.toFixed(3)}</td>
                <td className="py-2 px-3 text-right text-white">{row.r.toFixed(3)}</td>
                <td className="py-2 px-3 text-right text-white">{row.rmse}</td>
                <td className="py-2 px-3 text-right text-white">{row.mae}</td>
                <td className="py-2 px-3 text-right">
                  <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold ${grade.cls}`}>{grade.label}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
      <div className="flex flex-col">
        <span className="text-[9px] font-mono text-white/40 uppercase mb-2">R² by Pollutant</span>
        <div className="flex-1 min-h-0" style={{ minHeight: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={radarData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace" }} />
              <YAxis domain={[80, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace" }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="R²" radius={[3,3,0,0]}>
                {radarData.map((_, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-mono text-white/40 uppercase mb-2">Radar — R² Coverage</span>
        <div className="flex-1 min-h-0" style={{ minHeight: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace" }} />
              <PolarRadiusAxis angle={30} domain={[80, 100]} tick={false} />
              <Radar name="R²" dataKey="R²" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
              <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div className="mt-2 pt-2 border-t border-white/10 text-[9px] font-mono text-white/30 text-center shrink-0">
      All metrics computed on hold-out test set (15% split, ~1,400 samples). Unit: µg/m³ for PM, ppb for gases.
    </div>
  </div>
);
