# Änderungsverlauf

Versionen entsprechen der Cache-Version des Service Workers. Ab 24.0.0 setzt der Build sie automatisch.

## 24.41.0
**Neue Themen: Pluralklassen (Schwedisch) und Verbalperiphrasen (Spanisch).**
- **Pluralklassen (Schwedisch):** Neuer Generator im Grammatik-Training und im Tagwerk.
  - 52 Wörter aus allen Klassen: -or (flickor), -ar (bilar, nycklar, somrar), -er (datorer, museer), -r (skor), -n (äpplen, ögon), ohne Endung (hus, lärare, fönster) und mit Umlaut (böcker, män, möss, döttrar).
  - Gefragt ist die Mehrzahl, unbestimmt („två ___“, „zwei Bücher“) oder bestimmt („de här ___“, „diese Bücher hier“). Zeitwörter wie dag, natt oder sommar kommen nur unbestimmt vor, damit kein schiefer Satz entsteht.
  - Die Erklärung nennt beide Formen und die Regel der Klasse, etwa „lärare → lärare, bestimmt lärarna. Personen auf -are bleiben gleich; bestimmt -arna, das e fällt weg.“
- **Verbalperiphrasen (Spanisch):** neues Thema mit Generator (42 Aufgaben) und 24 Sätzen (12 auf B1, 12 auf B2).
  - Formen: llevar + Gerundium, acabar de, volver a, soler, ponerse a und echarse a, dejar de, estar a punto de, seguir + Gerundium, ir und venir + Gerundium, acabar + Gerundium, deber de.
  - Wo ein anderes Hilfsverb auch passt, zählt es (empezó a llover, continúa lloviendo, no para de llover).
  - Bei den Sätzen zählen auch Fassungen ohne Periphrase, wenn sie dasselbe sagen: hace tres años que estudio, todavía vive con sus padres, otra vez.
  - Der Nachschub von Tatoeba sucht für das Thema eigene Muster.
- **Wörterbuch:** 64 neue Einträge; die Formen der Pluralwörter kommen von selbst dazu.
- 4 neue Einheitstests (234).

## 24.40.0
**132 neue Sätze Spanisch auf B2/C1.**
- **Neue Sätze:** 12 je Thema, alle mit Erklärung am Satz und weiteren richtigen Fassungen, alle als B2 markiert. Spanisch hat jetzt 364 Sätze, davon 172 auf B2 (vorher 40). Bei „Fortgeschritten“ und 6 neuen Sätzen am Tag reicht das etwa vier Wochen.
- **Beispiele je Thema:**
  - ser/estar: Ereignis und Zustand im selben Satz (la conferencia es en el ayuntamiento, que está en obras), Passiv mit ser, maduro und verde mit beiden Bedeutungen.
  - Indefinido und Imperfecto: supe (erfuhr) und sabía, begrenzte Dauer (vivimos diez años).
  - Perfecto: desde que vivo aquí, este verano, en toda mi vida; dazu Sätze, in denen auch in Spanien das Indefinido steht (hace dos años).
  - Subjuntivo nach en cuanto, sin que, hasta que, dudar que und im Perfekt (hayáis tenido); dazu Gegenbeispiele mit Indikativ (aunque llueve, si te apetece, sé que).
  - por/para: para ser principiante, por si llueve, pasar por, trabajar para.
  - Objektpronomen bei Imperativ, Infinitiv und acabar de.
  - gustar & Co.: costar, quedar bien, dar igual, alcanzar, se me acaban.
  - Konditional Perfekt und gemischte si-Sätze, Vermutung über die Vergangenheit (habría unas cien personas).
  - Reflexivverben wie darse prisa, hacerse pasar por, ponerse de acuerdo.
  - Präpositionen wie constar de, contar con, cuidar de.
  - Falsche Freunde wie Karton, Milliarde, Chef, eventuell, Salat, Schal, Akte, Vase, Kollege, Notiz, Mappe, Regal.
- **Lateinamerika:** Wo dort etwas anderes üblich ist, zählt es mit, etwa Indefinido statt Perfecto, carro, mesero, apurarse, tomar statt coger.
- **Wörterbuch:** 180 neue Einträge, damit jedes Wort der neuen Sätze nachschlagbar ist.
- **Fehler finden:** Relativsätze mit „alguien que“ und „lo que“ kommen dort nicht mehr vor. „Busco a alguien que me ayuda“ und „Elige lo que más te gusta“ sind je nach Lesart auch richtig, also kein eindeutiger Fehler.
- 1 neuer Einheitstest (230).

## 24.39.0
**108 neue Sätze Schwedisch auf B2/C1, Firefox-Tests verbindlich, Anki-Anbindung entfernt.**
- **Neue Sätze:** 12 je Thema, alle mit Erklärung am Satz und weiteren richtigen Fassungen; 106 als B2 markiert, 2 als B1. Schwedisch hat jetzt 317 Sätze, davon 138 auf B2 (vorher 32). Bei „Fortgeschritten“ und 6 neuen Sätzen am Tag reicht das gut drei Wochen.
- **Beispiele je Thema:**
  - Wortstellung im Nebensatz: „inte ens“, „inte längre“, „som om“.
  - Inversion nach „knappt“, „först efter“, „ju … desto“.
  - Präteritum und Perfekt im selben Satz.
  - Partikelverben wie „stå ut med“, „ställa in“, „gå ut på“, „se till att“, „säga upp sig“.
  - sin, dess und deras im Infinitivsatz.
  - Zeitangaben mit „inom“, „under kvällens gång“, „före jul“.
  - Modalverben wie „lär“, „borde ha“, „höll på att“.
  - s-Passiv im Perfekt und bei Partikelverben.
  - Falsche Freunde wie eventuell, Bad, rar, Rat, Kissen, Öl, Ende, Hochzeit, Ansicht, arm, Büro.
- **Wörterbuch:** 180 neue Einträge, damit jedes Wort der neuen Sätze nachschlagbar ist.
- **Firefox:** Der Firefox-Job in GitHub Actions ist jetzt verbindlich wie Chromium; nach zwei grünen Läufen gab es keinen Grund mehr, ihn nur zur Information laufen zu lassen.
- **Anki-Anbindung entfernt:** „An Anki“ im Wörterbuch-Fenster und „Sätze aus Anki übernehmen“ in den Einstellungen. Beides wurde nicht genutzt. Früher übernommene Sätze bleiben, wie sie sind.
- Einheitstests 229 (3 zu Anki entfallen), Browser-Tests 79 (2 zu Anki entfallen).

## 24.38.0
**Satzbank durchgesehen: Erklärung zu jedem Satz, mehr richtige Fassungen.**
Alle 441 Sätze nach Regeln je Thema geprüft, ohne Nutzerdaten.
- **Erklärung zu jedem Satz:** 226 Sätze hatten keine eigene und zeigten bei einem Fehler nur die allgemeine Regel des Themas. Jetzt hat jeder Satz eine, und sie nennt die Regel am Satz selbst („Im att-Satz steht „inte“ vor dem Verb: att han inte kommer.“, „gustar richtet sich nach los libros (Mehrzahl), also gustan.“). Ein Test hält das für neue Sätze fest.
- **Fehler behoben:** Bei einem Satz zur Wortstellung erschien „Ohne Zeitpunkt, als Erfahrung oder bis heute andauernd: Perfekt mit „har …““, sobald in der Antwort kein „har“ stand, auch wenn es um etwas ganz anderes ging. Die eigene Erklärung des Satzes geht jetzt vor.
- **128 weitere richtige Fassungen,** zum Beispiel:
  - Schwedisch: „förrän“ nach Verneinung, „gå en promenad“, „Det är filmen jag aldrig har sett“, „Vi träffade varandra 2019“, „Jag minns inte hans namn“, „akta dig“.
  - Spanisch: Indefinido, wo es in Lateinamerika üblich ist („Nunca estuve en México“), „Ojalá que …“, „Antes de irte, apaga la luz“, „Puede que venga“, „Hace tres años que vivo aquí“, carro und auto.
  - Füllungen, die bisher nur in der Lückenaufgabe galten, gelten jetzt auch beim freien Übersetzen (etwa „Hon är på arbetet“, „Mi compañía está en Madrid“).
- **Zwei Regeln für alle Sätze** statt einzelner Alternativen:
  - Schwedisch: „har“/„hade“ darf im Nebensatz vor dem Supinum fehlen („… att han aldrig fått mejlet“). Nicht im Hauptsatz und nicht im Hördiktat.
  - Spanisch: Ein betontes Subjektpronomen mitten im Satz ist richtig, wenn der deutsche Satz dieselbe Person nennt („Creo que él tiene razón“ zu „… dass er recht hat“). Mit „ella“ bleibt es falsch.
  - Dazu „mail“ gleich „mejl“.
- **Doppelte deutsche Sätze aufgelöst:** „Plötzlich ging das Licht aus.“ stand zweimal; der zweite heißt jetzt „Plötzlich war der Strom weg.“ (se fue la luz). „An deiner Stelle würde ich das nicht machen.“ ebenso; der zweite heißt jetzt „Wenn ich du wäre, …“ (yo que tú). Die Lernstände bleiben, weil die Zielsätze gleich sind.
- 3 neue Einheitstests (232).

## 24.37.0
**Erzeugte Aufgaben durchgesehen, Browser-Tests auch in Firefox.**
Alle Ausgaben aller 21 Generatoren aufgelistet und von Hand geprüft.
- **Fehler behoben:** „Estoy de acuerdo con ti“ war falsch (richtig: contigo). Der Satz heißt jetzt „Estoy de acuerdo con tu propuesta“.
- **Weitere richtige Fassungen:**
  - Uhrzeiten: „klockan är kvart över tre“ und „klockan kvart över tre“, „las tres en punto“ und die Digitalform („las doce y cuarenta“, „las tres y quince“), wie in Lateinamerika und bei Ansagen üblich.
  - Umbauen Spanisch: das betonte Subjektpronomen („Quiero que tú vengas“, „Ayer nosotros dormimos bien“) und „Ojalá que …“.
  - Wortstellung: „har semester i juli“ neben „tar semester“ und „åker på semester“.
- **Genau eine richtige Option:** Sechs Auswahlaufgaben hatten eine zweite vertretbare Antwort unter den falschen. Ersetzt wurden:
  - „fiarse en“ (selten, aber korrekt)
  - „kostar tid“
  - „me da ilusión“
  - „quedamos en las ocho“
  - „tvätta tänderna“, dafür jetzt „städa“ als typische Falle für „putzen“
  - „fick examen“
- **Keine Wörter mit zwei richtigen Genera bei „el oder la?“:** radio (Spanien la, Lateinamerika el) und mar (la mar bei Seeleuten und Dichtern). Die Schreibprüfung markiert sie auch nicht mehr; im Wörterbuch stehen beide mit Hinweis.
- **ser/estar:** „nervioso“ und „triste“ kommen nur noch mit „hoy“, weil ohne Zeitangabe auch ser richtig wäre (ein nervöser Mensch). Die Erklärung sagt das. Bei „rico“ ist die Erklärung genauer: ser rico heißt bei Personen reich, bei Essen allgemein lecker.
- **Adjektive, die passen:** „Begleiter & Adjektive“ (Spanisch) kombiniert nur noch sinnvolle Paare (la playa bonita, el día perfecto), nicht mehr „la sangre bonita“ oder „el miedo viejo“. Ohne passendes Adjektiv gibt es zu einem Wort nur Begleiter-Aufgaben. Auf Schwedisch kein „mitt väder“ mehr.
- **Erklärungen auf den Satz zugeschnitten:**
  - Fehler finden Spanisch nennt den Auslöser im Satz („Nach querer que … steht der Subjuntivo: vengas, nicht vienes.“, „Mit „la semana pasada“ (abgeschlossen) steht Indefinido: perdí, nicht he perdido.“) und nimmt die Erklärung des Satzes, wo es eine gibt.
  - Wortstellung und Umbauen Schwedisch zeigen die richtige Stellung am Satz.
- **Deutsch geglättet:**
  - „Wir brauchten eine Stunde, bis wir ankamen.“
  - „Nach dem, was du sagst, wird das Wetter morgen schön.“
  - „Ich habe nicht gemerkt, wie spät es war.“
  - „Du darfst dir das Auto leihen, vorausgesetzt, du fährst vorsichtig.“
  - „Sie war über die Nachricht überrascht.“
  - Beim Umbauen „Llamas a los abuelos“ statt „Llamas a su madre“.
- **Firefox:** Die Browser-Tests laufen auch in Firefox (`PW_FIREFOX=1 npx playwright test --project=firefox`). In GitHub Actions ist das ein eigener Job zur Information: Fehler dort stehen im Bericht, halten das Update aber nicht auf. Nachsprechen mit vorgetäuschtem Mikrofon bleibt Chromium vorbehalten.
- 7 neue Einheitstests (229).

## 24.36.2
**Kopf von „Heute“: zwei Zeilen, gemeinsame Grundlinien.**
- Oben Gruß und Woche: Die sieben Quadrate stehen auf der Grundlinie des Grußes, etwa in Höhe seiner Kleinbuchstaben. Unten Datum und Serie („3 in Folge“) auf derselben Grundlinie und in derselben Schrift (14 px; die Serie war 12 px). Vorher hatte die rechte Seite drei Zeilen, deren Grundlinien zwischen denen links lagen; „3 in Folge“ stand knapp 6 px tiefer als das Datum.
- Die Wochentagsbuchstaben unter den Quadraten entfallen. „M D F S S M D“ war mehrdeutig (Mo/Mi, Di/Do, Sa/So) und machte die dritte Zeile; die Reihe endet immer mit heute, und heute ist umrandet. Ein Tipp auf die Quadrate oder die Serie führt wie bisher zum Kalender.
- Rechte Kante: Die Umrandung von heute, der Text der Serie und das Zahnrad enden auf derselben Linie, 4 px innerhalb der Karten, wie links Gruß und Datum. Auf „Üben“ und „Fortschritt“ sitzt das Zahnrad ebenso; der Titel „Fortschritt“ steht auf der Linie der Abschnittsüberschriften (vorher 4 px weiter links).
- Ein Layout-Test hält Grundlinien und Kanten fest.

## 24.36.1
**Lernminuten ruhiger und einheitlich mit dem Kalender.**
- **Tageskarte neu aufgebaut:** Titel („Heute“, „Gestern“ oder das Datum), darunter eine Zeile mit Datum und Uhrzeit, dann eine kleine Tabelle je Sprache mit festen Spalten: Min., Aufgaben, richtig (auf Anhieb), neu. Vorher standen bis zu fünf Angaben als Fließtext je Sprache, mit farbigen Schildchen und unterstrichenen Links. Ob das Tagwerk erledigt ist, zeigt das Quadrat vor der Sprache wie im Kalender: gefüllt = Tagwerk, Rand = nur geübt. Wiederholungen und gefestigte Sätze stehen nicht mehr in der Karte (sie stehen auf der Seite der Sprache). Die Gesamtminuten stehen über der gewählten Säule, nicht noch einmal in der Karte.
- **Fehlerthemen in einer Zeile** für beide Sprachen, die zwei häufigsten, gepunktet unterstrichen wie die Grammatik-Begriffe; antippen öffnet das Themenblatt in der Sprache des Themas.
- **Wie im Kalender:** Nichts ist vorgewählt, darunter steht „Tipp auf einen Tag für Details.“ Ein Tipp öffnet die Karte, ein zweiter auf dieselbe Säule schließt sie. Im Kalender und bei den Lernminuten steht die Karte jetzt an derselben Stelle: unter dem Diagramm und seiner Legende.
- **Kein Umschalter mehr für Wochen.** Er erschien erst ab drei Wochen Übung, versteckte Inhalt hinter einem Tipp und doppelte den langen Blick, den „Verlauf“ und „Jahr für Jahr“ schon geben. Die Lernminuten zeigen wieder die letzten 14 Tage.
- **Kürzer:** Legende in einer Zeile („Durchschnitt“), Vergleich nur noch „Die 14 Tage davor: 196 Minuten.“

## 24.36.0
**Lernminuten neu gestaltet.**
- **Tag antippen:** Jede Säule ist antippbar. Darunter steht, was an dem Tag lief, je Sprache: Minuten, ob das Tagwerk erledigt ist, Aufgaben, Anteil auf Anhieb richtig, neue Sätze, gewusste Wiederholungen, gefestigte Sätze, die Themen mit Fehlern (antippbar, öffnet das Themenblatt in der richtigen Sprache) und zu welcher Uhrzeit geübt wurde. Vorgewählt ist heute oder, wenn heute noch nichts war, der letzte Übungstag. Pausetage und nicht geübte Tage sagen das.
- **Wochen:** Ab drei Wochen Übung schaltet „14 Tage | 12 Wochen“ auf Wochensäulen (seit Beginn, höchstens 12). Eine Woche antippen zeigt dasselbe für die Woche, dazu die Zahl der Tagwerke je Sprache und an wie vielen Tagen geübt wurde.
- **Kennzahlen über dem Diagramm:** Minuten im Zeitraum, Übungstage (11 von 14), Minuten pro Übungstag bzw. pro Woche und beste Woche. Darunter der Vergleich mit den 14 Tagen davor, sobald es die gab („Die 14 Tage davor: 196 Minuten, jetzt 11 weniger.“).
- **Diagramm:** gestrichelte Linie für den Durchschnitt, feine Trenner vor jedem Montag, Pausetage gestrichelt wie im Kalender, höhere Säulen, gewählter Tag hinterlegt. Bildschirmleser lesen je Säule Datum und Minuten.
- **Kalender:** Ein Tipp auf einen Tag zeigt jetzt dieselbe Karte statt einer Textzeile, für jeden Tag seit Beginn (Treffer, Themen und Uhrzeit, soweit die Fehlerquellen noch gespeichert sind, also 120 Tage).
- **Fehler behoben:** „10 Aufgaben üben“ im Themenblatt einer anderen Sprache als der gerade gewählten startete die Übung in der falschen Sprache.
- Keine neuen gespeicherten Daten; alles kommt aus dem Tagesprotokoll und den Fehlerquellen, die es schon gibt.

## 24.35.0
- **Erklärungen passen zum Satz, in allen Themen.** Alle 20 Themen in beiden Sprachen geprüft: Die allgemeine Regel des Themas passte bei rund der Hälfte der Sätze nicht oder nur ungefähr. Beispiele: Im Thema ser/estar hieß es „estar für Ort“ auch bei „La fiesta es en casa de Ana“ (Ort eines Ereignisses: ser) und bei der Uhrzeit. Bei „¡No se lo digas!“ stand „an den Imperativ hängen“, beim verneinten Imperativ stehen die Pronomen aber davor. Bei Plusquamperfekt-Sätzen (hade gått, se había ido) war nur von Präteritum und Perfekt bzw. Indefinido und Imperfecto die Rede, bei „Lisa och hennes man“ hätte die Regel sogar „sin“ nahegelegt. 193 Sätze haben jetzt eine eigene Erklärung (mit den 22 aus 24.34.3 sind es 215 von 441). Bei den Falschen Freunden steht jeweils, was das ähnliche Wort wirklich heißt (mantel = Tischdecke, termin = Semester). Alle Lösungen wurden dabei mitgeprüft.
- **Zwei Themenregeln korrigiert:** Wortstellung im Nebensatz nennt jetzt inte, aldrig, alltid und ähnliche Wörter (vorher nur „inte“). Objektpronomen: angehängt an Infinitiv, Gerundium und **bejahten** Imperativ.
- **Neue richtige Fassung:** „… när tågen är försenade hela tiden“ gilt neben „när tågen hela tiden är försenade“.
- **Fehler behoben, Backup mit offenem Tagwerk:** Nach dem Einspielen blieb ein offenes Tagwerk aus dem Stand vorher im Arbeitsspeicher. „Fortsetzen“ öffnete dann das alte Tagwerk, und das nächste Speichern schrieb es über das eingespielte. Auf einem neuen Gerät begann statt des eingespielten Tagwerks ein neues. Jetzt kommt das offene Tagwerk nach dem Einspielen und nach „Rückgängig“ aus dem neuen Stand, mit den Farben der Fortschrittsleiste. Ein Tagwerk von einem anderen Tag wird wie beim Start nicht fortgesetzt.
- **Tests:** Backup mit offenem Tagwerk (Rundlauf, Backup ohne Tagwerk, Tagwerk von gestern, alte Form ohne Ergebnis je Aufgabe), im Browser: Export mit offenem Tagwerk, auf leerem Gerät einspielen, mit denselben Farben fortsetzen.

## 24.34.3
- **Erklärung passt zum Satz (Konditional & si-Sätze).** Bei falscher Antwort kam für jeden Satz des Themas dieselbe Regel „Irreal: si + tuviera, dann Konditional (viajaría)“, auch bei höflichen Bitten („¿Me pasarías la sal?“), Ratschlägen („Yo que tú, no lo haría“), der Vermutung „Serían las diez“ und sogar beim realen si-Satz „Si llueve mañana …“, wo die Lösung Präsens ist. Jetzt hat jeder der 22 Sätze seine eigene Erklärung, bei unregelmäßigen Formen mit dem Stamm (har-, dir-, saldr-, podr-). „pases“ bei „¿Me ___ la sal?“ bleibt falsch (Subjuntivo, kein korrektes Spanisch).
- **Satzbank: neue, optionale siebte Spalte „Erklärung“** (docs/CONTENT.md). Sie steht bei falscher Antwort statt der allgemeinen Themenregel; eine Erklärung zur erkannten Verwechslung geht weiter vor.

## 24.34.2
- **Fehler behoben:** „Me quejé ___ el ruido.“ mit der Lösung „de“ ergab „Me quejé de el ruido“, richtig ist „del“. Jetzt „Me quejé ___ ruido.“ mit der Lösung „del“ (Auswahl del, al, en). Ein Test prüft alle spanischen Lückensätze auf „a el“ und „de el“.
- **„dar a“ idiomatisch auf Deutsch:** „Mein Haus geht auf den Platz hinaus“ war schief; „hinausgehen auf“ sagt man von Fenstern und Zimmern. Jetzt „Mi ventana da ___ la plaza.“ – „Mein Fenster geht auf den Platz hinaus.“

## 24.34.1
Strenger nach Richtigkeit: Was falsch ist, bleibt falsch; was richtig ist, zählt als richtig.
- **Stellungs-Übung: kein „Fast richtig“ mehr, nur weil das Adverb richtig steht.** „Fast richtig“ zählt als richtig, und 24.34.0 gab es auch bei echten Fehlern neben der richtigen Stellung, etwa „samla“ (Infinitiv) statt „plockar“ oder „jag är på semester“ statt „jag tar semester“. Jetzt ist das wieder „Falsch“. Es bleibt bei der passenden Erklärung („Die Stellung von „alltid“ stimmt. Der Unterschied liegt woanders.“) statt der Regel, die man richtig angewandt hat. Das Grammatikthema in der Fehlerstatistik belastet so ein Fehler nicht, wie schon bei Wortschatz- und Tippfehlern.
- **„i gymmet“ ist richtig.** „Vi tränar alltid i gymmet“ ist korrektes Schwedisch (so schreiben es etwa die Stadt Malmö und Friskis&Svettis) und gilt jetzt neben „på gymmet“ als Lösung. 24.34.0 hatte es fälschlich als Fehlerbeispiel genannt.
- **„åker på semester“ ist richtig.** „Ich mache immer im Juli Urlaub“ geht auch als „Jag åker alltid på semester i juli“. „har semester“ (Urlaub haben) und „är på semester“ (im Urlaub sein) bleiben falsch, wie in der Satzbank („Ich habe nächste Woche Urlaub“ – „Jag har semester nästa vecka“).
- **Inversion: Subjekt vorn ist auch richtig.** „Heute Abend sehe ich ihn nicht“ – „Jag träffar honom inte ikväll“ ist richtiges Schwedisch, galt beim freien Übersetzen und bei Wortkästchen aber als falsch. 19 Sätze im Thema Inversion haben jetzt die Fassung mit dem Subjekt vorn als Alternative (einige hatten sie schon). Das große erste Wortkästchen aus 24.34.0 bleibt als Hinweis, worum es geht. Ausgenommen ist „Först när det blev mörkt märkte vi …“: Dort ist „först när“ vorn die Konstruktion, umgestellt klingt es nicht natürlich.
- **Unverändert, bewusst:** In Grammatik-Übungen bleibt ein anderes Inhaltswort bei richtiger Form und Stellung „Fast richtig“ mit dem Hinweis, welches Wort anders ist (etwa „samlar“ statt „plockar“; üblich ist „plocka svamp“).
- **Tests:** Stellung richtig, anderer Fehler bleibt falsch; Statistik; „i gymmet“ und „åker på semester“ als Lösungen; Inversion mit Subjekt vorn.

## 24.34.0
- **Fortschrittsleiste zeigt, wie es läuft.** Jedes Feld trägt das Ergebnis seiner Aufgabe in den Farben der Auswertung am Ende: grün richtig, gelb fast richtig, rot falsch. Das Feld färbt sich schon beim Prüfen, zusammen mit dem Schild „Richtig“ oder „Falsch“, nicht erst bei „Weiter“. Bisher war alles Erledigte einheitlich blau. Die Farben bleiben über Pause und Fortsetzen erhalten (das Ergebnis steht jetzt an der Aufgabe im gespeicherten Tagwerk; ein Tagwerk aus der Vorversion übernimmt es aus dem Rundenergebnis).
- **Zweite Versuche als eigene Gruppe.** Eine falsch beantwortete Satzaufgabe kommt am Ende noch einmal; bisher wuchs dann nur die Zahl (25 → 26), ohne sichtbaren Grund. Jetzt hängt sich ein eigenes Feld mit etwas Abstand an, rötlich getönt, solange es offen ist. Bei langen Runden (Länge „Lang“, über 40 Aufgaben) rücken die Felder enger zusammen. Für Bildschirmleser beschreibt die Leiste den Stand in Worten („Aufgabe 9 von 25: 6 richtig, 2 falsch, 1 zweiter Versuch folgt“).
- **Stellung von „inte“, „alltid“ & Co.: Erklärung passt zum Fehler.** Stand das Adverb richtig und der Fehler lag woanders (etwa „i gymmet“ statt „på gymmet“), hieß es „Falsch“ mit der Regel zur Stellung, die man gerade richtig angewandt hatte. Jetzt: „Fast richtig. Die Stellung von „alltid“ stimmt. Der Unterschied liegt woanders.“, die Abweichung ist in der Lösung markiert. Steht das Adverb falsch, bleibt es „Falsch“ mit der Regel.
- **„Die Grammatik passt“ nur, wenn sie passt.** „samla“ statt „plockar“ galt als anderes Wort bei richtiger Grammatik; es ist aber die Grundform statt des Präsens. Grundform gegen gebeugte Form zählt jetzt als Formfehler, auch bei verschiedenen Wörtern. Und ein anderes Wort an der falschen Stelle („att vi samlar alltid“) ist ein Stellungsfehler, kein reiner Wortschatzfehler.
- **Inversion mit Wortkästchen eindeutig.** Das erste Wort bleibt groß („Ikväll“). Vorher war es klein geschrieben, und „jag träffar honom inte ikväll“ ist ebenfalls richtiges Schwedisch, galt aber als falsch. Geübt werden soll die Umstellung nach dem Satzanfang.
- **Satz korrigiert:** „Ich mache immer Urlaub.“ war ohne Zusatz schief (und lud zu „jag är alltid på semester“ ein). Jetzt „Ich mache immer im Juli Urlaub.“ – „Jag tar alltid semester i juli.“, vorn mit „Inzwischen“ – „Numera“.
- **Tests:** Leiste (Farben, aktuelles Feld, zweite Versuche, Dichte, ältere Runde), Prüfung der Stellungs-Übung in allen drei Satzarten, Fehlerart Grund- gegen gebeugte Form, Wortkästchen bei Inversion; im Browser: Feld färbt sich beim Prüfen, zweiter Versuch hängt sich an, Farben bleiben nach Pause.

## 24.33.0
- **Zurück-Geste geht innerhalb der App zurück.** Bisher kannte die App den Browserverlauf nicht: Die Zurück-Geste verließ sie sofort, in Firefox auf eine leere, schwarze Seite. Jetzt schließt sie ein offenes Fenster (Nachschlagen, Thema), führt aus Unterseiten zurück (etwa Text → Textliste → Üben → Heute), pausiert ein laufendes Tagwerk, beendet eine Runde wie „Beenden“ und bricht eine laufende Aufnahme ab. Erst auf „Heute“ verlässt sie die App wie gewohnt.
- **Backup aus alten Versionen vollständig übernommen:** Beim Einspielen wird die alte Einstellung „neue Sätze pro Tag“ jetzt in die Länge (Kurz, Normal, Lang) umgerechnet, wie es beim Start schon geschah; vorher kam ein altes „Kurz“ als „Normal“ zurück. Start und Einspielen nutzen dafür dieselbe Regel.
- **Mehr Backup-Tests:** Der ganze Stand kommt zurück, auch was später dazukam (Tagwerk je Sprache, Entwürfe, Schreibarchiv, eigene und Tatoeba-Sätze mit Aufnahme, Einstellungen). Ein Backup in alter Form (Wiederholung nach Stufen, ohne neuere Teile) wird übernommen, umgerechnet, und die App läuft damit.

## 24.32.0
UI-Feinschliff.
- **Fehler behoben:** Am Ende eines Lesetexts waren die Sätze mit den Antworten (grün unterstrichen) viel kleiner als der übrige Text. Ursache: Die Zahl in den Fehlerquellen und die Belegsätze teilten sich einen Klassennamen.
- **Einheitliche Rundungen:** Flächen 18 px (Diagramme, Fundstück, Einführung, Sprachkarte, Schreibprofil hatten 16), Bedienelemente 14 px (Eingabefelder, Wortkästchen, Auswahl bei Genus, Knöpfe in Hinweisen). Wortchips waren doppelt und widersprüchlich definiert, jetzt einmal.
- **Rückmeldung ohne farbigen Seitenstreifen:** Das Schild „Richtig“, „Fast“, „Falsch“ trägt die Farbe; der Kasten bleibt ruhig.
- **Antippen spürbar:** Listenzeilen hellen kurz auf, kleine Knöpfe (Abspielen, Chips, Schritte) geben nach. Bewegung nur als Antwort aufs Tippen, bei reduzierter Bewegung aus.
- **Tagwerk-Karte:** „12 Aufgaben“ groß, „etwa 5 Min.“ klein daneben (brach vorher um). Schwerpunkt der Woche und Länge je eine kurze Zeile.
- **Kürzer, ohne Offensichtliches:** „Tippen zum Üben“ und „Tippen für die Regel“ entfallen (die Pfeile zeigen es); kürzere Beschreibungen bei „Weiter üben“, „Weitere neue Sätze lernen“, Grammatik-Training, Thema üben, Lesetexten, Fehlerquellen, Wiederholungen, „Wann du übst“ (ohne Ratschlag), Einstellungen (Sprache beim Start, Anki), Land & Leute.
- **Einheitlich „Ins Tagwerk“:** auch in Land & Leute und auf „Heute“ statt „Satz zum Üben übernehmen“; übernommen heißt „Im Tagwerk“.
- **„(online)“ nur noch, wenn es zählt:** Wikipedia-Fundstück und Beispielsätze suchen zeigen „Braucht eine Internetverbindung“, solange keine besteht, und sonst ihre Beschreibung. Wechselt die Verbindung, aktualisiert sich das Menü.
- **Lesetexte:** kein „Neu“ an jedem ungelesenen Text mehr, nur der Stand bei gelesenen.
- **Pop-ups:** Beim Nachschlagen „Bei dict.cc“ und „An Anki“ in einer Zeile (brachen um). Im Themenblatt ist „10 Aufgaben üben“ der Hauptknopf rechts, „Schließen“ links.
- **Kleinigkeiten:** Fortschrittsbalken der Sprachseite nicht mehr direkt an der Überschrift; Lernminuten-Farbschlüssel nur bei zwei Sprachen und als eigene Zeile; Sprachkachel „90 Sätze geübt, zuletzt gestern“ statt doppeltem „geübt“; „Langsam“ beim Diktat mit demselben Symbol wie überall; Abstand über „Kopieren, um ihn Muttersprachlern zu zeigen“; „Lückentext üben“ und „Nächster Text“ in einer Reihe.
- **Sichtprüfung** (`npm run sicht`) zeigt jetzt auch ersten Start, Schreiben, Hörrunde, Diktat, Grammatik, Land & Leute, Nachschlagen und Themenblatt.

## 24.31.0
- **„Heute“: die andere Sprache erst nach dem Tagwerk, als Angebot.** Die Zeile „Spanisch · 9 fällig · heute geübt · Tagwerk starten“ unter dem Tagwerk ist weg. Vor dem Tagwerk brachte sie wenig: Die App wählt die Sprache des Tages ohnehin nach Bedarf (fällige Wiederholungen, Tage seit dem letzten Üben), wechseln geht oben über „Español | Svenska“, und ein zweites „Tagwerk starten“ machte dem Hauptknopf Konkurrenz. „9 fällig · heute geübt“ las sich zudem widersprüchlich. Nach dem Tagwerk steht die andere Sprache jetzt als erste Wahl unter „Wenn du noch Zeit hast“, mit Dauer und Inhalt, etwa „Spanisch-Tagwerk zusätzlich: Etwa 12 Minuten: 9 Wiederholungen, 6 neue Sätze, 4 Grammatik-Aufgaben“. Ist sie heute schon erledigt, entfällt das Angebot.

## 24.30.0
- **„Pausetag“ statt „freier Tag“.** Gemeint ist ein ausgelassener Tag, der die Serie nicht unterbricht (einer pro Woche); „frei“ ließ sich als „leer“ lesen. Legende: „Pausetag, Serie hält“. Ebenso in der Serienerklärung („ein Pausetag pro Woche hält die Serie“), im Tagesdetail im Kalender und im Hinweis der Wochenleiste.
- **Legende der Übungstage aufgeräumt:** „nur etwas geübt“ ohne den Zusatz „(Rand in Sprachfarbe)“, den das Symbol schon zeigt. Die Einträge stehen in zwei gleichen Spalten statt unregelmäßig umzubrechen; bricht ein Eintrag auf schmalen Geräten doch um, steht das Symbol neben der ersten Zeile.
- **Serienkachel aufgeräumt:** Die Aufteilung der Tagwerke nach Sprache steht nicht mehr unter der Zahl „Tagwerke“, sondern in einer eigenen Zeile darunter („Tagwerke: ■ Schwedisch 22 ■ Spanisch 12“). Die vier Zahlen stehen dadurch wieder auf einer Höhe, und der große Abstand vor „seit …“ ist weg.

## 24.29.0
- **Kalender: „an beiden Sprachen nur etwas geübt“ hat jetzt einen geteilten Rand** in beiden Sprachfarben (oben links Schwedisch, unten rechts Spanisch, wie die gefüllte Kachel „beide Sprachen“). Vorher war der Rand grau, obwohl die Legende „Rand in Sprachfarbe“ sagt. Gilt auch für die Legende und die Wochenleiste auf „Heute“.
- **Schreiben: Wörter zum Einbauen leichter unterzubringen.** Fünf statt drei Vorschläge, in der Grundform („ayudar“ statt „ayudarme“; gebeugt zählt weiter), dazu „Andere Wörter“ für neue Vorschläge (dein Text bleibt stehen). Eigennamen wie Anna, Uppsala, Madrid werden nicht mehr vorgeschlagen; vorher erschienen sie sogar kleingeschrieben.

## 24.28.0
- **Fehler behoben: Bonus „Eigener Satz“ blieb auf „Wird geprüft“ hängen.** Tippte man weiter, während LanguageTool noch prüfte, wurde die Antwort verworfen, „Prüfen“ blieb gesperrt und die Zeile „Wird geprüft“ stand für immer da (auf GitHub fiel deshalb der Browsertest durch). Jetzt zählt nur die neueste Prüfung, „Prüfen“ ist nie gesperrt, eine veraltete Antwort entfernt nur die Zeile, ohne die Seite neu zu zeichnen (die Tastatur bleibt offen), und Markierungen beziehen sich immer auf den geprüften Text. Der Test spielt den Fall jetzt mit verzögerter Antwort fest nach.
- **Nachsprechen: Der Satz spielt von selbst**, sobald er erscheint (nach „Nachsprechen“, „Nächster Satz“ oder „Überspringen“, also immer als Folge eines Antippens). Der Haken bei „Hören“ kommt erst, wenn der Satz zu Ende gehört ist, bei „Mitsprechen“ nach dem ersten ganzen Durchgang. Der Hauptknopf zeigt währenddessen schon den nächsten Schritt.
- **„Versuch N“ zählt je Satz.** Vorher zählte es über die ganze Runde. Die Übersicht am Ende nennt weiter alle Versuche zusammen.

## 24.27.0
- **Nachsprechen: Mitsprechen in Schleife.** Ein Antippen auf „Mitsprechen“ spielt das Original wieder und wieder (gut eine Sekunde Pause dazwischen, höchstens zehnmal), bis du es noch einmal antippst. Die Zeile darunter zählt die Durchgänge mit. Den Knopf gibt es jetzt auch nach der Aufnahme, neben „Original“, „Du“ und „Im Wechsel“ (zwei Reihen, gleich breit).
- **Abspielposition im Wellenbild:** Beim Abspielen läuft eine Linie mit, dahinter füllt sich der gespielte Teil; beim Balken der Computerstimme füllt sich der Balken selbst. „Im Wechsel“ zeigt erst das Original, dann deine Spur. Die Bewegung rechnet der Browser selbst (Web Animations), sie läuft gleichmäßig; die Verzögerung der Tonausgabe (etwa über Bluetooth) wird berücksichtigt, soweit der Browser sie meldet. Auch in der Übersicht am Ende.
- **Knöpfe unten gleich hoch:** „Nochmal“, „Langsam“, „Verwerfen“ haben dieselbe Höhe wie der Hauptknopf.
- **Aussprachehilfen springen nicht mehr:** gleicher Zeilenabstand mit und ohne Hilfen; die gesprochene Form schwebt über dem Wort, ohne die Zeile zu verschieben (und wird beim Kopieren nicht mitkopiert). Hat ein Satz nichts Besonderes, steht das darunter, statt dass das Antippen scheinbar nichts tut.
- **Neu in den Aussprachehilfen (Schwedisch):** sj-Laut bei sj, skj, stj am Wortanfang und bei -tion, -sion (station, passion); tj-Laut bei tj, kj am Wortanfang (tjugo, kjol).

## 24.26.0
- **Nachsprechen neu gebaut.** Drei Schritte als Leiste: Hören, Mitsprechen, Allein. Der Hauptknopf rechts unten führt hindurch (Anhören, Mitsprechen, Aufnehmen, Nächster Satz), jeder Schritt lässt sich auch direkt antippen. Beim Vorlesen ist das gerade gesprochene Wort markiert, wenn die Stimme Wortgrenzen meldet. Ein Schild zeigt, ob eine Tatoeba-Aufnahme oder die Computerstimme spricht.
- **Rückmeldung beim Sprechen:** Während der Aufnahme läuft die Lautstärke als Wellenbild mit, darüber eine Klammer, so lang wie das Original. Hinweise „Sprich jetzt“, „Ich höre dich“, „Sehr leise“. Die Aufnahme stoppt von selbst nach gut einer Sekunde Stille.
- **Auswertung auf dem Gerät, ohne Netz:** dein Wellenbild unter dem Original (Länge der Computerstimme als Balken, bei Tatoeba-Aufnahmen deren Wellenbild, wenn der Server es erlaubt). Kacheln für Tempo (wie das Original, etwas oder deutlich langsamer, schneller; mit Sekunden) und Fluss (Stockungen; Pausen an Komma oder Semikolon zählen nicht). Hinweis bei zu leiser oder übersteuerter Aufnahme. Ab dem zweiten Versuch der Vergleich mit dem davor.
- **Vergleichen:** „Original“, „Du“, „Im Wechsel“ (erst das Original, dann du). Antippen der eigenen Spur spielt ab der Stelle. Die eigene Aufnahme wird ohne Stille am Anfang und Ende und in angeglichener Lautstärke abgespielt.
- **Aussprachehilfen (abschaltbar):** Schwedisch: r verschmilzt mit d, t, n, s, l, auch über die Wortgrenze (in Mittelschweden); stumme Buchstaben (hjälp, ljus, det, konstigt); Alltagsformen klein darüber (mig → mej, de → dom, och → å). Spanisch: betonte Silbe, Bindung zwischen Wörtern (película‿está, dos‿horas).
- **Übersicht am Ende:** Sätze, Versuche, Tempo im Schnitt; je Satz das Wellenbild und „Original und du im Wechsel“; „Alle im Wechsel“ und „Nur meine“ hintereinander.
- **Spracherkennung (Chrome, online) als Zugabe:** verstandene Wörter werden schon beim Sprechen grün; ein fehlender Akzent in der Erkennung zählt nicht als Fehler.
- **Mikrofon:** ohne automatische Lautstärkeregelung (sie glättet Betonung und hebt leise Stimmen bis zur Übersteuerung an), nach jeder Aufnahme, beim Verlassen und wenn die App in den Hintergrund geht sofort frei (wichtig für Bluetooth-Kopfhörer und die Lautstärke). Gesperrtes oder belegtes Mikrofon wird erklärt. Aufnahmen bleiben nur im Arbeitsspeicher.
- **Bonus „Eigener Satz“: Prüfen fragt gleich LanguageTool.** Ein Antippen prüft, ob der Ausdruck vorkommt, und lässt Grammatik und Rechtschreibung prüfen. Ohne Netz bleibt es bei der Grundprüfung, mit Hinweis.
- **Tests:** Browsertests mit vorgetäuschtem Mikrofon (Testsignal mit Pause) und einer Test-Stimme; Einheitstests für Auswertung, Pausen am Satzzeichen, Aussprachehilfen und Worterkennung. Die Sichtprüfung zeigt Nachsprechen vor und nach der Aufnahme.

## 24.25.0
- **Nachschub von Tatoeba gezielter und abwechslungsreicher.** Ein Abruf sucht jetzt viermal statt einmal: zuerst im Thema mit den meisten Fehlern, dann in zwei Themen, die täglich wechseln, zuletzt zu einem Sachthema (Gesellschaft, Wahlen, Wald, Vögel, Spiel, Mannschaft, Roman, Gemeinde, Nachbarn und mehr). Bei „Fortgeschritten“ suchen die Themen nach B2-Mustern, etwa „trots att“, „i och med att“, Satzanfang mit „följaktligen“, „hade hunnit“ oder „como si“, „por mucho que“, „ojalá hubiera“, „de haberlo sabido“. Je Thema 6 bis 10 Suchwörter statt 3 bis 7; die falschen Freunde suchen nach allen Wörtern ihrer Liste. Je Suche höchstens vier Sätze, die mit Aufnahme zuerst.
- **Weniger Ähnliches aus Tatoeba:** Aussortiert werden Sätze mit den Tatoeba-Standardnamen (Tom, Mary, John …), Sätze, die einem vorhandenen zu ähnlich sind (mindestens 60 % gleiche Inhaltswörter), und Sätze mit einem Anfang aus zwei Wörtern, der schon viermal vorkommt (etwa „Jag har“).
- **Konnektoren & feste Verbindungen: je 42 Fälle statt 18 (Schwedisch) und 20 (Spanisch)**, vor allem B2. Schwedisch: följaktligen, ändå, såvitt, förutsatt att, oavsett om, i och med att, såvida inte, å andra sidan; lägga märke till, hålla tal, begå ett brott, ställa krav, dra nytta av, ta ställning, lägga fram. Spanisch: no obstante, por consiguiente, con tal de que, a no ser que, sino que, mientras que, en cuanto a; echar de menos, tener en cuenta, llevar a cabo, darse cuenta, dar vergüenza, caer bien. Vorher kam dieselbe Aufgabe nach wenigen Runden wieder.
- **Verben mit Präposition: 57 statt 41 (Schwedisch) und 58 statt 42 (Spanisch).** Neu etwa ansöka om, tvivla på, ta avstånd från, skylla på, brist på; fiarse de, empeñarse en, optar por, conformarse con, carecer de.
- **Lückentext aus dem Wikipedia-Fundstück:** Unter dem Artikel stehen „Lückentext üben“ und „Nächster Artikel“ (vorher „Noch ein Fundstück“).
- **Fehler behoben:** „Noch eine Runde“ nach einem Lückentext tat nichts, weil der Text nicht mitkam. Jetzt geht es mit demselben Text weiter, auch beim Wikipedia-Artikel.
- **Tests:** Ein neuer Test prüft, dass jeder Generator mindestens 36 verschiedene Aufgaben liefert (dreimal so viele, wie die Wiederholungssperre sich merkt). Dazu Tests für Suchplan und Filter des Nachschubs und ein Browsertest für den Lückentext. Die Sichtprüfung (`npm run sicht`) zeigt jetzt auch das Wikipedia-Fundstück, mit fester Antwort statt Netz.

## 24.24.1
- **Hören: Text bei den Fragen noch einmal von vorn.** Ist der Text zu Ende gehört, spielt „Abspielen“ ihn wieder ab dem ersten Satz (vorher kam beim Hören nur der letzte Satz). Während der Fragen springt die Seite dabei nicht mehr zum gerade gelesenen Satz, die Frage bleibt im Bild. Der Pfeil links spielt weiterhin den aktuellen Satz noch einmal.
- **Themenliste für Lesetexte:** `docs/THEMEN.md` sammelt Leitlinien, die nächste Runde Themen (El Gordo ersetzt durch „Las doce uvas“, weil La ONCE schon das Lotterie-Thema hat), weitere Ideen und was schon geschrieben ist.

## 24.24.0
- **16 neue Lesetexte auf B2/C1**, je acht auf Schwedisch und Spanisch, mit drei Fragen und drei Sätzen fürs Tagwerk. Schwedisch: Offentlighetsprincipen, Grannens lön (öffentliche Einkommen, seit 2023 nur noch als Summe), En stad som flyttar (Kiruna, die Kirche zog im August 2025 um), Samernas rättigheter (Girjas-Urteil, Wahrheitskommission 2026), Skolor med vinst, Från alliansfrihet till Nato, Systembolaget, Miljonprogrammet. Spanisch: La hora equivocada, La memoria que divide, Una laguna con derechos (Mar Menor), La ONCE, Chile y sus dos constituciones fallidas, Cannabis en la farmacia (Uruguay), Un Estado plurinacional (Bolivien), Barcelona contra los pisos turísticos. Fakten vorher an Quellen geprüft (Behörden, Gesetzblätter, Gerichte, Statistikämter). Bei „Fortgeschritten“ stehen C1-Texte oben.
- **Wikipedia-Fundstück nach Kriterien:** nur Artikel, die die Wikipedia-Gemeinschaft als exzellent oder gut ausgezeichnet hat, solche mit Bezug zum Norden bzw. zum spanischsprachigen Raum zuerst, schon gezeigte nicht noch einmal. Die Auszeichnung steht als Schild über dem Titel. Vorher war es ein zufälliger Artikel, oft ein kurzer Eintrag zu einem Dorf oder einer Käferart.
- **„Text zeigen“ lässt sich zurücknehmen:** Beim Hören (auch beim Wikipedia-Fundstück) wird der Knopf nach dem Aufdecken zu „Verbergen“.
- **Hördiktat: „imorgon“ nicht mehr rot.** „imorgon“ und „i morgon“ (ebenso idag, igår, ikväll …) galten schon als gleichwertig, die Lösungsanzeige markierte aber „i morgon“ als fehlend. Jetzt passt die Anzeige zum Urteil.

## 24.23.1
- **Hören ohne Scrollen:** Sind die Fragen dran, klappt der verdeckte Text auf drei Zeilen zusammen, und die Frage steht oben. Nach dem Antworten steht „Nächste Frage“ (bzw. „Ergebnis“) rechts in der Leiste unten statt unter der Frage, und die Fundstelle im Text rückt ins Bild. Gilt auch beim Lesen.
- **„Ins Tagwerk“ statt „Übernehmen“:** Nach den Fragen erklärt eine Zeile, was mit den angebotenen Sätzen passiert: Sie kommen als neue Sätze in die nächsten Tagwerke und werden danach wiederholt. Übernommene zeigen „Im Tagwerk“.
- **„Lückentext üben“ statt „Lücken aus dem Text“.**
- **Themen dieser Runde:** Die Punkte stehen bündig, auch in Zeilen ohne Pfeil (Themen ohne Regelseite).

## 24.23.0
- **Themen dieser Runde:** Das Rundenende zeigt, welche Themen dran waren, je Thema ein Punkt pro Aufgabe (grün richtig, gelb fast, rot falsch). Antippen öffnet die Regel mit Beispielen und „10 Aufgaben üben“. Die Liste erscheint ab zwei Themen, höchstens fünf, Themen mit Fehlern zuerst.
- **Fehler gebündelt:** Liegt ein Thema mit mindestens zwei Fehlern klar vorn, steht darüber etwa „2 von 3 Fehlern: Wortstellung im Nebensatz. Thema üben“. Das übt andere Sätze zur selben Regel, nicht dieselben Aufgaben noch einmal. Bei Gleichstand bleibt der Hinweis weg.
- **Bonus „Eigener Satz“:** Am Rundenende, eingeklappt: einen eigenen Satz mit einem Ausdruck aus der Runde schreiben. Bei Sätzen mit Lücke ist es der geübte Grammatikpunkt (etwa „sina“), sonst das seltenste Inhaltswort des Satzes mit Bedeutung (etwa „promenad – Spaziergang“). Zuerst kommen Sätze, die du gerade neu gelernt oder gewusst hast. Die Prüfung ohne Netz achtet darauf, dass es ein ganzer Satz ist, nicht der Übungssatz, und dass der Ausdruck vorkommt (Inhaltswörter auch in anderer Form). Danach auf Wunsch LanguageTool. Zählt einmal als Aufgabe des Tages. „Anderer Ausdruck“ wechselt den Vorschlag.

## 24.22.0
- **Speicher im Blick:** Unter Einstellungen → Daten zeigt ein Balken, wie viel von den etwa 5 MB belegt ist, die Firefox einer Adresse erlaubt. Mitgezählt werden auch andere Seiten unter derselben Adresse (alle GitHub-Seiten unter caionnew.github.io teilen sich die Grenze). Dazu steht dort, ob der Browser die Daten dauerhaft behält oder bei Platzmangel löschen darf; im zweiten Fall fragt „Dauerhaft speichern“ ihn erneut. Ab 3 MB warnt auch „Heute“.
- **Aufgeräumt:** Eine ESLint-Prüfung über das ganze Skript fand einen doppelten Schlüssel (`slow` beim Lesen, ohne Folgen) und neun Variablen, die berechnet, aber nie benutzt wurden, darunter ein unnötiger Tagesplan auf „Heute“ nach erledigtem Tagwerk. Alles entfernt; sichtbar ändert sich nichts.
- **Werkzeuge:** Die ESLint-Prüfung läuft als Einheitstest mit. Die Browser-Tests laufen über einen lokalen Server statt `file://`, also mit Service Worker und echtem Neuladen; neu ist ein Test für den Offline-Start. `tools/sicht.js` macht Bildschirmfotos aller Hauptansichten in Handygröße, hell und dunkel, mit `--vs <Stand>` auch vorher/nachher.

## 24.21.0
- **Tagesbilanz auf „Heute“:** Nach dem Tagwerk zeigt die Karte unter „Tagwerk erledigt“, was heute in dieser Sprache passiert ist: Minuten, neue Sätze und wie viele Wiederholungen du gewusst hast (etwa „20/22“), dazu „2 Sätze heute gefestigt“, wenn welche dazukamen. Weiteres Üben am selben Tag zählt mit. Ohne Zeit oder Neues steht dort die Zahl der Aufgaben.
- **„Gleich nochmal üben“ entfällt:** Falsche Sätze kommen schon in derselben Runde ein zweites Mal, und die Lösung stand eben noch da. Eine weitere Runde direkt danach prüfte nur das Kurzzeitgedächtnis. Die Liste „Noch nicht sicher“ bleibt zum Nachlesen und Anhören; die Sätze kommen wie bisher morgen wieder.

## 24.20.2
- **Kachel „Tagwerke“ lesbar:** Zahl und Beschriftung wie bei den anderen Kacheln, darunter die Aufteilung nach Sprache (■ 2  ■ 1) in einer Zeile. Vorher brach „■ 2 ■ / 1 Tagwerke“ mitten zwischen Farbpunkt und Zahl um.

## 24.20.1
- **Genaue Erklärung statt allgemeiner:** Bei erzeugten Aufgaben mit eigener Erklärung verdrängte eine allgemeine Diagnose den passenden Text. Bei „Ich warte seit zwanzig Minuten“ stand deshalb nur „Ohne Zeitpunkt … Perfekt mit har“ statt „Dauert bis heute an: Perfekt mit „i“ + Zeitraum (jag har väntat … i tjugo minuter). Im Deutschen steht hier Präsens mit „seit“.“ Jetzt hat die eigene Erklärung Vorrang.

## 24.20.0
- **Woche im Kopf von „Heute“:** Die großen Wochenpunkte mitten in der Seite sind ein kompakter Streifen rechts neben dem Gruß: die letzten sieben Tage bis heute (auch montags aussagekräftig), darunter nur „5 in Folge“ bzw. „heute nötig“, wenn gestern der freie Tag war. Antippen führt zum Kalender.
- **Gleiche Kodierung wie die Übungstage:** gefüllt = Tagwerk, Farbe = Sprache (Schwedisch blau, Spanisch gelb, beide geteilt), Rand = nur geübt, gestrichelt = freier Tag. Die erklärenden Sätze und die Legende darunter entfallen.
- **Andere Sprache in einer Zeile:** Farbpunkt, Name, Kurzstand („1 fällig · gestern“ bzw. „Tagwerk heute erledigt“) und „Tagwerk starten“ (nach erledigtem Tag „Zusätzlich starten“); die Begründung der Sprachwahl steht in den Einstellungen.
- **Überblick in Zahlen statt Satz:** vier Kacheln (Übungstage, Tagwerke je Sprache mit Farbpunkt, Aufgaben, Stunden). Die alte Jahrestabelle entfällt, weil „Jahr für Jahr“ dasselbe ausführlicher zeigt. Kalendertext gekürzt.

## 24.19.0
- **Tagwerk je Sprache:** Die App merkt sich jetzt, in welcher Sprache ein Tagwerk gemacht wurde. Die Serie zählt weiter je Tag, egal welche Sprache. Ältere Tage werden der Sprache mit den meisten Aufgaben zugeordnet.
- **„Heute“ zeigt die Einheit klar:** Die Karte heißt „Heute · Schwedisch-Tagwerk“ mit „Schwedisch-Tagwerk starten“. „Tagwerk erledigt“ steht nur noch bei der Sprache, deren Tagwerk geschafft ist. Ist der Tag mit der anderen Sprache schon erledigt, heißt die Karte „Zusätzlich · Schwedisch-Tagwerk“ und sagt, dass es freiwillig ist. Vorher stand auch bei Schwedisch „erledigt“, und ein schwedisches Tagwerk ließ sich gar nicht mehr starten.
- **Die andere Sprache:** Der Kasten startet ihr Tagwerk direkt („Spanisch-Tagwerk“, nach erledigtem Tag „… zusätzlich“; ein pausiertes geht dort weiter) oder meldet „Spanisch-Tagwerk heute erledigt“. „Zuletzt gestern“ obwohl heute geübt ist behoben, jetzt „heute geübt“.
- **Statistik:** Überblick nennt die Tagwerke je Sprache, „Jahr für Jahr“ ebenso, der Kalender färbt erledigte Tage nach der Sprache des Tagwerks (beide geteilt), und das Tagesdetail sagt, welches Tagwerk erledigt wurde.

## 24.18.3
- **Lücke nach dem Prüfen ohne Doppelung:** Statt Eingabefeld plus Lösung daneben („¿ podrias Podrías ayudarme?“) steht die Lücke jetzt als Text im Satz: richtig grün unterstrichen; fast richtig zeigt die richtige Form gelb unterstrichen, weil sie als richtig zählt (¿Podrías ayudarme?); falsch zeigt deine Antwort durchgestrichen und die Lösung grün daneben. Gilt für Lücken aus der Satzbank und alle erzeugten Lücken.
- Test „Sprache des Tages“ wartet vor dem Neuladen auf das Speichern (die App speichert beim Verlassen ohnehin sofort).

## 24.18.2
- **Wochenpunkt unten in der Mitte behoben:** Der Punkt für heute, der sich nach dem Tagwerk füllt, trug denselben Klassennamen wie das Wörterbuch-Fenster und rutschte deshalb als schwebende Pille über die Tab-Leiste; in der Wochenreihe fehlte er dafür.
- **Adjektiv anpassen ohne geschenkte Aufgaben:** Bei männlichen Nomen auf -o in der Einzahl stand die Lösung schon als Hinweis da (el cuchillo + bonito → bonito). Solche Aufgaben kommen nicht mehr; männliche Nomen auf -a bleiben (el problema bonito), weil genau dort die Falle liegt.
- **Grundform bei „Fortgeschritten“ erst auf Tipp:** Statt „Grundform: deber“ steht „Grundform zeigen“; ein Tipp blendet sie ein, das Getippte bleibt stehen. Auswahl-Hinweise wie „ser oder estar“ oder die drei Optionen bleiben immer sichtbar, weil die Aufgabe sonst mehrdeutig wäre.

## 24.18.1
- **Umbauen „Ayer → Hoy“ eindeutig:** „Beginne mit Hoy …“ ließ auch das Präsens zu (Hoy vemos una película ist ein korrekter Satz). Jetzt steht dabei: „Dieselbe Handlung, nur heute schon passiert (nicht: passiert gerade).“
- **Lösung, Erklärung und Vorlesen passen zusammen:** Bei erzeugten Aufgaben zeigt eine falsche Antwort jetzt die Standardlösung (hier Perfecto: Hoy hemos visto …), so wie Erklärung und Vorlesen sie nennen. Vorher stand die lateinamerikanische Variante (Hoy vimos …) da, während die Stimme die spanische las. Bei „fast richtig“ und bei Sätzen aus der Satzbank bleibt es bei der Fassung, die deiner Antwort am nächsten ist; vorgelesen wird immer, was angezeigt wird.

## 24.18.0
- **Ein Tagwerk am Tag, Sprache nach Bedarf:** Beim ersten Öffnen des Tages wählt die App die Sprache, die es nötiger hat: fällige Wiederholungen im Verhältnis zur Tagwerk-Länge plus Tage seit dem letzten Üben. Die Wahl bleibt für den Tag; ein Wechsel von Hand gilt bis morgen. Wer nur eine Sprache lernt, merkt davon nichts.
- **Die andere Sprache bleibt sichtbar:** Auf „Heute“ steht unter dem Tagwerk ihr Stand („Spanisch: 14 Wiederholungen fällig, zuletzt vor 2 Tagen“), warum heute die andere dran ist, und „Stattdessen üben“ bzw. nach dem Tagwerk „Auch üben“.
- **Einstellung „Sprache beim Start“:** „Nach Bedarf“ (Standard) oder „Zuletzt gewählte“ wie bisher.

## 24.17.0
- **Begleiter im Schwedischen:** Die Übung „Adjektivendungen & bestimmte Form“ wechselt jetzt ab mit min/mitt/mina, din/ditt/dina, vår/vårt/våra (nach en/ett und Plural), der unbestimmten Form nach Possessivpronomen (mitt hus, nicht mitt huset) und den här/det här/de här mit bestimmter Form (det här huset). Nutzt die 80 Wörter der en/ett-Übung, dadurch deutlich mehr Abwechslung.
- **Neue Übung im Spanischen „Begleiter & Adjektive anpassen“:** nuestro/nuestra/nuestros/nuestras, este/esta/estos/estas, ese/esa, mi/mis, tu/tus und Adjektive (nuevo, viejo, pequeño, bonito, perfecto, típico) nach Geschlecht und Zahl, mit den Ausnahmen aus der el/la-Übung (el problema, la mano, la foto). Erklärung nennt Geschlecht, Zahl und die Ausnahme.
- **Wörterbuch Spanisch:** Mehrzahl und weibliche Formen werden auf die Grundform zurückgeführt (casas → casa, ciudades → ciudad, pequeñas → pequeño). Hilft auch beim Lesen und bei Wikipedia-Texten.

## 24.16.0
- **Verben mit Präposition erweitert:** Schwedisch von 15 auf 41 Fälle (u. a. bry sig om, ta hand om, längta efter, lita på, påminna om, beroende av, nöjd med, se fram emot, bestå av), Spanisch von 16 auf 42 (u. a. depender de, parecerse a, encargarse de, contar con, atreverse a, tratar de, convertirse en, volver a, acabar de, oler a). Nur eine Option ist jeweils richtig; wo zwei Präpositionen gehen (orolig för/över, quejarse de/por), steht die zweite nicht zur Wahl und die Erklärung nennt sie. Alle Wörter im Wörterbuch.
- Test: mindestens dreimal so viele Fälle wie die Wiederholungssperre sich merkt.

## 24.15.1
- **Zwei wackelige Tests behoben, die die Veröffentlichung von 24.15.0 stoppten:** Die Wiederholungssperre der Übungen gab bei kleinen Listen (15 Fälle, 12 gemerkt) nach 30 Zufallsversuchen auf; jetzt 200, die Präpositions-Übung wiederholt sich damit innerhalb einer Runde praktisch nie. Und ist der Schwerpunkt der Woche bei „Fortgeschritten“ ein schwaches Thema, kommen dort die einfachen Sätze zuerst, wie es für schwache Themen ohnehin gilt; vorher hing das vom Zufall ab.
- Geprüft mit 40 Durchläufen aller Einheitstests, auch in UTC wie auf GitHub.

## 24.15.0
- **Sätze aus Anki übernehmen:** Unter Einstellungen › Nachschub eine Datei aus AnkiDroid einlesen (Stapel exportieren als „Notizen als Klartext“). Die App liest Kopfzeilen, Tabulator oder Semikolon, Anführungszeichen, entfernt HTML, Tonverweise und Lückentext-Klammern, erkennt Sprache und Übersetzungsspalte (auch Englisch), zeigt eine Vorschau und übernimmt bis zu 1.500 Sätze je Datei in Stapelreihenfolge; Vorhandenes wird übersprungen, erneutes Einlesen holt die nächsten.
- **An Anki senden:** Im Wörterbuch-Fenster „An Anki“: Wort als Vorderseite, Grundform und Bedeutung plus der Satz aus dem Text als Rückseite, über das Teilen-Menü an AnkiDroid.
- **Neue Übung „Verben mit Präposition“:** tänka på, vänta på, rädd för, vänja sig vid; soñar con, pensar en, acordarse de, dejar de, tener ganas de. Lücke mit drei Optionen und Erklärung.
- **Lücken aus Lesetexten:** Nach den Fragen „Lücken aus dem Text“: acht Sätze des gerade gelesenen Textes mit je einem fehlenden, möglichst gebeugten Wort und der Grundform als Hilfe. Läuft auch im Wechsel der Grammatik-Übungen mit Sätzen aus bereits gelesenen Texten.

## 24.14.0
- **Nachschub für Fortgeschrittene:** Tatoeba-Nachschub zählt bei „Fortgeschritten“ nur Sätze, die auch drankommen (ab Mittelstufe oder schwaches Thema), und holt dann längere Sätze (6–14, später 7–18 Wörter). Vorher hätte die App nach etwa zwei Wochen auf Grundlagen-Sätze zurückgegriffen. Bei „Fortgeschritten“ ohne Nachschub weist die Einstellung darauf hin.
- **Neue Übung „Konnektoren & feste Verbindungen“ (B1–B2):** därför/dessutom/däremot, trots att, utan; sin embargo, por lo tanto, en cambio, para que, sino, en cuanto; dazu Kollokationen wie *fatta ett beslut*, *ta hänsyn till*, *tomar una decisión*, *hacer caso*, *dar miedo*. Lücke mit drei Optionen, Erklärung nach der Antwort, alle Wörter im Wörterbuch. Läuft im Wechsel mit den anderen Grammatik-Übungen und unter „Grammatik kurz erklärt“.
- **Schwerpunkt der Woche:** je Sprache ein Thema, montags automatisch gewählt (das mit den meisten Fehlern der letzten 30 Tage, sonst das mit den meisten offenen Sätzen ab Mittelstufe). Ein Drittel der neuen Sätze kommt daraus; auf „Heute“ sichtbar und mit „Anderes Thema“ wechselbar.

## 24.13.0
- **Etappen gehen nie aus:** Nach dem Ende der Listen geht es in gleichmäßigen Schritten weiter (Aufgaben je 25.000, Stunden je 250, gefestigte Sätze und Wörter je 500). Serien zählen nach zwei Jahren in ganzen Jahren weiter („3 Jahre in Folge“, dazwischen „1.000 Tage in Folge“). Neu: Übungstage insgesamt (10, 50, 100, 250, 500, 1.000, dann je 500), verzeihender als Serien, und Jahrestage („2 Jahre mit Tagwerk“).
- **Gleisplan mit Jahrestrennern:** Beim ganzen Weg stehen die Jahre zwischen den Etappen.
- **Jahr für Jahr:** Karte je Jahr mit Übungstagen (davon mit Tagwerk), Lernzeit, längster Serie, stärkstem Monat und je Sprache neue und gefestigte Sätze, Aufgaben und Zeit. So bleiben auch frühe Jahre sichtbar, wenn der Kalender sie nicht mehr zeigt.
- **Verlauf nach über 400 Tagen:** Umschalter „Letztes Jahr“ und „Seit Beginn“; die Zählung der geübten Sätze beginnt dabei richtig beim Stand vor dem Zeitraum.
- **Speicher für Jahre:** Tagesstände älter als 120 Tage werden auf Sonntage und Monatsenden zusammengefasst; nach fünf Jahren täglicher Nutzung bleiben die Daten deutlich unter 1,5 MB (Browser erlauben meist etwa 5 MB). Unter Einstellungen steht, wie viel gespeichert ist, mit Hinweis ab 3,5 MB.
- Test simuliert fünf Jahre Nutzung: Etappen, Jahreskarten, Speichergröße.

## 24.12.0
- **Übungstage neu kodiert:** Form zeigt den Einsatz (gefüllt: Tagwerk, Rand: nur etwas geübt, gestrichelt: freier Tag), Farbe die Sprache (Schwedisch blau, Spanisch gelb, beide geteilt). Die Stufe „Tagwerk und mehr“ entfällt: Sie hing an 25 Aufgaben und damit an der Länge des Tagwerks; die Menge zeigt das Minutendiagramm genauer.
- **Dein Weg als Gleisplan:** links Schwedisch, in der Mitte Gemeinsames (Serien, Aufgaben, Stunden), rechts Spanisch, alles auf derselben Zeitachse. Jede Spur beginnt am ersten Übungstag ihrer Sprache; die nächsten Ziele stehen oben als offene Punkte in ihrer Spur. So sieht man, wo die Sprachen gleich laufen und wo eine vorne liegt.

## 24.11.1
- **Veröffentlichung robust bei Wiederholung:** „Re-run jobs“ lud ein zweites Artefakt „github-pages“ in denselben Lauf, deploy-pages brach mit „Multiple artifacts named github-pages“ ab. Das Artefakt heißt jetzt je Versuch anders (`github-pages-<Versuch>`).
- **Aktionen auf Node 24:** checkout v7, setup-node v7, upload-pages-artifact v5, deploy-pages v5, upload-artifact v7; die Warnung zu Node 20 entfällt. Läufe fest auf Ubuntu 24.04 statt „ubuntu-latest“, das ab Oktober 2026 auf Ubuntu 26 wechselt.

## 24.11.0
- **Abstand Aufgabe–Antwort begrenzt:** Auf großen Handys lagen bis zu 560 px zwischen deutschem Satz und Lückensatz. Die Antwortzone sitzt jetzt höchstens 30 % der Bildhöhe unter der Aufgabe und immer in der unteren Hälfte; auf kleinen Handys weiter direkt über der Leiste.
- **Hörrunde wie Lesen und Übungen:** Zurück, Wiedergabe und Vor stehen unten in der Leiste statt mitten im Bild.
- **Tagesplan ruhiger:** Die Beschreibungen („gezielt zu typischen Fehlern“) stehen unter der Zeile statt rechtsbündig in schmalen Spalten umbrochen.
- **Einheitliche Ecken und Innenabstände:** Flächen 18 px Radius, Bedienelemente 14 px; Rückmeldung, Hinweise und Hörrunden-Karte angeglichen.
- **Bewegung, wo sie etwas erklärt:** Wortkästchen gleiten an ihren Platz in der Antwort und zurück; das gerade geschaffte Stück im Fortschrittsbalken füllt sich; nach dem Tagwerk füllt sich auf „Heute“ der Punkt für heute. Alles kurz, alles als Antwort auf eine Handlung, und bei „Bewegung reduzieren“ aus.

## 24.10.1
- **Rundenende wie die Übungen:** „Fertig“ und „Noch eine Runde“ bzw. „Weiter üben“ stehen unten in der Leiste (Nebenweg links, Hauptweg rechts), die Tab-Leiste ist auf diesem Bildschirm ausgeblendet. Vorher hingen die Knöpfe mitten im Bild über einer leeren Fläche.
- **Ehrlicher Text:** „Sitzt: 3 Sätze …“ versprach nach einem einzigen Treffer zu viel. Jetzt „Nächste Wiederholung: 3 Sätze kommen übermorgen wieder“, Spannen als „in 2 bis 3 Wochen“.
- **Keine doppelte Zahl:** „richtig in Folge“ erscheint nur noch, wenn die Runde nicht fehlerfrei war; sonst sagt „Alle 3 auf Anhieb richtig“ schon dasselbe.

## 24.10.0
- **Aufgabe oben, Antwort unten, bei allen Übungen gleich:** Die Antwortzone (Wortkästchen, Wörter zum Antippen, Auswahl, Eingabefeld, Lückensatz, Abspielen beim Hördiktat) sitzt direkt über der Knopfleiste, die Rückmeldung erscheint zwischen Antwort und „Weiter“. Antippen, Prüfen und Weiter liegen damit im Daumenbereich, und mit Tastatur sitzt das Feld direkt über ihr. Vorher lag bei „Fehler finden“ und Genus das Antippen oben und „Weiter“ ganz unten.
- **Kein Sonderfall mehr:** Genus schaltete nach richtiger Antwort als einzige Übung von selbst weiter. Jetzt geht es überall mit „Weiter“ (oder Enter) weiter.
- Browser-Test: Abstand zwischen Antwortzone und Leiste und Lage der Rückmeldung für jede Übungsart eines Tagwerks.

## 24.9.0
- **Modi ehrlich benannt:** „Lesen und hören“ und „Nur hören“. Beim Lesen heißt der Knopf unten „Vorlesen“ statt nur ▶, damit klar ist, dass es Ton gibt. Ein dritter Modus „nur lesen“ wäre derselbe Bildschirm ohne Antippen und entfällt.
- **Niveau:** Einstellung „Grundlagen / Mittel / Fortgeschritten“. Fortgeschritten: schwere Sätze zuerst, Grundlagen-Sätze nur in Themen mit vielen Fehlern der letzten 30 Tage (dort dann bewusst die einfachsten zuerst) oder wenn sonst nichts mehr da ist; sitzt die Grammatik-Übung des Tages (85 % der letzten 15+), kommen davon nur zwei Aufgaben; Lesetexte nach Schwierigkeit sortiert.
- **Mehr Stoff auf B2:** 32 schwedische und 40 spanische Sätze in allen Themen außer den falschen Freunden (Plusquamperfekt, irreale Bedingungen, Subjuntivo nach aunque/cuando/Relativsatz, Konditional der Vermutung, Passiv mit -s, Partikelverben wie *hålla med*, *ta reda på*), alle Wörter im Wörterbuch. Zwei spanische Lesetexte auf B2 (*La España vaciada*, *Las lenguas de España*).
- **Satzbank:** optionale sechste Spalte für das Niveau (A2, B1, B2); ohne Angabe schätzt die App nach Länge, Nebensätzen und anspruchsvollen Formen.

## 24.8.0
- **Lesen oder nur hören wird vorher gewählt:** Umschalter oben in der Übersicht, gemerkt für alle Texte. Wer hören will, sieht den Text vorher nicht; im Text selbst gibt es dafür keinen Umschalter mehr, beim Hören nur „Text zeigen“.
- **Leiste unten:** Noch einmal (aktueller Satz, in der ersten Sekunde der davor), Wiedergabe, „Langsam“ mit Schildkröte als klarer Ein/Aus-Schalter statt „1×“ (gemerkt). Vor/Zurück entfallen, Sätze springt man durch Antippen an.
- **Satz antippen:** Beim Lesen öffnet ein Wort wie überall das Wörterbuch, dort gibt es jetzt „Ganzen Satz anhören“. Beim Hören spielt ein verschwommener Satz beim ersten Antippen noch einmal, beim zweiten wird er sichtbar.
- **Fragen erst nach dem Text:** Beim Lesen über „Gelesen, zu den Fragen“, beim Hören kommen sie von selbst nach dem letzten Satz („Fragen jetzt“ geht immer). Nach jeder Antwort steht die Textstelle mit der Lösung darunter, am Ende sind diese Stellen im Text unterstrichen. Weiter geht es per Knopf, nicht mehr automatisch, damit die Textstelle gelesen werden kann.

## 24.7.0
- **Lesen neu gestaltet:** Der Text steht vorn, nicht die Knöpfe. Kopf mit Thema, Niveau, Satzzahl, Titel in der Schrift der Zielsprache und einem schmalen Fortschrittsbalken. Die Steuerung sitzt als ruhige Leiste unten (zurück, Wiedergabe, vor, Tempo, „Nur hören“) und bleibt beim Scrollen erreichbar.
- **Mitlesen:** Der vorgelesene Satz ist hervorgehoben, und die Ansicht folgt ihm sanft, nur wenn er aus dem Bild rutscht.
- **Nur hören statt zweier Reiter:** Der Text wird verschwommen statt versteckt. Antippen deckt einen einzelnen Satz auf, nach der letzten Frage wird alles scharf.
- **Fragen einzeln:** Frage 1 von 3 mit Punkten; nach einer richtigen Antwort geht es von selbst weiter, nach einer falschen bleibt die Lösung stehen, bis man „Nächste Frage“ tippt. Danach Ergebnis, Sätze zum Übernehmen und **Nächster Text** (der nächste ungelesene).
- **Nachgeschlagen:** Wörter, die man im Text antippt, sammeln sich am Ende mit ihrer Bedeutung.
- **Übersicht als Karten** mit Thema, Niveau, erstem Satz als Vorschau und Stand („Neu“, „2 von 3“, „gehört“).

## 24.6.0
- **Lesen und Hören:** sieben eigene Texte je Sprache, quer durch Natur, Geschichte, Kultur, Gesellschaft, Reisen und Kurioses (Schwedisch B1–B2, Spanisch A2–B1). Jeder Text lässt sich lesen (Wörter antippbar, Vorlesen mit Hervorhebung) oder nur hören (Text verdeckt, Satz für Satz, langsam, Satz wiederholen). Danach drei Verständnisfragen und zwei Sätze, die man in die Wiederholung übernehmen kann. Ergebnis und „gehört“ stehen in der Liste.
- **Wikipedia-Fundstück (online):** ein zufälliger Artikel aus der schwedischen bzw. spanischen Wikipedia über die offizielle API, mit Quelle und Lizenzhinweis, ebenfalls zum Lesen oder Hören. Die Texte der App selbst sind eigene Texte und brauchen kein Internet.
- **Termux:** `tagwerk` wird als echter Befehl angelegt statt als Alias, `docs/INSTALL.md` entsprechend.

## 24.5.0
- **Rundenende neu:** Leiste mit einem Feld je Aufgabe (richtig, fast richtig, falsch), Kennzahlen nur wenn aussagekräftig (Minuten, neue Sätze, richtig in Folge), „Sitzt: … kommen erst in … wieder“, „Noch nicht sicher“ mit **Gleich nochmal üben** (ändert den Wiederholungsplan nicht), Hinweis auf ein offenes Tagwerk, „Noch eine Runde“ als Hauptknopf außerhalb des Tagwerks, „Fehlerfrei“ bei einer perfekten Runde.
- **Serie in der Runde:** bei 3, 5, 10 … ersten Versuchen in Folge ein kurzer Hinweis.
- **Richtige Antworten werden erkannt:** Ziffern und Zahlwörter, *arbeta*/*jobba*, *mej*/*mig*, *sen*/*sedan* gelten als gleich. Tippfehler (vertauscht, Nachbartaste, Doppelbuchstabe) zählen als „fast richtig“ mit Hinweis; nicht bei Endungen, Stammwechsel, Lückenwort oder ausgeschriebener Uhrzeit. Test über alle Musterlösungen und Alternativen.
- **Grammatik oder Wortschatz:** Funktionswörter und andere Formen desselben Wortes sind Grammatik, ein anderes Inhaltswort ist Wortschatz. Wortschatzfehler belasten nicht mehr das Grammatikthema (Fehlerquellen), erscheinen als eigene Fehlerart „Wortschatz“, und die Rückmeldung sagt „Die Grammatik passt, nur … statt …“. In Grammatik-Übungen zählt so ein Fehler als „fast richtig“, in der Satzbank weiter als falsch.
- **Hörrunde:** geübte Sätze nebenbei hören (Satz, Deutsch, Satz langsam), läuft von allein, Bildschirm bleibt an, zählt als Lernzeit.
- **Inhalt:** Satzbank Schwedisch 177 statt 131, Spanisch 192 statt 163 Sätze, nur in dünnen Themen; alle neuen Wörter im Wörterbuch.
- **Aufgeräumt:** ungenutzte Hilfsfunktionen, doppelte Speicher-Anfrage und zusammengehörige CSS-Regeln zusammengeführt (Darstellung unverändert).

## 24.4.1
- **Neues Symbol kam nicht an:** Firefox merkt sich Symbole pro Dateiname; bei gleichem Namen (`icon-512.png`) zeigte es nach Neuinstallation weiter das alte. Der Build hängt jetzt einen Inhalts-Hash an (`icon-512.89186482.png`) und setzt die Namen in Manifest, Service Worker und Seite ein. Jedes geänderte Symbol hat damit eine neue Adresse.
- **Updates ohne Umweg über den Browser-Zwischenspeicher:** GitHub Pages erlaubt 10 Minuten Zwischenspeicher. Der Service Worker lädt beim Installieren jetzt am Zwischenspeicher vorbei und fragt im Hintergrund beim Server nach, sonst konnten alte Dateien im neuen Cache landen.
- **Versionsnummer** unter Einstellungen › Über Tagwerk.
- Lässt sich der gespeicherte Stand nicht lesen, legt die App ihn unter `tagwerk-offline-v1-unlesbar` ab, bevor etwas überschrieben wird.
- Einheitstest für den Build (Version, Symbolnamen, Verweise).

## 24.4.0
- **Knopfleiste im Dunkelmodus:** In Firefox für Android waren „Prüfen“ und „Weiter“ im Dunkelmodus unsichtbar, ließen sich aber antippen. Die Leiste ist jetzt kein festes Element mehr (`position:fixed`), sondern steht unten im Fluss und bleibt beim Scrollen sichtbar (`sticky`); Aussehen und Platz sind gleich. Wechselt das System zwischen hell und dunkel, zeichnet die App neu und färbt die Statusleiste passend. Nachgestellt in echtem Firefox (Gecko 160, Desktop) in hell und dunkel; das Verhalten auf Android ließ sich hier nicht nachstellen.
- **Hördiktat spielt von selbst:** Der Satz kommt beim Erscheinen einmal, ohne „Abspielen“, auch nach „Weiter“. Verweigert der Browser den Ton (etwa nach einem Neustart mitten in der Runde), bleibt es still, und eine Aufnahme wird deshalb nicht mehr fälschlich als gesperrt gemerkt.
- **Symbol:** Die Sonne sinkt tiefer in die Welle, das Motiv sitzt mittiger.
- **Updates per Termux:** `tools/einspielen.sh` und Weg C in `docs/INSTALL.md`: Repository vom Handy aus einrichten, danach ist jedes Update eine `.patch`-Datei und ein Befehl.
- Browser-Tests: Hördiktat ohne Antippen, Knopfleiste unten im Bild (31 Tests).

## 24.3.0
- **Schreibmarke beim Umbauen:** Das Feld mit vorgegebenem Satzanfang („Tyvärr …“) bekam den Fokus, die Marke stand aber vor dem ersten Wort; auch die Knöpfe å, ä, ö fügten dort ein. Jetzt steht sie am Ende, beim Öffnen und beim erneuten Antippen. Ein Browser-Test prüft beides für Schwedisch und Spanisch (mit der alten Fassung schlägt er fehl).
- **Mehr Abwechslung:** Wortstellung, Fehler finden und Umbauen auf Schwedisch teilten sich 9 Bausteine, „dricker kaffe“ kam fast jede Runde. Jetzt 30 (Pilze sammeln, Unihockey, bar zahlen, Ski fahren, im See baden, Urlaub im Juli …). Spanisch Umbauen: 22 statt 10 Bausteine für Zeiten, 16 statt 10 für den Subjuntivo. Alle neuen Wörter stehen im Wörterbuch.
- **Lesetipps nach dem Tagwerk:** Schwedisch 8 Sidor, SVT Nyheter, Svenska Yle; Spanisch Noticias fácil, RTVE Noticias, BBC Mundo. Alle frei lesbar, ohne Bezahlschranke. Klartext und Dreaming Spanish entfallen.
- **Backup zuverlässiger:** Die Download-Adresse blieb nur 1,5 Sekunden gültig; Firefox für Android fragt vorher nach und konnte dann ins Leere laden. Jetzt 2 Minuten. Die Dateiauswahl filtert nicht mehr nach JSON (Android graut solche Dateien teils aus), stattdessen wird der Inhalt geprüft; dieselbe Datei lässt sich mehrfach wählen. Nach dem Einspielen steht da, wie viele Sätze und Übungstage übernommen wurden. Wo der Browser Dateien teilen kann, gibt es „Backup teilen“. Browser-Tests: Export, Import auf einem leeren Gerät, Neustart, Rückgängig, fremde Datei.
- **Neues Symbol „Ring und Welle“:** Der Ring des å als Sonne, die Tilde des ñ als Welle. Rund mit durchsichtigen Ecken (`any`) und randlos für Android-Masken (`maskable`), damit es nicht mehr als Quadrat zwischen runden Symbolen steht. Zehn Entwürfe in `design/icons/`, Wechsel mit `npm run icons -- <name>`.
- „Morgen kommt 1 Satz“ statt „Morgen kommen 1 Satz“; ebenso beim Übernehmen eines einzelnen Satzes.

## 24.2.0
- **Lücke im falschen Wort:** Die Lücke wurde per Zeichensuche gesetzt und traf das erste Vorkommen, auch mitten in einem Wort: „Pi[en]so mucho en ti“ statt „Pienso mucho [en] ti“ und „La fi[es]ta es en casa de Ana“ statt „La fiesta [es] en casa“. Jetzt zählen nur ganze Wörter; ein Test prüft alle 233 Lückensätze.
- **Übersetzung:** „Ich denke oft an dich“ hieß „Pienso mucho en ti“ (mucho = viel). Jetzt „Ich denke viel an dich“. Ein Abgleich bedeutungstragender Wörter (oft, immer, nie, viel, heute, gestern, morgen) über die ganze Satzbank fand keinen weiteren Fall.
- **Land & Leute:** Die Karte „patata, papa, palta“ mischte zwei Themen. Jetzt „¿aguacate o palta?“: zwei Namen aus Nahuatl und Quechua, mit Karte der beiden Verbreitungsgebiete und passendem Beispielsatz.

## 24.1.0
- **Uhrzeiten und Preise:** Die Zifferntastatur am Handy hat keinen Doppelpunkt und kein €. Uhrzeiten gelten jetzt auch mit Komma oder ganz ohne Trennzeichen (7,45 und 745), der Platzhalter lautet „z. B. 7.45“ und ein Hinweis nennt die Trennzeichen. Beim Preis steht die Währung sichtbar im Feld; eingegeben wird nur die Zahl.
- **Amerika-Karte flächentreu:** Lambert flächentreu azimutal mit Mittelpunkt 57,5° W 10° N statt Plattkarte. Vorher erschienen Patagonien und Spanien bis zu 78 % zu groß. Begründung und Messwerte in `docs/CONTENT.md`, nachrechenbar mit `tools/projection_check.js`.

## 24.0.0
- **Keine Wiederholungen mehr:** Jeder Generator merkt sich seine letzten 12 Aufgaben, auch über Runden hinweg (vorher z. B. bei por/para fast jede Runde eine Doppelung). Hördiktat, Nachsprechen und „Thema üben“ bevorzugen Sätze, die zuletzt nicht dran waren. Das Fundstück zeigt nie zweimal hintereinander dieselbe Karte.
- **Fortschritt ruhiger:** Sprachkarte mit drei Kennzahlen statt vier Absätzen, antippbare Begriffe „gefestigt“, „verankert“, „abrufbar“, Themenraster statt Liste, „Stand der Sätze“ in einer Zeile. Behoben: Pfeil in der Themenliste brach in eine eigene Zeile um.
- **Langfristig sichtbar:** „Dein Weg“ mit Etappen, rückwirkend aus den Tagesdaten; Wortschatz und gefestigte Sätze je Thema im Tagesstand; Zuwachs über 30 Tage.
- **Schreiben:** Textprofil offline (Zeitformen, Nebensätze, Verbindungswörter, Satzlänge, LIX, neu Gelerntes), treffsichere Hinweise zu den Fallen der App, freiwillige Extra-Aufgabe, Wörter zum Einbauen, Textarchiv, Verlauf in der Statistik.
- **Karten:** Natural-Earth-Karten bei spanischen Wortvarianten, „Spanisch in der Welt“, Finnlandschwedisch, Norrland mit Polarkreis, Skandinavien.
- Tagesplan auf „Heute“ kürzer, Bezeichnungen brechen nicht mehr um.
- Repository mit Node-Build, 98 Einheitstests, 25 Browser-Tests, CI und automatischer Veröffentlichung.

## 23
Fehlerquellen nach Thema, Übungsart und Fehlerart; Tageszeit; Wortschatz; Land & Leute mit Übernahme von Beispielsätzen; „Meine ist auch richtig“ nicht mehr bei eindeutigen Lückenaufgaben; verweigerte Tatoeba-Aufnahmen werden gemerkt, Namensnennung mit Link.

## 22
Fachbegriffe antippbar, Liste „Grammatik-Begriffe“; Kalender mit fester Kästchengröße zum Wischen bis zum ersten Übungstag; 3, 6 oder 10 weitere neue Sätze.

## 21
Fortschritt in Reiter geteilt (Überblick, Schwedisch, Spanisch); Übungsseite nach Zweck gruppiert; Themenblatt mit Regel, Beispielen und typischem Fehler; Beispiele aus eigenen Sätzen im Wörterbuch; Nachschlagelisten für Regeln, falsche Freunde und Feste; Regeltexte korrigiert („måste inte“, Partikelverben).

## 20
Neue Übungsformen: Fehler finden, Umbauen, Uhrzeiten & Zahlen, en/ett und el/la; Konjugation mit Rechtschreibregeln.

## 19
Aussprache prüfen mit Spracherkennung, Vibration, Teilen an die App, Schnellzugriffe, Stempel nach dem Tagwerk.

## 16 bis 18
Rundenergebnis zählt nur den ersten Versuch, Symbole, Begrüßung, Fundstück, eigene Einstellungsseite, Rundenlänge, Langzeitstatistik, Jahrestabelle.

## 13 bis 15
Wortkästchen mit festen Plätzen, Verlaufsdiagramm, Wochenbalken mit Ziel-Linie.

## 10 bis 12
Abbrechen-Hinweise, Wortstellung, Wörterbuch-Fenster.

## 5 bis 9
Lückenbreite, Zeitformen, Übungslogik; Umstieg von Leitner auf FSRS-6.
