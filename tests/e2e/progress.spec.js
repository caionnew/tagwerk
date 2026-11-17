// Fortschritt mit sechs Wochen Daten: Kalender, Etappen, Kennzahlen, Themenraster, Fehlerquellen.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Überblick: Kalender beginnt bei heute, Tageszeit und Etappen', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  const sc = await page.$eval('#calscroll', e => ({ left:Math.round(e.scrollLeft), max:e.scrollWidth - e.clientWidth }));
  expect(Math.abs(sc.left - sc.max)).toBeLessThanOrEqual(1);
  await expect(page.locator('svg.hours')).toBeVisible();
  await expect(page.locator('.wrail .wl').first()).toBeVisible();
  await expect(page.locator('.wrail .wl-next').first()).toBeVisible();
});
test('Sprachreiter: Kennzahlen, Themenraster und Fehlerquellen', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  await page.click('[data-a=ptab][data-t=sv]');
  await expect(page.locator('.kpis div')).toHaveCount(3);
  expect(await page.locator('.tgrid .tg').count()).toBeGreaterThanOrEqual(8);
  for (const t of ['t', 'e', 'p']) { await page.click(`[data-a=errtab][data-t=${t}]`); expect(await page.locator('.erows .erow').count()).toBeGreaterThan(0); }
  await page.click('button.erow >> nth=0');
  await expect(page.locator('.pop .pop-h')).toBeVisible();
});
test('Schwierigste Sätze: in beiden Sprachen gleich, Satz nutzt die volle Zeilenbreite', async ({ page }) => {
  for (const lang of ['sv', 'es']) {
    const db = richDB(lang);
    // Zwei Sätze mehrfach falsch und noch nicht gefestigt
    Object.keys(db.st).slice(1, 3).forEach(id => Object.assign(db.st[id], { bad:3, ivl:6, d:8 }));
    const p = await page.context().newPage();
    await seed(p, db);
    await p.goto(APP);
    await p.click('[data-a=tab][data-v=progress]');
    await p.click(`[data-a=ptab][data-t=${lang}]`);
    const rows = p.locator('.row.kv');
    await expect(rows).toHaveCount(2);
    const g = await rows.first().evaluate(r => { const t = r.querySelector('.txt').getBoundingClientRect(), v = r.querySelector('.val').getBoundingClientRect(), b = r.getBoundingClientRect(); return { row:b.width, txt:t.width, valRight:b.right - v.right }; });
    expect(g.txt).toBeGreaterThan(g.row * 0.5);
    expect(g.valRight).toBeLessThan(40);
    await expect(p.locator('[data-a=hard]')).toHaveText('Diese 2 Sätze üben');
    await p.close();
  }
});
