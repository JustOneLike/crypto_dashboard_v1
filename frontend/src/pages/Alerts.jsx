import React from "react";
import Section from "../components/ui/Section";

export default function Alerts() {
  return (
    <div>
      <Section title="Mes alertes" subtitle="Prix et indicateurs"> 
        <div className="card p-5">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <div className="label">Actif</div>
              <input className="input" placeholder="BTC" />
            </div>
            <div>
              <div className="label">Type</div>
              <select className="input">
                <option>Prix</option>
                <option>RSI</option>
                <option>ADX</option>
                <option>BB squeeze</option>
              </select>
            </div>
            <div>
              <div className="label">Seuil / Condition</div>
              <input className="input" placeholder="> 30000" />
            </div>
            <div className="flex items-end">
              <button className="btn-primary w-full">Créer l'alerte</button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Alertes actives">
        <div className="card p-4">
          <div className="text-sm text-slate-300">Aucune alerte encore — créez-en une ci-dessus.</div>
        </div>
      </Section>
    </div>
  );
}
