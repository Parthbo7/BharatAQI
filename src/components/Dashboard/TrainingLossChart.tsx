"use client";
import React, { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import modelResults from "@/lib/model_results.json";
import type { CustomTooltipProps } from "@/lib/chart-types";

interface LossPoint { epoch: number; trainLoss: number; valLoss: number; }

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#03050a]/95 backdrop-blur border border-white/20 p-3 rounded-lg shadow-2xl">
        <div className="flex flex-col gap-1 text-xs font-mono">
          <div className="text-white/40 mb-1">Epoch {label}</div>
          <div className="flex justify-between gap-4">
            <span className="text-emerald-400">Train Loss:</span>
            <span className="text-emerald-400 font-bold">{(payload[0].value as number).toFixed(3)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-blue-400">Val Loss:</span>
            <span className="text-blue-400 font-bold">{(payload[1].value as number).toFixed(3)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const downloadCSV = (data: LossPoint[]) => {
  const headers = ["epoch","trainLoss","valLoss"];
  const rows = data.map((d) => headers.map(h => (d as unknown as Record<string, unknown>)[h] ?? "").join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "bharat_aqi_training_loss.csv"; a.click();
  URL.revokeObjectURL(url);
};

export const TrainingLossChart: React.FC = () => {
  const data = useMemo(() => {
    const history = modelResults.loss_history;
    if (!history || !history.epochs) return [];
    
    return history.epochs.map((epoch, i) => ({
      epoch,
      trainLoss: history.train_loss[i],
      valLoss: history.val_loss[i]
    }));
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-4 bg-black/40 rounded-xl border border-white/10 min-h-0 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2 shrink-0">
        <div>
          <h3 className="font-display font-extrabold text-white text-xl">Training Convergence</h3>
          <p className="text-[11px] font-mono text-white/50 uppercase mt-1">Objective-1: CNN-LSTM Loss History (MSE)</p>
        </div>
        <button
          onClick={() => downloadCSV(data)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-[10px] font-mono transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> CSV
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full mt-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            
            <XAxis 
              dataKey="epoch" 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'Epochs', position: 'bottom', fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace', offset: 0 }}
            />
            
            <YAxis 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'Mean Squared Error', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace', offset: 10 }}
            />
            
            <Tooltip cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }} content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }} />
            
            <Line 
              type="monotone" 
              dataKey="trainLoss" 
              name="Training Loss" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#10b981" }}
            />
            <Line 
              type="monotone" 
              dataKey="valLoss" 
              name="Validation Loss" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
