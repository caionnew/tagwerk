/* ---------- Lesen und Hören: eigene Texte mit Fragen, dazu ein Wikipedia-Fundstück (online) ---------- */
// Ein Text, zwei Wege: Lesen (Wörter antippbar) oder Hören (Text verdeckt, Satz für Satz vorgelesen, danach Fragen).
let readToken = 0, readTimer = null;
const textById = (lang, id) => TEXTS[lang].find(t => t.id === id);
// Antworten mischen, aber für denselben Text immer gleich (sonst springt die Reihenfolge beim Neuzeichnen)
function optionOrder(id, k, n){ const o = [...Array(n).keys()]; let h = parseInt(hash(id + ':' + k), 36); for (let i = n - 1; i > 0; i--) { const j = h % (i + 1); h = Math.floor(h / 7) + 13; [o[i], o[j]] = [o[j], o[i]]; } return o; }
function openText(lang, id, mode){
  const t = textById(lang, id); if (!t) return;
  stopReading();
  S.text = { lang, id, mode:mode || 'read', sents:textSentences(t.body), si:0, playing:false, slow:false, picks:{}, shown:mode !== 'listen', t0:Date.now() };
  goView('text');
  if (S.text.mode === 'listen') readPlay();
}
function stopReading(){ readToken++; clearTimeout(readTimer); if (S.text) S.text.playing = false; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }
function flatSents(T){ return T.sents.flat(); }
function readPlay(){
  const T = S.text; if (!T) return;
  const list = flatSents(T);
  if (T.si >= list.length) { T.playing = false; T.si = 0; if (S.view === 'text') render(); return; }
  T.playing = true;
  const tok = ++readToken, tts = LANG[T.lang].tts;
  if (S.view === 'text') render();
  sayThen(list[T.si], tts, T.slow ? 0.7 : 0.92, () => {
    if (tok !== readToken || S.text !== T || !T.playing) return;
    clearTimeout(readTimer);
    readTimer = setTimeout(() => { if (tok === readToken && S.text === T && T.playing) { T.si++; readPlay(); } }, 650);
  });
}
function readCmd(a, b){
  const T = S.text; if (!T) return;
  const n = flatSents(T).length;
  if (a === 'tplayall') { if (T.playing) stopReading(); else readPlay(); }
  else if (a === 'tnext' || a === 'tprev') { stopReading(); T.si = Math.max(0, Math.min(n - 1, T.si + (a === 'tnext' ? 1 : -1))); readPlay(); return; }
  else if (a === 'tagain') { stopReading(); readPlay(); return; }
  else if (a === 'tslow') T.slow = !T.slow;
  else if (a === 'tmode') { const t = T.id ? textById(T.lang, T.id) : null; stopReading(); T.mode = b.dataset.v; T.shown = T.mode === 'read' || (!!t && Object.keys(T.picks).length >= t.q.length); T.si = 0; if (T.mode === 'listen') { readPlay(); return; } }
  else if (a === 'tshow') T.shown = true;
  else if (a === 'tpick') {
    const k = Number(b.dataset.k); if (T.picks[k] != null) return;
    T.picks[k] = Number(b.dataset.i);
    const t = textById(T.lang, T.id);
    if (t && Object.keys(T.picks).length === t.q.length) {
      const score = Object.values(T.picks).filter(i => i === 0).length;
      DB.used.texts = DB.used.texts || {};
      const prev = DB.used.texts[T.lang + ':' + T.id] || {};
      DB.used.texts[T.lang + ':' + T.id] = { best:Math.max(prev.best || 0, score), n:(prev.n || 0) + 1, last:today(), heard:prev.heard || T.mode === 'listen' };
      logDay(T.lang, { secs:Math.min(900, Math.round((Date.now() - (T.t0 || Date.now())) / 1000)) });
      save();
    }
  } else if (a === 'tkeep') {
    const t = textById(T.lang, T.id), kp = t && t.keep[Number(b.dataset.k)]; if (!kp) return;
    const id = T.lang + ':own:' + hash(kp[0]);
    if (!DB.own[T.lang].some(o => o.id === id)) DB.own[T.lang].push({ id, de:kp[1], target:kp[0], created:today(), src:'text' });
    save(); buildBank();
  }
  render();
}
function viewTexts(){
  const lang = S.lang, list = TEXTS[lang], done = (DB.used && DB.used.texts) || {};
  const rows = list.map(t => { const d = done[lang + ':' + t.id];
    return `<button type="button" class="row" data-a="textopen" data-id="${t.id}"><span class="txt"><span class="rt" lang="${lang}">${esc(t.title)}</span><span class="rd">${esc(t.topic)}, ${t.level}${d ? `, ${d.best} von ${t.q.length} richtig${d.heard ? ', gehört' : ''}` : ''}</span></span></button>`; }).join('');
  return backBar('Lesen und Hören') + `
    <p class="lead-s">Kurze Texte zu allem Möglichen. Jeden Text kannst du lesen oder nur hören, danach kommen drei Fragen.</p>
    <div class="rows">${rows}</div>
    <h2 class="grp">Frischer Lesestoff</h2>
    <div class="rows">${row('wiki', 'Wikipedia-Fundstück', `Ein zufälliger Artikel aus der ${lang === 'sv' ? 'schwedischen' : 'spanischen'} Wikipedia, oft anspruchsvoll (online)`, '', 'book')}</div>`;
}
function viewText(){
  const T = S.text;
  if (!T) return backBar('Lesen und Hören', 'texts') + '<p class="lead">Kein Text geöffnet.</p>';
  const W = T.wiki, t = W ? null : textById(T.lang, T.id), lang = T.lang;
  const title = W ? W.title : t.title, list = flatSents(T);
  const seg = `<div class="ptabs tmodes" role="tablist">${[['read', 'Lesen'], ['listen', 'Hören']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${T.mode === k}" data-a="tmode" data-v="${k}">${l}</button>`).join('')}</div>`;
  let k = 0;
  const textHtml = `<article class="reader" lang="${lang}">${T.sents.map(p => `<p>${p.map(s => { const i = k++; return `<span class="rs-s${T.playing && i === T.si ? ' on' : ''}">${linkWords(s, lang)}</span>`; }).join(' ')}</p>`).join('')}</article>`;
  const player = `<div class="radio-ctl tplayer">
      <button type="button" class="ghost rbtn" data-a="tprev" aria-label="Vorheriger Satz">‹</button>
      <button type="button" class="primary rbtn rmain" data-a="tplayall">${T.playing ? 'Pause' : T.si ? 'Weiter hören' : 'Vorlesen'}</button>
      <button type="button" class="ghost rbtn" data-a="tnext" aria-label="Nächster Satz">›</button>
    </div>
    <div class="btnrow tight"><button type="button" class="ghost" data-a="tagain">Satz wiederholen</button><button type="button" class="ghost${T.slow ? ' on' : ''}" data-a="tslow" aria-pressed="${T.slow}">Langsam</button></div>`;
  const listenCard = `<section class="radio-card"><p class="hint" style="margin-top:0">Satz ${Math.min(T.si + 1, list.length)} von ${list.length}</p>
      <div class="sdots" aria-hidden="true">${list.map((_, i) => `<i class="${i < T.si ? 'done' : i === T.si ? 'on' : ''}"></i>`).join('')}</div>
      <p class="radio-hidden">${T.shown ? '' : 'Erst hören, dann die Fragen. Der Text kommt danach.'}</p></section>`;
  const body = T.mode === 'listen' ? listenCard + player + (T.shown ? textHtml : `<div class="btnrow tight"><button type="button" class="link" data-a="tshow">Text jetzt zeigen</button></div>`) : player + textHtml;
  if (W) {
    return backBar(title, 'texts') + seg + body + `<p class="legend">Aus der Wikipedia, Artikel „<a href="${esc(W.url)}" target="_blank" rel="noopener">${esc(W.title)}</a>“. Text unter <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de" target="_blank" rel="noopener">CC BY-SA 4.0</a>.</p>
      <div class="btnrow"><button type="button" class="primary" data-a="wiki">Noch ein Fundstück</button></div>`;
  }
  const answered = Object.keys(T.picks).length, score = Object.values(T.picks).filter(i => i === 0).length;
  const qs = t.q.map(([q, opts], qi) => {
    const picked = T.picks[qi];
    return `<div class="tq"><p class="tq-q">${esc(q)}</p><div class="tq-o">${optionOrder(t.id, qi, opts.length).map(i => `<button type="button" class="ghost tq-b${picked != null ? (i === 0 ? ' right' : i === picked ? ' wrong' : '') : ''}" data-a="tpick" data-k="${qi}" data-i="${i}"${picked != null ? ' disabled' : ''}>${esc(opts[i])}</button>`).join('')}</div></div>`;
  }).join('');
  const own = new Set((DB.own[lang] || []).map(o => o.id));
  const done = answered === t.q.length;
  const after = done ? `<p class="lead tq-score">${score === t.q.length ? 'Alles verstanden.' : `${score} von ${t.q.length} richtig.`}</p>
    ${T.mode === 'listen' && !T.shown ? '<div class="btnrow tight"><button type="button" class="primary" data-a="tshow">Text zeigen</button></div>' : ''}
    <h2 class="grp">Sätze für die Wiederholung</h2>
    <div class="rows">${t.keep.map(([s, de], i) => { const has = own.has(lang + ':own:' + hash(s)); return `<div class="row static"><span class="txt"><span class="rt" lang="${lang}">${esc(s)}</span><span class="rd">${esc(de)}</span></span><button type="button" class="link" data-a="tkeep" data-k="${i}"${has ? ' disabled' : ''}>${has ? 'Übernommen' : 'Übernehmen'}</button></div>`; }).join('')}</div>` : '';
  return backBar(title, 'texts') + seg + `<p class="hint" style="margin-top:0">${esc(t.topic)}, ${t.level}</p>` + body + `<h2 class="grp">Verstanden?</h2>${qs}${after}`;
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
  S.text = { lang, wiki:null, loading:true, mode:'read', sents:[], si:0, playing:false, slow:false, picks:{}, shown:true };
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
