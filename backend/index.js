// backend/index.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { computeScoresPoint, computeScoresSeries } from './utils/scores.js';

const app = express();
const DEFAULT_PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// Marché simple (prix actuels)
app.get('/api/market', async (req, res) => {
  const ids = req.query.ids || 'bitcoin,ethereum';
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
    console.error(err.message);
    res.json({ error: 'CoinGecko unreachable, fallback mock', data: {} });
  }
});

// Scores (calcul réel simplifié)
app.post('/api/scores', (req, res) => {
  const { prices } = req.body || {};
  if (!prices || !Array.isArray(prices) || prices.length < 2) {
    return res.status(400).json({ error: 'prices array (time, price) required' });
  }
  const result = computeScoresPoint(prices);
  res.json(result);
});

// Watchlist (in-memory)
let watchlist = [];
app.post('/api/watchlist', (req, res) => {
  const { items } = req.body || {};
  if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'items[] required' });
  watchlist = items;
  res.json({ ok: true, watchlist });
});
app.get('/api/watchlist', (req, res) => {
  res.json({ watchlist });
});

// Historique (CoinGecko market_chart)
app.get('/api/history', async (req, res) => {
  const id = req.query.id || 'bitcoin';
  const vs = req.query.vs || 'usd';
  const days = req.query.days || '7';
  try {
    const r = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      params: { vs_currency: vs, days }
    });
    // format: [[ts, price], ...] -> [{t, p}, ...]
    const prices = (r.data.prices || []).map(([t, p]) => ({ t, p }));
    res.json({ id, vs, days, prices });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'history fetch failed' });
  }
});

// Série de scores basée sur l'historique
app.get('/api/scores/series', async (req, res) => {
  const id = req.query.id || 'bitcoin';
  const vs = req.query.vs || 'usd';
  const days = req.query.days || '30';
  try {
    const r = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      params: { vs_currency: vs, days }
    });
    const history = (r.data.prices || []).map(([t, p]) => ({ t, p }));
    const series = computeScoresSeries(history);
    res.json({ id, vs, days, series });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'scores series failed' });
  }
});

// Port auto (4000 → 4001 → ...)
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
