// Fortschritt mit sechs Wochen Daten: Kalender, Etappen, Kennzahlen, Themenraster, Fehlerquellen; dazu „Fehlerquellen“ auf Heute und „Thema üben“.
const { test, expect, APP, seed, richDB } = require('./helpers');
test('Überblick: Kalender beginnt bei heute, Tageszeit und Etappen', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  const sc = await page.$eval('#calscroll', e => ({ left:Math.round(e.scrollLeft), max:e.scrollWidth - e.clientWidth }));
  expect(Math.abs(sc.left - sc.max)).toBeLessThanOrEqual(1);
  // Tageszeit als eigene Karte: die Verteilung über den Tag, dazu der Satz mit den häufigsten Stunden
  await expect(page.locator('svg.hours')).toBeVisible();
  await expect(page.locator('h2.grp', { hasText:'Wann du übst' })).toHaveCount(1);
  // Erstes Jahr: kein „Jahr für Jahr“, die Kopfkarte hat dieselben Zahlen
  await expect(page.locator('h2.grp', { hasText:'Jahr für Jahr' })).toHaveCount(0);
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
  for (const t of ['t', 'e', 'p']) { await page.click(`[data-a=errtab][data-t=${t}]`); expect(await page.locator('.erows .mrow').count()).toBeGreaterThan(0); }
  // Reiter „Thema“: Streifen mit Schätzung und Achse; Tipp auf ein Thema öffnet das Themenblatt mit der Schätzung
  await expect(page.locator('.erows .mstrip').first()).toBeVisible();
  await expect(page.locator('.erows .maxis')).toHaveCount(1);
  await page.click('button.mrow >> nth=0');
  await expect(page.locator('.pop .pop-h')).toBeVisible();
  await expect(page.locator('.pop')).toContainText('Fehlerquote geschätzt');
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
test('Heute „Fehlerquellen“ mit Schätzung und Bereich; „Thema üben“ mit Schätzung, Fehlerquellen oben', async ({ page }) => {
  const db = richDB('sv'); db.gen = { np:{ ok:2, bad:1, recent:[1, 0, 1] }, textgap_sv:{ ok:9, bad:3, recent:[1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0] } };
  await seed(page, db);
  await page.goto(APP);
  await expect(page.locator('h2.grp', { hasText:'Fehlerquellen' })).toHaveCount(1);
  const weak = page.locator('.row.mrowh');
  expect(await weak.count()).toBeGreaterThanOrEqual(1);
  expect(await weak.count()).toBeLessThanOrEqual(3);
  await expect(weak.first()).toContainText('Adjektivendungen');
  await expect(weak.first().locator('.mpct')).toHaveText(/^\d+\u00a0%$/);
  // Punkt im Bereich, Bereich im Streifen; darunter die Legende mit „Schätzung“ zum Antippen
  const g = await weak.first().evaluate(r => { const b = e => r.querySelector(e).getBoundingClientRect(); const s = b('.mstrip'), w = b('.m95'), d = b('.mdot');
    return { s:[s.left, s.right], w:[w.left, w.right], d:(d.left + d.right) / 2 }; });
  expect(g.w[0]).toBeGreaterThanOrEqual(g.s[0] - 0.5); expect(g.w[1]).toBeLessThanOrEqual(g.s[1] + 0.5);
  expect(g.d).toBeGreaterThanOrEqual(g.w[0]); expect(g.d).toBeLessThanOrEqual(g.w[1]);
  await page.click('.mkey [data-a=term][data-k=schaetzung]');
  await expect(page.locator('.pop')).toContainText('Geschätzte Fehlerquote');
  await page.click('.pop [data-a=popclose] >> nth=-1');
  // Schwerpunkt als Begriff
  await page.click('.focusline [data-a=term][data-k=schwerpunkt]');
  await expect(page.locator('.pop .pop-h')).toHaveText('Schwerpunkt der Woche');
  await page.click('.pop [data-a=popclose] >> nth=-1');
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=pickTopic]');
  // Fehlerquellen als eigene Gruppe oben; erzeugte Themen ohne Balken und ohne Generator-Quote
  await expect(page.locator('h2.grp >> nth=0')).toHaveText('Fehlerquellen');
  const gen = page.locator('.rows >> nth=0').locator('.row.bars[data-t=species]');
  await expect(gen.locator('.rd')).toHaveText(/^geschätzt \d+\u00a0% falsch$/);
  await expect(gen.locator('.bar')).toHaveCount(0);
  await expect(page.locator('.row.bars[data-t=species]')).toHaveCount(1);
  await expect(page.locator('.row.bars[data-t=lesen] .bar')).toHaveCount(0);
  await expect(page.locator('.row.bars[data-t=lesen] .rd')).not.toContainText('richtig');
  await expect(page.locator('.row.bars[data-t=inversion] .bar')).toHaveCount(1);
  await expect(page.locator('.row.bars[data-t=inversion] .rd')).toHaveText(/^geschätzt \d+\u00a0% falsch · \d+ von \d+ Sätzen geübt/);
  await page.click('.grp-lead [data-a=term][data-k=schaetzung]');
  await expect(page.locator('.pop')).toContainText('Als Fehlerquelle gilt');
  await page.click('.pop [data-a=popclose] >> nth=-1');
  await page.click('.grp-lead [data-a=term][data-k=gefestigt]');
  await expect(page.locator('.pop .pop-h')).toBeVisible();
});
