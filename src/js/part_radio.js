/* ---------- Hörrunde: geübte Sätze nebenbei hören, ohne Antippen ---------- */
// Ablauf je Satz: Zielsprache, Pause, Deutsch (abschaltbar), Pause, Zielsprache langsam, Pause, nächster Satz.
// Die wackeligsten Sätze zuerst. Der Bildschirm bleibt an, solange die Runde läuft (Wake Lock, wo vorhanden).
let radioTimer = null, radioToken = 0, radioWake = null;
const RADIO_STEPS = ['Hören', 'Deutsch', 'Langsam'];
function radioPool(lang){
  const t = today();
  const seen = BANK[lang].filter(i => stOf(i.id));
  return seen.sort((a, b) => FSRS.retrievability(stOf(a.id), t) - FSRS.retrievability(stOf(b.id), t)).slice(0, 30);
}
function startRadio(){
  const ids = shuffle(radioPool(S.lang)).map(i => i.id);
  if (ids.length < 3 || !canSpeak()) { note('Für die Hörrunde braucht es drei geübte Sätze und eine Vorlesestimme.', 'warn'); render(); return; }
  const prev = DB.settings.radio || {};
  S.radio = { lang:S.lang, ids, idx:0, step:0, playing:true, de:prev.de !== false, show:prev.show !== false, slow:!!prev.slow, heard:0, t0:Date.now() };
  goView('radio');
  try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(l => { radioWake = l; }).catch(() => {}); } catch (e) {}
  radioPlay();
}
function stopRadio(){
  const R = S.radio; if (!R) return;
  radioToken++; clearTimeout(radioTimer);
  try { speechSynthesis.cancel(); } catch (e) {}
  const secs = Math.round((Date.now() - R.t0) / 1000);
  if (secs >= 20) { logDay(R.lang, { secs:Math.min(secs, 3600) }); save(); }
  try { if (radioWake) radioWake.release(); } catch (e) {}
  radioWake = null; S.radio = null;
}
// Vorlesen mit Rückmeldung am Ende; ein Zeitlimit fängt Browser ab, die „onend“ verschlucken
function sayThen(text, tts, rate, done){
  let fired = false; const fin = () => { if (!fired) { fired = true; done(); } };
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = tts; u.rate = rate;
    const v = speechSynthesis.getVoices().find(x => x.lang && x.lang.toLowerCase().replace('_', '-').startsWith(tts.slice(0, 2)));
    if (v) u.voice = v;
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 2500 + text.length * 110 / rate);
    speechSynthesis.speak(u);
  } catch (e) { setTimeout(fin, 800); }
}
function radioPlay(){
  const R = S.radio; if (!R || !R.playing) return;
  const tok = ++radioToken;
  const live = () => tok === radioToken && S.radio === R && R.playing;
  const later = (ms, fn) => { clearTimeout(radioTimer); radioTimer = setTimeout(() => { if (live()) fn(); }, ms); };
  const item = itemById(R.ids[R.idx]);
  if (!item) { R.idx = (R.idx + 1) % R.ids.length; R.step = 0; radioPlay(); return; }
  const tts = LANG[R.lang].tts;
  const advance = () => {
    R.step++;
    if (R.step === 1 && !(R.de && item.de)) R.step++;
    if (R.step >= RADIO_STEPS.length) { R.step = 0; R.heard++; R.idx = (R.idx + 1) % R.ids.length; }
    if (S.view === 'radio') render();
    radioPlay();
  };
  if (R.step === 0) sayThen(item.target, tts, R.slow ? 0.75 : 0.95, () => live() && later(900, advance));
  else if (R.step === 1) sayThen(item.de, 'de-DE', 1, () => live() && later(800, advance));
  else sayThen(item.target, tts, 0.65, () => live() && later(1800, advance));
}
function radioCmd(a){
  const R = S.radio; if (!R) return;
  const keep = () => { DB.settings.radio = { de:R.de, show:R.show, slow:R.slow }; save(); };
  if (a === 'rplay') { R.playing = !R.playing; if (R.playing) radioPlay(); else { radioToken++; clearTimeout(radioTimer); try { speechSynthesis.cancel(); } catch (e) {} } }
  else if (a === 'rnext' || a === 'rprev') { R.idx = (R.idx + (a === 'rnext' ? 1 : R.ids.length - 1)) % R.ids.length; R.step = 0; if (R.playing) radioPlay(); }
  else if (a === 'rde') { R.de = !R.de; keep(); }
  else if (a === 'rshow') { R.show = !R.show; keep(); }
  else if (a === 'rslow') { R.slow = !R.slow; keep(); }
  render();
}
function viewRadio(){
  const R = S.radio;
  if (!R) return backBar('Hörrunde') + '<p class="lead">Die Hörrunde ist beendet.</p>';
  const item = itemById(R.ids[R.idx]), lang = R.lang;
  const sw = (a, on, t, d) => `<button type="button" class="row toggle" role="switch" aria-checked="${on}" data-a="${a}"><span class="txt"><span class="rt">${t}</span>${d ? `<span class="rd">${d}</span>` : ''}</span><span class="sw" aria-hidden="true"></span></button>`;
  const steps = RADIO_STEPS.map((s, k) => (k === 1 && !R.de ? '' : `<span class="rstep${k === R.step ? ' on' : k < R.step ? ' done' : ''}">${s}</span>`)).join('');
  return backBar('Hörrunde') + `
    <p class="hint mt0">Satz ${R.idx + 1} von ${R.ids.length}${R.heard ? `, ${R.heard} gehört` : ''}. Läuft von allein weiter, der Bildschirm bleibt dabei an.</p>
    <section class="radio-card" aria-live="polite">
      <div class="rsteps">${steps}</div>
      ${R.show ? `<p class="radio-t" lang="${lang}">${hangLead(esc(item.target))}</p><p class="radio-de">${esc(item.de || '')}</p>` : '<p class="radio-t radio-hidden">Nur hören</p>'}
    </section>
    <div class="rows mt-16">${sw('rde', R.de, 'Deutsch dazwischen', 'Erst der Satz, dann die Bedeutung')}${sw('rshow', R.show, 'Text zeigen', 'Aus: reines Hörverstehen')}${sw('rslow', R.slow, 'Erstes Mal langsamer')}</div>
    <div class="actionbar reader-bar"><div class="in">
      <button type="button" class="pbtn" data-a="rprev" aria-label="Vorheriger Satz">${PICO.prev}</button>
      <button type="button" class="pbtn play wide" data-a="rplay">${R.playing ? PICO.pause + '<span>Pause</span>' : PICO.play + '<span>Weiter</span>'}</button>
      <button type="button" class="pbtn" data-a="rnext" aria-label="Nächster Satz">${PICO.next}</button>
    </div></div>`;
}
