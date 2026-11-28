/* ---------- Lesen und Hören: eigene Texte mit Fragen, dazu ein Wikipedia-Fundstück (online) ---------- */
// Ein Text, zwei Wege: Lesen (Wörter antippbar) oder Hören (Text verdeckt, Satz für Satz vorgelesen, danach Fragen).
let readToken = 0, readTimer = null;
// Auch Teile von Reihen (part_series.js): gleiche Felder, Kennung „palme-2“
const textById = (lang, id) => TEXTS[lang].find(t => t.id === id) || seriesPart(lang, id);
// Antworten mischen, aber für denselben Text immer gleich (sonst springt die Reihenfolge beim Neuzeichnen)
function optionOrder(id, k, n){ const o = [...Array(n).keys()]; let h = parseInt(hash(id + ':' + k), 36); for (let i = n - 1; i > 0; i--) { const j = h % (i + 1); h = Math.floor(h / 7) + 13; [o[i], o[j]] = [o[j], o[i]]; } return o; }
// Lesen oder nur hören wird vor dem Öffnen gewählt (in der Übersicht) und gemerkt: Wer hören will, soll den Text vorher nicht sehen.
const textMode = () => (DB.settings.textMode === 'listen' ? 'listen' : 'read');
// back: wohin „zurück“ führt, wenn der Text nicht aus der Übersicht kommt (etwa aus Land & Leute)
function openText(lang, id, mode, back){
  const t = textById(lang, id); if (!t) return;
  stopReading();
  S.text = { lang, id, back:back || null, hidden:(mode || textMode()) === 'listen', sents:textSentences(t.body), si:0, playing:false, slow:!!DB.settings.slowRead, picks:{}, qi:0, revealed:[], looked:[], quiz:false, tapped:null, t0:Date.now() };
  goView('text');
  if (S.text.hidden) readPlay();
}
function stopReading(){ readToken++; clearTimeout(readTimer); if (S.text) S.text.playing = false; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }
function flatSents(T){ return T.sents.flat(); }
// Aktuellen Satz sichtbar halten, ohne zu springen, wenn er schon im Bild ist
function followSentence(sel){
  const el = document.querySelector(sel || '.rs-s.on'); if (!el) return;
  const r = el.getBoundingClientRect(), bar = document.querySelector('.reader-bar'), bottom = (bar ? bar.getBoundingClientRect().top : innerHeight) - 16;
  if (r.top < 70 || r.bottom > bottom) { const calm = calmMotion(); el.scrollIntoView({ block:sel ? 'start' : 'center', behavior:calm ? 'auto' : 'smooth' }); }
}
function readPlay(){
  const T = S.text; if (!T) return;
  const list = flatSents(T);
  if (T.si >= list.length) {
    // Text zu Ende gehört: beim reinen Hören kommen jetzt die Fragen
    T.playing = false; T.si = Math.max(0, list.length - 1); T.listened = true;
    if (T.hidden && T.id && !T.quiz) { T.quiz = true; T.enter = true; markRead(T); if (S.view === 'text') { render(); followSentence('.tq'); } return; }
    if (S.view === 'text') render(); return;
  }
  T.playing = true; T.startedAt = Date.now();
  const tok = ++readToken, tts = LANG[T.lang].tts;
  if (S.view === 'text') { render(); if (!T.quiz) followSentence(); }
  sayThen(list[T.si], tts, T.slow ? 0.72 : 0.92, () => {
    if (tok !== readToken || S.text !== T || !T.playing) return;
    clearTimeout(readTimer);
    readTimer = setTimeout(() => { if (tok === readToken && S.text === T && T.playing) { T.si++; readPlay(); } }, 650);
  });
}
function textDone(T, t){ return !!t && Object.keys(T.picks).length >= t.q.length; }
const srcIndex = (T, src) => flatSents(T).findIndex(x => x.includes(src));
function readCmd(a, b){
  const T = S.text; if (!T) return;
  const t = T.id ? textById(T.lang, T.id) : null;
  if (a === 'tplayall') { if (T.playing) stopReading(); else { if (T.listened) { T.si = 0; T.listened = false; } readPlay(); } }
  else if (a === 'treplay') {
    // Wie bei einem Player: Noch einmal den aktuellen Satz, in der ersten Sekunde den davor
    const back = T.playing && Date.now() - (T.startedAt || 0) < 1200 && T.si > 0;
    stopReading(); if (back) T.si--; readPlay(); return;
  }
  else if (a === 'tslow') { T.slow = !T.slow; DB.settings.slowRead = T.slow; save(); if (T.playing) { stopReading(); readPlay(); return; } }
  else if (a === 'tshowall') { T.unveiled = !T.unveiled; if (!T.unveiled) T.revealed = []; }
  else if (a === 'treveal') {
    // Verschwommener Satz: erstes Antippen spielt ihn noch einmal, zweites deckt ihn auf
    const i = Number(b.dataset.i);
    if (T.tapped === i) { if (!T.revealed.includes(i)) T.revealed.push(i); T.tapped = null; }
    else { T.tapped = i; stopReading(); T.si = i; readPlay(); return; }
  }
  else if (a === 'tsay') { S.pop = null; renderPopup(); stopReading(); T.si = Number(b.dataset.i); readPlay(); return; }
  else if (a === 'tquiz') { T.quiz = true; T.enter = true; markRead(T); render(); followSentence('.tq'); return; }
  else if (a === 'tqnext') { T.qi = Math.min(T.qi + 1, t ? t.q.length : 0); T.enter = true; }
  else if (a === 'tpick') {
    const k = Number(b.dataset.k); if (!t || T.picks[k] != null) return;
    T.picks[k] = Number(b.dataset.i);
    buzz(T.picks[k] === 0 ? 'ok' : 'bad');
    if (textDone(T, t)) {
      const score = Object.values(T.picks).filter(i => i === 0).length;
      DB.used.texts = DB.used.texts || {};
      const prev = DB.used.texts[T.lang + ':' + T.id] || {};
      DB.used.texts[T.lang + ':' + T.id] = { best:Math.max(prev.best || 0, score), n:(prev.n || 0) + 1, last:today(), heard:prev.heard || !!T.hidden };
      logDay(T.lang, { secs:Math.min(900, Math.round((Date.now() - (T.t0 || Date.now())) / 1000)) });
      save();
    }
  } else if (a === 'tkeep') {
    const kp = t && t.keep[Number(b.dataset.k)]; if (!kp) return;
    const id = T.lang + ':own:' + hash(kp[0]);
    if (!DB.own[T.lang].some(o => o.id === id)) DB.own[T.lang].push({ id, de:kp[1], target:kp[0], created:today(), src:'text' });
    save(); buildBank();
  } else if (a === 'tnexttext') {
    const list = TEXTS[T.lang], i = list.findIndex(x => x.id === T.id), done = (DB.used && DB.used.texts) || {};
    const nxt = list.slice(i + 1).concat(list.slice(0, i)).find(x => !done[T.lang + ':' + x.id]) || list[(i + 1) % list.length];
    openText(T.lang, nxt.id); return;
  }
  render();
  if (a === 'tpick') keepAboveBar('.tq-src');
  else if (a === 'tqnext') followSentence(textDone(T, t) && T.qi >= t.q.length ? '.tdone' : '.tq');
}
// Element über der Leiste sichtbar machen, ohne den Anfang der Frage aus dem Bild zu schieben
function keepAboveBar(sel){
  const el = document.querySelector(sel), card = document.querySelector('.tq'); if (!el) return;
  const bar = document.querySelector('.reader-bar'), limit = (bar ? bar.getBoundingClientRect().top : innerHeight) - 12;
  const over = el.getBoundingClientRect().bottom - limit; if (over <= 0) return;
  const room = card ? card.getBoundingClientRect().top - 8 : over;
  const calm = calmMotion();
  window.scrollBy({ top:Math.min(over, Math.max(0, room)) || over, behavior:calm ? 'auto' : 'smooth' });
}
function viewTexts(){
  const lang = S.lang, done = (DB.used && DB.used.texts) || {}, niv = DB.settings.niveau || 'mittel', rank = { A2:1, B1:2, B2:3, C1:4 };
  const list = niv === 'mittel' ? TEXTS[lang] : TEXTS[lang].slice().sort((a, b) => (niv === 'fort' ? rank[b.level] - rank[a.level] : rank[a.level] - rank[b.level]));
  const cards = list.map(t => { const d = done[lang + ':' + t.id];
    const state = d ? `<span class="tstate${d.best === t.q.length ? ' full' : ''}">${d.best} von ${t.q.length}${d.heard ? ', gehört' : ''}</span>` : '';
    return `<button type="button" class="tcard" data-a="textopen" data-id="${t.id}"><span class="tchips"><span class="tag">${esc(t.topic)}</span><span class="tag">${t.level}</span>${state}</span><span class="ttitle" lang="${lang}">${esc(t.title)}</span><span class="tteaser" lang="${lang}">${esc(textSentences(t.body)[0][0])}</span></button>`; }).join('');
  return backBar('Lesen und Hören') + `
    <div class="seg2 tmode" role="radiogroup" aria-label="Wie möchtest du die Texte?">${[['read', 'Lesen und hören'], ['listen', 'Nur hören']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${textMode() === k}" data-a="tdefmode" data-v="${k}">${l}</button>`).join('')}</div>
    <p class="lead-s">${textMode() === 'listen' ? 'Der Text bleibt verdeckt, bis die drei Fragen beantwortet sind.' : 'Lesen, auf Wunsch mit Vorlesen, danach drei Fragen.'}</p>
    ${seriesCards(lang)}<div class="tgrid2">${cards}</div>
    <h2 class="grp">Frischer Lesestoff</h2>
    <div class="rows">${row('wiki', 'Wikipedia-Fundstück', navigator.onLine === false ? 'Braucht eine Internetverbindung' : 'Ein ausgezeichneter Artikel, gern mit Bezug zum Land', '')}</div>`;
}
const PICO = {
  play:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  pause:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>',
  prev:'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  replay:'<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4.5 4.2v4.6h4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  slow:'<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path d="M3.5 16c0-4 3.1-7.2 7-7.2s7 3.2 7 7.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M17.5 14h1.6a2 2 0 0 0 0-4h-.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 16v2.5M14.5 16v2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  eye:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
};
function viewText(){
  const T = S.text;
  if (!T) return backBar('Lesen und Hören', 'texts') + '<p class="lead">Kein Text geöffnet.</p>';
  const W = T.wiki, t = W ? null : textById(T.lang, T.id), lang = T.lang;
  const list = flatSents(T), done = textDone(T, t), finished = done && T.qi >= t.q.length;
  const veil = T.hidden && !done && !T.unveiled;
  const veiled = i => veil && !T.revealed.includes(i);
  const evidence = new Set(t ? Object.keys(T.picks).map(k => srcIndex(T, t.q[k][2])) : []);
  const heard = T.listened ? list.length : T.si;
  let k = 0;
  const fold = veil && T.quiz && !finished;
  const article = `<article class="reader${veil ? ' veiled' : ''}${fold ? ' folded' : ''}" lang="${lang}">${T.sents.map(p => `<p>${p.map(s => { const i = k++;
    const cls = `rs-s${T.playing && i === T.si ? ' on' : ''}${veiled(i) ? ' veil' : ''}${!veiled(i) && evidence.has(i) ? ' ev' : ''}`;
    return veiled(i) ? `<span class="${cls}" data-a="treveal" data-i="${i}" role="button" aria-label="Satz ${i + 1}: ${T.tapped === i ? 'aufdecken' : 'noch einmal hören'}">${esc(s)}</span>` : `<span class="${cls}" data-i="${i}">${linkWords(s, lang)}</span>`; }).join(' ')}</p>`).join('')}</article>`;
  const hero = `<header class="rhero">
      ${t && t.series ? seriesHero(t, T) : `<div class="tchips">${W ? `<span class="tag">Wikipedia</span>${W.label ? `<span class="tag">${esc(W.label)}</span>` : ''}` : `<span class="tag">${esc(t.topic)}</span><span class="tag">${t.level}</span>`}<span class="tag">${list.length} Sätze</span>${T.hidden ? '<span class="tag on">Nur hören</span>' : ''}</div>`}
      <h1 class="rtitle" lang="${lang}">${hangLead(esc(W ? W.title : t.title))}</h1>${t && t.series ? seriesDate(t) : ''}
      <div class="rprog" aria-hidden="true"><i style="width:${Math.round(100 * Math.min(heard, list.length) / Math.max(1, list.length))}%"></i></div>
      ${veil ? `<p class="rhint">${fold ? 'Der Text bleibt bis nach den Fragen verdeckt.' : 'Antippen spielt einen Satz noch einmal, zweites Antippen zeigt ihn. Nach dem letzten Satz kommen die Fragen.'}</p>` : ''}
    </header>`;
  const answered = !W && T.quiz && !finished && T.picks[Math.min(T.qi, t.q.length - 1)] != null;
  const nextBtn = answered ? `<button type="button" class="primary pnext" data-a="tqnext">${T.qi + 1 < t.q.length ? 'Nächste Frage' : 'Ergebnis'}</button>` : '';
  const bar = `<div class="actionbar reader-bar"><div class="in">
      <button type="button" class="pbtn" data-a="treplay" aria-label="Satz noch einmal">${PICO.replay}</button>
      ${T.hidden || answered ? `<button type="button" class="pbtn play" data-a="tplayall" aria-label="${T.playing ? 'Pause' : T.listened ? 'Von vorn hören' : 'Weiter hören'}">${T.playing ? PICO.pause : PICO.play}</button>`
        : `<button type="button" class="pbtn play wide" data-a="tplayall">${T.playing ? PICO.pause + '<span>Pause</span>' : PICO.play + '<span>Vorlesen</span>'}</button>`}
      <span class="pspace"></span><span class="sr-only" aria-live="polite">Satz ${Math.min(T.si + 1, list.length)} von ${list.length}</span>
      ${answered ? nextBtn : `<button type="button" class="pchip" data-a="tslow" aria-pressed="${!!T.slow}">${PICO.slow}<span>Langsam</span></button>
      ${T.hidden && (veil || T.unveiled) && !done ? `<button type="button" class="pchip" data-a="tshowall" aria-pressed="${!veil}">${PICO.eye}<span>${veil ? 'Text zeigen' : 'Verbergen'}</span></button>` : ''}`}
    </div></div>`;
  const looked = T.looked.length ? `<h2 class="grp">Nachgeschlagen</h2><div class="wtray">${T.looked.map(w => { const e = lookupWord(lang, w); return `<button type="button" class="wchip" data-a="lookup" data-w="${esc(w)}"><b lang="${lang}">${esc(w)}</b>${e ? `<span>${esc(e.de.split(/[;(]/)[0].trim())}</span>` : ''}</button>`; }).join('')}</div>` : '';
  if (W) {
    return backBar('Wikipedia-Fundstück', 'texts') + hero + article + `<p class="legend">Aus der Wikipedia, Artikel „<a href="${esc(W.url)}" target="_blank" rel="noopener">${esc(W.title)}</a>“, Text unter <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de" target="_blank" rel="noopener">CC BY-SA 4.0</a>.</p>${looked}
      <div class="btnrow"><button type="button" class="ghost" data-a="textgap" data-id="wiki">Lückentext üben</button><button type="button" class="primary" data-a="wiki">Nächster Artikel</button></div>` + bar;
  }
  // Fragen erst nach dem Text: beim Lesen auf Knopfdruck, beim Hören von selbst nach dem letzten Satz
  const gate = !T.quiz ? `<div class="tgate">${T.hidden
      ? `<p class="hint m0 mb-12">Die Fragen kommen, sobald der Text zu Ende ist.</p><button type="button" class="ghost" data-a="tquiz">Fragen jetzt</button>`
      : `<button type="button" class="primary" data-a="tquiz">Gelesen, zu den Fragen</button>`}</div>` : '';
  const score = Object.values(T.picks).filter(i => i === 0).length;
  const qi = Math.min(T.qi, t.q.length - 1), src = t.q[qi][2], picked = T.picks[qi], { q, opts, tl:qtl } = seriesQ(t, t.q[qi]);
  const srcSent = picked != null ? flatSents(T)[srcIndex(T, src)] : '';
  // Einblenden nur bei einer neuen Frage oder dem Ergebnis, nicht bei jedem Antippen einer Antwort
  const enter = T.enter ? ' enter' : ''; T.enter = false;
  const quiz = !T.quiz || finished ? '' : `<section class="tq${picked == null ? '' : ' answered'}${enter}" aria-live="polite">
      <div class="tq-head"><span>Frage ${qi + 1} von ${t.q.length}</span><span class="sdots">${t.q.map((_, i) => `<i class="${T.picks[i] == null ? (i === qi ? 'on' : '') : T.picks[i] === 0 ? 'ok' : 'bad'}"></i>`).join('')}</span></div>
      <p class="tq-q"${qtl ? ` lang="${lang}"` : ''}>${esc(q)}</p>
      <div class="tq-o">${optionOrder(t.id, qi, opts.length).map(i => `<button type="button" class="tq-b${picked != null ? (i === 0 ? ' right' : i === picked ? ' wrong' : ' dim') : ''}" data-a="tpick" data-k="${qi}" data-i="${i}"${picked != null ? ' disabled' : ''}${qtl ? ` lang="${lang}"` : ''}>${esc(opts[i])}</button>`).join('')}</div>
      ${picked != null ? `<p class="tq-src"><span class="lbl-s">Im Text</span> <span lang="${lang}">${esc(srcSent)}</span></p>` : ''}
    </section>`;
  const own = new Set((DB.own[lang] || []).map(o => o.id));
  const after = finished ? `<section class="tdone${enter}">
      <p class="tdone-h">${score === t.q.length ? 'Alles verstanden.' : `${score} von ${t.q.length} richtig.`}</p>
      <p class="hint mt-4">${T.hidden ? 'Jetzt kannst du den Text in Ruhe nachlesen. Die Stellen mit den Antworten sind markiert.' : 'Die Stellen mit den Antworten sind im Text markiert.'}</p>
      <p class="keep-h">„Ins Tagwerk“ nimmt den Satz in deine nächsten Tagwerke auf.</p>
      <div class="rows mt-8">${t.keep.map(([s, de], i) => { const has = own.has(lang + ':own:' + hash(s)); return `<div class="row static"><span class="txt"><span class="rt" lang="${lang}">${esc(s)}</span><span class="rd">${esc(de)}</span></span>${has ? '<span class="kadd on">✓ Im Tagwerk</span>' : `<button type="button" class="kadd" data-a="tkeep" data-k="${i}" aria-label="Satz ins Tagwerk übernehmen">Ins Tagwerk</button>`}</div>`; }).join('')}</div>
      ${t.series ? '' : `<div class="btnrow"><button type="button" class="ghost" data-a="textgap" data-id="${t.id}">Lückentext üben</button><button type="button" class="primary" data-a="tnexttext">Nächster Text</button></div>`}
    </section>${t.series ? seriesEnd(t, lang) : ''}` : '';
  const sr = t.series && seriesById(lang, t.series);
  return backBar(sr ? sr.title : 'Lesen und Hören', T.back || 'texts') + hero + (sr ? seriesRecap(t, lang) : '') + article + gate + (T.quiz ? `<h2 class="grp">Verstanden?</h2>` : '') + quiz + after + looked + bar;
}
// Wikipedia-Fundstück: nur Artikel, die die Wikipedia-Gemeinschaft selbst ausgezeichnet hat (exzellent bzw. gut),
// solche mit Bezug zum Kulturraum der Sprache zuerst, schon Gesehenes nicht noch einmal. Zufällig ist nur der
// Einstieg in die alphabetische Liste der Kategorie (die API kennt keinen Zufall innerhalb einer Kategorie).
const WIKI_CATS = {
  sv:[['Kategori:Wikipedia:Utmärkta artiklar', 'Exzellenter Artikel'], ['Kategori:Wikipedia:Bra artiklar', 'Guter Artikel']],
  es:[['Categoría:Wikipedia:Artículos destacados', 'Exzellenter Artikel'], ['Categoría:Wikipedia:Artículos buenos', 'Guter Artikel']]
};
const WIKI_NEAR = {
  sv:/\b(sverige|svensk\w*|stockholm\w*|göteborg\w*|malmö|skån\w*|norrland\w*|lappland\w*|sam(er|isk\w*)|nord(en|isk\w*)|skandinavi\w*|finland\w*|finsk\w*|norge|norsk\w*|danmark|dansk\w*|island|isländsk\w*|uppsala|gotland\w*|öland|kiruna|östersjö\w*|vikinga\w*)\b/i,
  es:/\b(españa|español\w*|hispan\w*|madrid\w*|barcelon\w*|andaluc\w*|cataluñ\w*|catalán|catalan\w*|vasc\w*|galicia|galleg\w*|castilla|castellan\w*|méxico|mexican\w*|argentin\w*|chile\w*|colombia\w*|perú|peruan\w*|cuba\w*|venezol\w*|venezuela|bolivia\w*|uruguay\w*|paraguay\w*|ecuador\w*|guatemal\w*|hondur\w*|nicaragu\w*|costa rica|panam\w*|puerto ric\w*|dominican\w*|latinoameric\w*|iberoameric\w*|al-ándalus|canari\w*)\b/i
};
const WIKI_LETTERS = { sv:'ABCDEFGHIJKLMNOPRSTUVÅÄÖ', es:'ABCDEFGHIJLMNOPRSTUV' };
function wikiClean(extract){
  return extract.replace(/\s*\([^()]*\)/g, '').replace(/ {2,}/g, ' ').split('\n').filter(x => x.trim().length > 40).slice(0, 4).join('\n\n');
}
async function fetchWiki(lang){
  DB.used = DB.used || {}; const seenAll = DB.used.wikiSeen = DB.used.wikiSeen || {}, seen = seenAll[lang] = seenAll[lang] || [];
  let fallback = null;
  for (let tries = 0; tries < 4; tries++) {
    const [cat, label] = WIKI_CATS[lang][tries % 2], L = WIKI_LETTERS[lang], start = L[Math.floor(Math.random() * L.length)];
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&generator=categorymembers&gcmtitle=${encodeURIComponent(cat)}&gcmnamespace=0&gcmlimit=20&gcmstartsortkeyprefix=${encodeURIComponent(start)}&prop=extracts%7Cinfo&inprop=url&exintro=1&explaintext=1&exlimit=20`;
    const res = await fetch(url); if (!res.ok) throw new Error('http ' + res.status);
    const j = await res.json();
    const pages = ((j.query && j.query.pages) || []).filter(p => p.extract && !seen.includes(p.title))
      .map(p => Object.assign(p, { body:wikiClean(p.extract) })).filter(p => p.body.length >= 400);
    const near = pages.filter(p => WIKI_NEAR[lang].test(p.title + ' ' + p.body));
    const pick = (near.length ? near : pages)[Math.floor(Math.random() * (near.length || pages.length))];
    if (!pick) continue;
    const out = { title:pick.title, url:pick.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(pick.title)}`, body:pick.body, label, near:near.length > 0 };
    if (out.near) { seen.push(out.title); if (seen.length > 400) seen.splice(0, seen.length - 400); save(); return out; }
    fallback = fallback || out;
  }
  if (fallback) { seen.push(fallback.title); save(); return fallback; }
  throw new Error('empty');
}
function openWiki(){
  const lang = S.lang;
  stopReading();
  S.text = { lang, wiki:null, loading:true, hidden:textMode() === 'listen', sents:[], si:0, playing:false, slow:!!DB.settings.slowRead, picks:{}, qi:0, revealed:[], looked:[], quiz:false, tapped:null };
  S.wikiErr = null; goView('text');
  fetchWiki(lang).then(w => {
    if (!S.text || S.text.lang !== lang) return;
    Object.assign(S.text, { wiki:w, loading:false, sents:textSentences(w.body), t0:Date.now() });
    render(); if (S.text.hidden) readPlay();
  }).catch(() => { if (S.text) { S.text.loading = false; S.wikiErr = 'Gerade kein Fundstück erreichbar. Dafür braucht es Internet.'; } render(); });
}
function viewWikiLoading(){
  return backBar('Wikipedia-Fundstück', 'texts') + (S.wikiErr ? `<p class="lead">${esc(S.wikiErr)}</p><div class="btnrow"><button type="button" class="primary" data-a="wiki">Nochmal versuchen</button></div>` : '<p class="lead dots">Suche einen Artikel</p>');
}
