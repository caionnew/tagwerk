/* ---------- Prüfen ---------- */
function closest(input, answers, lang){
  const a = norm(input, lang).split(' ');
  let best = answers[0], score = -1;
  answers.forEach(ans => {
    const b = norm(ans, lang).split(' ');
    const sc = lcsPairs(a, b).length / Math.max(a.length, b.length);
    if (sc > score) { score = sc; best = ans; }
  });
  return best;
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
    x = x.replace(/\barbet(a|ar|ade|at)\b/g, 'jobb$1').replace(/\b(m|d|s)ej\b/g, '$1ig').replace(/\bmail(et|en|a|ar|ade|at)?\b/g, 'mejl$1')
      .replace(/\bsen dess\b/g, 'sedan dess').replace(/\b(för \S+ \S+) sen\b/g, '$1 sedan').replace(/^sen /, 'sedan ');
  }
  // „wohl“, „wahrscheinlich“: seguramente gilt wie probablemente
  if (lang === 'es') x = x.replace(/\bseguramente\b/g, 'probablemente');
  return x;
}
// Gleichwertige Wörter in der Lösung so, wie du sie geschrieben hast: Mit „arbeta“ steht „arbetar“ da, nicht „jobbar“. Die Korrektur
// zeigt dann nur, was wirklich falsch war (hier die Endung), und nicht ein Wort, das genauso richtig ist.
// [in der Lösung, in deiner Antwort, Ersatz]; die Endungen wie in equiv
const OWN_WORDS = { sv:[
  ['\\bjobb(?=(?:a|ar|ade|at)\\b)', '\\barbet(?:a|ar|ade|at)\\b', 'arbet'], ['\\barbet(?=(?:a|ar|ade|at)\\b)', '\\bjobb(?:a|ar|ade|at)\\b', 'jobb'],
  ['\\bmig\\b', '\\bmej\\b', 'mej'], ['\\bdig\\b', '\\bdej\\b', 'dej'], ['\\bsig\\b', '\\bsej\\b', 'sej'],
  ['\\bmejl(?=(?:et|en|a|ar|ade|at)?\\b)', '\\bmail', 'mail'],
  // „Kleider“ heißt auch Kleidung: Wer kläder schreibt, sieht die Lösung mit kläder (de billiga kläderna)
  ['\\bklänningar(?=(?:na)?\\b)', '\\bkläder', 'kläder']
], es:[
  ['\\bprobablemente\\b', '\\bseguramente\\b', 'seguramente']
] };
function ownWords(lang, input, text){
  let out = String(text);
  (OWN_WORDS[lang] || []).forEach(([want, typed, rep]) => {
    const has = new RegExp(typed, 'i');
    if (!has.test(input || '') || has.test(out)) return;
    out = out.replace(new RegExp(want, 'gi'), m => (m[0] !== m[0].toLowerCase() ? rep[0].toUpperCase() + rep.slice(1) : rep));
  });
  return out;
}
// Formfehler beim Namen nennen, mit der Bedeutung aus dem Wörterbuch: „arbeta“ ist die Grundform (arbeiten), hier braucht es
// „arbetar“ (arbeitet). Paare [getippt, gesucht]; nur zwei Formen desselben Wortes (bei verschiedenen Wörtern sagt „Grundform“
// nichts: „normalmente“ ist kein Verb), und nur, was im Wörterbuch steht; sonst ''.
function formWhy(lang, pairs){
  const g = w => { const x = GLOSS[lang][String(w).toLowerCase()]; return x && !x.multi && x.de ? x : null; };
  // „arbeitet (arbeiten)“ → „arbeitet“, „groß (bei ett-Wörtern)“ → „groß, bei ett-Wörtern“; nach einem Semikolon nur Zusätze
  const mean = (w, base) => { const de = g(w).de.split(';')[0].trim(), m = de.match(/^(.*?) \(([^()]*)\)$/); return !m ? de : base && m[2] === base ? m[1] : `${m[1]}, ${m[2]}`; };
  const parts = (pairs || []).filter(([x, m]) => x && m && deacc(x.toLowerCase()) !== deacc(m.toLowerCase()) && g(m) && sameWord(lang, x, m)).map(([x, m]) => {
    const gx = g(x), gm = g(m), lemma = gm.l && g(gm.l) ? g(gm.l).de : gx && !gx.l ? gx.de : '';
    const mx = gx ? mean(x) : '', mm = mean(m, lemma);
    // Gleiche Bedeutung (tenso, tensa: beide „angespannt“): die Bedeutung nur einmal, dazu was sich ändert, im Spanischen Geschlecht und Zahl
    const gn = mx === mm && lang === 'es' ? esGenderNum(x, m) : null;
    if (gx && !gx.l && gm.l) {
      if (gn) return `„${x}“ ist die ${gn[0]} (${mx}), hier braucht es die ${gn[1]}: „${m}“`;
      return mx === mm ? `„${x}“ ist die Grundform (${mx}), hier braucht es „${m}“` : `„${x}“ ist die Grundform (${mx}), hier braucht es „${m}“ (${mm})`;
    }
    return `„${m}“ (${gn ? gn[1] : mm}) statt „${x}“`;
  });
  return parts.slice(0, 2).join('; ');
}
// Spanisch: dasselbe Wort mit anderer Endung für Geschlecht und Zahl (tenso, tensa, tensos, tensas)
const ES_GN = { o:'männliche Form', a:'weibliche Form', os:'männliche Mehrzahl', as:'weibliche Mehrzahl' };
function esGenderNum(x, m){
  const a = deacc(String(x).toLowerCase()).match(/^(.+?)(os|as|o|a)$/), b = deacc(String(m).toLowerCase()).match(/^(.+?)(os|as|o|a)$/);
  return a && b && a[1] === b[1] && a[2] !== b[2] ? [ES_GN[a[2]], ES_GN[b[2]]] : null;
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
// Weitere richtige Fassungen, die für jeden übersetzten Satz gelten (nicht im Diktat und nicht bei Lücken):
// Schwedisch: „har“/„hade“ vor dem Supinum darf im Nebensatz fehlen (… att han aldrig fått mejlet).
const HA_SUPINE = new Set(('sett setts träffats träffat ringt ätit fått vetat varit haft gjort sagt kommit gått hört läst skrivit köpt glömt hittat tänkt bott jobbat arbetat pratat ' +
  'flyttat börjat slutat hunnit kunnat velat blivit tagit gett givit sovit druckit sprungit vunnit förlorat missat lärt förstått betalat bokat hänt sålt lovat svarat frågat väntat ' +
  'stannat rest åkt flugit simmat lagat städat tvättat öppnat stängt tappat lämnat skickat mejlat fyllt försökt bestämt hämtat ätits stulits byggts skrivits').split(' '));
const SV_SUB = /^(att|som|om|eftersom|när|innan|förrän|fast|medan|ifall|tills|sedan|varför|vad|vem|hur|vilken|vilket|vilka)$/;
function svHaDrop(ans){
  const w = ans.split(' '), out = [], bare = t => wordCore(t.toLowerCase());
  for (let i = 1; i < w.length - 1; i++) {
    const sup = bare(w[i + 1]);
    if (!/^(har|hade)$/i.test(w[i]) || !(HA_SUPINE.has(sup) || /\(Supinum/.test((lookupWord('sv', sup) || {}).de || ''))) continue;
    // Nebensatz: ein einleitendes Wort davor ohne Satzgrenze dazwischen. Fragewörter am Satzanfang leiten einen Hauptsatz ein (Vad har hänt?).
    for (let j = i - 1; j >= 0; j--) {
      const t = bare(w[j]);
      if (/^(och|men|eller)$/.test(t) || (j < i - 1 && new RegExp(`${rxSet(P_PAUSE)}$`).test(w[j]))) break;
      if (SV_SUB.test(t)) { if (!(j === 0 && /^(varför|vad|vem|hur|vilken|vilket|vilka|sedan)$/.test(t))) out.push(w.slice(0, i).concat(w.slice(i + 1)).join(' ')); break; }
    }
  }
  return out;
}
// Spanisch: ein betontes Subjektpronomen vor dem Verb ist auch richtig (Creo que él tiene razón), wenn der deutsche Satz dieselbe Person nennt.
// Am Satzanfang erledigt das schon norm().
const ES_SUBJ_DE = { yo:'ich', tú:'du', él:'er', ella:'sie', nosotros:'wir', nosotras:'wir', vosotros:'ihr', vosotras:'ihr', ellos:'sie', ellas:'sie' };
function esProDrop(n, de){
  const w = n.split(' ');
  return w.map((t, i) => (i > 0 && i < w.length - 1 && ES_SUBJ_DE[t] && new RegExp(`(^|[^a-zäöüß])${ES_SUBJ_DE[t]}([^a-zäöüß]|$)`, 'i').test(de) ? w.slice(0, i).concat(w.slice(i + 1)).join(' ') : null)).filter(Boolean);
}
// Spanisch: Reflexivpronomen vergessen (quedamos statt nos quedamos). Reflexiv ist das Verb, wenn das Wörterbuch die Form unter
// einer Grundform auf -se führt; bei nos, os und te muss zudem die Person passen (nos llamó = er rief uns an, nicht reflexiv).
// Bei diesen Verben heißt die Form ohne Pronomen etwas anderes: [mit Pronomen, ohne Pronomen]. Sonst die Bedeutung aus dem Wörterbuch.
const ES_REFL = { quedar:['bleiben', 'sich verabreden oder übrig sein'], acordar:['sich erinnern', 'vereinbaren'], parecer:['ähneln', 'scheinen'],
  llamar:['heißen', 'rufen, anrufen'], dormir:['einschlafen', 'schlafen'], despedir:['sich verabschieden', 'entlassen'], negar:['sich weigern', 'leugnen'],
  levantar:['aufstehen', 'hochheben'], acostar:['schlafen gehen', 'ins Bett bringen'], poner:['sich anziehen, werden', 'legen, stellen'],
  volver:['werden, sich umdrehen', 'zurückkommen'], encontrar:['sich befinden, sich fühlen', 'finden'], llevar:['mitnehmen, sich verstehen', 'tragen, bringen'],
  fijar:['bemerken, achten auf', 'befestigen, festlegen'], casar:['heiraten', 'trauen'], ir:['weggehen', 'gehen, fahren'], marchar:['weggehen', 'marschieren'],
  preguntar:['sich fragen', 'fragen'], conocer:['sich (gegenseitig) kennenlernen', 'jemanden kennen oder kennenlernen'] };
function esReflexWhy(input, solution){
  const s = norm(solution, 'es').split(' '), t = norm(input, 'es').split(' ');
  for (let i = 0; i < s.length - 1; i++) {
    const p = s[i], v = s[i + 1];
    if (!/^(me|te|se|nos|os)$/.test(p) || t.includes(p) || !t.includes(v)) continue;
    if ((p === 'nos' && !/mos$/.test(v)) || (p === 'os' && !/is$/.test(v)) || (p === 'te' && !/(s|ste)$/.test(v))) continue;
    const l = (lookupWord('es', v) || {}).l || '';
    if (!/[aeií]rse$/.test(l)) continue;
    const base = l.slice(0, -2), pair = ES_REFL[deacc(base)];
    const mean = pair ? pair[0] : ((lookupWord('es', l) || {}).de || '').split(/[;(]/)[0].trim();
    return `„${p}“ fehlt: ${l}${mean ? ` = ${mean}` : ''}; ${pair ? `${base} allein heißt meist ${pair[1]}` : 'hier gehört das Pronomen dazu'}.`;
  }
  return '';
}
// Spanisch, si-Satz: Subjuntivo und Konditional am falschen Platz (si no lloviera, diéramos un paseo; si tendría tiempo).
// Nur dasselbe Verb wie in der Lösung, in derselben Person, sonst keine Behauptung. Formen ohne Akzente je Person
// [yo, tú, él, nosotros, vosotros, ellos]. Konditional: Futurstamm + ía, erkannt an der Form selbst (quería ist Imperfecto, querría
// Konditional). Subjuntivo: 3. Person Plural Indefinido ohne -ron, dann -ra oder -se (dieron → diera, diese).
// hubiera, quisiera, pudiera, debiera gehen im Hauptsatz auch: dort kein Hinweis.
const ES_FUT_STEM = { tener:'tendr', poner:'pondr', venir:'vendr', salir:'saldr', valer:'valdr', hacer:'har', decir:'dir', saber:'sabr', caber:'cabr', querer:'querr', poder:'podr', haber:'habr' };
// Indefinido (3. Person Plural ohne -ron) für unregelmäßige Verben, die conjugate nicht kennt
const ES_PRET_BASE = { haber:'hubie', andar:'anduvie', caber:'cupie', sentir:'sintie', preferir:'prefirie', servir:'sirvie', seguir:'siguie', conseguir:'consiguie',
  morir:'murie', repetir:'repitie', mentir:'mintie', elegir:'eligie', sugerir:'sugirie', divertir:'divirtie', convertir:'convirtie', caer:'caye', creer:'creye',
  construir:'construye', conducir:'conduje', traducir:'traduje', producir:'produje' };
const ES_COND_END = ['ia', 'ias', 'ia', 'iamos', 'iais', 'ian'];
function esCondForms(inf){
  // Zusammensetzungen mit langem Stamm (mantener → mantendría), kurze Stämme nur allein (echar ist nicht ec + hacer)
  const k = Object.keys(ES_FUT_STEM).find(x => inf === x || (ES_FUT_STEM[x].length >= 5 && inf.endsWith(x)));
  const stem = deacc(k ? inf.slice(0, inf.length - k.length) + ES_FUT_STEM[k] : inf);
  return ES_COND_END.map(e => stem + e);
}
function esCondParse(w){
  const dw = deacc(w), m = dw.match(/^(.+?)(iamos|iais|ias|ian|ia)$/);
  if (!m) return null;
  const st = m[1], k = Object.keys(ES_FUT_STEM).find(x => st === ES_FUT_STEM[x] || (ES_FUT_STEM[x].length >= 5 && st.endsWith(ES_FUT_STEM[x])));
  const inf = k ? st.slice(0, st.length - ES_FUT_STEM[k].length) + k : /^[a-zñ]+(ar|er|ir)$/.test(st) ? st : '';
  const p = ES_COND_END.indexOf(m[2]);
  return inf && esCondForms(inf)[p] === dw ? { inf, p } : null;
}
function esPastSubjForms(inf){
  let b = ES_PRET_BASE[inf];
  if (!b) {
    const k = Object.keys(IRR_ES).find(x => x.length >= 5 && x !== inf && inf.endsWith(x));
    const p3 = k ? inf.slice(0, inf.length - k.length) + conjugate(k, 'indef', 4) : /^[a-zñ]+(ar|er|ir)$/.test(inf) ? conjugate(inf, 'indef', 4) : '';
    if (!p3 || !/ron$/.test(p3)) return [];
    b = p3.slice(0, -3);
  }
  b = deacc(b);
  return ['ra', 'ras', 'ra', 'ramos', 'rais', 'ran', 'se', 'ses', 'se', 'semos', 'seis', 'sen'].map(e => b + e);
}
function esCondWhy(input, solution){
  const s = norm(solution, 'es').split(' '), t = norm(input, 'es').split(' '), S = s.map(deacc), T = t.map(deacc);
  const si = S.indexOf('si');
  if (si < 0) return '';
  // Zählt, nicht nur „kommt vor“: In „Si fuera rico, fuera feliz“ steht fuera einmal zu viel; in „Si fuera rico, estaría feliz“ nicht
  const more = (x, A, B) => A.filter(y => y === x).length > B.filter(y => y === x).length;
  // In der Lösung Konditional, bei dir dasselbe Verb auf -ra oder -se
  for (const w of s) {
    const c = esCondParse(w);
    if (!c || !more(deacc(w), S, T) || ['haber', 'querer', 'poder', 'deber'].includes(c.inf)) continue;
    const f = esPastSubjForms(c.inf), k = T.findIndex(x => (x === f[c.p] || x === f[c.p + 6]) && more(x, T, S));
    if (k >= 0) return `„${t[k]}“ ist Subjuntivo, hier steht der Konditional: ${w}. Die Form auf -ra statt des Konditionals ist nur regional üblich (allgemein nur hubiera, quisiera, debiera).`;
  }
  // Bei dir Konditional, in der Lösung dasselbe Verb im Subjuntivo, beide im si-Satz selbst (höchstens zwei Wörter nach si: si no lloviera,
  // si me lo dijeras). Sonst wäre „habría cogido“ neben der Fassung „hubiera cogido“ ein Fehler.
  const tsi = T.indexOf('si');
  for (let k = tsi + 1; tsi >= 0 && k <= tsi + 3 && k < t.length; k++) {
    const u = t[k], c = esCondParse(u);
    if (!c || !more(deacc(u), T, S)) continue;
    const f = esPastSubjForms(c.inf), i = S.findIndex((x, j) => j > si && j - si <= 3 && (x === f[c.p] || x === f[c.p + 6]) && more(x, S, T));
    if (i >= 0) return `„${u}“ ist Konditional. Nach si steht der Subjuntivo: ${s.slice(si, i + 1).join(' ')}.`;
  }
  return '';
}
function judgeX(input, answers, lang, opt){
  const o = Object.assign({ equiv:true, typo:true, protect:[] }, opt || {});
  const n = norm(input, lang);
  if (!n) return null;
  const E = t => (o.equiv ? equiv(t, lang) : t);
  const ne = E(n);
  if (answers.some(a => norm(a, lang) === n || E(norm(a, lang)) === ne)) return { res:'ok' };
  if (o.de && o.equiv) {
    if (lang === 'sv' && answers.some(a => svHaDrop(a).some(v => E(norm(v, lang)) === ne))) return { res:'ok' };
    if (lang === 'es' && esProDrop(n, o.de).some(v => answers.some(a => E(norm(a, lang)) === E(v)))) return { res:'ok' };
  }
  if (answers.some(a => deacc(E(norm(a, lang))) === deacc(ne))) return { res:'near', why:{ kind:'accent' } };
  // „Tu eres …“: das Pronomen tú ohne Akzent. Fast richtig wie jeder fehlende Akzent (norm lässt „tu“ stehen, es ist sonst das Possessiv).
  if (lang === 'es' && /^tu /.test(n) && answers.some(a => E(norm(a, lang)) === E(norm(String(input).replace(/(^|[¿¡\s])tu(?=\s)/i, '$1tú'), lang)))) return { res:'near', why:{ kind:'accent' } };
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
  // Zusammengeschrieben wie „imorgon“ zählt wie „i morgon“ (norm macht beides gleich): getippte Form an die Lösung anpassen
  const Y = [];
  norm(typed, lang).split(' ').filter(Boolean).forEach(y => { const k = tb.findIndex((w, i) => w && tb[i + 1] && w + tb[i + 1] === deacc(y)); if (k >= 0) Y.push(te[k], te[k + 1]); else Y.push(y); });
  const yb = Y.map(deacc);
  const idx = tb.map((w, i) => (w ? i : -1)).filter(i => i >= 0);
  const m = idx.length, st = T.map((_, k) => (tb[k] ? 'miss' : 'ok'));
  let hit = 0;
  lcsPairs(idx.map(i => tb[i]), yb).forEach(([i, j]) => { st[idx[i]] = te[idx[i]] === Y[j] ? 'ok' : 'near'; if (st[idx[i]] === 'ok') hit++; });
  return { html:T.map((w, k) => `<span class="w-${st[k]}" data-a="lookup" data-w="${esc(wordCore(w))}">${esc(w)}</span>`).join(' '), score:m ? hit / m : 0 };
}
// Kommt die Wortfolge pat (mit * als beliebigem Wort) zusammenhängend in den Wörtern t vor?
function seqIn(t, pat){
  for (let i = 0; i + pat.length <= t.length; i++) if (pat.every((p, k) => p === '*' || deacc(t[i + k]) === deacc(p))) return true;
  return false;
}
// Was bei dieser Aufgabe streng geprüft wird: das Lückenwort, die ausgeschriebene Uhrzeit, das Schlüsselwort der Grammatik
function judgeOpts(ex){
  if (ex.type === 'cloze') return { equiv:false, typo:false };
  if (ex.type === 'gen') {
    const d = ex.data;
    if (d.gap || d.kind === 'time') return { equiv:false, typo:false };
    return { protect:(d.key || []).concat(ex.gen === 'np' ? (d.answers[0] || '').split(' ') : []), de:d.deLine || (d.kind ? '' : d.prompt) || '' };
  }
  const item = ex.id ? itemById(ex.id) : null;
  return { protect:item ? (item.gapAlts.length ? item.gapAlts : item.gap ? [item.gap] : []) : [], de:item ? item.de : '' };
}
// Der geprüfte Teil einer Aufgabe: Lückenwort, Schlüsselwort der Grammatik oder die knifflige Stelle im Satz
function testedPart(ex){
  if (ex.type === 'gen') { const d = ex.data; return d.gap || d.kind === 'time' ? d.answers : (d.key || []); }
  const it = ex.id ? itemById(ex.id) : null;
  return it ? (it.gapAlts.length ? it.gapAlts : it.gap ? [it.gap] : []) : [];
}
// Norm einer Aufgabe bei Sätzen mit markierten Formen (Perfecto/Indefinido): 'es' = wie in Spanien, 'la' = wie in Lateinamerika.
// Je Aufgabe ausgelost, sobald sie dran ist (prepCur), und mit der Aufgabe gespeichert; die Wiederholung übernimmt sie.
// Nur Übersetzen und Lücke: Diktat und Nachsprechen prüfen den gehörten Satz.
// Sätze, in denen Lateinamerika beides zulässt (Erfahrung, Andauerndes: nur LA-Formen markiert), fragen immer „wie in Spanien“:
// Dort änderte „wie in Lateinamerika“ nichts, und ein Hinweis, der oft folgenlos bleibt, wird überlesen (Bewertung vom 27.11.).
function exNorm(ex){
  if (!ex || !ex.id || !['free', 'cloze'].includes(ex.type)) return '';
  const item = itemById(ex.id);
  if (!item || !item.norms) return '';
  if (!Object.values(item.norms).includes('es')) ex.norm = 'es';
  else if (ex.norm !== 'es' && ex.norm !== 'la') ex.norm = Math.random() < 0.5 ? 'es' : 'la';
  return ex.norm;
}
const otherNorm = ex => ({ es:'la', la:'es' })[exNorm(ex)] || '';
// Norm eines Satzes oder einer Lückenform: die der markierten Form, die er enthält ('' = beide oder keine Markierung)
function normOf(item, text){
  if (!item || !item.norms) return '';
  const t = ' ' + norm(text, item.lang) + ' ', hit = new Set(Object.keys(item.norms).filter(k => t.includes(' ' + k + ' ')).map(k => item.norms[k]));
  return hit.size === 1 ? [...hit][0] : '';
}
// Lückensatz: bei „wie in Lateinamerika“ und einem Zielsatz in spanischer Form der erste Satz dieser Norm mit seiner Form als Lücke,
// damit der Rest des Satzes passt (Hoy ___ con mi socio y cancelé dos reuniones, nicht „… y he cancelado“).
// ok: Lückenformen, die gelten; other: die Formen der anderen Norm (fast richtig).
// pos: Stelle der Lücke. Im Satz der anderen Norm dort, wo sie im Zielsatz steht (gleicher Anfang), sonst das erste Vorkommen.
function clozeOf(ex){
  const item = itemById(ex.id), n = exNorm(ex), o = otherNorm(ex);
  let target = item.target, gap = item.gap, pos = gapPos(target, gap);
  if (n && normOf(item, target) === o) {
    const pre = pos >= 0 ? item.target.slice(0, pos) : null;
    for (const a of item.alts) {
      const g = normOf(item, a) === n && item.gapAlts.find(x => normOf(item, x) === n && gapPos(a, x) >= 0);
      if (g) { target = a; gap = g; pos = pre != null && a.startsWith(pre + g) ? pre.length : gapPos(a, g); break; }
    }
  }
  const forms = [gap].concat(item.gapAlts.filter(x => x !== gap));
  return { target, gap, pos, ok:forms.filter(x => !o || normOf(item, x) !== o), other:o ? forms.filter(x => normOf(item, x) === o) : [] };
}
function answersFor(ex){
  if (ex.type === 'gen') return ex.data.answers;
  const item = itemById(ex.id);
  const st = stOf(item.id), o = otherNorm(ex), keep = x => !o || normOf(item, x) !== o;
  if (ex.type === 'cloze') return (item.gapAlts.length ? clozeOf(ex).ok : [item.gap]).concat(((st && st.gapAlts) || []).filter(keep));
  return [item.target].concat(item.alts, (st && st.alts) || []).filter(keep);
}
// Die Fassungen der anderen Norm: richtiges Spanisch, aber nicht gefragt
function otherAnswers(ex){
  const o = otherNorm(ex);
  if (!o) return [];
  const item = itemById(ex.id);
  return ex.type === 'cloze' ? clozeOf(ex).other : [item.target].concat(item.alts).filter(x => normOf(item, x) === o);
}
// Rückmeldung, wenn die Form der anderen Norm kam
// Signalwort aus dem Satz, das der Lücke am nächsten steht, davor bevorzugt: Gelernt wird, was man am Satz bemerkt, nicht die allgemeine Regel.
const NORM_CUES = [
  ['gehört zu heute', ['esta mañana', 'esta tarde', 'esta noche', 'este mediodía', 'hace un rato', 'hace un momento', 'hace una hora', 'hace media hora', 'hace unos minutos']],
  // hoy hier, nicht bei „gehört zu heute“ (das wäre ein Zirkel)
  ['läuft noch', ['hoy', 'esta semana', 'este mes', 'este año', 'este verano', 'este invierno', 'este trimestre', 'últimamente']],
  ['reicht bis jetzt', ['ya', 'todavía no', 'aún no', 'nunca', 'jamás', 'alguna vez', 'en toda mi vida', 'en mi vida', 'desde que', 'cuántas veces']]
];
function normCue(sentence, forms){
  const s = String(sentence || ''), low = s.toLowerCase(), L = 'a-zà-öø-ÿ';
  const at = forms.map(f => gapPos(s, f)).filter(i => i >= 0).sort((a, b) => a - b)[0];
  if (at == null) return null;
  let best = null;
  NORM_CUES.forEach(([why, cues]) => cues.forEach(cue => {
    const re = new RegExp(`(?<![${L}])${cue}(?![${L}])`, 'g');
    for (let m; (m = re.exec(low));) {
      const d = m.index < at ? at - (m.index + cue.length) : m.index - at + 10;
      if (!best || d < best.d) best = { d, cue:s.slice(m.index, m.index + cue.length), why };
    }
  }));
  return best;
}
const NORM_NAME = { es:'Spanien', la:'Lateinamerika' };
// Ein Satz Begründung zum Formenpaar in der Rückmeldung, mit dem Signalwort aus dem Satz
function normReason(ex, c){
  const item = itemById(ex.id), cz = ex.type === 'cloze' ? clozeOf(ex) : null;
  const cue = cz ? normCue(cz.target, [cz.gap]) : normCue(c.best || item.target, item.gapAlts);
  if (c.why.norm === 'es') return cue ? `„${cue.cue}“ ${cue.why}, darum in Spanien Perfecto.` : 'Der Zeitraum reicht bis jetzt, darum in Spanien Perfecto.';
  return `In Lateinamerika steht für Abgeschlossenes meist Indefinido${cue ? `, auch mit „${cue.cue}“` : ''}.`;
}
// Die beiden Formen nebeneinander: gefragt (Norm der Aufgabe) und deine (andere Norm). Bei der Lücke deine Eingabe,
// beim Übersetzen die markierte Form aus deinem Satz und die passende aus der gezeigten Lösung.
function normForms(ex, c){
  const item = itemById(ex.id), o = otherNorm(ex);
  if (ex.type === 'cloze') return { want:clozeOf(ex).gap, mine:String(c.input || '').trim() };
  const has = t => x => (' ' + norm(t || '', item.lang) + ' ').includes(' ' + norm(x, item.lang) + ' ');
  return { want:item.gapAlts.find(x => normOf(item, x) !== o && has(c.best || item.target)(x)) || '', mine:item.gapAlts.find(x => normOf(item, x) === o && has(c.input)(x)) || '' };
}
const NORM_LABEL = { es:'wie in Spanien', la:'wie in Lateinamerika' };
function check(){
  const r = S.run, ex = r.queue[r.idx], c = r.cur;
  if (!c || c.state !== 'answer') return;
  if (ex.type === 'tiles') {
    const item = itemById(ex.id);
    const built = ex.picked.map(i => ex.pool.find(p => p.i === i).t.toLowerCase()).join(' ');
    const keys = [item.target].concat(item.alts).map(tileKey).concat((stOf(item.id) && stOf(item.id).tileAlts) || []);
    c.result = keys.includes(built) ? 'ok' : 'bad'; markSeen(c, item.id);
    c.input = ex.picked.map(i => ex.pool.find(p => p.i === i).t).join(' ');
  } else if (ex.type === 'dict') {
    const box = $('#answer'); c.input = box ? box.value : c.input;
    const item = itemById(ex.id);
    // Diktat: Es zählt, was zu hören war. Alternativen (andere Wortstellung, Synonyme) sind hier falsch gehört.
    const j = judgeX(c.input, [item.target], r.lang);
    if (!j) return;
    c.result = j.res; c.why = j.why; c.diff = diffHtml(item.target, c.input, r.lang);
  } else if (ex.type === 'gen' && ex.data.kind === 'spot') {
    // Zweiter Schritt bei „Fehler finden“: die richtige Form zur gefundenen Stelle (oder der ganze verbesserte Satz)
    const box = $('#answer'); c.input = box ? box.value : c.input;
    if (!c.fixing || !c.input.trim()) return;
    const d = ex.data, j = judgeX(c.input, d.fix, r.lang, { equiv:false, typo:false }), whole = judgeX(c.input, [d.full], r.lang, { typo:false });
    c.result = [j, whole].some(x => x && x.res === 'ok') ? 'ok' : [j, whole].some(x => x && x.res === 'near') ? 'near' : 'bad';
    if (c.result === 'bad') c.fixBad = true;
  } else if (ex.type === 'gen' && ex.data.kind === 'time' && ex.data.mode !== 'write') {
    const box = $('#answer'); c.input = box ? box.value : c.input;
    if (!c.input.trim()) return;
    const d = ex.data;
    c.result = d.clock ? (timeMatches(c.input, d.h, d.m) ? 'ok' : 'bad') : (Number(c.input.replace(/\D/g, '')) === d.num ? 'ok' : 'bad');
  } else {
    const box = $('#answer'); c.input = box ? box.value : c.input;
    let j = judgeX(c.input, answersFor(ex), r.lang, judgeOpts(ex));
    if (!j) return;
    // Form der anderen Norm (perdí bei „wie in Spanien“): fast richtig, zählt beim Thema aber als Fehler (recordAnswer)
    if (j.res === 'bad' && otherNorm(ex)) { const o = judgeX(c.input, otherAnswers(ex), r.lang, judgeOpts(ex)); if (o && o.res !== 'bad') j = { res:'near', why:{ kind:'norm', norm:ex.norm } }; }
    const res = j.res;
    c.result = res; c.why = j.why; markSeen(c, ex.id);
    if (res !== 'ok') {
      // Erzeugte Aufgaben: bei falscher Antwort die Standardlösung zeigen (passend zur Erklärung und zum Vorlesen).
      // Satzbank: die richtige Fassung, die deiner Antwort am nächsten ist, damit die Korrektur klein bleibt.
      const best = ownWords(r.lang, c.input, res === 'bad' && ex.type === 'gen' ? answersFor(ex)[0] : closest(c.input, answersFor(ex), r.lang)); c.best = best; c.diff = diffHtml(best, c.input, r.lang);
      // Form der anderen Norm: nichts durchstreichen, sie ist richtiges Spanisch; das Formenpaar zeigt den Unterschied
      if (ex.type !== 'cloze' && !(ex.type === 'gen' && ex.data.gap) && !(j.why && j.why.kind === 'norm')) c.mine = mineHtml(c.input, best, r.lang);
      const toks = ' ' + norm(c.input, r.lang) + ' ';
      if (ex.type === 'gen' && ex.data.key) c.keyOk = ex.data.key.every(k => toks.includes(' ' + norm(k, r.lang) + ' ')) ? ex.data.keyLabel : '';
      if (ex.type === 'gen' && ex.data.pos && seqIn(toks.trim().split(' '), ex.data.pos.map(w => (w === '*' ? w : norm(w, r.lang))))) { c.keyOk = ex.data.posLabel; c.posOk = true; }
      if (ex.type === 'free') { const item = itemById(ex.id), o = otherNorm(ex); const g = item.gapAlts.find(x => (!o || normOf(item, x) !== o) && toks.includes(' ' + norm(x, r.lang) + ' ')); if (g) c.keyOk = `Der knifflige Teil stimmt: „${g}“`; }
      // Ganzer Satz getippt: fehlt nur ein Reflexivpronomen, sagt der Hinweis, was das Verb ohne es bedeutet; steht im si-Satz
      // Subjuntivo statt Konditional (oder umgekehrt), nennt er das. c.refl heißt aus alten Ständen so: der konkrete, benannte Fehler.
      if (res === 'bad' && r.lang === 'es' && ex.type !== 'cloze' && !(ex.type === 'gen' && ex.data.gap)) {
        const cw = esCondWhy(c.input, best);
        c.refl = esReflexWhy(c.input, best) || cw; c.cond = !!cw && c.refl === cw;
      }
      // Lücke: dieselbe Prüfung im ganzen Satz, mit deiner Antwort an der Stelle der Lücke
      if (res === 'bad' && r.lang === 'es' && ex.type === 'cloze') {
        const cz = clozeOf(ex), at = cz.pos;
        if (at >= 0) c.refl = esCondWhy(cz.target.slice(0, at) + c.input.trim() + cz.target.slice(at + cz.gap.length), cz.target);
      }
    }
    // Lücke mit einem Wort: dieselbe Form-Erklärung („stor“ ist die Grundform, hier braucht es „stort“)
    if (res === 'bad' && (ex.type === 'cloze' || (ex.type === 'gen' && ex.data.gap)) && c.best && !/\s/.test(c.input.trim()) && !/\s/.test(c.best.trim())) c.form = formWhy(r.lang, [[c.input.trim(), c.best.trim()]]);
    if (res === 'bad' && ex.type !== 'cloze') {
      const m = mistakeFor(ex, c.input, r.lang);
      c.kind = m ? m.kind : null;
      // Benannter Grammatikfehler (diéramos statt daríamos): eine falsche Form, kein anderes Wort. Das Wörterbuch kennt diéramos nicht,
      // darum hielt die Einteilung es für Wortschatz („Die Grammatik passt …“), und das Thema bekam den Fehler nicht.
      if (c.cond && c.kind === 'vocab') c.kind = 'word';
      if (c.kind === 'word') c.form = formWhy(r.lang, (m.pairs || []).map(([x, w]) => [x, ownWords(r.lang, c.input, w)]));
      if (c.kind === 'vocab') {
        c.vocabTopic = !!m.topic;
        // Einzelnes Lückenwort: Die Lösung steht schon da, der Satz „Die Grammatik passt …“ wäre dort schief
        if (!(ex.type === 'gen' && ex.data.gap)) c.vocab = m.pairs;
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
  if (d.kind === 'spot') {
    if (c.fixing) return;
    if (value === 'none') { c.pick = null; c.none = true; c.input = 'Kein Fehler'; c.result = d.wrong.length ? 'bad' : 'ok'; }
    else {
      c.pick = Number(value); c.input = d.words[c.pick];
      // Richtige Stelle gefunden: Wo die Verbesserung nicht von selbst folgt, kommt die richtige Form dazu
      if (d.wrong.includes(c.pick) && d.fix) { c.fixing = true; c.input = ''; S.focus = true; render(); return; }
      c.result = d.wrong.includes(c.pick) ? 'ok' : 'bad';
    }
  }
  else if (d.kind === 'genus') { c.input = value; c.result = value === d.answer ? 'ok' : 'bad'; }
  else return;
  finishAnswer(r, ex, c);
}
function finishAnswer(r, ex, c){
  c.state = 'done'; c.enter = true; buzz(c.result === 'bad' ? 'bad' : 'ok');
  // Serie in der Runde: zählt nur erste Versuche
  if (!ex.requeue) { r.combo = c.result === 'bad' ? 0 : (r.combo || 0) + 1; r.best = Math.max(r.best || 0, r.combo); c.combo = r.combo; }
  if (ex.id && ex.type !== 'dict' && !ex.requeue && c.result) {
    const g = c.result === 'ok' ? 3 : c.result === 'near' ? 2 : 1;
    c.nextIvl = FSRS.review(DB.st[ex.id] || {}, g, today(), true).ivl;
  }
  if (ex.type === 'free') { DB.used = DB.used || {}; DB.used.mic = (DB.used.mic || 0) + 1; }
  answered(r, c); render(); scrollFb(); autoSpeak(r, ex);
}
// Nach der Antwort: Bedenkzeit merken und das Tagwerk mit der Rückmeldung speichern (Pause oder Neustart verlieren sie nicht)
function answered(r, c){
  c.took = Math.min(120, Math.max(0, Math.round((Date.now() - (r.shownAt || Date.now())) / 1000)));
  if (r.kind === 'daily') persistRun();
}
function autoSpeak(r, ex){
  if (!DB.settings.autoplay || ex.type === 'dict') return;
  // Vorlesen, was als Lösung dasteht: immer der ganze Satz, nie nur die Lücke (vorher bei „fast richtig“ in Lückenaufgaben)
  const sol = solShown(r.lang, ex, r.cur || {}), item = ex.id ? itemById(ex.id) : null;
  if (item && sol === item.target) playItem(item); else speak(sol, r.lang);
}
// Kannte die App den Satz schon, und war er fällig? Entscheidet, ob er als neuer Satz, als Wiederholung und als Rückfall zählt.
function markSeen(c, id){ const st = id && DB.st[id]; c.wasSeen = !!st; c.wasDue = !!(st && st.due <= today()); }
function giveUp(){
  const r = S.run, c = r.cur; if (!c || c.state !== 'answer') return;
  const box = $('#answer'); if (box) c.input = box.value;
  // Auch „Weiß ich nicht“: Vorher fehlte das hier, ein aufgegebener fälliger Satz zählte als neuer Satz und nicht als Rückfall
  c.result = 'bad'; c.gaveUp = true; c.state = 'done'; markSeen(c, r.queue[r.idx].id);
  if (!r.queue[r.idx].requeue) r.combo = 0;
  answered(r, c); render(); scrollFb();
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
  const keep = new Array(Y.length).fill(false);
  lcsPairs(yb, tb, (x, y) => !!x && x === y).forEach(([i]) => { keep[i] = true; });
  if (keep.every((k, x) => k || !yb[x])) return '';
  return Y.map((w, x) => (keep[x] || !yb[x] ? esc(w) : `<span class="w-extra">${esc(w)}</span>`)).join(' ');
}
// Für die Themen am Rundenende (Felder neu in 24.68, ältere Runden haben sie nicht): q die Aufgabe (meist der deutsche Satz),
// ans deine Antwort, gu aufgegeben, best die richtige Fassung, die deiner Antwort am nächsten ist, why der Grund,
// off falsch, aber der geprüfte Teil des Themas stimmt (zählt wie in den Fehlerquellen nicht gegen das Thema), again der zweite Versuch
function resDetail(x, ex, c, ra, lang){
  const d = ex.type === 'gen' ? ex.data : null, item = ex.id ? itemById(ex.id) : null;
  x.ty = d ? (d.kind || (d.gap ? 'cloze' : 'free')) : ex.type;
  // Lesetext-Lücke: das gesuchte Wort mit Bedeutung, nicht die Bedeutung allein (sähe aus wie eine Übersetzung)
  const q = item ? item.de : d.kind === 'trans' ? d.src : d.mean ? `${d.answers[0]} = ${d.mean}` : d.deLine || (d.gap ? '' : d.prompt);
  if (q) x.q = String(q).slice(0, 240);
  if (c.gaveUp) x.gu = 1; else if (c.input) x.ans = String(c.input).slice(0, 240);
  if (x.good && !x.near) return x;
  // Form der anderen Norm: zählt in der Runde nicht als „auf Anhieb richtig“ (die Frage nannte die Norm)
  if (c.why && c.why.kind === 'norm') x.nrm = 1;
  if (c.best && c.best !== x.target) x.best = c.best;
  if (!x.good && ra.topicOk) x.off = 1;
  const why = roundWhy(c, ra.kind, lang);
  if (why) x.why = why.slice(0, 240);
  return x;
}
// Der Grund in einem Satz, wie in der Rückmeldung
function roundWhy(c, kind, lang){
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const other = p => `Anderes Wort: „${p[0]}“ statt „${p[1]}“`;
  if (c.result === 'near' && c.why && c.why.kind === 'norm') return `Andere Norm, gefragt war ${NORM_NAME[c.why.norm]}`;
  if (c.result === 'near') return c.why && c.why.kind === 'typo' ? `Tippfehler: „${c.why.typed}“ statt „${c.why.want}“` : c.vocab && c.vocab[0] ? other(c.vocab[0]) : lang === 'sv' ? 'Achte auf å, ä und ö.' : 'Achte auf die Akzente.';
  if (c.gaveUp) return '';
  if (c.keyOk) return `${c.keyOk}. ${c.refl ? `Aber ${c.refl}` : c.form ? `Aber ${c.form}.` : 'Der Unterschied liegt woanders.'}`;
  if (c.refl) return c.refl;
  if (c.form) return cap(c.form) + '.';
  if (c.vocab && c.vocab[0]) return other(c.vocab[0]);
  // Sonst nur die Fehlerarten, die sicher erkannt sind („Form oder Funktionswort“ stünde auch bei Kauderwelsch)
  return ['order', 'missing', 'spell'].includes(kind) ? ERR_KINDS[kind][1] : '';
}
function next(){
  const r = S.run, ex = r.queue[r.idx], c = r.cur;
  if (c && c.state === 'done') {
    const good = c.result === 'ok' || c.result === 'near';
    // Für die Fortschrittsleiste: Ergebnis an der Aufgabe merken (auch beim zweiten Versuch)
    ex.got = good ? c.result : 'bad';
    // Das Rundenergebnis zählt nur den ersten Versuch. Der zweite kommt kurz nach der Lösung und sagt wenig.
    const counts = !ex.requeue;
    if (counts) { if (good) r.ok++; else r.bad++; }
    // Nach einem Neustart fehlt shownAt: dann die Zeit bis zur Antwort (took)
    const f = { n:1, a:1, ok:good ? 1 : 0, secs:r.shownAt ? Math.min(120, Math.max(0, Math.round((Date.now() - r.shownAt) / 1000))) : (c.took || 0) };
    r.secs = (r.secs || 0) + f.secs;
    // Eigenes Tempo je Übungsart für die Zeitschätzung (nur erste Versuche, wie sie im Plan stehen)
    if (counts) notePace(r.lang, ex.type, f.secs);
    if (ex.id && ex.type !== 'dict' && counts) {
      if (!c.wasSeen) f.fresh = 1;
      else if (c.wasDue) { f.rev = 1; f.revOk = good ? 1 : 0; }
    }
    logDay(r.lang, f);
    if (counts) {
      const ra = recordAnswer(r.lang, ex, c, good);
      const item = ex.id ? itemById(ex.id) : null;
      (r.res = r.res || []).push(resDetail({ good, near:c.result === 'near', fresh:!!f.fresh, id:ex.id || null, gen:ex.type === 'gen' ? ex.gen : undefined, trap:ex.type === 'gen' && ex.data ? ex.data.trap : undefined, target:item ? item.target : (ex.data && (ex.data.full || ex.data.answers[0])) || '' }, ex, c, ra, r.lang));
    } else if (ex.id) {
      // Zweiter Versuch eines falschen Satzes: am Rundenende „beim zweiten Mal richtig“
      const first = (r.res || []).slice().reverse().find(x => x.id === ex.id && !x.good && x.again == null);
      if (first) first.again = good ? 1 : 0;
    }
    if (ex.id && ex.type !== 'dict') {
      const prev = DB.st[ex.id] || { ok:0, bad:0, alts:[] };
      if (counts) {
        const g = !good ? 1 : (c.result === 'near' ? 2 : 3);
        const wasMature = (prev.ivl || 0) >= MATURE, oldIvl = prev.ivl || 0;
        const st = Object.assign(prev, FSRS.review(prev, g, today()));
        st.reps = (st.reps || 0) + (good ? 1 : 0);
        if (!good && c.wasSeen) st.lapses = (st.lapses || 0) + 1;
        if (good) st.ok = (st.ok || 0) + 1; else st.bad = (st.bad || 0) + 1;
        if (!st.matured && st.ivl >= MATURE) { st.matured = true; logDay(r.lang, { mat:1 }); }
        if (c.wasDue && wasMature) logDay(r.lang, { revM:1, revMOk:good ? 1 : 0 });
        DB.st[ex.id] = st;
        if (r.res && r.res.length) Object.assign(r.res[r.res.length - 1], { ivl:st.ivl, pivl:oldIvl });
        const item = itemById(ex.id);
        // Zweiter Versuch: meist die Lücke. Stimmte sie beim Übersetzen schon („Der knifflige Teil stimmt“), lag der Fehler woanders;
        // die Lücke prüfte dann nichts, und der verbesserte Rest stünde schon da. Dann noch einmal der ganze Satz.
        // Form der anderen Norm: auch gleich noch einmal, als Lücke mit derselben Norm. Erst der zweite Abruf nach der Korrektur setzt sie fest.
        if (!good || (c.why && c.why.kind === 'norm')) r.queue.push(Object.assign({ type:item.kind === 'order' ? 'tiles' : ex.type === 'free' && c.keyOk && !c.gaveUp ? 'free' : 'cloze', id:ex.id, requeue:true }, ex.norm ? { norm:ex.norm } : {}));
      }
    }
    if (ex.type === 'gen' && good && ex.data.looked) lookedDone(ex.data.looked);
    if (ex.type === 'gen'  && counts) {
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
  if (r.kind === 'daily') { DB.done[today()] = true; DB.doneLang = DB.doneLang || {}; DB.doneLang[today()] = Object.assign({}, DB.doneLang[today()], { [r.lang]:true }); S.justDone = today(); S.dailyRun = null; DB.run = null; setTimeout(() => refill(r.lang), 500); }
  snapshot();
  // Etappen dieser Runde: was nach der Runde in „Dein Weg“ steht und vorher nicht (A2), dazu Themen-Etappen und die Sätze,
  // die in dieser Runde gefestigt oder verankert wurden. Einmal berechnet, damit die Ansicht beim Neuzeichnen gleich bleibt.
  checkTopics(r.lang);
  r.miles = r.wayBefore ? (() => { const before = new Set(r.wayBefore); return wayEvents().done.filter(e => !before.has(wayKey(e))); })() : [];
  r.crossed = { mature:crossedIn(r, MATURE), anchored:crossedIn(r, ANCHORED) };
  persistWay(); S.mileAll = false; S.topicsAll = false; S.topicOpen = null;
  if (r.kind === 'daily') r.month = monthCard();
  if (r.miles.length) buzz('mile');
  save(); S.view = 'runDone'; render(); window.scrollTo(0, 0);
}
// Sätze, deren Abstand in dieser Runde die Schwelle überschritten hat; der mit den meisten Fehlern zuerst
function crossedIn(r, th){
  const seen = new Set();
  return (r.res || []).filter(x => x.id && x.ivl != null && (x.pivl || 0) < th && x.ivl >= th && !seen.has(x.id) && seen.add(x.id))
    .map(x => ({ id:x.id, ivl:x.ivl, bad:(DB.st[x.id] && DB.st[x.id].bad) || 0, lapses:(DB.st[x.id] && DB.st[x.id].lapses) || 0 }))
    .sort((a, b) => b.bad - a.bad || b.lapses - a.lapses);
}
// Monatsbilanz beim ersten Tagwerk eines Monats: der Vormonat in drei Zahlen und als Kalender. Einmal je Monat;
// danach verschwindet auch die Monatszeile auf „Heute“. Im Januar dazu das Vorjahr in einer Zeile.
function monthCard(){
  const t = today(), ym = t.slice(0, 7);
  DB.used = DB.used || {};
  if ((DB.used.monthShown || '') >= ym) return null;
  if (Object.keys(DB.done || {}).some(d => DB.done[d] && d.slice(0, 7) === ym && d < t)) return null;
  const [Y, M] = ym.split('-').map(Number), pm = M === 1 ? `${Y - 1}-12` : `${Y}-${String(M - 1).padStart(2, '0')}`;
  const all = Object.keys(DB.log || {}).sort(), days = all.filter(d => d.slice(0, 7) === pm && ['sv', 'es'].some(l => (dayLog(d, l).n || 0) > 0));
  if (!days.length) return null;
  DB.used.monthShown = ym;
  const tw = Object.keys(DB.done || {}).filter(d => DB.done[d] && d.slice(0, 7) === pm).length;
  // Neu gefestigt: Bestand am Monatsende minus Bestand davor, je Sprache, mindestens 0
  const gain = l => { const by = matureByDay(all, l), inM = all.filter(d => d.slice(0, 7) === pm), before = all.filter(d => d.slice(0, 7) < pm); return Math.max(0, (inM.length ? by[inM[inM.length - 1]] : 0) - (before.length ? by[before[before.length - 1]] : 0)); };
  const out = { ym:pm, tw, days:days.length, gain:{ sv:gain('sv'), es:gain('es') }, et:wayEvents().done.filter(e => e.d.slice(0, 7) === pm).length };
  if (M === 1) {
    const yd = all.filter(d => d.slice(0, 4) === String(Y - 1) && ['sv', 'es'].some(l => (dayLog(d, l).n || 0) > 0));
    const sumY = k => yd.reduce((a, d) => a + (dayLog(d, 'sv')[k] || 0) + (dayLog(d, 'es')[k] || 0), 0);
    if (yd.length) out.year = { y:Y - 1, days:yd.length, n:sumY('n'), secs:sumY('secs') };
  }
  return out;
}
/* ---------- Vibration als leise Rückmeldung (Android) ---------- */
function buzz(kind){
  if (DB.settings.haptics === false || !navigator.vibrate) return;
  // Etappe: kurz, kurz, lang; falsch: zweimal kurz; richtig: ein Tick
  try { navigator.vibrate(kind === 'mile' ? [14, 70, 14, 70, 60] : kind === 'bad' ? [16, 70, 16] : 10); } catch (e) {}
}
