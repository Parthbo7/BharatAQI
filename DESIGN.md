# 🎨 BharatAQI — Design System & Visual Language

> **Version**: 2.0 | **Last Updated**: June 2025  
> **Theme**: Aerospace Mission Control · Dark Space · Glassmorphism

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Grid](#4-spacing--grid)
5. [Component Library](#5-component-library)
6. [Animation System](#6-animation-system)
7. [Iconography](#7-iconography)
8. [Data Visualization](#8-data-visualization)
9. [Page-Level Design](#9-page-level-design)
10. [Design Decisions Log](#10-design-decisions-log)

---

## 1. Design Philosophy

### 1.1 Core Aesthetic — "Aerospace Mission Control"

BharatAQI is designed to feel like the real-time operational interface of a **satellite ground control center** — where live data streams, orbital telemetry, and environmental intelligence converge into one unified command display.

The visual language draws from:
- **NASA/ISRO Mission Control** — monochrome displays, data density, monospace readouts
- **Glassmorphism** — translucent panels floating over a deep space background
- **Cyberpunk HUD** — scan lines, corner accents, glowing borders, animated status pips
- **Indian Space Programme** — saffron/orange palette honoring ISRO's identity

### 1.2 Design Principles

| Principle | Description |
|---|---|
| **Data First** | Every visual element carries information or reinforces data context |
| **Dark by Default** | Deep space background minimizes eye strain on long monitoring sessions |
| **Purposeful Motion** | Animations reflect real system processes (orbit, telemetry, streaming) |
| **Hierarchy through Light** | Glow and brightness signal importance, not color alone |
| **Aerospace Precision** | Monospace typography, decimal precision, technical labels |

### 1.3 Mood Board Keywords

```
Deep Space  ·  Satellite Intelligence  ·  Real-time  ·  India  
Saffron Fire  ·  Glassmorphic  ·  Mission Control  ·  Scientific  
High-fidelity  ·  Atmospheric  ·  Orbital  ·  Data-driven
```

---

## 2. Color System

### 2.1 Core Palette

```css
/* ── BACKGROUND ── */
--color-space:          #03050A;   /* Deep space — primary background */
--color-space-mid:      #080D1A;   /* Elevated panels */
--color-space-high:     #0A0F1E;   /* Card surfaces */

/* ── ORANGE (ISRO Saffron / Fire) ── */
--color-orange:         #FF6A00;   /* Primary accent — interactive, alerts */
--color-orange-flame:   #FF8833;   /* Secondary — hover states, highlights */
--color-orange-core:    #E55A00;   /* Pressed, deep emphasis */
--color-orange-glow:    #FF6A0040; /* Ambient glow (25% opacity) */

/* ── BLUE (ISRO Space Blue) ── */
--color-blue-isro:      #0054A6;   /* ISRO brand blue — logo accents */
--color-blue-light:     #2D9CDB;   /* Data / info elements */
--color-blue-glow:      #2D9CDB40; /* Ambient info glow */

/* ── SEMANTIC ── */
--color-good:           #10B981;   /* AQI: Good (Emerald) */
--color-moderate:       #FFB428;   /* AQI: Moderate (Amber) */
--color-poor:           #F59E0B;   /* AQI: Poor (Yellow) */
--color-very-poor:      #FF6A00;   /* AQI: Very Poor (Orange) */
--color-severe:         #DC2626;   /* AQI: Severe (Red) */

/* ── NEUTRAL ── */
--color-white:          #FFFFFF;
--color-white-70:       rgba(255,255,255,0.70);
--color-white-45:       rgba(255,255,255,0.45);
--color-white-20:       rgba(255,255,255,0.20);
--color-white-08:       rgba(255,255,255,0.08);
--color-white-04:       rgba(255,255,255,0.04);

/* ── SYSTEM STATUS ── */
--color-success:        #34D399;   /* Emerald-400 — operational */
--color-warn:           #FBBF24;   /* Amber-400 — degraded */
--color-error:          #F87171;   /* Red-400 — critical */
```

### 2.2 Tailwind Token Mapping

```ts
// tailwind.config.ts — custom color tokens
colors: {
  orange:       '#FF6A00',
  'orange-flame': '#FF8833',
  'orange-core':  '#E55A00',
  'blue-isro':  '#0054A6',
  'blue-light': '#2D9CDB',
}
```

### 2.3 AQI Color Scale (CPCB Standard)

| Range | Label | Hex | Tailwind |
|---|---|---|---|
| 0–50 | Good | `#10B981` | `emerald-500` |
| 51–100 | Satisfactory | `#84CC16` | `lime-400` |
| 101–200 | Moderate | `#FFB428` | custom amber |
| 201–300 | Poor | `#F59E0B` | `amber-500` |
| 301–400 | Very Poor | `#FF6A00` | `orange` |
| 401–500+ | Severe | `#DC2626` | `red-600` |

### 2.4 Gradient Recipes

```css
/* Hero orbital glow */
background: radial-gradient(ellipse at center, 
  rgba(255,106,0,0.08) 0%, 
  transparent 65%);

/* Orange primary button */
background: linear-gradient(135deg, #FF6A00, #FF8833);

/* India heatmap — Delhi hotspot */
background: radial-gradient(circle,
  rgba(255,79,0,0.6) 0%,
  rgba(255,123,0,0.35) 30%,
  rgba(255,180,40,0.1) 65%,
  transparent 100%);

/* Glass panel */
background: rgba(10, 15, 30, 0.45);
```

---

## 3. Typography

### 3.1 Font Stack

| Role | Font Family | Variable | Weight | Usage |
|---|---|---|---|---|
| **HUD / Brand** | Orbitron | `--font-orbitron` | 700–900 | Brand name, headers, HUD labels |
| **Body** | Sora | `--font-sora` | 400–600 | Descriptions, card body text |
| **Telemetry** | Geist Mono | `--font-geist-mono` | 400–700 | Numbers, data readouts, logs |
| **Display** | Inter | `--font-inter` | 400–700 | Card titles, auxiliary text |

All fonts loaded via `next/font/google` + local font (Geist Mono) for zero layout shift.

### 3.2 Type Scale

```css
/* Heading — Brand */
.font-orbitron.text-6xl   { font-size: 3.75rem; letter-spacing: 0.15em; }  /* BHARATAQI */
.font-orbitron.text-5xl   { font-size: 3rem;    letter-spacing: 0.15em; }
.font-orbitron.text-base  { font-size: 1rem;    letter-spacing: 0.1em;  }  /* Nav brand */
.font-orbitron.text-xs    { font-size: 0.75rem; letter-spacing: 0.15em; }  /* Section headers */

/* Telemetry readouts */
.font-mono.text-3xl       { font-size: 1.875rem; }   /* AQI value */
.font-mono.text-xs        { font-size: 0.75rem;  }   /* Log stream */
.font-mono.text-[9px]     { font-size: 9px;      }   /* Micro labels */
.font-mono.text-[10px]    { font-size: 10px;     }   /* Status text */

/* Body */
.font-body.text-sm        { font-size: 0.875rem; line-height: 1.6; }
.font-body.text-xs        { font-size: 0.75rem;  line-height: 1.5; }

/* Tracking classes */
.tracking-[0.4em]  /* WELCOME TO micro-label */
.tracking-widest   /* Button labels */
.tracking-[0.2em]  /* Telemetry badges */
.tracking-tight    /* Data-dense numbers */
```

### 3.3 Typography Rules

- **All-caps** for system labels, status badges, and HUD elements
- **Title-case** for card headings and city names
- **Tabular numbers** via `font-variant-numeric: tabular-nums` on data readouts
- **Letter-spacing** scales with font-size — smaller text needs more tracking
- Never use `font-orbitron` for body text — too heavy for reading

---

## 4. Spacing & Grid

### 4.1 Spacing Scale (Tailwind defaults + custom)

```
0.5 = 2px    1 = 4px    1.5 = 6px    2 = 8px    2.5 = 10px
3 = 12px     4 = 16px   5 = 20px     6 = 24px   7 = 28px
8 = 32px     10 = 40px  12 = 48px    16 = 64px
```

### 4.2 Dashboard Layout Grid

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER   (h-16, full width, border-b border-white/10)      │
├────────────────┬───────────────────────┬────────────────────┤
│                │                       │                    │
│  LEFT COL      │  CENTER COL           │  RIGHT COL         │
│  lg:col-span-3 │  lg:col-span-6        │  lg:col-span-3     │
│  (25%)         │  (50%)                │  (25%)             │
│                │                       │                    │
│  City Selector │  India Heatmap        │  S5P Telemetry     │
│  AQI Gauge     │  SVG Map              │  Orbit Widget      │
│  Pollutants    │  City Markers         │  Log Stream        │
│                │                       │                    │
├────────────────┴───────────────────────┴────────────────────┤
│  FOOTER  (lg:col-span-12 — Data Fusion Pipeline)            │
└─────────────────────────────────────────────────────────────┘

Gap: 24px (gap-6)
Padding: 16px mobile / 24px desktop (p-4 md:p-6)
```

### 4.3 Card Anatomy

```
┌─── rounded-xl border border-white/10 ──────────────────────┐
│  ┌── glass-panel p-4/p-5 ──────────────────────────────┐   │
│  │                                                      │   │
│  │  [ICON] SECTION HEADER                ← font-orbitron│   │
│  │         xs, tracking-wider, orange-flame             │   │
│  │                                                      │   │
│  │  ─────────────────────────────── (border-b white/5)  │   │
│  │                                                      │   │
│  │  Content body                        ← font-body     │   │
│  │                                                      │   │
│  │  ┌─── Data Cell ───┐  ┌─── Data Cell ───┐           │   │
│  │  │ LABEL (8px mono)│  │ LABEL (8px mono)│           │   │
│  │  │ Value (sm bold) │  │ Value (sm bold) │           │   │
│  │  └─────────────────┘  └─────────────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Component Library

### 5.1 Glass Panel

```css
/* Base glass panel */
.glass-panel {
  background: rgba(10, 15, 30, 0.45);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

/* Glowing variant (active/alert state) */
.glass-panel-glow {
  background: rgba(15, 22, 45, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 106, 0, 0.15);
  box-shadow: 0 0 25px rgba(255, 106, 0, 0.05),
              inset 0 0 15px rgba(255, 106, 0, 0.05);
}
```

**Usage**: All dashboard panels, the problem statement card, telemetry widgets.

---

### 5.2 Status Badge

```tsx
// Active operational status
<div className="flex items-center gap-2 px-2.5 py-1 rounded 
  bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 
  text-[10px] font-mono">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
  TROPOMI S5P: ACTIVE
</div>

// Synced data status
<div className="...bg-blue-500/10 border-blue-500/20 text-blue-400...">
  <Radio className="w-3.5 h-3.5 animate-pulse" />
  MODIS FIRE LINK: SYNCED
</div>

// Processing status
<div className="...bg-orange/10 border-orange/20 text-orange-flame...">
  <Cpu className="w-3.5 h-3.5" />
  DEEP LEARNING MODEL: FUSED (1KM)
</div>
```

---

### 5.3 Primary Button (CTA)

```tsx
// Primary CTA — gradient orange
<button className="
  px-7 py-3.5
  bg-gradient-to-r from-orange to-orange-flame
  text-white font-orbitron font-bold text-xs tracking-widest
  rounded-full
  shadow-[0_0_15px_rgba(255,106,0,0.35)]
  hover:shadow-[0_0_30px_rgba(255,106,0,0.6)]
  hover:scale-105
  transition-all duration-300
  flex items-center gap-2.5
  border border-orange-core/50
  group
">
  ENTER MISSION CONTROL
  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
</button>

// Secondary CTA — ghost
<button className="
  px-7 py-3.5
  bg-white/[0.04] hover:bg-white/[0.08]
  text-white/75 hover:text-white
  font-orbitron font-bold text-xs tracking-widest
  rounded-full
  border border-white/10 hover:border-orange/40
  transition-all duration-300
">
  EXPLORE AQI DATA
</button>
```

---

### 5.4 Data Cell

```tsx
// Pollutant readout cell
<div className="bg-white/5 border border-white/5 p-2 rounded-lg">
  <div className="text-[8px] font-mono text-white/40 uppercase">
    PM2.5 Density
  </div>
  <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1">
    <span>195</span>
    <span className="text-[9px] font-mono text-white/40">µg/m³</span>
  </div>
</div>
```

---

### 5.5 AQI Circular Gauge

```tsx
// SVG arc gauge — inner circle, outer fill tracks AQI value
<svg viewBox="0 0 120 120" className="w-36 h-36">
  {/* Background track */}
  <circle cx="60" cy="60" r="48" fill="none"
    stroke="#1e293b" strokeWidth="10"
    strokeDasharray="225" strokeLinecap="round"
    transform="rotate(135 60 60)" />
  
  {/* Active fill — dasharray scales with AQI/500 */}
  <circle cx="60" cy="60" r="48" fill="none"
    stroke={cityColor} strokeWidth="10"
    strokeDasharray={`${(aqi / 500) * 225} 300`}
    strokeLinecap="round"
    transform="rotate(135 60 60)"
    style={{ filter: `drop-shadow(0 0 6px ${cityColor}77)` }}
    className="transition-all duration-1000 ease-out" />
</svg>

{/* Center text overlay */}
<div className="absolute flex flex-col items-center">
  <span className="text-3xl font-orbitron font-extrabold">{aqi}</span>
  <span className="text-[8px] font-mono tracking-widest text-white/60">AQI Value</span>
  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold"
    style={{ backgroundColor: `${cityColor}15`, color: cityColor }}>
    {status}
  </span>
</div>
```

---

### 5.6 City Map Marker

```tsx
// SVG marker on India heatmap
<g className="cursor-pointer group" onClick={() => setSelectedCity(city)}>
  {/* Invisible click zone */}
  <circle cx={x} cy={y} r="18" fill="transparent" />
  
  {/* Ripple ring (selected state) */}
  {isSelected && (
    <circle cx={x} cy={y} r="10"
      stroke={city.color} strokeWidth="1" fill="transparent"
      className="animate-ping"
      style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '1.8s' }} />
  )}
  
  {/* Dot */}
  <circle cx={x} cy={y}
    r={isSelected ? '5' : '3.5'}
    fill={city.color} stroke="#fff"
    strokeWidth={isSelected ? '1.5' : '1'}
    className="transition-all duration-300 group-hover:scale-125" />
  
  {/* Label */}
  <text x={x + 8} y={y + 3}
    fill={isSelected ? '#fff' : 'rgba(255,255,255,0.6)'}
    className="text-[9px] font-mono font-bold select-none pointer-events-none">
    {cityName} ({aqi})
  </text>
</g>
```

---

### 5.7 Corner Accents

Used in ProblemCard and premium panels to create a tech frame effect:

```tsx
{/* Top-left orange accent */}
<div className="absolute top-0 left-0 w-10 h-px bg-gradient-to-r from-orange/60 to-transparent" />
<div className="absolute top-0 left-0 w-px h-10 bg-gradient-to-b from-orange/60 to-transparent" />

{/* Bottom-right blue accent */}
<div className="absolute bottom-0 right-0 w-10 h-px bg-gradient-to-l from-blue-light/40 to-transparent" />
<div className="absolute bottom-0 right-0 w-px h-10 bg-gradient-to-t from-blue-light/40 to-transparent" />
```

---

### 5.8 Telemetry Log Entry

```tsx
// Color-coded satellite telemetry stream
<div className="flex gap-1.5 border-b border-white/[0.02] pb-1.5 
  leading-normal text-[9px] md:text-[10px] font-mono">
  <span className="text-white/40 shrink-0">[{time}]</span>
  <span className={`font-bold shrink-0 uppercase ${badgeColor}`}>
    {type === 'info' ? 'INFO' : type === 'success' ? 'SYNC' : 'WARN'}
  </span>
  <span className="text-white/80">{logText}</span>
</div>

// Badge colors:
// INFO    → text-blue-light  (#2D9CDB)
// SYNC    → text-emerald-400 (#34D399)
// WARN    → text-orange-flame (#FF8833)
```

---

## 6. Animation System

### 6.1 Dual-Orbit System (Hero)

The flagship animation: two glowing stars orbit the "BHARATAQI" title text in opposite directions.

```
Primary Star   ──── Clockwise ────►  ω = +0.0145 rad/frame (~7s revolution)
Secondary Star ◄─── Counter-CW ───   ω = -0.0145 rad/frame

Orbit shape: Ellipse
  radiusX = titleWidth/2 + 70px
  radiusY = titleHeight/2 + 35px
  
Trail particles: Injected every 2nd frame via DOM appendChild
  Lifetime: 420ms  |  Fade: opacity 0.6 → 0  |  Scale: 1 → 0.05
```

```ts
// Primary star visual
{
  width: '11px', height: '11px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, #fff 0%, #ffaa33 45%, #ff6a00 100%)',
  boxShadow: '0 0 10px #ff6a00, 0 0 20px #ff6a00, 0 0 35px #ffd15c',
}

// Secondary star visual
{
  width: '7px', height: '7px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, #fff 0%, #ffcc66 45%, #ff8833 100%)',
  boxShadow: '0 0 6px #ff8833, 0 0 14px rgba(255,136,51,0.45)',
}
```

---

### 6.2 Docking Sequence (CTA Click)

Triggered when user clicks "ENTER MISSION CONTROL":

```
t=0.0s   Both stars stop orbiting (isOrbitingRef = false)
t=0.0s   GSAP: Stars converge to AQI dot position (0.8s, power3.inOut)
t=0.75s  Stars become invisible (opacity → 0)
t=0.8s   AQI dot: scale 1 → 2.5, color → white, mega-glow box-shadow
t=0.85s  Energy pulse ring: DOM div, gsap scale 1 → 20, opacity → 0 (0.75s)
t=1.05s  AQI dot: scale → 1, color → #FF6A00 (restored)
t=1.2s   transitionToDashboard() called
t=1.2s   SpaceCanvas rocket: setRocketState('ascending')
t=1.2s   GSAP: heroRef opacity → 0, scale → 1.12, filter blur(14px), duration 1.0s
t=2.2s   setShowDashboard(true) → Dashboard mounts
```

---

### 6.3 Framer Motion Entry Animations

```tsx
// ISRO Logo
initial={{ opacity: 0, y: -15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, ease: 'easeOut' }}

// BHARATAQI title
initial={{ opacity: 0, scale: 0.92 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}

// Subtitle
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}

// Problem Card
initial={{ opacity: 0, y: 25 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}

// Objective items (staggered)
staggerChildren: 0.15
each item: initial={{ opacity: 0, x: -15 }} → visible

// CTA Buttons
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
```

---

### 6.4 Continuous Animations

| Element | Animation | Duration | Library |
|---|---|---|---|
| Orbiting stars | rAF loop, DOM style updates | Continuous | Vanilla JS |
| Satellite in orbit widget | `rotate(${angle}deg) translate(22px)` | Continuous | React state + rAF |
| Status pip (Emerald) | `animate-ping` (Tailwind) | 1s loop | CSS |
| MODIS Radio icon | `animate-pulse` (Tailwind) | 2s loop | CSS |
| Map ripple rings | `animate-ping` (Tailwind) | 1.8s loop | CSS |
| Compass grid ring | `animate-[spin_120s_linear_infinite]` | 120s loop | CSS |
| India heatmap blobs | `animate-pulse` (3–5s variants) | Staggered | CSS |
| CPU icon (header) | Static (no animation — data badge) | — | — |
| Telemetry scroll | `scrollTop = scrollHeight` on new log | 4s interval | React |

---

### 6.5 Hover States

```css
/* Button primary — scale + glow intensifies */
hover:scale-105
hover:shadow-[0_0_30px_rgba(255,106,0,0.6)]

/* Button ghost — background lightens, border tints orange */
hover:bg-white/[0.08]
hover:border-orange/40
hover:text-white

/* City selector tab — active vs inactive */
active:   bg-orange/20 text-orange-flame border-orange
inactive: bg-white/5  text-white/60     border-white/5
          hover:bg-white/10 hover:text-white

/* Data source cards (footer) */
hover:bg-white/[0.08]
transition-colors duration-300

/* Map marker — scale-125 on hover group */
group-hover:scale-125
transition-all duration-300

/* Objective card (ProblemCard) */
hover:bg-white/[0.05]
hover:border-white/[0.08]
```

---

## 7. Iconography

### 7.1 Icon System — Lucide React

All icons sourced from `lucide-react` (v1.20.0). Standard size: `w-3.5 h-3.5` for inline labels, `w-4 h-4` for section headers, `w-5 h-5` for primary feature icons.

| Icon | Component | Usage |
|---|---|---|
| `Satellite` | `<Satellite />` | S5P telemetry section |
| `Compass` | `<Compass />` | CPCB ground stations |
| `Flame` | `<Flame />` | MODIS fire data, biomass burning |
| `Radio` | `<Radio />` | Telemetry stream header |
| `Clock` | `<Clock />` | Live IST timestamp |
| `MapPin` | `<MapPin />` | City selector node |
| `Cpu` | `<Cpu />` | Deep learning model badge |
| `Layers` | `<Layers />` | Heatmap section |
| `Database` | `<Database />` | Data fusion pipeline |
| `ChevronRight` | `<ChevronRight />` | Flow arrow in pipeline |
| `ShieldCheck` | `<ShieldCheck />` | CPCB validation tick |
| `ArrowRight` | `<ArrowRight />` | CTA button arrow |
| `Rocket` | `<Rocket />` | Nav launch button |
| `CheckCircle2` | `<CheckCircle2 />` | Objective checklist items |
| `ShieldAlert` | `<ShieldAlert />` | HCHO hotspot objective |
| `Map` | `<Map />` | AQI mapping objective |

### 7.2 ISRO Brand Mark (Custom SVG)

```tsx
// Header inline ISRO icon — simplified vector
<svg viewBox="0 0 100 100" className="w-8 h-8 
  filter drop-shadow-[0_0_5px_rgba(255,106,0,0.5)]">
  {/* Rocket body */}
  <path d="M 50,85 C 50,75 52,60 58,40 L 50,15 L 42,40 
    C 48,60 50,75 50,85 Z" fill="#FF6A00" />
  {/* Left wing */}
  <path d="M 50,75 C 40,75 30,70 25,60 C 28,70 38,80 50,81 Z" 
    fill="#0054A6" />
  {/* Right wing */}
  <path d="M 50,75 C 60,75 70,70 75,60 C 72,70 62,80 50,81 Z" 
    fill="#0054A6" />
</svg>
```

---

## 8. Data Visualization

### 8.1 India Heatmap Layers (SVG-based)

The map uses **radial gradient circles** as a heatmap simulation:

```
Region         Center     Radius   Palette                Animation
─────────────────────────────────────────────────────────────────────
Delhi (IGP)    (155,130)  r=50    Red→Orange→Yellow       pulse 3s
Mumbai         (115,255)  r=30    Orange→Amber            pulse 4s
Kolkata        (250,190)  r=35    Orange→Yellow           pulse 3.5s
South India    (160,325)  r=25    Green (good AQI)        pulse 5s
```

**Design rationale**: True raster heatmap tiles would require backend infrastructure. SVG radial gradients achieve the same visual effect at zero cost while remaining interactive (click to select city).

### 8.2 Scrolling Log Stream (Terminal)

```
Design language: Green-screen terminal (inverted — dark bg)
Font: Geist Mono, 9–10px
Line format: [HH:MM:SS] BADGE  Message text
Scroll: auto-scroll to bottom on new entry
Max entries: 30 (FIFO circular buffer)
Update interval: 4000ms
Color mapping:
  INFO  → blue-light (#2D9CDB)
  SYNC  → emerald-400 (#34D399)
  WARN  → orange-flame (#FF8833)
```

### 8.3 Orbit Telemetry Widget

A simplified orbital mechanics visualization:

```
Background: 2× concentric dashed rings (solid inner, dashed outer)
Earth:      10×10px circle, blue-isro fill, "EARTH" label
Satellite:  2.5×2.5px dot, orange fill, orange glow shadow
Motion:     CSS transform: rotate(angle)deg translate(22px) rotate(-angle)deg
            — keeps satellite oriented correctly despite parent rotation
Speed:      0.3 degrees per rAF frame (~18°/s = ~20s full orbit)
```

---

## 9. Page-Level Design

### 9.1 Hero / Launch Screen

```
Layout:    Full viewport, centered flex column
BG:        /assets/background.png + dark gradient overlay (bottom-heavy)
BG Layer:  Three.js starfield canvas (absolute, z-0)
Content z: z-20 (above Three.js, below orbit stars z-30)

Visual hierarchy (top → bottom):
  1. Top nav bar (SYSTEMS ONLINE badge + LAUNCH PLATFORM button)
  2. ISRO wordmark (motion, fade-in-down)
  3. "WELCOME TO" micro-label
  4. "BHARATAQI" title + orbiting stars + AQI dot
  5. Subtitle: "Satellite-Powered Air Quality Intelligence for India"
  6. ProblemCard (mission objectives)
  7. CTA buttons (primary + ghost)
```

**Space allocation**:
- Nav: 64px (pt-6 + nav height)
- Hero content: flex-1 (fills remaining height)
- `marginTop: -2vh` — pulls content slightly up for visual balance

---

### 9.2 Dashboard / Mission Control

```
Layout:    Full viewport, 3-column 12-column grid, sticky header
Padding:   p-4 (mobile) → p-6 (desktop)
Gap:       gap-6 between all columns and rows

Panel sizing:
  Left (col-span-3):   City selector + AQI telemetry card (flex-1 fills height)
  Center (col-span-6): India heatmap (flex-1, min-h-350px)
  Right (col-span-3):  Orbit widget + log stream (flex-1 for log)
  Footer (col-span-12): Data fusion pipeline row

Mobile:    All sections stack (col-span-1, grid-cols-1)
```

---

## 10. Design Decisions Log

| Decision | Rationale | Alternative Considered |
|---|---|---|
| Dark space background | Aligns with aerospace aesthetic; reduces eye strain on data-dense UI | Light mode — rejected (not serious for satellite data) |
| Orange as primary accent | ISRO saffron identity; high contrast on dark bg; conveys urgency/fire | Blue-only — rejected (too generic) |
| Orbitron for brand text | Science-fiction HUD feel; free Google Font; bold at small sizes | Eurostile — not available without license |
| SVG India map (not Mapbox) | Zero cost; controllable; no API key needed; custom heatmap overlay | Mapbox/Leaflet — rejected (cost/complexity) |
| Radial gradient heatmap | Zero cost; visually effective; interactive; no backend needed | Real raster tiles — too complex for hackathon |
| CSS `animate-ping` for status pips | Standard Tailwind utility; smooth; semantically correct for "active" | Custom keyframe — unnecessary complexity |
| Glass panels over solid cards | Depth; aligns with mission control overlays; modern premium feel | Solid dark cards — too flat for aerospace theme |
| GSAP for docking sequence | Precise timeline control; performance; complex multi-element choreography | Framer Motion — less control over DOM elements |
| Framer Motion for page entry | Declarative; built-in SSR support; stagger utility | CSS animations — less maintainable |
| 1.8s for ripple rings | Slow enough to feel deliberate; not distracting; "pulse" of data | 1s default — too fast, felt alert-like |
| Log stream 4s interval | Realistic satellite telemetry cadence; not overwhelming | 1s — too fast to read; 10s — feels dead |
| AQI gauge arc = 270° sweep | Standard dashboard gauge convention; maximum data density in arc | Full circle — hides counter-bottom |

---

*Design system maintained by Team BharatAQI · ISRO Hackathon 2025*
