// src/lib/mock.ts
import type { InferResponse, Me } from "./types";

// --- helpers / constants ---
const LABELS = ["healthy", "blight", "rust", "mildew"] as const;
const SEVERITIES = ["low", "medium", "high"] as const;

// keep an in-memory "me" state for mock mode
let mockMeState: Me = { name: "Sabbir Ahmed", avatar_url: "/profile.jpg" };

// optional: reset mocks between tests
export function __resetMockState() {
  mockMeState = { name: "Sabbir Ahmed", avatar_url: "/profile.jpg" };
}

// --- connectivity ---
export async function mockPing(): Promise<{ ok: boolean }> {
  await new Promise((r) => setTimeout(r, 200));
  return { ok: true };
}

// --- inference ---
export async function mockInfer(_file: File): Promise<InferResponse> {
  await new Promise((r) => setTimeout(r, 800));

  const label = LABELS[Math.floor(Math.random() * LABELS.length)];
  const severity_band = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const severity_percent =
    severity_band === "low" ? 7.2 : severity_band === "medium" ? 24.9 : 48.3;

  // Ensure /public/mock/gradcam.png exists (or change to undefined)
  const gradcam_url = "/mock/gradcam.png";

  return {
    id: crypto.randomUUID(),
    label,
    confidence: 0.92,
    severity_percent,
    severity_band,
    gradcam_url,
    captured_at: new Date().toISOString(),
    suggestions: [
      {
        title: "Improve airflow",
        category: "preventive",
        content_md: "Thin canopy; avoid late overhead irrigation.",
        rank: 1,
      },
      {
        title: "Scout hot spots",
        category: "immediate",
        content_md: "Inspect nearby leaves and prune infected tissue.",
        rank: 2,
      },
      {
        title: "Rotate actives",
        category: "immediate",
        content_md: "If spraying, rotate MoA as per local guidance.",
        rank: 3,
      },
    ],
  };
}

// --- profile (me) ---
export async function mockMe(): Promise<Me> {
  await new Promise((r) => setTimeout(r, 100));
  return { ...mockMeState };
}

export async function mockUpdateMeProfile(payload: {
  name?: string;
  avatarFile?: File;
}): Promise<Me> {
  await new Promise((r) => setTimeout(r, 150));

  if (payload.name) mockMeState.name = payload.name;

  if (payload.avatarFile) {
    // We can't actually upload in mock mode; show a blob preview URL.
    const blobUrl = URL.createObjectURL(payload.avatarFile);
    mockMeState.avatar_url = blobUrl;
    // (Optional) You can revoke previous blob URLs when replacing with a new one.
  }
  return { ...mockMeState };
}

// --- detections & tips for Dashboard ---
export async function mockListDetections(): Promise<InferResponse[]> {
  await new Promise((r) => setTimeout(r, 200));
  const now = Date.now();

  // 24 random detections over ~2–3 weeks
  return Array.from({ length: 24 }, (_, i) => {
    const label = LABELS[Math.floor(Math.random() * LABELS.length)];
    const severity_band = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
    const raw =
      severity_band === "low"
        ? Math.random() * 10 + 1 // 1–11%
        : severity_band === "medium"
        ? Math.random() * 20 + 15 // 15–35%
        : Math.random() * 30 + 35; // 35–65%

    const item: InferResponse = {
      id: crypto.randomUUID(),
      label,
      confidence: 0.7 + Math.random() * 0.3,
      severity_percent: Math.round(raw),
      severity_band,
      gradcam_url: undefined,
      captured_at: new Date(
        now - i * 24 * 60 * 60 * 1000 - Math.random() * 1e6
      ).toISOString(),
      lat: 23.7 + Math.random() * 0.3,
      lon: 90.3 + Math.random() * 0.3,
      suggestions: [],
    };
    return item;
  });
}

export async function mockGetTips(): Promise<{ tips: string[] }> {
  await new Promise((r) => setTimeout(r, 120));
  return {
    tips: [
      "Avoid late-day overhead irrigation; keep foliage dry.",
      "Rotate fungicide modes of action to reduce resistance.",
      "Prune hotspots and sanitize tools between rows.",
    ],
  };
}
