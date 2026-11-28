// Verlauf im Sprach-Tab (24.106.0): Reiter, Antippen und Ziehen zeigt einen Tag, Pfeiltasten, Begriff Behaltensdauer.
const { test, expect, APP, seed, verlaufDB } = require('./helpers');

async function open(page){
  await seed(page, verlaufDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  await page.click('[data-a=ptab][data-t=sv]');
  const chart = page.locator('.pcchart');
  await chart.scrollIntoViewIfNeeded();
  return chart;
}

test('Verlauf: Ziehen zeigt einen früheren Tag mit Fadenkreuz, Verlassen springt auf heute zurück, Pfeiltasten gehen Punkt für Punkt', async ({ page }) => {
  const chart = await open(page);
  const svg = chart.locator('#pcsvg'), date = chart.locator('.pcdate'), first = chart.locator('[data-pv="0"]');
  await expect(chart.locator('[data-a=pctab]')).toHaveText(['Sätze', 'Wörter', 'Gedächtnis']);
  await expect(date).toHaveText('Heute');
  await expect(chart.locator('.pcx')).not.toHaveClass(/on/);
  const today = await first.textContent();
  const r = await svg.boundingBox();
  await page.mouse.move(r.x + r.width * 0.2, r.y + r.height / 2);
  await expect(date).not.toHaveText('Heute');
  await expect(chart.locator('.pcx')).toHaveClass(/on/);
  await expect(first).not.toHaveText(today);
  await page.mouse.move(r.x + r.width / 2, r.y - 60);
  await expect(date).toHaveText('Heute');
  await expect(first).toHaveText(today);
  await svg.focus();
  await page.keyboard.press('Home');
  const d0 = await date.textContent();
  expect(d0).toMatch(/^\d+\. \S+$/);
  await page.keyboard.press('ArrowRight');
  await expect(date).not.toHaveText(d0);
  await page.keyboard.press('End');
  await expect(date).toHaveText('Heute');
});

test('Verlauf: Wörter und Gedächtnis; Behaltensdauer erklärt sich auf Tipp', async ({ page }) => {
  const chart = await open(page);
  await chart.locator('[data-a=pctab][data-t=w]').click();
  await expect(chart.locator('[data-a=pctab][data-t=w]')).toHaveAttribute('aria-checked', 'true');
  await expect(chart.locator('.pcstat')).toContainText(/Wörter in 30 Tagen|Wörter seit/);
  await expect(chart.locator('.pcv span')).toHaveText(['in geübten Sätzen', 'in gefestigten']);
  await chart.locator('[data-a=pctab][data-t=g]').click();
  await expect(chart.locator('.pcstat')).toContainText(/\d+ Tage Behaltensdauer, am \d+\. \S+ \d+/);
  await expect(chart.locator('#pcsvg')).toHaveAttribute('aria-label', /logarithmische Achse/);
  await chart.locator('.pcstat [data-a=term]').click();
  await expect(page.locator('.pop .pop-h')).toHaveText('Behaltensdauer');
  await expect(page.locator('.pop .pop-t')).toContainText('mit mindestens 90 % Wahrscheinlichkeit');
});

test('Verlauf: Antippen auf dem Handy zeigt einen Tag, senkrechtes Wischen scrollt weiter die Seite', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport:{ width:390, height:844 }, hasTouch:true, isMobile:true });
  const page = await ctx.newPage();
  const chart = await open(page);
  const svg = chart.locator('#pcsvg');
  await expect(svg).toHaveCSS('touch-action', 'pan-y');
  const r = await svg.boundingBox();
  await page.touchscreen.tap(r.x + r.width * 0.15, r.y + r.height / 2);
  await expect(chart.locator('.pcdate')).not.toHaveText('Heute');
  await ctx.close();
});
