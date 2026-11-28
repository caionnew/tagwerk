/* ---------- Begrüßung in der Zielsprache ----------
   Jeden Tag eine andere, innerhalb einer Tageszeit dieselbe (sonst wechselte sie bei jedem Neuzeichnen). Vorrang: Feiertag,
   erster Tag überhaupt, Rückkehr nach drei und mehr Tagen ohne Üben, Tagwerk in dieser Sprache erledigt, heute schon geübt,
   dann Wochentag (Freitagabend fredagsmys, Mittwoch lillördag), dann Tageszeit (am frühen Nachmittag mal fika oder die Frage nach
   dem Mittagessen). Kurz genug für eine Zeile neben dem Wochenstreifen (höchstens 16 Zeichen). Jedes Wort ist antippbar, darum
   stehen alle im Wörterbuch, Wendungen beim Wort, das sie trägt (länge sen = lange her). */
const GREET = {
  sv:{
    late:['Sent uppe?', 'Nattuggla?', 'Sömnlös?'],
    morning:['God morgon!', 'Godmorgon!', 'Morrn!', 'Kaffe först?', 'Pigg i dag?'],
    early:['Tidigt ute!'], // dazu noon: fika am frühen Nachmittag, im Spanischen die Frage nach dem Mittagessen
    day:['Hej!', 'Hallå där!', 'Tjena!', 'Hej på dig!', 'Hej hej!'],
    noon:['Dags för fika?'],
    evening:['God kväll!', 'Hej!', 'Hallå där!', 'Kvällspass?'],
    first:['Nu kör vi!'], back:['Länge sen!', 'Välkommen åter!'], again:['Hej igen!'], done:['Bra jobbat!', 'Snyggt jobbat!', 'Klart för i dag!'],
    // Wochentag (0 = Sonntag) und Tageszeit
    week:{ 1:{ morning:['Måndag igen!'] }, 3:{ evening:['Glad lillördag!'] }, 5:{ day:['Äntligen fredag!'], evening:['Fredagsmys!'] }, 6:{ evening:['Lördagskväll!'] }, 0:{ day:['Skön söndag!'] } }
  },
  es:{
    late:['¿Trasnochando?', '¡Qué tarde es!', '¿Sin sueño?'],
    morning:['¡Buenos días!', '¡Buen día!', '¿Un cafecito?', '¡Arriba!'],
    early:['¡Qué madrugón!'],
    day:['¡Buenas tardes!', '¡Hola!', '¡Buenas!', '¿Qué tal?', '¡Hola, hola!'],
    noon:['¿Ya has comido?'],
    evening:['¡Buenas noches!', '¿Qué tal el día?', '¡Buenas!'],
    first:['¡Empezamos!'], back:['¡Cuánto tiempo!', '¡Qué bien verte!'], again:['¡Hola de nuevo!'], done:['¡Bien hecho!', '¡Buen trabajo!', '¡Así se hace!'],
    week:{ 1:{ morning:['¡Feliz lunes!'] }, 5:{ day:['¡Ya es viernes!'], evening:['¡Ya es viernes!'] }, 6:{ evening:['¡Buen finde!'] }, 0:{ day:['¡Feliz domingo!'] } }
  }
};
// Feiertage (seit 24.90.0): [erster Tag im Jahr, Anzahl Tage, Gruß, Zeichen]. Das erste passende gilt, darum Einzeltage vor
// Zeiträumen (Inocentes vor „¡Felices fiestas!“). Datum über den Namen aus EVENTS (fundstueck.js), wo das Fest dort steht.
// Feste ohne Gruß hier (Alla helgons dag, Día de Muertos, La Tomatina) bekommen den gewöhnlichen. Zeichen: kleine Linienzeichnung
// hinter dem Gruß (ORN), beim ersten Öffnen am Tag einmal bewegt. Höchstens 18 Zeichen; was nicht in eine Zeile passt, wird kleiner
// (fitGreeting).
const feastDay = (lang, name) => y => { const e = EVENTS[lang].find(x => x[0] === name); return e ? e[1](y) : null; };
const adventDay = n => y => { for (let d = 27; d <= 33; d++) { const x = new Date(y, 10, d); if (x.getDay() === 0) return new Date(y, 10, d + 7 * (n - 1)); } return null; };
const HOLIDAY_GREET = {
  sv:[
    [feastDay('sv', 'Fettisdagen'), 1, 'Semmeldags!'],
    [fromEaster(-1), 3, 'Glad påsk!'],
    [feastDay('sv', 'Våffeldagen'), 1, 'Våffeldags!'],
    [feastDay('sv', 'Valborg'), 1, 'Glad valborg!', 'fire'],
    [feastDay('sv', 'Nationaldagen'), 1, 'Glad nationaldag!'],
    [feastDay('sv', 'Midsommar'), 2, 'Glad midsommar!', 'sun'],
    [feastDay('sv', 'Surströmmingspremiär'), 1, 'Håll för näsan!'],
    [feastDay('sv', 'Kanelbullens dag'), 1, 'Kanelbulle?'],
    [feastDay('sv', 'Mårtensafton'), 1, 'Mårtensgås?'],
    [feastDay('sv', 'Lucia'), 1, 'Glad lucia!', 'candle'],
    [fixed(12, 23), 1, 'Lillejulafton!', 'star'],
    [feastDay('sv', 'Julafton'), 3, 'God jul!', 'star'],
    [fixed(12, 27), 4, 'God fortsättning!'],
    [feastDay('sv', 'Nyårsafton'), 1, 'Gott nytt år!', 'spark'],
    [fixed(1, 1), 1, 'Gott nytt år!', 'spark'],
    [fixed(1, 2), 5, 'Gott nytt år!'],
    // Adventssonntage zuletzt: Lucia (2026 der dritte Advent) und Heiligabend gehen vor
    [adventDay(1), 1, 'Trevlig advent!', 'candle'], [adventDay(2), 1, 'Trevlig advent!', 'candle'],
    [adventDay(3), 1, 'Trevlig advent!', 'candle'], [adventDay(4), 1, 'Trevlig advent!', 'candle']
  ],
  es:[
    [fixed(1, 1), 1, '¡Feliz Año Nuevo!', 'spark'],
    [fixed(1, 2), 4, '¡Feliz año!'],
    [feastDay('es', 'Día de Reyes'), 1, '¡Felices Reyes!', 'star'],
    [feastDay('es', 'Carnaval'), 1, '¡Feliz Carnaval!'],
    [feastDay('es', 'Las Fallas'), 1, '¡Felices Fallas!', 'fire'],
    [fromEaster(0), 1, '¡Feliz Pascua!'],
    [feastDay('es', 'Sant Jordi'), 1, '¡Feliz Sant Jordi!'],
    [feastDay('es', 'Noche de San Juan'), 1, '¡Feliz San Juan!', 'fire'],
    [feastDay('es', 'Independencia de México'), 1, '¡Viva México!'],
    [feastDay('es', 'Fiestas Patrias'), 1, '¡Viva Chile!'],
    [feastDay('es', 'Fiesta Nacional'), 1, '¡Hoy es fiesta!'],
    [feastDay('es', 'Nochebuena'), 1, '¡Feliz Nochebuena!', 'star'],
    [fixed(12, 25), 1, '¡Feliz Navidad!', 'star'],
    [feastDay('es', 'Día de los Inocentes'), 1, '¡No te fíes hoy!'],
    [fixed(12, 26), 5, '¡Felices fiestas!'],
    [feastDay('es', 'Nochevieja'), 1, '¡Feliz Nochevieja!', 'spark']
  ]
};
function holidayGreet(lang, t){
  const y = Number(t.slice(0, 4));
  for (const [rule, n, g, orn] of HOLIDAY_GREET[lang]) {
    const d = rule(y); if (!d) continue;
    const k = dayDiff(t, ymd(d));
    if (k >= 0 && k < n) return { g, orn:orn || '' };
  }
  return null;
}
// Zeichen zum Feiertagsgruß, 24er Raster wie die Symbole: Kerze (Advent, Lucia), Stern (Weihnachten, Reyes), Feuerwerk (Neujahr),
// Sonne (Mittsommer), Feuer (Valborg, Fallas, San Juan). Was sich bewegt, hat eine eigene Klasse (Flamme, Strahlen).
const ORN_RAYS = (r1, r2) => Array.from({ length:8 }, (_, i) => { const a = Math.PI / 4 * i - Math.PI / 2, c = Math.cos(a), s = Math.sin(a); return `M${(12 + r1 * c).toFixed(1)} ${(12 + r1 * s).toFixed(1)}L${(12 + r2 * c).toFixed(1)} ${(12 + r2 * s).toFixed(1)}`; }).join('');
const ORN = {
  candle:'<path d="M8.8 21.2v-9.4h6.4v9.4M6.5 21.2h11M12 9.4v2.4"/><path class="orn-fl" d="M12 9.4c-2.2-1.6-2.5-4 0-7 2.5 3 2.2 5.4 0 7Z"/>',
  star:'<path class="orn-st" d="m12 3.2 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.2Z"/>',
  spark:`<path class="orn-ry" d="${ORN_RAYS(4.2, 9.6)}"/><circle cx="12" cy="12" r="1.3"/>`,
  sun:`<circle cx="12" cy="12" r="3.8"/><path class="orn-ry" d="${ORN_RAYS(6.3, 9.4)}"/>`,
  fire:'<path class="orn-fl" d="M12 19.6c-3 0-5-1.9-5-4.6 0-2.4 1.6-3.8 2.8-5.6.4 1.4 1.1 2.3 2.1 2.7-.3-2.7.8-5.1 3.1-7-.2 2.4.7 3.9 1.7 5.3.9 1.3 1.6 2.6 1.6 4.4 0 3-2.3 4.8-6.3 4.8Z"/><path d="M5 21.5 19 19M19 21.5 5 19"/>'
};
// Tageszeit wie bisher: Schwedisch Morgen bis 10, Tag bis 17, Abend bis 23; Spanisch días bis 12, tardes bis 20, noches danach
function greetSlot(lang, h){
  if (lang === 'sv') return h < 5 || h >= 23 ? 'late' : h < 10 ? 'morning' : h < 17 ? 'day' : 'evening';
  return h < 5 ? 'late' : h < 12 ? 'morning' : h < 20 ? 'day' : 'evening';
}
function greeting(lang, now = new Date()){
  const t = fmt(now), hol = holidayGreet(lang, t);
  if (hol) return hol.g;
  const G = GREET[lang], di = dayIndex(t), on = (list, k = 0) => list[(di + k) % list.length];
  const days = Object.keys(DB.log).filter(d => d < t && ['sv', 'es'].some(l => dayLog(d, l).n)).sort();
  const todayAny = ['sv', 'es'].some(l => dayLog(t, l).n);
  if (!days.length && !todayAny) return G.first[0];
  if (!todayAny && days.length && dayDiff(t, days[days.length - 1]) >= 3) return on(G.back);
  if (doneIn(t, lang)) return on(G.done);
  if (dayLog(t, lang).n) return on(G.again);
  const h = now.getHours(), slot = greetSlot(lang, h), wk = (G.week[now.getDay()] || {})[slot];
  if (wk) return on(wk);
  // Früh am Morgen (bis 7) und am frühen Nachmittag (14 bis 16) jeden zweiten Tag die besondere Fassung
  if (h >= 5 && h < 7 && slot === 'morning' && di % 2) return on(G.early);
  if (h >= 14 && h < 16 && di % 2) return on(G.noon);
  return on(G[slot]);
}
// Gruß für den Kopf von „Heute“: Wörter antippbar, am Feiertag mit Zeichen. Bewegt wird das Zeichen nur beim ersten Zeichnen am Tag.
function greetHtml(lang, now = new Date()){
  const t = fmt(now), g = greeting(lang, now), hol = holidayGreet(lang, t), orn = hol && hol.g === g ? hol.orn : '';
  const anim = orn && S.greetAnim !== t + lang;
  if (anim) S.greetAnim = t + lang;
  return `<p class="hello-g wordrow" lang="${lang}">${linkWords(g, lang)}${orn ? `<svg class="orn orn-${orn}${anim ? ' go' : ''}" viewBox="0 0 24 24" aria-hidden="true">${ORN[orn]}</svg>` : ''}</p>`;
}
// Der Gruß steht in einer Zeile neben der Woche. Wie breit er ist, hängt an der Schrift des Geräts (Noto Serif und Georgia laufen
// gut ein Sechstel breiter als Times), darum gemessen statt gezählt: Bricht er um, eine Stufe kleiner, höchstens zwei.
function fitGreeting(){
  const g = $('#app .hello-g');
  if (!g || !g.getBoundingClientRect || typeof getComputedStyle !== 'function') return;
  const one = () => g.getBoundingClientRect().height < parseFloat(getComputedStyle(g).lineHeight) * 1.5;
  for (const c of ['fit1', 'fit2']) { if (one()) return; g.classList.add(c); }
}
/* ---------- Start über Teilen oder App-Verknüpfung ---------- */
function guessLang(text){
  const t = ' ' + text.toLowerCase() + ' ';
  let sv = (t.match(/[åäö]/g) || []).length * 2, es = (t.match(/[ñ¿¡áíóú]/g) || []).length * 2;
  ['och', 'jag', 'att', 'är', 'det', 'inte', 'som', 'på'].forEach(w => { if (t.includes(' ' + w + ' ')) sv++; });
  ['el', 'la', 'que', 'los', 'una', 'por', 'con', 'es'].forEach(w => { if (t.includes(' ' + w + ' ')) es++; });
  return sv > es ? 'sv' : es > sv ? 'es' : S.lang;
}
function handleLaunch(){
  let q;
  try { q = new URLSearchParams(location.search); } catch (e) { return false; }
  const shared = [q.get('title'), q.get('text')].filter(Boolean).join(' ').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  const go = q.get('go');
  if (!shared && !go) return false;
  try { history.replaceState(null, '', location.pathname); } catch (e) {}
  if (shared) {
    const lang = guessLang(shared);
    S.lang = lang; DB.settings.lang = lang;
    S.own = { lang, de:'', t:shared.slice(0, 240) };
    S.view = 'own';
    S.notice = { text:`Geteilter Text übernommen (${LANG[lang].deName}). Kürze ihn bei Bedarf auf einen Satz und ergänze die Übersetzung.`, kind:'ok' };
    return true;
  }
  if (go === 'daily') { startRun('daily'); return true; }
  if (go === 'quick') { startRun('quick'); return true; }
  if (go === 'own') { S.own = { lang:S.lang, de:'', t:'' }; S.view = 'own'; return true; }
  return false;
}
