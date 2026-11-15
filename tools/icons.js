#!/usr/bin/env node
// Erzeugt die App-Symbole aus einem Entwurf in design/icons/.
// Aufruf: node tools/icons.js [name]   (ohne Name: der Entwurf in design/icons/AKTIV)
//   public/icon-192.png, icon-512.png   rund, Ecken durchsichtig (purpose "any"): sieht ohne Maske aus wie die anderen runden Symbole
//   public/icon-maskable-512.png        randlos (purpose "maskable"): Android schneidet die Form selbst zu
// Eigenes Chromium: CHROMIUM_PATH=/pfad/zu/chrome node tools/icons.js
const fs = require('fs'), path = require('path');
const { chromium } = require('@playwright/test');
const ROOT = path.join(__dirname, '..'), DIR = path.join(ROOT, 'design', 'icons'), OUT = path.join(ROOT, 'public');
const name = process.argv[2] || fs.readFileSync(path.join(DIR, 'AKTIV'), 'utf8').trim();
const file = path.join(DIR, name + '.svg');
if (!fs.existsSync(file)) {
  console.error(`Entwurf „${name}“ fehlt. Vorhanden: ` + fs.readdirSync(DIR).filter(f => f.endsWith('.svg')).map(f => f.slice(0, -4)).join(', '));
  process.exit(1);
}
const svg = fs.readFileSync(file, 'utf8');
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH } : {});
  const render = async (size, round, out) => {
    const page = await browser.newPage({ viewport:{ width:size, height:size }, deviceScaleFactor:1 });
    await page.setContent(`<html><body style="margin:0;background:transparent"><div style="width:${size}px;height:${size}px;${round ? 'border-radius:50%;overflow:hidden' : ''}">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</div></body></html>`);
    await page.screenshot({ path:path.join(OUT, out), omitBackground:true });
    await page.close();
    console.log('public/' + out);
  };
  await render(192, true, 'icon-192.png');
  await render(512, true, 'icon-512.png');
  await render(512, false, 'icon-maskable-512.png');
  await browser.close();
  fs.writeFileSync(path.join(DIR, 'AKTIV'), name + '\n');
})();
