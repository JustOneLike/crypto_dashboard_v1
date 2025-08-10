// backend/utils/scores.js (ESM)

function sma(values, period) {
  const out = Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

function stddev(arr) {
  if (arr.length === 0) return 0;
  const m = arr.reduce((a, b) => a + b, 0) / arr.length;
  const v = arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length;
  return Math.sqrt(v);
}

function annualizedVolFromPrices(prices) {
  const rets = [];
  for (let i = 1; i < prices.length; i++) {
    const p0 = prices[i - 1];
    const p1 = prices[i];
    if (p0 > 0 && p1 > 0) rets.push(Math.log(p1 / p0));
  }
  if (rets.length === 0) return 0;
  return stddev(rets) * Math.sqrt(252); // annualisé (approx)
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function normalize01(x, center = 0, spread = 0.5) {
  // mappe un écart autour de "center" à 0..1 (spread ~ échelle)
  return clamp01((x - center) / (2 * spread) + 0.5);
}

// Calcule LTPI/MTPI/CMVI à partir d'une série de {t, p}
export function computeScoresPoint(priceSeries, opts = {}) {
  const prices = priceSeries.map(d => d.p);
  const n = prices.length;
  if (n < 10) {
    return { LTPI: 50, MTPI: 50, CMVI: 0, meta: { note: 'not enough data' } };
  }

  // Fenêtres simples (tu pourras affiner plus tard)
  const short = Math.max(5, Math.floor(n * 0.06));   // ~6%
  const mid   = Math.max(12, Math.floor(n * 0.18));  // ~18%
  const long  = Math.max(24, Math.floor(n * 0.5));   // ~50%

  const maS = sma(prices, short);
  const maM = sma(prices, mid);
  const maL = sma(prices, long);

  const last = n - 1;
  const p = prices[last];
  const sS = maS[last] ?? p;
  const sM = maM[last] ?? p;
  const sL = maL[last] ?? p;

  // Mesure de tendance = écart relatif au MA
  const slopeShort = (p - sS) / (sS || p);
  const slopeMid   = (p - sM) / (sM || p);
  const slopeLong  = (p - sL) / (sL || p);

  const LTPI = Math.round(normalize01(slopeLong, 0, 0.1) * 100);
  const MTPI = Math.round(normalize01(slopeMid,  0, 0.08) * 100);

  // Volatilité annualisée → bornée 0..100 via un facteur
  const vol = annualizedVolFromPrices(prices.slice(-Math.max(20, short)));
  const CMVI = Math.round(clamp01(vol / 1.0) * 100); // ajuste 1.0 pour calibrer

  return { LTPI, MTPI, CMVI, meta: { slopeShort, slopeMid, slopeLong } };
}

// Série de scores (pour graphe) — calcule à partir de l'historique
export function computeScoresSeries(history) {
  // history: [{t, p}, ...] ordonné par t croissant
  const out = [];
  for (let i = 10; i < history.length; i++) {
    const slice = history.slice(0, i + 1);
    const s = computeScoresPoint(slice);
    out.push({ t: history[i].t, LTPI: s.LTPI, MTPI: s.MTPI, CMVI: s.CMVI });
  }
  return out;
}
