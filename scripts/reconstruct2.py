import re

with open('src/components/Dashboard/index.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the CityReport buttons with the StateSearch
sidebar_start = """        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col gap-3 shrink-0">
            <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-orange-flame flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange" />
              Sensor Selection Node
            </h3>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.keys(CITIES).map((cKey) => {
                const city = CITIES[cKey];
                const isSelected = selectedCity.name === city.name;
                return (
                  <button
                    key={cKey}
                    onClick={() => setSelectedCity(city)}
                    className={`py-1 text-[10px] md:text-[11px] font-mono uppercase font-bold rounded border transition-all duration-300 ${
                      isSelected
                        ? "bg-orange/20 text-orange-flame border-orange"
                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cKey.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>"""

sidebar_replacement = """        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col gap-3 shrink-0 overflow-visible relative">
            <h3 className="text-xs font-orbitron font-bold uppercase tracking-wider text-orange-flame flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange" />
              Sensor Selection Node
            </h3>
            
            <StateSearch 
              selected={selectedRegion?.id || ""} 
              onChange={(val) => setSelectedRegion(REGIONS[val as string])} 
              placeholder="Search State or Territory..."
              className="w-full z-[60]"
            />
          </div>"""

code = code.replace(sidebar_start, sidebar_replacement)

# Replace the active sensor node reading card
card_start = r'          {/\* Active Sensor Node Reading Card \*/}.*?            </div>\n          </div>'
card_replacement = """          {/* Active Sensor Node Reading Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex-1 flex flex-col justify-between relative overflow-hidden group min-h-0">
            {activeNode ? (
              <div key={selectedRegion?.id} className="h-full flex flex-col justify-between animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-white/30 uppercase">
                  NODE: {selectedRegion?.id}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-display font-extrabold text-xl text-white truncate max-w-[80%]">
                      {activeNode.name}
                    </h2>
                    <span className="text-[10px] font-mono text-white/50">INDIA</span>
                  </div>
                  <p className="text-[10px] font-mono text-white/40 uppercase mb-4">
                    Fused Regional Telemetry Matrix
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-4 shrink-0">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> QA: NOMINAL
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono text-blue-400">
                      <Clock className="w-3 h-3" /> PASS: -2.4h
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center my-4 relative shrink-0">
                    <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-36 md:h-36 drop-shadow-xl">
                      <circle cx="60" cy="60" r="48" fill="none" stroke="#1e293b" strokeWidth="10" strokeDasharray="225" strokeLinecap="round" transform="rotate(135 60 60)" />
                      <circle cx="60" cy="60" r="48" fill="none" stroke={activeNode.color} strokeWidth="10" strokeLinecap="round" transform="rotate(135 60 60)" style={{ strokeDasharray: `${(activeNode.aqi / 500) * 225} 300`, filter: `drop-shadow(0 0 8px ${activeNode.color}99)` }} className="transition-all duration-1000 ease-out" />
                    </svg>

                    <div className="absolute flex flex-col items-center mt-2">
                      <span className="text-4xl font-orbitron font-extrabold tracking-tighter">
                        {activeNode.aqi}
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-white/60 uppercase">AQI Value</span>
                      <span className="mt-1.5 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold" style={{ backgroundColor: `${activeNode.color}20`, color: activeNode.color, border: `1px solid ${activeNode.color}40` }}>
                        {activeNode.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 shrink-0">
                  <div className="bg-black/30 border border-white/5 p-2 rounded-lg hover:border-white/10 transition-colors">
                    <div className="text-[8px] font-mono text-white/40 uppercase">PM2.5 Density</div>
                    <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1">
                      <span>{activeNode.pm25}</span><span className="text-[9px] font-mono text-white/40">µg/m³</span>
                    </div>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-2 rounded-lg hover:border-white/10 transition-colors">
                    <div className="text-[8px] font-mono text-white/40 uppercase">PM10 Density</div>
                    <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1">
                      <span>{activeNode.pm10}</span><span className="text-[9px] font-mono text-white/40">µg/m³</span>
                    </div>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-2 rounded-lg hover:border-white/10 transition-colors">
                    <div className="text-[8px] font-mono text-white/40 uppercase">HCHO Column</div>
                    <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1 text-orange-flame">
                      <span>{activeNode.hcho}</span><span className="text-[9px] font-mono text-white/45">DU</span>
                    </div>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-2 rounded-lg hover:border-white/10 transition-colors">
                    <div className="text-[8px] font-mono text-white/40 uppercase">NO2 Level</div>
                    <div className="text-sm font-semibold mt-0.5 flex items-baseline gap-1">
                      <span>{activeNode.no2}</span><span className="text-[9px] font-mono text-white/40">ppb</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 flex justify-between text-[10px] font-mono text-white/50 shrink-0">
                  <div className="flex flex-col">
                    <span>TEMP</span>
                    <span className="text-white font-semibold">{activeNode.temp}°C</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>HUMIDITY</span>
                    <span className="text-white font-semibold">{activeNode.humidity}%</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>WIND DRIFT</span>
                    <span className="text-white font-semibold">{activeNode.wind}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40 text-sm font-mono text-center">
                <ShieldCheck className="w-8 h-8 mb-4 opacity-50" />
                <p>No region selected.<br/>Search for a state to view telemetry data.</p>
              </div>
            )}
          </div>"""

code = re.sub(card_start, card_replacement, code, flags=re.DOTALL)

code = code.replace('</main>\n\n      {/* BOTTOM PANEL', '</main>\n      ) : (\n        <main className="z-10 flex-1 p-4 md:p-6 flex flex-col overflow-hidden animate-in fade-in duration-500">\n          <AQIPredictorMode />\n        </main>\n      )}\n\n      {/* BOTTOM PANEL')

with open('src/components/Dashboard/index.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
