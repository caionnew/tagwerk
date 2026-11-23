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
const { freshDB, richDB, answerWrong, fakeVoice, speechWav, fakeMicArgs } = require('../tests/e2e/helpers.js');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'sicht');
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const VS = arg('--vs'), ONLY = arg('--nur'), FULL = process.argv.includes('--ganz');
const SIZES = [[390, 844], [411, 923]], SCHEMES = ['light', 'dark'];

const pad = n => String(n).padStart(2, '0'), now = new Date();
const TODAY = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const rich = () => richDB('sv');
const doneDB = () => { const db = rich(); db.done[TODAY] = true; db.doneLang = { [TODAY]:{ sv:true } }; db.log[TODAY] = { sv:{ n:31, ok:26, secs:742, fresh:5, rev:22, revOk:20, mat:2 } }; return db; };
// Vorgetäuschtes Mikrofon (Testsignal mit einer Pause) und eine Test-Stimme, damit Nachsprechen überall gleich aussieht
const LAUNCH = { ...(process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH } : {}), args:fakeMicArgs(speechWav(path.join(os.tmpdir(), 'tagwerk-sicht-mikro.wav'), [['s', 0.5], ['v', 0.8], ['s', 0.6], ['v', 0.7], ['s', 5]])) };
const click = sel => p => p.click(sel);
// Erst wenn Schriften und Bilder stehen, sonst wächst die Seite nach dem Scrollen noch (Bild mal ganz unten, mal nicht)
const bottom = async p => {
  await p.evaluate(async () => { if (document.fonts) await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; }))); });
  await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
};
// Wikipedia-Fundstück ohne Netz: feste Antwort statt echter Abfrage
const WIKI_BODY = 'Allmänna skyddsrum i Stockholm byggdes under det kalla kriget för att skydda befolkningen. De flesta skyddsrummen ligger djupt under jorden och används i dag som garage eller förråd. Kommunen kontrollerar regelbundet att dörrarna fungerar och att ventilationen är intakt. Under en kris ska skyddsrummen kunna öppnas inom fyrtioåtta timmar. Många stockholmare vet inte var det närmaste skyddsrummet finns, trots att skyltarna sitter på husväggarna.';
const mockWiki = p => p.route('https://sv.wikipedia.org/w/api.php**', r => r.fulfill({ headers:{ 'Access-Control-Allow-Origin':'*' }, json:{ query:{ pages:[{ title:'Allmänna skyddsrum i Stockholm', extract:WIKI_BODY, fullurl:'https://sv.wikipedia.org/wiki/Skyddsrum' }] } } }));
const answerAll = async p => { for (let k = 0; k < 40 && await p.$('.runbar'); k++) { await answerWrong(p); await p.click('[data-a=next]'); } };
// Nomen tauschen: das typische Versehen, nur das Nomen ersetzt und den Rest stehen gelassen
const swapNaive = async p => { const src = await p.textContent('.ex .de'), a = await p.textContent('.ex .de b'), b = await p.textContent('.vocab .swapto'); await p.fill('#answer', src.trim().replace(a.trim(), b.trim())); await p.click('[data-a=check]'); };
const swapOpen = [click('[data-a=tab][data-v=extra]'), click('[data-a=forms]'), click('[data-a=gengo][data-g=det_es]')];
// Name, Lernstand, Schritte nach dem Start
const SCENES = [
  ['heute', rich, []],
  ['heute-erledigt', doneDB, []],
  ['ueben', rich, [click('[data-a=tab][data-v=extra]')]],
  ['fortschritt', rich, [click('[data-a=tab][data-v=progress]')]],
  ['fortschritt-sprache', rich, [click('[data-a=tab][data-v=progress]'), click('[data-a=ptab][data-t=sv]')]],
  ['aufgabe', rich, [click('[data-a=daily]')]],
  ['aufgabe-falsch', rich, [click('[data-a=daily]'), answerWrong]],
  ['nomen-tauschen', () => richDB('es'), swapOpen],
  ['nomen-tauschen-falsch', () => richDB('es'), [...swapOpen, swapNaive]],
  ['rundenende', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=quick]'), answerAll]],
  ['tagwerk-ende', rich, [click('[data-a=daily]'), answerAll, p => p.evaluate(() => { const g = document.querySelector('.grprow') || document.querySelector('.donebox h2'); if (g) g.scrollIntoView(); })]],
  // Tagwerk-Ende mit aufgeklapptem Thema: deine Antworten und die Lösungen
  ['tagwerk-thema', rich, [click('[data-a=daily]'), answerAll, click('.trow >> nth=0'), p => p.waitForTimeout(400)]],
  ['rundenende-unten', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=quick]'), answerAll, bottom]],
  ['bonus', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=quick]'), answerAll, click('[data-a=bonus]'), p => p.fill('#bonusText', 'Jag tycker att det är skönt att jobba hemma.'), click('[data-a=bonuscheck]'), p => p.evaluate(() => document.querySelector('.bonus').scrollIntoView({ block:'end' }))]],
  ['einstellungen', rich, [click('[data-a=settings] >> nth=0')]],
  ['einstellungen-unten', rich, [click('[data-a=settings] >> nth=0'), bottom]],
  ['fundstueck', rich, [mockWiki, click('[data-a=tab][data-v=extra]'), click('[data-a=wiki] >> nth=0'), bottom]],
  // Erst nach dem Vorlesen: sonst steht die Wortmarke mal hier, mal da
  ['nachsprechen', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=shadow]'), p => p.waitForFunction(() => !speechSynthesis.cur, null, { timeout:15000 })]],
  ['nachsprechen-ergebnis', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=shadow]'), click('.shstep[data-a=shrec]'), p => p.waitForSelector('.shtiles', { timeout:15000 })]],
  ['erster-start', () => freshDB('sv'), []],
  ['schreiben', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=write]')]],
  ['hoerrunde', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=radio]')]],
  ['diktat', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=dict]')]],
  ['grammatik', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=ref][data-r=topics]')]],
  ['land-und-leute', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=ref][data-r=kultur]')]],
  ['wort', rich, [click('.find [data-a=lookup] >> nth=1')]],
  ['thema', rich, [click('[data-a=tab][data-v=progress]'), click('[data-a=ptab][data-t=sv]'), click('[data-a=topic] >> nth=0')]],
  ['lesen', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=texts]')]],
  ['hoeren-antwort', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=texts]'), click('[data-a=tdefmode][data-v=listen]'), click('[data-a=textopen][data-id=vasa]'), click('[data-a=tquiz]'), click('[data-a=tpick][data-k="0"][data-i="0"]')]],
  ['lesen-ende', rich, [click('[data-a=tab][data-v=extra]'), click('[data-a=texts]'), click('[data-a=textopen][data-id=vasa]'), click('[data-a=tquiz]'),
    ...[0, 1, 2].flatMap(k => [click(`[data-a=tpick][data-k="${k}"][data-i="0"]`), click('[data-a=tqnext]')])]]
].filter(([n]) => !ONLY || ONLY.split(',').includes(n));

// Fester Zufall (mulberry32), vor dem Laden der App gesetzt
const SEED_RANDOM = () => { let a = 20261116; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };

async function tour(browser, html, dir, label){
  fs.mkdirSync(dir, { recursive:true });
  const files = [];
  for (const [name, db, steps] of SCENES) for (const [w, h] of SIZES) for (const scheme of SCHEMES) {
    const file = path.join(dir, `${name}-${w}-${scheme === 'light' ? 'hell' : 'dunkel'}.png`);
    const ctx = await browser.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2, colorScheme:scheme, reducedMotion:'reduce' });
    await ctx.addInitScript(SEED_RANDOM);
    await ctx.addInitScript(fakeVoice);
    await ctx.addInitScript(v => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', '1'); localStorage.setItem('tagwerk-offline-v1', v); } }, JSON.stringify(db()));
    const page = await ctx.newPage();
    page.setDefaultTimeout(5000);
    try {
      await page.goto('file://' + html);
      for (const s of steps) await s(page);
      await page.waitForTimeout(300);
      await page.screenshot({ path:file, fullPage:FULL });
      files.push(file);
    } catch (e) { console.log(`  ${label}: ${path.basename(file)} nicht möglich (${e.message.split('\n')[0]})`); }
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
  const browser = await chromium.launch(LAUNCH);
  const now = await tour(browser, path.join(ROOT, 'dist', 'index.html'), OUT, 'jetzt');
  console.log(`${now.length} Bilder in sicht/`);
  if (VS) {
    const before = await tour(browser, buildRef(VS), path.join(OUT, 'vorher'), `vorher (${VS})`);
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
