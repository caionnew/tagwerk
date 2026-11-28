/* ---------- Verbformen beider Sprachen (seit 24.86.0) ----------
   Für Wörterbuch, Prüfung und Übungsformen an einer Stelle. Das Wörterbuch (buildGloss) leitet daraus die Formen aller Verben ab,
   die es kennt; Einträge von Hand gehen immer vor.
   Spanisch: alle einfachen Formen in sechs Personen (yo, tú, él, nosotros, vosotros, ellos). Unregelmäßiges aus IRR_ES (generators.js)
   und ES_IRR_MORE, Zusammensetzungen (mantener wie tener, despedir wie pedir), Stammwechsel aus Listen, Rechtschreibung
   (busqué, conozco, sigo, cojo, construyo, envío). Ein Verb mit Stammwechsel, das in keiner Liste steht, bekäme regelmäßige Formen:
   neue Verben mit e oder o im Stamm darum gegen die Listen prüfen. */
const ES_PERS6 = ['yo', 'tú', 'él, ella, usted', 'nosotros', 'vosotros', 'ellos, ellas'];
const ES_IE = new Set(('pensar empezar comenzar cerrar despertar sentar nevar atravesar recomendar manifestar fregar calentar gobernar negar regar sembrar ' +
  'merendar temblar tropezar confesar apretar quebrar entender perder querer defender extender encender tender atender descender ascender sentir preferir ' +
  'sugerir convertir divertir mentir advertir herir hervir referir consentir invertir arrepentir').split(' '));
const ES_UE = new Set(('contar encontrar recordar acordar costar mostrar demostrar probar comprobar aprobar soñar volar sonar soltar acostar renovar repoblar ' +
  'poblar apostar almorzar colgar rogar forzar esforzar tostar consolar rodar volver devolver envolver resolver disolver mover remover promover llover doler ' +
  'morder soler torcer cocer dormir morir').split(' '));
const ES_EI = new Set('pedir despedir impedir medir repetir servir seguir conseguir perseguir vestir elegir corregir rendir competir gemir regir concebir'.split(' '));
// -iar/-uar mit betontem i/u (envío, continúa); die übrigen ohne (cambio, estudio, averiguo)
const ES_ACC_IAR = new Set('enviar confiar desconfiar vaciar esquiar ampliar criar guiar fiar desafiar variar espiar enfriar resfriar averiar continuar actuar situar graduar evaluar efectuar acentuar insinuar'.split(' '));
// Zusammensetzungen: nur diese Grundverben (contestar ist kein estar, compensar kein pensar, conjugar kein jugar)
// freír geht wie reír (frío, frio, friendo)
const ES_COMPOUND = ['tener', 'venir', 'poner', 'hacer', 'decir', 'traer', 'volver', 'pedir', 'conocer', 'salir', 'valer', 'reír'];
const ES_FUT_STEM = { tener:'tendr', poner:'pondr', venir:'vendr', salir:'saldr', valer:'valdr', hacer:'har', decir:'dir', saber:'sabr', caber:'cabr', querer:'querr', poder:'podr', haber:'habr' };
// Weitere unregelmäßige Verben, die die Übungsformen nicht abfragen (darum nicht in IRR_ES); hier alle sechs Personen
const ES_IRR_MORE = {
  haber:{ pres:'he has ha hemos habéis han', indef:'hube hubiste hubo hubimos hubisteis hubieron', subj:'haya hayas haya hayamos hayáis hayan' },
  caer:{ pres:'caigo caes cae caemos caéis caen', subj:'caiga caigas caiga caigamos caigáis caigan' },
  oír:{ pres:'oigo oyes oye oímos oís oyen', indef:'oí oíste oyó oímos oísteis oyeron', subj:'oiga oigas oiga oigamos oigáis oigan' },
  reír:{ pres:'río ríes ríe reímos reís ríen', indef:'reí reíste rio reímos reísteis rieron', subj:'ría rías ría riamos riais rían' },
  valer:{ pres:'valgo vales vale valemos valéis valen', subj:'valga valgas valga valgamos valgáis valgan' },
  caber:{ pres:'quepo cabes cabe cabemos cabéis caben', indef:'cupe cupiste cupo cupimos cupisteis cupieron', subj:'quepa quepas quepa quepamos quepáis quepan' },
  andar:{ indef:'anduve anduviste anduvo anduvimos anduvisteis anduvieron' },
  oler:{ pres:'huelo hueles huele olemos oléis huelen', subj:'huela huelas huela olamos oláis huelan' }
};
const ES_IMPV_IRR = { decir:'di', hacer:'haz', ir:'ve', poner:'pon', salir:'sal', ser:'sé', tener:'ten', venir:'ven' };
const ES_GER_IRR = { ir:'yendo', poder:'pudiendo', decir:'diciendo', venir:'viniendo', reír:'riendo', oír:'oyendo', traer:'trayendo' };
const PART_IRR = { hacer:'hecho', decir:'dicho', ver:'visto', escribir:'escrito', poner:'puesto', volver:'vuelto', abrir:'abierto', romper:'roto', morir:'muerto',
  cubrir:'cubierto', resolver:'resuelto', freír:'frito', imprimir:'impreso', satisfacer:'satisfecho', prever:'previsto' };
// Partizip auch der Zusammensetzungen (describir → descrito, devolver → devuelto, componer → compuesto, descubrir → descubierto)
const ES_PART_SUF = [['scribir', 'scrito'], ['cubrir', 'cubierto'], ['solver', 'suelto'], ['volver', 'vuelto'], ['poner', 'puesto'], ['hacer', 'hecho'], ['decir', 'dicho'], ['abrir', 'abierto']];
const ES_END6 = {
  pres:{ ar:'o as a amos áis an', er:'o es e emos éis en', ir:'o es e imos ís en' },
  indef:{ ar:'é aste ó amos asteis aron', er:'í iste ió imos isteis ieron', ir:'í iste ió imos isteis ieron' },
  imp:{ ar:'aba abas aba ábamos abais aban', er:'ía ías ía íamos íais ían', ir:'ía ías ía íamos íais ían' },
  subj:{ ar:'e es e emos éis en', er:'a as a amos áis an', ir:'a as a amos áis an' }
};
const ES_TENSES = ['pres', 'indef', 'imp', 'subj', 'fut', 'cond', 'ra', 'se'];
// Ohne Akzent, aber mit ñ und ü (deacc nimmt beides weg: diseñar, averigüe)
const esPlain = s => s.replace(/[áéíóú]/g, c => 'aeiou'['áéíóú'.indexOf(c)]);
const esAccent = s => s.replace(/[aeiou](?=[^aeiou]*$)/, c => ({ a:'á', e:'é', i:'í', o:'ó', u:'ú' })[c]);
const esCompound = inf => { const b = ES_COMPOUND.find(x => inf !== x && inf.endsWith(x)); return b ? [inf.slice(0, -b.length), b] : null; };
const ES_CONJ = new Map();
// Alle Formen eines Verbs: { pres, indef, imp, subj, fut, cond, ra, se } je sechs Personen, dazu part, ger und impv (tú, vosotros)
function esConj(inf){
  inf = String(inf || '').toLowerCase();
  if (ES_CONJ.has(inf)) return ES_CONJ.get(inf);
  let out;
  const cp = esCompound(inf);
  if (cp) {
    const b = esConj(cp[1]), add = a => a.map(f => cp[0] + f);
    out = {};
    ES_TENSES.forEach(t => { out[t] = add(b[t]); });
    out.part = esPart(inf);
    out.ger = cp[0] + b.ger;
    // Imperativ der Zusammensetzungen mit Akzent (mantén, propón): nur wo die Grundform regelmäßig ist
    out.impv = [ES_IMPV_IRR[cp[1]] ? '' : cp[0] + b.impv[0], cp[0] + b.impv[1]];
  } else out = esConjSimple(inf);
  // soler nur in Präsens, Imperfecto und Subjuntivo (suelo, solía, suela); die übrigen Formen gibt es nicht
  if (inf === 'soler') out = Object.assign({}, out, { indef:[], fut:[], cond:[], ra:[], se:[], part:'', ger:'', impv:['', ''] });
  ES_CONJ.set(inf, out);
  return out;
}
function esConjSimple(inf){
  const plain = esPlain(inf), cls = plain.slice(-2), stem = plain.slice(0, -2), irr = IRR_ES[inf], more = ES_IRR_MORE[inf] || {};
  const ie = ES_IE.has(inf), ue = ES_UE.has(inf), ei = ES_EI.has(inf), ir = cls === 'ir';
  const vowelStem = /[aeo]$/.test(stem) && cls !== 'ar', uir = ir && /[^gq]u$/.test(stem);
  const swap = (s, from, to) => { const k = s.lastIndexOf(from); return k < 0 ? s : s.slice(0, k) + to + s.slice(k + from.length); };
  // Stamm mit Stammwechsel: strong = betont (piens-, duerm-, pid-), weak = i/u bei -ir-Verben (sint-, durm-, pid-)
  const strong = ie ? swap(stem, 'e', 'ie') : ue ? swap(stem, 'o', 'ue') : ei ? swap(stem, 'e', 'i') : stem;
  const weak = ir && (ie || ei) ? swap(stem, 'e', 'i') : ir && ue ? swap(stem, 'o', 'u') : stem;
  // Rechtschreibung vor der Endung
  const spell = (st, e) => {
    const end = esPlain(e);
    if (cls === 'ar' && /^e/.test(end)) return st.replace(/gu$/, 'gü').replace(/c$/, 'qu').replace(/g$/, 'gu').replace(/z$/, 'c');
    if (cls !== 'ar' && /^[oa]/.test(end)) {
      if (ir && /gu$/.test(st)) return st.slice(0, -1);
      if (/g$/.test(st)) return st.slice(0, -1) + 'j';
      if (/c$/.test(st)) return /[aeiou]c$/.test(st) && !(ie || ue) ? st.slice(0, -1) + 'zc' : st.slice(0, -1) + 'z';
    }
    if (uir && /^[oae]/.test(end)) return st + 'y';
    return st;
  };
  const accIar = (st, p) => (ES_ACC_IAR.has(inf) && [0, 1, 2, 5].includes(p) ? st.replace(/([iu])$/, c => (c === 'i' ? 'í' : 'ú')) : st);
  const reg = t => ES_END6[t][cls].split(' ').map((end, p) => {
    let st = stem;
    if (t === 'pres') st = [0, 1, 2, 5].includes(p) ? strong : stem;
    if (t === 'subj') st = ei ? strong : [0, 1, 2, 5].includes(p) ? strong : weak;
    if (t === 'indef' && (p === 2 || p === 5)) st = weak;
    if (t === 'pres' || t === 'subj') st = accIar(st, p);
    if (t === 'indef' && (vowelStem || uir)) {
      if (p === 2) return st + 'yó';
      if (p === 5) return st + 'yeron';
      if (vowelStem && p !== 0) end = end.replace(/^i/, 'í');
    }
    return spell(st, end) + end;
  });
  // Starkes Präteritum auf -ducir: conduje, condujo, condujeron
  const duc = /duc$/.test(stem) && ir ? 'e iste o imos isteis eron'.split(' ').map(e => stem.slice(0, -1) + 'j' + e) : null;
  const from5 = (t, s) => { const a = s.split(' '); return [a[0], a[1], a[2], a[3], esVos(t, a, inf, cls), a[4]]; };
  const out = {};
  ['pres', 'indef', 'imp', 'subj'].forEach(t => {
    out[t] = more[t] ? more[t].split(' ') : irr && irr[1][t] ? from5(t, irr[1][t]) : t === 'indef' && duc ? duc : reg(t);
  });
  const fs = ES_FUT_STEM[inf] || plain;
  out.fut = 'é ás á emos éis án'.split(' ').map(e => fs + e);
  out.cond = 'ía ías ía íamos íais ían'.split(' ').map(e => fs + e);
  // Subjuntivo der Vergangenheit: 3. Person Plural Indefinido ohne -ron (dieron → diera, diese; tuviéramos)
  const b = out.indef[5].replace(/ron$/, '');
  out.ra = ['ra', 'ras', 'ra', 'ramos', 'rais', 'ran'].map((e, p) => (p === 3 ? esAccent(b) : b) + e);
  out.se = ['se', 'ses', 'se', 'semos', 'seis', 'sen'].map((e, p) => (p === 3 ? esAccent(b) : b) + e);
  out.part = esPart(inf);
  out.ger = ES_GER_IRR[inf] || (cls === 'ar' ? stem + 'ando' : vowelStem || uir ? stem + 'yendo' : weak + 'iendo');
  out.impv = inf === 'haber' ? ['', ''] : [ES_IMPV_IRR[inf] || out.pres[2], inf.slice(0, -1) + 'd'];
  return out;
}
// vosotros zu einer Tabelle mit fünf Personen (IRR_ES)
function esVos(t, a, inf, cls){
  if (t === 'pres') return { ser:'sois', ir:'vais', ver:'veis', dar:'dais' }[inf] || inf.slice(0, -2) + { ar:'áis', er:'éis', ir:'ís' }[cls];
  if (t === 'indef') return a[1] + 'is';
  if (t === 'imp') return a[4].replace(/n$/, 'is');
  return inf === 'dar' ? 'deis' : a[3].replace(/emos$/, 'éis').replace(/amos$/, 'áis');
}
function esPart(inf){
  if (PART_IRR[inf]) return PART_IRR[inf];
  const suf = ES_PART_SUF.find(([a]) => inf.endsWith(a));
  if (suf) return inf.slice(0, -suf[0].length) + suf[1];
  const plain = esPlain(inf), stem = plain.slice(0, -2);
  if (plain.endsWith('ar')) return stem + 'ado';
  return stem + (/[aeo]$/.test(stem) ? 'ído' : 'ido');
}
const participle = inf => esPart(inf);
// Fünf Personen der Übungsformen (yo, tú, él, nosotros, ellos), wie sie Generatoren und Prüfung kennen
function conjugate(inf, tense, idx){ return esConj(inf)[tense][[0, 1, 2, 3, 5][idx]]; }
// Für die Prüfung ohne Akzente: Konditional und Subjuntivo der Vergangenheit (-ra, dann -se), je sechs Personen
const ES_COND_END = ['ia', 'ias', 'ia', 'iamos', 'iais', 'ian'];
const esCondForms = inf => esConj(inf).cond.map(deacc);
const esPastSubjForms = inf => (/^[a-zñ]+(ar|er|ir)$/.test(inf) || IRR_ES[inf] || ES_IRR_MORE[inf] ? esConj(inf).ra.concat(esConj(inf).se).map(deacc) : []);
function esCondParse(w){
  const dw = deacc(w), m = dw.match(/^(.+?)(iamos|iais|ias|ian|ia)$/);
  if (!m) return null;
  const st = m[1], k = Object.keys(ES_FUT_STEM).find(x => st === ES_FUT_STEM[x] || (ES_FUT_STEM[x].length >= 5 && st.endsWith(ES_FUT_STEM[x])));
  const inf = k ? st.slice(0, st.length - ES_FUT_STEM[k].length) + k : /^[a-zñ]+(ar|er|ir)$/.test(st) ? st : '';
  const p = ES_COND_END.indexOf(m[2]);
  return inf && esCondForms(inf)[p] === dw ? { inf, p } : null;
}

/* Schwedisch: Gruppe 1 (prata, pratar, pratade, pratat), 2 (stänga, stänger, stängde, stängt; köpa, köpte, köpt; använda, använde,
   använt; möta, mötte, mött), 3 (bo, bor, bodde, bott), starke, unregelmäßige und Deponens-Verben aus SV_STRONG, auch zusammengesetzt
   (förstå wie stå, översätta wie sätta). Die Gruppe steht nicht im Infinitiv: Das Wörterbuch nimmt sie aus den Formen, die es schon
   kennt (svGroup); Verben auf -era gehen immer nach Gruppe 1. */
// Präsens, Präteritum (mehrere mit /), Supinum, Partizip (en-Form, - für keins)
const SV_STRONG = {
  vara:'är var varit -', ha:'har hade haft -', bli:'blir blev blivit -', göra:'gör gjorde gjort gjord', gå:'går gick gått -', stå:'står stod stått -',
  förstå:'förstår förstod förstått förstådd', påstå:'påstår påstod påstått påstådd',
  se:'ser såg sett sedd', ta:'tar tog tagit tagen', komma:'kommer kom kommit -', få:'får fick fått -', säga:'säger sa/sade sagt sagd',
  lägga:'lägger la/lade lagt lagd', sätta:'sätter satte satt satt', ge:'ger gav gett/givit given', veta:'vet visste vetat -', kunna:'kan kunde kunnat -',
  vilja:'vill ville velat -', böra:'bör borde bort -', dö:'dör dog dött -', äta:'äter åt ätit äten', dricka:'dricker drack druckit drucken',
  skriva:'skriver skrev skrivit skriven', springa:'springer sprang sprungit -', flyga:'flyger flög flugit -', vinna:'vinner vann vunnit vunnen',
  finna:'finner fann funnit funnen', binda:'binder band bundit bunden', hinna:'hinner hann hunnit -', sjunga:'sjunger sjöng sjungit sjungen',
  sova:'sover sov sovit -', bryta:'bryter bröt brutit bruten', gripa:'griper grep gripit gripen', bita:'biter bet bitit biten', stiga:'stiger steg stigit -',
  driva:'driver drev drivit driven', riva:'river rev rivit riven', skina:'skiner sken skinit -', krypa:'kryper kröp krupit -', rinna:'rinner rann runnit -',
  sjunka:'sjunker sjönk sjunkit -', bjuda:'bjuder bjöd bjudit bjuden', skjuta:'skjuter sköt skjutit skjuten', frysa:'fryser frös frusit frusen',
  njuta:'njuter njöt njutit -', flyta:'flyter flöt flutit -', ljuga:'ljuger ljög ljugit -', stjäla:'stjäl stal stulit stulen', bära:'bär bar burit buren',
  skära:'skär skar skurit skuren', svära:'svär svor svurit -', sitta:'sitter satt suttit -', ligga:'ligger låg legat -', falla:'faller föll fallit -',
  hålla:'håller höll hållit hållen', låta:'låter lät låtit -', gråta:'gråter grät gråtit -', slå:'slår slog slagit slagen', dra:'drar drog dragit dragen',
  le:'ler log lett -', be:'ber bad bett -', slippa:'slipper slapp sluppit -', sticka:'sticker stack stuckit stucken', spricka:'spricker sprack spruckit -',
  hugga:'hugger högg huggit huggen', slita:'sliter slet slitit sliten', skrika:'skriker skrek skrikit -', fara:'far for farit -', växa:'växer växte vuxit/växt -', hända:'händer hände hänt -',
  sälja:'säljer sålde sålt såld', välja:'väljer valde valt vald', dölja:'döljer dolde dolt dold', heta:'heter hette hetat -', känna:'känner kände känt känd',
  försvinna:'försvinner försvann försvunnit -', glömma:'glömmer glömde glömt glömd', kliva:'kliver klev klivit -', tåla:'tål tålde tålt -', dyka:'dyker dök/dykte dykt -', sprida:'sprider spred/spridde spritt spridd',
  skilja:'skiljer skilde skilt skild', glädja:'gläder gladde glatt -', stödja:'stöder stödde stött stödd', svälja:'sväljer svalde svalt -', vänja:'vänjer vande vant van',
  // Deponens: nur Aktivformen auf -s
  lyckas:'lyckas lyckades lyckats -', hoppas:'hoppas hoppades hoppats -', låtsas:'låtsas låtsades låtsats -', andas:'andas andades andats -',
  kallas:'kallas kallades kallats -', trivas:'trivs trivdes trivts -', minnas:'minns mindes mints -', finnas:'finns fanns funnits -', synas:'syns syntes synts -',
  kännas:'känns kändes känts -', skämmas:'skäms skämdes skämts -', födas:'föds föddes fötts -', ses:'ses sågs setts -', umgås:'umgås umgicks umgåtts -'
};
const SV_G2 = new Set('vända hända störa sköta begära röka jäsa nämna fälla märka släcka slänga tänka upptäcka hyra möta ösa återuppbygga framföra extraknäcka ärva lösa inviga klippa täcka framställa'.split(' '));
const SV_INTRANS = new Set(('vakna regna ösregna spöregna ramla trilla pendla emigrera invandra härstamma hamna skratta funka köa tälta forsa rusa protestera ' +
  'improvisera samarbeta förvärvsarbeta jobba vandra dröja gälla lysa betyda bo ske bry snöa rasa').split(' '));
const SV_G3 = new Set('bo tro nå ske fly må gro sy klä spå bry bete'.split(' '));
const SV_NO_COMPOUND = new Set('vara ha kunna vilja böra veta heta be le dö fara'.split(' '));
const SV_PREFIX = 'an av be bi bort del efter er fort fram för före god ifråga in inne med miss ned ner om på samman till tillbaka under undan upp ut vid åter över'.split(' ');
function svStrong(inf){
  if (SV_STRONG[inf]) return { pre:'', row:SV_STRONG[inf] };
  // Hilfs- und Modalverben nicht zusammengesetzt (bevara ist nicht be + vara)
  const p = SV_PREFIX.find(x => inf.startsWith(x) && SV_STRONG[inf.slice(x.length)] && !SV_NO_COMPOUND.has(inf.slice(x.length)));
  return p ? { pre:p, row:SV_STRONG[inf.slice(p.length)] } : null;
}
// Formen je Gruppe (1, 2, 3; starke Verben ohne Gruppe): pres, past (Liste), sup, part (en, ett, Plural), pass (Präsens und Infinitiv),
// passPast, passSup, impv. Deponens (lyckas, minns) ohne Passiv und Imperativ.
function svConj(inf, g){
  const st = svStrong(inf);
  if (st) {
    const [pres, past, sup, part] = st.row.split(' ').map(x => (x === '-' ? '' : x)), add = x => (x ? st.pre + x : '');
    const pastL = past.split('/').map(add), supL = sup.split('/').map(add);
    if (/s$/.test(inf)) return { pres:add(pres), past:pastL, sup:supL[0], sups:supL, part:[], pass:[], passPast:[], passSup:'', impv:'' };
    // Passiv nur bei Verben mit Partizip (ohne: vara, gå, sova, kunna …); Präsens Passiv vom Stamm (skrivs, äts, läses), bei kurzen Verben -s (tas, ses)
    const en = add(part), base = inf.slice(st.pre.length), short = /^[^aeiouyåäö]*[aeiouyåäö]$/.test(base);
    const stem = (short || !/a$/.test(base) ? base : base.slice(0, -1)).replace(/mm$/, 'm');
    const longest = pastL.reduce((a, b) => (b.length > a.length ? b : a));
    // Partizip: skriven, skrivet, skrivna; vunnen, vunnet, vunna; sagd, sagt, sagda; satt, satt, satta; van, vant, vana
    const part3 = !en ? [] : /en$/.test(en) ? [en, en.slice(0, -1) + 't', en.slice(0, -2) + (/n$/.test(en.slice(0, -2)) ? 'a' : 'na')] : /d$/.test(en) ? [en, supL[0], en + 'a'] : [en, /t$/.test(en) ? en : en + 't', en + 'a'];
    return { pres:add(pres), past:pastL, sup:supL[0], sups:supL, part:part3,
      pass:en ? [add(stem) + (/s$/.test(stem) && !short ? 'es' : 's'), inf + 's'] : [],
      // Präteritum auf -s (frös) ohne Passiv-Präteritum: „fröss“ gibt es nicht
      passPast:en && !/s$/.test(longest) ? [longest + 's'] : [], passSup:en ? supL[0] + 's' : '', impv:add(short || !/a$/.test(base) ? base : base.slice(0, -1)) };
  }
  const c = svWeak(inf, g);
  // Ohne Objekt (vakna, regna, dröja): kein Partizip, kein Passiv
  if (c && SV_INTRANS.has(inf)) Object.assign(c, { part:[], pass:[], passPast:[], passSup:'' });
  return c;
}
function svWeak(inf, g){
  if (g === 1 && /a$/.test(inf)) { const s = inf.slice(0, -1); return { pres:inf + 'r', past:[inf + 'de'], sup:inf + 't', part:[s + 'ad', inf + 't', s + 'ade'], pass:[inf + 's'], passPast:[inf + 'des'], passSup:inf + 'ts', impv:inf }; }
  if (g === 3 && !/a$/.test(inf)) return { pres:inf + 'r', past:[inf + 'dde'], sup:inf + 'tt', part:[inf + 'dd', inf + 'tt', inf + 'dda'], pass:[inf + 's'], passPast:[inf + 'ddes'], passSup:inf + 'tts', impv:inf };
  if (g !== 2 || !/a$/.test(inf)) return null;
  const stem = inf.slice(0, -1), last = stem.slice(-1), vow = c => /[aeiouyåäö]/.test(c), prev = stem.slice(-2, -1);
  let past, sup, part;
  if (/(mm|nn)$/.test(stem)) { const s = stem.slice(0, -1); past = s + 'de'; sup = s + 't'; part = [s + 'd', sup, s + 'da']; }
  else if (last === 'd' && !vow(prev)) { past = stem + 'e'; sup = stem.slice(0, -1) + 't'; part = [stem, sup, stem + 'a']; }
  else if (last === 'd') { past = stem + 'de'; sup = stem.slice(0, -1) + 'tt'; part = [stem + 'd', sup, stem + 'da']; }
  else if (last === 't' && vow(prev)) { past = stem + 'te'; sup = stem + 't'; part = [sup, sup, stem + 'ta']; }
  else if (last === 't') { past = stem + 'e'; sup = stem; part = [stem, stem, stem + 'a']; }
  else if (/[kpsx]/.test(last)) { past = stem + 'te'; sup = stem + 't'; part = [sup, sup, stem + 'ta']; }
  else { past = stem + 'de'; sup = stem + 't'; part = [stem + 'd', sup, stem + 'da']; }
  return { pres:last === 'r' ? stem : stem + 'er', past:[past], sup, part, pass:[stem.replace(/mm$/, 'm') + (last === 's' ? 'es' : 's'), inf + 's'], passPast:[past + 's'], passSup:sup + 's', impv:stem };
}
// Gruppe eines Verbs aus den Formen, die das Wörterbuch schon kennt (forms: Formen mit diesem Verb als Grundform): die Gruppe,
// deren Formen sich darunter finden, nur wenn es genau eine ist. Infinitiv und Passiv auf -s zählen nicht (gleich in 1 und 2).
function svGroup(inf, forms){
  if (svStrong(inf)) return 0;
  if (/[^aeiouyåäö]era$/.test(inf) && inf.length >= 6) return 1;
  const hit = [1, 2, 3].filter(g => { const c = svConj(inf, g); if (!c) return false; const all = [c.pres, c.sup, c.passSup].concat(c.past, c.passPast, c.part).filter(f => f && f !== inf); return all.some(f => forms.has(f)); });
  if (hit.length) return hit.length === 1 ? hit[0] : -1;
  // Ohne Formen im Wörterbuch: Gruppe 2 und 3 aus der Liste, sonst Gruppe 1 (die größte). Neue Verben der Gruppen 2 und 3 gehören
  // in SV_G2 oder SV_G3, starke in SV_STRONG; tests/fixtures/verbformen.txt zeigt jede Änderung.
  return SV_G2.has(inf) ? 2 : SV_G3.has(inf) ? 3 : /a$/.test(inf) ? 1 : -1;
}
// Ein schwedischer Eintrag ist ein Verb, wenn die Bedeutung eines ist: klein geschrieben und auf -n (gehen, sich freuen, tun)
// Ein schwedischer Eintrag ist ein Verb, wenn eine seiner Bedeutungen (durch ; getrennt) eines ist: klein geschrieben und auf -en, -ern,
// -eln (gehen, sich freuen), eine Wendung darauf (Müll trennen) oder tun, sein. Nicht: Artikel davor (der Nutzen), Wendungen mit = (ta reda på = herausfinden), Adverbien
// (gern, inzwischen). Gibt die Bedeutung als Verb zurück (fråga = Frage; fragen → fragen), sonst ''.
const DE_NOT_VERB = new Set('gern sofern inzwischen einzeln gestern morgen oben unten innen außen neben zwischen eben selten seitdem trotzdem ebenfalls zusammen'.split(' '));
function svVerbMeaning(k, de){
  if (!/^[a-zåäö]+$/.test(k)) return '';
  const seg = String(de).split(';').map(x => x.split('(')[0].trim()).find(x => !x.includes('=') && !/^(der|die|das|ein|eine) /.test(x) &&
    x.split(',').some(y => !DE_NOT_VERB.has(y.trim()) && /^[a-zäöüß].*(en|ern|eln)$|\s[a-zäöüß]+(en|ern|eln)$|(^|\s)(tun|sein)$/.test(y.trim())));
  return seg || '';
}
