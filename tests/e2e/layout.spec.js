// Aufgabe oben, Antwort unten: Bei jeder Übungsart sitzt die Antwortzone in der unteren Bildhälfte, höchstens 30 % der
// Bildhöhe unter der Aufgabe (auf kleinen Handys direkt über der Leiste); nach dem Antworten steht die Rückmeldung
// zwischen Antwort und „Weiter“. Keine Übung schaltet von selbst weiter.
const { test, expect, APP, seed, freshDB, richDB, answerWrong } = require('./helpers');
const gap = page => page.evaluate(() => {
  const a = document.querySelector('.ex-a'), sp = document.querySelector('.ex-sp'), bar = document.querySelector('.actionbar');
  if (!a || !sp || !bar) return null;
  const ar = a.getBoundingClientRect(), toBar = Math.round(bar.getBoundingClientRect().top - ar.bottom);
  return { toBar, spacer:Math.round(sp.getBoundingClientRect().height), max:Math.round(innerHeight * 0.3), lowHalf:ar.bottom >= innerHeight * 0.45 };
});
test('Antwortzone über der Leiste bei allen Übungsarten eines Tagwerks', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  const seen = new Set();
  for (let k = 0; k < 40 && await page.$('.runbar'); k++) {
    const kind = await page.evaluate(() => (document.querySelector('.tiles-pool') && 'tiles') || (document.querySelector('.spot') && 'spot') || (document.querySelector('.genus-opts') && 'genus') || (document.querySelector('.cloze') && 'cloze') || (document.querySelector('textarea#answer') && 'text') || (document.querySelector('input#answer') && 'input') || 'andere');
    const g = await gap(page);
    expect(g, kind).not.toBeNull();
    expect(g.spacer, `${kind}: Abstand Aufgabe–Antwort`).toBeLessThanOrEqual(g.max + 1);
    expect(g.lowHalf, `${kind}: Antwort in der unteren Bildhälfte`).toBe(true);
    expect(g.toBar <= 24 || g.spacer >= g.max - 1, `${kind}: entweder direkt über der Leiste oder mit vollem Abstand`).toBe(true);
    seen.add(kind);
    await answerWrong(page);
    await expect(page.locator('#fb')).toBeVisible();
    const fb = await page.evaluate(() => { const f = document.querySelector('#fb').getBoundingClientRect(), a = document.querySelector('.ex-a').getBoundingClientRect(); return f.top >= a.bottom - 1; });
    expect(fb, `${kind}: Rückmeldung unter der Antwort`).toBe(true);
    await page.click('[data-a=next]');
  }
  expect(seen.size).toBeGreaterThanOrEqual(3);
});
test('Genus: auch nach richtiger Antwort erst mit „Weiter“, wie überall', async ({ page }) => {
  await seed(page, freshDB('es'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=form][data-g=genus_es]');
  for (const v of ['el', 'la']) {
    if (!(await page.$('[data-a=genuspick]:not([disabled])'))) break;
    await page.click(`[data-a=genuspick][data-v=${v}]`);
  }
  await page.waitForTimeout(1200);
  await expect(page.locator('#fb')).toBeVisible();
  await expect(page.locator('[data-a=next]')).toBeVisible();
});
// Feiertag (24.90.0): langer Gruß mit Zeichen bleibt auf schmalem Gerät in einer Zeile (fitGreeting misst in der Schrift des Geräts)
test('Kopf am Heiligabend auf 360 px: „¡Feliz Nochebuena!“ mit Stern in einer Zeile neben der Woche', async ({ page }) => {
  await page.setViewportSize({ width:360, height:780 });
  await page.clock.setFixedTime(new Date('2026-12-24T10:30:00'));
  const db = richDB('es'); db.settings.lang = 'es';
  await seed(page, db);
  await page.goto(APP);
  await expect(page.locator('.hello-g')).toHaveText('¡Feliz Nochebuena!');
  await expect(page.locator('.hello-g .orn-star')).toHaveCount(1);
  const m = await page.evaluate(() => { const g = document.querySelector('.hello-g'); return { h:g.getBoundingClientRect().height, lh:parseFloat(getComputedStyle(g).lineHeight), right:g.getBoundingClientRect().right, strip:document.querySelector('.weekstrip').getBoundingClientRect().left }; });
  expect(m.h).toBeLessThan(m.lh * 1.5);
  expect(m.right).toBeLessThanOrEqual(m.strip);
});
// Auch im Spanischen: Bis 24.88 traf die Regel für den deutschen Satz (.de) die Felder mit spanischem Tagwerk (wk de), die Woche stand
// dort 16 px über der Grundlinie des Grußes
for (const lang of ['sv', 'es']) test(`Kopf von „Heute“ (${lang}): zwei Zeilen mit gemeinsamen Grundlinien, rechte Kante bündig, Serie führt zum Kalender`, async ({ page }) => {
  const db = richDB(lang); db.settings.lang = lang;
  await seed(page, db);
  await page.goto(APP);
  const m = await page.evaluate(() => {
    const base = el => { const s = document.createElement('span'); s.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; el.appendChild(s); const y = s.getBoundingClientRect().top; s.remove(); return y; };
    const g = document.querySelector('.hello-g'), d = document.querySelector('.hello-d'), c = document.querySelector('.wkc');
    const sq = [...document.querySelectorAll('.weekstrip .wk i')], last = sq[sq.length - 1].getBoundingClientRect();
    const rg = document.createRange(); rg.selectNodeContents(c);
    return { greet:base(g), sqBottom:sq[0].getBoundingClientRect().bottom, sqSpread:Math.max(...sq.map(x => x.getBoundingClientRect().bottom)) - Math.min(...sq.map(x => x.getBoundingClientRect().bottom)), date:base(d), streak:base(c), fd:getComputedStyle(d).fontSize, fc:getComputedStyle(c).fontSize,
      outlineRight:last.right + 3, textRight:rg.getBoundingClientRect().right, gearRight:document.querySelector('.topline .iconbtn svg').getBoundingClientRect().right };
  });
  expect(Math.abs(m.sqBottom - m.greet)).toBeLessThan(1);
  expect(m.sqSpread).toBeLessThan(0.5);
  expect(Math.abs(m.streak - m.date)).toBeLessThan(1);
  expect(m.fc).toBe(m.fd);
  expect(Math.abs(m.outlineRight - m.textRight)).toBeLessThan(1.5);
  expect(Math.abs(m.gearRight - m.textRight)).toBeLessThan(1.5);
  await expect(page.locator('.wkc')).toHaveAttribute('aria-hidden', 'true');
  await page.click('.wkc');
  await expect(page.locator('.ptabs')).toBeVisible();
});
