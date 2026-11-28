/* ---------- Reihen: Lesetexte in Fortsetzungen (seit 24.97.0) ---------- */
// Eine Reihe ist eine feste Folge von Teilen. Gelesen wird im gewohnten Leser (part_read.js: Vorlesen, „Nur hören“, Antippen, Fragen,
// „Ins Tagwerk“, Lückentext); dazu kommen die Übersicht, „Bisher“ am Anfang jedes Teils, „Im nächsten Teil“ am Ende und die
// Fortsetzung auf „Heute“. Der Fortschritt steht im vorhandenen Speicher der Lesetexte (DB.used.texts, Schlüssel „sv:palme-2“),
// es gibt also kein neues Datenformat. Inhalte kommen in Paketen (data/reihen.js, Regeln in docs/REIHEN.md).
// Die Erzählform (form) zeigt die App nicht, man soll unvoreingenommen hineinlesen; die Liste steht in docs/REIHEN.md und in der Prüfung
const seriesList = lang => SERIES[lang] || [];
const seriesById = (lang, id) => seriesList(lang).find(s => s.id === id) || null;
const partId = (s, i) => `${s.id}-${i + 1}`;
// Ein Teil als Lesetext: dieselben Felder, Kennung, Thema und Niveau von der Reihe; label ist der Name für Lesetext-Lücken („Aus …“)
const partText = (s, i) => Object.assign({}, s.parts[i], { id:partId(s, i), topic:s.topic, level:s.level, series:s.id, part:i, label:s.title });
function seriesPart(lang, id){
  for (const s of seriesList(lang)) { const i = s.parts.findIndex((_, k) => partId(s, k) === id); if (i >= 0) return partText(s, i); }
  return null;
}
// Einzeltexte und alle Teile: für Lesetext-Lücken aus Gelesenem
const allTexts = lang => TEXTS[lang].concat(seriesList(lang).flatMap(s => s.parts.map((_, i) => partText(s, i))));
// Gelesen heißt: zu den Fragen gegangen (read) oder sie beantwortet (best). Offen sind die gelesenen Teile und der erste ungelesene;
// gelesene lassen sich jederzeit noch einmal lesen, die Fragen noch einmal beantworten (das beste Ergebnis bleibt).
function seriesState(lang, s){
  const done = (DB.used && DB.used.texts) || {}, rec = s.parts.map((_, i) => done[lang + ':' + partId(s, i)]);
  const read = rec.map(Boolean), first = read.indexOf(false), next = first < 0 ? s.parts.length : first;
  return { read, next, n:read.filter(Boolean).length, all:first < 0, last:rec.reduce((m, d) => (d && d.last > m ? d.last : m), '') };
}
const partOpen = (st, i) => st.read[i] || i === st.next;
// Beim Gang zu den Fragen (Knopf oder Ende des Vorlesens): Teil gilt als gelesen, der nächste öffnet sich
function markRead(T){
  if (!T || !T.id || !seriesPart(T.lang, T.id)) return;
  DB.used = DB.used || {}; DB.used.texts = DB.used.texts || {};
  const k = T.lang + ':' + T.id;
  if (!DB.used.texts[k]) { DB.used.texts[k] = { read:true, last:today() }; save(); }
}
// Einleitung und „Bisher“: bei „Grundlagen“ deutsch, sonst in der Zielsprache und antippbar, auf Wunsch das Deutsche darunter
function tlOrDe(pair, lang, cls, showDe){
  if (!pair) return '';
  if (niveau() === 'grund') return `<p class="${cls}">${esc(pair[1])}</p>`;
  return `<p class="${cls} wordrow" lang="${lang}">${linkWords(pair[0], lang)}</p>${showDe ? `<p class="tl-de" lang="de">${esc(pair[1])}</p>` : ''}`;
}
// Bis wohin Personen und Wörter gezeigt werden: bis zum zuletzt gelesenen Teil, vor dem ersten Lesen die aus Teil 1 (kein Vorgriff)
const seriesReach = st => Math.max(1, st.n);
function openPart(lang, s, i){ S.series = { lang, id:s.id }; openText(lang, partId(s, i), null, 'series'); }

/* Lesen und Hören: Reihen über den Einzeltexten. Tipp auf eine begonnene Reihe führt gleich zum nächsten Teil, sonst zur Übersicht. */
function seriesCards(lang){
  const list = seriesList(lang); if (!list.length) return '';
  return `<h2 class="grp">Reihen</h2><div class="tgrid2">${list.map(s => {
    const st = seriesState(lang, s), N = s.parts.length;
    const cta = st.all ? `Alle ${N} Teile gelesen` : st.n ? `Weiter mit Teil ${st.next + 1} ›` : 'Beginnen ›';
    return `<button type="button" class="tcard scard" data-a="sopen" data-s="${s.id}"><span class="tchips"><span class="tag">${esc(s.topic)}</span><span class="tag">${s.level}</span></span>
      <span class="ttitle" lang="${lang}">${esc(s.title)}</span><span class="tteaser" lang="${lang}">${esc(s.teaser)}</span>
      <span class="sprog"><span class="sdash" aria-label="${st.n} von ${N} Teilen gelesen">${st.read.map(r => `<i${r ? ' class="on"' : ''}></i>`).join('')}</span><span class="scta">${cta}</span></span></button>`;
  }).join('')}</div><h2 class="grp">Einzelne Texte</h2>`;
}

/* Übersicht einer Reihe */
function viewSeries(){
  const P = S.series, lang = P && P.lang, s = P && seriesById(lang, P.id);
  if (!s) return backBar('Lesen und Hören', 'texts') + '<p class="lead">Keine Reihe geöffnet.</p>';
  const st = seriesState(lang, s), N = s.parts.length, reach = seriesReach(st);
  const rail = s.parts.map((p, i) => {
    const open = partOpen(st, i), cls = st.read[i] ? 'done' : i === st.next ? 'now' : 'next';
    const inner = `${open ? `<span class="mr-t" lang="${lang}">${esc(p.title)}</span>` : `<span class="mr-t">Teil ${i + 1}</span>`}${open ? `<span class="mr-d">${esc(p.when || '')}</span>` : ''}`;
    return `<li class="mr ${cls}"><i></i>${open ? `<button type="button" class="mr-b" data-a="spart" data-s="${s.id}" data-i="${i}" aria-label="Teil ${i + 1}: ${esc(p.title)}${st.read[i] ? ', gelesen, noch einmal lesen' : ''}">${inner}</button>` : `<span class="mr-b">${inner}</span>`}</li>`;
  }).join('');
  const cast = (s.cast || []).filter(c => (c[2] || 1) <= reach);
  const words = (s.words || []).filter(w => (w[1] || 1) <= reach);
  const go = st.all ? [0, 'Von vorn lesen'] : [st.next, st.n ? `Weiter mit Teil ${st.next + 1}` : 'Beginnen'];
  return backBar('Lesen und Hören', 'texts') + `<header class="rhero">
      <div class="tchips"><span class="tag">${esc(s.topic)}</span><span class="tag">${s.level}</span><span class="tag">${N} Teile</span></div>
      <h1 class="rtitle" lang="${lang}">${hangLead(esc(s.title))}</h1>
      ${tlOrDe(s.intro, lang, 'shook', P.de)}${niveau() !== 'grund' && !P.de ? '<p class="vocab"><button type="button" class="link dim" data-a="sde">Auf Deutsch</button></p>' : ''}
    </header>
    ${s.real ? `<div class="sreal"><b>Was ist echt?</b> ${esc(s.real)}</div>` : ''}
    <h2 class="grp">Teile</h2><section class="mile srail"><ol class="mrail rl-${lang}">${rail}</ol>${st.next + 1 < N ? '<p class="legend">Titel und Personen erscheinen, wenn du so weit bist.</p>' : ''}</section>
    ${cast.length ? `<h2 class="grp">${st.all ? 'Personen' : 'Personen bisher'}</h2><div class="rows">${cast.map(([n, d]) => `<div class="row static"><span class="txt"><span class="rt">${esc(n)}</span><span class="rd">${esc(d)}</span></span></div>`).join('')}</div>` : ''}
    ${words.length ? `<h2 class="grp">Wörter der Reihe</h2><div class="wtray">${words.map(([w]) => { const e = lookupWord(lang, w); return `<button type="button" class="wchip" data-a="lookup" data-w="${esc(w)}"><b lang="${lang}">${esc(w)}</b>${e ? `<span>${esc(e.de.split(/[;(]/)[0].trim())}</span>` : ''}</button>`; }).join('')}</div>` : ''}
    <div class="actionbar"><div class="in"><button type="button" class="primary" data-a="spart" data-s="${s.id}" data-i="${go[0]}">${go[1]}</button></div></div>`;
}

/* Im Leser: Kopf, „Bisher“ und Ende eines Teils */
function seriesHero(t, T){
  const s = seriesById(T.lang, t.series), N = s ? s.parts.length : 0;
  return `<div class="tchips"><span class="tag">Teil ${t.part + 1} von ${N}</span><span class="tag">${t.level}</span>${T.hidden ? '<span class="tag on">Nur hören</span>' : ''}</div>`;
}
const seriesDate = t => (t.date ? `<p class="rdate">${esc(t.date)}</p>` : '');
const seriesRecap = (t, lang) => (t.part > 0 && t.recap ? `<div class="sbisher"><p class="sbisher-k">Bisher</p>${tlOrDe(t.recap, lang, 'sbisher-t')}</div>` : '');
// Nebenweg links, Hauptweg rechts; „Weiter“ reicht, darüber steht, was kommt (lange Beschriftungen brachen auf 360 px um)
function seriesEnd(t, lang){
  const s = seriesById(lang, t.series); if (!s) return '';
  const nx = s.parts[t.part + 1];
  const src = t.src && t.src.length ? `<p class="legend">Quellen: ${t.src.map(esc).join('; ')}.</p>` : '';
  const gap = `<button type="button" class="ghost" data-a="textgap" data-id="${t.id}">Lückentext üben</button>`;
  if (!nx) return `<section class="snext"><p class="find-k">Ende der Reihe</p><p class="snext-t">Du hast alle ${s.parts.length} Teile gelesen.</p>
    <div class="btnrow">${gap}<button type="button" class="primary" data-a="tab" data-v="series">Zur Übersicht</button></div></section>${src}`;
  return `<section class="snext"><p class="find-k">Im nächsten Teil${nx.when ? ` · ${esc(nx.when)}` : ''}</p><p class="snext-h" lang="${lang}">${esc(nx.title)}</p>
    ${nx.hook ? `<p class="snext-t wordrow" lang="${lang}">${linkWords(nx.hook, lang)}</p>` : ''}
    <div class="btnrow">${gap}<button type="button" class="primary" data-a="snext" data-s="${s.id}" data-i="${t.part + 1}" aria-label="Weiter mit Teil ${t.part + 2}">Weiter</button></div></section>${src}`;
}
// Fragen eines Teils bei „Fortgeschritten“ in der Zielsprache, wenn der Teil sie mitbringt (q[3] Frage, q[4] Antworten)
const seriesQ = (t, q) => (t.series && niveau() === 'fort' && q[3] && q[4] ? { q:q[3], opts:q[4], tl:true } : { q:q[0], opts:q[1], tl:false });

/* Heute: Fortsetzung statt Fundstück, solange eine Reihe offen ist, in den letzten sieben Tagen gelesen wurde und heute noch kein
   Teil dran war. Danach kommt das Fundstück wieder. */
function seriesContinue(lang){
  const t0 = today(), from = addDays(t0, -7);
  const open = seriesList(lang).map(s => ({ s, st:seriesState(lang, s) })).filter(x => x.st.n && !x.st.all && x.st.last >= from && x.st.last < t0)
    .sort((a, b) => (a.st.last < b.st.last ? 1 : -1))[0];
  if (!open) return '';
  const { s, st } = open, p = s.parts[st.next];
  return `<section class="find scont"><p class="find-k">Fortsetzung · ${esc(s.title)} · Teil ${st.next + 1} von ${s.parts.length}</p>
    <p class="find-h"><span class="wordrow" lang="${lang}">${esc(p.title)}</span>${p.when ? `<span class="find-d"> · ${esc(p.when)}</span>` : ''}</p>
    ${p.hook ? `<p class="find-t wordrow" lang="${lang}">${linkWords(p.hook, lang)}</p>` : ''}
    <button type="button" class="link find-more" data-a="spart" data-l="${lang}" data-s="${s.id}" data-i="${st.next}">Weiterlesen</button></section>`;
}

function seriesCmd(a, b){
  const lang = b.dataset.l || (S.series && S.series.lang) || S.lang, s = seriesById(lang, b.dataset.s || (S.series && S.series.id));
  if (!s) return;
  if (a === 'sde') { S.series.de = true; render(); return; }
  const st = seriesState(lang, s);
  if (a === 'sopen') { S.series = { lang, id:s.id }; if (st.n && !st.all) openPart(lang, s, st.next); else goView('series'); return; }
  const i = Number(b.dataset.i);
  if ((a === 'spart' || a === 'snext') && s.parts[i] && partOpen(st, i)) openPart(lang, s, i);
}
