import React from "react";
import Section from "../components/ui/Section";
import KpiCard from "../components/ui/KpiCard";
import AreaMini from "../charts/AreaMini";
import { series } from "../lib/mock";

export default function Dashboard() {
  const data = series(80, 26000, 30, 700);
  const kpis = [
    { label: "PnL 7j", value: "+4.2%", delta: "+" },
    { label: "Win rate 30j", value: "62%" },
    { label: "Vol. Réalisée", value: "3.1%" },
    { label: "Corr. BTC", value: "0.74" },
  ];

  return (
    <div>
      <Section title="Vue d'ensemble" subtitle="Mes indicateurs et watchlist">
        <div className="grid md:grid-cols-4 gap-3">
          {kpis.map((k) => <KpiCard key={k.label} label={k.label} value={k.value} delta={k.delta?"+2.1%":""} />)}
        </div>
      </Section>
      <Section title="BTC / ETH">
        <div className="grid md:grid-cols-2 gap-6">
          <AreaMini data={data} yDomain={[24000, 31000]} />
          <AreaMini data={data.map(d=>({...d, p:d.p*0.055}))} yDomain={[1200, 2000]} />
        </div>
      </Section>
    </div>
  );
}
