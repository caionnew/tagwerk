/* ---------- Lesen und Hören: eigene Texte mit Fragen, dazu ein Wikipedia-Fundstück (online) ---------- */
// Ein Text, zwei Wege: Lesen (Wörter antippbar) oder Hören (Text verdeckt, Satz für Satz vorgelesen, danach Fragen).
let readToken = 0, readTimer = null;
const textById = (lang, id) => TEXTS[lang].find(t => t.id === id);
// Antworten mischen, aber für denselben Text immer gleich (sonst springt die Reihenfolge beim Neuzeichnen)
function optionOrder(id, k, n){ const o = [...Array(n).keys()]; let h = parseInt(hash(id + ':' + k), 36); for (let i = n - 1; i > 0; i--) { const j = h % (i + 1); h = Math.floor(h / 7) + 13; [o[i], o[j]] = [o[j], o[i]]; } return o; }
function openText(lang, id, mode){
  const t = textById(lang, id); if (!t) return;
  stopReading();
  S.text = { lang, id, hidden:mode === 'listen', sents:textSentences(t.body), si:0, playing:false, slow:false, picks:{}, qi:0, revealed:[], looked:[], t0:Date.now() };
  goView('text');
  if (S.text.hidden) readPlay();
}
function stopReading(){ readToken++; clearTimeout(readTimer); if (S.text) S.text.playing = false; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }
function flatSents(T){ return T.sents.flat(); }
// Aktuellen Satz sichtbar halten, ohne zu springen, wenn er schon im Bild ist
function followSentence(){
  const el = document.querySelector('.rs-s.on'); if (!el) return;
  const r = el.getBoundingClientRect(), bar = document.querySelector('.reader-bar'), bottom = (bar ? bar.getBoundingClientRect().top : innerHeight) - 16;
  if (r.top < 70 || r.bottom > bottom) { const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; el.scrollIntoView({ block:'center', behavior:calm ? 'auto' : 'smooth' }); }
}
function readPlay(){
  const T = S.text; if (!T) return;
  const list = flatSents(T);
  if (T.si >= list.length) { T.playing = false; T.si = 0; T.listened = true; if (S.view === 'text') render(); return; }
  T.playing = true;
  const tok = ++readToken, tts = LANG[T.lang].tts;
  if (S.view === 'text') { render(); followSentence(); }
  sayThen(list[T.si], tts, T.slow ? 0.72 : 0.92, () => {
    if (tok !== readToken || S.text !== T || !T.playing) return;
    clearTimeout(readTimer);
    readTimer = setTimeout(() => { if (tok === readToken && S.text === T && T.playing) { T.si++; readPlay(); } }, 650);
  });
}
function textDone(T, t){ return !!t && Object.keys(T.picks).length >= t.q.length; }
function readCmd(a, b){
  const T = S.text; if (!T) return;
  const t = T.id ? textById(T.lang, T.id) : null, n = flatSents(T).length;
  if (a === 'tplayall') { if (T.playing) stopReading(); else readPlay(); }
  else if (a === 'tnext' || a === 'tprev') { stopReading(); T.si = Math.max(0, Math.min(n - 1, T.si + (a === 'tnext' ? 1 : -1))); readPlay(); return; }
  else if (a === 'tslow') { T.slow = !T.slow; if (T.playing) { stopReading(); readPlay(); return; } }
  else if (a === 'thide') { T.hidden = !T.hidden; T.revealed = []; if (T.hidden && !T.playing) { T.si = 0; readPlay(); return; } }
  else if (a === 'treveal') { const i = Number(b.dataset.i); if (!T.revealed.includes(i)) T.revealed.push(i); }
  else if (a === 'tsay') { stopReading(); T.si = Number(b.dataset.i); readPlay(); return; }
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
    } else if (T.picks[k] === 0) {
      // Richtig: nach einem kurzen Blick auf die Bestätigung von selbst zur nächsten Frage
      setTimeout(() => { if (S.text === T && T.qi === k) { T.qi++; render(); } }, 700);
    }
  } else if (a === 'tkeep') {
    const kp = t && t.keep[Number(b.dataset.k)]; if (!kp) return;
    const id = T.lang + ':own:' + hash(kp[0]);
    if (!DB.own[T.lang].some(o => o.id === id)) DB.own[T.lang].push({ id, de:kp[1], target:kp[0], created:today(), src:'text' });
    save(); buildBank();
  } else if (a === 'tnexttext') {
    const list = TEXTS[T.lang], i = list.findIndex(x => x.id === T.id), done = (DB.used && DB.used.texts) || {};
    const nxt = list.slice(i + 1).concat(list.slice(0, i)).find(x => !done[T.lang + ':' + x.id]) || list[(i + 1) % list.length];
    openText(T.lang, nxt.id, T.hidden ? 'listen' : 'read'); return;
  }
  render();
}
function viewTexts(){
  const lang = S.lang, list = TEXTS[lang], done = (DB.used && DB.used.texts) || {};
  const cards = list.map(t => { const d = done[lang + ':' + t.id];
    const state = d ? `<span class="tstate${d.best === t.q.length ? ' full' : ''}">${d.best} von ${t.q.length}${d.heard ? ', gehört' : ''}</span>` : '<span class="tstate new">Neu</span>';
    return `<button type="button" class="tcard" data-a="textopen" data-id="${t.id}"><span class="tchips"><span class="tag">${esc(t.topic)}</span><span class="tag">${t.level}</span>${state}</span><span class="ttitle" lang="${lang}">${esc(t.title)}</span><span class="tteaser" lang="${lang}">${esc(textSentences(t.body)[0][0])}</span></button>`; }).join('');
  return backBar('Lesen und Hören') + `
    <p class="lead-s">Kurze Texte zu allem Möglichen. Lesen, mitlesen oder nur hören, danach drei Fragen.</p>
    <div class="tgrid2">${cards}</div>
    <h2 class="grp">Frischer Lesestoff</h2>
    <div class="rows">${row('wiki', 'Wikipedia-Fundstück', `Ein zufälliger Artikel aus der ${lang === 'sv' ? 'schwedischen' : 'spanischen'} Wikipedia, oft anspruchsvoll (online)`, '', 'book')}</div>`;
}
const PICO = {
  play:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  pause:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>',
  prev:'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  eye:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 20 20 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
};
function viewText(){
  const T = S.text;
  if (!T) return backBar('Lesen und Hören', 'texts') + '<p class="lead">Kein Text geöffnet.</p>';
  const W = T.wiki, t = W ? null : textById(T.lang, T.id), lang = T.lang;
  const list = flatSents(T), done = textDone(T, t);
  const veiled = i => T.hidden && !done && !T.revealed.includes(i);
  const heard = T.listened ? list.length : T.si + (T.playing ? 0 : 0);
  let k = 0;
  const article = `<article class="reader${T.hidden && !done ? ' veiled' : ''}" lang="${lang}">${T.sents.map(p => `<p>${p.map(s => { const i = k++;
    const cls = `rs-s${T.playing && i === T.si ? ' on' : ''}${veiled(i) ? ' veil' : ''}`;
    return veiled(i) ? `<span class="${cls}" data-a="treveal" data-i="${i}" role="button" aria-label="Satz ${i + 1} aufdecken">${esc(s)}</span>` : `<span class="${cls}">${linkWords(s, lang)}</span>`; }).join(' ')}</p>`).join('')}</article>`;
  const hero = `<header class="rhero">
      <div class="tchips">${W ? '<span class="tag">Wikipedia</span>' : `<span class="tag">${esc(t.topic)}</span><span class="tag">${t.level}</span>`}<span class="tag">${list.length} Sätze</span></div>
      <h1 class="rtitle" lang="${lang}">${esc(W ? W.title : t.title)}</h1>
      <div class="rprog" aria-hidden="true"><i style="width:${Math.round(100 * Math.min(heard, list.length) / Math.max(1, list.length))}%"></i></div>
      ${T.hidden && !done ? '<p class="rhint">Erst hören. Der Text bleibt verschwommen, bis du die Fragen beantwortet hast. Antippen deckt einen Satz auf.</p>' : ''}
    </header>`;
  const bar = `<div class="actionbar reader-bar"><div class="in">
      <button type="button" class="pbtn" data-a="tprev" aria-label="Satz zurück">${PICO.prev}</button>
      <button type="button" class="pbtn play" data-a="tplayall" aria-label="${T.playing ? 'Pause' : 'Vorlesen'}">${T.playing ? PICO.pause : PICO.play}</button>
      <button type="button" class="pbtn" data-a="tnext" aria-label="Nächster Satz">${PICO.next}</button>
      <span class="pspace"></span><span class="sr-only" aria-live="polite">Satz ${Math.min(T.si + 1, list.length)} von ${list.length}</span>
      <button type="button" class="pchip" data-a="tslow" aria-pressed="${T.slow}">${T.slow ? '0,7×' : '1×'}</button>
      ${t ? `<button type="button" class="pchip" data-a="thide" aria-pressed="${!!T.hidden}" aria-label="Text verdecken, nur hören">${PICO.eye}<span>Nur hören</span></button>` : ''}
    </div></div>`;
  const looked = T.looked.length ? `<h2 class="grp">Nachgeschlagen</h2><div class="wtray">${T.looked.map(w => { const e = lookupWord(lang, w); return `<button type="button" class="wchip" data-a="lookup" data-w="${esc(w)}"><b lang="${lang}">${esc(w)}</b>${e ? `<span>${esc(e.de.split(/[;(]/)[0].trim())}</span>` : ''}</button>`; }).join('')}</div>` : '';
  if (W) {
    return backBar('Wikipedia-Fundstück', 'texts') + hero + article + `<p class="legend">Aus der Wikipedia, Artikel „<a href="${esc(W.url)}" target="_blank" rel="noopener">${esc(W.title)}</a>“, Text unter <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de" target="_blank" rel="noopener">CC BY-SA 4.0</a>.</p>${looked}
      <div class="btnrow"><button type="button" class="primary" data-a="wiki">Noch ein Fundstück</button></div>` + bar;
  }
  const score = Object.values(T.picks).filter(i => i === 0).length;
  const qi = Math.min(T.qi, t.q.length - 1), [q, opts] = t.q[qi], picked = T.picks[qi];
  const quiz = done ? '' : `<section class="tq${picked == null ? '' : ' answered'}" aria-live="polite">
      <div class="tq-head"><span>Frage ${qi + 1} von ${t.q.length}</span><span class="sdots">${t.q.map((_, i) => `<i class="${T.picks[i] == null ? (i === qi ? 'on' : '') : T.picks[i] === 0 ? 'ok' : 'bad'}"></i>`).join('')}</span></div>
      <p class="tq-q">${esc(q)}</p>
      <div class="tq-o">${optionOrder(t.id, qi, opts.length).map(i => `<button type="button" class="tq-b${picked != null ? (i === 0 ? ' right' : i === picked ? ' wrong' : ' dim') : ''}" data-a="tpick" data-k="${qi}" data-i="${i}"${picked != null ? ' disabled' : ''}>${esc(opts[i])}</button>`).join('')}</div>
      ${picked != null && picked !== 0 ? '<div class="btnrow tight"><button type="button" class="ghost" data-a="tqnext">Nächste Frage</button></div>' : ''}
    </section>`;
  const own = new Set((DB.own[lang] || []).map(o => o.id));
  const after = done ? `<section class="tdone">
      <p class="tdone-h">${score === t.q.length ? 'Alles verstanden.' : `${score} von ${t.q.length} richtig.`}</p>
      <p class="hint" style="margin-top:2px">${T.hidden ? 'Jetzt kannst du den Text in Ruhe nachlesen.' : 'Zum Festigen zwei Sätze in die Wiederholung nehmen.'}</p>
      <div class="rows" style="margin-top:12px">${t.keep.map(([s, de], i) => { const has = own.has(lang + ':own:' + hash(s)); return `<div class="row static"><span class="txt"><span class="rt" lang="${lang}">${esc(s)}</span><span class="rd">${esc(de)}</span></span><button type="button" class="link" data-a="tkeep" data-k="${i}"${has ? ' disabled' : ''}>${has ? 'Übernommen' : 'Übernehmen'}</button></div>`; }).join('')}</div>
      <div class="btnrow"><button type="button" class="primary" data-a="tnexttext">Nächster Text</button></div>
    </section>` : '';
  return backBar('Lesen und Hören', 'texts') + hero + article + `<h2 class="grp">Verstanden?</h2>` + quiz + after + looked + bar;
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
  S.text = { lang, wiki:null, loading:true, hidden:false, sents:[], si:0, playing:false, slow:false, picks:{}, qi:0, revealed:[], looked:[] };
  S.wikiErr = null; goView('text');
  fetchWiki(lang).then(w => {
    if (!S.text || S.text.lang !== lang) return;
    Object.assign(S.text, { wiki:w, loading:false, sents:textSentences(w.body), t0:Date.now() });
    render();
  }).catch(() => { if (S.text) { S.text.loading = false; S.wikiErr = 'Gerade kein Fundstück erreichbar. Dafür braucht es Internet.'; } render(); });
}
function viewWikiLoading(){
  return backBar('Wikipedia-Fundstück', 'texts') + (S.wikiErr ? `<p class="lead">${esc(S.wikiErr)}</p><div class="btnrow"><button type="button" class="primary" data-a="wiki">Nochmal versuchen</button></div>` : '<p class="lead dots">Suche einen Artikel</p>');
}
