// Gemeinsame Hilfen für die Browser-Tests: App-Adresse, Startprofile, Fehlererfassung, Aufgaben beantworten.
const path = require('path'), fs = require('fs');
const base = require('@playwright/test');
const APP = 'http://127.0.0.1:4173/'; // tools/serve.js, gestartet von playwright.config.js
const KEY = 'tagwerk-offline-v1';
// Gleiche Kennung wie in der App: Sprache + djb2-Hash des Zielsatzes
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };
function bankIds(lang, n){
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'data', 'content.js'), 'utf8');
  const part = lang === 'sv' ? src.slice(0, src.indexOf('es: {')) : src.slice(src.indexOf('es: {'));
  return part.split('\n').map(l => l.split('|').map(x => x.trim())).filter(p => p.length === 5 && !p[0].startsWith('/*')).map(p => `${lang}:${hash(p[1])}`).slice(0, n);
}
const freshDB = lang => ({ v:3, settings:{ size:'normal', lang, refill:false }, st:{}, own:{ sv:[], es:[] }, tat:{ sv:[], es:[] }, log:{}, done:{}, gen:{}, run:null, used:{ intro:true, lookup:true } });
// Sechs Wochen Nutzung: Übungstage, Lernzeit, Fehlerquellen, Uhrzeiten, 90 geübte Sätze
function richDB(lang){
  const pad = n => String(n).padStart(2, '0'), t = new Date();
  const ds = k => { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const db = freshDB(lang); db.tlog = {};
  for (let k = 40; k >= 1; k--) {
    if (k % 6 === 0) continue;
    db.done[ds(k)] = true; db.log[ds(k)] = { [lang]:{ n:14, secs:420 + (k % 5) * 60, fresh:k % 3 ? 2 : 0, mat:k % 4 ? 0 : 1 } };
    db.tlog[ds(k)] = { h:{ [k % 3 ? 7 : 21]:10 }, [lang]:{ 'p:inversion':[3, k % 2], 'p:bisats':[3, k % 3 ? 1 : 0], 't:free':[4, k % 2], 't:tiles':[4, 0], 't:gap':[3, k % 4 ? 0 : 1], 'e:order':k % 2, 'e:word':k % 3 ? 0 : 1, 'e:spell':k % 7 ? 0 : 1 } };
  }
  bankIds(lang, 90).forEach((id, i) => { db.st[id] = { s:10 + i, d:4, ivl:i % 3 === 0 ? 30 : 6, last:ds(2), due:ds(-3), reps:3, ok:3, bad:0, alts:[] }; });
  return db;
}
// Profil vor dem ersten Laden setzen (nur einmal pro Seite, damit Neuladen den Stand behält)
async function seed(page, db){
  await page.addInitScript(([k, v]) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem(k, v); } }, [KEY, JSON.stringify(db)]);
}
// Beantwortet die aktuelle Aufgabe absichtlich falsch oder unvollständig, egal welcher Typ
async function answerWrong(page){
  if (await page.$('.tiles-pool')) { while (await page.$('.tiles-pool .tile:not(.ghost)')) await page.click('.tiles-pool .tile:not(.ghost)'); await page.click('[data-a=check]'); }
  else if (await page.$('#answer')) { await page.fill('#answer', 'zzz qqq'); await page.click('[data-a=check]'); }
  else if (await page.$('[data-a=spotpick]')) { const o = await page.$$('[data-a=spotpick]'); await o[o.length - 1].click(); }
  else if (await page.$('[data-a=genuspick]')) await page.click('[data-a=genuspick] >> nth=0');
  else if (await page.$('[data-a=giveup]')) await page.click('[data-a=giveup]');
}
const stored = page => page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
// Jeder Test schlägt fehl, wenn die Seite einen JavaScript-Fehler wirft
const test = base.test.extend({
  page:async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await use(page);
    base.expect(errors, 'JavaScript-Fehler auf der Seite').toEqual([]);
  }
});
module.exports = { test, expect:base.expect, APP, seed, freshDB, richDB, answerWrong, stored, bankIds };
