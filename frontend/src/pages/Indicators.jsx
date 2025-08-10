import React, { useEffect, useMemo, useState } from 'react';
import { fetchScoresSeries } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

export default function Indicators() {
  const [ids, setIds] = useState('bitcoin,ethereum,solana');
  const [selected, setSelected] = useState('bitcoin');
  const [days, setDays] = useState('30');
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const coins = useMemo(
    () => ids.split(',').map(s => s.trim()).filter(Boolean),
    [ids]
  );

  // si l'utilisateur change la liste et que la sélection n'existe plus, on recale
  useEffect(() => {
    if (!coins.includes(selected) && coins.length) {
      setSelected(coins[0]);
    }
  }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    try {
      setErr('');
      setLoading(true);
      const data = await fetchScoresSeries({ id: selected, days });
      setSeries(data?.series || []);
      if (!data || !data.series) setErr('Aucune donnée reçue (API).');
      if (data?.series && data.series.length === 0) {
        setErr('Série vide pour cette période/crypto.');
      }
    } catch (e) {
      setErr('Erreur de chargement des indicateurs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [selected, days]); // recharge à chaque changement

  return (
    <div className="page">
      <h2>Indicateurs</h2>
      <p className="muted">Scores LTPI / MTPI / CMVI calculés côté serveur (série historique).</p>

      <div className="toolbar" style={{ flexWrap: 'wrap', gap: 8 }}>
        <input value={ids} onChange={(e)=>setIds(e.target.value)} />
        <span className="hint">ex: bitcoin,ethereum,solana</span>

        <select value={selected} onChange={(e)=>setSelected(e.target.value)}>
          {coins.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={days} onChange={(e)=>setDays(e.target.value)}>
          <option value="7">7j</option>
          <option value="30">30j</option>
          <option value="90">90j</option>
          <option value="365">1 an</option>
          <option value="max">Max</option>
        </select>

        <button className="btn" onClick={load} disabled={loading}>
          {loading ? 'Chargement…' : 'Actualiser'}
        </button>
      </div>

      {err && <div className="card" style={{ borderColor: 'rgba(255,100,100,0.4)', marginBottom: 12 }}>
        <strong>Info :</strong> {err}
      </div>}

      <div className="grid3">
        <div className="card kpi">
          <span className="kpi-label">LTPI</span>
          <span className="kpi-value">{series.length ? series[series.length - 1].LTPI : '—'}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">MTPI</span>
          <span className="kpi-value">{series.length ? series[series.length - 1].MTPI : '—'}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">CMVI</span>
          <span className="kpi-value">{series.length ? series[series.length - 1].CMVI : '—'}</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, minHeight: 320 }}>
        <h3 style={{ marginBottom: 8 }}>{selected} — {days} jours</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="t" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} />
              <YAxis domain={[0, 100]} />
              <Tooltip labelFormatter={(ts) => new Date(ts).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="LTPI" dot={false} />
              <Line type="monotone" dataKey="MTPI" dot={false} />
              <Line type="monotone" dataKey="CMVI" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
