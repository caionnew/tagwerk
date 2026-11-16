// Lesen und Hören: Text lesen, Fragen beantworten, Satz übernehmen; Hören mit verdecktem Text; Wikipedia-Fundstück.
const { test, expect, APP, seed, freshDB, richDB, stored } = require('./helpers');
const fakeSpeech = () => {
  window.__said = []; let cur = null;
  Object.defineProperty(window, 'speechSynthesis', { configurable:true, value:{
    speak(u){ window.__said.push(u.text); cur = u; setTimeout(() => { if (cur === u && u.onend) u.onend(); }, 20); },
    cancel(){ cur = null; }, getVoices:() => [{ lang:'sv-SE' }, { lang:'es-ES' }, { lang:'de-DE' }], onvoiceschanged:null } });
  window.SpeechSynthesisUtterance = function(t){ this.text = t; };
};
test('Lesen: Fragen erst nach dem Text, einzeln mit Textstelle, Wörter in „Nachgeschlagen“, Satz anhören aus dem Wörterbuch', async ({ page }) => {
  await page.addInitScript(fakeSpeech);
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await expect(page.locator('[data-a=tdefmode][data-v=read]')).toHaveAttribute('aria-checked', 'true');
  await page.click('[data-a=textopen][data-id=vasa]');
  await expect(page.locator('.rtitle')).toHaveText('Regalskeppet Vasa');
  await expect(page.locator('.tq')).toHaveCount(0);
  expect(await page.locator('.reader [data-a=lookup]').count()).toBeGreaterThan(50);
  await page.click('.reader [data-a=lookup][data-w=krigsskeppet]');
  await page.click('[data-a=tsay]');
  await expect.poll(() => page.evaluate(() => window.__said[0] || '')).toBe('Den 10 augusti 1628 seglade det nya krigsskeppet Vasa ut från Stockholm.');
  await page.click('[data-a=tplayall]');
  await expect(page.locator('.wtray .wchip')).toHaveCount(1);
  await page.click('[data-a=tquiz]');
  await expect(page.locator('.tq-head')).toContainText('Frage 1 von 3');
  await page.click('[data-a=tpick][data-k="0"][data-i="0"]');
  await expect(page.locator('.tq-src')).toContainText('Skeppet var helt enkelt för smalt och för högt.');
  await page.click('[data-a=tqnext]');
  await page.click('[data-a=tpick][data-k="1"][data-i="0"]');
  await page.click('[data-a=tqnext]');
  await page.click('[data-a=tpick][data-k="2"][data-i="1"]');
  await page.click('[data-a=tqnext]');
  await expect(page.locator('.tdone-h')).toHaveText('2 von 3 richtig.');
  await expect(page.locator('.reader .rs-s.ev')).toHaveCount(3);
  await page.waitForTimeout(300);
  let db = await stored(page);
  expect(db.used.texts['sv:vasa'].best).toBe(2);
  await page.click('[data-a=tkeep][data-k="0"]');
  await expect(page.locator('[data-a=tkeep][data-k="0"]')).toHaveText('Im Tagwerk');
  await page.waitForTimeout(300);
  db = await stored(page);
  expect(db.own.sv.some(o => o.target === 'Skeppet var helt enkelt för smalt och för högt.')).toBe(true);
  await page.click('[data-a=tnexttext]');
  await expect(page.locator('.rtitle')).not.toHaveText('Regalskeppet Vasa');
  await page.click('.backbar [data-a=tab]');
  await expect(page.locator('[data-a=textopen][data-id=vasa]')).toContainText('2 von 3');
});
test('Nur hören: vorher gewählt und gemerkt, Text verschwommen, Antippen spielt und deckt dann auf, Fragen kommen von selbst', async ({ page }) => {
  await page.addInitScript(fakeSpeech);
  await seed(page, freshDB('es'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=tdefmode][data-v=listen]');
  await page.click('[data-a=textopen][data-id=siesta]');
  const total = await page.locator('.reader .rs-s').count();
  await expect(page.locator('.reader .rs-s.veil')).toHaveCount(total);
  await expect.poll(() => page.evaluate(() => window.__said.length), { timeout:8000 }).toBeGreaterThanOrEqual(2);
  const said = await page.evaluate(() => window.__said);
  expect(said[0]).toBe('Mucha gente cree que en España todo el mundo duerme la siesta.');
  expect(said[1]).toBe('No es verdad.');
  // Erstes Antippen: Satz 2 noch einmal hören, zweites: aufdecken
  await page.click('.reader [data-a=treveal][data-i="1"]');
  await expect.poll(() => page.evaluate(() => window.__said.filter(x => x === 'No es verdad.').length)).toBeGreaterThanOrEqual(2);
  await expect(page.locator('.reader .rs-s.veil')).toHaveCount(total);
  await page.click('.reader [data-a=treveal][data-i="1"]');
  await expect(page.locator('.reader .rs-s.veil')).toHaveCount(total - 1);
  await expect(page.locator('.tq')).toBeVisible({ timeout:20000 });
  for (let k = 0; k < 3; k++) { await page.click(`[data-a=tpick][data-k="${k}"][data-i="0"]`); await page.click('[data-a=tqnext]'); }
  await expect(page.locator('.tdone-h')).toHaveText('Alles verstanden.');
  await expect(page.locator('.reader .rs-s.veil')).toHaveCount(0);
  await page.waitForTimeout(300);
  const db = await stored(page);
  expect(db.used.texts['es:siesta'].heard).toBe(true);
  expect(db.settings.textMode).toBe('listen');
});
test('Wikipedia-Fundstück: nur ausgezeichnete Artikel, Bezug zum Kulturraum zuerst, Gesehenes nicht noch einmal', async ({ page }) => {
  let fail = false; const urls = [];
  const long = t => `${t} är ett ämne som har beskrivits utförligt i många källor och som fortfarande väcker intresse hos både forskare och allmänhet. `.repeat(4);
  await page.route('https://sv.wikipedia.org/w/api.php**', route => { urls.push(route.request().url()); return fail ? route.abort() : route.fulfill({ json:{ query:{ pages:[
    { title:'Kort', extract:'För kort.', fullurl:'https://sv.wikipedia.org/wiki/Kort' },
    { title:'Anne av Kleve', extract:long('Anne av Kleve var en engelsk drottning'), fullurl:'https://sv.wikipedia.org/wiki/Anne_av_Kleve' },
    { title:'Allmänna skyddsrum i Stockholm', extract:long('Allmänna skyddsrum i Stockholm byggdes under kalla kriget i Sverige'), fullurl:'https://sv.wikipedia.org/wiki/Allm%C3%A4nna_skyddsrum_i_Stockholm' }
  ] } } }); });
  await seed(page, freshDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=wiki] >> nth=0');
  await expect(page.locator('.rtitle')).toHaveText('Allmänna skyddsrum i Stockholm');
  expect(decodeURIComponent(urls[0])).toContain('generator=categorymembers&gcmtitle=Kategori:Wikipedia:Utmärkta artiklar');
  await expect(page.locator('.tchips')).toContainText('Exzellenter Artikel');
  await expect(page.locator('.legend')).toContainText('CC BY-SA 4.0');
  // Gesehenes kommt nicht wieder: jetzt bleibt nur der Artikel ohne Bezug zum Norden
  await page.click('.btnrow [data-a=wiki]');
  await expect(page.locator('.rtitle')).toHaveText('Anne av Kleve');
  fail = true;
  await page.click('.btnrow [data-a=wiki]');
  await expect(page.locator('#app')).toContainText('Dafür braucht es Internet');
});
test('Hören: nach der Antwort stehen Frage, Fundstelle und „Nächste Frage“ ohne Scrollen im Bild', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=tdefmode][data-v=listen]');
  await page.click('[data-a=textopen][data-id=vasa]');
  await page.click('[data-a=tquiz]');
  await expect(page.locator('.reader.folded')).toHaveCount(1);
  await page.click('[data-a=tpick][data-k="0"][data-i="0"]');
  const next = page.locator('.reader-bar [data-a=tqnext]');
  await expect(next).toHaveText('Nächste Frage');
  await expect(page.locator('.tq [data-a=tqnext]')).toHaveCount(0);
  await page.waitForTimeout(500);
  const barTop = await page.$eval('.reader-bar', e => e.getBoundingClientRect().top);
  const src = await page.$eval('.tq-src', e => e.getBoundingClientRect().bottom), q = await page.$eval('.tq-q', e => e.getBoundingClientRect().top);
  expect(src).toBeLessThanOrEqual(barTop);
  expect(q).toBeGreaterThanOrEqual(0);
  await next.click();
  await expect(page.locator('.tq-head')).toContainText('Frage 2 von 3');
  await expect(page.locator('.reader-bar [data-a=tslow]')).toBeVisible();
});
test('Hören: „Text zeigen“ lässt sich mit „Verbergen“ wieder zurücknehmen', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=texts]');
  await page.click('[data-a=tdefmode][data-v=listen]');
  await page.click('[data-a=textopen][data-id=vasa]');
  const chip = page.locator('.reader-bar [data-a=tshowall]');
  await expect(page.locator('.reader .rs-s.veil').first()).toBeVisible();
  await chip.click();
  await expect(page.locator('.reader .rs-s.veil')).toHaveCount(0);
  await expect(chip).toHaveText('Verbergen');
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await chip.click();
  await expect(chip).toHaveText('Text zeigen');
  expect(await page.locator('.reader .rs-s.veil').count()).toBeGreaterThan(5);
});
