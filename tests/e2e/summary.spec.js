// Rundenende: Ergebnisleiste, Fehler je Thema ohne sofortige Übungsrunde, passende Knöpfe. Tagesbilanz auf „Heute“.
const { test, expect, APP, seed, richDB, answerWrong, stored } = require('./helpers');
test('Kurze Runde: Leiste je Aufgabe, Fehler beim Thema, keine sofortige Übungsrunde', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=quick]');
  for (let k = 0; k < 30 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  const n = 6; // Kurze Runde: sechs Aufgaben, zweite Versuche zählen nicht
  await expect(page.locator('.done-h')).toHaveText('Runde beendet');
  await expect(page.locator('.rstrip .rs')).toHaveCount(n);
  await expect(page.locator('.rstrip .rs-bad')).toHaveCount(n);
  // Fehler stehen bei ihrem Thema (auch bei nur einem), keine eigene Liste daneben
  await expect(page.locator('.donebox h2.grp', { hasText:/^Them(a|en) dieser Runde$/ })).toHaveCount(1);
  await expect(page.locator('.donebox h2.grp', { hasText:'Noch nicht sicher' })).toHaveCount(0);
  await expect(page.locator('[data-a=retry]')).toHaveCount(0);
  await expect(page.locator('.actionbar [data-a=again]')).toBeVisible();
  await expect(page.locator('#tabs')).toBeHidden();
  const bar = await page.$eval('.actionbar', el => Math.round(innerHeight - el.getBoundingClientRect().bottom));
  expect(Math.abs(bar)).toBeLessThanOrEqual(1);
});
test('Tagwerk: Stempel, Leiste, Lesetipps, Fertig und Weiter üben', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  for (let k = 0; k < 80 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  await expect(page.locator('.done-h')).toHaveText('Tagwerk erledigt');
  await expect(page.locator('svg.stamp')).toBeVisible();
  expect(await page.locator('.rstrip .rs').count()).toBeGreaterThan(3);
  await expect(page.locator('.readtip a')).toHaveCount(3);
  await expect(page.locator('.actionbar [data-a=tab][data-v=home]')).toHaveText('Fertig');
  await expect(page.locator('#tabs')).toBeHidden();
  await page.click('.actionbar [data-a=tab][data-v=home]');
  await expect(page.locator('.today .num')).toHaveText('Tagwerk erledigt');
  await expect(page.locator('.today-kpis')).toContainText('Aufgaben');
});
test('Heute nach dem Tagwerk: Zeit, neue Sätze, Wiederholungen und Gefestigtes des Tages', async ({ page }) => {
  const db = richDB('sv'), pad = n => String(n).padStart(2, '0'), t = new Date(), ds = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  db.done[ds] = true; db.doneLang = { [ds]:{ sv:true } };
  db.log[ds] = { sv:{ n:31, ok:26, secs:742, fresh:5, rev:22, revOk:20, mat:2 } };
  await seed(page, db);
  await page.goto(APP);
  const tiles = page.locator('.today-kpis > div');
  await expect(tiles).toHaveCount(3);
  await expect(tiles.nth(0)).toContainText('12Minuten');
  await expect(tiles.nth(1)).toContainText('5neue Sätze');
  await expect(tiles.nth(2)).toContainText('20 von 22Wiederholungen gewusst');
  await expect(page.locator('.today-mat')).toHaveText('2 Sätze heute gefestigt.');
});
test('Heute: wenig geübt zeigt die Zahl der Aufgaben, ohne Übung keine Bilanz', async ({ page }) => {
  const db = richDB('sv'), pad = n => String(n).padStart(2, '0'), t = new Date(), ds = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  db.done[ds] = true; db.doneLang = { [ds]:{ sv:true, es:true } };
  db.log[ds] = { sv:{ n:4, secs:20 } };
  await seed(page, db);
  await page.goto(APP);
  await expect(page.locator('.today-kpis > div')).toHaveCount(1);
  await expect(page.locator('.today-kpis')).toContainText('4Aufgaben');
  await expect(page.locator('.today-mat')).toHaveCount(0);
  await page.click('[data-a=lang][data-l=es]');
  await expect(page.locator('.today .num')).toHaveText('Tagwerk erledigt');
  await expect(page.locator('.today-kpis')).toHaveCount(0);
});
test('Tagwerk-Ende: Themen der Runde mit Punkten, Tippen klappt deine Antworten auf, darin Regel mit „10 Aufgaben üben“', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=daily]');
  for (let k = 0; k < 80 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  await expect(page.locator('.donebox')).toContainText('Themen dieser Runde');
  const rows = page.locator('.trow');
  expect(await rows.count()).toBeGreaterThanOrEqual(2);
  expect(await page.locator('.tdots i.d-bad').count()).toBeGreaterThanOrEqual(2);
  // Alles falsch: Jedes Thema hat einen Fehler und steht deshalb da, auch mehr als fünf; nichts ist eingeklappt
  await expect(page.locator('[data-a=topicsall]')).toHaveCount(0);
  expect(await page.locator('.tdots i.d-bad, .tdots i.d-off').count()).toBe(await page.locator('.rstrip .rs-bad').count());
  // Punkte bündig rechts, auch in Zeilen ohne Regel (ohne Pfeil)
  const rights = await page.$$eval('.trow .tdots', els => els.map(e => Math.round(e.getBoundingClientRect().right)));
  expect(new Set(rights).size).toBe(1);
  // Antippen klappt auf: deine Antwort, die Lösung, ins Bild geholt über den Knöpfen; nochmal tippen klappt zu
  const first = page.locator('button.trow').first();
  await first.click();
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  const det = page.locator('.tdet');
  await expect(det).toHaveCount(1);
  await expect(det.locator('.rk-you').first()).not.toBeEmpty();
  await expect(det.locator('.rk-s').first()).not.toBeEmpty();
  // Ganz im Bild über den Knöpfen, oder (wenn länger als der Bildschirm) oben am Bildrand
  await expect.poll(() => page.evaluate(() => { const d = document.querySelector('.tdet').getBoundingClientRect(), bar = document.querySelector('.actionbar').getBoundingClientRect(); return d.top >= 0 && (d.bottom <= bar.top || d.top <= 130); })).toBe(true);
  await first.click();
  await expect(page.locator('.tdet')).toHaveCount(0);
  // Deine Antwort je Übungsart, in allen Themen: Welche Aufgaben die Runde bringt und welche vorn steht, ist zufällig (am 25.11.
  // stand in jeder fünften Runde eine Wortkästchen-Aufgabe vorn, und der Test prüfte nur die erste). Getippt „zzz qqq“ ohne
  // Anführungszeichen, das überzählige Wort gestrichen; Lücke und Auswahl in Anführungszeichen; Wortkästchen als gelegte
  // Reihenfolge; aufgegeben „Weiß ich nicht“.
  let typed = 0;
  for (let i = 0; i < await rows.count(); i++) {
    await rows.nth(i).click();
    await expect(rows.nth(i)).toHaveAttribute('aria-expanded', 'true');
    for (const el of await page.locator('.tdet .rk-you').all()) {
      const t = await el.textContent();
      if (!t.includes('zzz')) { expect(t).toMatch(/^(Weiß ich nicht|Du: „[^„“]+“|Du: [^„“]+)$/); continue; }
      typed++;
      expect(t).toMatch(/^Du: (zzz qqq|„zzz qqq“)$/);
      if (!t.includes('„')) await expect(el.locator('.w-extra').first()).toHaveText('zzz');
    }
  }
  expect(typed).toBeGreaterThan(0);
  // Wieder aufgeklappt: darin die Regel mit „10 Aufgaben üben“
  await page.locator('button.trow').first().click();
  await page.locator('.tdet [data-a=topic]').click();
  await expect(page.locator('.pop')).toContainText('Thema');
  await expect(page.locator('.pop [data-a=trapgo]')).toHaveText('10 Aufgaben üben');
});
test('Bonus „Eigener Satz“: aufklappen, Kopie und fehlender Ausdruck werden erkannt, eigene Sätze gleich mit LanguageTool', async ({ page }) => {
  await seed(page, richDB('sv'));
  let ltCalls = 0;
  // Verzögerte Antwort: Der nächste Satz wird getippt, während die vorige Prüfung noch läuft (so wie auf GitHub)
  await page.route('https://api.languagetool.org/**', async route => { ltCalls++; await new Promise(x => setTimeout(x, 600)); await route.fulfill({ json:{ matches:[] } }); });
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=quick]');
  for (let k = 0; k < 30 && await page.$('.runbar'); k++) { await answerWrong(page); await page.click('[data-a=next]'); }
  await page.click('[data-a=bonus]');
  const box = page.locator('#bonusText');
  await expect(box).toBeFocused();
  const expr = (await page.locator('.bonus .bq b').textContent()).trim();
  const model = (await page.locator('.bonus .bmodel .rt').textContent()).trim();
  await box.fill(model);
  await page.click('[data-a=bonuscheck]');
  await expect(page.locator('.bres')).toHaveText('Das ist fast der Satz aus der Übung. Schreib einen eigenen.');
  expect(ltCalls).toBe(0);
  await box.fill('Vi åker till stan imorgon bitti.');
  await page.click('[data-a=bonuscheck]');
  await expect(page.locator('.bres.is-warn')).toContainText('kommt noch nicht vor');
  await expect(page.locator('.bonus .dots')).toHaveText('Wird geprüft');
  // Gespeichert wird 150 ms nach der letzten Änderung. Direkt nach dem Rundenende fehlte im Speicher noch die letzte Aufgabe;
  // war der Test schnell genug (auf GitHub am 25.11.), zählte „vorher“ eine zu wenig. „pagehide“ speichert sofort, wie beim Schließen.
  const tasks = () => page.evaluate(() => { dispatchEvent(new Event('pagehide')); const d = JSON.parse(localStorage.getItem('tagwerk-offline-v1')); const t = new Date(), p = x => String(x).padStart(2, '0'); return d.log[`${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`].sv.n; });
  const before = await tasks();
  await box.fill(`Igår sa min granne något om ${expr} på bussen.`);
  await page.click('[data-a=bonuscheck]');
  // Ein Antippen: Ausdruck geprüft und gleich LanguageTool gefragt
  await expect(page.locator('.bres.is-ok')).toContainText(`„${expr}“ steckt drin.`);
  await expect(box).toHaveValue(`Igår sa min granne något om ${expr} på bussen.`);
  await expect(page.locator('.bonus .lt-ok')).toHaveText('Keine Fehler gefunden.');
  await expect(page.locator('.bonus .dots')).toHaveCount(0);
  expect(ltCalls).toBe(2);
  // Weitertippen während der Prüfung: Die veraltete Antwort fällt weg, nichts bleibt auf „Wird geprüft“ hängen
  await page.click('[data-a=bonuscheck]');
  await box.fill(`Igår sa min granne något om ${expr} på tåget.`);
  await expect(page.locator('.bonus .dots')).toHaveCount(0, { timeout:3000 });
  await expect(page.locator('[data-a=bonuscheck]')).toBeEnabled();
  // Die Übung zählt als Aufgabe des Tages, aber nur einmal
  await page.click('[data-a=bonuscheck]');
  expect(await tasks()).toBe(before + 1);
});
