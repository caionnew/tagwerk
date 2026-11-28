/* ---------- Freies Schreiben: Textprofil, Hinweise, Extra-Aufgaben, Archiv ---------- */
// Alles offline. Gemessen wird, was sich zuverlässig zählen lässt; Hinweise nur, wo die Regel treffsicher ist.
const W_SUBS = {
  sv:['att', 'eftersom', 'när', 'om', 'som', 'medan', 'innan', 'fast', 'trots att', 'därför att', 'så att', 'ifall', 'tills', 'efter att', 'förrän', 'vilket'],
  es:['que', 'porque', 'cuando', 'aunque', 'si', 'mientras', 'donde', 'para que', 'antes de que', 'después de que', 'ya que', 'sin que', 'hasta que', 'como si', 'lo que']
};
const W_CONN = {
  sv:['men', 'eller', 'så', 'därför', 'sedan', 'dessutom', 'däremot', 'alltså', 'ändå', 'till exempel', 'först', 'till slut', 'till sist', 'faktiskt', 'tyvärr', 'egentligen', 'i stället', 'annars', 'också'],
  es:['pero', 'o', 'entonces', 'además', 'sin embargo', 'por eso', 'luego', 'después', 'también', 'al final', 'primero', 'en cambio', 'por ejemplo', 'de hecho', 'por fin', 'así que', 'aun así', 'en realidad', 'tampoco']
};
const W_TENSE_DE = { pres:'Präsens', past:'Präteritum', perf:'Perfekt', plup:'Plusquamperfekt', fut:'Zukunft', cond:'Konditional', pass:'s-Passiv', indef:'Indefinido', imp:'Imperfecto', subj:'Subjuntivo', prog:'Verlaufsform' };
const SV_STRONG_PAST = 'var hade gick kom såg tog fick gjorde sa sade åt drack skrev låg satt stod fanns blev kunde ville visste sov flög for drog gav bad bjöd sjöng sprang hjälpte träffade bodde började slutade'.split(' ');
const SV_SUPINE = 'varit haft gått kommit sett tagit fått gjort sagt ätit druckit skrivit bott köpt jobbat arbetat läst lärt träffat hört flyttat rest slutat börjat glömt förstått hunnit kunnat velat bestämt'.split(' ');
const ES_PART_IRR = 'hecho dicho visto escrito puesto vuelto abierto roto muerto cubierto descubierto resuelto'.split(' ');
const ES_FUT_IRR = /^(tendr|podr|saldr|vendr|har|dir|sabr|querr|pondr|habr|cabr|valdr)(é|ás|á|emos|éis|án)$/;
const ES_COND_IRR = /^(tendr|podr|saldr|vendr|har|dir|sabr|querr|pondr|habr|cabr|valdr)(ía|ías|íamos|íais|ían)$/;
const ES_SUBJ_PAST = /^(tuv|fu|pud|hic|estuv|quis|sup|vin|dij|anduv|trajer|pus|hub|habl|viv|com|trabaj|sal|llam|lleg|volv|viaj)(iera|ieras|iéramos|ieran|era|eras|éramos|eran|ara|aras|áramos|aran)$/;
const SV_SKIP = /^(jag|du|han|hon|vi|ni|de|man|det|inte|aldrig|redan|just|alltid|ofta|också|bara)$/;
const ES_IND_COMMON = new Set('es eres soy son somos está estás estoy están estamos tienes tiene tengo tienen tenemos vas va voy van vamos haces hace hago hacen puedes puede puedo pueden quieres quiere quiero quieren sabes sabe sé saben vienes viene vengo vienen hay dices dice digo'.split(' '));
const sentSplit = text => String(text).replace(/\s+/g, ' ').split(new RegExp(`(?<=${rxSet(P_END)})\\s+`)).map(x => x.trim()).filter(x => /[A-Za-zÀ-ÿ]/.test(x));
const wTokens = s => (String(s).toLowerCase().match(/[a-zà-ÿ]+(?:-[a-zà-ÿ]+)?/g) || []);
const wTag = (lang, w) => { const e = lookupWord(lang, w); return e ? e.de : ''; };
function tensesOf(lang, toks){
  const out = new Set();
  toks.forEach((w, i) => {
    const nx = toks[i + 1] || '', tag = wTag(lang, w);
    if (lang === 'sv') {
      let j = i + 1; while (j < i + 4 && SV_SKIP.test(toks[j] || '')) j++;
      const sup = toks[j] || '';
      if ((w === 'har' || w === 'hade') && (SV_SUPINE.includes(sup) || /\(Supinum/.test(wTag(lang, sup)))) out.add(w === 'har' ? 'perf' : 'plup');
      else if (w === 'hade' || SV_STRONG_PAST.includes(w) || /\(Präteritum\)/.test(tag)) out.add('past');
      else if ((w === 'ska' || w === 'skall') && nx) out.add('fut');
      else if (w === 'kommer' && nx === 'att') out.add('fut');
      else if (w === 'skulle') out.add('cond');
      else if (/\(Präsens\)/.test(tag) || ['är', 'har', 'kan', 'vill', 'måste', 'brukar', 'tycker', 'heter', 'bor', 'jobbar', 'går', 'gillar', 'äter', 'dricker', 'läser'].includes(w)) out.add('pres');
      if (/(as|ades|des|tes)$/.test(w) && /(gebaut|geöffnet|wird|wurde)/.test(tag)) out.add('pass');
    } else {
      if (['he', 'has', 'ha', 'hemos', 'habéis', 'han'].includes(w) && (/(ado|ido)$/.test(nx) || ES_PART_IRR.includes(nx))) out.add('perf');
      else if (/\(Indefinido/.test(tag)) out.add('indef');
      else if (/\(Imperfecto/.test(tag)) out.add('imp');
      else if (/\(Subjuntivo/.test(tag) || ES_SUBJ_PAST.test(w)) out.add('subj');
      else if (/(ar|er|ir)(é|ás|emos|éis|án)$/.test(w) || /(ar|er|ir)á$/.test(w) || ES_FUT_IRR.test(w)) out.add('fut');
      else if (/(ar|er|ir)(ía|ías|íamos|íais|ían)$/.test(w) || ES_COND_IRR.test(w) || /würde/.test(tag)) out.add('cond');
      else if (/\(Präsens/.test(tag) || ['es', 'está', 'soy', 'estoy', 'tengo', 'tiene', 'hay', 'voy', 'va', 'quiero', 'puedo', 'gusta', 'gustan'].includes(w)) out.add('pres');
      if (['voy', 'vas', 'va', 'vamos', 'van'].includes(w) && nx === 'a' && /(ar|er|ir)$/.test(toks[i + 2] || '')) out.add('fut');
      if (/^(estoy|estás|está|estamos|están|estaba)$/.test(w) && /(ando|iendo|yendo)$/.test(nx)) out.add('prog');
    }
  });
  return out;
}
// Treffsichere Hinweise zu den Themen der App. Jeder Hinweis: Textstelle, Erklärung, Thema
function textHints(lang, text){
  const hints = [], seen = new Set();
  const add = (m, msg, topic) => { const k = topic + m.toLowerCase(); if (seen.has(k)) return; seen.add(k); hints.push({ at:m.trim(), msg, topic }); };
  const t = ' ' + String(text).replace(/\s+/g, ' ') + ' ';
  const sents = sentSplit(text);
  const cap = x => x[0].toUpperCase() + x.slice(1);
  if (lang === 'sv') {
    const PRON = '(jag|du|han|hon|vi|ni|de|man|det)';
    const FRONT = '(idag|i dag|igår|i går|imorgon|i morgon|ikväll|i kväll|imorse|nu|ibland|ofta|alltid|här|där|därför|tyvärr|först|sen|senare|efteråt|på (?:måndag|tisdag|onsdag|torsdag|fredag|lördag|söndag)|i (?:helgen|sommar|vinter|höst|vår))';
    sents.forEach(s => {
      const m = s.match(new RegExp(`^${FRONT}\\s+${PRON}\\s+(\\S+)`, 'i'));
      if (m && !/^(inte|aldrig|också|bara)$/i.test(m[3])) add(m[0], `Steht „${m[1].toLowerCase()}“ vorn, kommt das Verb vor das Subjekt: ${cap(m[1].toLowerCase())} ${wordCore(m[3])} ${m[2].toLowerCase()} …`, 'inversion');
      const c = s.match(new RegExp(`^(när|om|eftersom|innan|medan|fast)\\s[^,]+,\\s*${PRON}\\s+(\\S+)`, 'i'));
      if (c && !/^(inte|aldrig)$/i.test(c[3])) add(c[0], `Nach dem Nebensatz vorn kommt zuerst das Verb: …, ${wordCore(c[3])} ${c[2].toLowerCase()} …`, 'inversion');
    });
    const ADV = 'inte|aldrig|alltid|ofta|kanske|redan|också|bara|gärna|verkligen';
    for (const m of t.matchAll(new RegExp(`\\b(att|eftersom|om|när|fast|medan|innan|som)\\s+${PRON}\\s+(\\S+)\\s+(${ADV})\\b`, 'gi'))) {
      if (new RegExp(`^(${ADV})$`, 'i').test(m[3])) continue;
      add(m[0], `Im Nebensatz steht „${m[4].toLowerCase()}“ vor dem Verb: ${m[1].toLowerCase()} ${m[2].toLowerCase()} ${m[4].toLowerCase()} ${m[3]}.`, 'bisats');
    }
    const g = Object.fromEntries((GENUS.sv || []).map(x => [x[0], x[1]]));
    for (const m of t.matchAll(new RegExp(String.raw`\b(en|ett)\s+(?:(\S+)\s+)?(\S+?)${rxSet(P_CLOSE)}?(?=\s)`, 'gi'))) {
      const noun = m[3].toLowerCase(), want = g[noun];
      if (want && want !== m[1].toLowerCase()) add(m[0], `„${noun}“ ist ein ${want}-Wort: ${want} ${m[2] ? m[2] + ' ' : ''}${noun}.`, 'species');
    }
    const TFORM = { stor:'stort', ny:'nytt', fin:'fint', dyr:'dyrt', billig:'billigt', gammal:'gammalt', god:'gott', röd:'rött', vit:'vitt', grön:'grönt', lång:'långt', varm:'varmt', kall:'kallt', ful:'fult', vacker:'vackert', rolig:'roligt', svår:'svårt', stark:'starkt', snabb:'snabbt', trevlig:'trevligt', liten:'litet', enkel:'enkelt', viktig:'viktigt' };
    for (const m of t.matchAll(new RegExp(String.raw`\bett\s+(\S+)\s+(\S+?)${rxSet(P_CLOSE)}?(?=\s)`, 'gi'))) { const a = m[1].toLowerCase(); if (TFORM[a]) add(`ett ${m[1]} ${m[2]}`, `Bei ett-Wörtern bekommt das Adjektiv ein -t: ett ${TFORM[a]} ${m[2]}.`, 'species'); }
    const PASTMARK = /(igår|i går|i förrgår|förra (veckan|året|månaden|helgen)|i (somras|vintras|våras|höstas|måndags|tisdags|onsdags|torsdags|fredags|lördags|söndags)|för \S+ (år|veckor|dagar|månader) sedan)/i;
    sents.forEach(s => { const pm = s.match(PASTMARK), hm = s.match(new RegExp(String.raw`\bhar\s+(?:(?:jag|du|han|hon|vi|ni|de|man|det|inte|aldrig|redan|just)\s+){0,2}(\S+?)${rxSet(P_CLOSE)}?(?=\s|$)`, 'i')); if (pm && hm && (SV_SUPINE.includes(hm[1].toLowerCase()) || /\(Supinum/.test(wTag('sv', hm[1].toLowerCase())))) add(`${pm[0]} … har ${hm[1]}`, `Mit „${pm[0].toLowerCase()}“ steht im Schwedischen das Präteritum, nicht „har ${hm[1]}“.`, 'tempus'); });
    for (const m of t.matchAll(/\bmåste\s+inte\b/gi)) add(m[0], '„måste inte“ ist mehrdeutig. „Muss nicht“ heißt behöver inte, „darf nicht“ heißt får inte.', 'framtid');
  } else {
    const TRIG = '(quiero|quieres|quiere|queremos|quieren|espero|esperas|espera|esperamos|es importante|es necesario|es mejor|para|antes de|me alegro de|no creo|dudo|ojalá)';
    const SKIP = '(?:(?:no|me|te|se|lo|la|le|nos|les|yo|tú|él|ella|usted|nosotros|ellos|ellas|ustedes)\\s+){0,2}';
    for (const m of t.matchAll(new RegExp(`\\b${TRIG}\\s+(que\\s+)?${SKIP}(\\S+)`, 'gi'))) {
      const ojala = /ojalá/i.test(m[1]);
      if (!ojala && !m[2]) continue; // ohne „que“ kein Nebensatz, etwa „quiero comer“
      const v = wordCore(m[3].toLowerCase()), tag = wTag('es', v);
      if ((/\(Präsens/.test(tag) || ES_IND_COMMON.has(v)) && !/Subjuntivo/.test(tag)) add(m[0], `Nach „${m[1].toLowerCase()}${ojala ? '' : ' que'}“ steht der Subjuntivo, nicht „${v}“.`, 'subjuntivo');
    }
    for (const m of t.matchAll(/\bsi\s+(?:[^\s,]+\s+){0,2}?([^\s,]+?(?:ría|rías|ríamos|rían))\b/gi)) add(m[0], `Nach „si“ steht kein Konditional: si tuviera …, dann ${m[1]}.`, 'condicional');
    for (const m of t.matchAll(/\b(me|te|le|nos|les)\s+(gusta|encanta|interesa)\s+(los|las|mis|tus|sus|estos|estas)\s+\S+/gi)) add(m[0], `Das Verb richtet sich nach dem, was gefällt: ${m[1].toLowerCase()} ${m[2].toLowerCase()}n ${m[3].toLowerCase()} …`, 'gustar');
    for (const m of t.matchAll(new RegExp(String.raw`\b(me|te|le|nos|les)\s+(gustan|encantan|interesan)\s+(el|la|mi|tu|su|este|esta)\s+(\S+?)${rxSet(P_CLOSE)}?(?=\s)`, 'gi'))) if (!/s$/.test(m[4])) add(m[0], `Bei einer Sache in der Einzahl: ${m[1].toLowerCase()} ${m[2].toLowerCase().slice(0, -1)} ${m[3].toLowerCase()} ${m[4]}.`, 'gustar');
    const PASTMARK = /(ayer|anoche|anteayer|la semana pasada|el (año|mes|verano|invierno|lunes|martes|miércoles|jueves|viernes|sábado|domingo|fin de semana) pasado|hace \S+ (años|días|semanas|meses)|en (19|20)\d\d)/i;
    sents.forEach(s => { const pm = s.match(PASTMARK), hm = s.match(/\b(he|has|ha|hemos|habéis|han)\s+(\S+?(?:ado|ido)|hecho|dicho|visto|escrito|puesto|vuelto|abierto)\b/i); if (pm && hm) add(`${pm[0]} … ${hm[0]}`, `Mit „${pm[0].toLowerCase()}“ steht in Spanien das Indefinido, nicht „${hm[0].toLowerCase()}“.`, 'perfecto'); });
    for (const m of t.matchAll(/\b(soy|eres|es|somos|son)\s+(cansad[oa]s?|enferm[oa]s?|content[oa]s?|ocupad[oa]s?|nervios[oa]s?|preocupad[oa]s?|enfadad[oa]s?|aburrid[oa]s?)\b/gi)) {
      const v = m[1].toLowerCase();
      if ((v === 'es' || v === 'son') && /aburrid|cansad/i.test(m[2])) continue; // „es aburrido“ = ist langweilig, „es cansado“ = ist anstrengend
      add(m[0], `Für einen Zustand steht estar: ${({ soy:'estoy', eres:'estás', es:'está', somos:'estamos', son:'están' })[v]} ${m[2].toLowerCase()}.`, 'serestar');
    }
    for (const m of t.matchAll(/\bla gente\s+(son|están|tienen|van|quieren|dicen|piensan)\b/gi)) add(m[0], `„la gente“ ist Einzahl: la gente ${({ son:'es', están:'está', tienen:'tiene', van:'va', quieren:'quiere', dicen:'dice', piensan:'piensa' })[m[1].toLowerCase()]}.`, 'konjugation');
    const g = Object.fromEntries((GENUS.es || []).map(x => [x[0], x[1]]));
    const STRESS_A = /^(agua|águila|hambre|hacha|alma|área|arma|aula|ala|hada)$/;
    for (const m of t.matchAll(new RegExp(String.raw`\b(el|la|un|una)\s+(\S+?)${rxSet(P_CLOSE)}?(?=\s)`, 'gi'))) {
      const noun = m[2].toLowerCase(), want = g[noun]; if (!want || STRESS_A.test(noun)) continue;
      const art = m[1].toLowerCase(), isMasc = art === 'el' || art === 'un';
      if ((want === 'el') !== isMasc) add(m[0], `„${noun}“ ist ${want === 'el' ? 'männlich: el' : 'weiblich: la'} ${noun}.`, 'konjugation');
    }
  }
  return hints;
}
// Wörter aus Sätzen, die du gerade lernst (schon geübt, noch nicht gefestigt)
const W_STOP = new Set('och att det som en ett är jag du han hon vi ni de man inte på i med för till av om har kan ska vill den detta var mycket bara också men så när här där nu idag igår hur vad vem hans hennes deras min din sin mitt ditt sitt mina dina sina vara göra blir blev från efter under över mellan utan andra något några många alla inga ingen själv el la los las un una que de en y a es no se lo le me te mi tu su por para con del al más muy pero como hay está son'.split(' '));
// Eigennamen (Anna, Uppsala, Madrid) sind keine Wörter zum Einbauen: irgendwo in den Sätzen mitten im Satz groß geschrieben,
// oder im Wörterbuch als Name, Stadt, Land markiert (so fallen auch Namen am Satzanfang heraus)
function properNames(lang){
  const out = new Set();
  BANK[lang].forEach(i => {
    const ws = String(i.target).split(/\s+/);
    ws.forEach((x, k) => {
      const m = wordCore(x).match(/^([A-ZÅÄÖÁÉÍÓÚÑ][a-zåäöéáíóúñü]+)/); if (!m) return;
      const w = m[1].toLowerCase(), first = k === 0 || [...wordParts(ws[k - 1]).post].some(ch => (P_STOP + ':').includes(ch)), e = lookupWord(lang, w);
      if (!first || (e && /\((Name|Stadt|Land|Ort|Insel)/.test(e.de))) out.add(w);
    });
  });
  return out;
}
function learningWords(lang){
  const out = new Map();
  // Nur Inhaltswörter: keine Funktionswörter, Bindewörter oder Verbindungswörter, Grundform mindestens 4 Buchstaben
  const skip = w => w.length < 4 || W_STOP.has(w) || W_SUBS[lang].includes(w) || W_CONN[lang].includes(w);
  const nm = properNames(lang);
  BANK[lang].forEach(i => { const st = stOf(i.id); if (!st || (st.ivl || 0) >= MATURE) return; wTokens(i.target).forEach(w => { if (skip(w) || nm.has(w)) return; const e = lookupWord(lang, w); const base = (e && e.l) || w; if (skip(base)) return; if (!out.has(base)) out.set(base, { w, base, de:e ? e.de.split(';')[0].replace(/\s*\(.*$/, '') : '' }); }); });
  return [...out.values()];
}
// Wörter zum Einbauen beim Schreiben: fünf Vorschläge (Grundform, gebeugt zählt auch) und ob es weitere gibt (für „Andere Wörter“);
// bisher gezeigte kommen zuletzt
const W_SUGG = 5;
function suggWords(lang, not){
  const all = shuffle(learningWords(lang)), fresh = all.filter(x => !(not || []).includes(x.base));
  return { sugg:fresh.concat(all.filter(x => !fresh.includes(x))).slice(0, W_SUGG), suggMore:all.length > W_SUGG };
}
function analyzeText(lang, text){
  const sents = sentSplit(text), toks = wTokens(text);
  const words = toks.length, lower = ' ' + toks.join(' ') + ' ';
  const has = (s, x) => (' ' + wTokens(s).join(' ') + ' ').includes(' ' + x + ' ');
  const subs = W_SUBS[lang].filter(x => lower.includes(' ' + x + ' '));
  const subCount = sents.filter(s => W_SUBS[lang].some(x => has(s, x))).length;
  const conns = W_CONN[lang].filter(x => lower.includes(' ' + x + ' '));
  const tenses = tensesOf(lang, toks);
  const long = toks.filter(w => w.length > 6).length;
  const lix = words && sents.length ? Math.round(words / sents.length + 100 * long / words) : 0;
  const learnSet = new Map(learningWords(lang).map(x => [x.base, x]));
  const used = new Set();
  toks.forEach(w => { const e = lookupWord(lang, w); const base = (e && e.l) || w; if (learnSet.has(base)) used.add(base); });
  const unknown = [...new Set(toks.filter(w => w.length > 2 && !lookupWord(lang, w)))].slice(0, 8);
  const lemmas = new Set(toks.map(w => { const e = lookupWord(lang, w); return (e && e.l) || w; }));
  const frontedOk = lang === 'sv' && sents.some(s => /^(idag|i dag|igår|i går|imorgon|i morgon|ikväll|nu|ibland|ofta|sedan|sen|på \S+|i \S+)\s+(\S+)\s+(jag|du|han|hon|vi|ni|de|man|det)\b/i.test(s));
  return { words, sents:sents.length, avg:sents.length ? Math.round(words / sents.length * 10) / 10 : 0, lix, tenses:[...tenses], subs, subCount, conns, newUsed:[...used], unknown, variety:lemmas.size, frontedOk, hints:textHints(lang, text) };
}
// Bausteine: konkret benannte Dinge statt einer Note
function blocksOf(lang, a){
  const pastKeys = lang === 'sv' ? ['past', 'perf', 'plup'] : ['indef', 'imp', 'perf'];
  const hasPast = a.tenses.some(x => pastKeys.includes(x));
  return [
    { k:'tense', ok:a.tenses.length >= 2, t:'Mehr als eine Zeitform', d:a.tenses.length ? a.tenses.map(x => W_TENSE_DE[x]).join(', ') : 'keine erkannt' },
    { k:'past', ok:hasPast, t:'Vergangenheit', d:hasPast ? 'kommt vor' : 'noch nicht dabei' },
    { k:'sub', ok:a.subCount >= 1, t:'Nebensätze', d:a.subs.length ? `${a.subCount} ${a.subCount === 1 ? 'Satz' : 'Sätze'} mit ${a.subs.slice(0, 4).join(', ')}` : 'noch keiner' },
    { k:'conn', ok:a.conns.length >= 2, t:'Verbindungswörter', d:a.conns.length ? a.conns.slice(0, 5).join(', ') : `noch keine außer ${lang === 'sv' ? 'och' : 'y'}` },
    { k:'new', ok:a.newUsed.length >= 1, t:'Neu Gelerntes benutzt', d:a.newUsed.length ? a.newUsed.slice(0, 5).join(', ') : 'noch nichts' }
  ];
}
// Extra-Aufgaben. Bevorzugt das, was in deinen letzten Texten fehlte.
const W_EXTRA = {
  sv:[
    { k:'past', t:'Mindestens ein Satz in der Vergangenheit, etwa mit Igår …', ok:a => a.tenses.some(x => ['past', 'perf', 'plup'].includes(x)) },
    { k:'sub', t:'Ein Nebensatz mit eftersom, när oder om', ok:a => a.subs.some(x => ['eftersom', 'när', 'om'].includes(x)) },
    { k:'front', t:'Beginne einen Satz mit einer Zeitangabe und denk an die Inversion', ok:a => a.frontedOk },
    { k:'fut', t:'Etwas über die Zukunft, mit ska oder kommer att', ok:a => a.tenses.includes('fut') },
    { k:'cond', t:'Ein Wunsch mit skulle vilja', ok:a => a.tenses.includes('cond') },
    { k:'new', t:'Benutze zwei Wörter aus deinen neuen Sätzen', ok:a => a.newUsed.length >= 2 },
    { k:'len', t:'Mindestens 60 Wörter', ok:a => a.words >= 60 }
  ],
  es:[
    { k:'past', t:'Erzähl etwas Abgeschlossenes im Indefinido, etwa mit Ayer …', ok:a => a.tenses.includes('indef') },
    { k:'imp', t:'Beschreib, wie etwas früher war, im Imperfecto (Antes …)', ok:a => a.tenses.includes('imp') },
    { k:'subj', t:'Einmal Subjuntivo: quiero que, espero que oder ojalá', ok:a => a.tenses.includes('subj') },
    { k:'cond', t:'Ein Wunsch im Konditional, etwa mit me gustaría', ok:a => a.tenses.includes('cond') },
    { k:'sub', t:'Verbinde Gedanken mit porque, aunque oder cuando', ok:a => a.subs.some(x => ['porque', 'aunque', 'cuando'].includes(x)) },
    { k:'fut', t:'Etwas über die Zukunft, mit voy a …', ok:a => a.tenses.includes('fut') },
    { k:'new', t:'Benutze zwei Wörter aus deinen neuen Sätzen', ok:a => a.newUsed.length >= 2 },
    { k:'len', t:'Mindestens 60 Wörter', ok:a => a.words >= 60 }
  ]
};
function pickExtra(lang, avoidK){
  const list = W_EXTRA[lang], recent = (DB.texts || []).filter(x => x.lang === lang).slice(-4);
  const missed = x => recent.filter(r => !(r.done || []).includes(x.k)).length;
  const scored = list.filter(x => x.k !== avoidK).map(x => ({ x, s:missed(x) + Math.random() * 1.5 }));
  scored.sort((a, b) => b.s - a.s);
  return scored[0].x.k;
}
function saveText(w, a){
  DB.texts = DB.texts || [];
  const ex = W_EXTRA[w.lang].find(x => x.k === w.extra);
  const rec = { id:w.id, date:today(), lang:w.lang, prompt:w.prompt, text:w.text, extra:w.extra || '', extraOk:ex ? !!ex.ok(a) : false,
    m:{ words:a.words, sents:a.sents, avg:a.avg, lix:a.lix, tenses:a.tenses, subs:a.subCount, conns:a.conns.length, newUsed:a.newUsed.length, hints:a.hints.length },
    done:W_EXTRA[w.lang].filter(x => x.ok(a)).map(x => x.k) };
  const i = DB.texts.findIndex(x => x.id === w.id);
  if (i >= 0) DB.texts[i] = rec; else DB.texts.push(rec);
  if (DB.texts.length > 500) DB.texts.splice(0, DB.texts.length - 500);
  save();
}
function profileHtml(lang, a, extraK){
  if (a.words < 8) return '<p class="hint">Zu kurz für eine Auswertung.</p>';
  const ex = W_EXTRA[lang].find(x => x.k === extraK);
  const lixWord = a.lix < 25 ? 'sehr leicht' : a.lix < 35 ? 'leicht' : a.lix < 45 ? 'mittel' : a.lix < 55 ? 'anspruchsvoll' : 'schwer';
  return `<div class="wprof">
    <p class="wp-sum">${a.words} Wörter · ${a.sents} ${a.sents === 1 ? 'Satz' : 'Sätze'} · Ø ${String(a.avg).replace('.', ',')} Wörter pro Satz · <button type="button" class="term" data-a="term" data-k="lix">LIX</button> ${a.lix} <span class="dim">(${lixWord})</span></p>
    ${ex ? `<p class="wp-extra${ex.ok(a) ? ' ok' : ''}">${ex.ok(a) ? '✓' : '○'} Extra: ${esc(ex.t)}</p>` : ''}
    <ul class="wblocks">${blocksOf(lang, a).map(b => `<li class="${b.ok ? 'ok' : ''}"><span class="wb-i" aria-hidden="true">${b.ok ? '✓' : '○'}</span><span class="wb-t">${b.t}</span><span class="wb-d">${esc(b.d)}</span></li>`).join('')}</ul>
    ${a.hints.length ? `<p class="pop-sub">Prüf mal</p><ul class="whints">${a.hints.map(h => `<li><span class="wh-at" lang="${lang}">${esc(h.at)}</span><span class="wh-m">${termify(h.msg)}</span>${trapMeta(lang, h.topic) ? `<button type="button" class="link" data-a="topic" data-t="${h.topic}">Regel ansehen</button>` : ''}</li>`).join('')}</ul>` : `<p class="hint">Keine Auffälligkeiten.</p>`}
    ${a.unknown.length ? `<p class="hint">Unbekannt: <span lang="${lang}">${esc(a.unknown.join(', '))}</span>.</p>` : ''}
  </div>`;
}
// Langfristig: Wie verändern sich deine Texte? Vergleich der ersten mit den letzten Texten
function writingTrendHtml(lang){
  const list = (DB.texts || []).filter(x => x.lang === lang && x.m && x.m.words >= 20);
  if (list.length < 2) return '';
  const k = Math.min(3, Math.floor(list.length / 2)), first = list.slice(0, k), last = list.slice(-k);
  const avg = (arr, f) => arr.reduce((s, x) => s + f(x), 0) / arr.length;
  const rows = [['Wörter pro Satz', x => x.m.avg, 1], ['Zeitformen pro Text', x => x.m.tenses.length, 1], ['Nebensätze pro Text', x => x.m.subs, 1], ['LIX', x => x.m.lix, 0]]
    .map(([l, f, dec]) => { const a = avg(first, f), b = avg(last, f); return `<div><b>${b.toFixed(dec).replace('.', ',')}</b><span>${l}</span><span class="${b > a + 0.05 ? 'up' : 'dim'}">anfangs ${a.toFixed(dec).replace('.', ',')}</span></div>`; }).join('');
  const total = list.reduce((s, x) => s + x.m.words, 0);
  return `<h2 class="grp">Schreiben</h2><div class="chart"><div class="kpis k4">${rows}</div><p class="legend">${list.length} Texte, zusammen ${total.toLocaleString('de-DE')} Wörter.</p></div>`;
}
function archiveHtml(lang){
  const list = (DB.texts || []).filter(x => x.lang === lang).slice().reverse();
  if (!list.length) return '';
  const open = S.write && S.write.openId;
  return `<details class="warch"${S.write && S.write.openId ? ' open' : ''}><summary>Frühere Texte (${list.length})</summary><ul>${list.slice(0, 30).map(x => `<li><button type="button" class="link" data-a="wopen" data-id="${x.id}">${dateOf(x.date).getDate()}. ${MONTHS[dateOf(x.date).getMonth()]} · ${x.m.words} Wörter${x.extraOk ? ' · Extra ✓' : ''}</button><span class="dim"> ${esc(x.prompt.slice(0, 60))}${x.prompt.length > 60 ? ' …' : ''}</span>${open === x.id ? `<p class="wtext-old" lang="${lang}">${esc(x.text)}</p>` : ''}</li>`).join('')}</ul></details>`;
}
