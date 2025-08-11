import React from "react";
export default function Section({ title, subtitle, right, children }) {
  return (
    <section className="mb-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
          {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
