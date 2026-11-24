# Ideen für Tagwerk

Lohnende, noch nicht umgesetzte Ideen, mit Bewertung (A bis D) und den Gründen, dazu der Fahrplan für die nächsten Updates. Was umgesetzt ist, kommt hier heraus und steht im [Änderungsverlauf](../CHANGELOG.md). Themen für weitere Lesetexte stehen unten; Leitlinien und die Liste der geschriebenen Texte in [CONTENT.md](CONTENT.md#lesetexte-srcdatatextejs).

Stand: 24. November 2026 (nach 24.71.0)

Bewertet nach: Wirkung aufs Lernen auf fortgeschrittenem Niveau, wie oft es im Alltag greift (täglich im Tagwerk oder selten), Passung zu den Grundsätzen (offline, ohne KI, ohne Spielerei), Aufwand und Fehlerrisiko.

## Lagebild

- **Inhalte:** 529 schwedische und 659 spanische Sätze, davon 324 bzw. 408 auf B2, in 16 bzw. 19 Themen; 23 bzw. 25 Lesetexte. Jeder Satz hat eine Erklärung. Die Grammatikthemen für B2/C1 sind vollständig (24.41 bis 24.43: Verbalperiphrasen, Subjuntivo im Satzgefüge, Pluralklassen, Modalpartikeln, Redewendungen).
- **Übungen:** fast alles da. „Fehler finden“ ist seit 24.45 bis 24.48 eine echte Prüfaufgabe: Richtige Sätze sind dabei, Formfehler werden verbessert, es gibt sieben Fehlerarten je Sprache, und welche kommt, richtet sich nach deinen Fehlern.
- **Prüfqualität bleibt das Wichtigste.** Jede falsche „Falsch“-Wertung kostet Zeit und Vertrauen. Generatoren (24.37) und Satzbank (24.38) sind durchgesehen; falsch bewertete Antworten meldest du direkt.
- **Wenn die B2-Sätze aufgebraucht sind,** bleibt der Nachschub von Tatoeba, ohne Erklärung je Satz und ohne geprüfte Alternativen. Dann bringen neue kuratierte Satzblöcke mehr als neue Funktionen.
- **Browser-Tests** laufen in Chromium und Firefox, beide verbindlich. Firefox hat keine Spracherkennung; was darauf aufbaut, kommt bei dir nicht an.

## Fahrplan

Bei den Funktionen ist der Stand gerade die beste Lösung: Fehler beheben, die beim Üben auffallen, Updates bündeln. Die Arbeit geht in die Inhalte. Daneben räumt die App in drei Schritten auf, was beim Wachsen nicht mehr zusammenpasst.

### Aufräumen nach der Durchsicht vom 22.11.

Befund: kein Neubau nötig. Kein toter JS-Code (ESLint), 0,6 % doppelte Stellen im Scan, Doku und Code stimmen überein, Tests dicht. Gewachsen ist die App an den Rändern: kein festes Gestaltungssystem, mehrfach berechnete Kennzahlen, ein paar sichtbare Widersprüche.

Alle drei Schritte sind erledigt: Fehler und Einheitlichkeit 24.66.1, je eine Stelle im Code und Gestaltungssystem 24.66.2 und 24.67.0, Fortschritt 24.69.0.

Schritt 3 fiel kleiner aus als gedacht. Mit zwei Sprachen verglichen (23.11.): Im Überblick wiederholte „Jahr für Jahr“ im ersten Jahr die Kopfkarte samt Tagwerken je Sprache; es steht jetzt erst ab dem zweiten Jahr da, der Überblick ist von 3,4 auf 3 Bildschirme kürzer. „Wann du übst“ bleibt eine eigene Karte: Die Verteilung über den Tag zeigt mehr als der Satz allein (in 24.69.0 kurz nur der Satz, auf deine Rückmeldung in 24.69.1 zurück). Der Sprach-Tab bleibt, wie er ist: „Stand der Sätze“ in die Kopfkarte zu ziehen sparte nur ein Zehntel Bildschirm und nähme den Balken zum nächsten Ziel (siehe „Geprüft und zurückgestellt“).

### Inhalte: Satzpakete (ab 24.56; Pakete 1 bis 5 erledigt, 24.56 bis 24.60)

Befund vom 19.11. (`tools/vielfalt.js`, Häufigkeitslisten): Die Satzbank übt Grammatik mit schmalem Alltagswortschatz (590 Grundformen im Schwedischen, am häufigsten gå, komma, morgon). B2-Sätze hatten im Schnitt 7,8 Wörter, und je Thema reichten 12 bis 16 B2-Sätze bei „Fortgeschritten“ für gut eine Woche als Schwerpunkt. Darum je Thema neue B2-Sätze, länger und mit Wörtern, die der Satzbank fehlen.

| Paket | Inhalt | Note | Stand |
|---|---|---|---|
| 6 | Vermutung mit Futur, „wohl“ (Serán las tres) | B+ | als Nächstes |
| 7 | Kollokationen als eigene Übung (fatta beslut, tomar una decisión), je Sprache mindestens 36 | B+ | |
| 8 | Relativsätze (lo que, el que, cuyo; vars, vilket) | B+ / B | |

So entsteht ein Paket:
- **Wortschatz steuern:** Zielwörter aus Häufigkeitslisten (wordfreq, OpenSubtitles), Rang 1500 bis 8000, die der Satzbank fehlen, quer durch Arbeit, Gesellschaft, Gesundheit, Medien, Gefühle, Argumentieren. Die Listen dienen nur der Auswahl, in die App kommt nichts davon.
- **Anregung, keine Übernahme:** Schwedische Sätze aus Common Voice (gemeinfrei, CC0) zeigen natürliche Muster; übernommen wird nichts wörtlich, viele stammen aus alten Romanen. Tatoeba, Korp und Wikipedia sind aus der Arbeitsumgebung nicht erreichbar.
- **Messen:** `node tools/vielfalt.js` gegen den letzten Stand, erst nach dem Eintrag ins Wörterbuch (sonst zählt jede neue Verbform als neues Wort). Ziel: mindestens 40 % neue Inhaltswörter, Hilfsverben und Kopula nicht mitgezählt (Paket 1: 44 %, Paket 2: 42 %, Paket 4: 43 %, Paket 5: 41 %, nachdem 24 Sätze frischere Wörter bekamen; angepeilt war die Hälfte, Grammatiksätze brauchen viele Alltagsverben), im Schnitt mindestens 9 Wörter, kein Satzanfang öfter als dreimal. Die Ziele gelten für B2-Pakete; ein neues Thema beginnt bei A2 mit kurzen Sätzen und Grundwortschatz (Paket 3: 32 %, 8,3 Wörter). Ein Test hält die B2-Sätze dauerhaft abwechslungsreich (Anfänge, erste Person).

### Danach

1. **Neue Sätze beim ersten Mal richtig, je Thema und Monat (B+, Anzeige ab Januar):** „Konditional, neue B2-Sätze: November 14 von 20, Januar 26 von 30.“ Misst, ob die Grammatik bei Sätzen sitzt, die du noch nie gesehen hast; „gefestigt“ zählt dagegen das Gedächtnis für bekannte Sätze und wächst vor allem mit der Zeit. Gezählt wird seit 24.61.0 (`DB.first`, unsichtbar), immer in derselben Übungsform und getrennt nach Stufe. Anzeige gestalten, wenn zwei Monate Daten da sind, mit echtem Backup: nur gleiche Stufe im Vergleich (bei „Fortgeschritten“ B2), Anzahlen statt Prozent bei kleinen Mengen. Ersetzt die Wochenbilanz zum Schwerpunkt, die an wechselnden Übungsarten und Niveaus gescheitert wäre.

Sonst nach Bedarf aus „Bewertet: lohnend“; neue Lesetexte aus den Themen unten (46 von 48 noch ungelesen, darum vorerst C+).

## Bewertet: lohnend

### Inhalte und Niveau

1. **Adjektivsteigerung, Schwedisch (B).** bra, bättre, bäst; gammal, äldre, äldst; få, färre, färst. Kleiner Generator, begrenzter Nutzen auf B2.

### Prüfung und Rückmeldung

2. **Übereinstimmung in deinen Übersetzungen messen (B+).** Gleiches Wort, nur die Endung für Geschlecht oder Zahl anders (bonito/bonita, este/esta, lo/la, buen/buena) als eigene Fehlerart in den Fehlerquellen. Zeigt an echten Sätzen, ob die Übereinstimmung überhaupt ein Engpass ist und „Nomen tauschen“ (24.70) öfter kommen sollte.
3. **Fehler finden mit zwei Kandidaten (B).** Sätze mit zwei typischen Fehlerstellen verschiedener Sorten, höchstens eine davon falsch: ein ser/estar und ein por/para (Estoy en Madrid por trabajo), im Schwedischen etwa eine Inversion und ein Adjektiv mit en/ett-Endung. Dann reicht es nicht, das einzige kritische Wort zu finden; man muss beide prüfen. Nächster Schritt nach 24.45 (richtige Sätze, Verbessern). Braucht neue Satzvorlagen, je Sprache mindestens 36 (dreimal die Wiederholungssperre), mit einer Erklärung zu beiden Stellen.
4. **Verwechslung beim Namen nennen (B).** Erkennt die Prüfung ein vertauschtes Paar (por/para, ser/estar, en/ett, sin/hans), steht in einer Zeile, was hier gilt und warum. Ergänzt die Erklärung je Satz um die gemachte Verwechslung; für Präteritum/Perfekt gibt es das schon, für ein vergessenes Reflexivpronomen seit 24.62.0 (quedamos statt nos quedamos).
5. **Verbindungen von Alternativen automatisch gelten lassen (B).** Ändern zwei Alternativen verschiedene Stellen eines Satzes (Wortstellung und ein Synonym, ya und Zeitform), fehlt oft ihre Verbindung: Am 24.11. waren es 732 Sätze, etwa „Fast hon har bott länge i Sverige …“ oder „Si me hubiese levantado más temprano, habría tomado el tren“. Die Prüfung könnte solche Verbindungen beim Aufbau der Satzbank selbst bilden. Fast alle Stichproben waren richtig, aber jede erzeugte Fassung muss vorher gelesen werden (Übereinstimmung über zwei Stellen hinweg). Betrifft vor allem das freie Übersetzen, wo es „Meine ist auch richtig“ gibt; Lücken und Wortkästchen sind durchgesehen (24.70.2, 24.71.0).

### Hören und Sprechen

6. **Hörunterscheidung, spanische Betonung (B, vorher B+), sonst Minimalpaare (B).** Nett, aber kein Engpass. término, termino, terminó: Betonung entscheidet über die Bedeutung, und die Akzente zählen beim Prüfen nur als „fast richtig“. Schwedische Paare (tak, tack) bringen auf deinem Niveau weniger. Paare nur aus geprüften Listen.
7. **Unterwegs: Deutsch hören, selbst sagen, dann die Lösung (B).** Anders als die Hörrunde (erst die Zielsprache) übt das den Abruf, ohne Antippen. Ohne Wertung, also ohne Wirkung auf die Wiederholung; nutzt die Bildschirmsperre-Lösung der Hörrunde.
8. **Muttersprachler-Aufnahmen offline (B, vorher B+).** Nutzen klar, Machbarkeit offen: Tatoeba liefert die Dateien vermutlich ohne CORS-Freigabe, dann wären sie im Cache nur undurchsichtig nutzbar, und der Speicher wächst. Erst prüfen, dann entscheiden.
9. **Diktat ganzer Lesetexte (B−).** Längeres Hören mit Zusammenhang; die Hörrunde und das Diktat decken viel davon schon ab.

### Schreiben

10. **Korrekturen aus dem Schreiben ins Tagwerk (C+ solange du nicht schreibst, sonst B+).** Aus eigenen Fehlern lernt man am meisten. Herabgestuft, weil LanguageTool für Schwedisch fast nur die Rechtschreibung prüft und es nur greift, wenn du regelmäßig schreibst.

### Planung und Rückblick

11. **Bedeutung von „gefestigt“ hinschreiben (B+).** In Zeile und Erklärtext, und bei der Etappe am Rundenende (im Etappen-Vergleich vom 21.11. „Ein Satz, was die Zahl heißt“, A−): „Sätze, die du auch nach drei Wochen ohne Üben noch weißt“. Stimmt genau: Der geplante Abstand ist bei FSRS die Zeit, bis die Erinnerung auf 90 % fällt, und die Wiederholung, die einen Satz festigt, ist im Tagwerk frei aus dem Deutschen geschrieben. Klein, ändert keine Zahl.
12. **Zuwachs in der Sprachen-Kachel (B, ab Mitte Dezember).** „+18 in 7 Tagen“ statt „heute geübt“ (das zeigt der Kalender darüber). Zeigt das Tempo je Sprache; misst aber wie „gefestigt“ vor allem Regelmäßigkeit. Daten liegen im Tagesstand.
13. **„Verankert“ ausblenden, bis der erste Satz es ist (B−).** Frühestens im Mai 2027 möglich; bis dahin steht in „Stand der Sätze“ eine feste Null.
14. **Nachschub nach Worthäufigkeit (B−, vorher B+).** Hilft erst, wenn die eingebauten Sätze aufgebraucht sind und der Nachschub läuft; kuratierte B2/C1-Sätze bringen mehr. Braucht eine frei lizenzierte Häufigkeitsliste.
15. **Etappen, geprüft am 21.11., nicht gewählt (je B).**
    - **Persönliche Bestwerte:** längste fehlerfreie Folge, meiste Aufgaben an einem Tag. Belohnt eher Menge als Können und kann zu Druck werden.
    - **Damals und heute:** ein Satz aus den ersten Tagen, den du damals falsch hattest und heute gefestigt hast. Braucht Monate an Daten, ab dem Frühjahr 2027 sinnvoll.
    - **Balken bis zur nächsten Etappe am Rundenende:** Den Abstand nennt schon der Ausschnitt aus „Dein Weg“ („noch 15“); Fortschritt hat den Balken.
16. **Deine letzten Fehler im Themenblatt, auch auf Fortschritt (C+).** Am Rundenende stehen sie seit 24.68 beim Thema. Überall bräuchte es ein dauerhaftes Protokoll falscher Antworten je Thema; erst, wenn sich das Aufklappen am Rundenende bewährt.
17. **Hartnäckige Sätze anders üben (B−).** Ab vier Fehlversuchen erst die Lücke statt des ganzen Satzes, mit der Regel davor. FSRS holt solche Sätze ohnehin oft; erst angehen, wenn sie sich in der Statistik häufen.


## Lesetexte: Themen für später

Fakten noch nicht geprüft; vor dem Schreiben an Quellen prüfen (Leitlinien in [CONTENT.md](CONTENT.md#leitlinien-für-themen)).

Schwedisch:
- Tvättstugan: die Waschküche im Mietshaus, Buchungslisten und Zettelkriege. (Alltag)
- Kräftskivan: Krebsessen im August, Lieder und Papierhüte. (Brauch)
- Namnsdagar: Namenstage im Kalender. (Brauch)
- Göteborgsvitsar: der Göteborger Wortwitz. (Lokales)
- Älgtestet 1997: Ein schwedisches Ausweichmanöver bringt die Mercedes A-Klasse zum Kippen. (Anekdote)
- Bandy: Hockey auf Natureis mit Ball, ein schwedischer Wintersport. (Sport)
- Sofja Kovalevskaja: 1889 erste Professorin für Mathematik in Stockholm. (Persönlichkeit)
- Fjällräven: der Polarfuchs in den Bergen, vom Aussterben bedroht. (Natur)

Spanisch:
- El Día de los Inocentes: Streiche am 28. Dezember. (Brauch)
- Las Fallas: riesige Figuren, die in Valencia verbrannt werden. (Brauch)
- Santiago Ramón y Cajal: Nobelpreis 1906 für die Erforschung der Nervenzellen. (Persönlichkeit)
- El ajolote: der Axolotl von Xochimilco. (Natur)
- Doñana: Erdbeeren, Brunnen und ein Feuchtgebiet in Not. (Natur, Umwelt)
- Castrillo Mota de Judíos: Ein Dorf ändert 2014 seinen Namen. (Anekdote, Geschichte)
- El Hierro: eine Insel, die mit Wind und Wasser Strom erzeugt. (Lokales)
- La pelota vasca: Frontón und Jai alai. (Sport)

## Offen: Rückmeldung von dir

- **Perfecto vs. Indefinido: welche Norm (24.11.).** 39 der 69 Sätze haben Perfecto als Lösung, 37 davon lassen auch das Indefinido gelten (Lateinamerika). Wer immer Indefinido schreibt, hat 67 von 69 richtig; geprüft wird nur „kein Perfecto bei ayer, el año pasado“. Vorschlag bei Spanien als Ziel (B+): Indefinido dort „fast richtig“ mit „In Spanien: he perdido“, zählt in den Fehlerquellen gegen das Thema. Bei Lateinamerika oder beidem (B): die 37 Sätze zählen nicht fürs Thema, das dann „Indefinido bei abgeschlossener Zeit“ heißt. So lassen: C. Dieselbe Frage stellt sich bei Indefinido vs. Imperfecto, wo der Aspekt oft beides zulässt.

## Nach echter Nutzung nachstellen

- **Nachsprechen, Schwellen (seit 24.26.0).** Pause ab 0,35 s, Stopp nach 1,2 s Stille, Tempo-Urteil bei 0,8 bis 1,25 des Originals. Begründete Startwerte, nur mit vorgetäuschtem Mikrofon getestet. Nachstellen, wenn die Aufnahme am Handy zu früh stoppt oder Stockungen falsch markiert.
- **Tempo bei Tatoeba-Aufnahmen.** Das genaue Urteil gibt es nur, wenn der Tatoeba-Server das Auslesen der Datei erlaubt (CORS). Ungetestet; sonst steht dort „ca.“ ohne Urteil.

## Geprüft und zurückgestellt

- **„Stand der Sätze“ in der Kopfkarte des Sprach-Tabs (B−, geprüft am 23.11.).** Der Balken verankert, gefestigt, im Aufbau, neu statt des Balkens zum nächsten Ziel, der eigene Abschnitt entfiele. Spart kaum Platz (2,8 auf 2,7 Bildschirme), die Kopfkarte wird dichter, und der Fortschritt zum nächsten Ziel stünde nur noch als Text da.
- **Fehlerquellen: andere Reihenfolgen (geprüft am 24.11., gewählt: geglättete Quote ab 10 Aufgaben, 24.71.0).**
  - **Anzahl der Fehler (C, bis 24.70):** misst eher, wie oft ein Thema drankommt; 7 von 73 stand vor 5 von 13.
  - **Rohe Quote ab 10 Aufgaben (B−):** einfach, aber bei wenigen Aufgaben sprunghaft.
  - **Untere Wilson-Grenze (B):** robust, aber die Reihenfolge widerspricht öfter den Prozent daneben.
  - **Fehler über der eigenen Quote (B):** wo Üben am meisten Fehler spart; eine neue, schwer greifbare Zahl, und die Liste wird leer, wenn alles gleich gut ist.
  - **Bereinigt nach Übungsart (C+):** fachlich am saubersten (Inversion kommt oft als Wortkästchen, Adjektive als getippte Lücke), braucht aber ein neues Feld Thema × Übungsart im Speicher und 30 Tage Daten.
- **Fehlerquellen nach Thema im Themenraster (C+).** Zwei Themenlisten im Sprach-Tab; zusammengelegt fehlte aber die Liste nach Fehlern, die auch „Heute“ zeigt.
- **Wochenbilanz zum Schwerpunkt (C+, vorher B−).** Ersetzt durch „neue Sätze beim ersten Mal richtig“ (Fahrplan): gleiche Übungsform und Stufe statt wechselnder Übungsarten.
- **Andere Hauptzahl statt „gefestigt“ (geprüft am 20.11.).** „Gefestigt“ bleibt: ehrlicher Bestand dessen, was dauerhaft sitzt, auch wenn die Zahl allein wenig erklärt und in den ersten drei Wochen bauartbedingt 0 ist.
  - **Bezugsgröße „97 von 529“ (B−):** zeigt der Balken „Stand der Sätze“ schon.
  - **Behalten als Hauptzahl (B−):** misst Qualität, nicht Fortschritt, und liegt planmäßig um 90 %. Steht als Zeile darunter.
  - **„Kurz davor“: beim nächsten Richtigen gefestigt (C+):** nur in den ersten Wochen interessant.
  - **Festigungsquote, Anteil gefestigt unter alten Sätzen (C+):** läge stabil um 80 % und sagt dasselbe wie „Behalten“.
  - **Prognose nach einer Pause (C+):** stützt sich auf den unsichersten Teil des Modells.
  - **Mittlere Haltbarkeit (C+):** sinkt, sobald mehr Neues dazukommt, und sieht dann nach Rückschritt aus.
  - **Geübte Sätze oder Wörter (C+), abrufbar (C):** zählen Angefangenes; „abrufbar“ ist kurz nach dem Üben fast gleich „geübt“.

- **Schriftgröße einstellbar (C+, vorher B).** Bisher kein Bedarf; die Übungen sind auf feste Höhen ausgelegt, jede Stufe bräuchte eigene Layout-Tests.
- **Lernminuten ohne Bahn, Säulen frei auf einer Grundlinie (B−, geprüft am 22.11.).** Leichter und wie „Wann du übst“, aber leere Tage sind nur ein kurzer Strich, und vierzehn Tage ohne Übung wirken fast leer. Die Bahn zeigt jeden Tag als Platz.
- **Lernminuten: Sprachen nebeneinander statt übereinander (C+, geprüft am 22.11.).** Jede Sprache stünde auf der Grundlinie, aber zwei Säulen von 6 px je Tag sind unruhig, und die Summe des Tages ist schwerer zu sehen.
- **Übrige Säulen abblenden, wenn ein Tag gewählt ist (C+, geprüft am 22.11.).** Im Dunkeln werden die Farben matt; die Markierung der Säule reicht.
- **Rundenende: Themen und „Noch nicht sicher“ zusammenlegen (B−, geprüft am 22.11.).** Jeder falsche Satz unter seinem Thema; liegt jeder Fehler in einem anderen Thema, doppeln sich die beiden Listen fast. Aber Umbau zweier Abschnitte, und das Muster großer Themen („1 von 7 falsch“) ginge verloren. Wieder ansehen, wenn die Doppelung nach längerer Nutzung stört.
- **Üben-Seite straffen (C+).** 20 Einträge in sechs Gruppen; lang, aber gegliedert. Erst angehen, wenn etwas Neues dazukommt.
- **Eigene FSRS-Parameter aus deinen Wiederholungen (C).** Bräuchte ein Protokoll jeder Wiederholung (Speicher) und Monate an Daten; die Standardparameter treffen im Benchmark bereits gut.
- **Größeres Offline-Wörterbuch (C).** Frei lizenzierte Deutsch-Schwedisch-Daten sind dünn, dict.cc ist nicht frei; Wiktionary gibt es online schon.
- **Vorlesen schneller als normal (C+).** Für Fortgeschrittene denkbar (1,1-fach), aber die Computerstimme klingt dann gepresst; echte Aufnahmen wären der bessere Weg.
- **Code in kleinere Dateien teilen (C).** Kein Nutzen für dich; erst, wenn eine Datei beim Ändern stört.
- **Schriftgrößen zusammenlegen (C).** Elf Größen zwischen 12 und 17 px; Zusammenlegen verschiebt überall halbe Pixel, ohne sichtbaren Gewinn. Erst bei einer größeren Gestaltungsrunde.
- **Konjugation beim Nachschlagen (C+).** Tabellen gibt es intern, auf Fortgeschrittenen-Niveau selten gebraucht.
- **Erinnerung über eine Kalenderdatei (C+).** Ohne Server keine verlässlichen Benachrichtigungen; ein täglicher Kalendertermin mit Link zur App ginge, ersetzt aber kaum einen selbst gestellten Wecker.
- **Kurze Dialoge zum Mitspielen (C+).** Wertvoll, aber jeder Dialog muss von Hand geschrieben und geprüft werden; Lesetexte bringen pro Aufwand mehr.
- **Wörter zum Einbauen passend zur Schreibaufgabe (C).** Die App weiß nicht, welches Wort zu welchem Thema passt; das wäre Raten. Stattdessen gibt es seit 24.29.0 fünf Grundformen und „Andere Wörter“.
- **Zurück auf „Heute“ in Firefox.** Die Geste verlässt dort die App, Firefox zeigt dann je nach Version eine leere Seite. Eine Web-App kann sich nicht selbst schließen, und die Geste auf „Heute“ abzufangen hieße, Nutzer in der App festzuhalten.
- **Neue Sätze erst zeigen, dann abfragen (C).** Bei Grammatik-Sätzen führen Regel und Deutsch zur Lösung; ein Lesedurchgang vorab verdoppelt die Zeit für neue Sätze, ohne dass mehr hängen bleibt. Für feste Wendungen mit fremdem Bild gibt es seit 24.55 beim ersten Kontakt das wörtliche Bild als Hinweis.
- **Redewendung beim ersten Kontakt als Auswahl (C+).** Wieder Raten, nur zwischen weniger Möglichkeiten, und je Wendung drei geprüfte Ablenker. Das wörtliche Bild führt zur Lösung, statt sie zur Wahl zu stellen.
- **„Meine ist auch richtig“ ausbauen (C).** Du meldest Fälle direkt; das bleibt der schnellere Weg zu einer Korrektur, die für alle gilt. Der Knopf bleibt für unterwegs, wie er ist.
- **Sprichwörter als eigene Übung (C+).** Ein Sprichwort, dazu das deutsche Gegenstück auswählen; je Sprache mindestens 40. Seit 24.43 gibt es Redewendungen, die im Alltag häufiger vorkommen. Mit Land & Leute überschneiden sie sich kaum (nur „Det är lugnt“ und „Ta det lugnt“, das stärkt sich gegenseitig).
- **Weitere Land-&-Leute-Karten.** Neue Karten, wenn ein guter Gedanke auftaucht, nicht auf Vorrat. Geprüft in 24.49 und 24.50:
  - **vale, dale, sale (B):** „vale“ ist typisch für Spanien, in Lateinamerika sagt man anderes. Lohnend, aber die Verteilung der Ersatzwörter ist schwer sauber zu belegen.
  - **Systembolaget und allemansrätten im Vergleich (B−):** Norwegen und Finnland haben ebenfalls staatliche Alkoholläden und ein Jedermannsrecht, Dänemark nicht. Neue Fakten, die erst geprüft werden müssen.
  - **Mate (B−):** Argentinien, Uruguay, Paraguay steht schon im Text; die Karte brächte wenig.
  - **seseo auf der Spanienkarte (C+):** Die Karte zeigt Spanien gegenüber Lateinamerika, darum geht es; Andalusien und die Kanaren im Detail würden davon ablenken.
  - **Tonfall: Finnlandschwedisch ohne Wortmelodien (C+):** stimmt, ist aber für Lernende in Schweden kaum von Nutzen.
  - **Sápmi (C):** Die Grenze verläuft quer durch vier Länder und wird je nach Quelle anders gezogen.
  - **„rolig“ (C):** steht schon bei den falschen Freunden. Weitere Wortvarianten wie piso oder departamento bringen keinen neuen Gedanken.
- **Nomen tauschen in der Mehrzahl (B−, geprüft am 23.11.).** Esos problemas son complicados: Das Verb ändert sich mit, die Aufgabe wird länger, und die Mehrzahl ist bei Spanisch selten die Schwierigkeit. Erst, wenn die Messung oben Fehler in der Zahl zeigt.
- **Begleiter mit deutschem Stichwort (dieser da) und aquel als dritte Stufe (D, ersetzt in 24.70).** Fragte die Zuordnung deutscher Bezeichnungen ab, die zwischen ese und aquel nicht trennen, und das Geschlecht verkleidet; mi/tu hatten nichts anzupassen.
- **Fehler finden: Übereinstimmung als Fehlerart (C+).** Erkennen übt weniger als selbst bilden; „Nomen tauschen“ deckt es ab.
- **Fehler finden: Mini-Text aus drei Sätzen, einer fehlerhaft (B−).** Mehr Lesen, mehrere Kandidaten; auf dem Handy aber unübersichtlich, und „zwei Kandidaten in einem Satz“ (oben) erreicht dasselbe kompakter.
- **Fehler finden: Indefinido/Imperfecto als Fehlerart (C+).** Der Aspekt lässt oft beides zu (llovía/llovió), ein eingesetzter Fehler wäre selten eindeutig.
- **Fehler finden: deutschen Satz ausblenden (C).** Bei por/para und Konnektoren wären dann oft zwei Lösungen richtig.
- **Fehler finden: Begründung auswählen (C).** Macht die Übung langsamer; die Erklärung steht ohnehin nach jeder Antwort da.
- **Etappen, weitere Varianten (geprüft am 21.11.).**
  - **„Kurz davor“ auf Heute (C+):** Nähe zum Ziel spornt an, lenkt aber vor dem Üben auf Zahlen statt auf die Sätze.
  - **Ein Satz von dir zur Etappe (C+):** ein Tagebuch-Schritt nach jeder Etappe; wird schnell lästig.
  - **Jahresrückblick als Geschichte (C+):** Die Monatsbilanz im Januar hat eine Zeile zum Vorjahr; mehr erst nach einem ganzen Jahr.
  - **Nächste Etappe im Kopf von Heute (C):** Heute ist schon voll, und „Dein Weg“ zeigt sie.
  - **Eigener Bildschirm vor der Zusammenfassung (C):** ein Tippen mehr, unterbricht.
  - **Abzeichen-Sammlung (C):** „Dein Weg“ ist schon die Sammlung, mit Datum.
  - **Teilen-Karte als Bild (C), Klang (C):** kein Bedarf; Ton am Handy oft aus.
- **„Dein Weg“, Varianten mit Zeit (geprüft am 21.11., gewählt: Abstand nach Zeit, gestaucht, mit Jahresfaltung, 24.64.0).**
  - **Lückenzeilen ohne Maßstab (B):** Dauer als schmale Zeile, aber nicht proportional.
  - **Zeitleiste quer über der Liste (B):** maßstabsgetreu bei fester Höhe, aber Punkte ohne Beschriftung, die ersten Wochen verklumpen, und das Band wiederholt den Kalender.
  - **Senkrechte Zeitachse, maßstabsgetreu (B−):** ausweichende Beschriftungen mit Linien, unruhig an Tagen mit nur einer Sprache, am meisten Fehlerrisiko.
  - **Querstriche je Woche auf den Spuren (C+):** wirkt wie eine Leiter; die Dauer als Text reicht.
  - **Aufklappen als eine Zeile „37 frühere Etappen“ (B), „10 weitere“ (B−), eigene Seite (C+):** nach Jahren eine riesige Liste, willkürliche Häppchen, eine Ebene mehr.
- **„Dein Weg“: Zeit auf einen Blick, Anfang, Schätzung (geprüft am 22.11., gewählt: stärkere Skala, Faltung nach Zeitspanne, Startpunkt, Abzweig, Schätzung als Text, 24.66.0).**
  - **Nächste Ziele mit Abständen nach der Schätzung (C+):** gleiche Skala wie die Vergangenheit, aber ein Ziel in sechs Monaten schiebt alles nach unten; die unsichere Zukunft bekäme mehr Platz als der Weg. Die Schätzung als Text sagt dasselbe.
  - **Schätzung rechts unter „noch …“ (C):** zu gedrängt; unter dem Ziel liest sie sich wie „vor 7 Tagen“ beim Anfang.
  - **Prellbock am Anfang (C+):** Querbalken unter den Spuren; liest sich als zwei Striche neben dem Punkt. Zusammenlaufende Spuren zeigen den Anfang klarer.
- **Herkunft für weitere Redewendungen (C).** Alle 72 geprüft; die übrigen haben keine belegte oder nur eine legendenhafte Erklärung. Neue Wendungen mit belegter Herkunft bekommen sie gleich mit.
- **Endbildschirm nach fehlerfreier Runde überspringen (C).** Dann fehlen Abschluss, „Als Nächstes“ und „Noch eine Runde“.

## Bewusst nicht

- **Freies Sprechen mit Spracherkennung (D).** Firefox hat keine Spracherkennung; bei dir käme es nicht an. Nachsprechen wertet Tempo und Pausen ohne Erkennung aus.
- **Anki-Anbindung (D, entfernt in 24.39).** Du nutzt Anki nicht. „An Anki“ im Wörterbuch und der Import aus Anki-Exporten sind weg; die Wiederholung plant die App selbst mit FSRS.
- **Abgleich zwischen Geräten (D).** Bräuchte Server und Konto. Das Backup leistet das von Hand.
- **Prüfungsvorbereitung (Swedex, DELE) (D).** Andere Ziele, andere Inhalte.
- **Neubau oder Framework (D, geprüft am 22.11.).** Für eine Person offline trägt der Aufbau aus Vorlagen und einer Datei; die Tests sichern ihn. Aufräumen statt umbauen.
- **Üben umbauen (C, geprüft am 22.11.).** 16 Einträge in 5 Gruppen sind lang, aber klar gegliedert.
- **`part_views.js` aufteilen (C+, geprüft am 22.11.).** Wäre billig, weil der Build die Dateien aneinanderhängt, bringt aber nichts Sichtbares.
- **Säulen wachsen beim Öffnen von „Fortschritt“ (D).** Bewegung ohne Handlung; bei täglicher Nutzung nur Wartezeit.
- Ranglisten, Herzen, Belohnungen, Konfetti, Wortschatz-Schätzungen als Spielerei; KI, Konto, Tracker. Sie widersprechen den Grundsätzen der App oder bringen beim Lernen wenig.
