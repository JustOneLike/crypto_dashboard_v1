import React, { useEffect, useState } from 'react';
import { postScores } from '../services/api';

function mockPrices(n = 60, base = 100) {
  const arr = [];
  let v = base;
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) {
    v = v * (0.995 + Math.random()*0.01);
    arr.push({ t: now - i * 3600_000, p: v });
  }
  return arr;
}

export default function Indicators() {
  const [scores, setScores] = useState(null);

  useEffect(() => {
    (async () => {
      const prices = mockPrices();
      const sc = await postScores(prices);
      setScores(sc);
    })();
  }, []);

  return (
    <div className="page">
      <h2>Indicateurs</h2>
      <p className="muted">Scores calculés côté serveur (modèle simplifié à remplacer par tes formules exactes).</p>

      <div className="grid3">
        <div className="card kpi">
          <span className="kpi-label">LTPI</span>
          <span className="kpi-value">{scores?.LTPI ?? '...'}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">MTPI</span>
          <span className="kpi-value">{scores?.MTPI ?? '...'}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">CMVI</span>
          <span className="kpi-value">{scores?.CMVI ?? '...'}</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Détails bruts</h3>
        <pre>{scores ? JSON.stringify(scores, null, 2) : 'Calcul...'}</pre>
      </div>
    </div>
  );
}
