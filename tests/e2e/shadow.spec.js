// Nachsprechen mit vorgetäuschtem Mikrofon (Testsignal: Stimme, Pause, Stimme, Stille) und einer Test-Stimme ohne Ton
const os = require('os'), path = require('path');
const { test, expect, APP, seed, richDB, stored, fakeVoice, speechWav, fakeMicArgs } = require('./helpers.js');
const WAV = speechWav(path.join(os.tmpdir(), `tagwerk-shadow-${process.pid}.wav`), [['s', 0.5], ['v', 0.8], ['s', 0.6], ['v', 0.7], ['s', 5]]);
test.use({ launchOptions:{ ...(process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH } : {}), args:fakeMicArgs(WAV) } });

// Merkt sich alle Mikrofon-Streams, um zu prüfen, dass nichts offen bleibt
const trackMic = () => {
  const md = navigator.mediaDevices, orig = md.getUserMedia.bind(md);
  window.__mic = [];
  md.getUserMedia = async c => { const s = await orig(c); window.__mic.push(s); window.__micC = c; return s; };
};
const liveTracks = page => page.evaluate(() => (window.__mic || []).flatMap(s => s.getTracks()).filter(t => t.readyState === 'live').length);
async function open(page){
  await page.addInitScript(fakeVoice);
  await page.addInitScript(trackMic);
  await seed(page, richDB('sv'));
  await page.goto(APP);
  await page.click('[data-a=tab][data-v=extra]');
  await page.click('[data-a=shadow]');
  await expect(page.locator('.shsteps')).toBeVisible();
}

test('Nachsprechen: hören, mitsprechen, aufnehmen; Auswertung, Vergleich, zweiter Versuch, Übersicht; Mikrofon danach frei', async ({ page }) => {
  await open(page);
  // Hören: Der Hauptknopf führt durch die Schritte, das gerade gesprochene Wort ist markiert
  await expect(page.locator('.shbar .primary')).toHaveText('Anhören');
  await expect(page.locator('.shstep.cur')).toContainText('Hören');
  await page.click('.shbar .primary');
  await expect(page.locator('.shs .w.kar')).toHaveCount(1);
  await expect(page.locator('.shstep.done')).toContainText('Hören');
  await expect(page.locator('.shbar .primary')).toHaveText('Mitsprechen');
  await expect(page.locator('.shs .w.kar')).toHaveCount(0, { timeout:8000 });
  await page.click('.shbar .primary');
  await expect(page.locator('#shtip')).toContainText('Jetzt mitsprechen');
  await expect(page.locator('.shbar .primary')).toHaveText('Aufnehmen');
  // Aufnehmen bricht das Mitsprechen ab; ohne automatische Lautstärkeregelung
  await page.click('.shbar .primary');
  await expect(page.locator('#shlive svg')).toBeVisible();
  await expect(page.locator('.shbar .primary')).toHaveText('Fertig');
  expect(await page.evaluate(() => window.__micC.audio.autoGainControl)).toBe(false);
  await expect(page.locator('#shsay')).toHaveText('Ich höre dich', { timeout:4000 });
  // Stoppt von selbst nach der Stille, Mikrofon sofort frei
  await expect(page.locator('.shtiles')).toBeVisible({ timeout:15000 });
  expect(await liveTracks(page)).toBe(0);
  const tiles = page.locator('.sht');
  await expect(tiles.nth(0)).toContainText('Tempo');
  await expect(tiles.nth(0)).toContainText(/\d,\d s · Original \d,\d s/);
  await expect(tiles.nth(1)).toContainText('1 Stockung');
  await expect(page.locator('.shwave.me .pz:not(.ok)')).toHaveCount(1);
  await expect(page.locator('.shwave.orig .pill')).toHaveCount(1);
  await expect(page.locator('.shmsg.warn')).toHaveCount(0);
  // Im Wechsel: Original, dann die eigene Aufnahme; der Knopf bleibt gedrückt, solange es läuft
  await page.click('[data-a=shpab]');
  await expect(page.locator('[data-a=shpab]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-a=shpab]')).toHaveAttribute('aria-pressed', 'false', { timeout:12000 });
  // Antippen der eigenen Spur spielt ab der Stelle
  await page.click('.shlane.me');
  await expect(page.locator('[data-a=shpm]')).toHaveAttribute('aria-pressed', 'true');
  // Zweiter Versuch: zählt mit, Mikrofon danach wieder frei
  await page.click('[data-a=shrec]');
  await expect(page.locator('.shbar .primary')).toHaveText('Fertig');
  await expect(page.locator('.shbar .primary')).toHaveText('Nächster Satz', { timeout:15000 });
  expect(await liveTracks(page)).toBe(0);
  await page.click('[data-a=shnext]');
  await expect(page.locator('.count')).toHaveText('2/8');
  await expect(page.locator('.shbar .primary')).toHaveText('Anhören');
  // Beenden: Übersicht mit der Aufnahme des ersten Satzes
  await page.click('[data-a=shquit]');
  await expect(page.locator('.done-h')).toHaveText('Runde geschafft');
  await expect(page.locator('.shrow')).toHaveCount(1);
  await expect(page.locator('.kpis')).toContainText('2Versuche');
  await page.click('[data-a=shall]');
  await expect(page.locator('[data-a=shall]')).toHaveAttribute('aria-pressed', 'true');
  // Verlassen: Wiedergabe aus, nichts gespeichert außer dem Tagesprotokoll
  await page.click('[data-a=tab][data-v=extra]');
  const db = await stored(page);
  expect(JSON.stringify(db)).not.toContain('blob:');
});

test('Nachsprechen: Verwerfen und App im Hintergrund geben das Mikrofon sofort frei', async ({ page }) => {
  await open(page);
  await page.click('.shstep[data-a=shrec]');
  await expect(page.locator('.shbar .primary')).toHaveText('Fertig');
  await page.click('[data-a=shcancel]');
  await expect(page.locator('.shsteps')).toBeVisible();
  expect(await liveTracks(page)).toBe(0);
  await page.click('.shstep[data-a=shrec]');
  await expect(page.locator('.shbar .primary')).toHaveText('Fertig');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value:true, configurable:true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(() => liveTracks(page)).toBe(0);
  await expect(page.locator('.shbar .primary')).not.toHaveText('Fertig');
});

test('Nachsprechen: gesperrtes Mikrofon wird erklärt, Aussprachehilfen lassen sich abschalten', async ({ page }) => {
  await page.addInitScript(() => { navigator.mediaDevices.getUserMedia = () => Promise.reject(Object.assign(new Error('nein'), { name:'NotAllowedError' })); });
  await open(page);
  await page.click('.shstep[data-a=shrec]');
  await expect(page.locator('.shmsg.warn')).toContainText('gesperrt');
  await expect(page.locator('.shsteps')).toBeVisible();
  await expect(page.locator('[data-a=shhints]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.shs.hints')).toHaveCount(1);
  await page.click('[data-a=shhints]');
  await expect(page.locator('[data-a=shhints]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.shs.hints')).toHaveCount(0);
  await expect(page.locator('.shleg')).toHaveCount(0);
  await expect.poll(async () => (await stored(page)).settings.shHints).toBe(false);
});

test('Nachsprechen: Spracherkennung färbt verstandene Wörter schon beim Sprechen', async ({ page }) => {
  // Erkennung zum Testen: erst die ersten zwei Wörter als Zwischenstand, dann der Satz ohne das letzte Wort
  await page.addInitScript(() => {
    window.SpeechRecognition = class {
      start(){
        const words = document.querySelector('.shs').textContent.replace(/[.!?¿¡,\u2060]/g, '').trim().split(/\s+/);
        const res = (t, fin) => ({ results:[Object.assign([{ transcript:t }], { isFinal:fin })] });
        setTimeout(() => this.onresult(res(words.slice(0, 2).join(' '), false)), 150);
        setTimeout(() => { window.__interim = document.querySelectorAll('.shs .w.p-ok').length; }, 400);
        setTimeout(() => this.onresult(res(words.slice(0, -1).join(' '), true)), 600);
      }
      abort(){}
    };
  });
  await open(page);
  const n = await page.locator('.shs .w').count();
  // Ohne Aufnahme-Ergebnis: Erkennung über den Link in der Auswertung; hier direkt über die Aktion
  await page.click('.shstep[data-a=shrec]');
  await expect(page.locator('.shtiles')).toBeVisible({ timeout:15000 });
  await page.click('[data-a=pron]');
  await expect(page.locator('.shmsg', { hasText:'Wörtern verstanden' })).toContainText(`${n - 1} von ${n} Wörtern verstanden`);
  expect(await page.evaluate(() => window.__interim)).toBe(2);
  await expect(page.locator('.shs .w.p-miss')).toHaveCount(1);
});
