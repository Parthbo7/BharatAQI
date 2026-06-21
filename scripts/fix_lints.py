import re

def fix_lints():
    with open('src/components/Dashboard/index.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove hoverColor
    content = content.replace('let hoverColor = "rgba(255,255,255,0.08)";\n', '')
    content = content.replace('else if (aqi > 400) { baseColor = "#7f1d1d88"; hoverColor = "#b91c1c"; selectedColor = "#ef4444"; }',
                              'else if (aqi > 400) { baseColor = "#7f1d1d88"; selectedColor = "#ef4444"; }')
    content = content.replace('else if (aqi > 300) { baseColor = "#b91c1c88"; hoverColor = "#dc2626"; selectedColor = "#ef4444"; }',
                              'else if (aqi > 300) { baseColor = "#b91c1c88"; selectedColor = "#ef4444"; }')
    content = content.replace('else if (aqi > 200) { baseColor = "#c2410c88"; hoverColor = "#ea580c"; selectedColor = "#f97316"; }',
                              'else if (aqi > 200) { baseColor = "#c2410c88"; selectedColor = "#f97316"; }')
    content = content.replace('else if (aqi > 100) { baseColor = "#a1620788"; hoverColor = "#ca8a04"; selectedColor = "#eab308"; }',
                              'else if (aqi > 100) { baseColor = "#a1620788"; selectedColor = "#eab308"; }')
    content = content.replace('else { baseColor = "#15803d88"; hoverColor = "#16a34a"; selectedColor = "#22c55e"; }',
                              'else { baseColor = "#15803d88"; selectedColor = "#22c55e"; }')

    # Also need to fix the first `if` branch which wasn't an `else if`:
    content = content.replace('if (aqi > 400) { baseColor = "#7f1d1d88"; hoverColor = "#b91c1c"; selectedColor = "#ef4444"; }',
                              'if (aqi > 400) { baseColor = "#7f1d1d88"; selectedColor = "#ef4444"; }')

    # Remove CityData interface
    start_city = content.find('interface CityData {')
    if start_city != -1:
        end_city = content.find('}', start_city) + 1
        content = content[:start_city] + content[end_city:]

    # Remove CITIES const
    start_cities = content.find('const CITIES: Record<string, CityData> = {')
    if start_cities != -1:
        # It's a huge object, let's find the end of it
        # the end of CITIES is just before `export const Dashboard`
        end_cities = content.find('export const Dashboard: React.FC', start_cities)
        if end_cities != -1:
            content = content[:start_cities] + content[end_cities:]

    with open('src/components/Dashboard/index.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_lints()
