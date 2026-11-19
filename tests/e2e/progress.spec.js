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
test('Fehlerquellen, Reiter „Sätze“: hartnäckige Sätze in beiden Sprachen, volle Zeilenbreite, Tipp öffnet die Regel', async ({ page }) => {
  for (const lang of ['sv', 'es']) {
    const db = richDB(lang);
    // Zwei Sätze bei Wiederholungen mehrfach nicht gewusst und noch nicht gefestigt
    Object.keys(db.st).slice(1, 3).forEach((id, k) => Object.assign(db.st[id], { bad:3 - k, lapses:3 - k, ivl:6, d:8 }));
    const p = await page.context().newPage();
    await seed(p, db);
    await p.goto(APP);
    await p.click('[data-a=tab][data-v=progress]');
    await p.click(`[data-a=ptab][data-t=${lang}]`);
    await expect(p.locator('[data-a=hard]')).toHaveCount(0);
    await p.click('[data-a=errtab][data-t=s]');
    const rows = p.locator('.erows .srow');
    await expect(rows).toHaveCount(2);
    await expect(rows.first().locator('.ev')).toHaveText('3×');
    const g = await rows.first().evaluate(r => ({ row:r.getBoundingClientRect().width, txt:r.querySelector('.el').getBoundingClientRect().width }));
    expect(g.txt).toBeGreaterThan(g.row * 0.7);
    await p.click('button.srow >> nth=0');
    await expect(p.locator('.pop .pop-h')).toBeVisible();
    await p.close();
  }
});

test('Themenblatt „werden“: Übersicht mit fünf Verben, Hauptknopf ohne Scrollen sichtbar', async ({ page }) => {
  await seed(page, richDB('es'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  await page.click('[data-a=ptab][data-t=es]');
  await page.click('.tgrid [data-t=cambio]');
  await expect(page.locator('.pop .ttab .tt-r')).toHaveCount(5);
  await expect(page.locator('.pop [data-a=trapgo]')).toBeInViewport();
});
