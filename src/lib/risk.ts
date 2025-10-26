// src/lib/risk.ts
export type WeatherData = {
  temperatureC?: number;    // °C
  humidity?: number;        // 0..1
  rainfallMm?: number;      // last 24h (optional)
  windKph?: number;         // air speed
  uvIndex?: number;         // 0..11+
  airQualityIndex?: number; // AQI (0..500 typical scale)
  chanceOfRain?: number;    // 0..1
};

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Risk = { level: RiskLevel; notes?: string[] };

export function riskFromWeather(w: WeatherData): Risk {
  const t = w.temperatureC ?? 28;
  const h = w.humidity ?? 0.7;
  const r = w.rainfallMm ?? 0;
  const wind = w.windKph ?? 5;

  let score = 0;
  const notes: string[] = [];
  if (t >= 26 && t <= 34) { score += 2; notes.push("Warm temperature"); }
  if (h >= 0.75)         { score += 2; notes.push("High humidity"); }
  if (r >= 5)            { score += 2; notes.push("Recent rainfall"); }
  if (wind <= 8)         { score += 1; notes.push("Low wind"); }

  const level: RiskLevel =
    score >= 6 ? "critical" :
    score >= 4 ? "high" :
    score >= 2 ? "medium" :
                 "low";

  return { level, notes };
}

/** Niceties for display */
export function formatAQI(aqi?: number) {
  if (aqi == null) return { label: "—", band: "unknown" as const };
  const band =
    aqi <= 50  ? "Good" :
    aqi <= 100 ? "Moderate" :
    aqi <= 150 ? "Unhealthy (SG)" :
    aqi <= 200 ? "Unhealthy" :
    aqi <= 300 ? "Very Unhealthy" : "Hazardous";
  return { label: `${aqi}`, band };
}

export function formatUV(uv?: number) {
  if (uv == null) return { label: "—", band: "unknown" as const };
  const band =
    uv < 3 ? "Low" :
    uv < 6 ? "Moderate" :
    uv < 8 ? "High" :
    uv < 11 ? "Very High" : "Extreme";
  return { label: `${uv}`, band };
}
