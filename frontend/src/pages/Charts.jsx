import React, { useEffect, useMemo, useState } from 'react';
import { fetchMarket, fetchIndicators } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, Legend
} from 'recharts';

export default function Charts() {
  const [ids, setIds] = useState('bitcoin,ethereum,solana');
  const [selected, setSelected] = useState('bitcoin');
  const [days, setDays] = useState('90');
  const [market, setMarket] = useState(null);
  const [series, setSeries] = useState([]);

  // toggles
  const [showEMA, setShowEMA] = useState(true);
  const [showBB, setShowBB] = useState(true);
  const [showST, setShowST] = useState(true);
  const [showMACD, setShowMACD] = useState(true);
  const [showRSI, setShowRSI] = useState(true);

  const coins = useMemo(() => ids.split(',').map(s => s.trim()).filter(Boolean), [ids]);

  useEffect(() => {
    (async () => {
      const m = await fetchMarket(ids);
      setMarket(m);
    })();
  }, [ids]);

  useEffect(() => {
    (async () => {
      const data = await fetchIndicators({ id: selected, days });
      setSeries(data?.series || []);
    })();
  }, [selected, days]);

  return (
    <div className="page">
      <h2>Graphiques</h2>
      <p className="muted">Overlays pro (EMA, Bollinger, SuperTrend) + panneaux MACD/RSI.</p>

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

        <label><input type="checkbox" checked={showEMA} onChange={()=>setShowEMA(!showEMA)} /> EMA</label>
        <label><input type="checkbox" checked={showBB} onChange={()=>setShowBB(!showBB)} /> Bollinger</label>
        <label><input type="checkbox" checked={showST} onChange={()=>setShowST(!showST)} /> SuperTrend</label>
        <label><input type="checkbox" checked={showMACD} onChange={()=>setShowMACD(!showMACD)} /> MACD</label>
        <label><input type="checkbox" checked={showRSI} onChange={()=>setShowRSI(!showRSI)} /> RSI</label>
      </div>

      {/* PLOT PRINCIPAL (Close + overlays) */}
      <div className="card" style={{ minHeight: 320, marginBottom: 12 }}>
        <h3 style={{ marginBottom: 8 }}>{selected} — {days} jours</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="t" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(ts) => new Date(ts).toLocaleString()} />
              <Legend />
              {/* Close */}
              <Line type="monotone" dataKey="close" dot={false} />
              {/* EMA */}
              {showEMA && <Line type="monotone" dataKey="ema12" dot={false} />}
              {showEMA && <Line type="monotone" dataKey="ema26" dot={false} />}
              {showEMA && <Line type="monotone" dataKey="ema50" dot={false} />}
              {showEMA && <Line type="monotone" dataKey="ema200" dot={false} />}
              {/* Bollinger */}
              {showBB && <Line type="monotone" dataKey="bb_mid" dot={false} />}
              {showBB && <Line type="monotone" dataKey="bb_upper" dot={false} />}
              {showBB && <Line type="monotone" dataKey="bb_lower" dot={false} />}
              {/* SuperTrend */}
              {showST && <Line type="monotone" dataKey="supertrend" dot={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid2">
        {/* MACD */}
        <div className="card" style={{ minHeight: 240 }}>
          <h3>MACD</h3>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(ts) => new Date(ts).toLocaleString()} />
                {showMACD && <Line type="monotone" dataKey="macd" dot={false} />}
                {showMACD && <Line type="monotone" dataKey="macdSignal" dot={false} />}
                {/* Histogramme en Area (valeurs positives/négatives) */}
                {showMACD && (
                  <AreaChart data={series}>
                    <Area type="monotone" dataKey="macdHist" />
                  </AreaChart>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RSI */}
        <div className="card" style={{ minHeight: 240 }}>
          <h3>RSI (14)</h3>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} />
                <YAxis domain={[0, 100]} />
                <Tooltip labelFormatter={(ts) => new Date(ts).toLocaleString()} />
                {showRSI && <Line type="monotone" dataKey="rsi" dot={false} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Marché brut (optionnel) */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Marché (actuel)</h3>
        <pre>{market ? JSON.stringify(market, null, 2) : 'Chargement...'}</pre>
      </div>
    </div>
  );
}
