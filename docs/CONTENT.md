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
- **Alternativen**: weitere richtige Übersetzungen, getrennt mit `;;`.
- **Niveau** (optional, sechste Spalte): `A2`, `B1` oder `B2`. Fehlt es, schätzt `estLevel()` nach Länge, Nebensätzen und anspruchsvollen Formen. Für „Fortgeschritten“ zählt diese Angabe.
- Die Kennung eines Satzes ist ein Hash des Zielsatzes. **Einen Zielsatz zu ändern, setzt seinen Lernstand zurück.** Tippfehler im Deutschen sind unkritisch.

Themen (Schlüssel wie `bisats`, `subjuntivo`) und ihre Regeltexte stehen in `TRAPS` in `src/js/part_head.js`.

## Wörterbuch (`src/data/gloss.js`)

Eine Zeile pro Form: `Form|Grundform|Deutsch`. Verbformen der Generatoren erzeugt `buildGloss()` selbst; Konjugationstabellen stehen in `src/js/generators.js`. Fehlt ein Wort, nennt `tests/unit/dictionary.test.js` es beim Namen.

## Weitere Inhalte

| Datei | Inhalt |
|---|---|
| `src/data/kultur.js` | Land & Leute: Kategorie, Titel (Zielsprache), Text, Beispielsatz, optional Varianten mit Flagge und Karte |
| `src/data/terms.js` | Grammatik- und App-Begriffe zum Antippen; Suchmuster als regulärer Ausdruck |
| `src/data/fundstueck.js` | Feste mit Datumsfunktion (bewegliche Feste über `easter()`), falsche Freunde, Begrüßungen |
| `src/js/forms.js` | Genus-Wörter, Fehler-finden-Rahmen, Umbauen, Uhrzeiten |
| `src/js/generators.js` | Grammatik-Generatoren (Adjektivendungen, Zeitformen, Konjugation, ser/estar, por/para, Konnektoren `VERB_SV`/`VERB_ES`, Verben mit Präposition `PREP_SV`/`PREP_ES`). Jeder Generator braucht mindestens 36 verschiedene Aufgaben, dreimal die Wiederholungssperre; `tests/unit/variety.test.js` prüft das |
| `src/data/geo.js` | Kartendaten, **nicht von Hand bearbeiten**: `npm run geo` erzeugt sie aus Natural Earth |

## Karten

Karten hängen an Einträgen in `kultur.js`: `map:{ v:'hisp' | 'nord', g:[[…Ländercodes Gruppe 1], [… Gruppe 2]], ctx:[…], pts:[…] }`. Gruppe *i* bekommt dieselbe Farbe wie der Punkt an Variante *i*. Ländercodes und Orte stehen in `tools/build_geo.js`; neue Orte dort ergänzen und `npm run geo` ausführen.

### Projektionen

Gewählt nach Messung, nicht nach Gewohnheit: `node tools/projection_check.js` berechnet für alle Grenzpunkte der dargestellten Länder die Tissot-Indikatrix aus der numerischen Jacobi-Matrix (Flächenfaktor σ = ab, Winkelverzerrung ω = 2·arcsin((a − b)/(a + b))).

| Ausschnitt | Projektion | Flächenfehler max/min | ω max | Begründung |
|---|---|---|---|---|
| Amerika und Spanien | Lambert flächentreu azimutal, Mitte 57,5° W 10° N | 1,00 | 22° | Die Karte färbt Länder ein, also flächentreu. Der Ausschnitt ist ungefähr kreisförmig; Mittelpunkt per Minimax über ω, jedes Land gleich gewichtet (`--search`). Bisher Plattkarte: Flächenfehler 1,78, ω max 33°. |
| Norden | Transversale Mercator, Mittelmeridian 15° O (wie SWEREF 99 TM) | 1,018 | 0° | Winkeltreu und deckungsgleich mit schwedischen Karten; der Flächenfehler von 1,8 % ist nicht sichtbar. |

Mercator scheidet für beide aus: Über den amerikanischen Ausschnitt beträgt sein Flächenfehler 3,18.

## Qualitätsregeln für Texte

Ruhig und sachlich, keine Ausrufezeichen, keine Füllwörter, Fakten nur, wenn sie stabil sind (keine Tagespolitik). Kulturkarten verknüpfen immer Sprache mit Inhalt und haben einen übernehmbaren Beispielsatz ohne deutsche Klammerzusätze im Zielsatz.

## Bausteine der Generatoren

Wortstellung (`inte`), Fehler finden und Umbauen auf Schwedisch ziehen aus `VP_SV` in `src/js/generators.js`. Eine Zeile:

```
['plockar', 'svamp', ['aldrig', 'alltid', 'ofta'], ['sammle', 'sammelst', 'sammelt', 'sammeln', 'sammeln'],
 '{S} {V} {A} Pilze', '{s} {A} Pilze {V}', 'På hösten', 'Im Herbst']
```

Verb im Präsens, Rest des Satzes, erlaubte Adverbien, deutsche Verbformen (ich, du, er/sie, wir, sie), deutscher Hauptsatz, deutscher Nebensatz (Verb am Ende), Satzanfang auf Schwedisch und Deutsch für die Inversion. Regeln: nur Verben aus einem Wort (keine Partikelverben wie „tycker om“), deutsches Verb in beiden Vorlagen dieselbe Form (kein „kaufe … ein“ / „einkaufe“), „inte“ nur, wo „nicht“ im Deutschen passt (bei unbestimmten Objekten wäre es „kein“). Spanisch: `ES_DAY` und `ES_VP` in `src/js/forms.js`, Infinitiv und Ergänzung; unregelmäßige Formen kommen aus `IRR_ES` und `PART_IRR`.

## Lesetipps (`READING` in `src/js/part_views.js`)

Je Sprache drei Quellen, vom leichten Einstieg bis zur normalen Zeitung. Bedingungen: frei lesbar ohne Konto und Bezahlschranke, Texte auch außerhalb des Landes erreichbar, redaktionell verantwortet. Derzeit 8 Sidor, SVT Nyheter, Svenska Yle sowie Noticias fácil (Discapnet), RTVE Noticias, BBC Mundo.

## Lesetexte (`src/data/texte.js`)

Themen, Leitlinien und Ideen für weitere Texte sammelt [THEMEN.md](THEMEN.md).

Je Text: Kennung, Thema, Niveau (A2, B1, B2, C1), Titel, Text (Absätze mit Leerzeile), drei Fragen auf Deutsch mit drei Antworten (die erste ist richtig, die App mischt) und der Textstelle, die die Antwort belegt (wörtlich aus dem Text) und mindestens zwei Sätze zum Übernehmen mit Übersetzung. Regeln: eigene Texte, keine übernommenen Absätze aus Zeitungen, Büchern oder Wikipedia; Fakten vorher prüfen; 70 bis 260 Wörter; jeder Satz endet mit Satzzeichen (Vorlesen und Hervorheben gehen satzweise); übernehmbare Sätze stehen wörtlich als ganzer Satz im Text. `tests/unit/texts.test.js` prüft das.

Das Wikipedia-Fundstück lädt zur Laufzeit über `w/api.php` (generator=categorymembers, TextExtracts) und zeigt Quelle, Auszeichnung und Lizenz (CC BY-SA 4.0). Es nimmt nur Artikel, die die Wikipedia-Gemeinschaft ausgezeichnet hat (`WIKI_CATS` in `part_read.js`: schwedisch „Utmärkta“ und „Bra artiklar“, spanisch „Artículos destacados“ und „Artículos buenos“), bevorzugt solche mit Bezug zum Kulturraum (`WIKI_NEAR`, Abgleich von Titel und Einleitung) und merkt sich die zuletzt gezeigten 400 Titel je Sprache (`DB.used.wikiSeen`), damit nichts wiederkommt. Zufällig ist nur der Einstieg in die alphabetische Liste der Kategorie. Vom Artikeltext wird nichts gespeichert. „Lückentext üben“ gibt den geladenen Text an die Lückentext-Runde weiter (`startRun('textgap', { body, title })`).

## Aussprachehilfen beim Nachsprechen

Regeln in `src/js/part_shadow.js`, nur was sicher gilt (`tests/unit/shadow.test.js` prüft Beispiele):
- Schwedisch: r verschmilzt mit d, t, n, s, l zu einem Laut (Mittelschweden), auch über die Wortgrenze (`svMarks`, `shHints`). sj-Laut bei sj, skj, stj am Wortanfang und bei -tion, -sion, -ssion; tj-Laut bei tj, kj am Wortanfang (sk, k, g vor hellem Vokal bleiben unmarkiert: zu viele Ausnahmen). Stumme Buchstaben: dj-, gj-, hj-, lj- am Wortanfang, g in -igt, Endungen von jag, det, vad. Alltagsformen in `SV_SAY` (mig → mej, de/dem → dom, och → å, någon → nån …); neue nur mit standardsprachlicher Aussprache, nicht mit Dialekt.
- Spanisch: betonter Vokal nach den Regeln der Rechtschreibung (`esStress`: Akzent, sonst vorletzte Silbe bei Vokal, n, s am Ende, sonst letzte). Einsilbige und unbetonte Wörter (`ES_ATONE`: Präpositionen, Konjunktionen, Relativwörter) bleiben unmarkiert. Bindung zwischen Wörtern vor Vokal oder stummem h, nicht vor hie-/hue- (Gleitlaut) und nicht über Satzzeichen.

## Nachschub von Tatoeba

`refill()` in `src/js/part_online.js` holt höchstens alle sechs Stunden neue Sätze, sobald weniger ungelernte übrig sind als für drei Tagwerke (bei „Fortgeschritten“ zählen nur Sätze, die dort auch drankommen). `tatPlan()` legt fest, wonach gesucht wird: zuerst das Thema mit den meisten Fehlern (`focusTrap`), dann Themen im Tageswechsel, zusammen drei, und ein Sachthema aus `TAT_THEMES`. Suchwörter je Thema stehen in `TAT_Q`, bei „Fortgeschritten“ die B2-Muster aus `TAT_ADV` (Anführungszeichen = genaue Wortfolge, `^` = Satzanfang). Die Satzlänge wächst mit dem Lernstand. `tatSamey()` sortiert aus: Standardnamen (Tom, Mary …), Sätze mit mindestens 60 % gleichen Inhaltswörtern (Grundformen) wie ein vorhandener, Zwei-Wort-Anfänge, die schon viermal vorkommen. Neue Suchwörter: ein Wort oder eine Wendung, die das Thema sicher trifft und auf Tatoeba genug Sätze hat; `tests/unit/tatoeba.test.js` prüft die Mindestzahl.
