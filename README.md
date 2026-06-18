# 🛰️ BharatAQI — Satellite-Powered Air Quality Intelligence

<div align="center">

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
