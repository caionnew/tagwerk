/* ---------- Nachsprechen (Shadowing): hören, mitsprechen, allein aufnehmen, vergleichen ----------
   Alles läuft auf dem Gerät: Pegel und Pausen kommen aus dem Mikrofonsignal, das Tempo aus dem Vergleich mit der
   Länge des Originals. Aufnahmen bleiben nur im Arbeitsspeicher und verschwinden beim Verlassen. Die Spracherkennung
   (nur Chrome, online) ist eine Zugabe und keine Voraussetzung. */

// ----- Auswertung einer Aufnahme (rein rechnerisch, ohne Browser testbar) -----
const SH_BIN = 0.02; // Sekunden je Messpunkt
// Lautstärke-Hüllkurve aus Rohdaten (Float32 von -1 bis 1)
function shBinsFromPCM(data, sr){
  const n = Math.max(1, Math.round(sr * SH_BIN)), out = [];
  for (let i = 0; i + n <= data.length; i += n) {
    let s = 0, p = 0;
    for (let j = i; j < i + n; j++) { const v = data[j]; s += v * v; if (v > p) p = v; else if (-v > p) p = -v; }
    out.push({ r:Math.sqrt(s / n), p });
  }
  return out;
}
// Live-Messwerte (Zeit in s, rms, Spitze) auf das feste Raster bringen; Lücken übernehmen den Wert davor
function shBinsFromFrames(frames){
  const out = [];
  frames.forEach(f => { const k = Math.floor(f.t / SH_BIN); const b = out[k] || (out[k] = { r:0, p:0 }); if (f.r > b.r) b.r = f.r; if (f.p > b.p) b.p = f.p; });
  for (let k = 0; k < out.length; k++) if (!out[k]) out[k] = k ? { r:out[k - 1].r, p:0 } : { r:0, p:0 };
  return out;
}
const shSmooth = bins => bins.map((b, k) => { const a = bins[k - 1] || b, c = bins[k + 1] || b; return (a.r + b.r + c.r) / 3; });
function shPct(arr, q){ if (!arr.length) return 0; const s = arr.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; }
// Ergebnis: Sprechbeginn und -ende, Pausen im Satz, zu leise, übersteuert, Tempo im Vergleich zum Original
function shAnalyze(bins, origSpeech, commas){
  const sm = shSmooth(bins), top = sm.length ? Math.max(...sm) : 0, floor = shPct(sm, 0.1);
  const thr = Math.max(0.004, floor * 2.5, top * 0.1);
  const v = sm.map(x => x > thr);
  // Kurze Lücken (Verschlusslaute, leise Konsonanten) schließen, kurze Knackser verwerfen
  const runs = []; let k = 0;
  while (k < v.length) { const on = v[k]; let j = k; while (j < v.length && v[j] === on) j++; runs.push({ on, a:k, b:j }); k = j; }
  runs.forEach((r, i) => { if (!r.on && i > 0 && i < runs.length - 1 && (r.b - r.a) * SH_BIN < 0.16) r.on = true; });
  const merged = [];
  runs.forEach(r => { const last = merged[merged.length - 1]; if (last && last.on === r.on) last.b = r.b; else merged.push({ on:r.on, a:r.a, b:r.b }); });
  const speech = merged.filter(r => r.on && (r.b - r.a) * SH_BIN >= 0.08);
  const voiced = speech.reduce((s, r) => s + (r.b - r.a) * SH_BIN, 0);
  if (!speech.length || voiced < 0.25 || top < 0.005) return { nothing:true, top };
  const onset = speech[0].a * SH_BIN, offset = speech[speech.length - 1].b * SH_BIN;
  const pauses = [];
  for (let i = 1; i < speech.length; i++) { const a = speech[i - 1].b * SH_BIN, b = speech[i].a * SH_BIN; if (b - a >= 0.35) pauses.push([a, b]); }
  const loud = bins.filter((b, i) => v[i]);
  const clip = loud.length > 0 && loud.filter(b => b.p >= 0.99).length / loud.length > 0.05;
  const dur = offset - onset, tp = shTempo(dur, origSpeech);
  return { nothing:false, onset, offset, speech:dur, pauses, extra:Math.max(0, pauses.length - (commas || 0)), quiet:top < 0.012, clip, ratio:tp ? tp.ratio : null, tempo:tp ? tp.tempo : null, top };
}
const shCommas = text => (String(text).match(/[,;:–—]/g) || []).length;
// Pausen an Satzzeichen sind gewollt: Jedes Satzzeichen bekommt die Pause, die zeitlich am nächsten liegt (Lage im Satz nach Zeichen
// geschätzt, höchstens ein Viertel daneben). Übrige Pausen sind Stockungen. Ergebnis: [Beginn, Ende, gewollt]
function shMarkPauses(an, text){
  if (!an || an.nothing) return an;
  const t = String(text).replace(/[.!?…]+\s*$/, ''), fr = [];
  t.replace(/[,;:–—]/g, (m, i) => { fr.push(i / Math.max(1, t.length)); return m; });
  const ps = an.pauses.map(([a, b]) => [a, b, false]);
  fr.forEach(f => {
    let best = -1, bd = 0.25;
    ps.forEach((p, i) => { const d = Math.abs(((p[0] + p[1]) / 2 - an.onset) / Math.max(0.1, an.speech) - f); if (!p[2] && d < bd) { bd = d; best = i; } });
    if (best >= 0) ps[best][2] = true;
  });
  an.pauses = ps; an.extra = ps.filter(p => !p[2]).length;
  return an;
}
const fmtSec = s => s.toLocaleString('de-DE', { minimumFractionDigits:1, maximumFractionDigits:1 }) + ' s';

// ----- Aussprachehilfen: nur Regeln, die sicher gelten -----
// Schwedisch: r verschmilzt mit d, t, n, s, l (Mittelschweden, auch über die Wortgrenze), stumme Buchstaben, Alltagsformen
const SV_SILENT_END = { jag:1, det:1, vad:1 };
const SV_SAY = { säg:'säj', säga:'säja', säger:'säjer', mig:'mej', dig:'dej', sig:'sej', de:'dom', dem:'dom', och:'å', sade:'sa', någon:'nån', något:'nåt', några:'nåra', sedan:'sen', sådan:'sån', sådant:'sånt', sådana:'såna' };
function svMarks(word){
  const w = word.toLowerCase(), m = { retro:[], silent:[], say:SV_SAY[w] || '', sj:[], tj:[] };
  // sj-Laut: sj, skj, stj am Wortanfang, -tion/-sion/-ssion am Ende; tj-Laut: tj, kj am Wortanfang
  const sj = w.match(/^(sj|skj|stj)/), tion = w.match(/(ss|s|t)i(?=on(en|er|erna)?$)/), tj = w.match(/^(tj|kj)/);
  if (sj) m.sj.push([0, sj[1].length]);
  if (tion && tion.index > 0) m.sj.push([tion.index, tion.index + tion[1].length + 1]);
  if (tj) m.tj.push([0, 2]);
  if (SV_SILENT_END[w]) m.silent.push(w.length - 1);
  if (/^(dj|gj|hj|lj)/.test(w)) m.silent.push(0);
  if (w.length > 4 && w.endsWith('igt')) m.silent.push(w.length - 2);
  for (let i = 0; i < w.length - 1; i++) {
    // Nur r und der direkt folgende Laut: rt, rd, rn, rs, rl werden zu einem Laut
    if (w[i] === 'r' && 'dtnsl'.includes(w[i + 1])) { m.retro.push([i, i + 2]); i++; }
  }
  return m;
}
// Spanisch: betonter Vokal (Regeln der Rechtschreibung), Bindung zwischen Wörtern (Sinalefa und Bindung über den Konsonanten)
const ES_ATONE = new Set(['para', 'desde', 'hacia', 'hasta', 'entre', 'sobre', 'contra', 'durante', 'mediante', 'pero', 'porque', 'aunque', 'como', 'cuando', 'donde', 'cuanto', 'cuanta', 'cuantos', 'cuantas', 'mientras', 'sino']);
function esNuclei(w){
  const V = 'aeiouáéíóúü', STRONG = 'aeoáéóíú', out = [];
  let cur = null;
  for (let i = 0; i < w.length; i++) {
    const c = w[i];
    let vowel = V.includes(c);
    if (c === 'u' && i > 0 && (w[i - 1] === 'q' || (w[i - 1] === 'g' && 'eiéí'.includes(w[i + 1] || '')))) vowel = false; // que, gui: u stumm
    if (c === 'y' && i === w.length - 1 && i > 0 && V.includes(w[i - 1])) vowel = true; // hoy, muy: Gleitlaut
    if (!vowel) { cur = null; continue; }
    if (cur && !(STRONG.includes(c) && STRONG.includes(w[cur[1] - 1]))) { cur[1] = i + 1; continue; }
    cur = [i, i + 1]; out.push(cur);
  }
  return out;
}
function esStress(word){
  const w = word.toLowerCase();
  if (w.length < 3 || ES_ATONE.has(w) || /[^a-záéíóúüñ]/.test(w) || (word.length <= 5 && word === word.toUpperCase())) return null;
  const nu = esNuclei(w);
  if (nu.length < 2) return null;
  const t = w.search(/[áéíóú]/);
  if (t >= 0) return t;
  const last = w[w.length - 1], n = nu[/[aeiouns]/.test(last) ? nu.length - 2 : nu.length - 1];
  const s = w.slice(n[0], n[1]);
  const strong = s.search(/[aeo]/);
  if (strong >= 0) return n[0] + strong;
  const weak = s.replace(/y$/, '');
  return n[0] + weak.length - 1;
}
// Beginnt das Wort mit einem Vokal (stummes h zählt nicht, hie-/hue- beginnen mit Gleitlaut)?
const esVowelStart = w => { const x = w.toLowerCase(); return x === 'y' || (/^h?[aeiouáéíóú]/.test(x) && !/^h?[iu][aeiouáéíóú]/.test(x)); };
// Satz in Wörter mit Satzzeichen zerlegen: [{ pre, core, post }]
function shChunks(text){
  return String(text).split(/\s+/).filter(Boolean).map(t => { const m = t.match(/^([¿¡"„“«(]*)(.*?)([.!?,;:"„“”»)…]*)$/); return { pre:m[1], core:m[2], post:m[3] }; });
}
// Hinweise je Wort und Bindungen zwischen Wörtern
function shHints(text, lang){
  const ch = shChunks(text);
  const words = ch.map(c => {
    if (!c.core || /\d/.test(c.core)) return {};
    if (lang === 'sv') return svMarks(c.core);
    const st = esStress(c.core);
    return st == null ? {} : { stress:st };
  });
  const links = ch.map((c, i) => {
    const nx = ch[i + 1];
    if (!nx || c.post || nx.pre || !c.core || !nx.core) return '';
    if (lang === 'es') return esVowelStart(nx.core) ? 'es' : '';
    return /r$/i.test(c.core) && /^[dtnsl]/i.test(nx.core) ? 'retro' : '';
  });
  return { chunks:ch, words, links };
}
// Wort mit Markierungen: stumme Buchstaben grau, r-Verschmelzung unterstrichen, betonter Vokal hervorgehoben
function shWordHtml(core, mk, endRetro, startRetro){
  const cls = Array.from(core, () => '');
  (mk.silent || []).forEach(i => { cls[i] = 'ph-si'; });
  (mk.retro || []).forEach(([a, b]) => { for (let i = a; i < b; i++) cls[i] = 'ph-rx'; });
  (mk.sj || []).forEach(([a, b]) => { for (let i = a; i < b; i++) cls[i] = 'ph-sj'; });
  (mk.tj || []).forEach(([a, b]) => { for (let i = a; i < b; i++) cls[i] = 'ph-tj'; });
  if (mk.stress != null) cls[mk.stress] = 'ph-st';
  if (endRetro) cls[core.length - 1] = 'ph-rx';
  if (startRetro) cls[0] = 'ph-rx';
  let h = '', run = '', rc = null;
  const flush = () => { if (run) h += rc ? `<span class="${rc}">${esc(run)}</span>` : esc(run); run = ''; };
  Array.from(core).forEach((c, i) => { if (cls[i] !== rc) { flush(); rc = cls[i]; } run += c; });
  flush();
  // Gesprochene Form schwebt über dem Wort (ohne Einfluss auf Zeilenhöhe, wird beim Kopieren nicht mitkopiert)
  return mk.say ? `<span class="ph-say" data-say="${esc(mk.say)}">${h}</span>` : h;
}
// Satz als antippbare Wörter (Nachschlagen); mit Hinweisen auf Wunsch. data-k: Wortnummer für die Erkennung
function shSentenceHtml(text, lang, hints, hits){
  const H = shHints(text, lang);
  return H.chunks.map((c, i) => {
    const hit = hits && hits[i] != null ? (hits[i] ? ' p-ok' : ' p-miss') : '';
    const inner = hints ? shWordHtml(c.core, H.words[i] || {}, H.links[i] === 'retro', i > 0 && H.links[i - 1] === 'retro') : esc(c.core);
    const word = c.core ? `<span class="w${hit}" data-a="lookup" data-w="${esc(c.core)}" data-k="${i}">${inner}</span>` : '';
    // Bogen fest ans vordere Wort (Wortverbinder), damit er nie am Zeilenanfang steht; das versteckte Leerzeichen hält Kopieren und Vorlesehilfen richtig
    const gap = i === H.chunks.length - 1 ? '' : hints && H.links[i] ? `\u2060<span class="ph-l ${H.links[i] === 'es' ? 'ph-les' : 'ph-lrx'}" aria-hidden="true"></span><span class="sr-only"> </span>` : ' ';
    return esc(c.pre) + word + esc(c.post) + gap;
  }).join('');
}
function shLegend(text, lang){
  const H = shHints(text, lang), W = H.words, L = H.links, out = [];
  if (lang === 'sv') {
    if (W.some(m => m.retro && m.retro.length) || L.includes('retro')) out.push('<span class="ph-rx">rt</span> r verschmilzt mit dem folgenden Laut (in Mittelschweden), auch über die Wortgrenze');
    if (W.some(m => m.sj && m.sj.length)) out.push('<span class="ph-sj">sj</span> sj-Laut: gehaucht, mit runden Lippen, kein „sch“');
    if (W.some(m => m.tj && m.tj.length)) out.push('<span class="ph-tj">tj</span> tj-Laut: fast wie „ch“ in „ich“');
    if (W.some(m => m.silent && m.silent.length)) out.push('<span class="ph-si">g</span> stumm');
    if (W.some(m => m.say)) out.push('klein darüber: so spricht man es');
  } else {
    if (W.some(m => m.stress != null)) out.push('<span class="ph-st">a</span> betonte Silbe');
    if (L.includes('es')) out.push('<span class="ph-l ph-les"></span> in einem Zug gesprochen');
  }
  return out;
}

// ----- Welche Wörter hat die Spracherkennung verstanden? Je Wort des Satzes, beste Hypothese -----
function shNormWords(text, lang){
  let t = ' ' + String(text).toLowerCase() + ' ';
  if (lang === 'sv') t = t.replace(/ i(dag|morgon|kväll|går|natt) /g, ' i $1 ');
  // Ohne Akzente: „donde“ statt „dónde“ ist eine Schreibfrage der Erkennung, keine der Aussprache
  return tokens(t).map(w => /^\d+$/.test(w) && NUM_WORDS[lang][w] ? NUM_WORDS[lang][w][0] : deacc(norm(w, lang)));
}
function shHits(target, alts, lang){
  const ch = shChunks(target);
  let best = null;
  (alts || []).forEach(a => {
    const pool = shNormWords(a, lang);
    const hit = ch.map(c => { if (!c.core) return null; const w = shNormWords(c.core, lang)[0]; const i = pool.findIndex(x => numSame(x, w, lang)); if (i >= 0) { pool.splice(i, 1); return true; } return false; });
    const n = hit.filter(x => x === true).length;
    if (!best || n > best.n) best = { heard:a, hit, n, of:hit.filter(x => x != null).length };
  });
  return best;
}
const shTempo = (speech, orig) => { if (!(orig > 0.3) || !(speech > 0)) return null; const ratio = speech / orig; return { ratio, tempo:ratio > 1.6 ? 'vslow' : ratio > 1.25 ? 'slow' : ratio < 0.8 ? 'fast' : 'same' }; };

// ----- Geräte: Mikrofon, Audio, Abspielen -----
const SH = { stream:null, rec:null, src:null, an:null, buf:null, raf:0, timer:0, frames:[], chunks:[], t0:0, live:null, drawn:0, discard:false, ctx:null, play:null, ptoken:0, nat:{} };
const AC = window.AudioContext || window.webkitAudioContext;
const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
const MIC_BLOCKED = 'Das Mikrofon ist für Tagwerk gesperrt. Erlaube es in den Einstellungen der Seite (Symbol links neben der Adresse) und tipp dann noch einmal.';
const MIC_ERR = { NotAllowedError:MIC_BLOCKED, SecurityError:MIC_BLOCKED, NotFoundError:'Kein Mikrofon gefunden.', NotReadableError:'Das Mikrofon ist gerade belegt, etwa durch einen Anruf oder eine andere App.', AbortError:'Das Mikrofon ist gerade belegt, etwa durch einen Anruf oder eine andere App.' };
function shCtx(){
  if (!AC) return null;
  if (!SH.ctx || SH.ctx.state === 'closed') { try { SH.ctx = new AC(); } catch (e) { SH.ctx = null; } }
  return SH.ctx;
}
const shWake = c => { if (c && c.state === 'suspended' && c.resume) c.resume().catch(() => {}); };
// Dekodieren ohne laufenden Audio-Kontext (keine Autoplay-Sperre)
function shDecode(ab){
  return new Promise((res, rej) => {
    const c = OAC ? new OAC(1, 1, 44100) : shCtx();
    if (!c) return rej(new Error('kein Audio'));
    try { const p = c.decodeAudioData(ab, res, rej); if (p && p.catch) p.catch(rej); } catch (e) { rej(e); }
  });
}
const shItem = () => { const sh = S.shadow; return sh ? itemById(sh.ids[sh.idx]) : null; };
const shNative = item => !!(item && item.tat && item.tat.audio && !item.tat.audio.blocked);

// Runde beginnen: geübte Sätze, 3 bis 14 Wörter, bevorzugt mit echter Aufnahme
function shStart(lang){
  shTeardown();
  const ok = i => stOf(i.id) && (canSpeak() || shNative(i));
  const fit = i => { const n = tokens(i.target).length; return n >= 3 && n <= 14; };
  let pool = BANK[lang].filter(i => ok(i) && fit(i));
  if (pool.length < 8) pool = BANK[lang].filter(ok);
  const ids = shuffle(freshFirst(pool, 'shadow_' + lang, 8, shNative).map(i => i.id));
  S.shadow = { lang, ids, idx:0, slow:false, log:[], nTake:0 };
  shSentence();
}
function shSentence(){
  Object.assign(S.shadow, { phase:'idle', heard:false, along:false, orig:null, takes:[], tn:0, err:null, playing:null, pron:null, listening:false, doneTip:'', rep:0 });
  shPrefetch();
}
// Echte Aufnahme des Originals laden und vermessen (nur wenn der Server es erlaubt): dann gibt es die Hüllkurve zum Vergleich
function shPrefetch(){
  const item = shItem();
  if (!item || !shNative(item) || navigator.onLine === false || typeof fetch !== 'function') return;
  const id = item.id;
  if (SH.nat[id] !== undefined) { shUseNative(); return; }
  SH.nat[id] = null;
  fetch(item.tat.audio.url).then(r => { if (!r.ok) throw new Error('http'); return r.arrayBuffer(); }).then(shDecode)
    .then(buf => { const bins = shBinsFromPCM(buf.getChannelData(0), buf.sampleRate), an = shAnalyze(bins, 0, 0); SH.nat[id] = an.nothing ? false : { bins, an }; shUseNative(); })
    .catch(() => { SH.nat[id] = false; });
}
function shUseNative(){
  const sh = S.shadow, item = shItem(), n = item && SH.nat[item.id];
  if (!n) return;
  sh.orig = { dur:n.an.speech, src:'native', env:n };
  if (sh.log[sh.idx]) sh.log[sh.idx].orig = sh.orig;
  if (S.view === 'shadow' && ['idle', 'done'].includes(sh.phase)) render();
}
// Gemessene Länge des Originals (Computerstimme: Beginn bis Ende der Ausgabe, normales Tempo)
function shMeasured(kind, dur, rate){
  const sh = S.shadow; if (!sh || dur < 0.3) return;
  if (kind === 'tts' && rate === 0.9) sh.orig = { dur, src:'tts' };
  else if (kind === 'native' && rate >= 1 && !(sh.orig && sh.orig.env)) sh.orig = { dur, src:'native', approx:true };
  else return;
  if (sh.log[sh.idx]) sh.log[sh.idx].orig = sh.orig;
}

// Abspielen als Folge von Schritten (Original, Pause, eigene Aufnahme); jedes neue Abspielen bricht das alte ab
function shStopPlay(){
  SH.ptoken++;
  shHeadStop();
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  if (audioEl) { try { audioEl.pause(); } catch (e) {} }
  if (SH.play) { try { SH.play.stop(); } catch (e) {} SH.play = null; }
  shKaraoke(-1);
  if (S.shadow) S.shadow.playing = null;
}
// loop: so oft wiederholen (mit gap ms dazwischen), bis gestoppt wird oder die Zahl erreicht ist
function shSeq(kind, steps, loop, gap){
  shStopPlay();
  const tok = ++SH.ptoken, sh = S.shadow;
  sh.playing = kind; sh.rep = 1; shPatch();
  let i = 0;
  const next = () => {
    if (tok !== SH.ptoken) return;
    if (i >= steps.length && loop && sh.rep < loop) {
      setTimeout(() => { if (tok !== SH.ptoken) return; i = 0; sh.rep++; shPatch(); next(); }, gap || 1000);
      return;
    }
    if (i >= steps.length) { sh.playing = null; shHeadStop(); shPatch(); return; }
    const st = steps[i++];
    if (typeof st === 'number') { setTimeout(next, st); return; }
    st(next, tok);
  };
  next();
}
// Wortnummer zur Zeichenposition (für das Mitlesen beim Vorlesen)
function shWordAt(text, ci){
  let pos = 0, k = -1, hit = -1;
  String(text).split(/(\s+)/).forEach(part => { if (part && !/^\s+$/.test(part)) { k++; if (ci >= pos && ci < pos + part.length) hit = k; } pos += part.length; });
  return hit;
}
// Abspielposition im Wellenbild: Linie und hinterlegter Fortschritt. Die Bewegung rechnet der Browser selbst (Web Animations),
// deshalb läuft sie gleichmäßig, auch wenn die Seite gerade beschäftigt ist. track: .shtrack mit data-t0 (Beginn) und data-span (Länge in s);
// ta bis tb: abgespielter Ausschnitt in Sekunden derselben Zeitachse, secs: Dauer, delay: Ausgabeverzögerung (etwa Bluetooth)
function shHead(track, ta, tb, secs, delay){
  shHeadStop();
  if (!track || !track.animate || !(secs > 0)) return;
  const t0 = Number(track.dataset.t0), span = Number(track.dataset.span), w = track.getBoundingClientRect().width;
  if (!(span > 0) || !w) return;
  const X = t => (t - t0) / span * w, x0 = X(ta), x1 = X(tb);
  const band = document.createElement('i'), head = document.createElement('i');
  band.className = 'shpb'; head.className = 'shph';
  band.style.left = x0.toFixed(1) + 'px'; band.style.width = Math.max(0, x1 - x0).toFixed(1) + 'px';
  track.append(band, head);
  const o = { duration:secs * 1000, delay:Math.max(0, delay || 0) * 1000, easing:'linear', fill:'both' };
  head.animate([{ transform:`translateX(${x0.toFixed(1)}px)` }, { transform:`translateX(${x1.toFixed(1)}px)` }], o);
  band.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }], o);
  SH.head = [band, head];
}
function shHeadStop(){
  const els = SH.head; SH.head = null;
  if (!els) return;
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  els.forEach(e => { if (calm || !e.animate) { e.remove(); return; } const a = e.animate([{ opacity:1 }, { opacity:0 }], { duration:200, fill:'forwards' }); a.onfinish = () => e.remove(); });
}
// Abspielposition für das Original: Balken der Computerstimme (gemessene Länge) oder Wellenbild der Tatoeba-Aufnahme
function shHeadOrig(kind, rate){
  const sh = S.shadow, o = sh && sh.orig, track = document.querySelector('.shlane.orig .shtrack');
  if (!o || !track) return;
  if (o.env && kind === 'native') { const d = o.env.bins.length * SH_BIN, r = rate < 0.8 ? 0.75 : 1; shHead(track, 0, d, d / r); }
  else if (!o.env) shHead(track, 0.15, 0.15 + o.dur, o.dur * (kind === 'tts' ? 0.9 / rate : rate < 0.8 ? 1 / 0.75 : 1));
}
function shKaraoke(k){ document.querySelectorAll('.shs .w').forEach(el => el.classList.toggle('kar', Number(el.dataset.k) === k)); }
// mark: 'hear' oder 'along' – dieser Schritt gilt als erledigt, sobald das Original einmal ganz gespielt hat (nicht schon beim Start)
const shOrigStep = (item, rate, mark) => (done, tok) => {
  let t0 = 0, kind = '', fin = false;
  const end = err => {
    if (fin) return; fin = true; clearTimeout(guard);
    if (tok !== SH.ptoken) return;
    shKaraoke(-1);
    const secs = t0 ? (performance.now() - t0) / 1000 : 0;
    if (!err && t0) shMeasured(kind, secs, rate);
    if (mark && (!err || secs > 0.5)) shMarkStep(mark);
    done();
  };
  // Falls das Ende nie gemeldet wird (manche Sprachausgaben): nach der geschätzten Dauer weiter
  const guard = setTimeout(() => end(true), 3000 + String(item.target).length * 120 / rate);
  playItemEv(item, rate, { start:k => { t0 = performance.now(); kind = k; if (tok === SH.ptoken) shHeadOrig(k, rate); }, end, word:ci => { if (tok === SH.ptoken) shKaraoke(shWordAt(item.target, ci)); } });
};
function shMarkStep(mark){
  const sh = S.shadow; if (!sh) return;
  const was = sh.heard && (mark !== 'along' || sh.along);
  sh.heard = true; if (mark === 'along') sh.along = true;
  if (!was && S.view === 'shadow' && sh.phase === 'idle') render();
}
// Satz von selbst einmal vorspielen: Hören ist immer der erste Schritt. Nur als Folge eines Antippens (Start, Nächster Satz)
function shAutoHear(){
  const sh = S.shadow, item = shItem();
  if (item && sh.phase === 'idle') shSeq('hear', [shOrigStep(item, sh.slow ? 0.65 : 0.9, 'hear')]);
}
// track: Selektor des Wellenbilds, in dem die Abspielposition läuft
const shTakeStep = (take, from, track) => (done, tok) => {
  const c = shCtx(), an = take.an;
  const fin = () => { if (tok === SH.ptoken) done(); };
  if (c && take.buf && an && !an.nothing) {
    shWake(c);
    const b = Math.min(take.buf.duration, an.offset + 0.25), a = Math.max(0, Math.min(from != null ? from : an.onset - 0.12, b - 0.4));
    const src = c.createBufferSource(), g = c.createGain();
    // Lautstärke angleichen: leise Aufnahmen hörbar machen, ohne zu übersteuern
    g.gain.value = Math.max(1, Math.min(12, 0.2 / Math.max(0.005, an.top), 0.95 / Math.max(0.01, take.peak || 0.01)));
    src.buffer = take.buf; src.connect(g); g.connect(c.destination);
    SH.play = src;
    src.onended = () => { if (SH.play === src) SH.play = null; fin(); };
    src.start(0, a, Math.max(0.05, b - a));
    shHead(track && document.querySelector(track), a, b, Math.max(0.05, b - a), c.outputLatency || c.baseLatency || 0);
    return;
  }
  const el = new Audio(take.url);
  SH.play = { stop:() => el.pause() };
  el.onended = fin; el.onerror = fin;
  el.play().catch(fin);
};

// ----- Aufnahme -----
const shBusy = sh => ['starting', 'rec', 'proc'].includes(sh.phase);
async function shRecStart(){
  const sh = S.shadow;
  if (!sh || shBusy(sh) || sh.listening || !canRecord()) return;
  shStopPlay();
  const before = sh.phase;
  sh.phase = 'starting'; sh.err = null; render();
  // Audio-Kontext noch im Antippen wecken: nach der Freigabe-Abfrage wäre es dafür zu spät, und die Pegelanzeige bliebe stumm
  const c = shCtx(); shWake(c);
  let stream;
  // Ohne automatische Lautstärkeregelung: Sie würde Betonung (laut, leise) glätten und leise Stimmen bis zur Übersteuerung anheben.
  // Die Wiedergabe gleicht die Lautstärke danach selbst an.
  try { stream = await navigator.mediaDevices.getUserMedia({ audio:{ echoCancellation:true, noiseSuppression:true, autoGainControl:false } }); }
  catch (e) { if (S.shadow === sh) { sh.phase = before; sh.err = MIC_ERR[e && e.name] || 'Das Mikrofon ließ sich nicht starten.'; render(); } return; }
  if (S.shadow !== sh || S.view !== 'shadow' || sh.phase !== 'starting') { stream.getTracks().forEach(t => t.stop()); return; }
  SH.stream = stream; SH.chunks = []; SH.frames = []; SH.discard = false; SH.drawn = 0;
  SH.live = { floor:1, top:0, prev:[0, 0], voiced:0, run:0, onset:null, last:0, lastT:0 };
  let rec;
  try {
    if (c && c.createMediaStreamSource) { SH.src = c.createMediaStreamSource(stream); SH.an = c.createAnalyser(); SH.an.fftSize = 1024; SH.src.connect(SH.an); SH.buf = new Float32Array(SH.an.fftSize); }
    rec = SH.rec = new MediaRecorder(stream);
  } catch (e) { shRelease(); sh.phase = before; sh.err = 'Aufnehmen geht in diesem Browser nicht.'; render(); return; }
  rec.ondataavailable = e => { if (e.data && e.data.size) SH.chunks.push(e.data); };
  rec.onstart = () => {
    if (S.shadow !== sh) return;
    SH.t0 = performance.now(); sh.phase = 'rec'; buzz('ok'); render();
    const o = sh.orig ? sh.orig.dur : 3;
    SH.cap = Math.min(20, Math.max(8, o * 3 + 2));
    SH.timer = setTimeout(() => shRecStop('cap'), SH.cap * 1000 + 400);
    shLoop();
  };
  rec.onstop = () => shRecDone(sh, rec);
  try { rec.start(250); } catch (e) { shRelease(); sh.phase = before; sh.err = 'Die Aufnahme ließ sich nicht starten.'; render(); }
}
// Pegel messen, live zeichnen, von selbst stoppen: nach 1,2 s Stille, wenn vorher gesprochen wurde
function shLoop(){
  const sh = S.shadow;
  if (!sh || sh.phase !== 'rec') return;
  const t = (performance.now() - SH.t0) / 1000, L = SH.live;
  if (SH.an) {
    const b = SH.buf;
    if (SH.an.getFloatTimeDomainData) SH.an.getFloatTimeDomainData(b);
    else { const u = new Uint8Array(b.length); SH.an.getByteTimeDomainData(u); u.forEach((x, i) => { b[i] = (x - 128) / 128; }); }
    let s = 0, p = 0;
    for (let i = 0; i < b.length; i++) { const v = b[i]; s += v * v; if (v > p) p = v; else if (-v > p) p = -v; }
    const r = Math.sqrt(s / b.length), dt = t - L.lastT;
    L.lastT = t; SH.frames.push({ t, r, p });
    const sm = (L.prev[0] + L.prev[1] + r) / 3; L.prev = [L.prev[1], r];
    if (t > 0.1) L.floor = Math.min(L.floor, sm);
    L.top = Math.max(L.top, sm);
    const thr = Math.max(0.004, L.floor * 3, L.top * 0.15);
    if (sm > thr) { L.run += dt; if (L.onset == null && L.run >= 0.12) L.onset = Math.max(0, t - L.run); L.last = t; L.voiced += dt; }
    else if (L.onset == null) L.run = 0;
    L.thr = thr;
    if (L.onset != null && t - L.last > 1.2 && L.voiced > 0.3) return shRecStop('auto');
    if (L.onset == null && t > 7) return shRecStop('none');
  }
  if (t > SH.cap) return shRecStop('cap');
  if (t - SH.drawn >= 0.05) { SH.drawn = t; shDrawLive(t); }
  SH.raf = requestAnimationFrame(shLoop);
}
function shRecStop(){
  const sh = S.shadow;
  cancelAnimationFrame(SH.raf); clearTimeout(SH.timer);
  if (SH.rec && SH.rec.state === 'recording') { if (sh && !SH.discard) { sh.phase = 'proc'; render(); } buzz('ok'); try { SH.rec.stop(); } catch (e) { shRelease(); } }
}
function shRecCancel(){ SH.discard = true; shRecStop(); }
function shRelease(){
  cancelAnimationFrame(SH.raf); clearTimeout(SH.timer);
  if (SH.src) { try { SH.src.disconnect(); } catch (e) {} }
  if (SH.stream) SH.stream.getTracks().forEach(t => t.stop());
  SH.stream = SH.src = SH.an = SH.rec = null;
}
async function shRecDone(sh, rec){
  const chunks = SH.chunks, frames = SH.frames, discard = SH.discard;
  // Mikrofon sofort freigeben: Bluetooth-Kopfhörer und Lautstärke schalten zurück, bevor du abspielst
  shRelease(); SH.discard = false;
  if (S.shadow !== sh) return;
  if (discard || !chunks.length) { sh.phase = sh.takes.length ? 'done' : 'idle'; if (!discard) sh.err = 'Die Aufnahme ist leer geblieben. Versuch es noch einmal.'; render(); return; }
  const blob = new Blob(chunks, { type:rec.mimeType || 'audio/webm' });
  // n: Versuch für diesen Satz; nTake: alle Versuche der Runde (für die Übersicht)
  sh.nTake++;
  const take = { url:URL.createObjectURL(blob), buf:null, bins:null, an:null, n:++sh.tn };
  try { take.buf = await shDecode(await blob.arrayBuffer()); take.bins = shBinsFromPCM(take.buf.getChannelData(0), take.buf.sampleRate); } catch (e) { take.buf = null; }
  if (!take.bins && frames.length) take.bins = shBinsFromFrames(frames);
  if (S.shadow !== sh) { URL.revokeObjectURL(take.url); return; }
  const item = shItem();
  if (take.bins) {
    take.an = shMarkPauses(shAnalyze(take.bins, 0, shCommas(item.target)), item.target);
    if (!take.an.nothing) take.peak = Math.max(...take.bins.slice(Math.floor(take.an.onset / SH_BIN), Math.ceil(take.an.offset / SH_BIN)).map(b => b.p), 0.01);
  }
  sh.takes.push(take);
  if (sh.takes.length > 3) URL.revokeObjectURL(sh.takes.shift().url);
  if (take.an && !take.an.nothing) sh.log[sh.idx] = { id:item.id, take, orig:sh.orig };
  sh.phase = 'done'; sh.pron = null; render();
}
// Beim Verlassen: Mikrofon aus, Wiedergabe aus, Aufnahmen verwerfen
function shTeardown(){
  if (SH.rec && SH.rec.state === 'recording') { SH.discard = true; try { SH.rec.stop(); } catch (e) {} }
  shRelease(); shStopPlay();
  if (activeRec) { try { activeRec.abort(); } catch (e) {} }
  const sh = S.shadow;
  if (sh) { const urls = new Set((sh.takes || []).concat((sh.log || []).filter(Boolean).map(l => l.take)).map(t => t.url)); urls.forEach(u => URL.revokeObjectURL(u)); }
  if (SH.ctx && SH.ctx.state === 'running' && SH.ctx.suspend) SH.ctx.suspend().catch(() => {});
}

// ----- Darstellung -----
const SHI = {
  rec:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg>',
  stop:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="2.5" fill="currentColor"/></svg>',
  ab:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 8h13l-3-3M20 16H7l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  loop:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M17 4l3 3-3 3M20 7H8a4 4 0 0 0-4 4M7 20l-3-3 3-3M4 17h12a4 4 0 0 0 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
// Hüllkurve als Balken. t0/t1: Zeitfenster in s; mark: Länge des Originals als Klammer; pill: Original ohne Hüllkurve; pz: Pausen
function shWaveSvg(bins, o){
  const W = 320, H = 56, top0 = 13, cy = (top0 + H) / 2, maxH = H - top0 - 2;
  const t0 = o.t0 || 0, t1 = Math.max(t0 + 0.5, o.t1 || 0), span = t1 - t0, step = 2;
  const x = t => ((t - t0) / span * W).toFixed(1);
  const top = o.top || Math.max(0.02, ...bins.map(b => b.r));
  const bw = Math.max(1.2, W / (span / (SH_BIN * step)) * 0.62).toFixed(1);
  let h = '';
  (o.pz || []).forEach(([a, b, ok]) => { h += `<rect class="${ok ? 'pz ok' : 'pz'}" x="${x(a)}" y="${top0}" width="${(Math.max(0, b - a) / span * W).toFixed(1)}" height="${maxH}" rx="3"/>`; });
  if (o.pill) h += `<rect class="pill" x="${x(o.pill[0])}" y="${(cy - 5).toFixed(1)}" width="${((o.pill[1] - o.pill[0]) / span * W).toFixed(1)}" height="10" rx="5"/>`;
  for (let k = Math.max(0, Math.floor(t0 / SH_BIN)); k * SH_BIN < t1 && k < bins.length; k += step) {
    const v = Math.max(bins[k].r, bins[k + 1] ? bins[k + 1].r : 0), hh = Math.max(1.5, Math.min(1, Math.pow(v / top, 0.6)) * maxH);
    h += `<rect class="${o.thr && v <= o.thr ? 'b q' : 'b'}" x="${x(k * SH_BIN)}" y="${(cy - hh / 2).toFixed(1)}" width="${bw}" height="${hh.toFixed(1)}" rx="1"/>`;
  }
  if (o.mark) { const a = x(o.mark[0]), b = x(Math.min(t1, o.mark[1])); h += `<path class="mk" vector-effect="non-scaling-stroke" d="M${a} 3v7M${a} 6.5H${b}M${b} 3v7"/>`; }
  return `<svg class="shwave${o.cls ? ' ' + o.cls : ''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${h}</svg>`;
}
// Wellenbild mit Zeitachse (für die Abspielposition)
const shTrack = (svg, t0, span, attr) => `<span class="shtrack" data-t0="${t0.toFixed(3)}" data-span="${span.toFixed(3)}"${attr || ''}>${svg}</span>`;
// Live: Fenster wächst mit, die Klammer zeigt ab Sprechbeginn, wie lang das Original ist
function shLiveWave(t){
  const sh = S.shadow, L = SH.live || {}, o = sh.orig && !sh.orig.approx ? sh.orig.dur : 0;
  const span = Math.max(3, o * 1.6 + 0.8, t + 0.6);
  const mark = o && L.onset != null ? [L.onset, L.onset + o] : null;
  return shWaveSvg(shBinsFromFrames(SH.frames), { t0:0, t1:span, mark, thr:L.thr, top:Math.max(0.05, L.top || 0), cls:'live' });
}
function shDrawLive(t){
  const box = document.getElementById('shlive'), stat = document.getElementById('shtime'), msg = document.getElementById('shsay');
  if (box) box.innerHTML = shLiveWave(t);
  if (stat) stat.textContent = fmtSec(t);
  const L = SH.live;
  if (msg && L) msg.textContent = L.onset == null ? (t > 2.5 ? 'Noch nichts zu hören. Sprich ruhig lauter.' : 'Sprich jetzt') : L.top < 0.012 ? 'Sehr leise. Halt das Handy näher.' : 'Ich höre dich';
}
// Nur die Teile neu zeichnen, die sich beim Abspielen ändern (gedrückte Knöpfe), damit nichts springt
function shPatch(){
  const sh = S.shadow; if (!sh) return;
  document.querySelectorAll('[data-sh]').forEach(el => { const on = sh.playing === el.dataset.sh; el.setAttribute('aria-pressed', on); });
  document.querySelectorAll('.shstep[data-m]').forEach(el => el.classList.toggle('on', sh.playing === el.dataset.m));
  const tip = document.getElementById('shtip'); if (tip) tip.innerHTML = shTip(sh);
}
function shTip(sh){
  if (sh.playing === 'along') return `Jetzt mitsprechen, halblaut und gleichzeitig.${sh.rep > 1 ? ` Durchgang ${sh.rep}.` : ''} Es wiederholt sich, bis du stoppst.`;
  if (sh.phase === 'done' && sh.doneTip) return sh.doneTip;
  if (sh.playing === 'hear') return 'Hör auf Melodie und Betonung.';
  if (!sh.heard) return 'Erst nur zuhören.';
  if (!sh.along) return 'Dann gleichzeitig mitsprechen, halblaut. Halt mit der Stimme Schritt.';
  if (canRecord()) return 'Jetzt allein, im selben Tempo. Die Aufnahme stoppt von selbst, wenn du fertig bist.';
  return canListen() ? 'Jetzt allein sprechen und von der Spracherkennung prüfen lassen.' : 'Aufnehmen geht in diesem Browser nicht.';
}
function shStepsHtml(sh){
  const third = canRecord() ? { a:'shrec', t:'Allein', d:'aufnehmen' } : canListen() ? { a:'pron', t:'Allein', d:'Erkennung testen' } : null;
  const steps = [{ a:'shhear', m:'hear', t:'Hören', d:'zuerst nur zuhören', done:sh.heard }, { a:'shalong', m:'along', t:'Mitsprechen', d:'gleichzeitig', done:sh.along }].concat(third ? [third] : []);
  const cur = steps.findIndex(s => !s.done);
  return `<ol class="shsteps">${steps.map((s, i) => `<li class="${s.done ? 'done' : ''}"><button type="button" class="shstep${s.done ? ' done' : ''}${i === cur ? ' cur' : ''}${s.m && sh.playing === s.m ? ' on' : ''}" data-a="${s.a}"${s.m ? ` data-m="${s.m}"` : ''} aria-label="${i + 1}. ${s.t}: ${s.d}"><i>${s.done ? SHI.check : i + 1}</i><b>${s.t}</b></button></li>`).join('')}</ol>
    <p class="shtip"><span id="shtip">${shTip(sh)}</span> <button type="button" class="link dim" data-a="shnext">Überspringen</button></p>`;
}
function shPronHtml(sh){
  if (sh.listening) return '<p class="shmsg"><span class="dots">Sprich den Satz noch einmal. Verstandene Wörter werden grün</span></p>';
  if (!sh.pron) return '';
  if (sh.pron.err) return `<p class="shmsg warn">${esc(sh.pron.err)}</p>`;
  return `<p class="shmsg"><b>${sh.pron.n} von ${sh.pron.of} Wörtern verstanden.</b> Gehört: „${esc(sh.pron.heard)}“. Rot markierte Wörter lohnen einen zweiten Versuch. Die Erkennung ist ein Anhaltspunkt, kein Urteil über den Akzent.</p>`;
}
const SH_TEMPO = { same:['ok', 'wie das Original'], slow:['warn', 'etwas langsamer'], vslow:['warn', 'deutlich langsamer'], fast:['warn', 'schneller'] };
function shResultHtml(sh){
  const tk = sh.takes[sh.takes.length - 1], an = tk.an, o = sh.orig;
  const play = `<div class="shplay">
      <button type="button" class="pchip" data-a="shpo" data-sh="orig" aria-pressed="${sh.playing === 'orig'}">${PICO.play}<span>Original</span></button>
      <button type="button" class="pchip" data-a="shpm" data-sh="me" aria-pressed="${sh.playing === 'me'}">${PICO.play}<span>Du</span></button>
      <button type="button" class="pchip" data-a="shpab" data-sh="ab" aria-pressed="${sh.playing === 'ab'}">${SHI.ab}<span>Im Wechsel</span></button>
      <button type="button" class="pchip" data-a="shalong" data-sh="along" aria-pressed="${sh.playing === 'along'}">${SHI.loop}<span>Mitsprechen</span></button></div>`;
  const pron = canListen() ? (sh.pron || sh.listening ? shPronHtml(sh) : '<p class="shtip"><button type="button" class="link" data-a="pron">Versteht dich die Spracherkennung? Testen</button></p>') : '';
  if (!an) return `<p class="shmsg">Aufgenommen. Auswerten geht in diesem Browser nicht, anhören schon.</p>${play}${pron}`;
  if (an.nothing) return `<p class="shmsg warn"><b>Nichts gehört.</b> Ist das Mikrofon frei? Tipp auf „Nochmal“ und sprich direkt los.</p>`;
  const od = o ? o.dur : 0, T = Math.max(an.speech, od) + 0.45, a0 = an.onset - 0.15;
  const oe = o && o.env;
  const origLane = oe ? shTrack(shWaveSvg(oe.bins, { t0:oe.an.onset - 0.15, t1:oe.an.onset - 0.15 + T, cls:'orig' }), oe.an.onset - 0.15, T)
    : o ? shTrack(shWaveSvg([], { t0:0, t1:T, pill:[0.15, 0.15 + od], cls:'orig' }), 0, T, ' data-pill="1"') : '';
  const lanes = `<div class="shlanes">
      <div class="shlane orig"><span class="shl">Original</span>${origLane || '<span class="shnone">Hör es dir an, dann steht es hier zum Vergleich.</span>'}</div>
      <button type="button" class="shlane me" data-a="shseek" aria-label="Deine Aufnahme ab dieser Stelle abspielen"><span class="shl">Du</span>${shTrack(shWaveSvg(tk.bins, { t0:a0, t1:a0 + T, pz:an.pauses, cls:'me' }), a0, T)}</button>
    </div>`;
  const tp = o && !o.approx ? shTempo(an.speech, od) : null;
  const tiles = [
    tp ? [SH_TEMPO[tp.tempo][0], 'Tempo', SH_TEMPO[tp.tempo][1], `${fmtSec(an.speech)} · Original ${fmtSec(od)}`]
      : o ? ['mute', 'Tempo', fmtSec(an.speech), `Original ca. ${fmtSec(od)}`] : ['mute', 'Tempo', fmtSec(an.speech), 'Original anhören zum Vergleich'],
    an.extra ? ['warn', 'Fluss', an.extra === 1 ? '1 Stockung' : `${an.extra} Stockungen`, 'in deiner Spur markiert'] : ['ok', 'Fluss', 'ohne Stocken', an.pauses.length ? (an.pauses.length === 1 ? 'Pause am Satzzeichen' : 'Pausen an Satzzeichen') : 'in einem Zug']
  ];
  const level = an.clip ? 'Zu laut: Die Aufnahme übersteuert. Halt das Handy etwas weiter weg.' : an.quiet ? 'Sehr leise aufgenommen. Halt das Handy näher an den Mund.' : '';
  // Vergleich mit dem Versuch davor
  const prev = sh.takes.length > 1 ? sh.takes[sh.takes.length - 2].an : null, cmp = [];
  if (prev && !prev.nothing) {
    const pt = o && !o.approx ? shTempo(prev.speech, od) : null;
    if (tp && pt && Math.abs(Math.log(tp.ratio)) < Math.abs(Math.log(pt.ratio)) - 0.08) cmp.push('Tempo näher am Original als eben');
    if (an.extra < prev.extra) cmp.push('weniger Stockungen als eben');
  }
  sh.doneTip = `Versuch ${tk.n}${cmp.length ? `: ${cmp.join(', ')}.` : '.'} Tipp auf deine Spur, um ab der Stelle zu hören.`;
  return `${lanes}
    <div class="shtiles">${tiles.map(([c, l, v, s]) => `<div class="sht ${c}"><span class="shtl">${l}</span><b>${v}</b><span class="shts">${s}</span></div>`).join('')}</div>
    ${level ? `<p class="shmsg warn">${level}</p>` : ''}
    ${play}<p class="shtip" id="shtip" aria-live="polite">${shTip(sh)}</p>${pron}`;
}
function shStageHtml(sh){
  const err = sh.err ? `<p class="shmsg warn">${esc(sh.err)}</p>` : '';
  if (sh.phase === 'starting') return '<div class="shstage live"><p class="shstat"><span class="dots">Mikrofon startet</span></p><div class="shwbox"></div></div>';
  if (sh.phase === 'rec') {
    return `<div class="shstage live"><p class="shstat"><i class="shdot" aria-hidden="true"></i><span id="shsay" aria-live="polite">Sprich jetzt</span><span class="shtime" id="shtime">${fmtSec(0)}</span></p>
      <div class="shwbox" id="shlive">${shLiveWave(0)}</div>
      <p class="shtip">Stoppt von selbst, wenn du fertig bist.${sh.orig && !sh.orig.approx ? ' Die Klammer zeigt, wie lang das Original ist.' : ''}</p></div>`;
  }
  if (sh.phase === 'proc') return '<div class="shstage"><p class="shstat"><span class="dots">Wird ausgewertet</span></p></div>';
  if (sh.phase === 'done' && sh.takes.length) return `<div class="shstage" aria-live="polite">${err}${shResultHtml(sh)}</div>`;
  return `<div class="shstage">${err}${shStepsHtml(sh)}${sh.pron || sh.listening ? shPronHtml(sh) : ''}</div>`;
}
function shBarHtml(sh){
  const last = sh.idx >= sh.ids.length - 1;
  const slow = `<button type="button" class="ghost" data-a="shslow" aria-pressed="${!!sh.slow}">${PICO.slow}<span>Langsam</span></button>`;
  let left = '', right = '';
  if (sh.phase === 'starting') { left = '<button type="button" class="ghost" data-a="shcancel">Abbrechen</button>'; right = '<button type="button" class="primary" disabled>Mikrofon startet …</button>'; }
  else if (sh.phase === 'rec') { left = '<button type="button" class="ghost" data-a="shcancel">Verwerfen</button>'; right = `<button type="button" class="primary shmain shstop" data-a="shstop">${SHI.stop}<span>Fertig</span></button>`; }
  else if (sh.phase === 'proc') right = '<button type="button" class="primary" disabled>Wird ausgewertet …</button>';
  else if (sh.listening) right = '<button type="button" class="primary" disabled>Ich höre zu …</button>';
  else if (sh.phase === 'done' && sh.takes.length) {
    left = `<button type="button" class="ghost" data-a="shrec">${SHI.rec}<span>Nochmal</span></button>`;
    right = `<button type="button" class="primary" data-a="shnext">${last ? 'Zur Übersicht' : 'Nächster Satz'}</button>`;
  } else {
    left = slow;
    const stage = sh.along || sh.playing === 'along' ? 2 : sh.heard || sh.playing === 'hear' ? 1 : 0;
    const [a, ico, label] = stage === 0 ? ['shhear', PICO.play, 'Anhören'] : stage === 1 ? ['shalong', SHI.loop, 'Mitsprechen']
      : canRecord() ? ['shrec', SHI.rec, 'Aufnehmen'] : canListen() ? ['pron', ICONS.mic, 'Erkennung testen'] : ['shnext', '', last ? 'Zur Übersicht' : 'Nächster Satz'];
    right = `<button type="button" class="primary shmain" data-a="${a}">${ico}<span>${label}</span></button>`;
  }
  return `<div class="actionbar shbar"><div class="in">${left}${right}</div></div>`;
}
function viewShadow(){
  const sh = S.shadow, lang = sh.lang, item = shItem();
  if (!item) return shSummaryHtml();
  const hints = DB.settings.shHints !== false, leg = hints ? shLegend(item.target, lang) : [];
  if (hints && !leg.length) leg.push('In diesem Satz nichts Besonderes zur Aussprache.');
  const head = `<div class="runbar"><button type="button" class="x xt" data-a="shquit">Beenden</button><div class="progress" aria-hidden="true">${sh.ids.map((_, i) => `<i class="seg${i < sh.idx ? ' s-done' : i === sh.idx ? ' s-cur' : ''}"></i>`).join('')}</div><span class="count">${sh.idx + 1}/${sh.ids.length}</span></div>`;
  const src = shNative(item) && navigator.onLine !== false ? 'Aufnahme von Tatoeba' : 'Computerstimme';
  return head + `<section class="ex shex">
    <div class="shhead"><span class="tag">${src}</span><button type="button" class="tag shhint${hints ? ' on' : ''}" data-a="shhints" aria-pressed="${hints}">Aussprachehilfen</button></div>
    <p class="shs${hints ? ' hints' : ''}" lang="${lang}">${shSentenceHtml(item.target, lang, hints, sh.pron && !sh.pron.err ? sh.pron.hit : null)}</p>
    <p class="gloss">${esc(item.de)}</p>
    ${leg.length ? `<p class="shleg">${leg.map(x => `<span>${x}</span>`).join('')}</p>` : ''}
    <div class="ex-sp"></div><div class="ex-a">${shStageHtml(sh)}</div></section>` + shBarHtml(sh);
}
function shSummaryHtml(){
  const sh = S.shadow, lang = sh.lang, rows = sh.log.map((l, i) => l && Object.assign({ i }, l)).filter(Boolean);
  const bar = '<div class="actionbar"><div class="in"><button type="button" class="ghost" data-a="tab" data-v="extra">Fertig</button><button type="button" class="primary" data-a="shadow">Neue Runde</button></div></div>';
  if (!rows.length) return backBar('Nachsprechen') + '<p class="lead">Runde beendet.</p><p class="hint">Diesmal ohne Aufnahme. Beim nächsten Mal: anhören, mitsprechen, dann allein aufnehmen und vergleichen.</p>' + bar;
  const takes = sh.nTake, tps = rows.map(r => r.orig && !r.orig.approx ? shTempo(r.take.an.speech, r.orig.dur) : null).filter(Boolean);
  const gm = tps.length ? Math.exp(tps.reduce((s, t) => s + Math.log(t.ratio), 0) / tps.length) : 0;
  const stock = rows.reduce((s, r) => s + r.take.an.extra, 0);
  const kp = [[rows.length, rows.length === 1 ? 'Satz aufgenommen' : 'Sätze aufgenommen'], [takes, takes === 1 ? 'Versuch' : 'Versuche']];
  if (gm) kp.push([gm.toLocaleString('de-DE', { maximumFractionDigits:1, minimumFractionDigits:1 }) + '×', 'so lang wie das Original']);
  else kp.push([stock, stock === 1 ? 'Stockung' : 'Stockungen']);
  const list = rows.map(r => { const it = itemById(r.id), an = r.take.an; return `<div class="row static shrow"><span class="txt"><span class="rt" lang="${lang}">${esc(it ? it.target : '')}</span>${shTrack(shWaveSvg(r.take.bins, { t0:an.onset - 0.1, t1:an.offset + 0.1, pz:an.pauses, cls:'mini' }), an.onset - 0.1, an.offset - an.onset + 0.2, ` data-i="${r.i}"`)}</span><button type="button" class="pbtn" data-a="shone" data-i="${r.i}" data-sh="one${r.i}" aria-pressed="${sh.playing === 'one' + r.i}" aria-label="Original und dich im Wechsel hören">${SHI.ab}</button></div>`; }).join('');
  return backBar('Nachsprechen') + `<div class="donebox">
    <h1 class="done-h">Runde geschafft</h1>
    <p class="lead">${rows.length === 1 ? 'Ein Satz' : rows.length + ' Sätze'} nachgesprochen.</p>
    <div class="kpis done-kpis">${kp.map(([v, l]) => `<div><b>${esc(String(v))}</b><span>${l}</span></div>`).join('')}</div></div>
    <h2 class="grp">Deine Aufnahmen</h2>
    <div class="shall"><button type="button" class="pchip" data-a="shall" data-sh="all" aria-pressed="${sh.playing === 'all'}">${SHI.ab}<span>Alle im Wechsel</span></button><button type="button" class="pchip" data-a="shmine" data-sh="mine" aria-pressed="${sh.playing === 'mine'}">${PICO.play}<span>Nur meine</span></button></div>
    <div class="rows">${list}</div>
    <p class="hint">Tipp: Hör dir zum Schluss nur deine Aufnahmen hintereinander an. Dabei fällt die Satzmelodie am deutlichsten auf.</p>
    <p class="src">Die Aufnahmen bleiben auf diesem Gerät und nur, bis du die Seite verlässt.</p>` + bar;
}

// ----- Aktionen -----
function shadowCmd(a, b, e){
  if (a === 'shadow') { shStart(S.lang); shAutoHear(); goView('shadow'); return; }
  const sh = S.shadow; if (!sh) return;
  const item = shItem(), rate = sh.slow ? 0.65 : 0.9, last = sh.takes && sh.takes[sh.takes.length - 1];
  const toggle = (kind, steps) => { if (sh.playing === kind) { shStopPlay(); shPatch(); } else shSeq(kind, steps); };
  switch (a) {
    // Erst abspielen (noch im Antippen, sonst blockt der Browser den Ton), dann zeichnen
    case 'shhear': if (!item || shBusy(sh)) break; sh.err = null; shSeq('hear', [shOrigStep(item, rate, 'hear')]); render(); break;
    case 'shalong': {
      if (!item || shBusy(sh)) break;
      if (sh.playing === 'along') { shStopPlay(); if (sh.phase === 'idle') render(); else shPatch(); break; }
      sh.err = null;
      shSeq('along', [shOrigStep(item, rate, 'along')], 10, 1100);
      if (sh.phase !== 'done') render();
      break;
    }
    case 'shrec': shRecStart(); break;
    case 'shstop': shRecStop(); break;
    case 'shcancel': if (sh.phase === 'starting') { sh.phase = sh.takes.length ? 'done' : 'idle'; render(); } else shRecCancel(); break;
    case 'shslow': sh.slow = !sh.slow; render(); break;
    case 'shhints': DB.settings.shHints = DB.settings.shHints === false; save(); render(); break;
    case 'shpo': if (item) toggle('orig', [shOrigStep(item, rate)]); break;
    case 'shpm': if (last) toggle('me', [shTakeStep(last, null, '.shlane.me .shtrack')]); break;
    case 'shpab': if (item && last) toggle('ab', [shOrigStep(item, 0.9), 400, shTakeStep(last, null, '.shlane.me .shtrack')]); break;
    case 'shseek': {
      if (!last || !last.an || last.an.nothing) break;
      const r = b.getBoundingClientRect(), od = sh.orig ? sh.orig.dur : 0, T = Math.max(last.an.speech, od) + 0.45;
      const f = Math.min(1, Math.max(0, ((e && e.clientX != null ? e.clientX : r.left) - r.left) / Math.max(1, r.width)));
      shSeq('me', [shTakeStep(last, Math.max(0, last.an.onset - 0.15 + f * T - 0.1), '.shlane.me .shtrack')]);
      break;
    }
    case 'shnext': case 'shquit': {
      if (shBusy(sh)) break;
      shStopPlay();
      if (sh.heard || sh.takes.length || sh.pron) { logAct(sh.lang); save(); }
      if (a === 'shquit' && !sh.log.some(Boolean)) { goView('extra'); break; }
      sh.idx = a === 'shquit' ? sh.ids.length : sh.idx + 1;
      if (sh.idx < sh.ids.length) { shSentence(); shAutoHear(); }
      render(); window.scrollTo(0, 0); break;
    }
    case 'shone': { const k = b.dataset.i, l = sh.log[Number(k)], it = l && itemById(l.id); if (it) toggle('one' + k, [shOrigStep(it, 0.9), 400, shTakeStep(l.take, null, `.shrow .shtrack[data-i="${k}"]`)]); break; }
    case 'shall': case 'shmine': {
      const steps = [];
      sh.log.forEach((l, k) => { const it = l && itemById(l.id); if (!it) return; if (a === 'shall') steps.push(shOrigStep(it, 0.9), 350); steps.push(shTakeStep(l.take, null, `.shrow .shtrack[data-i="${k}"]`), 700); });
      toggle(a === 'shall' ? 'all' : 'mine', steps); break;
    }
    case 'pron': {
      if (!item || sh.listening || shBusy(sh)) break;
      shStopPlay();
      sh.listening = true; sh.pron = null; render();
      listen(sh.lang, res => {
        if (S.shadow !== sh) return;
        sh.listening = false;
        sh.pron = res.ok ? shHits(item.target, res.alts, sh.lang) : { err:LISTEN_ERR[res.err] || 'Die Spracherkennung hat nicht geklappt.' };
        if (S.view === 'shadow') render();
      }, text => {
        // Zwischenstand: verstandene Wörter werden schon beim Sprechen grün
        const h = S.shadow === sh && shHits(item.target, [text], sh.lang);
        if (h) document.querySelectorAll('.shs .w').forEach(el => el.classList.toggle('p-ok', !!h.hit[Number(el.dataset.k)]));
      });
      break;
    }
  }
}
