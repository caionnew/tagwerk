/* Reihen: Lesetexte, die aufeinander aufbauen und in fester Reihenfolge gelesen werden (Rahmen seit 24.97.0, Inhalte in
   Paketen). Aufbau, Erzählformen und Regeln für den Inhalt in docs/REIHEN.md. Kurz:
   { id, title, topic, level, form, teaser, intro:[Zielsprache, Deutsch], real, cast:[[Name, Beschreibung, ab Teil]],
     words:[[Wort, ab Teil]], parts:[{ title, when, date, hook, recap:[Zielsprache, Deutsch], body, q, keep, src }] }
   Jeder Teil hat dieselben Felder wie ein Lesetext (body, q, keep); Kennung, Thema und Niveau kommen von der Reihe. */
const SERIES = {
sv:[],
es:[]
};
