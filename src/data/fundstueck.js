/* ---------- Fundstück auf der Startseite: pro Tag eine Karte, nach Regeln gewählt ---------- */
// Falsche Freunde: [Wort, Bedeutung, Verwechslung]
const FALSE_FRIENDS = {
  sv: [
    ['bli', 'werden', '„bleiben“ heißt stanna'],
    ['rolig', 'lustig, macht Spaß', '„ruhig“ heißt lugn'],
    ['glad', 'froh', '„glatt“ heißt hal oder slät'],
    ['semester', 'Urlaub', 'das Semester heißt termin'],
    ['termin', 'Semester', 'ein Termin heißt tid, beim Arzt läkartid'],
    ['kjol', 'Rock (Kleidungsstück)', 'en rock ist ein Mantel oder Kittel, morgonrock = Bademantel'],
    ['öl', 'Bier', 'Öl heißt olja'],
    ['kissa', 'pinkeln', '„küssen“ heißt kyssa'],
    ['ful', 'hässlich', '„faul“ heißt lat'],
    ['bord', 'Tisch', '„an Bord“ heißt ombord'],
    ['mus', 'Maus', 'Mus wie Apfelmus heißt mos'],
    ['lov', 'Ferien, etwa sommarlov', 'Lob heißt beröm'],
    ['gift', 'verheiratet', 'ett gift ist allerdings auch Gift'],
    ['artig', 'höflich', 'deutsch „artig“ meint eher brav'],
    ['fart', 'Geschwindigkeit', 'eine Fahrt heißt resa'],
    ['rätt', 'richtig', 'ein Rat heißt råd'],
    ['springa', 'laufen, rennen', '„springen“ heißt hoppa'],
    ['svår', 'schwierig', 'schwer im Sinne von Gewicht heißt tung'],
    ['fast', 'obwohl; auch fest', '„fast“ im Sinne von beinahe heißt nästan'],
    ['frisk', 'gesund', 'frisches Brot heißt färskt bröd'],
    ['ränta', 'Zinsen', 'die Rente heißt pension'],
    ['släkt', 'Verwandtschaft', '„schlecht“ heißt dålig'],
    ['ost', 'Käse', 'der Osten heißt öster'],
    ['kostym', 'Herrenanzug', 'ein Kostüm zum Verkleiden heißt maskeraddräkt'],
    ['slips', 'Krawatte', 'ein Slip heißt trosor']
  ],
  es: [
    ['el regalo', 'Geschenk', 'ein Regal heißt estantería'],
    ['el vaso', 'Trinkglas', 'eine Vase heißt florero oder jarrón'],
    ['el mantel', 'Tischdecke', 'ein Mantel heißt abrigo'],
    ['la firma', 'Unterschrift', 'eine Firma heißt empresa'],
    ['el gimnasio', 'Fitnessstudio', 'das Gymnasium heißt instituto'],
    ['la carta', 'Brief, Speisekarte', 'eine Fahrkarte heißt billete, eine Landkarte mapa'],
    ['el mapa', 'Landkarte', 'eine Mappe heißt carpeta'],
    ['la tasa', 'Gebühr, Rate', 'eine Tasse heißt taza'],
    ['el rato', 'Weile, un rato = eine Weile', 'ein Rat heißt consejo'],
    ['el bachillerato', 'Oberstufe, Abitur', 'ein Bachelor heißt grado'],
    ['el prospecto', 'Beipackzettel', 'ein Prospekt heißt folleto'],
    ['el balón', 'Ball', 'ein Ballon heißt globo'],
    ['el bufete', 'Anwaltskanzlei', 'ein Büfett heißt bufé'],
    ['constipado', 'erkältet', '„verstopft“ heißt estreñido'],
    ['embarazada', 'schwanger', '„verlegen“ heißt avergonzado'],
    ['el éxito', 'Erfolg', 'der Ausgang heißt salida'],
    ['el profesor', 'Lehrer, an jeder Schulart', 'ein Uni-Professor ist meist catedrático'],
    ['el bombón', 'Praline', 'ein Bonbon heißt caramelo'],
    ['la ganga', 'Schnäppchen', 'ein Gang heißt pasillo'],
    ['la pila', 'Batterie, auch Stapel', 'eine Pille heißt pastilla'],
    ['el gasto', 'Ausgabe, Kosten', 'ein Gast heißt invitado'],
    ['el cura', 'Pfarrer', 'la cura ist dagegen die Heilung']
  ]
};
// Ostersonntag (gregorianisch, Algorithmus von Meeus/Jones/Butcher)
function easter(y){
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month - 1, day);
}
const ymd = dt => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
const fixed = (m, d) => y => new Date(y, m - 1, d);
const weekdayIn = (m, d1, d2, wd) => y => { for (let d = d1; d <= d2; d++) { const x = new Date(y, m - 1, d); if (x.getDay() === wd) return x; } return null; };
const lastWeekday = (m, wd) => y => { for (let d = new Date(y, m, 0).getDate(); d > 0; d--) { const x = new Date(y, m - 1, d); if (x.getDay() === wd) return x; } return null; };
const fromEaster = n => y => { const e = easter(y); return new Date(e.getFullYear(), e.getMonth(), e.getDate() + n); };
// [Name, Datumsregel, Erklärung, Satz, Übersetzung]
const EVENTS = {
  sv: [
    ['Fettisdagen', fromEaster(-47), 'Am Faschingsdienstag isst man in Schweden Semlor: Hefebrötchen mit Mandelmasse und Sahne.', 'Ska vi äta semlor?', 'Sollen wir Semlor essen?'],
    ['Ostern', fromEaster(0), 'Kinder verkleiden sich als Osterhexen und ziehen von Tür zu Tür.', 'Glad påsk!', 'Frohe Ostern!'],
    ['Valborg', fixed(4, 30), 'Am Abend des 30. April begrüßt man den Frühling mit großen Feuern und Chorgesang.', 'Glad valborg!', 'Schöne Walpurgisnacht!'],
    ['Nationaldagen', fixed(6, 6), 'Schwedens Nationalfeiertag erinnert unter anderem an die Wahl Gustav Wasas zum König 1523.', 'Glad nationaldag!', 'Schönen Nationalfeiertag!'],
    ['Midsommar', weekdayIn(6, 19, 25, 5), 'Man tanzt um die Mittsommerstange, isst Hering und neue Kartoffeln und feiert die hellste Zeit des Jahres.', 'Glad midsommar!', 'Frohes Mittsommerfest!'],
    ['Kanelbullens dag', fixed(10, 4), 'Der Tag der Zimtschnecke. Am besten zur fika, der Kaffeepause.', 'Ska vi fika?', 'Machen wir eine Kaffeepause?'],
    ['Alla helgons dag', y => { for (let k = 0; k < 7; k++) { const x = new Date(y, 9, 31 + k); if (x.getDay() === 6) return x; } return null; }, 'Allerheiligen, immer am Samstag zwischen 31. Oktober und 6. November: Man zündet Kerzen auf den Friedhöfen an.', 'Vi tänder ett ljus.', 'Wir zünden eine Kerze an.'],
    ['Lucia', fixed(12, 13), 'Lichterfest im dunkelsten Monat: Ein Lucia-Zug singt mit Kerzen, dazu gibt es Safranbrötchen (lussekatter).', 'Glad lucia!', 'Schönes Luciafest!'],
    ['Julafton', fixed(12, 24), 'Gefeiert wird am Heiligabend. Um 15 Uhr schaut halb Schweden traditionell Donald Duck im Fernsehen (Kalle Anka).', 'God jul!', 'Frohe Weihnachten!'],
    ['Våffeldagen', fixed(3, 25), 'Waffeltag: Der Name kommt vom alten Feiertag Vårfrudagen, der ähnlich klingt.', 'Ska vi äta våfflor?', 'Sollen wir Waffeln essen?'],
    ['Surströmmingspremiär', y => { let n = 0; for (let d = 1; d <= 31; d++) { const x = new Date(y, 7, d); if (x.getDay() === 4 && ++n === 3) return x; } return null; }, 'Am dritten Donnerstag im August beginnt die Saison für fermentierten Hering. Der Geruch ist berüchtigt.', 'Det luktar starkt!', 'Das riecht stark!'],
    ['Mårtensafton', fixed(11, 10), 'Vor allem in Schonen isst man Gans, traditionell mit Schwarzsauer (svartsoppa) als Vorspeise.', 'Vi äter gås i kväll.', 'Wir essen heute Abend Gans.'],
    ['Första advent', y => { for (let d = 27; d <= 33; d++) { const x = new Date(y, 10, d); if (x.getDay() === 0) return x; } return null; }, 'Erster Advent: Man zündet die erste Kerze an, und in vielen Fenstern hängt ein Adventsstern.', 'Vi tänder det första ljuset.', 'Wir zünden die erste Kerze an.'],
    ['Nyårsafton', fixed(12, 31), 'Silvester mit Feuerwerk. Kurz vor Mitternacht wird im Fernsehen traditionell das Gedicht „Nyårsklockan“ vorgelesen.', 'Gott nytt år!', 'Frohes neues Jahr!']
  ],
  es: [
    ['Día de Reyes', fixed(1, 6), 'In Spanien bringen die Heiligen Drei Könige die Geschenke. Dazu gibt es Roscón de Reyes, einen Hefekranz.', '¡Felices Reyes!', 'Schönen Dreikönigstag!'],
    ['Carnaval', fromEaster(-47), 'Faschingsdienstag. Besonders bekannt sind der Karneval in Cádiz, auf Teneriffa und in vielen Ländern Lateinamerikas.', '¿De qué te vas a disfrazar?', 'Als was verkleidest du dich?'],
    ['Las Fallas', fixed(3, 19), 'In Valencia werden in der Nacht zum 20. März riesige Figuren verbrannt, la cremà.', '¡Qué ruido!', 'Was für ein Lärm!'],
    ['Semana Santa', fromEaster(-7), 'Die Karwoche beginnt. Besonders in Andalusien ziehen große Prozessionen durch die Straßen.', '¿Vas a ver las procesiones?', 'Gehst du die Prozessionen anschauen?'],
    ['Sant Jordi', fixed(4, 23), 'In Katalonien schenkt man sich an diesem Tag Bücher und Rosen.', 'un libro y una rosa', 'ein Buch und eine Rose'],
    ['Noche de San Juan', fixed(6, 23), 'In der Johannisnacht brennen an vielen Stränden Feuer.', 'Nos vemos en la playa.', 'Wir sehen uns am Strand.'],
    ['La Tomatina', lastWeekday(8, 3), 'Im Dorf Buñol bei Valencia bewerfen sich Tausende mit Tomaten.', 'una batalla de tomates', 'eine Tomatenschlacht'],
    ['Independencia de México', fixed(9, 16), 'Am Abend davor ruft der Präsident vom Balkon des Nationalpalasts den Grito, den Ruf der Unabhängigkeit.', '¡Viva México!', 'Es lebe Mexiko!'],
    ['Fiestas Patrias', fixed(9, 18), 'Chile feiert seine Unabhängigkeit mit Fondas, Empanadas und dem Tanz Cueca.', '¡Felices Fiestas Patrias!', 'Frohe Nationalfeiertage!'],
    ['Fiesta Nacional', fixed(10, 12), 'Spaniens Nationalfeiertag, in Lateinamerika vielerorts als Día de la Hispanidad bekannt.', 'Hoy es fiesta.', 'Heute ist Feiertag.'],
    ['Día de Muertos', fixed(11, 1), 'In Mexiko erinnert man am 1. und 2. November mit Altären, Ringelblumen und Pan de muerto an die Verstorbenen.', 'el Día de Muertos', 'der Tag der Toten'],
    ['Nochebuena', fixed(12, 24), 'Heiligabend feiert man mit einem großen Abendessen im Familienkreis.', '¡Feliz Navidad!', 'Frohe Weihnachten!'],
    ['Día de los Inocentes', fixed(12, 28), 'Der spanische Aprilscherz-Tag: Man spielt sich Streiche, die inocentadas.', '¡Inocente, inocente!', 'Reingelegt!'],
    ['Nochevieja', fixed(12, 31), 'Um Mitternacht isst man zwölf Trauben, eine bei jedem Glockenschlag.', '¡Feliz Año Nuevo!', 'Frohes neues Jahr!']
  ]
};
function nextEvent(lang, todayStr, within){
  const t = dateOf(todayStr), y = t.getFullYear();
  let best = null;
  EVENTS[lang].forEach(ev => [y, y + 1].forEach(yy => {
    const dt = ev[1](yy); if (!dt) return;
    const diff = dayDiff(ymd(dt), todayStr);
    if (diff >= 0 && diff <= within && (!best || diff < best.diff)) best = { ev, dt, diff };
  }));
  return best;
}
const dayIndex = s => Math.floor(dateOf(s).getTime() / 86400000);
// Wählt die Karte des Tages: ein Fest in den nächsten zwei Wochen, ein eigener Satz zum Erinnern oder ein falscher Freund
function fundstueck(lang, t = today()){
  const di = dayIndex(t);
  const ev = nextEvent(lang, t, 14);
  // Feste am Tag selbst und sonst jeden dritten Tag, damit nicht tagelang dieselbe Karte steht
  if (ev && (ev.diff === 0 || di % 3 === 0)) return { kind:'event', ...ev };
  // Wechsel: falscher Freund, Land & Leute, Erinnerung an einen eigenen Satz, Land & Leute
  const slot = di % 4;
  const old = BANK[lang].filter(i => { const s = stOf(i.id); return s && (s.ivl || 0) >= MATURE && s.last && dayDiff(t, s.last) >= 10; });
  if (slot === 2 && old.length) {
    const item = old[(di * 7919) % old.length];
    return { kind:'recall', item, ago:dayDiff(t, stOf(item.id).last) };
  }
  if (slot !== 0) { const k = KULTUR[lang]; return { kind:'kultur', e:k[(di * 7 + (lang === 'es' ? 3 : 0)) % k.length] }; }
  const list = FALSE_FRIENDS[lang];
  return { kind:'friend', ff:list[(di * 31 + (lang === 'es' ? 7 : 0)) % list.length] };
}
