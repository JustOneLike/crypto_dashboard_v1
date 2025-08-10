// backend/index.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { computeScoresPoint, computeScoresSeries } from './utils/scores.js';

const app = express();
const DEFAULT_PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// Marché simple (prix actuels via CoinGecko)
app.get('/api/market', async (req, res) => {
  const ids = (req.query.ids || 'bitcoin,ethereum').trim();
  try {
    const cg = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids,
        vs_currencies: 'usd',
        include_market_cap: 'true',
        include_24hr_vol: 'true',
        include_24hr_change: 'true'
      }
    });
    res.json(cg.data);
  } catch (err) {
    console.error('[market] error:', err.message);
    res.json({ error: 'CoinGecko unreachable, fallback mock', data: {} });
  }
});

// Scores ponctuels (calcul réel simplifié à partir d'une série {t,p})
app.post('/api/scores', (req, res) => {
  const { prices } = req.body || {};
  if (!prices || !Array.isArray(prices) || prices.length < 2) {
    return res.status(400).json({ error: 'prices array (time, price) required' });
  }
  try {
    const result = computeScoresPoint(prices);
    res.json(result);
  } catch (e) {
    console.error('[scores] error:', e.message);
    res.status(500).json({ error: 'scores computation failed' });
  }
});

// Watchlist (in-memory pour démo)
let watchlist = [];
app.post('/api/watchlist', (req, res) => {
  const { items } = req.body || {};
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'items[] required' });
  }
  watchlist = items;
  res.json({ ok: true, watchlist });
});
app.get('/api/watchlist', (req, res) => {
  res.json({ watchlist });
});

// Historique de prix (CoinGecko market_chart) -> [{t,p}]
app.get('/api/history', async (req, res) => {
  const id = (req.query.id || 'bitcoin').trim();
  const vs = (req.query.vs || 'usd').trim();
  const days = (req.query.days || '7').toString(); // 1,7,30,90,365,max
  try {
    const r = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      params: { vs_currency: vs, days }
    });
    const prices = (r.data?.prices || []).map(([t, p]) => ({ t, p }));
    res.json({ id, vs, days, prices });
  } catch (e) {
    const msg = e.response?.data || e.message || 'unknown error';
    console.error('[history] error:', msg);
    res.status(500).json({ error: 'history fetch failed', details: msg });
  }
});

// Série d'indicateurs (LTPI/MTPI/CMVI) calculée depuis l'historique
app.get('/api/scores/series', async (req, res) => {
  const id = (req.query.id || 'bitcoin').trim();
  const vs = (req.query.vs || 'usd').trim();
  const days = (req.query.days || '30').toString();
  try {
    console.log(`[scores/series] id=${id} vs=${vs} days=${days}`);
    const r = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      params: { vs_currency: vs, days }
    });

    const raw = r.data?.prices || [];
    if (!raw.length) {
      console.warn('[scores/series] no prices from provider');
      return res.status(200).json({ id, vs, days, series: [], note: 'no prices from provider' });
    }

    const history = raw.map(([t, p]) => ({ t, p }));
    const series = computeScoresSeries(history);

    console.log(`[scores/series] points=${history.length} series=${series.length}`);
    res.json({ id, vs, days, series });
  } catch (e) {
    const msg = e.response?.data || e.message || 'unknown error';
    console.error('[scores/series] error:', msg);
    res.status(500).json({ error: 'scores series failed', details: msg });
  }
});

// Démarrage avec recherche automatique d'un port libre (4000 -> 4001 -> ...)
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`✅ Backend listening on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} already in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(Number(DEFAULT_PORT));

