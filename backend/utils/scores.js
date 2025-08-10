// Simplified scoring functions inspired by LTPI/MTPI/CMVI concepts.
// Input: prices = [{t: timestamp, p: price}, ...] sorted ascending by time
function sma(prices, period) {
  const res = [];
  for (let i = 0; i < prices.length; i++) {
    const start = Math.max(0, i - period + 1);
    const slice = prices.slice(start, i + 1).map(x => x.p);
    const sum = slice.reduce((a,b)=>a+b,0);
    res.push(sum / slice.length);
  }
  return res;
}

function stddev(values) {
  const mean = values.reduce((a,b)=>a+b,0) / values.length;
  const variance = values.reduce((a,b)=>a + Math.pow(b-mean,2), 0) / values.length;
  return Math.sqrt(variance);
}

function computeVolatility(prices) {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i].p / prices[i-1].p));
  }
  if (returns.length === 0) return 0;
  return stddev(returns) * Math.sqrt(252); // annualized approx
}

function computeScores(prices) {
  // Basic idea:
  // LTPI ~ longer SMA slope (trend long term)
  // MTPI ~ shorter SMA slope (trend medium term)
  // CMVI ~ normalized volatility score
  const shortPeriod = Math.max(3, Math.floor(prices.length * 0.05)); // ~5% window
  const midPeriod = Math.max(7, Math.floor(prices.length * 0.2)); // ~20% window
  const longPeriod = Math.max(21, Math.floor(prices.length * 0.5)); // ~50% window

  const smaShort = sma(prices, shortPeriod);
  const smaMid = sma(prices, midPeriod);
  const smaLong = sma(prices, longPeriod);

  const lastPrice = prices[prices.length - 1].p;
  const lastSShort = smaShort[smaShort.length -1];
  const lastSMid = smaMid[smaMid.length -1];
  const lastSLong = smaLong[smaLong.length -1];

  // simple slopes
  const slopeShort = (lastPrice - lastSShort) / lastSShort;
  const slopeMid = (lastPrice - lastSMid) / lastSMid;
  const slopeLong = (lastPrice - lastSLong) / lastSLong;

  // normalize to 0..100 scale for UX
  const normalize = (x) => Math.max(0, Math.min(100, Math.round((x + 0.5) * 100)));

  const LTPI = normalize(slopeLong); // long-term tendency
  const MTPI = normalize(slopeMid);  // medium-term tendency
  const CMVI = Math.max(0, Math.min(100, Math.round(computeVolatility(prices) * 100))); // volatility proxy

  return { LTPI, MTPI, CMVI, meta: { lastPrice, slopeShort, slopeMid, slopeLong } };
}

module.exports = { computeScores };
