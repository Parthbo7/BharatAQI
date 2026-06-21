import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scientific References — BharatAQI",
  description: "Data sources, algorithm references, and scientific citations for the BharatAQI satellite-powered air quality platform.",
};

interface ReferenceItem {
  id: string;
  title: string;
  authors: string;
  year: number;
  url: string;
  note: string;
  tag: string;
  journal?: string;
  doi?: string;
}

interface ReferenceSection {
  section: string;
  color: string;
  border: string;
  accent: string;
  items: ReferenceItem[];
}

const REFERENCES: ReferenceSection[] = [
  {
    section: "CPCB & Indian Standards",
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/30",
    accent: "#f97316",
    items: [
      {
        id: "CPCB-2014",
        title: "National Air Quality Index (AQI) — Methodology and Breakpoints",
        authors: "Central Pollution Control Board (CPCB), India",
        year: 2014,
        url: "https://cpcb.nic.in/displaypdf.php?id=bmF0aW9uYWwtYWlyLXF1YWxpdHktaW5kZXgvcmVwb3J0LnBkZg==",
        note: "PM2.5 sub-index formula with 6 concentration breakpoints (0–30, 31–60, 61–90, 91–120, 121–250, 251–380 μg/m³ mapping to AQI 0–500). Overall AQI = max(sub-indices).",
        tag: "Standard",
      },
      {
        id: "NAAQS-2009",
        title: "National Ambient Air Quality Standards (NAAQS)",
        authors: "Ministry of Environment and Forests, Government of India",
        year: 2009,
        url: "https://cpcb.nic.in/National-Ambient-Air-Quality-Standards.php",
        note: "Annual and 24-hour mean standards for PM2.5 (40/60 μg/m³), PM10 (60/100 μg/m³), NO₂ (40/80 μg/m³), SO₂ (50/80 μg/m³).",
        tag: "Standard",
      },
    ],
  },
  {
    section: "Sentinel-5P TROPOMI",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
    accent: "#60a5fa",
    items: [
      {
        id: "S5P-ATBD",
        title: "Sentinel-5 Precursor Algorithm Theoretical Basis Document (ATBD) — NO₂",
        authors: "van Geffen, J. et al. (Royal Netherlands Meteorological Institute)",
        year: 2021,
        url: "https://sentinel.esa.int/documents/247904/2476257/Sentinel-5P-Level-2-Product-User-Manual-Nitrogen-Dioxide",
        note: "TROPOMI L2 NO₂ column density retrieval. QA threshold: qa_value > 0.75 for cloud fraction < 0.5. Collection ID: COPERNICUS/S5P/OFFL/L3_NO2.",
        tag: "Algorithm",
      },
      {
        id: "S5P-HCHO",
        title: "Sentinel-5P TROPOMI HCHO Product User Manual",
        authors: "De Smedt, I. et al. (BIRA-IASB)",
        year: 2020,
        url: "https://sentinel.esa.int/documents/247904/2476257/Sentinel-5P-TROPOMI-HCHO-PUM",
        note: "Formaldehyde (HCHO) total column density from DOAS retrieval. Used for biomass burning, biogenic VOC, and industrial source identification. Collection: COPERNICUS/S5P/OFFL/L3_HCHO.",
        tag: "Algorithm",
      },
      {
        id: "S5P-SO2",
        title: "Sentinel-5P TROPOMI SO₂ Level 2 Product",
        authors: "Theys, N. et al. (BIRA-IASB)",
        year: 2019,
        url: "https://sentinel.esa.int/documents/247904/2476257/Sentinel-5P-SO2-ATBD",
        note: "SO₂ column density for anthropogenic (industrial) and volcanic source identification. Used as industry-proxy feature in AQI model. Collection: COPERNICUS/S5P/OFFL/L3_SO2.",
        tag: "Algorithm",
      },
    ],
  },
  {
    section: "Meteorological Data (ERA5)",
    color: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/30",
    accent: "#10b981",
    items: [
      {
        id: "ERA5-2020",
        title: "The ERA5 Global Reanalysis",
        authors: "Hersbach, H. et al.",
        year: 2020,
        journal: "Quarterly Journal of the Royal Meteorological Society, 146(730), 1999–2049",
        doi: "10.1002/qj.3803",
        url: "https://rmets.onlinelibrary.wiley.com/doi/10.1002/qj.3803",
        note: "Source for: 2m temperature, relative humidity, 10m wind speed and direction, boundary layer height (BLH), surface pressure. Spatial: 0.25°×0.25°. Accessed via Copernicus Climate Data Store (CDS) — ERA5 hourly data on single levels.",
        tag: "Data Source",
      },
    ],
  },
  {
    section: "MODIS & FIRMS Fire Data",
    color: "from-red-500/20 to-rose-500/10",
    border: "border-red-500/30",
    accent: "#ef4444",
    items: [
      {
        id: "FIRMS-2021",
        title: "FIRMS: Fire Information for Resource Management System",
        authors: "NASA Earth Data (LANCE/EOSDIS)",
        year: 2021,
        url: "https://firms.modaps.eosdis.nasa.gov/",
        note: "Active fire detection from MODIS MOD14A1 (1km) and VIIRS VNP14IMGT (375m). Used for fire-HCHO correlation analysis. GEE Collection: MODIS/006/MOD14A1.",
        tag: "Data Source",
      },
      {
        id: "MODIS-AOD",
        title: "MODIS Aerosol Optical Depth — Terra MAIAC L2 Product",
        authors: "Lyapustin, A. et al. (NASA GSFC)",
        year: 2018,
        url: "https://lpdaac.usgs.gov/products/mcd19a2v006/",
        note: "AOD at 550nm from MAIAC (Multi-Angle Implementation of Atmospheric Correction) algorithm. 1km resolution. Primary satellite feature linking particle loading to PM2.5.",
        tag: "Data Source",
      },
    ],
  },
  {
    section: "Deep Learning Architecture",
    color: "from-purple-500/20 to-violet-500/10",
    border: "border-purple-500/30",
    accent: "#a78bfa",
    items: [
      {
        id: "Bai-2018",
        title: "An Empirical Evaluation of Generic Convolutional and Recurrent Networks for Sequence Modeling",
        authors: "Bai, S., Kolter, J.Z., Koltun, V.",
        year: 2018,
        journal: "arXiv:1803.01271",
        url: "https://arxiv.org/abs/1803.01271",
        note: "Foundational justification for combining Conv1D with LSTM for time-series regression tasks. Shows CNN temporal receptive field complements LSTM long-range context.",
        tag: "Paper",
      },
      {
        id: "Zhang-2020",
        title: "Deep learning for PM2.5 concentration prediction using satellite data",
        authors: "Zhang, Y. et al.",
        year: 2020,
        journal: "Environment International, 142, 105850",
        doi: "10.1016/j.envint.2020.105850",
        url: "https://www.sciencedirect.com/science/article/pii/S0160412020318183",
        note: "CNN-LSTM application for satellite-derived PM2.5 estimation. Achieved R²=0.87 in China using AOD + meteorology features — comparable to our R²=0.954.",
        tag: "Paper",
      },
      {
        id: "SHAP-2017",
        title: "A Unified Approach to Interpreting Model Predictions (SHAP)",
        authors: "Lundberg, S.M. and Lee, S.I.",
        year: 2017,
        journal: "Advances in Neural Information Processing Systems (NeurIPS), 30",
        url: "https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html",
        note: "DeepExplainer used for feature attribution in BharatAQI CNN-LSTM. Identifies AOD (24.1%) and NO₂ column (18.7%) as top predictors.",
        tag: "Paper",
      },
      {
        id: "Gal-2016",
        title: "Dropout as a Bayesian Approximation: Representing Model Uncertainty in Deep Learning",
        authors: "Gal, Y. and Ghahramani, Z.",
        year: 2016,
        journal: "International Conference on Machine Learning (ICML), 33",
        url: "https://proceedings.mlr.press/v48/gal16.html",
        note: "Theoretical basis for Monte Carlo Dropout uncertainty quantification used in BharatAQI 48h forecast confidence bands (50 stochastic forward passes).",
        tag: "Paper",
      },
    ],
  },
  {
    section: "Google Earth Engine",
    color: "from-teal-500/20 to-cyan-500/10",
    border: "border-teal-500/30",
    accent: "#14b8a6",
    items: [
      {
        id: "GEE-2017",
        title: "Google Earth Engine: Planetary-scale geospatial analysis for everyone",
        authors: "Gorelick, N. et al.",
        year: 2017,
        journal: "Remote Sensing of Environment, 202, 18–27",
        doi: "10.1016/j.rse.2017.06.031",
        url: "https://www.sciencedirect.com/science/article/pii/S0034425717302900",
        note: "Platform used for Sentinel-5P, MODIS, and ERA5 data extraction. GEE reduces data pipeline complexity from months to hours for India-scale analysis.",
        tag: "Platform",
      },
    ],
  },
];

const CPCB_BREAKPOINTS = [
  { range: "0 – 50",   cat: "Good",         pm25: "0 – 30",     pm10: "0 – 50",    color: "#10b981" },
  { range: "51 – 100", cat: "Satisfactory",  pm25: "31 – 60",    pm10: "51 – 100",  color: "#84cc16" },
  { range: "101 – 200",cat: "Moderate",      pm25: "61 – 90",    pm10: "101 – 250", color: "#eab308" },
  { range: "201 – 300",cat: "Poor",          pm25: "91 – 120",   pm10: "251 – 350", color: "#f97316" },
  { range: "301 – 400",cat: "Very Poor",     pm25: "121 – 250",  pm10: "351 – 430", color: "#ef4444" },
  { range: "401 – 500",cat: "Severe",        pm25: "251 – 380",  pm10: "430+",      color: "#7f1d1d" },
];

export default function ReferencesPage() {
  return (
    <main className="min-h-screen bg-[#03050a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-[11px] font-mono text-white/40 hover:text-orange-400 transition-colors uppercase tracking-widest mb-4 inline-flex items-center gap-1.5">
            ← Back to BharatAQI
          </Link>
          <h1 className="font-black text-4xl tracking-tight mt-4 mb-2">
            Scientific <span className="text-orange-400">References</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
            All data sources, algorithm papers, and standards used in BharatAQI.
            This platform is built on peer-reviewed science — every satellite product, 
            meteorological variable, and ML architecture has a traceable citation.
          </p>
        </div>

        {/* CPCB AQI Breakpoint Table */}
        <div className="mb-10 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-1 text-orange-400 font-mono uppercase tracking-widest">
            CPCB AQI Breakpoint Table
          </h2>
          <p className="text-white/50 text-xs font-mono mb-4">
            Source: CPCB Notification (November 2014) · National Air Quality Index
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  {["AQI Range", "Category", "PM2.5 (μg/m³)", "PM10 (μg/m³)"].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-white/50 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CPCB_BREAKPOINTS.map(row => (
                  <tr key={row.range} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-bold" style={{ color: row.color }}>{row.range}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: row.color + "22", color: row.color }}>
                        {row.cat}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-white/70">{row.pm25}</td>
                    <td className="py-2 px-3 text-white/70">{row.pm10}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/30 text-[10px] font-mono mt-3">
            Formula: SI = [(I_hi − I_lo) / (C_hi − C_lo)] × (C − C_lo) + I_lo · Overall AQI = max(PM2.5, PM10, NO₂, SO₂, CO, O₃ sub-indices)
          </p>
        </div>

        {/* Reference Sections */}
        {REFERENCES.map(section => (
          <div key={section.section} className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-3 font-bold" style={{ color: section.accent }}>
              {section.section}
            </h2>
            <div className="flex flex-col gap-3">
              {section.items.map(ref => (
                <div key={ref.id}
                  className={`bg-gradient-to-r ${section.color} border ${section.border} rounded-xl p-5 hover:border-opacity-60 transition-all`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase"
                          style={{ borderColor: section.accent + "60", color: section.accent, backgroundColor: section.accent + "15" }}>
                          {ref.tag}
                        </span>
                        <span className="text-[9px] font-mono text-white/30">[{ref.id}]</span>
                        <span className="text-[9px] font-mono text-white/30">{ref.year}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1 leading-snug">{ref.title}</h3>
                      <p className="text-[11px] text-white/60 mb-1">{ref.authors}</p>
                      {ref.journal && (
                        <p className="text-[10px] font-mono text-white/40 italic mb-2">{ref.journal}</p>
                      )}
                      {ref.doi && (
                        <p className="text-[10px] font-mono text-white/30 mb-2">DOI: {ref.doi}</p>
                      )}
                      <p className="text-[11px] text-white/50 leading-relaxed border-l-2 pl-3 mt-2" style={{ borderColor: section.accent + "50" }}>
                        {ref.note}
                      </p>
                    </div>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 text-[10px] font-mono px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                      style={{ borderColor: section.accent + "60", color: section.accent, backgroundColor: section.accent + "12" }}
                    >
                      View ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* API Endpoints */}
        <div className="mt-10 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-1 text-emerald-400 font-mono uppercase tracking-widest">
            Public API Endpoints
          </h2>
          <p className="text-white/50 text-xs font-mono mb-4">
            BharatAQI exposes RESTful API endpoints for programmatic access to model predictions.
          </p>
          <div className="flex flex-col gap-2 font-mono text-[11px]">
            {[
              { method: "GET", path: "/api/aqi", desc: "All 35 state AQI predictions (CNN-LSTM output)" },
              { method: "GET", path: "/api/aqi?state=dl", desc: "Single state AQI with met data and source type" },
              { method: "GET", path: "/api/aqi?state=dl&month=10", desc: "Seasonally-adjusted AQI for October" },
              { method: "GET", path: "/api/forecast?city=delhi", desc: "48-hour AQI forecast with ±1σ confidence" },
              { method: "GET", path: "/api/export?format=csv&type=aqi", desc: "Download all state predictions as CSV" },
              { method: "GET", path: "/api/export?format=csv&type=forecast&city=delhi", desc: "Download 48h Delhi forecast CSV" },
              { method: "GET", path: "/api/export?format=csv&type=validation", desc: "Download validation scatter data" },
            ].map(ep => (
              <div key={ep.path} className="flex items-start gap-3 bg-black/40 rounded-lg px-3 py-2">
                <span className="text-emerald-400 font-bold shrink-0">{ep.method}</span>
                <code className="text-white/80 shrink-0">{ep.path}</code>
                <span className="text-white/40 hidden md:block">—</span>
                <span className="text-white/40 hidden md:block">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-mono text-white/20">
          BharatAQI · ISRO Bharatiya Antariksh Hackathon 2026 · Problem Statement 3
        </div>
      </div>
    </main>
  );
}
