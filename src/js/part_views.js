/* ---------- Ansichten ---------- */
const FOCUS_VIEWS = ['run', 'runDone', 'radio', 'texts', 'text', 'shadow', 'write', 'own', 'tat', 'pickTopic', 'pickGen', 'settings', 'ref'];
const linkWords = (text, lang) => String(text).split(' ').map(w => /[A-Za-zÀ-ÿ0-9]/.test(w) ? `<span data-a="lookup" data-w="${esc(w.replace(/^[¿¡"„“«(]+|[.!?,;:"„“”»)…]+$/g, ''))}">${esc(w)}</span>` : esc(w)).join(' ');
const MONTHS_FULL = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
function monthRecap(){
  const t = today(), day = Number(t.slice(8, 10));
  if (day > 7) return '';
  const y = Number(t.slice(0, 4)), m = Number(t.slice(5, 7));
  const pm = m === 1 ? 12 : m - 1, py = m === 1 ? y - 1 : y, prefix = `${py}-${String(pm).padStart(2, '0')}-`;
  let days = 0, n = 0, secs = 0, mat = 0;
  Object.keys(DB.log).filter(k => k.startsWith(prefix)).forEach(k => {
    let any = false;
    ['sv', 'es'].forEach(l => { const x = dayLog(k, l); if (x.n) { any = true; n += x.n; } secs += x.secs || 0; mat += x.mat || 0; });
    if (any) days++;
  });
  if (!n) return '';
  let yearLine = '';
  if (m === 1) {
    let yd = 0, yn = 0, ys = 0, ym = 0;
    Object.keys(DB.log).filter(k => k.startsWith(`${y - 1}-`)).forEach(k => { let any = false; ['sv', 'es'].forEach(l => { const x = dayLog(k, l); if (x.n) { any = true; yn += x.n; } ys += x.secs || 0; ym += x.mat || 0; }); if (any) yd++; });
    if (yd) yearLine = `<p class="recap"><b>Dein Jahr ${y - 1}:</b> an ${plural(yd, 'Tag', 'Tagen')} geübt, ${yn.toLocaleString('de-DE')} Aufgaben${ys ? `, ${fmtMin(ys)}` : ''}${ym ? `, ${plural(ym, 'Satz', 'Sätze')} neu gefestigt` : ''}.</p>`;
  }
  return yearLine + `<p class="recap"><b>${MONTHS_FULL[pm - 1]}:</b> an ${plural(days, 'Tag', 'Tagen')} geübt, ${n} Aufgaben${secs ? `, ${fmtMin(secs)}` : ''}${mat ? `, ${plural(mat, 'Satz', 'Sätze')} neu gefestigt` : ''}.</p>`;
}
const langSeg = () => `<div class="langseg" role="radiogroup" aria-label="Sprache">${['es', 'sv'].map(k => `<button type="button" role="radio" aria-checked="${S.lang === k}" data-a="lang" data-l="${k}" lang="${k}">${LANG[k].name}</button>`).join('')}</div>`;
const noticeHtml = () => (S.notice ? `<div class="notice ${S.notice.kind}" role="status"><span>${esc(S.notice.text)}</span>${S.notice.action ? `<button type="button" class="link" data-a="${S.notice.action.a}">${esc(S.notice.action.label)}</button>` : ''}</div>` : '');
const charbar = lang => `<div class="chars">${LANG[lang].chars.map(c => `<button type="button" class="ch" data-a="char" data-c="${c}" lang="${lang}" aria-label="${c} einfügen">${c}</button>`).join('')}</div>`;
const backBar = (title, to) => `<div class="backbar"><button type="button" class="x" data-a="tab" data-v="${to || 'extra'}" aria-label="Zurück">‹</button><h1 class="vt">${esc(title)}</h1></div>`;
const row = (a, title, desc, extra, ico) => `<button type="button" class="row${ICONS[ico || a] ? ' has-ico' : ''}" data-a="${a}"${extra || ''}>${ICONS[ico || a] ? `<span class="rico">${ICONS[ico || a]}</span>` : ''}<span class="txt"><span class="rt">${esc(title)}</span>${desc ? `<span class="rd">${esc(desc)}</span>` : ''}</span></button>`;

function tabs(){
  const nav = $('#tabs');
  const focus = FOCUS_VIEWS.includes(S.view);
  nav.hidden = focus;
  document.body.classList.toggle('focus', focus);
  if (focus) return;
  let active = S.view;
  if (S.view === 'runDone') active = S.run && S.run.kind === 'daily' ? 'home' : 'extra';
  nav.innerHTML = [['home','Heute'], ['extra','Üben'], ['progress','Fortschritt']].map(([v, l]) => `<button type="button" data-a="tab" data-v="${v}"${active === v ? ' aria-current="page"' : ''}>${ICONS[v]}<span>${l}</span></button>`).join('');
}
const GEAR = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>';
const gearBtn = () => `<button type="button" class="iconbtn" data-a="settings" aria-label="Einstellungen">${GEAR}</button>`;
function topLine(){ return `<div class="topline">${langSeg()}${gearBtn()}</div>`; }
function streakBox(){
  const sd = streakData(), t = today(), mo = mondayOf(t), y = addDays(t, -1);
  let hasFree = false, hasSome = false;
  const dots = ['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((l, i) => {
    const ds = addDays(mo, i);
    const some = !DB.done[ds] && ((dayLog(ds, 'sv').n || 0) + (dayLog(ds, 'es').n || 0)) > 0;
    const free = !DB.done[ds] && !some && sd.free.has(ds);
    if (free) hasFree = true;
    if (some) hasSome = true;
    return `<span class="wd${DB.done[ds] ? ' on' : some ? ' some' : free ? ' free' : ''}${ds === t ? ' now' : ''}${ds > t ? ' fut' : ''}"><i></i>${l}</span>`;
  }).join('');
  let line;
  if (!sd.current) line = DB.done[t] ? 'Heute erledigt. Ziel: jeden Tag ein Tagwerk.' : 'Ziel: jeden Tag ein Tagwerk. Ein freier Tag pro Woche ist erlaubt.';
  else if (DB.done[t]) line = `${plural(sd.current, 'Tag', 'Tage')} in Folge. Heute erledigt.`;
  else if (sd.free.has(y)) line = `${plural(sd.current, 'Tag', 'Tage')} in Folge. Gestern war dein freier Tag, heute braucht es ein Tagwerk.`;
  else line = `${plural(sd.current, 'Tag', 'Tage')} in Folge. Mit dem heutigen Tagwerk werden es ${sd.current + 1}.`;
  return `<div class="weekgoal"><div class="wdots" aria-hidden="true">${dots}</div><p class="wtext">${line}</p>${hasSome ? '<p class="wleg"><i class="half"></i>Halb gefüllt: geübt, aber kein Tagwerk</p>' : ''}${hasFree ? '<p class="wleg"><i></i>Gestrichelt: freier Tag, die Serie läuft weiter</p>' : ''}</div>`;
}
function findHtml(lang){
  const f = fundstueck(lang), L = LANG[lang];
  if (f.kind === 'event') {
    const when = f.diff === 0 ? 'heute' : f.diff === 1 ? 'morgen' : `in ${f.diff} Tagen`;
    return `<section class="find"><p class="find-k">${lang === 'sv' ? 'Bald in Schweden' : 'Bald in der spanischsprachigen Welt'} · ${when}</p>
      <p class="find-h">${esc(f.ev[0])}<span class="find-d"> · ${f.dt.getDate()}. ${MONTHS_FULL[f.dt.getMonth()]}</span></p>
      <p class="find-t">${esc(f.ev[2])}</p>
      <div class="find-p"><span class="wordrow" lang="${lang}">${linkWords(f.ev[3], lang)}</span>${speakBtn(f.ev[3], lang)}<span class="find-g">${esc(f.ev[4])}</span></div>
      <button type="button" class="link find-more" data-a="ref" data-r="feasts">Alle Feste im Jahr</button></section>`;
  }
  if (f.kind === 'recall') {
    const open = S.findOpen === f.item.id;
    const ago = f.ago < 14 ? `vor ${f.ago} Tagen` : f.ago < 60 ? `vor ${Math.round(f.ago / 7)} Wochen` : `vor ${Math.round(f.ago / 30)} Monaten`;
    return `<section class="find"><p class="find-k">Erinnerst du dich? · zuletzt ${ago} geübt</p>
      <p class="find-h find-de" lang="de">${esc(f.item.de)}</p>
      ${open ? `<div class="find-p reveal"><span class="wordrow" lang="${lang}">${linkWords(f.item.target, lang)}</span>${speakBtn(f.item.target, lang)}</div><p class="find-g" style="margin:6px 0 0">Zählt nicht für den Wiederholungsplan.</p>` : `<button type="button" class="link" data-a="findopen" data-id="${f.item.id}">Auflösen</button>`}</section>`;
  }
  if (f.kind === 'kultur') return `<section class="find"><p class="find-k">Land & Leute · ${KULTUR_CATS[f.e.cat]}</p>${kulturBody(f.e, lang, true)}<button type="button" class="link find-more" data-a="ref" data-r="kultur">Alle ${KULTUR[lang].length} ansehen</button></section>`;
  const ff = f.ff;
  return `<section class="find"><p class="find-k">Falscher Freund</p>
    <p class="find-h"><span class="wordrow" lang="${lang}">${esc(ff[0])}</span> = ${esc(ff[1])}</p>
    <p class="find-t">Achtung: ${esc(ff[2])}.</p>
    <button type="button" class="link find-more" data-a="ref" data-r="friends">Alle ${FALSE_FRIENDS[lang].length} falschen Freunde</button></section>`;
}
function backupHint(){
  const tot = totals(), t = today();
  if (tot.days < 30) return '';
  const since = DB.lastBackup ? dayDiff(t, DB.lastBackup) : tot.days;
  const nag = DB.used && DB.used.backupNag;
  if (since < 90 || (nag && dayDiff(t, nag) < 30)) return '';
  return `<div class="notice ok"><span>${DB.lastBackup ? `Dein letztes Backup ist ${Math.round(since / 30)} Monate her.` : `Du übst seit ${tot.days} Tagen und hast noch kein Backup.`} Der Fortschritt liegt nur auf diesem Gerät.</span><button type="button" class="link" data-a="export">Sichern</button><button type="button" class="link dim" data-a="nagoff">Später</button></div>`;
}
function viewHome(){
  const lang = S.lang;
  const od = openDaily();
  const running = od && od.lang === lang;
  const doneToday = !!DB.done[today()];
  const intro = !(DB.used && DB.used.intro) ? `<section class="intro"><p class="intro-h">So funktioniert Tagwerk</p><p>Einmal am Tag eine Runde von etwa 5 bis 10 Minuten: neue Sätze, Wiederholungen und kurzes Grammatik-Training. Jeder Satz kommt wieder, bevor du ihn vergessen würdest. Was du nicht wusstest, schon am nächsten Tag, was sitzt, erst nach Wochen.</p><button type="button" class="link" data-a="introok">Verstanden</button></section>` : '';
  let card;
  if (running) {
    const left = od.queue.length - od.idx;
    card = `<p class="eyebrow">Tagwerk läuft</p><p class="num">Noch ${plural(left, 'Aufgabe', 'Aufgaben')}</p><p class="breakdown">Etwa ${minutes(od.queue.slice(od.idx))} Minuten. Du machst dort weiter, wo du aufgehört hast.</p><button type="button" class="primary" data-a="daily">Fortsetzen</button>`;
  } else if (doneToday) {
    const p = dailyPlan(lang);
    card = `<p class="eyebrow">Heute</p><p class="num">Tagwerk erledigt</p><p class="breakdown">Wenn du noch Zeit hast:</p>
      <div class="choices">
        <button type="button" class="row" data-a="tab" data-v="extra"><span class="txt"><span class="rt">Weiter üben</span><span class="rd">Kurze Runden, Grammatik-Training, Schreiben oder ein Thema gezielt üben.</span></span></button>
        ${(() => { const avail = BANK[lang].filter(i => !stOf(i.id)).length; if (!avail) return ''; const opts = [3, 6, 10].filter(n => n <= avail); if (!opts.length) opts.push(avail);
          return `<div class="row chiprow"><span class="txt"><span class="rt">Weitere neue Sätze lernen</span><span class="rd">Sie kommen ab morgen zur Wiederholung dazu, die nächsten Tagwerke werden etwas länger.</span></span><span class="chips" role="group" aria-label="Wie viele?">${opts.map(n => `<button type="button" class="chip" data-a="moreNew" data-n="${n}">${n}</button>`).join('')}</span></div>`; })()}
      </div>`;
  } else {
    const p = dailyPlan(lang);
    const parts = [];
    if (p.due) parts.push(`<li><b>${p.due}</b> ${p.due === 1 ? 'Wiederholung' : 'Wiederholungen'}<span>Sätze, die heute wieder dran sind</span></li>`);
    if (p.fresh) parts.push(`<li><b>${p.fresh}</b> ${p.fresh === 1 ? 'neuer Satz' : 'neue Sätze'}<span>gezielt zu typischen Fehlern</span></li>`);
    if (p.genN) { const lab = p.genLabels; parts.push(`<li><b>${p.genN}</b> Grammatik-Aufgaben<span>${esc(lab.length > 2 ? `${lab.slice(0, 2).join(', ')} und ${lab.length - 2} weitere` : lab.join(' und '))}</span></li>`); }
    card = `<p class="eyebrow">Heute</p><p class="num">${plural(p.queue.length, 'Aufgabe', 'Aufgaben')}, etwa ${minutes(p.queue)} Minuten</p>
      <ul class="plan2">${parts.join('')}</ul>
      <button type="button" class="primary" data-a="daily">Tagwerk starten</button>
      <p class="hint lenlink">Länge: ${size().label}, ${size().newPer} neue Sätze pro Tag. <button type="button" class="link" data-a="toSettings">Ändern</button></p>`;
    if (!p.fresh) card += DB.settings.refill ? `<p class="hint">Gerade keine neuen Sätze vorrätig. Neue kommen automatisch von Tatoeba, sobald du online bist.</p>` : `<p class="hint">Alle Sätze sind eingeführt. <button type="button" class="link" data-a="tat">Beispielsätze suchen</button></p>`;
  }
  const dnow = dateOf(today());
  const hello = `<header class="hello"><p class="hello-g wordrow" lang="${lang}">${linkWords(greeting(lang), lang)}</p><p class="hello-d">${WDAYS_FULL[dnow.getDay()]}, ${dnow.getDate()}. ${MONTHS_FULL[dnow.getMonth()]}</p></header>`;
  return `${topLine()}${hello}${noticeHtml() || backupHint()}${intro}${monthRecap()}<section class="today hero">${card}</section>${streakBox()}${weakHtml(lang)}${findHtml(lang)}`;
}
function topicRows(lang){
  const traps = TRAPS[lang].map(t => t.id).concat(BANK[lang].some(i => i.trap === 'eigene') ? ['eigene'] : []);
  return traps.map(id => {
    const tr = trapMeta(lang, id);
    if (tr.kind === 'gen') {
      const g = DB.gen[tr.gen] || { ok:0, bad:0 };
      const n = g.ok + g.bad;
      return { id, label:tr.label, pct:n ? Math.round(g.ok / n * 100) : 0, text:n ? `${Math.round(g.ok / n * 100)} % richtig` : 'noch nicht geübt', touched:n > 0 };
    }
    const items = BANK[lang].filter(i => i.trap === id);
    const seen = items.filter(i => stOf(i.id)).length;
    const mature = items.filter(i => stOf(i.id) && (stOf(i.id).ivl || 0) >= MATURE).length;
    return { id, label:tr.label, pct:items.length ? Math.round(mature / items.length * 100) : 0, text:seen ? `${seen} von ${items.length} Sätzen geübt, ${mature} gefestigt` : `${items.length} Sätze, noch nicht begonnen`, short:`${mature}/${items.length}`, touched:seen > 0 };
  });
}
const barRow = r => `<span class="txt"><span class="rt">${esc(r.label)}</span><span class="rd">${esc(r.text)}</span></span><span class="bar" aria-hidden="true"><span style="width:${Math.max(3, r.pct)}%"></span></span>`;
function weakHtml(lang){
  const rows = topicRows(lang).filter(r => r.touched).sort((a, b) => a.pct - b.pct).slice(0, 3);
  if (!rows.length) return '';
  return `<div class="grprow"><h2 class="grp">Schwächste Themen</h2><span class="grpnote">Tippen zum Üben</span></div><div class="rows">${rows.map(r => `<button type="button" class="row bars" data-a="trapgo" data-t="${r.id}">${barRow(r)}</button>`).join('')}</div>`;
}
function viewExtra(){
  const lang = S.lang, L = LANG[lang];
  const seen = BANK[lang].filter(i => stOf(i.id)).length;
  const noVoice = canSpeak() && !voiceFor(lang);
  const later = 'Geht, sobald du drei Sätze geübt hast';
  const withAudio = BANK[lang].filter(i => stOf(i.id) && i.tat && i.tat.audio && !i.tat.audio.blocked).length;
  const canHear = canSpeak() || withAudio >= 3;
  const noHear = 'Diese Ansicht kann nicht vorlesen. In Chrome oder der installierten App geht es.';
  const off = !canHear || seen < 3 ? ' disabled' : '';
  const g = (k, t, dsc, ico) => row('form', t, dsc, ` data-g="${k}_${lang}"`, ico);
  return `${topLine()}${noticeHtml()}
  ${noVoice && !(DB.used && DB.used.voiceWarn && dayDiff(today(), DB.used.voiceWarn) < 30) ? `<div class="notice warn"><span>Zum Vorlesen fehlt eine ${L.deName}-Stimme. Du kannst sie in den Android-Einstellungen unter „Sprachausgabe“ herunterladen.</span><button type="button" class="link dim" data-a="voiceoff">Ausblenden</button></div>` : ''}
  <h2 class="grp">Kurz zwischendurch</h2>
  <div class="rows">${row('quick', 'Kurze Runde', seen < 3 ? '6 Grammatik-Aufgaben für den Anfang' : '6 Aufgaben aus bekannten Sätzen')}${g('genus', lang === 'sv' ? 'en oder ett?' : 'el oder la?', 'Das Genus in schnellen Runden', 'genus')}${g('time', 'Uhrzeiten & Zahlen', 'Für Bahnhof, Laden und Verabredung', 'time')}</div>
  <h2 class="grp">Grammatik</h2>
  <div class="rows">${row('pickTopic', 'Thema üben', '10 Aufgaben zu einem Thema')}${row('forms', 'Grammatik-Training', 'Endlos neue Aufgaben: ' + genIds(lang).map(x => GENS[x].short || GENS[x].label).join(', '))}${g('spot', 'Fehler finden', 'Ein typischer Fehler steckt im Satz', 'spot')}${g('trans', 'Umbauen', 'Sätze umformen, ganz ohne Deutsch', 'trans')}</div>
  <h2 class="grp">Lesen und Hören</h2>
  <div class="rows">${row('texts', 'Lesetexte', `${TEXTS[lang].length} kurze Texte zum Lesen oder Hören, mit Fragen`, '', 'book')}${row('wiki', 'Wikipedia-Fundstück', 'Ein zufälliger Artikel zum Lesen oder Hören (online)', '', 'book')}</div>
  <h2 class="grp">Hören und Sprechen</h2>
  <div class="rows">${row('dict', 'Hördiktat', !canHear ? noHear : seen < 3 ? later : 'Hören und aufschreiben', off)}${row('shadow', 'Nachsprechen', !canHear ? noHear : seen < 3 ? later : canListen() ? 'Mitsprechen und die Aussprache prüfen' : 'Anhören, mitsprechen, aufnehmen', off)}${row('radio', 'Hörrunde', !canSpeak() ? noHear : seen < 3 ? later : 'Geübte Sätze nebenbei hören, ohne Antippen', !canSpeak() || seen < 3 ? ' disabled' : '', 'dict')}</div>
  <h2 class="grp">Schreiben und Sammeln</h2>
  <div class="rows">${row('write', 'Text schreiben', 'Ein paar Sätze, mit Prüfung (online)')}${row('tat', 'Beispielsätze suchen', 'Echte Sätze aus Tatoeba (online)')}${row('own', 'Eigenen Satz eintragen', 'Aus Podcast, Gespräch oder Korrektur')}</div>
  <h2 class="grp">Nachschlagen</h2>
  <div class="rows">${row('ref', 'Grammatik kurz erklärt', 'Alle Regeln mit Beispielen', ' data-r="topics"', 'book')}${row('ref', 'Grammatik-Begriffe', 'Supinum, Subjuntivo & Co. in Alltagssprache', ' data-r="terms"', 'terms')}${row('ref', 'Land & Leute', `${KULTUR[lang].length} Einblicke in Alltag, Gesellschaft und Geografie`, ' data-r="kultur"', 'globe')}${row('ref', 'Falsche Freunde', `${FALSE_FRIENDS[lang].length} Wörter, die anders gemeint sind`, ' data-r="friends"', 'friends')}${row('ref', lang === 'sv' ? 'Feste in Schweden' : 'Feste und Feiertage', `${EVENTS[lang].length} Feste, nach Datum sortiert`, ' data-r="feasts"', 'feast')}</div>`;
}
function viewPickTopic(){
  const lang = S.lang;
  return backBar('Thema üben') + `<p class="lead-s">10 Aufgaben zu einem Thema, auch mit neuen Sätzen. Der Balken zeigt, wie viele Sätze des Themas schon gefestigt sind.</p><div class="rows">${topicRows(lang).map(r => `<button type="button" class="row bars" data-a="trapgo" data-t="${r.id}">${barRow(r)}</button>`).join('')}</div>`;
}
function viewPickGen(){
  const lang = S.lang;
  return backBar('Grammatik-Training') + `<p class="lead-s">Die Aufgaben werden nach festen Regeln immer neu erzeugt. Du kannst jederzeit aufhören.</p><div class="rows">${genIds(lang).map(g => { const st = DB.gen[g] || { ok:0, bad:0 }; const n = st.ok + st.bad, rc = st.recent || []; const recent = rc.length >= 10 ? `Zuletzt ${Math.round(rc.reduce((a, x) => a + x, 0) / rc.length * 100)} % richtig${rc.length >= 50 ? ' (letzte 50)' : ` (letzte ${rc.length})`}` : ''; return row('gengo', GENS[g].label, recent || (n ? `Bisher ${Math.round(st.ok / n * 100)} % richtig` : 'Noch nicht geübt'), ` data-g="${g}"`); }).join('')}</div>`;
}
function runBar(r){
  const ex = r.queue[r.idx];
  let topic = '';
  if (ex.type === 'gen') topic = GENS[ex.gen].label;
  else if (ex.type === 'dict') topic = 'Hördiktat';
  else topic = trapMeta(r.lang, itemById(ex.id).trap).label;
  const prog = r.endless
    ? `<span class="count grow">${r.ok} richtig, ${r.bad} falsch</span>`
    : `<div class="progress" aria-hidden="true">${r.queue.map((_, i) => `<span class="seg${i < r.idx ? ' pass' : i === r.idx ? ' cur' : ''}"></span>`).join('')}</div><span class="count">${r.idx + 1}/${r.queue.length}</span>`;
  const x = r.kind === 'daily'
    ? `<button type="button" class="x xt" data-a="quit" aria-label="Pausieren, später an derselben Stelle weitermachen">Pause</button>`
    : `<button type="button" class="x xt" data-a="${r.endless ? 'endrun' : 'quit'}" aria-label="Runde jetzt beenden, Antworten bleiben gespeichert">Beenden</button>`;
  const chosen = r.kind === 'trap' || r.kind === 'gen';
  const line = chosen ? esc(topic) + (ex.requeue ? ', zweiter Versuch' : '') : (ex.requeue ? 'Zweiter Versuch' : '');
  return `<div class="runbar">${x}${prog}</div>${line ? `<p class="topic">${line}</p>` : '<div class="topic-sp"></div>'}`;
}
function viewRun(){
  const r = S.run, ex = r.queue[r.idx], c = r.cur, lang = r.lang, L = LANG[lang];
  const done = c.state === 'done';
  let body = '';
  if (ex.type === 'tiles') {
    const item = itemById(ex.id);
    const picked = ex.picked.map(i => ex.pool.find(p => p.i === i));
    const marks = done && c.result !== 'ok' ? orderMarks(picked.map(p => p.t), item.target) : null;
    const rows = tileRows(ex.pool.filter(p => !p.extra).map(p => p.t));
    const ans = picked.length
      ? picked.map((p, k) => `<button type="button" class="tile${done ? (marks ? ' ' + marks[k] : ' ok') : ''}" data-a="unpick" data-i="${p.i}" lang="${lang}"${done ? ' disabled' : ''}>${esc(p.t)}</button>`).join('')
      : '<span class="ph">Tippe die Wörter unten der Reihe nach an</span>';
    // Die Kästchen behalten ihren Platz: Gewählte bleiben als leerer Umriss stehen, damit nichts verrutscht
    const pool = ex.pool.map(p => ex.picked.includes(p.i) ? `<button type="button" class="tile ghost" disabled tabindex="-1" aria-hidden="true" lang="${lang}">${esc(p.t)}</button>` : `<button type="button" class="tile" data-a="pickt" data-i="${p.i}" lang="${lang}">${esc(p.t)}</button>`).join('');
    body = `<p class="kicker">Bring die Wörter in die richtige Reihenfolge${ex.extra ? '<span class="hintw">Ein Wort bleibt übrig</span>' : ''}</p><p class="de" lang="de">${esc(item.de)}</p>
      <div class="ex-a"><div class="tiles-ans" style="min-height:${rows * 52 + 18}px" aria-label="Deine Antwort">${ans}</div>
      ${done ? '' : `<div class="tiles-pool">${pool}</div>`}</div>`;
  } else if (ex.type === 'cloze') {
    const item = itemById(ex.id);
    const pos = gapPos(item.target, item.gap);
    const cls = done ? (c.result === 'ok' ? ' ok' : c.result === 'near' ? ' near' : ' bad') : '';
    const field = `<input type="text" id="answer" class="gapin${cls}" lang="${lang}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" value="${esc(c.input)}"${done ? ' readonly' : ''} aria-label="Lücke">${done && c.result !== 'ok' ? ` <span class="gapfix">${esc(item.gap)}</span>` : ''}`;
    const h = item.hint.replace(/[()]/g, '').trim();
    const hintTxt = !h ? '' : h.includes('/') ? h.split('/').map(x => x.trim()).join(' oder ') : `Grundform: ${h}`;
    body = `<p class="kicker">Ergänze die Lücke${hintTxt ? `<span class="hintw" lang="${lang}">${esc(hintTxt)}</span>` : ''}</p><p class="de" lang="de">${esc(item.de)}</p>
      <div class="ex-a"><p class="cloze" lang="${lang}">${pos >= 0 ? `${esc(item.target.slice(0, pos))}${field}${esc(item.target.slice(pos + item.gap.length))}` : field}</p>
      ${done ? '' : charbar(lang)}</div>`;
  } else if (ex.type === 'free') {
    const item = itemById(ex.id);
    const micTip = !done && !canListen() && (DB.used && DB.used.mic || 0) < 3 ? '<p class="src">Tipp: Mit dem Mikrofon deiner Tastatur kannst du die Antwort auch sprechen. Das übt nebenbei das Sprechen.</p>' : '';
    body = `<p class="kicker">Übersetze ${L.deAcc}</p><p class="de" lang="de">${esc(item.de)}</p>${micTip}
      <div class="ex-a"><textarea id="answer" class="tw" lang="${lang}" rows="3" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" enterkeyhint="done" placeholder="${esc(L.ph)}"${done ? ' readonly' : ''}>${esc(c.input)}</textarea>
      ${done ? '' : `<div class="inrow">${charbar(lang)}${canListen() ? `<button type="button" class="micbtn${S.listening ? ' on' : ''}" data-a="dictate" aria-label="Antwort sprechen">${ICONS.mic}</button>` : ''}</div>`}</div>`;
  } else if (ex.type === 'gen' && ex.data.kind === 'spot') {
    const d = ex.data;
    body = `<p class="kicker">Ein typischer Fehler steckt im Satz. Tipp auf das falsche Wort.</p><p class="de" lang="de">${esc(d.deLine)}</p>
      <div class="ex-a"><p class="spot${c.intro ? ' enter' : ''}" lang="${lang}">${d.words.map((w, i) => {
        const cls = !done ? '' : i === c.pick ? (d.wrong.includes(i) ? ' hit' : ' miss') : d.wrong.includes(i) ? ' was' : '';
        return `<button type="button" class="sw-w${cls}" data-a="spotpick" data-i="${i}"${done ? ' disabled' : ''}>${esc(w)}</button>`;
      }).join(' ')}</p></div>`;
  } else if (ex.type === 'gen' && ex.data.kind === 'genus') {
    const d = ex.data;
    body = `<p class="kicker">${esc(d.label)}</p>
      <div class="genus${c.intro ? ' enter' : ''}"><p class="genus-w" lang="${lang}">${esc(d.word)}</p><p class="genus-de">${esc(d.deLine)}</p></div>
      <div class="ex-a"><div class="genus-opts">${d.options.map(o => `<button type="button" class="genus-o${done ? (o === d.answer ? ' right' : o === c.input ? ' wrong' : '') : ''}" data-a="genuspick" data-v="${o}"${done ? ' disabled' : ''} lang="${lang}">${o}</button>`).join('')}</div></div>`;
  } else if (ex.type === 'gen' && ex.data.kind === 'time') {
    const d = ex.data;
    const shown = d.mode === 'write' ? `<p class="clockbig">${d.clock ? esc(d.clock) : `${d.num} ${lang === 'sv' ? 'kr' : '€'}`}</p>`
      : d.mode === 'hear' ? `<div class="btnrow tight" style="margin:4px 0 14px"><button type="button" class="ghost icon" data-a="tplay" data-rate="0.9">${ICON} Abspielen</button><button type="button" class="ghost" data-a="tplay" data-rate="0.65">Langsam</button></div>${done ? `<p class="de" lang="${lang}">${esc(d.say)}</p>` : ''}`
      : `<p class="de" lang="${lang}">${esc(d.say)}</p>`;
    body = `<p class="kicker">${esc(d.label)}</p>${d.mode === 'hear' ? '' : shown}
      <div class="ex-a">${d.mode === 'hear' ? shown : ''}${d.mode !== 'write' && !d.clock ? `<div class="unitwrap">` : ''}<input type="text" id="answer" class="tw${d.mode !== 'write' ? ' numin' : ''}" lang="${d.mode === 'write' ? lang : 'de'}" inputmode="${d.mode === 'write' ? 'text' : (d.clock ? 'decimal' : 'numeric')}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="${d.mode === 'write' ? esc(L.ph) : d.clock ? 'z. B. 7.45' : 'z. B. 47'}" value="${esc(c.input)}"${done ? ' readonly' : ''} aria-label="Antwort">${d.mode !== 'write' && !d.clock ? `<span class="unit" aria-hidden="true">${lang === 'sv' ? 'kr' : '€'}</span></div>` : ''}
      ${d.mode !== 'write' && d.clock && !done ? '<p class="vocab" style="margin-top:10px">Punkt, Komma oder Leerzeichen statt Doppelpunkt geht auch.</p>' : ''}
      ${done || d.mode !== 'write' ? '' : charbar(lang)}</div>`;
  } else if (ex.type === 'gen' && ex.data.kind === 'trans') {
    const d = ex.data;
    body = `<p class="kicker">${esc(d.label)}</p><p class="de" lang="${lang}">${esc(d.src)}</p><p class="vocab">Beginne mit „${esc(d.start.trim())} …“</p>
      <div class="ex-a"><textarea id="answer" class="tw" lang="${lang}" rows="2" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" enterkeyhint="done"${done ? ' readonly' : ''} aria-label="Umgebauter Satz">${esc(c.input)}</textarea>
      ${done ? '' : charbar(lang)}</div>`;
  } else if (ex.type === 'gen') {
    const d = ex.data;
    if (d.gap) {
      const pos = d.prompt.indexOf('___');
      const cls = done ? (c.result === 'ok' ? ' ok' : c.result === 'near' ? ' near' : ' bad') : '';
      const field = `<input type="text" id="answer" class="gapin${cls}" lang="${lang}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" value="${esc(c.input)}"${done ? ' readonly' : ''} aria-label="Lücke">${done && c.result !== 'ok' ? ` <span class="gapfix">${esc(d.answers[0])}</span>` : ''}`;
      body = `<p class="kicker">${esc(d.label)}${d.hint ? `<span class="hintw" lang="${lang}">${esc(d.hint)}</span>` : ''}</p>${d.deLine ? `<p class="de" lang="de">${esc(d.deLine)}</p>` : ''}
        <div class="ex-a"><p class="cloze" lang="${lang}">${esc(d.prompt.slice(0, pos))}${field}${esc(d.prompt.slice(pos + 3))}</p>
        ${done ? '' : charbar(lang)}</div>`;
    } else {
      body = `<p class="kicker">${esc(d.label)}</p><p class="de" lang="${d.sub ? lang : 'de'}">${esc(d.prompt)}</p>${d.sub ? `<p class="vocab">${esc(d.sub)}</p>` : ''}
        <div class="ex-a"><input type="text" id="answer" class="tw" lang="${lang}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="${esc(L.ph)}" value="${esc(c.input)}"${done ? ' readonly' : ''} aria-label="Antwort">
        ${done ? '' : charbar(lang)}</div>`;
    }
  } else if (ex.type === 'dict') {
    const item = itemById(ex.id);
    body = `<p class="kicker">Hör zu und schreib den Satz auf${item.tat && item.tat.audio ? '<span class="hintw">echte Aufnahme</span>' : ''}</p>
      <div class="ex-a"><div class="btnrow tight" style="margin:0 0 14px"><button type="button" class="ghost icon" data-a="play" data-rate="0.9">${ICON} Abspielen</button><button type="button" class="ghost" data-a="play" data-rate="0.65">Langsam</button></div>
      <textarea id="answer" class="tw" lang="${lang}" rows="2" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" enterkeyhint="done"${done ? ' readonly' : ''} aria-label="Was du hörst">${esc(c.input)}</textarea>
      ${done ? '' : charbar(lang)}</div>`;
  }
  let actions;
  if (!done) {
    actions = ex.type === 'gen' && (ex.data.kind === 'spot' || ex.data.kind === 'genus') ? '<button type="button" class="ghost" data-a="giveup">Weiß ich nicht</button>' : `${ex.type === 'tiles' ? `<button type="button" class="ghost" data-a="resetTiles"${ex.picked.length ? '' : ' disabled'}>Zurücksetzen</button>` : '<button type="button" class="ghost" data-a="giveup">Weiß ich nicht</button>'}<button type="button" class="primary" data-a="check">Prüfen</button>`;
  } else {
    // Eindeutige Aufgaben: Auswahl (Fehler finden, Genus, ser/estar, por/para), Verbform in der Lücke, Uhrzeit als Zahl
    const fixedAnswer = ex.type === 'gen' && (['spot', 'genus'].includes(ex.data.kind) || ex.data.gap || (ex.data.kind === 'time' && ex.data.mode !== 'write'));
    const canAccept = c.result === 'bad' && !c.gaveUp && !!c.input && ex.type !== 'dict' && ex.type !== 'tiles' && !fixedAnswer;
    actions = `${canAccept ? '<button type="button" class="ghost" data-a="accept">Meine ist auch richtig</button>' : ''}<button type="button" class="primary" data-a="next">Weiter</button>`;
  }
  return runBar(r) + `<section class="ex">${body}<div id="fb" class="${done ? 'fb-' + c.result + (c.gaveUp ? ' fb-gave' : '') + (c.enter ? ' enter' : '') : ''}" aria-live="polite">${done ? feedbackHtml(r, ex, c) : ''}</div></section><div class="actionbar"><div class="in">${actions}</div></div>`;
}
const ivlText = n => (n <= 1 ? 'morgen wieder' : n === 2 ? 'übermorgen wieder' : n < 14 ? `in etwa ${n} Tagen wieder` : n < 60 ? `in etwa ${Math.round(n / 7)} Wochen wieder` : n < 540 ? `in etwa ${Math.round(n / 30)} Monaten wieder` : `in etwa ${Math.round(n / 365)} Jahr${Math.round(n / 365) > 1 ? 'en' : ''} wieder`);
function feedbackHtml(r, ex, c){
  const lang = r.lang;
  const near = lang === 'sv' ? 'Achte auf å, ä und ö.' : 'Achte auf die Akzente.';
  const pill = c.result === 'ok' ? '<span class="verdict v-ok">Richtig</span>' : c.result === 'near' ? '<span class="verdict v-mid">Fast richtig</span>' : c.gaveUp ? '<span class="verdict v-bad">Lösung</span>' : '<span class="verdict v-bad">Falsch</span>';
  const next = c.nextIvl ? `<span class="nexthint">${c.result === 'bad' ? 'gleich noch einmal, dann morgen wieder' : ivlText(c.nextIvl)}</span>` : '';
  const combo = c.combo >= 3 && (c.combo === 3 || c.combo % 5 === 0) ? `<span class="combo">${c.combo} in Folge</span>` : '';
  let out = `<div class="vrow">${pill}${combo}${next}</div>`;
  if (ex.type === 'gen' && ex.data.kind === 'spot') {
    const d = ex.data, fixed = d.full.split(' ');
    const changed = new Set(); fixed.forEach((w, i) => { if (w.replace(/[.,!?]/g, '') !== (d.words[i] || '').replace(/[.,!?]/g, '')) changed.add(i); });
    out += `<div class="solrow"><p class="sol" lang="${lang}">${fixed.map((w, i) => `<span data-a="lookup" data-w="${esc(w.replace(/[.,!?¿¡]/g, ''))}"${changed.has(i) ? ' class="w-fix"' : ''}>${esc(w)}</span>`).join(' ')}</p>${speakBtn(d.full, lang)}</div>`;
    out += `<p class="expl">${termify(d.note)}</p>`;
    const tr = trapMeta(lang, d.trap); if (tr) out += `<p class="src">Thema: ${esc(tr.label)}</p>`;
    return out;
  }
  if (ex.type === 'gen' && ex.data.kind === 'genus') {
    const d = ex.data;
    out += `<div class="solrow"><p class="sol" lang="${lang}"><b>${esc(d.answer)}</b> ${esc(d.word)}</p>${speakBtn(d.full, lang)}</div>`;
    if (d.note) out += `<p class="expl">${termify(d.note)}</p>`;
    return out;
  }
  if (ex.type === 'gen' && ex.data.kind === 'time') {
    const d = ex.data;
    const solved = d.mode === 'write' ? d.answers[0] : (d.clock || String(d.num));
    out += `<div class="solrow"><p class="sol" lang="${lang}">${esc(d.mode === 'write' ? `${d.clock || d.num} = ${solved}` : `${d.say.replace(/\.$/, '')} = ${solved}`)}</p>${speakBtn(d.say, lang)}</div>`;
    const also = d.mode === 'write' && d.clock ? d.answers.slice(1).filter(a => !/^(son|es) /.test(a) && a !== d.answers[0]) : [];
    if (also.length) out += `<p class="legend">Auch richtig: ${esc(also.join(', '))}</p>`;
    if (d.note) out += `<p class="expl">${termify(d.note)}</p>`;
    return out;
  }
  if (ex.type === 'dict') {
    const item = itemById(ex.id);
    return out + `<p class="diff" lang="${lang}">${c.diff.html}</p><p class="gloss">${esc(item.de)}</p>${c.result !== 'ok' ? '<p class="legend"><span class="w-near">Gelb</span>: Schreibung falsch. <span class="w-miss">Rot</span>: Wort fehlt oder ist falsch.</p>' : ''}`;
  }
  const item = ex.id ? itemById(ex.id) : null;
  const tr = item ? trapMeta(lang, item.trap) : null;
  const solution = ex.type === 'gen' ? (ex.data.full || ex.data.answers[0]) : item.target;
  if (c.mine && c.result !== 'ok' && !c.gaveUp) out += `<p class="yours" lang="${lang}"><span class="lbl-s">Du:</span> ${c.mine}</p>`;
  const showDiff = c.result !== 'ok' && c.diff && c.input && !c.gaveUp && ex.type !== 'cloze' && !(ex.type === 'gen' && ex.data.gap);
  const sol = showDiff && c.best ? c.best : solution;
  const sBtn = item && item.tat && item.tat.audio && sol === item.target ? speakItemBtn(item) : speakBtn(sol, lang);
  out += `<div class="solrow"><p class="sol" lang="${lang}">${showDiff ? c.diff.html : linkWords(sol, lang)}</p>${sBtn}</div>`;
  const vocabLine = c.vocab && c.vocab.length ? `<p class="expl">Die Grammatik passt, nur ${c.vocab.length === 1 ? 'ein Wort ist' : 'Wörter sind'} anders: ${c.vocab.slice(0, 2).map(([x, w]) => `<span lang="${lang}">„${esc(x)}“</span> statt <span lang="${lang}">„${esc(w)}“</span>`).join(', ')}.</p>` : '';
  if (c.result === 'near' && c.why && c.why.kind === 'vocab') out += vocabLine;
  else if (c.result === 'near') out += `<p class="expl">${c.why && c.why.kind === 'typo' ? `Zählt als richtig, nur ein Tippfehler: <span lang="${lang}">„${esc(c.why.typed)}“</span> statt <span lang="${lang}">„${esc(c.why.want)}“</span>.` : near}</p>`;
  if (c.result === 'bad' && vocabLine) out += vocabLine;
  if (c.result === 'bad') {
    if (c.keyOk) out += `<p class="expl">${termify(c.keyOk)}. Der Unterschied liegt woanders.</p>`;
    else if (!(ex.type === 'gen' && ex.data.kind) && diag(lang, c.input, solution)) out += `<p class="expl">${termify(diag(lang, c.input, solution))}</p>`;
    else if (ex.type === 'gen') out += `<p class="expl">${termify(ex.data.note)}</p>`;
    else if (tr && tr.short) out += `<p class="expl">${termify(tr.short)}</p>${tr.id !== 'eigene' ? `<button type="button" class="link more-l" data-a="topic" data-t="${tr.id}">Regel und Beispiele</button>` : ''}`;
    if (ex.type === 'free' && !c.gaveUp && c.input) {
      if (c.lt === undefined) out += `<p class="hint">Unsicher, ob deine Fassung auch stimmt? <button type="button" class="link" data-a="ltfree">Mit LanguageTool prüfen (online)</button></p>`;
      else if (c.lt === 'loading') out += `<p class="hint"><span class="dots">Prüfe</span></p>`;
      else if (typeof c.lt === 'string') out += `<p class="hint">${esc(c.lt)}</p>`;
      else out += ltHtml(c.input, c.lt, lang, false) + `<p class="src">Geprüft von <a href="https://languagetool.org" target="_blank" rel="noopener">LanguageTool</a>. Ob die Bedeutung passt, prüft es nicht.</p>`;
    }
  }
  if (c.result === 'bad' && ex.type === 'free' && !c.gaveUp && c.input && !(DB.used && DB.used.accept)) out += `<p class="hint">Gibt es mehrere richtige Übersetzungen und deine ist eine davon, tipp auf „Meine ist auch richtig“. Die App merkt sich deine Fassung.</p>`;
  if (!(r.kind === 'trap' || r.kind === 'gen' || r.kind === 'form')) { const own = ex.type === 'gen' && ex.data.trap ? trapMeta(lang, ex.data.trap) : null; const tl = own ? own.label : ex.type === 'gen' ? GENS[ex.gen].label : (tr && tr.id !== 'eigene' ? tr.label : ''); if (tl) out += `<p class="src">Thema: ${esc(tl)}</p>`; }
  if (!(DB.used && DB.used.lookup)) out += `<p class="src">Tipp auf ein Wort der Lösung, um es nachzuschlagen.</p>`;
  if (item && item.tat) out += `<p class="src">Quelle: Tatoeba${item.tat.owner ? ', ' + esc(item.tat.owner) : ''} (${esc(item.tat.license)})${item.tat.audio ? `. Aufnahme: ${item.tat.audio.attr ? `<a href="${esc(item.tat.audio.attr)}" target="_blank" rel="noopener">${esc(item.tat.audio.author)}</a>` : esc(item.tat.audio.author)}` : ''}</p>`;
  return out;
}
// Wortstellung: richtig stehende, verschobene und überzählige Wörter unterscheiden
function orderMarks(order, target){
  const a = order.map(x => x.toLowerCase()), b = tileTokens(target).map(x => x.toLowerCase());
  const m = a.length, n = b.length, dp = Array.from({ length:m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const keep = new Array(m).fill(false); let i = 0, j = 0;
  while (i < m && j < n) { if (a[i] === b[j]) { keep[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  const left = {}; b.forEach(w => { left[w] = (left[w] || 0) + 1; });
  a.forEach((w, k) => { if (keep[k]) left[w]--; });
  return a.map((w, k) => { if (keep[k]) return 'ok'; if (left[w] > 0) { left[w]--; return 'moved'; } return 'extra'; });
}
function tileRows(tokens){
  const W = Math.min(window.innerWidth || 380, 600) - 58;
  let rows = 1, x = 0;
  tokens.forEach(t => { const w = t.length * 10.8 + 34; if (x && x + w > W) { rows++; x = w; } else x += w; });
  return rows;
}
// Erkennt typische Fehler in der Antwort selbst, damit die Erklärung zum gemachten Fehler passt
function diag(lang, input, solution){
  if (!input) return '';
  const a = ' ' + norm(input, lang) + ' ', b = ' ' + norm(solution, lang) + ' ';
  if (lang === 'es') {
    const perf = /\s(he|has|ha|hemos|habéis|han)\s+\S+(ado|ido|to|cho|so)\s/;
    if (perf.test(a) && !perf.test(b)) return 'Mit einem abgeschlossenen Zeitpunkt wie ayer, el año pasado oder en 2018 steht Indefinido, nicht Perfecto (he …).';
    if (!perf.test(a) && perf.test(b) && /(hoy|esta semana|esta mañana|nunca|alguna vez|ya)/.test(b)) return 'Bei heute, diese Woche oder Erfahrungen (nunca, alguna vez) nimmt man in Spanien das Perfecto (he …).';
  }
  if (lang === 'sv') {
    const perf = /\s(har|hade)\s+(\S+\s+)?\S+(at|it|tt|t)\s/;
    if (perf.test(a) && !perf.test(b)) return 'Mit einem Zeitpunkt in der Vergangenheit steht Präteritum, nicht „har …“.';
    if (!perf.test(a) && perf.test(b)) return 'Ohne Zeitpunkt, als Erfahrung oder bis heute andauernd: Perfekt mit „har …“.';
  }
  return '';
}
function ltHtml(text, matches, lang, fixable){
  if (!matches.length) return `<p class="lt-ok">Keine Fehler gefunden.</p>`;
  return `<ul class="ltlist">${matches.map((m, k) => `<li><mark lang="${lang}">${esc(text.substr(m.offset, m.length) || '…')}</mark> <span>${esc(m.message)}</span>${m.reps.length ? `<span class="reps">${m.reps.map(rp => fixable ? `<button type="button" class="rep" data-a="wfix" data-k="${k}" data-r="${esc(rp)}" lang="${lang}">${esc(rp)}</button>` : `<span class="rep" lang="${lang}">${esc(rp)}</span>`).join('')}</span>` : ''}</li>`).join('')}</ul>`;
}
// Frei lesbare Quellen ohne Bezahlschranke, Texte auch außerhalb des Landes erreichbar (nur Videos sind dort teils gesperrt)
const READING = {
  sv:[['8 Sidor', 'https://8sidor.se'], ['SVT Nyheter', 'https://www.svt.se/nyheter/'], ['Svenska Yle', 'https://svenska.yle.fi']],
  es:[['Noticias fácil', 'https://www.discapnet.es/lectura-facil/inicio'], ['RTVE Noticias', 'https://www.rtve.es/noticias/'], ['BBC Mundo', 'https://www.bbc.com/mundo']]
};
const readLink = ([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name.replace(/ /g, '\u00a0')}</a>`;
function viewRunDone(){
  const r = S.run, lang = r.lang;
  const daily = r.kind === 'daily', practice = r.kind === 'retry';
  const total = r.ok + r.bad, res = r.res || [], missed = r.missed || [];
  const perfect = total > 0 && !r.bad;
  const title = daily ? 'Tagwerk erledigt' : practice ? 'Nochmal geübt' : perfect && total >= 3 ? 'Fehlerfrei' : 'Runde beendet';
  const lead = !total ? 'Keine Aufgabe beantwortet.' : perfect ? (total === 1 ? 'Auf Anhieb richtig.' : `Alle ${total} auf Anhieb richtig.`) : `${r.ok} von ${total} auf Anhieb richtig.`;
  // Ergebnis je Aufgabe als Leiste: auf einen Blick, wo es gehakt hat
  const nOk = res.filter(x => x.good && !x.near).length, nNear = res.filter(x => x.near).length, nBad = res.length - nOk - nNear;
  const strip = res.length > 1 ? `<div class="rstrip${r.stamped ? '' : ' anim'}" role="img" aria-label="Ergebnis je Aufgabe: ${nOk} richtig${nNear ? `, ${nNear} fast richtig` : ''}${nBad ? `, ${nBad} falsch` : ''}">${res.map((x, k) => `<i class="rs ${x.good ? (x.near ? 'rs-near' : 'rs-ok') : 'rs-bad'}" style="--i:${k}"></i>`).join('')}</div>` : '';
  // Kennzahlen nur, wenn sie etwas sagen
  const fresh = res.filter(x => x.fresh).length;
  const kp = [];
  const mins = Math.round((r.secs || 0) / 60);
  if (mins >= 1) kp.push([mins, mins === 1 ? 'Minute' : 'Minuten']);
  if (fresh) kp.push([fresh, fresh === 1 ? 'neuer Satz' : 'neue Sätze']);
  if ((r.best || 0) >= 3 && r.best < total) kp.push([r.best, 'richtig in Folge']);
  const kpis = kp.length >= 2 ? `<div class="kpis done-kpis" style="grid-template-columns:repeat(${Math.min(3, kp.length)}, 1fr)">${kp.slice(0, 3).map(([v, l]) => `<div><b>${esc(String(v))}</b><span>${l}</span></div>`).join('')}</div>` : '';
  // Was die Wiederholungsplanung daraus macht
  const sits = res.filter(x => x.good && x.ivl > 1).map(x => x.ivl);
  const dWhen = n => (n === 2 ? 'übermorgen' : n < 14 ? `in ${n} Tagen` : n < 60 ? `in ${Math.round(n / 7)} Wochen` : `in ${Math.round(n / 30)} Monaten`);
  const span = sits.length ? (() => {
    const lo = Math.min(...sits), hi = Math.max(...sits);
    const unit = n => (n < 14 ? ['Tagen', n] : n < 60 ? ['Wochen', Math.round(n / 7)] : ['Monaten', Math.round(n / 30)]);
    const [ul, nl] = unit(lo), [uh, nh] = unit(hi);
    const when = dWhen(lo) === dWhen(hi) ? dWhen(lo) : lo === 2 ? `übermorgen bis ${dWhen(hi)}` : ul === uh ? `in ${nl} bis ${nh} ${ul}` : `${dWhen(lo)} bis ${dWhen(hi).replace(/^in /, '')}`;
    return `<p class="sits"><b>Nächste Wiederholung:</b> ${sits.length === 1 ? '1 Satz kommt' : `${sits.length} Sätze kommen`} ${when} wieder.</p>`;
  })() : '';
  const ms = (() => { const now = matureCount(lang); const hit = milestoneList(now).filter(m => m > (r.strongBefore || 0) && m <= now).pop(); return hit ? `<p class="milestone">${hit} gefestigte Sätze auf ${LANG[lang].deName}</p>` : ''; })();
  const sk = daily ? (() => { const n = streak(), m = streakMilestone(n); return n >= 2 ? (m ? `<p class="milestone">${m}</p>` : `<p class="hint">Tag ${n} in Folge.</p>`) : ''; })() : '';
  const tomorrow = daily ? (() => { const n = forecast(lang)[1].n; return n ? `<p class="hint">Morgen ${n === 1 ? 'kommt 1 Satz' : `kommen ${n} Sätze`} zur Wiederholung.</p>` : ''; })() : '';
  const missedHtml = missed.length ? `<div class="grp-row"><h2 class="grp">Noch nicht sicher</h2><button type="button" class="link" data-a="retry">Gleich nochmal üben</button></div>
    <div class="rows">${missed.slice(0, 6).map(x => `<div class="row static"><span class="txt"><span class="rt wordrow" lang="${lang}">${linkWords(x.target, lang)}</span>${x.de ? `<span class="rd">${esc(x.de)}</span>` : ''}</span>${speakBtn(x.target, lang)}</div>`).join('')}</div>
    ${missed.length > 6 ? `<p class="legend">und ${missed.length - 6} weitere</p>` : ''}${practice ? '' : '<p class="legend">Sie kommen morgen wieder. Gleich nochmal üben ändert daran nichts, festigt sie aber.</p>'}` : '';
  const nudge = !daily && !DB.done[today()] && !S.dailyRun ? `<div class="notice ok"><span>Das Tagwerk für heute steht noch aus.</span><button type="button" class="link" data-a="daily">Starten</button></div>` : !daily && S.dailyRun && S.dailyRun.lang === lang ? `<div class="notice ok"><span>Dein Tagwerk ist noch offen.</span><button type="button" class="link" data-a="daily">Fortsetzen</button></div>` : '';
  const again = !daily && !practice && r.kind !== 'hard';
  const buttons = daily
    ? '<button type="button" class="ghost" data-a="tab" data-v="extra">Weiter üben</button><button type="button" class="primary" data-a="tab" data-v="home">Fertig</button>'
    : again ? '<button type="button" class="ghost" data-a="tab" data-v="extra">Fertig</button><button type="button" class="primary" data-a="again">Noch eine Runde</button>'
    : '<button type="button" class="primary" data-a="tab" data-v="extra">Fertig</button>';
  const reading = daily ? `<p class="hint readtip">Zum Lesen: ${READING[lang].map(readLink).join(', ').replace(/, ([^,]*)$/, ' oder $1')}.</p>` : '';
  return `<div class="donebox">
    ${daily ? `<svg class="stamp${r.stamped ? '' : ' draw'}" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="25"/><path d="M17 29.5l7.5 7.5L40 21"/></svg>` : ''}
    <h1 class="done-h">${title}</h1>
    <p class="lead">${lead}</p>
    ${r.ended && r.kind === 'extraNew' && r.leftNew ? `<p class="hint" style="margin-top:0">${plural(r.leftNew, 'neuer Satz bleibt', 'neue Sätze bleiben')} für später.</p>` : ''}
    ${strip}${kpis}${span}
    ${ms}${sk}${tomorrow}
    ${missedHtml}
    ${nudge}
    ${reading}
  </div><div class="actionbar"><div class="in">${buttons}</div></div>`;
}
function viewShadow(){
  const sh = S.shadow, lang = sh.lang;
  const item = itemById(sh.ids[sh.idx]);
  if (!item) return backBar('Nachsprechen') + `<p class="lead">Runde beendet.</p><p class="hint">Tipp: Hör dir am Ende nur deine eigenen Aufnahmen an. Dabei fällt die Satzmelodie am deutlichsten auf.</p><div class="btnrow"><button type="button" class="primary" data-a="shadow">Neue Runde</button></div>`;
  return backBar(`Nachsprechen ${sh.idx + 1}/${sh.ids.length}`) + `
    <p class="de big-de" lang="${lang}">${esc(item.target)}</p>
    <p class="gloss">${esc(item.de)}</p>
    <p class="hint">So geht’s: anhören, beim zweiten Mal gleichzeitig mitsprechen${canRecord() ? ', dann allein sprechen, aufnehmen und mit dem Original vergleichen' : ''}.</p>
    <div class="btnrow"><button type="button" class="ghost icon" data-a="splay" data-rate="0.9">${ICON} Anhören</button><button type="button" class="ghost" data-a="splay" data-rate="0.65">Langsam</button></div>
    ${canListen() ? `<div class="btnrow"><button type="button" class="ghost icon micb${sh.listening ? ' on' : ''}" data-a="pron">${ICONS.mic}${sh.listening ? 'Ich höre zu …' : 'Aussprache prüfen'}</button></div>` : ''}
    ${sh.pron ? (sh.pron.err ? `<p class="hint">${esc(sh.pron.err)}</p>` : `<div class="pron"><p class="pron-s" lang="${lang}">${tokens(String(item.target).replace(/ i (dag|morgon|kväll|går|natt)\b/gi, ' i$1')).map((w, k) => `<span class="${sh.pron.hit[k] ? 'p-ok' : 'p-miss'}">${esc(w)}</span>`).join(' ')}</p><p class="legend">${sh.pron.hit.filter(Boolean).length} von ${sh.pron.hit.length} Wörtern erkannt. Gehört: „${esc(sh.pron.heard)}“. Die Erkennung ist ein Anhaltspunkt, kein Urteil: Gelb markierte Wörter lohnen einen zweiten Versuch.</p></div>`) : ''}
    ${canRecord() ? `<div class="btnrow">${sh.recording ? '<button type="button" class="ghost rec on" data-a="recstop">Stopp</button>' : '<button type="button" class="ghost rec" data-a="recstart">Aufnehmen</button>'}${sh.hasRec ? '<button type="button" class="ghost" data-a="recplay">Mich anhören</button>' : ''}</div>` : ''}
    <div class="actionbar"><div class="in"><button type="button" class="primary" data-a="snext">Nächster Satz</button></div></div>`;
}
function viewWrite(){
  const w = S.write, lang = w.lang, L = LANG[lang];
  const ex = w.extra && W_EXTRA[lang].find(x => x.k === w.extra);
  const ltBlock = w.lt === 'loading' ? '<p class="hint"><span class="dots">Wird geprüft</span></p>'
    : typeof w.lt === 'string' ? `<p class="hint">${esc(w.lt)}</p>`
    : w.lt ? ltHtml(w.text, w.lt, lang, true) + `<p class="src">Geprüft von <a href="https://languagetool.org" target="_blank" rel="noopener">LanguageTool</a>. Dein Text wurde dafür an LanguageTool gesendet.${lang === 'sv' ? ' Für Schwedisch prüft es vor allem die Rechtschreibung.' : ''}</p>` : '';
  return backBar('Text schreiben') + `
    <p class="kicker">${w.restored ? 'Dein Entwurf von vorhin' : `Schreib 4 bis 6 Sätze auf ${L.deName}`}</p>
    <p class="de" lang="de">${esc(w.prompt)}</p>
    <p class="vocab"><button type="button" class="link" data-a="wnew">Andere Aufgabe</button></p>
    ${ex ? `<div class="wextra"><span class="wx-t">Extra: ${esc(ex.t)}</span><span class="wx-b"><button type="button" class="link dim" data-a="wextra">Andere</button><button type="button" class="link dim" data-a="wextraoff">Ohne</button></span></div>` : `<p class="vocab"><button type="button" class="link dim" data-a="wextra">Mit Extra-Aufgabe schreiben</button></p>`}
    ${w.sugg && w.sugg.length ? `<p class="wsugg">Zum Einbauen aus deinen neuen Sätzen: ${w.sugg.map(x => `<button type="button" class="wchip" data-a="lookup" data-w="${esc(x.w)}" lang="${lang}">${esc(x.w)}</button>`).join('')}</p>` : ''}
    <textarea id="wtext" class="tw" lang="${lang}" rows="7" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" placeholder="${esc(L.ph)}">${esc(w.text)}</textarea>
    ${charbar(lang)}
    ${w.prof ? profileHtml(lang, w.prof, w.extra) : ''}
    ${ltBlock}
    ${w.copied ? '<p class="hint">Kopiert. In HelloTalk oder Tandem können Muttersprachler deinen Text korrigieren. Gute Korrekturen kannst du als eigene Sätze eintragen.</p>' : `<p class="vocab"><button type="button" class="link dim" data-a="wcopy">Kopieren, um ihn Muttersprachlern zu zeigen</button></p>`}
    ${archiveHtml(lang)}
    <div class="actionbar"><div class="in"><button type="button" class="ghost" data-a="wlt">Online prüfen</button><button type="button" class="primary" data-a="weval">Auswerten</button></div></div>`;
}

function viewOwn(){
  const o = S.own, lang = o.lang, L = LANG[lang];
  return backBar('Eigenen Satz eintragen') + noticeHtml() + `<p class="lead-s">Der Satz kommt als neuer Satz in dein Tagwerk und wird wiederholt wie alle anderen. Trag nur Sätze ein, bei denen du sicher bist, dass sie stimmen.</p><section class="form">
    <label>Auf Deutsch<input type="text" id="ownDe" value="${esc(o.de)}" placeholder="Ich habe den Zug verpasst."></label>
    <label>Auf ${L.deName}<input type="text" id="ownT" class="tw" lang="${lang}" value="${esc(o.t)}" placeholder="${esc(L.ph)}" autocorrect="off" spellcheck="false"></label>
    ${charbar(lang)}
  </section>
  <div class="actionbar"><div class="in"><button type="button" class="primary" data-a="ownsave">Satz speichern</button></div></div>`;
}
function viewTat(){
  const t = S.tat, lang = t.lang;
  const trapOpts = TRAPS[lang].filter(x => TAT_Q[lang][x.id]).map(x => `<option value="${x.id}"${t.trap === x.id ? ' selected' : ''}>${esc(x.label)}</option>`).join('');
  const picked = Object.values(t.picked).filter(Boolean).length;
  let res = '';
  if (t.status === 'loading') res = '<p class="hint"><span class="dots">Suche</span></p>';
  else if (t.status === 'error') res = `<p class="notice warn">${esc(t.err)}</p>`;
  else if (t.status === 'done') {
    res = t.results.length
      ? `<p class="hint">Tippe an, was du übernehmen möchtest.</p><div class="rows picklist">${t.results.map((x, i) => `<div class="row pickrow${t.picked[i] ? ' on' : ''}"><button type="button" class="pickbtn" data-a="tatpick" data-i="${i}" aria-pressed="${!!t.picked[i]}"><span class="check" aria-hidden="true"></span><span class="txt"><span class="rt" lang="${lang}">${esc(x.target)}</span><span class="rd">${esc(x.de)}</span></span></button>${x.audio ? `<button type="button" class="speak native" data-a="tatplay" data-i="${i}" aria-label="Aufnahme abspielen">${ICON}</button>` : ''}</div>`).join('')}</div>
        <p class="src">Aus <a href="https://tatoeba.org" target="_blank" rel="noopener">Tatoeba</a>, nur Sätze von Muttersprachlern (CC BY 2.0 FR). Der farbige Lautsprecher spielt eine echte Aufnahme.</p>`
      : '<p class="hint">Nichts Neues gefunden. Probier ein anderes Thema oder eine andere Wortform.</p>';
  }
  const bar = t.status === 'done' && t.results.length
    ? `<button type="button" class="ghost" data-a="tatgo">Neu suchen</button><button type="button" class="primary" data-a="tatadd"${picked ? '' : ' disabled'}>${picked ? `${plural(picked, 'Satz', 'Sätze')} übernehmen` : 'Nichts ausgewählt'}</button>`
    : `<button type="button" class="primary" data-a="tatgo">Suchen</button>`;
  return backBar('Beispielsätze suchen') + noticeHtml() + `<p class="lead-s">Echte Sätze von Muttersprachlern mit deutscher Übersetzung, aus der freien Sammlung Tatoeba. Was du übernimmst, kommt als neue Sätze in dein Tagwerk.</p><section class="form">
    <div class="seg2" role="radiogroup"><button type="button" role="radio" aria-checked="${t.mode === 'topic'}" data-a="tatmode" data-m="topic">Nach Thema</button><button type="button" role="radio" aria-checked="${t.mode === 'word'}" data-a="tatmode" data-m="word">Nach Wort</button></div>
    ${t.mode === 'topic' ? `<select id="tatTrap" aria-label="Thema">${trapOpts}</select>` : `<input type="text" id="tatWord" class="tw" lang="${lang}" value="${esc(t.word)}" placeholder="z. B. ${lang === 'sv' ? 'orkar' : 'aprovechar'}" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Wort"><p class="hint">Gesucht wird genau die eingegebene Form, also zum Beispiel „orkar“ statt „orka“.</p>`}
  </section>${res}<div class="actionbar"><div class="in">${bar}</div></div>`;
}
const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const WDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const pct = x => Math.round(x * 100) + ' %';
const endDot = x => (/[.!?]$/.test(x) ? x : x + '.');
function fmtMin(secs){
  const m = Math.round(secs / 60);
  if (secs > 0 && m < 1) return 'unter 1 Min.';
  if (m < 60) return m + ' Min.';
  return Math.floor(m / 60) + ' Std.' + (m % 60 ? ' ' + (m % 60) + ' Min.' : '');
}
const dateOf = ds => { const [y, m, d] = ds.split('-').map(Number); return new Date(y, m - 1, d); };
function calendarSvg(){
  const t = today(), first = totals().first;
  const since = first ? Math.floor(dayDiff(mondayOf(t), mondayOf(first)) / 7) + 1 : 1;
  const weeks = Math.min(156, Math.max(17, since));
  const cell = 13, gap = 3, top = 14, step = cell + gap;
  const start = addDays(mondayOf(t), -7 * (weeks - 1)), free = streakData().free;
  let out = '', active = 0, total = 0, lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const dw = dateOf(addDays(start, w * 7)), mo = dw.getMonth();
    if (mo !== lastMonth) { out += `<text x="${w * step}" y="9">${MONTHS[mo]}${mo === 0 ? ' ' + String(dw.getFullYear()).slice(2) : ''}</text>`; lastMonth = mo; }
    for (let k = 0; k < 7; k++) {
      const ds = addDays(start, w * 7 + k);
      if (ds > t) continue;
      const n = (dayLog(ds, 'sv').n || 0) + (dayLog(ds, 'es').n || 0);
      if (first && ds >= first) { total++; if (n) active++; }
      const lvl = DB.done[ds] ? (n >= 25 ? 3 : 2) : n ? 1 : 0;
      out += `<rect data-a="calday" data-d="${ds}" x="${w * step}" y="${top + k * step}" width="${cell}" height="${cell}" rx="3" class="c${lvl}${free.has(ds) && !n ? ' fr' : ''}${ds === t ? ' now' : ''}${S.calDay === ds ? ' sel' : ''}"/>`;
    }
  }
  const W = weeks * step - gap, H = top + 7 * step - gap;
  const days = ['Mo', 'Mi', 'Fr'].map((l, i) => `<text x="0" y="${top + i * 2 * step + cell - 2}">${l}</text>`).join('');
  return {
    svg:`<div class="calwrap"><svg class="cal cal-days" width="20" height="${H}" viewBox="0 0 20 ${H}" aria-hidden="true">${days}</svg><div class="calscroll" id="calscroll"><svg class="cal" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Übungstage">${out}</svg></div></div>`,
    active, total, first, scrollable:since > 20
  };
}
function dayDetail(ds){
  const dt = dateOf(ds);
  const head = `${WDAYS[dt.getDay()]}, ${dt.getDate()}. ${MONTHS[dt.getMonth()]}`;
  const parts = ['sv', 'es'].map(l => { const x = dayLog(ds, l); return x.n ? `${LANG[l].deName} ${plural(x.n, 'Aufgabe', 'Aufgaben')}${x.secs ? ` in ${fmtMin(x.secs)}` : ''}` : ''; }).filter(Boolean);
  const free = streakData().free.has(ds);
  return `${head}: ${parts.length ? endDot(parts.join(', ')) : free ? 'freier Tag, die Serie lief weiter.' : 'nicht geübt.'}${DB.done[ds] ? ' Tagwerk erledigt.' : ''}`;
}
function minutesChart(){
  const days = 14, t = today();
  const data = Array.from({ length:days }, (_, k) => {
    const ds = addDays(t, k - days + 1);
    return { ds, sv:(dayLog(ds, 'sv').secs || 0) / 60, es:(dayLog(ds, 'es').secs || 0) / 60, n:(dayLog(ds, 'sv').n || 0) + (dayLog(ds, 'es').n || 0) };
  });
  const max = Math.max(5, ...data.map(x => x.sv + x.es));
  const cols = data.map(x => {
    const tot = Math.round(x.sv + x.es);
    const unm = x.n > 0 && x.sv + x.es === 0;
    return `<div class="mc${x.ds === t ? ' now' : ''}${unm ? ' unm' : ''}"><span class="mcv">${unm ? '–' : tot || ''}</span><span class="mcb">${x.es ? `<span class="m-es" style="height:${x.es / max * 100}%"></span>` : ''}${x.sv ? `<span class="m-sv" style="height:${x.sv / max * 100}%"></span>` : ''}</span><span class="mcl">${WDAYS[dateOf(x.ds).getDay()]}</span></div>`;
  }).join('');
  return { unm:data.some(x => x.n > 0 && x.sv + x.es === 0), html:`<div class="mchart" role="img" aria-label="Lernminuten pro Tag, letzte 14 Tage">${cols}</div>`, total:Math.round(data.reduce((a, x) => a + x.sv + x.es, 0)), any:data.some(x => x.sv + x.es > 0) };
}
function forecast(lang){
  const t = today();
  return Array.from({ length:7 }, (_, k) => {
    const ds = addDays(t, k);
    const n = BANK[lang].filter(i => { const s = stOf(i.id); return s && (k === 0 ? s.due <= t : s.due === ds); }).length;
    return { label:k === 0 ? 'heute' : WDAYS[dateOf(ds).getDay()], n };
  });
}
// Behalten pro Woche, damit man Trends sieht (etwa wenn zu viel Neues dazukam)
function retTrend(lang){
  const weeks = [], mo = mondayOf(today());
  for (let w = 7; w >= 0; w--) {
    const start = addDays(mo, -7 * w); let rev = 0, ok = 0;
    for (let k = 0; k < 7; k++) { const x = dayLog(addDays(start, k), lang); rev += x.rev || 0; ok += x.revOk || 0; }
    weeks.push({ start, rev, ok });
  }
  if (weeks.filter(x => x.rev >= 10).length < 3) return '';
  const W = 340, H = 132, L = 26, R = 6, T = 16, B = 18, bw = (W - L - R) / 8;
  const y = p => T + (1 - (Math.max(0.5, p) - 0.5) / 0.5) * (H - T - B);
  let g = '';
  [0.5, 0.75, 1].forEach(p => { g += `<line x1="${L}" x2="${W - R}" y1="${y(p)}" y2="${y(p)}" class="gl"/><text x="${L - 4}" y="${y(p) + 3}" class="yl">${Math.round(p * 100)}</text>`; });
  weeks.forEach((x, i) => {
    const cx = L + i * bw + bw / 2, d = dateOf(x.start);
    if (x.rev >= 10) {
      const p = x.ok / x.rev, top = Math.min(y(p), H - B - 4), tall = H - B - top > 18;
      g += `<rect x="${cx - bw * 0.3}" y="${top}" width="${bw * 0.6}" height="${H - B - top}" rx="3" class="${p < 0.8 ? 'bw' : 'bo'}"/><text x="${cx}" y="${tall ? top + 12 : top - 4}" class="vl${tall ? ' in' : ''}">${Math.round(p * 100)}</text>`;
    } else g += `<rect x="${cx - bw * 0.3}" y="${y(0.5) - 2}" width="${bw * 0.6}" height="2" class="bn"/>`;
    g += `<text x="${cx}" y="${H - 4}" class="xl">${d.getDate()}.${d.getMonth() + 1}.</text>`;
  });
  g += `<line x1="${L}" x2="${W - R}" y1="${y(0.9)}" y2="${y(0.9)}" class="tgt"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="rtsvg" role="img" aria-label="Behalten pro Woche, letzte acht Wochen">${g}</svg>
  <p class="legend"><span class="tgtl"></span>Ziel 90\u00a0%. Prozent pro Woche ab dem genannten Montag, Wochen mit weniger als 10 Wiederholungen bleiben leer.</p>`;
}
// Verlauf: geübte, geschätzt abrufbare und gefestigte Sätze über die Zeit
function niceStep(max){ const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw || 1))); return [1, 2, 5, 10].map(m => m * p).find(v => v >= raw) || p * 10; }
function progressChart(lang){
  const days = Object.keys(DB.log).filter(k => (dayLog(k, lang).n || 0) > 0).sort();
  if (!days.length) return '';
  const t = today(), start = days[0], span = dayDiff(t, start);
  if (span < 13) return `<h2 class="grp">Verlauf</h2><p class="legend" style="margin:0 4px 8px">Erscheint, sobald du zwei Wochen dabei bist.</p>`;
  const step = span > 180 ? 7 : span > 70 ? 3 : 1;
  const pts = []; let cum = 0, snapFrom = null;
  for (let k = 0; k <= span; k++) {
    const ds = addDays(start, k);
    cum += dayLog(ds, lang).fresh || 0;
    if (k % step && k !== span) continue;
    let sn = null;
    for (let b = 0; b < step && !sn; b++) { const x = DB.snap && DB.snap[addDays(ds, -b)]; if (x && x[lang]) sn = x[lang]; }
    if (sn && !snapFrom) snapFrom = ds;
    pts.push({ ds, n:cum, m:sn ? sn.m : null, k:sn ? sn.k : null });
  }
  const last = pts[pts.length - 1];
  const max = Math.max(4, ...pts.map(p => Math.max(p.n, p.m || 0, p.k || 0)));
  const st = niceStep(max), top = Math.ceil(max / st) * st;
  const W = 340, H = 168, L = 30, R = 36, T = 10, B = 20;
  const X = i => L + (pts.length === 1 ? 0 : i / (pts.length - 1)) * (W - L - R);
  const Y = v => T + (1 - v / top) * (H - T - B);
  let g = '';
  for (let v = 0; v <= top; v += st) g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="${L - 5}" y="${Y(v) + 3}" class="yl">${v}</text>`;
  const path = key => { let dstr = '', pen = false; pts.forEach((p, i) => { const v = p[key]; if (v == null) { pen = false; return; } dstr += `${pen ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`; pen = true; }); return dstr; };
  const series = [['n', 'ln-n', 'geübt'], ['k', 'ln-k', 'abrufbar'], ['m', 'ln-m', 'gefestigt']];
  const ends = [];
  series.forEach(([key, cls]) => {
    const dstr = path(key); if (!dstr) return;
    g += `<path d="${dstr}" class="${cls}"/>`;
    if (last[key] != null) ends.push({ v:last[key], y:Y(last[key]), cls });
  });
  ends.sort((a, b) => a.y - b.y).forEach((e, i, arr) => { if (i && e.y - arr[i - 1].y < 11) e.y = arr[i - 1].y + 11; g += `<text x="${W - R + 4}" y="${e.y + 3}" class="el ${e.cls}">${e.v}</text>`; });
  const fmt = ds => { const x = dateOf(ds); return `${x.getDate()}. ${MONTHS[x.getMonth()]}`; };
  const fmtAx = ds => { const x = dateOf(ds); return span > 300 ? `${MONTHS[x.getMonth()]} ${x.getFullYear()}` : fmt(ds); };
  [0, Math.floor((pts.length - 1) / 2), pts.length - 1].forEach((i, j) => { g += `<text x="${X(i)}" y="${H - 5}" class="xl" text-anchor="${j === 0 ? 'start' : j === 2 ? 'end' : 'middle'}">${fmtAx(pts[i].ds)}</text>`; });
  const late = snapFrom && snapFrom !== start;
  return `<h2 class="grp">Verlauf</h2><div class="chart">
    <svg viewBox="0 0 ${W} ${H}" class="pcsvg" role="img" aria-label="Verlauf der geübten, abrufbaren und gefestigten Sätze">${g}</svg>
    <p class="legend calleg"><span><i class="lk ln-n"></i>geübt</span><span><i class="lk ln-k"></i>geschätzt abrufbar</span><span><i class="lk ln-m"></i>gefestigt</span></p>
    ${late ? `<p class="legend">Abrufbar und gefestigt werden seit dem ${fmt(snapFrom)} erfasst.</p>` : !snapFrom ? '<p class="legend">Abrufbar und gefestigt werden ab heute erfasst.</p>' : ''}
  </div>`;
}
function totals(){
  const keys = Object.keys(DB.log).sort();
  let n = 0, secs = 0, days = 0; const years = {};
  keys.forEach(k => {
    let any = false; const y = k.slice(0, 4); years[y] = years[y] || { days:0, n:0, secs:0, mat:0 };
    ['sv', 'es'].forEach(l => { const x = dayLog(k, l); n += x.n || 0; secs += x.secs || 0; years[y].n += x.n || 0; years[y].secs += x.secs || 0; years[y].mat += x.mat || 0; if (x.n) any = true; });
    if (any) { days++; years[y].days++; }
  });
  const first = keys.find(k => ['sv', 'es'].some(l => dayLog(k, l).n));
  return { n, secs, first, days, years };
}
function viewProgress(){
  const tab = S.ptab || 'all';
  const lang = tab === 'all' ? S.lang : tab, L = LANG[lang];
  const sd = streakData(), tot = totals();
  const cal = calendarSvg(), mins = minutesChart();
  const items = BANK[lang];
  const practiced = items.filter(i => stOf(i.id)).length;
  const mature = matureCount(lang), nextM = nextMilestone(mature), prevM = prevMilestone(mature);
  const known = Math.round(knownEstimate(lang));
  const fresh7 = sumLog(lang, 7, 'fresh'), rev7 = sumLog(lang, 7, 'rev'), secs7 = sumLog(lang, 7, 'secs');
  const rev30 = sumLog(lang, 30, 'rev'), revOk30 = sumLog(lang, 30, 'revOk'), revM30 = sumLog(lang, 30, 'revM'), revMOk30 = sumLog(lang, 30, 'revMOk');
  const fc = forecast(lang), fcMax = Math.max(1, ...fc.map(f => f.n)), cap = size().maxRev;
  const dist = { anchored:0, mature:0, young:0, neu:0 };
  items.forEach(i => { const st = stOf(i.id); if (!st) dist.neu++; else if ((st.ivl || 0) >= ANCHORED) dist.anchored++; else if ((st.ivl || 0) >= MATURE) dist.mature++; else dist.young++; });
  const distRows = [['anchored', 'Verankert', 'nächste Wiederholung erst in einem Jahr oder später'], ['mature', 'Gefestigt', 'nächste Wiederholung in 3 Wochen bis 1 Jahr'], ['young', 'Im Aufbau', 'kommt innerhalb von 3 Wochen wieder'], ['neu', 'Neu', 'noch nicht geübt']];
  const hard = hardItems(lang);
  const collected = DB.own[lang].map(o => ({ id:o.id, de:o.de, target:o.target })).concat(DB.tat[lang].filter(o => !o.auto).map(o => ({ id:o.id, de:o.de, target:o.target })));
  const autoN = DB.tat[lang].filter(o => o.auto).length;
  const week7 = [fresh7 ? plural(fresh7, 'neuer Satz', 'neue Sätze') : '', rev7 ? plural(rev7, 'Wiederholung', 'Wiederholungen') : '', secs7 ? fmtMin(secs7) : ''].filter(Boolean);
  const firstDate = tot.first ? dateOf(tot.first) : null;
  const ret = rev30 >= 10 ? revOk30 / rev30 : null;
  const tabs = `<div class="ptabs" role="tablist">${[['all', 'Überblick'], ['sv', 'Schwedisch'], ['es', 'Spanisch']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${tab === k}" data-a="ptab" data-t="${k}">${l}</button>`).join('')}</div>`;
  if (tab === 'all') {
    const summary = ['sv', 'es'].map(l => {
      const n = BANK[l].filter(i => stOf(i.id)).length; if (!n) return '';
      const r30 = sumLog(l, 30, 'rev'), ok30 = sumLog(l, 30, 'revOk');
      const lastDay = Object.keys(DB.log).filter(k => (dayLog(k, l).n || 0) > 0).sort().pop();
      const ago = lastDay ? dayDiff(today(), lastDay) : null;
      return `<button type="button" class="langsum" data-a="ptab" data-t="${l}"><span class="ls-h">${LANG[l].deName}</span><span class="ls-n">${matureCount(l)}</span><span class="ls-l">gefestigte Sätze</span><span class="ls-s">${r30 >= 10 ? `Behalten ${pct(ok30 / r30)}` : `${n} geübt`}${ago != null ? ` · ${ago === 0 ? 'heute geübt' : ago === 1 ? 'gestern geübt' : `vor ${ago} Tagen geübt`}` : ''}</span></button>`;
    }).filter(Boolean).join('');
    return `<div class="topline"><h1 class="vt">Fortschritt</h1>${gearBtn()}</div>${noticeHtml()}${tabs}
  <section class="today">
    <p class="num">${plural(sd.current, 'Tag', 'Tage')} in Folge</p>
    <p class="breakdown">Längste Serie: ${plural(sd.longest, 'Tag', 'Tage')}. Ein Tag zählt, wenn du ein Tagwerk erledigst. Ein freier Tag pro Woche unterbricht die Serie nicht.</p>
    ${firstDate ? `<p class="hint" style="margin-top:0">Seit ${firstDate.getDate()}. ${MONTHS_FULL[firstDate.getMonth()]} ${firstDate.getFullYear()}: an ${tot.days.toLocaleString('de-DE')} Tagen geübt, ${tot.n.toLocaleString('de-DE')} Aufgaben${tot.secs ? `, ${fmtMin(tot.secs).replace(/\.$/, "")}` : ''}.</p>` : ''}
    ${Object.keys(tot.years).filter(y => tot.years[y].days).length > 1 ? `<table class="years"><thead><tr><th>Jahr</th><th>Tage</th><th>Aufgaben</th><th>Zeit</th></tr></thead><tbody>${Object.keys(tot.years).filter(y => tot.years[y].days).sort().reverse().map(y => { const v = tot.years[y]; return `<tr><td>${y}</td><td>${v.days}</td><td>${v.n.toLocaleString('de-DE')}</td><td>${v.secs ? fmtMin(v.secs).replace(/\.$/, '') : '–'}</td></tr>`; }).join('')}</tbody></table>` : ''}
  </section>
  <h2 class="grp">Übungstage</h2>
  <div class="chart">${cal.svg}
    <p class="legend">${S.calDay ? esc(dayDetail(S.calDay)) : cal.first ? `An ${cal.active} von ${cal.total} Tagen geübt, seit deinem ersten Übungstag am ${dateOf(cal.first).getDate()}. ${MONTHS_FULL[dateOf(cal.first).getMonth()]}${dateOf(cal.first).getFullYear() !== dateOf(today()).getFullYear() ? ' ' + dateOf(cal.first).getFullYear() : ''}. Tipp auf einen Tag für Details${cal.scrollable ? ', nach rechts wischen für frühere Wochen' : ''}.` : 'Noch keine Übungstage.'}</p>
    <p class="legend calleg"><span><i class="sq c2"></i>Tagwerk</span><span><i class="sq c3"></i>Tagwerk und mehr</span><span><i class="sq c1"></i>nur etwas geübt</span><span><i class="sq c0 fr"></i>freier Tag</span></p></div>
  ${mins.any ? `<h2 class="grp">Lernminuten, letzte 14 Tage</h2><div class="chart">${mins.html}<p class="legend"><span class="sq m-sv"></span>Schwedisch <span class="sq m-es"></span>Spanisch. Zusammen ${mins.total} Min.${(() => { let s = 0, n = 0; Object.keys(DB.log).forEach(k => { if (dayDiff(today(), k) >= 30) return; const v = (dayLog(k, 'sv').secs || 0) + (dayLog(k, 'es').secs || 0); if (v) { s += v; n++; } }); return n >= 5 ? ` Im Schnitt ${Math.round(s / n / 60)} Min. an Übungstagen, letzte 30 Tage.` : ''; })()}${mins.unm ? ' „–“: geübt, aber noch ohne Zeitmessung.' : ''}</p></div>` : ''}
  ${hoursHtml()}

  ${summary ? `<h2 class="grp">Sprachen</h2><div class="langsums">${summary}</div>` : ''}
  ${wayHtml()}`;
  }
  return `<div class="topline"><h1 class="vt">Fortschritt</h1>${gearBtn()}</div>${noticeHtml()}${tabs}
  <section class="today">
    <p class="eyebrow">${L.deName}</p>
    <p class="num">${mature} <button type="button" class="term" data-a="term" data-k="gefestigt">${mature === 1 ? 'gefestigter Satz' : 'gefestigte Sätze'}</button></p>
    <div class="mbar" aria-hidden="true"><span style="width:${Math.round((mature - prevM) / Math.max(1, nextM - prevM) * 100)}%"></span></div>
    <p class="hint" style="margin-top:6px">Nächstes Ziel: ${nextM}${mature ? `, noch ${nextM - mature}` : ''}.</p>
    ${practiced ? (() => { const v = vocabCount(lang), ago = snapAgo(lang, 30), dv = ago && ago.w != null ? v.all - ago.w : null;
      return `<div class="kpis">
        <div><b>${known}</b><span>von ${practiced} <button type="button" class="term" data-a="term" data-k="abrufbar">abrufbar</button></span></div>
        <div><b>${v.all.toLocaleString('de-DE')}</b><span>Wörter${dv ? ` <span class="up">+${dv}</span>` : ''}</span></div>
        <div><b>${secs7 ? fmtMin(secs7).replace(/\.$/, '') : '–'}</b><span>letzte 7 Tage</span></div>
      </div>`; })() : ''}
  </section>
  ${progressChart(lang)}
  <h2 class="grp">Behalten, letzte 30 Tage</h2>
  <div class="chart"><p class="stat">${ret != null ? `<b>${pct(ret)}</b> Von ${rev30} fälligen Sätzen wusstest du ${revOk30} beim ersten Versuch noch.` : rev30 ? `Erst ${plural(rev30, 'Wiederholung', 'Wiederholungen')}. Ab 10 gibt es hier eine Quote.` : 'Noch keine Wiederholungen. Sätze kommen ab dem Tag nach dem ersten Üben wieder.'}</p>
  ${retTrend(lang)}
  ${revM30 >= 10 ? `<p class="legend">Bei gefestigten Sätzen: ${pct(revMOk30 / revM30)} (${revMOk30} von ${revM30}).</p>` : ''}
  ${ret != null ? `<p class="legend">Die Wiederholungen sind so geplant, dass du etwa 90 % noch weißt. ${ret < 0.8 ? 'Du liegst deutlich darunter. Meist heißt das: zu viel Neues auf einmal. Ein kürzeres Tagwerk hilft.' : ret > 0.95 ? 'Du liegst deutlich darüber. Ein längeres Tagwerk würde dich nicht überfordern.' : 'Du liegst im Plan.'}</p>` : ''}</div>
  <h2 class="grp">Stand der Sätze</h2>
  <div class="chart"><div class="stack" aria-hidden="true">${['anchored', 'mature', 'young', 'neu'].map(k => dist[k] ? `<span class="s-${k}" style="flex:${dist[k]}"></span>` : '').join('')}</div>
  <p class="legend distline"><span><span class="sq s-anchored"></span>${dist.anchored} <button type="button" class="term" data-a="term" data-k="verankert">verankert</button></span><span><span class="sq s-mature"></span>${dist.mature} <button type="button" class="term" data-a="term" data-k="gefestigt">gefestigt</button></span><span><span class="sq s-young"></span>${dist.young} im Aufbau</span><span><span class="sq s-neu"></span>${dist.neu} neu</span></p></div>
  <h2 class="grp">Wiederholungen der nächsten Tage</h2>
  <div class="chart">${fc.every(f => !f.n) ? '<p class="stat" style="margin:0">In den nächsten sieben Tagen ist nichts fällig.</p>' : ''}<div class="fc${fc.every(f => !f.n) ? ' empty' : ''}">${fc.map(f => `<div class="fcd"><span class="fcn">${f.n}</span><span class="fcb"><span style="height:${Math.round(f.n / fcMax * 100)}%"></span></span><span class="fcl">${f.label}</span></div>`).join('')}</div>
  ${fc.some(f => f.n > cap) ? `<p class="legend">Ein Tagwerk nimmt höchstens ${cap} Wiederholungen auf. Der Rest kommt am Tag darauf.</p>` : ''}</div>
  ${hard.length ? `<h2 class="grp">Schwierigste Sätze</h2><div class="rows">${hard.map(i => `<div class="row static kv"><span class="txt"><span class="rt" lang="${lang}">${esc(i.target)}</span><span class="rd">${esc(i.de)}</span></span><span class="val dimv">${stOf(i.id).bad}× falsch</span></div>`).join('')}</div><div class="btnrow"><button type="button" class="ghost" data-a="hard">${hard.length === 1 ? 'Diesen Satz üben' : `Diese ${hard.length} Sätze üben`}</button></div>` : ''}
  ${errorSourcesHtml(lang)}
  ${topicGridHtml(lang)}
  ${writingTrendHtml(lang)}
  ${(() => { const gl = (DB.genus && DB.genus[lang]) || {}, traps = Object.keys(gl).filter(w => gl[w].last === 0);
    const gens = genIds(lang).map(g => { const rc = (DB.gen[g] && DB.gen[g].recent) || []; return rc.length >= 10 ? `${GENS[g].short || GENS[g].label} ${Math.round(rc.reduce((a, x) => a + x, 0) / rc.length * 100)} %` : ''; }).filter(Boolean);
    return gens.length || traps.length ? `<p class="legend" style="margin:6px 4px 0">${gens.length ? `Erzeugte Aufgaben, zuletzt richtig: ${esc(gens.join(', '))}.` : ''}${traps.length ? ` Genus-Fallen: ${esc(traps.slice(0, 6).map(w => { const it = GENUS[lang].find(x => x[0] === w); return it ? `${it[1]} ${w}` : w; }).join(', '))}. <button type="button" class="link inl" data-a="form" data-g="genus_${lang}">Genus üben</button>` : ''}</p>` : ''; })()}
  ${collected.length ? `<h2 class="grp">Gesammelte Sätze (${collected.length})</h2><div class="rows">${collected.slice().reverse().slice(0, S.colAll ? 9999 : 5).map(o => `<div class="row static"><span class="txt"><span class="rt" lang="${lang}">${esc(o.target)}</span><span class="rd">${esc(o.de)}</span></span><button type="button" class="link${S.armed === 'del:' + o.id ? ' armed' : ''}" data-a="coldel" data-id="${o.id}">${S.armed === 'del:' + o.id ? 'Wirklich entfernen?' : 'Entfernen'}</button>${S.armed === 'del:' + o.id ? '<span class="armnote">Der Lernstand geht verloren.</span>' : ''}</div>`).join('')}</div>${collected.length > 5 ? `<div class="btnrow"><button type="button" class="ghost" data-a="colall">${S.colAll ? 'Weniger anzeigen' : `Alle ${collected.length} anzeigen`}</button></div>` : ''}` : ''}

`;
}

function popupHtml(){
  const P = S.pop; if (!P) return '';
  if (P.type === 'topic') return topicSheetHtml(P);
  if (P.type === 'term') return termSheetHtml(P);
  const e = P.entry;
  let body;
  const exs = examplesFor(P.lang, P.w);
  if (e) body = `${e.l ? `<p class="popl">Grundform: <b lang="${P.lang}">${esc(e.l)}</b></p>` : ''}<p class="popde">${termify(e.de)}</p>${exs.length ? `<p class="pop-sub">In deinen Sätzen</p><ul class="exl">${exs.map(x => `<li><span lang="${P.lang}" class="exs">${esc(x.target)}</span><span class="exg">${esc(x.de)}</span></li>`).join('')}</ul>` : ''}`;
  else if (P.status === 'loading') body = '<p class="popl"><span class="dots">Suche bei Wiktionary</span></p>';
  else if (P.status === 'web') body = P.web.length ? `<ul class="popweb">${P.web.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="src">Aus dem englischen Wiktionary</p>` : '<p class="popl">Auch bei Wiktionary nichts gefunden.</p>';
  else if (P.status === 'error') body = `<p class="popl">${esc(P.err)}</p>`;
  else body = `<p class="popl">Nicht im eingebauten Wörterbuch.</p><button type="button" class="go" data-a="popweb">Online nachsehen</button>`;
  return `<div class="popov" data-a="popclose"></div><div class="pop" role="dialog" aria-label="Wörterbuch">
    <div class="pophead"><span class="popw" lang="${P.lang}">${esc(P.w)}</span>${speakBtn(P.w, P.lang)}</div>
    ${body}
    ${P.si != null && S.view === 'text' ? `<button type="button" class="ghost icon popsay" data-a="tsay" data-i="${P.si}">${ICON} Ganzen Satz anhören</button>` : ''}
    <div class="popfoot"><button type="button" class="link" data-a="popext">Bei ${P.lang === 'es' ? 'LEO' : 'dict.cc'} öffnen</button><button type="button" class="ghost" data-a="popclose">Schließen</button></div>
  </div>`;
}
function renderPopup(){ const el = document.getElementById('pop'); if (el) el.innerHTML = popupHtml(); document.body.classList.toggle('has-pop', !!S.pop); }
function viewSettings(){
  const L = LANG[S.lang];
  const autoN = DB.tat[S.lang].filter(o => o.auto).length;
  return backBar('Einstellungen', S.settingsFrom || 'home') + noticeHtml() + `
  <h2 class="grp">Länge des Tagwerks</h2>
  <p class="setl-n">Gilt ab dem nächsten Tagwerk.</p>
  <div class="seg3" role="radiogroup">${Object.entries(SIZES).map(([k, v]) => `<button type="button" role="radio" aria-checked="${DB.settings.size === k}" data-a="size" data-s="${k}">${v.label}<span>${v.newPer} neue Sätze, höchstens ${v.maxRev} Wiederholungen</span></button>`).join('')}</div>
  <h2 class="grp">Mein Niveau</h2>
  <div class="seg3" role="radiogroup">${[['grund', 'Grundlagen'], ['mittel', 'Mittel'], ['fort', 'Fortgeschritten']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${(DB.settings.niveau || 'mittel') === k}" data-a="niveau" data-v="${k}">${l}</button>`).join('')}</div>
  <p class="setl-n">${{ grund:'Kurze, einfache Sätze zuerst.', mittel:'Neue Sätze aus allen Stufen, gemischt.', fort:'Lange und anspruchsvolle Sätze zuerst. Einfache nur in Themen, in denen du zuletzt öfter Fehler gemacht hast. Sichere Grammatik-Übungen kommen seltener, Lesetexte sind nach Schwierigkeit sortiert.' }[DB.settings.niveau || 'mittel']}</p>
  <h2 class="grp">Vorlesen</h2>
  <div class="rows">
    <button type="button" class="row toggle" role="switch" aria-checked="${!!DB.settings.autoplay}" data-a="autoplay"><span class="txt"><span class="rt">Lösung nach dem Prüfen vorlesen</span><span class="rd">Verbindet Schriftbild und Aussprache. Unterwegs ohne Kopfhörer besser aus.</span></span><span class="sw" aria-hidden="true"></span></button>
  </div>
  ${navigator.vibrate ? `<h2 class="grp">Vibration</h2>
  <div class="rows">
    <button type="button" class="row toggle" role="switch" aria-checked="${DB.settings.haptics !== false}" data-a="haptics"><span class="txt"><span class="rt">Kurz vibrieren nach dem Prüfen</span><span class="rd">Einmal bei richtig, zweimal bei falsch</span></span><span class="sw" aria-hidden="true"></span></button>
  </div>` : ''}
  <h2 class="grp">Nachschub</h2>
  <div class="rows">
    <button type="button" class="row toggle" role="switch" aria-checked="${!!DB.settings.refill}" data-a="refill"><span class="txt"><span class="rt">Neue Sätze automatisch von Tatoeba holen</span><span class="rd">Sobald die eingebauten Sätze zur Neige gehen und du online bist. Mit deinem Fortschritt werden die Sätze länger.${autoN ? ` Bisher ${autoN} Sätze für ${L.deName}.` : ''}</span></span><span class="sw" aria-hidden="true"></span></button>
  </div>
  <h2 class="grp">Daten</h2>
  <div class="rows">
    <button type="button" class="row" data-a="export"><span class="txt"><span class="rt">Backup exportieren</span><span class="rd">Dein Fortschritt liegt nur auf diesem Gerät. ${DB.lastBackup ? `Letztes Backup am ${dateOf(DB.lastBackup).getDate()}. ${MONTHS_FULL[dateOf(DB.lastBackup).getMonth()]} ${dateOf(DB.lastBackup).getFullYear()}.` : 'Noch kein Backup gemacht.'}</span></span></button>
    ${canShareBackup() ? '<button type="button" class="row" data-a="shareBackup"><span class="txt"><span class="rt">Backup teilen</span><span class="rd">Etwa in Google Drive oder per Mail sichern</span></span></button>' : ''}
    <label class="row"><span class="txt"><span class="rt">Backup einspielen</span><span class="rd">Ersetzt den aktuellen Stand. Danach lässt es sich rückgängig machen.</span></span><input type="file" id="importFile" hidden></label>
    ${['sv', 'es'].map(l => `<button type="button" class="row danger${S.armed === 'reset:' + l ? ' armed' : ''}" data-a="reset" data-l="${l}"><span class="txt"><span class="rt">${S.armed === 'reset:' + l ? 'Wirklich zurücksetzen?' : `${LANG[l].deName} zurücksetzen`}</span><span class="rd">${S.armed === 'reset:' + l ? 'Löscht Fortschritt, Statistik und gesammelte Sätze dieser Sprache. Nicht rückgängig zu machen.' : 'Löscht Fortschritt und gesammelte Sätze dieser Sprache'}</span></span></button>`).join('')}
  </div>
  <h2 class="grp">Über Tagwerk</h2>
  <p class="src" style="margin-top:0">Die Wiederholungen plant FSRS-6, dasselbe Verfahren wie in Anki. Lernminuten werden pro Aufgabe gemessen, Pausen über zwei Minuten zählen nicht. Internet brauchen nur die Beispielsätze von Tatoeba, die Textprüfung mit LanguageTool und das Wörterbuch.</p>
  <p class="src">Version ${esc(APP_VERSION)}</p>`;
}
function render(){
  if (S.view !== 'radio' && S.radio) stopRadio();
  if (S.view !== 'text' && S.text && S.text.playing) stopReading();
  if ((S.view === 'run' || S.view === 'runDone') && !S.run) S.view = 'home';
  const lang = (S.view === 'run' || S.view === 'runDone') ? S.run.lang : S.lang;
  document.body.dataset.lang = lang;
  tabs();
  let h = '';
  switch (S.view) {
    case 'home': h = viewHome(); break;
    case 'extra': h = viewExtra(); break;
    case 'pickTopic': h = viewPickTopic(); break;
    case 'pickGen': h = viewPickGen(); break;
    case 'run': h = viewRun(); break;
    case 'runDone': h = viewRunDone(); break;
    case 'shadow': h = viewShadow(); break;
    case 'radio': h = viewRadio(); break;
    case 'texts': h = viewTexts(); break;
    case 'text': h = S.text && !S.text.id && !S.text.wiki ? viewWikiLoading() : viewText(); break;
    case 'write': h = viewWrite(); break;
    case 'own': h = viewOwn(); break;
    case 'tat': h = viewTat(); break;
    case 'settings': h = viewSettings(); break;
    case 'ref': h = viewRef(); break;
    default: h = viewProgress();
  }
  $('#app').innerHTML = h;
  renderPopup();
  document.body.classList.toggle('has-actions', !!$('#app .actionbar'));
  if (S.view === 'tat') { const w = $('#tatWord'); if (w) w.addEventListener('input', ev => { S.tat.word = ev.target.value; }); }
  sizeGap($('#answer'));
  // Hördiktat: Satz beim Erscheinen einmal abspielen. render() läuft im Klick auf „Weiter“ bzw. „Hördiktat“,
  // daher erlaubt der Browser den Ton; nach einem Neustart mitten in der Runde bleibt es ggf. still.
  if (S.view === 'run' && S.run && S.run.cur && S.run.cur.intro && S.run.cur.state === 'answer') {
    const ex = S.run.queue[S.run.idx], run = S.run;
    if (ex && ex.type === 'dict') setTimeout(() => { if (S.run === run && run.queue[run.idx] === ex && run.cur.state === 'answer') playItem(itemById(ex.id), 0.9, true); }, 300);
  }
  if (S.run && S.run.cur) { S.run.cur.enter = false; S.run.cur.intro = false; }
  const cs = $('#calscroll');
  if (cs) { cs.scrollLeft = S.calScroll != null ? S.calScroll : cs.scrollWidth; cs.addEventListener('scroll', () => { S.calScroll = cs.scrollLeft; }, { passive:true }); }
  if (S.view === 'runDone' && S.run) S.run.stamped = true;
  if (S.focus) { S.focus = false; const el = $('#answer'); if (el && !el.readOnly) { try { el.focus({ preventScroll:true }); } catch (e) {} caretToEnd(el); } }
}
// Vorgegebener Satzanfang („Tyvärr …“): Schreibmarke ans Ende, nicht davor
function caretToEnd(el){
  if (!el || el.readOnly || !el.value || typeof el.setSelectionRange !== 'function') return;
  try { const n = el.value.length; el.setSelectionRange(n, n); } catch (e) {}
}
// Lücke: immer gleich breit, solange sie leer ist (verrät nichts über die Lösung), und wächst mit dem Getippten
let gapMeasure = null;
const NATIVE_GAP = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('field-sizing', 'content');
function sizeGap(el){
  if (!el || !el.classList || !el.classList.contains('gapin') || NATIVE_GAP) return;
  const val = el.value || '';
  if (!val) { el.style.width = ''; return; }
  let w = 0;
  try {
    if (!gapMeasure) { gapMeasure = document.createElement('span'); gapMeasure.className = 'gapmeasure'; gapMeasure.setAttribute('aria-hidden', 'true'); document.body.appendChild(gapMeasure); }
    gapMeasure.style.font = getComputedStyle(el).font;
    gapMeasure.style.letterSpacing = getComputedStyle(el).letterSpacing;
    gapMeasure.textContent = val;
    w = gapMeasure.getBoundingClientRect().width;
  } catch (e) {}
  const box = el.closest('.cloze');
  const max = box ? box.getBoundingClientRect().width : 0;
  if (w > 0) el.style.width = `${Math.round(Math.min(max || Infinity, w * 1.2 + 30))}px`;
  else el.style.width = `calc(${val.length + 2}ch + 12px)`;
}
function scrollFb(){ const f = $('#fb'); if (f && f.innerHTML) { try { f.scrollIntoView({ block:'nearest', behavior:'smooth' }); } catch (e) {} } }
