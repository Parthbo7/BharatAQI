export interface CityData {
  name: string;
  aqi: number;
  status: "Good" | "Moderate" | "Poor" | "Very Poor" | "Severe";
  color: string;
  pm25: number;
  pm10: number;
  no2: number;
  hcho: number;
  temp: number;
  humidity: number;
  wind: string;
  coords: { x: number; y: number }; // Percentage offsets on our SVG map
}

export const CITIES: Record<string, CityData> = {
  Delhi: {
    name: "New Delhi",
    aqi: 345,
    status: "Very Poor",
    color: "#ff6a00",
    pm25: 195,
    pm10: 310,
    no2: 84,
    hcho: 0.12,
    temp: 34,
    humidity: 55,
    wind: "NW 12 km/h",
    coords: { x: 38, y: 32 },
  },
  Mumbai: {
    name: "Mumbai",
    aqi: 125,
    status: "Moderate",
    color: "#ffb428",
    pm25: 45,
    pm10: 95,
    no2: 32,
    hcho: 0.04,
    temp: 29,
    humidity: 78,
    wind: "W 18 km/h",
    coords: { x: 25, y: 65 },
  },
  Bengaluru: {
    name: "Bengaluru",
    aqi: 68,
    status: "Good",
    color: "#10b981",
    pm25: 18,
    pm10: 42,
    no2: 15,
    hcho: 0.01,
    temp: 26,
    humidity: 62,
    wind: "E 14 km/h",
    coords: { x: 39, y: 81 },
  },
  Kolkata: {
    name: "Kolkata",
    aqi: 182,
    status: "Poor",
    color: "#f59e0b",
    pm25: 84,
    pm10: 160,
    no2: 52,
    hcho: 0.07,
    temp: 31,
    humidity: 70,
    wind: "S 8 km/h",
    coords: { x: 67, y: 47 },
  },
  Chennai: {
    name: "Chennai",
    aqi: 94,
    status: "Good",
    color: "#10b981",
    pm25: 28,
    pm10: 60,
    no2: 22,
    hcho: 0.03,
    temp: 30,
    humidity: 74,
    wind: "SE 16 km/h",
    coords: { x: 44, y: 84 },
  },
};
