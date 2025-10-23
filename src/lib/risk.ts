// src/lib/risk.ts
import type { Weather } from "./api";

export type Risk = { level: "low" | "medium" | "high"; notes: string[] };

export function riskFromWeather(w: Weather): Risk {
  const notes: string[] = [];
  let score = 0;

  // temperature (fungal pressure often 20–28°C; heat stress > 34°C)
  if (w.temp_c >= 20 && w.temp_c <= 28) { score += 2; notes.push("Temp favors many foliar fungi (20–28°C)."); }
  if (w.temp_c > 34) { score += 1; notes.push("Possible heat stress (>34°C)."); }

  // humidity & rain (leaf wetness duration proxy)
  if (w.humidity >= 70) { score += 2; notes.push("High humidity increases infection risk."); }
  if ((w.rain_mm ?? 0) > 0) { score += 1; notes.push("Recent rain may extend leaf wetness."); }

  // UV (can suppress some spores but also scorch leaves)
  if (w.uv_index >= 8) { score += 1; notes.push("High UV; monitor for scorch on tender leaves."); }

  // wind (disease spread vs evap. dry-down)
  if (w.wind_ms >= 6) { score += 1; notes.push("Wind may spread spores or stress plants."); }

  const level = score >= 5 ? "high" : score >= 3 ? "medium" : "low";
  return { level, notes };
}
