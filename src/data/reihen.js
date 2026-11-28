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
es:[]
};
