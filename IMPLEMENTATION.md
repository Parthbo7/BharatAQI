# 🚀 Zero-Cost Implementation Blueprint
## BharatAQI — ISRO Hackathon 2025

> **Philosophy**: Every tool, service, and platform used in this project is **100% free** for academic/hackathon use. No paid subscriptions, no credit cards, no hidden costs.

---

## 1. Free-Tier Stack Overview

```
┌──────────────────────────────────────────────────────────────┐
│               ZERO-COST IMPLEMENTATION STACK                 │
├──────────────────┬───────────────────────────────────────────┤
│  CATEGORY        │  FREE TOOL / SERVICE                      │
├──────────────────┼───────────────────────────────────────────┤
│  Web Hosting     │  Vercel (free tier, 100GB BW/month)       │
│  GPU Compute     │  Google Colab (T4 GPU, 12h sessions)      │
│  Data Storage    │  Google Drive (15GB) + HuggingFace Hub    │
│  Satellite Data  │  ESA Copernicus (open access, unlimited)  │
│  Fire Data       │  NASA Earthdata (free registration)       │
│  Met Data        │  ECMWF Copernicus CDS (150k items/month)  │
│  GEE Processing  │  Google Earth Engine (free academic)      │
│  Source Control  │  GitHub (free, unlimited public repos)    │
│  CI/CD           │  GitHub Actions (2000 min/month free)     │
│  Model Registry  │  HuggingFace Model Hub (free)             │
│  Dev Environment │  VS Code + Python (free, open source)     │
└──────────────────┴───────────────────────────────────────────┘
```

**Total monthly cost**: **₹0 / $0**

---

## 2. Data Acquisition — Step by Step

### 2.1 Sentinel-5P TROPOMI (HCHO / NO2)

**Where to get it**: [ESA Copernicus Data Space](https://dataspace.copernicus.eu)

```bash
# Step 1: Register at https://identity.dataspace.copernicus.eu/auth/
# Step 2: Install sentinelsat
pip install sentinelsat

# Step 3: Download HCHO data for India, Oct-Nov 2023
sentinelsat \
  --user YOUR_EMAIL \
  --password YOUR_PASSWORD \
  --geometry POLYGON((68 8, 97 8, 97 37, 68 37, 68 8)) \
  --start 2023-10-01 \
  --end 2023-11-30 \
  --producttype S5P_OFFL_L2__HCHO__ \
  --query "processingMode=OFFL" \
  --download
```

**Alternative — Python API**:
```python
from sentinelsat import SentinelAPI
api = SentinelAPI('user', 'password', 'https://dataspace.copernicus.eu/odata/v1')
products = api.query(
    area='POLYGON((68 8, 97 8, 97 37, 68 37, 68 8))',
    date=('2023-10-01', '2023-11-30'),
    producttype='S5P_OFFL_L2__HCHO__'
)
api.download_all(products)
```

**File size per day**: ~500 MB–1 GB (HDF5)  
**Storage needed**: ~60–120 GB for 2-month period

---

### 2.2 NASA MODIS/VIIRS Fire Data

**Where to get it**: [NASA Earthdata](https://earthdata.nasa.gov)

```python
import earthaccess

# Step 1: Register at https://urs.earthdata.nasa.gov/
# Step 2: Install earthaccess
# pip install earthaccess

earthaccess.login(strategy='netrc')  # Store credentials in ~/.netrc

# Search MODIS MOD14A1 - Terra Active Fire Daily
results = earthaccess.search_data(
    short_name='MOD14A1',
    temporal=('2023-10-01', '2023-11-30'),
    bounding_box=(68, 8, 97, 37)  # India: W, S, E, N
)

# Download
earthaccess.download(results, local_path='./data/modis_fire/')
```

**VIIRS (higher resolution - 375m)**:
```python
results_viirs = earthaccess.search_data(
    short_name='VNP14',   # VIIRS S-NPP
    temporal=('2023-10-01', '2023-11-30'),
    bounding_box=(68, 8, 97, 37)
)
earthaccess.download(results_viirs, local_path='./data/viirs_fire/')
```

---

### 2.3 ERA5 Meteorological Data

**Where to get it**: [Copernicus CDS](https://cds.climate.copernicus.eu)

```bash
# Step 1: Register at https://cds.climate.copernicus.eu/
# Step 2: Install cdsapi + add ~/.cdsapirc
pip install cdsapi
```

```ini
# ~/.cdsapirc
url: https://cds.climate.copernicus.eu/api/v2
key: YOUR_UID:YOUR_API_KEY
```

```python
import cdsapi
c = cdsapi.Client()

# Download wind, temperature, humidity, PBL height
c.retrieve('reanalysis-era5-single-levels', {
    'product_type': 'reanalysis',
    'variable': [
        'u_component_of_wind',
        'v_component_of_wind',
        '2m_temperature',
        '2m_dewpoint_temperature',
        'boundary_layer_height',
        'total_precipitation',
    ],
    'year': ['2023'],
    'month': ['10', '11'],
    'day': [f'{d:02d}' for d in range(1, 32)],
    'time': ['00:00', '06:00', '12:00', '18:00'],
    'area': [37, 68, 8, 97],  # N, W, S, E
    'format': 'netcdf'
}, 'era5_india_oct_nov_2023.nc')
```

---

### 2.4 CPCB Ground Station Data

**Where to get it**: [data.gov.in](https://data.gov.in) or [CPCB Open Data](https://cpcb.nic.in/automatic-monitoring-data/)

```python
import pandas as pd

# CPCB data available as CSV downloads — no API key needed
# Aggregate from: https://airquality.cpcb.gov.in/aqi_dashboard/

# Example: loading daily PM2.5 data
df = pd.read_csv('cpcb_pm25_daily_2023.csv')
df['date'] = pd.to_datetime(df['date'])
df = df[df['date'].between('2023-10-01', '2023-11-30')]

# Filter to stations with > 80% completeness
station_completeness = df.groupby('station_id')['pm25'].count() / df['date'].nunique()
valid_stations = station_completeness[station_completeness > 0.8].index
df_clean = df[df['station_id'].isin(valid_stations)]
```

---

## 3. ML Pipeline — Google Colab

### 3.1 Setting Up Colab Environment

```python
# Google Colab Setup (T4 GPU — free tier)
# Runtime → Change runtime type → T4 GPU

# Mount Google Drive for persistent storage
from google.colab import drive
drive.mount('/content/drive')

# Install dependencies
!pip install -q sentinelsat earthaccess cdsapi \
  rasterio geopandas xarray netCDF4 h5py \
  tensorflow cartopy scikit-learn tqdm

# Verify GPU
import tensorflow as tf
print("GPU:", tf.config.list_physical_devices('GPU'))
```

### 3.2 Data Preprocessing Pipeline

```python
import numpy as np
import xarray as xr
import rasterio
from rasterio.warp import reproject, Resampling
from scipy.interpolate import griddata

# Grid definition — Pan-India 1km
GRID = {
    'lon': np.arange(68.0, 97.0, 0.01),   # 2900 pixels
    'lat': np.arange(37.0, 8.0, -0.01),    # 2900 pixels
}

def load_tropomi_hcho(filepath: str) -> np.ndarray:
    """Load and QA-filter TROPOMI HCHO L2 product."""
    import h5py
    with h5py.File(filepath, 'r') as f:
        hcho = f['/PRODUCT/formaldehyde_tropospheric_vertical_column'][0]
        qa = f['/PRODUCT/qa_value'][0]
        lat = f['/PRODUCT/latitude'][0]
        lon = f['/PRODUCT/longitude'][0]
    
    # Apply QA filter
    mask = qa > 0.75
    hcho_clean = np.where(mask, hcho, np.nan)
    
    # Regrid to 0.01° using griddata
    valid = ~np.isnan(hcho_clean)
    hcho_grid = griddata(
        (lon[valid], lat[valid]), hcho_clean[valid],
        (GRID_LON_2D, GRID_LAT_2D),
        method='linear'
    )
    return hcho_grid

def load_modis_fire(filepath: str) -> np.ndarray:
    """Extract fire pixel count per 0.01° grid cell."""
    import h5py
    with h5py.File(filepath, 'r') as f:
        fire_mask = f['FireMask'][:]  # 0-9 confidence
    # High confidence fires (≥7)
    fire_binary = (fire_mask >= 7).astype(float)
    return fire_binary  # Regrid similarly
```

### 3.3 Training the CNN-LSTM Model

```python
import tensorflow as tf

# Build model (see TRD.md for full architecture)
model = build_cnn_lstm_model()

# Training with early stopping and checkpointing
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=20, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint(
        '/content/drive/MyDrive/bharataqi/best_model.h5',
        save_best_only=True, monitor='val_mae'
    ),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=10),
]

history = model.fit(
    [X_spatial_train, X_temporal_train], y_train,
    validation_data=([X_spatial_val, X_temporal_val], y_val),
    epochs=200,
    batch_size=32,
    callbacks=callbacks,
    verbose=1
)

# Save to HuggingFace Hub (free model registry)
# pip install huggingface_hub
from huggingface_hub import upload_file
upload_file('best_model.h5', repo_id='Parthbo7/BharatAQI-CNN-LSTM')
```

---

## 4. HCHO Processing — Google Earth Engine

### 4.1 GEE Script (JavaScript Code Editor)

**Access**: [code.earthengine.google.com](https://code.earthengine.google.com) (free academic account)

```javascript
// BharatAQI — HCHO Hotspot Detection Script
// Paste in GEE Code Editor and run

var india = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'India'))
  .geometry();

// Define burning season
var start = '2023-10-01';
var end = '2023-11-30';

// ─── Objective 2A: HCHO Column Density ───────────────────────
var hcho = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_HCHO')
  .filterDate(start, end)
  .filterBounds(india)
  .select('tropospheric_HCHO_column_number_density')
  .map(function(img) {
    // QA: mask negative/invalid retrievals
    return img.updateMask(img.gt(0));
  });

var hchoComposite = hcho.median().clip(india);

// ─── Objective 2B: Active Fire Integration ────────────────────
var fires = ee.ImageCollection('MODIS/061/MOD14A1')
  .filterDate(start, end)
  .filterBounds(india)
  .select('FireMask')
  .map(function(img) { return img.gte(7); }); // High-confidence only

var totalFires = fires.sum().clip(india);

// ─── Hotspot Detection: Statistical Thresholding ──────────────
var hchoMean = hcho.mean().clip(india);
var hchoStd = hcho.reduce(ee.Reducer.stdDev()).clip(india);
var threshold = hchoMean.add(hchoStd.multiply(2)); // µ + 2σ
var hotspots = hchoComposite.gt(threshold);

// ─── Visualization ────────────────────────────────────────────
Map.centerObject(india, 5);

var hchoVis = { min: 0, max: 0.001,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 
            'yellow', 'orange', 'red'] };
Map.addLayer(hchoComposite, hchoVis, 'HCHO Column (Oct-Nov 2023)');

var fireVis = { min: 0, max: 50, palette: ['yellow', 'orange', 'red'] };
Map.addLayer(totalFires, fireVis, 'MODIS Fire Count');

Map.addLayer(hotspots.selfMask(), { palette: ['FF0000'] }, 'HCHO Hotspots');

// ─── Export to Google Drive ────────────────────────────────────
Export.image.toDrive({
  image: hchoComposite,
  description: 'HCHO_India_Oct_Nov_2023',
  folder: 'BharatAQI',
  fileNamePrefix: 'hcho_composite_oct_nov_2023',
  region: india,
  scale: 1000,  // 1km resolution
  crs: 'EPSG:4326',
  maxPixels: 1e10
});

Export.image.toDrive({
  image: hotspots,
  description: 'HCHO_Hotspots_India',
  folder: 'BharatAQI',
  fileNamePrefix: 'hcho_hotspots_oct_nov_2023',
  region: india,
  scale: 1000,
  crs: 'EPSG:4326',
  maxPixels: 1e10
});
```

### 4.2 GEE Python API Alternative

```python
import ee

# Authenticate once
ee.Authenticate()
ee.Initialize(project='your-gee-project-id')

india = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017') \
    .filter(ee.Filter.eq('country_na', 'India')) \
    .geometry()

hcho_collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_HCHO') \
    .filterDate('2023-10-01', '2023-11-30') \
    .filterBounds(india) \
    .select('tropospheric_HCHO_column_number_density')

hcho_composite = hcho_collection.median().clip(india)

# Export
task = ee.batch.Export.image.toDrive(
    image=hcho_composite,
    description='HCHO_Composite',
    folder='BharatAQI',
    scale=1000,
    region=india,
    maxPixels=1e10
)
task.start()
print('Export started. Check GEE Tasks panel.')
```

---

## 5. Web Application — Vercel Deployment

### 5.1 Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
cd d:\ISRO
vercel

# Follow prompts:
# → Link to existing project or create new
# → Framework: Next.js (auto-detected)
# → Build command: npm run build (default)
# → Output directory: .next (default)

# Production deployment
vercel --prod
```

**Vercel Free Tier Limits**:
- 100 GB bandwidth / month
- 100 serverless function invocations / day
- Unlimited deployments
- Custom domain support
- Automatic HTTPS

### 5.2 Environment Variables (if needed)

```bash
# Set in Vercel dashboard or CLI
vercel env add NEXT_PUBLIC_GEE_MAP_URL production
vercel env add NEXT_PUBLIC_API_BASE_URL production
```

### 5.3 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy BharatAQI to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 6. Cost Breakdown

### 6.1 Monthly Free Tier Usage

| Service | Free Allowance | Our Usage | Status |
|---|---|---|---|
| Vercel Hosting | 100 GB bandwidth | ~2 GB | ✅ Well within |
| Google Colab GPU | 12h sessions (renewable) | 10h training | ✅ Sufficient |
| Google Drive | 15 GB | ~8 GB data | ✅ Within limits |
| Copernicus CDS | 150,000 API items/month | ~5,000 | ✅ Well within |
| NASA Earthdata | Unlimited | Unlimited | ✅ Free |
| ESA Copernicus | Unlimited (registered) | ~60 GB data | ✅ Free |
| Google Earth Engine | Unlimited (academic) | GEE scripts | ✅ Free |
| GitHub Actions | 2,000 min/month | ~50 min | ✅ Well within |
| HuggingFace Hub | Unlimited public | Model storage | ✅ Free |

**Total Cost: ₹0 / month**

### 6.2 If Scaling Beyond Free Tier

| Upgrade | Cost | When Needed |
|---|---|---|
| Vercel Pro | $20/month | >100 GB bandwidth |
| Colab Pro | $10/month | Longer GPU sessions |
| GCP Compute (n1-standard-4 + T4) | ~$0.50/hour | Production inference |
| Cloud Storage (GCS) | $0.02/GB/month | Large dataset archive |

---

## 7. Development Workflow

### 7.1 Local Development

```bash
# Clone
git clone https://github.com/Parthbo7/BharatAQI.git
cd BharatAQI

# Install
npm install

# Run dev server (hot reload)
npm run dev
# → http://localhost:3000

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### 7.2 Python ML Development

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run preprocessing
python scripts/preprocess_tropomi.py

# Train model
python scripts/train_cnn_lstm.py

# Generate AQI maps
python scripts/inference.py --date 2023-10-15
```

### 7.3 Git Workflow

```bash
# Feature branch
git checkout -b feature/hcho-hotspot-detection

# Commit
git add .
git commit -m "feat: add HCHO hotspot detection pipeline"

# Push + PR
git push origin feature/hcho-hotspot-detection
# → Create PR on GitHub → Auto-deploy preview on Vercel
```

---

*This implementation blueprint was designed specifically for zero-cost execution within the ISRO Hackathon 2025 constraints.*
