// Hörrunde: spielt Satz, Deutsch, Satz langsam und geht von selbst weiter; Pause hält an; Verlassen beendet den Ton.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Hörrunde läuft ohne Antippen und lässt sich steuern', async ({ page }) => {
  await page.addInitScript(() => {
    window.__said = []; let current = null;
    const fake = {
      speak(u){ window.__said.push({ t:u.text, lang:u.lang, rate:u.rate }); current = u; setTimeout(() => { if (current === u && u.onend) u.onend(); }, 30); },
      cancel(){ window.__cancel = (window.__cancel || 0) + 1; current = null; },
      getVoices:() => [{ lang:'sv-SE' }, { lang:'es-ES' }, { lang:'de-DE' }], onvoiceschanged:null
    };
    Object.defineProperty(window, 'speechSynthesis', { value:fake, configurable:true });
    window.SpeechSynthesisUtterance = function(t){ this.text = t; };
  });
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=radio]');
  await expect(page.locator('.radio-card')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__said.length), { timeout:8000 }).toBeGreaterThanOrEqual(4);
  const said = await page.evaluate(() => window.__said);
  expect(said[0].lang).toBe('sv-SE');
  expect(said[1].lang).toBe('de-DE');
  expect(said[2].lang).toBe('sv-SE');
  expect(said[2].t).toBe(said[0].t);
  expect(said[2].rate).toBeLessThan(said[0].rate);
  expect(said[3].t).not.toBe(said[0].t);
  // Pause: es kommt nichts mehr
  await page.click('[data-a=rplay]');
  const n = await page.evaluate(() => window.__said.length);
  await page.waitForTimeout(2500);
  expect(await page.evaluate(() => window.__said.length)).toBe(n);
  // Deutsch abschalten, weiter: nur noch Schwedisch
  await page.click('[data-a=rde]');
  await page.click('[data-a=rplay]');
  await expect.poll(() => page.evaluate(n0 => window.__said.length - n0, n), { timeout:8000 }).toBeGreaterThanOrEqual(3);
  const after = (await page.evaluate(() => window.__said)).slice(n);
  expect(after.every(x => x.lang === 'sv-SE')).toBe(true);
  // Zurück: Ton aus, keine weiteren Sätze
  await page.click('.backbar [data-a=tab]');
  const m = await page.evaluate(() => window.__said.length);
  await page.waitForTimeout(2500);
  expect(await page.evaluate(() => window.__said.length)).toBe(m);
});
