/* ---------- Grammatik-Begriffe, antippbar in allen Erklärungen ---------- */
// Je Begriff: k Schlüssel, t Titel, re Suchmuster; je Sprache, für die er gilt: [Erklärung, Beispiel, passendes Thema].
// Gilt ein Begriff für beide Sprachen, hat er zwei Fassungen mit eigenen Beispielen. App-Begriffe haben app: [Erklärung, Beispiel].
const TERMS = [
  { k:'supinum', t:'Supinum', re:'Supinums?',
    sv:['Die Verbform nach „har“ oder „hade“. Sie entspricht dem deutschen „gegessen“ in „habe gegessen“ und endet oft auf -t oder -it.', 'har ätit = habe gegessen · har sett = habe gesehen · har skrivit = habe geschrieben', 'tempus'] },
  { k:'praeteritum', t:'Präteritum', re:'Präteritums?',
    sv:['Die einfache Vergangenheitsform aus einem einzigen Wort, wie „aß“ oder „sah“. Im Schwedischen steht sie bei allem, was zu einem bestimmten Zeitpunkt vorbei war.', 'Igår åt jag pizza. = Gestern habe ich Pizza gegessen.', 'tempus'] },
  { k:'perfekt', t:'Perfekt', re:'Perfekts?',
    sv:['Die Vergangenheit aus zwei Teilen: „har“ + Supinum. Sie steht für Erfahrungen und für Dinge, die bis heute wirken, aber nie mit einem Zeitpunkt wie „igår“ (gestern).', 'Jag har aldrig sett filmen. = Ich habe den Film nie gesehen.', 'tempus'],
    es:['Die Vergangenheit aus zwei Teilen: „haber“ + Partizip, auf Spanisch Perfecto genannt. In Spanien steht sie für heute, diese Woche und Erfahrungen.', 'He comido paella. = Ich habe Paella gegessen.', 'perfecto'] },
  { k:'plusquamperfekt', t:'Plusquamperfekt', re:'Plusquamperfekts?',
    sv:['Die Vorvergangenheit: „hade“ + Supinum. Etwas war schon passiert, bevor etwas anderes in der Vergangenheit geschah.', 'När jag kom fram hade tåget redan gått. = Als ich ankam, war der Zug schon abgefahren.', 'tempus'],
    es:['Die Vorvergangenheit: „había“ + Partizip. Etwas war schon passiert, bevor etwas anderes in der Vergangenheit geschah. Im Subjuntivo heißt sie „hubiera“ + Partizip.', 'Cuando llegué, el tren ya había salido. = Als ich ankam, war der Zug schon abgefahren.', 'pasado'] },
  { k:'praesens', t:'Präsens', re:'Präsens',
    sv:['Die Gegenwartsform: was jetzt oder regelmäßig passiert. Im Schwedischen endet sie fast immer auf -r und ist für alle Personen gleich.', 'jag dricker, du dricker, hon dricker = ich trinke, du trinkst, sie trinkt', ''],
    es:['Die Gegenwartsform: was jetzt oder regelmäßig passiert. Im Spanischen hat jede Person eine eigene Endung.', 'bebo, bebes, bebe = ich trinke, du trinkst, er/sie trinkt', 'konjugation'] },
  { k:'infinitiv', t:'Infinitiv', re:'Infinitivs?|Infinitive?n?',
    sv:['Die Grundform eines Verbs, so wie sie im Wörterbuch steht. Im Schwedischen endet sie meist auf -a, oft mit att davor wie „zu“. Nach Modalverben wie kan oder vill steht sie ohne att.', 'Det är svårt att sova. = Es ist schwer zu schlafen. · Jag kan komma. = Ich kann kommen.', 'framtid'],
    es:['Die Grundform eines Verbs, so wie sie im Wörterbuch steht. Im Spanischen endet sie auf -ar, -er oder -ir.', 'hablar (sprechen) · comer (essen) · vivir (leben, wohnen)', 'konjugation'] },
  { k:'grundform', t:'Grundform', re:'Grundform',
    sv:['Die Form, unter der ein Wort im Wörterbuch steht: beim Verb der Infinitiv, beim Substantiv die unbestimmte Einzahl, beim Adjektiv die Form ohne Endung.', 'såg → se · huset → hus · stort → stor', ''],
    es:['Die Form, unter der ein Wort im Wörterbuch steht: beim Verb der Infinitiv, beim Substantiv die Einzahl, beim Adjektiv die männliche Einzahl.', 'comí → comer · casas → casa · buena → bueno', ''] },
  { k:'partizip', t:'Partizip', re:'Partizips?|Partizipien',
    es:['Die Verbform nach „haber“, wie „gegessen“ im Deutschen. Sie endet meist auf -ado oder -ido.', 'he comido = ich habe gegessen · has hablado = du hast gesprochen', 'perfecto'] },
  { k:'hilfsverb', t:'Hilfsverb', re:'Hilfsverbs?|Hilfsverben',
    sv:['Ein Verb, das zusammen mit einem anderen Verb steht, wie „haben“ in „habe gegessen“. Im Schwedischen zählen dazu har und hade, aber auch kan, ska, vill und måste.', 'har ätit = habe gegessen · skulle hinna = würde schaffen', 'bisats'],
    es:['Ein Verb, das zusammen mit einem anderen eine Zeitform bildet, wie „haben“ im Deutschen. Im Spanischen vor allem „haber“ für das Perfecto und „estar“ für die Verlaufsform.', 'he comido = ich habe gegessen · estoy comiendo = ich esse gerade', 'perifrasis'] },
  { k:'modalverb', t:'Modalverb', re:'Modalverbs?|Modalverben',
    sv:['Verben wie kan (kann), vill (will), ska (soll, wird), måste (muss) und får (darf). Danach steht der Infinitiv ohne att.', 'Jag kan inte komma. = Ich kann nicht kommen.', 'framtid'],
    es:['Verben wie poder (können), querer (wollen), deber (sollen, müssen) und tener que (müssen). Danach folgt der Infinitiv.', 'Tengo que irme. = Ich muss gehen.', 'perifrasis'] },
  { k:'imperativ', t:'Imperativ', re:'Imperativs?|Imperative?n?',
    sv:['Die Befehlsform. Bei vielen Verben fällt das -a am Ende weg (ringa → ring), bei Verben mit -ar im Präsens bleibt es (prata → prata).', 'Ring mig! = Ruf mich an! · Prata långsamt! = Sprich langsam!', ''],
    es:['Die Befehlsform. Pronomen hängen beim bejahten Imperativ hinten an. Beim verneinten stehen sie davor, und das Verb steht im Subjuntivo.', '¡Llámame! = Ruf mich an! · ¡No me llames! = Ruf mich nicht an!', 'pronombres'] },
  { k:'hauptsatz', t:'Hauptsatz', re:'Hauptsatz|Hauptsätzen?|Hauptsatzes',
    sv:['Ein Satz, der für sich allein stehen kann. Im Schwedischen steht das Verb hier an zweiter Stelle und „inte“ dahinter.', 'Han kommer inte idag. = Er kommt heute nicht.', 'bisats'],
    es:['Ein Satz, der für sich allein stehen kann. Im Spanischen entscheidet oft das Verb im Hauptsatz, welche Form im Nebensatz folgt.', 'Quiero que vengas. → „Quiero“ ist der Hauptsatz.', 'subjuntivo'] },
  { k:'nebensatz', t:'Nebensatz', re:'Nebensatz|Nebensätzen?|Nebensatzes',
    sv:['Ein Satzteil, der nicht allein stehen kann. Er beginnt mit einem Wort wie att (dass), eftersom (weil) oder om (ob, wenn).', 'Jag vet att han inte kommer. → „att han inte kommer“ ist der Nebensatz.', 'bisats'],
    es:['Ein Satzteil, der nicht allein stehen kann. Er beginnt mit einem Wort wie que (dass), cuando (wenn, als) oder si (wenn, ob).', 'Espero que vengas. → „que vengas“ ist der Nebensatz.', 'subjuntivo'] },
  { k:'relativsatz', t:'Relativsatz', re:'Relativsatz|Relativsätzen?|Relativsatzes',
    sv:['Ein Nebensatz, der ein Nomen näher beschreibt. Im Schwedischen beginnt er meist mit som, und wie in jedem Nebensatz stehen inte und aldrig vor dem Verb.', 'filmen som jag aldrig har sett = der Film, den ich nie gesehen habe', 'bisats'],
    es:['Ein Nebensatz, der ein Nomen näher beschreibt, meist mit que. Ist das Beschriebene noch unbekannt oder nur gesucht, steht der Subjuntivo.', 'Busco un piso que tenga balcón. = Ich suche eine Wohnung mit Balkon.', 'subjuntivo'] },
  { k:'inversion', t:'Inversion', re:'Inversion',
    sv:['Verb und Subjekt tauschen die Plätze, weil etwas anderes am Satzanfang steht. Das Verb bleibt dabei an zweiter Stelle, wie im Deutschen.', 'Jag jobbar idag. → Idag jobbar jag.', 'inversion'] },
  { k:'subjekt', t:'Subjekt', re:'Subjekts?|Subjekte?n?',
    sv:['Wer oder was im Satz etwas tut. Im Deutschen fragt man mit „wer?“.', 'Anna ringer sin mamma. → Anna ist das Subjekt.', 'sin'],
    es:['Wer oder was im Satz etwas tut. Im Spanischen fällt es oft weg, weil die Verbendung die Person schon zeigt.', '(Yo) vivo en Colonia. → Das Subjekt „yo“ steckt in der Endung -o.', 'konjugation'] },
  { k:'objekt', t:'Objekt', re:'Objekts?|Objekte?n?',
    sv:['Der Satzteil, auf den sich die Handlung richtet: wen oder was, wem. Im Schwedischen haben nur die Pronomen eine eigene Objektform.', 'Jag ser honom. = Ich sehe ihn. (han → honom, hon → henne, jag → mig)', 'inversion'],
    es:['Der Satzteil, auf den sich die Handlung richtet. Spanisch unterscheidet das direkte Objekt (wen oder was: lo, la) und das indirekte (wem: le). Personen als direktes Objekt bekommen ein „a“ davor.', 'Veo a Ana. → La veo. = Ich sehe Ana. → Ich sehe sie.', 'pronombres'] },
  { k:'partikelverb', t:'Partikelverb', re:'Partikelverbs?|Partikelverben',
    sv:['Ein Verb mit einem kleinen, betonten Zusatzwort, das die Bedeutung ändert, ähnlich wie „an“ in „anrufen“.', 'tycka = meinen, aber tycka om = mögen · ta med = mitbringen', 'partikel'] },
  { k:'partikel', t:'Partikel', re:'Partikel',
    sv:['Das kleine, betonte Zusatzwort bei einem Partikelverb.', 'tycka om → „om“ ist die Partikel', 'partikel'] },
  { k:'genus', t:'Genus', re:'Genus',
    sv:['Das grammatische Geschlecht eines Substantivs. Schwedisch hat zwei: en-Wörter und ett-Wörter. Es passt oft nicht zum Deutschen.', 'en bok, aber das Buch · ett äpple, aber der Apfel', 'species'],
    es:['Das grammatische Geschlecht eines Substantivs. Spanisch hat zwei: männlich (el) und weiblich (la). Wörter auf -o sind meist männlich, auf -a meist weiblich, mit Ausnahmen wie el día und la mano.', 'el puente, aber die Brücke · la sal, aber das Salz', 'concord'] },
  { k:'enwort', t:'en-Wort und ett-Wort', re:'en-Wort|en-Wörter[n]?|ett-Wort|ett-Wörter[n]?',
    sv:['Die beiden Geschlechter im Schwedischen. Davon hängen Artikel und Adjektivendung ab. Die meisten Wörter sind en-Wörter.', 'en bil, en stor bil · ett hus, ett stort hus', 'species'] },
  { k:'bestimmt', t:'Bestimmte Form', re:'bestimmte[n]? Form|Bestimmte[n]? Form',
    sv:['Im Schwedischen hängt man den bestimmten Artikel als Endung ans Wort, statt „der/die/das“ davor zu stellen.', 'hus = Haus, huset = das Haus · bil = Auto, bilen = das Auto', 'species'] },
  { k:'doppelt', t:'Doppelte Bestimmtheit', re:'[Dd]oppelte Bestimmtheit',
    sv:['Steht ein Adjektiv davor, braucht man im Schwedischen beides: den/det/de vorn und die Endung am Wort.', 'det stora huset = das große Haus', 'species'] },
  { k:'tform', t:'t-Form', re:'t-Form',
    sv:['Die Adjektivform mit -t, die bei ett-Wörtern steht.', 'ett stort hus · ett nytt år', 'species'] },
  { k:'spassiv', t:'s-Passiv', re:'s-Passiv',
    sv:['Im Schwedischen bildet man das Passiv oft einfach mit -s am Verb, wo das Deutsche „werden“ braucht.', 'Affären öppnas klockan nio. = Das Geschäft wird um neun geöffnet.', 'passiv'] },
  { k:'possessiv', t:'Possessivpronomen', re:'Possessivpronomens?|Possessivpronomen|Possessiv',
    sv:['Wörter, die sagen, wem etwas gehört: mein, dein, sein. Für „sein“ und „ihr“ hat Schwedisch zwei: sin, wenn es dem Subjekt gehört, sonst hans oder hennes.', 'Anna ringer sin mamma. (ihre eigene) · Anna ringer hennes mamma. (die einer anderen Frau)', 'sin'],
    es:['Wörter, die sagen, wem etwas gehört: mein, dein, sein. Im Spanischen richten sie sich nach dem Besitz, nicht nach dem Besitzer. „su“ heißt sein, ihr oder Ihr.', 'mi casa · mis casas · su coche = sein, ihr oder Ihr Auto', 'concord'] },
  { k:'objektpronomen', t:'Objektpronomen', re:'Objektpronomens?|Objektpronomen',
    es:['Kurze Wörter für „mich, dich, ihn, es, ihm“. Im Spanischen stehen sie vor dem konjugierten Verb oder hängen an Infinitiv, Gerundium und bejahten Imperativ.', 'te lo doy = ich gebe es dir · quiero verlo = ich will es sehen', 'pronombres'] },
  { k:'reflexiv', t:'Reflexivverb', re:'Reflexivverbs?|Reflexivverben|Reflexivpronomens?|[Rr]eflexive[ns]? Verb(en)?|reflexiv',
    sv:['Ein Verb mit „sich“. Das Pronomen ändert sich mit der Person: mig, dig, sig, oss, er.', 'sätta sig = sich setzen → jag sätter mig, du sätter dig, hon sätter sig', ''],
    es:['Ein Verb mit „sich“. Im Spanischen gehört das Pronomen fest dazu, auch wo das Deutsche kein „sich“ hat, und ändert sich mit der Person.', 'levantarse = aufstehen → me levanto, te levantas, se levanta', 'reflexivo'] },
  { k:'indefinido', t:'Indefinido', re:'Indefinido',
    es:['Spanische Vergangenheit für abgeschlossene Ereignisse, besonders mit einem Zeitpunkt wie ayer (gestern).', 'Ayer comí paella. = Gestern habe ich Paella gegessen.', 'pasado'] },
  { k:'imperfecto', t:'Imperfecto', re:'Imperfecto',
    es:['Spanische Vergangenheit für Hintergrund, Zustände und Gewohnheiten: wie etwas war, was man früher immer tat.', 'Antes vivía en Colonia. = Früher wohnte ich in Köln.', 'pasado'] },
  { k:'perfecto', t:'Perfecto', re:'Perfecto',
    es:['Spanisches Perfekt: haber + Partizip. In Spanien für heute, diese Woche und Erfahrungen. In weiten Teilen Lateinamerikas steht dafür oft das Indefinido.', 'Hoy he trabajado mucho. = Heute habe ich viel gearbeitet.', 'perfecto'] },
  { k:'subjuntivo', t:'Subjuntivo', re:'Subjuntivo',
    es:['Eine eigene spanische Verbform nach Wunsch, Gefühl, Zweifel oder Absicht. Das Deutsche hat dafür keine echte Entsprechung.', 'Quiero que vengas. = Ich will, dass du kommst. (nicht vienes)', 'subjuntivo'] },
  { k:'indikativ', t:'Indikativ', re:'Indikativs?',
    es:['Die normale Verbform für Tatsachen, das Gegenstück zum Subjuntivo.', 'Sé que vienes. = Ich weiß, dass du kommst.', 'subjuntivo'] },
  { k:'konditional', t:'Konditional', re:'Konditionals?',
    es:['Die „würde“-Form. Bei den meisten Verben hängt man -ía, -ías, -ía … an den Infinitiv.', 'viajaría = ich würde reisen · me gustaría = ich hätte gern', 'condicional'] },
  { k:'konjugation', t:'Konjugation', re:'Konjugation',
    es:['Das Verändern eines Verbs je nach Person und Zeit. Im Spanischen hat fast jede Person eine eigene Endung.', 'hablo, hablas, habla … · hablé, hablaste …', 'konjugation'] },
  { k:'gerundium', t:'Gerundium', re:'Gerundiums?',
    es:['Die spanische -ando/-iendo-Form, mit estar für etwas, das gerade passiert.', 'Estoy leyendo. = Ich lese gerade.', 'serestar'] },
  { k:'praeposition', t:'Präposition', re:'Präpositionen|Präposition',
    sv:['Kleine Wörter, die ein Verhältnis ausdrücken, etwa Ort oder Zeit: in, auf, für. Im Schwedischen passen sie oft nicht zum Deutschen.', 'på måndag = am Montag · på bio = im Kino', 'tid'],
    es:['Kleine Wörter, die ein Verhältnis ausdrücken, etwa Ort oder Zeit: in, auf, für. Im Spanischen gehören sie oft fest zu einem Verb, anders als im Deutschen.', 'pienso en ti = ich denke an dich · sueño con el mar = ich träume vom Meer', 'preposiciones'] },
  { k:'gefestigt', t:'Gefestigt', re:'gefestigte[nr]?|gefestigt',
    app:['Du wusstest den Satz mehrmals, und er kommt erst in drei Wochen oder später wieder. Anki nennt solche Karten „mature“. Die Grenze von drei Wochen ist eine Konvention, kein Messwert.', 'Nächste Wiederholung in 21 Tagen oder später'] },
  { k:'verankert', t:'Verankert', re:'verankerte[nr]?|verankert',
    app:['Die nächste Wiederholung liegt ein Jahr oder weiter in der Zukunft. Solche Sätze sitzen sehr fest.', 'Nächste Wiederholung in 365 Tagen oder später'] },
  { k:'abrufbar', t:'Geschätzt abrufbar', re:'abrufbar',
    app:['Für jeden geübten Satz schätzt das Wiederholungsverfahren (FSRS), wie wahrscheinlich du ihn heute noch weißt. Die Summe dieser Wahrscheinlichkeiten ergibt die Zahl. Sie sinkt, wenn du pausierst, und steigt beim Üben.', '90 Sätze mit je 95 % Wahrscheinlichkeit ≈ 86 abrufbar'] },
  { k:'behaltensdauer', t:'Behaltensdauer', re:'Behaltensdauer',
    app:['Wie lange du einen Satz nach der letzten Wiederholung noch mit mindestens 90 % Wahrscheinlichkeit weißt. Das ist die Stabilität, mit der das Wiederholungsverfahren (FSRS) plant; nach dieser Zeit kommt der Satz wieder. Gezeigt wird der Median über alle geübten Sätze: Die Hälfte hält länger. Das helle Band reicht vom unteren bis zum oberen Viertel. Neue Sätze beginnen bei wenigen Tagen und ziehen den Median zunächst nach unten.', 'Median 30 Tage: Die Hälfte deiner Sätze weißt du nach 30 Tagen noch mit mindestens 90 %'] },
  { k:'woerter', t:'Wörter', re:'Wortzahl',
    app:['Verschiedene Grundformen in deinen geübten Sätzen, nachgeschlagen im eingebauten Wörterbuch. Gebeugte Formen zählen einmal. „In gefestigten“ zählt nur Wörter aus gefestigten Sätzen.', 'går, gick und gått zählen einmal (gå), ebenso hablo, habló und hablado (hablar)'] },
  { k:'schaetzung', t:'Geschätzte Fehlerquote', re:'Fehlerschätzung',
    app:['Je Thema schätzt die App, wie oft du gerade falsch liegst. Gezählt werden alle Aufgaben, auch neue Sätze; „Behalten“ zählt nur Wiederholungen und liegt deshalb höher. Neuere Antworten zählen mehr: eine von vor 14 Tagen halb, eine von vor 28 Tagen ein Viertel. Bei wenigen Antworten liegt die Schätzung nahe am Schnitt deiner Themen (der Strich; jedes Thema zählt gleich, nicht jede Aufgabe), mit jeder Antwort zählt das Thema selbst mehr. Der dunkle Bereich enthält die wahre Quote mit 50 % Wahrscheinlichkeit, der helle mit 95 %. Wird ein Thema leichter für dich, wandert der Punkt über die Wochen nach links; gesicherte Fortschritte zeigt „Dein Weg“ als Etappe. „Klar über Schnitt“ heißt: mit mindestens 90 % Wahrscheinlichkeit über deinem Schnitt; die rote Hinterlegung bleibt, bis es unter 60 % fällt, damit sie nicht täglich wechselt. Nur dort kommen bei „Fortgeschritten“ auch leichtere Sätze. Die Pfeile in der Themenliste vergleichen die letzten vier Wochen mit den vier davor, neu an jedem Montag; je kräftiger, desto sicherer. Ohne Pfeil gibt es keinen klaren Unterschied. Gerechnet mit einem Beta-Binomial-Modell, empirisch-bayessch.', '5 von 13 falsch, Schnitt aller Themen 17 %: geschätzt 24 %, wahrscheinlich zwischen 11 und 40 %'] },
  { k:'schwerpunkt', t:'Schwerpunkt der Woche', re:'Schwerpunktthema',
    app:['Jede Woche bekommt ein Thema je Sprache bis zu einem Drittel der neuen Sätze. Gewählt wird montags per Los, gewichtet nach der geschätzten Fehlerquote: Ein Thema ist so oft Schwerpunkt, wie wahrscheinlich es gerade dein schwächstes ist. So kommt meist ein Thema mit hoher Fehlerquote dran, ab und zu aber auch ein Thema mit wenigen Antworten, über das die App noch wenig weiß. Themen ohne Antworten folgen nach der Zahl offener Sätze. „Ändern“ nimmt das nächste Thema der Reihe.', 'Ist ein Thema mit 40 % Wahrscheinlichkeit dein schwächstes, ist es in etwa zwei von fünf Wochen Schwerpunkt.'] },
  { k:'lix', t:'LIX', re:'LIX',
    app:['Der schwedische Lesbarkeitsindex (läsbarhetsindex) von Carl-Hugo Björnsson aus dem Jahr 1968: durchschnittliche Satzlänge plus Anteil langer Wörter (mehr als sechs Buchstaben) in Prozent. Unter 30 gilt ein Text als sehr leicht, um 40 als mittel, über 50 als schwer. Für Spanisch ist er nur ein grober Vergleichswert.', '10 Wörter pro Satz und 20 % lange Wörter ergeben LIX 30'] }
];
const TERM_RE = new RegExp('(?<![A-Za-zÄÖÜäöüß-])(' + TERMS.map(t => t.re).sort((a, b) => b.length - a.length).join('|') + ')(?![A-Za-zÄÖÜäöüß])', 'g');
const termFor = m => TERMS.find(t => new RegExp('^(?:' + t.re + ')$').test(m));
// Fassung für eine Sprache; gilt der Begriff dort nicht, die andere (kommt in den Erklärungen nicht vor, siehe Test)
const termText = (t, lang) => t.app || t[lang] || t.sv || t.es;
// Begriffe, die zu einer Sprache gehören (ohne App-Begriffe), für die Liste
const termsFor = lang => TERMS.filter(t => t[lang]);
// Text sicher ausgeben und Fachbegriffe antippbar machen
function termify(text){
  return esc(String(text)).replace(TERM_RE, m => { const t = termFor(m); return t ? `<button type="button" class="term" data-a="term" data-k="${t.k}">${m}</button>` : m; });
}
function termSheetHtml(P){
  const t = TERMS.find(x => x.k === P.k); if (!t) return '';
  const d = termText(t, P.lang), topic = !t.app && t[P.lang] ? t[P.lang][2] : '', tr = topic ? trapMeta(P.lang, topic) : null;
  return `<div class="popov" data-a="popclose"></div><div class="pop" role="dialog" aria-label="${esc(t.t)}">
    <p class="find-k">${t.app ? 'Begriff' : 'Grammatik-Begriff'}</p><p class="pop-h">${esc(t.t)}</p>
    <p class="pop-t">${esc(d[0])}</p>
    <p class="pop-sub">${t.app ? 'So zählt Tagwerk' : 'Beispiel'}</p><p class="termex">${esc(d[1])}</p>
    <div class="popfoot">${tr ? `<button type="button" class="link" data-a="topic" data-t="${tr.id}" aria-label="Zum Thema ${esc(tr.label)}">Zum Thema</button>` : '<button type="button" class="link" data-a="ref" data-r="terms">Alle Begriffe</button>'}<button type="button" class="ghost" data-a="popclose">Schließen</button></div>
  </div>`;
}
