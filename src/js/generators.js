/* ---------- Generatoren: regelbasiert, immer korrekt ---------- */
const pick = a => a[Math.floor(Math.random() * a.length)];
const capFirst = s => s.charAt(0).toUpperCase() + s.slice(1);

/* Schwedisch: Adjektiv + Substantiv (en/ett, bestimmte Form, Doppelbestimmung) */
// [de, deGenus, dePlural, sv, en|ett, bestimmt, Plural, bestimmter Plural, erlaubte Adjektive]
const NOUNS = [
  ['Haus','n','Häuser','hus','ett','huset','hus','husen','gknastbrwvclmy'],
  ['Auto','n','Autos','bil','en','bilen','bilar','bilarna','gknastbrwvc'],
  ['Buch','n','Bücher','bok','en','boken','böcker','böckerna','gknasutbi'],
  ['Zimmer','n','Zimmer','rum','ett','rummet','rum','rummen','gknastbvclmy'],
  ['Stadt','f','Städte','stad','en','staden','städer','städerna','gknasyi'],
  ['Tisch','m','Tische','bord','ett','bordet','bord','borden','gknastbrwvc'],
  ['Stuhl','m','Stühle','stol','en','stolen','stolar','stolarna','gknastbrwvc'],
  ['Apfel','m','Äpfel','äpple','ett','äpplet','äpplen','äpplena','gkasur'],
  ['Wohnung','f','Wohnungen','lägenhet','en','lägenheten','lägenheter','lägenheterna','gknastbclmy'],
  ['Jacke','f','Jacken','jacka','en','jackan','jackor','jackorna','gknastbrwvc'],
  ['Fenster','n','Fenster','fönster','ett','fönstret','fönster','fönstren','gknasc'],
  ['Tasche','f','Taschen','väska','en','väskan','väskor','väskorna','gknastbrwvcl'],
  ['Hund','m','Hunde','hund','en','hunden','hundar','hundarna','gkasuwv'],
  ['Zug','m','Züge','tåg','ett','tåget','tåg','tågen','gknasclm'],
  ['Film','m','Filme','film','en','filmen','filmer','filmerna','nasui'],
  ['Restaurant','n','Restaurants','restaurang','en','restaurangen','restauranger','restaurangerna','gknastby'],
  ['Glas','n','Gläser','glas','ett','glaset','glas','glasen','gknasclt'],
  ['Bett','n','Betten','säng','en','sängen','sängar','sängarna','gknastbvc'],
  ['Brief','m','Briefe','brev','ett','brevet','brev','breven','nasi'],
  ['Straße','f','Straßen','gata','en','gatan','gator','gatorna','gknascl'],
  ['Problem','n','Probleme','problem','ett','problemet','problem','problemen','gknai'],
  ['Kleid','n','Kleider','klänning','en','klänningen','klänningar','klänningarna','gknastbrwvc'],
  ['Frage','f','Fragen','fråga','en','frågan','frågor','frågorna','gknaui'],
  ['Bild','n','Bilder','bild','en','bilden','bilder','bilderna','gknasti'],
  ['Land','n','Länder','land','ett','landet','länder','länderna','gknasi']
];
// key: [de Grundform, de Stamm zum Deklinieren, [sv grund, t-Form, a-Form, bestimmt Sg (falls anders), Plural (falls anders)], Alternativen]
const ADJS = {
  g:['groß','groß',['stor','stort','stora']],
  k:['klein','klein',['liten','litet','små','lilla','små']],
  n:['neu','neu',['ny','nytt','nya']],
  a:['alt','alt',['gammal','gammalt','gamla']],
  s:['schön','schön',['fin','fint','fina'],[['vacker','vackert','vackra']]],
  u:['gut','gut',['bra','bra','bra']],
  t:['teuer','teur',['dyr','dyrt','dyra']],
  b:['billig','billig',['billig','billigt','billiga']],
  r:['rot','rot',['röd','rött','röda']],
  w:['schwarz','schwarz',['svart','svart','svarta']],
  v:['weiß','weiß',['vit','vitt','vita']],
  c:['sauber','sauber',['ren','rent','rena']],
  l:['leer','leer',['tom','tomt','tomma']],
  m:['kalt','kalt',['kall','kallt','kalla']],
  y:['gemütlich','gemütlich',['mysig','mysigt','mysiga']],
  i:['interessant','interessant',['intressant','intressant','intressanta']]
};
const DE_ART = { m:['ein','der','er'], f:['eine','die','e'], n:['ein','das','es'] };
function svForms(f){ return { base:f[0], t:f[1], a:f[2], defSg:f[3] || f[2], pl:f[4] || f[2] }; }
function genNP(){
  const N = pick(NOUNS);
  const [de, g, dePl, sv, art, def, pl, defPl, allowed] = N;
  const key = pick(allowed.split(''));
  const A = ADJS[key];
  const forms = [A[2]].concat(A[3] || []).map(svForms);
  const ett = art === 'ett';
  const type = pick(['indef', 'def', 'def', 'pl', 'defpl', 'defpl', 'pred', 'predpl']);
  const da = DE_ART[g];
  let prompt, answers, note;
  switch (type) {
    case 'indef':
      prompt = `${da[0]} ${A[1]}${da[2]} ${de}`;
      answers = forms.map(f => `${art} ${ett ? f.t : f.base} ${sv}`);
      note = `${sv} ist ein ${art}-Wort, also ${ett ? 't-Form des Adjektivs' : 'Grundform des Adjektivs'}.`;
      break;
    case 'def':
      prompt = `${da[1]} ${A[1]}e ${de}`;
      answers = forms.map(f => `${ett ? 'det' : 'den'} ${f.defSg} ${def}`);
      note = `Doppelte Bestimmtheit: ${ett ? 'det' : 'den'} + Adjektiv auf -a + bestimmte Form (${def}).`;
      break;
    case 'pl':
      prompt = `${A[1]}e ${dePl}`;
      answers = forms.map(f => `${f.pl} ${pl}`);
      note = `Plural unbestimmt: Adjektiv auf -a, Substantiv im Plural (${pl}).`;
      break;
    case 'defpl':
      prompt = `die ${A[1]}en ${dePl}`;
      answers = forms.map(f => `de ${f.pl} ${defPl}`);
      note = `Doppelte Bestimmtheit im Plural: de + Adjektiv auf -a + ${defPl}.`;
      break;
    case 'pred':
      prompt = `${capFirst(da[1])} ${de} ist ${A[0]}.`;
      answers = forms.map(f => `${capFirst(def)} är ${ett ? f.t : f.base}.`);
      note = `Auch nach „är“ passt sich das Adjektiv an: ${sv} ist ein ${art}-Wort.`;
      break;
    default:
      prompt = `Die ${dePl} sind ${A[0]}.`;
      answers = forms.map(f => `${capFirst(defPl)} är ${f.pl}.`);
      note = `Nach „är“ im Plural: Adjektiv auf -a (${forms[0].pl}).`;
  }
  return { prompt, answers, note, label:'Übersetze ins Schwedische' };
}

/* Schwedisch: Präteritum vs. Perfekt (deutsches Perfekt als Falle) */
// [inf, prät, supinum, de Objekt, sv Objekt, de Partizip, Hilfsverb h/s, langer Zeitraum ok, Erfahrung ok, Frage ok, de Erfahrungsobjekt, sv Erfahrungsobjekt]
const VERBS_SV = [
  ['äta','åt','ätit','Pizza','pizza','gegessen','h',0,1,1],
  ['dricka','drack','druckit','Kaffee','kaffe','getrunken','h',0,0,0],
  ['skriva','skrev','skrivit','einen Brief','ett brev','geschrieben','h',0,1,1],
  ['läsa','läste','läst','das Buch','boken','gelesen','h',0,0,1],
  ['se','såg','sett','den Film','filmen','gesehen','h',0,1,1,'einen Horrorfilm','en skräckfilm'],
  ['gå','gick','gått','früh nach Hause','hem tidigt','gegangen','s',0,0,0],
  ['komma','kom','kommit','zu spät','för sent','gekommen','s',0,1,0],
  ['göra','gjorde','gjort','die Hausaufgaben','läxorna','gemacht','h',0,0,1],
  ['ta','tog','tagit','den Bus','bussen','genommen','h',0,0,0],
  ['köpa','köpte','köpt','ein neues Handy','en ny mobil','gekauft','h',1,0,0],
  ['träffa','träffade','träffat','Anna','Anna','getroffen','h',1,0,0],
  ['springa','sprang','sprungit','zehn Kilometer','tio kilometer','gelaufen','s',0,1,0],
  ['flyga','flög','flugit','nach Island','till Island','geflogen','s',1,1,0],
  ['simma','simmade','simmat','im Meer','i havet','geschwommen','s',1,1,0],
  ['vinna','vann','vunnit','das Spiel','matchen','gewonnen','h',0,1,0,'einen Preis','ett pris'],
  ['glömma','glömde','glömt','den Schlüssel','nyckeln','vergessen','h',0,0,0],
  ['ringa','ringde','ringt','den Arzt','läkaren','angerufen','h',0,0,0],
  ['hitta','hittade','hittat','eine Wohnung','en lägenhet','gefunden','h',1,0,0],
  ['sjunga','sjöng','sjungit','Karaoke','karaoke','gesungen','h',0,1,0],
  ['få','fick','fått','ein Paket','ett paket','bekommen','h',0,0,0],
  ['sova','sov','sovit','schlecht','dåligt','geschlafen','h',0,0,0],
  ['åka','åkte','åkt','nach Stockholm','till Stockholm','gefahren','s',1,1,0]
];
const SUBJ_SV = [['ich','jag','habe','bin'], ['wir','vi','haben','sind'], ['sie','hon','hat','ist'], ['er','han','hat','ist']];
const TIME_SHORT = [['Gestern','Igår'], ['Gestern Abend','Igår kväll'], ['Am Samstag','I lördags'], ['Letzte Woche','Förra veckan'], ['Heute Morgen','I morse']];
const TIME_LONG = [['Letzten Sommer','I somras'], ['Vor zwei Jahren','För två år sedan'], ['Letztes Jahr','Förra året']];
// „seit“: Im Deutschen Präsens, im Schwedischen Perfekt mit i + Zeitraum
const SINCE_SV = [
  ['wohne','wohnen','bott','in Malmö','i Malmö',[['seit zwei Jahren','i två år'],['seit drei Monaten','i tre månader'],['seit einem Jahr','i ett år']]],
  ['arbeite','arbeiten','jobbat','hier','här',[['seit zwei Jahren','i två år'],['seit drei Monaten','i tre månader']],'arbetat'],
  ['lerne','lernen','läst','Schwedisch','svenska',[['seit einem Jahr','i ett år'],['seit drei Monaten','i tre månader']],'pluggat'],
  ['warte','warten','väntat','','',[['seit einer Stunde','i en timme'],['seit zwanzig Minuten','i tjugo minuter']]],
  ['kenne','kennen','känt','Anna','Anna',[['seit Jahren','i flera år'],['seit zehn Jahren','i tio år']],null,true]
];
function genSince(){
  const v = pick(SINCE_SV), t = pick(v[5]), we = Math.random() < 0.4;
  const de = v[7] ? `${we ? 'Wir' : 'Ich'} ${we ? v[1] : v[0]} ${v[3]} ${t[0]}.` : `${we ? 'Wir' : 'Ich'} ${we ? v[1] : v[0]} ${t[0]}${v[3] ? ' ' + v[3] : ''}.`;
  const subj = we ? 'Vi' : 'Jag';
  const objs = [v[4]].filter(Boolean).join(' ');
  const forms = [v[2]].concat(v[6] ? [v[6]] : []);
  const answers = [];
  forms.forEach(f => { answers.push(`${subj} har ${f}${objs ? ' ' + objs : ''} ${t[1]}.`); answers.push(`${subj} har ${f} ${t[1]}${objs ? ' ' + objs : ''}.`); });
  return { prompt:de, answers, label:'Übersetze ins Schwedische', note:`Dauert bis heute an: Perfekt mit „i“ + Zeitraum (${subj.toLowerCase()} har ${v[2]} … ${t[1]}). Im Deutschen steht hier Präsens mit „seit“.`, key:['har', v[2]], keyLabel:'Die Zeitform stimmt' };
}
function genTempus(){
  if (Math.random() < 0.22) return genSince();
  const v = pick(VERBS_SV);
  const [inf, pret, sup, deObj, svObj, part, aux, long, exp, q, deExp, svExp] = v;
  const frames = ['past', 'past', 'past'];
  if (exp) frames.push('exp', 'exp');
  if (q) frames.push('q');
  const frame = pick(frames);
  const s = pick(SUBJ_SV);
  const auxDe = aux === 'h' ? s[2] : s[3];
  if (frame === 'past') {
    const T = pick(long ? TIME_SHORT.concat(TIME_LONG) : TIME_SHORT);
    const answers = [`${T[1]} ${pret} ${s[1]} ${svObj}.`];
    if (T[1].includes('sedan')) answers.push(`${T[1].replace('sedan', 'sen')} ${pret} ${s[1]} ${svObj}.`);
    answers.push(`${capFirst(s[1])} ${pret} ${svObj} ${T[1].toLowerCase()}.`);
    return { prompt:`${T[0]} ${auxDe} ${s[0]} ${deObj} ${part}.`, answers, label:'Übersetze ins Schwedische',
      note:`Zeitpunkt in der Vergangenheit („${T[1].toLowerCase()}“), also Präteritum: ${pret}, nicht „har ${sup}“.`, key:[pret], keyLabel:'Die Zeitform stimmt' };
  }
  if (frame === 'exp') {
    const o = deExp ? [deExp, svExp] : [deObj, svObj];
    return { prompt:`${capFirst(s[0])} ${auxDe} noch nie ${o[0]} ${part}.`, answers:[`${capFirst(s[1])} har aldrig ${sup} ${o[1]}.`, `${capFirst(s[1])} har inte ${sup} ${o[1]} någon gång.`], label:'Übersetze ins Schwedische',
      note:`Erfahrung ohne Zeitpunkt („noch nie“), also Perfekt: har aldrig ${sup}.`, key:['har', sup], keyLabel:'Die Zeitform stimmt' };
  }
  return { prompt:`Hast du schon ${deObj} ${part}?`, answers:[`Har du ${sup} ${svObj}?`, `Har du redan ${sup} ${svObj}?`, `Har du ${sup} ${svObj} än?`, `Har du ${sup} ${svObj} ännu?`], label:'Übersetze ins Schwedische',
    note:`Kein Zeitpunkt, es geht ums Ergebnis, also Perfekt: har … ${sup}.`, key:['har', sup], keyLabel:'Die Zeitform stimmt' };
}

/* Spanisch: Konjugation mit Kontext-Signal */
// Personen: yo, tú, él/ella/usted, nosotros, ellos/ellas
const PERS = [['yo',0], ['tú',1], ['él',2], ['ella',2], ['usted',2], ['nosotros',3], ['ellos',4], ['ellas',4]];
const END = {
  pres:{ ar:['o','as','a','amos','an'], er:['o','es','e','emos','en'], ir:['o','es','e','imos','en'] },
  indef:{ ar:['é','aste','ó','amos','aron'], er:['í','iste','ió','imos','ieron'], ir:['í','iste','ió','imos','ieron'] },
  imp:{ ar:['aba','abas','aba','ábamos','aban'], er:['ía','ías','ía','íamos','ían'], ir:['ía','ías','ía','íamos','ían'] },
  subj:{ ar:['e','es','e','emos','en'], er:['a','as','a','amos','an'], ir:['a','as','a','amos','an'] }
};
const REG_ES = [['hablar','sprechen'],['llegar','ankommen'],['trabajar','arbeiten'],['comprar','kaufen'],['escuchar','hören'],['viajar','reisen'],['cocinar','kochen'],['bailar','tanzen'],['estudiar','lernen'],['llamar','anrufen'],['tomar','nehmen'],['cenar','zu Abend essen'],['ayudar','helfen'],['comer','essen'],['beber','trinken'],['aprender','lernen'],['vender','verkaufen'],['correr','rennen'],['comprender','verstehen'],['vivir','wohnen'],['escribir','schreiben'],['abrir','öffnen'],['recibir','bekommen'],['subir','hochgehen'],['decidir','entscheiden']];
const IRR_ES = {
  ser:['sein', { pres:'soy eres es somos son', indef:'fui fuiste fue fuimos fueron', imp:'era eras era éramos eran', subj:'sea seas sea seamos sean' }],
  estar:['sein (Zustand, Ort)', { pres:'estoy estás está estamos están', indef:'estuve estuviste estuvo estuvimos estuvieron', subj:'esté estés esté estemos estén' }],
  ir:['gehen, fahren', { pres:'voy vas va vamos van', indef:'fui fuiste fue fuimos fueron', imp:'iba ibas iba íbamos iban', subj:'vaya vayas vaya vayamos vayan' }],
  tener:['haben', { pres:'tengo tienes tiene tenemos tienen', indef:'tuve tuviste tuvo tuvimos tuvieron', subj:'tenga tengas tenga tengamos tengan' }],
  hacer:['machen', { pres:'hago haces hace hacemos hacen', indef:'hice hiciste hizo hicimos hicieron', subj:'haga hagas haga hagamos hagan' }],
  poder:['können', { pres:'puedo puedes puede podemos pueden', indef:'pude pudiste pudo pudimos pudieron', subj:'pueda puedas pueda podamos puedan' }],
  querer:['wollen', { pres:'quiero quieres quiere queremos quieren', indef:'quise quisiste quiso quisimos quisieron', subj:'quiera quieras quiera queramos quieran' }],
  decir:['sagen', { pres:'digo dices dice decimos dicen', indef:'dije dijiste dijo dijimos dijeron', subj:'diga digas diga digamos digan' }],
  venir:['kommen', { pres:'vengo vienes viene venimos vienen', indef:'vine viniste vino vinimos vinieron', subj:'venga vengas venga vengamos vengan' }],
  saber:['wissen', { pres:'sé sabes sabe sabemos saben', indef:'supe supiste supo supimos supieron', subj:'sepa sepas sepa sepamos sepan' }],
  poner:['stellen, legen', { pres:'pongo pones pone ponemos ponen', indef:'puse pusiste puso pusimos pusieron', subj:'ponga pongas ponga pongamos pongan' }],
  salir:['ausgehen', { pres:'salgo sales sale salimos salen', subj:'salga salgas salga salgamos salgan' }],
  ver:['sehen', { pres:'veo ves ve vemos ven', indef:'vi viste vio vimos vieron', imp:'veía veías veía veíamos veían', subj:'vea veas vea veamos vean' }],
  dar:['geben', { pres:'doy das da damos dan', indef:'di diste dio dimos dieron', subj:'dé des dé demos den' }],
  pensar:['denken', { pres:'pienso piensas piensa pensamos piensan', subj:'piense pienses piense pensemos piensen' }],
  volver:['zurückkommen', { pres:'vuelvo vuelves vuelve volvemos vuelven', subj:'vuelva vuelvas vuelva volvamos vuelvan' }],
  dormir:['schlafen', { pres:'duermo duermes duerme dormimos duermen', indef:'dormí dormiste durmió dormimos durmieron', subj:'duerma duermas duerma durmamos duerman' }],
  pedir:['bestellen, bitten', { pres:'pido pides pide pedimos piden', indef:'pedí pediste pidió pedimos pidieron', subj:'pida pidas pida pidamos pidan' }],
  conocer:['kennen', { pres:'conozco conoces conoce conocemos conocen', subj:'conozca conozcas conozca conozcamos conozcan' }],
  traer:['bringen', { pres:'traigo traes trae traemos traen', indef:'traje trajiste trajo trajimos trajeron', subj:'traiga traigas traiga traigamos traigan' }],
  empezar:['anfangen', { pres:'empiezo empiezas empieza empezamos empiezan', indef:'empecé empezaste empezó empezamos empezaron', subj:'empiece empieces empiece empecemos empiecen' }],
  leer:['lesen', { pres:'leo lees lee leemos leen', indef:'leí leíste leyó leímos leyeron', subj:'lea leas lea leamos lean' }],
  jugar:['spielen', { pres:'juego juegas juega jugamos juegan', indef:'jugué jugaste jugó jugamos jugaron', subj:'juegue juegues juegue juguemos jueguen' }]
};
const TENSES_ES = [
  { id:'pres', w:2, de:'Präsens', frame:p => `normalmente ${p} ___` },
  { id:'indef', w:3, de:'Indefinido', frame:p => `ayer ${p} ___` },
  { id:'imp', w:2, de:'Imperfecto', frame:p => `antes ${p} siempre ___` },
  { id:'subj', w:3, de:'Subjuntivo', frame:p => `es importante que ${p} ___` }
];
function conjugate(inf, tense, idx){
  const irr = IRR_ES[inf];
  if (irr && irr[1][tense]) return irr[1][tense].split(' ')[idx];
  const cls = inf.slice(-2), stem = inf.slice(0, -2), end = END[tense][cls][idx];
  // Rechtschreibung: buscar → busque, llegar → llegué, empezar → empiece, coger → cojo
  let st = stem;
  if (cls === 'ar' && /^[eé]/.test(end)) st = stem.replace(/c$/, 'qu').replace(/g$/, 'gu').replace(/z$/, 'c');
  if ((cls === 'er' || cls === 'ir') && /^[oa]/.test(end)) st = stem.replace(/g$/, 'j');
  return st + end;
}
function genConj(){
  const useIrr = Math.random() < 0.7;
  let inf, gloss;
  if (useIrr) { inf = pick(Object.keys(IRR_ES)); gloss = IRR_ES[inf][0]; }
  else { const r = pick(REG_ES); inf = r[0]; gloss = r[1]; }
  const bag = []; TENSES_ES.forEach(t => { for (let i = 0; i < t.w; i++) bag.push(t); });
  const t = pick(bag);
  const p = pick(PERS);
  const form = conjugate(inf, t.id, p[1]);
  const fr = t.frame(p[0]);
  return { prompt:fr, hint:`${inf} (${gloss}), ${t.de}`, answers:[form, `${p[0]} ${form}`], label:'Setz die passende Verbform ein', note:`${inf}, ${t.de}, ${p[0]}: ${form}`, gap:fr.includes('___'), full:fr.replace('___', form) };
}


/* ---------- ser oder estar ---------- */
const SER = ['soy', 'eres', 'es', 'somos', 'son'], ESTAR = ['estoy', 'estás', 'está', 'estamos', 'están'], SEIN = ['bin', 'bist', 'ist', 'sind', 'sind'];
const SUBJ_ES = [
  { es:'Yo', de:'Ich', p:0, g:'m' }, { es:'Tú', de:'Du', p:1, g:'m' }, { es:'Ana', de:'Ana', p:2, g:'f' }, { es:'Pablo', de:'Pablo', p:2, g:'m' },
  { es:'Nosotros', de:'Wir', p:3, g:'m' }, { es:'Mis padres', de:'Meine Eltern', p:4, g:'m' }, { es:'Mis hermanas', de:'Meine Schwestern', p:4, g:'f' }
];
const plEs = w => (/[aeiouáéó]$/.test(w) ? w + 's' : w + 'es');
const agree = (m, f, s) => { const sg = s.g === 'f' ? f : m; return s.p >= 3 ? plEs(sg) : sg; };
const SE_STATE = [['cansado', 'cansada', 'müde'], ['enfermo', 'enferma', 'krank'], ['contento', 'contenta', 'zufrieden'], ['nervioso', 'nerviosa', 'nervös'], ['preocupado', 'preocupada', 'besorgt'], ['ocupado', 'ocupada', 'beschäftigt'], ['triste', 'triste', 'traurig']];
const SE_CHAR = [['alto', 'alta', 'groß'], ['simpático', 'simpática', 'nett'], ['inteligente', 'inteligente', 'intelligent'], ['tímido', 'tímida', 'schüchtern'], ['puntual', 'puntual', 'pünktlich'], ['generoso', 'generosa', 'großzügig'], ['divertido', 'divertida', 'lustig']];
const SE_PROF = [['médico', 'médica', 'médicos', 'médicas', 'Arzt', 'Ärztin', 'Ärzte', 'Ärztinnen'], ['profesor', 'profesora', 'profesores', 'profesoras', 'Lehrer', 'Lehrerin', 'Lehrer', 'Lehrerinnen'], ['enfermero', 'enfermera', 'enfermeros', 'enfermeras', 'Krankenpfleger', 'Krankenpflegerin', 'Krankenpfleger', 'Krankenpflegerinnen'], ['estudiante', 'estudiante', 'estudiantes', 'estudiantes', 'Student', 'Studentin', 'Studenten', 'Studentinnen']];
const SE_FROM = [['Alemania', 'Deutschland'], ['Austria', 'Österreich'], ['Suiza', 'der Schweiz'], ['Colombia', 'Kolumbien']];
const KOMMEN = ['komme', 'kommst', 'kommt', 'kommen', 'kommen'];
const SE_LOC = [['en casa', 'zu Hause'], ['en el trabajo', 'bei der Arbeit'], ['en Madrid', 'in Madrid'], ['en el tren', 'im Zug'], ['en la playa', 'am Strand']];
const SE_EVENT = [['La fiesta', 'Die Party', ['en casa de Ana', 'en el parque']], ['El concierto', 'Das Konzert', ['en el parque', 'en el teatro']], ['La reunión', 'Die Besprechung', ['en la oficina', 'en un hotel']], ['La boda', 'Die Hochzeit', ['en un hotel', 'en el parque']]];
const SE_EVLOC = { 'en casa de Ana':'bei Ana', 'en el parque':'im Park', 'en la oficina':'im Büro', 'en un hotel':'in einem Hotel', 'en el teatro':'im Theater' };
const SE_TIME = [['___ las tres.', 'Es ist drei Uhr.', 'son'], ['___ la una.', 'Es ist ein Uhr.', 'es'], ['___ las diez y media.', 'Es ist halb elf.', 'son'], ['Hoy ___ lunes.', 'Heute ist Montag.', 'es'], ['Mañana ___ viernes.', 'Morgen ist Freitag.', 'es'], ['Ya ___ tarde.', 'Es ist schon spät.', 'es']];
const SE_RESULT = [['La puerta', 'Die Tür', 'f', 0, ['abierto', 'cerrado']], ['La tienda', 'Der Laden', 'f', 0, ['abierto', 'cerrado']], ['El banco', 'Die Bank', 'm', 0, ['abierto', 'cerrado']], ['Las ventanas', 'Die Fenster', 'f', 1, ['abierto', 'cerrado']], ['Los platos', 'Die Teller', 'm', 1, ['sucio', 'limpio']]];
const SE_RES_DE = { abierto:'offen', cerrado:'geschlossen', sucio:'schmutzig', limpio:'sauber' };
const SE_SHIFT = [
  ['La película ___ aburrida.', 'Der Film ist langweilig.', 'es', 'aburrido mit ser: langweilig. Mit estar: gelangweilt.'],
  ['Yo ___ aburrido.', 'Ich langweile mich.', 'estoy', 'aburrido mit estar: gelangweilt. Mit ser: langweilig.'],
  ['Ana ___ muy lista.', 'Ana ist sehr klug.', 'es', 'listo mit ser: klug. Mit estar: fertig.'],
  ['Nosotros ___ listos.', 'Wir sind fertig.', 'estamos', 'listo mit estar: fertig. Mit ser: klug.'],
  ['La sopa ___ muy rica.', 'Die Suppe ist sehr lecker.', 'está', 'rico mit estar: lecker. Mit ser: reich.'],
  ['Su tío ___ muy rico.', 'Sein Onkel ist sehr reich.', 'es', 'rico mit ser: reich. Mit estar: lecker.'],
  ['Pablo ___ muy guapo hoy.', 'Pablo sieht heute sehr gut aus.', 'está', 'guapo mit estar: wie jemand gerade aussieht. Mit ser: wie jemand grundsätzlich ist.']
];
function genSerEstar(){
  const s = pick(SUBJ_ES);
  const frames = [
    [1.4, () => { const a = pick(SE_STATE), today = Math.random() < 0.5; return [`${s.es} ___ ${agree(a[0], a[1], s)}${today ? ' hoy' : ''}.`, `${s.de} ${SEIN[s.p]}${today ? ' heute' : ''} ${a[2]}.`, ESTAR[s.p], 'Zustand, also wie es jemandem gerade geht: estar.']; }],
    [1, () => { const a = pick(SE_CHAR); return [`${s.es} ___ muy ${agree(a[0], a[1], s)}.`, `${s.de} ${SEIN[s.p]} sehr ${a[2]}.`, SER[s.p], 'Eigenschaft, also wie jemand ist: ser.']; }],
    [1, () => { const a = pick(SE_PROF), pl = s.p >= 3, f = s.g === 'f'; return [`${s.es} ___ ${a[(pl ? 2 : 0) + (f ? 1 : 0)]}.`, `${s.de} ${SEIN[s.p]} ${a[4 + (pl ? 2 : 0) + (f ? 1 : 0)]}.`, SER[s.p], 'Beruf: ser, und zwar ohne Artikel.']; }],
    [0.8, () => { const a = pick(SE_FROM); return [`${s.es} ___ de ${a[0]}.`, `${s.de} ${KOMMEN[s.p]} aus ${a[1]}.`, SER[s.p], 'Herkunft: ser de. Auch wenn man im Deutschen „kommen aus“ sagt.']; }],
    [1.4, () => { const a = pick(SE_LOC); return [`${s.es} ___ ${a[0]}.`, `${s.de} ${SEIN[s.p]} ${a[1]}.`, ESTAR[s.p], 'Wo sich jemand befindet: estar.']; }],
    [0.9, () => { const e = pick(SE_EVENT), l = pick(e[2]); return [`${e[0]} ___ ${l}.`, `${e[1]} ist ${SE_EVLOC[l]}.`, 'es', 'Wo ein Ereignis stattfindet: ser, nicht estar.']; }],
    [0.8, () => { const t = pick(SE_TIME); return [t[0], t[1], t[2], 'Uhrzeit, Tag und Datum: ser.']; }],
    [1.3, () => { const t = pick(SE_RESULT), adj = pick(t[4]); const f = t[2] === 'f' ? adj.replace(/o$/, 'a') : adj; return [`${t[0]} ___ ${t[3] ? plEs(f) : f}.`, `${t[1]} ${t[3] ? 'sind' : 'ist'} ${SE_RES_DE[adj]}.`, t[3] ? 'están' : 'está', 'Zustand als Ergebnis (offen, geschlossen, schmutzig): estar.']; }],
    [1, () => pick(SE_SHIFT)]
  ];
  let r = Math.random() * frames.reduce((a, f) => a + f[0], 0), fr = frames[0][1];
  for (const f of frames) { if ((r -= f[0]) < 0) { fr = f[1]; break; } }
  const [es, de, ans, note] = fr();
  return { prompt:es, deLine:de, answers:[ans], label:'Setz ser oder estar ein', note, gap:true, full:es.replace('___', ans) };
}

/* ---------- por oder para ---------- */
const PP_PARA = [
  () => pick([['Estudio español ___ trabajar en México.', 'Ich lerne Spanisch, um in Mexiko zu arbeiten.'], ['Ahorro dinero ___ comprar una casa.', 'Ich spare Geld, um ein Haus zu kaufen.'], ['Me levanto temprano ___ llegar a tiempo.', 'Ich stehe früh auf, um pünktlich zu sein.'], ['Necesito gafas ___ leer.', 'Ich brauche eine Brille zum Lesen.'], ['Vamos al mercado ___ comprar fruta.', 'Wir gehen auf den Markt, um Obst zu kaufen.']]).concat('Zweck (um zu): para.'),
  () => { const t = pick([['Este regalo es', 'Dieses Geschenk ist'], ['Esta carta es', 'Dieser Brief ist'], ['Estas flores son', 'Diese Blumen sind']]), w = pick([['ti', 'dich'], ['Ana', 'Ana'], ['mi madre', 'meine Mutter'], ['los niños', 'die Kinder']]); return [`${t[0]} ___ ${w[0]}.`, `${t[1]} für ${w[1]}.`, 'Für wen etwas bestimmt ist: para. Nach Präpositionen heißt es ti, nicht tú.']; },
  () => { const d = pick([['el lunes', 'Montag'], ['el viernes', 'Freitag'], ['mañana', 'morgen']]); return [`Necesito el informe ___ ${d[0]}.`, `Ich brauche den Bericht bis ${d[1]}.`, 'Frist (bis zu einem Zeitpunkt): para.']; },
  () => { const c = pick(['Sevilla', 'Valencia', 'Bilbao', 'Málaga']), h = pick([['diez', 'zehn'], ['ocho', 'acht'], ['cinco', 'fünf']]); return [`El tren ___ ${c} sale a las ${h[0]}.`, `Der Zug nach ${c} fährt um ${h[1]} ab.`, 'Ziel einer Fahrt: para.']; },
  () => pick([['___ mí, es demasiado caro.', 'Für mich ist das zu teuer.'], ['___ mí, la película fue aburrida.', 'Für mich war der Film langweilig.'], ['___ ella, el español es fácil.', 'Für sie ist Spanisch leicht.']]).concat('Meinung oder Sicht (für mich): para.')
];
const PP_POR = [
  () => { const g = pick([['la lluvia', 'wegen des Regens'], ['el frío', 'wegen der Kälte'], ['la huelga', 'wegen des Streiks']]); return [`No salimos ___ ${g[0]}.`, `Wir gehen ${g[1]} nicht raus.`, 'Grund (wegen): por.']; },
  () => { const g = pick([['la ayuda', 'die Hilfe'], ['todo', 'alles'], ['el regalo', 'das Geschenk'], ['la invitación', 'die Einladung']]); return [`Gracias ___ ${g[0]}.`, `Danke für ${g[1]}.`, 'Dank für etwas: gracias por.']; },
  () => { const i = pick([['el libro', 'das Buch'], ['la chaqueta', 'die Jacke'], ['la bici', 'das Fahrrad']]), n = pick([15, 20, 50, 80]); return [`Compré ${i[0]} ___ ${n} euros.`, `Ich habe ${i[1]} für ${n} Euro gekauft.`, 'Preis oder Tausch (für 20 Euro): por.']; },
  () => { const w = pick([['el parque', 'durch den Park'], ['el centro', 'durch das Zentrum'], ['la playa', 'am Strand entlang']]); return [`Paseamos ___ ${w[0]}.`, `Wir spazieren ${w[1]}.`, 'Durch oder entlang: por.']; },
  () => pick([['Te lo mando ___ correo.', 'Ich schicke es dir per Post.'], ['Te lo mando ___ email.', 'Ich schicke es dir per E-Mail.'], ['Hablamos ___ teléfono.', 'Wir sprechen am Telefon.']]).concat('Mittel (per Post, am Telefon): por.'),
  () => pick([['Trabajo ___ la mañana.', 'Ich arbeite morgens.'], ['Te llamo ___ la tarde.', 'Ich rufe dich am Nachmittag an.'], ['Salimos ___ la noche.', 'Wir gehen abends aus.']]).concat('Tageszeit: por la mañana, por la tarde, por la noche.')
];
function genPorPara(){
  const para = Math.random() < 0.5;
  const [es, de, note] = pick(para ? PP_PARA : PP_POR)();
  const ans = es.startsWith('___') ? (para ? 'Para' : 'Por') : (para ? 'para' : 'por');
  return { prompt:es, deLine:de, answers:[ans.toLowerCase()], label:'Setz por oder para ein', note, gap:true, full:es.replace('___', ans) };
}

/* ---------- Stellung von „inte“ und anderen Satzadverbien ---------- */
const ADV_DE = { inte:'nicht', aldrig:'nie', alltid:'immer', ofta:'oft' };
const SUBJ_INTE = [['jag', 'Ich', 'ich', 0], ['du', 'Du', 'du', 1], ['han', 'Er', 'er', 2], ['hon', 'Sie', 'sie', 2], ['vi', 'Wir', 'wir', 3], ['de', 'Sie', 'sie', 4]];
// v, Rest, Adverbien, deutsche Verbformen, Hauptsatz, Nebensatz, vorn (sv), vorn (de)
const VP_SV = [
  ['kommer', 'idag', ['inte'], ['komme', 'kommst', 'kommt', 'kommen', 'kommen'], '{S} {V} heute {A}', '{s} heute {A} {V}', 'Tyvärr', 'Leider'],
  ['förstår', 'frågan', ['inte'], ['verstehe', 'verstehst', 'versteht', 'verstehen', 'verstehen'], '{S} {V} die Frage {A}', '{s} die Frage {A} {V}', 'Tyvärr', 'Leider'],
  ['jobbar', 'på fredag', ['inte'], ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeiten'], '{S} {V} am Freitag {A}', '{s} am Freitag {A} {V}', 'Tyvärr', 'Leider'],
  ['gillar', 'filmen', ['inte'], ['mag', 'magst', 'mag', 'mögen', 'mögen'], '{S} {V} den Film {A}', '{s} den Film {A} {V}', 'Tyvärr', 'Leider'],
  ['sover', 'bra', ['inte'], ['schlafe', 'schläfst', 'schläft', 'schlafen', 'schlafen'], '{S} {V} {A} gut', '{s} {A} gut {V}', 'Just nu', 'Im Moment'],
  ['svarar', '', ['inte', 'aldrig', 'alltid'], ['antworte', 'antwortest', 'antwortet', 'antworten', 'antworten'], '{S} {V} {A}', '{s} {A} {V}', 'På jobbet', 'Bei der Arbeit'],
  ['dricker', 'kaffe', ['aldrig', 'alltid', 'ofta'], ['trinke', 'trinkst', 'trinkt', 'trinken', 'trinken'], '{S} {V} {A} Kaffee', '{s} {A} Kaffee {V}', 'På morgonen', 'Morgens'],
  ['äter', 'kött', ['aldrig', 'ofta'], ['esse', 'isst', 'isst', 'essen', 'essen'], '{S} {V} {A} Fleisch', '{s} {A} Fleisch {V}', 'Hemma', 'Zu Hause'],
  ['kommer', 'för sent', ['aldrig', 'alltid', 'ofta'], ['komme', 'kommst', 'kommt', 'kommen', 'kommen'], '{S} {V} {A} zu spät', '{s} {A} zu spät {V}', 'Till jobbet', 'Zur Arbeit'],
  // Alltag, Arbeit, Natur, Freizeit: damit nicht jede Runde dieselben Bausteine bringt
  ['läser', 'nyheterna', ['aldrig', 'alltid', 'ofta'], ['lese', 'liest', 'liest', 'lesen', 'lesen'], '{S} {V} {A} die Nachrichten', '{s} {A} die Nachrichten {V}', 'På morgonen', 'Morgens'],
  ['cyklar', 'till jobbet', ['aldrig', 'alltid', 'ofta'], ['fahre', 'fährst', 'fährt', 'fahren', 'fahren'], '{S} {V} {A} mit dem Rad zur Arbeit', '{s} {A} mit dem Rad zur Arbeit {V}', 'På sommaren', 'Im Sommer'],
  ['tränar', 'på gymmet', ['aldrig', 'alltid', 'ofta'], ['trainiere', 'trainierst', 'trainiert', 'trainieren', 'trainieren'], '{S} {V} {A} im Fitnessstudio', '{s} {A} im Fitnessstudio {V}', 'Efter jobbet', 'Nach der Arbeit'],
  ['lyssnar', 'på radio', ['aldrig', 'alltid', 'ofta'], ['höre', 'hörst', 'hört', 'hören', 'hören'], '{S} {V} {A} Radio', '{s} {A} Radio {V}', 'I bilen', 'Im Auto'],
  ['pratar', 'svenska', ['aldrig', 'alltid', 'ofta'], ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprechen'], '{S} {V} {A} Schwedisch', '{s} {A} Schwedisch {V}', 'Med grannarna', 'Mit den Nachbarn'],
  ['promenerar', 'i skogen', ['aldrig', 'alltid', 'ofta'], ['gehe', 'gehst', 'geht', 'gehen', 'gehen'], '{S} {V} {A} im Wald spazieren', '{s} {A} im Wald spazieren {V}', 'På helgerna', 'Am Wochenende'],
  ['lagar', 'mat', ['inte', 'aldrig', 'alltid', 'ofta'], ['koche', 'kochst', 'kocht', 'kochen', 'kochen'], '{S} {V} {A}', '{s} {A} {V}', 'På vardagarna', 'Unter der Woche'],
  ['kör', 'bil', ['aldrig', 'alltid', 'ofta'], ['fahre', 'fährst', 'fährt', 'fahren', 'fahren'], '{S} {V} {A} Auto', '{s} {A} Auto {V}', 'I stan', 'In der Stadt'],
  ['betalar', 'kontant', ['aldrig', 'alltid', 'ofta'], ['zahle', 'zahlst', 'zahlt', 'zahlen', 'zahlen'], '{S} {V} {A} bar', '{s} {A} bar {V}', 'I Sverige', 'In Schweden'],
  ['skriver', 'dagbok', ['aldrig', 'alltid', 'ofta'], ['schreibe', 'schreibst', 'schreibt', 'schreiben', 'schreiben'], '{S} {V} {A} Tagebuch', '{s} {A} Tagebuch {V}', 'På kvällen', 'Abends'],
  ['badar', 'i sjön', ['aldrig', 'alltid', 'ofta'], ['bade', 'badest', 'badet', 'baden', 'baden'], '{S} {V} {A} im See', '{s} {A} im See {V}', 'På sommaren', 'Im Sommer'],
  ['åker', 'skidor', ['aldrig', 'alltid', 'ofta'], ['fahre', 'fährst', 'fährt', 'fahren', 'fahren'], '{S} {V} {A} Ski', '{s} {A} Ski {V}', 'På vintern', 'Im Winter'],
  ['plockar', 'svamp', ['aldrig', 'alltid', 'ofta'], ['sammle', 'sammelst', 'sammelt', 'sammeln', 'sammeln'], '{S} {V} {A} Pilze', '{s} {A} Pilze {V}', 'På hösten', 'Im Herbst'],
  ['spelar', 'innebandy', ['aldrig', 'alltid', 'ofta'], ['spiele', 'spielst', 'spielt', 'spielen', 'spielen'], '{S} {V} {A} Unihockey', '{s} {A} Unihockey {V}', 'På onsdagar', 'Mittwochs'],
  ['jobbar', 'hemifrån', ['aldrig', 'alltid', 'ofta'], ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeiten'], '{S} {V} {A} von zu Hause', '{s} {A} von zu Hause {V}', 'På måndagar', 'Montags'],
  ['tar', 'semester', ['aldrig', 'alltid', 'ofta'], ['mache', 'machst', 'macht', 'machen', 'machen'], '{S} {V} {A} Urlaub', '{s} {A} Urlaub {V}', 'I juli', 'Im Juli'],
  ['glömmer', 'nycklarna', ['aldrig', 'alltid', 'ofta'], ['vergesse', 'vergisst', 'vergisst', 'vergessen', 'vergessen'], '{S} {V} {A} die Schlüssel', '{s} {A} die Schlüssel {V}', 'På morgonen', 'Morgens'],
  ['hittar', 'glasögonen', ['inte'], ['finde', 'findest', 'findet', 'finden', 'finden'], '{S} {V} die Brille {A}', '{s} die Brille {A} {V}', 'Just nu', 'Gerade'],
  ['vet', 'svaret', ['inte'], ['weiß', 'weißt', 'weiß', 'wissen', 'wissen'], '{S} {V} die Antwort {A}', '{s} die Antwort {A} {V}', 'Ärligt talat', 'Ehrlich gesagt'],
  ['ser', 'skillnaden', ['inte'], ['sehe', 'siehst', 'sieht', 'sehen', 'sehen'], '{S} {V} den Unterschied {A}', '{s} den Unterschied {A} {V}', 'Faktiskt', 'Tatsächlich'],
  ['hinner', 'med allt', ['inte', 'aldrig', 'alltid'], ['schaffe', 'schaffst', 'schafft', 'schaffen', 'schaffen'], '{S} {V} {A} alles', '{s} {A} alles {V}', 'Före jul', 'Vor Weihnachten']
];
// Einleitung sv, de, passende Adverbien, Person der Einleitung (0 = ich)
const INTRO_SV = [['Jag vet att', 'Ich weiß, dass', 'inte aldrig alltid ofta', 0], ['Hon säger att', 'Sie sagt, dass', 'inte aldrig alltid ofta', 2], ['Jag tror att', 'Ich glaube, dass', 'inte aldrig alltid ofta', 0], ['Han berättar att', 'Er erzählt, dass', 'inte aldrig alltid ofta', 2], ['Det är synd att', 'Es ist schade, dass', 'inte aldrig', -1], ['Jag undrar om', 'Ich frage mich, ob', 'aldrig alltid ofta', 0]];
function genInte(){
  const vp = pick(VP_SV), adv = pick(vp[2]), s = pick(SUBJ_INTE);
  const fill = (t, cap) => t.replace('{S}', s[1]).replace('{s}', s[2]).replace('{V}', vp[3][s[3]]).replace('{A}', ADV_DE[adv]);
  const rest = vp[1] ? ' ' + vp[1] : '';
  const roll = Math.random();
  let sv, de, note;
  if (roll < 0.5) {
    const intro = pick(INTRO_SV.filter(x => x[2].split(' ').includes(adv) && !(x[3] === 0 && s[3] === 0)));
    sv = `${intro[0]} ${s[0]} ${adv} ${vp[0]}${rest}.`;
    de = `${intro[1]} ${fill(vp[5])}.`;
    note = `Im Nebensatz steht „${adv}“ vor dem Verb: … ${s[0]} ${adv} ${vp[0]}.`;
  } else if (roll < 0.75) {
    sv = `${s[0][0].toUpperCase() + s[0].slice(1)} ${vp[0]} ${adv}${rest}.`;
    de = `${fill(vp[4])}.`;
    note = `Im Hauptsatz steht „${adv}“ direkt nach dem Verb: ${s[0]} ${vp[0]} ${adv}.`;
  } else {
    sv = `${vp[6]} ${vp[0]} ${s[0]} ${adv}${rest}.`;
    de = `${vp[7]} ${fill(vp[4].replace('{S} {V}', '{V} {s}'))}.`;
    note = `Steht etwas anderes vorn, folgt erst das Verb, dann das Subjekt, dann „${adv}“: ${vp[6]} ${vp[0]} ${s[0]} ${adv}.`;
  }
  const answers = [sv];
  if (/\bidag\b/.test(sv)) answers.push(sv.replace('idag', 'i dag'));
  return { prompt:de, answers, label:'Übersetze ins Schwedische', note };
}

const GENS = {
  np:{ lang:'sv', trap:'species', short:'Adjektivendungen', label:'Adjektivendungen & bestimmte Form', make:genNP },
  tempus:{ lang:'sv', trap:'tempus', short:'Zeitformen', label:'Präteritum oder Perfekt', make:genTempus },
  inte:{ lang:'sv', trap:'bisats', short:'Wortstellung', label:'Stellung von „inte“, „aldrig“ & Co.', make:genInte },
  conj:{ lang:'es', trap:'konjugation', short:'Verbformen', label:'Verbformen', make:genConj },
  serestar:{ lang:'es', trap:'serestar', short:'ser/estar', label:'ser oder estar', make:genSerEstar },
  porpara:{ lang:'es', trap:'porpara', short:'por/para', label:'por oder para', make:genPorPara }
};
