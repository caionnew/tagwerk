/* ---------- Themen ---------- */
const LANG = {
  es:{ name:'Español', deName:'Spanisch', deAcc:'ins Spanische', tts:'es-ES', chars:['á','é','í','ó','ú','ñ','ü','¿','¡'], ph:'Escribe aquí …' },
  sv:{ name:'Svenska', deName:'Schwedisch', deAcc:'ins Schwedische', tts:'sv-SE', chars:['å','ä','ö','é'], ph:'Skriv här …' }
};
const FALSE_FRIEND = 'Falscher Freund: Das ähnliche Wort bedeutet etwas anderes.';
const TRAPS = {
  sv:[
    { id:'bisats', label:'Wortstellung im Nebensatz', kind:'order', gen:'inte', short:'Im Nebensatz stehen inte, aldrig, alltid und ähnliche Wörter vor dem Verb, und das Verb wandert nicht ans Ende.', rule:'Gilt nach att, eftersom, om, när, som, fast und ähnlichen Wörtern. Auch aldrig, alltid, kanske und ofta stehen dort vor dem Verb: …att han inte kommer, …eftersom jag alltid glömmer det.' },
    { id:'inversion', label:'Inversion & „inte“', kind:'order', short:'Das Verb steht an zweiter Stelle. Steht etwas anderes vorn, folgt das Subjekt erst danach.', rule:'Idag jobbar jag inte. När jag kommer hem lagar jag mat. „inte“ kommt erst nach dem Subjekt.' },
    { id:'tempus', label:'Präteritum oder Perfekt', kind:'form', gen:'tempus', short:'Mit Zeitpunkt in der Vergangenheit: Präteritum. Ohne Zeitpunkt, als Erfahrung oder bis heute andauernd: Perfekt.', rule:'Igår åt jag pizza, auch wenn man im Deutschen „habe gegessen“ sagt. Perfekt (har + Supinum) für Erfahrungen und Ergebnisse: Jag har aldrig varit i Kiruna.' },
    { id:'prep', label:'Verben mit Präposition', kind:'gen', gen:'prep_sv', short:'Viele Verben und Adjektive haben eine feste Präposition, oft eine andere als im Deutschen.', rule:'Am besten als Ganzes lernen: tänka på, vänta på, rädd för, intresserad av, stolt över, vänja sig vid.' },
    { id:'lesen', label:'Lücken aus Lesetexten', kind:'gen', gen:'textgap_sv', short:'Ein Wort aus einem Satz eines gelesenen Textes ergänzen, mit Grundform als Hilfe.', rule:'Holt Wörter aus Texten zurück, die du schon verstanden hast: Abruf festigt mehr als erneutes Lesen.' },
    { id:'verbind', label:'Konnektoren & feste Verbindungen', kind:'gen', gen:'verbind_sv', short:'därför, dessutom, däremot verbinden Sätze; Verben und Nomen gehören fest zusammen.', rule:'Nach därför, dessutom und däremot am Satzanfang folgt Inversion. Feste Verbindungen lernt man als Ganzes: fatta ett beslut, ställa en fråga, ta hänsyn till, det spelar ingen roll.' },
    { id:'species', label:'Adjektivendungen & bestimmte Form', kind:'gen', gen:'np', short:'Doppelt bestimmt: den/det/de + Adjektiv auf -a + bestimmte Form. min/mitt/mina richten sich nach en/ett; danach unbestimmt, nach den här bestimmt.', rule:'Adjektiv in der Grundform bei en-Wörtern (en stor bil), mit -t bei ett-Wörtern (ett stort hus), mit -a im Plural und in der bestimmten Form (det stora huset).' },
    { id:'plural', label:'Pluralformen', kind:'gen', gen:'plural_sv', short:'Mehrzahl auf -or (flickor), -ar (bilar), -er (datorer), -n (äpplen) oder ohne Endung (hus), manchmal mit Umlaut (böcker, män). Bestimmt kommt -na oder -en dazu.', rule:'flicka → flickor → flickorna, bil → bilar → bilarna, dator → datorer → datorerna, äpple → äpplen → äpplena, hus → hus → husen, lärare → lärare → lärarna, bok → böcker → böckerna, man → män → männen.' },
    { id:'partikel', label:'Partikelverben', kind:'order', short:'Die Partikel ist betont und gehört zum Verb. „inte“ steht zwischen Verb und Partikel: Jag tycker inte om kaffe.', rule:'tycka om, ta med, komma ihåg, hålla med: Die Partikel ist betont. Jag kommer inte ihåg.' },
    { id:'modal', label:'Modalpartikeln', kind:'form', short:'ju = ja, doch (bekannt); väl = doch, oder? (Zustimmung erwartet); nog = wohl; visst = doch, sicher; då = denn; nämligen = nämlich. Im Hauptsatz nach dem Verb, im Nebensatz davor.', rule:'Det vet du ju. Du kommer väl? Han kommer nog snart. Visst är det fint här? Vad gör du här då? Jag är nämligen sjuk. Widerspruch auf eine verneinte Frage: jo, nicht ja.' },
    { id:'sin', label:'sin/sitt/sina vs. hans/hennes', kind:'form', short:'sin/sitt/sina nur, wenn der Besitzer Subjekt desselben Satzes ist.', rule:'Anna ringer sin mamma. Aber: Lisa och hennes man bor i Lund, und im Nebensatz: …att hennes bror är sjuk.' },
    { id:'tid', label:'Präpositionen bei Zeit & Ort', kind:'form', short:'Dauer: i två år. Vor: för … sedan. In (Zukunft): om.', rule:'på måndag = kommenden Montag, i måndags = letzten Montag. Verneinte Dauer mit på: inte på flera veckor. Ort: på jobbet, hos läkaren.' },
    { id:'framtid', label:'Zukunft & Modalverben', kind:'form', short:'behöver inte = muss nicht, får = darf, ska = Plan, kommer att = Prognose.', rule:'„Du musst nicht“ heißt du behöver inte. „måste inte“ ist mehrdeutig, „får inte“ heißt „darf nicht“. bli = werden, stanna = bleiben.' },
    { id:'passiv', label:'s-Passiv, „man“ & „det finns“', kind:'form', short:'Passiv mit -s (öppnas, byggdes). „es gibt“ heißt det finns.', rule:'Allgemeine Aussagen oft mit man: Här talar man svenska.' },
    { id:'idiom', label:'Redewendungen', kind:'form', short:'Feste Bilder, die man nicht Wort für Wort übersetzt: ta det lugnt, kosta skjortan, ha tummen mitt i handen.', rule:'Manche Bilder gibt es in beiden Sprachen (slå två flugor i en smäll), andere nur im Schwedischen (ingen ko på isen, inte ha alla hästar hemma). Am besten als Ganzes lernen.' },
    { id:'falska', label:'Falsche Freunde', kind:'form', short:FALSE_FRIEND, rule:'bleiben = stanna, lustig = rolig, Urlaub = semester, Semester = termin, Fahrt = resa, Rock = kjol, brav = snäll, bekommen = få, Termin = tid.' }
  ],
  es:[
    { id:'prep', label:'Verben mit Präposition', kind:'gen', gen:'prep_es', short:'Viele Verben und Adjektive haben eine feste Präposition, oft eine andere als im Deutschen.', rule:'Am besten als Ganzes lernen: soñar con, pensar en, acordarse de, dejar de, empezar a, confiar en, tener ganas de.' },
    { id:'lesen', label:'Lücken aus Lesetexten', kind:'gen', gen:'textgap_es', short:'Ein Wort aus einem Satz eines gelesenen Textes ergänzen, mit Grundform als Hilfe.', rule:'Holt Wörter aus Texten zurück, die du schon verstanden hast: Abruf festigt mehr als erneutes Lesen.' },
    { id:'concord', label:'Begleiter & Adjektive anpassen', kind:'gen', gen:'det_es', short:'Possessiv, Demonstrativ und Adjektiv richten sich nach Geschlecht und Zahl des Nomens.', rule:'nuestro/nuestra/nuestros/nuestras, este/esta/estos/estas, mi/mis. Vorsicht bei Ausnahmen: el problema, el día, el mapa, la mano, la foto, la radio: nuestro problema, las manos pequeñas.' },
    { id:'verbind', label:'Konnektoren & feste Verbindungen', kind:'gen', gen:'verbind_es', short:'sin embargo, por lo tanto, en cambio verbinden Sätze; Verben und Nomen gehören fest zusammen.', rule:'para que, en cuanto (Zukunft) und siempre que verlangen Subjuntivo. Feste Verbindungen als Ganzes lernen: tomar una decisión, hacer una pregunta, dar un paseo, tener razón.' },
    { id:'konjugation', label:'Verbformen', kind:'gen', gen:'conj', short:'Signale: normalmente = Präsens, ayer = Indefinido, antes/siempre = Imperfecto, es importante que = Subjuntivo.', rule:'Unregelmäßige Formen wie tuve, hice, fui, sea, vaya lohnen sich auswendig.' },
    { id:'serestar', label:'ser oder estar', kind:'form', gen:'serestar', short:'ser für Identität und Eigenschaften, estar für Zustand und Ort.', rule:'Auch ser: Uhrzeit und wo ein Ereignis stattfindet (la fiesta es en casa de Ana). Auch estar: Ergebnis und estar + Gerundium.' },
    { id:'pasado', label:'Indefinido vs. Imperfecto', kind:'form', short:'Indefinido für abgeschlossene Ereignisse, Imperfecto für Hintergrund und Gewohnheit.', rule:'Estaba leyendo (laufende Handlung) cuando sonó el teléfono (Ereignis). Begrenzte Dauer ebenfalls Indefinido: Estuvo tres años en Berlín.' },
    { id:'perfecto', label:'Perfecto vs. Indefinido', kind:'form', short:'In Spanien: heute, diese Woche, Erfahrung = Perfecto. Gestern, 2018 = Indefinido.', rule:'In Lateinamerika steht meist Indefinido, auch für heute. Beides wird verstanden.' },
    { id:'subjuntivo', label:'Subjuntivo oder Indikativ', kind:'form', short:'Nach Wunsch, Gefühl, Zweifel und „cuando“ mit Zukunftsbezug: Subjuntivo.', rule:'quiero que, me alegro de que, no creo que, es importante que, para que, antes de que, sin que, ojalá. como si immer mit Imperfecto de subjuntivo (como si lo supiera). Hauptsatz in der Vergangenheit: quería que vinieras. Aber: creo que tiene razón, aunque es rico (Tatsache), cuando llegué (Vergangenheit): Indikativ.' },
    { id:'perifrasis', label:'Verbalperiphrasen', kind:'form', gen:'perifrasis', short:'Hilfsverb + Infinitiv oder Gerundium: llevo dos horas esperando, acabo de llegar, vuelve a llover, suelo, me puse a, dejé de, estoy a punto de.', rule:'llevar + Zeitraum + Gerundium = seit … (llevo tres años estudiando). acabar de = gerade. volver a = wieder. soler = gewöhnlich. ponerse a, echarse a = anfangen zu. dejar de = aufhören zu. estar a punto de = gleich, beinahe. seguir + Gerundium = immer noch. ir + Gerundium = allmählich.' },
    { id:'porpara', label:'por oder para', kind:'form', gen:'porpara', short:'para = Zweck, Ziel, Frist. por = Grund, Preis, durch.', rule:'para ti, para el viernes, para trabajar. gracias por, por 200 euros, por el parque, por correo, por eso.' },
    { id:'pronombres', label:'Objektpronomen', kind:'order', short:'Pronomen vor das konjugierte Verb oder an Infinitiv, Gerundium und bejahten Imperativ hängen.', rule:'te lo doy, ¿puedes explicármelo?, dámelo. le/les + lo/la wird zu se lo/se la.' },
    { id:'gustar', label:'gustar & Co.', kind:'form', short:'Das Verb richtet sich nach dem, was gefällt: me gustan los libros.', rule:'Genauso encantar, interesar, doler, faltar, parecer, quedar, molestar.' },
    { id:'condicional', label:'Konditional & si-Sätze', kind:'form', short:'Irreal: si + tuviera, dann Konditional (viajaría).', rule:'Realer Fall: si + Präsens (si llueve, nos quedamos). Höflich: me gustaría, podrías, deberías.' },
    { id:'reflexivo', label:'Reflexivverben & „se“', kind:'form', short:'Reflexives Verb: Das Pronomen gehört dazu.', rule:'levantarse, acordarse de, quedarse, irse. se me olvidó, se me cayó: Es ist mir passiert. se habla: man spricht.' },
    { id:'preposiciones', label:'Präpositionen & „a“', kind:'form', short:'Feste Präposition oder persönliches „a“, nicht wörtlich aus dem Deutschen.', rule:'veo a mi hermana, pienso en ti, sueño con, depende de, se casó con, se enamoró de, tarda en. desde hace = seit, hace = vor.' },
    { id:'idiom', label:'Redewendungen', kind:'form', short:'Feste Bilder, die man nicht Wort für Wort übersetzt: costar un ojo de la cara, meter la pata, tomar el pelo.', rule:'Manche Bilder gibt es in beiden Sprachen (tirar la toalla), andere nur im Spanischen (no tener pelos en la lengua, hablar por los codos). Am besten als Ganzes lernen.' },
    { id:'falsos', label:'Falsche Freunde', kind:'form', short:FALSE_FRIEND, rule:'Firma = empresa (firma = Unterschrift), Mantel = abrigo (mantel = Tischdecke), Gymnasium = instituto, Rente = pensión, Konkurrenz = competencia, Prospekt = folleto.' }
  ]
};
const SIZES = {
  kurz:{ label:'Kurz', newPer:3, maxRev:10, gen:4 },
  normal:{ label:'Normal', newPer:6, maxRev:20, gen:6 },
  lang:{ label:'Lang', newPer:10, maxRev:35, gen:8 }
};
const SECS = { tiles:30, cloze:25, free:45, gen:20, dict:30 };
const NAMES = ['anna','peter','lisa','jonas','juan','ana','pablo','madrid','göteborg','sverige','uppsala','lund','stockholm','norge','méxico','barcelona','berlín','colonia','sevilla','perú','chile','españa'];

/* ---------- Hilfsfunktionen ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const fmt = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => fmt(new Date());
const addDays = (ds, n) => { const [y, m, d] = ds.split('-').map(Number); return fmt(new Date(y, m - 1, d + n)); };
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };
const deacc = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function norm(s, lang){
  let t = String(s || '').toLowerCase().replace(/[’`´]/g, "'").replace(/[.!?¡¿,;"„“”«»()…]/g, ' ').replace(/[–—]/g, ' ').replace(/\s+/g, ' ').trim();
  if (lang === 'sv') t = t.replace(/\bi (dag|morgon|går|kväll|morse|natt)\b/g, 'i$1');
  else if (lang === 'es') t = t.replace(/^(yo|tú|tu|él|ella|nosotros|nosotras|ellos|ellas|usted|ustedes) (?=\S+ \S)/, '');
  return t;
}
// Niveau eines Satzes, grob geschätzt: Länge, Nebensätze, anspruchsvolle Formen (Plusquamperfekt, Konditional, Subjuntivo, Passiv).
// 1 = Grundlagen (etwa A2), 2 = Mittelstufe (B1), 3 = Fortgeschritten (B2). Gleiche Regel wie in tests/unit/level.test.js.
const LVL_SUB = { sv:/(?:^|\s)(att|som|eftersom|om|när|medan|innan|fast|trots|så att|för att|ifall|än|vilket|hur|varför)(?=\s)/g, es:/(?:^|\s)(que|cuando|porque|aunque|si|mientras|donde|como|cual|quien)(?=\s)/g };
const LVL_HARD = { sv:/(?:^|\s)(skulle|hade|lär|borde|\S+(?:ades|ades|des|tes|ogs|ass|sades)|\S+as(?= (?:av|efter|innan|senast|i|på)\b))(?=\s|[.,!?]|$)/, es:/(?:^|\s)(\S+ría[ns]?|\S+(?:ara|iera|ase|iese)[ns]?|haya[ns]?|hubiera[ns]?|hubiese[ns]?|habría[ns]?|se (?:lo|la|le|los|las|me|te|nos)|me (?:lo|la|las|los)|te (?:lo|la|las|los)|llevábamos|ocurrirá)(?=\s|[.,!?]|$)/ };
function estLevel(lang, t){
  const x = ' ' + String(t).toLowerCase().replace(/[.,!?¡¿;:]/g, ' ') + ' ';
  const w = String(t).split(/\s+/).length, sub = (x.match(LVL_SUB[lang]) || []).length, hard = LVL_HARD[lang].test(x) ? 1 : 0;
  const sc = w + 3 * sub + 3 * hard;
  return sc <= 8 ? 1 : sc <= 13 ? 2 : 3;
}
function tokens(s){ return String(s).replace(/[.!?¡¿,;"„“”«»()…]/g, ' ').split(/\s+/).filter(Boolean); }

/* ---------- Satzbank ---------- */
let BANK = { sv:[], es:[] };
// Position der Lücke im Zielsatz: nur ganze Wörter. Eine reine Zeichensuche fände „en“ zuerst in „Pienso“
// und „es“ in „fiesta“; dann stünde die Lücke im falschen Wort.
function gapPos(target, gap){
  if (!gap) return -1;
  const L = 'A-Za-zÀ-ÖØ-öø-ÿ', re = new RegExp(`(?<![${L}])${gap.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![${L}])`);
  const m = re.exec(target);
  return m ? m.index : target.indexOf(gap);
}
function buildBank(){
  BANK = { sv:[], es:[] };
  ['sv', 'es'].forEach(lang => {
    TRAPS[lang].forEach(tr => {
      const raw = CONTENT[lang][tr.id];
      if (!raw) return;
      raw.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
        const p = line.split('|').map(x => x.trim());
        if (p.length < 2) return;
        const [de, target, gap = '', hint = '', alts = '', level = '', note = ''] = p;
        const gaps = gap ? gap.split('/').map(x => x.trim()).filter(Boolean) : [];
        const altList = alts ? alts.split(';;').map(x => x.trim()).filter(Boolean) : [];
        if (gaps[0]) {
          // Lückenfüllungen, die sich aus den alternativen Sätzen ergeben (gleicher Anfang und gleiches Ende)
          const pos = gapPos(target, gaps[0]);
          const pre = target.slice(0, pos), post = target.slice(pos + gaps[0].length);
          altList.forEach(a => { if (pos >= 0 && a.startsWith(pre) && a.endsWith(post) && a.length > pre.length + post.length) { const fill = a.slice(pre.length, a.length - post.length).trim(); if (fill && !gaps.includes(fill)) gaps.push(fill); } });
        }
        BANK[lang].push({ id:lang + ':' + hash(target), lang, trap:tr.id, kind:tr.kind === 'order' ? 'order' : 'form', de, target, gap:gaps[0] || '', gapAlts:gaps, hint, alts:altList, lvlTag:{ A2:1, B1:2, B2:3 }[level] || 0, note });
      });
    });
    (DB.own[lang] || []).forEach(o => BANK[lang].push({ id:o.id, lang, trap:'eigene', kind:'order', de:o.de, target:o.target, gap:'', gapAlts:[], hint:'', alts:[], own:true }));
    (DB.tat[lang] || []).forEach(o => BANK[lang].push({ id:o.id, lang, trap:o.trap, kind:'order', de:o.de, target:o.target, gap:'', gapAlts:[], hint:'', alts:[], own:o.trap === 'eigene' && !o.auto, tat:o }));
  });
  // Niveau: angegeben in der sechsten Spalte (A2, B1, B2), sonst geschätzt
  ['sv', 'es'].forEach(lang => BANK[lang].forEach(it => { it.lvl = it.lvlTag || estLevel(lang, it.target); }));
}
const itemById = id => BANK.sv.find(i => i.id === id) || BANK.es.find(i => i.id === id);
function trapMeta(lang, id){
  if (id === 'eigene') return { id, label:'Gesammelte Sätze', kind:'order', short:'', rule:'' };
  return TRAPS[lang].find(t => t.id === id);
}

// Versionsnummer, setzt tools/build.js aus package.json ein
const APP_VERSION = '@VERSION@';
/* ---------- Speicher ---------- */
const KEY = 'tagwerk-offline-v1';
const freshDB = () => ({ v:3, settings:{ size:'normal', lang:'sv', refill:true }, used:{}, tatFetch:{}, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null });
let DB = freshDB();
function load(){
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) adoptDB(JSON.parse(raw));
  } catch (e) {
    // Unlesbaren Stand zur Seite legen, bevor ein späteres Speichern ihn überschreibt
    try { const raw = localStorage.getItem(KEY); if (raw) localStorage.setItem(KEY + '-unlesbar', raw); } catch (e2) {}
    note('Gespeicherte Daten ließen sich nicht lesen. Spiel ein Backup ein, falls du eines hast.', 'warn');
  }
}
// Gespeicherten Stand oder Backup übernehmen, auch aus alten Versionen: fehlende Teile ergänzen, alte Einstellungen und
// Wiederholungsdaten umrechnen. Gleiche Regeln für den Start und fürs Einspielen eines Backups.
function adoptDB(d){
  DB = Object.assign(freshDB(), d);
  DB.settings = Object.assign(freshDB().settings, d.settings || {});
  if (!d.settings || !d.settings.size) DB.settings.size = d.settings && d.settings.newPerDay === 3 ? 'kurz' : d.settings && d.settings.newPerDay === 10 ? 'lang' : 'normal';
  DB.own = Object.assign({ sv:[], es:[] }, d.own || {});
  DB.tat = Object.assign({ sv:[], es:[] }, d.tat || {});
  migrateStates();
}
function migrateStates(){
  const old = [0, 1, 2, 4, 8, 16, 32, 64];
  Object.values(DB.st).forEach(st => {
    if (st.s != null) return;
    const ivl = old[Math.min(st.lv || 0, 7)] || 1;
    st.s = Math.max(0.5, ivl); st.d = Math.min(10, Math.max(1, 5 + 0.5 * ((st.bad || 0) - (st.ok || 0))));
    st.ivl = ivl; st.last = addDays(st.due || today(), -ivl); st.reps = st.ok || 0; st.lapses = st.bad || 0;
  });
}
// Backup: genau das gespeicherte Objekt, lesbar über alle Versionen hinweg
const backupName = () => `tagwerk-backup-${today()}.json`;
const backupText = () => JSON.stringify(DB, null, 1);
function backupFile(){
  const name = backupName(), text = backupText();
  try { return new File([text], name, { type:'application/json' }); } catch (e) { return null; }
}
function canShareBackup(){
  try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files:[new File(['{}'], 'tagwerk.json', { type:'application/json' })] })); } catch (e) { return false; }
}
function parseBackup(text){
  try {
    const d = JSON.parse(String(text).replace(/^\uFEFF/, '').trim());
    if (!d || typeof d !== 'object' || Array.isArray(d) || !d.st || typeof d.st !== 'object') return null;
    return d;
  } catch (e) { return null; }
}
function applyBackup(d){ adoptDB(d); flushSave(); buildBank(); runsFromDB(); }
// Nach Einspielen oder Rückgängig: Ein offenes Tagwerk kommt aus dem neuen Stand, nicht aus dem Arbeitsspeicher von vorher
// (sonst ginge „Fortsetzen“ ins alte Tagwerk, und das nächste Speichern schriebe es über das eingespielte).
function runsFromDB(){ S.run = null; S.dailyRun = null; restoreRun(); }
function backupSummary(){
  const n = Object.keys(DB.st || {}).length, days = Object.keys(DB.log || {}).length;
  return `${n === 1 ? '1 Satz' : `${n} Sätze`}, ${days === 1 ? '1 Übungstag' : `${days} Übungstage`}`;
}
let saveTimer = null;
// Speicherbedarf in Zeichen (≈ Byte): eigener Lernstand und alles andere unter derselben Adresse.
// Firefox erlaubt pro Adresse etwa 5 MB localStorage, alle Seiten unter caionnew.github.io teilen sich das.
const STORE = { own:0, other:0, limit:5 * 1024 * 1024, persisted:null };
function measureStore(){
  let own = 0, other = 0;
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i), n = k.length + (localStorage.getItem(k) || '').length; if (k === KEY) own = n; else other += n; } } catch (e) {}
  STORE.own = own; STORE.other = other;
}
const storeUsed = () => STORE.own + STORE.other;
const STORE_WARN = 3 * 1024 * 1024;
function save(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const json = JSON.stringify(DB); STORE.own = json.length;
    try { localStorage.setItem(KEY, json); }
    catch (e) { note('Speichern ist fehlgeschlagen. Exportier zur Sicherheit ein Backup unter Einstellungen.', 'warn'); render(); }
  }, 150);
}
// Sofort speichern, wenn die App in den Hintergrund geht oder geschlossen wird (Android beendet Apps oft ohne Vorwarnung)
function flushSave(){ clearTimeout(saveTimer); try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {} }
// Tagesstand je Sprache (für den Verlauf): geübt, gefestigt, geschätzt abrufbar
function snapshot(){
  const t = today(), snap = {};
  ['sv', 'es'].forEach(l => {
    let n = 0, m = 0, k = 0;
    BANK[l].forEach(i => { const st = stOf(i.id); if (!st) return; n++; if ((st.ivl || 0) >= MATURE) m++; k += FSRS.retrievability(st, t); });
    if (n) snap[l] = { n, m, k:Math.round(k) };
  });
  snapshotExtra(snap);
  DB.snap = DB.snap || {};
  if (Object.keys(snap).length) { DB.snap[t] = snap; save(); }
}
function persistRun(){
  const r = S.run;
  if (r && r.kind === 'daily') DB.run = r.finished ? null : { date:today(), lang:r.lang, queue:r.queue, idx:r.idx, ok:r.ok, bad:r.bad, strongBefore:r.strongBefore, res:r.res, missed:r.missed, secs:r.secs, combo:r.combo, best:r.best };
  save();
}
function dayLog(d, lang){ const x = DB.log[d] && DB.log[d][lang]; return typeof x === 'number' ? { n:x } : (x || {}); }
function logDay(lang, f){
  const d = today();
  DB.log[d] = DB.log[d] || {};
  const x = dayLog(d, lang);
  Object.keys(f).forEach(k => { x[k] = (x[k] || 0) + f[k]; });
  DB.log[d][lang] = x;
  const keys = Object.keys(DB.log).sort();
  while (keys.length > 400) delete DB.log[keys.shift()];
}
const logAct = (lang, n) => logDay(lang, { n:n || 1 });
const dayDiff = (a, b) => Math.round((new Date(a.slice(0, 4), a.slice(5, 7) - 1, a.slice(8, 10)) - new Date(b.slice(0, 4), b.slice(5, 7) - 1, b.slice(8, 10))) / 86400000);
// Serie: Ein Tag zählt, wenn ein Tagwerk erledigt wurde. Ein ausgelassener Tag pro 7 Tage unterbricht sie nicht.
function streakData(){
  const days = Object.keys(DB.done).filter(x => DB.done[x]).sort();
  const t = today(), free = new Set();
  let cur = 0, best = 0, lastFree = null;
  if (!days.length) return { current:0, longest:0, free };
  for (let x = days[0]; x <= t; x = addDays(x, 1)) {
    if (DB.done[x]) { cur++; best = Math.max(best, cur); continue; }
    if (x === t) break;
    const nx = addDays(x, 1);
    if (cur > 0 && (DB.done[nx] || nx === t) && (!lastFree || dayDiff(x, lastFree) >= 7)) { free.add(x); lastFree = x; }
    else { cur = 0; lastFree = null; }
  }
  return { current:cur, longest:best, free };
}
const streak = () => streakData().current;
function sumLog(lang, days, key){ let n = 0; for (let k = 0; k < days; k++) n += dayLog(addDays(today(), -k), lang)[key] || 0; return n; }
function mondayOf(ds){ const [y, m, d] = ds.split('-').map(Number); const dt = new Date(y, m - 1, d); const wd = (dt.getDay() + 6) % 7; return addDays(ds, -wd); }
const MATURE = 21, ANCHORED = 365;
const matureCount = lang => BANK[lang].filter(i => { const s = stOf(i.id); return s && (s.ivl || 0) >= MATURE; }).length;
const strongCount = matureCount;
// Meilensteine ohne Ende: feiner am Anfang, später in größeren Schritten
function milestoneList(upTo){
  const out = [10, 25, 50, 100, 150, 200, 300, 400, 500, 750, 1000];
  for (let m = 1500; m <= Math.max(upTo, 1500) + 500; m += 500) out.push(m);
  return out;
}
const nextMilestone = n => milestoneList(n).find(m => m > n);
const prevMilestone = n => [0].concat(milestoneList(n)).filter(m => m <= n).pop();
const knownEstimate = lang => BANK[lang].reduce((a, i) => a + FSRS.retrievability(stOf(i.id), today()), 0);
function streakMilestone(n){
  if ([7, 14, 30, 50, 100, 150, 200, 250, 300].includes(n)) return `${n} Tage in Folge.`;
  if (n % 365 === 0) return n === 365 ? 'Ein Jahr in Folge.' : `${n / 365} Jahre in Folge.`;
  if (n > 365 && n % 100 === 0) return `${n} Tage in Folge.`;
  return '';
}

/* ---------- Zustand ---------- */
const S = { lang:'sv', view:'home', run:null, dailyRun:null, notice:null, armed:null, shadow:null, write:null, own:null, tat:null };
function note(text, kind){ S.notice = text ? { text, kind:kind || 'ok' } : null; }
const size = () => SIZES[DB.settings.size] || SIZES.normal;

function stOf(id){ return DB.st[id]; }
function stage(item){
  const st = stOf(item.id);
  if (st && (st.reps || 0) >= 2) return 'free';
  return item.kind === 'order' ? 'tiles' : 'cloze';
}
// Sprache des Tages: beim ersten Start des Tages die Sprache, die es nötiger hat (fällige Wiederholungen im Verhältnis
// zur Tagwerk-Länge, dazu Tage seit dem letzten Üben). Bleibt für den Tag fest; ein Wechsel von Hand gilt bis morgen.
// Tagwerk je Sprache: DB.doneLang[datum][sprache]. Die Serie zählt weiter je Tag (DB.done), egal in welcher Sprache.
// Ältere Tage ohne Angabe: Sprache aus dem Tagesprotokoll (die mit den meisten Aufgaben).
function doneIn(ds, l){
  const x = DB.doneLang && DB.doneLang[ds];
  if (x) return !!x[l];
  if (!DB.done || !DB.done[ds]) return false;
  const a = dayLog(ds, 'sv').n || 0, b = dayLog(ds, 'es').n || 0;
  return (a >= b ? 'sv' : 'es') === l;
}
function tagwerkCount(l, from, to){ return Object.keys(DB.done || {}).filter(d => DB.done[d] && (!from || d >= from) && (!to || d <= to) && doneIn(d, l)).length; }
function activeLangs(){ return ['sv', 'es'].filter(l => BANK[l].some(i => stOf(i.id)) || Object.keys(DB.log || {}).some(d => (dayLog(d, l).n || 0) > 0)); }
function langNeed(l){
  const t = today(), due = dueItems(l).length, cap = Math.max(1, size().maxRev);
  const last = Object.keys(DB.log || {}).filter(d => d < t && (dayLog(d, l).n || 0) > 0).sort().pop();
  const since = last ? dayDiff(t, last) : 7;
  return { due, since, score:Math.min(due, cap) / cap + 0.6 * Math.min(since, 7) };
}
function dayLang(){
  const t = today(); DB.dayLang = DB.dayLang || {};
  if ((DB.settings.langMode || 'auto') !== 'auto') return DB.settings.lang || 'sv';
  if (DB.dayLang.d === t && DB.dayLang.l) return DB.dayLang.l;
  const act = activeLangs();
  let l = act.length === 1 ? act[0] : !act.length ? (DB.settings.lang || 'sv') : null;
  if (!l) { const a = langNeed('sv'), b = langNeed('es'); l = a.score === b.score ? (DB.dayLang.l === 'sv' ? 'es' : 'sv') : a.score > b.score ? 'sv' : 'es'; }
  DB.dayLang = { d:t, l };
  return l;
}
function dueItems(lang){
  const t = today();
  return BANK[lang].filter(i => { const s = stOf(i.id); return s && s.due <= t; }).sort((a, b) => stOf(a.id).due.localeCompare(stOf(b.id).due));
}
// Themen mit vielen Fehlern in den letzten 30 Tagen: Dort kommen auch für Fortgeschrittene die Grundlagen-Sätze
function weakTraps(lang){
  const p = (typeof errStats === 'function' ? errStats(lang, 30).p : {}) || {};
  return new Set(Object.keys(p).filter(k => p[k][0] >= 4 && p[k][1] / p[k][0] >= 0.25));
}
function levelOrder(lang, list, strict){
  const niv = DB.settings.niveau || 'mittel';
  if (niv === 'mittel') return list;
  const lvl = i => (i.own || i.tat ? 2 : i.lvl || 1);
  if (niv === 'grund') return list.slice().sort((a, b) => lvl(a) - lvl(b));
  // Fortgeschritten: schwerere Sätze zuerst; Grundlagen nur in schwachen Themen, sonst erst, wenn nichts anderes mehr da ist
  const weak = weakTraps(lang);
  const sorted = list.slice().sort((a, b) => lvl(b) - lvl(a));
  if (!strict) return sorted;
  const main = sorted.filter(i => lvl(i) >= 2 || weak.has(i.trap));
  return main.concat(sorted.filter(i => !main.includes(i)));
}
// Schwerpunkt der Woche: ein Thema je Sprache, montags neu gewählt (das schwächste der letzten 30 Tage, sonst das mit den meisten offenen Sätzen ab Mittelstufe)
function focusTrap(lang){
  const mo = mondayOf(today()); DB.focus = DB.focus || {};
  const f = DB.focus[lang];
  if (f && f.week === mo && TRAPS[lang].some(t => t.id === f.trap)) return f.trap;
  const cands = focusCandidates(lang); if (!cands.length) return null;
  DB.focus[lang] = { trap:cands[0], week:mo }; return cands[0];
}
function focusCandidates(lang){
  const p = (typeof errStats === 'function' ? errStats(lang, 30).p : {}) || {};
  const open = t => BANK[lang].filter(i => i.trap === t && !stOf(i.id) && (i.lvl || 1) >= 2).length;
  return TRAPS[lang].filter(t => t.kind !== 'gen' && BANK[lang].some(i => i.trap === t.id)).map(t => t.id)
    .map(id => ({ id, err:p[id] && p[id][0] >= 4 ? p[id][1] / p[id][0] : 0, open:open(id) }))
    .sort((a, b) => b.err - a.err || b.open - a.open).map(x => x.id);
}
function pickNew(lang, n, onlyTrap){
  let unseen = levelOrder(lang, BANK[lang].filter(i => !stOf(i.id) && (!onlyTrap || i.trap === onlyTrap)), !onlyTrap);
  // Schwerpunkt der Woche: bis zu einem Drittel der neuen Sätze aus diesem Thema, vorn eingereiht
  const ft = !onlyTrap && focusTrap(lang);
  if (ft) {
    // Ist der Schwerpunkt bei „Fortgeschritten“ ein schwaches Thema, erst die Grundlagen festigen
    let fx = unseen.filter(i => i.trap === ft);
    if ((DB.settings.niveau || 'mittel') === 'fort' && weakTraps(lang).has(ft)) fx = fx.slice().sort((a, b) => (a.lvl || 1) - (b.lvl || 1));
    fx = fx.slice(0, Math.ceil(n / 3)); unseen = fx.concat(unseen.filter(i => !fx.includes(i)));
  }
  const out = unseen.filter(i => i.own || (i.tat && !i.tat.auto) || (ft && i.trap === ft)).slice(0, Math.max(1, Math.ceil(n / 2)));
  const count = {};
  BANK[lang].forEach(i => { if (stOf(i.id)) count[i.trap] = (count[i.trap] || 0) + 1; });
  while (out.length < n) {
    const rest = unseen.filter(i => !out.includes(i));
    if (!rest.length) break;
    // Fortgeschritten: Grundlagen-Sätze schwacher Themen sind erlaubt, andere erst, wenn sonst nichts mehr da ist
    const fort = (DB.settings.niveau || 'mittel') === 'fort' && !onlyTrap;
    const ok = fort ? rest.filter(i => (i.own || i.tat || (i.lvl || 1) >= 2) || weakTraps(lang).has(i.trap)) : rest;
    const pool = ok.length ? ok : rest;
    const tps = [...new Set(pool.map(i => i.trap))].sort((a, b) => (count[a] || 0) - (count[b] || 0) || Math.random() - 0.5);
    const tr = tps[0];
    // Schwaches Thema: erst die Grundlagen festigen, sonst die schwersten zuerst
    const cands = pool.filter(i => i.trap === tr);
    const item = fort && weakTraps(lang).has(tr) ? cands.reduce((a, b) => ((b.lvl || 1) < (a.lvl || 1) ? b : a)) : cands[0];
    out.push(item); count[tr] = (count[tr] || 0) + 1;
  }
  return out;
}
const genIds = lang => Object.keys(GENS).filter(g => GENS[g].lang === lang && !GENS[g].form);
const formIds = lang => Object.keys(GENS).filter(g => GENS[g].lang === lang && GENS[g].form);
function dayGen(lang){
  const g = genIds(lang);
  if (!g.length) return null;
  return g[Math.floor(Date.now() / 86400000) % g.length];
}
const exFor = item => ({ type:stage(item), id:item.id });
function shuffleInPlace(a){ for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function dailyPlan(lang){
  const sz = size();
  const due = dueItems(lang).slice(0, sz.maxRev);
  const fresh = pickNew(lang, sz.newPer);
  const g = dayGen(lang);
  const base = shuffle(due).map(exFor).concat(fresh.map(exFor));
  // Die Hälfte der Grammatik-Aufgaben aus dem Generator des Tages, der Rest aus den anderen Übungsformen, täglich wechselnd
  const fx = formIds(lang).filter(f => GENS[f].daily), day = Math.floor(Date.now() / 86400000);
  const nForm = fx.length ? Math.floor(sz.gen / 2) : 0;
  // Fortgeschritten und der Generator des Tages sitzt (85 % der letzten 15+ richtig): nur noch zwei Aufgaben davon
  const rec = g && DB.gen[g] && DB.gen[g].recent || [];
  const sure = (DB.settings.niveau || 'mittel') === 'fort' && rec.length >= 15 && rec.reduce((x, y) => x + y, 0) / rec.length >= 0.85;
  const drills = g ? Array.from({ length:sure ? Math.min(2, sz.gen - nForm) : sz.gen - nForm }, () => ({ type:'gen', gen:g })) : [];
  for (let i = 0; i < nForm; i++) drills.push({ type:'gen', gen:fx[(day + i) % fx.length] });
  shuffleInPlace(drills);
  // gemischt statt Block: Formübungen gleichmäßig zwischen die Sätze verteilen
  // Erst ein Satz, dann abwechselnd; die Formübungen verteilen sich gleichmäßig
  const queue = [];
  const step = drills.length ? Math.max(1, base.length / drills.length) : Infinity;
  let next = step, di = 0;
  base.forEach((ex, i) => { queue.push(ex); while (di < drills.length && i + 1 >= next) { queue.push(drills[di++]); next += step; } });
  while (di < drills.length) queue.push(drills[di++]);
  const genLabels = [...new Set(drills.slice().sort((a, b) => (GENS[a.gen].form ? 1 : 0) - (GENS[b.gen].form ? 1 : 0)).map(x => GENS[x.gen].short || GENS[x.gen].label))];
  return { queue, due:due.length, fresh:fresh.length, gen:g, genN:drills.length, genLabels };
}
const minutes = queue => Math.max(1, Math.round(queue.reduce((s, ex) => s + (SECS[ex.type] || 25), 0) * 1.15 / 60));

function startRun(kind, opts){
  const lang = S.lang;
  let queue = [];
  if (kind === 'daily') queue = dailyPlan(lang).queue;
  else if (kind === 'quick') {
    queue = dueItems(lang).slice(0, 6).map(exFor);
    if (queue.length < 6) {
      const t = today(), have = new Set(queue.map(x => x.id));
      const weak = BANK[lang].filter(i => { const s = stOf(i.id); return s && !have.has(i.id) && s.last !== t; })
        .sort((a, b) => FSRS.retrievability(stOf(a.id), t) - FSRS.retrievability(stOf(b.id), t));
      queue = queue.concat(weak.slice(0, 6 - queue.length).map(exFor));
    }
    const g = genIds(lang);
    while (queue.length < 6 && g.length) queue.push({ type:'gen', gen:pick(g) });
  } else if (kind === 'trap') {
    const tr = trapMeta(lang, opts.trap);
    if (tr.kind === 'gen') { for (let i = 0; i < 10; i++) queue.push({ type:'gen', gen:tr.gen }); }
    else {
      const items = BANK[lang].filter(i => i.trap === tr.id);
      const t = today();
      const due = items.filter(i => stOf(i.id) && stOf(i.id).due <= t);
      // Heute schon Geübtes nach hinten, sonst brächte ein zweites „Thema üben“ dieselben Sätze
      const mem = DB.used.recentPick = DB.used.recentPick || {}, recent = mem['trap_' + tr.id] || [];
      const seen = items.filter(i => stOf(i.id) && !due.includes(i)).sort((a, b) => (recent.includes(a.id) - recent.includes(b.id)) || ((stOf(a.id).last === t) - (stOf(b.id).last === t)) || (FSRS.retrievability(stOf(a.id), t) - FSRS.retrievability(stOf(b.id), t)));
      const fresh = pickNew(lang, 10, tr.id);
      const nGen = tr.gen ? 3 : 0;
      queue = due.concat(fresh, seen).slice(0, 10 - nGen).map(exFor);
      mem['trap_' + tr.id] = queue.map(x => x.id);
      for (let i = 0; i < nGen; i++) queue.splice(Math.round((i + 1) * queue.length / (nGen + 1)) + i, 0, { type:'gen', gen:tr.gen });
    }
  } else if (kind === 'gen') queue = [{ type:'gen', gen:opts.gen }];
  else if (kind === 'form') queue = Array.from({ length:10 }, () => ({ type:'gen', gen:opts.gen }));
  else if (kind === 'textgap') {
    // Eigener Lesetext oder Wikipedia-Fundstück (Text kommt dann mit)
    const t = opts.body ? { body:opts.body, title:opts.title } : TEXTS[lang].find(x => x.id === opts.text);
    if (t) queue = shuffle(gapSentences(t)).map(x => textGapData(lang, x, t.title)).filter(Boolean).slice(0, 8).map(data => ({ type:'gen', gen:'textgap_' + lang, data }));
  }
  else if (kind === 'dict') queue = freshFirst(BANK[lang].filter(i => stOf(i.id) && (canSpeak() || (i.tat && i.tat.audio && !i.tat.audio.blocked))), 'dict_' + lang, 10).map(i => ({ type:'dict', id:i.id }));
  else if (kind === 'extraNew') queue = pickNew(lang, (opts && opts.n) || size().newPer).map(exFor);
  if (!queue.length) { note('Dafür gibt es gerade nichts zu üben.', 'warn'); render(); return; }
  if (S.run && !S.run.finished && S.run.kind === 'daily' && kind !== 'daily') S.dailyRun = S.run;
  if (kind === 'daily') S.dailyRun = null;
  S.notice = null;
  S.run = { kind, lang, queue, idx:0, ok:0, bad:0, endless:kind === 'gen', gen:opts && opts.gen, trap:opts && opts.trap, text:opts && opts.text, wiki:opts && opts.body ? { body:opts.body, title:opts.title } : null, cur:null, strongBefore:strongCount(lang), res:[], missed:[], secs:0, combo:0, best:0 };
  S.view = 'run'; prepCur(); persistRun(); render(); window.scrollTo(0, 0);
}
// Zufallsauswahl ohne Wiederholung der letzten Runden: zuletzt Gewähltes kommt nach hinten, solange es genug anderes gibt
// prefer: unter den länger nicht gezeigten zuerst diese (etwa Sätze mit echter Aufnahme)
function freshFirst(items, slot, n, prefer){
  const mem = DB.used.recentPick = DB.used.recentPick || {};
  const recent = mem[slot] || [];
  const out = shuffle(items).sort((a, b) => (recent.includes(a.id) ? 1 : 0) - (recent.includes(b.id) ? 1 : 0) || (prefer ? (prefer(b) ? 1 : 0) - (prefer(a) ? 1 : 0) : 0)).slice(0, n);
  mem[slot] = recent.concat(out.map(i => i.id)).slice(-30);
  return out;
}
// Erzeugte Aufgaben ohne Wiederholung: Jeder Generator merkt sich seine letzten Aufgaben, auch über Runden hinweg.
const GEN_MEMORY = 12;
const genKey = d => String(d.word || d.full || (d.answers && d.answers[0]) || d.prompt || '').toLowerCase();
function makeFresh(g){
  const mem = DB.used.genRecent = DB.used.genRecent || {};
  const list = mem[g] = mem[g] || [];
  let d = GENS[g].make(), k = genKey(d);
  // Viele Versuche: Kleine Listen (15 Fälle bei 12 gemerkten) brauchen sonst Glück
  for (let tries = 0; tries < 200 && list.includes(k); tries++) { d = GENS[g].make(); k = genKey(d); }
  list.push(k); if (list.length > GEN_MEMORY) list.splice(0, list.length - GEN_MEMORY);
  if (GENS[g].seen) GENS[g].seen(d);
  return d;
}
function prepCur(){
  const r = S.run; const ex = r.queue[r.idx];
  r.shownAt = Date.now();
  if (!ex) { r.cur = null; return; }
  if (ex.type === 'gen' && !ex.data) ex.data = makeFresh(ex.gen);
  if (ex.type === 'tiles' && !ex.pool) {
    const item = itemById(ex.id);
    // Inversion: Das erste Wort bleibt groß. Sonst ginge auch die Wortstellung mit dem Subjekt vorn („jag träffar honom inte ikväll“),
    // und geübt werden soll die Umstellung nach dem Satzanfang.
    const toks = tileTokens(item.target, item.trap === 'inversion');
    const extra = distractorFor(item, toks);
    ex.extra = !!extra;
    ex.pool = shuffle(toks.map((t, i) => ({ t, i })).concat(extra ? [{ t:extra, i:toks.length, extra:true }] : []));
    if (ex.pool.map(x => x.i).join() === toks.map((_, i) => i).join() && toks.length > 1) ex.pool.reverse();
    ex.picked = [];
  }
  if (ex.type === 'tiles') ex.picked = [];
  r.cur = { input:ex.type === 'gen' && ex.data && ex.data.start ? ex.data.start : '', state:'answer', result:null, intro:true };
  S.focus = true;
}
// Ein gezieltes Ablenkwort an der Stelle, um die es im Thema geht (falsche Partikel, le statt se)
const PART_SWAP = { om:'på', på:'om', med:'till', till:'med', upp:'ut', ut:'upp', av:'på', bort:'upp', fram:'upp', ihåg:'om' };
function distractorFor(item, toks){
  const low = toks.map(t => t.toLowerCase());
  if (item.trap === 'partikel') { for (const t of low.slice().reverse()) if (PART_SWAP[t] && !low.includes(PART_SWAP[t])) return PART_SWAP[t]; }
  if (item.trap === 'pronombres' && low.some(t => ['lo', 'la', 'los', 'las'].includes(t)) && !low.includes('le')) return 'le';
  return null;
}
function tileTokens(sentence, keepFirst){
  const t = tokens(sentence);
  if (t.length && !keepFirst && !NAMES.includes(t[0].toLowerCase())) t[0] = t[0].toLowerCase();
  return t;
}
const tileKey = s => tileTokens(s).map(x => x.toLowerCase()).join(' ');
function openDaily(){
  if (S.run && !S.run.finished && S.run.kind === 'daily') return S.run;
  if (S.dailyRun && !S.dailyRun.finished) return S.dailyRun;
  return null;
}
function restoreRun(){
  const d = DB.run;
  if (!d || d.date !== today() || !Array.isArray(d.queue) || d.idx >= d.queue.length) { DB.run = null; return; }
  if (d.queue.some(ex => ex.id && !itemById(ex.id))) { DB.run = null; return; }
  S.dailyRun = { kind:'daily', lang:d.lang, queue:d.queue, idx:d.idx, ok:d.ok || 0, bad:d.bad || 0, cur:null, strongBefore:d.strongBefore != null ? d.strongBefore : strongCount(d.lang), res:d.res || [], missed:d.missed || [], secs:d.secs || 0, combo:d.combo || 0, best:d.best || 0 };
}
function resumeDaily(){
  const d = openDaily(); if (!d) return false;
  S.run = d; S.lang = d.lang; S.view = 'run';
  if (!d.cur) prepCur();
  return true;
}
