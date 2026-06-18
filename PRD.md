# 📋 Product Requirements Document (PRD)
## BharatAQI — Satellite-Powered Air Quality Intelligence Platform

> **Document Version**: 2.0  
> **Status**: Active — Hackathon Submission  
> **Competition**: ISRO Hackathon 2025  
> **Problem Statement**: Satellite-based Air Quality Monitoring for India

---

## 1. Executive Summary

BharatAQI is a **dual-objective satellite environmental intelligence platform** that addresses the critical gap in India's air quality monitoring network. India's 800+ CPCB ground stations cover less than 1% of the country's geographic area, leaving billions without accurate, localized air quality data.

By fusing satellite remote sensing data from ESA Sentinel-5P (TROPOMI), NASA MODIS/VIIRS fire products, and meteorological reanalysis data through a CNN-LSTM deep learning model, BharatAQI generates **high-resolution, pan-India AQI maps** at 1 km² spatial resolution.

---

## 2. Problem Statement

### 2.1 Core Problem

Air pollution is one of India's most pressing public health crises:
- **1.67 million deaths** annually attributed to air pollution (India State-Level Disease Burden Initiative)
- **800 CPCB monitoring stations** covering only major urban areas — leaving rural India invisible
- **Seasonal crises** from biomass burning (stubble fires in Punjab/Haryana) cause acute spikes in formaldehyde (HCHO) concentrations across the Indo-Gangetic Plain
- **Policy decisions** are made without complete spatial data

### 2.2 Gap Analysis

| Aspect | Current State | BharatAQI Target |
|---|---|---|
| Spatial coverage | ~800 point locations | 1 km² pan-India grid |
| HCHO monitoring | None (satellite only, no hotspot ID) | Hotspot mapping with fire correlation |
| Data latency | 24–48h station reporting | Daily satellite composite |
| Data integration | Single-source | Multi-source fusion (4+ datasets) |
| Accessibility | Expert-only GIS tools | Interactive web dashboard |

---

## 3. Objectives

### Objective-1: High-Resolution Surface AQI Mapping

**Goal**: Generate accurate, high-resolution, spatially continuous AQI maps across India by combining:
- Multi-pollutant columnar concentrations (TROPOMI satellite data)
- Multi-pollutant surface concentrations (CPCB ground station data)
- Meteorological data (IMDAA/ERA5/MERRA-2 reanalysis)

**Output**: Spatial maps of surface AQI at ≤1 km² resolution, updated daily

**Model**: CNN-LSTM deep learning model trained on historical data (2019–2024)

---

### Objective-2: HCHO Hotspot Detection During Biomass Burning

**Goal**: Identify and characterize HCHO (Formaldehyde) hotspot regions during biomass burning seasons over India using:
- Remote sensing data (Sentinel-5P TROPOMI HCHO column density)
- Fire data (MODIS/VIIRS active fire products)
- Re-analysis meteorological data

**Key Outputs**:
1. High-resolution maps of HCHO hotspots during biomass burning seasons over the Indian Region
2. Identification of major source regions (e.g., Indo-Gangetic Plain, forest fire zones)
3. Temporal evolution of HCHO concentrations during burning events
4. Correlation between fire counts and HCHO enhancement

---

## 4. Users & Stakeholders

### 4.1 Primary Users

| User | Role | Need |
|---|---|---|
| **ISRO Scientists** | Evaluation judges | Scientific rigor, methodology validation |
| **CPCB Officials** | Environmental regulators | Nationwide coverage data |
| **State Pollution Boards** | Regional management | State-level AQI maps |
| **Public Health Researchers** | Academic analysis | Spatial data for epidemiology studies |
| **Urban Planners** | City development | Air quality aware planning |

### 4.2 Secondary Users

| User | Role | Need |
|---|---|---|
| **General Public** | Citizens | Accessible AQI information |
| **Media** | Journalists | Visualization for reporting |
| **Farmers** | Agricultural sector | Stubble burning awareness |
| **Hospitals/Clinicians** | Healthcare | Air quality health advisories |

---

## 5. Features & Requirements

### 5.1 Must Have (MVP)

#### ML Pipeline
- [x] **F-ML-01**: Download and preprocess TROPOMI HCHO/NO2 L2 data
- [x] **F-ML-02**: Integrate CPCB ground station PM2.5/PM10 data
- [x] **F-ML-03**: Integrate meteorological reanalysis (ERA5/IMDAA)
- [x] **F-ML-04**: Train CNN-LSTM model for surface AQI prediction
- [x] **F-ML-05**: Generate pan-India AQI grid (GeoTIFF output)
- [x] **F-ML-06**: HCHO hotspot identification algorithm
- [x] **F-ML-07**: Fire-HCHO correlation analysis

#### Web Dashboard
- [x] **F-WEB-01**: Interactive map of India with city AQI markers
- [x] **F-WEB-02**: Real-time (simulated) satellite telemetry stream
- [x] **F-WEB-03**: Multi-pollutant city detail panel (PM2.5, PM10, NO2, HCHO)
- [x] **F-WEB-04**: AQI color-coded heatmap overlay
- [x] **F-WEB-05**: Data source visualization (fusion pipeline)
- [x] **F-WEB-06**: ISRO-branded aerospace UI

### 5.2 Should Have

- [ ] **F-ML-08**: Time series forecasting (next 24h AQI prediction)
- [ ] **F-WEB-07**: Animated HCHO hotspot layer on map
- [ ] **F-WEB-08**: Date range slider for historical data
- [ ] **F-WEB-09**: Downloadable reports (PDF/CSV)
- [ ] **F-ML-09**: Uncertainty/confidence interval maps

### 5.3 Could Have

- [ ] **F-WEB-10**: Mobile responsive full UI
- [ ] **F-WEB-11**: Alert system for severe AQI events
- [ ] **F-ML-10**: Species-specific source apportionment
- [ ] **F-WEB-12**: API endpoint for third-party integration

---

## 6. Evaluation Criteria Mapping

The ISRO Hackathon evaluates on five criteria:

| Criteria | Weight | Our Approach |
|---|---|---|
| **Accuracy & clarity of hotspot detection** | High | CNN-LSTM with RMSE validation, HCHO threshold-based detection |
| **Integration of multi-source datasets** | High | 4+ data sources: TROPOMI, MODIS, ERA5, CPCB |
| **Scientific interpretation of results** | High | Peer-reviewed methodology, validation against ground truth |
| **Visualization quality** | High | Spatial maps, time series, interactive web dashboard |
| **Innovation in methodology** | Medium | Hybrid CNN-LSTM + GEE pipeline, novel fusion approach |

---

## 7. Key Performance Indicators (KPIs)

### ML Model KPIs

| KPI | Target | Measurement |
|---|---|---|
| PM2.5 RMSE | < 5 µg/m³ | Test set validation |
| Model R² | > 0.85 | Pearson correlation vs CPCB ground truth |
| Spatial coverage | 100% Indian territory | Grid completeness |
| Temporal gap fill rate | < 5% missing | Cloud coverage handling |
| HCHO detection precision | > 80% | Against known fire event periods |

### Web Application KPIs

| KPI | Target |
|---|---|
| Page load time | < 3 seconds |
| Dashboard render time | < 1 second |
| Animation frame rate | 60 fps |
| Mobile compatibility | iOS Safari, Chrome Android |

---

## 8. Scientific Validation Plan

### 8.1 Ground Truth Validation
- Compare CNN-LSTM AQI output against withheld CPCB station data
- Compute spatial correlation metrics across Indian regions
- Seasonal breakdown: pre-monsoon, monsoon, post-monsoon, winter

### 8.2 HCHO Validation
- Compare HCHO hotspot maps against known fire events (2019–2023)
- Validate against TROPOMI official HCHO products
- Cross-validate with IASI/OMI historical HCHO records

### 8.3 Statistical Metrics
- **RMSE** (Root Mean Square Error)
- **MAE** (Mean Absolute Error)
- **R²** (Coefficient of determination)
- **Bias** (systematic error)
- **IOA** (Index of Agreement, d = 1 - perfect)

---

## 9. Out of Scope

The following are explicitly **out of scope** for this hackathon submission:
- Real-time satellite downlink (uses near-real-time products, ~3h latency)
- Inverse modeling for emissions quantification
- Chemical transport model (CTM) simulation
- User account management / authentication
- Mobile native app (iOS/Android)
- Multi-language support

---

## 10. Timeline & Milestones

| Phase | Milestone | Status |
|---|---|---|
| Phase 1 | Data acquisition & preprocessing pipeline | ✅ Complete |
| Phase 2 | CNN-LSTM model training (Obj. 1) | ✅ Complete |
| Phase 3 | HCHO hotspot detection pipeline (Obj. 2) | ✅ Complete |
| Phase 4 | Web dashboard development | ✅ Complete |
| Phase 5 | Integration & documentation | ✅ Complete |
| **Submit** | **ISRO Hackathon 2025 Submission** | 🔴 Due |

---

## 11. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| High cloud cover → data gaps | High | Medium | Multi-day composite, gap-filling |
| CPCB data quality issues | Medium | High | Outlier filtering, QA pipeline |
| GPU compute limits (free tier) | Medium | High | Model optimization, Colab Pro fallback |
| TROPOMI swath gaps | Low | Medium | 3-day rolling composite |
| Model overfitting | Medium | High | Dropout, cross-validation |

---

*Document prepared for ISRO Hackathon 2025 submission. All data usage complies with respective agency open-data licenses.*
