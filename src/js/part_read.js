/* ---------- Lesen und Hören: eigene Texte mit Fragen, dazu ein Wikipedia-Fundstück (online) ---------- */
// Ein Text, zwei Wege: Lesen (Wörter antippbar) oder Hören (Text verdeckt, Satz für Satz vorgelesen, danach Fragen).
let readToken = 0, readTimer = null;
const textById = (lang, id) => TEXTS[lang].find(t => t.id === id);
// Antworten mischen, aber für denselben Text immer gleich (sonst springt die Reihenfolge beim Neuzeichnen)
function optionOrder(id, k, n){ const o = [...Array(n).keys()]; let h = parseInt(hash(id + ':' + k), 36); for (let i = n - 1; i > 0; i--) { const j = h % (i + 1); h = Math.floor(h / 7) + 13; [o[i], o[j]] = [o[j], o[i]]; } return o; }
// Lesen oder nur hören wird vor dem Öffnen gewählt (in der Übersicht) und gemerkt: Wer hören will, soll den Text vorher nicht sehen.
const textMode = () => (DB.settings.textMode === 'listen' ? 'listen' : 'read');
function openText(lang, id, mode){
  const t = textById(lang, id); if (!t) return;
  stopReading();
  S.text = { lang, id, hidden:(mode || textMode()) === 'listen', sents:textSentences(t.body), si:0, playing:false, slow:false, picks:{}, qi:0, revealed:[], looked:[], quiz:false, tapped:null, slow:!!DB.settings.slowRead, t0:Date.now() };
  goView('text');
  if (S.text.hidden) readPlay();
}
function stopReading(){ readToken++; clearTimeout(readTimer); if (S.text) S.text.playing = false; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }
function flatSents(T){ return T.sents.flat(); }
// Aktuellen Satz sichtbar halten, ohne zu springen, wenn er schon im Bild ist
function followSentence(sel){
  const el = document.querySelector(sel || '.rs-s.on'); if (!el) return;
  const r = el.getBoundingClientRect(), bar = document.querySelector('.reader-bar'), bottom = (bar ? bar.getBoundingClientRect().top : innerHeight) - 16;
  if (r.top < 70 || r.bottom > bottom) { const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; el.scrollIntoView({ block:sel ? 'start' : 'center', behavior:calm ? 'auto' : 'smooth' }); }
}
function readPlay(){
  const T = S.text; if (!T) return;
  const list = flatSents(T);
  if (T.si >= list.length) {
    // Text zu Ende gehört: beim reinen Hören kommen jetzt die Fragen
    T.playing = false; T.si = Math.max(0, list.length - 1); T.listened = true;
    if (T.hidden && T.id && !T.quiz) { T.quiz = true; if (S.view === 'text') { render(); followSentence('.tq'); } return; }
    if (S.view === 'text') render(); return;
  }
  T.playing = true; T.startedAt = Date.now();
  const tok = ++readToken, tts = LANG[T.lang].tts;
  if (S.view === 'text') { render(); followSentence(); }
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
  if (a === 'tplayall') { if (T.playing) stopReading(); else { if (T.listened && !T.hidden) { T.si = 0; T.listened = false; } readPlay(); } }
  else if (a === 'treplay') {
    // Wie bei einem Player: Noch einmal den aktuellen Satz, in der ersten Sekunde den davor
    const back = T.playing && Date.now() - (T.startedAt || 0) < 1200 && T.si > 0;
    stopReading(); if (back) T.si--; readPlay(); return;
  }
  else if (a === 'tslow') { T.slow = !T.slow; DB.settings.slowRead = T.slow; save(); if (T.playing) { stopReading(); readPlay(); return; } }
  else if (a === 'tshowall') { T.unveiled = true; }
  else if (a === 'treveal') {
    // Verschwommener Satz: erstes Antippen spielt ihn noch einmal, zweites deckt ihn auf
    const i = Number(b.dataset.i);
    if (T.tapped === i) { if (!T.revealed.includes(i)) T.revealed.push(i); T.tapped = null; }
    else { T.tapped = i; stopReading(); T.si = i; readPlay(); return; }
  }
  else if (a === 'tsay') { S.pop = null; renderPopup(); stopReading(); T.si = Number(b.dataset.i); readPlay(); return; }
  else if (a === 'tquiz') { T.quiz = true; render(); followSentence('.tq'); return; }
  else if (a === 'tqnext') { T.qi = Math.min(T.qi + 1, t ? t.q.length : 0); }
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
}
function viewTexts(){
  const lang = S.lang, done = (DB.used && DB.used.texts) || {}, niv = DB.settings.niveau || 'mittel', rank = { A2:1, B1:2, B2:3 };
  const list = niv === 'mittel' ? TEXTS[lang] : TEXTS[lang].slice().sort((a, b) => (niv === 'fort' ? rank[b.level] - rank[a.level] : rank[a.level] - rank[b.level]));
  const cards = list.map(t => { const d = done[lang + ':' + t.id];
    const state = d ? `<span class="tstate${d.best === t.q.length ? ' full' : ''}">${d.best} von ${t.q.length}${d.heard ? ', gehört' : ''}</span>` : '<span class="tstate new">Neu</span>';
    return `<button type="button" class="tcard" data-a="textopen" data-id="${t.id}"><span class="tchips"><span class="tag">${esc(t.topic)}</span><span class="tag">${t.level}</span>${state}</span><span class="ttitle" lang="${lang}">${esc(t.title)}</span><span class="tteaser" lang="${lang}">${esc(textSentences(t.body)[0][0])}</span></button>`; }).join('');
  return backBar('Lesen und Hören') + `
    <div class="seg2 tmode" role="radiogroup" aria-label="Wie möchtest du die Texte?">${[['read', 'Lesen und hören'], ['listen', 'Nur hören']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${textMode() === k}" data-a="tdefmode" data-v="${k}">${l}</button>`).join('')}</div>
    <p class="lead-s">${textMode() === 'listen' ? 'Der Text bleibt verschwommen und wird vorgelesen. Danach drei Fragen, dann kannst du nachlesen.' : 'Der Text ist sichtbar. Mit „Vorlesen“ unten liest die App ihn vor, Satz für Satz hervorgehoben. Danach drei Fragen.'}</p>
    <div class="tgrid2">${cards}</div>
    <h2 class="grp">Frischer Lesestoff</h2>
    <div class="rows">${row('wiki', 'Wikipedia-Fundstück', `Ein zufälliger Artikel aus der ${lang === 'sv' ? 'schwedischen' : 'spanischen'} Wikipedia, oft anspruchsvoll (online)`, '', 'book')}</div>`;
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
  const article = `<article class="reader${veil ? ' veiled' : ''}" lang="${lang}">${T.sents.map(p => `<p>${p.map(s => { const i = k++;
    const cls = `rs-s${T.playing && i === T.si ? ' on' : ''}${veiled(i) ? ' veil' : ''}${!veiled(i) && evidence.has(i) ? ' ev' : ''}`;
    return veiled(i) ? `<span class="${cls}" data-a="treveal" data-i="${i}" role="button" aria-label="Satz ${i + 1}: ${T.tapped === i ? 'aufdecken' : 'noch einmal hören'}">${esc(s)}</span>` : `<span class="${cls}" data-i="${i}">${linkWords(s, lang)}</span>`; }).join(' ')}</p>`).join('')}</article>`;
  const hero = `<header class="rhero">
      <div class="tchips">${W ? '<span class="tag">Wikipedia</span>' : `<span class="tag">${esc(t.topic)}</span><span class="tag">${t.level}</span>`}<span class="tag">${list.length} Sätze</span>${T.hidden ? '<span class="tag on">Nur hören</span>' : ''}</div>
      <h1 class="rtitle" lang="${lang}">${esc(W ? W.title : t.title)}</h1>
      <div class="rprog" aria-hidden="true"><i style="width:${Math.round(100 * Math.min(heard, list.length) / Math.max(1, list.length))}%"></i></div>
      ${veil ? '<p class="rhint">Antippen spielt einen Satz noch einmal, zweites Antippen zeigt ihn. Nach dem letzten Satz kommen die Fragen.</p>' : ''}
    </header>`;
  const bar = `<div class="actionbar reader-bar"><div class="in">
      <button type="button" class="pbtn" data-a="treplay" aria-label="Satz noch einmal">${PICO.replay}</button>
      ${T.hidden ? `<button type="button" class="pbtn play" data-a="tplayall" aria-label="${T.playing ? 'Pause' : 'Weiter hören'}">${T.playing ? PICO.pause : PICO.play}</button>`
        : `<button type="button" class="pbtn play wide" data-a="tplayall">${T.playing ? PICO.pause + '<span>Pause</span>' : PICO.play + '<span>Vorlesen</span>'}</button>`}
      <span class="pspace"></span><span class="sr-only" aria-live="polite">Satz ${Math.min(T.si + 1, list.length)} von ${list.length}</span>
      <button type="button" class="pchip" data-a="tslow" aria-pressed="${!!T.slow}">${PICO.slow}<span>Langsam</span></button>
      ${veil ? `<button type="button" class="pchip" data-a="tshowall">${PICO.eye}<span>Text zeigen</span></button>` : ''}
    </div></div>`;
  const looked = T.looked.length ? `<h2 class="grp">Nachgeschlagen</h2><div class="wtray">${T.looked.map(w => { const e = lookupWord(lang, w); return `<button type="button" class="wchip" data-a="lookup" data-w="${esc(w)}"><b lang="${lang}">${esc(w)}</b>${e ? `<span>${esc(e.de.split(/[;(]/)[0].trim())}</span>` : ''}</button>`; }).join('')}</div>` : '';
  if (W) {
    return backBar('Wikipedia-Fundstück', 'texts') + hero + article + `<p class="legend">Aus der Wikipedia, Artikel „<a href="${esc(W.url)}" target="_blank" rel="noopener">${esc(W.title)}</a>“, Text unter <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de" target="_blank" rel="noopener">CC BY-SA 4.0</a>.</p>${looked}
      <div class="btnrow"><button type="button" class="primary" data-a="wiki">Noch ein Fundstück</button></div>` + bar;
  }
  // Fragen erst nach dem Text: beim Lesen auf Knopfdruck, beim Hören von selbst nach dem letzten Satz
  const gate = !T.quiz ? `<div class="tgate">${T.hidden
      ? `<p class="hint" style="margin:0 0 10px">Die Fragen kommen, sobald der Text zu Ende ist.</p><button type="button" class="ghost" data-a="tquiz">Fragen jetzt</button>`
      : `<button type="button" class="primary" data-a="tquiz">Gelesen, zu den Fragen</button>`}</div>` : '';
  const score = Object.values(T.picks).filter(i => i === 0).length;
  const qi = Math.min(T.qi, t.q.length - 1), [q, opts, src] = t.q[qi], picked = T.picks[qi];
  const srcSent = picked != null ? flatSents(T)[srcIndex(T, src)] : '';
  const quiz = !T.quiz || finished ? '' : `<section class="tq${picked == null ? '' : ' answered'}" aria-live="polite">
      <div class="tq-head"><span>Frage ${qi + 1} von ${t.q.length}</span><span class="sdots">${t.q.map((_, i) => `<i class="${T.picks[i] == null ? (i === qi ? 'on' : '') : T.picks[i] === 0 ? 'ok' : 'bad'}"></i>`).join('')}</span></div>
      <p class="tq-q">${esc(q)}</p>
      <div class="tq-o">${optionOrder(t.id, qi, opts.length).map(i => `<button type="button" class="tq-b${picked != null ? (i === 0 ? ' right' : i === picked ? ' wrong' : ' dim') : ''}" data-a="tpick" data-k="${qi}" data-i="${i}"${picked != null ? ' disabled' : ''}>${esc(opts[i])}</button>`).join('')}</div>
      ${picked != null ? `<p class="tq-src"><span class="lbl-s">Im Text</span> <span lang="${lang}">${esc(srcSent)}</span></p><div class="btnrow tight"><button type="button" class="${picked === 0 ? 'primary' : 'ghost'}" data-a="tqnext">${qi + 1 < t.q.length ? 'Nächste Frage' : 'Ergebnis'}</button></div>` : ''}
    </section>`;
  const own = new Set((DB.own[lang] || []).map(o => o.id));
  const after = finished ? `<section class="tdone">
      <p class="tdone-h">${score === t.q.length ? 'Alles verstanden.' : `${score} von ${t.q.length} richtig.`}</p>
      <p class="hint" style="margin-top:2px">${T.hidden ? 'Jetzt kannst du den Text in Ruhe nachlesen. Die Stellen mit den Antworten sind markiert.' : 'Die Stellen mit den Antworten sind im Text markiert.'}</p>
      <div class="rows" style="margin-top:12px">${t.keep.map(([s, de], i) => { const has = own.has(lang + ':own:' + hash(s)); return `<div class="row static"><span class="txt"><span class="rt" lang="${lang}">${esc(s)}</span><span class="rd">${esc(de)}</span></span><button type="button" class="link" data-a="tkeep" data-k="${i}"${has ? ' disabled' : ''}>${has ? 'Übernommen' : 'Übernehmen'}</button></div>`; }).join('')}</div>
      <div class="btnrow"><button type="button" class="primary" data-a="tnexttext">Nächster Text</button></div>
    </section>` : '';
  return backBar('Lesen und Hören', 'texts') + hero + article + gate + (T.quiz ? `<h2 class="grp">Verstanden?</h2>` : '') + quiz + after + looked + bar;
}
// Wikipedia: zufällige Artikel über die offizielle API (seit Jahren stabil), der längste Einleitungstext gewinnt
async function fetchWiki(lang){
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&generator=random&grnnamespace=0&grnlimit=10&prop=extracts%7Cinfo&inprop=url&exintro=1&explaintext=1&exlimit=10`;
  for (let tries = 0; tries < 3; tries++) {
    const res = await fetch(url); if (!res.ok) throw new Error('http ' + res.status);
    const j = await res.json();
    const pages = ((j.query && j.query.pages) || []).filter(p => p.extract && p.extract.length >= 350 && !/\(.*\d{3,}.*–/.test(p.title))
      .sort((a, b) => b.extract.length - a.extract.length);
    if (pages.length) {
      const p = pages[0];
      const text = p.extract.replace(/\s*\([^()]*\)/g, '').replace(/ {2,}/g, ' ').split('\n').filter(x => x.trim().length > 40).slice(0, 4).join('\n\n');
      return { title:p.title, url:p.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(p.title)}`, body:text };
    }
  }
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
