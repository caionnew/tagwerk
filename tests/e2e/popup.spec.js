// Fenster nach unten wegziehen (24.91.0): Das Fenster folgt dem Finger und schließt ab 80 px; ein kurzer Zug federt zurück.
// Solange es folgt, ist die Bewegung abgefangen (kein Neuladen durch Herunterziehen), und die Seite darunter scrollt nicht mit.
const { test, expect, APP, seed, richDB } = require('./helpers');
test.use({ hasTouch:true });
// Touch-Ereignisse selbst erzeugen geht verlässlich nur in Chromium (Firefox auf dem Desktop kennt TouchEvent nicht immer)
test.skip(({ browserName }) => browserName !== 'chromium', 'Touch-Ereignisse nur in Chromium');

// Ein Finger, von y0 in acht Schritten zu je 25 ms nach y1 (Touch-Ereignisse wie auf dem Handy; Playwright kann von sich aus nur
// tippen). Die Pausen zählen: Ein schneller Wisch schließt auch unter 80 px.
const touchAt = (page, sel, type, y) => page.evaluate(([sel, type, y]) => {
  const el = document.querySelector(sel), r = el.getBoundingClientRect();
  const t = new Touch({ identifier:1, target:el, clientX:r.left + r.width / 2, clientY:y });
  const ev = new TouchEvent(type, { touches:type === 'touchend' ? [] : [t], changedTouches:[t], bubbles:true, cancelable:true });
  el.dispatchEvent(ev);
  return { blocked:ev.defaultPrevented, moved:el.style.transform };
}, [sel, type, y]);
async function swipe(page, sel, y0, y1){
  await touchAt(page, sel, 'touchstart', y0);
  let blocked = false, moved = '';
  for (let k = 1; k <= 8; k++) { await page.waitForTimeout(25); const m = await touchAt(page, sel, 'touchmove', y0 + (y1 - y0) * k / 8); blocked = blocked || m.blocked; moved = m.moved; }
  await touchAt(page, sel, 'touchend', y1);
  return { blocked, moved };
}

test('Wörterbuch-Fenster: kurzer Zug federt zurück, langer schließt; Herunterziehen der Seite ist dabei abgefangen', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('.hello-g [data-a=lookup] >> nth=0');
  await expect(page.locator('.pop')).toBeVisible();
  const box = await page.locator('.pop').boundingBox();
  // 40 px: bleibt offen, rückt zurück
  const a = await swipe(page, '.pop', box.y + 20, box.y + 60);
  expect(a.blocked).toBe(true);
  expect(a.moved).toMatch(/translateY\(\d+(\.\d+)?px\)/);
  await page.waitForTimeout(300);
  await expect(page.locator('.pop')).toBeVisible();
  expect(await page.locator('.pop').evaluate(el => el.style.transform)).toBe('');
  // 160 px: schließt
  await swipe(page, '.pop', box.y + 20, box.y + 180);
  await expect(page.locator('.pop')).toHaveCount(0);
  // Nach oben wischen tut nichts (dort wird gescrollt)
  await page.click('.hello-g [data-a=lookup] >> nth=0');
  const up = await swipe(page, '.pop', box.y + 120, box.y + 20);
  expect(up.blocked).toBe(false);
  await expect(page.locator('.pop')).toBeVisible();
  // Bei offenem Fenster kein Überscrollen der Seite
  expect(await page.evaluate(() => getComputedStyle(document.body).overscrollBehaviorY)).toBe('none');
});
