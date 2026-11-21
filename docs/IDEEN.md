# Ideen für Tagwerk

Lohnende, noch nicht umgesetzte Ideen, mit Bewertung (A bis D) und den Gründen, dazu der Fahrplan für die nächsten Updates. Was umgesetzt ist, kommt hier heraus und steht im [Änderungsverlauf](../CHANGELOG.md). Themen für weitere Lesetexte stehen unten; Leitlinien und die Liste der geschriebenen Texte in [CONTENT.md](CONTENT.md#lesetexte-srcdatatextejs).

Stand: 21. November 2026 (nach 24.63.0)

Bewertet nach: Wirkung aufs Lernen auf fortgeschrittenem Niveau, wie oft es im Alltag greift (täglich im Tagwerk oder selten), Passung zu den Grundsätzen (offline, ohne KI, ohne Spielerei), Aufwand und Fehlerrisiko.

## Lagebild

- **Inhalte:** 529 schwedische und 659 spanische Sätze, davon 324 bzw. 408 auf B2, in 16 bzw. 19 Themen; 23 bzw. 25 Lesetexte. Jeder Satz hat eine Erklärung. Die Grammatikthemen für B2/C1 sind vollständig (24.41 bis 24.43: Verbalperiphrasen, Subjuntivo im Satzgefüge, Pluralklassen, Modalpartikeln, Redewendungen).
- **Übungen:** fast alles da. „Fehler finden“ ist seit 24.45 bis 24.48 eine echte Prüfaufgabe: Richtige Sätze sind dabei, Formfehler werden verbessert, es gibt sieben Fehlerarten je Sprache, und welche kommt, richtet sich nach deinen Fehlern.
- **Prüfqualität bleibt das Wichtigste.** Jede falsche „Falsch“-Wertung kostet Zeit und Vertrauen. Generatoren (24.37) und Satzbank (24.38) sind durchgesehen; falsch bewertete Antworten meldest du direkt.
- **Wenn die B2-Sätze aufgebraucht sind,** bleibt der Nachschub von Tatoeba, ohne Erklärung je Satz und ohne geprüfte Alternativen. Dann bringen neue kuratierte Satzblöcke mehr als neue Funktionen.
- **Browser-Tests** laufen in Chromium und Firefox, beide verbindlich. Firefox hat keine Spracherkennung; was darauf aufbaut, kommt bei dir nicht an.

## Fahrplan

Bei den Funktionen ist der Stand gerade die beste Lösung: Fehler beheben, die beim Üben auffallen, Updates bündeln. Die Arbeit geht in die Inhalte.

### Inhalte: Satzpakete (ab 24.56)

Befund vom 19.11. (`tools/vielfalt.js`, Häufigkeitslisten): Die Satzbank übt Grammatik mit schmalem Alltagswortschatz (590 Grundformen im Schwedischen, am häufigsten gå, komma, morgon). B2-Sätze hatten im Schnitt 7,8 Wörter, und je Thema reichten 12 bis 16 B2-Sätze bei „Fortgeschritten“ für gut eine Woche als Schwerpunkt. Darum je Thema neue B2-Sätze, länger und mit Wörtern, die der Satzbank fehlen.

| Paket | Inhalt | Note | Stand |
|---|---|---|---|
| 1 | Schwedisch, 96 B2-Sätze: Inversion, Nebensatz, Präteritum/Perfekt, Partikelverben, sin/hans, Passiv | A | 24.56.0 |
| 2 | Spanisch, 96 B2-Sätze: Konditional, Subjuntivo, Indefinido/Imperfecto, Perfecto, por/para, ser/estar | A | 24.57.0 |
| 3 | Spanisch, neues Thema „werden“: ponerse, volverse, hacerse, quedarse, convertirse en (36 Sätze, A2 bis B2) | A− | 24.58.0 |
| 4 | Schwedisch, übrige Themen: Zeit & Ort, Zukunft, Modalpartikeln, Redewendungen, falsche Freunde (68 Sätze) | A− | 24.59.0 |
| 5 | Spanisch, übrige Themen: Objektpronomen, gustar, Reflexiv, Präpositionen, Periphrasen, Redewendungen, falsche Freunde | A− | 24.60.0 |
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

2. **Fehler finden mit zwei Kandidaten (B).** Sätze mit zwei typischen Fehlerstellen verschiedener Sorten, höchstens eine davon falsch: ein ser/estar und ein por/para (Estoy en Madrid por trabajo), im Schwedischen etwa eine Inversion und ein Adjektiv mit en/ett-Endung. Dann reicht es nicht, das einzige kritische Wort zu finden; man muss beide prüfen. Nächster Schritt nach 24.45 (richtige Sätze, Verbessern). Braucht neue Satzvorlagen, je Sprache mindestens 36 (dreimal die Wiederholungssperre), mit einer Erklärung zu beiden Stellen.
3. **Verwechslung beim Namen nennen (B).** Erkennt die Prüfung ein vertauschtes Paar (por/para, ser/estar, en/ett, sin/hans), steht in einer Zeile, was hier gilt und warum. Ergänzt die Erklärung je Satz um die gemachte Verwechslung; für Präteritum/Perfekt gibt es das schon, für ein vergessenes Reflexivpronomen seit 24.62.0 (quedamos statt nos quedamos).

### Hören und Sprechen

4. **Hörunterscheidung, spanische Betonung (B, vorher B+), sonst Minimalpaare (B).** Nett, aber kein Engpass. término, termino, terminó: Betonung entscheidet über die Bedeutung, und die Akzente zählen beim Prüfen nur als „fast richtig“. Schwedische Paare (tak, tack) bringen auf deinem Niveau weniger. Paare nur aus geprüften Listen.
5. **Unterwegs: Deutsch hören, selbst sagen, dann die Lösung (B).** Anders als die Hörrunde (erst die Zielsprache) übt das den Abruf, ohne Antippen. Ohne Wertung, also ohne Wirkung auf die Wiederholung; nutzt die Bildschirmsperre-Lösung der Hörrunde.
6. **Muttersprachler-Aufnahmen offline (B, vorher B+).** Nutzen klar, Machbarkeit offen: Tatoeba liefert die Dateien vermutlich ohne CORS-Freigabe, dann wären sie im Cache nur undurchsichtig nutzbar, und der Speicher wächst. Erst prüfen, dann entscheiden.
7. **Diktat ganzer Lesetexte (B−).** Längeres Hören mit Zusammenhang; die Hörrunde und das Diktat decken viel davon schon ab.

### Schreiben

8. **Korrekturen aus dem Schreiben ins Tagwerk (C+ solange du nicht schreibst, sonst B+).** Aus eigenen Fehlern lernt man am meisten. Herabgestuft, weil LanguageTool für Schwedisch fast nur die Rechtschreibung prüft und es nur greift, wenn du regelmäßig schreibst.

### Planung und Rückblick

9. **Bedeutung von „gefestigt“ hinschreiben (B+).** In Zeile und Erklärtext, und bei der Etappe am Rundenende (im Etappen-Vergleich vom 21.11. „Ein Satz, was die Zahl heißt“, A−): „Sätze, die du auch nach drei Wochen ohne Üben noch weißt“. Stimmt genau: Der geplante Abstand ist bei FSRS die Zeit, bis die Erinnerung auf 90 % fällt, und die Wiederholung, die einen Satz festigt, ist im Tagwerk frei aus dem Deutschen geschrieben. Klein, ändert keine Zahl.
10. **Schwerpunkt der Woche erst ab 10 Aufgaben je Thema (B).** Bisher reichen 4; am 20.11. hätte das die Wahl auf Redewendungen (2 von 4) und Modalpartikeln (2 von 5) gelegt, beides auf zwei Fehlern.
11. **Zuwachs in der Sprachen-Kachel (B, ab Mitte Dezember).** „+18 in 7 Tagen“ statt „heute geübt“ (das zeigt der Kalender darüber). Zeigt das Tempo je Sprache; misst aber wie „gefestigt“ vor allem Regelmäßigkeit. Daten liegen im Tagesstand.
12. **„Verankert“ ausblenden, bis der erste Satz es ist (B−).** Frühestens im Mai 2027 möglich; bis dahin steht in „Stand der Sätze“ eine feste Null.
13. **Nachschub nach Worthäufigkeit (B−, vorher B+).** Hilft erst, wenn die eingebauten Sätze aufgebraucht sind und der Nachschub läuft; kuratierte B2/C1-Sätze bringen mehr. Braucht eine frei lizenzierte Häufigkeitsliste.
14. **Etappen, geprüft am 21.11., nicht gewählt (je B).**
    - **Persönliche Bestwerte:** längste fehlerfreie Folge, meiste Aufgaben an einem Tag. Belohnt eher Menge als Können und kann zu Druck werden.
    - **Damals und heute:** ein Satz aus den ersten Tagen, den du damals falsch hattest und heute gefestigt hast. Braucht Monate an Daten, ab dem Frühjahr 2027 sinnvoll.
    - **Balken bis zur nächsten Etappe am Rundenende:** Den Abstand nennt schon der Ausschnitt aus „Dein Weg“ („noch 15“); Fortschritt hat den Balken.
15. **Hartnäckige Sätze anders üben (B−).** Ab vier Fehlversuchen erst die Lücke statt des ganzen Satzes, mit der Regel davor. FSRS holt solche Sätze ohnehin oft; erst angehen, wenn sie sich in der Statistik häufen.


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

Derzeit nichts.

## Nach echter Nutzung nachstellen

- **Nachsprechen, Schwellen (seit 24.26.0).** Pause ab 0,35 s, Stopp nach 1,2 s Stille, Tempo-Urteil bei 0,8 bis 1,25 des Originals. Begründete Startwerte, nur mit vorgetäuschtem Mikrofon getestet. Nachstellen, wenn die Aufnahme am Handy zu früh stoppt oder Stockungen falsch markiert.
- **Tempo bei Tatoeba-Aufnahmen.** Das genaue Urteil gibt es nur, wenn der Tatoeba-Server das Auslesen der Datei erlaubt (CORS). Ungetestet; sonst steht dort „ca.“ ohne Urteil.

## Geprüft und zurückgestellt

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
- **Endbildschirm nach fehlerfreier Runde überspringen (C).** Dann fehlen Abschluss, „Als Nächstes“ und „Noch eine Runde“.

## Bewusst nicht

- **Freies Sprechen mit Spracherkennung (D).** Firefox hat keine Spracherkennung; bei dir käme es nicht an. Nachsprechen wertet Tempo und Pausen ohne Erkennung aus.
- **Anki-Anbindung (D, entfernt in 24.39).** Du nutzt Anki nicht. „An Anki“ im Wörterbuch und der Import aus Anki-Exporten sind weg; die Wiederholung plant die App selbst mit FSRS.
- **Abgleich zwischen Geräten (D).** Bräuchte Server und Konto. Das Backup leistet das von Hand.
- **Prüfungsvorbereitung (Swedex, DELE) (D).** Andere Ziele, andere Inhalte.
- Ranglisten, Herzen, Belohnungen, Konfetti, Wortschatz-Schätzungen als Spielerei; KI, Konto, Tracker. Sie widersprechen den Grundsätzen der App oder bringen beim Lernen wenig.
