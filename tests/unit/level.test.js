// Niveau: Schätzung je Satz, Verteilung der Satzbank, Auswahl neuer Sätze für Fortgeschrittene.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const estLevel = app.get('estLevel'), BANK = app.get('BANK');
test('Schätzung: kurze Hauptsätze leicht, Nebensätze und anspruchsvolle Formen schwer', () => {
  assert.equal(estLevel('sv', 'Nu förstår jag det.'), 1);
  assert.equal(estLevel('es', 'Estoy cansado.'), 1);
  assert.equal(estLevel('sv', 'Fast vi inte hade setts på länge kände jag igen henne direkt.'), 3);
  assert.equal(estLevel('es', 'Si me hubieras avisado, te habría recogido en la estación.'), 3);
  assert.ok(estLevel('sv', 'Jag vet att han inte kommer idag.') >= 2);
});
test('Satzbank je Sprache: mindestens 60 Sätze ab Mittelstufe, davon mindestens 30 schwere', () => {
  for (const lang of ['sv', 'es']) {
    const n = BANK[lang].length, l = [1, 2, 3].map(k => BANK[lang].filter(i => i.lvl === k).length);
    assert.ok(l[1] + l[2] >= 60, `${lang}: ${l.join('/')} von ${n}`);
    assert.ok(l[2] >= 30, `${lang}: nur ${l[2]} schwere Sätze`);
  }
});
const pick = (niv, tlog) => app.run(`(() => { DB.st = {}; DB.tlog = ${JSON.stringify(tlog || {})}; DB.settings.niveau = '${niv}'; return pickNew('sv', 12).map(i => i.lvl + ':' + i.trap); })()`);
test('Fortgeschritten: keine Grundlagen-Sätze, solange schwerere da sind', () => {
  const got = Array.from(pick('fort'));
  assert.equal(got.length, 12);
  assert.ok(got.every(x => !x.startsWith('1:')), got.join(' '));
});
test('Fortgeschritten mit vielen Fehlern in einem Thema: dort kommen auch einfache Sätze', () => {
  const t = app.run('today()');
  const got = Array.from(pick('fort', { [t]:{ sv:{ 'p:partikel':[10, 6] } } }));
  assert.ok(got.some(x => x === '1:partikel'), got.join(' '));
});
test('Grundlagen: leichte zuerst; Mittel: alle Stufen', () => {
  const minOf = Object.fromEntries(['bisats', 'inversion', 'tempus', 'partikel', 'sin', 'tid', 'framtid', 'passiv', 'falska'].map(t => [t, Math.min(...BANK.sv.filter(i => i.trap === t).map(i => i.lvl))]));
  for (const x of Array.from(pick('grund')).slice(0, 9)) { const [l, t] = x.split(':'); assert.equal(Number(l), minOf[t], x); }
  const m = Array.from(pick('mittel')); assert.equal(m.length, 12);
});
