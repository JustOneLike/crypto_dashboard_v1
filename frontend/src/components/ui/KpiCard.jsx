import React from "react";
export default function KpiCard({ label, value, delta }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {delta && <div className={`text-xs mt-1 ${delta.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>{delta} 24h</div>}
    </div>
  );
}
