import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchMarket(ids = 'bitcoin,ethereum') {
  try {
    const r = await axios.get(`${API_BASE}/api/market`, { params: { ids } });
    return r.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function postScores(prices) {
  try {
    const r = await axios.post(`${API_BASE}/api/scores`, { prices });
    return r.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function saveWatchlist({ items = [] }) {
  try {
    const r = await axios.post(`${API_BASE}/api/watchlist`, { items });
    return r.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getWatchlist() {
  try {
    const r = await axios.get(`${API_BASE}/api/watchlist`);
    return r.data;
  } catch (e) {
    console.error(e);
    return { watchlist: [] };
  }
}

export async function fetchHistory({ id = 'bitcoin', vs = 'usd', days = '7' } = {}) {
  try {
    const r = await axios.get(`${API_BASE}/api/history`, { params: { id, vs, days } });
    // { id, vs, days, prices: [[timestamp_ms, price], ...] }
    return r.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
