export type Suggestion = {
  title: string;
  category: "immediate" | "preventive";
  content_md: string;
  rank: number;
};

export type InferResponse = {
  id: string;
  label: string;
  confidence: number;        // 0..1
  severity_percent: number;  // 0..100
  severity_band: "low" | "medium" | "high";
  gradcam_url?: string;
  captured_at: string;       // ISO
  lat?: number; lon?: number;
  suggestions?: Suggestion[];
};

export type Me = {
  name: string;
  avatar_url?: string; // absolute or /public path
};

export type Detection = InferResponse; // reuse your existing shape
