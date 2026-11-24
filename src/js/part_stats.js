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
  // Nur eins bekannt: Beginnt das unbekannte Wort mit der Grundform des bekannten, ist es eine Form davon („bilar“ zu „bilen“, Grundform bil)
  const l = la || lb;
  if (l && l.length >= 3 && deacc(la ? b : a).startsWith(l)) return true;
  // Unbekannt im Wörterbuch: gleicher Wortstamm (mindestens vier gleiche Anfangsbuchstaben) gilt als andere Form desselben Wortes
  const x = deacc(a), y = deacc(b); let k = 0; while (k < x.length && x[k] === y[k]) k++;
  return k >= 4 || (k >= 3 && Math.min(x.length, y.length) <= 4);
}
// Grundform gegen gebeugte Form ist auch bei einem anderen Wort ein Formfehler, kein reiner Wortschatzfehler:
// „samla“ (Infinitiv) statt „plockar“ (Präsens), „comer“ statt „bebo“. Zählt nur, was so im Wörterbuch steht
// (nicht erschlossene Mehrzahl oder weibliche Formen). Schwedisch, Wort unbekannt: -a statt einer Präsensform auf -r.
function formDiff(lang, x, m){
  const kind = w => { const g = GLOSS[lang][String(w).toLowerCase()]; return !g || g.multi ? null : g.l ? 'form' : 'base'; };
  const kx = kind(x), km = kind(m);
  if (kx && km) return kx !== km;
  return lang === 'sv' && !lookupWord(lang, x) && km === 'form' && /r$/i.test(m) && /a$/i.test(x);
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
// Welche Art Fehler? Vergleich mit der ähnlichsten erlaubten Lösung.
// tested: der geprüfte Teil (Lücke, Schlüsselwörter). Ein anderes Wort dort gilt sonst immer als Grammatik.
// lexical (Wortschatz-Themen): Der geprüfte Teil fragt das Wort selbst ab. Dort ist nur dasselbe Wort in anderer Form Grammatik,
// jedes andere Wort Wortschatz, auch ein Funktionswort („blir“ statt „stannar“). topic: Der Wortschatzfehler liegt im geprüften Teil.
function mistake(input, answers, lang, tested, lexical){
  const words = x => norm(x, lang).split(' ').filter(Boolean).map(deacc);
  const A = words(input); if (!A.length) return null;
  let best = null, score = -1;
  answers.forEach(x => { const B = words(x); const c = B.filter(w => A.includes(w)).length - Math.abs(B.length - A.length) * 0.1; if (c > score) { score = c; best = B; } });
  if (!best || !best.length) return null;
  const key = x => x.slice().sort().join(' ');
  if (A.join(' ') === best.join(' ')) return null;
  if (A.length > 1 && key(A) === key(best)) return { kind:'order' };
  // Als Mehrfachmenge: „Este agua está …“ statt „Esta agua está …“ hat „esta“ (aus está) nur einmal, gesucht ist es zweimal
  const minus = (X, Y) => { const r = Y.slice(); return X.filter(w => { const i = r.indexOf(w); if (i < 0) return true; r.splice(i, 1); return false; }); };
  const missing = minus(best, A), extra = minus(A, best);
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
  const lex = w => lexical && test.has(deacc(w)), form = ([x, m]) => sameWord(lang, x, m) || formDiff(lang, x, m);
  const gram = extra.length !== missing.length
    ? missing.concat(extra).some(w => !lex(w) && (isFunc(lang, w) || (!lexical && test.has(w)))) || pairs.some(form)
    : pairs.some(p => (lex(p[1]) ? false : (!lexical && test.has(deacc(p[1]))) || isFunc(lang, p[1]) || isFunc(lang, p[0])) || form(p));
  if (gram) return { kind:'word', pairs };
  // Wortschatz nur, wenn sonst alles stimmt, auch die Stellung: „att vi samlar alltid“ ist ein Stellungsfehler
  const swap = new Map(pairs.map(([x, m]) => [deacc(x), deacc(m)])), sub = A.map(w => swap.get(w) || w);
  if (sub.length > 1 && sub.join(' ') !== best.join(' ') && key(sub) === key(best)) return { kind:'order', pairs };
  return { kind:'vocab', pairs, topic:pairs.some(([, m]) => lex(m)) };
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
// Thema einer Aufgabe. Wortschatz-Themen (Redewendungen, Falsche Freunde, Lesetext-Lücken) prüfen das Wort selbst, nicht seine Form.
const exTrap = ex => ex.type === 'gen' ? (ex.data.trap || (GENS[ex.gen] && GENS[ex.gen].trap)) : (itemById(ex.id) || {}).trap;
function vocabTrap(ex){
  const id = exTrap(ex), lang = ex.type === 'gen' ? GENS[ex.gen] && GENS[ex.gen].lang : String(ex.id || '').slice(0, 2);
  return !!(id && TRAPS[lang] && (trapMeta(lang, id) || {}).vocab);
}
// Fehlerart einer Antwort. In Wortschatz-Themen: „kjolen“ statt „skjortan“ ist Wortschatz, „skjorta“ statt „skjortan“ eine Form.
const mistakeFor = (ex, input, lang) => mistake(input, answersFor(ex), lang, testedPart(ex), vocabTrap(ex));
// Pro Tag und Sprache: Thema (p:), Übungsart (t:) jeweils [Aufgaben, Fehler], Fehlerart (e:) als Anzahl; dazu die Stunde (h)
function recordAnswer(lang, ex, c, good){
  DB.tlog = DB.tlog || {};
  const t = today(), day = DB.tlog[t] = DB.tlog[t] || {}, L = day[lang] = day[lang] || {};
  const add = (k, ok) => { const v = L[k] = L[k] || [0, 0]; v[0]++; if (!ok) v[1]++; };
  const type = errType(ex);
  const typed = ['free', 'gap', 'hear', 'trans'].includes(type) || (type === 'time' && ex.data.mode === 'write');
  let k = null, topicHit = false;
  if (!good && typed && c.input && !c.gaveUp) {
    if (c.kind) k = c.kind, topicHit = !!c.vocabTopic;
    else { const m = mistakeFor(ex, c.input, lang); k = m && m.kind; topicHit = !!(m && m.topic); }
  }
  if (k) L['e:' + k] = (L['e:' + k] || 0) + 1;
  // Ein Wortschatz- oder Tippfehler belastet nicht das Grammatikthema des Satzes, ebenso ein Fehler neben der richtig gesetzten Stellung.
  // In Wortschatz-Themen ist das andere Wort im geprüften Teil dagegen genau der Fehler.
  const trap = exTrap(ex), topicOk = good || (k === 'vocab' && !topicHit) || k === 'spell' || !!c.posOk;
  if (trap) { add('p:' + trap, topicOk); blockAdd(lang, trap, topicOk); }
  if (type) add('t:' + type, good);
  if (trap && c.wasSeen === false && (ex.type === 'cloze' || ex.type === 'tiles')) noteFirst(lang, ex.id, trap, topicOk);
  const h = new Date().getHours(); day.h = day.h || {}; day.h[h] = (day.h[h] || 0) + 1;
  return { topicOk, kind:k };
}
// Erster Kontakt mit einem neuen Satz: je Monat, Thema und Stufe [Aufgaben, Fehler], gewertet wie in den Fehlerquellen.
// Zeigt, ob die Grammatik bei Sätzen sitzt, die du noch nie gesehen hast; „gefestigt“ zählt dagegen das Gedächtnis für
// bekannte Sätze. Immer dieselbe Übungsform (Lücke oder Kacheln, je nach Satz), darum über Monate vergleichbar.
// Stufe 1 bis 3 = A2 bis B2, t = Tatoeba: getrennt, weil „Fortgeschritten“ in schwachen Themen leichtere Sätze einstreut
// und Tatoeba-Sätze ohne geprüfte Alternativen öfter streng gewertet werden. Wenige Zahlen je Monat, darum ohne Löschfrist.
function noteFirst(lang, id, trap, ok){
  const it = itemById(id); if (!it || it.own || !trapMeta(lang, trap)) return;
  const F = DB.first = DB.first && typeof DB.first === 'object' ? DB.first : {}, L = F[lang] = F[lang] || {};
  const M = L[today().slice(0, 7)] = L[today().slice(0, 7)] || {}, k = `${trap}:${it.tat ? 't' : it.lvl || 0}`;
  const v = M[k] = M[k] || [0, 0]; v[0]++; if (!ok) v[1]++;
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
// Schwäche je Thema aus errStats: eine Rechnung für alle Stellen, die Themen nach Fehlern ordnen oder wählen (Heute,
// Fehlerquellen nach Thema, Schwerpunkt der Woche, „Als Nächstes“). Erst ab 10 Aufgaben, wie Prozent bei erzeugten Bereichen.
// Reihenfolge nach geglätteter Quote: (Fehler + 10 × deine Quote über alle Themen) / (Aufgaben + 10). Wenige Aufgaben ziehen
// zur eigenen Quote hin, viele zählen fast voll. So steht 5 von 13 (38 %) vor 8 von 37 (22 %) und 7 von 73 (10 %); bis 24.70
// galt die Anzahl der Fehler, und ein oft geübtes, sicheres Thema stand vorn, nur weil es oft drankam.
const TOPIC_MIN = 10, TOPIC_PRIOR = 10;
function topicStats(s){
  const ids = Object.keys(s.p), N = ids.reduce((a, id) => a + s.p[id][0], 0), B = ids.reduce((a, id) => a + s.p[id][1], 0), mean = N ? B / N : 0;
  return ids.map(id => { const [n, bad] = s.p[id]; return { id, n, bad, rate:n ? bad / n : 0, score:(bad + TOPIC_PRIOR * mean) / (n + TOPIC_PRIOR) }; })
    .filter(x => x.n >= TOPIC_MIN).sort((a, b) => b.score - a.score || b.n - a.n);
}
// Themen-Etappen: Die Fehlerquote eines Themas ist deutlich und belastbar gesunken,
// gegenüber jeder früheren Zeit, nicht nur gegenüber dem Anfang. Gezählt wie in den Fehlerquellen (nur erste Versuche;
// Wortschatz- und Tippfehler belasten das Grammatikthema nicht).
// Je Thema liegen die Antworten in Blöcken zu 60 Aufgaben (DB.tblk, je Block die Zahl der Fehler). Ein voller Block ändert
// sich nie mehr; geprüft wird nur, wenn einer voll wird. So gibt es keine immer neuen Würfe mit verschobenen Fenstern.
// Verglichen werden gleich große Abschnitte aus 1, 2, 4, 8, 16 … Blöcken (60, 120, 240, 480, 960 … Aufgaben), gezählt ab der
// letzten Etappe des Themas: der gerade volle Abschnitt gegen frühere. Kurze Abschnitte erkennen schnelles Lernen und
// schauen bis zu drei Abschnitte zurück; ab 480 Aufgaben geht der Vergleich bis zur letzten Etappe zurück, so zählt auch
// ein langsamer Rückgang über Jahre, etwa von 10 % auf 5 %.
// „Fehler halbiert“: höchstens halb so viele Fehler wie im früheren Abschnitt, und der Unterschied ist kein Zufall
//   (Test zweier Anteile, z ≥ 3,5 bis 240 Aufgaben, z ≥ 3 ab 480, weil es dort weniger Vergleiche gibt).
// „Thema sitzt“ (einmal je Thema): irgendwann früher sicher über 15 % falsch (untere Wilson-Grenze, 95 %), jetzt sicher
//   darunter (obere Grenze, 99 %), in Abschnitten von 120 oder 240 Aufgaben; praktisch von über 20 % auf unter 8 %.
// Nach jeder Halbierung zählt der neue Stand als Bezug: Die nächste braucht eine weitere Halbierung.
// tools/themen-etappen.js simuliert die Regel (5 Jahre, 1,5 bis 6 Aufgaben je Thema und Tag): Bei gleichbleibender Quote
// von 5 bis 45 % kommt etwa eine falsche Halbierung je 60 Themenjahre und kein falsches „sitzt“; Tagesschwankungen wie
// mal 1 von 3, mal 2 von 3 falsch lösen nichts aus.
const TOPIC_BLOCK = 60, TOPIC_Z = 3.5, TOPIC_Z_FAR = 3, TOPIC_FAR = 8, TOPIC_BACK = 3;
function zDrop(b, bn, c, cn){ const p = (b + c) / (bn + cn), se = Math.sqrt(p * (1 - p) * (1 / bn + 1 / cn)); return se ? (b / bn - c / cn) / se : 0; }
// Wilson-Grenze für k von n: z > 0 obere, z < 0 untere
function wilson(k, n, z){ const p = k / n, d = 1 + z * z / n; return (p + z * z / (2 * n) + z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d; }
// Antwort in den Block des Themas schreiben
function blockAdd(lang, trap, ok){
  const T = DB.tblk = DB.tblk || {}, L = T[lang] = T[lang] || {}, x = L[trap] = L[trap] || { b:[], cn:0, cb:0 };
  x.cn++; if (!ok) x.cb++;
  if (x.cn >= TOPIC_BLOCK) { x.b.push(x.cb); x.cn = 0; x.cb = 0; }
}
// Stände ohne Blöcke (bis 24.63.0): aus dem Fehlerprotokoll aufbauen. Das kennt nur Tagessummen; die Fehler eines Tages
// werden gleichmäßig über seine Aufgaben verteilt, falls ein Block mitten im Tag voll wird.
function blocksFromTlog(tlog){
  const out = {};
  Object.keys(tlog || {}).sort().forEach(d => ['sv', 'es'].forEach(l => {
    const L = tlog[d] && tlog[d][l]; if (!L) return;
    Object.keys(L).forEach(key => {
      if (!key.startsWith('p:') || !Array.isArray(L[key])) return;
      const [n, bad] = L[key], O = out[l] = out[l] || {}, x = O[key.slice(2)] = O[key.slice(2)] || { b:[], cn:0, cb:0 };
      let placed = 0;
      for (let i = 0; i < n; i++) {
        const isBad = Math.round((i + 1) * bad / n) > placed; if (isBad) placed++;
        x.cn++; if (isBad) x.cb++;
        if (x.cn >= TOPIC_BLOCK) { x.b.push(x.cb); x.cn = 0; x.cb = 0; }
      }
    });
  }));
  return out;
}
// Urteil über die vollen Blöcke eines Themas ab Block „from“: null oder { s, b:[Aufgaben, Fehler], c:[…], i:Startblock }
function topicJudge(blocks, from, solidDone){
  const m = blocks.length - from, sum = (a, b) => { let x = 0; for (let i = a; i < b; i++) x += blocks[i]; return x; };
  let best = null, solid = null;
  for (let k = 1; 2 * k <= m; k *= 2) {
    if (m % k) continue; // nur Abschnitte, die mit dem letzten Block gerade voll wurden
    const N = k * TOPIC_BLOCK, cS = blocks.length - k, cb = sum(cS, blocks.length), far = k >= TOPIC_FAR;
    for (let j = 1; far || j <= TOPIC_BACK; j++) {
      const eS = cS - j * k; if (eS < from) break;
      const eb = sum(eS, eS + k), z = zDrop(eb, N, cb, N);
      if (2 * cb <= eb && z >= (far ? TOPIC_Z_FAR : TOPIC_Z) && (!best || z > best.z)) best = { z, s:1, b:[N, eb], c:[N, cb], i:cS };
    }
  }
  // „Sitzt“ unabhängig vom Bezug der Halbierungen: gegen jeden früheren Abschnitt seit dem ersten Block
  const n = blocks.length;
  if (!solidDone) for (const k of [2, 4]) {
    if (n % k || n < 2 * k) continue;
    const N = k * TOPIC_BLOCK, cS = n - k, cb = sum(cS, n);
    if (wilson(cb, N, 2.576) > 0.15) continue;
    for (let eS = cS - k; eS >= 0 && !solid; eS -= k) { const eb = sum(eS, eS + k); if (wilson(eb, N, -1.96) >= 0.15) solid = { s:2, b:[N, eb], c:[N, cb], i:cS }; }
    if (solid) break;
  }
  if (solid) return solid;
  if (best) delete best.z;
  return best;
}
// Am Rundenende: neue Etappen festhalten (DB.etap). Rückgabe: die neuen Einträge.
function checkTopics(lang){
  const out = [], have = DB.etap = Array.isArray(DB.etap) ? DB.etap : [], L = (DB.tblk || {})[lang] || {};
  Object.keys(L).forEach(trap => {
    if (trap === 'eigene') return;
    const mine = have.filter(e => e.l === lang && e.k === trap);
    const r = topicJudge(L[trap].b, mine.reduce((m, e) => Math.max(m, e.i || 0), 0), mine.some(e => e.s === 2));
    if (r) { const e = Object.assign({ d:today(), l:lang, k:trap }, r); have.push(e); out.push(e); }
  });
  return out;
}
const trapLabel = (lang, id) => { const tr = trapMeta(lang, id); if (tr) return tr.label; return { genus:lang === 'sv' ? 'en oder ett' : 'el oder la', zeit:'Uhrzeiten', zahl:'Zahlen', eigene:'Eigene Sätze' }[id] || id; };
// Hartnäckige Sätze: bei späteren Wiederholungen mindestens zweimal nicht gewusst (lapses; der erste Kontakt zählt nicht),
// noch nicht gefestigt und in den letzten 30 Tagen geübt. Wer einen Satz inzwischen kann, sieht ihn hier nicht mehr.
function hardSentences(lang){
  const t = today();
  return BANK[lang].filter(i => { const st = stOf(i.id); return st && (st.lapses || 0) >= 2 && (st.ivl || 0) < MATURE && st.last && dayDiff(t, st.last) < 30; })
    .sort((a, b) => { const x = stOf(a.id), y = stOf(b.id); return (y.lapses - x.lapses) || ((y.d || 5) - (x.d || 5)); }).slice(0, 6);
}
// Gemeinsames Thema der hartnäckigen Sätze: das Muster ist aufschlussreicher als der einzelne Satz
function hardPattern(lang, list){
  const n = {}; list.forEach(i => { if (i.trap && trapMeta(lang, i.trap)) n[i.trap] = (n[i.trap] || 0) + 1; });
  const top = Object.keys(n).sort((a, b) => n[b] - n[a])[0];
  return top && n[top] >= 2 ? { trap:top, n:n[top] } : null;
}
function errorSourcesHtml(lang){
  const s = errStats(lang, 30), hard = hardSentences(lang), few = s.bad < 8;
  const head = `<h2 class="grp">Fehlerquellen, letzte 30 Tage</h2>`;
  const gate = `${s.n ? `${plural(s.bad, 'Fehler', 'Fehler')} bei ${s.n} Aufgaben. ` : ''}Die Auswertung erscheint ab 8 Fehlern in 30 Tagen.`;
  if (few && !hard.length) return `${head}<div class="chart"><p class="legend m0">${gate}</p></div>`;
  const tab = S.errTab || (few ? 's' : 'p');
  const seg = `<div class="minseg errseg" role="radiogroup">${[['p', 'Thema'], ['t', 'Übungsart'], ['e', 'Fehlerart'], ['s', 'Sätze']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${tab === k}" data-a="errtab" data-t="${k}">${l}</button>`).join('')}</div>`;
  let rows = '', note = '', lead = '';
  if (tab === 's') {
    rows = hard.map(i => { const st = stOf(i.id), tap = !!(i.trap && trapMeta(lang, i.trap)); return `<${tap ? `button type="button" data-a="topic" data-t="${i.trap}"` : 'div'} class="erow srow"><span class="el"><span class="rt" lang="${lang}">${esc(i.target)}</span><span class="rd">${esc(i.de)}</span>${tap ? `<span class="stp">${esc(trapLabel(lang, i.trap))}</span>` : ''}</span><span class="ev">${st.lapses}×</span></${tap ? 'button' : 'div'}>`; }).join('');
    const pat = hardPattern(lang, hard);
    note = !hard.length ? 'Gerade kein Satz, den du bei Wiederholungen mehrmals nicht wusstest.'
      : `${pat ? `<b>${esc(trapLabel(lang, pat.trap))}</b> steckt in ${pat.n} von ${hard.length} Sätzen. ` : ''}Mindestens zweimal nicht gewusst, das Tagwerk bringt sie öfter. Tipp auf einen Satz für die Regel dazu.`;
  } else if (few) note = gate;
  else if (tab === 'p') {
    // Anteil falscher Antworten je Thema, wie bei „Übungsart“; Reihenfolge und Auswahl aus topicStats (geglättete Quote,
    // ab 10 Aufgaben). Unter dem Namen die Anzahl, damit 38 % bei 13 Aufgaben nicht genauer wirkt, als es ist.
    const list = topicStats(s).filter(x => x.bad).slice(0, 6);
    lead = list.length ? 'Anteil falscher Antworten je Thema, ab 10 Aufgaben:' : '';
    rows = list.map(x => { const tap = !!trapMeta(lang, x.id); return `<${tap ? `button type="button" data-a="topic" data-t="${x.id}"` : 'div'} class="erow"><span class="el">${esc(trapLabel(lang, x.id))}<span class="esub">${x.bad} von ${x.n} Aufgaben</span></span><span class="ebar" aria-hidden="true"><span style="width:${Math.max(4, x.rate * 100)}%"></span></span><span class="ev">${pct(x.rate)}</span></${tap ? 'button' : 'div'}>`; }).join('');
    note = list.length ? 'Wenige Aufgaben zählen für die Reihenfolge weniger. Tipp auf ein Thema für die Regel.'
      : 'Noch kein Thema mit 10 Aufgaben und einem Fehler.';
  } else if (tab === 't') {
    const list = Object.keys(s.t).map(id => ({ id, n:s.t[id][0], bad:s.t[id][1] })).filter(x => x.n >= 5).sort((a, b) => b.bad / b.n - a.bad / a.n);
    lead = 'Anteil falscher Antworten je Übungsart:';
    rows = list.map(x => `<div class="erow"><span class="el">${esc(ERR_TYPES[x.id] || x.id)}</span><span class="ebar"><span style="width:${Math.max(4, x.bad / x.n * 100)}%"></span></span><span class="ev">${pct(x.bad / x.n)}</span></div>`).join('');
    note = 'Ab 5 Aufgaben. Freies Schreiben ist schwerer als Antippen, das ist normal.';
  } else {
    // Aufteilung der Fehler, keine Fehlerquote: Anzahlen statt Prozent, damit „94 %“ nicht wie „94 % falsch“ aussieht
    const tot = Object.values(s.e).reduce((a, x) => a + x, 0);
    if (tot < 5) rows = '', note = 'Zählt nur getippte Antworten. Noch zu wenige für eine Aufteilung.';
    else {
      lead = `So verteilen sich deine ${tot} getippten Fehler:`;
      rows = Object.keys(ERR_KINDS).filter(k => s.e[k]).sort((a, b) => s.e[b] - s.e[a]).map(k => `<div class="erow"><span class="el">${ERR_KINDS[k][0]}<span class="esub">${ERR_KINDS[k][1]}</span></span><span class="ebar"><span style="width:${Math.max(4, s.e[k] / tot * 100)}%"></span></span><span class="ev">${s.e[k]}</span></div>`).join('');
      const top = Object.keys(s.e).sort((a, b) => s.e[b] - s.e[a])[0];
      note = top === 'order' && lang === 'sv' ? 'Bei der Wortstellung helfen die Themen <button type="button" class="link inl" data-a="topic" data-t="inversion">Inversion</button> und ' + nobr('<button type="button" class="link inl" data-a="topic" data-t="bisats">Nebensatz</button>.')
        : top === 'spell' ? 'Meist Tippfehler. Das Wissen sitzt, es hapert an der Schreibung.'
        : 'Wie oft du je Übung falsch liegst, zeigt ' + nobr('<button type="button" class="link inl" data-a="errtab" data-t="t">Übungsart</button>.');
    }
  }
  return `${head}<div class="chart">${seg}${lead ? `<p class="legend elead">${lead}</p>` : ''}<div class="erows">${rows}</div><p class="legend">${note}</p></div>`;
}
// Wann wird geübt? Aufgaben pro Stunde, letzte 60 Tage: die Verteilung über den Tag und die zwei häufigsten Stunden
function hoursHtml(){
  const t = today(), h = new Array(24).fill(0); let days = 0;
  Object.keys(DB.tlog || {}).forEach(d => { if (dayDiff(t, d) >= 60 || !DB.tlog[d].h) return; days++; Object.keys(DB.tlog[d].h).forEach(k => { h[k] += DB.tlog[d].h[k]; }); });
  if (days < 5) return '';
  const max = Math.max(1, ...h), W = 24 * 13, H = 54;
  // Bei Gleichstand das Fenster, das mit einer geübten Stunde beginnt: nur um 7 Uhr geübt heißt „zwischen 7 und 9 Uhr“, nicht „6 und 8“
  let best = 0, bestSum = -1; for (let i = 0; i < 24; i++) { const sum = h[i] + h[(i + 1) % 24]; if (sum > bestSum || (sum === bestSum && h[i] > h[best])) { bestSum = sum; best = i; } }
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
