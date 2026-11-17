/* ---------- Fehlerquellen, Tageszeit, Wortschatz ---------- */
const ERR_TYPES = { free:'Freies Übersetzen', gap:'Lücke füllen', tiles:'Wortkästchen', hear:'Hören', spot:'Fehler finden', genus:'Genus', time:'Uhrzeiten & Zahlen', trans:'Umbauen' };
const ERR_KINDS = { order:['Wortstellung', 'Richtige Wörter, falsche Reihenfolge'], word:['Form oder Funktionswort', 'Endung, Zeitform, Präposition, Artikel oder Pronomen'], vocab:['Wortschatz', 'Ein anderes Wort, Form und Stellung passen'], missing:['Fehlendes Wort', 'Ein Wort fehlt, der Rest stimmt'], spell:['Tippfehler', 'Kein echtes Wort, knapp daneben'] };
// Grammatik oder Wortschatz? Funktionswörter (Präpositionen, Partikeln, Artikel, Pronomen, Konjunktionen, Hilfs- und Modalverben,
// Negation) und andere Formen desselben Wortes sind Grammatik: „tycker på“ statt „om“, „para“ statt „por“, „hennes“ statt „sin“,
// „stor“ statt „stort“, „vienes“ statt „vengas“. Ein anderes Inhaltswort bei sonst richtiger Form ist Wortschatz: „sköna“ statt „fina“.
const FUNC_WORDS = {
  sv:'i på om till med av för från ur ut in upp ner bort fram hem ihåg efter före under över mellan utan hos vid sedan sen att som när eftersom fast trots men och eller så en ett den det de dem denna detta dessa sin sitt sina hans hennes dess deras min mitt mina din ditt dina vår vårt våra ert era jag du han hon vi ni mig dig sig oss er man inte aldrig alltid ofta redan bara också har hade ha haft är var vara varit blir blev bli ska skulle kommer kan kunde vill ville måste får fick behöver',
  es:'a en de del al con por para sin sobre entre desde hasta hacia según el la los las un una unos unas lo le les se me te nos os mi mis tu tus su sus que si cuando porque aunque pero y o ni no ya muy más es son soy eres somos está están estoy estás estamos era eran fue fueron estaba estaban ha he has hemos han había'
};
const FUNC = {};
const isFunc = (lang, w) => (FUNC[lang] = FUNC[lang] || new Set(FUNC_WORDS[lang].split(' ').map(deacc))).has(deacc(w));
const lemmaOf = (lang, w) => { const g = lookupWord(lang, w); return g ? deacc((g.l || w).toLowerCase()) : null; };
function sameWord(lang, a, b){
  const la = lemmaOf(lang, a), lb = lemmaOf(lang, b);
  if (la && lb) return la === lb;
  // Unbekannt im Wörterbuch: gleicher Wortstamm (mindestens vier gleiche Anfangsbuchstaben) gilt als andere Form desselben Wortes
  const x = deacc(a), y = deacc(b); let k = 0; while (k < x.length && x[k] === y[k]) k++;
  return k >= 4 || (k >= 3 && Math.min(x.length, y.length) <= 4);
}
function lev(a, b){
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length:n + 1 }, (_, j) => j);
  // Mit Vertauschung benachbarter Buchstaben als einem Schritt (lehce → leche)
  let pp = null;
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (pp && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], pp[j - 2] + 1);
    }
    pp = prev; prev = cur;
  }
  return prev[n];
}
// Welche Art Fehler? Vergleich mit der ähnlichsten erlaubten Lösung
function errKind(input, answers, lang, tested){ const m = mistake(input, answers, lang, tested); return m && m.kind; }
function mistake(input, answers, lang, tested){
  const words = x => norm(x, lang).split(' ').filter(Boolean).map(deacc);
  const A = words(input); if (!A.length) return null;
  let best = null, score = -1;
  answers.forEach(x => { const B = words(x); const c = B.filter(w => A.includes(w)).length - Math.abs(B.length - A.length) * 0.1; if (c > score) { score = c; best = B; } });
  if (!best || !best.length) return null;
  const key = x => x.slice().sort().join(' ');
  if (A.join(' ') === best.join(' ')) return null;
  if (A.length > 1 && key(A) === key(best)) return { kind:'order' };
  const missing = best.filter(w => !A.includes(w)), extra = A.filter(w => !best.includes(w));
  if (!extra.length && missing.length) return { kind:'missing' };
  // Knapp daneben zählt nur als Schreibfehler, wenn das Getippte kein echtes Wort ist.
  // „stor“ statt „stort“ oder „gusta“ statt „gustan“ sind echte Wörter in falscher Form: ein Grammatikfehler.
  const raw = norm(input, lang).split(' ').filter(Boolean);
  const isWord = w => { const orig = raw.find(r => deacc(r) === w) || w; return !!lookupWord(lang, orig); };
  if (extra.length && extra.length === missing.length && extra.every(w => !isWord(w) && missing.some(m => lev(w, m) <= Math.max(1, Math.floor(m.length / 4))))) return { kind:'spell' };
  // Paare bilden: jedes fehlende Wort mit dem ähnlichsten zusätzlichen, sonst nach Position
  const rawB = (() => { for (const x of answers) { const b = norm(x, lang).split(' ').filter(Boolean); if (b.map(deacc).join(' ') === best.join(' ')) return b; } return best; })();
  const orig = (list, w) => list.find(r => deacc(r) === w) || w;
  const test = new Set((tested || []).flatMap(t => norm(t, lang).split(' ').map(deacc)));
  const free = extra.slice(), pairs = [];
  missing.forEach(m => { if (!free.length) return; let bi = 0; free.forEach((x, i) => { if (lev(x, m) < lev(free[bi], m)) bi = i; }); pairs.push([orig(raw, free[bi]), orig(rawB, m)]); free.splice(bi, 1); });
  const gram = extra.length !== missing.length
    ? missing.concat(extra).some(w => isFunc(lang, w) || test.has(w)) || pairs.some(([x, m]) => sameWord(lang, x, m))
    : pairs.some(([x, m]) => test.has(deacc(m)) || isFunc(lang, m) || isFunc(lang, x) || sameWord(lang, x, m));
  return { kind:gram ? 'word' : 'vocab', pairs };
}
function errType(ex){
  if (ex.type === 'free') return 'free';
  if (ex.type === 'cloze') return 'gap';
  if (ex.type === 'tiles') return 'tiles';
  if (ex.type === 'dict') return 'hear';
  if (ex.type !== 'gen') return null;
  const k = ex.data.kind;
  if (k === 'spot' || k === 'genus' || k === 'trans') return k;
  if (k === 'time') return ex.data.mode === 'hear' ? 'hear' : 'time';
  return ex.data.gap ? 'gap' : 'free';
}
// Pro Tag und Sprache: Thema (p:), Übungsart (t:) jeweils [Aufgaben, Fehler], Fehlerart (e:) als Anzahl; dazu die Stunde (h)
function recordAnswer(lang, ex, c, good){
  DB.tlog = DB.tlog || {};
  const t = today(), day = DB.tlog[t] = DB.tlog[t] || {}, L = day[lang] = day[lang] || {};
  const add = (k, ok) => { const v = L[k] = L[k] || [0, 0]; v[0]++; if (!ok) v[1]++; };
  const type = errType(ex);
  const typed = ['free', 'gap', 'hear', 'trans'].includes(type) || (type === 'time' && ex.data.mode === 'write');
  const k = !good && typed && c.input && !c.gaveUp ? (c.kind || errKind(c.input, answersFor(ex), lang, testedPart(ex))) : null;
  if (k) L['e:' + k] = (L['e:' + k] || 0) + 1;
  // Ein Wortschatz- oder Tippfehler belastet nicht das Grammatikthema des Satzes
  const trap = ex.type === 'gen' ? (ex.data.trap || (GENS[ex.gen] && GENS[ex.gen].trap)) : (itemById(ex.id) || {}).trap;
  if (trap) add('p:' + trap, good || k === 'vocab' || k === 'spell');
  if (type) add('t:' + type, good);
  const h = new Date().getHours(); day.h = day.h || {}; day.h[h] = (day.h[h] || 0) + 1;
}
// Tagesstände älter als 120 Tage: nur Sonntage und Monatsenden behalten. Reicht für Verlauf und Etappen und hält den Speicher klein.
function compactSnaps(){
  if (!DB.snap) return;
  const t = today();
  Object.keys(DB.snap).forEach(d => {
    if (dayDiff(t, d) <= 120) return;
    const dt = dateOf(d), monthEnd = addDays(d, 1).slice(5, 7) !== d.slice(5, 7);
    if (dt.getDay() !== 0 && !monthEnd) delete DB.snap[d];
  });
}
function pruneTlog(){
  if (!DB.tlog) return;
  const t = today();
  Object.keys(DB.tlog).forEach(d => { if (dayDiff(t, d) > 120) delete DB.tlog[d]; });
}
function errStats(lang, days){
  const t = today(), out = { p:{}, t:{}, e:{}, n:0, bad:0 };
  Object.keys(DB.tlog || {}).forEach(d => {
    if (dayDiff(t, d) >= days) return;
    const L = DB.tlog[d][lang]; if (!L) return;
    Object.keys(L).forEach(k => {
      const [g, id] = [k.slice(0, 1), k.slice(2)];
      if (g === 'e') out.e[id] = (out.e[id] || 0) + L[k];
      else { const v = out[g][id] = out[g][id] || [0, 0]; v[0] += L[k][0]; v[1] += L[k][1]; if (g === 't') { out.n += L[k][0]; out.bad += L[k][1]; } }
    });
  });
  return out;
}
const trapLabel = (lang, id) => { const tr = trapMeta(lang, id); if (tr) return tr.label; return { genus:lang === 'sv' ? 'en oder ett' : 'el oder la', zeit:'Uhrzeiten', zahl:'Zahlen', eigene:'Eigene Sätze' }[id] || id; };
function errorSourcesHtml(lang){
  const s = errStats(lang, 30), tab = S.errTab || 'p';
  const head = `<h2 class="grp">Fehlerquellen, letzte 30 Tage</h2>`;
  if (s.bad < 8) return `${head}<div class="chart"><p class="legend" style="margin:0">${s.n ? `${plural(s.bad, 'Fehler', 'Fehler')} bei ${s.n} Aufgaben. ` : ''}Die Auswertung erscheint ab 8 Fehlern in 30 Tagen.</p></div>`;
  const seg = `<div class="minseg errseg" role="radiogroup">${[['p', 'Thema'], ['t', 'Übungsart'], ['e', 'Fehlerart']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${tab === k}" data-a="errtab" data-t="${k}">${l}</button>`).join('')}</div>`;
  let rows = '', note = '';
  if (tab === 'p') {
    const list = Object.keys(s.p).map(id => ({ id, n:s.p[id][0], bad:s.p[id][1] })).filter(x => x.bad).sort((a, b) => b.bad - a.bad).slice(0, 6);
    const max = Math.max(1, ...list.map(x => x.bad));
    rows = list.map(x => { const tap = !!trapMeta(lang, x.id); return `<${tap ? `button type="button" data-a="topic" data-t="${x.id}"` : 'div'} class="erow"><span class="el">${esc(trapLabel(lang, x.id))}</span><span class="ebar"><span style="width:${Math.max(4, x.bad / max * 100)}%"></span></span><span class="ev">${x.bad}/${x.n}</span></${tap ? 'button' : 'div'}>`; }).join('');
    note = 'Fehler von Aufgaben im Thema. Antippen für die Regel.';
  } else if (tab === 't') {
    const list = Object.keys(s.t).map(id => ({ id, n:s.t[id][0], bad:s.t[id][1] })).filter(x => x.n >= 5).sort((a, b) => b.bad / b.n - a.bad / a.n);
    rows = list.map(x => `<div class="erow"><span class="el">${esc(ERR_TYPES[x.id] || x.id)}</span><span class="ebar"><span style="width:${Math.max(4, x.bad / x.n * 100)}%"></span></span><span class="ev">${Math.round(x.bad / x.n * 100)} %</span></div>`).join('');
    note = 'Anteil falscher Antworten je Übungsart, ab 5 Aufgaben. Freies Schreiben ist schwerer als Antippen, das ist normal.';
  } else {
    const tot = Object.values(s.e).reduce((a, x) => a + x, 0);
    if (tot < 5) rows = '', note = 'Zählt nur getippte Antworten. Noch zu wenige für eine Aufteilung.';
    else {
      rows = Object.keys(ERR_KINDS).filter(k => s.e[k]).sort((a, b) => s.e[b] - s.e[a]).map(k => `<div class="erow"><span class="el">${ERR_KINDS[k][0]}<span class="esub">${ERR_KINDS[k][1]}</span></span><span class="ebar"><span style="width:${Math.max(4, s.e[k] / tot * 100)}%"></span></span><span class="ev">${Math.round(s.e[k] / tot * 100)} %</span></div>`).join('');
      const top = Object.keys(s.e).sort((a, b) => s.e[b] - s.e[a])[0];
      note = top === 'order' && lang === 'sv' ? 'Bei der Wortstellung helfen die Themen <button type="button" class="link inl" data-a="topic" data-t="inversion">Inversion</button> und <button type="button" class="link inl" data-a="topic" data-t="bisats">Nebensatz</button>.'
        : top === 'spell' ? 'Meist Tippfehler. Das Wissen sitzt, es hapert an der Schreibung.' : 'Zählt nur getippte Antworten.';
    }
  }
  return `${head}<div class="chart">${seg}<div class="erows">${rows}</div><p class="legend">${note}</p></div>`;
}
// Wann wird geübt? Aufgaben pro Stunde, letzte 60 Tage
function hoursHtml(){
  const t = today(), h = new Array(24).fill(0); let days = 0;
  Object.keys(DB.tlog || {}).forEach(d => { if (dayDiff(t, d) >= 60 || !DB.tlog[d].h) return; days++; Object.keys(DB.tlog[d].h).forEach(k => { h[k] += DB.tlog[d].h[k]; }); });
  if (days < 5) return '';
  const max = Math.max(1, ...h), W = 24 * 13, H = 54;
  let best = 0, bestSum = -1; for (let i = 0; i < 24; i++) { const sum = h[i] + h[(i + 1) % 24]; if (sum > bestSum) { bestSum = sum; best = i; } }
  const bars = h.map((v, i) => `<rect x="${i * 13 + 1}" y="${H - 14 - Math.max(v ? 2 : 0, v / max * (H - 18))}" width="11" height="${Math.max(v ? 2 : 0, v / max * (H - 18))}" rx="2" class="${i === best || i === (best + 1) % 24 ? 'hb hi' : 'hb'}"/>`).join('');
  const ticks = [0, 6, 12, 18].map(i => `<text x="${i * 13 + 1}" y="${H - 2}">${i}</text>`).join('') + `<text x="${W - 12}" y="${H - 2}">24</text>`;
  return `<h2 class="grp">Wann du übst</h2><div class="chart"><svg class="hours" viewBox="0 0 ${W} ${H}" role="img" aria-label="Aufgaben nach Uhrzeit"><line x1="0" x2="${W}" y1="${H - 13}" y2="${H - 13}" class="axis"/>${bars}${ticks}</svg><p class="legend">Am häufigsten zwischen ${best} und ${(best + 2) % 24} Uhr, letzte 60 Tage.</p></div>`;
}
// Verschiedene Wörter (Grundformen) in deinen Sätzen
function vocabCount(lang){
  const all = new Set(), firm = new Set();
  BANK[lang].forEach(i => {
    const st = stOf(i.id); if (!st) return;
    tokens(i.target).forEach(w => {
      const k = w.toLowerCase(); if (!/[a-zåäöéáíóúñü]/i.test(k)) return;
      const e = lookupWord(lang, k), base = (e && e.l) || k;
      all.add(base); if ((st.ivl || 0) >= MATURE) firm.add(base);
    });
  });
  return { all:all.size, firm:firm.size };
}
