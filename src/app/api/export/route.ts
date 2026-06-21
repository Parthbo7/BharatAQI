import { NextRequest, NextResponse } from "next/server";
import modelResults from "@/lib/model_results.json";
import { REGIONS } from "@/lib/regions";
import type { PollutantMetrics } from "@/lib/chart-types";

/**
 * GET /api/export?format=csv&type=aqi         — All states AQI CSV
 * GET /api/export?format=csv&type=forecast&city=dl    — 48h forecast CSV for a state
 * GET /api/export?format=csv&type=validation          — Scatter validation data CSV
 * GET /api/export?format=csv&type=timeseries&city=dl  — Time series CSV for a state
 * GET /api/export?format=csv&type=metrics     — Per-pollutant validation metrics
 */

interface StatePrediction {
  aqi: number;
  hcho: number;
  isHotspot: boolean;
  hchoIntensity: number;
  fireCount: number;
  sourceType: string;
}

interface ForecastPoint {
  hour: string;
  label: string;
  ground_aqi: number | null;
  predicted_aqi: number | null;
  forecast_aqi: number | null;
  lower_ci: number | null;
  upper_ci: number | null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "csv";
  const type   = searchParams.get("type")   || "aqi";
  const city   = searchParams.get("city")   || "dl";

  if (format !== "csv") {
    return NextResponse.json({ error: "Only CSV format supported in this version" }, { status: 400 });
  }

  let csv = "";
  let filename = "bharat_aqi_export.csv";

  if (type === "aqi") {
    filename = "bharat_aqi_state_predictions.csv";
  const statePreds = (modelResults as Record<string, unknown>).state_predictions as Record<string, StatePrediction> | undefined ?? {};
    const header = "state_id,state_name,aqi,pm25,pm10,no2,hcho,is_hotspot,hcho_intensity,fire_count,source_type,temp_c,humidity_pct,wind";
    const rows = Object.entries(REGIONS).map(([id, r]) => {
      const p = statePreds[id] || {};
      return [
        id, r.name, p.aqi ?? r.aqi,
        r.pm25, r.pm10, r.no2,
        (p.hcho ?? r.hcho),
        p.isHotspot ? "true" : "false",
        p.hchoIntensity ?? 0,
        p.fireCount ?? 0,
        `"${p.sourceType ?? "Background"}"`,
        r.temp, r.humidity, `"${r.wind}"`,
      ].join(",");
    });
    csv = [header, ...rows].join("\n");

  } else if (type === "forecast") {
    filename = `bharat_aqi_forecast_${city}_48h.csv`;
    const forecastData = (modelResults as Record<string, unknown>).forecast_48h as Record<string, ForecastPoint[]> | undefined;
    const cityData: ForecastPoint[] = forecastData?.[city] || [];
    const header = "hour,label,ground_aqi,predicted_aqi,forecast_aqi,lower_ci,upper_ci";
    const rows = cityData.map((d: ForecastPoint) =>
      [d.hour, `"${d.label}"`, d.ground_aqi ?? "", d.predicted_aqi ?? "",
       d.forecast_aqi ?? "", d.lower_ci ?? "", d.upper_ci ?? ""].join(",")
    );
    csv = [header, ...rows].join("\n");

  } else if (type === "validation") {
    filename = "bharat_aqi_validation_scatter.csv";
    const header = "sample_id,ground_aqi,predicted_aqi,absolute_error";
    interface ScatterEntry { ground_aqi: number; predicted_aqi: number; }
    const rows = (modelResults.validation_scatter as ScatterEntry[]).map((d, i) => {
      const err = Math.abs(d.predicted_aqi - d.ground_aqi).toFixed(1);
      return [i + 1, d.ground_aqi, d.predicted_aqi, err].join(",");
    });
    csv = [header, ...rows].join("\n");

  } else if (type === "timeseries") {
    filename = `bharat_aqi_timeseries_${city}.csv`;
    const header = "date,city,ground_pm25,predicted_pm25,ground_aqi,predicted_aqi";
    interface TimeSeriesEntry { date: string; city: string; ground_pm25: number; predicted_pm25: number; ground_aqi: number; predicted_aqi: number; }
    
    const tsData = ((modelResults as Record<string, unknown>).time_series_states as Record<string, TimeSeriesEntry[]>)?.[city] || [];
    
    const rows = tsData.map(d =>
      [d.date, `"${d.city}"`, d.ground_pm25, d.predicted_pm25, d.ground_aqi, d.predicted_aqi].join(",")
    );
    csv = [header, ...rows].join("\n");

  } else if (type === "metrics") {
    filename = "bharat_aqi_validation_metrics.csv";
    const header = "pollutant,MAE,RMSE,R2,R";
    const perPoll = (modelResults as Record<string, unknown>).per_pollutant_metrics as Record<string, PollutantMetrics> | undefined ?? { AQI: modelResults.metrics };
    const rows = Object.entries(perPoll).map(([poll, m]: [string, PollutantMetrics]) =>
      [poll, m.MAE, m.RMSE, m.R2, m.R].join(",")
    );
    csv = [header, ...rows].join("\n");

  } else {
    return NextResponse.json({ error: `Unknown type: ${type}. Use: aqi, forecast, validation, timeseries, metrics` }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-cache",
    },
  });
}
