// Gemeinsame Hilfen für die Browser-Tests: App-Adresse, Startprofile, Fehlererfassung, Aufgaben beantworten.
const path = require('path'), fs = require('fs');
const base = require('@playwright/test');
const APP = 'http://127.0.0.1:4173/'; // tools/serve.js, gestartet von playwright.config.js
const KEY = 'tagwerk-offline-v1';
// Gleiche Kennung wie in der App: Sprache + djb2-Hash des Zielsatzes
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };
function bankItems(lang, n){
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'data', 'content.js'), 'utf8');
  const part = lang === 'sv' ? src.slice(0, src.indexOf('es: {')) : src.slice(src.indexOf('es: {'));
  return part.split('\n').map(l => l.split('|').map(x => x.trim())).filter(p => p.length >= 5 && !p[0].startsWith('/*')).map(p => ({ id:`${lang}:${hash(p[1])}`, target:p[1] })).slice(0, n);
}
const bankIds = (lang, n) => bankItems(lang, n).map(x => x.id);
const freshDB = lang => ({ v:3, settings:{ size:'normal', lang, refill:false }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null, used:{ intro:true, lookup:true } });
// Sechs Wochen Nutzung: Übungstage, Lernzeit, Fehlerquellen, Uhrzeiten, 90 geübte Sätze
function richDB(lang){
  const pad = n => String(n).padStart(2, '0'), t = new Date();
  const ds = k => { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const db = freshDB(lang); db.tlog = {};
  for (let k = 40; k >= 1; k--) {
    if (k % 6 === 0) continue;
    db.done[ds(k)] = true; db.log[ds(k)] = { [lang]:{ n:14, secs:420 + (k % 5) * 60, fresh:k % 3 ? 2 : 0, mat:k % 4 ? 0 : 1 } };
    db.tlog[ds(k)] = { h:{ [k % 3 ? 7 : 21]:10 }, [lang]:{ 'p:inversion':[3, k % 2], 'p:bisats':[3, k % 3 ? 1 : 0], 'p:species':[2, k % 2], 'p:tempus':[2, 0], 't:free':[4, k % 2], 't:tiles':[4, 0], 't:gap':[3, k % 4 ? 0 : 1], 'e:order':k % 2, 'e:word':k % 3 ? 0 : 1, 'e:spell':k % 7 ? 0 : 1 } };
  }
  bankIds(lang, 90).forEach((id, i) => { db.st[id] = { s:10 + i, d:4, ivl:i % 3 === 0 ? 30 : 6, last:ds(2), due:ds(-3), reps:3, ok:3, bad:0, alts:[] }; });
  return db;
}
// Zehn Wochen Protokoll: dieselben Muster wie richDB, nur weiter zurück, damit die Veränderungspfeile erscheinen (ab acht Wochen);
// die Adjektivendungen mit zwei von drei falsch, also klar über dem Schnitt (rot hinterlegt)
function longDB(lang){
  const db = richDB(lang), pad = n => String(n).padStart(2, '0'), t = new Date();
  const ds = k => { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  for (let k = 70; k > 40; k--) db.tlog[ds(k)] = { [lang]:{ 'p:inversion':[3, k % 3 ? 1 : 2], 'p:bisats':[3, k % 3 ? 1 : 0], 'p:species':[2, k % 2], 'p:tempus':[2, 0], 't:free':[4, k % 2], 't:tiles':[4, 0], 't:gap':[3, k % 4 ? 0 : 1] } };
  Object.values(db.tlog).forEach(d => { d[lang]['p:species'] = [3, 2]; });
  // Schwedisch: acht weitere Themen mit fester Zufallsfolge, einige besser, einige schlechter (Quote vor → nach dem Wechsel vor 5 Wochen)
  if (lang === 'sv') {
    let a = 7; const rnd = () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
    const T = { tid:[0.15, 0.3], prep:[0.32, 0.12], partikel:[0.12, 0.12], modal:[0.2, 0.2], framtid:[0.28, 0.08], sin:[0.1, 0.1], plural:[0.18, 0.26], passiv:[0.2, 0.2] };
    for (let k = 70; k >= 1; k--) { const d = db.tlog[ds(k)]; if (!d) continue;
      Object.entries(T).forEach(([id, [r0, r1]]) => { const n = 1 + (rnd() < 0.4 ? 1 : 0), r = k > 35 ? r0 : r1; let bad = 0; for (let j = 0; j < n; j++) if (rnd() < r) bad++; d[lang]['p:' + id] = [n, bad]; }); }
  }
  return db;
}
// Sätze eines Themas aus der Satzbank (Deutsch, Ziel, Lücke), fürs gezielte Beantworten in Sichtprüfung und Tests
function topicItems(lang, trap){
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'data', 'content.js'), 'utf8');
  const part = lang === 'sv' ? src.slice(0, src.indexOf('es: {')) : src.slice(src.indexOf('es: {'));
  const i = part.indexOf(`\n${trap}: \``), body = part.slice(i + trap.length + 4, part.indexOf('`', i + trap.length + 4));
  return body.split('\n').map(l => l.split('|').map(x => x.trim())).filter(p => p.length >= 5).map(p => ({ id:`${lang}:${hash(p[1])}`, de:p[0], target:p[1], gap:p[2].split('/')[0].trim() }));
}
// Wechsel bei „klar über Schnitt“ am Tagwerk-Ende (24.78): Gestern war out klar über deinem Schnitt, inn knapp darunter. Fällig sind
// je fünf Sätze aus beiden, frei zu übersetzen (zwei Tage überfällig, damit die Grenze je Thema nicht greift). Wer out richtig und
// inn falsch beantwortet, sieht out herausfallen und inn dazukommen; das Tagwerk ist kurz, damit wenig anderes dazwischenkommt.
function klarDB(lang, out, inn){
  const db = richDB(lang), pad = n => String(n).padStart(2, '0'), t = new Date();
  const ds = k => { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  // Vorher: out 86 % über dem Schnitt (bleibt durch die Hysterese), inn 76 %; danach 37 und 94 % (gerechnet mit dem Modell)
  Object.keys(db.tlog).forEach((d, k) => { db.tlog[d][lang]['p:' + out] = [3, 1]; db.tlog[d][lang]['p:' + inn] = [2, k % 3 ? 1 : 0]; });
  db.settings.size = 'kurz';
  db.st = {};
  [out, inn].forEach(trap => topicItems(lang, trap).slice(0, 5).forEach((it, i) => { db.st[it.id] = { s:4 + i, d:5, ivl:4, last:ds(6), due:ds(2), reps:3, ok:3, bad:0, alts:[] }; }));
  db.clear = { [lang]:{ day:ds(1), prev:[out], cur:[out] } };
  return db;
}
// Fester Zufall im Browser (mulberry32), vor dem Laden gesetzt: für Tests, deren Ablauf davon abhängt, welche Aufgaben ein
// Tagwerk bringt. Aufruf: page.addInitScript(fixedRandom, startwert)
const fixedRandom = seed => { let a = seed; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
// Beantwortet die Aufgaben einer Runde: Sätze aus right frei übersetzt richtig, alles andere falsch
async function answerOnly(page, right){
  for (let k = 0; k < 80 && await page.$('.runbar'); k++) {
    const de = await page.$('.ex .de') ? (await page.textContent('.ex .de')).trim() : '', it = right.find(x => x.de === de);
    if (it && await page.$('textarea#answer, input#answer')) { await page.fill('#answer', it.target); await page.click('[data-a=check]'); } else await answerWrong(page);
    await page.click('[data-a=next]');
  }
}
// Profil vor dem ersten Laden setzen (nur einmal pro Seite, damit Neuladen den Stand behält)
async function seed(page, db){
  await page.addInitScript(([k, v]) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem(k, v); } }, [KEY, JSON.stringify(db)]);
}
// Beantwortet die aktuelle Aufgabe absichtlich falsch oder unvollständig, egal welcher Typ
async function answerWrong(page){
  if (await page.$('.tiles-pool')) { while (await page.$('.tiles-pool .tile:not(.ghost)')) await page.click('.tiles-pool .tile:not(.ghost)'); await page.click('[data-a=check]'); }
  else if (await page.$('#answer')) { await page.fill('#answer', 'zzz qqq'); await page.click('[data-a=check]'); }
  else if (await page.$('[data-a=spotpick]')) await page.click('[data-a=giveup]');
  else if (await page.$('[data-a=genuspick]')) await page.click('[data-a=genuspick] >> nth=0');
  else if (await page.$('[data-a=giveup]')) await page.click('[data-a=giveup]');
}
const stored = page => page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
// Sprachausgabe zum Testen: meldet Beginn, Wortgrenzen (alle 260 ms) und Ende wie eine echte Stimme, ohne Ton.
// Als Init-Skript einsetzen: page.addInitScript(fakeVoice)
function fakeVoice(){
  const voices = [{ lang:'sv-SE', name:'Test sv', default:true }, { lang:'es-ES', name:'Test es' }];
  window.SpeechSynthesisUtterance = class { constructor(t){ this.text = t; } };
  const ss = { cur:null, timers:[], getVoices:() => voices, addEventListener(){}, removeEventListener(){},
    cancel(){ this.timers.forEach(clearTimeout); this.timers = []; const u = this.cur; this.cur = null; if (u && u.onend) u.onend({}); },
    speak(u){
      this.cancel(); this.cur = u;
      const T = (f, ms) => this.timers.push(setTimeout(f, ms)), words = u.text.split(/\s+/);
      let pos = 0;
      T(() => u.onstart && u.onstart({}), 60);
      words.forEach((w, i) => { const ci = pos; pos += w.length + 1; T(() => u.onboundary && u.onboundary({ name:'word', charIndex:ci }), 80 + i * 260); });
      T(() => { this.cur = null; if (u.onend) u.onend({}); }, 80 + words.length * 260);
    } };
  Object.defineProperty(window, 'speechSynthesis', { value:ss, configurable:true });
}
// Sprachähnliches Testsignal als WAV (16 kHz, mono): Abschnitte ['s', Sekunden] Stille oder ['v', Sekunden] Stimme
function speechWav(file, parts, gain = 0.4){
  const sr = 16000, s = [];
  let ph = 0, seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 * 2 - 1; };
  for (const [kind, dur] of parts) for (let i = 0; i < dur * sr; i++) {
    const t = i / sr; let v = 0.002 * rnd();
    if (kind === 'v') { ph += 2 * Math.PI * (140 + 30 * Math.sin(t * 3)) / sr; v = (0.55 + 0.45 * Math.sin(2 * Math.PI * 4.5 * t)) * (0.45 * Math.sin(ph) + 0.25 * Math.sin(3 * ph) + 0.08 * rnd()); }
    s.push(Math.max(-1, Math.min(1, v * gain)));
  }
  const b = Buffer.alloc(44 + s.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + s.length * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(s.length * 2, 40);
  s.forEach((v, i) => b.writeInt16LE(Math.round(v * 32767), 44 + i * 2));
  fs.writeFileSync(file, b);
  return file;
}
// Chromium mit vorgetäuschtem Mikrofon, das die WAV-Datei einmal abspielt
const fakeMicArgs = wav => ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${wav}%noloop`];
// Jeder Test schlägt fehl, wenn die Seite einen JavaScript-Fehler wirft
const test = base.test.extend({
  page:async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await use(page);
    base.expect(errors, 'JavaScript-Fehler auf der Seite').toEqual([]);
  }
});
module.exports = { test, expect:base.expect, APP, seed, freshDB, richDB, longDB, klarDB, topicItems, fixedRandom, answerOnly, answerWrong, stored, bankIds, bankItems, hash, fakeVoice, speechWav, fakeMicArgs };
