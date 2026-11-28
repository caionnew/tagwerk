/* Reihen: Lesetexte, die aufeinander aufbauen und in fester Reihenfolge gelesen werden (Rahmen seit 24.97.0, Inhalte in
   Paketen). Aufbau, Erzählformen und Regeln für den Inhalt in docs/REIHEN.md. Kurz:
   { id, title, topic, level, form, teaser, intro:[Zielsprache, Deutsch], real, cast:[[Name, Beschreibung, ab Teil]],
     words:[[Wort, ab Teil]], parts:[{ title, when, date, hook, recap:[Zielsprache, Deutsch], body, q, keep, src }] }
   Jeder Teil hat dieselben Felder wie ein Lesetext (body, q, keep); Kennung, Thema und Niveau kommen von der Reihe. */
const SERIES = {
sv:[
// Paket 1 (24.98.0): Palme-Mord, „Wie es geschah“. Fakten geprüft am 28.11.2026 an den Quellen je Teil; Stand der Ermittlung
// nach dem Beschluss vom 18.12.2025 (Oberstaatsanwalt Guné: Engström nicht mehr benannt, Ermittlung bleibt eingestellt).
{ id:'palme', title:'Natten på Sveavägen', topic:'Geschichte', level:'B2', form:'live',
  teaser:'Mordet på Olof Palme, från skotten på Sveavägen till i dag.',
  intro:['Den 28 februari 1986 skjuts statsminister Olof Palme ihjäl på väg hem från bion. Det här är berättelsen om natten, spåren och frågan som Sverige fortfarande saknar svar på.',
    'Am 28. Februar 1986 wird Ministerpräsident Olof Palme auf dem Heimweg vom Kino erschossen. Die Geschichte der Nacht, der Spuren und der Frage, auf die Schweden bis heute keine Antwort hat.'],
  real:'Alles belegt: Daten, Uhrzeiten, Orte und Personen nach Angaben der Polizei, Gerichtsentscheidungen und Presseberichten. Keine erfundenen Figuren und keine erfundenen Zitate; was jemand sagte, steht sinngemäß da.',
  cast:[['Olof Palme', 'Ministerpräsident, Sozialdemokrat', 1], ['Lisbet Palme', 'seine Frau', 1], ['Mårten Palme', 'der Sohn, mit seiner Freundin im Kino', 1],
    ['Ingvar Carlsson', 'stellvertretender Ministerpräsident, übernimmt in der Nacht', 2], ['Hans Holmér', 'Polizeichef von Stockholm, leitet die Ermittlung', 3],
    ['„33-åringen“', 'der erste Verdächtige, nach wenigen Tagen frei', 3], ['Christer Pettersson', '1989 verurteilt, im selben Jahr freigesprochen', 5],
    ['Krister Petersson', 'Chefankläger, stellt 2020 die Ermittlung ein', 6], ['Stig Engström', 'der „Skandia-Mann“, 2020 benannt, gestorben 2000', 6],
    ['Lennart Guné', 'Oberstaatsanwalt, prüft 2025 den Beschluss', 6]],
  words:[['livvakt', 1], ['biograf', 1], ['skott', 2], ['gärningsman', 2], ['utredning', 3], ['vittne', 3], ['bevis', 3], ['åklagare', 3], ['spår', 4], ['tingsrätt', 5], ['hovrätt', 5], ['åtala', 6]],
  parts:[
    { title:'Fredag kväll', when:'28 feb 1986', date:'Stockholm, fredag 28 februari 1986',
      body:`Klockan är åtta på fredagskvällen den 28 februari 1986. I lägenheten i Gamla stan bestämmer sig Olof och Lisbet Palme för att gå på bio. Deras son Mårten och hans flickvän ska se en ny svensk film, ”Bröderna Mozart”, på biografen Grand på Sveavägen. Föräldrarna följer med.

Några livvakter har statsministern inte med sig. Han har redan sagt att han inte behöver dem mer i dag. Palme vill kunna röra sig fritt i sin stad, och i Sverige är det inte ovanligt att en politiker går omkring utan skydd.

Strax efter halv nio tar paret tunnelbanan från Gamla stan till Rådmansgatan. Vid biografen träffar de sonen och hans flickvän, och Palme köper biljetterna själv i kassan. Filmen börjar kvart över nio. Den handlar om en regissör som sätter upp en opera av Mozart på sitt eget sätt.

Strax efter elva är filmen slut. En stund står de fyra kvar på trottoaren och pratar. Sedan säger föräldrarna hej då och börjar gå söderut längs Sveavägen, mot Hötorget. Vid Adolf Fredriks kyrka går de över gatan. De stannar framför ett skyltfönster och fortsätter sedan på den östra sidan.

Det är nästan tomt på gatan. Vid hörnet av Tunnelgatan är klockan 23.21. En man kommer gående bakom dem.`,
      q:[['Welchen Film wollten sie sehen?', ['Einen neuen schwedischen Film, „Bröderna Mozart“', 'Eine Oper von Mozart', 'Einen amerikanischen Krimi'], 'Deras son Mårten och hans flickvän ska se en ny svensk film', 'Vilken film ska de se?', ['En ny svensk film, ”Bröderna Mozart”', 'En opera av Mozart', 'En amerikansk deckare']],
         ['Warum hatte Palme keine Leibwächter dabei?', ['Er hatte gesagt, dass er sie an diesem Tag nicht mehr braucht', 'Sie warteten am Kino', 'Schwedische Politiker durften keine haben'], 'Han har redan sagt att han inte behöver dem mer i dag.', 'Varför har Palme inga livvakter med sig?', ['Han har sagt att han inte behöver dem mer i dag', 'De väntar vid biografen', 'Svenska politiker får inte ha livvakter']],
         ['Wohin gingen Olof und Lisbet nach dem Film?', ['Nach Süden, Richtung Hötorget', 'Zurück zur Rådmansgatan', 'In ein Restaurant'], 'börjar gå söderut längs Sveavägen, mot Hötorget', 'Vart går Olof och Lisbet efter filmen?', ['Söderut, mot Hötorget', 'Tillbaka till Rådmansgatan', 'Till en restaurang']]],
      keep:[['Föräldrarna följer med.', 'Die Eltern gehen mit.'], ['Det är nästan tomt på gatan.', 'Die Straße ist fast leer.']],
      src:['Wikipedia (englisch), „Assassination of Olof Palme“', 'Polisen, „Palmeutredningen – polisens arbete“'] },
    { title:'Natten', when:'1 mars 1986', date:'Stockholm, natten till lördag 1 mars 1986',
      hook:'Två skott på Sveavägen, och en man som springer.',
      recap:['Fredag kväll, 28 februari 1986: Olof och Lisbet Palme går hem från bion utan livvakter. Vid hörnet av Tunnelgatan kommer en man gående bakom dem.',
        'Freitagabend, 28. Februar 1986: Olof und Lisbet Palme gehen ohne Leibwächter vom Kino nach Hause. An der Ecke Tunnelgatan kommt ein Mann hinter ihnen her.'],
      body:`Mannen lyfter en revolver och skjuter Olof Palme i ryggen på nära håll. Sedan skjuter han en gång till. Kulan träffar Lisbet Palme, men hon skadas bara lätt. Statsministern faller ihop på trottoaren. Gärningsmannen springer in på Tunnelgatan och uppför trapporna mot Malmskillnadsgatan. Sedan försvinner han.

Allt har gått på några sekunder. En taxichaufför har sett skotten och ropar ut det i taxiradion. Två unga kvinnor i en bil i närheten springer fram och försöker hjälpa. Efter ett par minuter kommer en polisbil, och en ambulans som råkar köra förbi stoppas. Klockan 23.28 åker den mot Sabbatsbergs sjukhus. Lisbet vägrar att lämna sin man.

På sjukhuset kan läkarna inte rädda honom. Klockan 00.06, natten till lördagen, förklaras Olof Palme död. Han blev 59 år.

Vice statsminister Ingvar Carlsson får beskedet och åker till regeringskansliet Rosenbad. Klockan 00.45 är han där och tar över statsministerns uppgifter. Klockan 01.10 kommer nyheten i radio. De flesta svenskar sover och får veta det först på morgonen. Klockan 05.15 håller regeringen presskonferens.

Polisen letar efter mannen från Sveavägen. Men ingen vet vem han är, och ingen vet vart han har tagit vägen.`,
      q:[['Wie wird Lisbet Palme verletzt?', ['Leicht, vom zweiten Schuss', 'Schwer, vom ersten Schuss', 'Gar nicht'], 'Kulan träffar Lisbet Palme, men hon skadas bara lätt.', 'Hur skadas Lisbet Palme?', ['Lätt, av det andra skottet', 'Svårt, av det första skottet', 'Inte alls']],
         ['Was macht der Taxifahrer?', ['Er meldet die Schüsse über den Taxifunk', 'Er fährt Palme ins Krankenhaus', 'Er verfolgt den Täter'], 'En taxichaufför har sett skotten och ropar ut det i taxiradion.', 'Vad gör taxichauffören?', ['Han ropar ut skotten i taxiradion', 'Han kör Palme till sjukhuset', 'Han springer efter gärningsmannen']],
         ['Wann erfahren die meisten Schweden die Nachricht?', ['Erst am Morgen', 'Noch vor Mitternacht', 'Am nächsten Abend'], 'De flesta svenskar sover och får veta det först på morgonen.', 'När får de flesta svenskar veta det?', ['Först på morgonen', 'Redan före midnatt', 'Nästa kväll']]],
      keep:[['Allt har gått på några sekunder.', 'Alles ist in wenigen Sekunden passiert.'], ['Lisbet vägrar att lämna sin man.', 'Lisbet weigert sich, ihren Mann zu verlassen.']],
      src:['Wikipedia (englisch), „Assassination of Olof Palme“ (Zeitleiste der Nacht nach dem Bericht der Juristenkommission, SOU 1987:14)', 'Sveriges Radio, „Natten då Sverige väcktes ur sin Törnrosasömn“', 'Polisen, „Palmeutredningen – polisens arbete“'] },
    { title:'33-åringen', when:'mars 1986', date:'Stockholm, mars 1986',
      hook:'Sverige sörjer, och polisen griper en misstänkt.',
      recap:['Olof Palme skjuts på Sveavägen och dör strax efter midnatt. Gärningsmannen försvinner, och ingen vet vem han är.',
        'Olof Palme wird auf der Sveavägen erschossen und stirbt kurz nach Mitternacht. Der Täter verschwindet, niemand weiß, wer er ist.'],
      body:`Dagen efter mordet ligger blommor på trottoaren vid Tunnelgatan. Hela dagen kommer människor dit, och många gråter. Ett mord på en statsminister har Sverige aldrig varit med om. Även utomlands sörjer man. Flera länder, bland andra Indien och Portugal, utlyser landssorg.

Utredningen leds av länspolismästaren i Stockholm, Hans Holmér. Hundratals poliser arbetar med fallet, och tusentals tips kommer in. Ungefär en vecka efter mordet sprider polisen en fantombild av gärningsmannen. Den finns i alla tidningar och på tv. Men vittnet som bilden bygger på har troligen inte sett mördaren.

Den 12 mars grips en 33-årig man. Enligt polisen är han känd i högerextrema kretsar och fientlig mot Palme. Tidningarna kallar honom ”33-åringen”.

Den 15 mars hålls en minnesceremoni i Stockholms stadshus, och gäster från hela världen kommer dit. Omkring 150 000 människor går i sorgetåget genom staden. Olof Palme begravs på Adolf Fredriks kyrkogård, bara några hundra meter från platsen där han sköts.

Kort därefter släpps 33-åringen fri. Bevisen är svaga, och polisen och åklagaren är inte överens. Mördaren är fortfarande okänd. Men Hans Holmér misstänker redan något helt annat.`,
      q:[['Was ist das Problem mit dem Phantombild?', ['Der Zeuge hat den Mörder wahrscheinlich nicht gesehen', 'Es ist zu unscharf', 'Es zeigt eine Frau'], 'Men vittnet som bilden bygger på har troligen inte sett mördaren.', 'Vad är problemet med fantombilden?', ['Vittnet har troligen inte sett mördaren', 'Den är för suddig', 'Den visar en kvinna']],
         ['Wo wird Olof Palme begraben?', ['Auf dem Friedhof der Adolf-Fredrik-Kirche, nahe dem Tatort', 'In seinem Geburtsort', 'Im Stockholmer Rathaus'], 'Olof Palme begravs på Adolf Fredriks kyrkogård, bara några hundra meter från platsen där han sköts.', 'Var begravs Olof Palme?', ['På Adolf Fredriks kyrkogård, nära platsen där han sköts', 'I staden där han föddes', 'I Stockholms stadshus']],
         ['Warum kommt der „33-Jährige“ wieder frei?', ['Die Beweise sind schwach', 'Er hat ein Alibi', 'Ein anderer gesteht'], 'Bevisen är svaga, och polisen och åklagaren är inte överens.', 'Varför släpps 33-åringen?', ['Bevisen är svaga', 'Han har ett alibi', 'En annan person erkänner']]],
      keep:[['Hela dagen kommer människor dit, och många gråter.', 'Den ganzen Tag kommen Menschen dorthin, und viele weinen.'], ['Mördaren är fortfarande okänd.', 'Der Mörder ist weiterhin unbekannt.']],
      src:['Wikipedia (englisch), „Assassination of Olof Palme“ (Phantombild, Beerdigung)', 'Wikipedia (englisch), „Victor Gunnarsson“', 'Sveriges Radio, Übersicht der Verdächtigen (sverigesradio.se, Artikel 7491047)'] },
    { title:'Spåret', when:'1986–1987', date:'Stockholm, vintern 1986–1987',
      hook:'Polischefen har ett eget spår, och han är säker på sin sak.',
      recap:['Den första misstänkte, ”33-åringen”, släpps efter några dagar. Hans Holmér, som leder utredningen, misstänker redan något helt annat.',
        'Der erste Verdächtige, der „33-Jährige“, kommt nach wenigen Tagen frei. Hans Holmér, der die Ermittlung leitet, hat schon etwas ganz anderes im Verdacht.'],
      body:`Hans Holmér tror att mordet är en politisk handling, planerad av en organisation. Holmér misstänker PKK, en kurdisk organisation som den svenska regeringen har stämplat som terroristisk. Enligt hans teori ville PKK hämnas för terroriststämpeln. Under hela året arbetar utredningen mest med det spåret. Holmér syns ofta i tv, och på en presskonferens visar han upp en revolver av samma typ som mordvapnet.

Alla är inte övertygade. Flera poliser och åklagare tycker att bevisen är tunna, och att andra spår glöms bort. Men Holmér står fast. I december 1986 säger han i tv att han är 95 procent säker på att PKK ligger bakom mordet.

I januari 1987 slår polisen till. Ett tjugotal kurder grips i en stor razzia, och tidningarna skriver stora rubriker. Men förhören ger ingenting. Efter några dagar släpps de, eftersom bevisen inte räcker.

Nu blir konflikten mellan Holmér och åklagarna öppen. Regeringen försöker medla, men i februari 1987 måste Holmér lämna utredningen. En månad senare avgår han också som länspolismästare.

Snart har ett helt år gått. Polisen har kontrollerat tusentals tips. Mördaren är fortfarande okänd, och många undrar om polisen har letat på fel ställe från början.`,
      q:[['Wen verdächtigt Hans Holmér?', ['Die kurdische Organisation PKK', 'Einen einzelnen Täter aus Stockholm', 'Die Polizei selbst'], 'Holmér misstänker PKK, en kurdisk organisation som den svenska regeringen har stämplat som terroristisk.', 'Vem misstänker Hans Holmér?', ['Den kurdiska organisationen PKK', 'En ensam gärningsman från Stockholm', 'Polisen själv']],
         ['Was passiert nach der Razzia im Januar 1987?', ['Die Festgenommenen kommen nach wenigen Tagen frei', 'Einer gesteht den Mord', 'Die Polizei findet die Waffe'], 'Efter några dagar släpps de, eftersom bevisen inte räcker.', 'Vad händer efter razzian i januari 1987?', ['De gripna släpps efter några dagar', 'En av dem erkänner mordet', 'Polisen hittar vapnet']],
         ['Was geschieht mit Holmér im Februar 1987?', ['Er muss die Ermittlung abgeben', 'Er wird befördert', 'Er findet den Täter'], 'Regeringen försöker medla, men i februari 1987 måste Holmér lämna utredningen.', 'Vad händer med Holmér i februari 1987?', ['Han måste lämna utredningen', 'Han blir befordrad', 'Han hittar gärningsmannen']]],
      keep:[['Alla är inte övertygade.', 'Nicht alle sind überzeugt.'], ['Men förhören ger ingenting.', 'Aber die Verhöre bringen nichts.']],
      src:['Wikipedia (englisch), „Hans Holmér“', 'Andersson u. a., Göteborgs universitet (Holmérs Aussage in „Magasinet“, 9.12.1986, und „Operation Alpha“)', 'Sveriges Radio, Podcast über Hans Holmér (Operation Alfa, Vermittlung der Regierung)'] },
    { title:'Rättegången', when:'1988–1989', date:'Stockholm, sommaren 1988 till hösten 1989',
      hook:'Nästan tre år efter mordet har polisen en ny misstänkt.',
      recap:['PKK-spåret leder ingenstans, och Hans Holmér lämnar utredningen i februari 1987. Mördaren är fortfarande okänd.',
        'Die PKK-Spur führt ins Leere, Hans Holmér verlässt im Februar 1987 die Ermittlung. Der Mörder ist weiter unbekannt.'],
      body:`Sommaren 1988 skakas utredningen av en skandal. Förläggaren Ebbe Carlsson har bedrivit en egen, hemlig utredning med stöd av justitieministern Anna-Greta Leijon. När det blir känt måste hon avgå.

Nästan tre år efter mordet riktar polisen in sig på en ny man. Han heter Christer Pettersson, är 41 år och har länge haft problem med alkohol och droger. Han har tidigare dömts för dråp. Bekanta berättar att han var i närheten den kvällen. Den 14 december 1988 grips han.

Kort därefter får Lisbet Palme se honom i en vittneskonfrontation. Hon pekar ut honom som mannen hon såg på Sveavägen. Själv säger Pettersson att han är oskyldig. Polisen hittar inget vapen.

I juli 1989 döms han av Stockholms tingsrätt till livstids fängelse. Fallet verkar vara löst. Men försvaret överklagar, och i hovrätten ser det annorlunda ut. Mordvapnet har aldrig hittats, och det finns inget tydligt motiv. Det kommer också fram att Lisbet Palme hade fått veta saker om den misstänkte innan hon pekade ut honom. Kan man lita på hennes vittnesmål?

Hösten 1989 frikänns Christer Pettersson av hovrätten och släpps fri. Senare får han ett skadestånd för tiden i häktet.

Utredningen står nästan där den började.`,
      q:[['Was erzählen Bekannte über Christer Pettersson?', ['Dass er an dem Abend in der Nähe war', 'Dass er im Ausland war', 'Dass er Palme kannte'], 'Bekanta berättar att han var i närheten den kvällen.', 'Vad berättar Petterssons bekanta?', ['Att han var i närheten den kvällen', 'Att han var utomlands', 'Att han kände Palme']],
         ['Wie urteilt das Amtsgericht im Juli 1989?', ['Lebenslange Haft', 'Freispruch', 'Zwei Jahre Gefängnis'], 'I juli 1989 döms han av Stockholms tingsrätt till livstids fängelse.', 'Vilken dom ger tingsrätten i juli 1989?', ['Livstids fängelse', 'Han frikänns', 'Två års fängelse']],
         ['Warum zweifelt das Berufungsgericht?', ['Die Tatwaffe fehlt, und es gibt kein klares Motiv', 'Pettersson hat gestanden und widerrufen', 'Neue Zeugen haben einen anderen Mann gesehen'], 'Mordvapnet har aldrig hittats, och det finns inget tydligt motiv.', 'Varför tvekar hovrätten?', ['Mordvapnet saknas, och det finns inget tydligt motiv', 'Pettersson har erkänt och tagit tillbaka', 'Nya vittnen har sett en annan man']]],
      keep:[['Själv säger Pettersson att han är oskyldig.', 'Pettersson selbst sagt, er sei unschuldig.'], ['Kan man lita på hennes vittnesmål?', 'Kann man ihrer Zeugenaussage trauen?']],
      src:['SVT, „Allt du behöver veta om mordet på Olof Palme“', 'Sveriges Radio, Übersicht der Verdächtigen (sverigesradio.se, Artikel 7491047)', 'Wikipedia (norwegisch), „Christer Pettersson“ (Daten der Festnahme und der Urteile)'] },
    { title:'Ett namn', when:'2020–2025', date:'Stockholm, juni 2020 och december 2025',
      hook:'34 år efter skotten kallar åklagaren till presskonferens.',
      recap:['Christer Pettersson döms för mordet 1989 men frikänns samma år av hovrätten. Mördaren är fortfarande okänd.',
        'Christer Pettersson wird 1989 verurteilt, aber im selben Jahr vom Berufungsgericht freigesprochen. Der Mörder ist weiter unbekannt.'],
      body:`Åren går, och utredningen växer. Till slut är den troligen den största mordutredningen i världen. Christer Pettersson dör 2004 utan att ha blivit dömd. Över hundra personer erkänner mordet, men ingen av dem är mördaren.

Den 10 juni 2020, 34 år efter skotten, kallar chefsåklagare Krister Petersson till presskonferens. Hela Sverige följer den. Petersson pekar ut en man som kallas Skandiamannen, Stig Engström. Han arbetade på försäkringsbolaget Skandia, vars kontor låg vid Sveavägen, och han var på platsen den kvällen. Själv sa han att han var ett vittne som försökte hjälpa. Enligt åklagaren går det inte att komma runt honom som misstänkt. Men Engström dog år 2000 och kan inte åtalas. Därför läggs utredningen ner.

Många är inte övertygade. Det finns inga direkta bevis, inget vapen och inget erkännande.

Den 18 december 2025 kommer ett nytt besked. Överåklagare Lennart Guné har granskat beslutet. Utredningen ska inte öppnas igen, säger han, men det var fel att peka ut Engström. Bevisningen räcker inte.

Nästan fyrtio år efter natten på Sveavägen finns det alltså inget svar. Vem sköt Olof Palme? Frågan lever kvar.`,
      q:[['Wie viele Menschen haben den Mord gestanden?', ['Über hundert', 'Keiner', 'Nur einer'], 'Över hundra personer erkänner mordet, men ingen av dem är mördaren.', 'Hur många har erkänt mordet?', ['Över hundra', 'Ingen', 'Bara en']],
         ['Warum wird Stig Engström nicht angeklagt?', ['Er ist im Jahr 2000 gestorben', 'Er lebt im Ausland', 'Er hat ein Alibi'], 'Men Engström dog år 2000 och kan inte åtalas.', 'Varför åtalas inte Stig Engström?', ['Han dog år 2000', 'Han bor utomlands', 'Han har ett alibi']],
         ['Was entscheidet Lennart Guné im Dezember 2025?', ['Es war falsch, Engström zu benennen', 'Die Ermittlung wird neu eröffnet', 'Engström war sicher der Täter'], 'Utredningen ska inte öppnas igen, säger han, men det var fel att peka ut Engström.', 'Vad beslutar Lennart Guné i december 2025?', ['Det var fel att peka ut Engström', 'Utredningen öppnas igen', 'Engström var säkert gärningsmannen']]],
      keep:[['Många är inte övertygade.', 'Viele sind nicht überzeugt.'], ['Frågan lever kvar.', 'Die Frage bleibt.']],
      src:['Polisen, „Palmeutredningen – polisens arbete“ (Beschlüsse vom 10. Juni 2020 und 18. Dezember 2025)', 'SVT, „Världens största mordutredning: beskedet om mordet på Olof Palme“ (2020)'] }
  ] }
],
es:[
// Paket 2 (24.99.0): Bergwerksunglück von San José, „Mit erfundener Figur“. Fakten geprüft am 28.11.2026 an den Quellen je Teil.
{ id:'los33', title:'Los 33', topic:'Geschichte', level:'B1', form:'figur',
  teaser:'Sesenta y nueve días bajo el desierto de Atacama, contados por una joven reportera.',
  intro:['El 5 de agosto de 2010, una mina se derrumba en el norte de Chile y 33 hombres quedan atrapados a 700 metros de profundidad. Camila, una joven reportera de Copiapó, cuenta lo que vive arriba, junto a las familias.',
    'Am 5. August 2010 stürzt im Norden Chiles ein Bergwerk ein, 33 Männer sind in 700 Metern Tiefe eingeschlossen. Camila, eine junge Reporterin aus Copiapó, erzählt, was sie oben bei den Familien erlebt.'],
  real:'Erfunden ist nur die Erzählerin Camila mit ihrem Radiosender und ihrem Notizbuch. Alles andere ist belegt: Daten, Uhrzeiten, Zahlen, Orte und Personen nach chilenischen Presseberichten und Darstellungen der Rettung. Die Nachricht der Bergleute steht im Original; echte Personen bekommen keine erfundenen Zitate: Was sie sagten, steht sinngemäß da.',
  cast:[['Camila', 'erfunden: junge Reporterin bei einem Radiosender in Copiapó, erzählt die Reihe', 1], ['Laurence Golborne', 'Bergbauminister', 1],
    ['Sebastián Piñera', 'Präsident Chiles', 2], ['María Segovia', '„la Alcaldesa“ des Lagers, Schwester des Bergmanns Darío Segovia', 3],
    ['Luis Urzúa', 'Schichtleiter, 54, teilt unten das Essen ein', 3], ['Carlos Mamani', 'der einzige Bolivianer unter den 33', 3],
    ['Manuel González', 'Retter, fährt als Erster hinunter', 5], ['Florencio Ávalos', 'Bergmann, 31, kommt als Erster herauf', 5], ['Mario Sepúlveda', 'kommt als Zweiter herauf', 5]],
  words:[['mina', 1], ['minero', 1], ['derrumbe', 1], ['atrapado', 1], ['profundidad', 1], ['sonda', 1], ['perforar', 1], ['refugio', 2], ['campamento', 2], ['pozo', 3], ['rescate', 3], ['cápsula', 4]],
  parts:[
    { title:'Setecientos metros', when:'7 ago 2010', date:'Mina San José, sábado 7 de agosto de 2010',
      body:`Es sábado por la noche y escribo en mi auto, delante de la entrada de la mina San José. Estoy en pleno desierto de Atacama, a unos 45 kilómetros de Copiapó. Trabajo en una pequeña radio de la ciudad, y esta es mi primera gran noticia.

El jueves, poco después de las dos de la tarde, un enorme bloque de roca se movió dentro de la mina y cerró el único camino hacia la salida. Treinta y tres hombres quedaron atrapados. Están a unos 700 metros de profundidad, y nadie sabe si siguen vivos.

Desde el jueves llegan las familias: mujeres, padres, hermanos, hijos. Muchos duermen en sus autos, porque no quieren irse. De día el sol quema, y de noche hace mucho frío.

El ministro de Minería, Laurence Golborne, volvió ayer de un viaje a Ecuador y ya está aquí. Hoy los rescatistas intentaron entrar por una chimenea de ventilación. Pero dentro hubo otro derrumbe, y casi termina en una nueva tragedia. Además, en las chimeneas faltan las escaleras que exigen las normas. Por eso los mineros no pueden subir por ahí.

Delante de las familias, el ministro no pudo contener las lágrimas. Mucha gente está furiosa con la empresa. Según el sindicato, los trabajadores pidieron muchas veces a las autoridades que cerraran la mina, porque no era segura.

Ahora el plan es perforar la montaña con sondas, unos tubos largos y finos, para buscar a los hombres. Pero la mina es enorme y la roca es dura. ¿Cuántos días puede vivir alguien allá abajo?`,
      q:[['Was ist am Donnerstag passiert?', ['Ein Felsblock hat den einzigen Weg zum Ausgang versperrt', 'In der Mine ist ein Feuer ausgebrochen', 'Der Aufzug ist kaputtgegangen'], 'un enorme bloque de roca se movió dentro de la mina y cerró el único camino hacia la salida', '¿Qué pasó el jueves?', ['Un bloque de roca cerró el único camino hacia la salida', 'Hubo un incendio en la mina', 'Se rompió el ascensor']],
         ['Warum können die Bergleute nicht durch die Schächte hinaufsteigen?', ['Die vorgeschriebenen Leitern fehlen', 'Sie sind verletzt', 'Die Schächte sind zu eng'], 'en las chimeneas faltan las escaleras que exigen las normas', '¿Por qué no pueden subir los mineros por las chimeneas?', ['Faltan las escaleras que exigen las normas', 'Están heridos', 'Las chimeneas son demasiado estrechas']],
         ['Wie sieht der Plan jetzt aus?', ['Mit Sonden in den Berg bohren, um die Männer zu suchen', 'Noch einmal durch den Schacht hinuntersteigen', 'Warten, bis die Männer selbst herauskommen'], 'Ahora el plan es perforar la montaña con sondas', '¿Cuál es el plan ahora?', ['Perforar la montaña con sondas para buscar a los hombres', 'Bajar otra vez por la chimenea', 'Esperar a que los hombres salgan solos']]],
      keep:[['Muchos duermen en sus autos, porque no quieren irse.', 'Viele schlafen in ihren Autos, weil sie nicht weggehen wollen.'], ['Pero la mina es enorme y la roca es dura.', 'Aber die Mine ist riesig, und der Fels ist hart.']],
      src:['Wikipedia (englisch), „2010 Copiapó mining accident“', 'Revista Minería Chilena, „Los hitos en el rescate de San José“ (Felsblock, Versuch durch den Schacht am Samstag)', 'Diario Financiero, 6.8.2010 (Golborne kehrt aus Ecuador zurück; Gewerkschaft zur Sicherheit der Mine)', 'CNN Chile, „Rescate 33 mineros: detalles desconocidos 10 años después“'] },
    { title:'Un papel', when:'22 ago 2010', date:'Mina San José, domingo 22 de agosto de 2010',
      hook:'Diecisiete días después, una sonda vuelve de la profundidad con algo.',
      recap:['Jueves 5 de agosto de 2010: un derrumbe deja a 33 mineros atrapados a 700 metros de profundidad en la mina San José. El camino por la chimenea está cerrado, y ahora buscan a los hombres con sondas.',
        'Donnerstag, 5. August 2010: Ein Einsturz schließt in der Mine San José 33 Bergleute in 700 Metern Tiefe ein. Der Weg durch den Schacht ist versperrt, jetzt sucht man die Männer mit Sonden.'],
      body:`Hoy es el día diecisiete. Las últimas dos semanas fueron muy duras. Las sondas bajaban y bajaban, pero no encontraban a nadie. El jueves, una pasó de los 700 metros sin llegar al refugio. Mucha gente ya había perdido la esperanza. Las familias no.

Esta mañana, muy temprano, la sonda número ocho atraviesa la roca a 688 metros. Los técnicos notan golpes en el tubo. ¿Son ellos? Durante horas sacan el tubo de la montaña, metro a metro. Cuando por fin sale la punta, tiene manchas de pintura. Y trae un papel.

Es un mensaje escrito con letras rojas: «Estamos bien en el refugio los 33».

Por la tarde, el presidente Sebastián Piñera está en la mina y muestra el papel a las cámaras. En el campamento de las familias, la gente grita, llora y se abraza. Yo también lloro, y casi no puedo hablar por teléfono con la radio.

Más tarde bajan una cámara por el agujero. Las imágenes son malas, en blanco y negro y sin sonido, pero se ve a hombres vivos. Los 33 llevan diecisiete días en un refugio de cincuenta metros cuadrados, y ya casi no les queda comida.

Están vivos. Pero, ¿cómo vamos a sacarlos de ahí?`,
      q:[['Was bemerken die Techniker am Rohr?', ['Schläge', 'Wasser', 'Rauch'], 'Los técnicos notan golpes en el tubo.', '¿Qué notan los técnicos en el tubo?', ['Golpes', 'Agua', 'Humo']],
         ['Wer zeigt den Zettel den Kameras?', ['Präsident Sebastián Piñera', 'Minister Laurence Golborne', 'Ein Techniker'], 'el presidente Sebastián Piñera está en la mina y muestra el papel a las cámaras', '¿Quién muestra el papel a las cámaras?', ['El presidente Sebastián Piñera', 'El ministro Laurence Golborne', 'Un técnico']],
         ['Wie sind die ersten Bilder von unten?', ['Schlecht, schwarz-weiß und ohne Ton', 'Farbig und mit Ton', 'Man sieht gar nichts'], 'Las imágenes son malas, en blanco y negro y sin sonido', '¿Cómo son las primeras imágenes?', ['Malas, en blanco y negro y sin sonido', 'En color y con sonido', 'No se ve nada']]],
      keep:[['Las familias no.', 'Die Familien nicht.'], ['¿Son ellos?', 'Sind sie es?']],
      src:['Wikipedia (englisch), „2010 Copiapó mining accident“ (achte Bohrung, 688 Meter, Schutzraum, erste Bilder)', 'Diario Financiero, 19.8.2010 („Piñera confirma falla de sonda“)', 'Büro Sebastián Piñera, Mitteilung vom 22.8.2010', 'Diario de Cuyo, „17 días de desolación“ (Klopfen, Farbe, rote Schrift)'] },
    { title:'Campamento Esperanza', when:'18 sep 2010', date:'Campamento Esperanza, sábado 18 de septiembre de 2010',
      hook:'Arriba crece una pequeña ciudad, y abajo esperan 33 hombres.',
      recap:['El 22 de agosto, después de diecisiete días, una sonda llega al refugio. Los mineros envían un papel: «Estamos bien en el refugio los 33».',
        'Am 22. August, nach siebzehn Tagen, erreicht eine Sonde den Schutzraum. Die Bergleute schicken einen Zettel: „Uns 33 geht es gut im Schutzraum.“'],
      body:`Hoy es 18 de septiembre, la fiesta nacional, y este año es especial: Chile cumple doscientos años. En todo el país hay empanadas, música y cueca. Aquí la celebración es tranquila. El campamento es «zona seca», sin alcohol, y la idea de enviar un poco de vino a la mina se descartó.

El Campamento Esperanza ya parece un pueblo. Al principio, las familias dormían en sus autos. Después llegaron las carpas, y hoy hay cocina, policías, soldados y hasta una escuela para los niños. A María Segovia, la hermana mayor del minero Darío Segovia, todos la llaman aquí «la Alcaldesa». En el cerro hay 33 banderas, una por cada hombre: 32 chilenas y una boliviana, por Carlos Mamani.

Abajo la vida también cambió. Desde el contacto, todo baja por agujeros estrechos, dentro de unos tubos azules de metro y medio que aquí llaman «palomas»: agua, comida, medicinas y cartas. Cada viaje dura más o menos una hora.

Ahora sabemos cómo sobrevivieron los primeros diecisiete días. El jefe de turno, Luis Urzúa, organizó al grupo y repartió la poca comida que había: cada 48 horas, dos cucharadas de atún, medio vaso de leche y media galleta por persona. En promedio, cada hombre perdió ocho kilos.

Dos máquinas ya perforan un pozo de rescate: el Plan A y el Plan B. La tercera, el Plan C, está casi lista. A finales de agosto, el presidente dijo que los mineros estarían con nosotros para Navidad. ¿Será antes?`,
      q:[['Wie nennen alle María Segovia?', ['„La Alcaldesa“, die Bürgermeisterin', '„La Presidenta“, die Präsidentin', '„La Paloma“, die Taube'], 'todos la llaman aquí «la Alcaldesa»', '¿Cómo llaman todos a María Segovia?', ['«La Alcaldesa»', '«La Presidenta»', '«La Paloma»']],
         ['Was sind die „palomas“?', ['Blaue Röhren, die Dinge in die Mine bringen', 'Vögel aus der Wüste', 'Die Zelte der Familien'], 'dentro de unos tubos azules de metro y medio que aquí llaman «palomas»', '¿Qué son las «palomas»?', ['Tubos azules que llevan cosas a la mina', 'Pájaros del desierto', 'Las carpas de las familias']],
         ['Was aßen die Bergleute vor dem Kontakt?', ['Alle 48 Stunden zwei Löffel Thunfisch, ein halbes Glas Milch und einen halben Keks', 'Drei Mahlzeiten am Tag', 'Gar nichts'], 'cada 48 horas, dos cucharadas de atún, medio vaso de leche y media galleta por persona', '¿Qué comían los mineros antes del contacto?', ['Cada 48 horas, dos cucharadas de atún, medio vaso de leche y media galleta', 'Tres comidas al día', 'Nada']]],
      keep:[['El Campamento Esperanza ya parece un pueblo.', 'Das Campamento Esperanza sieht schon aus wie ein Dorf.'], ['Abajo la vida también cambió.', 'Auch unten hat sich das Leben verändert.']],
      src:['Wikipedia (englisch), „2010 Copiapó mining accident“ (Lager, Fahnen, palomas, Rationen, Plan A bis C)', 'Diario de Cuyo, 18.9.2010, „Chile celebra su Bicentenario“ (zona seca, kein Wein)', 'Cooperativa, 23.8.2010, „Así sobrevivieron los mineros atrapados bajo tierra en San José“', 'El Tiempo / El Mercurio (Urzúa teilt die Rationen ein); eju.tv (Piñera: zu Weihnachten zurück)'] },
    { title:'El Fénix', when:'11 oct 2010', date:'Mina San José, lunes 11 de octubre de 2010',
      hook:'Una de las tres máquinas está a punto de llegar.',
      recap:['Arriba, el Campamento Esperanza ya parece un pueblo. Abajo, los 33 reciben comida y cartas por las «palomas», mientras tres máquinas perforan un pozo de rescate.',
        'Oben ist das Campamento Esperanza schon fast ein Dorf. Unten bekommen die 33 Essen und Briefe über die „palomas“, während drei Maschinen einen Rettungsschacht bohren.'],
      body:`El sábado, a las ocho y cinco de la mañana, la máquina del Plan B por fin llegó a los mineros. Era el día 65. En el campamento la gente salió de las carpas, gritó y se abrazó. Hoy todavía se ven sonrisas por todas partes.

El Plan B empezó con un agujero pequeño y lo hizo cada vez más ancho. Ahora el pozo tiene más de 600 metros de largo y es lo bastante ancho para un hombre. Los técnicos solo ponen tubos de acero en la parte de arriba. Más abajo, la roca es firme.

Por este pozo va a viajar el Fénix 2, una cápsula de acero que construyó la Armada de Chile con ideas de la NASA. Dentro, un hombre va de pie, con oxígeno, un micrófono y un altavoz para hablar con la superficie. Cada viaje va a durar unos quince minutos.

Esta tarde vi la cápsula de cerca. Es blanca, azul y roja, como la bandera. Mide casi cuatro metros de alto, pero solo 54 centímetros de ancho. Cuesta creer que 33 hombres vayan a subir en ella.

El rescate empieza mañana por la noche. Según el plan, saldrán por grupos: primero los más hábiles, que pueden ayudar si hay problemas; después los más débiles; y al final los más fuertes. Pero, ¿quién va a ser el primero?`,
      q:[['Was geschah am Samstag um 8.05 Uhr?', ['Die Maschine von Plan B erreichte die Bergleute', 'Der erste Bergmann kam heraus', 'Plan C begann zu bohren'], 'la máquina del Plan B por fin llegó a los mineros', '¿Qué pasó el sábado a las ocho y cinco?', ['La máquina del Plan B llegó a los mineros', 'Salió el primer minero', 'El Plan C empezó a perforar']],
         ['Wer hat die Fénix 2 gebaut?', ['Die chilenische Marine, mit Ideen der NASA', 'Die NASA allein', 'Die Betreiberfirma der Mine'], 'una cápsula de acero que construyó la Armada de Chile con ideas de la NASA', '¿Quién construyó el Fénix 2?', ['La Armada de Chile, con ideas de la NASA', 'La NASA sola', 'La empresa de la mina']],
         ['Wer soll zuletzt herauskommen?', ['Die Stärksten', 'Die Schwächsten', 'Die Jüngsten'], 'y al final los más fuertes', '¿Quiénes van a salir al final?', ['Los más fuertes', 'Los más débiles', 'Los más jóvenes']]],
      keep:[['Más abajo, la roca es firme.', 'Weiter unten ist der Fels fest.'], ['Pero, ¿quién va a ser el primero?', 'Aber wer wird der Erste sein?']],
      src:['Wikipedia (englisch), „2010 Copiapó mining accident“ (Plan B am 9.10. um 8.05 Uhr, Verrohrung oben, Fahrzeit, Reihenfolge der Gruppen)', 'El Litoral, „Fénix, la cápsula metálica que izará a los mineros“ (ASMAR, NASA, Sauerstoff)', 'Redimin, „Cómo sacaron a los 33 mineros de San José por un pozo tan estrecho“ (Maße, Mikrofon und Lautsprecher)', 'Diario de Cuyo, 15.10.2010 (Farben der Fahne)'] },
    { title:'Uno por uno', when:'13 oct 2010', date:'Mina San José, 12 y 13 de octubre de 2010',
      hook:'La noche más larga del desierto: 33 viajes hacia la luz.',
      recap:['El Plan B llega a los mineros el 9 de octubre. La cápsula Fénix 2, de solo 54 centímetros de ancho, está lista para subirlos uno por uno.',
        'Plan B erreicht die Bergleute am 9. Oktober. Die Kapsel Fénix 2, nur 54 Zentimeter breit, ist bereit, sie einen nach dem anderen heraufzuholen.'],
      body:`Poco después de las once de la noche del martes empieza el rescate. Hace frío, pero nadie se va. Hay más de mil periodistas de todo el mundo, y millones de personas lo miran en directo. Primero baja un rescatista, Manuel González. Unos minutos después lo vemos en una pantalla, abajo, entre los mineros.

A las doce y diez, el Fénix vuelve a la superficie. Dentro está Florencio Ávalos, de 31 años, con gafas oscuras para proteger los ojos de la luz. Su hijo pequeño, Byron, llora y corre a abrazarlo. El presidente Piñera también lo abraza. Yo no puedo escribir; solo miro.

Después, la cápsula baja y sube, una y otra vez, toda la noche y todo el día. Cada vez que sale un minero, la gente grita: «¡Chi, chi, chi! ¡Le, le, le!». Sale Mario Sepúlveda, el segundo, que reparte abrazos y piedras de la mina como regalo. Sale Carlos Mamani, el boliviano. Salen el más joven, Jimmy Sánchez, de 19 años, y el mayor, Mario Gómez, de 63.

A las diez menos cinco de la noche sale el último: Luis Urzúa, el jefe de turno, de 54 años. Habla con el presidente y le entrega el turno, como al final de un día normal de trabajo. Han pasado 69 días.

Abajo, los rescatistas levantan un cartel: «Misión cumplida Chile». Mañana, por fin, voy a dormir en mi cama. Pero antes escribo una última frase en este cuaderno: «Están bien en la superficie los 33».`,
      q:[['Wer fährt als Erster mit der Kapsel hinunter?', ['Ein Retter, Manuel González', 'Präsident Piñera', 'Florencio Ávalos'], 'Primero baja un rescatista, Manuel González.', '¿Quién baja primero en la cápsula?', ['Un rescatista, Manuel González', 'El presidente Piñera', 'Florencio Ávalos']],
         ['Warum trägt Florencio Ávalos eine dunkle Brille?', ['Um die Augen vor dem Licht zu schützen', 'Weil er verletzt ist', 'Weil sie zur Arbeitskleidung gehört'], 'con gafas oscuras para proteger los ojos de la luz', '¿Por qué lleva Florencio Ávalos gafas oscuras?', ['Para proteger los ojos de la luz', 'Porque está herido', 'Porque son parte de la ropa de trabajo']],
         ['Was verschenkt Mario Sepúlveda?', ['Steine aus der Mine', 'Blumen', 'Briefe'], 'que reparte abrazos y piedras de la mina como regalo', '¿Qué regala Mario Sepúlveda?', ['Piedras de la mina', 'Flores', 'Cartas']]],
      keep:[['Hace frío, pero nadie se va.', 'Es ist kalt, aber niemand geht.'], ['Han pasado 69 días.', '69 Tage sind vergangen.']],
      src:['Wikipedia (englisch), „2010 Copiapó mining accident“ (Uhrzeiten der Rettung, Banner „Misión cumplida Chile“)', 'El Litoral, Chronologie der Rettung (González, Ávalos und Byron, Sepúlveda)', 'RPP, „Minero Florencio Ávalos volvió a nacer“ (dunkle Brille, 15 Minuten)', 'Vanguardia, „Sebastián Piñera y el histórico rescate de los 33 mineros chilenos“ (Urzúa, 54)'] }
  ] }
]
};
