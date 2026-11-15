// Backup: exportieren, Speicher leeren, wieder einspielen, Stand vergleichen. Rückgängig und falsche Dateien.
const fs = require('fs'), os = require('os'), path = require('path');
const { test, expect, APP, seed, richDB, stored } = require('./helpers');
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
