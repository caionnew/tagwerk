// Lernminuten: Tag antippen zeigt die Karte, Wochenansicht, Thema aus der Karte öffnet in der richtigen Sprache, Kalender nutzt dieselbe Karte.
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
    if (k % 2 === 0) { d.log[day].es = { n:9, ok:8, secs:300, fresh:2, rev:4, revOk:3 }; d.tlog[day].es = { 't:gap':[6, 1], 'p:subjuntivo':[4, 1] }; }
    d.done[day] = true; d.doneLang[day] = { sv:true };
  }
  return d;
}
test('Lernminuten: Tag antippen, Wochen, Thema in der richtigen Sprache, Kalender-Karte', async ({ page }) => {
  await seed(page, db());
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=progress]');
  const card = page.locator('.chart.mins .dcard');
  await expect(card).toContainText('heute');
  await expect(page.locator('.mchart .mc[aria-pressed=true]')).toHaveCount(1);
  // Vorgestern antippen
  await page.click(`.mchart .mc[data-k="${ds(2)}"]`);
  await expect(card).toContainText('vorgestern');
  await expect(card).toContainText('Schwedisch');
  await expect(card).toContainText('Spanisch');
  await expect(card).toContainText('Uhrzeit: 7–8 Uhr');
  await expect(page.locator(`.mchart .mc[data-k="${ds(2)}"]`)).toHaveAttribute('aria-pressed', 'true');
  // Wochen
  await page.click('[data-a=mrange][data-v=w]');
  await expect(page.locator('.mchart.mweeks')).toBeVisible();
  await expect(card).toContainText('Diese Woche');
  await expect(card).toContainText(/An \d von \d Tagen geübt/);
  await page.click('.mchart .mc >> nth=0');
  await expect(card).not.toContainText('Diese Woche');
  await expect(card).toContainText('Tagwerke');
  // Kalender: Tag antippen zeigt dieselbe Karte, nochmal antippen schließt sie
  await page.click(`[data-a=calday][data-d="${ds(1)}"]`);
  const cal = page.locator('.calwrap').locator('xpath=..').locator('.dcard');
  await expect(cal).toContainText('gestern');
  await page.click(`[data-a=calday][data-d="${ds(1)}"]`);
  await expect(cal).toHaveCount(0);
  // Spanisches Thema aus der Karte: Themenblatt auf Spanisch, Üben startet auf Spanisch
  await page.click('.chart.mins .dcard [data-a=topic][data-l=es]');
  await expect(page.locator('.pop')).toContainText('Subjuntivo');
  await page.click('.pop [data-a=trapgo]');
  await expect(page.locator('.runbar')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-lang', 'es');
});
