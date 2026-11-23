// Nomen tauschen (Spanisch, Thema „Übereinstimmung im Satz“): Vorlagen, Formen, betontes a, Prüfung, Erklärung, Auswahl.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const app = loadApp();
const run = code => { const v = app.run(code); return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; };
const T = app.get('SWAP_ES'), N = app.get('SWAP_N_ES'), lookupWord = app.get('lookupWord'), tokens = app.get('tokens');
const task = (i, from, to) => run(`swapTask(${i}, '${from}', '${to}')`);
const tplOf = start => { const i = T.findIndex(t => t[0].startsWith(start)); assert.ok(i >= 0, start); return i; };
const all = () => T.flatMap(([, l], i) => l.split(' ').map(w => ({ i, w })));
function seeded(seed){ let s = seed; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; }
const answer = (d, input) => run(`(() => {
  S.run = { lang:'es', queue:[{ type:'gen', gen:'det_es', data:${JSON.stringify(d)} }], idx:0, res:[], cur:{ state:'answer', input:${JSON.stringify(input)} } };
  check(); return S.run.cur.result; })()`);

test('Vorlagen: mindestens 36, jede mit beiden Geschlechtern, jedes Nomen bekannt und benutzt', () => {
  assert.ok(T.length >= 36, `${T.length} Vorlagen`);
  assert.equal(new Set(T.map(t => t[0])).size, T.length, 'doppelte Vorlage');
  const used = new Set();
  T.forEach(([t, l]) => {
    const ns = l.split(' ');
    assert.equal(new Set(ns).size, ns.length, t);
    assert.ok(ns.length >= 5, `${t}: nur ${ns.length} Nomen`);
    ns.forEach(w => { assert.ok(N[w], `${w} fehlt in SWAP_N_ES`); used.add(w); });
    const g = new Set(ns.map(w => N[w][0]));
    assert.equal(g.size, 2, `${t}: nur ein Geschlecht`);
    assert.equal((t.match(/\{N\}/g) || []).length, 1, t);
  });
  assert.deepEqual(Object.keys(N).filter(w => !used.has(w)), []);
  Object.entries(N).forEach(([w, v]) => assert.match(v, /^(m|f|fá) (der|die|das) \S/, w));
});
test('jede Vorlage mit jedem Nomen: ganzer Satz ohne Klammern, jedes Wort nachschlagbar', () => {
  const miss = new Set();
  all().forEach(({ i, w }) => {
    const r = run(`swapRender(SWAP_ES[${i}][0], swapNoun('${w}'))`);
    assert.doesNotMatch(r.text, /[{}]/, r.text);
    assert.match(r.text, /[.?]$/, r.text);
    tokens(r.text).forEach(x => { if (/[a-zà-ÿ]/i.test(x) && !lookupWord('es', x)) miss.add(x.toLowerCase()); });
  });
  assert.deepEqual([...miss], []);
});
test('Formen: weiblich, verkürzt, gleichbleibend', () => {
  const cases = [
    [tplOf('No hay {ningún}'), 'bar', 'farmacia', 'No hay ninguna farmacia abierta a estas horas.'],
    [tplOf('{El} {primer}'), 'día', 'semana', 'La primera semana fue dura, pero luego todo mejoró.'],
    [tplOf('{El} {primer}'), 'semana', 'día', 'El primer día fue duro, pero luego todo mejoró.'],
    [tplOf('Fue {un} {buen}'), 'día', 'noche', 'Fue una buena noche, tranquila y sin prisas.'],
    [tplOf('Es {un} {=gran}'), 'libro', 'novela', 'Es una gran novela, aunque poco conocida.'],
    [tplOf('Me duele'), 'pie', 'mano', 'Me duele mucho la mano desde ayer.'],
    [tplOf('{Ese} {N} no es'), 'coche', 'moto', 'Esa moto no es la que te dije; la mía es roja.'],
    [tplOf('Todavía me acuerdo'), 'viaje', 'noche', 'Todavía me acuerdo de aquella noche; fue inolvidable.'],
    [tplOf('{Este} {N} es {=importante}'), 'cuestión', 'tema', 'Este tema es importante, pero no urgente; lo trataremos mañana.'],
    [tplOf('Me han regalado'), 'cuadro', 'lámpara', 'Me han regalado una lámpara preciosa, pero no sé dónde ponerla.'],
    [tplOf('¿Me pasas'), 'libro', 'revista', '¿Me pasas la revista? La necesito un momento.']
  ];
  cases.forEach(([i, a, b, want]) => assert.equal(task(i, a, b).full, want));
});
test('betontes a: el nur direkt vor dem Nomen, alles andere weiblich; nicht nach un, algún, ningún oder mit todo', () => {
  const cases = [
    [tplOf('¿{El} {N}? Está'), 'café', 'agua', '¿El agua? Está fría, no la bebo.'],
    [tplOf('{Este} {N} está muy'), 'pan', 'agua', 'Esta agua está muy buena; ¿dónde la has comprado?'],
    [tplOf('Tengo {mucho}'), 'sed', 'hambre', 'Tengo mucha hambre; ¿podemos parar un momento?'],
    [tplOf('¿{Cuánto}'), 'arroz', 'agua', '¿Cuánta agua necesitas para la receta?'],
    [tplOf('{El} {N} del segundo'), 'sala', 'aula', 'El aula del segundo piso está cerrada hoy.'],
    [tplOf('{Este} {N} está {reservado}'), 'zona', 'área', 'Esta área está reservada para los socios.'],
    [tplOf('{El} {N} que vimos'), 'gato', 'águila', 'El águila que vimos ayer era pequeña, pero muy bonita.']
  ];
  cases.forEach(([i, a, b, want]) => assert.equal(task(i, a, b).full, want));
  // Wo beides üblich ist (un/una águila, todo/toda el agua), stehen keine Wörter mit betontem a
  T.forEach(([t, l]) => l.split(' ').filter(w => /á/.test(N[w].split(' ')[0])).forEach(w => {
    const before = t.slice(0, t.indexOf('{N}')).trim().split(' ').pop().toLowerCase().replace(/^[¿¡]/, '');
    assert.ok(['{el}', '{del}', '{al}', '{este}', '{ese}', '{aquel}', '{mucho}', '{tanto}', '{cuánto}', '{nuestro}'].includes(before), `${w}: ${t}`);
    assert.doesNotMatch(t, /\{todo\}/i, `${w}: ${t}`);
  }));
});
test('Prüfung: richtig angepasst ist richtig; Formen des alten Nomens, „este agua“ oder „mucho hambre“ sind falsch', () => {
  const d = task(tplOf('¿{El} {N}? Está'), 'café', 'agua');
  assert.equal(answer(d, '¿El agua? Está fría, no la bebo.'), 'ok');
  assert.equal(answer(d, 'el agua esta fria no la bebo'), 'near', 'nur Akzente');
  assert.equal(answer(d, '¿El agua? Está frío, no lo bebo.'), 'bad');
  assert.equal(answer(d, '¿La agua? Está fría, no la bebo.'), 'bad');
  const e = task(tplOf('{Este} {N} está muy'), 'pan', 'agua');
  assert.equal(answer(e, 'Este agua está muy buena; ¿dónde la has comprado?'), 'bad');
  const h = task(tplOf('Tengo {mucho}'), 'sed', 'hambre');
  assert.equal(answer(h, 'Tengo mucho hambre; ¿podemos parar un momento?'), 'bad');
  const m = task(tplOf('{Ese} {N} es bastante'), 'cuestión', 'problema');
  assert.equal(answer(m, 'Esa problema es bastante complicada, pero la resolveremos.'), 'bad');
  assert.equal(answer(m, 'Ese problema es bastante complicado, pero lo resolveremos.'), 'ok');
  assert.deepEqual(m.key, ['Ese', 'complicado', 'lo']);
});
test('Erklärung: Geschlecht, deutscher Artikel als Kontrast, Sonderregeln, höchstens 160 Zeichen', () => {
  assert.equal(task(tplOf('No encuentro'), 'llave', 'mapa').note, 'Deutsch die Karte, aber el mapa, obwohl es auf -a endet.');
  assert.equal(task(tplOf('Tengo {mucho}'), 'sed', 'hambre').note, 'Deutsch der Hunger, aber hambre ist weiblich; el hambre nur wegen des betonten a. Also mucha.');
  assert.equal(task(tplOf('¿{El} {N}? Está'), 'café', 'agua').note, 'agua ist weiblich; el agua nur wegen des betonten a. Also fría, la.');
  assert.equal(task(tplOf('Fue {un} {buen}'), 'día', 'noche').note, 'noche ist weiblich. Weiblich ohne Verkürzung: buena.');
  assert.equal(task(tplOf('Fue {un} {mal}'), 'semana', 'momento').note, 'momento ist männlich. Vor einem männlichen Nomen verkürzt: mal.');
  assert.equal(task(tplOf('Es {un} {=gran}'), 'libro', 'canción').note, 'canción ist weiblich, wie die Wörter auf -ción und -sión. gran bleibt vor beiden Geschlechtern gleich.');
  assert.equal(task(tplOf('Me duele'), 'pie', 'mano').note, 'mano ist weiblich, obwohl es auf -o endet. mucho gehört hier zum Verb und bleibt gleich.');
  assert.equal(task(tplOf('{Este} {N} es {=importante}'), 'cuestión', 'tema').note, 'tema ist männlich, wie viele Wörter auf -ma. importante und urgente haben nur eine Form.');
  // Gleiches Geschlecht: nur das Geschlecht, keine Sonderregel
  assert.equal(task(tplOf('Es {un} {=gran}'), 'libro', 'disco').note, 'disco ist männlich.');
  let max = 0;
  T.forEach(([, l], i) => { const ns = l.split(' '); ns.forEach(a => ns.forEach(b => { if (a !== b) max = Math.max(max, task(i, a, b).note.length); })); });
  assert.ok(max <= 160, `${max} Zeichen`);
});
test('Auswahl verrät nichts: jede Vorlage mit beiden Geschlechtern als Ziel; bei „el oder la?“ zuletzt falsche Wörter öfter', () => {
  const orig = Math.random;
  try {
    Math.random = seeded(11);
    const seen = {};
    for (let k = 0; k < 4000; k++) { const d = run('genSwapEs()'); const g = N[d.swap[1]][0]; (seen[d.rep] = seen[d.rep] || new Set()).add(g); assert.notEqual(d.swap[0], d.swap[1]); }
    assert.equal(Object.keys(seen).length, T.length);
    Object.entries(seen).forEach(([k, g]) => assert.equal(g.size, 2, k));
    const i = tplOf('No encuentro'), count = () => { let n = 0; for (let k = 0; k < 3000; k++) { const d = run('genSwapEs()'); if (d.rep === 'swap' + i && d.swap[1] === 'mapa') n++; } return n; };
    app.run("DB.genus = {}");
    const plain = count();
    app.run("DB.genus = { es:{ mapa:{ ok:0, bad:1, last:0 } } }");
    const weak = count();
    assert.ok(weak > plain * 1.8, `${plain} → ${weak}`);
  } finally { app.run('DB.genus = {}'); Math.random = orig; }
});
test('Wiederholungssperre zählt die Vorlage, nicht den Satz', () => {
  const genKey = app.get('genKey');
  assert.equal(genKey(task(0, 'café', 'agua')), genKey(task(0, 'té', 'leche')));
  assert.notEqual(genKey(task(0, 'café', 'agua')), genKey(task(1, 'pan', 'agua')));
});
