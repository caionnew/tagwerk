#!/usr/bin/env node
// Sichtprüfung: Bildschirmfotos der Hauptansichten in Handygröße, hell und dunkel, nach sicht/.
// Mit --vs <Git-Stand> zusätzlich derselbe Rundgang mit dem älteren Stand und je Ansicht ein Bild „vorher | jetzt“
// in sicht/vergleich/. Die Ausgabe nennt, welche Bilder sich geändert haben.
//
//   node tools/sicht.js                         alle Ansichten, 390×844 und 411×923, hell und dunkel
//   node tools/sicht.js --vs origin/main        dazu Vergleich mit origin/main
//   node tools/sicht.js --nur heute,aufgabe     nur diese Ansichten
//   node tools/sicht.js --ganz                  ganze Seite statt nur Bildschirmhöhe
// Eigenes Chromium: CHROMIUM_PATH=/pfad/zu/chrome. Zufall ist im Browser festgelegt, damit beide Stände dasselbe zeigen.
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const { chromium } = require('@playwright/test');
const { richDB, answerWrong } = require('../tests/e2e/helpers.js');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'sicht');
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const VS = arg('--vs'), ONLY = arg('--nur'), FULL = process.argv.includes('--ganz');
const SIZES = [[390, 844], [411, 923]], SCHEMES = ['light', 'dark'];

const pad = n => String(n).padStart(2, '0'), now = new Date();
const TODAY = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const doneDB = () => { const db = richDB('sv'); db.done[TODAY] = true; db.doneLang = { [TODAY]:{ sv:true } }; db.log[TODAY] = { sv:{ n:31, ok:26, secs:742, fresh:5, rev:22, revOk:20, mat:2 } }; return db; };
const click = sel => p => p.click(sel);
const answerAll = async p => { for (let k = 0; k < 40 && await p.$('.runbar'); k++) { await answerWrong(p); await p.click('[data-a=next]'); } };
// Name, Lernstand, Schritte nach dem Start
const SCENES = [
  ['heute', richDB, []],
  ['heute-erledigt', doneDB, []],
  ['ueben', richDB, [click('[data-a=tab][data-v=extra]')]],
  ['fortschritt', richDB, [click('[data-a=tab][data-v=progress]')]],
  ['fortschritt-sprache', richDB, [click('[data-a=tab][data-v=progress]'), click('[data-a=ptab][data-t=sv]')]],
  ['aufgabe', richDB, [click('[data-a=daily]')]],
  ['aufgabe-falsch', richDB, [click('[data-a=daily]'), answerWrong]],
  ['rundenende', richDB, [click('[data-a=tab][data-v=extra]'), click('[data-a=quick]'), answerAll]],
  ['einstellungen', richDB, [click('[data-a=settings] >> nth=0')]],
  ['einstellungen-unten', richDB, [click('[data-a=settings] >> nth=0'), p => p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))]],
  ['lesen', richDB, [click('[data-a=tab][data-v=extra]'), click('[data-a=texts]')]]
].filter(([n]) => !ONLY || ONLY.split(',').includes(n));

// Fester Zufall (mulberry32), vor dem Laden der App gesetzt
const SEED_RANDOM = () => { let a = 20261116; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };

async function tour(browser, html, dir){
  fs.mkdirSync(dir, { recursive:true });
  const files = [];
  for (const [name, db, steps] of SCENES) for (const [w, h] of SIZES) for (const scheme of SCHEMES) {
    const file = path.join(dir, `${name}-${w}-${scheme === 'light' ? 'hell' : 'dunkel'}.png`);
    const ctx = await browser.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2, colorScheme:scheme, reducedMotion:'reduce' });
    await ctx.addInitScript(SEED_RANDOM);
    await ctx.addInitScript(v => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', '1'); localStorage.setItem('tagwerk-offline-v1', v); } }, JSON.stringify(db()));
    const page = await ctx.newPage();
    try {
      await page.goto('file://' + html);
      for (const s of steps) await s(page);
      await page.waitForTimeout(300);
      await page.screenshot({ path:file, fullPage:FULL });
      files.push(file);
    } catch (e) { console.log(`  ${path.basename(file)}: nicht möglich (${e.message.split('\n')[0]})`); }
    await ctx.close();
  }
  return files;
}

// Älteren Stand in einem eigenen Arbeitsbaum bauen, ohne den aktuellen anzufassen
function buildRef(ref){
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tagwerk-vs-'));
  execFileSync('git', ['worktree', 'add', '--detach', '-q', tmp, ref], { cwd:ROOT });
  try { execFileSync('node', ['tools/build.js'], { cwd:tmp, env:{ ...process.env, OUT_DIR:'dist' }, stdio:'ignore' }); fs.cpSync(path.join(tmp, 'dist'), path.join(OUT, '.vs-dist'), { recursive:true }); }
  finally { execFileSync('git', ['worktree', 'remove', '--force', tmp], { cwd:ROOT }); }
  return path.join(OUT, '.vs-dist', 'index.html');
}

async function compare(browser, a, b, out, label){
  const img = f => fs.existsSync(f) ? `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}">` : '<div class="miss">fehlt</div>';
  const page = await browser.newPage({ viewport:{ width:400, height:300 } });
  await page.setContent(`<style>body{margin:0;background:#888;font:600 22px system-ui;display:flex;gap:16px;padding:12px}figure{margin:0}figcaption{color:#fff;padding:0 0 8px}img{display:block;width:${SIZES[0][0] * 2}px}.miss{width:780px;height:200px;color:#fff}</style>
    <figure><figcaption>vorher (${label})</figcaption>${img(a)}</figure><figure><figcaption>jetzt</figcaption>${img(b)}</figure>`);
  await page.screenshot({ path:out, fullPage:true });
  await page.close();
}

(async () => {
  execFileSync('node', ['tools/build.js'], { cwd:ROOT, stdio:'ignore' });
  fs.rmSync(OUT, { recursive:true, force:true });
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH } : {});
  const now = await tour(browser, path.join(ROOT, 'dist', 'index.html'), OUT);
  console.log(`${now.length} Bilder in sicht/`);
  if (VS) {
    const before = await tour(browser, buildRef(VS), path.join(OUT, 'vorher'));
    const changed = [];
    for (const f of now) {
      const old = path.join(OUT, 'vorher', path.basename(f));
      if (fs.existsSync(old) && fs.readFileSync(old).equals(fs.readFileSync(f))) continue;
      changed.push(path.basename(f));
      await compare(browser, old, f, path.join(OUT, 'vergleich', path.basename(f)), VS);
    }
    fs.rmSync(path.join(OUT, '.vs-dist'), { recursive:true, force:true });
    console.log(before.length ? (changed.length ? `Geändert gegenüber ${VS} (${changed.length}), Vergleich in sicht/vergleich/:\n  ${changed.join('\n  ')}` : `Keine Änderung gegenüber ${VS}.`) : `Vergleich mit ${VS} nicht möglich.`);
  }
  await browser.close();
})();
