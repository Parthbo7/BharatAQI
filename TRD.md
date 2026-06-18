# ⚙️ Technical Requirements Document (TRD)
## BharatAQI — Satellite Environmental Intelligence System

> **Document Version**: 2.0  
> **Status**: Active  
> **Companion**: PRD v2.0, ARCHITECTURE.md v2.0

---

## 1. System Overview

BharatAQI is a **multi-component technical system** comprising:
1. A **Python-based ML pipeline** for satellite data processing and AQI/HCHO prediction
2. A **Next.js 15 web application** for interactive visualization and public access
3. A **Google Earth Engine** workflow for large-scale geospatial analysis

---

## 2. Data Requirements

### 2.1 Input Data Specifications

#### TROPOMI Sentinel-5P (ESA Copernicus)

| Attribute | Value |
|---|---|
| Product | S5P_OFFL_L2__HCHO / S5P_OFFL_L2__NO2 |
| Format | HDF5 / NetCDF-4 |
| Spatial resolution | 3.5 × 5.5 km (native), regridded to 0.01° |
| Temporal resolution | Daily (1 overpass/day over India, ~13:30 local) |
| QA threshold | `qa_value > 0.75` |
| Cloud filter | Cloud radiance fraction < 0.5 |
| Geolocation | Lat/lon corner coordinates per pixel |
| Access | [ESA Copernicus Data Space](https://dataspace.copernicus.eu) (free) |
| API | `sentinelsat` Python library |

#### MODIS Active Fire Products

| Attribute | Value |
|---|---|
| Product | MOD14A1 (Terra), MYD14A1 (Aqua) |
| Format | HDF4 |
| Spatial resolution | 1 km |
| Temporal resolution | Daily |
| Bands used | FireMask (0–9 confidence), FRP (MW) |
| Access | NASA Earthdata (free registration) |
| API | `earthaccess` Python library |

#### VIIRS Active Fire

| Attribute | Value |
|---|---|
| Product | VNP14 (S-NPP), VJ114 (JPSS-1) |
| Format | HDF5 |
| Spatial resolution | 375 m |
| Fire pixels | Brightness temperature thresholding |
| FRP | Fire Radiative Power (MW/pixel) |

#### ERA5 Meteorological Reanalysis

| Attribute | Value |
|---|---|
| Dataset | ERA5 (ECMWF) |
| Variables | `u10`, `v10`, `t2m`, `d2m`, `sp`, `blh`, `tp` |
| Format | GRIB2 / NetCDF |
| Resolution | 0.25° (~28 km), hourly |
| Access | Copernicus CDS API (free API key) |
| Python API | `cdsapi` |

#### CPCB Ground Stations

| Attribute | Value |
|---|---|
| Station count | 800+ |
| Parameters | PM2.5, PM10, NO2, SO2, CO, O3, NH3 |
| Format | CSV (hourly / 24h average) |
| Access | CPCB Open Data portal / data.gov.in |
| Spatial coverage | 200+ cities across India |

---

## 3. Software Requirements

### 3.1 Python ML Pipeline

#### Core Dependencies

```txt
# requirements.txt — ML Pipeline

# Satellite & Geospatial
sentinelsat>=1.2.1      # ESA Copernicus download
earthaccess>=0.6.0      # NASA Earthdata download  
cdsapi>=0.6.0           # ECMWF ERA5 download
h5py>=3.8.0             # HDF5 reader
netCDF4>=1.6.3          # NetCDF reader
rasterio>=1.3.6         # GeoTIFF I/O
pyproj>=3.5.0           # Coordinate projection
shapely>=2.0.1          # Geometry operations
geopandas>=0.13.0       # Geospatial dataframes

# Numerical / Scientific
numpy>=1.24.0
pandas>=2.0.0
scipy>=1.11.0
xarray>=2023.6.0        # N-D array for NetCDF
dask>=2023.8.0          # Parallel processing for large arrays

# Machine Learning
tensorflow>=2.13.0      # CNN-LSTM model training
# OR
torch>=2.0.0            # PyTorch alternative
scikit-learn>=1.3.0     # Preprocessing, metrics

# Visualization (offline)
matplotlib>=3.7.2
cartopy>=0.21.0         # Map projections
seaborn>=0.12.2

# Utilities
tqdm>=4.65.0            # Progress bars
joblib>=1.3.0           # Parallel preprocessing
```

### 3.2 Google Earth Engine (JavaScript / Python)

```javascript
// GEE Script — HCHO Hotspot Detection (JavaScript API)

// Time window: biomass burning season
var startDate = '2023-10-01';
var endDate = '2023-11-30';
var indiaGeom = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'India')).geometry();

// TROPOMI HCHO
var hcho = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_HCHO')
  .filterDate(startDate, endDate)
  .filterBounds(indiaGeom)
  .select('tropospheric_HCHO_column_number_density')
  .map(function(img) {
    return img.updateMask(img.gt(0));  // QA mask
  });

// Monthly composite
var hchoMonthly = hcho.median().clip(indiaGeom);

// MODIS Fire
var fires = ee.ImageCollection('MODIS/006/MOD14A1')
  .filterDate(startDate, endDate)
  .filterBounds(indiaGeom)
  .select('FireMask');

var activeFires = fires.map(function(img) {
  return img.gte(7);  // High confidence fires
}).sum();
```

### 3.3 Web Application

#### Frontend Dependencies

```json
{
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0-rc-65a56d0e-20241020",
    "react-dom": "19.0.0-rc-65a56d0e-20241020",
    "@react-three/fiber": "^9.6.1",
    "three": "^0.184.0",
    "framer-motion": "^12.40.0",
    "gsap": "^3.15.0",
    "lucide-react": "^1.20.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3.4.1",
    "@types/three": "^0.184.1"
  }
}
```

#### Browser Support

| Browser | Minimum Version | Notes |
|---|---|---|
| Chrome | 90+ | Primary development target |
| Firefox | 88+ | Full support |
| Safari | 14+ | WebGL required for Three.js |
| Edge | 90+ | Chromium-based |
| Mobile Chrome | 90+ | Touch events supported |

---

## 4. Model Specifications

### 4.1 CNN-LSTM Architecture (Objective-1)

```python
# Model Architecture

import tensorflow as tf
from tensorflow.keras import layers, Model

def build_cnn_lstm_model(
    spatial_input_shape=(32, 32, N_FEATURES),  # H×W×C
    sequence_length=7,                           # Days of lag
    n_outputs=1                                  # AQI scalar
):
    # Spatial CNN branch
    spatial_input = tf.keras.Input(shape=spatial_input_shape)
    x = layers.Conv2D(64, (3,3), activation='relu', padding='same')(spatial_input)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPool2D((2,2))(x)
    x = layers.Conv2D(128, (3,3), activation='relu', padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.GlobalAveragePooling2D()(x)
    
    # Temporal LSTM branch
    temporal_input = tf.keras.Input(shape=(sequence_length, N_TEMPORAL_FEATURES))
    y = layers.LSTM(256, return_sequences=True)(temporal_input)
    y = layers.Dropout(0.2)(y)
    y = layers.LSTM(128)(y)
    y = layers.Dropout(0.2)(y)
    
    # Fusion
    merged = layers.Concatenate()([x, y])
    merged = layers.Dense(128, activation='relu')(merged)
    merged = layers.Dropout(0.15)(merged)
    output = layers.Dense(n_outputs, activation='sigmoid')(merged)
    output = layers.Lambda(lambda t: t * 500)(output)  # Scale to AQI 0-500
    
    model = Model(inputs=[spatial_input, temporal_input], outputs=output)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss=tf.keras.losses.Huber(delta=10.0),
        metrics=['mae']
    )
    return model
```

### 4.2 Training Configuration

| Parameter | Value |
|---|---|
| Epochs | 200 (early stopping, patience=20) |
| Batch size | 32 |
| Learning rate | 1e-4 (cosine decay) |
| Optimizer | Adam (β₁=0.9, β₂=0.999) |
| Loss | Huber (δ=10, robust to PM2.5 outliers) |
| Regularization | L2 (λ=1e-4) + Dropout (0.15–0.2) |
| Data split | 70/15/15 (train/val/test) |
| GPU | NVIDIA T4 (Google Colab free tier) |
| Training time | ~4–6 hours |

### 4.3 Input Feature Matrix

| Feature | Source | Channels |
|---|---|---|
| HCHO column density | TROPOMI | 1 |
| NO2 tropospheric column | TROPOMI | 1 |
| UV aerosol index | TROPOMI | 1 |
| PM2.5 ground (CPCB) | CPCB stations + kriging | 1 |
| PM10 ground (CPCB) | CPCB stations + kriging | 1 |
| Wind U (10m) | ERA5 | 1 |
| Wind V (10m) | ERA5 | 1 |
| Temperature (2m) | ERA5 | 1 |
| Relative humidity | ERA5 | 1 |
| Planetary boundary layer height | ERA5 | 1 |
| Fire radiative power (MODIS FRP) | MODIS/VIIRS | 1 |
| NDVI (vegetation proxy) | MODIS MOD13A2 | 1 |
| **Total channels** | | **12** |

---

## 5. API Specifications

### 5.1 Data APIs Used

#### ESA Copernicus Data Space API

```bash
# Authentication
sentinelsat --user <USER> --password <PASS> \
  --geometry POLYGON((68 8, 97 8, 97 37, 68 37, 68 8)) \
  --start 2023-10-01 --end 2023-10-31 \
  --producttype S5P_L2__HCHO__ \
  --query "processingMode=OFFL"
```

#### ECMWF CDS API

```python
import cdsapi
c = cdsapi.Client()
c.retrieve('reanalysis-era5-single-levels', {
    'product_type': 'reanalysis',
    'variable': ['u_component_of_wind', 'v_component_of_wind', 
                 '2m_temperature', 'boundary_layer_height'],
    'year': '2023', 'month': '10',
    'day': [f'{d:02d}' for d in range(1, 32)],
    'time': ['00:00', '06:00', '12:00', '18:00'],
    'area': [37, 68, 8, 97],  # N, W, S, E
    'format': 'netcdf'
}, 'era5_india_oct2023.nc')
```

### 5.2 Internal API Design (Future)

```
GET /api/aqi?lat={lat}&lon={lon}&date={YYYY-MM-DD}
→ { aqi: number, pm25: number, pm10: number, no2: number, hcho: number, confidence: number }

GET /api/heatmap?date={YYYY-MM-DD}&bbox={minLon,minLat,maxLon,maxLat}
→ { geotiff_url: string, legend: { min: number, max: number } }

GET /api/hotspots?date={YYYY-MM-DD}&type=hcho|fire
→ { hotspots: [{ lat, lon, intensity, area_km2 }] }

GET /api/timeseries?city={city}&pollutant={pm25|hcho|no2}&days={n}
→ { timestamps: string[], values: number[], unit: string }
```

---

## 6. Infrastructure Requirements

### 6.1 Development Environment

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.10+ | ML pipeline |
| CUDA | 11.8+ | GPU acceleration |
| Node.js | 18.x LTS | Web development |
| Git | 2.x | Version control |
| Docker | 24.x | Optional containerization |

### 6.2 Compute Requirements

| Stage | CPU | RAM | GPU | Storage |
|---|---|---|---|---|
| Data download | 4 cores | 8 GB | None | 500 GB |
| Preprocessing | 8 cores | 32 GB | None | 200 GB |
| Model training | 8 cores | 32 GB | T4 16GB | 50 GB |
| Inference | 4 cores | 16 GB | Optional | 10 GB |
| Web server | 2 vCPU | 2 GB | None | 5 GB |

### 6.3 Zero-Cost Infrastructure (Hackathon)

| Service | Free Tier Limits | Usage |
|---|---|---|
| Google Colab | T4 GPU, 12h session | Model training |
| Google Drive | 15 GB | Dataset storage |
| Vercel | 100 GB bandwidth/month | Web hosting |
| GitHub Actions | 2000 min/month | CI/CD |
| ESA Copernicus | Unlimited (registered) | TROPOMI data |
| NASA Earthdata | Unlimited (registered) | MODIS/VIIRS |
| ECMWF CDS | 150,000 items/month | ERA5 data |
| Google Earth Engine | Unlimited (academic) | GEE processing |

---

## 7. Output Format Specifications

### 7.1 AQI Grid Output (Objective-1)

```
Format: GeoTIFF (Cloud-Optimized COG recommended)
CRS: EPSG:4326 (WGS84 Geographic)
Resolution: 0.01° × 0.01° (~1 km at Indian latitudes)
Extent: 68°E–97°E, 8°N–37°N
Pixel depth: Float32
NoData: -9999.0
Bands:
  Band 1: AQI (0–500)
  Band 2: PM2.5 (µg/m³)
  Band 3: PM10 (µg/m³)
  Band 4: NO2 (ppb)
  Band 5: Confidence (0–1)
Filename convention: bharataqi_YYYYMMDD.tif
```

### 7.2 HCHO Hotspot Output (Objective-2)

```
Format: GeoTIFF + GeoJSON
CRS: EPSG:4326
Resolution: 0.01° × 0.01°
Bands (GeoTIFF):
  Band 1: HCHO column density (mol/m²)
  Band 2: HCHO anomaly (σ above seasonal mean)
  Band 3: Fire count (count/pixel)
  Band 4: Hotspot binary mask (0/1)
GeoJSON: Hotspot polygons with metadata
  { id, date, hcho_max, area_km2, fire_count, region_name }
```

### 7.3 Time Series CSV

```csv
date,city,pm25,pm10,no2,hcho_du,aqi,confidence
2023-10-01,Delhi,195.3,310.1,84.2,0.12,345,0.94
2023-10-01,Mumbai,44.8,94.2,31.9,0.04,125,0.97
```

---

## 8. Testing Requirements

### 8.1 ML Model Tests

| Test | Method | Pass Criteria |
|---|---|---|
| PM2.5 RMSE | 15% holdout test set | RMSE < 5 µg/m³ |
| Spatial correlation | Per-city validation | R² > 0.85 |
| HCHO detection | Known fire event periods | Precision > 80% |
| Temporal stability | Rolling monthly eval | RMSE drift < 10% |
| Edge cases | Monsoon cloud cover | Coverage > 60% |

### 8.2 Web Application Tests

| Test | Tool | Coverage |
|---|---|---|
| Component rendering | React Testing Library | All major components |
| Animation performance | Chrome DevTools | 60fps target |
| Accessibility | Axe-core | WCAG 2.1 AA |
| Load time | Lighthouse | Score > 85 |
| Cross-browser | Manual | Chrome, Firefox, Safari |

---

## 9. Security & Compliance

### 9.1 Data Licensing

| Dataset | License | Commercial Use |
|---|---|---|
| Sentinel-5P TROPOMI | Copernicus Open Access (CC-BY 4.0) | ✅ Yes |
| MODIS/VIIRS | NASA Open Data | ✅ Yes |
| ERA5 | ECMWF Open Licence | ✅ Yes |
| CPCB Data | Government of India Open Data | ✅ Yes |

### 9.2 Privacy

- No personally identifiable information (PII) collected
- No user accounts or authentication in hackathon version
- Aggregate environmental data only

---

*This TRD is part of the BharatAQI ISRO Hackathon 2025 submission package.*
