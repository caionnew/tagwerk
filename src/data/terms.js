/* ---------- Grammatik-Begriffe, antippbar in allen Erklärungen ---------- */
// [Schlüssel, Titel, Suchmuster, Erklärung, Beispiel, passendes Thema (sv), passendes Thema (es)]
const TERMS = [
  ['supinum', 'Supinum', 'Supinums?', 'Die Verbform, die im Schwedischen nach „har“ oder „hade“ steht. Sie entspricht dem deutschen „gegessen“ in „habe gegessen“. Oft endet sie auf -t oder -it.', 'har ätit = habe gegessen · har sett = habe gesehen · har skrivit = habe geschrieben', 'tempus', ''],
  ['praeteritum', 'Präteritum', 'Präteritums?', 'Die einfache Vergangenheitsform aus einem einzigen Wort, wie „aß“ oder „sah“. Im Schwedischen steht sie bei allem, was zu einem bestimmten Zeitpunkt vorbei war.', 'Igår åt jag pizza. = Gestern habe ich Pizza gegessen.', 'tempus', ''],
  ['perfekt', 'Perfekt', 'Perfekts?', 'Die Vergangenheit aus zwei Teilen: im Schwedischen „har“ + Supinum, im Spanischen „haber“ + Partizip. Steht für Erfahrungen und für Dinge, die bis heute wirken.', 'Jag har aldrig sett filmen. · He comido paella.', 'tempus', 'perfecto'],
  ['praesens', 'Präsens', 'Präsens', 'Die Gegenwartsform: was jetzt oder regelmäßig passiert.', 'Jag dricker kaffe. · Bebo café.', '', 'konjugation'],
  ['infinitiv', 'Infinitiv', 'Infinitivs?|Infinitive?n?', 'Die Grundform eines Verbs, so wie sie im Wörterbuch steht.', 'äta (essen) · comer (essen)', '', ''],
  ['grundform', 'Grundform', 'Grundform', 'Die Form, unter der ein Wort im Wörterbuch steht: beim Verb der Infinitiv, beim Substantiv die Einzahl ohne Endung, beim Adjektiv die Form ohne Endung.', 'såg → se · huset → hus · stort → stor', '', ''],
  ['partizip', 'Partizip', 'Partizips?|Partizipien', 'Im Spanischen die Verbform nach „haber“, wie „gegessen“ im Deutschen. Sie endet meist auf -ado oder -ido.', 'he comido = ich habe gegessen · has hablado = du hast gesprochen', '', 'perfecto'],
  ['hilfsverb', 'Hilfsverb', 'Hilfsverbs?|Hilfsverben', 'Ein Verb, das zusammen mit einem anderen eine Zeitform bildet, wie „haben“ im Deutschen.', 'Schwedisch har/hade · Spanisch he, has, ha', '', ''],
  ['imperativ', 'Imperativ', 'Imperativs?|Imperative?n?', 'Die Befehlsform: Man fordert jemanden direkt auf.', 'Ring mig! = Ruf mich an! · ¡Llámame! = Ruf mich an!', '', ''],
  ['hauptsatz', 'Hauptsatz', 'Hauptsatz|Hauptsätzen?|Hauptsatzes', 'Ein Satz, der für sich allein stehen kann.', 'Han kommer inte idag.', 'bisats', ''],
  ['nebensatz', 'Nebensatz', 'Nebensatz|Nebensätzen?|Nebensatzes', 'Ein Satzteil, der nicht allein stehen kann. Er beginnt mit einem Wort wie att (dass), eftersom (weil) oder om (ob, wenn).', 'Jag vet att han inte kommer. → „att han inte kommer“ ist der Nebensatz.', 'bisats', ''],
  ['inversion', 'Inversion', 'Inversion', 'Verb und Subjekt tauschen die Plätze, weil etwas anderes am Satzanfang steht. Das Verb bleibt dabei an zweiter Stelle, wie im Deutschen.', 'Jag jobbar idag. → Idag jobbar jag.', 'inversion', ''],
  ['subjekt', 'Subjekt', 'Subjekts?|Subjekte?n?', 'Wer oder was im Satz etwas tut. Im Deutschen fragt man mit „wer?“.', 'Anna ringer sin mamma. → Anna ist das Subjekt.', 'sin', ''],
  ['partikelverb', 'Partikelverb', 'Partikelverbs?|Partikelverben', 'Ein Verb mit einem kleinen, betonten Zusatzwort, das die Bedeutung ändert, ähnlich wie „an“ in „anrufen“.', 'tycka = meinen, aber tycka om = mögen · ta med = mitbringen', 'partikel', ''],
  ['partikel', 'Partikel', 'Partikel', 'Das kleine, betonte Zusatzwort bei einem Partikelverb.', 'tycka om → „om“ ist die Partikel', 'partikel', ''],
  ['genus', 'Genus', 'Genus', 'Das grammatische Geschlecht eines Substantivs. Schwedisch hat zwei (en und ett), Spanisch auch zwei (el und la). Es passt oft nicht zum Deutschen.', 'en bok, aber das Buch · el puente, aber die Brücke', 'species', ''],
  ['enwort', 'en-Wort und ett-Wort', 'en-Wort|en-Wörter[n]?|ett-Wort|ett-Wörter[n]?', 'Die beiden Geschlechter im Schwedischen. Davon hängen Artikel und Adjektivendung ab. Die meisten Wörter sind en-Wörter.', 'en bil, en stor bil · ett hus, ett stort hus', 'species', ''],
  ['bestimmt', 'Bestimmte Form', 'bestimmte[n]? Form|Bestimmte[n]? Form', 'Im Schwedischen hängt man den bestimmten Artikel als Endung ans Wort, statt „der/die/das“ davor zu stellen.', 'hus = Haus, huset = das Haus · bil = Auto, bilen = das Auto', 'species', ''],
  ['doppelt', 'Doppelte Bestimmtheit', '[Dd]oppelte Bestimmtheit', 'Steht ein Adjektiv davor, braucht man im Schwedischen beides: den/det/de vorn und die Endung am Wort.', 'det stora huset = das große Haus', 'species', ''],
  ['tform', 't-Form', 't-Form', 'Die Adjektivform mit -t, die bei ett-Wörtern steht.', 'ett stort hus · ett nytt år', 'species', ''],
  ['spassiv', 's-Passiv', 's-Passiv', 'Im Schwedischen bildet man das Passiv oft einfach mit -s am Verb, wo das Deutsche „werden“ braucht.', 'Affären öppnas klockan nio. = Das Geschäft wird um neun geöffnet.', 'passiv', ''],
  ['possessiv', 'Possessivpronomen', 'Possessivpronomens?|Possessivpronomen|Possessiv', 'Wörter, die sagen, wem etwas gehört: mein, dein, sein.', 'min, din, hans, sin · mi, tu, su', 'sin', ''],
  ['objektpronomen', 'Objektpronomen', 'Objektpronomens?|Objektpronomen', 'Kurze Wörter für „mich, dich, ihn, es, ihm“. Im Spanischen stehen sie vor dem konjugierten Verb.', 'te lo doy = ich gebe es dir', '', 'pronombres'],
  ['reflexiv', 'Reflexivverb', 'Reflexivverbs?|Reflexivverben|reflexive[ns]? Verb(en)?|reflexiv', 'Ein Verb mit „sich“. Im Spanischen gehört das Pronomen fest dazu.', 'levantarse = aufstehen → me levanto = ich stehe auf', '', 'reflexivo'],
  ['indefinido', 'Indefinido', 'Indefinido', 'Spanische Vergangenheit für abgeschlossene Ereignisse, besonders mit einem Zeitpunkt wie ayer (gestern).', 'Ayer comí paella. = Gestern habe ich Paella gegessen.', '', 'pasado'],
  ['imperfecto', 'Imperfecto', 'Imperfecto', 'Spanische Vergangenheit für Hintergrund, Zustände und Gewohnheiten: wie etwas war, was man früher immer tat.', 'Antes vivía en Colonia. = Früher wohnte ich in Köln.', '', 'pasado'],
  ['perfecto', 'Perfecto', 'Perfecto', 'Spanisches Perfekt: haber + Partizip. In Spanien für heute, diese Woche und Erfahrungen.', 'Hoy he trabajado mucho. = Heute habe ich viel gearbeitet.', '', 'perfecto'],
  ['subjuntivo', 'Subjuntivo', 'Subjuntivo', 'Eine eigene spanische Verbform nach Wunsch, Gefühl, Zweifel oder Absicht. Das Deutsche hat dafür keine echte Entsprechung.', 'Quiero que vengas. = Ich will, dass du kommst. (nicht vienes)', '', 'subjuntivo'],
  ['indikativ', 'Indikativ', 'Indikativs?', 'Die normale Verbform für Tatsachen, das Gegenstück zum Subjuntivo.', 'Sé que vienes. = Ich weiß, dass du kommst.', '', 'subjuntivo'],
  ['konditional', 'Konditional', 'Konditionals?', 'Die „würde“-Form.', 'viajaría = ich würde reisen · me gustaría = ich hätte gern', '', 'condicional'],
  ['konjugation', 'Konjugation', 'Konjugation', 'Das Verändern eines Verbs je nach Person und Zeit.', 'hablo, hablas, habla … · hablé, hablaste …', '', 'konjugation'],
  ['gerundium', 'Gerundium', 'Gerundiums?', 'Die spanische -ando/-iendo-Form, mit estar für etwas, das gerade passiert.', 'Estoy leyendo. = Ich lese gerade.', '', 'serestar'],
  ['gefestigt', 'Gefestigt', 'gefestigte[nr]?|gefestigt', 'Du wusstest den Satz mehrmals, und er kommt erst in drei Wochen oder später wieder. Anki nennt solche Karten „mature“. Die Grenze von drei Wochen ist eine Konvention, kein Messwert.', 'Nächste Wiederholung in 21 Tagen oder später', '', '', 'app'],
  ['verankert', 'Verankert', 'verankerte[nr]?|verankert', 'Die nächste Wiederholung liegt ein Jahr oder weiter in der Zukunft. Solche Sätze sitzen sehr fest.', 'Nächste Wiederholung in 365 Tagen oder später', '', '', 'app'],
  ['abrufbar', 'Geschätzt abrufbar', 'abrufbar', 'Für jeden geübten Satz schätzt das Wiederholungsverfahren (FSRS), wie wahrscheinlich du ihn heute noch weißt. Die Summe dieser Wahrscheinlichkeiten ergibt die Zahl. Sie sinkt, wenn du pausierst, und steigt beim Üben.', '90 Sätze mit je 95 % Wahrscheinlichkeit ≈ 86 abrufbar', '', '', 'app'],
  ['lix', 'LIX', 'LIX', 'Der schwedische Lesbarkeitsindex (läsbarhetsindex) von Carl-Hugo Björnsson aus dem Jahr 1968: durchschnittliche Satzlänge plus Anteil langer Wörter (mehr als sechs Buchstaben) in Prozent. Unter 30 gilt ein Text als sehr leicht, um 40 als mittel, über 50 als schwer. Für Spanisch ist er nur ein grober Vergleichswert.', '10 Wörter pro Satz und 20 % lange Wörter ergeben LIX 30', '', '', 'app'],
  ['praeposition', 'Präposition', 'Präpositionen|Präposition', 'Kleine Wörter, die ein Verhältnis ausdrücken, etwa Ort oder Zeit: in, auf, für.', 'på måndag = am Montag · pienso en ti = ich denke an dich', 'tid', 'preposiciones']
];
const TERM_RE = new RegExp('(?<![A-Za-zÄÖÜäöüß-])(' + TERMS.map(t => t[2]).sort((a, b) => b.length - a.length).join('|') + ')(?![A-Za-zÄÖÜäöüß])', 'g');
const termFor = m => TERMS.find(t => new RegExp('^(?:' + t[2] + ')$').test(m));
// Text sicher ausgeben und Fachbegriffe antippbar machen
function termify(text){
  return esc(String(text)).replace(TERM_RE, m => { const t = termFor(m); return t ? `<button type="button" class="term" data-a="term" data-k="${t[0]}">${m}</button>` : m; });
}
function termSheetHtml(P){
  const t = TERMS.find(x => x[0] === P.k); if (!t) return '';
  const topic = P.lang === 'sv' ? t[5] : t[6], tr = topic ? trapMeta(P.lang, topic) : null;
  return `<div class="popov" data-a="popclose"></div><div class="pop" role="dialog" aria-label="${esc(t[1])}">
    <p class="find-k">${t[7] === 'app' ? 'Begriff' : 'Grammatik-Begriff'}</p><p class="pop-h">${esc(t[1])}</p>
    <p class="pop-t">${esc(t[3])}</p>
    <p class="pop-sub">${t[7] === 'app' ? 'So zählt Tagwerk' : 'Beispiel'}</p><p class="termex">${esc(t[4])}</p>
    <div class="popfoot">${tr ? `<button type="button" class="link" data-a="topic" data-t="${tr.id}" aria-label="Zum Thema ${esc(tr.label)}">Zum Thema</button>` : '<button type="button" class="link" data-a="ref" data-r="terms">Alle Begriffe</button>'}<button type="button" class="ghost" data-a="popclose">Schließen</button></div>
  </div>`;
}
