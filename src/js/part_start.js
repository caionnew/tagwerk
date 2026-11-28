/* ---------- Begrüßung in der Zielsprache ----------
   Jeden Tag eine andere, innerhalb einer Tageszeit dieselbe (sonst wechselte sie bei jedem Neuzeichnen). Vorrang: Fest heute,
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
// Tageszeit wie bisher: Schwedisch Morgen bis 10, Tag bis 17, Abend bis 23; Spanisch días bis 12, tardes bis 20, noches danach
function greetSlot(lang, h){
  if (lang === 'sv') return h < 5 || h >= 23 ? 'late' : h < 10 ? 'morning' : h < 17 ? 'day' : 'evening';
  return h < 5 ? 'late' : h < 12 ? 'morning' : h < 20 ? 'day' : 'evening';
}
function greeting(lang, now = new Date()){
  const t = fmt(now), ev = nextEvent(lang, t, 0);
  if (ev) return ev.ev[3];
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
