// Reihen (24.97.0) im Browser, mit der Testreihe aus tests/fixtures/reihe.js: Sie wird beim Laden vor die Reihen der App gesetzt. Weg: Karte, Übersicht, Teil 1 lesen, Fragen, weiter mit Teil 2, zurück, Teil 1 noch einmal; Fortsetzung auf „Heute“.
const { test, expect, APP, seed, freshDB, stored } = require('./helpers');
const FIX = require('../fixtures/reihe.js');
const pad = n => String(n).padStart(2, '0');
const day = k => { const t = new Date(), d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const inject = page => page.route(APP, async r => {
  const res = await r.fetch(), html = await res.text(), start = 'const SERIES = {\nsv:[\n';
  if (!html.includes(start)) throw new Error('Anfang von SERIES nicht gefunden');
  await r.fulfill({ response:res, body:html.replace(start, `${start}${JSON.stringify(FIX)},\n`) });
});
test('Reihe: Karte, Übersicht ohne Vorgriff, Teil 1 mit Fragen, weiter mit Teil 2, gelesener Teil noch einmal', async ({ page }) => {
  await inject(page);
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await expect(page.locator('.scard[data-s=test] .scta')).toHaveText('Beginnen ›');
  await page.click('.scard[data-s=test]');
  await expect(page.locator('.srail .mr.next .mr-t').first()).toHaveText('Teil 2');
  await expect(page.locator('.srail')).not.toContainText('Natten');
  await page.click('.actionbar [data-a=spart]');
  await expect(page.locator('.rtitle')).toHaveText('Fredag kväll');
  await expect(page.locator('.rdate')).toHaveText('Stockholm, fredag 28 februari 1986');
  await expect(page.locator('.sbisher')).toHaveCount(0);
  await page.click('[data-a=tquiz]');
  for (const [, opts] of FIX.parts[0].q) {
    await page.click(`.tq-b:text-is("${opts[0]}")`);
    await page.click('[data-a=tqnext]');
  }
  await expect(page.locator('.snext-h')).toHaveText('Natten');
  await page.click('[data-a=snext]');
  await expect(page.locator('.rtitle')).toHaveText('Natten');
  await expect(page.locator('.sbisher-k')).toHaveText('Bisher');
  await page.click('.backbar [data-a=tab]');
  await expect(page.locator('.srail .mr.done .mr-b')).toHaveAttribute('aria-label', /noch einmal lesen/);
  await expect(page.locator('.srail .mr.now .mr-t')).toHaveText('Natten');
  await page.click('.srail .mr.done .mr-b');
  await expect(page.locator('.rtitle')).toHaveText('Fredag kväll');
  await page.waitForTimeout(300);
  const db = await stored(page);
  expect(db.used.texts['sv:test-1'].best).toBe(3);
  expect(db.used.texts['sv:test-2']).toBeUndefined(); // nur geöffnet, nicht zu den Fragen gegangen
});
test('Heute: Fortsetzung der offenen Reihe statt Fundstück, „Weiterlesen“ öffnet den nächsten Teil', async ({ page }) => {
  await inject(page);
  const db = freshDB('sv'); db.used = db.used || {}; db.used.texts = { 'sv:test-1':{ best:2, n:1, last:day(1) } };
  await seed(page, db);
  await page.goto(APP);
  await expect(page.locator('.scont .find-k')).toHaveText('Fortsetzung · Natten på Sveavägen · Teil 2 von 3');
  await page.click('.scont [data-a=spart]');
  await expect(page.locator('.rtitle')).toHaveText('Natten');
  await expect(page.locator('.backbar .vt')).toHaveText('Natten på Sveavägen');
});
