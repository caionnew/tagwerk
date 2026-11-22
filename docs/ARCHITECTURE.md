# Architektur

Tagwerk ist eine einzelne HTML-Datei ohne Framework und ohne Laufzeit-Abhängigkeiten. Das hält die App klein (rund 450 KB), offline-fähig und über Jahre wartbar.

## Build

`tools/build.js` setzt `src/index.html` (Gerüst mit Platzhaltern), `src/style.css` und alle Skripte in fester Reihenfolge zu `dist/index.html` zusammen, prüft das JavaScript auf Syntaxfehler und kopiert `public/` dazu. Die Cache-Version im Service Worker wird aus Paketversion und Inhalts-Hash gebildet (`tagwerk-24.0.0-1f89fd26`); jede inhaltliche Änderung erzeugt eine neue Version, und installierte Apps zeigen „Eine neue Version ist da“. Symbole bekommen einen Inhalts-Hash im Dateinamen (`icon-512.89186482.png`), weil Firefox Symbole pro Adresse zwischenspeichert; die Verweise in Manifest, Service Worker und `index.html` setzt der Build. Die Versionsnummer aus `package.json` ersetzt `'@VERSION@'` (`APP_VERSION`) und steht unter Einstellungen.

Alle Skripte laufen in einer gemeinsamen Funktion mit `'use strict'`. Die Reihenfolge steht in `ORDER` in `tools/build.js`: Daten und Generatoren zuerst, Ansichten und Ereignisse zuletzt.

## Module

| Datei | Aufgabe |
|---|---|
| `data/content.js` | Satzbank (`CONTENT`) |
| `js/generators.js` | Konjugation, Grammatik-Generatoren (`GENS`) |
| `js/forms.js` | Übungsformen: Fehler finden, Umbauen, Uhrzeiten & Zahlen, Genus |
| `data/gloss.js` | Wörterbuch, `lookupWord()`, Wiktionary-Abfrage |
| `data/fundstueck.js` | Feste, falsche Freunde, Begrüßung, Auswahl des Fundstücks |
| `data/terms.js` | Fachbegriffe mit Erklärung je Sprache, `termify()` macht sie in Erklärungen antippbar, `termsFor()` liefert die Liste einer Sprache |
| `data/kultur.js`, `data/geo.js` | Land & Leute, Kartendaten |
| `data/texte.js` | Lesetexte mit Fragen und übernehmbaren Sätzen |
| `js/part_head.js` | Konstanten, Themen (`TRAPS`), Speicher, Satzbank-Aufbau, Tagesplan, Runden, Wiederholungssperre, Serie, Tagesstand |
| `js/part_fsrs.js` | FSRS-6 (Wiederholungsplanung) |
| `js/part_check.js` | Antworten prüfen (Gleichwertiges, Tippfehler, geprüfter Teil), Rundenablauf, „Meine ist auch richtig“. Das Diktat prüft nur gegen den Zielsatz, ohne Alternativen. Beim Übersetzen (nicht im Diktat, nicht bei Lücken; erkennbar an `de` aus `judgeOpts`) zusätzlich: fehlendes „har“/„hade“ im schwedischen Nebensatz (`svHaDrop`), betontes spanisches Subjektpronomen passend zum deutschen Satz (`esProDrop`). Bei falscher Antwort im Spanischen: fehlt nur ein Reflexivpronomen (quedamos statt nos quedamos), nennt `esReflexWhy` die Bedeutung mit und ohne Pronomen (reflexiv laut Wörterbuch-Grundform auf -se, bei nos/os/te passend zur Person; Gegenbedeutungen in `ES_REFL`) |
| `js/part_online.js` | Tatoeba (Nachschub, Suche, Aufnahmen), LanguageTool |
| `js/part_speech.js` | Vorlesen (auf Wunsch mit Meldungen zu Beginn, Wortgrenzen und Ende) |
| `js/part_radio.js` | Hörrunde: Sätze nebenbei hören |
| `js/part_read.js` | Lesen und Hören: Texte, Fragen, Wikipedia-Fundstück |
| `js/part_modern.js` | Spracherkennung, Symbole, Vibration, Teilen, Schnellzugriffe |
| `js/part_shadow.js` | Nachsprechen: Aufnahme, Pegel, Auswertung, Wiedergabe, Aussprachehilfen, Übersicht |
| `js/part_stats.js` | Fehlerquellen nach Thema, Übungsart, Fehlerart (`mistake`: Ein anderes Wort im geprüften Teil ist Grammatik, außer in Themen mit `vocab:true` wie Redewendungen, Falsche Freunde, Lesetext-Lücken; dort nur dieselbe Wortfamilie) Erstkontakt neuer Sätze je Monat (`noteFirst`, noch ohne Anzeige) und hartnäckigen Sätzen (`hardSentences`: bei Wiederholungen mindestens zweimal nicht gewusst, nicht gefestigt, in 30 Tagen geübt; `hardPattern`: gemeinsames Thema), Uhrzeiten, Wortschatz |
| `js/part_long.js` | Dein Weg (`wayEvents`, `wayNext`, Rangfolge `WAY_PRIO`, Gleisplan `wayHtml`), Themenraster, Veränderung über 30 Tage |
| `js/part_write.js` | Textprofil, Hinweise, Extra-Aufgaben, Textarchiv |
| `js/part_ref.js` | Themenblatt, Nachschlagelisten, Kulturkarten, Karten |
| `js/part_views.js` | Alle Ansichten als HTML-Vorlagen, `render()` |
| `js/part_events.js` | Ereignisse, Aktionen, Start |

## Darstellung und Ereignisse

Übungen folgen einem Aufbau: oben die Aufgabe (Anweisung, Vorlage), darunter ein Abstandshalter (`.ex-sp`, höchstens 30 % der Bildhöhe), dann in `.ex-a` die Antwortzone in der unteren Bildhälfte, dazwischen nach dem Antworten die Rückmeldung (`#fb`). Neue Übungsarten legen ihre Eingabe in `.ex-a`; `tests/e2e/layout.spec.js` prüft das für alle Arten.


`render()` erzeugt die aktuelle Ansicht als Zeichenkette und setzt sie in `#app`. Für die Zurück-Geste liegt, solange es in der App ein „zurück“ gibt, ein Eintrag im Browserverlauf (`armBack`); `popstate` führt einen Schritt zurück über dieselben Knöpfe wie in der Oberfläche (`inAppBack`), auf „Heute“ verlässt die Geste die App. Alle Benutzeraktionen laufen über ein einziges Klick-Ereignis: Elemente tragen `data-a="aktion"`, `part_events.js` verteilt sie. Laufzeitzustand liegt in `S` (aktuelle Ansicht, laufende Runde, offene Fenster), alles Dauerhafte in `DB`.

Nachsprechen (`part_shadow.js`) führt je Satz durch drei Schritte: Hören, Mitsprechen, Allein (Aufnahme). Die Aufnahme läuft über `getUserMedia` ohne automatische Lautstärkeregelung (sie würde Betonung glätten und leise Stimmen bis zur Übersteuerung anheben) und `MediaRecorder`; ein `AnalyserNode` liefert live den Pegel für die Anzeige und stoppt nach 1,2 s Stille. Danach wird die Aufnahme dekodiert und im 20-ms-Raster ausgewertet (`shAnalyze`: Sprechbeginn und -ende, Pausen ab 0,35 s, leise, übersteuert). `shMarkPauses` ordnet jedem Satzzeichen die zeitlich nächste Pause zu, übrige Pausen gelten als Stockung. Das Tempo vergleicht die Sprechdauer mit dem Original: bei der Computerstimme gemessen von Beginn bis Ende der Ausgabe, bei Tatoeba-Aufnahmen aus der dekodierten Datei (falls der Server das erlaubt, sonst nur ungefähr und ohne Urteil). Die Wiedergabe schneidet Stille ab und gleicht die Lautstärke an. Abspielen läuft als Folge von Schritten (`shSeq`, auf Wunsch als Schleife wie beim Mitsprechen); die Abspielposition (`shHead`) bewegt per Web Animations eine Linie über das Wellenbild, dessen Zeitachse in `data-t0` und `data-span` am `.shtrack` steht. Das Mikrofon wird nach jeder Aufnahme, beim Verlassen und wenn die App in den Hintergrund geht sofort freigegeben; Aufnahmen bleiben nur im Arbeitsspeicher (`S.shadow`). Die Spracherkennung ist eine Zugabe: Zwischenergebnisse färben verstandene Wörter schon beim Sprechen.

Das Rundenende (`viewRunDone`) arbeitet mit `S.run.res`, einem Eintrag je erster Antwort (Satz-ID oder Generator, richtig, fast, neu). `roundTopics` gruppiert danach nach Thema, `topicsHtml` zeigt die Punkte und bündelt Fehler, wenn ein Thema klar vorn liegt. Jedes Thema mit Fehler steht da, bis fünf Zeilen mit fehlerfreien aufgefüllt; der fehlerfreie Rest klappt auf (`S.topicsAll`, nach jeder Runde wieder zu). `bonusCands` wählt die Ausdrücke für den Bonus „Eigener Satz“ (Lücke, sonst das in der Satzbank seltenste Inhaltswort), `bonusCheck` prüft ohne Netz. Der Bonus-Stand liegt in `S.run.bonus` und wird nicht gespeichert.

Die Lernminuten auf „Fortschritt“ (`minutesHtml`) zeigen die letzten 14 Tage als gestapelte Säulen je Sprache. `actOf` summiert für eine Reihe von Tagen je Sprache das Tagesprotokoll `DB.log` (Minuten, Aufgaben, neue Sätze), die Tagwerke und die Fehlerquellen `DB.tlog` (erste Versuche und Fehler je Übungsart und Thema). `dayCard` zeigt das für den angetippten Tag als kleine Tabelle; der Kalender nutzt dieselbe Karte. Wie im Kalender ist nichts vorgewählt, ein zweiter Tipp schließt die Karte. Die Auswahl liegt nur in `S.minDay`.

„Thema üben“ (`viewPickTopic`, Zeilen aus `topicRows`) zeigt zwei Gruppen: Satz-Themen mit Balken für den gefestigten Anteil am Bestand, erzeugte Themen (`kind:'gen'`) mit grünem Balken für den Anteil richtig (`genRate`: die letzten bis zu 50 aus `gen.recent`), erst ab 10 Aufgaben. Der Text kommt aus `genStatText`, das auch das Grammatik-Training nutzt: derselbe Anteil in Prozent, unter 10 Aufgaben als Anzahl. „Meiste Fehler, letzte 30 Tage“ auf „Heute“ (`weakTopics`, `weakHtml`) nimmt die Themen-Zahlen aus `errStats` in der Reihenfolge der Fehlerquellen (Fehler, bei Gleichstand Aufgaben), erst ab 8 Fehlern in der Sprache, je Thema mindestens 2 und nur Themen aus `topicIds`.

Das Tagwerk (`dailyPlan`) besteht aus fälligen Wiederholungen (`pickDue`), neuen Sätzen (`pickNew`) und Grammatik-Aufgaben. Wiederholungen: je Thema höchstens ein Viertel der Plätze (bei „Normal“ 5 von 20); was darüber hinausgeht, bleibt fällig und kommt am nächsten Tag zuerst, Sätze ab zwei Tagen überfällig füllen freie Plätze auch über die Grenze. Neue Sätze: der Schwerpunkt der Woche mit einem Drittel, sonst höchstens zwei je Thema. `spreadTopics` ordnet alles als Zufallsreihe; nach einer Aufgabe kommt dasselbe Thema (`taskTopic`: Thema des Satzes oder des Generators; eigene und Tatoeba-Sätze je für sich) nur mit halbem Gewicht (`REPEAT_DAMP`). Zuerst kommt eine Wiederholung. Dieselbe Dämpfung und dieselbe gewichtete Auswahl (`pickWeighted` in `generators.js`) nutzt „Fehler finden“ für die Fehlerart der nächsten Aufgabe: mischen, ohne zu verbieten, damit sich aus der letzten Aufgabe nichts sicher ablesen lässt.

Die Zeitschätzung (`minutes`, `paceFn`) nutzt das eigene Tempo: `DB.pace[sprache][übungsart]` hält die Sekunden der letzten 20 ersten Versuche (gemessen beim „Weiter“, ohne Werte ab zwei Minuten). Ab 5 Werten zählt die Übungsart selbst (Mittel ohne die langsamsten 10 %), ab 8 Werten insgesamt werden die Richtwerte `SECS` im selben Verhältnis angepasst, sonst gilt der Median von Sekunden je Aufgabe der letzten 30 Übungstage aus `DB.log` (ab drei Tagen mit mindestens 10 Aufgaben), sonst `SECS`. Dazu 10 % für zweite Versuche.

Ein Satz durchläuft drei Stufen (`stage`): neu und bis zur zweiten richtigen Antwort Lücke (Wortstellungs-Themen: Kacheln), danach freie Übersetzung. Beim ersten Kontakt zeigt die Lücke einer festen Wendung ihr wörtliches Bild (`literalOf`, aus „(wörtlich: …)“ in der Erklärung) als Hinweis-Chip, bei „Fortgeschritten“ hinter „Wörtlich zeigen“ wie die Grundform und das Muster der Verbalperiphrasen („Muster zeigen“, `tip` der erzeugten Aufgabe; `tipChip`); beim zweiten Versuch in derselben Runde und ab dem zweiten Kontakt nicht mehr. Kacheln liegen nie in einer Reihenfolge, die schon gilt, auch nicht in der einer Alternative; das Ablenkwort zählt dabei nicht mit. Ob ein Satz neu oder fällig war (`markSeen`), wird beim Prüfen und bei „Weiß ich nicht“ gleich festgestellt; davon hängen Tagesprotokoll (neu oder Wiederholung) und Rückfälle (`lapses`) ab.

Vorgelesen wird, was als Lösung im Rückmeldefeld steht: `solShown` liefert diesen Text für die Anzeige, den Knopf daneben und `autoSpeak`. Bei erzeugten Lückenaufgaben ist das immer der ganze Satz (`full`), bei Uhrzeiten und Preisen der ganze Satz mit dem Gesuchten fett, bei Satzbank-Sätzen die richtige Fassung, die der Antwort am nächsten liegt (die Hauptfassung mit Tatoeba-Aufnahme, wenn es eine gibt).

Die Fortschrittsleiste einer Runde (`progressBar`) hat ein Feld je Aufgabe. `runMarks` liefert den Stand: Ergebnis aus `got` an der Aufgabe (ältere Runden ohne `got`: der Reihe nach aus `res`), die aktuelle Aufgabe nach dem Prüfen schon mit ihrem Ergebnis. Farben wie die Ergebnisleiste am Rundenende; zweite Versuche stehen als eigene Gruppe am Ende.

## Datenspeicher

`DB` liegt als JSON unter `localStorage['tagwerk-offline-v1']` und wird 150 ms nach jeder Änderung gespeichert, sofort beim Wechsel in den Hintergrund. Backup und Wiederherstellung exportieren genau dieses Objekt (`backupText`, `parseBackup`, `applyBackup` in `part_head.js`). Nach dem Einspielen und nach „Rückgängig“ kommt ein offenes Tagwerk aus dem neuen Stand (`runsFromDB`), nicht aus dem Arbeitsspeicher. Der Speicher gehört zur Adresse (Origin), nicht zu den Dateien: Ein Update unter demselben Link behält den Stand.

| Feld | Inhalt |
|---|---|
| `settings` | Rundenlänge, Sprache, Nachschub, Vorlesen, Extra-Aufgaben beim Schreiben, Aussprachehilfen (`shHints`, fehlt = an) |
| `st[id]` | Lernstand je Satz: FSRS-Stabilität `s`, Schwierigkeit `d`, Intervall `ivl`, `due`, `last`, Zähler, eigene richtige Fassungen |
| `log[datum][sprache]` | Aufgaben, neue Sätze, Wiederholungen, gefestigt, Sekunden; seit 24.63 der Bestand am Tagesende: gefestigt `mc`, verankert `ac` (fehlt bei 0). Behält 400 Tage (`pruneLog`); ältere Tage gehen als Monatssumme in `logArch` |
| `done[datum]` | Tagwerk erledigt |
| `run` | offenes Tagwerk von heute (Pause): Aufgaben `queue` (zweite Versuche mit `requeue`, nach der Antwort Ergebnis `got`: ok, near, bad), Stand `idx`, Rundenergebnis `res` (mit Abstand vorher `pivl` und nachher `ivl`), verpasste Sätze `missed`, Etappen beim Start `wayBefore` |
| `snap[datum][sprache]` | Tagesstand (älter als 120 Tage nur sonntags und am Monatsende, `compactSnaps`): geübt `n`, gefestigt `m`, abrufbar `k`, Wortschatz `w`, gefestigt je Thema `t` |
| `tlog[datum]` | Fehlerquellen je Thema (`p:`), Übungsart (`t:`), Fehlerart (`e:`), Stunden `h`; nach 120 Tagen gelöscht |
| `tblk[sprache][thema]` | Themen-Etappen: Fehler je vollem Block zu 60 Aufgaben `b` (ändert sich nicht mehr), laufender Block `cn` Aufgaben, `cb` Fehler; bleibt, wenn `tlog` verfällt (Stände bis 24.63.0 bauen ihn beim Laden aus `tlog` auf, `tbase` entfällt) |
| `etap` | erreichte Themen-Etappen `{ d, l, k, s, b, c, i }`: Datum, Sprache, Thema, Stufe (1 halbiert, 2 sitzt), früherer und letzter Abschnitt als `[Aufgaben, Fehler]`, erster Block des letzten Abschnitts (Bezug für die nächste Halbierung) |
| `way` | einmal erreichte Etappen außer Themen `{ d, k, l, v }` mit Datum (`persistWay` am Rundenende, beim Start und bevor Protokolltage herausfallen). Text und Zeichen entstehen beim Anzeigen (`wayLabel`) |
| `logArch` | aus dem Protokoll gefallene Tage: erster Übungstag `first`, je Monat `m[jjjj-mm]` die Übungstage `days` und je Sprache `n`, `secs`, `fresh`, `mat`. Zählt in „Dein Weg“, den Gesamtzahlen und „Jahr für Jahr“ mit (`archSum`) |
| `first[sprache][monat]` | Erster Kontakt mit neuen Sätzen (`noteFirst`) je Thema und Stufe, Schlüssel `thema:3` (1 bis 3 = A2 bis B2, `t` = Tatoeba): `[Aufgaben, Fehler]`, gewertet wie die Fehlerquellen; nur Lücke und Kacheln, also die Form, in der neue Sätze kommen. Ohne Löschfrist (wenige Zahlen je Monat); fehlt in Ständen vor 24.61; Zurücksetzen einer Sprache löscht ihren Teil |
| `gen`, `genus` | Ergebnisse der erzeugten Aufgaben und der Genus-Wörter |
| `own`, `tat` | eigene Sätze, Sätze von Tatoeba |
| `texts` | Textarchiv mit Messwerten (höchstens 500) |
| `pace[sprache][übungsart]` | Sekunden der letzten 20 ersten Versuche für die Zeitschätzung (fehlt in älteren Ständen; Zurücksetzen einer Sprache löscht ihren Teil) |
| `used` | Hinweise, Wiederholungsgedächtnis der Generatoren und Runden, Schreibaufgaben, gelesene Texte (`texts`, Schlüssel `sv:vasa`), beim Lesen nachgeschlagene Wörter (`looked['sv:vasa'][wort] = datum`, höchstens 300 je Sprache; fehlt in älteren Ständen), zuletzt gezeigte Monatsbilanz `monthShown` |

Ältere Speicherstände werden beim Laden ergänzt. Das Format darf sich ändern, wenn der Lernstand dabei erhalten bleibt: Was umbenannt oder zusammengelegt wird, wandelt das Laden um, damit der gespeicherte Stand und Backups aus allen Versionen lesbar bleiben.

## Etappen

`wayEvents` leitet alle Etappen aus gespeicherten Daten ab (Protokoll mit `logArch`, Tagesstände, Tagwerke, `etap`), mit einer Schwellenliste je Art (`milestoneList`, `streakList`, `anchoredList`, `ladder`), und nimmt die gespeicherten aus `way` dazu; bei gleicher Kennung (Art, Sprache, Wert) gilt das gespeicherte Datum. So bleibt eine Etappe mit ihrem Datum stehen, auch wenn Tagesstände ausgedünnt werden, Protokolltage herausfallen oder eine Zahl wieder sinkt, und sie kommt beim erneuten Erreichen nicht noch einmal. Serien zählen nach derselben Regel wie die Anzeige (`streakWalk`, auch für „Jahr für Jahr“). Gefestigt und verankert zählen nach dem Bestand am Tagesende (`mc`, `ac`), für ältere Tage nach der Summe der neu gefestigten Sätze. Beim Start einer Runde hält `wayKeys` die Kennungen fest (`run.wayBefore`, in offenen Tagwerken mit `wayV`, damit Kennungen einer älteren Fassung nicht verglichen werden); `finishRun` vergleicht danach und legt die neuen Etappen in `run.miles`, dazu die Sätze, die in der Runde die Schwelle überschritten haben (`crossedIn`), und beim ersten Tagwerk im Monat die Monatsbilanz (`monthCard`). Die Ansicht zeigt eine Hauptetappe nach `WAY_PRIO` als Ausschnitt mit voriger und nächster Etappe derselben Art (`mileHtml`), den Stempel mit Siegelrand (`stampSvg`) und vibriert kurz, kurz, lang.

`wayHtml` zeichnet „Dein Weg“ als Gleisplan mit drei Spuren (Schwedisch, gemeinsam, Spanisch). Oben die nächsten Ziele, sortiert nach `wayEta` (Tempo der letzten 14 Tage, Serien nach Kalender, gefestigte Sätze nach den Fälligkeiten der Sätze, die beim nächsten Richtigen `MATURE` erreichen; nur für die Reihenfolge), dann die Linie „heute“, die letzten `WAY_DETAIL` (5) Etappen einzeln, ältere je Jahr gefaltet (`S.wayOpen`, nicht gespeichert; `S.wayAnim` für die Bewegung beim Aufklappen), ganz unten der erste Übungstag. Ein Tag wird nicht getrennt; insgesamt oder je Jahr höchstens zwei ältere Etappen stehen ohne Faltung. Zwischen zwei sichtbaren Etappen steht ein Abschnitt mit eigener Höhe (`wayGapPx`: 7 px mal Wurzel der Tage, höchstens 84), darin tagesgenau als SVG die Spuren, gestrichelt in Pausen ab 3 Tagen je Sprache (`wayRuns`, nur Tage ab dem ersten Protokolltag), ein Jahreswechsel als Trennlinie und der Text aus `wayGapText` (Dauer ab 2 Wochen, Pausen). Neben gefalteten Jahren steht kein Abschnitt.

Themen-Etappen (`checkTopics`, `topicJudge`, `part_stats.js`): Jede gewertete Antwort eines Themas geht in Blöcke zu 60 Aufgaben (`blockAdd`). Geprüft wird nur, wenn ein Block voll wird; ein voller Block ändert sich nicht mehr, so entstehen keine immer neuen Vergleiche mit verschobenen Fenstern. Verglichen werden gleich große Abschnitte aus 1, 2, 4, 8 … Blöcken, gezählt ab der letzten Halbierung des Themas: der gerade volle Abschnitt gegen bis zu drei frühere, ab 480 Aufgaben gegen alle früheren seit der letzten Halbierung. „Fehler halbiert“: höchstens halb so viele Fehler, z ≥ 3,5 im Vergleich zweier Anteile (ab 480 Aufgaben z ≥ 3). Danach ist der neue Stand der Bezug, jede weitere Halbierung kommt als „Fehler wieder halbiert“. „Sitzt“ (einmal je Thema): ein früherer Abschnitt von 120 oder 240 Aufgaben sicher über 15 % falsch (untere Wilson-Grenze, 95 %), der letzte sicher darunter (obere Grenze, 99 %). `tools/themen-etappen.js` simuliert die Regel mit erfundenen Verläufen: etwa eine falsche Halbierung je 60 Themenjahre bei gleichbleibender Quote, echte Verbesserungen kurz- wie langfristig erkannt.

Firefox erlaubt pro Adresse etwa 5 MB localStorage, und alle Seiten unter `caionnew.github.io` teilen sich diese Grenze. `STORE` (`part_head.js`) misst beim Start den eigenen Stand und alles andere unter der Adresse, `save()` aktualisiert die eigene Größe. Die Einstellungen zeigen die Belegung als Balken; ab 3 MB (`STORE_WARN`) warnt auch „Heute“. Beim Start bittet die App mit `navigator.storage.persist()` darum, dass der Browser die Daten nicht bei Platzmangel löscht; das gilt für allen Speicher der Adresse. Lehnt der Browser ab, bieten die Einstellungen „Dauerhaft speichern“ an, denn auf eine Handlung hin stimmen Browser eher zu.

## App-Symbol

`design/icons/*.svg` sind Entwürfe auf 512 × 512 mit dem Motiv im inneren Kreis (80 %, sichere Zone für Masken). `tools/icons.js` rendert den in `design/icons/AKTIV` genannten Entwurf zu `public/icon-192.png` und `icon-512.png` (rund, Ecken durchsichtig, `purpose: any`) und `icon-maskable-512.png` (randlos, `purpose: maskable`). Farben aus der App: Blau `#1D5689`, Safran `#E3A21A`, Papier `#F3F5F4`.

## Bewegung

Nur als Antwort auf eine Handlung und kurz: Rückmeldung und Fenster blenden ein, Wortkästchen gleiten (FLIP mit der Web Animations API, `flyFrom`), ein Feld der Fortschrittsleiste färbt sich beim Prüfen, das Rundenende baut seine Ergebnisleiste einmal auf, der Tagesstempel zeichnet sich, an Etappentagen danach sein Siegelrand. `prefers-reduced-motion: reduce` schaltet alles ab.

## Online und offline

Offline funktioniert alles außer: Wikipedia-Fundstück, Nachschub und Suche bei Tatoeba, Textprüfung mit LanguageTool, Wiktionary-Erklärungen für unbekannte Wörter, Spracherkennung beim Nachsprechen (Chrome). Aufnehmen und Auswerten beim Nachsprechen gehen offline. Diese Dienste werden nur bei einer Aktion angefragt und nie zwischengespeichert. Die App lädt keine fremden Schriften, Skripte oder Tracker.

## Tests

- `tests/unit/` (Node, ohne Browser): Inhalte, Wörterbuch-Abdeckung, FSRS gegen die Referenz, Wiederholungssperre, Rundenauswahl, Serienregel, Feste, Fehlerart, Schreibprüfung. `tests/helpers/load.js` lädt die Quellen in eine VM und ersetzt die Oberfläche durch Platzhalter.
- `tests/unit/lint.test.js` prüft mit ESLint (`tools/lint.js`) das Gesamtskript in Bau-Reihenfolge, wie es im Browser läuft: undefinierte und doppelt vergebene Namen, doppelte Schlüssel, unbenutzte Variablen, toter Code. Einzelne Dateien allein ergäben Fehlalarme, weil sie Namen aus anderen Dateien benutzen. Funde nennen Datei und Zeile der Quelle.
- `tests/e2e/` (Playwright, Handygröße): Start, kompletter Tagwerk-Durchlauf, Fortschrittsleiste, Wortkästchen, „Meine ist auch richtig“, Nachschlagen, Fortschritt, Schreiben, Land & Leute, Teilen, Schnellzugriff, reduzierte Bewegung, Offline-Start, Speicheranzeige. Jeder Test schlägt fehl, sobald die Seite einen JavaScript-Fehler wirft. Die Tests laufen gegen `tools/serve.js` unter `http://127.0.0.1:4173/` (startet `playwright.config.js` selbst), also mit Service Worker, eigenem Speicher je Test und echtem Neuladen. Standard ist Chromium; mit `PW_FIREFOX=1` kommt das Projekt `firefox` dazu. In der CI läuft Firefox als eigener Job neben Chromium; beide müssen grün sein. Die Tests zum Nachsprechen überspringen Firefox, weil nur Chromium ein Mikrofon vortäuschen kann.

## Sichtprüfung

`node tools/sicht.js` fotografiert die Hauptansichten (Heute, erledigtes Tagwerk, Üben, Fortschritt, Aufgabe, Rückmeldung, Rundenende mit Themen und Bonus, Einstellungen, Textliste, Hören nach der ersten Antwort, Text nach den Fragen) mit einem Profil aus 90 geübten Sätzen und sechs Wochen Verlauf in 390 × 844 und 411 × 923, hell und dunkel, nach `sicht/`. Mit `--vs <Git-Stand>` baut es den älteren Stand in einem eigenen Arbeitsbaum, fotografiert ihn ebenso und legt für jede geänderte Ansicht ein Bild „vorher | jetzt“ nach `sicht/vergleich/`; die Ausgabe nennt die geänderten Bilder. `Math.random` ist im Browser festgelegt, damit beide Stände dieselben Aufgaben zeigen. `--nur heute,aufgabe` beschränkt die Ansichten, `--ganz` fotografiert die ganze Seite.
