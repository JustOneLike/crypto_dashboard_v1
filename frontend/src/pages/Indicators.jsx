import React, { useEffect, useMemo, useState } from 'react';
import { fetchScoresSeries, fetchFactors } from '../services/api';
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
  const [kpis, setKpis] = useState(null);
  const [loadingKpi, setLoadingKpi] = useState(false);

  const coins = useMemo(
    () => ids.split(',').map(s => s.trim()).filter(Boolean),
    [ids]
  );

  useEffect(() => {
    if (!coins.includes(selected) && coins.length) {
      setSelected(coins[0]);
    }
  }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadSeries() {
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

  async function loadKpis() {
    try {
      setLoadingKpi(true);
      const data = await fetchFactors({ id: selected, days: Math.max(90, Number(days) || 90) + '' });
      setKpis(data?.kpis || null);
    } catch (e) {
      // noop
    } finally {
      setLoadingKpi(false);
    }
  }

  useEffect(() => { loadSeries(); loadKpis(); }, [selected, days]);

  const last = series.length ? series[series.length - 1] : null;

  return (
    <div className="page">
      <h2>Indicateurs</h2>
      <p className="muted">
        Scores LTPI / MTPI / CMVI (série) + KPIs pro (Sharpe 30j, Sortino 30j, Corrélation BTC 30j, ADX 14).
      </p>

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

        <button className="btn" onClick={() => { loadSeries(); loadKpis(); }} disabled={loading || loadingKpi}>
          {(loading || loadingKpi) ? 'Chargement…' : 'Actualiser'}
        </button>
      </div>

      {/* KPIs PRO */}
      <div className="grid4">
        <div className="card kpi">
          <span className="kpi-label">Sharpe (30j)</span>
          <span className="kpi-value">{kpis ? kpis.sharpe30 : '—'}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Sortino (30j)</span>
          <span className="kpi-value">{kpis ? kpis.sortino30 : '—'}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Corr BTC (30j)</span>
          <span className="kpi-value">{kpis ? kpis.corrBTC30 : '—'}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">ADX (14)</span>
          <span className="kpi-value">{kpis ? kpis.adx14 : '—'}</span>
        </div>
      </div>

      {err && <div className="card" style={{ borderColor: 'rgba(255,100,100,0.4)', marginBottom: 12 }}>
        <strong>Info :</strong> {err}
      </div>}

      <div className="grid1">
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
    </div>
  );
}
