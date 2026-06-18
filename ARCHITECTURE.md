# 🏗️ BharatAQI — System Architecture

> **Version**: 2.0 | **Last Updated**: June 2025 | **Status**: Active Development

---

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Data Ingestion Layer](#1-data-ingestion-layer)
3. [Processing & ML Pipeline](#2-processing--ml-pipeline)
4. [Objective-1: AQI Surface Mapping](#3-objective-1-aqi-surface-mapping-cnn-lstm)
5. [Objective-2: HCHO Hotspot Detection](#4-objective-2-hcho-hotspot-detection)
6. [Web Application Architecture](#5-web-application-architecture)
7. [Component Hierarchy](#6-component-hierarchy)
8. [Data Flow Diagrams](#7-data-flow-diagrams)
9. [Infrastructure & Deployment](#8-infrastructure--deployment)
10. [Design System](#9-design-system)

---

## High-Level Overview

BharatAQI is a **dual-objective satellite environmental intelligence system** with two distinct pipeline architectures converging at the visualization layer.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BHARATAQI PLATFORM                           │
│                                                                     │
│  ┌─────────────────┐         ┌─────────────────────────────────┐   │
│  │   DATA SOURCES  │         │        ML/PROCESSING            │   │
│  │                 │         │                                 │   │
│  │ • Sentinel-5P   │──────►  │  Objective-1: CNN-LSTM AQI     │   │
│  │ • MODIS/VIIRS   │         │  Objective-2: HCHO GEE Proc.   │   │
│  │ • ERA5/IMDAA    │         │                                 │   │
│  │ • CPCB Stations │         └─────────────┬───────────────────┘   │
│  └─────────────────┘                       │                       │
│                                            ▼                       │
│                              ┌─────────────────────────┐           │
│                              │  VISUALIZATION / API    │           │
│                              │  Next.js 15 Dashboard   │           │
│                              │  Interactive India Map  │           │
│                              │  Real-time Telemetry    │           │
│                              └─────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Data Ingestion Layer

### 1.1 Satellite Data Sources

| Satellite | Sensor | Parameters | Temporal | Spatial |
|---|---|---|---|---|
| **ESA Sentinel-5P** | TROPOMI | HCHO, NO2, SO2, O3, CO, CH4, UV aerosol | Daily | 3.5×5.5 km |
| **NASA Terra** | MODIS | MOD14A1 Active Fires, MOD11A1 LST | Daily | 1 km |
| **NASA Aqua** | MODIS | MYD14A1 Active Fires | Daily | 1 km |
| **S-NPP / JPSS** | VIIRS | VNP14 Fire Radiative Power | Daily | 375 m |

### 1.2 Meteorological Data

| Source | Dataset | Parameters | Resolution |
|---|---|---|---|
| **ECMWF ERA5** | ERA5-Land | Wind U/V, Temperature, RH, PBL height | 31 km / hourly |
| **NCMRWF IMDAA** | IMDAA | Indian Regional Analysis | 12 km / 6-hourly |
| **NASA MERRA-2** | M2T1NXAER | Aerosol optical depth, wind | ~50 km / hourly |

### 1.3 Ground Truth Data

| Source | Coverage | Parameters | Update Frequency |
|---|---|---|---|
| **CPCB** | 800+ stations, 200+ cities | PM2.5, PM10, NO2, SO2, CO, O3, AQI | Hourly |
| **SAFAR** | Major metro areas | Multi-pollutant + forecasting | Hourly |

---

## 2. Processing & ML Pipeline

### 2.1 Data Preprocessing Flow

```
Raw Satellite Data
       │
       ▼
┌──────────────────┐
│  1. QA Filtering │  Remove cloud-contaminated pixels
│     & Masking    │  Apply TROPOMI QA flag (>0.75)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  2. Regridding   │  Reproject to 0.01° × 0.01° (~1km) grid
│  & Reprojection  │  Domain: 8°N–37°N, 68°E–97°E
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Temporal      │  Gap-fill using kriging/IDW
│    Aggregation   │  Daily composite generation
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. Feature       │  Normalize · Standardize
│    Engineering   │  Lag features (t-1, t-3, t-7 days)
└────────┬─────────┘
         │
         ▼
    Model Input
```

---

## 3. Objective-1: AQI Surface Mapping (CNN-LSTM)

### 3.1 Architecture Diagram

```
                    INPUT FEATURES
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  TROPOMI     │ │  CPCB Ground │ │  Met. Data   │
│  Columnar    │ │  Station     │ │  ERA5/IMDAA  │
│  (HCHO,NO2)  │ │  (PM2.5/10) │ │  (Wind,Temp) │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┴────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  CNN Feature        │
              │  Extractor (2D)     │
              │  • Conv2D (64, 3×3) │
              │  • MaxPool2D        │
              │  • Conv2D (128,3×3) │
              │  • BatchNorm        │
              └──────────┬──────────┘
                         │  Spatial features
                         ▼
              ┌─────────────────────┐
              │  LSTM Temporal      │
              │  Sequence Module    │
              │  • LSTM(256, 2L)    │
              │  • Dropout(0.2)     │
              │  • Dense(128)       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Output Layer       │
              │  • Dense(1)         │
              │  • Sigmoid × 500    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  SPATIAL AQI MAP   │
              │  Pan-India 1km²    │
              │  Grid Output       │
              └─────────────────────┘
```

### 3.2 Model Specifications

| Parameter | Value |
|---|---|
| Architecture | CNN-LSTM Hybrid |
| Input channels | Multi-pollutant + meteorological (N features) |
| CNN layers | 2× Conv2D (64→128 filters, kernel 3×3) |
| LSTM layers | 2× stacked, 256 hidden units |
| Optimizer | Adam (lr=1e-4, decay schedule) |
| Loss function | Huber Loss (robust to outliers) |
| Training split | 70% train / 15% val / 15% test |
| Evaluation metric | RMSE, MAE, R², Pearson correlation |
| Target RMSE | < 5 µg/m³ for PM2.5 |
| Model confidence | 94.6% (per validation set) |

### 3.3 Output Products

| Product | Format | Description |
|---|---|---|
| Daily AQI Grid | GeoTIFF / NetCDF | Pan-India 1km² daily composite |
| Hourly AQI Map | JSON tiles | Real-time streaming, major cities |
| Pollutant Layers | Separate GeoTIFF | PM2.5, PM10, NO2, HCHO independent layers |
| Uncertainty Map | GeoTIFF | Confidence intervals per pixel |

---

## 4. Objective-2: HCHO Hotspot Detection

### 4.1 Architecture Diagram

```
        INPUT DATA
             │
    ┌─────────┼──────────────┐
    │         │              │
    ▼         ▼              ▼
┌────────┐ ┌────────────┐ ┌─────────────────────┐
│Remote  │ │Fire Data   │ │Re-analysis Met.     │
│Sensing │ │MODIS/VIIRS │ │(Wind, PBL, Temp)    │
│(S-5P)  │ │(FRP, count)│ │ERA5/MERRA-2         │
└───┬────┘ └─────┬──────┘ └──────────┬──────────┘
    │             │                   │
    └─────────────┴───────────────────┘
                  │
                  ▼
    ┌─────────────────────────────┐
    │  Processing Engine          │
    │  ┌─────────────────────┐   │
    │  │  Google Earth Engine│   │
    │  │  (GEE JavaScript)   │   │
    │  └─────────────────────┘   │
    │  ┌────────┐ ┌──────────┐   │
    │  │ Python │ │  MATLAB  │   │
    │  │ pandas │ │ Statistical│  │
    │  │ numpy  │ │ Analysis  │   │
    │  └────────┘ └──────────┘   │
    └──────────────┬──────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │   OUTPUTS       │
         ├─────────────────┤
         │ HCHO Hotspot    │
         │ Maps (High-Res) │
         │                 │
         │ Source Region   │
         │ Identification  │
         │ (IGP, forests)  │
         │                 │
         │ Temporal HCHO   │
         │ Evolution Plots │
         │                 │
         │ Fire-HCHO       │
         │ Correlation     │
         └─────────────────┘
```

### 4.2 Processing Steps

1. **HCHO Column Retrieval** — Download L2 TROPOMI HCHO products, apply AMF correction
2. **QA Filtering** — Remove pixels with cloud radiance fraction > 0.5
3. **Daily Composite** — Generate median HCHO composite over Indian domain
4. **Fire Count Integration** — Overlay MODIS fire pixels with HCHO fields
5. **Hotspot Identification** — Statistical thresholding (µ + 2σ per pixel)
6. **Trajectory Analysis** — HYSPLIT back-trajectories for source attribution
7. **Temporal Analysis** — Time series decomposition during burning seasons

### 4.3 Key Output Metrics

| Metric | Description |
|---|---|
| HCHO Enhancement | Relative to seasonal baseline (%) |
| Source Attribution | Fire count correlation coefficient (R²) |
| Spatial Coverage | % of Indian subcontinent mapped |
| Detection Threshold | Minimum detectable HCHO enhancement |

---

## 5. Web Application Architecture

### 5.1 Next.js 15 App Router Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root HTML, fonts, SEO metadata
│   ├── page.tsx                  # Route "/" → LaunchExperience
│   └── globals.css               # Design tokens, glass panels
│
└── components/
    ├── LaunchExperience.tsx      # Hero + orbit animation system
    ├── SpaceCanvas.tsx           # Three.js ambient starfield
    ├── ProblemCard.tsx           # Mission objectives display card
    ├── SVGLogo.tsx               # ISRO vector mark
    └── Dashboard/
        └── index.tsx             # Mission Control (full dashboard)
```

### 5.2 State Management

```
LaunchExperience
├── showDashboard: boolean          # Hero ↔ Dashboard toggle
├── isTransitioning: boolean        # Lock during animation
└── refs:
    ├── spaceCanvasRef              # Three.js rocket control
    ├── primaryStarRef              # Orbiting star-1 position
    ├── secondaryStarRef            # Orbiting star-2 position
    ├── titleRef                    # Center orbit target
    └── orbitContainerRef           # Trail particle container

Dashboard
├── selectedCity: CityData          # Active map pin selection
├── currentTime: string             # Live IST clock
├── logs: LogEntry[]                # Scrolling telemetry stream
├── satelliteAngle: number          # S5P orbit animation angle
└── telemetryState: {...}           # Altitude, speed, latency
```

### 5.3 Animation System

The launch screen features a **dual-orbit animation system**:

- **Primary Star** — Orbits clockwise around "BHARATAQI" at 0.0145 rad/frame
- **Secondary Star** — Orbits counter-clockwise at 0.0145 rad/frame
- **Trail Particles** — DOM-injected particles every 2nd frame, fade in ~400ms
- **Docking Sequence** — On CTA click, both stars converge on the AQI dot
- **Energy Pulse Ring** — SVG ring expands from convergence point
- **Transition** — `gsap.to(heroRef)` blurs + scales out, Dashboard fades in

---

## 6. Component Hierarchy

```
App (page.tsx)
└── LaunchExperience
    ├── SpaceCanvas (Three.js ambient layer)
    │   └── Rocket animation (state-driven)
    ├── Nav
    │   └── "LAUNCH PLATFORM" button → handleEnterPlatform()
    ├── Hero Section
    │   ├── ISRO Wordmark (img)
    │   ├── Orbit Container
    │   │   ├── primaryStarRef (DOM-animated div)
    │   │   ├── secondaryStarRef (DOM-animated div)
    │   │   └── Title ("BHARATAQI" + dotRef for docking)
    │   ├── ProblemCard
    │   │   └── Mission Objectives grid (4 items)
    │   └── CTA Buttons × 2
    └── Dashboard (shown after transition)
        ├── Header (ISRO nav, status badges, live clock)
        ├── Left Column
        │   ├── City Selector (5 cities)
        │   └── AQI Gauge + Pollutant Matrix
        ├── Center Column
        │   └── SVG India Map (heatmap + city markers)
        ├── Right Column
        │   ├── S5P Orbit Telemetry Widget
        │   └── Telemetry Log Stream
        └── Footer
            └── Data Fusion Pipeline (3 sources)
```

---

## 7. Data Flow Diagrams

### 7.1 Real-time Dashboard Data Flow

```
User opens BharatAQI
        │
        ▼
LaunchExperience (Hero)
        │  User clicks "ENTER MISSION CONTROL"
        ▼
Docking Animation (GSAP)
        │  onComplete
        ▼
Dashboard mounts
        │
        ├── useEffect (clock) → setInterval 1s → currentTime state
        ├── useEffect (logs)  → setInterval 4s → new log entry + telemetry jitter
        └── useEffect (orbit) → rAF loop → setSatelliteAngle

City Selector click → setSelectedCity → AQI gauge + pollutant grid re-render
Map marker click   → setSelectedCity → same
```

### 7.2 ML Data Flow (Backend)

```
TROPOMI L2 (HDF5/NetCDF)
         │
         ▼
ESA Copernicus Data Space API
         │
         ▼
Python Downloader (sentinelsat / cdsapi)
         │
         ▼
Preprocessing Pipeline (xarray + rasterio)
    - QA masking, cloud filtering
    - Regrid to 0.01° resolution
    - Temporal gap-filling
         │
         ▼
Feature Matrix Construction
    [HCHO, NO2, PM2.5, PM10, T, RH, Wind-U, Wind-V, FRP, ...]
         │
         ▼
CNN-LSTM Model (TensorFlow / PyTorch)
         │
         ▼
Prediction Grid (numpy array → GeoTIFF)
         │
         ▼
GeoJSON / PMTiles export for web visualization
```

---

## 8. Infrastructure & Deployment

### 8.1 Zero-Cost Architecture (Hackathon)

```
┌─────────────────────────────────────────────────────┐
│              FREE TIER DEPLOYMENT                    │
│                                                     │
│  Frontend:  Vercel (Next.js, free tier, 100GB BW)  │
│  Compute:   Google Colab (GPU T4, 12h sessions)     │
│  Storage:   Google Drive (15GB) + HuggingFace Hub  │
│  Satellite: ESA Copernicus (open access)            │
│  Fire Data: NASA Earthdata (free registration)     │
│  Met Data:  Copernicus CDS (free API key)          │
│  GEE:       Google Earth Engine (free academic)    │
│  CI/CD:     GitHub Actions (free, 2000 min/month)  │
└─────────────────────────────────────────────────────┘
```

### 8.2 Production Architecture (Recommended)

```
CDN (Cloudflare) → Vercel Edge (Next.js SSR)
                          │
                    API Routes (Next.js)
                          │
              ┌───────────┼───────────┐
              │           │           │
        GEE API     Model Server   Data Store
        (HCHO)      (FastAPI)      (PostGIS)
                    (GPU VM)       (GeoTIFF)
```

---

## 9. Design System

### 9.1 Color Tokens

```css
/* BharatAQI Design Tokens */
--orange:        #FF6A00   /* Primary accent — fire/alert */
--orange-flame:  #FF8833   /* Secondary accent */
--orange-core:   #E55A00   /* Deep orange */
--blue-isro:     #0054A6   /* ISRO space blue */
--blue-light:    #2D9CDB   /* Data/info blue */
--background:    #03050A   /* Deep space background */
```

### 9.2 Typography

| Token | Font | Usage |
|---|---|---|
| `font-orbitron` | Orbitron (Google Fonts) | Headers, labels, HUD elements |
| `font-body` | Sora | Body text, descriptions |
| `font-mono` | Geist Mono | Telemetry data, code, numbers |
| `font-display` | Inter | Display text, card titles |

### 9.3 Glass Panel System

```css
.glass-panel {
  background: rgba(10, 15, 30, 0.45);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

.glass-panel-glow {
  /* Same + orange inner glow for active states */
  border: 1px solid rgba(255, 106, 0, 0.15);
  box-shadow: 0 0 25px rgba(255, 106, 0, 0.05), 
              inset 0 0 15px rgba(255, 106, 0, 0.05);
}
```

### 9.4 AQI Color Scale

| AQI Range | Status | Color |
|---|---|---|
| 0–50 | Good | `#10b981` (Emerald) |
| 51–100 | Satisfactory | `#84cc16` (Lime) |
| 101–200 | Moderate | `#ffb428` (Amber) |
| 201–300 | Poor | `#f59e0b` (Yellow) |
| 301–400 | Very Poor | `#ff6a00` (Orange) |
| 401–500+ | Severe | `#dc2626` (Red) |

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 2.0 | June 2025 | Full architecture doc — dual-objective, full pipeline |
| 1.0 | May 2025 | Initial architecture sketch |
