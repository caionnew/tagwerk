# Inhalte pflegen

Alle Inhalte liegen als Daten in `src/data/` und sind ohne Programmierkenntnisse erweiterbar. Nach jeder Änderung: `npm run build && npm test`. Die Tests prüfen Format, Doppelungen und ob jedes angezeigte Wort im Wörterbuch steht.

## Satzbank (`src/data/content.js`)

Je Sprache und Thema ein Textblock, eine Zeile pro Satz:

```
Deutsch | Zielsprache | Lücke | Hinweis | Alternativen
Ich weiß, dass er heute nicht kommt. | Jag vet att han inte kommer idag. | | |
Ich bleibe zu Hause, weil … | Jag stannar hemma eftersom jag inte mår bra. | | | Jag stannar hemma för att jag inte mår bra.
```

- **Lücke**: Wort für Lückenaufgaben; weitere richtige Füllungen mit `/` (`gick/for`). Muss im Zielsatz vorkommen.
- **Hinweis**: nur, wenn er die Lösung nicht verrät (etwa die Grundform).
- **Alternativen**: weitere richtige Übersetzungen, getrennt mit `;;`. Was für jeden Satz gilt, prüft die App selbst und gehört nicht hierher: Groß- und Kleinschreibung, Satzzeichen, „i dag“/„idag“, Zahlen als Wort oder Ziffer, „jobba“/„arbeta“, „mejl“/„mail“, ein fehlendes „har“/„hade“ vor dem Supinum im schwedischen Nebensatz (att han aldrig fått mejlet) und ein betontes spanisches Subjektpronomen, wenn der deutsche Satz dieselbe Person nennt (Creo que él tiene razón). Gehören dagegen hierher: andere Wortstellungen, Synonyme, Varianten aus Lateinamerika, wo sie dort üblich sind (perdí statt he perdido, carro, celular).
- **Niveau** (optional, sechste Spalte): `A2`, `B1` oder `B2`. Fehlt es, schätzt `estLevel()` nach Länge, Nebensätzen und anspruchsvollen Formen. Für „Fortgeschritten“ zählt diese Angabe.
- **Erklärung** (siebte Spalte; die sechste darf dafür leer bleiben): erscheint bei falscher Antwort statt der allgemeinen Regel des Themas. Jeder Satz hat eine (`tests/unit/content.test.js` prüft das). Sie nennt die Regel am Satz selbst (… att han inte kommer, nicht nur „inte vor dem Verb“), höchstens etwa 160 Zeichen. Sie geht auch der allgemeinen Diagnose („Perfekt mit har“) vor, weil die nur sieht, ob „har“ fehlt.
- **Feste Wendungen**: Weicht das Bild vom Deutschen ab (Ende der Welt → hela världen), steht es in der Erklärung als `(wörtlich: nicht die ganze Welt)`, ohne weitere Klammern darin. Beim ersten Kontakt erscheint es als Hinweis zur Lücke (bei „Fortgeschritten“ auf Tipp), danach nicht mehr; sonst ließe sich die Lücke nur raten. Steht das Bild schon im deutschen Satz (zwei Fliegen → två flugor), braucht es keins. `tests/unit/content.test.js` prüft das für alle Redewendungen über das Wörterbuch: Die Bedeutung des Lückenworts muss im deutschen Satz stehen, sonst braucht die Erklärung „wörtlich:“. Das gilt in jedem Thema, nicht nur bei den Redewendungen (nu en gång = halt, wörtlich: nun einmal).
- Die Kennung eines Satzes ist ein Hash des Zielsatzes. **Einen Zielsatz zu ändern, setzt seinen Lernstand zurück.** Tippfehler im Deutschen sind unkritisch.

Themen (Schlüssel wie `bisats`, `subjuntivo`) und ihre Regeltexte stehen in `TRAPS` in `src/js/part_head.js`. `short` ist die fette Einleitung im Themenblatt und bleibt kurz (etwa ein Satz); wo mehrere Formen nebeneinanderstehen, zeigt `table` sie als kleine Übersicht (Zeilen aus Form, Gebrauch, Beispiel; bisher bei „werden“ und den Verbalperiphrasen), `rule` ergänzt danach nur noch, was nicht in die Übersicht passt.

### Neue Satzpakete: Abwechslung

Neue B2-Sätze kommen in Paketen (Fahrplan in [IDEEN.md](IDEEN.md#inhalte-satzpakete-ab-2456)). Damit nicht wieder dieselben Alltagswörter dominieren: je Paket eine Liste fehlender Wörter aus Häufigkeitslisten (Rang 1500 bis 8000), jeder Satz enthält mindestens eines; Sachgebiete mischen; eher 9 bis 16 Wörter; Subjekte abwechseln (nicht meist „jag“/„yo“). Nach dem Einfügen `node tools/build.js && node tools/vielfalt.js` (misst gegen `origin/main`: neue Inhaltswörter, Länge, Satzanfänge). `tests/unit/content.test.js` prüft dauerhaft: kein Zwei-Wort-Anfang unter den B2-Sätzen öfter als achtmal, höchstens ein Fünftel beginnt mit der ersten Person.

„Fehler finden“ nimmt Sätze aus der Satzbank auf: im Spanischen jeden Satz im Thema Subjuntivo, dessen Lücke ein Subjuntivo Präsens ist (eingesetzt wird der Indikativ), und Indefinido mit Zeitpunkt im Thema Perfecto (eingesetzt wird das Perfecto). Darum dort nur Auslöser, nach denen der Indikativ sicher falsch ist (para que, ojalá, antes de que, dudo que, no … ningún …); nicht als Lücke: Relativsätze in Fragen (¿Conoces a alguien que …?) oder el hecho de que, die beide Modi zulassen. Indikativ-Gegenbeispiele (aunque mit Tatsache, está claro que) dürfen ins Thema; sie werden nicht zu Fehlern.

Zwei Fallen aus Paket 4: Eine Lücke aus mehreren Wörtern (ska inte behöva) darf keine Inversion enthalten, sonst steht sie nicht zusammenhängend im Satz; das Subjekt dann nach vorn stellen. Und Formen mit zwei Bedeutungen prüfen, was das Wörterbuch anzeigt (händer erscheint als „Hände“, nicht als „geschieht“); passt es nicht, den Satz umbauen oder einen eigenen Eintrag anlegen. Falsche Freunde nur, wo die ähnliche Form wirklich in die Irre führt (Tal/tal, Laden/lada), nicht bei Wörtern, die dasselbe bedeuten (also/alltså).

Aus Paket 5: Bei Objektpronomen (Wörter legen) kommt „le“ als Ablenkwort dazu, sobald lo/la/los/las im Satz steht; darum kein lo für eine männliche Person, sonst wäre le (Leísmo) auch richtig. Bei gustar & Co. setzt „Fehler finden“ die andere Zahl ein; darum keine Sammelnamen (la mayoría de) und keine Subjekte aus zwei Teilen, bei denen beide Zahlen gingen. Verwandtschaftswörter wie tía, hija, prima ohne Grundform eintragen (Tante ist ein anderes Wort als Onkel), sonst zählt eine Verwechslung als Formfehler. Erklärungen im Wörterbuch, die nicht als Lückenhinweis erscheinen sollen, in Klammern setzen (cocina = Küche (auch: kocht)).

Plural im Wörterbuch kennzeichnen (`hyror|hyra|Mieten (Plural)`): „Fehler finden“ setzt bei hans/hennes/deras im Nebensatz die falsche Form sin/sitt/sina nach Genus und Zahl des folgenden Nomens ein und erkennt die Mehrzahl an diesem Vermerk.

## Wörterbuch (`src/data/gloss.js`)

Eine Zeile pro Form: `Form|Grundform|Deutsch`. Verbformen der Generatoren erzeugt `buildGloss()` selbst; Konjugationstabellen stehen in `src/js/generators.js`. Fehlt ein Wort, nennt `tests/unit/dictionary.test.js` es beim Namen.

## Weitere Inhalte

| Datei | Inhalt |
|---|---|
| `src/data/kultur.js` | Land & Leute: Kategorie, Titel (Zielsprache), Text, Beispielsatz, optional Varianten mit Flagge, Karte und passende Lesetexte (`txt`) |
| `src/data/terms.js` | Grammatik- und App-Begriffe zum Antippen; Suchmuster als regulärer Ausdruck, Erklärung und Beispiel je Sprache |
| `src/data/fundstueck.js` | Feste mit Datumsfunktion (bewegliche Feste über `easter()`), falsche Freunde, Begrüßungen |
| `src/js/forms.js` | Genus-Wörter, Fehler-finden-Rahmen, Umbauen, Uhrzeiten |
| `src/js/generators.js` | Grammatik-Generatoren (Adjektivendungen, Pluralklassen `PLURAL_SV`, Zeitformen, Konjugation, ser/estar, Verbalperiphrasen `PERI_ES`, por/para, Konnektoren `VERB_SV`/`VERB_ES`, Verben mit Präposition `PREP_SV`/`PREP_ES`). Jeder Generator braucht mindestens 36 verschiedene Aufgaben, dreimal die Wiederholungssperre; `tests/unit/variety.test.js` prüft das |
| `src/data/geo.js` | Kartendaten, **nicht von Hand bearbeiten**: `npm run geo` erzeugt sie aus Natural Earth |

## Karten

Karten hängen an Einträgen in `kultur.js`: `map:{ v:'hisp' | 'nord' | 'iber', g:[[…Ländercodes Gruppe 1], [… Gruppe 2]], ctx:[…], pts:[…], soft:[Gruppen heller], half:[einzelne Gebiete heller] }`. Gruppe *i* bekommt dieselbe Farbe wie der Punkt an Variante *i*. Ländercodes und Orte stehen in `tools/build_geo.js`; neue Orte dort ergänzen und `npm run geo` ausführen.

Der Ausschnitt `iber` zeigt Spanien mit seinen autonomen Gemeinschaften, Schlüssel nach ISO 3166-2 (`ES-CT` Katalonien, `ES-GA` Galicien, `ES-PV` Baskenland, `ES-NC` Navarra, `ES-CE` Ceuta usw.), dazu `AND` für Andorra; die Kanaren (`ES-CN`) stehen im Kasten unten links. Grundlage sind die Provinzen aus Natural Earth „admin 1“ (10m, gemeinfrei), zusammengelegt mit topojson. Die Datei ist rund 40 MB groß und bleibt außerhalb von Git; den Befehl zum Laden nennt der Kopf von `tools/build_geo.js`. `half` färbt ein Gebiet heller, wenn die Aussage dort nur für einen Teil gilt (Baskisch im Norden Navarras).

Eine Region innerhalb eines Landes auf den anderen Karten (bisher Schonen) färbt `clip:{ k:'SWE', p:'skaneClip', g:0 }`: das Land, beschnitten auf ein grobes Polygon aus `build_geo.js`, in der Farbe von Gruppe *g*. Das Polygon im Uhrzeigersinn angeben, sonst deutet d3-geo es als „alles außer“. Für ganze Länder reicht `g`; Regionen nur, wenn ihre Grenze für die Aussage zählt und auf der Karte noch sichtbar ist.

### Projektionen

Gewählt nach Messung, nicht nach Gewohnheit: `node tools/projection_check.js` berechnet für alle Grenzpunkte der dargestellten Länder die Tissot-Indikatrix aus der numerischen Jacobi-Matrix (Flächenfaktor σ = ab, Winkelverzerrung ω = 2·arcsin((a − b)/(a + b))).

| Ausschnitt | Projektion | Flächenfehler max/min | ω max | Begründung |
|---|---|---|---|---|
| Amerika und Spanien | Lambert flächentreu azimutal, Mitte 57,5° W 10° N | 1,00 | 22° | Die Karte färbt Länder ein, also flächentreu. Der Ausschnitt ist ungefähr kreisförmig; Mittelpunkt per Minimax über ω, jedes Land gleich gewichtet (`--search`). Bisher Plattkarte: Flächenfehler 1,78, ω max 33°. |
| Norden | Transversale Mercator, Mittelmeridian 15° O (wie SWEREF 99 TM) | 1,018 | 0° | Winkeltreu und deckungsgleich mit schwedischen Karten; der Flächenfehler von 1,8 % ist nicht sichtbar. |

Mercator scheidet für beide aus: Über den amerikanischen Ausschnitt beträgt sein Flächenfehler 3,18.

## Qualitätsregeln für Texte

Ruhig und sachlich, keine Ausrufezeichen, keine Füllwörter, Fakten nur, wenn sie stabil sind (keine Tagespolitik). Kulturkarten verknüpfen immer Sprache mit Inhalt und haben einen übernehmbaren Beispielsatz ohne deutsche Klammerzusätze im Zielsatz.

### Land & Leute: was hinein gehört

- **Ein Gedanke je Karte, den es sonst in der App nicht gibt.** Neue Wortvarianten nach Land (coche, carro, auto) bringen ab der fünften wenig; besser sind andere Arten von Unterschied: gleiches Wort mit anderer Bedeutung (tortilla), anderer Stilebene (coger), anderer Aussprache (seseo, skånska).
- **Abgrenzung:** Falsche Freunde (Deutsch–Zielsprache) stehen in `fundstueck.js`, Redewendungen in der Satzbank (Thema „Redewendungen“), längere Geschichten in den Lesetexten. Eine Karte wiederholt keinen dieser Einträge; gibt es einen passenden Lesetext, verlinkt sie ihn mit `txt`.
- **Karte nur, wenn sie etwas zeigt:** regionale Verteilung, die man sich über das Bild merkt. Länder, für die die Quellen nicht übereinstimmen, bleiben grau statt geraten.
- **Quellen:** Regionalangaben aus dem DLE (Länderkürzel der Bedeutung) oder der RAE-Ortografía, Geschichte aus Fachliteratur. Im Text steht nur, was die Quelle trägt.

### Grammatik-Begriffe

Ein Begriff bekommt eine Fassung für jede Sprache, in deren Erklärungen er vorkommt (Themen, Satzbank, Wörterbuch), mit Beispiel in dieser Sprache. `tests/unit/terms.test.js` meldet Begriffe, die in einer Sprache vorkommen, aber dort keine Fassung haben. Die Liste unter „Üben“ zeigt nur die Begriffe der gewählten Sprache.

## Bausteine der Generatoren

Wortstellung (`inte`), Fehler finden und Umbauen auf Schwedisch ziehen aus `VP_SV` in `src/js/generators.js`.

Fehler finden (`src/js/forms.js`): Jede Aufgabe entsteht als fehlerhafter Satz mit genau einer Fehlerstelle und dem richtigen Satz dazu. Rund 40 % kommen als richtiger Satz (`spotVariant`), damit man das kritische Wort prüfen muss, statt es nur zu suchen; die Erklärung muss deshalb für beide Fälle passen (sie beschreibt die Regel am richtigen Satz). `fix` nur, wo die Verbesserung nicht aus dem Finden folgt (Subjuntivo, Indefinido, Präteritum, bestimmte Form, sin/hans, Präposition, Konnektor); bei Paaren (ser/estar, por/para, en/ett, gusta/gustan, Stellung) bleibt es beim Antippen.

Die Fehlerarten stehen in `SPOT_CATS`, je Sprache sieben. Neue Arten nur aus Quellen, bei denen der eingesetzte Fehler sicher falsch ist: Generatoren mit festem Gegenstück (ser/estar, por/para), Auswahllisten mit genau einer richtigen Option (`PREP_*`, `VERB_*`, über `spotChoice`) oder Sätze der Satzbank mit eindeutiger Regel (Subjuntivo nach festen Auslösern, Indefinido mit Zeitpunkt, gustar in Einzahl/Mehrzahl, hans/hennes dort, wo „sin“ nicht stehen kann). Nicht eindeutig und deshalb nicht dabei: sin → hans (geht auch, dann mit anderem Besitzer), „me da igual“ → „me dan igual“. Auswahl (`spotWeights`) nur über Wahrscheinlichkeiten, keine festen Regeln (die durchschaut man): Grundgewicht 1, Satzbank-Arten mit weniger als 12 Sätzen anteilig weniger; mal 0,5 bis 2 nach der eigenen Fehlerquote im Thema (30 Tage, geglättet); mal ½ für die Art der letzten Aufgabe (`DB.used.spotLast`, geschrieben von `makeFresh` über `seen()`). Richtig oder fehlerhaft entscheidet jedes Mal unabhängig der Zufall.

Eine Zeile aus `VP_SV`:

```
['plockar', 'svamp', ['aldrig', 'alltid', 'ofta'], ['sammle', 'sammelst', 'sammelt', 'sammeln', 'sammeln'],
 '{S} {V} {A} Pilze', '{s} {A} Pilze {V}', 'På hösten', 'Im Herbst']
```

Verb im Präsens, Rest des Satzes, erlaubte Adverbien, deutsche Verbformen (ich, du, er/sie, wir, sie), deutscher Hauptsatz, deutscher Nebensatz (Verb am Ende), Satzanfang auf Schwedisch und Deutsch für die Inversion. Regeln: nur Verben aus einem Wort (keine Partikelverben wie „tycker om“), deutsches Verb in beiden Vorlagen dieselbe Form (kein „kaufe … ein“ / „einkaufe“), „inte“ nur, wo „nicht“ im Deutschen passt (bei unbestimmten Objekten wäre es „kein“). Spanisch: `ES_DAY` und `ES_VP` in `src/js/forms.js`, Infinitiv und Ergänzung; unregelmäßige Formen kommen aus `IRR_ES` und `PART_IRR`. Die Ergänzung muss zu jeder Person passen (also „a los abuelos“, nicht „a su madre“, das bei tú schief wäre). Dasselbe gilt für `CONJ_COMP` in `src/js/generators.js` (Verbformen): Jedes Verb aus `IRR_ES` und `REG_ES` braucht dort eine Ergänzung, die mit allen vier Signalen einen sinnvollen Satz ergibt (Normalmente …, Ayer …, Antes … siempre …, Es importante que …). Hängt sie von Zahl oder Zeitform ab, ist sie eine Funktion (ser: puntual/puntuales); passt eine Zeitform gar nicht (ayer + vivir), wird sie im Generator ausgelassen.

Weitere richtige Fassungen gehören in die Lösungen: bei `VP_SV` als neuntes Feld (`[['åker', 'på semester i juli'], ['har', 'semester i juli']]`), beim Umbauen auf Spanisch kommen das betonte Subjektpronomen (Quiero que tú vengas) und „Ojalá que“ von selbst dazu, bei Uhrzeiten „klockan är …“, „en punto“ und die Digitalform (las tres y cuarenta). Auswahlaufgaben (`VERB_SV`, `VERB_ES`, `PREP_SV`, `PREP_ES`) haben genau eine richtige Option, auch ohne den deutschen Satz: Eine seltene, aber korrekte Variante (fiarse en) gehört nicht unter die falschen Optionen. Adjektive bei „Begleiter & Adjektive“ (Spanisch) nur, wo sie inhaltlich passen (`ADJ_FIT_ES`); Wörter mit zwei richtigen Genera (radio, mar) stehen nicht in `GENUS`.

## Lesetipps (`READING` in `src/js/part_views.js`)

Je Sprache drei Quellen, vom leichten Einstieg bis zur normalen Zeitung. Bedingungen: frei lesbar ohne Konto und Bezahlschranke, Texte auch außerhalb des Landes erreichbar, redaktionell verantwortet. Derzeit 8 Sidor, SVT Nyheter, Svenska Yle sowie Noticias fácil (Discapnet), RTVE Noticias, BBC Mundo.

## Lesetexte (`src/data/texte.js`)

Ideen für weitere Themen stehen in [IDEEN.md](IDEEN.md#lesetexte-themen-für-später), Ideen für die App ebenda.

Je Text: Kennung, Thema, Niveau (A2, B1, B2, C1), Titel, Text (Absätze mit Leerzeile), drei Fragen auf Deutsch mit drei Antworten (die erste ist richtig, die App mischt) und der Textstelle, die die Antwort belegt (wörtlich aus dem Text) und mindestens zwei Sätze zum Übernehmen mit Übersetzung. Regeln: eigene Texte, keine übernommenen Absätze aus Zeitungen, Büchern oder Wikipedia; Fakten vorher prüfen; 70 bis 260 Wörter; jeder Satz endet mit Satzzeichen (Vorlesen und Hervorheben gehen satzweise); übernehmbare Sätze stehen wörtlich als ganzer Satz im Text. `tests/unit/texts.test.js` prüft das.

### Lücken aus Lesetexten (`textGapData` in `src/js/generators.js`)

Die Übung nimmt nur Texte, deren Fragen beantwortet sind. Hinweis ist die deutsche Bedeutung aus dem Wörterbuch (alle Bedeutungen der Grundform bis 40 Zeichen, ohne Grammatik-Angaben), dazu der Anfangsbuchstabe als Platzhalter in der Lücke, damit Synonyme ausscheiden (Sprache, l… = lengua, nicht idioma). Die Grundform ist ein zweiter Hinweis, bei „Fortgeschritten“ auf Tipp.

Lücke werden kann nur ein Wort, dessen Grundform einen eigenen Wörterbucheintrag hat. Es fallen heraus: `GAP_COMMON` (Funktionswörter und Grundwortschatz, von Hand gepflegt), alle Grundformen aus A2-Sätzen der Satzbank, Hilfsverben (`GAP_AUX`), Zahlen und Hinweise, die die Lösung enthalten. Gebeugte Verbformen bleiben auch bei häufigen Verben (consiguieron, gick), sie zählen doppelt. Stolperstellen, die als Regel abgefangen werden: Verbform direkt nach Artikel oder Präposition ist ein Nomen (la cocina), spanische 1. Person Präsens ebenso (juego), weibliche Nomen nicht auf die männliche Form zurückführen (partida), spanische Partizipien als Adjektiv (querida), schwedische Plurale, die wie Verben aussehen (lagar), mit se davor nur die rückbezügliche Bedeutung, feste Wendungen aus dem Wörterbuch (så fort = sobald). Wörter, die beim Lesen nachgeschlagen wurden, kommen ab dem Tag danach zuerst dran, auch ohne Wörterbucheintrag (dann mit zwei Anfangsbuchstaben), und sind abgehakt, sobald sie an einem späteren Tag richtig ergänzt sind.

**Wörterbuch für Lesetexte:** Jedes Wort eines Lesetextes, auch Namen, muss nachschlagbar sein (Test), und gebeugte Formen brauchen einen Eintrag ihrer Grundform (Test; Ausnahmen in `NO_BASE`, wenn die vorhandene Grundform im Text etwas anderes meint). Neue Texte also gleich mit ihren Wörtern in `src/data/gloss.js` eintragen: Form | Grundform | Deutsch, die im Text gemeinte Bedeutung zuerst, weitere nach Semikolon. Zeitformen in Klammern mit den Begriffen der Sprache (Schwedisch: Präsens, Präteritum, Supinum, Passiv, t-Form; Spanisch: Präsens, Indefinido, Imperfecto, Subjuntivo, Futur, Partizip, Gerundio), feste Wendungen mit „=“ (så fort = sobald). Eine Grundform, die schon mit anderer Bedeutung im Wörterbuch steht (vår = unser), nicht als Grundform angeben, sondern die Form mit eigener Bedeutung eintragen (våren||der Frühling).

Das Wikipedia-Fundstück lädt zur Laufzeit über `w/api.php` (generator=categorymembers, TextExtracts) und zeigt Quelle, Auszeichnung und Lizenz (CC BY-SA 4.0). Es nimmt nur Artikel, die die Wikipedia-Gemeinschaft ausgezeichnet hat (`WIKI_CATS` in `part_read.js`: schwedisch „Utmärkta“ und „Bra artiklar“, spanisch „Artículos destacados“ und „Artículos buenos“), bevorzugt solche mit Bezug zum Kulturraum (`WIKI_NEAR`, Abgleich von Titel und Einleitung) und merkt sich die zuletzt gezeigten 400 Titel je Sprache (`DB.used.wikiSeen`), damit nichts wiederkommt. Zufällig ist nur der Einstieg in die alphabetische Liste der Kategorie. Vom Artikeltext wird nichts gespeichert. „Lückentext üben“ gibt den geladenen Text an die Lückentext-Runde weiter (`startRun('textgap', { body, title })`).

### Leitlinien für Themen

- Für Erwachsene, die fortgeschritten sind: B2 oder C1, etwa 170 bis 230 Wörter, drei Fragen, drei Sätze fürs Tagwerk.
- Nicht das Erwartbare. Astrid Lindgren, Vasa, Surströmming, Siesta und Tomatina sind abgedeckt. Gesucht ist, was für Ausländer wirklich neu ist.
- Breite Mischung: Gesellschaft, Bräuche, Lokales, Sport, Persönlichkeiten, Tiere und Pflanzen, Anekdoten. Politik und Nachrichten nur als Teil davon, nicht als Schwerpunkt.
- Objektiv statt krampfhaft neutral: Tatsachen klar benennen. Wo etwas wirklich umstritten ist, die Lesarten nennen, ohne jede Aussage auszubalancieren.
- Jede Zahl, jedes Datum und jedes Urteil vor dem Schreiben an Quellen prüfen (Behörden, Gesetzblätter, Gerichte, Statistikämter, seriöse Presse). Zeitgebundenes mit Jahr nennen.
- Keine Doppelungen im Kern: zum Beispiel nur ein Lotterie-Thema (La ONCE), deshalb kein Text über El Gordo.

### Geschrieben

Damit sich nichts im Kern doppelt.

- 24.46.0 (B2/C1): eccehomo, uvas, silbo, lince, cholitas, campoamor, ratonperez, mate.
- 24.44.0 (B2/C1): dagenh, kalleanka, studentflak, almedalen, vargen, vasaloppet, alvamyrdal, meankieli.
- 24.24.0 (B2/C1): offentlighet, grannenslon, kiruna, samer, friskolor, nato, systembolaget, miljonprogrammet; hora, memoria, marmenor, once, chile, uruguay, bolivia, barcelona.
- Frühere Texte (A2 bis B2): allemansratten, vasa, midnattssol, astrid, surstromming, ishotellet, foraldraledig; espanavaciada, lenguas, siesta, castells, camino, galapagos, machupicchu, muertos, tomatina.

## Aussprachehilfen beim Nachsprechen

Regeln in `src/js/part_shadow.js`, nur was sicher gilt (`tests/unit/shadow.test.js` prüft Beispiele):
- Schwedisch: r verschmilzt mit d, t, n, s, l zu einem Laut (Mittelschweden), auch über die Wortgrenze (`svMarks`, `shHints`). sj-Laut bei sj, skj, stj am Wortanfang und bei -tion, -sion, -ssion; tj-Laut bei tj, kj am Wortanfang (sk, k, g vor hellem Vokal bleiben unmarkiert: zu viele Ausnahmen). Stumme Buchstaben: dj-, gj-, hj-, lj- am Wortanfang, g in -igt, Endungen von jag, det, vad. Alltagsformen in `SV_SAY` (mig → mej, de/dem → dom, och → å, någon → nån …); neue nur mit standardsprachlicher Aussprache, nicht mit Dialekt.
- Spanisch: betonter Vokal nach den Regeln der Rechtschreibung (`esStress`: Akzent, sonst vorletzte Silbe bei Vokal, n, s am Ende, sonst letzte). Einsilbige und unbetonte Wörter (`ES_ATONE`: Präpositionen, Konjunktionen, Relativwörter) bleiben unmarkiert. Bindung zwischen Wörtern vor Vokal oder stummem h, nicht vor hie-/hue- (Gleitlaut) und nicht über Satzzeichen.

## Nachschub von Tatoeba

`refill()` in `src/js/part_online.js` holt höchstens alle sechs Stunden neue Sätze, sobald weniger ungelernte übrig sind als für drei Tagwerke (bei „Fortgeschritten“ zählen nur Sätze, die dort auch drankommen). `tatPlan()` legt fest, wonach gesucht wird: zuerst das Thema mit den meisten Fehlern (`focusTrap`), dann Themen im Tageswechsel, zusammen drei, und ein Sachthema aus `TAT_THEMES`. Suchwörter je Thema stehen in `TAT_Q`, bei „Fortgeschritten“ die B2-Muster aus `TAT_ADV` (Anführungszeichen = genaue Wortfolge, `^` = Satzanfang). Die Satzlänge wächst mit dem Lernstand. `tatSamey()` sortiert aus: Standardnamen (Tom, Mary …), Sätze mit mindestens 60 % gleichen Inhaltswörtern (Grundformen) wie ein vorhandener, Zwei-Wort-Anfänge, die schon viermal vorkommen. Neue Suchwörter: ein Wort oder eine Wendung, die das Thema sicher trifft und auf Tatoeba genug Sätze hat; `tests/unit/tatoeba.test.js` prüft die Mindestzahl.
