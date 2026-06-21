"use client";

import React, { useState, useEffect, useRef } from "react";
import { Radio } from "lucide-react";

interface LogEntry {
  id: string;
  time: string;
  type: "info" | "success" | "warn" | "error";
  text: string;
}

const LOG_TEXTS = [
  "Acquiring Sentinel-5P overpass coordinates: 28.61N, 77.20E.",
  "Recalculating HCHO column density over Gangetic Plains.",
  "Syncing ground station validation points in Delhi, Agra, Lucknow.",
  "Updated wind drift prediction vector: WNW at 15 km/h.",
  "MODIS detects 42 active stubble burns in Punjab/Haryana region.",
  "AI model confidence interval: 94.6% (RMSE 3.2).",
  "Streaming real-time air quality index estimates to dashboard client.",
  "Telemetry Sync: Altitude 824.18 km, Speed 7.548 km/s.",
];

const LOG_TYPES: ("info" | "success" | "warn")[] = ["info", "success", "info", "info", "warn", "info", "success", "info"];

export const MissionLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialLogs: LogEntry[] = [
      { id: "1", time: "23:28:02", type: "info", text: "Initializing atmospheric telemetry feed..." },
      { id: "2", time: "23:28:10", type: "success", text: "TROPOMI connection established on band 7 (SWIR)." },
      { id: "3", time: "23:28:15", type: "info", text: "Retrieving HCHO columnar density dataset..." },
      { id: "4", time: "23:28:22", type: "success", text: "Sentinel-5p calibration finished successfully." },
      { id: "5", time: "23:28:35", type: "info", text: "Fusing MODIS active fires records..." },
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * LOG_TEXTS.length);
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
      const newLog: LogEntry = {
        id: Math.random().toString(),
        time: timeStr,
        type: LOG_TYPES[idx],
        text: LOG_TEXTS[idx],
      };
      setLogs((prev) => [...prev.slice(-30), newLog]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel p-4 rounded-xl border border-white/10 flex-1 flex flex-col overflow-hidden relative min-h-[300px]">
      <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-orange-flame flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 shrink-0">
        <Radio className="w-3.5 h-3.5 text-orange" />
        Satellite Telemetry Stream
      </h3>

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
  );
};
