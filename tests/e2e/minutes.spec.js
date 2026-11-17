// Lernminuten: Tag antippen zeigt die Karte, nochmal schließt sie, Thema aus der Karte öffnet in der richtigen Sprache, Kalender nutzt dieselbe Karte.
const { test, expect, APP, seed, freshDB, bankIds } = require('./helpers');
const pad = n => String(n).padStart(2, '0'), now = new Date();
const ds = k => { const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
function db(){
  const d = freshDB('sv'); d.tlog = {}; d.doneLang = {};
  bankIds('sv', 20).forEach(id => { d.st[id] = { s:10, d:4, ivl:6, last:ds(2), due:ds(-3), reps:3, ok:3, bad:0, alts:[] }; });
  bankIds('es', 10).forEach(id => { d.st[id] = { s:8, d:4, ivl:5, last:ds(2), due:ds(-3), reps:3, ok:3, bad:0, alts:[] }; });
  for (let k = 27; k >= 0; k--) {
    const day = ds(k);
    d.log[day] = { sv:{ n:20, ok:17, secs:600 + k * 10, fresh:3, rev:8, revOk:7 } };
    d.tlog[day] = { h:{ 7:10 }, sv:{ 't:free':[10, 2], 'p:inversion':[6, 2] } };
    if (k % 2 === 0) { d.log[day].es = { n:9, ok:8, secs:300, fresh:2, rev:4, revOk:3 }; d.tlog[day].es = { 't:gap':[6, 3], 'p:subjuntivo':[4, 3] }; }
    d.done[day] = true; d.doneLang[day] = { sv:true };
  }
  return d;
}
test('Lernminuten: Tag antippen öffnet, nochmal schließt (wie im Kalender), Thema in der richtigen Sprache', async ({ page }) => {
  await seed(page, db());
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  const mins = page.locator('.chart.mins'), card = mins.locator('.dcard');
  await expect(card).toHaveCount(0);
  await expect(mins).toContainText('Tipp auf einen Tag für Details.');
  await expect(page.locator('.mchart .mc[aria-pressed=true]')).toHaveCount(0);
  // Vorgestern antippen: Karte; nochmal: zu
  const bar = page.locator(`.mchart .mc[data-k="${ds(2)}"]`);
  await bar.click();
  await expect(bar).toHaveAttribute('aria-pressed', 'true');
  await expect(card.locator('.dc-h')).toHaveText('Vorgestern');
  await expect(card.locator('.dc-s')).toContainText('7–8 Uhr');
  await expect(card.locator('tbody tr')).toHaveCount(2);
  await bar.click();
  await expect(card).toHaveCount(0);
  await expect(bar).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-a=mrange]')).toHaveCount(0);
  // Kalender: Tag antippen zeigt dieselbe Karte, nochmal antippen schließt sie
  const calChart = page.locator('.calwrap').locator('xpath=..');
  await page.click(`[data-a=calday][data-d="${ds(1)}"]`);
  await expect(calChart.locator('.dcard .dc-h')).toHaveText('Gestern');
  await page.click(`[data-a=calday][data-d="${ds(1)}"]`);
  await expect(calChart.locator('.dcard')).toHaveCount(0);
  // Spanisches Thema aus der Tageskarte: Themenblatt auf Spanisch, Üben startet auf Spanisch
  await bar.click();
  await page.click('.chart.mins .dcard [data-a=topic][data-l=es]');
  await expect(page.locator('.pop')).toContainText('Subjuntivo');
  await page.click('.pop [data-a=trapgo]');
  await expect(page.locator('.runbar')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-lang', 'es');
});
