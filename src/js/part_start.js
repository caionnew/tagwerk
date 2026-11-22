/* ---------- Begrüßung in der Zielsprache ---------- */
function greeting(lang){
  const ev = nextEvent(lang, today(), 0);
  if (ev) return ev.ev[3];
  const h = new Date().getHours();
  if (lang === 'sv') return h < 5 ? 'Sent uppe?' : h < 10 ? 'God morgon!' : h < 17 ? 'Hej!' : h < 23 ? 'God kväll!' : 'Sent uppe?';
  return h < 5 ? '¿Trasnochando?' : h < 12 ? '¡Buenos días!' : h < 20 ? '¡Buenas tardes!' : '¡Buenas noches!';
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
