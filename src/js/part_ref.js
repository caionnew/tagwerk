/* ---------- Nachschlagen: Themenblatt, Listen, Beispiele im Wörterbuch ---------- */
// Ein typischer Fehler zum Thema, aus denselben Bausteinen wie „Fehler finden“
function typicalError(lang, trap){
  const c = bankSpots(lang).filter(f => f.trap === trap);
  if (c.length) return pick(c)();
  const gen = SPOT_CATS[lang][trap];
  if (!gen) return null;
  for (let k = 0; k < 40; k++) { const d = gen(); if (d.trap === trap) return d; }
  return null;
}
function openTopic(lang, trap){
  const tr = trapMeta(lang, trap); if (!tr) return;
  const items = BANK[lang].filter(i => i.trap === trap);
  let examples;
  if (tr.kind === 'gen' && tr.gen) examples = Array.from({ length:3 }, () => { const d = GENS[tr.gen].make(); return { target:d.full || d.answers[0], de:d.deLine || (d.gap ? '' : d.prompt) }; });
  else {
    const seen = items.filter(i => stOf(i.id)), pool = (seen.length >= 3 ? seen : items).slice().sort((a, b) => a.target.length - b.target.length);
    examples = shuffle(pool.slice(0, 8)).slice(0, 3).map(i => ({ target:i.target, de:i.de }));
  }
  S.pop = { type:'topic', lang, trap, examples, err:typicalError(lang, trap) };
  renderPopup();
}
function topicSheetHtml(P){
  const tr = trapMeta(P.lang, P.trap), lang = P.lang;
  const items = BANK[lang].filter(i => i.trap === P.trap);
  const seen = items.filter(i => stOf(i.id)).length, mat = items.filter(i => stOf(i.id) && (stOf(i.id).ivl || 0) >= MATURE).length;
  const rc = tr.gen && DB.gen[tr.gen] && DB.gen[tr.gen].recent;
  const stats = items.length ? `${items.length} Sätze im Thema, ${seen} geübt, ${mat} gefestigt.` : '';
  const genStat = rc && rc.length >= 10 ? ` Erzeugte Aufgaben: zuletzt ${Math.round(rc.reduce((a, x) => a + x, 0) / rc.length * 100)}\u00a0% richtig.` : '';
  const err = P.err;
  return `<div class="popov" data-a="popclose"></div><div class="pop tall" role="dialog" aria-label="${esc(tr.label)}">
    <p class="find-k">Thema</p><p class="pop-h">${esc(tr.label)}</p>
    <p class="popde"><b>${termify(tr.short)}</b></p>
    ${tr.rule ? `<p class="pop-t">${termify(tr.rule)}</p>` : ''}
    ${P.examples.length ? `<p class="pop-sub">Beispiele</p><ul class="exl">${P.examples.map(x => `<li><span class="wordrow" lang="${lang}">${linkWords(x.target, lang)}</span>${x.de ? `<span class="exg">${esc(x.de)}</span>` : ''}</li>`).join('')}</ul>` : ''}
    ${err ? `<p class="pop-sub">Typischer Fehler</p><p class="errx" lang="${lang}">${err.words.map((w, i) => err.wrong.includes(i) ? `<span class="w-bad">${esc(w)}</span>` : esc(w)).join(' ')}</p><p class="okx" lang="${lang}">${esc(err.full)}</p>` : ''}
    ${stats || genStat ? `<p class="legend" style="margin-top:12px">${stats}${genStat}</p>` : ''}
    <div class="popfoot"><button type="button" class="ghost" data-a="popclose">Schließen</button>${S.view === 'run' ? '' : `<button type="button" class="primary" data-a="trapgo" data-l="${lang}" data-t="${P.trap}">10 Aufgaben üben</button>`}</div>
  </div>`;
}
// Wo kommt das Wort sonst noch vor? Bevorzugt Sätze, die du schon geübt hast
function examplesFor(lang, w){
  const k = String(w).toLowerCase();
  const hits = BANK[lang].filter(i => tokens(i.target).some(t => t.toLowerCase() === k));
  return hits.sort((a, b) => (stOf(b.id) ? 1 : 0) - (stOf(a.id) ? 1 : 0) || a.target.length - b.target.length).slice(0, 2);
}
// Nächster Termin eines Fests ab heute
function nextDateOf(ev){
  const t = today(), y = dateOf(t).getFullYear();
  for (const yy of [y, y + 1]) { const dt = ev[1](yy); if (dt && dayDiff(ymd(dt), t) >= 0) return dt; }
  return null;
}
function viewRef(){
  const lang = S.lang, kind = S.ref, back = S.refFrom || 'extra';
  if (kind === 'topics') {
    return backBar('Grammatik kurz erklärt', back) + `<p class="lead-s">Alle Themen mit Regel, Beispielen und typischem Fehler.</p><div class="rows">${TRAPS[lang].map(tr => `<button type="button" class="row" data-a="topic" data-t="${tr.id}"><span class="txt"><span class="rt">${esc(tr.label)}</span><span class="rd">${esc(tr.short.length > 90 ? tr.short.slice(0, 88).replace(/\s\S*$/, '') + ' …' : tr.short)}</span></span></button>`).join('')}</div>`;
  }
  if (kind === 'kultur') return viewKultur(back);
  if (kind === 'terms') {
    return backBar('Grammatik-Begriffe', back) + `<p class="lead-s">Die Fachwörter aus den Erklärungen, in Alltagssprache und mit ${lang === 'sv' ? 'schwedischen' : 'spanischen'} Beispielen. In jeder Erklärung kannst du sie auch direkt antippen.</p><div class="rows">${termsFor(lang).sort((a, b) => a.t.localeCompare(b.t, 'de')).map(t => `<button type="button" class="row" data-a="term" data-k="${t.k}"><span class="txt"><span class="rt">${esc(t.t)}</span><span class="rd">${esc(t[lang][0].split('. ')[0].replace(/\.$/, ''))}.</span></span></button>`).join('')}</div>`;
  }
  if (kind === 'friends') {
    return backBar('Falsche Freunde', back) + `<p class="lead-s">Wörter, die nach Deutsch klingen und etwas anderes bedeuten.</p><div class="rows">${FALSE_FRIENDS[lang].map(f => `<div class="row static ffrow"><span class="txt"><span class="rt"><span class="wordrow" lang="${lang}">${linkWords(f[0], lang)}</span> = ${esc(f[1])}</span><span class="rd">${esc(capFirst(f[2]))}.</span></span></div>`).join('')}</div>`;
  }
  const list = EVENTS[lang].map(ev => ({ ev, dt:nextDateOf(ev) })).filter(x => x.dt).sort((a, b) => a.dt - b.dt);
  return backBar(lang === 'sv' ? 'Feste in Schweden' : 'Feste in der spanischsprachigen Welt', back) + `<p class="lead-s">Nach dem nächsten Termin sortiert.</p><div class="rows">${list.map(({ ev, dt }) => { const n = dayDiff(ymd(dt), today()); return `<div class="row static feast"><span class="txt"><span class="rt">${esc(ev[0])}<span class="find-d"> · ${dt.getDate()}. ${MONTHS_FULL[dt.getMonth()]}${n === 0 ? ' · heute' : n === 1 ? ' · morgen' : n < 60 ? ` · in ${n} Tagen` : ''}</span></span><span class="rd">${esc(ev[2])}</span><span class="feast-p"><span class="wordrow" lang="${lang}">${linkWords(ev[3], lang)}</span> <span class="find-g">${esc(ev[4])}</span></span></span>${speakBtn(ev[3], lang)}</div>`; }).join('')}</div>`;
}

// Land & Leute: Karte und Sammlung. Der Beispielsatz lässt sich in die eigenen Sätze übernehmen, passende Lesetexte sind verlinkt.
function kulturBody(e, lang, small){
  const owned = (DB.own[lang] || []).some(o => o.target === e.ex[0]);
  const add = owned ? '<span class="kadd on">✓ Im Tagwerk</span>' : `<button type="button" class="kadd" data-a="kultadd" data-id="${e.id}" aria-label="Beispielsatz ins Tagwerk übernehmen">Ins Tagwerk</button>`;
  const texts = small ? [] : (e.txt || []).map(id => textById(lang, id)).filter(Boolean);
  return `<div class="khead"><p class="find-h"><span class="wordrow" lang="${lang}">${linkWords(e.title, lang)}</span></p>${add}</div>
    <p class="find-t">${esc(e.text)}</p>
    ${e.map ? mapSvg(e.map, mapLabel(e), small) : ''}
    ${e.vars ? `<div class="kvars">${e.vars.map((v, i) => `<div class="kv"><span class="kf" aria-hidden="true">${v[0]}</span><span class="kw" lang="${lang}">${e.map && e.map.g && i < e.map.g.length ? `<span class="kdot mg${i}${(e.map.soft || []).includes(i) ? ' msoft' : ''}" aria-hidden="true"></span>` : ''}${esc(v[1])}</span><span class="kr">${esc(v[2])}</span></div>`).join('')}</div>` : ''}
    <div class="find-p"><span class="wordrow" lang="${lang}">${linkWords(e.ex[0], lang)}</span>${speakBtn(e.ex[0], lang)}<span class="find-g">${esc(e.ex[1])}</span></div>
    ${texts.length ? `<p class="kmore">${texts.length > 1 ? 'Lesetexte' : 'Lesetext'}: ${texts.map(t => `<button type="button" class="link" data-a="textopen" data-id="${t.id}" data-back="ref">${esc(t.title)}</button>`).join(' · ')}</p>` : ''}`;
}
// Übersicht: Filter nach Kategorie (mit Anzahl), Kategorien mit den Karten zuerst
function viewKultur(back){
  const lang = S.lang, list = KULTUR[lang], cats = Object.keys(KULTUR_CATS).filter(c => list.some(e => e.cat === c));
  const cur = cats.includes(S.kultCat) ? S.kultCat : 'alle';
  const chip = (c, label, n) => `<button type="button" role="radio" aria-checked="${cur === c}" data-a="kultcat" data-c="${c}">${label}<span class="kn">${n}</span></button>`;
  const cards = items => items.map(e => `<section class="find kcard">${kulturBody(e, lang)}</section>`).join('');
  return backBar('Land & Leute', back) + `<p class="lead-s">${lang === 'sv' ? 'Schweden und das Schwedische' : 'Spanien, Lateinamerika und das Spanische'} in ${list.length} Einblicken. „Ins Tagwerk“ übernimmt den Beispielsatz in deine Wiederholungen.</p>`
    + `<div class="kchips" role="radiogroup" aria-label="Kategorie">${chip('alle', 'Alle', list.length)}${cats.map(c => chip(c, KULTUR_CATS[c], list.filter(e => e.cat === c).length)).join('')}</div>`
    + (cur === 'alle' ? cats.map(c => `<h2 class="grp">${KULTUR_CATS[c]}</h2>${cards(list.filter(e => e.cat === c))}`).join('') : cards(list.filter(e => e.cat === cur)));
}

// Karten: Länder in Gruppenfarben, passend zu den Punkten an den Zeilen darunter. Daten aus geo.js (Natural Earth).
let mapSeq = 0;
function mapSvg(m, label, small){
  const g = GEO[m.v]; if (!g) return '';
  const col = {}; (m.g || []).forEach((keys, i) => keys.forEach(k => { col[k] = i; }));
  const cls = k => col[k] != null ? `mg${col[k]}${(m.soft || []).includes(col[k]) ? ' msoft' : ''}` : (m.ctx || []).includes(k) ? 'mctx' : 'mland';
  let extra = '';
  if (m.norrland && g.c.SWE) { const id = 'nc' + (++mapSeq); extra += `<clipPath id="${id}"><path d="${g.norrClip}"/></clipPath><path d="${g.c.SWE}" clip-path="url(#${id})" class="mnorr"/>`; }
  // Ein Teil eines Landes in Gruppenfarbe, etwa Schonen: das Land, beschnitten auf die Region
  if (m.clip && g.c[m.clip.k] && g[m.clip.p]) { const id = 'kc' + (++mapSeq); extra += `<clipPath id="${id}"><path d="${g[m.clip.p]}"/></clipPath><path d="${g.c[m.clip.k]}" clip-path="url(#${id})" class="mg${m.clip.g}"/>`; }
  if (m.polar && g.polar) extra += `<path d="${g.polar}" class="mpolar"/><text x="6" y="${(g.pts.Kiruna ? g.pts.Kiruna[1] + 12 : 40)}" class="mlab mlab-s">Polarkreis</text>`;
  // Ortsname rechts vom Punkt, mit „<“ am Ende links davon
  (m.pts || []).forEach(raw => { const left = raw.endsWith('<'), n = raw.replace(/[<>]$/, ''), p = g.pts[n]; if (!p) return; const right = raw.endsWith('>') || (!left && p[0] < g.w * 0.62); extra += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" class="mpt"/><text x="${p[0] + (right ? 5 : -5)}" y="${p[1] + 3.5}" text-anchor="${right ? 'start' : 'end'}" class="mlab">${n}</text>`; });
  return `<svg class="map${small ? ' map-sm' : ''} map-${m.v}" viewBox="0 0 ${g.w} ${g.h}" role="img" aria-label="${esc(label)}"><path d="${g.base}" class="mland"/>${Object.keys(g.c).map(k => `<path d="${g.c[k]}" class="${cls(k)}"/>`).join('')}${extra}</svg>`;
}
function mapLabel(e){
  if (e.vars && e.map && e.map.g && e.map.g.length) return 'Karte: ' + e.vars.slice(0, e.map.g.length).map(v => `${v[1]}: ${v[2]}`).join('; ');
  return 'Karte zu ' + e.title;
}
