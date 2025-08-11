import React from "react";
import Section from "../components/ui/Section";

const rows = [
  { sym: "BTC", name: "Bitcoin", price: 29150, ch: +2.4, vol: "$12.4B" },
  { sym: "ETH", name: "Ethereum", price: 1850, ch: -1.1, vol: "$6.7B" },
  { sym: "SOL", name: "Solana", price: 26.3, ch: +5.7, vol: "$1.1B" },
  { sym: "OP", name: "Optimism", price: 1.83, ch: +0.9, vol: "$220M" },
];

export default function Markets() {
  return (
    <Section title="Marchés" subtitle="Top actifs par capitalisation">
      <div className="card p-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Symbole</th><th>Nom</th><th>Prix</th><th>24h</th><th>Volume</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.sym}>
                <td className="font-medium">{r.sym}</td>
                <td className="text-slate-300">{r.name}</td>
                <td>${r.price}</td>
                <td className={r.ch>=0?"text-emerald-400":"text-rose-400"}>{r.ch>=0?"+":""}{r.ch}%</td>
                <td>{r.vol}</td>
                <td><button className="btn-outline">Ajouter à la watchlist</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
