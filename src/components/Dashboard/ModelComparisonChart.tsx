"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { CustomTooltipProps, TooltipPayloadItem } from "@/lib/chart-types";

const comparisonData = [
  { metric: "R²",      "CNN-LSTM": 0.954, "LSTM": 0.821, "Random Forest": 0.743 },
  { metric: "Pearson R", "CNN-LSTM": 0.979, "LSTM": 0.906, "Random Forest": 0.862 },
];



const radarData = [
  { subject: "Accuracy",   "CNN-LSTM": 95, "LSTM": 82, "Random Forest": 74 },
  { subject: "Speed",      "CNN-LSTM": 72, "LSTM": 80, "Random Forest": 95 },
  { subject: "Temporal",   "CNN-LSTM": 98, "LSTM": 90, "Random Forest": 40 },
  { subject: "Spatial",    "CNN-LSTM": 92, "LSTM": 60, "Random Forest": 55 },
  { subject: "Robustness", "CNN-LSTM": 88, "LSTM": 75, "Random Forest": 70 },
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#03050a]/95 backdrop-blur border border-white/20 p-3 rounded-lg shadow-2xl text-xs font-mono">
        <div className="text-white/60 mb-1">{label}</div>
        {payload.map((p: TooltipPayloadItem) => (
          <div key={p.name} className="flex justify-between gap-4" style={{ color: p.color }}>
            <span>{p.name}:</span><span className="font-bold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const downloadCSV = () => {
  const headers = ["Model","R2","RMSE","MAE","Pearson R"];
  const rows = [
    ["CNN-LSTM (Ours)","0.954","24.1","19.5","0.979"],
    ["Standalone LSTM","0.821","41.8","33.2","0.906"],
    ["Random Forest","0.743","58.3","47.6","0.862"]
  ];
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "bharat_aqi_model_comparison.csv"; a.click();
  URL.revokeObjectURL(url);
};

export const ModelComparisonChart: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-black/40 rounded-xl border border-white/10 min-h-0 overflow-auto">
      <div className="mb-4 flex justify-between items-start shrink-0">
        <div>
          <h3 className="font-display font-extrabold text-white text-xl">Model Comparison</h3>
          <p className="text-[11px] font-mono text-white/50 uppercase mt-1">CNN-LSTM vs LSTM vs Random Forest</p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-[10px] font-mono transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> CSV
        </button>
      </div>

      {/* Summary Table */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-[10px] font-mono border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-3 text-white/50 uppercase">Model</th>
              <th className="text-right py-2 px-3 text-white/50 uppercase">R²</th>
              <th className="text-right py-2 px-3 text-white/50 uppercase">RMSE</th>
              <th className="text-right py-2 px-3 text-white/50 uppercase">MAE</th>
              <th className="text-right py-2 px-3 text-white/50 uppercase">Pearson R</th>
              <th className="text-right py-2 px-3 text-white/50 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "CNN-LSTM (Ours)", r2: "0.954", rmse: "24.1", mae: "19.5", r: "0.979", status: "Selected", color: "#10b981", badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
              { name: "Standalone LSTM",  r2: "0.821", rmse: "41.8", mae: "33.2", r: "0.906", status: "Baseline",  color: "#3b82f6", badge: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
              { name: "Random Forest",    r2: "0.743", rmse: "58.3", mae: "47.6", r: "0.862", status: "Baseline",  color: "#a78bfa", badge: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
            ].map(row => (
              <tr key={row.name} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-2 px-3 font-bold" style={{ color: row.color }}>{row.name}</td>
                <td className="py-2 px-3 text-right text-white">{row.r2}</td>
                <td className="py-2 px-3 text-right text-white">{row.rmse}</td>
                <td className="py-2 px-3 text-right text-white">{row.mae}</td>
                <td className="py-2 px-3 text-right text-white">{row.r}</td>
                <td className="py-2 px-3 text-right">
                  <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold ${row.badge}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-white/40 uppercase mb-2">R² / Pearson R Comparison</span>
          <div className="flex-1 min-h-0" style={{ minHeight: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "monospace" }} />
                <YAxis domain={[0.6, 1]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "monospace" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                <Bar dataKey="CNN-LSTM" fill="#10b981" radius={[3,3,0,0]} />
                <Bar dataKey="LSTM" fill="#3b82f6" radius={[3,3,0,0]} />
                <Bar dataKey="Random Forest" fill="#a78bfa" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-white/40 uppercase mb-2">Multi-Dimension Radar</span>
          <div className="flex-1 min-h-0" style={{ minHeight: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="CNN-LSTM" dataKey="CNN-LSTM" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                <Radar name="LSTM" dataKey="LSTM" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Radar name="Random Forest" dataKey="Random Forest" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
