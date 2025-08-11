import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function AreaMini({ data, yDomain }) {
  return (
    <div className="h-56 w-full card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
          <XAxis dataKey="t" hide tick={{ fill: "#94a3b8" }} />
          <YAxis domain={yDomain} tick={{ fill: "#94a3b8" }} />
          <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #1e293b" }} labelStyle={{ color: "#cbd5e1" }} />
          <Area type="monotone" dataKey="p" stroke="#22d3ee" fill="url(#p)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
