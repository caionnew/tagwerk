// Verbformen beider Sprachen (src/js/verbformen.js) und was das Wörterbuch daraus macht (glossForms in src/data/gloss.js).
// Die Formen aller Verben, die das Wörterbuch kennt, sind gelesen und stehen in tests/fixtures/verbformen.txt.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs');
const { loadApp } = require('../helpers/load.js');
const { listing, FILE } = require('../../tools/verbformen.js');
const app = loadApp();
const esConj = app.get('esConj'), svConj = app.get('svConj'), svGroup = app.get('svGroup'), lookupWord = app.get('lookupWord'), conjugate = app.get('conjugate');
const row = (inf, t) => [...esConj(inf)[t]].join(' ');
const look = (lang, w) => { const e = lookupWord(lang, w); return e ? `${e.l || '-'} | ${e.de}` : null; };

test('Verbformen: alle gelesen (tests/fixtures/verbformen.txt)', () => {
  const now = listing(app), read = fs.readFileSync(FILE, 'utf8');
  if (now === read) return;
  const a = new Set(read.split('\n')), b = new Set(now.split('\n'));
  const added = [...b].filter(l => l && !a.has(l)), gone = [...a].filter(l => l && !b.has(l));
  assert.fail(`Verbformen haben sich geändert. Neue Zeilen lesen; falsche Gruppe oder fehlender Stammwechsel in die Listen in src/js/verbformen.js, dann node tools/verbformen.js --write\nneu:\n${added.join('\n')}\nweg:\n${gone.join('\n')}`);
});

test('Spanisch: Stammwechsel, auch in der 3. Person Indefinido, im Subjuntivo mit nosotros und im Gerundium', () => {
  assert.equal(row('sentir', 'pres'), 'siento sientes siente sentimos sentís sienten');
  assert.equal(row('sentir', 'indef'), 'sentí sentiste sintió sentimos sentisteis sintieron');
  assert.equal(row('sentir', 'subj'), 'sienta sientas sienta sintamos sintáis sientan');
  assert.equal(row('dormir', 'ra'), 'durmiera durmieras durmiera durmiéramos durmierais durmieran');
  assert.equal(row('encontrar', 'pres'), 'encuentro encuentras encuentra encontramos encontráis encuentran');
  assert.equal(row('pedir', 'subj'), 'pida pidas pida pidamos pidáis pidan');
  assert.deepEqual([esConj('seguir').ger, esConj('dormir').ger, esConj('leer').ger, esConj('construir').ger], ['siguiendo', 'durmiendo', 'leyendo', 'construyendo']);
});

test('Spanisch: Rechtschreibung vor der Endung und betontes i/u', () => {
  assert.equal(row('buscar', 'subj'), 'busque busques busque busquemos busquéis busquen');
  assert.equal(row('madrugar', 'indef').split(' ')[0], 'madrugué');
  assert.equal(row('averiguar', 'subj').split(' ')[0], 'averigüe');
  assert.equal(row('conocer', 'subj'), 'conozca conozcas conozca conozcamos conozcáis conozcan');
  assert.equal(row('coger', 'subj'), 'coja cojas coja cojamos cojáis cojan');
  assert.equal(row('construir', 'pres'), 'construyo construyes construye construimos construís construyen');
  assert.equal(row('enviar', 'pres'), 'envío envías envía enviamos enviáis envían');
  assert.equal(row('continuar', 'subj').split(' ')[2], 'continúe');
  assert.equal(row('reunir', 'pres'), 'reúno reúnes reúne reunimos reunís reúnen');
  assert.equal(row('prohibir', 'subj').split(' ')[3], 'prohibamos');
  assert.equal(row('diseñar', 'indef').split(' ')[2], 'diseñó');
  assert.equal(row('reducir', 'indef'), 'reduje redujiste redujo redujimos redujisteis redujeron');
  assert.equal(row('creer', 'indef'), 'creí creíste creyó creímos creísteis creyeron');
});

test('Spanisch: Zusammensetzungen wie das Grundverb, aber nicht jedes Verb auf -estar', () => {
  assert.equal(row('mantener', 'indef').split(' ')[0], 'mantuve');
  assert.equal(row('mantener', 'fut').split(' ')[0], 'mantendré');
  assert.deepEqual([esConj('devolver').part, esConj('describir').part, esConj('componer').part, esConj('deshacer').part], ['devuelto', 'descrito', 'compuesto', 'deshecho']);
  assert.equal(row('contestar', 'ra').split(' ')[0], 'contestara');
  assert.equal(row('prestar', 'indef').split(' ')[2], 'prestó');
  assert.equal(row('sonreír', 'pres').split(' ')[0], 'sonrío');
});

test('Spanisch: unregelmäßige Verben in allen Personen, vosotros ergänzt', () => {
  assert.equal(row('ser', 'pres'), 'soy eres es somos sois son');
  assert.equal(row('dar', 'subj'), 'dé des dé demos deis den');
  assert.equal(row('haber', 'se'), 'hubiese hubieses hubiese hubiésemos hubieseis hubiesen');
  assert.equal(row('oír', 'pres'), 'oigo oyes oye oímos oís oyen');
  assert.deepEqual([...esConj('decir').impv], ['di', 'decid']);
  assert.deepEqual([...esConj('soler').indef], []);
  // Die Übungsformen fragen fünf Personen ab (ohne vosotros)
  assert.equal(conjugate('tener', 'pres', 4), 'tienen');
});

test('Schwedisch: Formen je Gruppe, starke Verben und Zusammensetzungen', () => {
  const s = c => `${c.pres} ${c.past.join('/')} ${c.sup}`;
  assert.equal(s(svConj('prata', 1)), 'pratar pratade pratat');
  assert.equal(s(svConj('stänga', 2)), 'stänger stängde stängt');
  assert.equal(s(svConj('köpa', 2)), 'köper köpte köpt');
  assert.equal(s(svConj('använda', 2)), 'använder använde använt');
  assert.equal(s(svConj('möta', 2)), 'möter mötte mött');
  assert.equal(s(svConj('köra', 2)), 'kör körde kört');
  assert.equal(s(svConj('tro', 3)), 'tror trodde trott');
  assert.equal(s(svConj('översätta')), 'översätter översatte översatt');
  assert.equal(s(svConj('anta')), 'antar antog antagit');
  assert.deepEqual([...svConj('stjäla').part], ['stulen', 'stulet', 'stulna']);
  assert.deepEqual([...svConj('göra').part], ['gjord', 'gjort', 'gjorda']);
  assert.equal(svConj('bestämma', 2).pass[0], 'bestäms');
  assert.equal(svConj('läsa', 2).pass[0], 'läses');
  assert.equal(svConj('vakna', 1).part.length, 0);
});

test('Schwedisch: Gruppe aus den Formen im Wörterbuch, sonst aus den Listen', () => {
  assert.equal(svGroup('missa', new Set(['missade'])), 1);
  assert.equal(svGroup('stänga', new Set(['stängde'])), 2);
  assert.equal(svGroup('tro', new Set(['tror'])), 3);
  assert.equal(svGroup('renovera', new Set()), 1);
  assert.equal(svGroup('röka', new Set()), 2);
  assert.equal(svGroup('skriva', new Set()), 0);
  // bevara ist nicht be + vara, befara nicht be + fara
  assert.deepEqual([svGroup('bevara', new Set()), svGroup('befara', new Set())], [1, 1]);
});

test('Wörterbuch: abgeleitete Formen mit Grundform und Bedeutung', () => {
  assert.equal(look('es', 'tendríamos'), 'tener | haben (Konditional, nosotros)');
  assert.equal(look('es', 'despidieron'), 'despedir | verabschieden (Indefinido, ellos, ellas)');
  assert.equal(look('es', 'quejado'), 'quejarse | sich beschweren (Partizip)');
  assert.equal(look('es', 'continúa'), 'continuar | weitermachen, fortsetzen (Präsens, él, ella, usted / Imperativ, tú)');
  assert.equal(look('sv', 'stängts'), 'stänga | schließen (Passiv, Supinum)');
  assert.equal(look('sv', 'påstås'), 'påstå | behaupten (Passiv)');
  assert.equal(look('sv', 'mints'), 'minnas | sich erinnern (Supinum, mit har)');
  // Bedeutet die Form mit se etwas anderes, steht es dabei
  assert.match(look('es', 'llama'), /llamarse = heißen/);
  // Zwei Verben mit derselben Form: beide
  assert.match(look('es', 'siento'), /sentar: .*; sentir: /);
  // Einträge von Hand gehen vor
  assert.equal(look('es', 'llamo'), 'llamar | ich rufe an; me llamo = ich heiße');
});

test('Wörterbuch: Verb mit angehängten Pronomen', () => {
  assert.equal(look('es', 'explicártelo'), 'explicar | erklären (Infinitiv + te + lo)');
  assert.equal(look('es', 'trayéndonoslas'), 'traer | bringen (Gerundium + nos + las)');
  assert.equal(look('es', 'échame'), 'echar | werfen (Imperativ + me)');
  assert.equal(look('es', 'dígame'), 'decir | sagen (Imperativ, usted + me)');
  assert.equal(look('es', 'concentrarme'), 'concentrarse | sich konzentrieren (Infinitiv + me)');
  assert.equal(look('es', 'irme'), 'ir | gehen, fahren (Infinitiv + me)');
  // Kein Verb davor: nichts (pasos ist der Plural von paso, nosotros ein Pronomen)
  assert.equal(lookupWord('es', 'pasos').l, 'paso');
  assert.equal(look('es', 'nosotros'), '- | wir');
});

test('Wörterbuch: Mehrzahl nicht über gebeugte Verbformen, wohl über Partizipien', () => {
  // comes ist eine eigene Form (tú), nicht die Mehrzahl von come
  assert.match(look('es', 'comes'), /^comer \| essen.* \(Präsens, tú\)$/);
  assert.equal(lookupWord('es', 'cerradas').l, 'cerrado');
});

test('Wörterbuch: kein Schlüssel doppelt (sonst gilt stillschweigend nur der erste)', () => {
  const RAW = app.get('GLOSS_RAW');
  for (const lang of ['sv', 'es']) {
    const seen = new Map();
    RAW[lang].split('\n').forEach(l => { const p = l.split('|'); if (p.length !== 3 || !p[0].trim()) return; const k = p[0].trim().toLowerCase(); seen.set(k, (seen.get(k) || 0) + 1); });
    assert.deepEqual([...seen].filter(([, n]) => n > 1).map(([k]) => k), [], lang);
  }
});
