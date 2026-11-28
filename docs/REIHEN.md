# Reihen: Lesetexte in Fortsetzungen

Stand: 28. November 2026 (Rahmen seit 24.97.0, Inhalte folgen in Paketen). Ideen und Themen mit Noten in IDEEN.md.

## Was eine Reihe ist

Mehrere Lesetexte, die aufeinander aufbauen und nur in fester Reihenfolge gelesen werden: eine Geschichte in Teilen, kein Stapel
„Thema 1, Teil 1“. Sie leben in „Lesen und Hören“ über den Einzeltexten und nutzen denselben Leser (Vorlesen, „Nur hören“, Antippen,
Fragen mit Textstelle, „Ins Tagwerk“, Lückentext). Neu ist die Ebene darüber:

- **Karte** in „Lesen und Hören“: Thema, Niveau, Fortschritt als Striche; die Erzählform zeigt die App nicht (man soll unvoreingenommen
  hineinlesen), sie steht nur in den Daten und in IDEEN.md. Tipp auf eine begonnene Reihe öffnet gleich
  den nächsten Teil, sonst die Übersicht.
- **Übersicht:** Einleitung, „Was ist echt?“, die Teile als Schiene (wie „Dein Weg“), Personen und Wörter der Reihe. Titel und Zeitangaben
  späterer Teile, Personen und Wörter erscheinen erst, wenn man so weit ist (kein Vorgriff). Gelesene Teile lassen sich jederzeit noch einmal
  lesen, die Fragen noch einmal beantworten; das beste Ergebnis bleibt.
- **Teil:** Datumszeile unter dem Titel, ab Teil 2 „Bisher“ (zwei Sätze), am Ende „Im nächsten Teil“ mit einem Satz Vorschau und die
  Quellen.
- **Heute:** Fortsetzung statt Fundstück, solange eine Reihe offen ist, in den letzten sieben Tagen gelesen wurde und heute noch kein
  Teil dran war.
- **Reihenfolge:** Ein Teil gilt als gelesen, sobald man zu den Fragen geht (Knopf oder Ende des Vorlesens); dann öffnet sich der
  nächste. Keine Wartezeit.

## Sprache je Niveau

| | Grundlagen | Mittel | Fortgeschritten |
|---|---|---|---|
| Titel, Vorschau, Kartentext | Zielsprache | Zielsprache | Zielsprache |
| Einleitung, „Bisher“ | Deutsch | Zielsprache, „Auf Deutsch“ darunter (Einleitung) | wie Mittel |
| Fragen | Deutsch | Deutsch | Zielsprache, wenn der Teil sie mitbringt |
| „Was ist echt?“, Personen, Bedienung | Deutsch | Deutsch | Deutsch |

## Aufbau in data/reihen.js

```js
{ id:'palme', title:'Natten på Sveavägen', topic:'Geschichte', level:'B2', form:'live',
  teaser:'Mordet på Olof Palme, från skotten till svaret 34 år senare.',      // Zielsprache, eine Zeile für die Karte
  intro:['Den 28 februari 1986 skjuts …', 'Am 28. Februar 1986 wird …'],          // zwei Sätze: Zielsprache, Deutsch
  real:'Alles belegt: Daten, Orte, Personen. Keine erfundenen Figuren …',          // Deutsch
  cast:[['Olof Palme', 'Ministerpräsident, Sozialdemokrat', 1]],                    // Name, Beschreibung (deutsch), ab Teil
  words:[['livvakt', 1], ['utredning', 3]],                                         // Schlüsselwörter der Reihe, ab Teil
  parts:[{
    title:'Fredag kväll', when:'28 feb 1986', date:'Stockholm, fredag 28 februari 1986',
    hook:'…',                                    // ein Satz Vorschau in der Zielsprache, steht am Ende des vorigen Teils und auf „Heute“
    recap:['…', '…'],                            // ab Teil 2: was bisher geschah, zwei Sätze, Zielsprache und Deutsch
    body:`…`,                                    // wie ein Lesetext: Absätze mit Leerzeile, jeder Satz endet mit . ! ?
    q:[['Frage?', ['richtig', 'falsch', 'falsch'], 'Textstelle wörtlich', 'Fråga?', ['rätt', 'fel', 'fel']]],
    keep:[['Satz aus dem Text.', 'Übersetzung.']],
    src:['Quelle 1', 'Quelle 2'] }] }
```

Kennung eines Teils: `palme-1`, `palme-2` … (Speicher: `DB.used.texts["sv:palme-2"]`, wie bei Einzeltexten). Erzählformen (`form`):
live (Wie es geschah), figur (Mit erfundener Figur), stimmen (Viele Stimmen), chronik (Familienchronik), briefe (Briefe und
Dokumente), spuren (Ermittlung), ding (Ein Gegenstand erzählt), wahl (Du entscheidest), tage (Ein Tag, der alles änderte), reise
(Reisetagebuch).

## Regeln für den Inhalt

- **Länge:** 200 bis 300 Wörter je Teil (zwei bis drei Minuten), 4 bis 7 Teile, eine Reihe auf einem Niveau.
- **Spannend, nicht lexikalisch:** jede Reihe in einer Erzählform; Teile enden mit einer offenen Frage oder einem Wendepunkt.
  Die Form ist eine kreative Entscheidung je Reihe, kein Standard: mit oder ohne Figur, Stimmen, Dokumente, was der Stoff trägt.
  Die Reihen sollen sich unterscheiden: möglichst jede in einer Form, die noch keine hat, nie zweimal dieselbe hintereinander.
  „Wie es geschah“: Präsens, jeder Teil kennt nur den Stand seines Tages. Das sagt die Form, nicht die Einleitung.
- **Was ist echt:** Kurz, höchstens 200 Zeichen: was erfunden ist, dass der Rest belegt ist, wie Gesagtes wiedergegeben wird.
  Kein Hinweis auf die Quellen (stehen am Ende jedes Teils) und keiner auf die Form („Wer erzählt, ist erfunden“). Jede erfundene Figur wird in „Was ist echt?“ genannt. Echte Personen bekommen keine erfundenen Zitate, nur
  belegte oder sinngemäß wiedergegebene. Unsicheres und Legenden als solche benennen (Nobels zu früher Nachruf).
- **Quellen:** je Teil zwei bis vier, jede Tatsache aus mindestens einer. Daten, Zahlen und Namen gegen die Quellen prüfen.
- **Umstrittenes** (Bürgerkrieg, Katalonien, Samen) aus mehreren Perspektiven. Gewalt benennen, nicht ausmalen.
- **Wortschatz:** Schlüsselwörter kommen in mehreren Teilen wieder (dasselbe Thema über viele Texte ist der eigentliche Lerngewinn);
  sie stehen in `words`. Jedes Wort aus Titel, Text, Vorschau, „Bisher“ und Einleitung ist nachschlagbar (wie bei Lesetexten).
- **Fragen:** drei je Teil, erste Antwort richtig, Textstelle wörtlich; gleich in beiden Sprachen schreiben. Ab Teil 3 darf eine
  Frage einen früheren Teil abfragen („Erinnerst du dich?“), die Textstelle steht dann im früheren Teil (kommt mit der Prüfung dafür).
- **Sprache:** idiomatisch, alle Fassungen lesen. Spanisch neutral, wo es geht (casa statt piso, teléfono statt móvil).

## Ablauf je Paket

1. Recherche mit Quellen, Zeitleiste der Fakten.
2. Gliederung: Teile, Wendepunkte, wer wann auftritt, Schlüsselwörter.
3. Text je Teil, dann „Bisher“, Vorschau, Einleitung.
4. Faktenprüfung gegen die Quellen, Sprachprüfung, Niveau.
5. Fragen in beiden Sprachen, Sätze zum Übernehmen, Wörterbuch ergänzen.
6. Tests (Aufbau, Länge, Textstellen, Nachschlagbarkeit) und Sichtprüfung.
