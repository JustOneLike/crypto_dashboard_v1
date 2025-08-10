// backend/utils/factors.js (ESM)
// KPIs pro : Sharpe (30j), Sortino (30j), Corrélation 30j vs BTC, ADX(14)

function toDailyReturns(closes) {
  const rets = [];
  for (let i = 1; i < closes.length; i++) {
    const p0 = closes[i - 1];
    const p1 = closes[i];
    if (p0 > 0 && p1 > 0) rets.push(Math.log(p1 / p0));
  }
  return rets;
}

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const v = arr.reduce((s, x) => s + (x - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(v);
}

function downsideStd(arr) {
  const neg = arr.filter((x) => x < 0);
  if (neg.length < 2) return 0;
  const m = mean(neg);
  const v = neg.reduce((s, x) => s + (x - m) ** 2, 0) / (neg.length - 1);
  return Math.sqrt(v);
}

export function sharpe30(closes) {
  const rets = toDailyReturns(closes.slice(-31)); // ~30 intervalles
  if (!rets.length) return 0;
  const m = mean(rets);
  const s = stddev(rets);
  if (s === 0) return 0;
  // annualise approx: 365 jours (crypto 24/7)
  return (m / s) * Math.sqrt(365);
}

export function sortino30(closes) {
  const rets = toDailyReturns(closes.slice(-31));
  if (!rets.length) return 0;
  const m = mean(rets);
  const ds = downsideStd(rets);
  if (ds === 0) return 0;
  return (m / ds) * Math.sqrt(365);
}

export function correlation30(closesA, closesB) {
  const a = closesA.slice(-31);
  const b = closesB.slice(-31);
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const ra = toDailyReturns(a);
  const rb = toDailyReturns(b);
  const mA = mean(ra), mB = mean(rb);
  const num = ra.reduce((s, x, i) => s + (x - mA) * (rb[i] - mB), 0);
  const den = (ra.length - 1) * stddev(ra) * stddev(rb);
  if (den === 0) return 0;
  return num / den;
}

// ADX(14) (approx OHLC en absence de vraies bougies : on dérive H/L autour de close)
export function adx14FromApproxCloses(closes) {
  if (closes.length < 20) return 0;

  const highs = closes.map(c => c * 1.003);
  const lows  = closes.map(c => c * 0.997);

  const len = closes.length;
  const tr  = Array(len).fill(0);
  const plusDM = Array(len).fill(0);
  const minusDM = Array(len).fill(0);

  for (let i = 1; i < len; i++) {
    const upMove = highs[i] - highs[i - 1];
    const downMove = lows[i - 1] - lows[i];
    plusDM[i]  = (upMove > downMove && upMove > 0) ? upMove : 0;
    minusDM[i] = (downMove > upMove && downMove > 0) ? downMove : 0;

    const prevClose = closes[i - 1];
    tr[i] = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - prevClose),
      Math.abs(lows[i] - prevClose)
    );
  }

  const period = 14;
  // Wilder’s smoothing
  function rma(src, period) {
    const out = Array(src.length).fill(null);
    let sum = 0;
    let prev = null;
    for (let i = 0; i < src.length; i++) {
      const v = src[i];
      if (i < period) {
        sum += v;
        if (i === period - 1) {
          prev = sum / period;
          out[i] = prev;
        }
      } else if (prev != null) {
        prev = (prev * (period - 1) + v) / period;
        out[i] = prev;
      }
    }
    return out;
  }

  const tr14 = rma(tr, period);
  const pDM14 = rma(plusDM, period);
  const mDM14 = rma(minusDM, period);

  const pDI = closes.map((_, i) => (tr14[i] ? (pDM14[i] / tr14[i]) * 100 : null));
  const mDI = closes.map((_, i) => (tr14[i] ? (mDM14[i] / tr14[i]) * 100 : null));

  const dx = closes.map((_, i) => {
    if (pDI[i] == null || mDI[i] == null) return null;
    const denom = pDI[i] + mDI[i];
    if (!denom) return 0;
    return (Math.abs(pDI[i] - mDI[i]) / denom) * 100;
    });

  // ADX = RMA du DX
  const adxArr = rma(dx.map(v => v ?? 0), period);
  const last = adxArr[adxArr.length - 1];
  return last == null ? 0 : Math.round(last * 100) / 100;
}
