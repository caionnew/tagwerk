/* ===================== Neue Übungsformen ===================== */

/* ---------- 1) Fehler finden: ein typischer Fehler steckt im Satz ---------- */
const spotData = (de, wrongWords, wrongIdx, fixed, note, trap) => ({ kind:'spot', deLine:de, words:wrongWords, wrong:wrongIdx, full:fixed, answers:[fixed], note, trap, label:'Finde den Fehler' });
// Schwedisch: Stellung von inte & Co. (aus den Bausteinen von genInte)
function spotInteSv(){
  const vp = pick(VP_SV), adv = pick(vp[2]), s = pick(SUBJ_INTE);
  const fill = t => t.replace('{S}', s[1]).replace('{s}', s[2]).replace('{V}', vp[3][s[3]]).replace('{A}', ADV_DE[adv]);
  const rest = vp[1] ? vp[1].split(' ') : [];
  const roll = Math.random();
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
  return spotData(`${fill(vp[4])}.`, wrong, [1, 2], right.join(' ') + '.', `Im Hauptsatz steht „${adv}“ nach dem Verb. Vor dem Verb steht es nur im Nebensatz.`, 'bisats');
}
// Schwedisch: Präteritum statt „har …“ bei einem Zeitpunkt
const PAST_TIMES = [['Gestern', 'Igår'], ['Letzte Woche', 'Förra veckan'], ['Letzten Sommer', 'I somras'], ['Vor zwei Jahren', 'För två år sedan']];
function spotTempusSv(){
  const v = pick(VERBS_SV), s = pick(SUBJ_SV), tm = pick(PAST_TIMES);
  const obj = v[4].split(' ');
  const front = tm[1].split(' ');
  const right = front.concat([v[1], s[1]], obj), wrong = front.concat(['har', s[1], v[2]], obj);
  const de = `${tm[0]} ${v[6] === 's' ? s[3] : s[2]} ${s[0]} ${v[3]} ${v[5]}.`;
  return spotData(de, wrong, [front.length, front.length + 2], right.join(' ') + '.', `Mit einem Zeitpunkt in der Vergangenheit steht Präteritum (${v[1]}), nicht „har ${v[2]}“.`, 'tempus');
}
// Schwedisch: Adjektiv und bestimmte Form
function spotNpSv(){
  const N = pick(NOUNS), [de, g, dePl, sv, art, def, pl, defPl, allowed] = N;
  const A = ADJS[pick(allowed.split(''))], f = svForms(A[2]), ett = art === 'ett', da = DE_ART[g];
  const type = pick(['indef', 'def', 'defpl']);
  if (type === 'indef') {
    const good = ett ? f.t : f.base, bad = ett ? f.base : f.t;
    if (good === bad) return spotTempusSv();
    return spotData(`Da ist ${da[0]} ${A[1]}${da[2]} ${de}.`, ['Där', 'är', art, bad, sv], [3], `Där är ${art} ${good} ${sv}.`, `${sv} ist ein ${art}-Wort, darum ${ett ? 'die t-Form' : 'die Grundform'}: ${art} ${good} ${sv}.`, 'species');
  }
  if (type === 'def') {
    const artDef = ett ? 'det' : 'den';
    if (Math.random() < 0.5) return spotData(`Da ist ${da[1]} ${A[1]}e ${de}.`, ['Där', 'är', artDef, f.defSg, sv], [4], `Där är ${artDef} ${f.defSg} ${def}.`, `Doppelte Bestimmtheit: ${artDef} ${f.defSg} ${def}. Das Substantiv bekommt trotzdem die Endung.`, 'species');
    const wrongArt = ett ? 'den' : 'det';
    return spotData(`Da ist ${da[1]} ${A[1]}e ${de}.`, ['Där', 'är', wrongArt, f.defSg, def], [2], `Där är ${artDef} ${f.defSg} ${def}.`, `${sv} ist ein ${art}-Wort, darum ${artDef}: ${artDef} ${f.defSg} ${def}.`, 'species');
  }
  return spotData(`Da sind die ${A[1]}en ${dePl}.`, ['Där', 'är', 'de', f.pl, pl], [4], `Där är de ${f.pl} ${defPl}.`, `Im Plural mit de braucht auch das Substantiv die bestimmte Form: de ${f.pl} ${defPl}.`, 'species');
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
const PART_IRR = { hacer:'hecho', decir:'dicho', ver:'visto', escribir:'escrito', poner:'puesto', volver:'vuelto', abrir:'abierto', romper:'roto', morir:'muerto', leer:'leído', traer:'traído', caer:'caído', oír:'oído' };
const participle = inf => PART_IRR[inf] || (inf.endsWith('ar') ? inf.slice(0, -2) + 'ado' : inf.slice(0, -2) + 'ido');
function bankSpotsEs(){
  const out = [];
  BANK.es.forEach(it => {
    if (!it.gap || it.gap.includes(' ') || !it.hint) return;
    // Relativsätze wie „un piso que tiene/tenga“ sind je nach Lesart beides: nicht als Fehler verwenden
    if (/\b(un|una|unos|unas) \S+ que\b/.test(it.target)) return;
    const inf = it.hint.replace(/[()]/g, '').split(',')[0].trim();
    if (!/^[a-zñ]+(ar|er|ir)$/.test(inf)) return;
    const toks = it.target.split(' '), idx = toks.findIndex(t => t.replace(/[.,!?¿¡]/g, '') === it.gap);
    if (idx < 0) return;
    const swapAt = (form, extra) => { const w = toks.slice(); w[idx] = toks[idx].replace(it.gap, form); if (extra) w.splice(idx + 1, 0, extra); return w; };
    if (it.trap === 'subjuntivo') {
      // yo und él/ella haben im Subjuntivo dieselbe Form: im Zweifel dritte Person, außer der deutsche Satz sagt „ich“
      const cands = [0, 1, 2, 3, 4].filter(k => conjugate(inf, 'subj', k) === it.gap);
      if (!cands.length) return;
      const p = cands.includes(2) && cands.includes(0) ? (/\b(dass|wenn|bevor|damit|ob) ich\b/.test(it.de) ? 0 : 2) : cands[0];
      const ind = conjugate(inf, 'pres', p);
      if (!ind || ind === it.gap) return;
      out.push(() => spotData(it.de, swapAt(ind), [idx], it.target, 'Hier verlangt der Satz den Subjuntivo, etwa nach querer que, es importante que, ojalá, para que oder cuando mit Zukunftsbezug.', 'subjuntivo'));
    }
    if (it.trap === 'perfecto' && /\b(ayer|pasado|pasada|anoche|en \d{4}|\d{4})\b/i.test(it.target)) {
      const p = [0, 1, 2, 3, 4].find(k => conjugate(inf, 'indef', k) === it.gap);
      if (p == null) return;
      out.push(() => spotData(it.de, swapAt(HABER[p], participle(inf)), [idx, idx + 1], it.target, 'Mit einem abgeschlossenen Zeitpunkt (ayer, la semana pasada, 2015) steht Indefinido, nicht Perfecto.', 'perfecto'));
    }
  });
  return out;
}
let BANK_SPOTS_ES = null;
function genSpotSv(){ const r = Math.random(); return r < 0.5 ? spotInteSv() : r < 0.75 ? spotTempusSv() : spotNpSv(); }
function genSpotEs(){
  if (!BANK_SPOTS_ES) BANK_SPOTS_ES = bankSpotsEs();
  const r = Math.random();
  if (r < 0.3 && BANK_SPOTS_ES.length) return pick(BANK_SPOTS_ES)();
  if (r < 0.65) return spotSwapEs(genSerEstar, a => SE_SWAP[a] || a, 'serestar');
  return spotSwapEs(genPorPara, a => (a === 'por' ? 'para' : 'por'), 'porpara');
}

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
      return transData(main, intro[0] + ' ', alt(`${intro[0]} ${s[0]} ${adv} ${vp[0]}${rest}.`), `Im Nebensatz rückt „${adv}“ vor das Verb.`, 'bisats');
    }
    return transData(main, vp[6] + ' ', alt(`${vp[6]} ${vp[0]} ${s[0]} ${adv}${rest}.`), 'Das Verb bleibt an zweiter Stelle, das Subjekt rückt dahinter.', 'inversion');
  }
  const v = pick(VERBS_SV), s = pick(SUBJ_SV);
  const src = `${capFirst(s[1])} ${SV_PRES[v[0]]} ${v[4]}.`;
  const ans = `Igår ${v[1]} ${s[1]} ${v[4]}.`;
  return transData(src, 'Igår ', [ans, ans.replace('Igår', 'I går')], `Zwei Dinge ändern sich: Präteritum (${v[1]}) und Inversion, weil „igår“ vorn steht.`, 'tempus');
}
// Spanisch: Bausteine für Subjuntivo und Zeiten
const ES_VP = [['venir', 'mañana'], ['llegar', 'a tiempo'], ['estudiar', 'más'], ['tener', 'paciencia'], ['hacer', 'los deberes'], ['estar', 'en casa'], ['decir', 'la verdad'], ['salir', 'temprano'], ['llamar', 'a su madre'], ['volver', 'pronto'],
  ['escribir', 'más a menudo'], ['comer', 'mejor'], ['trabajar', 'menos'], ['aprender', 'a nadar'], ['viajar', 'en verano'], ['ayudar', 'en casa']];
const ES_SUBJ = [['', 1], ['Ana', 2], ['', 3], ['Los niños', 4]];
const ES_TRIG = ['Quiero que', 'Es importante que', 'Ojalá', 'Espero que', 'No creo que'];
const ES_DAY = [['trabajar', 'mucho'], ['comer', 'en casa'], ['salir', 'temprano'], ['ver', 'una película'], ['leer', 'el periódico'], ['estar', 'en casa'], ['tener', 'tiempo'], ['dormir', 'bien'], ['hacer', 'deporte'], ['ir', 'al cine'],
  ['escribir', 'un correo largo'], ['correr', 'por el parque'], ['comprar', 'fruta en el mercado'], ['estudiar', 'para el examen'], ['escuchar', 'la radio'], ['viajar', 'en tren'], ['cocinar', 'para todos'], ['bailar', 'salsa'], ['recibir', 'un paquete'], ['aprender', 'algo nuevo'], ['llamar', 'a la abuela'], ['ayudar', 'a los vecinos']];
function genTransEs(){
  const r = Math.random();
  if (r < 0.45) {
    const [inf, comp] = pick(ES_VP), [subj, p] = pick(ES_SUBJ), trig = pick(ES_TRIG);
    const pres = conjugate(inf, 'pres', p), subjF = conjugate(inf, 'subj', p);
    const src = `${subj ? subj + ' ' : ''}${subj ? pres : capFirst(pres)} ${comp}.`;
    const ans = `${trig} ${subj ? subj.toLowerCase() === 'los niños' ? 'los niños ' : subj + ' ' : ''}${subjF} ${comp}.`;
    return transData(src, trig + ' ', [ans], `Nach „${trig.toLowerCase()}“ folgt der Subjuntivo: ${subjF}.`, 'subjuntivo');
  }
  const [inf, comp] = pick(ES_DAY), p = pick([0, 2, 3]);
  const who = p === 2 ? 'Ana ' : '';
  if (r < 0.75) {
    const src = `Hoy ${who}${conjugate(inf, 'pres', p)} ${comp}.`;
    const ans = `Ayer ${who}${conjugate(inf, 'indef', p)} ${comp}.`;
    return transData(src, 'Ayer ', [ans], `Mit „ayer“ steht Indefinido: ${conjugate(inf, 'indef', p)}.`, 'pasado');
  }
  const src = `Ayer ${who}${conjugate(inf, 'indef', p)} ${comp}.`;
  const perf = `Hoy ${who}${HABER[p]} ${participle(inf)} ${comp}.`;
  return transData(src, 'Hoy ', [perf, `Hoy ${who}${conjugate(inf, 'indef', p)} ${comp}.`], `Mit „hoy“ nimmt man in Spanien das Perfecto (${HABER[p]} ${participle(inf)}). In Lateinamerika ist auch Indefinido üblich.`, 'perfecto', 'Dieselbe Handlung, nur heute schon passiert (nicht: passiert gerade).');
}

/* ---------- 3) Uhrzeiten & Zahlen ---------- */
const SV_H = ['tolv', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv'];
const ES_H = ['doce', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];
function timeWords(lang, h, m){
  const n = h % 12 || 12, nx = (h % 12) + 1;
  if (lang === 'sv') {
    const H = SV_H[n], X = SV_H[nx];
    const map = { 0:[`klockan ${H}`, H], 5:[`fem över ${H}`], 10:[`tio över ${H}`], 15:[`kvart över ${H}`], 20:[`tjugo över ${H}`, `tio i halv ${X}`], 25:[`fem i halv ${X}`], 30:[`halv ${X}`], 35:[`fem över halv ${X}`], 40:[`tjugo i ${X}`, `tio över halv ${X}`], 45:[`kvart i ${X}`], 50:[`tio i ${X}`], 55:[`fem i ${X}`] };
    return map[m];
  }
  const art = k => (k === 1 ? 'la' : 'las'), verb = k => (k === 1 ? 'Es' : 'Son');
  const H = `${art(n)} ${ES_H[n]}`, X = `${art(nx)} ${ES_H[nx]}`;
  const map = { 0:[H], 5:[`${H} y cinco`], 10:[`${H} y diez`], 15:[`${H} y cuarto`], 20:[`${H} y veinte`], 25:[`${H} y veinticinco`], 30:[`${H} y media`], 35:[`${X} menos veinticinco`], 40:[`${X} menos veinte`], 45:[`${X} menos cuarto`], 50:[`${X} menos diez`], 55:[`${X} menos cinco`] };
  const forms = map[m];
  const v = m >= 35 ? verb(nx) : verb(n);
  return forms.concat(forms.map(f => `${v.toLowerCase()} ${f}`));
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
    ['radio', 'la', 'das Radio', 'In Spanien la radio, in Teilen Lateinamerikas el radio für das Gerät.'], ['agua', 'el', 'das Wasser', 'Eigentlich weiblich (el agua fría), aber vor betontem a steht el.'],
    ['leche', 'la', 'die Milch'], ['sal', 'la', 'das Salz'], ['coche', 'el', 'das Auto'], ['noche', 'la', 'die Nacht'], ['clase', 'la', 'der Unterricht'], ['gente', 'la', 'die Leute', 'Spanisch Einzahl: la gente es simpática.'],
    ['puente', 'el', 'die Brücke'], ['sangre', 'la', 'das Blut'], ['color', 'el', 'die Farbe'], ['crisis', 'la', 'die Krise'], ['viaje', 'el', 'die Reise'], ['calle', 'la', 'die Straße'],
    ['mar', 'el', 'das Meer'], ['carne', 'la', 'das Fleisch'], ['lunes', 'el', 'der Montag'], ['ciudad', 'la', 'die Stadt', 'Wörter auf -dad sind weiblich.'], ['nube', 'la', 'die Wolke'], ['diente', 'el', 'der Zahn'],
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
  spot_sv:{ lang:'sv', form:true, daily:true, label:'Fehler finden', make:genSpotSv },
  spot_es:{ lang:'es', form:true, daily:true, label:'Fehler finden', make:genSpotEs },
  trans_sv:{ lang:'sv', form:true, daily:true, label:'Umbauen', make:genTransSv },
  trans_es:{ lang:'es', form:true, daily:true, label:'Umbauen', make:genTransEs },
  time_sv:{ lang:'sv', form:true, daily:true, label:'Uhrzeiten & Zahlen', make:() => genTime('sv') },
  time_es:{ lang:'es', form:true, daily:true, label:'Uhrzeiten & Zahlen', make:() => genTime('es') },
  genus_sv:{ lang:'sv', form:true, label:'en oder ett?', make:() => genGenus('sv') },
  genus_es:{ lang:'es', form:true, label:'el oder la?', make:() => genGenus('es') }
});
