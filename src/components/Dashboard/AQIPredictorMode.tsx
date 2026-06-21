"use client";

import React, { useState } from "react";
import { BrainCircuit, Activity, Map, TrendingUp, BarChart3, Download } from "lucide-react";
import modelResults from "@/lib/model_results.json";
import { SpatialMap } from "./SpatialMap";
import { TimeSeriesCorrelationChart } from "./TimeSeriesCorrelationChart";
import { ValidationScatterChart } from "./ValidationScatterChart";
import { AQITimeSeriesChart } from "./AQITimeSeriesChart";
import { TrainingLossChart } from "./TrainingLossChart";
import { ModelComparisonChart } from "./ModelComparisonChart";
import { SHAPFeatureChart } from "./SHAPFeatureChart";
import { ForecastChart } from "./ForecastChart";
import { PollutantMetricsChart } from "./PollutantMetricsChart";
import { TrendAnalysisChart } from "./TrendAnalysisChart";

type TabId = "spatialmap" | "loss" | "scatter" | "timeseries" | "training_loss" | "comparison" | "shap" | "forecast" | "pollutants" | "trend";

const TABS: { id: TabId; label: string }[] = [
  { id: "spatialmap",    label: "Spatial Map"     },
  { id: "forecast",      label: "48h Forecast"    },
  { id: "trend",         label: "5yr Trend 🆕"    },
  { id: "training_loss", label: "Training Loss"   },
  { id: "loss",          label: "Fire vs HCHO"    },
  { id: "scatter",       label: "Scatter Plot"    },
  { id: "timeseries",    label: "Time Series"     },
  { id: "pollutants",    label: "Per-Pollutant"   },
  { id: "comparison",    label: "Model Compare"   },
  { id: "shap",          label: "SHAP Importance" },
];

// Helper: download validation metrics as CSV (also available via /api/export?format=csv&type=metrics)
const downloadMetricsCSV = () => {
  const rows = Object.entries(modelResults.metrics).map(([k, v]) => `${k},${v}`);
  const csv = ["Metric,Value", ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = "bharat_aqi_validation_metrics.csv"; a.click();
};

export const AQIPredictorMode: React.FC<{ selectedMonth?: number }> = ({ selectedMonth = 9 }) => {
  const [activeTab, setActiveTab] = useState<TabId>("spatialmap");

  return (
    <div className="w-full h-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
      
      {/* LEFT COLUMN: Model Summary & Architecture */}
      <section className="lg:col-span-4 flex flex-col gap-6 overflow-hidden min-h-0">
        
        {/* Model Meta */}
        <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-3 relative">
          <h3 className="text-sm font-orbitron font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-emerald-500" />
            CNN-LSTM Architecture
          </h3>
          <p className="text-[10px] font-mono text-white/50 uppercase leading-relaxed">
            {modelResults.model_architecture.name} - Deep Learning Spatial-Temporal Fusion
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {modelResults.model_architecture.layers.map((layer, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-lg flex gap-3 items-center group hover:bg-white/10 transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="font-mono text-[9px] font-bold text-emerald-400">{layer.type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {"filters" in layer ? `Filters: ${layer.filters}` : `Units: ${(layer as { units: number }).units}`}
                  </span>
                  <span className="text-[9px] font-mono text-white/40">{layer.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CENTER COLUMN: Interactive Data Visualizations */}
      <section className="lg:col-span-8 flex flex-col gap-6 min-h-0">
        
        {/* Top Validation Metrics */}
        <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
             <h3 className="text-sm font-orbitron font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Validation Matrix — CNN-LSTM
             </h3>
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-white/40 uppercase">AQI · Test Set</span>
               <button onClick={downloadMetricsCSV}
                 className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-[9px] font-mono transition-colors">
                 <Download className="w-3 h-3" /> CSV
               </button>
               <a href="/api/export?format=csv&type=aqi" download
                 className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono transition-colors">
                 <Download className="w-3 h-3" /> All States
               </a>
             </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
             {Object.entries(modelResults.metrics).map(([key, value]) => (
                <div key={key} className="bg-white/[0.03] border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:border-emerald-500/50 transition-colors duration-500">
                   <span className="text-[10px] font-mono text-white/50 mb-1">{key === "R2" ? "R-Squared" : key}</span>
                   <span className="text-2xl font-orbitron font-bold text-emerald-400">{value}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-mono uppercase font-bold tracking-widest pb-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === tab.id
                  ? "text-emerald-400 border-emerald-400"
                  : "text-white/40 border-transparent hover:text-white"
              }`}
            >
              {tab.id === "spatialmap" && <Map className="w-3.5 h-3.5" />}
              {tab.id === "forecast" && <TrendingUp className="w-3.5 h-3.5" />}
              {tab.id === "pollutants" && <BarChart3 className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Chart Container */}
        <div className="glass-panel p-5 rounded-xl border border-white/10 flex-1 flex flex-col relative min-h-0 overflow-hidden">

           {activeTab === "spatialmap" && (
             <div className="w-full h-full animate-in fade-in zoom-in duration-500 overflow-visible">
                <SpatialMap globalSelectedMonth={selectedMonth} />
             </div>
           )}

           {activeTab === "forecast" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <ForecastChart />
             </div>
           )}

           {activeTab === "loss" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <TimeSeriesCorrelationChart />
             </div>
           )}

           {activeTab === "training_loss" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <TrainingLossChart />
             </div>
           )}

           {activeTab === "scatter" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <ValidationScatterChart />
             </div>
           )}

           {activeTab === "timeseries" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <AQITimeSeriesChart />
             </div>
           )}

           {activeTab === "pollutants" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <PollutantMetricsChart />
             </div>
           )}

           {activeTab === "trend" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <TrendAnalysisChart />
             </div>
           )}

           {activeTab === "comparison" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <ModelComparisonChart />
             </div>
           )}

           {activeTab === "shap" && (
             <div className="w-full h-full animate-in fade-in duration-500">
                <SHAPFeatureChart />
             </div>
           )}

        </div>
      </section>
    </div>
  );
};
