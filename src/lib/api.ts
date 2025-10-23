// src/lib/api.ts
import axios from "axios";
import type { InferResponse, Me } from "./types";

// ------ env & base client ------
export const API = import.meta.env.VITE_API_BASE || "http://localhost:8000";
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "false") === "true";

export const http = axios.create({
  baseURL: API,
  timeout: 20000,
});

// (optional) attach auth token if you add real login later
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("cropcare_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------ basic health ------
export async function ping(): Promise<{ ok: boolean }> {
  const { data } = await http.get("/ping");
  return data;
}

// ------ inference ------
export async function inferImage(
  file: File,
  meta?: Partial<{ lat: number; lon: number; crop: string; variety: string; notes: string }>
): Promise<InferResponse> {
  const form = new FormData();
  form.append("image", file);
  if (meta?.lat != null) form.append("lat", String(meta.lat));
  if (meta?.lon != null) form.append("lon", String(meta.lon));
  if (meta?.crop) form.append("crop", meta.crop);
  if (meta?.variety) form.append("variety", meta.variety);
  if (meta?.notes) form.append("notes", meta.notes);

  const { data } = await http.post("/api/infer", form);
  return data as InferResponse;
}

// ------ user profile ------
export async function getMe(): Promise<Me> {
  const { data } = await http.get("/api/me");
  return data as Me;
}

// multipart so you can send an avatar file
export async function updateMeProfile(payload: { name?: string; avatarFile?: File }): Promise<Me> {
  const form = new FormData();
  if (payload.name) form.append("name", payload.name);
  if (payload.avatarFile) form.append("avatar", payload.avatarFile);
  const { data } = await http.patch("/api/me", form);
  return data as Me;
}

// ------ tips & detections (for Dashboard) ------
export async function getTips(): Promise<{ tips: string[] }> {
  const { data } = await http.get("/api/tips");
  return data as { tips: string[] };
}

export async function listDetections(params?: {
  from?: string; to?: string;
  label?: string;
  severity?: "low" | "medium" | "high";
  limit?: number;
}): Promise<InferResponse[]> {
  const { data } = await http.get("/api/detections", { params });
  return data as InferResponse[];
}
export type Weather = {
  lat: number; lon: number;
  temp_c: number; humidity: number; wind_ms: number;
  uv_index: number; rain_mm?: number; clouds_pct?: number;
};

export type RegionalAlert = {
  region: string;                  // e.g., "Dhaka"
  polygon?: [number, number][];    // optional polygon [lat, lon] list
  center: { lat: number; lon: number };
  radius_m?: number;               // optional circle radius
  top_disease: string;             // e.g., "blight"
  severity: "low" | "medium" | "high";
  summary: string;
  tips: string[];
};

export async function getRegionalAlerts(): Promise<RegionalAlert[]> {
  const { data } = await http.get("/api/alerts");
  return data as RegionalAlert[];
}

export async function getWeather(lat: number, lon: number): Promise<Weather> {
  const { data } = await http.get("/api/weather", { params: { lat, lon } });
  return data as Weather;
}

export type AirQuality = {
  aqi: number;              // 0–500 (EPA style) or 1–5 (EU) — your backend should normalize to 0–500
  category: "Good" | "Moderate" | "Unhealthy for SG" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  pm25?: number; pm10?: number; o3?: number; no2?: number; so2?: number; co?: number;
};

export async function getAirQuality(lat: number, lon: number): Promise<AirQuality> {
  const { data } = await http.get("/api/air", { params: { lat, lon } });
  return data as AirQuality;
}
