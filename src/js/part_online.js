/* ---------- Online-Extras: Tatoeba & LanguageTool ---------- */
const TAT_LANG = { sv:'swe', es:'spa' };
// Suchmuster für den Nachschub je Thema. TAT_Q für alle, TAT_ADV bei „Fortgeschritten“ (B2/C1-Strukturen).
// Falsche Freunde kommen aus der Liste in fundstueck.js, damit beide Stellen zusammenpassen.
const ffQuery = lang => FALSE_FRIENDS[lang].map(f => f[0].replace(/^(el|la|los|las) /, ''));
const TAT_Q = {
  sv:{
    bisats:['eftersom', '"att han inte"', '"att jag inte"', '"om du inte"', '"att hon inte"', '"som jag aldrig"', '"att det inte"', '"som inte"', '"innan jag"', 'medan'],
    inversion:['^idag', '^igår', '^tyvärr', '^nu', '^ibland', '^kanske', '^sedan', '^därför', '^plötsligt', '^ofta'],
    tempus:['"har aldrig"', '^igår', '"förra veckan"', '"förra året"', '"i somras"', '"har du någonsin"', '"har bott"', '"har varit"', '"för två år sedan"'],
    partikel:['"tycker om"', '"komma ihåg"', '"kommer ihåg"', '"ta med"', '"håller med"', '"ge upp"', '"hälsa på"', '"känner igen"', '"stäng av"', '"hitta på"'],
    sin:['sin', 'sitt', 'sina', '"sin mamma"', '"sitt rum"', '"sina vänner"'],
    tid:['sedan', '"om en vecka"', '"i två"', '"på morgonen"', '"på helgen"', '"i måndags"', '"om ett år"', '"för en timme sedan"'],
    framtid:['"kommer att"', '"behöver inte"', '"får inte"', 'borde', '"skulle vilja"', '"ska resa"', '"kommer inte att"'],
    modal:['"vet du ju"', '"väl inte"', '"nog inte"', '^visst', 'nämligen', '"då?"'],
    passiv:['"det finns"', '"finns det"', '"man kan"', '"man måste"', 'byggdes', 'såldes', 'kallas'],
    idiom:['"ta det lugnt"', '"ingen fara"', '"kostar skjortan"', '"samma båt"', '"fullt upp"', '"bita ihop"'],
    falska:ffQuery('sv')
  },
  es:{
    serestar:['estoy', 'está', '"es muy"', 'estamos', '"está lleno"', '"es importante"', '"estaba cansado"'],
    pasado:['"cuando era"', 'estaba', '"de repente"', 'ayer', '"cuando llegué"', '"de niño"', '"todos los días"'],
    perfecto:['"he estado"', '"nunca he"', '"has visto"', '"hoy he"', '"ya he"', '"todavía no he"', '"alguna vez"'],
    subjuntivo:['"quiero que"', 'ojalá', '"espero que"', '"para que"', '"no creo que"', '"cuando llegues"', '"es mejor que"', '"dudo que"'],
    perifrasis:['"acabo de"', '"vuelve a"', 'suelo', '"dejé de"', '"llevo"', '"se puso a"', '"a punto de"', '"sigue"'],
    porpara:['"gracias por"', '"para mí"', '"por eso"', 'para', '"por teléfono"', '"para aprender"', '"por la mañana"'],
    pronombres:['"se lo"', '"te lo"', '"me lo"', '"se la"', '"se las"', '"nos lo"'],
    gustar:['"me gusta"', '"me gustan"', '"me duele"', '"le gusta"', '"me encanta"', '"me interesa"', '"me parece"'],
    condicional:['"si tuviera"', '"me gustaría"', 'deberías', 'podrías', '"me encantaría"', 'sería', 'podríamos'],
    conjetura:['"qué hora será"', '"dónde estará"', '"quién será"', '"debe de estar"', '"debe de ser"', '"tendrá unos"', '"estará cansado"'],
    reflexivo:['"se me"', '"me acuerdo"', '"me levanto"', '"nos vamos"', '"se llama"', '"nos vemos"'],
    cambio:['"se puso"', '"se volvió"', '"se hizo"', '"se quedó"', '"se convirtió en"', '"me pongo"', '"me quedé dormido"'],
    preposiciones:['"pienso en"', '"depende de"', '"desde hace"', '"se casó con"', '"sueño con"', '"tarda en"', '"se olvidó de"'],
    idiom:['"no pasa nada"', '"una mano"', '"la pata"', '"el pelo"', '"pan comido"', '"hecho polvo"'],
    falsos:ffQuery('es')
  }
};
const TAT_ADV = {
  sv:{
    bisats:['"trots att"', '"även om"', '"i och med att"', '"vilket innebär"', '"så länge"', '"förutsatt att"', '"oavsett om"', '"såvida inte"'],
    inversion:['^däremot', '^förmodligen', '^egentligen', '^ändå', '^följaktligen', '^dessutom', '^tydligen', '^därför'],
    tempus:['"hade redan"', '"hade aldrig"', '"hade hunnit"', '"har länge"', '"under flera år"', '"hade glömt"'],
    partikel:['"komma fram till"', '"lägga märke till"', '"stå ut med"', '"gå med på"', '"hålla på att"', '"ta reda på"', '"komma överens"', '"ta upp"'],
    sin:['"sin egen"', '"sitt eget"', '"sina egna"', '"sin fru"', '"sina föräldrar"', '"sitt arbete"'],
    tid:['"sedan dess"', '"under tiden"', '"för länge sedan"', '"i flera år"', '"inom kort"', '"så småningom"'],
    framtid:['"skulle kunna"', '"skulle ha"', '"lär vara"', 'torde', '"kommer nog"', '"hade tänkt"'],
    modal:['"ju inte"', '"väl ändå"', '"nog ändå"', '"nu en gång"', 'minsann', '"har ju"'],
    idiom:['"över en kam"', '"ko på isen"', '"het gröt"', '"skinn på näsan"', '"i klistret"', '"mitt i handen"'],
    passiv:['"har byggts"', '"måste göras"', 'anses', 'sägs', '"har hittats"', 'diskuterades']
  },
  es:{
    serestar:['"está claro que"', '"es evidente"', '"estar de acuerdo"', '"está a punto de"', '"es probable que"', '"estaba convencido"'],
    pasado:['solía', 'hubo', 'llevaba', '"acababa de"', '"había una vez"', '"de repente se"'],
    perfecto:['"había sido"', '"había estado"', '"ya había"', '"nunca había"', 'habrá', '"me han dicho"'],
    subjuntivo:['"aunque sea"', '"como si"', '"antes de que"', '"sin que"', '"a menos que"', '"ojalá hubiera"', '"por mucho que"', '"no es que"'],
    perifrasis:['llevaba', '"acababa de"', '"volvió a"', '"se echó a"', 'solía', '"estuvo a punto de"', '"va mejorando"', '"acabó por"'],
    porpara:['"por lo menos"', '"por si acaso"', '"para siempre"', '"por fin"', '"por lo visto"', '"para colmo"'],
    pronombres:['"se los"', '"se las"', 'díselo', 'dámelo', '"me lo dijo"', '"te lo prometo"'],
    idiom:['"pelos en la lengua"', '"por las ramas"', '"colmó el vaso"', '"pies al gato"', '"por los codos"', '"uña y carne"'],
    gustar:['"me molesta"', '"me importa"', '"me cae"', '"me hace falta"', '"me preocupa"', '"le sorprende"'],
    condicional:['habría', '"si hubiera"', '"yo que tú"', '"sería mejor"', '"de haberlo sabido"', '"me habría gustado"'],
    conjetura:['"se habrá olvidado"', '"habrá pasado"', '"se habrá metido"', '"serían las"', '"lo que habrá"', '"habrá sido"'],
    reflexivo:['"se dio cuenta"', '"me quedé"', '"se puso"', '"nos llevamos"', '"se atrevió"', '"se arrepintió"'],
    cambio:['"llegó a ser"', '"se ha vuelto"', '"se quedó sin"', '"se ha convertido en"', '"se me hace"', '"se puso tenso"'],
    preposiciones:['"consiste en"', '"se trata de"', '"cuenta con"', '"se fía de"', '"insistió en"', '"se negó a"']
  }
};
// Statt reinem Zufall: Wörter aus Gesellschaft, Natur, Sport und Kultur, damit nicht immer Kaffee und Schlüssel vorkommen
const TAT_THEMES = {
  sv:['samhället', 'regeringen', 'valet', 'skogen', 'havet', 'fåglar', 'matchen', 'laget', 'konserten', 'romanen', 'forskarna', 'klimatet', 'kommunen', 'grannarna', 'traditionen', 'historien', 'staden', 'landsbygden', 'jobbet', 'universitetet'],
  es:['sociedad', 'gobierno', 'elecciones', 'bosque', 'mar', 'pájaros', 'partido', 'equipo', 'concierto', 'novela', 'científicos', 'clima', 'ayuntamiento', 'vecinos', 'tradición', 'historia', 'ciudad', 'pueblo', 'empresa', 'universidad']
};
// Tatoeba übersetzt viel aus dem Englischen, mit immer denselben Figuren
const TAT_NAMES = /\b(Tom|Mary|John|Alice|Bob|Jack|Ken)\b/;
const tatSet = (lang, t) => new Set(wTokens(t).filter(w => w.length >= 3 && !isFunc(lang, w)).map(w => lemmaOf(lang, w) || w));
// Zu ähnlich: Inhaltswörter zu 60 % gleich mit einem vorhandenen Satz, oder ein sehr häufiger Satzanfang
function tatSamey(lang, target, pool){
  if (TAT_NAMES.test(target)) return true;
  const a = tatSet(lang, target);
  if (pool.starts[wTokens(target).slice(0, 2).join(' ')] >= 4) return true;
  return a.size > 0 && pool.sets.some(b => { let n = 0; a.forEach(w => { if (b.has(w)) n++; }); return n / (a.size + b.size - n) >= 0.6; });
}
function tatPool(lang){
  const sets = [], starts = {};
  BANK[lang].forEach(i => { sets.push(tatSet(lang, i.target)); const k = wTokens(i.target).slice(0, 2).join(' '); starts[k] = (starts[k] || 0) + 1; });
  return { sets, starts };
}
// Suchplan für einen Nachschub: Schwerpunkt der Woche zuerst, dann reihum, bei „Fortgeschritten“ die anspruchsvollen Muster, zuletzt ein Themenwort
function tatPlan(lang, fort, day){
  const traps = Object.keys(TAT_Q[lang]), ft = focusTrap(lang);
  const order = (ft && TAT_Q[lang][ft] ? [ft] : []).concat([0, 1, 2, 3].map(k => traps[(day + k) % traps.length])).filter((t, i, arr) => arr.indexOf(t) === i).slice(0, 3);
  const plan = order.map(trap => { const adv = fort && TAT_ADV[lang][trap]; return { trap, q:pick(adv && adv.length ? adv : TAT_Q[lang][trap]) }; });
  plan.push({ trap:'eigene', q:pick(TAT_THEMES[lang]) });
  return plan;
}
async function tatoebaSearch(lang, q, native, wc){
  const p = new URLSearchParams({ lang:TAT_LANG[lang], 'trans:lang':'deu', 'showtrans:lang':'deu', is_unapproved:'no', is_orphan:'no', word_count:wc || '3-12', sort:'random', limit:'20', include:'audios' });
  if (q) p.set('q', q);
  if (native) p.set('is_native', 'yes');
  const res = await fetch('https://api.tatoeba.org/v1/sentences?' + p.toString());
  if (!res.ok) throw new Error('http ' + res.status);
  const json = await res.json();
  const known = new Set(BANK[lang].map(i => norm(i.target, lang)));
  return (json.data || []).map(s => {
    const trs = (s.translations || []).flat ? (s.translations || []).flat() : (s.translations || []);
    const t = trs.find(x => x && x.lang === 'deu' && x.is_direct) || trs.find(x => x && x.lang === 'deu');
    const a = (s.audios || []).find(x => x && x.licence && x.download_url);
    if (!t || !s.text) return null;
    return { tid:s.id, target:s.text, de:t.text, owner:s.owner || '', license:s.license || 'CC BY 2.0 FR',
      audio:a ? { url:a.download_url, author:a.author || '', licence:a.licence, attr:a.attribution_url || '' } : null };
  }).filter(x => x && !known.has(norm(x.target, lang)) && x.target.length < 120);
}
async function tatoebaFetch(lang, trap, word){
  let out = [];
  if (word) {
    out = await tatoebaSearch(lang, word, false);
  } else {
    const qs = shuffle(TAT_Q[lang][trap] || []);
    for (const q of qs) {
      const r = await tatoebaSearch(lang, q, true);
      r.forEach(x => { if (!out.some(y => y.tid === x.tid)) out.push(x); });
      if (out.length >= 10) break;
    }
  }
  out.sort((a, b) => (b.audio ? 1 : 0) - (a.audio ? 1 : 0));
  return out.slice(0, 10);
}
async function languageTool(text, lang){
  const body = new URLSearchParams({ text, language:lang === 'sv' ? 'sv' : 'es', motherTongue:'de' });
  const res = await fetch('https://api.languagetool.org/v2/check', { method:'POST', body });
  if (!res.ok) throw new Error('http ' + res.status);
  const json = await res.json();
  return (json.matches || []).map(m => ({ offset:m.offset, length:m.length, message:m.message || (m.rule && m.rule.description) || '', reps:(m.replacements || []).slice(0, 3).map(r => r.value) }));
}
const offlineMsg = 'Keine Verbindung. Das hier braucht Internet, alles andere geht auch offline.';
let audioEl = null;
// auto: von der App selbst gestartet (Hördiktat). Verweigert der Browser das ohne Antippen, bleibt es still.
function playItem(item, rate, auto){ playItemEv(item, rate, null, auto); }
// ev (optional, siehe speak): start('native' oder 'tts'), end(fehler), word(Zeichenposition, nur beim Vorlesen)
function playItemEv(item, rate, ev, auto){
  if (item && item.tat && item.tat.audio && !item.tat.audio.blocked && navigator.onLine !== false) {
    try {
      if (audioEl) audioEl.pause();
      const el = audioEl = new Audio(item.tat.audio.url);
      el.playbackRate = rate && rate < 0.8 ? 0.75 : 1;
      if (ev) { el.onplaying = () => ev.start('native'); el.onended = () => ev.end(false); }
      el.play().catch(err => {
        // NotAllowedError: Autoplay-Sperre des Browsers, kein Problem der Aufnahme
        if (err && err.name === 'NotAllowedError') { if (!auto) speak(item.target, item.lang, rate, ev); else if (ev) ev.end(true); return; }
        // Manche Aufnahmen dürfen außerhalb von Tatoeba nicht abgespielt werden: dann einmal merken und vorlesen
        item.tat.audio.blocked = true; const o = (DB.tat[item.lang] || []).find(x => x.id === item.id); if (o && o.audio) { o.audio.blocked = true; save(); }
        speak(item.target, item.lang, rate, ev);
      });
      return;
    } catch (e) {}
  }
  speak(item.target, item.lang, rate, ev);
}


// Nachschub: Wenn die eingebauten Sätze zur Neige gehen, neue von Tatoeba holen (höchstens alle 6 Stunden)
async function refill(lang){
  if (!DB.settings.refill || navigator.onLine === false || typeof fetch !== 'function') return 0;
  // Fortgeschritten: nur Sätze zählen, die auch drankommen (ab Mittelstufe oder schwaches Thema)
  const fort = (DB.settings.niveau || 'mittel') === 'fort', weak = fort ? weakTraps(lang) : null;
  const unseen = BANK[lang].filter(i => !stOf(i.id) && (!fort || i.own || i.tat || (i.lvl || 1) >= 2 || weak.has(i.trap))).length;
  if (unseen >= size().newPer * 3) return 0;
  DB.tatFetch = DB.tatFetch || {};
  if (Date.now() - (DB.tatFetch[lang] || 0) < 6 * 3600 * 1000) return 0;
  DB.tatFetch[lang] = Date.now(); save();
  const mature = matureCount(lang);
  const wc = fort ? (mature < 200 ? '6-14' : '7-18') : mature < 50 ? '3-8' : mature < 200 ? '4-10' : mature < 600 ? '5-12' : '6-16';
  const plan = tatPlan(lang, fort, Math.floor(Date.now() / 86400000)), pool = tatPool(lang);
  let added = 0;
  for (const { trap, q } of plan) {
    if (added >= 16) break;
    try {
      const list = (await tatoebaSearch(lang, q, true, wc)).sort((a, b) => (b.audio ? 1 : 0) - (a.audio ? 1 : 0));
      let taken = 0;
      for (const x of list) {
        if (taken >= 4) break;
        const id = lang + ':tat:' + x.tid;
        if (DB.tat[lang].some(o => o.id === id) || tatSamey(lang, x.target, pool)) continue;
        DB.tat[lang].push({ id, trap, de:x.de, target:x.target, owner:x.owner, license:x.license, audio:x.audio, created:today(), auto:true });
        pool.sets.push(tatSet(lang, x.target));
        added++; taken++;
      }
    } catch (e) { break; }
  }
  if (added) { DB.tatFetch[lang + 'N'] = (DB.tatFetch[lang + 'N'] || 0) + added; save(); buildBank(); if (S.view === 'home' || S.view === 'progress') render(); }
  return added;
}

