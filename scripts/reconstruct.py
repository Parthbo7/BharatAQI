import json
import re

with open('src/components/Dashboard/index.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add imports
code = code.replace('import {', 'import { StateSearch } from "./StateSearch";\nimport { AQIPredictorMode } from "./AQIPredictorMode";\nimport { RegionData, REGIONS } from "@/lib/regions";\nimport {', 1)

# Remove CityData interface and CITIES constant
code = re.sub(r'interface CityData \{.*?\};', '', code, flags=re.DOTALL)
code = re.sub(r'const CITIES: Record<string, CityData> = \{.*?\};', '', code, flags=re.DOTALL)

# Update Dashboard component definition
code = code.replace('export const Dashboard: React.FC = () => {', 'export const Dashboard: React.FC<{ initialMode?: "mission" | "predictor" }> = ({ initialMode = "mission" }) => {')

# Add new states
new_states = """
  const [activeMode, setActiveMode] = useState<"mission" | "predictor">(initialMode);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(9);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stateParam = params.get("state");
      const monthParam = params.get("month");
      if (stateParam && REGIONS[stateParam]) setSelectedRegion(REGIONS[stateParam]);
      if (monthParam) {
        const m = parseInt(monthParam);
        if (!isNaN(m) && m >= 0 && m <= 11) setSelectedMonth(m);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && selectedRegion) {
      const url = new URL(window.location.href);
      url.searchParams.set("state", selectedRegion.id);
      url.searchParams.set("month", selectedMonth.toString());
      window.history.replaceState({}, "", url.toString());
    }
  }, [selectedRegion?.id, selectedMonth]);

  const getSeasonalModifier = (month: number) => {
    if (month >= 9 && month <= 11) return 1.4; // Post-monsoon / Winter peak
    if (month >= 6 && month <= 8) return 0.6; // Monsoon washing
    return 1.0;
  };

  const activeModifier = getSeasonalModifier(selectedMonth);

  const activeNode = selectedRegion ? {
    ...selectedRegion,
    aqi:  Math.min(500, Math.max(1, Math.round(selectedRegion.aqi  * activeModifier))),
    pm25: Math.max(1,  Math.round(selectedRegion.pm25 * activeModifier)),
    pm10: Math.max(5,  Math.round(selectedRegion.pm10 * activeModifier)),
    no2:  Math.max(2,  Math.round(selectedRegion.no2  * activeModifier)),
    hcho: Number((selectedRegion.hcho * activeModifier).toFixed(4)),
    status: (() => {
      const a = selectedRegion.aqi * activeModifier;
      if (a <= 50) return "Good";
      if (a <= 100) return "Satisfactory";
      if (a <= 200) return "Moderate";
      if (a <= 300) return "Poor";
      if (a <= 400) return "Very Poor";
      return "Severe";
    })(),
    color: (() => {
      const a = selectedRegion.aqi * activeModifier;
      if (a <= 50) return "#10b981";
      if (a <= 100) return "#84cc16";
      if (a <= 200) return "#ffb428";
      if (a <= 300) return "#f59e0b";
      if (a <= 400) return "#ff6a00";
      return "#ef4444";
    })()
  } : null;
"""

code = re.sub(r'  const \[selectedCity, setSelectedCity\] = useState<CityData>\(CITIES\["Delhi"\]\);\n  const \[hoveredCity, setHoveredCity\] = useState<CityData \| null>\(null\);', new_states, code)

# Replace all selectedCity with selectedRegion? No, it's safer to just replace CityReport with StateSearch and the telemetry card

code = code.replace('<div className="w-full min-h-screen bg-[#03050a] text-white flex flex-col font-body selection:bg-orange/30">', 
                    '<div className={`w-full ${activeMode === "mission" ? "h-screen overflow-hidden" : "min-h-screen"} bg-[#03050a] text-white flex flex-col font-body selection:bg-orange/30`}>')

code = code.replace('const isSelected = selectedCity.name === location.name;', 'const isSelected = selectedRegion?.id === location.id;')
code = code.replace('const isHovered = hoveredCity?.name === location.name && !isSelected;', 'const isHovered = hoveredRegion?.id === location.id && !isSelected;')

code = code.replace('setHoveredCity(CITIES[location.name] || null)', 'setHoveredRegion(REGIONS[location.id] || null)')
code = code.replace('setHoveredCity(null)', 'setHoveredRegion(null)')
code = code.replace('setSelectedCity(CITIES[location.name])', 'setSelectedRegion(REGIONS[location.id])')

code = code.replace('{hoveredCity && hoveredCity.name !== selectedCity.name && (', '{hoveredRegion && hoveredRegion.id !== selectedRegion?.id && (')
code = code.replace('{hoveredCity.name}', '{hoveredRegion.name}')
code = code.replace('{hoveredCity.aqi}', '{hoveredRegion.aqi}')
code = code.replace('bg-${hoveredCity.color}', 'bg-[${hoveredRegion.color}]')

with open('src/components/Dashboard/index.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
