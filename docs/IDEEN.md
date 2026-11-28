# Ideen für Tagwerk

Lohnende, noch nicht umgesetzte Ideen, mit Bewertung (A bis D) und den Gründen, dazu der Fahrplan für die nächsten Updates. Was umgesetzt ist, kommt hier heraus und steht im [Änderungsverlauf](../CHANGELOG.md). Themen für weitere Lesetexte stehen unten; Leitlinien und die Liste der geschriebenen Texte in [CONTENT.md](CONTENT.md#lesetexte-srcdatatextejs).

Stand: 28. November 2026 (nach 24.98.0, Durchsicht vom 28.11.)

Bewertet nach: Wirkung aufs Lernen auf fortgeschrittenem Niveau, wie oft es im Alltag greift (täglich im Tagwerk oder selten), Passung zu den Grundsätzen (offline, ohne KI, ohne Spielerei), Aufwand und Fehlerrisiko.

## Lagebild

- **Inhalte:** 650 schwedische und 768 spanische Sätze, davon 427 bzw. 475 auf B2, in 17 bzw. 21 Themen; 23 bzw. 25 Lesetexte. Jeder Satz hat eine Erklärung. Die Grammatikthemen für B2/C1 sind vollständig (24.41 bis 24.43: Verbalperiphrasen, Subjuntivo im Satzgefüge, Pluralklassen, Modalpartikeln, Redewendungen).
- **Übungen:** fast alles da. „Fehler finden“ ist seit 24.45 bis 24.48 eine echte Prüfaufgabe: Richtige Sätze sind dabei, Formfehler werden verbessert, es gibt sieben Fehlerarten je Sprache, und welche kommt, richtet sich nach deinen Fehlern.
- **Prüfqualität bleibt das Wichtigste.** Jede falsche „Falsch“-Wertung kostet Zeit und Vertrauen. Generatoren (24.37) und Satzbank (24.38) sind durchgesehen; falsch bewertete Antworten meldest du direkt.
- **Wenn die B2-Sätze aufgebraucht sind,** bleibt der Nachschub von Tatoeba, ohne Erklärung je Satz und ohne geprüfte Alternativen. Dann bringen neue kuratierte Satzblöcke mehr als neue Funktionen. Schwedisch ist zuerst so weit: bei „Normal“ und einem Tagwerk am Tag rechnerisch Mitte Mai 2027 (510 Sätze auf B1/B2, nach Paket 8, etwa 3 neue je Sprache und Tag), Spanisch Anfang Juni (594).
- **Browser-Tests** laufen in Chromium und Firefox, beide verbindlich. Firefox hat keine Spracherkennung; was darauf aufbaut, kommt bei dir nicht an.

## Fahrplan

Die Arbeit geht in die Inhalte, Schwedisch zuerst. Daneben die Punkte der Durchsicht vom 28.11.

### Durchsicht vom 28.11.

Befund: kein Umbau nötig. Gewachsen sind Spanisch und die Prüfung; Schwedisch, das Wörterbuch und ein paar Hilfsfunktionen sind nicht mitgekommen. Gemessen am Code und an Bildschirmfotos aller Ansichten (Testprofile, 390 px, dunkel).

| Punkt | Note | Stand |
|---|---|---|
| **Schwedisches Satzpaket vor den Kollokationen.** Schwedisch hat seit Paket 4 (24.59) keine neuen Sätze bekommen und geht zuerst die Sätze aus (siehe Lagebild). | A− | erledigt, 24.87.0 (Paket 7) |
| **Wörterbuch leitet Verbformen ab, der Test prüft auch die Alternativen.** Erzeugt wurden Formen nur für 48 Verben in vier Zeiten, ohne Futur, Konditional und Subjuntivo auf -ra/-se; alles andere stand von Hand da. 170 schwedische und 209 spanische Wörter aus Alternativen und erzeugten Fassungen ließen sich nicht nachschlagen, obwohl sie in der Lösung erscheinen. | B+ | erledigt, 24.86.0 |
| **Satzzeichen an einer Stelle.** Ein Dutzend leicht verschiedene Zeichenlisten in norm, tokens, altKey, wTokens und anderen; Gleiches wurde an verschiedenen Stellen verschieden behandelt. | B− | erledigt, 24.85.0 |
| **Benannte Verwechslungen im Schwedischen** (en/ett-Endung, sin/hans, Verb an zweiter Stelle). Spanisch hat seit 24.62 sechs Erkennungen dazubekommen, Schwedisch keine. | B | Idee 4 |
| **IDEEN.md teilen:** Fahrplan und Lohnendes kurz, „Geprüft und zurückgestellt“ und „Bewusst nicht“ in eine eigene Datei. 45 KB, vor jeder Arbeit gelesen. | B | |
| **Hinweis „Meine ist auch richtig“ nur dreimal.** Er steht unter jeder falschen Übersetzung, bis der Knopf einmal benutzt wurde, und du meldest Fälle lieber direkt. | B | |
| **Eigennamen an einer Stelle.** `NAMES` (22) entscheidet bei Wortkästchen und Bonus, daneben stehen 60 Namen im Wörterbuch und zwei Faustregeln; Johan, Lena, Marta und Lucía fehlen in `NAMES`. | B− | |
| **Tagwerk-Ende kürzen.** Mit aufgeklapptem Thema bis 3,2 Bildschirme; dasselbe Thema steht oben unter „Jetzt klar über Schnitt“ und unten unter „Themen dieser Runde“, beide Male mit Streifen und Legende. | B− | |
| **LanguageTool beim Übersetzen.** Findet deine typischen Fehler nicht (geprüft am 28.11.): im Spanischen nichts bei „Quiero que vienes conmigo“, „Ayer he perdido el bus“, „La reunión se puso tenso“, wohl aber Übereinstimmung in einer Wortgruppe („yo tiene“, „un problemas“); im Schwedischen nur „ett stor hus“, nicht „Igår jag gick“, „att han kommer inte“ oder hans statt sin. Die Anbindung funktioniert. Knopf beim Übersetzen weglassen oder „nichts gefunden“ knapper; beim Schreiben bleibt er (Rechtschreibung). | B− | deine Entscheidung |
| **Vorgaben für alle Speicherfelder in `freshDB`.** 11 neuere Felder fehlen dort, gut 30 Stellen prüfen, ob es sie gibt. Format bleibt gleich. | C+ | |
| **Zeilenformat der Satzbank.** Im Schnitt 307 Zeichen je Zeile, 50 über 600; Norm, Ausschlüsse, wörtliches Bild und Herkunft stehen als Marker im Text. Erst vor einem großen Inhaltsschub. | C+ | |
| **Lange Vorlagenzeilen in `part_views.js`** (106 über 250 Zeichen). Nur beim Anfassen umbrechen. | C+ | |
| **Bewusst nicht:** Framework oder Module (siehe unten), IndexedDB (Testprofile 20 bis 24 KB, die App warnt ab 3 MB), überflüssige Alternativen aufräumen (seit den Kombinationen 105 von 2.466). Eine Statistik für die ganze App steht unter „Geprüft und zurückgestellt“ (B). | C/D | |

### Aufräumen nach der Durchsicht vom 22.11.

Befund: kein Neubau nötig. Kein toter JS-Code (ESLint), 0,6 % doppelte Stellen im Scan, Doku und Code stimmen überein, Tests dicht. Gewachsen ist die App an den Rändern: kein festes Gestaltungssystem, mehrfach berechnete Kennzahlen, ein paar sichtbare Widersprüche.

Alle drei Schritte sind erledigt: Fehler und Einheitlichkeit 24.66.1, je eine Stelle im Code und Gestaltungssystem 24.66.2 und 24.67.0, Fortschritt 24.69.0.

Schritt 3 fiel kleiner aus als gedacht. Mit zwei Sprachen verglichen (23.11.): Im Überblick wiederholte „Jahr für Jahr“ im ersten Jahr die Kopfkarte samt Tagwerken je Sprache; es steht jetzt erst ab dem zweiten Jahr da, der Überblick ist von 3,4 auf 3 Bildschirme kürzer. „Wann du übst“ bleibt eine eigene Karte: Die Verteilung über den Tag zeigt mehr als der Satz allein (in 24.69.0 kurz nur der Satz, auf deine Rückmeldung in 24.69.1 zurück). Der Sprach-Tab bleibt, wie er ist: „Stand der Sätze“ in die Kopfkarte zu ziehen sparte nur ein Zehntel Bildschirm und nähme den Balken zum nächsten Ziel (siehe „Geprüft und zurückgestellt“).

### Inhalte: Satzpakete (ab 24.56; Pakete 1 bis 8 erledigt, 24.56 bis 24.60, 24.84, 24.87 und 24.88)

Befund vom 19.11. (`tools/vielfalt.js`, Häufigkeitslisten): Die Satzbank übt Grammatik mit schmalem Alltagswortschatz (590 Grundformen im Schwedischen, am häufigsten gå, komma, morgon). B2-Sätze hatten im Schnitt 7,8 Wörter, und je Thema reichten 12 bis 16 B2-Sätze bei „Fortgeschritten“ für gut eine Woche als Schwerpunkt. Darum je Thema neue B2-Sätze, länger und mit Wörtern, die der Satzbank fehlen.

| Paket | Inhalt | Note | Stand |
|---|---|---|---|
| 9 | Relativsätze (lo que, el que, cuyo; vars, vilket) | B+ / B | als Nächstes |

So entsteht ein Paket:
- **Wortschatz steuern:** Zielwörter aus Häufigkeitslisten (wordfreq, OpenSubtitles), Rang 1500 bis 8000, die der Satzbank fehlen, quer durch Arbeit, Gesellschaft, Gesundheit, Medien, Gefühle, Argumentieren. Die Listen dienen nur der Auswahl, in die App kommt nichts davon.
- **Anregung, keine Übernahme:** Schwedische Sätze aus Common Voice (gemeinfrei, CC0) zeigen natürliche Muster; übernommen wird nichts wörtlich, viele stammen aus alten Romanen. Tatoeba, Korp und Wikipedia sind aus der Arbeitsumgebung nicht erreichbar.
- **Messen:** `node tools/vielfalt.js` gegen den letzten Stand, erst nach dem Eintrag ins Wörterbuch (sonst zählt jede neue Verbform als neues Wort). Ziel: mindestens 40 % neue Inhaltswörter, Hilfsverben und Kopula nicht mitgezählt (Paket 1: 44 %, Paket 2: 42 %, Paket 4: 43 %, Paket 5: 41 %, nachdem 24 Sätze frischere Wörter bekamen; angepeilt war die Hälfte, Grammatiksätze brauchen viele Alltagsverben), im Schnitt mindestens 9 Wörter, kein Satzanfang öfter als dreimal. Die Ziele gelten für B2-Pakete; ein neues Thema beginnt bei A2 mit kurzen Sätzen und Grundwortschatz (Paket 3: 32 %, 8,3 Wörter; Paket 6: 33 %, die 24 B2-Sätze 39 %, 10,4 Wörter). Paket 7 (72 schwedische B2-Sätze in sechs Themen): 40 %, 9,9 Wörter, nachdem 30 Sätze frischere Wörter bekamen; gemessen erst mit den abgeleiteten Verbformen (24.86), die vorher jede Form als neues Wort zählten. In der Arbeitsumgebung ließ sich wordfreq zuletzt nicht installieren; Paket 6 wählte die Wörter darum ohne Liste, gemessen gegen die Satzbank. Paket 8 (Feste Verbindungen, je 49 Sätze, 18 davon B1): 40 % und 41 %, 9,3 und 11,6 Wörter, nachdem 22 schwedische und 44 spanische Sätze genauere Wörter bekamen; das Verb der Verbindung ist fast immer ein Alltagswort. Ein Test hält die B2-Sätze dauerhaft abwechslungsreich (Anfänge, erste Person).

### Danach

1. **Neue Sätze beim ersten Mal richtig, je Thema und Monat (B+, Anzeige ab Januar):** „Konditional, neue B2-Sätze: November 14 von 20, Januar 26 von 30.“ Misst, ob die Grammatik bei Sätzen sitzt, die du noch nie gesehen hast; „gefestigt“ zählt dagegen das Gedächtnis für bekannte Sätze und wächst vor allem mit der Zeit. Gezählt wird seit 24.61.0 (`DB.first`, unsichtbar), immer in derselben Übungsform und getrennt nach Stufe. Anzeige gestalten, wenn zwei Monate Daten da sind, mit echtem Backup: nur gleiche Stufe im Vergleich (bei „Fortgeschritten“ B2), Anzahlen statt Prozent bei kleinen Mengen. Ersetzt die Wochenbilanz zum Schwerpunkt, die an wechselnden Übungsarten und Niveaus gescheitert wäre.

2. **Reihen, Inhaltspakete (A):** Rahmen steht seit 24.97.0; Natten på Sveavägen seit 24.98.0, Los 33 seit 24.99.0. Weitere Pakete auf Wunsch, je Paket eine Reihe aus [Reihen](#reihen-lesen-in-fortsetzungen-konzept-vom-2811-rahmen-seit-24970).

Sonst nach Bedarf aus „Bewertet: lohnend“; neue Lesetexte aus den Themen unten (46 von 48 noch ungelesen, darum vorerst C+).

## Bewertet: lohnend

### Charakter und Ton (Vorschläge vom 28.11.)

Umgesetzt: Gruß jeden Tag anders, mit Wochentag und Anlass, Thema auf „Heute“ öffnet erst das Themenblatt (24.89.0); Zuruf am Rundenende neben dem Stempel (24.93.0, Variante d); Feiertagsgrüße je Sprache mit kleinem bewegtem Zeichen, Stempel je Tag gedreht und mit Druck, Funken nach fehlerfreier Runde und an Etappentagen (24.90.0). Deine Linie vom 28.11.: kleine Freuden und leichte Bewegung gern, solange sie gut aussehen und nicht kitschig sind; kein Konfettiregen, keine Maskottchen. Charakter soll aus der Sprache, der Kultur und dem Bild der App (Stempel, Tinte, Papier) kommen, und möglichst lernt man dabei etwas.

2. **Unübersetzbare Wörter als Fundstück (B+).** lagom, gökotta, smultronställe, mångata, klämdag, tretår, orka; sobremesa, madrugar, estrenar, puente, vergüenza ajena, friolero, merendar. Je 15 bis 20 mit Beispielsatz und „Ins Tagwerk“. Varianten: (a) eigene Karte im Wechsel des Fundstücks (empfohlen); (b) Kategorie in „Land & Leute“.
3. **Zielsprache je Niveau (Durchsicht der ganzen App am 28.11.).** Grundsatz bleibt: Zielsprache, wo die Bedeutung aus dem Zusammenhang klar ist und sich täglich wiederholt; Deutsch, wo Verstehen zählt oder ein Fehlgriff etwas kostet. Regel für die Stufen (seit 24.95.0 umgesetzt): „Grundlagen“ Gruß, Feiertagsgruß, Datum und Zuruf; „Mittel“ dazu die Serie im Kopf; „Fortgeschritten“ die ganze Aufgabe: Anweisungen (24.92.0), Urteil und Treffer in Folge, Schreibaufgabe, Bonus-Anweisung (24.95.0), mit Deutsch auf Tipp. Erklärungen und Bedienung bleiben auf jeder Stufe deutsch, ebenso die Extra-Aufgaben beim Schreiben (Grammatik als Ziel: „Ein Wunsch mit skulle vilja“).
   - **Fragen zu den Lesetexten bei „Fortgeschritten“ (B, Aufwand hoch).** 144 Fragen mit je drei Antworten in der Zielsprache, Deutsch auf Tipp; der Beleg aus dem Text ist schon zielsprachig. Leseverstehen wie in Sprachprüfungen. Jede Frage muss idiomatisch sein und genau eine richtige Antwort haben.
   - **Deutsch unter Beispielsätzen erst auf Tipp, bei „Fortgeschritten“ (C+).** Fundstück, Land & Leute, Beispiele in der Grammatik: erst selbst verstehen. Kostet überall einen Tipp, und die deutsche Zeile ist klein und leicht zu überspringen.
   - **Kopfzeile des Fundstücks (C).** „Snart i Sverige · i morgon“; die spanische Fassung („en el mundo hispanohablante“) wird lang.
   - **Titel des Monatsrückblicks (C).** „Din november“, „Tu noviembre“; einmal im Monat.
   - **Kategorien der Lesetexte (C).** Natur, Historia; kleine Etiketten, kaum Nutzen.
   - **Kürzel im Kalender (C, angehalten, alle Varianten am 28.11. gezeigt).** Die Woche auf „Heute“ hat keine Kürzel und bekommt keine; die Kalender mit beiden Sprachen bleiben deutsch (deine Entscheidung vom 28.11.). Falls doch einmal: zwei Buchstaben, klein (må ti on, lu ma mi), drei werden im Jahreskalender abgeschnitten.
   - **Eigener Schalter statt Niveau (D).** Noch eine Einstellung; das Niveau beschreibt schon, wie viel man versteht.
   - **Bewusst nicht (D):** Leiste unten und Knöpfe (Prüfen, Weiter, Weiß ich nicht), Titel und Ergebnis am Rundenende, Zahlen, Statistik und Etappen, Regeln, Erklärungen und Angaben zu Verbformen, Einstellungen, Fehlermeldungen.
4. **Stempel, nächste Schritte (C+).** Gedreht und mit Funken seit 24.90.0. Offen: (b) an Etappentagen das Datum im Siegelrand; (c) ein Wort in der Zielsprache statt des Hakens (KLART, HECHO).
4a. **Zeichen auch für Sant Jordi, Nationaldag und Fettisdagen (C+).** Rose, Fahne, Semla als Linienzeichnung; eine Fahne mit Farben fiele aus dem Stil, darum eher nicht.
5. **Woher der Name kommt (C+).** Einmal, beim ersten Start oder unten in den Einstellungen: Ein Tagwerk war das Stück Land, das ein Bauer an einem Tag pflügen konnte, in Bayern gut ein Drittel Hektar.
6. **Jahrestag im Gruß (C+).** Am Jahrestag des ersten Übungstags „Ett år i dag!“ / „¡Un año ya!“, zum ersten Mal am 15.11.2027.
7. **Seltene Zustände mit etwas Haltung (C+).** Nur wo sie selten sind, sonst nutzt sich der Witz ab: „Alle Sätze sind eingeführt.“ mit Anerkennung und dem Weg zum Nachschub, die erste fehlerfreie Runde eines Themas, das erste Tagwerk in der zweiten Sprache.
8. **Bewusst nicht (D):** Sprüche nach jeder richtigen Antwort, Farbstimmung nach Tageszeit (Farben tragen Bedeutung: Sprache, Fehler), Maskottchen, Konfettiregen, Schneefall über der Seite.

### Inhalte und Niveau

1. **Adjektivsteigerung, Schwedisch (B).** bra, bättre, bäst; gammal, äldre, äldst; få, färre, färst. Kleiner Generator, begrenzter Nutzen auf B2.
1a. **Perfecto/Indefinido, nächste Schritte (seit 24.80.0 fragt jede Aufgabe eine Norm ab, deine Entscheidung vom 27.11.: beide lernen; seit 24.81.0 nach der lerntheoretischen Prüfung überarbeitet).** Vorher galt überall beides, und wer immer Indefinido schrieb, hatte 67 von 69 Sätzen richtig. Stand 24.81.0: 93 Sätze, 30 mit klarem Gegensatz (hoy, esta mañana, ya: Spanien Perfecto, Lateinamerika meist Indefinido; fragen beide Normen ab), 25 mit Erfahrung und Andauerndem (Spanien Perfecto, Lateinamerika beides; fragen nur „wie in Spanien“ ab), 31 mit abgeschlossener Zeit (überall Indefinido), 7 ohne Norm (He perdido mis llaves, Ya te lo he dicho, Desde que empezó la obra …). 24 davon haben zwei Zeitrahmen (Ayer llovió todo el día, pero hoy por fin ha salido el sol). Lerntheoretisch geprüft am 27.11. (vorher C+, mit 24.80.0 B, jetzt B+): Verschachteln der Normen und Abruf aus dem Deutschen tragen; behoben sind die drei Schwächen von 24.80.0 (ein Drittel der Normangaben änderte nichts und lehrte, sie zu überlesen; kein zweiter Abruf nach der Korrektur; allgemeine statt satzbezogener Erklärung). Weiter:
    - **Fehler der anderen Norm getrennt zählen (B):** Heute zählt „perdí bei ‚wie in Spanien‘“ wie jeder andere Themenfehler. Getrennt zeigten deine Zahlen nach zwei, drei Wochen, ob du die Normen verwechselst oder die Zeitangabe falsch liest. Dazu beobachten, ob das Thema dadurch so viel Übung bekommt, dass „pasado“ (Indefinido/Imperfecto, der schwierigere Unterschied) zu kurz kommt.
    - **„Fehler finden“ mit Norm (B):** bisher nur „ayer + he …“; dazu die Gegenrichtung mit „wie in Spanien“ (Hoy perdí el autobús). Braucht die Norm auch im Generator.
    - **Vergangenheit im Zusammenhang (B, Aufwand hoch):** kurze Erzählungen mit drei bis vier Lücken (Infinitiv gegeben), Indefinido und Imperfecto gemischt; der Aspekt zeigt sich oft erst im Zusammenhang. Jede Lücke muss eindeutig sein, das ist beim Aspekt selten (siehe „Fehler finden: Indefinido/Imperfecto“). Der Aspekt ist für Deutschsprachige schwerer als Perfecto/Indefinido; von „pasado“ (50 Sätze) hast du erst 4 gesehen.
    - **Norm für weitere Unterschiede (C+):** Wortschatz wie coche/carro gilt in beiden Normen, und das ist richtig so; ustedes statt vosotros ebenso. Nur dort, wo eine Form in der anderen Norm auffällt, lohnt die Abfrage.

### Prüfung und Rückmeldung

2. **Übereinstimmung in deinen Übersetzungen messen (B+).** Gleiches Wort, nur die Endung für Geschlecht oder Zahl anders (bonito/bonita, este/esta, lo/la, buen/buena) als eigene Fehlerart in den Fehlerquellen. Zeigt an echten Sätzen, ob die Übereinstimmung überhaupt ein Engpass ist und „Nomen tauschen“ (24.70) öfter kommen sollte.
3. **Fehler finden mit zwei Kandidaten (B).** Sätze mit zwei typischen Fehlerstellen verschiedener Sorten, höchstens eine davon falsch: ein ser/estar und ein por/para (Estoy en Madrid por trabajo), im Schwedischen etwa eine Inversion und ein Adjektiv mit en/ett-Endung. Dann reicht es nicht, das einzige kritische Wort zu finden; man muss beide prüfen. Nächster Schritt nach 24.45 (richtige Sätze, Verbessern). Braucht neue Satzvorlagen, je Sprache mindestens 36 (dreimal die Wiederholungssperre), mit einer Erklärung zu beiden Stellen.
4. **Verwechslung beim Namen nennen (B).** Erkennt die Prüfung ein vertauschtes Paar (por/para, ser/estar, en/ett, sin/hans), steht in einer Zeile, was hier gilt und warum. Ergänzt die Erklärung je Satz um die gemachte Verwechslung; für Präteritum/Perfekt gibt es das schon, für ein vergessenes Reflexivpronomen seit 24.62.0 (quedamos statt nos quedamos), für Subjuntivo und Konditional im si-Satz seit 24.79.0 (diéramos statt daríamos, si tendría).

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
    - **Persönliche Bestwerte:** meiste Aufgaben an einem Tag. Belohnt eher Menge als Können und kann zu Druck werden. Die längste Serie steht seit 27.11. unter „Geprüft und zurückgestellt“ (C+).
    - **Damals und heute:** ein Satz aus den ersten Tagen, den du damals falsch hattest und heute gefestigt hast. Braucht Monate an Daten, ab dem Frühjahr 2027 sinnvoll.
    - **Balken bis zur nächsten Etappe am Rundenende:** Den Abstand nennt schon der Ausschnitt aus „Dein Weg“ („noch 15“); Fortschritt hat den Balken.
16. **Deine letzten Fehler im Themenblatt, auch auf Fortschritt (C+).** Am Rundenende stehen sie seit 24.68 beim Thema. Überall bräuchte es ein dauerhaftes Protokoll falscher Antworten je Thema; erst, wenn sich das Aufklappen am Rundenende bewährt.
17. **Hartnäckige Sätze anders üben (B−).** Ab vier Fehlversuchen erst die Lücke statt des ganzen Satzes, mit der Regel davor. FSRS holt solche Sätze ohnehin oft; erst angehen, wenn sie sich in der Statistik häufen.


## Reihen: Lesen in Fortsetzungen (Konzept vom 28.11., Rahmen seit 24.97.0)

Aufeinander aufbauende Texte in fester Reihenfolge, als Weiterentwicklung von „Lesen und Hören“ (A; eine eigene Übungsform wäre C+:
zweiter Leser, zweiter Ort). Aufbau, Sprache je Niveau, Datenformat und Regeln für den Inhalt in [REIHEN.md](REIHEN.md). Umgesetzt
ist der Rahmen; Inhalte kommen in Paketen, je Paket eine Reihe, abwechselnd die Sprachen. Erste Pakete: **Natten på Sveavägen**
(Schwedisch, „Wie es geschah“, 24.98.0) und **Los 33** (Spanisch, erfundene Erzählerin, 24.99.0), zwei verschiedene Formen zum Erproben.

**Erzählformen:** Wie es geschah, Präsens, jeder Teil kennt nur den Stand seines Tages (A); erfundene Figur in echten Ereignissen,
gekennzeichnet (A); viele Stimmen, jeder Teil eine andere Perspektive (A); Familienchronik über Generationen (A−); ein Tag, der alles
änderte, Landesgeschichte in Stationen (A−); Briefe und Dokumente (B+); Ermittlung, Spur für Spur (B+); ein Gegenstand erzählt (B);
du entscheidest, erst „Was würdest du tun?“, dann was geschah (B); Reisetagebuch (B).

**Lernfunktionen:** dasselbe Thema über viele Texte, Schlüsselwörter kehren wieder (A, der eigentliche Gewinn); „Bisher“ (A);
Cliffhanger und Vorschau (A−); Personen und Wörter der Reihe, ohne Vorgriff (A−); „Erinnerst du dich?“, eine Frage zu einem früheren
Teil (B+, braucht Textstellen aus früheren Teilen in der Prüfung); Fragen in beiden Sprachen, bei „Fortgeschritten“ zielsprachig (B+,
im Rahmen schon vorgesehen); Karte und Zeitleiste (B); Vorhersage vor dem nächsten Teil (C+); ein Teil pro Tag als Einstellung (C+);
verteilte Stimmen beim Vorlesen (C, wenige Stimmen je Sprache).

**Einleitung (entschieden 28.11.):** zwei Sätze in der Zielsprache mit „Auf Deutsch“, bei „Grundlagen“ deutsch, wie „Bisher“. Sie
sagt, worum es geht, nicht wie erzählt wird; das zeigt das Etikett der Erzählform. Beispiel Palme: „Den 28 februari 1986 skjuts
statsminister Olof Palme ihjäl på väg hem från bion. Det här är berättelsen om natten, spåren och frågan som Sverige levde med i 34 år.“

**Themen Schwedisch** (Fakten vor dem Schreiben an Quellen prüfen):
- **Natten på Sveavägen (umgesetzt in 24.98.0):** Palme-Mord, Wie es geschah, 6 Teile, B2: die Nacht, der „33-Jährige“, die
  PKK-Spur, Christer Pettersson, Engström benannt (10.6.2020) und wieder nicht (18.12.2025).
- **Krigsbarnen (A):** erfundene Figur, 5 Teile, B1: Aino, sieben, eines von rund 70 000 finnischen Kriegskindern in Schweden
  (1939–45): Abschied, Haparanda, Pflegefamilie, die Sprache vergessen, Rückkehr zu einer Mutter, die sie nicht mehr versteht.
- **Tre generationer (A):** Familienchronik, 4 Teile, B1: Rechtschreibreform 1906 (hvad → vad), du-Reform (Bror Rexed, 3. Juli
  1967), „hen“ (SAOL 2015). Sprachwandel an der eigenen Zielsprache.
- **Beredskap (A):** viele Stimmen, 6 Teile, B2: Rekrut an der norwegischen Grenze, Eisenbahner an den deutschen Urlauberzügen,
  Journalistin unter Zensur, dänische Juden über den Öresund 1943, die Weißen Busse 1945.
- **Mot Amerika (A−):** Briefe einer erfundenen Familie aus Småland, Hungerjahre um 1867, Überfahrt, Minnesota, 5 Teile, B1.
- **Sverige på tio dagar (A−):** zehn Tage von 1520 bis zum NATO-Beitritt 2024.
- **Ålandsfrågan 1917–21 (B+)** und **Unionen 1905 (B+):** zwei Unabhängigkeitsfragen, beide ohne Krieg gelöst.
- **Spanienfrivilliga (B+):** erfundener Waldarbeiter aus Norrland unter den gut 500 schwedischen Freiwilligen; Schwedisch über
  Spanien.
- **Fortsetzungen vorhandener Texte (B+):** Vasa (Suche und Hebung 1961), Astrid Lindgren (Pomperipossa 1976), Systembolaget (das
  Motbok), Kiruna (die Kirche erzählt, Umzug am 19. und 20. August 2025).
- **Nobels testamente (B+):** der zu frühe Nachruf (oft erzählt, dünn belegt: gehört in „Was ist echt?“), Testament, Streit, 1901.
- **B:** Raoul Wallenberg, Dag Hammarskjöld (Absturz 1961), IFK Göteborg 1982, Hammarby und seine Fans über drei Generationen.

**Themen Spanisch:**
- **La noche de los transistores (A):** 23-F, Wie es geschah, Stunde für Stunde, 5 Teile, B2.
- **La guerra en casa (A):** Bürgerkrieg, eine Familie auf beiden Seiten, viele Stimmen, 6 bis 7 Teile, B2–C1: Madrid belagert,
  Guernica, Kinder ins Ausland, Exil 1939.
- **Los 33 (A, umgesetzt in 24.99.0):** Chile 2010, erfundene Reporterin im Campamento Esperanza, 5 Teile, B1, geht gut aus.
- **El crimen de Cuenca (A−):** Ermittlung, 4 Teile, B2: 1910 verschwindet ein Schäfer, 1918 werden zwei Männer zu 18 Jahren
  verurteilt, 1926 taucht er lebend auf.
- **España en diez días (A−):** zehn Tage von 711 bis heute.
- **El Oviedo de todos (B+):** 2012 kaufen Fans aus aller Welt Aktien, am letzten Tag steigt Carlos Slim ein.
- **B+:** Gaudís Straßenbahnunfall 1926 mit Rückblenden, „Relato de un náufrago“ neu erzählt, der Streit um das ñ und die
  RAE-Reform 2010, Fortsetzungen zu Campoamor und zum Camino (Reisetagebuch).
- **B:** Boca gegen River 2018 in Madrid, Athletic Club mit nur baskischen Spielern.
- **B−:** Katalonien 2017, nur mit vielen Stimmen und später.

**Bewusst nicht (D):** Katastrophen als tägliche Lektüre (Estonia, Tsunami), erfundene Geschichten über echte Opfer, erfundene
Zitate echter Personen.

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

## Nach echter Nutzung nachstellen

- **Veränderungspfeile, Stufen 60/80/95 und vier gegen vier Wochen (seit 24.75.0).** Gerechnet mit `tools/pfeile.js` am Volumen vom 24.11.; sichtbar ab 11. Januar 2027. Nach drei Monaten prüfen: Wie oft wechselt ein kräftiger Pfeil von Woche zu Woche die Richtung (bei reinem Rauschen selten, weil sich die Zeiträume zur Hälfte überlappen), und passen die Pfeile zu den Etappen? Wenn die Liste unruhig wirkt: kräftig erst ab 97,5 % (B).
- **„Klar über Schnitt“, Hysterese 90/60 (seit 24.74.0).** Gewählt per Simulation (`tools/fehlerquoten-schwelle.js`) mit dem Volumen vom 24.11. Nach einem halben Jahr prüfen, wie oft die Markierung tatsächlich wechselt und ob sie zu spät kommt (Median 27 Tage bei 1,2 Aufgaben je Thema am Tag).
- **Fehlermodell, Halbwertszeit 14 Tage (seit 24.72.0).** Gewählt am Volumen im Backup vom 24.11. (rund 1,2 Aufgaben je Thema und Tag). Ab etwa Mai 2027, mit einem halben Jahr Daten, über die Vorhersagegüte für den nächsten Tag wählen: je Kandidat (7, 10, 14, 21, 30 Tage) die mittlere log-Wahrscheinlichkeit der Antworten eines Tages unter dem Modell aus den Tagen davor. Braucht ein Werkzeug in `tools/`, das ein Backup liest.
- **Nachsprechen, Schwellen (seit 24.26.0).** Pause ab 0,35 s, Stopp nach 1,2 s Stille, Tempo-Urteil bei 0,8 bis 1,25 des Originals. Begründete Startwerte, nur mit vorgetäuschtem Mikrofon getestet. Nachstellen, wenn die Aufnahme am Handy zu früh stoppt oder Stockungen falsch markiert.
- **Tempo bei Tatoeba-Aufnahmen.** Das genaue Urteil gibt es nur, wenn der Tatoeba-Server das Auslesen der Datei erlaubt (CORS). Ungetestet; sonst steht dort „ca.“ ohne Urteil.

## Geprüft und zurückgestellt

- **„Stand der Sätze“ in der Kopfkarte des Sprach-Tabs (B−, geprüft am 23.11.).** Der Balken verankert, gefestigt, im Aufbau, neu statt des Balkens zum nächsten Ziel, der eigene Abschnitt entfiele. Spart kaum Platz (2,8 auf 2,7 Bildschirme), die Kopfkarte wird dichter, und der Fortschritt zum nächsten Ziel stünde nur noch als Text da.
- **Serien richtiger Antworten als Etappe oder Auszeichnung (C+ in der Runde, C über Runden hinweg; geprüft am 27.11.).** Gerechnet mit deinen Tagen (Backup vom 27.11.): Bei 35 Aufgaben und 80 % richtig liegt die längste Serie im Median bei 10, in 80 % der Tage zwischen 6 und 17. Steigt die Quote von 80 auf 85 %, rückt der Median um 2; die Streuung eines Tages ist mehr als doppelt so groß. Die „9 richtig in Folge“ vom Screenshot (26 Aufgaben, 5 Fehler) ist genau, was der Zufall bei dieser Quote erwartet. Ein Rekord „längste Serie“ fiele bei gleichbleibendem Können an etwa ln(Tage) + 0,58 Tagen: in den ersten 30 Tagen 4-mal, danach kaum noch, als Lotterie. Über Runden hinweg wächst die längste Serie vor allem mit der Menge (etwa log der Aufgaben), nicht mit dem Können. Und sie arbeitet gegen die App: Tagwerk schiebt gezielt neue Sätze und deine schwachen Themen nach vorn, eine Serie belohnt das Gegenteil (leichte Runden, „Meine ist auch richtig“ großzügig). Die Kachel „richtig in Folge“ am Rundenende ist ebenso fast nur Zufall, schadet aber nicht; „beim ersten Mal richtig 21 von 26“ sagte mehr (B−, lohnt nicht allein). Was Können misst, kommt ab Januar: „Neue Sätze beim ersten Mal richtig“ (Fahrplan).
- **„Fehler finden“: Anteil richtiger Sätze zählen und zeigen (B−, geprüft am 27.11.).** Dein Eindruck: in einer Sprache nur richtige Sätze. Gemessen mit deinem Stand: 39,5 % richtige Sätze im Schwedischen, 40,5 % im Spanischen (4000 Würfe je Sprache), jede Aufgabe unabhängig. Im Tagwerk kommt eine je Sprache und Tag; dass von 12 mindestens 8 richtig sind, hat je Sprache 5,7 % Wahrscheinlichkeit, für eine der beiden 11 %. Welche Fassung kam, speichert die App nicht; ein Zähler je Sprache würde es nach ein paar Wochen zeigen. Erst, wenn der Eindruck bleibt.
- **Schwierigkeit erholt sich bei „gewusst“ (C+, geprüft am 27.11.).** Nach drei Rückfällen steht ein Satz bei Schwierigkeit 9,7 von 10 (Regensatz, fehlendes nos); FSRS senkt sie nur mit „einfach“, das Tagwerk kennt nur gewusst, knapp, nicht gewusst. Darum wachsen die Abstände langsam (1, 2, 3, 5, 8, 12, 18, 27 Tage statt 2, 11, 46). So ist FSRS gebaut und im Benchmark abgestimmt; eigene Parameter siehe unten (C).
- **Fehlermodell, weitere Schritte (geprüft am 24.11.).**
  - **Übungsart herausrechnen (B−):** logit p = β₀ + u_Thema + γ_Übungsart mit u ~ N(0, σ²). Trennt „Thema schwer“ von „Übungsform schwer“ (Inversion kommt oft als Wortkästchen). Braucht Zählungen Thema × Übungsart (neues, abwärtskompatibles Feld in `tlog`) und einen Monat Daten.
  - **Eine Statistik für die ganze App (B):** Fehler finden gewichtet noch mit (Fehler + 1)/(Aufgaben + 5), die Etappen testen mit z-Test und Wilson-Grenzen. Beides ließe sich aufs Fehlermodell stellen (Etappe „halbiert“: P(θ_neu < θ_alt/2) ≥ 99 %). Größerer Umbau, die Etappen sind per Simulation abgestimmt.
  - **Unsicherheit über m mitnehmen (C+):** über das Gitter von (μ, m) mitteln statt den Modus zu nehmen. Bereiche würden etwas breiter; auf dem Handy rund zehnmal langsamer.
  - **Quantil-Punkte statt Flächen (C+):** 20 Punkte je Thema, je einer für 5 % Wahrscheinlichkeit; für Laien oft leichter lesbar, bei sechs Themen aber unruhig.
  - **Satzschwierigkeit (Rasch-Modell) (C):** zu wenige Antworten je Satz.
  - **„Deine Zahlen“: Fehler nach Übungsart je Thema (B−, geprüft am 25.11.):** zeigte, ob ein Thema nur beim freien Schreiben hakt. Braucht dasselbe neue Feld Thema × Übungsart wie „Übungsart herausrechnen“.
- **Trend je Thema (geprüft am 24.11., in 24.72.1 entfernt; seit 24.75 als Pfeil mit Sicherheitsstufen, vier gegen vier Wochen).** Als Ja/Nein-Urteil bei 1,2 Aufgaben je Thema und Tag nicht erkennbar, dafür 3 bis 10 % Fehlalarme (Zahlen in RESEARCH.md). Geprüfte Ersatzformen:
  - **Grauer Punkt „vor 4 Wochen“ auf dem Streifen (C+):** zeigt bei normalem Volumen vor allem Zufall.
  - **Trend nur beim Schwerpunkt (C):** dort genug Aufgaben, aber gerade dort die Regression zur Mitte durch die Auswahl.
  - **Hierarchisches Modell für die Änderung (C+):** log-Odds-Änderung je Thema ~ N(0, τ²), τ empirisch-bayessch; richtig gegen Fehlalarme, würde bei diesen Daten aber fast nie etwas zeigen.
  - **Farbige Pfeile (C+, geprüft am 25.11.):** Grün und Rot behaupteten Gewissheit, und Rot heißt in Fortschritt schon „Fehlerquote“.
  - **Waagrechter Pfeil für „kaum Unterschied“ (B):** behauptete „gleich geblieben“; eine leere Stelle heißt ehrlicher „keine Aussage“.
  - **Kleiner Verlauf je Zeile statt Pfeil (C+):** zwölf Wochenwerte je Thema, bei 1,2 Aufgaben am Tag fast nur Zufall und in 19 Zeilen unruhig; der Verlauf steht im Themenblatt.
  - Wieder ansehen, wenn je Thema 5 und mehr Aufgaben am Tag üblich sind.
- **Schreiben: grüner Pfeil erst ab 3 gegen 3 Texte (C+, geprüft am 24.11.).** Heute reicht +0,05 im Mittel aus 1 bis 3 Texten; Wörter pro Satz und LIX hängen stark vom Thema des Textes ab. Zurückgestellt, weil der Vergleich als „anfangs … jetzt“ beschriftet ist und keine Wahrscheinlichkeit behauptet.
- **Weitere Punkte der Analyse vom 25.11. (zurückgestellt):** „N gefestigte Sätze“ oben zählt verankerte mit, „Stand der Sätze“ getrennt; weicht ab dem ersten verankerten Satz ab (B−). „neue Sätze gezielt zu typischen Fehlern“ auf Heute liest sich neben den Fehlerquoten wie „deine Fehler“ (C+). Absolute Grenze für Grundlagensätze, wenn alle Themen schwer sind (C+, eher ein Fall fürs Niveau).
- **Themen-Etappen sequenziell statt in Blöcken (C+, geprüft am 24.11.).** Ein Test mit E-Werten (anytime-valid, Ville-Ungleichung) dürfte nach jeder Antwort prüfen, ohne die Fehlalarme zu erhöhen. Braucht ein neues Speicherfeld je Thema und neue Abstimmung; der Gewinn ist begrenzt, weil schon ein idealer Einzeltest für 20 → 10 % rund 310 Aufgaben braucht (bei 1,2 am Tag 260 Tage). Die Regel bleibt, `tools/themen-etappen.js` rechnet jetzt mit echtem Volumen.
- **Chevron in den antippbaren Zeilen der Themenliste im Sprach-Tab (C+, geprüft am 24.11., wieder am 25.11.).** Auf Heute haben die Zeilen einen, in der Themenliste nicht. Der Hinweis „Tipp auf ein Thema …“ steht darunter, und neben der Pfeilspalte nähme ein Chevron der Namensspalte weitere 12 px.
- **Fehlerquellen: andere Reihenfolgen (geprüft am 24.11.; in 24.71.0 geglättete Quote ab 10 Aufgaben, seit 24.72.0 das Fehlermodell mit Vergessen).**
  - **Anzahl der Fehler (C, bis 24.70):** misst eher, wie oft ein Thema drankommt; 7 von 73 stand vor 5 von 13.
  - **Rohe Quote ab 10 Aufgaben (B−):** einfach, aber bei wenigen Aufgaben sprunghaft.
  - **Untere Wilson-Grenze (B):** robust, aber die Reihenfolge widerspricht öfter den Prozent daneben.
  - **Fehler über der eigenen Quote (B):** wo Üben am meisten Fehler spart; eine neue, schwer greifbare Zahl, und die Liste wird leer, wenn alles gleich gut ist.
  - **Bereinigt nach Übungsart (C+):** fachlich am saubersten (Inversion kommt oft als Wortkästchen, Adjektive als getippte Lücke), braucht aber ein neues Feld Thema × Übungsart im Speicher und 30 Tage Daten.
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
- **Rundenende mit einem Thema, weitere Punkte (geprüft am 25.11., umgesetzt ist 24.76.0: Schätzung vorher und nachher, Fehler offen).** Sekunden je Aufgabe (C, Tempo ist kein Lernziel); „richtig in Folge“ bei nur einem Fehler weglassen (C+, die Leiste zeigt es, stört aber nicht); „Eigener Satz“ auch nach erzeugten Aufgaben (B−, ohne Ausdruck aus der Satzbank fehlt die Aufgabe, LanguageTool prüft Schwedisch fast nur auf Rechtschreibung).
- **Tagwerk-Ende: Fehlerauswertung, weitere Varianten (geprüft am 26.11.; umgesetzt in 24.78.0: Wechsel bei „klar über Schnitt“ oben, Schätzung im aufgeklappten Thema).** Grundlage: Ein Tagwerk verschiebt die Schätzung je Thema um 1 bis 3 Punkte (RESEARCH.md).
  - **Jedes Thema mit Streifen und Ring (C+):** Abschnitt 3,5-mal so lang, Ring und Punkt fast deckungsgleich; zeigt die Punkte noch einmal.
  - **Quote in jeder Zeile neben den Punkten (B−):** „27 %“ neben drei Punkten liest sich als Quote von heute; die Themenliste in Fortschritt hat die Zahlen.
  - **Alle Fehler als kompakte Liste „falsch → richtig“ (B−):** schnell zu überfliegen, doppelt aber die Themenliste; beim Übersetzen stünde der ganze Satz zweimal da.
  - **„Erwartet etwa 6 Fehler (3 bis 9), heute 4“ (C+):** fast jeder Tag liegt im Bereich, das Modell kennt Übungsart und neu/Wiederholung nicht, und es folgt nichts daraus.
- **Wechsel bei „klar über Schnitt“: Überschrift und Legende (geprüft am 26.11.; gewählt in 24.78.1 und 24.78.2: je Richtung eine Überschrift, darunter die kurze Legende; „klar über Schnitt“ einmal je Abschnitt, die Schwellen unter „Schätzung“).**
  - **Eine Überschrift „Klar über Schnitt“ für beide Richtungen (C, 24.78.0):** stand auch über einem Thema, das es nicht mehr ist.
  - **Je Richtung eine Erklärzeile unter der Überschrift („Mit mindestens 90 % Wahrscheinlichkeit über deinem Schnitt.“) (B−):** genau, aber je zwei Zeilen mehr; die Schwellen stehen einmal in der Legende beim Zeichen.
  - **Legende einmal, im letzten Abschnitt (C+, 24.78.1):** sollte für beide gelten, las sich aber, als gehöre sie nur zu „Nicht mehr klar über Schnitt“.
  - **Schwellen in der Legende („ab 90 % Wahrscheinlichkeit darüber, heraus erst unter 60 %“) (C+, 24.78.1):** zwei Zeilen je Abschnitt für ein Umsetzungsdetail, das einen Tipp weiter unter „Schätzung“ steht; mit beiden Richtungen stand „klar über Schnitt“ viermal da.
  - **Legendeneintrag „% klar über Schnitt“ nur bei „Jetzt klar“ (B):** erklärt die rote Quote, die die Überschrift direkt darüber schon erklärt; die Legenden wären wieder verschieden.
  - **„klar über Schnitt“ in der Überschrift antippbar (B−):** gepunktet unterstrichene Überschriften gibt es sonst nicht, und die Erklärung steht schon unter „Schätzung“.
  - **Stand beim Start auch im gespeicherten Tagwerk (B, offen):** `est0` und `clear0` leben nur in der Sitzung; beendet Android die App mitten im Tagwerk, fehlen danach Ring und „vor dem Tagwerk“, verglichen wird mit gestern. Zwei kleine Felder in `run`, abwärtskompatibel; lohnt, wenn es dir auffällt.
  - **„Deine Zahlen“ als eigener Link unter den Aufgaben (B−, 24.78.0):** drei Links brachen bei 390 px um; der Tipp auf die Schätzung öffnet es jetzt wie in jeder Zeile.
- **Schätzung im aufgeklappten Thema, Darstellungen (geprüft am 26.11.; gewählt: Streifen wie überall, Stand vor der Runde als Ring, mit Legende).**
  - **Wahrscheinlichkeit über dem Schnitt mit den Schwellen 60 und 90 % (B):** zeigt genau die Größe hinter „klar über Schnitt“ und wie nah ein Wechsel ist; aber eine zweite Prozentzahl neben der Fehlerquote, und sie bewegt sich stark mit dem Schnitt. Steht als Satz in „Deine Zahlen“.
  - **Verlauf über 12 Wochen, klein (B−):** Zusammenhang statt Momentaufnahme, aber 120 px mehr zwischen den Aufgaben und derselbe Verlauf einen Tipp weiter in „Deine Zahlen“.
  - **Nur Zahlen in einem Satz (B−):** knapp und genau, aber ohne Bild ist der Abstand zum Schnitt schwerer zu sehen.
  - **Pfeil vom Ring zum Punkt (C+):** Pfeile heißen in der Themenliste „vier gegen vier Wochen“; bei 1 bis 3 Punkten ist er kürzer als der Punkt.
  - **Zwei Streifen, vorher und jetzt (C+):** doppelte Höhe für zwei fast gleiche Streifen.
- **Rückmeldung „Richtig“ (geprüft am 26.11.; umgesetzt in 24.78.0: kein leerer Streifen, „Auch richtig“ bei Lücken mit Alternative).** Erklärung beim ersten Kontakt auch bei richtig (B): Geratenes bekäme die Regel, kostet bei neuen Sätzen eine Zeile. Erklärung immer (C+): Lärm bei vier von fünf Antworten.
- **„se me cortó el dedo“ (geprüft am 26.11., auf deinen Wunsch gelassen).** Falsch gewertet zu Recht (das ungewollte „se me“ gilt für das Ding, dem etwas passiert; den Schnitt macht man selbst: me corté). Die Erklärung des Satzes spricht aber von „mi dedo“, und die Regel des Themas („se me cayó: Es ist mir passiert“) lädt genau zu diesem Fehler ein. Vorschlag war: Erklärung und eine Zeile in der Regel (A−), später eine Erkennung „se me“ statt „me“ (siehe „Verwechslung beim Namen nennen“).
- **Zweiter Versuch als Lücke an der Fehlerstelle (B, geprüft am 25.11.; gewählt in 24.77.0: der ganze Satz, wenn die Lücke schon stimmte).** „La reunión se puso ___ cuando …“ statt des ganzen Satzes wäre schneller. Die Fehlerstelle kommt aber aus dem Vergleich mit der nächsten Lösung, und ein Synonym, das in den Alternativen fehlt, sähe dort genauso aus wie ein Fehler; die Lücke fragte dann ein richtiges Wort ab.
- **Pause nach der Antwort zählt wie „Weiter“ (B, geprüft am 25.11.; gewählt in 24.77.0: Rückmeldung speichern).** So macht es „Beenden“ in den übrigen Runden. Beim Tagwerk ginge damit „Meine ist auch richtig“ verloren, und eine App, die Android ohne Pause beendet, stellte die Frage weiter neu.
- **Wortkästchen: Lösungssatz nicht wiederholen (C+, geprüft am 25.11.).** Wie bei den Lücken steht die Lösung nach einer richtigen Antwort oben schon da, aber als Kästchen ohne Großschreibung und Satzzeichen; der Satz darunter liest sich besser.
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
- Ranglisten, Herzen, Belohnungen, Konfettiregen, Wortschatz-Schätzungen als Spielerei; KI, Konto, Tracker. Sie widersprechen den Grundsätzen der App oder bringen beim Lernen wenig.
