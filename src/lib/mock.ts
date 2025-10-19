import type { InferResponse } from "./types";

const labels = ["healthy","blight","rust","mildew"] as const;
const severities = ["low","medium","high"] as const;

export async function mockPing() {
  await new Promise(r => setTimeout(r, 200));
  return { ok: true };
}

export async function mockInfer(file: File): Promise<InferResponse> {
  await new Promise(r => setTimeout(r, 800));
  const label = labels[Math.floor(Math.random()*labels.length)];
  const severity_band = severities[Math.floor(Math.random()*severities.length)];
  const severity_percent = severity_band === "low" ? 7.2 : severity_band === "medium" ? 24.9 : 48.3;

  return {
    id: crypto.randomUUID(),
    label,
    confidence: 0.92,
    severity_percent,
    severity_band,
    gradcam_url: "/mock/gradcam.png", // add a placeholder image if you want
    captured_at: new Date().toISOString(),
    suggestions: [
      { title: "Improve airflow", category: "preventive", content_md: "Thin canopy; avoid late overhead irrigation.", rank: 1 },
      { title: "Scout hot spots", category: "immediate", content_md: "Inspect nearby leaves and prune infected tissue.", rank: 2 },
      { title: "Rotate actives", category: "immediate", content_md: "If spraying, rotate MoA as per local guidance.", rank: 3 },
    ],
  };
}
