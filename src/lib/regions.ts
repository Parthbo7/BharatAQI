import modelResults from "./model_results.json";

export interface RegionData {
  id: string;
  name: string;
  aqi: number;
  status: "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe";
  color: string;
  pm25: number;
  pm10: number;
  no2: number;
  hcho: number;
  temp: number;
  humidity: number;
  wind: string;
}

/**
 * Maps an AQI value to its CPCB category and colour.
 * Breakpoints per CPCB National AQI Notification, November 2014.
 *
 *  0 –  50 → Good          (#10b981)
 * 51 – 100 → Satisfactory  (#84cc16)
 * 101 – 200 → Moderate      (#ffb428)
 * 201 – 300 → Poor          (#f59e0b)
 * 301 – 400 → Very Poor     (#ff6a00)
 * 401 – 500 → Severe        (#ef4444)
 */
const getStatusAndColor = (
  aqi: number
): { status: RegionData["status"]; color: string } => {
  if (aqi <= 50)  return { status: "Good",       color: "#10b981" };
  if (aqi <= 100) return { status: "Satisfactory", color: "#84cc16" };
  if (aqi <= 200) return { status: "Moderate",   color: "#ffb428" };
  if (aqi <= 300) return { status: "Poor",        color: "#f59e0b" };
  if (aqi <= 400) return { status: "Very Poor",   color: "#ff6a00" };
  return           { status: "Severe",            color: "#ef4444" };
};

/**
 * Deterministic hash → integer in [0, range).
 * Used to generate stable per-state values that do not change between
 * server and client renders (avoids SSR hydration mismatches).
 */
const deterministicInt = (seed: string, range: number): number => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % range;
};

// Baseline metadata (static geography + meteorological defaults)
const BASELINE_META: Record<string, { name: string; baseTemp: number }> = {
  dl:  { name: "Delhi",                        baseTemp: 34 },
  up:  { name: "Uttar Pradesh",                baseTemp: 35 },
  hr:  { name: "Haryana",                      baseTemp: 34 },
  pb:  { name: "Punjab",                       baseTemp: 33 },
  rj:  { name: "Rajasthan",                    baseTemp: 38 },
  mh:  { name: "Maharashtra",                  baseTemp: 29 },
  gj:  { name: "Gujarat",                      baseTemp: 32 },
  wb:  { name: "West Bengal",                  baseTemp: 31 },
  ka:  { name: "Karnataka",                    baseTemp: 26 },
  tn:  { name: "Tamil Nadu",                   baseTemp: 30 },
  kl:  { name: "Kerala",                       baseTemp: 28 },
  br:  { name: "Bihar",                        baseTemp: 33 },
  mp:  { name: "Madhya Pradesh",               baseTemp: 35 },
  ap:  { name: "Andhra Pradesh",               baseTemp: 32 },
  tg:  { name: "Telangana",                    baseTemp: 33 },
  or:  { name: "Odisha",                       baseTemp: 32 },
  ch:  { name: "Chandigarh",                   baseTemp: 33 },
  jh:  { name: "Jharkhand",                    baseTemp: 32 },
  ct:  { name: "Chhattisgarh",                 baseTemp: 34 },
  as:  { name: "Assam",                        baseTemp: 27 },
  ut:  { name: "Uttarakhand",                  baseTemp: 22 },
  hp:  { name: "Himachal Pradesh",             baseTemp: 18 },
  jk:  { name: "Jammu and Kashmir",            baseTemp: 15 },
  ga:  { name: "Goa",                          baseTemp: 30 },
  tr:  { name: "Tripura",                      baseTemp: 28 },
  ml:  { name: "Meghalaya",                    baseTemp: 22 },
  mn:  { name: "Manipur",                      baseTemp: 23 },
  nl:  { name: "Nagaland",                     baseTemp: 24 },
  ar:  { name: "Arunachal Pradesh",            baseTemp: 18 },
  mz:  { name: "Mizoram",                      baseTemp: 22 },
  sk:  { name: "Sikkim",                       baseTemp: 15 },
  py:  { name: "Puducherry",                   baseTemp: 31 },
  an:  { name: "Andaman and Nicobar Islands",  baseTemp: 29 },
  dn:  { name: "Dadra and Nagar Haveli",       baseTemp: 31 },
  dd:  { name: "Daman and Diu",               baseTemp: 31 },
  ld:  { name: "Lakshadweep",                  baseTemp: 29 },
};

/**
 * Fallback AQI when model_results has no entry for a state.
 * Values are derived from historical CPCB averages (Oct–Nov, worst-case month).
 */
const FALLBACK_AQI: Record<string, number> = {
  dl: 345, up: 280, hr: 250, pb: 220, rj: 180, mh: 125, gj: 140,
  wb: 182, ka:  68, tn:  94, kl:  45, br: 260, mp: 150, ap: 110,
  tg: 130, or: 160, ch: 190, jh: 210, ct: 140, as:  80, ut:  90,
  hp:  60, jk:  75, ga:  55, tr:  85, ml:  40, mn:  50, nl:  60,
  ar:  35, mz:  45, sk:  30, py:  88, an:  35, dn: 110, dd: 105, ld:  25,
};

const WIND_OPTIONS = [
  "NW 12 km/h", "W 18 km/h",  "E 14 km/h",  "S 8 km/h",
  "SE 16 km/h", "NE 10 km/h", "N 15 km/h",  "SW 20 km/h",
];

// States with characteristically higher humidity (coastal / high-rainfall)
const HIGH_HUMIDITY_STATES = new Set(["kl", "as", "ml", "wb", "tr", "mn", "ar"]);

// Pull model predictions from CNN-LSTM output
const statePredictions: Record<string, { aqi: number; hcho: number }> =
  (modelResults as Record<string, unknown>).state_predictions as Record<string, { aqi: number; hcho: number }> || {};

export const REGIONS: Record<string, RegionData> = {};

Object.keys(BASELINE_META).forEach((id) => {
  const meta     = BASELINE_META[id];
  const modelPred = statePredictions[id];

  // Use model prediction if available, otherwise fall back to CPCB baselines
  const rawAqi = modelPred?.aqi ?? FALLBACK_AQI[id] ?? 100;
  // CPCB AQI scale: 0–500 (clamp to valid range)
  const aqi    = Math.min(500, Math.max(1, rawAqi));
  const hcho   = Number((modelPred?.hcho ?? aqi * 0.00035).toFixed(3));

  const { status, color } = getStatusAndColor(aqi);

  // Derived pollutant concentrations (proportional to AQI as approximation)
  const pm25 = Math.max(1,  Math.round(aqi * 0.55));
  const pm10 = Math.max(5,  Math.round(aqi * 0.90));
  const no2  = Math.max(2,  Math.round(aqi * 0.25));

  // Deterministic humidity: base 45 % + up to 35 % extra for wet states,
  // otherwise up to 30 % extra — seeded by state ID for SSR stability.
  const humidityExtra = HIGH_HUMIDITY_STATES.has(id)
    ? deterministicInt(id + "_h", 35)
    : deterministicInt(id + "_h", 30);
  const humidity = 45 + humidityExtra;

  // Deterministic wind direction seeded by state ID
  const windIdx = deterministicInt(id + "_w", WIND_OPTIONS.length);

  REGIONS[id] = {
    id,
    name: meta.name,
    aqi,
    status,
    color,
    pm25: Math.max(1,    pm25),
    pm10: Math.max(5,    pm10),
    no2:  Math.max(2,    no2),
    hcho: Math.max(0.01, hcho),
    temp: meta.baseTemp,
    humidity,
    wind: WIND_OPTIONS[windIdx],
  };
});
