<<<<<<< Updated upstream
# 🛰️ BharatAQI — Satellite-Powered Air Quality Intelligence
=======
# BharatAQI — Satellite-Powered Air Quality Intelligence

**ISRO Bharatiya Antariksh Hackathon 2026**  
**Problem Statement 3:** Development of Surface AQI & Identification of HCHO Hotspots over India using Satellite Data

![BharatAQI Dashboard Preview](public/assets/background.png)

## Overview

BharatAQI is an end-to-end AI system that fuses multi-source satellite observations with deep learning to predict ground-level Air Quality Index (AQI) across India. It addresses the critical spatial gaps in CPCB's ground monitoring network by transforming satellite column densities into actionable surface-level health intelligence.

### Key Objectives Achieved
1. **Surface AQI Prediction**: A Hybrid CNN-LSTM model that predicts PM2.5, PM10, NO₂, SO₂, CO, and overall AQI using Sentinel-5P, MODIS, and ERA5 data.
2. **HCHO Hotspot Identification**: Statistical detection of Formaldehyde hotspots, correlating with active fire counts (MODIS/VIIRS) to track agricultural and forest fire emissions.

---

## System Architecture

```mermaid
graph TD
    subgraph Data Acquisition
        S5P[Sentinel-5P TROPOMI<br>NO2, SO2, CO, HCHO, O3]
        MODIS[MODIS/VIIRS<br>AOD, Active Fires]
        ERA5[ERA5 Reanalysis<br>Temp, RH, Wind, BLH]
        CPCB[CPCB Ground Stations<br>AQI Ground Truth]
    end

    subgraph Data Fusion Pipeline
        GEE[Google Earth Engine<br>Spatial Extraction]
        ALIGN[Spatio-Temporal Alignment<br>1km Grid, Daily Resolution]
    end

    subgraph AI Model (CNN-LSTM)
        CNN[Conv1D Layers<br>Spatial Feature Extraction]
        LSTM[LSTM Layers<br>Temporal Dynamics]
        OUT[Multi-Output Head<br>PM2.5, PM10, Gases, AQI]
    end

    subgraph User Interface
        API[FastAPI / Next.js API]
        DASH[Next.js Dashboard<br>Web/Mobile Responsive]
        EXPORT[Data Export<br>CSV/PNG/GeoTIFF]
    end

    S5P --> GEE
    MODIS --> GEE
    ERA5 --> GEE
    GEE --> ALIGN
    CPCB --> ALIGN
    
    ALIGN --> CNN
    CNN --> LSTM
    LSTM --> OUT
    
    OUT --> API
    API --> DASH
    API --> EXPORT
```

---

## Datasets

| Dataset | Variables | Resolution | Source |
|---------|-----------|------------|--------|
| Sentinel-5P | NO₂, SO₂, CO, HCHO, O₃ | 3.5×5.5 km | Copernicus/ESA |
| MODIS MAIAC | Aerosol Optical Depth (AOD) | 1 km | NASA LP DAAC |
| FIRMS | Active Fire Counts | 375 m | NASA EOSDIS |
| ERA5 | Temp, RH, Wind, BLH | 0.25° | ECMWF |
| CPCB | PM2.5, PM10, NO₂, SO₂, CO | Point | Gov of India |

---

## Model Performance (Test Set)

Our CNN-LSTM architecture outperforms traditional machine learning baselines by capturing both the non-linear atmospheric chemistry (via CNN) and the temporal dispersion dynamics (via LSTM).

| Model | R² Score | RMSE (AQI) | MAE (AQI) |
|-------|----------|------------|-----------|
| Random Forest | 0.821 | 41.2 | 32.1 |
| XGBoost | 0.849 | 37.6 | 29.5 |
| Vanilla LSTM | 0.901 | 30.1 | 23.8 |
| **CNN-LSTM (Ours)** | **0.954** | **24.1** | **19.5** |

*Validation target achieved: RMSE < 30 AQI units.*

---

## Project Structure

```
bharataqi/
├── data/               # Raw and processed datasets (CSV/GeoTIFF)
├── notebooks/          # Jupyter notebooks for EDA, Training, Validation
├── scripts/            # Python automated pipelines
│   ├── data_ingestion/ # GEE scripts for satellite retrieval
│   └── objective_1/    # PyTorch/TensorFlow ML pipeline
├── src/                # Next.js Dashboard App
│   ├── app/            # App router & API endpoints
│   ├── components/     # React UI components
│   └── lib/            # Utilities and region definitions
└── README.md
```

---
>>>>>>> Stashed changes

<div align="center">

<<<<<<< Updated upstream
![BharatAQI Banner](./public/assets/background.png)

**AI-powered, satellite-fused AQI monitoring platform for India**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ISRO Hackathon](https://img.shields.io/badge/ISRO-Hackathon%202025-FF6A00?logo=satellite&logoColor=white)](#)

</div>

---

## 📋 Overview

**BharatAQI** is a hackathon-grade satellite environmental intelligence platform developed for the **ISRO Hackathon 2025**. It addresses two critical objectives:

1. **Objective-1** — Generate high-resolution surface **AQI maps** across India by fusing satellite columnar data (TROPOMI/Sentinel-5P), CPCB ground station measurements, and meteorological reanalysis through a **CNN-LSTM deep learning model**.

2. **Objective-2** — Identify and analyze **HCHO (Formaldehyde) hotspots** during biomass burning seasons using MODIS/VIIRS fire data, remote sensing imagery, and Python/MATLAB processing via Google Earth Engine.

> India's ground monitoring stations are sparse (~800 CPCB stations nationwide), leaving 99% of the country's geography unmonitored. BharatAQI bridges this gap with satellite intelligence.

---

## 📁 Project Documentation

| Document | Description |
|---|---|
| [`README.md`](./README.md) | This file — project overview and setup guide |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Full system architecture — data pipelines, ML models, tech stack |
| [`PRD.md`](./PRD.md) | Product Requirements Document — features, use cases, KPIs |
| [`TRD.md`](./TRD.md) | Technical Requirements Document — APIs, data formats, model specs |
| [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) | Zero-cost implementation blueprint — free-tier tools and workflows |
| [`CHANGELOG.md`](./CHANGELOG.md) | Version history and release notes |

---

## 🌐 Live Application

The web platform is a **Next.js 15** application featuring:

- 🚀 **Launch Experience** — Animated hero with dual-orbit stellar system and docking sequence
- 🗺️ **Interactive Dashboard** — Real-time satellite heatmap of India with live AQI readings
- 📡 **Satellite Telemetry Stream** — Simulated Sentinel-5P orbital data feed
- 🔥 **MODIS Fire Integration** — Active fire hotspot overlays
- 📊 **Multi-pollutant Readout** — PM2.5, PM10, NO2, HCHO column density per city

---

## 🛠️ Tech Stack

### Frontend Platform
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 RC |
| Language | TypeScript 5 |
| Styling | TailwindCSS 3.4 + Custom CSS |
| Animations | GSAP 3.15, Framer Motion 12 |
| 3D Canvas | Three.js 0.184 via @react-three/fiber |
| Icons | Lucide React |
| Fonts | Orbitron (headers), Sora (body), Inter, Geist Mono |

### ML/Data Pipeline (Backend)
| Layer | Technology |
|---|---|
| Deep Learning | Python · TensorFlow/PyTorch · CNN-LSTM |
| Satellite Data | ESA Sentinel-5P TROPOMI (HCHO, NO2) |
| Fire Data | NASA MODIS/VIIRS Active Fire Products |
| Meteorology | IMDAA / ERA5 / MERRA-2 reanalysis |
| Ground Truth | CPCB 800+ surface monitoring stations |
| Processing | Google Earth Engine · Python · MATLAB |
| Geospatial | Google Earth Engine · GeoTIFF · NetCDF |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/Parthbo7/BharatAQI.git
cd BharatAQI

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📂 Repository Structure

```
BharatAQI/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts & metadata
│   │   ├── page.tsx            # Entry point → LaunchExperience
│   │   └── globals.css         # Design system CSS + glass panels
│   └── components/
│       ├── LaunchExperience.tsx # Hero landing + orbit animation + transitions
│       ├── Dashboard/
│       │   └── index.tsx       # Mission Control dashboard (main view)
│       ├── ProblemCard.tsx     # Problem statement + mission objectives card
│       ├── SpaceCanvas.tsx     # Three.js ambient starfield + rocket animation
│       └── SVGLogo.tsx         # ISRO vector logo component
├── public/
│   └── assets/                 # Background images, ISRO wordmark, etc.
├── ARCHITECTURE.md             # System architecture documentation
├── PRD.md                      # Product Requirements Document
├── TRD.md                      # Technical Requirements Document
├── IMPLEMENTATION.md           # Zero-cost implementation guide
├── CHANGELOG.md                # Release history
├── ISRO_Hackathon_Visual_PRD_TRD-v2.pdf
├── ISRO_Hackathon_Zero_Cost_Implementation_Blueprint.pdf
├── tailwind.config.ts          # Tailwind + custom color tokens
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧠 Machine Learning Pipeline

### Objective-1: AQI Surface Mapping

```
Satellite Columnar Data (TROPOMI)  ─┐
CPCB Surface Station Data          ─┼──► CNN-LSTM Model ──► Spatial AQI Maps (1km²)
Meteorological Data (ERA5/IMDAA)   ─┘
```

- **Model**: CNN-LSTM hybrid for spatiotemporal feature extraction
- **Resolution**: 1 km² fused grid
- **Coverage**: Pan-India (8°N–37°N, 68°E–97°E)
- **Output**: Daily + hourly AQI maps with confidence intervals

### Objective-2: HCHO Hotspot Detection

```
Remote Sensing Data (Sentinel-5P)  ─┐
Fire Data (MODIS/VIIRS)            ─┼──► GEE Processing ──► HCHO Hotspot Maps
Re-analysis Meteorological Data    ─┘
```

- **Processing**: Python + MATLAB + Google Earth Engine
- **Focus**: Biomass burning seasons (Oct–Nov, Gangetic Plains)
- **Output**: High-resolution HCHO concentration maps, fire-HCHO correlation

---

## 📊 Key Evaluation Criteria

| Criteria | Target |
|---|---|
| Accuracy & clarity of hotspot detection | RMSE < 5 µg/m³ |
| Multi-source data integration | 4+ data sources fused |
| Scientific interpretation | Validated against CPCB ground truth |
| Visualization quality | 1km² spatial resolution |
| Innovation in methodology | CNN-LSTM + GEE pipeline |

---

## 🌍 Data Sources

| Source | Type | Resolution | Access |
|---|---|---|---|
| ESA Sentinel-5P TROPOMI | HCHO, NO2, UV columnar | 3.5×5.5 km | [ESA Copernicus](https://dataspace.copernicus.eu) |
| NASA MODIS (Terra/Aqua) | Active fires, LST | 500m–1km | [NASA Earthdata](https://earthdata.nasa.gov) |
| NASA VIIRS (S-NPP) | Fire radiative power | 375m | [NASA Earthdata](https://earthdata.nasa.gov) |
| ECMWF ERA5 | Meteorological reanalysis | 31km | [Copernicus CDS](https://cds.climate.copernicus.eu) |
| IMDAA | Indian meteorology | 12km | [NCMRWF](https://ncmrwf.gov.in) |
| MERRA-2 | NASA reanalysis | 50km | [NASA GES DISC](https://disc.gsfc.nasa.gov) |
| CPCB | Ground AQI stations | Point data | [CPCB](https://cpcb.nic.in) |

---

## 👥 Team

**ISRO Hackathon 2025 — Team BharatAQI**

Developed under the guidance of ISRO's Space Applications Centre (SAC) problem statement focused on satellite-based air quality monitoring for India.

---

## 📄 License

This project is developed for educational and research purposes under the **ISRO Hackathon 2025** program.

---

<div align="center">
Made with ❤️ for India's clean air · Powered by satellite intelligence · Built for ISRO Hackathon 2025
</div>
=======
### 1. Using Docker (Recommended)
```bash
# Build and run the entire stack (API + Frontend)
docker-compose up --build
```
Access the dashboard at `http://localhost:3000`.

### 2. Manual Local Setup
```bash
# 1. Install dependencies
npm install
pip install -r requirements.txt

# 2. Run the ML pipeline (trains model and generates model_results.json)
python scripts/objective_1/generate_results.py

# 3. Start the Next.js development server
npm run dev
```

---

## Known Limitations & Future Work

1. **Cloud Contamination**: Monsoon season (July-August) causes significant data gaps in optical satellite retrievals. The current model relies heavily on ERA5 interpolation during these periods.
2. **Resolution**: Current spatial resolution is ~1km. Future work aims to downscale to 100m using high-resolution meteorological models (e.g., WRF-Chem).
3. **Real-time Latency**: Sentinel-5P Level-2 products have a ~12-24 hour processing latency. For strict real-time needs, Level-1 Near Real-Time (NRT) products would be required.
>>>>>>> Stashed changes
