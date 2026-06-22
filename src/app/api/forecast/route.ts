import { NextRequest, NextResponse } from "next/server";
import modelResults from "@/lib/model_results.json";

/**
 * GET /api/forecast          → dl 48h forecast (default)
 * GET /api/forecast?city=dl
 * GET /api/forecast?city=mh
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get("city") || "dl").toLowerCase();

interface ForecastPoint {
  hour: string;
  ground_aqi: number | null;
  predicted_aqi: number | null;
  forecast_aqi: number | null;
}

  const forecastData = (modelResults as Record<string, unknown>).forecast_48h as Record<string, ForecastPoint[]> | undefined;
  if (!forecastData) {
    return NextResponse.json({ error: "Forecast data not yet generated" }, { status: 503 });
  }

  const cityData = forecastData[city];
  if (!cityData) {
    return NextResponse.json({
      error: `City '${city}' not found. Available: ${Object.keys(forecastData).join(", ")}`,
    }, { status: 404 });
  }

  const current = cityData.find((d: ForecastPoint) => d.hour === "Now");
  const forecast48h = cityData.filter((d: ForecastPoint) => d.hour.startsWith("+"));
  const maxForecastAqi = Math.max(...forecast48h.map((d: ForecastPoint) => d.forecast_aqi ?? 0));

  const getCategory = (aqi: number) =>
    aqi <= 50  ? "Good" :
    aqi <= 100 ? "Satisfactory" :
    aqi <= 200 ? "Moderate" :
    aqi <= 300 ? "Poor" :
    aqi <= 400 ? "Very Poor" : "Severe";

  return NextResponse.json(
    {
      city,
      current_aqi:           current?.ground_aqi ?? null,
      current_predicted_aqi: current?.predicted_aqi ?? null,
      peak_forecast_aqi:     maxForecastAqi,
      peak_category:         getCategory(maxForecastAqi),
      alert:                 maxForecastAqi > 300,
      alert_message:
        maxForecastAqi > 300
          ? `Severe AQI (${maxForecastAqi}) forecast within 12h. Sensitive groups advised to stay indoors.`
          : null,
      model:      "BharatAQI CNN-LSTM autoregressive (MC-Dropout ±1σ confidence)",
      timeseries: cityData,
      generated:  new Date().toISOString(),
    },
    {
      headers: {
        ...CORS_HEADERS,
        // Forecast is time-sensitive; cache for 15 min at CDN
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    }
  );
}
