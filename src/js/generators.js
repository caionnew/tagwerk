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
  const [, pret, sup, deObj, svObj, part, aux, long, exp, q, deExp, svExp] = v;
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
const SE_STATE = [['cansado', 'cansada', 'müde'], ['enfermo', 'enferma', 'krank'], ['contento', 'contenta', 'zufrieden'], ['nervioso', 'nerviosa', 'nervös', 'Heute, also im Moment: estar nervioso. ser nervioso hieße: ein nervöser Mensch.'], ['preocupado', 'preocupada', 'besorgt'], ['ocupado', 'ocupada', 'beschäftigt'], ['triste', 'triste', 'traurig', 'Heute, also im Moment: estar triste. ser triste hieße: ein trauriger Mensch.']];
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
  ['La sopa ___ muy rica.', 'Die Suppe ist sehr lecker.', 'está', 'Von diesem Essen jetzt: estar rico, lecker. Bei Personen heißt ser rico reich.'],
  ['Su tío ___ muy rico.', 'Sein Onkel ist sehr reich.', 'es', 'Bei Personen heißt ser rico reich. estar rico sagt man von Essen: lecker.'],
  ['Pablo ___ muy guapo hoy.', 'Pablo sieht heute sehr gut aus.', 'está', 'guapo mit estar: wie jemand gerade aussieht. Mit ser: wie jemand grundsätzlich ist.']
];
function genSerEstar(){
  const s = pick(SUBJ_ES);
  const frames = [
    [1.4, () => { const a = pick(SE_STATE), today = !!a[3] || Math.random() < 0.5; return [`${s.es} ___ ${agree(a[0], a[1], s)}${today ? ' hoy' : ''}.`, `${s.de} ${SEIN[s.p]}${today ? ' heute' : ''} ${a[2]}.`, ESTAR[s.p], a[3] || 'Zustand, also wie es jemandem gerade geht: estar.']; }],
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
// v, Rest, Adverbien, deutsche Verbformen, Hauptsatz, Nebensatz, vorn (sv), vorn (de), weitere richtige Fassungen [v, Rest] (optional)
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
  ['tränar', 'på gymmet', ['aldrig', 'alltid', 'ofta'], ['trainiere', 'trainierst', 'trainiert', 'trainieren', 'trainieren'], '{S} {V} {A} im Fitnessstudio', '{s} {A} im Fitnessstudio {V}', 'Efter jobbet', 'Nach der Arbeit', [['tränar', 'i gymmet']]],
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
  ['tar', 'semester i juli', ['aldrig', 'alltid', 'ofta'], ['mache', 'machst', 'macht', 'machen', 'machen'], '{S} {V} {A} im Juli Urlaub', '{s} {A} im Juli Urlaub {V}', 'Numera', 'Inzwischen', [['åker', 'på semester i juli'], ['har', 'semester i juli']]],
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
  const roll = Math.random();
  // pos: die geprüfte Stellung als Wortfolge, * = ein beliebiges Wort (das Verb). Stimmt sie, liegt ein Fehler woanders.
  let mk, de, note, pos;
  if (roll < 0.5) {
    const intro = pick(INTRO_SV.filter(x => x[2].split(' ').includes(adv) && !(x[3] === 0 && s[3] === 0)));
    mk = (v, r) => `${intro[0]} ${s[0]} ${adv} ${v}${r ? ' ' + r : ''}.`;
    de = `${intro[1]} ${fill(vp[5])}.`;
    note = `Im Nebensatz steht „${adv}“ vor dem Verb: … ${s[0]} ${adv} ${vp[0]}.`;
    pos = [intro[0].split(' ').pop().toLowerCase(), s[0], adv];
  } else if (roll < 0.75) {
    mk = (v, r) => `${s[0][0].toUpperCase() + s[0].slice(1)} ${v} ${adv}${r ? ' ' + r : ''}.`;
    de = `${fill(vp[4])}.`;
    note = `Im Hauptsatz steht „${adv}“ direkt nach dem Verb: ${s[0]} ${vp[0]} ${adv}.`;
    pos = [s[0], '*', adv];
  } else {
    mk = (v, r) => `${vp[6]} ${v} ${s[0]} ${adv}${r ? ' ' + r : ''}.`;
    de = `${vp[7]} ${fill(vp[4].replace('{S} {V}', '{V} {s}'))}.`;
    note = `Steht etwas anderes vorn, folgt erst das Verb, dann das Subjekt, dann „${adv}“: ${vp[6]} ${vp[0]} ${s[0]} ${adv}.`;
    pos = [vp[6].split(' ').pop().toLowerCase(), '*', s[0], adv];
  }
  const answers = [mk(vp[0], vp[1])].concat((vp[8] || []).map(([v, r]) => mk(v, r)));
  answers.slice().forEach(a => { if (/\bidag\b/.test(a)) answers.push(a.replace('idag', 'i dag')); });
  return { prompt:de, answers, label:'Übersetze ins Schwedische', note, pos, posLabel:`Die Stellung von „${adv}“ stimmt` };
}


/* ---------- Konnektoren und feste Verbindungen (B1–B2): Satzlogik und Kollokationen ---------- */
// [Satz mit ___, Lösung, drei Optionen, Deutsch, Erklärung]
const VERB_SV = [
  ['Det regnade hela dagen. ___ stannade vi inne.', 'Därför', ['Därför', 'Dessutom', 'Däremot'], 'Es regnete den ganzen Tag. Deshalb blieben wir drinnen.', 'därför = deshalb (Folge). Danach Inversion: Därför stannade vi.'],
  ['Lägenheten är billig. ___ ligger den nära stationen.', 'Dessutom', ['Dessutom', 'Däremot', 'Därför'], 'Die Wohnung ist billig. Außerdem liegt sie nah am Bahnhof.', 'dessutom = außerdem (Zusatz).'],
  ['Min bror älskar fotboll. Jag ___ tycker att det är tråkigt.', 'däremot', ['däremot', 'dessutom', 'därför'], 'Mein Bruder liebt Fußball. Ich dagegen finde es langweilig.', 'däremot = dagegen (Gegensatz).'],
  ['Vi gick ut ___ det regnade.', 'trots att', ['trots att', 'eftersom', 'så att'], 'Wir gingen raus, obwohl es regnete.', 'trots att = obwohl, danach Nebensatz-Wortstellung.'],
  ['Jag tar bussen ___ jag inte har något körkort.', 'eftersom', ['eftersom', 'fast', 'medan'], 'Ich nehme den Bus, weil ich keinen Führerschein habe.', 'eftersom = weil. fast = obwohl, medan = während.'],
  ['Hon pratade tyst ___ barnen inte skulle vakna.', 'så att', ['så att', 'trots att', 'eftersom'], 'Sie sprach leise, damit die Kinder nicht aufwachten.', 'så att = damit, sodass.'],
  ['___ jag lagade mat dukade han bordet.', 'Medan', ['Medan', 'Innan', 'Eftersom'], 'Während ich kochte, deckte er den Tisch.', 'medan = während (gleichzeitig).'],
  ['Ring mig ___ du kommer fram.', 'när', ['när', 'om', 'innan'], 'Ruf mich an, wenn du ankommst.', 'när = wenn (zeitlich, es passiert sicher). om = falls.'],
  ['Han är inte bara snäll ___ också rolig.', 'utan', ['utan', 'men', 'och'], 'Er ist nicht nur nett, sondern auch witzig.', 'Nach Verneinung heißt „sondern“ utan, nicht men.'],
  ['Vi måste ___ ett beslut i dag.', 'fatta', ['fatta', 'göra', 'ställa'], 'Wir müssen heute eine Entscheidung treffen.', 'ett beslut fattar man (umgangssprachlich auch: ta ett beslut).'],
  ['Får jag ___ en fråga?', 'ställa', ['ställa', 'göra', 'fråga'], 'Darf ich eine Frage stellen?', 'en fråga ställer man.'],
  ['Hon ___ ett misstag på provet.', 'gjorde', ['gjorde', 'tog', 'fattade'], 'Sie machte in der Prüfung einen Fehler.', 'göra ett misstag = einen Fehler machen.'],
  ['Vi ___ hänsyn till grannarna.', 'tar', ['tar', 'ger', 'gör'], 'Wir nehmen Rücksicht auf die Nachbarn.', 'ta hänsyn till = Rücksicht nehmen auf.'],
  ['Han ___ ett löfte till sin mamma.', 'gav', ['gav', 'gjorde', 'sa'], 'Er gab seiner Mutter ein Versprechen.', 'ge ett löfte = ein Versprechen geben.'],
  ['Det ___ ingen roll.', 'spelar', ['spelar', 'gör', 'har'], 'Das spielt keine Rolle.', 'det spelar ingen roll = das spielt keine Rolle, das ist egal.'],
  ['Glöm inte att ___ tänderna.', 'borsta', ['borsta', 'städa', 'putsa'], 'Vergiss nicht, die Zähne zu putzen.', 'Zähne borstar man. putsa = polieren (Schuhe, Fenster), städa = putzen im Sinn von sauber machen (Wohnung).'],
  ['Hon ___ examen i juni.', 'tog', ['tog', 'gjorde', 'gav'], 'Sie hat im Juni ihren Abschluss gemacht.', 'ta examen = den Abschluss machen.'],
  ['Det ___ tid att lära sig ett språk.', 'tar', ['tar', 'gör', 'behöver'], 'Es braucht Zeit, eine Sprache zu lernen.', 'det tar tid = es dauert, es braucht Zeit.'],
  ['Tåget var försenat. ___ missade vi mötet.', 'Följaktligen', ['Följaktligen', 'Däremot', 'Dessutom'], 'Der Zug hatte Verspätung. Folglich verpassten wir das Treffen.', 'följaktligen = folglich (gehoben). Danach Inversion: Följaktligen missade vi.'],
  ['Han har bott här i tio år. ___ pratar han nästan ingen svenska.', 'Ändå', ['Ändå', 'Därför', 'Alltså'], 'Er wohnt seit zehn Jahren hier. Trotzdem spricht er kaum Schwedisch.', 'ändå = trotzdem. Danach Inversion: Ändå pratar han.'],
  ['___ jag vet har ingen ringt.', 'Såvitt', ['Såvitt', 'Såsom', 'Sålunda'], 'Soweit ich weiß, hat niemand angerufen.', 'såvitt jag vet = soweit ich weiß.'],
  ['Du får låna bilen ___ du kör försiktigt.', 'förutsatt att', ['förutsatt att', 'trots att', 'så att'], 'Du darfst dir das Auto leihen, vorausgesetzt, du fährst vorsichtig.', 'förutsatt att = vorausgesetzt, dass.'],
  ['Vi åker ___ det regnar eller inte.', 'oavsett om', ['oavsett om', 'eftersom', 'medan'], 'Wir fahren, egal ob es regnet oder nicht.', 'oavsett om = egal ob.'],
  ['___ priserna har stigit handlar folk mindre.', 'I och med att', ['I och med att', 'Trots att', 'Innan'], 'Da die Preise gestiegen sind, kaufen die Leute weniger ein.', 'i och med att = dadurch dass, da. Nach dem Nebensatz folgt Inversion: handlar folk.'],
  ['Hon pluggar ___ hon arbetar heltid.', 'samtidigt som', ['samtidigt som', 'innan', 'sedan'], 'Sie studiert und arbeitet gleichzeitig Vollzeit.', 'samtidigt som = gleichzeitig, während.'],
  ['Det var kallt ute. ___ var det soligt.', 'Å andra sidan', ['Å andra sidan', 'Därför', 'Följaktligen'], 'Draußen war es kalt. Andererseits war es sonnig.', 'å andra sidan = andererseits. Danach Inversion: var det.'],
  ['Vi ses klockan sju, ___ du inte hör något annat från mig.', 'såvida', ['såvida', 'eftersom', 'därför'], 'Wir sehen uns um sieben, sofern du nichts anderes von mir hörst.', 'såvida inte = sofern nicht, es sei denn. „inte“ steht im Nebensatz vor dem Verb.'],
  ['___ hon var sjuk gick hon till jobbet.', 'Fastän', ['Fastän', 'Eftersom', 'Sedan'], 'Obwohl sie krank war, ging sie zur Arbeit.', 'fastän = obwohl (wie trots att).'],
  ['Det var mörkt, ___ vi tände ljus.', 'så', ['så', 'för', 'men'], 'Es war dunkel, also zündeten wir Kerzen an.', 'så = also, deshalb (Folge).'],
  ['Jag kan inte komma, ___ jag är sjuk.', 'för', ['för', 'så', 'fast'], 'Ich kann nicht kommen, denn ich bin krank.', 'för = denn, danach normale Wortstellung.'],
  ['___ du märke till skillnaden?', 'Lägger', ['Lägger', 'Tar', 'Ger'], 'Bemerkst du den Unterschied?', 'lägga märke till = bemerken.'],
  ['Bruden ___ ett tal på bröllopet.', 'höll', ['höll', 'gav', 'gjorde'], 'Die Braut hielt auf der Hochzeit eine Rede.', 'hålla tal = eine Rede halten.'],
  ['Han ___ ett brott.', 'begick', ['begick', 'gjorde', 'tog'], 'Er beging ein Verbrechen.', 'begå ett brott = ein Verbrechen begehen.'],
  ['Förslaget ___ stor uppmärksamhet.', 'väckte', ['väckte', 'gjorde', 'tog'], 'Der Vorschlag erregte große Aufmerksamkeit.', 'väcka uppmärksamhet = Aufmerksamkeit erregen.'],
  ['Chefen ___ höga krav på oss.', 'ställer', ['ställer', 'gör', 'ger'], 'Die Chefin stellt hohe Anforderungen an uns.', 'ställa krav på = Anforderungen stellen an.'],
  ['Vi kan ___ nytta av hans erfarenhet.', 'dra', ['dra', 'göra', 'ge'], 'Wir können von seiner Erfahrung profitieren.', 'dra nytta av = Nutzen ziehen aus.'],
  ['Partiet vill inte ___ ställning i frågan.', 'ta', ['ta', 'ge', 'göra'], 'Die Partei will in der Frage nicht Stellung beziehen.', 'ta ställning = Stellung beziehen.'],
  ['Regeringen lägger ___ ett nytt förslag.', 'fram', ['fram', 'upp', 'ut'], 'Die Regierung legt einen neuen Vorschlag vor.', 'lägga fram = vorlegen. lägga upp = planen, posten; lägga ut = veröffentlichen, auslagern.'],
  ['Plötsligt ___ jag syn på en älg.', 'fick', ['fick', 'tog', 'gav'], 'Plötzlich erblickte ich einen Elch.', 'få syn på = erblicken.'],
  ['Min pappa ___ i pension förra året.', 'gick', ['gick', 'tog', 'kom'], 'Mein Vater ist letztes Jahr in Rente gegangen.', 'gå i pension = in Rente gehen.'],
  ['De ___ slut efter fem år.', 'gjorde', ['gjorde', 'tog', 'satte'], 'Sie haben sich nach fünf Jahren getrennt.', 'göra slut = Schluss machen. ta slut = zu Ende gehen, ausgehen.'],
  ['Nu ___ vi igång!', 'sätter', ['sätter', 'gör', 'tar'], 'Jetzt legen wir los!', 'sätta igång = loslegen.']
];
const VERB_ES = [
  ['Estudió mucho; ___, suspendió el examen.', 'sin embargo', ['sin embargo', 'por lo tanto', 'además'], 'Er hat viel gelernt; trotzdem ist er durchgefallen.', 'sin embargo = trotzdem, jedoch (Gegensatz).'],
  ['No tenía dinero; ___, no fue al concierto.', 'por lo tanto', ['por lo tanto', 'sin embargo', 'en cambio'], 'Er hatte kein Geld; deshalb ging er nicht zum Konzert.', 'por lo tanto = deshalb, folglich.'],
  ['El hotel es barato y, ___, está en el centro.', 'además', ['además', 'en cambio', 'sin embargo'], 'Das Hotel ist günstig und liegt außerdem im Zentrum.', 'además = außerdem.'],
  ['A mí me encanta el frío; mi hermana, ___, prefiere el verano.', 'en cambio', ['en cambio', 'además', 'por eso'], 'Ich liebe die Kälte; meine Schwester dagegen mag lieber den Sommer.', 'en cambio = dagegen.'],
  ['Te lo explico ___ lo entiendas.', 'para que', ['para que', 'porque', 'aunque'], 'Ich erkläre es dir, damit du es verstehst.', 'para que = damit, immer mit Subjuntivo.'],
  ['___ hacía frío, salimos a pasear.', 'Aunque', ['Aunque', 'Porque', 'Como'], 'Obwohl es kalt war, gingen wir spazieren.', 'aunque = obwohl.'],
  ['___ no contestabas, te dejé un mensaje.', 'Como', ['Como', 'Porque', 'Aunque'], 'Da du nicht geantwortet hast, habe ich dir eine Nachricht hinterlassen.', 'Am Satzanfang heißt „da, weil“ como, nicht porque.'],
  ['No es caro, ___ barato.', 'sino', ['sino', 'pero', 'sin embargo'], 'Es ist nicht teuer, sondern billig.', 'Nach Verneinung heißt „sondern“ sino.'],
  ['Llámame en ___ llegues.', 'cuanto', ['cuanto', 'cuando', 'mientras'], 'Ruf mich an, sobald du ankommst.', 'en cuanto = sobald; bei Zukünftigem mit Subjuntivo.'],
  ['Iremos a la playa ___ que no llueva.', 'siempre', ['siempre', 'aunque', 'ya'], 'Wir fahren an den Strand, sofern es nicht regnet.', 'siempre que + Subjuntivo = sofern, vorausgesetzt dass.'],
  ['Tenemos que ___ una decisión hoy.', 'tomar', ['tomar', 'hacer', 'dar'], 'Wir müssen heute eine Entscheidung treffen.', 'tomar una decisión = eine Entscheidung treffen.'],
  ['¿Puedo ___ una pregunta?', 'hacer', ['hacer', 'poner', 'preguntar'], 'Darf ich eine Frage stellen?', 'una pregunta „macht“ man: hacer una pregunta.'],
  ['Vamos a ___ un paseo.', 'dar', ['dar', 'hacer', 'tomar'], 'Lass uns einen Spaziergang machen.', 'dar un paseo = spazieren gehen.'],
  ['Ella siempre ___ razón.', 'tiene', ['tiene', 'da', 'hace'], 'Sie hat immer recht.', 'tener razón = recht haben.'],
  ['Mi abuelo ___ cien años el mes que viene.', 'cumple', ['cumple', 'tiene', 'hace'], 'Mein Großvater wird nächsten Monat hundert.', 'cumplir años = ein Alter erreichen, Geburtstag haben.'],
  ['Este viaje me ___ mucha ilusión.', 'hace', ['hace', 'tiene', 'pone'], 'Auf diese Reise freue ich mich sehr.', 'hacer ilusión = Vorfreude machen.'],
  ['Hay que ___ cola para entrar.', 'hacer', ['hacer', 'tomar', 'poner'], 'Man muss Schlange stehen, um reinzukommen.', 'hacer cola = Schlange stehen.'],
  ['Mi hijo nunca me ___ caso.', 'hace', ['hace', 'da', 'pone'], 'Mein Sohn hört nie auf mich.', 'hacer caso a alguien = auf jemanden hören.'],
  ['Le ___ las gracias por su ayuda.', 'di', ['di', 'hice', 'dije'], 'Ich habe mich für seine Hilfe bedankt.', 'dar las gracias = sich bedanken.'],
  ['Esa película me ___ miedo.', 'da', ['da', 'hace', 'tiene'], 'Der Film macht mir Angst.', 'dar miedo = Angst machen.'],
  ['Llovía a cántaros; ___, el partido se jugó.', 'no obstante', ['no obstante', 'por consiguiente', 'además'], 'Es regnete in Strömen; dennoch wurde das Spiel ausgetragen.', 'no obstante = dennoch, jedoch (gehoben).'],
  ['Ha subido el precio de la gasolina; ___, la gente usa más el tren.', 'por consiguiente', ['por consiguiente', 'no obstante', 'en cambio'], 'Der Benzinpreis ist gestiegen; folglich nutzen die Leute mehr den Zug.', 'por consiguiente = folglich.'],
  ['Te presto el coche ___ me lo devuelvas mañana.', 'con tal de que', ['con tal de que', 'a pesar de que', 'ya que'], 'Ich leihe dir das Auto, vorausgesetzt, du gibst es mir morgen zurück.', 'con tal de que = vorausgesetzt, dass; immer mit Subjuntivo.'],
  ['No iré ___ me lo pidas tú.', 'a no ser que', ['a no ser que', 'puesto que', 'así que'], 'Ich gehe nicht hin, es sei denn, du bittest mich darum.', 'a no ser que = es sei denn; immer mit Subjuntivo.'],
  ['___ estás aquí, ayúdame con esto.', 'Ya que', ['Ya que', 'Aunque', 'Para que'], 'Wo du schon hier bist, hilf mir dabei.', 'ya que = da ja, wo schon (bekannter Grund).'],
  ['___ de que estaba cansado, siguió trabajando.', 'A pesar', ['A pesar', 'En vez', 'Antes'], 'Obwohl er müde war, arbeitete er weiter.', 'a pesar de que = obwohl.'],
  ['No solo no me ayudó, ___ se rió de mí.', 'sino que', ['sino que', 'pero', 'sin embargo'], 'Er hat mir nicht nur nicht geholfen, sondern mich sogar ausgelacht.', 'Vor einem konjugierten Verb heißt „sondern“ sino que.'],
  ['Hacía mucho calor, ___ nos quedamos en casa.', 'así que', ['así que', 'aunque', 'para que'], 'Es war sehr heiß, also blieben wir zu Hause.', 'así que = also, deshalb (Folge).'],
  ['Mi hermano es muy ordenado, ___ yo soy un desastre.', 'mientras que', ['mientras que', 'ya que', 'así que'], 'Mein Bruder ist sehr ordentlich, während ich ein Chaot bin.', 'mientras que = während (Gegensatz).'],
  ['___ a la economía, el informe es optimista.', 'En cuanto', ['En cuanto', 'A pesar', 'Por lo tanto'], 'Was die Wirtschaft betrifft, ist der Bericht optimistisch.', 'en cuanto a = was … betrifft.'],
  ['___ lo que dices, mañana hará buen tiempo.', 'Según', ['Según', 'Mientras', 'Aunque'], 'Nach dem, was du sagst, wird das Wetter morgen schön.', 'según = laut, nach.'],
  ['Estudia mucho ___ aprobar.', 'con el fin de', ['con el fin de', 'a pesar de', 'en lugar de'], 'Er lernt viel, um zu bestehen.', 'con el fin de + Infinitiv = um zu (gehoben).'],
  ['Te ___ de menos.', 'echo', ['echo', 'tengo', 'hago'], 'Ich vermisse dich.', 'echar de menos = vermissen (in Spanien; in Lateinamerika meist extrañar).'],
  ['Hay que ___ en cuenta el precio.', 'tener', ['tener', 'poner', 'dar'], 'Man muss den Preis berücksichtigen.', 'tener en cuenta = berücksichtigen.'],
  ['La empresa ___ a cabo una reforma.', 'llevó', ['llevó', 'hizo', 'tomó'], 'Das Unternehmen führte eine Reform durch.', 'llevar a cabo = durchführen.'],
  ['No me ___ cuenta de la hora.', 'di', ['di', 'hice', 'tomé'], 'Ich habe nicht gemerkt, wie spät es war.', 'darse cuenta de = merken, bemerken.'],
  ['Siempre ___ prisa por las mañanas.', 'tengo', ['tengo', 'hago', 'doy'], 'Morgens habe ich es immer eilig.', 'tener prisa = es eilig haben.'],
  ['Me ___ vergüenza hablar en público.', 'da', ['da', 'hace', 'pone'], 'Es ist mir peinlich, öffentlich zu sprechen.', 'dar vergüenza = peinlich sein.'],
  ['Tenemos que ___ las paces.', 'hacer', ['hacer', 'dar', 'tener'], 'Wir müssen uns versöhnen.', 'hacer las paces = sich versöhnen.'],
  ['El ruido me ___ loco.', 'vuelve', ['vuelve', 'hace', 'da'], 'Der Lärm macht mich verrückt.', 'volver loco a alguien = jemanden verrückt machen.'],
  ['¿Me ___ un favor?', 'haces', ['haces', 'das', 'pones'], 'Tust du mir einen Gefallen?', 'hacer un favor = einen Gefallen tun.'],
  ['Ese chico me ___ muy bien.', 'cae', ['cae', 'gusta', 'sienta'], 'Ich finde den Jungen sehr sympathisch.', 'caer bien/mal = sympathisch/unsympathisch sein.']
];
const genVerbind = list => () => {
  const [p, a, opts, de, note] = pick(list);
  return { prompt:p, deLine:de, answers:[a.toLowerCase()], label:'Welches Wort passt?', hint:opts.slice().sort(() => Math.random() - 0.5).join(' / '), note, gap:true, full:p.replace('___', a) };
};

/* ---------- Verben mit Präposition: tänka på, vänta på, soñar con, depender de ---------- */
const PREP_SV = [
  ['Jag tänker ofta ___ dig.', 'på', ['på', 'om', 'över'], 'Ich denke oft an dich.', 'tänka på = denken an.'],
  ['Vi väntar ___ bussen.', 'på', ['på', 'för', 'efter'], 'Wir warten auf den Bus.', 'vänta på = warten auf.'],
  ['Hon är rädd ___ hundar.', 'för', ['för', 'av', 'över'], 'Sie hat Angst vor Hunden.', 'rädd för = Angst haben vor.'],
  ['Han är intresserad ___ historia.', 'av', ['av', 'för', 'i'], 'Er interessiert sich für Geschichte.', 'intresserad av = interessiert an.'],
  ['Jag är trött ___ regnet.', 'på', ['på', 'av', 'över'], 'Ich habe den Regen satt.', 'trött på = etwas satthaben.'],
  ['Det beror ___ vädret.', 'på', ['på', 'av', 'om'], 'Das hängt vom Wetter ab.', 'bero på = abhängen von.'],
  ['Vi skrattade ___ skämtet.', 'åt', ['åt', 'på', 'över'], 'Wir lachten über den Witz.', 'skratta åt = lachen über.'],
  ['Hon är stolt ___ sina barn.', 'över', ['över', 'av', 'på'], 'Sie ist stolz auf ihre Kinder.', 'stolt över = stolz auf.'],
  ['Jag drömmer ___ en resa till Japan.', 'om', ['om', 'på', 'av'], 'Ich träume von einer Reise nach Japan.', 'drömma om = träumen von.'],
  ['Han är kär ___ henne.', 'i', ['i', 'på', 'med'], 'Er ist in sie verliebt.', 'kär i = verliebt in.'],
  ['Hon är gift ___ en svensk.', 'med', ['med', 'till', 'åt'], 'Sie ist mit einem Schweden verheiratet.', 'gift med = verheiratet mit.'],
  ['Jag letar ___ mina nycklar.', 'efter', ['efter', 'på', 'för'], 'Ich suche meine Schlüssel.', 'leta efter = suchen nach.'],
  ['Tack ___ hjälpen!', 'för', ['för', 'på', 'om'], 'Danke für die Hilfe!', 'tack för = danke für.'],
  ['Han är bra ___ matte.', 'på', ['på', 'för', 'med'], 'Er ist gut in Mathe.', 'bra på = gut in.'],
  ['Jag har vant mig ___ kylan.', 'vid', ['vid', 'med', 'på'], 'Ich habe mich an die Kälte gewöhnt.', 'vänja sig vid = sich gewöhnen an.'],
  ['Jag bryr mig inte ___ vad andra tycker.', 'om', ['om', 'för', 'på'], 'Es ist mir egal, was andere denken.', 'bry sig om = sich kümmern um, Wert legen auf.'],
  ['Vi måste ta hand ___ barnen.', 'om', ['om', 'på', 'för'], 'Wir müssen uns um die Kinder kümmern.', 'ta hand om = sich kümmern um.'],
  ['Hon är arg ___ sin bror.', 'på', ['på', 'för', 'av'], 'Sie ist wütend auf ihren Bruder.', 'arg på någon = wütend auf jemanden.'],
  ['Han är orolig ___ provet.', 'för', ['för', 'på', 'med'], 'Er macht sich Sorgen wegen der Prüfung.', 'orolig för = besorgt um, wegen (auch: orolig över).'],
  ['Jag längtar ___ dig.', 'efter', ['efter', 'på', 'om'], 'Ich sehne mich nach dir.', 'längta efter = sich sehnen nach.'],
  ['Det handlar ___ kärlek.', 'om', ['om', 'på', 'av'], 'Es geht um Liebe.', 'handla om = handeln von, gehen um.'],
  ['Hon är duktig ___ att sjunga.', 'på', ['på', 'för', 'av'], 'Sie kann gut singen.', 'duktig på = gut in, begabt für.'],
  ['Jag tror ___ dig.', 'på', ['på', 'för', 'av'], 'Ich glaube an dich.', 'tro på = glauben an.'],
  ['Grattis ___ födelsedagen!', 'på', ['på', 'för', 'om'], 'Herzlichen Glückwunsch zum Geburtstag!', 'grattis på födelsedagen ist fest; sonst grattis till.'],
  ['Han deltar ___ mötet.', 'i', ['i', 'för', 'av'], 'Er nimmt an der Besprechung teil.', 'delta i = teilnehmen an.'],
  ['Jag ber ___ ursäkt.', 'om', ['om', 'på', 'av'], 'Ich bitte um Entschuldigung.', 'be om = bitten um.'],
  ['Hon skäms ___ sitt misstag.', 'över', ['över', 'på', 'med'], 'Sie schämt sich für ihren Fehler.', 'skämmas över (oder för) = sich schämen für.'],
  ['Jag är säker ___ det.', 'på', ['på', 'om', 'av'], 'Da bin ich mir sicher.', 'säker på = sicher sein.'],
  ['Vi litar ___ dig.', 'på', ['på', 'i', 'om'], 'Wir vertrauen dir.', 'lita på = vertrauen, sich verlassen auf.'],
  ['Han klagar alltid ___ maten.', 'på', ['på', 'för', 'med'], 'Er beschwert sich immer über das Essen.', 'klaga på (oder över) = sich beschweren über.'],
  ['Hon påminner ___ sin mamma.', 'om', ['om', 'på', 'av'], 'Sie erinnert an ihre Mutter.', 'påminna om = erinnern an.'],
  ['Jag är beroende ___ kaffe.', 'av', ['av', 'på', 'för'], 'Ich bin abhängig von Kaffee.', 'beroende av = abhängig von.'],
  ['Hon var nöjd ___ resultatet.', 'med', ['med', 'på', 'av'], 'Sie war mit dem Ergebnis zufrieden.', 'nöjd med = zufrieden mit.'],
  ['Jag är van ___ det.', 'vid', ['vid', 'med', 'på'], 'Ich bin daran gewöhnt.', 'van vid = gewöhnt an.'],
  ['Hon blev förvånad ___ beskedet.', 'över', ['över', 'på', 'med'], 'Sie war über die Nachricht überrascht.', 'förvånad över = überrascht über.'],
  ['Han är känd ___ sina böcker.', 'för', ['för', 'av', 'på'], 'Er ist für seine Bücher bekannt.', 'känd för = bekannt für.'],
  ['Vilket lag håller du ___?', 'på', ['på', 'med', 'för'], 'Für welche Mannschaft bist du?', 'hålla på ett lag = Fan sein; hålla med = zustimmen.'],
  ['Jag ser fram ___ semestern.', 'emot', ['emot', 'på', 'till'], 'Ich freue mich auf den Urlaub.', 'se fram emot = sich freuen auf.'],
  ['Hon tackade ___ presenten.', 'för', ['för', 'på', 'om'], 'Sie bedankte sich für das Geschenk.', 'tacka för = danken für.'],
  ['Han är ansvarig ___ projektet.', 'för', ['för', 'av', 'på'], 'Er ist für das Projekt verantwortlich.', 'ansvarig för = verantwortlich für.'],
  ['Det består ___ tre delar.', 'av', ['av', 'i', 'med'], 'Es besteht aus drei Teilen.', 'bestå av = bestehen aus.'],
  ['Hon ansökte ___ jobbet.', 'om', ['om', 'till', 'för'], 'Sie bewarb sich um die Stelle.', 'ansöka om = sich bewerben um, beantragen.'],
  ['Jag tvivlar ___ det.', 'på', ['på', 'om', 'över'], 'Ich bezweifle das.', 'tvivla på = zweifeln an.'],
  ['Han hörde ___ sig till kommunen.', 'av', ['av', 'på', 'till'], 'Er meldete sich bei der Gemeinde.', 'höra av sig = sich melden.'],
  ['Vi kom överens ___ priset.', 'om', ['om', 'på', 'med'], 'Wir einigten uns auf den Preis.', 'komma överens om = sich einigen auf; komma överens med någon = sich mit jemandem verstehen.'],
  ['Han skyllde ___ sin bror.', 'på', ['på', 'över', 'åt'], 'Er schob die Schuld auf seinen Bruder.', 'skylla på = die Schuld schieben auf.'],
  ['Hon tog avstånd ___ uttalandet.', 'från', ['från', 'av', 'mot'], 'Sie distanzierte sich von der Äußerung.', 'ta avstånd från = sich distanzieren von.'],
  ['Det är typiskt ___ honom.', 'för', ['för', 'av', 'på'], 'Das ist typisch für ihn.', 'typiskt för = typisch für.'],
  ['Han är skyldig ___ brottet.', 'till', ['till', 'för', 'av'], 'Er ist des Verbrechens schuldig.', 'skyldig till = schuldig an.'],
  ['Hon brinner ___ miljöfrågor.', 'för', ['för', 'av', 'på'], 'Sie setzt sich leidenschaftlich für Umweltfragen ein.', 'brinna för = für etwas brennen.'],
  ['Vi har brist ___ lärare.', 'på', ['på', 'av', 'för'], 'Wir haben einen Mangel an Lehrern.', 'brist på = Mangel an.'],
  ['Jag fick nys ___ planen.', 'om', ['om', 'på', 'av'], 'Ich bekam Wind von dem Plan.', 'få nys om = Wind bekommen von.'],
  ['Han hämnades ___ sin fiende.', 'på', ['på', 'över', 'mot'], 'Er rächte sich an seinem Feind.', 'hämnas på = sich rächen an.'],
  ['Det rör sig ___ stora summor.', 'om', ['om', 'på', 'av'], 'Es handelt sich um große Summen.', 'det rör sig om = es handelt sich um.'],
  ['Hon gratulerade honom ___ examen.', 'till', ['till', 'för', 'på'], 'Sie gratulierte ihm zum Abschluss.', 'gratulera till = gratulieren zu (aber: grattis på födelsedagen).'],
  ['Han är misstänkt ___ mord.', 'för', ['för', 'av', 'om'], 'Er steht unter Mordverdacht.', 'misstänkt för = verdächtigt wegen.'],
  ['Jag har fått nog ___ dina ursäkter.', 'av', ['av', 'på', 'med'], 'Ich habe genug von deinen Ausreden.', 'få nog av = genug haben von.']
];
const PREP_ES = [
  ['Sueño ___ vivir junto al mar.', 'con', ['con', 'de', 'en'], 'Ich träume davon, am Meer zu leben.', 'soñar con = träumen von.'],
  ['Pienso mucho ___ ti.', 'en', ['en', 'de', 'a'], 'Ich denke viel an dich.', 'pensar en = denken an. pensar de = halten von.'],
  ['Se enamoró ___ su vecina.', 'de', ['de', 'con', 'en'], 'Er verliebte sich in seine Nachbarin.', 'enamorarse de = sich verlieben in.'],
  ['Me acuerdo ___ aquel verano.', 'de', ['de', 'en', 'con'], 'Ich erinnere mich an jenen Sommer.', 'acordarse de = sich erinnern an.'],
  ['Tardamos una hora ___ llegar.', 'en', ['en', 'de', 'para'], 'Wir brauchten eine Stunde, bis wir ankamen.', 'tardar en = brauchen (Zeit), um.'],
  ['Dejé ___ fumar hace años.', 'de', ['de', 'a', 'con'], 'Ich habe vor Jahren aufgehört zu rauchen.', 'dejar de = aufhören zu.'],
  ['Empezó ___ llover.', 'a', ['a', 'de', 'en'], 'Es fing an zu regnen.', 'empezar a = anfangen zu.'],
  ['Confío ___ ti.', 'en', ['en', 'a', 'con'], 'Ich vertraue dir.', 'confiar en = vertrauen.'],
  ['Me alegro ___ verte.', 'de', ['de', 'a', 'por'], 'Ich freue mich, dich zu sehen.', 'alegrarse de = sich freuen über.'],
  ['Insistió ___ pagar la cuenta.', 'en', ['en', 'a', 'de'], 'Er bestand darauf, die Rechnung zu bezahlen.', 'insistir en = bestehen auf.'],
  ['Mi ventana da ___ la plaza.', 'a', ['a', 'en', 'de'], 'Mein Fenster geht auf den Platz hinaus.', 'dar a = hinausgehen auf (Fenster, Zimmer, Haus).'],
  ['Me fijé ___ sus zapatos.', 'en', ['en', 'a', 'de'], 'Mir sind seine Schuhe aufgefallen.', 'fijarse en = achten auf.'],
  ['Se negó ___ firmar.', 'a', ['a', 'de', 'en'], 'Er weigerte sich zu unterschreiben.', 'negarse a = sich weigern zu.'],
  ['Me olvidé ___ llamarte.', 'de', ['de', 'a', 'en'], 'Ich habe vergessen, dich anzurufen.', 'olvidarse de = vergessen.'],
  ['Aprendí ___ nadar de pequeño.', 'a', ['a', 'de', 'en'], 'Ich habe als Kind schwimmen gelernt.', 'aprender a = lernen zu.'],
  ['Tengo ganas ___ verte.', 'de', ['de', 'a', 'por'], 'Ich freue mich darauf, dich zu sehen.', 'tener ganas de = Lust haben auf.'],
  ['Depende ___ ti.', 'de', ['de', 'en', 'a'], 'Das hängt von dir ab.', 'depender de = abhängen von.'],
  ['Me quejé ___ ruido.', 'del', ['del', 'al', 'en'], 'Ich habe mich über den Lärm beschwert.', 'quejarse de = sich beschweren über; de + el = del.'],
  ['Se parece mucho ___ su madre.', 'a', ['a', 'de', 'con'], 'Sie sieht ihrer Mutter sehr ähnlich.', 'parecerse a = ähneln.'],
  ['Nos despedimos ___ nuestros amigos.', 'de', ['de', 'a', 'con'], 'Wir verabschiedeten uns von unseren Freunden.', 'despedirse de = sich verabschieden von.'],
  ['Me encargo ___ la comida.', 'de', ['de', 'en', 'a'], 'Ich kümmere mich um das Essen.', 'encargarse de = sich kümmern um.'],
  ['Vamos a jugar ___ fútbol.', 'al', ['al', 'en', 'con'], 'Lass uns Fußball spielen.', 'jugar a (+ el = al) für Spiele und Sport; in Lateinamerika oft ohne.'],
  ['Me di cuenta ___ mi error.', 'de', ['de', 'en', 'a'], 'Ich habe meinen Fehler bemerkt.', 'darse cuenta de = bemerken.'],
  ['Voy ___ casa de mi abuela.', 'a', ['a', 'en', 'de'], 'Ich gehe zu meiner Großmutter.', 'ir a = gehen, fahren zu.'],
  ['Consiste ___ tres partes.', 'en', ['en', 'de', 'con'], 'Es besteht aus drei Teilen.', 'consistir en = bestehen aus.'],
  ['Me preocupo ___ ti.', 'por', ['por', 'en', 'a'], 'Ich mache mir Sorgen um dich.', 'preocuparse por = sich Sorgen machen um.'],
  ['Ella se dedica ___ la enseñanza.', 'a', ['a', 'en', 'de'], 'Sie arbeitet als Lehrerin.', 'dedicarse a = sich widmen, beruflich machen.'],
  ['No me atrevo ___ decírselo.', 'a', ['a', 'de', 'en'], 'Ich traue mich nicht, es ihm zu sagen.', 'atreverse a = sich trauen zu.'],
  ['Cuento ___ vosotros.', 'con', ['con', 'en', 'de'], 'Ich zähle auf euch.', 'contar con = zählen auf.'],
  ['Nos reímos ___ sus chistes.', 'de', ['de', 'en', 'a'], 'Wir lachten über seine Witze.', 'reírse de = lachen über.'],
  ['Se casó ___ un actor.', 'con', ['con', 'de', 'a'], 'Sie heiratete einen Schauspieler.', 'casarse con = heiraten.'],
  ['Me cuesta acostumbrarme ___ horario.', 'al', ['al', 'en', 'con'], 'Es fällt mir schwer, mich an die Zeiten zu gewöhnen.', 'acostumbrarse a = sich gewöhnen an.'],
  ['Trato ___ entenderte.', 'de', ['de', 'a', 'en'], 'Ich versuche, dich zu verstehen.', 'tratar de = versuchen zu.'],
  ['Quedamos ___ las ocho.', 'a', ['a', 'con', 'de'], 'Wir haben uns für acht Uhr verabredet.', 'quedar a una hora = sich verabreden für.'],
  ['Me equivoqué ___ número.', 'de', ['de', 'en', 'con'], 'Ich habe mich verwählt.', 'equivocarse de = das Falsche nehmen (Nummer, Zug, Tür).'],
  ['Se convirtió ___ un problema.', 'en', ['en', 'a', 'de'], 'Es wurde zu einem Problem.', 'convertirse en = werden zu.'],
  ['Volví ___ casa tarde.', 'a', ['a', 'en', 'de'], 'Ich kam spät nach Hause.', 'volver a casa = nach Hause zurückkommen.'],
  ['Vuelve ___ intentarlo.', 'a', ['a', 'de', 'en'], 'Versuch es noch einmal.', 'volver a + Infinitiv = etwas noch einmal tun.'],
  ['Acabo ___ llegar.', 'de', ['de', 'a', 'en'], 'Ich bin gerade angekommen.', 'acabar de + Infinitiv = gerade etwas getan haben.'],
  ['Estoy de acuerdo ___ tu propuesta.', 'con', ['con', 'de', 'en'], 'Ich bin mit deinem Vorschlag einverstanden.', 'estar de acuerdo con = einverstanden sein mit.'],
  ['Huele ___ café.', 'a', ['a', 'de', 'con'], 'Es riecht nach Kaffee.', 'oler a = riechen nach.'],
  ['Sabe ___ limón.', 'a', ['a', 'de', 'con'], 'Es schmeckt nach Zitrone.', 'saber a = schmecken nach.'],
  ['Se fía ___ su instinto.', 'de', ['de', 'con', 'por'], 'Er verlässt sich auf seinen Instinkt.', 'fiarse de = vertrauen, sich verlassen auf (seltener auch fiarse en).'],
  ['Siempre presume ___ su coche.', 'de', ['de', 'con', 'en'], 'Er gibt immer mit seinem Auto an.', 'presumir de = angeben mit.'],
  ['Me arrepiento ___ lo que dije.', 'de', ['de', 'en', 'a'], 'Ich bereue, was ich gesagt habe.', 'arrepentirse de = bereuen.'],
  ['Se empeñó ___ comprar la casa.', 'en', ['en', 'de', 'a'], 'Er bestand darauf, das Haus zu kaufen.', 'empeñarse en = darauf bestehen, sich in den Kopf setzen.'],
  ['El libro trata ___ la guerra.', 'de', ['de', 'en', 'con'], 'Das Buch handelt vom Krieg.', 'tratar de = handeln von (auch: tratar sobre).'],
  ['Se burlan ___ él.', 'de', ['de', 'con', 'a'], 'Sie machen sich über ihn lustig.', 'burlarse de = sich lustig machen über.'],
  ['Ha optado ___ estudiar medicina.', 'por', ['por', 'a', 'de'], 'Sie hat sich entschieden, Medizin zu studieren.', 'optar por = sich entscheiden für.'],
  ['Se conformó ___ un empate.', 'con', ['con', 'de', 'en'], 'Er gab sich mit einem Unentschieden zufrieden.', 'conformarse con = sich zufriedengeben mit.'],
  ['Carece ___ experiencia.', 'de', ['de', 'en', 'sin'], 'Es fehlt ihm an Erfahrung.', 'carecer de = nicht haben, Mangel haben an.'],
  ['Abusa ___ su poder.', 'de', ['de', 'con', 'en'], 'Er missbraucht seine Macht.', 'abusar de = missbrauchen.'],
  ['Me harté ___ esperar.', 'de', ['de', 'a', 'con'], 'Ich hatte es satt zu warten.', 'hartarse de = etwas satthaben.'],
  ['Están obligados ___ pagar.', 'a', ['a', 'de', 'en'], 'Sie sind verpflichtet zu zahlen.', 'estar obligado a = verpflichtet sein zu.'],
  ['Se acercó ___ la ventana.', 'a', ['a', 'de', 'en'], 'Er ging ans Fenster.', 'acercarse a = sich nähern, hingehen zu.'],
  ['Me comprometo ___ ayudarte.', 'a', ['a', 'de', 'en'], 'Ich verpflichte mich, dir zu helfen.', 'comprometerse a = sich verpflichten zu.'],
  ['Se interesa ___ la política.', 'por', ['por', 'de', 'a'], 'Er interessiert sich für Politik.', 'interesarse por (oder en) = sich interessieren für.'],
  ['Huyó ___ la policía.', 'de', ['de', 'a', 'por'], 'Er floh vor der Polizei.', 'huir de = fliehen vor.']
];
const genPrep = list => () => { const d = genVerbind(list)(); d.label = 'Welche Präposition?'; return d; };
/* ---------- Lücken aus Lesetexten: ein gebeugtes Wort aus einem Satz eines gelesenen Textes ---------- */
function textGapData(lang, sentence, title){
  const toks = sentence.split(' ');
  const cand = toks.map((w, i) => ({ w:w.replace(/[.,;:!?¡¿«»"„“()]/g, ''), i })).filter(x => x.w.length >= 5 && /^[a-zà-ÿ]+$/i.test(x.w) && (x.i === 0 || x.w[0] === x.w[0].toLowerCase()));
  if (!cand.length) return null;
  const withL = cand.map(x => { const e = typeof lookupWord === 'function' ? lookupWord(lang, x.w) : null; return Object.assign(x, { lemma:e && e.l && e.l.toLowerCase() !== x.w.toLowerCase() ? e.l : null }); });
  const pool = withL.some(x => x.lemma) ? withL.filter(x => x.lemma) : withL;
  const x = pool[Math.floor(Math.random() * pool.length)];
  const prompt = toks.map((w, i) => (i === x.i ? w.replace(x.w, '___') : w)).join(' ');
  return { prompt, answers:[x.w.toLowerCase()], label:title ? `Aus „${title}“` : 'Ergänze aus dem Text', hint:x.lemma ? `Grundform: ${x.lemma}` : `beginnt mit „${x.w.slice(0, 2).toLowerCase()}…“`, gap:true, full:sentence, note:'' };
}
const gapSentences = t => t.body.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+/).filter(x => x.split(' ').length >= 5);
function genTextGap(lang){
  return () => {
    const read = (DB.used && DB.used.texts) || {};
    const ts = TEXTS[lang].filter(t => read[t.id]); const list = ts.length ? ts : TEXTS[lang];
    for (let k = 0; k < 20; k++) { const t = pick(list), d = textGapData(lang, pick(gapSentences(t)), t.title); if (d) return d; }
    return textGapData(lang, gapSentences(TEXTS[lang][0])[0], TEXTS[lang][0].title);
  };
}

/* ---------- Begleiter: min/mitt/mina, den här + bestimmte Form; nuestro/a/os/as, este/esa, Adjektiv-Übereinstimmung ---------- */
// „mitt väder“, „ditt ögonblick“: richtig gebeugt, aber so sagt es niemand
const NO_POSS_SV = ['väder', 'ögonblick'];
const POSS_SV = [['mein', 'min', 'mitt', 'mina'], ['dein', 'din', 'ditt', 'dina'], ['unser', 'vår', 'vårt', 'våra']];
function genDetSv(){
  const type = pick(['poss', 'poss', 'possnoun', 'posspl', 'dem', 'demnoun', 'dempl']);
  if (type === 'poss' || type === 'possnoun') {
    const [w, g, de] = pick(GENUS.sv.filter(x => !NO_POSS_SV.includes(x[0]))), parts = de.split(' '), P = pick(POSS_SV), det = g === 'ett' ? P[2] : P[1];
    const deL = `${P[0]}${parts[0] === 'die' ? 'e' : ''} ${parts.slice(1).join(' ')}`;
    if (type === 'poss') return { prompt:`___ ${w}`, deLine:deL, answers:[det], label:'Welches Possessivpronomen?', hint:P[0], gap:true, full:`${det} ${w}`, note:`${w} ist ein ${g}-Wort, also ${det} ${w}.` };
    return { prompt:`${det} ___`, deLine:deL, answers:[w], label:'Welche Form nach dem Possessivpronomen?', hint:w, gap:true, full:`${det} ${w}`, note:`Nach min, mitt und mina steht die unbestimmte Form: ${det} ${w}.` };
  }
  const [de, gde, dePl, sv, art, def, pl, defPl] = pick(NOUNS), d = art === 'ett' ? 'det' : 'den', da = { m:'dieser', f:'diese', n:'dieses' }[gde];
  if (type === 'posspl') { const P = pick(POSS_SV); return { prompt:`___ ${pl}`, deLine:`${P[0]}e ${dePl}`, answers:[P[3]], label:'Welches Possessivpronomen?', hint:P[0] + 'e', gap:true, full:`${P[3]} ${pl}`, note:`Im Plural immer ${P[3]}, ob en- oder ett-Wort.` }; }
  if (type === 'dem') return { prompt:`___ här ${def}`, deLine:`${da} ${de} hier`, answers:[d], label:'den, det oder de?', hint:'den / det / de', gap:true, full:`${d} här ${def}`, note:`${sv} ist ein ${art}-Wort, also ${d} här ${def}.` };
  if (type === 'dempl') return { prompt:`___ här ${defPl}`, deLine:`diese ${dePl} hier`, answers:['de'], label:'den, det oder de?', hint:'den / det / de', gap:true, full:`de här ${defPl}`, note:'Im Plural: de här und die bestimmte Pluralform.' };
  return { prompt:`${d} här ___`, deLine:`${da} ${de} hier`, answers:[def], label:'Welche Form nach den/det här?', hint:sv, gap:true, full:`${d} här ${def}`, note:`Anders als im Deutschen steht nach den/det här die bestimmte Form: ${d} här ${def}.` };
}
const POSS_ES = [['mein', 'mi', 'mi', 'mis', 'mis'], ['dein', 'tu', 'tu', 'tus', 'tus'], ['unser', 'nuestro', 'nuestra', 'nuestros', 'nuestras']];
const DEM_ES = [['dieser hier', 'este', 'esta', 'estos', 'estas'], ['dieser da', 'ese', 'esa', 'esos', 'esas']];
// Welche Adjektive inhaltlich zum Nomen passen (n nuevo, v viejo, k pequeño, b bonito, p perfecto, t típico).
// Fehlt ein Nomen, gibt es dazu keine Adjektiv-Aufgabe: „la sangre bonita“ wäre richtig gebeugt, aber kein Spanisch, das jemand sagt.
const ADJ_FIT_ES = { problema:'nt', día:'pt', mapa:'nvkb', idioma:'n', tema:'nt', sistema:'nvpt', clima:'pt', sofá:'nvkb', planeta:'k', mano:'kb', foto:'nvkbpt', moto:'nvkb',
  coche:'nvkbpt', noche:'pt', clase:'nkpt', puente:'nvkb', color:'bpt', crisis:'t', viaje:'nbpt', calle:'nvkbt', lunes:'t', ciudad:'nvkbpt', nube:'kb', diente:'nk', pared:'nv',
  reloj:'nvkb', llave:'nvk', café:'pt', flor:'kb', árbol:'vkb', nariz:'kb', luz:'p', lápiz:'nvk', cama:'nvkb', hospital:'nvk', estación:'nvkb', aeropuerto:'nvk', playa:'kbpt',
  billete:'nv', maleta:'nvkb', pasaporte:'nv', mesa:'nvkb', silla:'nvkb', luna:'n', cuchillo:'nvk', cuchara:'nvk', tenedor:'nvk', lugar:'nbpt', pie:'k', papel:'nv',
  canción:'nvbpt', examen:'npt', imagen:'nvbpt' };
const ADJ_ES = { n:'nuevo', v:'viejo', k:'pequeño', b:'bonito', p:'perfecto', t:'típico' };
const NO_PL_ES = ['leche', 'sal', 'sangre', 'gente', 'mar', 'crisis', 'lunes', 'miedo'];
// Männlich Einzahl bei Nomen auf -o wäre geschenkt (Lösung = Hinweis); bleibt drin nur bei männlichen Nomen auf -a (el problema bonito)
function genDetEs(){
  let d = genDetEsOne();
  for (let k = 0; k < 20 && d.label === 'Adjektiv anpassen' && d.answers[0] === d.hint && !/a$/.test(d.full.split(' ')[1]); k++) d = genDetEsOne();
  return d;
}
function genDetEsOne(){
  const [w, g, de, extra] = pick(GENUS.es.filter(x => x[0] !== 'agua')), fem = g === 'la';
  const pl = /[aeiouáéó]$/.test(w) && !NO_PL_ES.includes(w) && Math.random() < 0.4, noun = pl ? w + 's' : w, k = 1 + (fem ? 1 : 0) + (pl ? 2 : 0);
  const deL = pl ? `${de}, Mehrzahl` : de, why = `${w} ist ${fem ? 'weiblich' : 'männlich'}${pl ? ', hier in der Mehrzahl' : ''}.${extra ? ' ' + extra : ''}`;
  const fit = ADJ_FIT_ES[w], type = pick(fit ? ['poss', 'dem', 'adj', 'adj'] : ['poss', 'dem']);
  if (type === 'poss' || type === 'dem') { const P = pick(type === 'poss' ? POSS_ES : DEM_ES), f = P[k]; return { prompt:`___ ${noun}`, deLine:deL, answers:[f], label:'Welche Form passt?', hint:P[0], gap:true, full:`${f} ${noun}`, note:`${why} Also ${f} ${noun}.` }; }
  const a = ADJ_ES[pick(fit.split(''))], af = a.replace(/o$/, fem ? 'a' : 'o') + (pl ? 's' : ''), art = pl ? (fem ? 'las' : 'los') : g;
  return { prompt:`${art} ${noun} ___`, deLine:deL, answers:[af], label:'Adjektiv anpassen', hint:a, gap:true, full:`${art} ${noun} ${af}`, note:`${why} Also ${af}.` };
}
/* ---------- Pluralklassen: flickor, bilar, datorer, äpplen, hus, böcker, män ---------- */
// [Einzahl, en/ett, Mehrzahl, Mehrzahl bestimmt, deutsch Einzahl, deutsch Mehrzahl, Klasse, Rahmen: m = beweglich (auch „Var är …?“), t = Zeit (nur unbestimmt)]
const PLURAL_SV = [
  ['flicka', 'en', 'flickor', 'flickorna', 'Mädchen', 'Mädchen', 'or', 'm'], ['klocka', 'en', 'klockor', 'klockorna', 'Uhr', 'Uhren', 'or', 'm'], ['gata', 'en', 'gator', 'gatorna', 'Straße', 'Straßen', 'or', ''],
  ['kvinna', 'en', 'kvinnor', 'kvinnorna', 'Frau', 'Frauen', 'or', 'm'], ['lampa', 'en', 'lampor', 'lamporna', 'Lampe', 'Lampen', 'or', 'm'], ['ros', 'en', 'rosor', 'rosorna', 'Rose', 'Rosen', 'or2', 'm'],
  ['våg', 'en', 'vågor', 'vågorna', 'Welle', 'Wellen', 'or2', ''], ['bil', 'en', 'bilar', 'bilarna', 'Auto', 'Autos', 'ar', 'm'], ['pojke', 'en', 'pojkar', 'pojkarna', 'Junge', 'Jungen', 'ar_e', 'm'],
  ['nyckel', 'en', 'nycklar', 'nycklarna', 'Schlüssel', 'Schlüssel', 'ar_x', 'm'], ['sjö', 'en', 'sjöar', 'sjöarna', 'See', 'Seen', 'ar', ''], ['fågel', 'en', 'fåglar', 'fåglarna', 'Vogel', 'Vögel', 'ar_x', 'm'],
  ['dag', 'en', 'dagar', 'dagarna', 'Tag', 'Tage', 'ar', 't'], ['sommar', 'en', 'somrar', 'somrarna', 'Sommer', 'Sommer', 'ar_x', 't'], ['vinter', 'en', 'vintrar', 'vintrarna', 'Winter', 'Winter', 'ar_x', 't'],
  ['morgon', 'en', 'morgnar', 'morgnarna', 'Morgen', 'Morgen', 'ar_x', 't'], ['syster', 'en', 'systrar', 'systrarna', 'Schwester', 'Schwestern', 'ar_x', 'm'], ['dotter', 'en', 'döttrar', 'döttrarna', 'Tochter', 'Töchter', 'uml_ar', 'm'],
  ['dator', 'en', 'datorer', 'datorerna', 'Computer', 'Computer', 'er', 'm'], ['telefon', 'en', 'telefoner', 'telefonerna', 'Telefon', 'Telefone', 'er', 'm'], ['restaurang', 'en', 'restauranger', 'restaurangerna', 'Restaurant', 'Restaurants', 'er', ''],
  ['park', 'en', 'parker', 'parkerna', 'Park', 'Parks', 'er', ''], ['idé', 'en', 'idéer', 'idéerna', 'Idee', 'Ideen', 'er', 't'], ['museum', 'ett', 'museer', 'museerna', 'Museum', 'Museen', 'um', ''],
  ['sko', 'en', 'skor', 'skorna', 'Schuh', 'Schuhe', 'r', 'm'], ['ko', 'en', 'kor', 'korna', 'Kuh', 'Kühe', 'r', 'm'], ['bro', 'en', 'broar', 'broarna', 'Brücke', 'Brücken', 'bro', ''],
  ['äpple', 'ett', 'äpplen', 'äpplena', 'Apfel', 'Äpfel', 'n', 'm'], ['hjärta', 'ett', 'hjärtan', 'hjärtana', 'Herz', 'Herzen', 'n', ''], ['öga', 'ett', 'ögon', 'ögonen', 'Auge', 'Augen', 'on', ''],
  ['öra', 'ett', 'öron', 'öronen', 'Ohr', 'Ohren', 'on', ''], ['hus', 'ett', 'hus', 'husen', 'Haus', 'Häuser', 'zero', ''], ['barn', 'ett', 'barn', 'barnen', 'Kind', 'Kinder', 'zero', 'm'],
  ['bord', 'ett', 'bord', 'borden', 'Tisch', 'Tische', 'zero', 'm'], ['rum', 'ett', 'rum', 'rummen', 'Zimmer', 'Zimmer', 'zero_mm', ''], ['program', 'ett', 'program', 'programmen', 'Programm', 'Programme', 'zero_mm', ''],
  ['fönster', 'ett', 'fönster', 'fönstren', 'Fenster', 'Fenster', 'zero_er', ''], ['lärare', 'en', 'lärare', 'lärarna', 'Lehrer', 'Lehrer', 'zero_p', 'm'], ['läkare', 'en', 'läkare', 'läkarna', 'Arzt', 'Ärzte', 'zero_p', 'm'],
  ['finger', 'ett', 'fingrar', 'fingrarna', 'Finger', 'Finger', 'finger', ''], ['bok', 'en', 'böcker', 'böckerna', 'Buch', 'Bücher', 'uml_er', 'm'], ['fot', 'en', 'fötter', 'fötterna', 'Fuß', 'Füße', 'uml_er', ''],
  ['hand', 'en', 'händer', 'händerna', 'Hand', 'Hände', 'uml_er', ''], ['stad', 'en', 'städer', 'städerna', 'Stadt', 'Städte', 'uml_er', ''], ['natt', 'en', 'nätter', 'nätterna', 'Nacht', 'Nächte', 'uml_er', 't'],
  ['tand', 'en', 'tänder', 'tänderna', 'Zahn', 'Zähne', 'uml_er', ''], ['son', 'en', 'söner', 'sönerna', 'Sohn', 'Söhne', 'uml_er', 'm'], ['bonde', 'en', 'bönder', 'bönderna', 'Bauer', 'Bauern', 'uml_er', 'm'],
  ['land', 'ett', 'länder', 'länderna', 'Land', 'Länder', 'uml_er', ''], ['bror', 'en', 'bröder', 'bröderna', 'Bruder', 'Brüder', 'uml_er', 'm'], ['man', 'en', 'män', 'männen', 'Mann', 'Männer', 'uml', 'm'],
  ['mus', 'en', 'möss', 'mössen', 'Maus', 'Mäuse', 'uml', 'm'], ['gås', 'en', 'gäss', 'gässen', 'Gans', 'Gänse', 'uml', 'm']
];
const PLURAL_NOTE = {
  or:'en-Wörter auf -a: aus -a wird -or.', or2:'Einige en-Wörter ohne -a gehen auch auf -or.', ar:'Viele einsilbige en-Wörter bekommen -ar.',
  ar_e:'Bei en-Wörtern auf -e fällt das e weg, dann -ar.', ar_x:'Das unbetonte e, a oder o vor l, r oder n fällt weg, dann -ar.',
  er:'Lehnwörter und Wörter mit betonter Endsilbe bekommen -er.', um:'Wörter auf -um verlieren es, dann -er.', r:'en-Wörter auf betonten Vokal bekommen nur -r.',
  bro:'Hier -ar trotz betontem Vokal. Nicht verwechseln mit bror (Bruder).', n:'ett-Wörter auf Vokal bekommen -n, bestimmt -na.', on:'Alte Pluralform auf -on.',
  zero:'ett-Wörter auf Konsonant bleiben gleich, bestimmt kommt -en dazu.', zero_mm:'Bleibt gleich; bestimmt wird das m verdoppelt.', zero_er:'ett-Wörter auf -er bleiben gleich; bestimmt fällt das e weg.',
  zero_p:'Personen auf -are bleiben gleich; bestimmt -arna, das e fällt weg.', finger:'ett finger geht wie die en-Wörter auf -er: e fällt weg, dann -ar.',
  uml_er:'Umlaut und -er, ähnlich wie im Deutschen.', uml:'Nur Umlaut, keine Endung, ähnlich wie im Deutschen.', uml_ar:'Umlaut und -ar.'
};
// Rahmen: unbestimmt (två, många, några) oder bestimmt (de här, Var är …?)
const PLURAL_FRAMES = [
  ['två ___', 'zwei {p}', 0, ''], ['många ___', 'viele {p}', 0, ''], ['några ___', 'einige {p}', 0, ''],
  ['de här ___', 'diese {p} hier', 1, 'nt'], ['Var är ___?', 'Wo sind die {p}?', 1, 'm']
];
function genPluralSv(){
  const n = pick(PLURAL_SV), [sg, art, pl, defPl, , dePl, cls, fl] = n;
  const frames = PLURAL_FRAMES.filter(f => !f[3] || (f[3] === 'm' ? fl === 'm' : fl !== 't'));
  const f = pick(frames.concat(frames.filter(x => !x[2])));
  const ans = f[2] ? defPl : pl, prompt = f[0];
  return { prompt, deLine:f[1].replace('{p}', dePl), answers:[ans], label:f[2] ? 'Setz die bestimmte Mehrzahl ein' : 'Setz die Mehrzahl ein', hint:`${art} ${sg}`,
    note:`${sg} → ${pl}, bestimmt ${defPl}. ${PLURAL_NOTE[cls]}`, gap:true, full:prompt.replace('___', ans) };
}

/* ---------- Verbalperiphrasen: llevar + Gerundium, acabar de, volver a, soler, ponerse a, dejar de, estar a punto de, seguir … ---------- */
// [Satz mit ___, richtige Formen, Muster, Deutsch, Erklärung]
const PERI_ES = [
  ['___ dos horas esperando.', ['Llevo'], 'llevar + Gerundium', 'Ich warte schon seit zwei Stunden.', 'llevar + Zeitraum + Gerundium = seit … etwas tun: llevo dos horas esperando.'],
  ['¿Cuánto tiempo ___ estudiando español?', ['llevas'], 'llevar + Gerundium', 'Wie lange lernst du schon Spanisch?', 'Wie lange schon: ¿cuánto tiempo llevas + Gerundium?'],
  ['___ un año viviendo allí cuando nació nuestra hija.', ['Llevábamos'], 'llevar + Gerundium', 'Wir wohnten schon ein Jahr dort, als unsere Tochter geboren wurde.', 'Dauer bis zu einem Punkt in der Vergangenheit: llevar im Imperfecto (llevábamos).'],
  ['___ toda la mañana intentando llamarte.', ['Llevo'], 'llevar + Gerundium', 'Ich versuche schon den ganzen Vormittag, dich anzurufen.', 'llevar + Zeitraum + Gerundium: llevo toda la mañana intentando.'],
  ['___ treinta años casados.', ['Llevan'], 'llevar + Partizip', 'Sie sind seit dreißig Jahren verheiratet.', 'llevar + Zeitraum + Partizip oder Adjektiv: llevan treinta años casados.'],
  ['___ de hablar con ella.', ['Acabo'], 'acabar de + Infinitiv', 'Ich habe gerade mit ihr gesprochen.', 'acabar de + Infinitiv = gerade etwas getan haben: acabo de hablar.'],
  ['___ de llegar.', ['Acabamos'], 'acabar de + Infinitiv', 'Wir sind gerade angekommen.', 'acabar de + Infinitiv = gerade etwas getan haben: acabamos de llegar.'],
  ['Cuando llamaste, ___ de salir.', ['acababa'], 'acabar de + Infinitiv', 'Als du angerufen hast, war ich gerade gegangen.', 'In der Vergangenheit: acababa de + Infinitiv = war gerade …'],
  ['___ de empezar a nevar.', ['Acaba'], 'acabar de + Infinitiv', 'Es hat gerade angefangen zu schneien.', 'Zwei Periphrasen hintereinander: acaba de (gerade) + empezar a (anfangen).'],
  ['___ a llover.', ['Vuelve'], 'volver a + Infinitiv', 'Es regnet wieder.', 'volver a + Infinitiv = wieder, noch einmal etwas tun: vuelve a llover.'],
  ['No ___ a hacerlo.', ['vuelvas'], 'volver a + Infinitiv', 'Mach das nie wieder.', 'Verneinter Imperativ: no vuelvas a hacerlo = tu das nicht noch einmal.'],
  ['___ a leer el libro el verano pasado.', ['Volví'], 'volver a + Infinitiv', 'Letzten Sommer habe ich das Buch noch einmal gelesen.', 'volver a + Infinitiv, mit el verano pasado im Indefinido: volví a leer.'],
  ['Hoy ___ a olvidar las llaves.', ['he vuelto', 'volví'], 'volver a + Infinitiv', 'Heute habe ich schon wieder die Schlüssel vergessen.', 'volver a = schon wieder; mit hoy in Spanien he vuelto, in Lateinamerika volví.'],
  ['Ya no ___ a confiar en él.', ['vuelvo', 'volveré'], 'volver a + Infinitiv', 'Ich werde ihm nie wieder vertrauen.', 'no volver a + Infinitiv = nie wieder etwas tun.'],
  ['___ desayunar en casa.', ['Suelo'], 'soler + Infinitiv', 'Normalerweise frühstücke ich zu Hause.', 'soler + Infinitiv = gewöhnlich etwas tun: suelo desayunar.'],
  ['Los domingos ___ comer con mis padres.', ['solemos'], 'soler + Infinitiv', 'Sonntags essen wir meistens mit meinen Eltern.', 'soler + Infinitiv = gewöhnlich, meistens: solemos comer.'],
  ['De pequeño ___ pasar los veranos en el pueblo.', ['solía'], 'soler + Infinitiv', 'Als Kind verbrachte ich die Sommer meistens im Dorf.', 'Gewohnheit in der Vergangenheit: solía + Infinitiv (Imperfecto).'],
  ['En invierno ___ oscurecer muy pronto.', ['suele'], 'soler + Infinitiv', 'Im Winter wird es meist sehr früh dunkel.', 'soler + Infinitiv = gewöhnlich: suele oscurecer.'],
  ['___ llegar tarde, pero hoy ha llegado pronto.', ['Suele'], 'soler + Infinitiv', 'Meistens kommt er zu spät, aber heute war er früh da.', 'soler + Infinitiv = gewöhnlich, meistens: suele llegar tarde.'],
  ['___ ir a la playa todos los fines de semana.', ['Solíamos'], 'soler + Infinitiv', 'Früher sind wir jedes Wochenende an den Strand gefahren.', 'Gewohnheit in der Vergangenheit: solíamos + Infinitiv.'],
  ['De repente ___ a llover.', ['se puso', 'empezó', 'comenzó'], 'ponerse a + Infinitiv', 'Plötzlich fing es an zu regnen.', 'ponerse a + Infinitiv = (plötzlich) anfangen zu; auch empezar a.'],
  ['Cuando le conté la noticia, ___ a llorar.', ['se puso', 'se echó', 'empezó', 'comenzó'], 'ponerse a + Infinitiv', 'Als ich ihr die Nachricht erzählte, fing sie an zu weinen.', 'ponerse a oder echarse a llorar = anfangen zu weinen.'],
  ['___ a trabajar en cuanto llego a la oficina.', ['Me pongo', 'Empiezo'], 'ponerse a + Infinitiv', 'Ich mache mich an die Arbeit, sobald ich ins Büro komme.', 'ponerse a + Infinitiv = sich an etwas machen, anfangen zu.'],
  ['___ a estudiar a las ocho y no paré hasta medianoche.', ['Me puse', 'Empecé', 'Comencé'], 'ponerse a + Infinitiv', 'Ich habe um acht angefangen zu lernen und bis Mitternacht nicht aufgehört.', 'ponerse a + Infinitiv = anfangen zu, hier im Indefinido: me puse a estudiar.'],
  ['Al ver la escena, todos ___ a reír.', ['se echaron', 'se pusieron', 'empezaron', 'comenzaron'], 'echarse a + Infinitiv', 'Als sie die Szene sahen, fingen alle an zu lachen.', 'echarse a reír, llorar, correr = plötzlich anfangen zu …'],
  ['___ de fumar hace cinco años.', ['Dejé'], 'dejar de + Infinitiv', 'Ich habe vor fünf Jahren aufgehört zu rauchen.', 'dejar de + Infinitiv = aufhören zu: dejé de fumar.'],
  ['¿Por qué ___ de venir a clase?', ['has dejado', 'dejaste'], 'dejar de + Infinitiv', 'Warum kommst du nicht mehr zum Unterricht?', 'dejar de + Infinitiv = nicht mehr tun; in Spanien has dejado, in Lateinamerika dejaste.'],
  ['No ___ de llover desde ayer.', ['deja', 'para'], 'dejar de + Infinitiv', 'Es hört seit gestern nicht auf zu regnen.', 'no dejar de (oder no parar de) + Infinitiv = nicht aufhören zu.'],
  ['___ de vernos cuando ella se mudó.', ['Dejamos'], 'dejar de + Infinitiv', 'Wir hörten auf, uns zu treffen, als sie umzog.', 'dejar de + Infinitiv = aufhören zu: dejamos de vernos.'],
  ['___ a punto de llamarte.', ['Estaba'], 'estar a punto de + Infinitiv', 'Ich wollte dich gerade anrufen.', 'estar a punto de + Infinitiv = gleich etwas tun, kurz davor sein; hier im Imperfecto.'],
  ['El tren ___ a punto de salir.', ['está'], 'estar a punto de + Infinitiv', 'Der Zug fährt gleich ab.', 'estar a punto de + Infinitiv = gleich, kurz davor.'],
  ['___ a punto de perder el avión.', ['Estuvimos'], 'estar a punto de + Infinitiv', 'Wir hätten beinahe den Flug verpasst.', 'estar a punto de im Indefinido: estuvimos a punto de = beinahe hätten wir …'],
  ['___ a punto de cerrar la tienda.', ['Están'], 'estar a punto de + Infinitiv', 'Sie schließen gleich den Laden.', 'estar a punto de + Infinitiv = gleich etwas tun.'],
  ['___ a punto de irnos cuando llegaste.', ['Estábamos'], 'estar a punto de + Infinitiv', 'Wir wollten gerade gehen, als du kamst.', 'Kurz davor in der Vergangenheit: estábamos a punto de; das Ereignis im Indefinido (llegaste).'],
  ['___ lloviendo.', ['Sigue', 'Continúa'], 'seguir + Gerundium', 'Es regnet immer noch.', 'seguir + Gerundium = immer noch, weiterhin: sigue lloviendo.'],
  ['¿___ trabajando en la misma empresa?', ['Sigues', 'Continúas'], 'seguir + Gerundium', 'Arbeitest du immer noch bei derselben Firma?', 'seguir + Gerundium = immer noch: ¿sigues trabajando …?'],
  ['A pesar del ruido, ___ durmiendo.', ['siguió', 'continuó'], 'seguir + Gerundium', 'Trotz des Lärms schlief er weiter.', 'seguir + Gerundium = weiter etwas tun: siguió durmiendo.'],
  ['¿___ viviendo tu hermano en Berlín?', ['Sigue', 'Continúa'], 'seguir + Gerundium', 'Wohnt dein Bruder immer noch in Berlin?', 'seguir + Gerundium = immer noch: ¿sigue viviendo …?'],
  ['___ mejorando poco a poco.', ['Va', 'Está'], 'ir + Gerundium', 'Es wird nach und nach besser.', 'ir + Gerundium = allmählich, nach und nach: va mejorando.'],
  ['___ diciéndolo desde hace meses.', ['Vengo'], 'venir + Gerundium', 'Das sage ich schon seit Monaten.', 'venir + Gerundium = schon seit einiger Zeit (bis jetzt) etwas tun: vengo diciéndolo.'],
  ['___ aceptando su propuesta.', ['Acabé', 'Terminé'], 'acabar + Gerundium', 'Am Ende habe ich seinen Vorschlag angenommen.', 'acabar oder terminar + Gerundium = am Ende doch etwas tun: acabé aceptando.'],
  ['___ de ser las nueve.', ['Deben'], 'deber de + Infinitiv', 'Es wird wohl neun Uhr sein.', 'deber de + Infinitiv = Vermutung (dürfte, wird wohl). deber ohne de heißt eigentlich müssen.']
];
function genPerifrasis(){
  const [p, ans, pat, de, note] = pick(PERI_ES);
  return { prompt:p, deLine:de, answers:ans.map(a => a.toLowerCase()), label:'Setz die passende Form ein', hint:`(${pat})`, note, gap:true, full:p.replace('___', ans[0]) };
}

const GENS = {
  // Abwechslung: Adjektivendungen und Begleiter (min/mitt/mina, den här + bestimmte Form) im selben Thema
  plural_sv:{ lang:'sv', trap:'plural', short:'Pluralformen', label:'Pluralklassen', make:genPluralSv },
  np:{ lang:'sv', trap:'species', short:'Adjektivendungen', label:'Adjektivendungen & bestimmte Form', make:() => (Math.random() < 0.4 ? genDetSv() : genNP()) },
  tempus:{ lang:'sv', trap:'tempus', short:'Zeitformen', label:'Präteritum oder Perfekt', make:genTempus },
  inte:{ lang:'sv', trap:'bisats', short:'Wortstellung', label:'Stellung von „inte“, „aldrig“ & Co.', make:genInte },
  conj:{ lang:'es', trap:'konjugation', short:'Verbformen', label:'Verbformen', make:genConj },
  serestar:{ lang:'es', trap:'serestar', short:'ser/estar', label:'ser oder estar', make:genSerEstar },
  perifrasis:{ lang:'es', trap:'perifrasis', short:'Periphrasen', label:'Verbalperiphrasen', make:genPerifrasis },
  porpara:{ lang:'es', trap:'porpara', short:'por/para', label:'por oder para', make:genPorPara },
  det_es:{ lang:'es', trap:'concord', short:'Übereinstimmung', label:'Begleiter & Adjektive anpassen', make:genDetEs },
  verbind_sv:{ lang:'sv', trap:'verbind', short:'Konnektoren', label:'Konnektoren & feste Verbindungen', make:genVerbind(VERB_SV) },
  verbind_es:{ lang:'es', trap:'verbind', short:'Konectores', label:'Konnektoren & feste Verbindungen', make:genVerbind(VERB_ES) },
  prep_sv:{ lang:'sv', trap:'prep', short:'Präpositionen', label:'Verben mit Präposition', make:genPrep(PREP_SV) },
  prep_es:{ lang:'es', trap:'prep', short:'Preposiciones', label:'Verben mit Präposition', make:genPrep(PREP_ES) },
  textgap_sv:{ lang:'sv', trap:'lesen', short:'Lesetext-Lücken', label:'Lücken aus Lesetexten', make:genTextGap('sv'), noGloss:true },
  textgap_es:{ lang:'es', trap:'lesen', short:'Lesetext-Lücken', label:'Lücken aus Lesetexten', make:genTextGap('es'), noGloss:true }
};
