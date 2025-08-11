import React, { useEffect, useMemo, useState } from 'react';
import { fetchScoresSeries, fetchFactors, fetchIndicators } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function Indicators() {
  const [ids, setIds] = useState('bitcoin,ethereum,solana');
  const [selected, setSelected] = useState('bitcoin');
  const [days, setDays] = useState('30');
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [kpis, setKpis] = useState(null);
  const [loadingKpi, setLoadingKpi] = useState(false);
  const [lastRSI, setLastRSI] = useState(null);
  const [bbWidthPct, setBbWidthPct] = useState(null);

  const coins = useMemo(() => ids.split(',').map(s => s.trim()).filter(Boolean), [ids]);

  useEffect(() => { if (!coins.includes(selected) && coins.length) setSelected(coins[0]); }, [ids]); // eslint-disable-line

  async function loadSeries() {
    try {
      setErr(''); setLoading(true);
      const data = await fetchScoresSeries({ id: selected, days });
      setSeries(data?.series || []);
      if (!data || !data.series) setErr('Aucune donnée reçue.');
      if (data?.series && data.series.length === 0) setErr('Série vide pour cette période/crypto.');
    } catch { setErr('Erreur de chargement.'); } finally { setLoading(false); }
  }

  async function loadKpis() {
    try {
      setLoadingKpi(true);
      const data = await fetchFactors({ id: selected, days: (Number(days)||30) < 90 ? '90' : days });
      setKpis(data?.kpis || null);
    } finally { setLoadingKpi(false); }
  }

  async function loadTechForBadges() {
    const ind = await fetchIndicators({ id: selected, days: (Number(days)||30) });
    const arr = ind?.series || [];
    if (arr.length) {
      const last = arr[arr.length - 1];
      setLastRSI(last?.rsi ?? null);
      if (last?.bb_upper != null && last?.bb_lower != null && last?.bb_mid != null) {
        const width = last.bb_upper - last.bb_lower;
        setBbWidthPct(last.bb_mid ? (width / last.bb_mid) * 100 : null);
      } else setBbWidthPct(null);
    } else { setLastRSI(null); setBbWidthPct(null); }
  }

  useEffect(() => { loadSeries(); loadKpis(); loadTechForBadges(); }, [selected, days]);

  const trendBadge = (() => {
    const adx = kpis?.adx14 ?? null;
    if (adx == null) return { cls: 'neutral', text: 'Trend: n/a' };
    if (adx >= 25) return { cls: 'ok', text: `Trend fort (ADX ${adx})` };
    if (adx >= 20) return { cls: 'warn', text: `Trend faible (ADX ${adx})` };
    return { cls: 'neutral', text: `Trend plat (ADX ${adx})` };
  })();

  const rsiBadge = (() => {
    const r = lastRSI;
    if (r == null) return { cls: 'neutral', text: 'RSI: n/a' };
    if (r > 70) return { cls: 'bad', text: `RSI ${r.toFixed(0)} (surachat)` };
    if (r < 30) return { cls: 'ok', text: `RSI ${r.toFixed(0)} (survente)` };
    return { cls: 'neutral', text: `RSI ${r.toFixed(0)}` };
  })();

  const bbBadge = (() => {
    const w = bbWidthPct;
    if (w == null) return { cls: 'neutral', text: 'BB squeeze: n/a' };
    if (w < 5) return { cls: 'warn', text: `Compression (${w.toFixed(1)}%)` };
    if (w > 15) return { cls: 'ok', text: `Expansion (${w.toFixed(1)}%)` };
    return { cls: 'neutral', text: `BB width ${w.toFixed(1)}%` };
  })();

  const corrBadge = (() => {
    const c = kpis?.corrBTC30 ?? null;
    if (c == null) return { cls: 'neutral', text: 'Corr BTC: n/a' };
    const t = c.toFixed(2);
    if (c > 0.7) return { cls: 'warn', text: `Corr BTC ${t} (forte)` };
    if (c < 0.3) return { cls: 'ok', text: `Corr BTC ${t} (faible)` };
    return { cls: 'neutral', text: `Corr BTC ${t}` };
  })();

  const coinsList = coins.map(c => <option key={c} value={c}>{c}</option>);

  return (
    <div className="page indicators-page">
      <h2>Indicateurs</h2>
      <p className="muted">Scores LTPI / MTPI / CMVI + KPIs pro et badges (ADX, RSI, Bollinger, Corr BTC).</p>

      <div className="toolbar">
        <input value={ids} onChange={(e)=>setIds(e.target.value)} placeholder="bitcoin,ethereum,solana" />
        <select value={selected} onChange={(e)=>setSelected(e.target.value)}>{coinsList}</select>
        <select value={days} onChange={(e)=>setDays(e.target.value)}>
          <option value="7">7j</option>
          <option value="30">30j</option>
          <option value="90">90j</option>
          <option value="365">1 an</option>
        </select>
        <button className="btn" onClick={() => { loadSeries(); loadKpis(); loadTechForBadges(); }} disabled={loading || loadingKpi}>
          {(loading || loadingKpi) ? 'Chargement…' : 'Actualiser'}
        </button>
      </div>

      <div className="grid4">
        <div className="card kpi"><span className="kpi-label">Sharpe (30j)</span><span className="kpi-value">{kpis ? kpis.sharpe30 : '—'}</span></div>
        <div className="card kpi"><span className="kpi-label">Sortino (30j)</span><span className="kpi-value">{kpis ? kpis.sortino30 : '—'}</span></div>
        <div className="card kpi"><span className="kpi-label">Corr BTC (30j)</span><span className="kpi-value">{kpis ? kpis.corrBTC30 : '—'}</span></div>
        <div className="card kpi"><span className="kpi-label">ADX (14)</span><span className="kpi-value">{kpis ? kpis.adx14 : '—'}</span></div>
      </div>

      <div className="badges">
        <span className={`badge ${trendBadge.cls}`}>{trendBadge.text}</span>
        <span className={`badge ${bbBadge.cls}`}>{bbBadge.text}</span>
        <span className={`badge ${rsiBadge.cls}`}>{rsiBadge.text}</span>
        <span className={`badge ${corrBadge.cls}`}>{corrBadge.text}</span>
      </div>

      {err && <div className="card" style={{ borderColor: 'rgba(255,100,100,0.4)', marginBottom: 12 }}><strong>Info :</strong> {err}</div>}

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
