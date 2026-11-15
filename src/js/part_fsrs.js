/* ---------- Wiederholung: FSRS-6 (wie Anki), tagesbasiert ---------- */
const FSRS = (() => {
  const W = [0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542];
  const DECAY = -W[20];
  const FACTOR = Math.pow(0.9, 1 / DECAY) - 1;
  const RETENTION = 0.9, MAX_IVL = 3650, S_MIN = 0.001;
  const clampD = d => Math.min(10, Math.max(1, d));
  const clampS = s => Math.max(S_MIN, s);
  const d0 = (g, clamp) => { const d = W[4] - Math.exp(W[5] * (g - 1)) + 1; return clamp ? clampD(d) : d; };
  const R = (elapsed, s) => Math.pow(1 + FACTOR * elapsed / s, DECAY);
  function nextD(d, g){
    const delta = -W[6] * (g - 3);
    const damped = d + (10 - d) * delta / 9;
    return clampD(W[7] * d0(4, false) + (1 - W[7]) * damped);
  }
  function shortTerm(s, g){
    let inc = Math.exp(W[17] * (g - 3 + W[18])) * Math.pow(s, -W[19]);
    if (g >= 2) inc = Math.max(inc, 1);
    return clampS(s * inc);
  }
  function recall(d, s, r, g){
    const hard = g === 2 ? W[15] : 1, easy = g === 4 ? W[16] : 1;
    return clampS(s * (1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp((1 - r) * W[10]) - 1) * hard * easy));
  }
  function forget(d, s, r){
    const longTerm = W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp((1 - r) * W[14]);
    const shortT = s / Math.exp(W[17] * W[18]);
    return clampS(Math.min(longTerm, shortT));
  }
  function interval(s){
    const ivl = Math.round((s / FACTOR) * (Math.pow(RETENTION, 1 / DECAY) - 1));
    return Math.min(MAX_IVL, Math.max(1, ivl));
  }
  function fuzz(ivl){
    if (ivl < 2.5) return ivl;
    let delta = 1;
    [[2.5, 7, 0.15], [7, 20, 0.1], [20, Infinity, 0.05]].forEach(([a, b, f]) => { delta += f * Math.max(Math.min(ivl, b) - a, 0); });
    const lo = Math.max(2, Math.round(ivl - delta)), hi = Math.min(Math.round(ivl + delta), MAX_IVL);
    return Math.min(hi, Math.max(lo, Math.floor(Math.random() * (hi - lo + 1)) + lo));
  }
  // g: 1 = nicht gewusst, 2 = knapp, 3 = gewusst
  function review(card, g, todayStr, noFuzz){
    const c = Object.assign({}, card);
    if (c.s == null || c.d == null) { c.s = clampS(W[g - 1]); c.d = d0(g, true); }
    else {
      const elapsed = Math.max(0, dayDiff(todayStr, c.last));
      if (elapsed < 1) c.s = shortTerm(c.s, g);
      else c.s = g === 1 ? forget(c.d, c.s, R(elapsed, c.s)) : recall(c.d, c.s, R(elapsed, c.s), g);
      c.d = nextD(c.d, g);
    }
    let ivl = interval(c.s);
    if (!noFuzz) ivl = fuzz(ivl);
    c.ivl = ivl; c.last = todayStr; c.due = addDays(todayStr, ivl);
    return c;
  }
  const retrievability = (card, todayStr) => (card && card.s && card.last ? R(Math.max(0, dayDiff(todayStr, card.last)), card.s) : 0);
  return { review, retrievability, interval };
})();
