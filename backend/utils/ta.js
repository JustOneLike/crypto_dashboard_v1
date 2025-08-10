// backend/utils/ta.js (ESM)
// Implémentations JS "propres" d'indicateurs pro courants.
// Entrée standard pour les fonctions de série: array de nombres (close) ou objets {close, high, low, volume}.

function ema(values, period) {
  const out = Array(values.length).fill(null);
  if (!values.length || period < 1) return out;
  const k = 2 / (period + 1);
  let emaPrev = null;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) { out[i] = null; continue; }
    if (emaPrev == null) {
      // seed: SMA des 'period' premiers points si possible
      if (i >= period - 1) {
        let sum = 0;
        for (let j = i - period + 1; j <= i; j++) sum += values[j];
        emaPrev = sum / period;
        out[i] = emaPrev;
      } else {
        out[i] = null;
      }
    } else {
      const cur = v * k + emaPrev * (1 - k);
      out[i] = cur;
      emaPrev = cur;
    }
  }
  return out;
}

function sma(values, period) {
  const out = Array(values.length).fill(null);
  if (!values.length || period < 1) return out;
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    sum += v;
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

function stddev(values, period) {
  const out = Array(values.length).fill(null);
  if (!values.length || period < 1) return out;
  const ma = sma(values, period);
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) continue;
    const start = i - period + 1;
    let s = 0;
    for (let j = start; j <= i; j++) s += Math.pow(values[j] - ma[i], 2);
    out[i] = Math.sqrt(s / period);
  }
  return out;
}

export function macd(values, fast=12, slow=26, signal=9) {
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const macdLine = values.map((_, i) => {
    const f = emaFast[i], s = emaSlow[i];
    return (f == null || s == null) ? null : f - s;
  });
  const signalLine = ema(macdLine.map(x => x ?? 0), signal).map((v,i)=> macdLine[i]==null?null:v);
  const hist = macdLine.map((v, i) => (v == null || signalLine[i] == null) ? null : v - signalLine[i]);
  return { macdLine, signalLine, hist };
}

export function rsi(values, period=14) {
  const out = Array(values.length).fill(null);
  if (values.length < period + 1) return out;
  let gain = 0, loss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i-1];
    if (diff >= 0) gain += diff; else loss -= diff;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  out[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i-1];
    const g = Math.max(diff, 0);
    const l = Math.max(-diff, 0);
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));
  }
  return out;
}

export function bollinger(values, period=20, mult=2) {
  const mid = sma(values, period);
  const sd = stddev(values, period);
  const upper = values.map((_, i) => (mid[i] == null || sd[i] == null) ? null : mid[i] + mult * sd[i]);
  const lower = values.map((_, i) => (mid[i] == null || sd[i] == null) ? null : mid[i] - mult * sd[i]);
  return { upper, mid, lower };
}

export function atrFromOHLC(ohlc, period=14) {
  // ohlc: [{high, low, close}, ...]
  const out = Array(ohlc.length).fill(null);
  if (!ohlc.length) return out;
  const tr = Array(ohlc.length).fill(null);
  for (let i = 0; i < ohlc.length; i++) {
    const { high, low } = ohlc[i];
    if (i === 0) tr[i] = high - low;
    else {
      const prevClose = ohlc[i-1].close;
      tr[i] = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
    }
  }
  // RMA (Wilder)
  let sum = 0;
  for (let i = 0; i < ohlc.length; i++) {
    const v = tr[i];
    if (v == null) continue;
    if (i < period) {
      sum += v;
      if (i === period - 1) out[i] = sum / period;
    } else if (out[i-1] != null) {
      out[i] = (out[i-1] * (period - 1) + v) / period;
    }
  }
  return out;
}

export function supertrend(ohlc, period=10, multiplier=3) {
  // Retourne un array de "supertrend" (ligne) basé sur ATR.
  const atr = atrFromOHLC(ohlc, period);
  const hl2 = ohlc.map(x => (x.high + x.low) / 2);
  const basicUpper = hl2.map((v, i) => v + (atr[i] ?? 0) * multiplier);
  const basicLower = hl2.map((v, i) => v - (atr[i] ?? 0) * multiplier);

  const finalUpper = Array(ohlc.length).fill(null);
  const finalLower = Array(ohlc.length).fill(null);
  const st = Array(ohlc.length).fill(null);

  for (let i = 0; i < ohlc.length; i++) {
    if (i === 0) {
      finalUpper[i] = basicUpper[i];
      finalLower[i] = basicLower[i];
      st[i] = null;
      continue;
    }
    finalUpper[i] = (basicUpper[i] < (finalUpper[i-1] ?? Infinity)) ? basicUpper[i] : finalUpper[i-1];
    finalLower[i] = (basicLower[i] > (finalLower[i-1] ?? -Infinity)) ? basicLower[i] : finalLower[i-1];

    const prevSt = st[i-1];
    const close = ohlc[i].close;
    if (prevSt == null) {
      // initialise au bon côté
      st[i] = close > finalUpper[i] ? finalLower[i] : finalUpper[i];
    } else {
      if (prevSt === finalUpper[i-1]) {
        st[i] = (close > finalUpper[i]) ? finalLower[i] : finalUpper[i];
      } else {
        st[i] = (close < finalLower[i]) ? finalUpper[i] : finalLower[i];
      }
    }
  }
  return { supertrend: st, atr };
}

export function obv(closes, volumes) {
  const out = Array(closes.length).fill(null);
  let cur = 0;
  out[0] = 0;
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i-1]) cur += volumes[i] ?? 0;
    else if (closes[i] < closes[i-1]) cur -= volumes[i] ?? 0;
    out[i] = cur;
  }
  return out;
}

export function buildIndicatorsSeries({ closes, highs, lows, volumes }) {
  const ema12  = ema(closes, 12);
  const ema26  = ema(closes, 26);
  const ema50  = ema(closes, 50);
  const ema200 = ema(closes, 200);
  const mac    = macd(closes, 12, 26, 9);
  const r = rsi(closes, 14);
  const bb = bollinger(closes, 20, 2);
  const ohlc = closes.map((c, i) => ({ close: c, high: highs[i] ?? c, low: lows[i] ?? c }));
  const st = supertrend(ohlc, 10, 3);
  const vObv = volumes?.length ? obv(closes, volumes) : Array(closes.length).fill(null);

  return {
    ema12, ema26, ema50, ema200,
    macdLine: mac.macdLine, macdSignal: mac.signalLine, macdHist: mac.hist,
    rsi: r,
    bbUpper: bb.upper, bbMid: bb.mid, bbLower: bb.lower,
    atr: st.atr,
    supertrend: st.supertrend,
    obv: vObv
  };
}
