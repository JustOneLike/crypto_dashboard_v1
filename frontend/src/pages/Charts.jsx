import React, { useEffect, useMemo, useState } from 'react';
import { fetchMarket, fetchHistory } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

function formatHistoryToSeries(prices = []) {
  // input: [[timestamp_ms, price], ...] -> [{ t, p }]
  return prices.map(([t, p]) => ({ t, p }));
}

export default function Charts() {
  const [ids, setIds] = useState('bitcoin,ethereum,solana');
  const [selected, setSelected] = useState('bitcoin');
  const [days, setDays] = useState('7');
  const [market, setMarket] = useState(null);
  const [series, setSeries] = useState([]);

  // marché actuel (simple)
  useEffect(() => {
    (async () => {
      const m = await fetchMarket(ids);
      setMarket(m);
    })();
  }, [ids]);

  // historique pour le coin sélectionné
  useEffect(() => {
    (async () => {
      const hist = await fetchHistory({ id: selected, days });
      setSeries(formatHistoryToSeries(hist?.prices || []));
    })();
  }, [selected, days]);

  const coins = useMemo(() => ids.split(',').map(s => s.trim()).filter(Boolean), [ids]);

  return (
    <div className="page">
      <h2>Graphiques</h2>
      <p className="muted">Historique réel (CoinGecko) + aperçu marché.</p>

      <div className="toolbar" style={{ flexWrap: 'wrap', gap: 8 }}>
        <input value={ids} onChange={(e)=>setIds(e.target.value)} />
        <span className="hint">ex: bitcoin,ethereum,solana</span>

        <select value={selected} onChange={(e)=>setSelected(e.target.value)}>
          {coins.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={days} onChange={(e)=>setDays(e.target.value)}>
          <option value="1">1j</option>
          <option value="7">7j</option>
          <option value="30">30j</option>
          <option value="90">90j</option>
          <option value="365">1 an</option>
          <option value="max">Max</option>
        </select>
      </div>

      <div className="grid2">
        <div className="card" style={{ minHeight: 300 }}>
          <h3 style={{ marginBottom: 8 }}>{selected} — {days} jours</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="t"
                  tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(ts) => new Date(ts).toLocaleString()}
                  formatter={(v) => [v, 'Prix']}
                />
                <Line type="monotone" dataKey="p" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Marché (actuel)</h3>
          <pre>{market ? JSON.stringify(market, null, 2) : 'Chargement...'}</pre>
        </div>
      </div>
    </div>
  );
}
