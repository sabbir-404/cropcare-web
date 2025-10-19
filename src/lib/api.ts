import axios from "axios";
import type { InferResponse } from "./types";

export const API = import.meta.env.VITE_API_BASE || "http://localhost:8000";
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "false") === "true";

export const http = axios.create({
  baseURL: API,
  timeout: 20000,
});

export async function ping(): Promise<{ok: boolean}> {
  const { data } = await http.get("/ping");
  return data;
}

export async function inferImage(file: File, meta?: Partial<{lat:number;lon:number;crop:string;variety:string;notes:string}>): Promise<InferResponse> {
  const form = new FormData();
  form.append("image", file);
  if (meta?.lat != null) form.append("lat", String(meta.lat));
  if (meta?.lon != null) form.append("lon", String(meta.lon));
  if (meta?.crop) form.append("crop", meta.crop);
  if (meta?.variety) form.append("variety", meta.variety);
  if (meta?.notes) form.append("notes", meta.notes);
  const { data } = await http.post("/api/infer", form);
  return data;
}
