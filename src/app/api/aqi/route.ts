import { NextRequest, NextResponse } from "next/server";
import modelResults from "@/lib/model_results.json";
import { REGIONS } from "@/lib/regions";

/**
 * BharatAQI Public AQI API
 * ========================
 * GET /api/aqi                      → All 36 states (JSON)
 * GET /api/aqi?state=dl             → Single state detail (JSON)
 * GET /api/aqi?month=9              → Seasonally-adjusted for October (0-indexed)
 * GET /api/aqi?state=dl&format=csv  → Single state as CSV row
 * GET /api/aqi?format=csv           → All states as CSV
 *
 * Response schema (single state):
 * {
 *   state_id, state_name, aqi, raw_aqi, seasonal_factor, month_applied,
 *   status, pm25, pm10, no2, hcho, is_hotspot, hcho_intensity,
 *   fire_count, source_type, temp, humidity, wind,
 *   data_source, last_updated
 * }
 */

// CPCB seasonal AQI multipliers (index 0 = January)
const SEASONAL_MULTIPLIERS = [
  1.30, 1.20, 1.00, 0.85, 0.75, 0.60,
  0.55, 0.60, 0.75, 1.10, 1.35, 1.40,
];

const CSV_HEADER =
  "state_id,state_name,aqi,status,pm25,pm10,no2,hcho,is_hotspot," +
  "hcho_intensity,fire_count,source_type,temp_c,humidity_pct,wind,data_source";

function getStatus(aqi: number): string {
  if (aqi <= 50)  return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const CACHE_HEADERS = {
  // Cache at CDN for 1 hour; serve stale for up to 24 h while revalidating
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get("state")?.toLowerCase();
  const format  = searchParams.get("format")?.toLowerCase() || "json";
  const month   = parseInt(searchParams.get("month") || "-1", 10);

  const seasonalFactor =
    month >= 0 && month <= 11 ? SEASONAL_MULTIPLIERS[month] : 1.0;

  const statePredictions =
    (modelResults as Record<string, unknown>).state_predictions as
      Record<string, { aqi: number; hcho: number; isHotspot: boolean;
                       hchoIntensity: number; fireCount: number; sourceType: string }> || {};

  // ── Single state ──────────────────────────────────────────────────────────
  if (stateId) {
    const region = REGIONS[stateId];
    if (!region) {
      return NextResponse.json(
        { error: `Unknown state: '${stateId}'. Use a valid two-letter state code (e.g. dl, mh, ka).` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const pred   = statePredictions[stateId];
    const rawAqi = pred?.aqi ?? region.aqi;
    const adjAqi = Math.min(500, Math.max(1, Math.round(rawAqi * seasonalFactor)));

    const row = {
      state_id:        stateId,
      state_name:      region.name,
      aqi:             adjAqi,
      raw_aqi:         rawAqi,
      seasonal_factor: seasonalFactor,
      month_applied:   month,
      status:          getStatus(adjAqi),
      pm25:            region.pm25,
      pm10:            region.pm10,
      no2:             region.no2,
      hcho:            pred?.hcho ?? region.hcho,
      is_hotspot:      pred?.isHotspot ?? false,
      hcho_intensity:  pred?.hchoIntensity ?? 0,
      fire_count:      pred?.fireCount ?? 0,
      source_type:     pred?.sourceType ?? "Background",
      temp:            region.temp,
      humidity:        region.humidity,
      wind:            region.wind,
      data_source:     "BharatAQI CNN-LSTM v1.0 · TROPOMI Sentinel-5P · ERA5",
      last_updated:    new Date().toISOString(),
    };

    if (format === "csv") {
      const csvRow = [
        row.state_id, `"${row.state_name}"`, row.aqi, row.status,
        row.pm25, row.pm10, row.no2, row.hcho,
        row.is_hotspot, row.hcho_intensity, row.fire_count,
        `"${row.source_type}"`, row.temp, row.humidity, `"${row.wind}"`,
        `"${row.data_source}"`,
      ].join(",");
      return new Response(`${CSV_HEADER}\n${csvRow}`, {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="bharat_aqi_${stateId}.csv"`,
        },
      });
    }

    return NextResponse.json(row, {
      headers: { ...CORS_HEADERS, ...CACHE_HEADERS },
    });
  }

  // ── All states ────────────────────────────────────────────────────────────
  const allStates = Object.entries(REGIONS).map(([id, region]) => {
    const pred   = statePredictions[id];
    const rawAqi = pred?.aqi ?? region.aqi;
    const adjAqi = Math.min(500, Math.max(1, Math.round(rawAqi * seasonalFactor)));
    return {
      state_id:       id,
      state_name:     region.name,
      aqi:            adjAqi,
      status:         getStatus(adjAqi),
      pm25:           region.pm25,
      pm10:           region.pm10,
      no2:            region.no2,
      hcho:           pred?.hcho ?? region.hcho,
      is_hotspot:     pred?.isHotspot ?? false,
      hcho_intensity: pred?.hchoIntensity ?? 0,
      fire_count:     pred?.fireCount ?? 0,
      source_type:    pred?.sourceType ?? "Background",
      temp:           region.temp,
      humidity:       region.humidity,
      wind:           region.wind,
    };
  });

  if (format === "csv") {
    const rows = allStates.map((r) =>
      [
        r.state_id, `"${r.state_name}"`, r.aqi, r.status,
        r.pm25, r.pm10, r.no2, r.hcho,
        r.is_hotspot, r.hcho_intensity, r.fire_count,
        `"${r.source_type}"`, r.temp, r.humidity, `"${r.wind}"`,
        `"BharatAQI CNN-LSTM v1.0"`,
      ].join(",")
    );
    return new Response([CSV_HEADER, ...rows].join("\n"), {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="bharat_aqi_all_states.csv"',
      },
    });
  }

  return NextResponse.json(
    {
      count:           allStates.length,
      month_applied:   month,
      seasonal_factor: seasonalFactor,
      states:          allStates,
      model_metrics:   modelResults.metrics,
      data_source:     "BharatAQI CNN-LSTM v1.0",
      last_updated:    new Date().toISOString(),
    },
    { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } }
  );
}
