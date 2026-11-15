// Hördiktat: Der Satz wird beim Erscheinen einmal abgespielt, ohne Antippen von „Abspielen“.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Hördiktat spielt den Satz von selbst, auch nach „Weiter“', async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    const fake = { speak:u => window.__spoken.push(u.text), cancel(){}, getVoices:() => [{ lang:'sv-SE', name:'sv' }, { lang:'es-ES', name:'es' }], onvoiceschanged:null };
    Object.defineProperty(window, 'speechSynthesis', { value:fake, configurable:true });
    window.SpeechSynthesisUtterance = function(t){ this.text = t; };
  });
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=dict]');
  await expect(page.locator('textarea#answer')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBe(1);
  await page.fill('#answer', 'zzz');
  await page.click('[data-a=check]');
  await expect(page.locator('#fb')).toBeVisible();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.__spoken.length)).toBe(1);
  await page.click('[data-a=next]');
  await expect.poll(() => page.evaluate(() => window.__spoken.length)).toBe(2);
  await page.click('[data-a=play] >> nth=0');
  expect(await page.evaluate(() => window.__spoken.length)).toBe(3);
});
test('Knopfleiste steht unten im Bild, ohne feste Positionierung', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  const bar = await page.$eval('.actionbar', el => { const r = el.getBoundingClientRect(); return { pos:getComputedStyle(el).position, bottom:Math.round(r.bottom), vh:innerHeight }; });
  expect(bar.pos).toBe('sticky');
  expect(Math.abs(bar.bottom - bar.vh)).toBeLessThanOrEqual(1);
});
