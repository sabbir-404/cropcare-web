import { useMemo, useState } from "react";
import Nav from "../components/Layout/Nav";
import Container from "../components/Layout/Container";
import { useQuery } from "@tanstack/react-query";
import { USE_MOCK } from "../lib/api";
import { listDetections, getMe, getTips } from "../lib/api";
import { mockListDetections, mockMe, mockGetTips } from "../lib/mock";
import type { Detection, Me } from "../lib/types";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";

// earthy colors
const COLORS = {
  cream: "#F1EDE8",
  leaf: "#4CAF50",
  leafDark: "#43A047",
  wheat: "#F7B267",
  wheatDark: "#F79D56",
  rose: "#ef4444",
  amber: "#f59e0b",
  emerald: "#10b981",
  text: "#333333",
  border: "#DAD7CD",
};

export default function Dashboard(){
  // load user, detections, tips
  const { data: me } = useQuery<Me>({ queryKey:["me"], queryFn: ()=> USE_MOCK ? mockMe() : getMe() });
  const { data: detections = [], refetch } = useQuery<Detection[]>({
    queryKey:["detections"],
    queryFn: ()=> USE_MOCK ? mockListDetections() : listDetections({ limit: 500 }),
  });
  const { data: tipsData } = useQuery<{tips:string[]}>({
    queryKey:["tips"],
    queryFn: ()=> USE_MOCK ? mockGetTips() : getTips(),
  });

  // local import (JSON) option
  const [imported, setImported] = useState<Detection[]|null>(null);
  const records = imported ?? detections;

  // group by day counts (bar chart)
  const byDay = useMemo(()=>{
    const map = new Map<string, number>();
    for (const r of records) {
      const d = new Date(r.captured_at);
      const key = d.toISOString().slice(0,10); // YYYY-MM-DD
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    // last 14 days
    const now = new Date();
    const out: { day: string; scans: number }[] = [];
    for (let i=13;i>=0;i--){
      const d = new Date(now.getTime() - i*24*60*60*1000);
      const key = d.toISOString().slice(0,10);
      out.push({ day: key.slice(5), scans: map.get(key) ?? 0 }); // MM-DD
    }
    return out;
  }, [records]);

  // pie: severity distribution
  const pie = useMemo(()=>{
    const counts = { low:0, medium:0, high:0 };
    for (const r of records) counts[r.severity_band as "low"|"medium"|"high"]++;
    return [
      { name:"Low", value: counts.low, color: COLORS.emerald },
      { name:"Medium", value: counts.medium, color: COLORS.amber },
      { name:"High", value: counts.high, color: COLORS.rose },
    ];
  }, [records]);

  function onImportJSON(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Detection[];
        setImported(data);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(f);
  }

  return (
    <>
      <Nav />
      <Container>
        {/* Header with user */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={me?.avatar_url || "/profile.jpg"}
            alt={me?.name || "User"}
            className="h-10 w-10 rounded-full object-cover border"
          />
          <div>
            <div className="text-sm text-gray-600">Welcome</div>
            <div className="text-xl font-bold">{me?.name || "Your Name"}</div>
          </div>
          <div className="flex-1" />
          {/* Import + Refresh controls */}
          <label className="text-sm">
            <span className="rounded-md border px-3 py-1.5 bg-white/70 cursor-pointer hover:bg-white">
              Import JSON
            </span>
            <input type="file" accept="application/json" className="hidden" onChange={onImportJSON}/>
          </label>
          <button
            className="ml-2 rounded-md border px-3 py-1.5 bg-white/70 hover:bg-white"
            onClick={()=>{ setImported(null); refetch(); }}
          >
            {USE_MOCK ? "Reload mock" : "Reload"}
          </button>
        </div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-4 shadow-sm" style={{background: COLORS.cream, borderColor: COLORS.border}}>
            <div className="text-sm text-gray-600">Total Scans</div>
            <div className="text-3xl font-extrabold">{records.length}</div>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{background: COLORS.cream, borderColor: COLORS.border}}>
            <div className="text-sm text-gray-600">High Severity</div>
            <div className="text-3xl font-extrabold">{records.filter(r=>r.severity_band==="high").length}</div>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{background: COLORS.cream, borderColor: COLORS.border}}>
            <div className="text-sm text-gray-600">Last 7 Days</div>
            <div className="text-3xl font-extrabold">
              {records.filter(r=> (Date.now()-new Date(r.captured_at).getTime()) < 7*24*60*60*1000).length}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-4 shadow-sm" style={{background: COLORS.cream, borderColor: COLORS.border}}>
            <div className="font-semibold mb-2">Scans by Day (last 14)</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDay} margin={{ left: 8, right: 8 }}>
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="scans" fill={COLORS.leaf} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border p-4 shadow-sm" style={{background: COLORS.cream, borderColor: COLORS.border}}>
            <div className="font-semibold mb-2">Severity Distribution</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label>
                    {pie.map((entry, index) => <Cell key={`c-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Tips */}
        <div className="mt-6 rounded-2xl border p-4 shadow-sm" style={{background: COLORS.cream, borderColor: COLORS.border}}>
          <div className="font-semibold mb-2">AI Tips</div>
          <ul className="space-y-2 text-sm text-gray-700">
            {(tipsData?.tips ?? []).map((t,i)=>(
              <li key={i} className="rounded-md bg-white/70 p-2 border" style={{borderColor: COLORS.border}}>
                {t}
              </li>
            ))}
            {(!tipsData?.tips || tipsData.tips.length===0) && (
              <li className="text-gray-500">No tips yet. Run a Health Check to see suggestions.</li>
            )}
          </ul>
        </div>
      </Container>
    </>
  );
}
