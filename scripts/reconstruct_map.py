import re

def fix_map():
    with open('src/components/Dashboard/index.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'import India from "@svg-maps/india"' not in content:
        content = content.replace(
            'import { RegionData, REGIONS } from "@/lib/regions";',
            'import { RegionData, REGIONS } from "@/lib/regions";\nimport India from "@svg-maps/india";\nimport { motion } from "framer-motion";'
        )

    # find the start of the map section
    start_str = '{/* CENTER COLUMN: INTERACTIVE MAP & AQI HEATMAP (Span 6) */}'
    end_str = '{/* RIGHT COLUMN: SATELLITE TELEMETRY & EVENT LOG (Span 3) */}'
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find the map section bounds")
        return
        
    map_code = """{/* CENTER COLUMN: INTERACTIVE MAP & AQI HEATMAP (Span 6) */}
        <section className="lg:col-span-6 flex flex-col gap-4 lg:gap-6 overflow-hidden min-h-0 order-1 lg:order-2 h-[50vh] lg:h-auto">
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex-1 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3 shrink-0">
              <div>
                <h3 className="text-sm font-orbitron font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-orange" />
                  National Air Quality Grid
                </h3>
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  TROPOMI Formaldehyde (HCHO) Column Density Fused with surface particulate matter
                </span>
              </div>
              {/* Heatmap Legend */}
              <div className="flex items-center gap-2 text-[9px] font-mono">
                <span className="text-white/40">AQI:</span>
                <div className="flex h-2 w-24 rounded overflow-hidden border border-white/10">
                  <div className="w-1/5 bg-emerald-500"></div>
                  <div className="w-1/5 bg-[#ffb428]"></div>
                  <div className="w-1/5 bg-[#f59e0b]"></div>
                  <div className="w-1/5 bg-[#ff6a00]"></div>
                  <div className="w-1/5 bg-red-600"></div>
                </div>
                <span className="text-white/70">50 - 500+</span>
              </div>
            </div>

            {/* Interactive Vector Outline Map of India with pulsing AQI heatmaps */}
            <div className="flex-1 w-full relative flex items-center justify-center min-h-0 overflow-hidden cursor-move">
              
              {/* Outer compass grid backdrop */}
              <div className="absolute w-72 h-72 rounded-full border border-white/5 flex items-center justify-center animate-[spin_120s_linear_infinite] pointer-events-none">
                <div className="w-48 h-48 rounded-full border border-dashed border-white/10" />
              </div>

              {/* Real @svg-maps/india vector map integration */}
              <svg
                viewBox="0 0 612 696"
                className="w-full h-full max-h-[85%] object-contain select-none z-10 relative min-h-0 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {(India.locations as Array<{ id: string; path: string; name: string }>).map((location) => {
                  const region = REGIONS[location.id];
                  const isSelected = selectedRegion?.id === location.id;
                  let baseColor = "rgba(255,255,255,0.02)";
                  let hoverColor = "rgba(255,255,255,0.08)";
                  let selectedColor = "rgba(255,255,255,0.15)";

                  if (region) {
                    const aqi = region.aqi;
                    if (aqi > 400) { baseColor = "#7f1d1d88"; hoverColor = "#b91c1c"; selectedColor = "#ef4444"; }
                    else if (aqi > 300) { baseColor = "#b91c1c88"; hoverColor = "#dc2626"; selectedColor = "#ef4444"; }
                    else if (aqi > 200) { baseColor = "#c2410c88"; hoverColor = "#ea580c"; selectedColor = "#f97316"; }
                    else if (aqi > 100) { baseColor = "#a1620788"; hoverColor = "#ca8a04"; selectedColor = "#eab308"; }
                    else { baseColor = "#15803d88"; hoverColor = "#16a34a"; selectedColor = "#22c55e"; }
                  }

                  const fill = isSelected ? selectedColor : baseColor;
                  const strokeColor = isSelected ? "#ffffff" : "rgba(255,255,255,0.1)";
                  const strokeWidth = isSelected ? "2" : "0.4";

                  return (
                    <motion.path
                      key={location.id}
                      d={location.path}
                      animate={{ fill, stroke: strokeColor }}
                      transition={{ duration: 0.2 }}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      className={`outline-none ${region ? "cursor-pointer" : "cursor-not-allowed"}`}
                      onClick={() => { if (region) setSelectedRegion(region); }}
                    />
                  );
                })}
              </svg>

              {/* Holographic HUD UI element overlaying map */}
              <div className="absolute top-2 left-2 p-2 bg-black/40 border border-white/5 rounded-lg text-[9px] font-mono flex flex-col gap-0.5 pointer-events-none">
                <span className="text-white/40">GRID RESOLUTION:</span>
                <span className="text-white">1.2 km² (Deep Fused)</span>
                <span className="text-white/40 mt-1">SWEEP CYCLE:</span>
                <span className="text-white">Every 24h (TROPOMI orbit)</span>
              </div>
            </div>
          </div>
        </section>

        """
    
    new_content = content[:start_idx] + map_code + content[end_idx:]
    
    with open('src/components/Dashboard/index.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Map successfully restored!")

if __name__ == "__main__":
    fix_map()
