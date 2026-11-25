#!/usr/bin/env node
// Erzeugt Bildschirmfotos der Hauptansichten für die Dokumentation (docs/screenshots/).
// Aufruf: npm run build && node tools/screenshots.js   (eigenes Chromium: CHROMIUM_PATH=…)
const path = require('path'), fs = require('fs');
const { chromium } = require('@playwright/test');
const { richDB, longDB, freshDB } = require('../tests/e2e/helpers.js');
const APP = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const OUT = path.join(__dirname, '..', 'docs', 'screenshots');
(async () => {
  fs.mkdirSync(OUT, { recursive:true });
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH } : {});
  const shot = async (name, db, steps, scheme = 'dark') => {
    const ctx = await browser.newContext({ viewport:{ width:390, height:780 }, deviceScaleFactor:2, colorScheme:scheme });
    await ctx.addInitScript(v => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', '1'); localStorage.setItem('tagwerk-offline-v1', v); } }, JSON.stringify(db));
    const page = await ctx.newPage(); await page.goto(APP);
    for (const s of steps) await s(page);
    await page.waitForTimeout(400);
    await page.screenshot({ path:path.join(OUT, name + '.png') });
    await ctx.close(); console.log('docs/screenshots/' + name + '.png');
  };
  const click = sel => p => p.click(sel);
  await shot('heute', richDB('sv'), []);
  // Themenliste mit Veränderungspfeilen: zehn Wochen Protokoll (longDB), ein Thema klar über dem Schnitt
  await shot('fortschritt', longDB('sv'), [click('[data-a=tab][data-v=progress]'), click('[data-a=ptab][data-t=sv]'), p => p.evaluate(() => { const h = [...document.querySelectorAll('h2.grp')].find(x => x.textContent === 'Themen'); h.scrollIntoView({ block:'start' }); window.scrollBy(0, -8); })]);
  await shot('schreiben', richDB('sv'), [click('[data-a=tab][data-v=extra]'), click('[data-a=write]'), p => p.fill('#wtext', 'Idag jag jobbar hemma. Jag tycker att det är skönt eftersom jag slipper bussen. Igår har jag ätit lunch med en kollega. Hon säger att hon kommer inte på festen.'), click('[data-a=weval]'), p => p.evaluate(() => document.querySelector('.wprof').scrollIntoView())]);
  await shot('land-und-leute', freshDB('es'), [click('[data-a=tab][data-v=extra]'), click('[data-a=ref][data-r=kultur]'), p => p.evaluate(() => [...document.querySelectorAll('.kcard')].find(c => c.querySelector('svg.map')).scrollIntoView())], 'light');
  await browser.close();
})();
