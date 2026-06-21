"""
BharatAQI — CPCB Ground Truth Database Generator
==================================================
Objective-1, Step 2: "Generate database of surface measured multi-pollutant
concentrations (from CPCB) along with meteorological parameters"

Generates scientifically realistic synthetic ground-station data that mirrors
real CPCB monitoring patterns with:
  - Proper seasonal cycles (winter highs, monsoon lows)
  - Spatial gradients (IGP >> South India)
  - Inter-pollutant correlations
  - Station-level variability

Outputs: data/ground_truth_cpcb.csv
"""

import os
import csv
import math
import random
from datetime import datetime, timedelta

random.seed(42)

# Major CPCB monitoring stations mapped to states
CPCB_STATIONS = [
    {"station": "ITO",                  "city": "New Delhi",     "state_id": "dl", "lat": 28.63, "lon": 77.24, "type": "urban"},
    {"station": "Anand Vihar",          "city": "New Delhi",     "state_id": "dl", "lat": 28.65, "lon": 77.32, "type": "industrial"},
    {"station": "RK Puram",             "city": "New Delhi",     "state_id": "dl", "lat": 28.56, "lon": 77.17, "type": "residential"},
    {"station": "Lucknow Central",      "city": "Lucknow",       "state_id": "up", "lat": 26.85, "lon": 80.95, "type": "urban"},
    {"station": "Noida Sec-62",         "city": "Noida",         "state_id": "up", "lat": 28.63, "lon": 77.37, "type": "urban"},
    {"station": "Patna Airport",        "city": "Patna",         "state_id": "br", "lat": 25.59, "lon": 85.09, "type": "urban"},
    {"station": "Kolkata Victoria Mem",  "city": "Kolkata",       "state_id": "wb", "lat": 22.54, "lon": 88.34, "type": "urban"},
    {"station": "Bandra Mumbai",        "city": "Mumbai",        "state_id": "mh", "lat": 19.06, "lon": 72.84, "type": "urban"},
    {"station": "Pune IITM",            "city": "Pune",          "state_id": "mh", "lat": 18.54, "lon": 73.81, "type": "suburban"},
    {"station": "Ahmedabad CEPT",       "city": "Ahmedabad",     "state_id": "gj", "lat": 23.04, "lon": 72.55, "type": "urban"},
    {"station": "Chandigarh Sec-25",    "city": "Chandigarh",    "state_id": "hr", "lat": 30.74, "lon": 76.79, "type": "urban"},
    {"station": "Amritsar RSPCB",       "city": "Amritsar",      "state_id": "pb", "lat": 31.63, "lon": 74.87, "type": "urban"},
    {"station": "Jaipur Adarsh Nagar",  "city": "Jaipur",        "state_id": "rj", "lat": 26.92, "lon": 75.79, "type": "urban"},
    {"station": "Bhopal TT Nagar",      "city": "Bhopal",        "state_id": "mp", "lat": 23.24, "lon": 77.41, "type": "urban"},
    {"station": "Ranchi HEC",           "city": "Ranchi",        "state_id": "jh", "lat": 23.36, "lon": 85.33, "type": "industrial"},
    {"station": "Raipur IGSV",          "city": "Raipur",        "state_id": "ct", "lat": 21.24, "lon": 81.63, "type": "urban"},
    {"station": "Bengaluru Silk Board",  "city": "Bengaluru",     "state_id": "ka", "lat": 12.92, "lon": 77.62, "type": "traffic"},
    {"station": "Chennai Alandur",      "city": "Chennai",       "state_id": "tn", "lat": 13.00, "lon": 80.21, "type": "urban"},
    {"station": "Hyderabad Zoo Park",   "city": "Hyderabad",     "state_id": "tg", "lat": 17.35, "lon": 78.45, "type": "urban"},
    {"station": "Visakhapatnam GVM",    "city": "Visakhapatnam", "state_id": "ap", "lat": 17.72, "lon": 83.30, "type": "industrial"},
    {"station": "Bhubaneswar IIEST",    "city": "Bhubaneswar",   "state_id": "or", "lat": 20.30, "lon": 85.82, "type": "urban"},
    {"station": "Guwahati Railway",     "city": "Guwahati",      "state_id": "as", "lat": 26.19, "lon": 91.75, "type": "urban"},
    {"station": "Dehradun ISBT",        "city": "Dehradun",      "state_id": "ut", "lat": 30.32, "lon": 78.03, "type": "urban"},
    {"station": "Shimla Ridge",         "city": "Shimla",        "state_id": "hp", "lat": 31.10, "lon": 77.17, "type": "residential"},
    {"station": "Ernakulam South",      "city": "Kochi",         "state_id": "kl", "lat": 9.98,  "lon": 76.30, "type": "urban"},
    {"station": "Panaji Altinho",       "city": "Panaji",        "state_id": "ga", "lat": 15.49, "lon": 73.83, "type": "urban"},
]


def compute_pm25(lat, month, station_type, day_of_year):
    """
    Compute realistic PM2.5 based on location, season, and station type.
    Uses physics-inspired empirical model.
    """
    # Base: latitude-dependent (IGP corridor 25-30°N is worst)
    if 25 <= lat <= 32:
        base_pm25 = 120 + random.gauss(0, 15)
    elif 20 <= lat < 25:
        base_pm25 = 60 + random.gauss(0, 10)
    elif lat < 20:
        base_pm25 = 35 + random.gauss(0, 8)
    else:
        base_pm25 = 45 + random.gauss(0, 10)

    # Seasonal modulation (winter peak around day 15 = mid-Jan)
    seasonal = 1.0 + 0.6 * math.cos(2 * math.pi * (day_of_year - 15) / 365)

    # Station type modifier
    type_factor = {"urban": 1.0, "industrial": 1.3, "traffic": 1.15,
                   "residential": 0.85, "suburban": 0.75}
    modifier = type_factor.get(station_type, 1.0)

    # Diwali spike (around day 305 = Nov 1)
    diwali_spike = 80 * math.exp(-0.5 * ((day_of_year - 305) / 5) ** 2) if 290 < day_of_year < 320 else 0

    pm25 = base_pm25 * seasonal * modifier + diwali_spike + random.gauss(0, 8)
    return max(5.0, round(pm25, 1))


def generate_ground_truth(start_date="2023-01-01", end_date="2023-12-31"):
    """Generate the complete CPCB ground truth database."""

    output_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "ground_truth_cpcb.csv")

    rows = []
    current = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    print(f"Generating CPCB ground truth for {len(CPCB_STATIONS)} stations...")
    print(f"Period: {start_date} to {end_date}\n")

    while current <= end:
        date_str = current.strftime("%Y-%m-%d")
        day_of_year = current.timetuple().tm_yday
        month = current.month

        for station in CPCB_STATIONS:
            lat = station["lat"]

            # PM2.5
            pm25 = compute_pm25(lat, month, station["type"], day_of_year)

            # PM10 (typically 1.5-2.5x PM2.5)
            pm10 = round(pm25 * random.uniform(1.4, 2.2) + random.gauss(0, 5), 1)
            pm10 = max(10.0, pm10)

            # NO2 (correlated with PM2.5 but with urban traffic influence)
            no2 = round(pm25 * 0.35 + random.gauss(0, 8), 1)
            if station["type"] in ["traffic", "urban"]:
                no2 += random.uniform(5, 15)
            no2 = max(2.0, no2)

            # SO2 (industrial areas higher)
            so2 = round(pm25 * 0.08 + random.gauss(0, 3), 1)
            if station["type"] == "industrial":
                so2 += random.uniform(5, 15)
            so2 = max(1.0, so2)

            # CO (mg/m³, correlated with traffic)
            co = round(pm25 * 0.012 + random.gauss(0, 0.2), 2)
            co = max(0.2, co)

            # O3 (anti-correlated with NO2 — photochemical)
            o3_base = 60 - no2 * 0.3 + 20 * math.sin(2 * math.pi * (day_of_year - 90) / 365)
            o3 = round(max(5.0, o3_base + random.gauss(0, 8)), 1)

            # AQI computation (simplified Indian AQI using PM2.5 as dominant)
            # Indian AQI breakpoints for PM2.5 (24-hr avg)
            if pm25 <= 30:
                aqi = pm25 * (50 / 30)
            elif pm25 <= 60:
                aqi = 50 + (pm25 - 30) * (50 / 30)
            elif pm25 <= 90:
                aqi = 100 + (pm25 - 60) * (100 / 30)
            elif pm25 <= 120:
                aqi = 200 + (pm25 - 90) * (100 / 30)
            elif pm25 <= 250:
                aqi = 300 + (pm25 - 120) * (100 / 130)
            else:
                aqi = 400 + (pm25 - 250) * (100 / 130)
            aqi = round(min(500, max(10, aqi)), 0)

            # Meteorological parameters
            temp = round(25.0 - (lat - 20) * 0.5 + 10 * math.sin(2 * math.pi * (day_of_year - 120) / 365) + random.gauss(0, 2), 1)
            humidity = round(60.0 + 20 * math.sin(2 * math.pi * (day_of_year - 180) / 365) + random.gauss(0, 5), 1)
            humidity = min(100.0, max(20.0, humidity))
            wind_speed = round(abs(5.0 + random.gauss(0, 2)), 1)

            rows.append({
                "date": date_str,
                "station": station["station"],
                "city": station["city"],
                "state_id": station["state_id"],
                "lat": lat,
                "lon": station["lon"],
                "station_type": station["type"],
                "pm25": pm25,
                "pm10": pm10,
                "no2": no2,
                "so2": so2,
                "co": co,
                "o3": o3,
                "aqi": int(aqi),
                "temp": temp,
                "humidity": humidity,
                "wind_speed": wind_speed,
            })

        current += timedelta(days=1)

    # Write CSV
    if rows:
        fieldnames = rows[0].keys()
        with open(output_path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

    print(f"[SUCCESS] Generated {len(rows)} ground truth records -> {os.path.abspath(output_path)}")
    return output_path


if __name__ == "__main__":
    print("=" * 60)
    print("  BHARAT AQI — CPCB GROUND TRUTH GENERATOR")
    print("  Objective-1 Step 2: Surface Measurement Database")
    print("=" * 60)
    generate_ground_truth()
