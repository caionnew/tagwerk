// Backup: exportieren, Speicher leeren, wieder einspielen, Stand vergleichen. Rückgängig und falsche Dateien.
const fs = require('fs'), os = require('os'), path = require('path');
const { test, expect, APP, seed, richDB, stored, bankIds } = require('./helpers');
const KEYS = ['st', 'log', 'done', 'own', 'tat', 'settings', 'tlog', 'gen'];
const pick = d => Object.fromEntries(KEYS.map(k => [k, d[k]]));
test('Export und Import ergeben denselben Stand, auch auf einem leeren Gerät', async ({ page, browser }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  const before = await stored(page);
  await page.click('[data-a=settings] >> nth=0');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-a=export]')]);
  expect(dl.suggestedFilename()).toMatch(/^tagwerk-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const file = path.join(os.tmpdir(), `tw-${Date.now()}.json`);
  await dl.saveAs(file);
  const exported = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(pick(exported)).toEqual(pick(before));
  await expect(page.locator('.notice')).toContainText('Downloads');
  // Neues, leeres Gerät (eigener Browser-Speicher), wie nach einer Neuinstallation
  const ctx = await browser.newContext({ viewport:{ width:412, height:860 } });
  const fresh = await ctx.newPage();
  const errors = []; fresh.on('pageerror', e => errors.push(e.message));
  await fresh.goto(APP);
  expect(Object.keys((await stored(fresh) || { st:{} }).st).length).toBe(0);
  await fresh.click('[data-a=settings] >> nth=0');
  await fresh.setInputFiles('#importFile', file);
  await expect(fresh.locator('.notice')).toContainText('Backup eingespielt: 90 Sätze');
  expect(pick(await stored(fresh))).toEqual(pick(before));
  // Nach Neustart noch da, und die Startseite zeigt die Serie
  await fresh.reload();
  expect(pick(await stored(fresh))).toEqual(pick(before));
  await expect(fresh.locator('#app')).toContainText('in Folge');
  expect(errors).toEqual([]);
  await ctx.close();
});
test('Einspielen lässt sich rückgängig machen; fremde Dateien ändern nichts', async ({ page }) => {
  await seed(page, richDB('sv'));
  await page.goto(APP);
  const before = await stored(page);
  await page.click('[data-a=settings] >> nth=0');
  const bad = path.join(os.tmpdir(), `tw-bad-${Date.now()}.json`);
  fs.writeFileSync(bad, '{"hallo":1}');
  await page.setInputFiles('#importFile', bad);
  await expect(page.locator('.notice')).toContainText('kein Tagwerk-Backup');
  expect(pick(await stored(page))).toEqual(pick(before));
  const empty = path.join(os.tmpdir(), `tw-empty-${Date.now()}.json`);
  fs.writeFileSync(empty, '\uFEFF' + JSON.stringify({ v:3, st:{}, log:{}, done:{} }));
  await page.setInputFiles('#importFile', empty);
  await expect(page.locator('.notice')).toContainText('Backup eingespielt: 0 Sätze');
  await page.click('.notice [data-a=undoimport]');
  await expect(page.locator('.notice')).toContainText('Vorheriger Stand');
  await page.waitForTimeout(300);
  expect(pick(await stored(page))).toEqual(pick(before));
});

// Voller Stand mit allem, was später dazukam: Tagwerk je Sprache, Entwürfe, Schreibarchiv, eigene und Tatoeba-Sätze, Einstellungen
function fullDB(){
  const db = richDB('sv'), days = Object.keys(db.done).sort();
  db.doneLang = Object.fromEntries(days.map((d, i) => [d, i % 3 ? { sv:true } : { es:true }]));
  db.draft = { sv:{ prompt:'Beschreib dein Zimmer.', text:'Mitt rum är litet.' } };
  db.texts = [{ id:'w1', lang:'sv', date:days[0], prompt:'Beschreib dein Zimmer.', text:'Mitt rum är litet men ljust.' }];
  db.own = { sv:[{ id:'sv:own1', target:'Jag har ont i huvudet.', de:'Ich habe Kopfschmerzen.', trap:'eigene', created:days[1] }], es:[] };
  db.tat = { sv:[], es:[{ id:'es:t1', target:'Hace frío hoy.', de:'Heute ist es kalt.', trap:'eigene', owner:'x', license:'CC BY 2.0 FR', audio:{ url:'https://audio.tatoeba.org/x.mp3', author:'y' }, created:days[2], auto:true }] };
  db.used = Object.assign(db.used, { wikiSeen:{ sv:['Vasaskeppet'] }, recentPick:{ shadow_sv:['sv:own1'] } });
  db.focus = { [days[3]]:{ sv:'bisats' } };
  db.settings = Object.assign(db.settings, { shHints:false, niveau:'fort', textMode:'listen', langMode:'last', haptics:false, size:'lang' });
  return db;
}
// Die App ergänzt beim Anzeigen eigene Merker (Sprache des Tages, Schwerpunkt der Woche, Tagesstand) und speichert verzögert.
// Deshalb ohne Zeitabhängigkeit: Nichts aus dem Ausgangsstand fehlt; das Backup gleicht dem gespeicherten Stand (der Export
// speichert vorher), bis auf das danach gesetzte Datum des letzten Backups.
const noStamp = d => { const x = Object.assign({}, d); delete x.lastBackup; return x; };
test('Backup: der ganze Stand kommt zurück, auch alles, was in späteren Versionen dazukam', async ({ page, browser }) => {
  const start = fullDB();
  await seed(page, start);
  await page.goto(APP);
  await page.click('[data-a=settings] >> nth=0');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-a=export]')]);
  const file = path.join(os.tmpdir(), `tw-full-${Date.now()}.json`);
  await dl.saveAs(file);
  const exported = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(exported).toMatchObject(start);
  await expect.poll(async () => (await stored(page)).lastBackup).toBeTruthy();
  expect(noStamp(await stored(page))).toEqual(noStamp(exported));
  const ctx = await browser.newContext({ viewport:{ width:412, height:860 } });
  const fresh = await ctx.newPage();
  const errors = []; fresh.on('pageerror', e => errors.push(e.message));
  await fresh.goto(APP);
  await fresh.click('[data-a=settings] >> nth=0');
  await fresh.setInputFiles('#importFile', file);
  await expect(fresh.locator('.notice')).toContainText('Backup eingespielt');
  // Alles, was im Backup steht, steht danach genauso im Speicher (die App darf eigene Merker ergänzen, nichts verlieren)
  expect(await stored(fresh)).toMatchObject(exported);
  expect(errors).toEqual([]);
  await ctx.close();
});
test('Backup aus einer alten Version: wird übernommen und umgerechnet', async ({ page }) => {
  await page.goto(APP);
  const [a, b] = bankIds('sv', 2), t = new Date(), pad = n => String(n).padStart(2, '0');
  const ds = k => { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - k); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  // Alte Form: Wiederholung nach Stufen (lv, ok, bad), „neue Sätze pro Tag“ statt Länge, ohne eigene Sätze, Tatoeba und Tagwerk je Sprache
  const old = { v:1, settings:{ newPerDay:3, lang:'sv' }, st:{ [a]:{ lv:3, ok:4, bad:1, due:ds(-2) }, [b]:{ lv:1, ok:1, bad:2, due:ds(0) } },
    log:{ [ds(1)]:{ sv:{ n:12, secs:400 } }, [ds(2)]:{ sv:{ n:9, secs:300 } } }, done:{ [ds(1)]:true, [ds(2)]:true } };
  const file = path.join(os.tmpdir(), `tw-old-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(old));
  await page.click('[data-a=settings] >> nth=0');
  await page.setInputFiles('#importFile', file);
  await expect(page.locator('.notice')).toContainText('Backup eingespielt: 2 Sätze');
  await page.waitForTimeout(300);
  const d = await stored(page);
  expect(d.settings.size).toBe('kurz');
  for (const id of [a, b]) { expect(typeof d.st[id].s).toBe('number'); expect(typeof d.st[id].d).toBe('number'); expect(d.st[id].ivl).toBeGreaterThan(0); }
  expect(d.own).toEqual({ sv:[], es:[] }); expect(d.tat).toEqual({ sv:[], es:[] });
  // Die App läuft damit: Startseite mit Serie, Fortschritt, ein Tagwerk lässt sich starten
  await page.click('[data-a=tab][data-v=home]');
  await expect(page.locator('#app')).toContainText('2 in Folge');
  await page.click('[data-a=tab][data-v=progress]');
  await expect(page.locator('#app')).toContainText('Übungstage');
  await page.click('[data-a=tab][data-v=home]');
  await page.click('.today [data-a=daily]');
  await expect(page.locator('.runbar')).toBeVisible();
});
test('Backup mit offenem Tagwerk: auf einem leeren Gerät eingespielt, geht es mit denselben Farben weiter', async ({ page, browser }) => {
  const db = richDB('sv'), ids = Object.keys(db.st), t = new Date(), pad = n => String(n).padStart(2, '0');
  const queue = [{ type:'free', id:ids[0], got:'ok' }, { type:'free', id:ids[1], got:'bad' }, { type:'free', id:ids[2], got:'near' }, { type:'free', id:ids[3] }, { type:'free', id:ids[1], requeue:true }];
  db.run = { date:`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`, lang:'sv', queue, idx:3, ok:2, bad:1, res:[], missed:[], secs:60, combo:0, best:1 };
  await seed(page, db);
  await page.goto(APP);
  await page.click('[data-a=settings] >> nth=0');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-a=export]')]);
  const file = path.join(os.tmpdir(), `tw-run-${Date.now()}.json`);
  await dl.saveAs(file);
  expect(JSON.parse(fs.readFileSync(file, 'utf8')).run.queue.map(e => e.got || null)).toEqual(['ok', 'bad', 'near', null, null]);
  const ctx = await browser.newContext({ viewport:{ width:412, height:860 } });
  const fresh = await ctx.newPage();
  const errors = []; fresh.on('pageerror', e => errors.push(e.message));
  await fresh.goto(APP);
  await fresh.click('[data-a=settings] >> nth=0');
  await fresh.setInputFiles('#importFile', file);
  await expect(fresh.locator('.notice')).toContainText('Backup eingespielt');
  await fresh.click('[data-a=tab][data-v=home]');
  await fresh.click('.today [data-a=daily]');
  await expect(fresh.locator('.count')).toHaveText('4/5');
  expect(await fresh.$$eval('.progress .seg', els => els.map(e => e.className.replace('seg', '').trim()))).toEqual(['s-ok', 's-bad', 's-near', 's-cur', 're re1']);
  expect(errors).toEqual([]);
  await ctx.close();
});
