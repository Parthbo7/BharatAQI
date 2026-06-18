# 📅 Changelog — BharatAQI

All notable changes to BharatAQI are documented in this file.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] — 2025-06-18 · ISRO Hackathon Final Submission

### Added
- Full dual-orbit animation system on hero (primary + secondary star, counter-rotating)
- GSAP-powered docking sequence: stars converge → AQI dot super-glow → energy pulse ring → dashboard transition
- Three.js ambient starfield canvas via `@react-three/fiber`
- Dashboard Mission Control with full 3-column 12-column grid layout
- Interactive SVG India heatmap with city markers and AQI hotspot radial gradients
- Live scrolling satellite telemetry log stream (30-entry FIFO buffer, 4s updates)
- S5P orbital telemetry widget with animated rotating satellite node
- AQI circular SVG gauge with animated arc and color-coded status label
- Multi-pollutant city detail panel (PM2.5, PM10, NO2, HCHO DU)
- Live IST clock in dashboard header
- Three status badges: TROPOMI S5P, MODIS Fire Link, Deep Learning Model
- Data Fusion Pipeline footer (Sentinel-5P → MODIS/VIIRS → CPCB pipeline visualization)
- ProblemCard component with 4-objective mission grid
- `ARCHITECTURE.md` — full system architecture documentation
- `PRD.md` — Product Requirements Document
- `TRD.md` — Technical Requirements Document
- `DESIGN.md` — Design system and visual language
- `IMPLEMENTATION.md` — Zero-cost deployment blueprint
- Comprehensive `README.md` rewrite with full project documentation

### Changed
- Replaced default Next.js README with project-specific documentation
- Upgraded from basic page to full aerospace-themed launch experience

### Design
- Deep space color theme (`#03050A` background)
- ISRO saffron orange (`#FF6A00`) as primary accent
- Glassmorphism panel system (`glass-panel`, `glass-panel-glow`)
- Orbitron font for all HUD/brand elements
- Geist Mono for all telemetry and data readouts

---

## [1.0.0] — 2025-05-15 · Initial Setup

### Added
- Next.js 15 project initialized with `create-next-app`
- TailwindCSS 3.4 configuration with custom color tokens
- Framer Motion 12 for entry animations
- GSAP 3.15 for timeline animations
- Three.js 0.184 via `@react-three/fiber` for 3D canvas
- Lucide React for iconography
- Google Fonts: Orbitron, Sora, Inter
- Local font: Geist Mono
- Basic project structure: `app/`, `components/`, `public/assets/`
- TypeScript strict configuration
- ESLint with Next.js config

---

## Roadmap

### [2.1.0] — Planned
- [ ] Real GEE HCHO tile integration via Next.js API routes
- [ ] Date range picker for historical AQI data
- [ ] HCHO animated hotspot layer on India map
- [ ] Forecast panel (next 24–72h prediction)
- [ ] Export to PDF/PNG report button

### [3.0.0] — Future
- [ ] Real backend API with FastAPI + PostGIS
- [ ] Live TROPOMI data ingestion pipeline
- [ ] Mobile-first responsive redesign
- [ ] Multi-language support (Hindi, Tamil, Bengali)
- [ ] Push notifications for Severe AQI alerts
- [ ] City comparison mode (side-by-side)
