/* ===================== Neue Übungsformen ===================== */

/* ---------- 1) Fehler finden: Satz prüfen, den typischen Fehler finden und verbessern ---------- */
// Ein Teil der Sätze ist richtig („Kein Fehler“). Sonst wäre die Aufgabe nur Suchen: Das einzige ser/estar oder por/para im Satz muss falsch sein.
// fix: die richtige Form zum Eintippen, nur wo sie nicht schon aus dem Finden folgt (Subjuntivo, Indefinido, Präteritum, bestimmte Form).
// Bei Paaren (ser/estar, por/para, en/ett, Stellung) ergibt sich die Verbesserung von selbst, da reicht das Antippen.
const spotData = (de, wrongWords, wrongIdx, fixed, note, trap, fix) => {
  const words = wrongWords.slice(), last = words.length - 1;
  if (endsSentence(fixed) && !endsSentence(words[last])) words[last] += fixed.slice(-1);
  return { kind:'spot', deLine:de, words, wrong:wrongIdx, full:fixed, answers:[fixed], note, trap, fix:fix || null, label:'Finde den Fehler' };
};
// Dieselbe Aufgabe als richtiger Satz
const spotOk = d => Object.assign({}, d, { words:d.full.split(' '), wrong:[], fix:null });
const SPOT_OK = 0.4;
// Welche Wörter der Lösung neu sind: alles außerhalb der längsten gemeinsamen Wortfolge (ohne Satzzeichen, Groß/klein egal)
function spotChanged(words, fixed){
  const k = w => punctKey(w).toLowerCase(), b = fixed.map(k);
  const keep = new Set(lcsPairs(words.map(k), b).map(p => p[1]));
  return new Set(b.map((_, x) => x).filter(x => !keep.has(x)));
}
const spotVariant = (d, roll = Math.random()) => (roll < SPOT_OK ? spotOk(d) : d);
// Schwedisch: Stellung von inte & Co. (aus den Bausteinen von genInte)
// mode: 'inv' = Inversion, 'bisats' = Stellung des Adverbs (Nebensatz oder Hauptsatz), sonst zufällig
function spotInteSv(mode){
  const vp = pick(VP_SV), adv = pick(vp[2]), s = pick(SUBJ_INTE);
  const fill = t => t.replace('{S}', s[1]).replace('{s}', s[2]).replace('{V}', vp[3][s[3]]).replace('{A}', ADV_DE[adv]);
  const rest = vp[1] ? vp[1].split(' ') : [];
  const roll = mode === 'inv' ? 0.5 : mode === 'bisats' ? (Math.random() < 0.65 ? 0.2 : 0.9) : Math.random();
  if (roll < 0.45) {
    const intro = pick(INTRO_SV.filter(x => x[2].split(' ').includes(adv) && !(x[3] === 0 && s[3] === 0)));
    const head = intro[0].split(' ');
    const right = head.concat([s[0], adv, vp[0]], rest), wrong = head.concat([s[0], vp[0], adv], rest);
    return spotData(`${intro[1]} ${fill(vp[5])}.`, wrong, [head.length + 1, head.length + 2], right.join(' ') + '.', `Im Nebensatz steht „${adv}“ vor dem Verb: … ${s[0]} ${adv} ${vp[0]}.`, 'bisats');
  }
  if (roll < 0.75) {
    const front = vp[6].split(' ');
    const right = front.concat([vp[0], s[0], adv], rest), wrong = front.concat([s[0], vp[0], adv], rest);
    return spotData(`${vp[7]} ${fill(vp[4].replace('{S} {V}', '{V} {s}'))}.`, wrong, [front.length, front.length + 1], right.join(' ') + '.', `Steht etwas anderes vorn, kommt erst das Verb, dann das Subjekt: ${vp[6]} ${vp[0]} ${s[0]}.`, 'inversion');
  }
  const S0 = capFirst(s[0]);
  const right = [S0, vp[0], adv].concat(rest), wrong = [S0, adv, vp[0]].concat(rest);
  return spotData(`${fill(vp[4])}.`, wrong, [1, 2], right.join(' ') + '.', `Im Hauptsatz steht „${adv}“ nach dem Verb: ${s[0]} ${vp[0]} ${adv}. Vor dem Verb steht es nur im Nebensatz.`, 'bisats');
}
// Schwedisch: Präteritum statt „har …“ bei einem Zeitpunkt
const PAST_TIMES = [['Gestern', 'Igår'], ['Letzte Woche', 'Förra veckan'], ['Letzten Sommer', 'I somras'], ['Vor zwei Jahren', 'För två år sedan']];
function spotTempusSv(){
  const v = pick(VERBS_SV), s = pick(SUBJ_SV), tm = pick(PAST_TIMES);
  const obj = v[4].split(' ');
  const front = tm[1].split(' ');
  const right = front.concat([v[1], s[1]], obj), wrong = front.concat(['har', s[1], v[2]], obj);
  const de = `${tm[0]} ${v[6] === 's' ? s[3] : s[2]} ${s[0]} ${v[3]} ${v[5]}.`;
  return spotData(de, wrong, [front.length, front.length + 2], right.join(' ') + '.', `Mit einem Zeitpunkt in der Vergangenheit steht Präteritum (${v[1]}), nicht „har ${v[2]}“.`, 'tempus', [v[1], `${v[1]} ${s[1]}`]);
}
// Schwedisch: Adjektiv und bestimmte Form
function spotNpSv(){
  const N = pick(NOUNS), [de, g, dePl, sv, art, def, pl, defPl, allowed] = N;
  const A = ADJS[pick(allowed.split(''))], f = svForms(A[2]), ett = art === 'ett', da = DE_ART[g];
  const type = pick(['indef', 'def', 'defpl']);
  if (type === 'indef') {
    const good = ett ? f.t : f.base, bad = ett ? f.base : f.t;
    if (good === bad) return spotNpSv();
    return spotData(`Da ist ${da[0]} ${A[1]}${da[2]} ${de}.`, ['Där', 'är', art, bad, sv], [3], `Där är ${art} ${good} ${sv}.`, `${sv} ist ein ${art}-Wort, darum ${ett ? 'die t-Form' : 'die Grundform'}: ${art} ${good} ${sv}.`, 'species');
  }
  if (type === 'def') {
    const artDef = ett ? 'det' : 'den';
    if (Math.random() < 0.5) return spotData(`Da ist ${da[1]} ${A[1]}e ${de}.`, ['Där', 'är', artDef, f.defSg, sv], [4], `Där är ${artDef} ${f.defSg} ${def}.`, `Doppelte Bestimmtheit: ${artDef} ${f.defSg} ${def}. Das Substantiv bekommt trotzdem die Endung.`, 'species', [def]);
    const wrongArt = ett ? 'den' : 'det';
    return spotData(`Da ist ${da[1]} ${A[1]}e ${de}.`, ['Där', 'är', wrongArt, f.defSg, def], [2], `Där är ${artDef} ${f.defSg} ${def}.`, `${sv} ist ein ${art}-Wort, darum ${artDef}: ${artDef} ${f.defSg} ${def}.`, 'species');
  }
  return spotData(`Da sind die ${A[1]}en ${dePl}.`, ['Där', 'är', 'de', f.pl, pl], [4], `Där är de ${f.pl} ${defPl}.`, `Im Plural mit de braucht auch das Substantiv die bestimmte Form: de ${f.pl} ${defPl}.`, 'species', [defPl]);
}
// Spanisch: ser/estar und por/para vertauscht (aus den Generatoren)
const SE_SWAP = { soy:'estoy', eres:'estás', es:'está', somos:'estamos', son:'están', estoy:'soy', estás:'eres', está:'es', estamos:'somos', están:'son' };
function spotSwapEs(gen, swap, trap){
  const d = gen();
  const toks = d.prompt.split(' '), i = toks.findIndex(t => t.includes('___'));
  const ans = d.answers[0], wrongForm = swap(ans);
  const w = toks.slice(); w[i] = toks[i].replace('___', wrongForm);
  if (i === 0) w[0] = capFirst(w[0]);
  return spotData(d.deLine, w, [i], capFirst(d.full), d.note, trap);
}
// Spanisch: Subjuntivo und Indefinido aus der Satzbank
const HABER = ['he', 'has', 'ha', 'hemos', 'han'];
// Warum hier Subjuntivo: nach dem Auslöser im Satz, sonst die Erklärung des Satzes oder die allgemeine Regel
const SUBJ_WHY = [
  [/\bojalá\b/i, 'Nach ojalá (hoffentlich) steht immer der Subjuntivo'],
  [/\bno creo que\b/i, 'Nach verneintem creer que (Zweifel) steht der Subjuntivo'],
  [/\b(quiero|quieres|quiere|queremos|quieren) que\b/i, 'Nach querer que (jemand will, dass ein anderer etwas tut) steht der Subjuntivo'],
  [/\b(espero|esperas|espera|esperamos|esperan) que\b/i, 'Nach esperar que (Wunsch) steht der Subjuntivo'],
  [/\balegro de que\b/i, 'Nach einem Gefühl (me alegro de que) steht der Subjuntivo'],
  [/\bpara que\b/i, 'Nach para que (damit) steht immer der Subjuntivo'],
  [/\bes (importante|necesario|posible|mejor) que\b/i, 'Nach einer Wertung oder Möglichkeit (es importante que, es posible que) steht der Subjuntivo'],
  [/\bcuando\b/i, 'cuando mit Zukunftsbezug (es ist noch nicht passiert) verlangt den Subjuntivo']
];
const PAST_POINT_ES = /\b(ayer|anoche|la semana pasada|el año pasado|el mes pasado|el verano pasado|el (lunes|martes|miércoles|jueves|viernes|sábado|domingo) pasado|en \d{4}|hace (un|una|unos|unas|dos|tres|cuatro|cinco|seis|diez|\d+) (años?|mes|meses|semanas?|días?))\b/i;
function bankSpotsEs(){
  const out = [];
  BANK.es.forEach(it => {
    // Reflexive Indefinido-Formen („me mudé“, „nos casamos“): Das Pronomen bleibt, nur die Verbform wird zu „he mudado“
    const refl = it.trap === 'perfecto' && /^(me|te|se|nos|os) \S+$/i.test(it.gap);
    if (!it.gap || (it.gap.includes(' ') && !refl) || !it.hint) return;
    // Je nach Lesart ist beides richtig, also kein eindeutiger Fehler: Relativsätze („un piso que tiene/tenga“, „alguien que me ayuda/ayude“,
    // „lo que te gusta/guste“) und aunque („aunque no me crees“ als Tatsache, „aunque no me creas“ als Annahme)
    if (/\b(un|una|unos|unas) \S+ que\b|\balguien que\b|\blo que\b|\baunque\b/i.test(it.target)) return;
    const inf = it.hint.replace(/[()]/g, '').split(',')[0].trim().replace(refl ? /se$/ : /$^/, '');
    if (!/^[a-zñ]+(ar|er|ir)$/.test(inf)) return;
    const verb = refl ? it.gap.split(' ')[1] : it.gap;
    const toks = it.target.split(' '), idx = toks.findIndex(t => punctKey(t) === verb);
    if (idx < 0) return;
    const swapAt = (form, extra) => { const w = toks.slice(); w[idx] = toks[idx].replace(verb, form); if (extra) w.splice(idx + 1, 0, extra); return w; };
    if (it.trap === 'subjuntivo') {
      // yo und él/ella haben im Subjuntivo dieselbe Form: im Zweifel dritte Person, außer der deutsche Satz sagt „ich“
      const cands = [0, 1, 2, 3, 4].filter(k => conjugate(inf, 'subj', k) === it.gap);
      if (!cands.length) return;
      const p = cands.includes(2) && cands.includes(0) ? (/\b(dass|wenn|bevor|damit|ob) ich\b/.test(it.de) ? 0 : 2) : cands[0];
      // Unpersönliches haber (para que no haya malentendidos): Indikativ hay, nicht ha; ha nur vor einem Partizip (haya llamado)
      const nx = punctKey(toks[idx + 1] || '').toLowerCase(), e = lookupWord('es', nx);
      const part = /(ado|ido|ído)$/.test(nx) || ES_PART_IRR.includes(nx) || (e && /\(Partizip/.test(e.de));
      const ind = inf === 'haber' && p === 2 && !part ? 'hay' : conjugate(inf, 'pres', p);
      if (!ind || ind === it.gap) return;
      const why = SUBJ_WHY.find(([re]) => re.test(it.target));
      const note = it.note || (why ? `${why[1]}: ${it.gap}, nicht ${ind}.` : 'Hier verlangt der Satz den Subjuntivo, etwa nach querer que, es importante que, ojalá, para que oder cuando mit Zukunftsbezug.');
      out.push(withTrap('subjuntivo', () => spotData(it.de, swapAt(ind), [idx], it.target, note, 'subjuntivo', it.gapAlts.length ? it.gapAlts : [it.gap])));
    }
    if (it.trap === 'perfecto' && /\b(ayer|pasado|pasada|anoche|en \d{4}|\d{4}|hace (un|una|unos|unas|dos|tres|cuatro|cinco|seis|diez|\d+) (años?|mes|meses|semanas?|días?))\b/i.test(it.target)) {
      const when = (it.target.match(PAST_POINT_ES) || [])[0];
      const p = [0, 1, 2, 3, 4].find(k => conjugate(inf, 'indef', k) === verb);
      if (p == null) return;
      // Mit erkanntem Zeitpunkt eine Erklärung, die beide Formen nennt; sonst die des Satzes
      const pron = refl ? it.gap.split(' ')[0].toLowerCase() + ' ' : '';
      const note = when ? `Mit „${when.toLowerCase()}“ (abgeschlossen) steht Indefinido: ${pron}${verb}, nicht ${pron}${HABER[p]} ${participle(inf)}.` : it.note || 'Mit einem abgeschlossenen Zeitpunkt (ayer, la semana pasada, 2015) steht Indefinido, nicht Perfecto.';
      out.push(withTrap('perfecto', () => spotData(it.de, swapAt(HABER[p], participle(inf)), [idx, idx + 1], it.target, note, 'perfecto', refl ? [verb, it.gap] : it.gapAlts.length ? it.gapAlts : [it.gap])));
    }
  });
  // gustar & Co. richten sich nach dem, was gefällt: Einzahl und Mehrzahl vertauscht (me gusta los libros). Nur einzelne Verbformen;
  // „da“ (me da igual) bleibt draußen, weil „me dan igual“ mit einem Bezug in der Mehrzahl auch richtig wäre.
  BANK.es.forEach(it => {
    if (it.trap !== 'gustar' || it.tat || it.own || !it.gap || it.gap.includes(' ') || it.gap.length < 4) return;
    const g = it.gap, wrongForm = /ían$/.test(g) ? g.slice(0, -1) : /ía$/.test(g) ? g + 'n' : /[ae]n$/.test(g) ? g.slice(0, -1) : /[ae]$/.test(g) ? g + 'n' : null;
    if (!wrongForm || it.gapAlts.includes(wrongForm)) return;
    const toks = it.target.split(' '), idx = toks.findIndex(t => punctKey(t) === g);
    if (idx < 0) return;
    const w = toks.slice(); w[idx] = toks[idx].replace(g, wrongForm);
    out.push(withTrap('gustar', () => spotData(it.de, w, [idx], it.target, it.note, 'gustar')));
  });
  return out;
}
const withTrap = (trap, f) => Object.assign(f, { trap });
// Schwedisch aus der Satzbank: hans/hennes/deras/dess, wo „sin“ nicht stehen kann. Das ist der Fall im Subjekt („Lisa och hennes man“,
// „… att hennes bror är sjuk“, „om hans pappa“) und bei jag/du/vi/ni als Subjekt. Umgekehrt (sin → hans) wäre es nicht eindeutig falsch:
// „Anna ringer hennes mamma“ geht auch, dann ist es die Mutter einer anderen.
function svNounKind(w){
  const e = lookupWord('sv', w); if (!e) return null;
  if (/\(Plural\)/.test(e.de)) return 'pl';
  const ett = NOUNS.some(n => n[3] === w && n[4] === 'ett') || PLURAL_SV.some(n => n[0] === w && n[1] === 'ett') || GENUS.sv.some(g => g[0] === w && g[1] === 'ett') || /ett-Wort/.test(e.de);
  return ett ? 'ett' : 'en';
}
function bankSpotsSv(){
  const out = [];
  BANK.sv.forEach(it => {
    if (it.trap !== 'sin' || it.tat || it.own || !['hans', 'hennes', 'deras', 'dess'].includes(it.gap)) return;
    const toks = it.target.split(' '), idx = toks.findIndex(t => punctKey(t) === it.gap);
    if (idx < 1) return;
    const prev = toks[idx - 1].toLowerCase(), first = toks[0].toLowerCase();
    if (!(prev === 'och' || prev === 'att' || (prev === 'om' && /\bob\b/.test(it.de)) || ['jag', 'du', 'vi', 'ni'].includes(first))) return;
    const kind = toks[idx + 1] && svNounKind(punctKey(toks[idx + 1]));
    if (!kind) return;
    const w = toks.slice(); w[idx] = { pl:'sina', ett:'sitt', en:'sin' }[kind];
    out.push(withTrap('sin', () => spotData(it.de, w, [idx], it.target, it.note, 'sin', it.gapAlts.length ? it.gapAlts : [it.gap])));
  });
  return out;
}
let BANK_SPOTS_SV = null;
// Feste Verbindungen aus der Satzbank: der typische Fehler aus „falsch:“ (Vi måste träffa ett beslut, hacer un error). Er weicht nur in
// der Lücke ab, das Verb; die richtige Verbindung steht in der Erklärung. Ein Satz mit mehreren „falsch:“ gibt mehrere Aufgaben.
function bankSpotsKollok(lang){
  const out = [];
  BANK[lang].forEach(it => {
    if (it.trap !== 'kollok' || it.tat || it.own || !it.wrong || !it.wrong.length) return;
    const a = it.target.split(' ');
    it.wrong.forEach(w => {
      const b = w.split(' '), key = x => punctKey(x).toLowerCase();
      if (b.length !== a.length) return;
      const diff = a.map((_, i) => i).filter(i => key(a[i]) !== key(b[i]));
      if (!diff.length || diff.length > 2) return;
      out.push(withTrap('kollok', () => spotData(it.de, b, diff, it.target, it.note, 'kollok', it.gapAlts.length ? it.gapAlts : [it.gap])));
    });
  });
  return out;
}
// Aus Auswahlaufgaben (Präpositionen, Konnektoren): Eine der falschen Optionen steht im Satz. Diese Listen haben genau eine richtige Option,
// auch ohne den deutschen Satz, also ist die eingesetzte sicher falsch. Welche von zwei anderen richtig ist, folgt nicht aus dem Finden: eintippen.
function spotChoice(list, trap){
  const [p, a, opts, de, note] = pick(list), wrongOpt = pick(opts.filter(o => o.toLowerCase() !== a.toLowerCase()));
  const [before, after] = p.split('___'), fit = o => (before ? o.toLowerCase() : capFirst(o.toLowerCase()));
  const words = (before + fit(wrongOpt) + after).split(' '), start = before ? before.trim().split(' ').length : 0;
  return spotData(de, words, wrongOpt.split(' ').map((_, k) => start + k), before + fit(a) + after, note, trap, [a.toLowerCase()]);
}
let BANK_SPOTS_ES = null;
function bankSpots(lang){
  if (lang === 'es') return BANK_SPOTS_ES || (BANK_SPOTS_ES = bankSpotsEs().concat(bankSpotsKollok('es')));
  return BANK_SPOTS_SV || (BANK_SPOTS_SV = bankSpotsSv().concat(bankSpotsKollok('sv')));
}
const fromBank = (lang, trap) => () => pick(bankSpots(lang).filter(f => f.trap === trap))();
// Fehlerarten je Sprache. Arten aus der Satzbank mit wenigen Sätzen kommen seltener (Gewicht = Sätze / 12), damit sich nicht dieselben vier Sätze häufen.
const SPOT_CATS = {
  sv:{ bisats:() => spotInteSv('bisats'), inversion:() => spotInteSv('inv'), tempus:spotTempusSv, species:spotNpSv, sin:fromBank('sv', 'sin'), prep:() => spotChoice(PREP_SV, 'prep'), verbind:() => spotChoice(VERB_SV, 'verbind'), kollok:fromBank('sv', 'kollok') },
  es:{ serestar:() => spotSwapEs(genSerEstar, a => SE_SWAP[a] || a, 'serestar'), porpara:() => spotSwapEs(genPorPara, a => (a === 'por' ? 'para' : 'por'), 'porpara'), subjuntivo:fromBank('es', 'subjuntivo'), perfecto:fromBank('es', 'perfecto'), gustar:fromBank('es', 'gustar'), prep:() => spotChoice(PREP_ES, 'prep'), verbind:() => spotChoice(VERB_ES, 'verbind'), kollok:fromBank('es', 'kollok') }
};
const BANK_CATS = { sv:['sin', 'kollok'], es:['subjuntivo', 'perfecto', 'gustar', 'kollok'] };
function spotWeight(lang, k){
  if (!BANK_CATS[lang].includes(k)) return 1;
  return Math.min(1, bankSpots(lang).filter(f => f.trap === k).length / 12);
}
// Welche Fehlerart kommt: nur Wahrscheinlichkeiten, keine festen Regeln, die man mit der Zeit durchschaut. Jede Art kann jederzeit kommen,
// auch zweimal hintereinander. Gewicht = Grundgewicht (Satzbank-Arten mit wenigen Sätzen seltener) × Schätzung des Themas aus dem
// Fehlermodell geteilt durch deinen Schnitt, begrenzt auf ½ bis 2 (sichere Arten bis halb so oft, wacklige bis doppelt so oft;
// ohne Daten 1; bis 24.72 eigene Formel (Fehler + 1)/(Aufgaben + 5)) × REPEAT_DAMP für die Art der letzten Aufgabe
// (mischt, ohne zu verbieten; dieselbe Regel ordnet die Themen im Tagwerk, siehe spreadTopics).
// Richtig oder fehlerhaft entscheidet jedes Mal unabhängig der Zufall (40 %): Aus den vorigen Sätzen lässt sich nichts ablesen.
function spotWeights(lang){
  const M = topicModel(lang), last = ((DB.used || {}).spotLast || {})[lang];
  const w = {};
  Object.keys(SPOT_CATS[lang]).forEach(k => {
    const x = M.topics.find(t => t.id === k), rel = x && M.mu > 0 ? x.mean / M.mu : 1;
    w[k] = spotWeight(lang, k) * Math.min(2, Math.max(0.5, rel)) * (k === last ? REPEAT_DAMP : 1);
  });
  return w;
}
function genSpot(lang){
  const w = spotWeights(lang), cat = pickWeighted(Object.keys(w), k => w[k]);
  return Object.assign(spotVariant(SPOT_CATS[lang][cat]()), { cat });
}
// Gedächtnis für das halbe Gewicht: schreibt makeFresh über seen(), erst wenn die Aufgabe wirklich gezeigt wird
function spotSeen(lang, d){ const u = DB.used = DB.used || {}; (u.spotLast = u.spotLast || {})[lang] = d.cat; }
const genSpotSv = () => genSpot('sv'), genSpotEs = () => genSpot('es');

/* ---------- 2) Umbauen: einen Satz umformen, ohne Deutsch ---------- */
const SV_PRES = { äta:'äter', dricka:'dricker', skriva:'skriver', läsa:'läser', se:'ser', gå:'går', komma:'kommer', göra:'gör', ta:'tar', köpa:'köper', träffa:'träffar', springa:'springer', flyga:'flyger', simma:'simmar', vinna:'vinner', glömma:'glömmer', ringa:'ringer', hitta:'hittar', sjunga:'sjunger', få:'får', sova:'sover', åka:'åker' };
const transData = (src, start, answers, note, trap, aim) => ({ kind:'trans', src, start, answers, full:answers[0], note, trap, aim, label:'Bau den Satz um' });
function genTransSv(){
  const r = Math.random();
  if (r < 0.65) {
    const vp = pick(VP_SV), adv = pick(vp[2]), s = pick(SUBJ_INTE);
    const rest = vp[1] ? ' ' + vp[1] : '';
    const main = `${capFirst(s[0])} ${vp[0]} ${adv}${rest}.`;
    const alt = x => (/\bidag\b/.test(x) ? [x, x.replace('idag', 'i dag')] : [x]);
    if (r < 0.38) {
      const intro = pick(INTRO_SV.filter(x => x[2].split(' ').includes(adv) && !(x[3] === 0 && s[3] === 0)));
      return transData(main, intro[0] + ' ', alt(`${intro[0]} ${s[0]} ${adv} ${vp[0]}${rest}.`), `Im Nebensatz rückt „${adv}“ vor das Verb: … ${s[0]} ${adv} ${vp[0]}.`, 'bisats');
    }
    return transData(main, vp[6] + ' ', alt(`${vp[6]} ${vp[0]} ${s[0]} ${adv}${rest}.`), `Das Verb bleibt an zweiter Stelle, das Subjekt rückt dahinter: ${vp[6]} ${vp[0]} ${s[0]}.`, 'inversion');
  }
  const v = pick(VERBS_SV), s = pick(SUBJ_SV);
  const src = `${capFirst(s[1])} ${SV_PRES[v[0]]} ${v[4]}.`;
  const ans = `Igår ${v[1]} ${s[1]} ${v[4]}.`;
  return transData(src, 'Igår ', [ans, ans.replace('Igår', 'I går')], `Zwei Dinge ändern sich: Präteritum (${v[1]}) und Inversion, weil „igår“ vorn steht.`, 'tempus');
}
// Spanisch: Bausteine für Subjuntivo und Zeiten
const ES_VP = [['venir', 'mañana'], ['llegar', 'a tiempo'], ['estudiar', 'más'], ['tener', 'paciencia'], ['hacer', 'los deberes'], ['estar', 'en casa'], ['decir', 'la verdad'], ['salir', 'temprano'], ['llamar', 'a los abuelos'], ['volver', 'pronto'],
  ['escribir', 'más a menudo'], ['comer', 'mejor'], ['trabajar', 'menos'], ['aprender', 'a nadar'], ['viajar', 'en verano'], ['ayudar', 'en casa']];
const ES_SUBJ = [['', 1], ['Ana', 2], ['', 3], ['Los niños', 4]];
const ES_TRIG = ['Quiero que', 'Es importante que', 'Ojalá', 'Espero que', 'No creo que'];
// Das Subjektpronomen darf im Spanischen dastehen (betont): „Quiero que tú vengas“, „Ayer yo trabajé“ sind auch richtig
const ES_PRON = ['yo', 'tú', '', 'nosotros'];
const withPron = (list, lead, p) => (ES_PRON[p] ? list.concat(list.map(a => a.replace(lead + ' ', `${lead} ${ES_PRON[p]} `))) : list);
const ES_DAY = [['trabajar', 'mucho'], ['comer', 'en casa'], ['salir', 'temprano'], ['ver', 'una película'], ['leer', 'el periódico'], ['estar', 'en casa'], ['tener', 'tiempo'], ['dormir', 'bien'], ['hacer', 'deporte'], ['ir', 'al cine'],
  ['escribir', 'un correo largo'], ['correr', 'por el parque'], ['comprar', 'fruta en el mercado'], ['estudiar', 'para el examen'], ['escuchar', 'la radio'], ['viajar', 'en tren'], ['cocinar', 'para todos'], ['bailar', 'salsa'], ['recibir', 'un paquete'], ['aprender', 'algo nuevo'], ['llamar', 'a la abuela'], ['ayudar', 'a los vecinos']];
function genTransEs(){
  const r = Math.random();
  if (r < 0.45) {
    const [inf, comp] = pick(ES_VP), [subj, p] = pick(ES_SUBJ), trig = pick(ES_TRIG);
    const pres = conjugate(inf, 'pres', p), subjF = conjugate(inf, 'subj', p);
    const src = `${subj ? subj + ' ' : ''}${subj ? pres : capFirst(pres)} ${comp}.`;
    const ans = `${trig} ${subj ? subj.toLowerCase() === 'los niños' ? 'los niños ' : subj + ' ' : ''}${subjF} ${comp}.`;
    const answers = withPron([ans], trig, subj ? 2 : p);
    if (trig === 'Ojalá') answers.slice().forEach(a => answers.push(a.replace('Ojalá ', 'Ojalá que ')));
    return transData(src, trig + ' ', answers, `Nach „${trig.toLowerCase()}“ folgt der Subjuntivo: ${subjF}.`, 'subjuntivo');
  }
  const [inf, comp] = pick(ES_DAY), p = pick([0, 2, 3]);
  const who = p === 2 ? 'Ana ' : '';
  if (r < 0.75) {
    const src = `Hoy ${who}${conjugate(inf, 'pres', p)} ${comp}.`;
    const ans = `Ayer ${who}${conjugate(inf, 'indef', p)} ${comp}.`;
    return transData(src, 'Ayer ', withPron([ans], 'Ayer', p), `Mit „ayer“ steht Indefinido: ${conjugate(inf, 'indef', p)}.`, 'pasado');
  }
  const src = `Ayer ${who}${conjugate(inf, 'indef', p)} ${comp}.`;
  const perf = `Hoy ${who}${HABER[p]} ${participle(inf)} ${comp}.`;
  return transData(src, 'Hoy ', withPron([perf, `Hoy ${who}${conjugate(inf, 'indef', p)} ${comp}.`], 'Hoy', p), `Mit „hoy“ nimmt man in Spanien das Perfecto (${HABER[p]} ${participle(inf)}). In Lateinamerika ist auch Indefinido üblich.`, 'perfecto', 'Dieselbe Handlung, nur heute schon passiert (nicht: passiert gerade).');
}

/* ---------- 3) Uhrzeiten & Zahlen ---------- */
const SV_H = ['tolv', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv'];
const ES_H = ['doce', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];
function timeWords(lang, h, m){
  const n = h % 12 || 12, nx = (h % 12) + 1;
  if (lang === 'sv') {
    const H = SV_H[n], X = SV_H[nx];
    const map = { 0:[`klockan ${H}`, H], 5:[`fem över ${H}`], 10:[`tio över ${H}`], 15:[`kvart över ${H}`], 20:[`tjugo över ${H}`, `tio i halv ${X}`], 25:[`fem i halv ${X}`], 30:[`halv ${X}`], 35:[`fem över halv ${X}`], 40:[`tjugo i ${X}`, `tio över halv ${X}`], 45:[`kvart i ${X}`], 50:[`tio i ${X}`], 55:[`fem i ${X}`] };
    // „klockan kvart över tre“ und „klockan är kvart över tre“ sind genauso richtig
    const forms = map[m];
    return [...new Set(forms.concat(forms.map(f => `klockan ${f.replace(/^klockan /, '')}`), forms.map(f => `klockan är ${f.replace(/^klockan /, '')}`)))];
  }
  const art = k => (k === 1 ? 'la' : 'las'), verb = k => (k === 1 ? 'Es' : 'Son');
  const H = `${art(n)} ${ES_H[n]}`, X = `${art(nx)} ${ES_H[nx]}`;
  const map = { 0:[H], 5:[`${H} y cinco`], 10:[`${H} y diez`], 15:[`${H} y cuarto`], 20:[`${H} y veinte`], 25:[`${H} y veinticinco`], 30:[`${H} y media`], 35:[`${X} menos veinticinco`], 40:[`${X} menos veinte`], 45:[`${X} menos cuarto`], 50:[`${X} menos diez`], 55:[`${X} menos cinco`] };
  // Auch richtig: „las tres en punto“ und die Digitalform „las tres y cuarenta“ (in Lateinamerika und bei Ansagen üblich)
  const ES_MIN = { 5:'cinco', 10:'diez', 15:'quince', 20:'veinte', 25:'veinticinco', 30:'treinta', 35:'treinta y cinco', 40:'cuarenta', 45:'cuarenta y cinco', 50:'cincuenta', 55:'cincuenta y cinco' };
  const withVerb = (fs, v) => fs.concat(fs.map(f => `${v.toLowerCase()} ${f}`));
  const main = withVerb(map[m], m >= 35 ? verb(nx) : verb(n));
  // Bei 5, 10, 20 und 25 ist die Digitalform dieselbe wie die übliche
  const extra = m === 0 ? [`${H} en punto`] : m === 15 || m >= 30 ? [`${H} y ${ES_MIN[m]}`] : [];
  return main.concat(withVerb(extra, verb(n)));
}
const TIME_NOTE = {
  sv:{ 25:'fem i halv … heißt „fünf vor halb …“, also 25 nach der vollen Stunde.', 30:'halv åtta = halb acht, genau wie im Deutschen: 7:30.', 35:'fem över halv … heißt „fünf nach halb …“.', 45:'kvart i … = Viertel vor …', 15:'kvart över … = Viertel nach …' },
  es:{ 45:'menos cuarto: die nächste Stunde minus eine Viertelstunde.', 30:'y media = halb, aber von der vollen Stunde aus: las siete y media = 7:30.', 0:'Bei ein Uhr heißt es es la una, sonst son las …' }
};
const SV_UNITS = ['', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio'], SV_TEENS = { 13:'tretton', 14:'fjorton', 15:'femton', 16:'sexton', 17:'sjutton', 18:'arton', 19:'nitton' }, SV_TENS = ['', '', 'tjugo', 'trettio', 'fyrtio', 'femtio', 'sextio', 'sjuttio', 'åttio', 'nittio'];
const ES_TEENS = { 13:'trece', 14:'catorce', 15:'quince', 16:'dieciséis', 17:'diecisiete', 18:'dieciocho', 19:'diecinueve', 20:'veinte', 22:'veintidós', 23:'veintitrés', 24:'veinticuatro', 25:'veinticinco', 26:'veintiséis', 27:'veintisiete', 28:'veintiocho', 29:'veintinueve' };
const ES_TENS = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'], ES_UNITS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
function numWords(lang, n){
  if (lang === 'sv') return SV_TEENS[n] || SV_TENS[Math.floor(n / 10)] + SV_UNITS[n % 10];
  if (ES_TEENS[n]) return ES_TEENS[n];
  return ES_TENS[Math.floor(n / 10)] + (n % 10 ? ' y ' + ES_UNITS[n % 10] : '');
}
function genTime(lang){
  const isTime = Math.random() < 0.65;
  const canHear = canSpeak() && voiceFor(lang);
  const dirRoll = Math.random(), dir = dirRoll < 0.5 ? 'read' : dirRoll < 0.72 && canHear ? 'hear' : 'write';
  if (isTime) {
    const h = 1 + Math.floor(Math.random() * 12), m = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    const words = timeWords(lang, h, m), clock = `${h}:${String(m).padStart(2, '0')}`;
    const say = lang === 'sv' ? `Klockan är ${words[0].replace(/^klockan /, '')}.` : `${m >= 35 ? (((h % 12) + 1) === 1 ? 'Es' : 'Son') : (h % 12 === 1 ? 'Es' : 'Son')} ${words[0]}.`;
    const note = (TIME_NOTE[lang] || {})[m] || '';
    if (dir === 'write') return { kind:'time', mode:'write', clock, answers:words, full:say, note, label:'Schreib die Uhrzeit in Worten', trap:'zeit' };
    return { kind:'time', mode:dir, say, clock, h, m, answers:[clock], full:say, note, label:dir === 'hear' ? 'Hör zu und schreib die Uhrzeit als Zahl' : 'Schreib die Uhrzeit als Zahl', trap:'zeit' };
  }
  let n; do { n = 13 + Math.floor(Math.random() * 87); } while (n % 10 === 1);
  const w = numWords(lang, n), cur = lang === 'sv' ? 'kronor' : 'euros';
  const say = lang === 'sv' ? `Det kostar ${w} kronor.` : `Cuesta ${w} euros.`;
  const variants = lang === 'sv' ? [w, w.replace(/^(tjugo|trettio|fyrtio|femtio|sextio|sjuttio|åttio|nittio)(.+)$/, '$1 $2')] : [w];
  if (dir === 'write') return { kind:'time', mode:'write', num:n, cur, answers:variants.concat(variants.map(x => `${x} ${cur}`)), full:say, note:lang === 'es' && n >= 31 ? 'Ab 31 schreibt man die Zahlen getrennt mit y: treinta y dos.' : lang === 'sv' && n > 20 ? 'Zusammengeschrieben, Zehner zuerst: fyrtiosju.' : '', label:'Schreib den Preis in Worten', trap:'zahl' };
  return { kind:'time', mode:dir, say, num:n, answers:[String(n)], full:say, note:'', label:dir === 'hear' ? 'Hör zu und schreib den Preis als Zahl' : 'Schreib den Preis als Zahl', trap:'zahl' };
}
// Uhrzeit-Eingabe tolerant prüfen: 7:45, 7.45, 7,45, „7 45“, 7h45 und 745 oder 0745 ohne Trennzeichen sind gleich.
// Die Zifferntastatur auf dem Handy hat oft keinen Doppelpunkt, darum zählt jedes übliche Trennzeichen.
function timeMatches(input, h, m){
  const v = String(input).trim();
  const x = v.match(/^(\d{1,2})\s*[:.,h ]\s*(\d{2})$/) || v.match(/^(\d{1,2})(\d{2})$/) || v.match(/^(\d{1,2})$/);
  if (!x) return false;
  const hh = Number(x[1]), mm = x[2] != null ? Number(x[2]) : 0;
  return mm === m && (hh % 12 || 12) === (h % 12 || 12);
}

/* ---------- 4) Genus: en oder ett, el oder la ---------- */
// [Wort, Genus, deutsches Wort mit Artikel, Hinweis]
const GENUS = {
  sv: [
    ['hus', 'ett', 'das Haus'], ['bil', 'en', 'das Auto'], ['barn', 'ett', 'das Kind'], ['bok', 'en', 'das Buch'], ['bord', 'ett', 'der Tisch'], ['stol', 'en', 'der Stuhl'],
    ['äpple', 'ett', 'der Apfel'], ['lampa', 'en', 'die Lampe'], ['fönster', 'ett', 'das Fenster'], ['dörr', 'en', 'die Tür'], ['rum', 'ett', 'das Zimmer'], ['stad', 'en', 'die Stadt'],
    ['land', 'ett', 'das Land'], ['gata', 'en', 'die Straße'], ['tåg', 'ett', 'der Zug'], ['buss', 'en', 'der Bus'], ['flygplan', 'ett', 'das Flugzeug'], ['båt', 'en', 'das Boot'],
    ['flicka', 'en', 'das Mädchen'], ['pojke', 'en', 'der Junge'], ['namn', 'ett', 'der Name'], ['dag', 'en', 'der Tag'], ['år', 'ett', 'das Jahr'], ['vecka', 'en', 'die Woche'],
    ['ord', 'ett', 'das Wort'], ['fråga', 'en', 'die Frage'], ['svar', 'ett', 'die Antwort'], ['brev', 'ett', 'der Brief'], ['tidning', 'en', 'die Zeitung'], ['papper', 'ett', 'das Papier'],
    ['penna', 'en', 'der Stift'], ['glas', 'ett', 'das Glas'], ['kopp', 'en', 'die Tasse'], ['bröd', 'ett', 'das Brot'], ['ost', 'en', 'der Käse'], ['ägg', 'ett', 'das Ei'],
    ['fisk', 'en', 'der Fisch'], ['kök', 'ett', 'die Küche'], ['säng', 'en', 'das Bett'], ['badrum', 'ett', 'das Badezimmer'], ['soffa', 'en', 'das Sofa'], ['problem', 'ett', 'das Problem'],
    ['idé', 'en', 'die Idee'], ['jobb', 'ett', 'der Job'], ['vän', 'en', 'der Freund'], ['djur', 'ett', 'das Tier'], ['hund', 'en', 'der Hund'], ['katt', 'en', 'die Katze'],
    ['hjärta', 'ett', 'das Herz'], ['kyrka', 'en', 'die Kirche'], ['museum', 'ett', 'das Museum'], ['sjö', 'en', 'der See'], ['hav', 'ett', 'das Meer'], ['skog', 'en', 'der Wald'],
    ['berg', 'ett', 'der Berg'], ['blomma', 'en', 'die Blume'], ['träd', 'ett', 'der Baum'], ['väder', 'ett', 'das Wetter'], ['klocka', 'en', 'die Uhr'], ['möte', 'ett', 'das Treffen'],
    ['present', 'en', 'das Geschenk'], ['paket', 'ett', 'das Paket'], ['nyckel', 'en', 'der Schlüssel'], ['kort', 'ett', 'die Karte'], ['biljett', 'en', 'die Fahrkarte'], ['pass', 'ett', 'der Pass'],
    ['väska', 'en', 'die Tasche'], ['paraply', 'ett', 'der Regenschirm'], ['tröja', 'en', 'der Pullover'], ['spegel', 'en', 'der Spiegel'], ['mobil', 'en', 'das Handy'], ['ögonblick', 'ett', 'der Augenblick'],
    ['körkort', 'ett', 'der Führerschein'], ['sjukhus', 'ett', 'das Krankenhaus'], ['restaurang', 'en', 'das Restaurant'], ['hotell', 'ett', 'das Hotel'], ['flygplats', 'en', 'der Flughafen'], ['torg', 'ett', 'der Platz'],
    ['bro', 'en', 'die Brücke'], ['slott', 'ett', 'das Schloss']
  ],
  es: [
    ['problema', 'el', 'das Problem', 'Viele Wörter auf -ma sind männlich: el problema, el tema, el idioma.'], ['día', 'el', 'der Tag', 'Ausnahme: endet auf -a, ist aber männlich.'], ['mapa', 'el', 'die Landkarte', 'Ausnahme: endet auf -a, ist aber männlich.'],
    ['idioma', 'el', 'die Sprache', 'Viele Wörter auf -ma sind männlich.'], ['tema', 'el', 'das Thema', 'Viele Wörter auf -ma sind männlich.'], ['sistema', 'el', 'das System', 'Viele Wörter auf -ma sind männlich.'],
    ['clima', 'el', 'das Klima', 'Viele Wörter auf -ma sind männlich.'], ['sofá', 'el', 'das Sofa'], ['planeta', 'el', 'der Planet', 'Ausnahme: endet auf -a, ist aber männlich.'],
    ['mano', 'la', 'die Hand', 'Ausnahme: endet auf -o, ist aber weiblich.'], ['foto', 'la', 'das Foto', 'Kurz für la fotografía, darum weiblich.'], ['moto', 'la', 'das Motorrad', 'Kurz für la motocicleta, darum weiblich.'],
    ['agua', 'el', 'das Wasser', 'Eigentlich weiblich (el agua fría), aber vor betontem a steht el.'],
    ['leche', 'la', 'die Milch'], ['sal', 'la', 'das Salz'], ['coche', 'el', 'das Auto'], ['noche', 'la', 'die Nacht'], ['clase', 'la', 'der Unterricht'], ['gente', 'la', 'die Leute', 'Spanisch Einzahl: la gente es simpática.'],
    ['puente', 'el', 'die Brücke'], ['sangre', 'la', 'das Blut'], ['color', 'el', 'die Farbe'], ['crisis', 'la', 'die Krise'], ['viaje', 'el', 'die Reise'], ['calle', 'la', 'die Straße'],
    ['carne', 'la', 'das Fleisch'], ['lunes', 'el', 'der Montag'], ['ciudad', 'la', 'die Stadt', 'Wörter auf -dad sind weiblich.'], ['nube', 'la', 'die Wolke'], ['diente', 'el', 'der Zahn'],
    ['pared', 'la', 'die Wand'], ['reloj', 'el', 'die Uhr'], ['llave', 'la', 'der Schlüssel'], ['café', 'el', 'der Kaffee'], ['verdad', 'la', 'die Wahrheit', 'Wörter auf -dad sind weiblich.'], ['flor', 'la', 'die Blume'],
    ['árbol', 'el', 'der Baum'], ['nariz', 'la', 'die Nase'], ['viento', 'el', 'der Wind'], ['luz', 'la', 'das Licht'], ['lápiz', 'el', 'der Bleistift'], ['cama', 'la', 'das Bett'],
    ['hospital', 'el', 'das Krankenhaus'], ['estación', 'la', 'der Bahnhof', 'Wörter auf -ción sind weiblich.'], ['aeropuerto', 'el', 'der Flughafen'], ['playa', 'la', 'der Strand'], ['billete', 'el', 'die Fahrkarte'], ['maleta', 'la', 'der Koffer'],
    ['pasaporte', 'el', 'der Pass'], ['mesa', 'la', 'der Tisch'], ['silla', 'la', 'der Stuhl'], ['sol', 'el', 'die Sonne'], ['luna', 'la', 'der Mond'], ['cuchillo', 'el', 'das Messer'],
    ['cuchara', 'la', 'der Löffel'], ['tenedor', 'el', 'die Gabel'], ['razón', 'la', 'der Grund'], ['corazón', 'el', 'das Herz'], ['lugar', 'el', 'der Ort'], ['vez', 'la', 'das Mal'],
    ['pie', 'el', 'der Fuß'], ['piel', 'la', 'die Haut'], ['papel', 'el', 'das Papier'], ['canción', 'la', 'das Lied', 'Wörter auf -ción sind weiblich.'], ['examen', 'el', 'die Prüfung'], ['imagen', 'la', 'das Bild'],
    ['miedo', 'el', 'die Angst']
  ]
};
// Wo führt das Deutsche in die Irre? Schwedisch: das → ett, der/die → en (Faustregel, die oft trügt). Spanisch: der → el, die → la
function genusHint(lang, item){
  const [w, g, de, extra] = item, dart = de.split(' ')[0];
  if (lang === 'sv') {
    const guess = dart === 'das' ? 'ett' : 'en';
    return guess !== g ? `Deutsch ${de}, aber ${g} ${w}.` : '';
  }
  const guess = dart === 'der' ? 'el' : dart === 'die' ? 'la' : '';
  const contrast = guess && guess !== g ? `Deutsch ${de}, aber ${g} ${w}.` : '';
  return [contrast, extra || ''].filter(Boolean).join(' ');
}
function genGenus(lang){
  const list = GENUS[lang], st = (DB.genus && DB.genus[lang]) || {};
  // Wörter, die zuletzt falsch waren, kommen öfter
  const weak = list.filter(x => st[x[0]] && st[x[0]].last === 0);
  const item = weak.length && Math.random() < 0.4 ? pick(weak) : pick(list);
  const opts = lang === 'sv' ? ['en', 'ett'] : ['el', 'la'];
  return { kind:'genus', word:item[0], answer:item[1], options:opts, deLine:item[2], answers:[item[1]], full:`${item[1]} ${item[0]}`, note:genusHint(lang, item), label:lang === 'sv' ? 'en oder ett?' : 'el oder la?', trap:'genus' };
}

/* ---------- Registrierung: als Generatoren mit Kennzeichen „form“ ---------- */
Object.assign(GENS, {
  spot_sv:{ lang:'sv', form:true, daily:true, label:'Fehler finden', make:genSpotSv, seen:d => spotSeen('sv', d) },
  spot_es:{ lang:'es', form:true, daily:true, label:'Fehler finden', make:genSpotEs, seen:d => spotSeen('es', d) },
  trans_sv:{ lang:'sv', form:true, daily:true, label:'Umbauen', make:genTransSv },
  trans_es:{ lang:'es', form:true, daily:true, label:'Umbauen', make:genTransEs },
  time_sv:{ lang:'sv', form:true, daily:true, label:'Uhrzeiten & Zahlen', make:() => genTime('sv') },
  time_es:{ lang:'es', form:true, daily:true, label:'Uhrzeiten & Zahlen', make:() => genTime('es') },
  genus_sv:{ lang:'sv', form:true, label:'en oder ett?', make:() => genGenus('sv') },
  genus_es:{ lang:'es', form:true, label:'el oder la?', make:() => genGenus('es') }
});
