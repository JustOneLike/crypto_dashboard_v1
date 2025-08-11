export const series = (n = 60, start = 20000, step = 40, amp = 900) =>
  Array.from({ length: n }, (_, i) => ({
    t: `J${i + 1}`,
    p: start + Math.sin(i / 3) * amp + i * step,
    rsi: 50 + Math.sin(i / 2) * 20,
  }));
