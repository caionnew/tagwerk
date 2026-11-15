/* ---------- Prüfen ---------- */
function closest(input, answers, lang){
  const a = norm(input, lang).split(' ');
  let best = answers[0], score = -1;
  answers.forEach(ans => {
    const b = norm(ans, lang).split(' ');
    const sc = lcs(a, b) / Math.max(a.length, b.length);
    if (sc > score) { score = sc; best = ans; }
  });
  return best;
}
function lcs(a, b){
  const dp = Array.from({ length:a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  return dp[0][0];
}
// Gleichwertige Schreibweisen: Zahlen als Ziffern oder Wort, „arbeta“ und „jobba“, „mej“ und „mig“, „sen“ für „sedan“.
// Nicht bei Aufgaben, in denen genau das geübt wird (Uhrzeit ausschreiben, Lückenwort).
const NUM_EQUIV = {
  sv:{ noll:0, två:2, tre:3, fyra:4, fem:5, sex:6, sju:7, åtta:8, nio:9, tio:10, elva:11, tolv:12, tretton:13, fjorton:14, femton:15, sexton:16, sjutton:17, arton:18, nitton:19, tjugo:20 },
  es:{ cero:0, dos:2, tres:3, cuatro:4, cinco:5, seis:6, siete:7, ocho:8, nueve:9, diez:10, once:11, doce:12, trece:13, catorce:14, quince:15, dieciséis:16, diecisiete:17, dieciocho:18, diecinueve:19, veinte:20 }
};
function equiv(t, lang){
  let x = t.split(' ').map(w => (NUM_EQUIV[lang] && w in NUM_EQUIV[lang] ? String(NUM_EQUIV[lang][w]) : w)).join(' ');
  if (lang === 'sv') {
    x = x.replace(/\barbet(a|ar|ade|at)\b/g, 'jobb$1').replace(/\b(m|d|s)ej\b/g, '$1ig')
      .replace(/\bsen dess\b/g, 'sedan dess').replace(/\b(för \S+ \S+) sen\b/g, '$1 sedan').replace(/^sen /, 'sedan ');
  }
  return x;
}
// Tippfehler auf einer Tastatur: zwei Buchstaben vertauscht, ein Nachbarbuchstabe getroffen, ein Buchstabe doppelt oder zu wenig doppelt.
// Nur in einem Wort, nicht am Wortanfang oder in den letzten zwei Buchstaben (Endungen sind Grammatik), nicht im geprüften Wort.
const KB_ROWS = ['qwertyuiopå', 'asdfghjklöä', 'zxcvbnm'];
function kbNear(a, b){
  if (a === b) return true;
  if ('yz'.includes(a) && 'yz'.includes(b)) return true; // deutsche und schwedische Tastatur
  for (let r = 0; r < KB_ROWS.length; r++) {
    const i = KB_ROWS[r].indexOf(a); if (i < 0) continue;
    const near = [KB_ROWS[r][i - 1], KB_ROWS[r][i + 1], (KB_ROWS[r - 1] || '')[i], (KB_ROWS[r - 1] || '')[i + 1], (KB_ROWS[r + 1] || '')[i], (KB_ROWS[r + 1] || '')[i - 1]];
    return near.includes(b);
  }
  return false;
}
function typoKind(x, y){
  if (y.length < 5 || x[0] !== y[0] || x.slice(-2) !== y.slice(-2)) return null;
  if (x.length === y.length) {
    const d = [...x].map((ch, i) => (ch !== y[i] ? i : -1)).filter(i => i >= 0);
    if (d.length === 2 && d[1] === d[0] + 1 && x[d[0]] === y[d[1]] && x[d[1]] === y[d[0]]) return 'swap';
    if (d.length === 1 && kbNear(y[d[0]], x[d[0]])) return 'key';
    return null;
  }
  const [lo, hi] = x.length < y.length ? [x, y] : [y, x];
  if (hi.length !== lo.length + 1) return null;
  for (let i = 0; i < hi.length; i++) {
    if (hi.slice(0, i) + hi.slice(i + 1) === lo) return (hi[i] === hi[i - 1] || hi[i] === hi[i + 1]) ? 'double' : null;
  }
  return null;
}
function judgeX(input, answers, lang, opt){
  const o = Object.assign({ equiv:true, typo:true, protect:[] }, opt || {});
  const n = norm(input, lang);
  if (!n) return null;
  const E = t => (o.equiv ? equiv(t, lang) : t);
  const ne = E(n);
  if (answers.some(a => norm(a, lang) === n || E(norm(a, lang)) === ne)) return { res:'ok' };
  if (answers.some(a => deacc(E(norm(a, lang))) === deacc(ne))) return { res:'near', why:{ kind:'accent' } };
  if (o.typo) {
    const protect = new Set(o.protect.flatMap(p => deacc(norm(p, lang)).split(' ')));
    const A = deacc(ne).split(' ');
    for (const ans of answers) {
      const B = deacc(E(norm(ans, lang))).split(' ');
      if (A.length !== B.length) continue;
      const diff = A.map((w, i) => (w !== B[i] ? i : -1)).filter(i => i >= 0);
      if (diff.length !== 1 || protect.has(B[diff[0]])) continue;
      const k = typoKind(A[diff[0]], B[diff[0]]);
      if (k) {
        const typed = n.split(' ')[diff[0]] || A[diff[0]], want = (norm(ans, lang).split(' ')[diff[0]]) || B[diff[0]];
        return { res:'near', why:{ kind:'typo', typed, want } };
      }
    }
  }
  return { res:'bad' };
}
function diffHtml(target, typed, lang){
  const T = String(target).split(/\s+/).filter(Boolean);
  const tb = T.map(w => deacc(norm(w, lang))), te = T.map(w => norm(w, lang));
  const Y = norm(typed, lang).split(' ').filter(Boolean), yb = Y.map(deacc);
  const idx = tb.map((w, i) => (w ? i : -1)).filter(i => i >= 0);
  const m = idx.length, n = yb.length;
  const dp = Array.from({ length:m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = tb[idx[i]] === yb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const st = T.map((_, k) => (tb[k] ? 'miss' : 'ok'));
  let i = 0, j = 0, hit = 0;
  while (i < m && j < n) {
    if (tb[idx[i]] === yb[j]) { st[idx[i]] = te[idx[i]] === Y[j] ? 'ok' : 'near'; if (st[idx[i]] === 'ok') hit++; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  return { html:T.map((w, k) => `<span class="w-${st[k]}" data-a="lookup" data-w="${esc(w.replace(/^[¿¡"„“«(]+|[.!?,;:"„“”»)…]+$/g, ''))}">${esc(w)}</span>`).join(' '), score:m ? hit / m : 0 };
}
// Was bei dieser Aufgabe streng geprüft wird: das Lückenwort, die ausgeschriebene Uhrzeit, das Schlüsselwort der Grammatik
function judgeOpts(ex){
  if (ex.type === 'cloze') return { equiv:false, typo:false };
  if (ex.type === 'gen') {
    const d = ex.data;
    if (d.gap || d.kind === 'time') return { equiv:false, typo:false };
    return { protect:(d.key || []).concat(ex.gen === 'np' ? (d.answers[0] || '').split(' ') : []) };
  }
  const item = ex.id ? itemById(ex.id) : null;
  return { protect:item ? (item.gapAlts.length ? item.gapAlts : item.gap ? [item.gap] : []) : [] };
}
// Der geprüfte Teil einer Aufgabe: Lückenwort, Schlüsselwort der Grammatik oder die knifflige Stelle im Satz
function testedPart(ex){
  if (ex.type === 'gen') { const d = ex.data; return d.gap || d.kind === 'time' ? d.answers : (d.key || []); }
  const it = ex.id ? itemById(ex.id) : null;
  return it ? (it.gapAlts.length ? it.gapAlts : it.gap ? [it.gap] : []) : [];
}
function answersFor(ex){
  if (ex.type === 'gen') return ex.data.answers;
  const item = itemById(ex.id);
  const st = stOf(item.id);
  if (ex.type === 'cloze') return (item.gapAlts.length ? item.gapAlts : [item.gap]).concat((st && st.gapAlts) || []);
  return [item.target].concat(item.alts, (st && st.alts) || []);
}
function check(){
  const r = S.run, ex = r.queue[r.idx], c = r.cur;
  if (!c || c.state !== 'answer') return;
  if (ex.type === 'tiles') {
    const item = itemById(ex.id);
    const built = ex.picked.map(i => ex.pool.find(p => p.i === i).t.toLowerCase()).join(' ');
    const keys = [item.target].concat(item.alts).map(tileKey).concat((stOf(item.id) && stOf(item.id).tileAlts) || []);
    c.result = keys.includes(built) ? 'ok' : 'bad'; c.wasSeen = !!DB.st[item.id]; c.wasDue = !!(DB.st[item.id] && DB.st[item.id].due <= today());
    c.input = ex.picked.map(i => ex.pool.find(p => p.i === i).t).join(' ');
  } else if (ex.type === 'dict') {
    const box = $('#answer'); c.input = box ? box.value : c.input;
    const item = itemById(ex.id);
    const j = judgeX(c.input, [item.target].concat(item.alts || []), r.lang);
    if (!j) return;
    c.result = j.res; c.why = j.why; c.diff = diffHtml(item.target, c.input, r.lang);
  } else if (ex.type === 'gen' && ex.data.kind === 'time' && ex.data.mode !== 'write') {
    const box = $('#answer'); c.input = box ? box.value : c.input;
    if (!c.input.trim()) return;
    const d = ex.data;
    c.result = d.clock ? (timeMatches(c.input, d.h, d.m) ? 'ok' : 'bad') : (Number(c.input.replace(/\D/g, '')) === d.num ? 'ok' : 'bad');
  } else {
    const box = $('#answer'); c.input = box ? box.value : c.input;
    const j = judgeX(c.input, answersFor(ex), r.lang, judgeOpts(ex));
    if (!j) return;
    const res = j.res;
    c.result = res; c.why = j.why; c.wasSeen = !!(ex.id && DB.st[ex.id]); c.wasDue = !!(ex.id && DB.st[ex.id] && DB.st[ex.id].due <= today());
    if (res !== 'ok') {
      const best = closest(c.input, answersFor(ex), r.lang); c.best = best; c.diff = diffHtml(best, c.input, r.lang);
      if (ex.type !== 'cloze' && !(ex.type === 'gen' && ex.data.gap)) c.mine = mineHtml(c.input, best, r.lang);
      const toks = ' ' + norm(c.input, r.lang) + ' ';
      if (ex.type === 'gen' && ex.data.key) c.keyOk = ex.data.key.every(k => toks.includes(' ' + norm(k, r.lang) + ' ')) ? ex.data.keyLabel : '';
      if (ex.type === 'free') { const item = itemById(ex.id); const g = item.gapAlts.find(x => toks.includes(' ' + norm(x, r.lang) + ' ')); if (g) c.keyOk = `Der knifflige Teil stimmt: „${g}“`; }
    }
    if (res === 'bad' && ex.type !== 'cloze') {
      const m = mistake(c.input, answersFor(ex), r.lang, testedPart(ex));
      c.kind = m ? m.kind : null;
      if (c.kind === 'vocab') {
        c.vocab = m.pairs;
        // In Grammatik-Übungen zählt die Grammatik: ein anderes Inhaltswort bei richtiger Form und Stellung ist „fast richtig“
        if (ex.type === 'gen' && !ex.data.gap && ex.data.kind !== 'time') { c.result = 'near'; c.why = { kind:'vocab' }; }
      }
    }
  }
  finishAnswer(r, ex, c);
}
// Antwort per Antippen: Fehler finden (Wort) und Genus (Artikel)
function choose(value){
  const r = S.run, ex = r && r.queue[r.idx], c = r && r.cur;
  if (!c || c.state !== 'answer' || !ex || ex.type !== 'gen') return;
  const d = ex.data;
  if (d.kind === 'spot') { c.pick = Number(value); c.input = d.words[c.pick]; c.result = d.wrong.includes(c.pick) ? 'ok' : 'bad'; }
  else if (d.kind === 'genus') { c.input = value; c.result = value === d.answer ? 'ok' : 'bad'; }
  else return;
  finishAnswer(r, ex, c);
  if (d.kind === 'genus' && c.result === 'ok') { const idx = r.idx; setTimeout(() => { if (S.run === r && r.idx === idx && r.cur.state === 'done' && S.view === 'run') next(); }, 650); }
}
function finishAnswer(r, ex, c){
  c.state = 'done'; c.enter = true; buzz(c.result === 'bad' ? 'bad' : 'ok');
  // Serie in der Runde: zählt nur erste Versuche
  if (!ex.requeue) { r.combo = c.result === 'bad' ? 0 : (r.combo || 0) + 1; r.best = Math.max(r.best || 0, r.combo); c.combo = r.combo; }
  if (ex.id && ex.type !== 'dict' && !ex.requeue && !ex.practice && c.result) {
    const g = c.result === 'ok' ? 3 : c.result === 'near' ? 2 : 1;
    c.nextIvl = FSRS.review(DB.st[ex.id] || {}, g, today(), true).ivl;
  }
  if (ex.type === 'free') { DB.used = DB.used || {}; DB.used.mic = (DB.used.mic || 0) + 1; }
  render(); scrollFb(); autoSpeak(r, ex);
}
function autoSpeak(r, ex){
  if (!DB.settings.autoplay || ex.type === 'dict') return;
  if (ex.type === 'gen') { speak(ex.data.full || ex.data.answers[0], r.lang); return; }
  playItem(itemById(ex.id));
}
function giveUp(){
  const r = S.run, c = r.cur; if (!c || c.state !== 'answer') return;
  const box = $('#answer'); if (box) c.input = box.value;
  c.result = 'bad'; c.gaveUp = true; c.state = 'done';
  if (!r.queue[r.idx].requeue) r.combo = 0;
  render(); scrollFb();
}
function selfAccept(){
  const r = S.run, ex = r.queue[r.idx], c = r.cur;
  if (!c || c.result !== 'bad' || !c.input) return;
  if (ex.id) {
    const st = DB.st[ex.id] || (DB.st[ex.id] = { ok:0, bad:0, alts:[], due:today() });
    const add = (key, v) => { st[key] = st[key] || []; if (!st[key].includes(v)) st[key].push(v); };
    if (ex.type === 'free') add('alts', c.input.trim());
    if (ex.type === 'cloze') add('gapAlts', c.input.trim());
    if (ex.type === 'tiles') add('tileAlts', c.input.toLowerCase());
  }
  c.result = 'ok'; c.accepted = true; next();
}
function mineHtml(typed, target, lang){
  const Y = String(typed).split(/\s+/).filter(Boolean), yb = Y.map(w => deacc(norm(w, lang)));
  const tb = norm(target, lang).split(' ').filter(Boolean).map(deacc);
  const m = Y.length, n = tb.length;
  const dp = Array.from({ length:m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = yb[i] && yb[i] === tb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const keep = new Array(m).fill(false); let i = 0, j = 0;
  while (i < m && j < n) { if (yb[i] && yb[i] === tb[j]) { keep[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  if (keep.every((k, x) => k || !yb[x])) return '';
  return Y.map((w, x) => (keep[x] || !yb[x] ? esc(w) : `<span class="w-extra">${esc(w)}</span>`)).join(' ');
}
function next(){
  const r = S.run, ex = r.queue[r.idx], c = r.cur;
  if (c && c.state === 'done') {
    const good = c.result === 'ok' || c.result === 'near';
    // Das Rundenergebnis zählt nur den ersten Versuch. Der zweite kommt kurz nach der Lösung und sagt wenig.
    // Übungsrunden („Gleich nochmal“) zählen im Ergebnis, ändern aber weder Wiederholungsplan noch Statistik der Fehlerquellen.
    const counts = !ex.requeue, sched = counts && !ex.practice;
    if (counts) { if (good) r.ok++; else r.bad++; }
    const f = { n:1, a:1, ok:good ? 1 : 0, secs:Math.min(120, Math.max(0, Math.round((Date.now() - (r.shownAt || Date.now())) / 1000))) };
    r.secs = (r.secs || 0) + f.secs;
    if (ex.id && ex.type !== 'dict' && sched) {
      if (!c.wasSeen) f.fresh = 1;
      else if (c.wasDue) { f.rev = 1; f.revOk = good ? 1 : 0; }
    }
    logDay(r.lang, f);
    if (sched) recordAnswer(r.lang, ex, c, good);
    if (counts) {
      const item = ex.id ? itemById(ex.id) : null;
      (r.res = r.res || []).push({ good, near:c.result === 'near', fresh:!!f.fresh, id:ex.id || null, target:item ? item.target : (ex.data && (ex.data.full || ex.data.answers[0])) || '' });
    }
    if (ex.id && ex.type !== 'dict') {
      const prev = DB.st[ex.id] || { ok:0, bad:0, alts:[] };
      if (counts && !sched && !good) {
        const item = itemById(ex.id);
        r.queue.push({ type:item.kind === 'order' ? 'tiles' : 'cloze', id:ex.id, requeue:true });
        if (!(r.missed || []).some(x => x.id === ex.id)) (r.missed = r.missed || []).push({ id:ex.id, target:item.target, de:item.de });
      }
      if (sched) {
        const g = !good ? 1 : (c.result === 'near' ? 2 : 3);
        const wasMature = (prev.ivl || 0) >= MATURE;
        const st = Object.assign(prev, FSRS.review(prev, g, today()));
        st.reps = (st.reps || 0) + (good ? 1 : 0);
        if (!good && c.wasSeen) st.lapses = (st.lapses || 0) + 1;
        if (good) st.ok = (st.ok || 0) + 1; else st.bad = (st.bad || 0) + 1;
        if (!st.matured && st.ivl >= MATURE) { st.matured = true; logDay(r.lang, { mat:1 }); }
        if (c.wasDue && wasMature) logDay(r.lang, { revM:1, revMOk:good ? 1 : 0 });
        DB.st[ex.id] = st;
        if (r.res && r.res.length) r.res[r.res.length - 1].ivl = st.ivl;
        const item = itemById(ex.id);
        if (!good) r.queue.push({ type:item.kind === 'order' ? 'tiles' : 'cloze', id:ex.id, requeue:true });
        if (!good && !(r.missed || []).some(x => x.id === ex.id)) (r.missed = r.missed || []).push({ id:ex.id, target:item.target, de:item.de });
      }
    }
    if (ex.type === 'gen' && !good && counts) (r.missed = r.missed || []).push({ target:ex.data.full || ex.data.answers[0], de:ex.data.deLine || (ex.data.gap ? '' : ex.data.prompt), gen:ex.gen, data:ex.data });
    if (ex.type === 'gen' && sched) {
      const g = DB.gen[ex.gen] || (DB.gen[ex.gen] = { ok:0, bad:0 });
      if (good) g.ok++; else g.bad++;
      g.recent = (g.recent || []).concat(good ? 1 : 0).slice(-50);
      if (ex.data.kind === 'genus') {
        DB.genus = DB.genus || {}; const gl = DB.genus[r.lang] = DB.genus[r.lang] || {};
        const w = gl[ex.data.word] = gl[ex.data.word] || { ok:0, bad:0 };
        if (good) w.ok++; else w.bad++; w.last = good ? 1 : 0;
      }
    }
  }
  r.idx++;
  if (r.endless && r.idx >= r.queue.length) r.queue.push({ type:'gen', gen:r.gen });
  if (r.idx >= r.queue.length) { finishRun(); return; }
  prepCur(); persistRun(); render(); window.scrollTo(0, 0);
}
function finishRun(){
  const r = S.run;
  r.finished = true;
  if (r.kind === 'daily') { DB.done[today()] = true; S.dailyRun = null; DB.run = null; setTimeout(() => refill(r.lang), 500); }
  snapshot();
  save(); S.view = 'runDone'; render(); window.scrollTo(0, 0);
}

