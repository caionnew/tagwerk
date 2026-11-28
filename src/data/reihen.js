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
  real:'Alles belegt, keine erfundenen Figuren. Was Beteiligte sagten, steht sinngemäß da; die Quellen unter jedem Teil.',
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
  ] },
// Paket 3 (24.101.0): finnische Kriegskinder, „Briefe und Dokumente“. Familien und Briefe erfunden; Zahlen, Wege und Daten geprüft
// am 28.11.2026 an den Quellen je Teil.
{ id:'tvamammor', title:'Två mammor', topic:'Geschichte', level:'B1', form:'briefe',
  teaser:'En flicka från Helsingfors, två mammor och fyra år av brev.',
  intro:['Under andra världskriget skickas ungefär 70 000 barn från Finland till Sverige för att komma bort från kriget. En av dem är Aino, sex år, som får två mammor: en i Helsingfors och en i Dalarna.',
    'Im Zweiten Weltkrieg werden rund 70 000 Kinder aus Finnland nach Schweden geschickt, weg vom Krieg. Eines davon ist Aino, sechs Jahre alt, die zwei Mütter bekommt: eine in Helsinki und eine in Dalarna.'],
  real:'Die Familien und ihre Briefe sind erfunden. Belegt sind die Geschichte der rund 70 000 Kriegskinder, ihre Wege und die Daten des Krieges; Quellen unter jedem Teil.',
  cast:[['Aili Virtanen', 'erfunden: Mutter in Helsinki, spricht nur Finnisch', 1], ['Aino', 'erfunden: ihre Tochter, sechs Jahre alt', 1],
    ['fröken Holm', 'erfunden: Nachbarin, Finnlandschwedin, schreibt und liest die Briefe für Aili', 1], ['Veikko', 'erfunden: Ainos Vater, an der Front', 1],
    ['Greta Lindqvist', 'erfunden: Pflegemutter auf einem Hof bei Mora', 2], ['Erik', 'erfunden: ihr Mann', 2], ['Nils', 'erfunden: ihr Sohn', 3]],
  words:[['krig', 1], ['front', 1], ['gräns', 1], ['lapp', 1], ['glömma', 1], ['karantän', 2], ['förstå', 2], ['saknad', 3], ['bomb', 3], ['vapenstillestånd', 4], ['adoptera', 4], ['hemma', 5]],
  parts:[
    { title:'Kära okända familj', when:'sep 1942', date:'Helsingfors, 14 september 1942',
      body:`Kära okända familj i Sverige!

Jag vet inte vem ni är, men i morgon reser min dotter Aino till er. Min granne, fröken Holm, skriver det här brevet åt mig på svenska. Själv kan jag bara finska.

Aino är sex år. Hon har ljust hår och är rädd för hundar, men hon älskar katter och sjunger hela dagarna. Hon kan inte ett enda ord svenska.

Varför skickar jag bort henne? Det är krig igen. Hennes pappa Veikko har varit vid fronten sedan förra sommaren, och vi har nästan ingen mat. Många mammor här gör samma sak. Vi tror att barnen får det bättre hos er.

Tåget går norrut till Torneå. Där går barnen över gränsen till Haparanda, och svenska lottor tar emot dem. Det sägs att resan över havet är farlig på grund av minorna. Alla barn får en lapp om halsen med namn och nummer, så att ingen kommer bort.

I kväll har jag packat hennes lilla väska: två klänningar, ett par strumpor och en docka. Jag har också lagt ner ett fotografi av oss tre.

Var snälla mot henne. Hon gråter ofta på kvällen, men en sång brukar hjälpa. Och skriv till mig, jag ber er. Låt henne inte glömma oss.

Många hälsningar från Aili Virtanen.`,
      q:[['Warum kann Aili nicht selbst auf Schwedisch schreiben?', ['Sie kann nur Finnisch', 'Sie hat keine Zeit', 'Sie ist krank'], 'Själv kan jag bara finska.', 'Varför skriver inte Aili själv på svenska?', ['Hon kan bara finska', 'Hon har inte tid', 'Hon är sjuk']],
         ['Wo ist Ainos Vater?', ['An der Front', 'In Schweden', 'Im Krankenhaus'], 'Hennes pappa Veikko har varit vid fronten sedan förra sommaren', 'Var är Ainos pappa?', ['Vid fronten', 'I Sverige', 'På sjukhuset']],
         ['Wozu haben die Kinder einen Zettel um den Hals?', ['Damit niemand verloren geht', 'Damit sie Essen bekommen', 'Damit sie Schwedisch lernen'], 'Alla barn får en lapp om halsen med namn och nummer, så att ingen kommer bort.', 'Varför har barnen en lapp om halsen?', ['Så att ingen kommer bort', 'Så att de får mat', 'Så att de lär sig svenska']]],
      keep:[['Hon kan inte ett enda ord svenska.', 'Sie kann kein einziges Wort Schwedisch.'], ['Låt henne inte glömma oss.', 'Lasst sie uns nicht vergessen.']],
      src:['Riksarkivet, „Finska krigsbarn“ (rund 70 000 Kinder, Wege per Schiff, Flugzeug und Bahn über Haparanda)', 'Norwegian SciTech News, „Norway’s history has forgotten the 80 000 Finnish war children“ (Namensschilder um den Hals, Bahn über Haparanda)', 'Yle, „Om de stumma krigsbarnen“ (Bahn über Torneå wegen der Minen auf See)', 'Arvidsjaur kommun, „Krigsbarn från Finland“ (Lottor holen 1942 Kinder in Haparanda ab)'] },
    { title:'Ett svar från Dalarna', when:'okt 1942', date:'Mora, 10 oktober 1942',
      hook:'Ett brev kommer tillbaka från Sverige.',
      recap:['September 1942: Aili Virtanen i Helsingfors skickar sin dotter Aino, sex år, med tåg till Sverige. Hon ber den okända familjen att skriva och att inte låta Aino glömma dem.',
        'September 1942: Aili Virtanen in Helsinki schickt ihre sechsjährige Tochter Aino mit dem Zug nach Schweden. Sie bittet die unbekannte Familie, zu schreiben und Aino ihre Familie nicht vergessen zu lassen.'],
      body:`Kära fru Virtanen!

Nu är Aino hos oss, och hon mår bra. Jag heter Greta Lindqvist, och min man Erik och jag har en gård utanför Mora i Dalarna. Vi har två söner, Nils och Olle.

Resan var lång. Efter några dagar i karantän fick Aino åka tåg söderut, och Erik hämtade henne på stationen. Hon hade lappen om halsen och sin lilla väska i handen. Hon sa inte ett ord på hela vägen hem.

De första dagarna åt hon nästan ingenting. På kvällen grät hon och ropade ”äiti”. Vi förstod inte vad hon sa, men vi förstod ändå. Då sjöng jag för henne, fast jag inte kan några finska sånger.

Nu går det bättre. Vi pratar med händerna, och hon har redan lärt sig några ord: mjölk, katt och god natt. Vår katt Missan sover i hennes säng varje natt. Hundar har vi inga, så det behöver ni inte oroa er för.

Fotografiet står på bordet bredvid hennes säng. Varje kväll pekar hon på er och säger era namn.

Jag lovar att vi tar hand om henne som om hon vore vår egen. Fröken Holm får gärna läsa det här brevet för er. Skriv snart, så läser jag era ord för Aino.

Hälsningar från Greta Lindqvist.`,
      q:[['Wo lebt die Familie Lindqvist?', ['Auf einem Hof bei Mora in Dalarna', 'In Stockholm', 'In Haparanda'], 'min man Erik och jag har en gård utanför Mora i Dalarna', 'Var bor familjen Lindqvist?', ['På en gård utanför Mora i Dalarna', 'I Stockholm', 'I Haparanda']],
         ['Was ruft Aino abends?', ['„äiti“, das finnische Wort für Mama', 'Den Namen der Katze', '„god natt“'], 'På kvällen grät hon och ropade ”äiti”.', 'Vad ropar Aino på kvällen?', ['”äiti”, det finska ordet för mamma', 'Kattens namn', '”god natt”']],
         ['Wie verständigen sie sich am Anfang?', ['Mit den Händen', 'Mit einem Wörterbuch', 'Mit Hilfe der Söhne, die Finnisch können'], 'Vi pratar med händerna', 'Hur pratar de med varandra i början?', ['Med händerna', 'Med ett lexikon', 'Med hjälp av sönerna, som kan finska']]],
      keep:[['Vi förstod inte vad hon sa, men vi förstod ändå.', 'Wir verstanden nicht, was sie sagte, aber wir verstanden trotzdem.'], ['Nu går det bättre.', 'Jetzt geht es besser.']],
      src:['Norwegian SciTech News (Namensschilder, Ankunft über Haparanda)', 'Malin Ekebom, „Bästa föreståndarinna!“, Helsingfors universitet (Quarantäne nach der Ankunft)', 'Johanna Sköld und Ingrid Söderlind, „Finska barn i svenska hem“, Scandia (Pflegefamilien in ganz Schweden)', 'Siirtolaisuus-Migration, Erinnerungen eines Kriegskindes (keine gemeinsame Sprache, Gesten)'] },
    { title:'Kära mamma', when:'mars 1944', date:'Mora, 12 mars 1944',
      hook:'Aino skriver ett brev, alldeles själv.',
      recap:['Aino har kommit till familjen Lindqvist i Dalarna. I början förstår de inte varandra, men hon lär sig snabbt de första svenska orden.',
        'Aino ist bei Familie Lindqvist in Dalarna angekommen. Anfangs verstehen sie sich nicht, aber sie lernt schnell die ersten schwedischen Wörter.'],
      body:`Kära mamma!

Nu kan jag skriva själv. Jag går i skolan, och fröken säger att jag läser bäst i klassen. Vi har så mycket snö att den går upp till fönstret. Nils har lärt mig åka skidor, och jag ramlar nästan aldrig.

Missan har fått fyra ungar. En är grå, och den får jag ha. Jag har kallat den Veikko, som pappa.

Erik har läst i tidningen att det har fallit bomber på Helsingfors. Har det fallit bomber på vårt hus? Är du rädd? Du kan komma hit, det finns plats. Greta säger att du kan sova i mitt rum.

Kram från din Aino!

PS. Kära fru Virtanen, Aino ville skriva alldeles själv, så jag har inte ändrat något. Hon pratar nästan bara svenska nu. I går frågade hon mig hur man säger god natt på finska. Hon hade glömt det, och hon blev så ledsen att hon grät länge. Jag vet inte vad jag ska göra. Kan ni skriva ner några finska ord åt henne?

Vi läste om de tre stora bombnätterna i februari, och vi har tänkt på er varje dag. Saknaden efter er finns här också, även om Aino inte alltid kan säga det.

Hälsningar från Greta.`,
      q:[['Wer hat Aino das Skifahren beigebracht?', ['Nils', 'Die Lehrerin', 'Erik'], 'Nils har lärt mig åka skidor', 'Vem har lärt Aino åka skidor?', ['Nils', 'Fröken i skolan', 'Erik']],
         ['Was hat Erik in der Zeitung gelesen?', ['Dass Bomben auf Helsinki gefallen sind', 'Dass der Krieg vorbei ist', 'Dass die Kinder nach Hause fahren'], 'Erik har läst i tidningen att det har fallit bomber på Helsingfors.', 'Vad har Erik läst i tidningen?', ['Att det har fallit bomber på Helsingfors', 'Att kriget är slut', 'Att barnen ska resa hem']],
         ['Warum ist Aino so traurig?', ['Sie hat vergessen, wie man „gute Nacht“ auf Finnisch sagt', 'Die Katze ist weggelaufen', 'Sie mag die Schule nicht'], 'Hon hade glömt det, och hon blev så ledsen att hon grät länge.', 'Varför blir Aino så ledsen?', ['Hon har glömt hur man säger god natt på finska', 'Katten har sprungit bort', 'Hon tycker inte om skolan']]],
      keep:[['Nu kan jag skriva själv.', 'Jetzt kann ich selbst schreiben.'], ['Hon pratar nästan bara svenska nu.', 'Sie spricht jetzt fast nur noch Schwedisch.']],
      src:['Stadt Helsinki, „The great raids against Helsinki 1944“ (die Nächte 6./7., 16./17. und 26./27. Februar)', 'Yle, „Om de stumma krigsbarnen“ (die Kinder vergessen ihr Finnisch)', 'Jyväskylä universitet, Urpelainen, „Språklig och nationell identitet: Finska krigsbarn i Sverige“'] },
    { title:'Veikko lever', when:'okt 1944', date:'Helsingfors, 2 oktober 1944, och Mora, 20 oktober 1944',
      hook:'Vapnen tystnar, och någon måste bestämma var Aino hör hemma.',
      recap:['Aino går i skolan i Dalarna och pratar nästan bara svenska. När hon glömmer hur man säger god natt på finska, ber Greta mamman om hjälp.',
        'Aino geht in Dalarna zur Schule und spricht fast nur noch Schwedisch. Als sie vergisst, wie man auf Finnisch „gute Nacht“ sagt, bittet Greta die Mutter um Hilfe.'],
      body:`Kära fru Lindqvist!

Kriget mot Sovjetunionen är slut. I början av september tystnade vapnen vid fronten, och den 19 september skrev Finland under vapenstilleståndet i Moskva. Veikko lever. Han kom hem i förra veckan, mager och tyst, men han lever.

Nu vill vi ha hem vår dotter. Jag vet att det inte går i morgon, men så snart det går. Jag har skrivit ner tjugo finska ord åt henne. Läs dem för henne, är ni snäll.

Tack för allt ni har gjort.

Många hälsningar från Aili Virtanen.

Kära fru Virtanen!

Vilken glädje att er man har kommit hem! Vi har gråtit av lycka här i köket.

Men jag måste vara ärlig mot er. När jag berättade för Aino att hon skulle åka hem, sprang hon ut och gömde sig i ladan. Hon säger att hon vill stanna. Hon minns er, men hon minns inte Finland.

Erik och jag har pratat länge. Vi skulle gärna adoptera henne, om ni gick med på det. Men hon är er dotter, inte vår. Om ni vill ha hem henne, så ska hon komma hem. Det lovar jag.

Era tjugo ord sitter på väggen i hennes rum. Hon kan redan fem.

Hälsningar från Greta Lindqvist.`,
      q:[['Wann hat Finnland den Waffenstillstand unterschrieben?', ['Am 19. September 1944', 'Anfang August 1944', 'Im Februar 1944'], 'den 19 september skrev Finland under vapenstilleståndet i Moskva', 'När skrev Finland under vapenstilleståndet?', ['Den 19 september 1944', 'I början av augusti 1944', 'I februari 1944']],
         ['Was macht Aino, als sie hört, dass sie nach Hause soll?', ['Sie versteckt sich in der Scheune', 'Sie packt ihren Koffer', 'Sie schreibt ihrer Mutter'], 'sprang hon ut och gömde sig i ladan', 'Vad gör Aino när hon hör att hon ska åka hem?', ['Hon gömmer sig i ladan', 'Hon packar sin väska', 'Hon skriver till sin mamma']],
         ['Was verspricht Greta?', ['Wenn die Eltern es wollen, kommt Aino nach Hause', 'Aino bleibt auf jeden Fall in Schweden', 'Sie bringt Aino sofort zurück'], 'Om ni vill ha hem henne, så ska hon komma hem.', 'Vad lovar Greta?', ['Om föräldrarna vill, ska Aino komma hem', 'Aino stannar i Sverige vad som än händer', 'Hon kör hem Aino genast']]],
      keep:[['Veikko lever.', 'Veikko lebt.'], ['Hon minns er, men hon minns inte Finland.', 'Sie erinnert sich an Sie, aber nicht an Finnland.']],
      src:['finland100.fi, „Important dates 1944“ (Waffenruhe am 4.9.1944 um 7 Uhr)', 'Wikipedia (englisch), „Continuation War“ (Waffenstillstand von Moskau am 19.9.1944)', 'Doria, „Att få ett gott hem…“: finska krigsbarnsadoptioner i Stockholm 1946–1947 (Pflegeeltern adoptieren)', 'Yle, „Om de stumma krigsbarnen“ (Adoptionen durch die schwedischen Familien)'] },
    { title:'Hemma', when:'juni 1946', date:'Helsingfors, 8 juni 1946',
      hook:'Aino kommer hem till en mamma som hon inte kan prata med.',
      recap:['Kriget mot Sovjetunionen är slut, och Aili vill ha hem sin dotter. Aino vill stanna i Sverige, men Greta lovar att hon ska komma hem om föräldrarna vill det.',
        'Der Krieg gegen die Sowjetunion ist aus, und Aili will ihre Tochter zurück. Aino will in Schweden bleiben, aber Greta verspricht, dass sie heimkommt, wenn die Eltern es wollen.'],
      body:`Kära Greta!

Får jag kalla dig Greta nu? Jag tycker att vi är släkt på något sätt.

Aino kom hem i maj. Jag stod på kajen när båten från Stockholm kom in, och jag kände igen henne direkt. Hon var lång nu, och hon hade en lapp om halsen igen. Men hon kände inte igen mig. Hon tog min hand som man tar en främlings hand.

Nu är hon hemma, men hemma betyder inte samma sak för henne som för mig. De första veckorna var svåra. Hon pratade svenska, och jag pratade finska. Fröken Holm fick komma över varje kväll och översätta mellan mor och dotter. Tänk dig det. På natten pratar Aino svenska i sömnen, och ibland ropar hon på dig.

Men nu händer något. I går sa hon ”hyvää yötä” till mig, god natt, utan att jag bad om det. Jag var tvungen att gå ut i köket så att hon inte skulle se mig gråta.

Fröken Holm säger att ungefär 70 000 finska barn har varit i Sverige. Några tusen av dem kommer aldrig tillbaka. Jag förstår deras svenska föräldrar bättre nu.

Tack för att du gav henne ett hem när vi inte kunde. Du är också hennes mamma. Skriv till henne. Dina brev kan hon läsa själv. Mina kan hon inte läsa än.

Hälsningar från Aili.`,
      q:[['Wie kam Aino nach Hause?', ['Mit dem Schiff aus Stockholm', 'Mit dem Zug über Haparanda', 'Mit dem Flugzeug'], 'Jag stod på kajen när båten från Stockholm kom in', 'Hur kom Aino hem?', ['Med båten från Stockholm', 'Med tåget över Haparanda', 'Med flyg']],
         ['Wer übersetzt zwischen Mutter und Tochter?', ['Fräulein Holm', 'Veikko', 'Greta'], 'Fröken Holm fick komma över varje kväll och översätta mellan mor och dotter.', 'Vem översätter mellan mor och dotter?', ['Fröken Holm', 'Veikko', 'Greta']],
         ['Warum geht Aili in die Küche?', ['Damit Aino sie nicht weinen sieht', 'Um Essen zu kochen', 'Um einen Brief zu schreiben'], 'Jag var tvungen att gå ut i köket så att hon inte skulle se mig gråta.', 'Varför går Aili ut i köket?', ['Så att Aino inte ska se henne gråta', 'För att laga mat', 'För att skriva ett brev']]],
      keep:[['De första veckorna var svåra.', 'Die ersten Wochen waren schwer.'], ['Du är också hennes mamma.', 'Du bist auch ihre Mutter.']],
      src:['Riksarkivet, „Finska krigsbarn“ (rund 70 000 Kinder, etwa 7 000 blieben in Schweden)', 'Doria, „Att få ett gott hem…“ (Transporte bis 1. Oktober 1948, 1949 noch über 15 000 Kinder in Schweden)', 'Yle, „Om de stumma krigsbarnen“ (Mutter und Kind ohne gemeinsame Sprache)'] }
  ] },
// Paket 4 (24.102.0): Schweden im Zweiten Weltkrieg, „Viele Stimmen“. Erzählende erfunden; Ereignisse, Daten und reale Personen
// geprüft am 28.11.2026 an den Quellen je Teil.
{ id:'beredskap', title:'Beredskap', topic:'Geschichte', level:'B2', form:'stimmen',
  teaser:'Sverige under andra världskriget: neutralt, men inte oberört.',
  intro:['Sverige håller sig utanför andra världskriget, men kriget kommer ändå nära: vid gränsen, på järnvägen, i tidningarna och på stränderna i Skåne. Människor i olika delar av landet berättar om åren 1940 till 1945.',
    'Schweden hält sich aus dem Zweiten Weltkrieg heraus, aber der Krieg kommt trotzdem nahe: an der Grenze, auf der Eisenbahn, in den Zeitungen und an den Stränden von Schonen. Menschen in verschiedenen Teilen des Landes erzählen von den Jahren 1940 bis 1945.'],
  real:'Die Erzählerinnen und Erzähler sind erfunden. Ereignisse, Daten, Zahlen und alle realen Personen sind belegt; Quellen unter jedem Teil.',
  cast:[['Sven', 'erfunden: Wehrpflichtiger an der norwegischen Grenze', 1], ['Karin', 'erfunden: arbeitet am Bahnhof an der Strecke nach Norwegen', 2],
    ['Elsa', 'erfunden: junge Journalistin in Göteborg', 3], ['Torgny Segerstedt', 'Chefredakteur der Göteborgs Handels- och Sjöfartstidning', 3],
    ['Anna', 'erfunden: Fischersfrau am Öresund', 4], ['Gunnar', 'erfunden: Busfahrer des Schwedischen Roten Kreuzes', 5], ['Folke Bernadotte', 'Vizepräsident des Schwedischen Roten Kreuzes', 5]],
  words:[['beredskap', 1], ['gräns', 1], ['flykting', 1], ['neutral', 1], ['permission', 2], ['regering', 2], ['censur', 3], ['tidning', 3], ['ockuperad', 4], ['fånge', 5], ['kapitulera', 6], ['järnmalm', 6]],
  parts:[
    { title:'Gränsen', when:'april 1940', date:'Värmland, april 1940',
      body:`Jag heter Sven, jag är tjugoett år och jag fryser. I några dagar har mitt kompani legat i ett läger i skogen, några kilometer från norska gränsen. Det ligger fortfarande snö mellan granarna.

Det började på tisdagsmorgonen, den 9 april. Mamma väckte mig och sa att radion hade något viktigt. Tyskland hade gått in i Danmark och Norge, samma natt, på en gång. Danmark gav upp nästan direkt. I Norge strider de fortfarande.

Sverige är neutralt, men regeringen har höjt beredskapen. Två dagar senare fick jag min inkallelseorder. Nu sitter vi här och väntar. Vi har kalla tält och ingen aning om vad som händer. Ibland hör vi flygplan över skogen, men vi vet inte vems de är.

På andra sidan gränsen är det krig. Nästan varje dag kommer det flyktingar över till oss, ofta på skidor: unga män, familjer, en gång bara ett barn med en ryggsäck. Vi ger dem kaffe och skickar dem vidare.

Radion säger att Norges kung inte fick komma in i Sverige. Sverige vill inte dras in i kriget. Det förstår jag. Men när jag ser norrmännen komma ut ur skogen, frusna och trötta, känns det ändå konstigt. Vi är ju grannar.

Löjtnanten säger att vi ska vara beredda. På vad, frågar ingen. Alla tänker samma sak. Kommer tyskarna hit också?`,
      q:[['Was geschah in der Nacht zum 9. April 1940?', ['Deutschland marschierte in Dänemark und Norwegen ein', 'Schweden erklärte Deutschland den Krieg', 'Norwegens König floh nach Schweden'], 'Tyskland hade gått in i Danmark och Norge, samma natt, på en gång.', 'Vad hände natten till den 9 april 1940?', ['Tyskland gick in i Danmark och Norge', 'Sverige förklarade krig mot Tyskland', 'Norges kung flydde till Sverige']],
         ['Wer kommt fast jeden Tag über die Grenze?', ['Flüchtlinge aus Norwegen', 'Deutsche Soldaten', 'Schwedische Urlauber'], 'Nästan varje dag kommer det flyktingar över till oss, ofta på skidor', 'Vem kommer över gränsen nästan varje dag?', ['Flyktingar från Norge', 'Tyska soldater', 'Svenska turister']],
         ['Was sagt das Radio über Norwegens König?', ['Er durfte nicht nach Schweden einreisen', 'Er ist in Stockholm angekommen', 'Er hat kapituliert'], 'Radion säger att Norges kung inte fick komma in i Sverige.', 'Vad säger radion om Norges kung?', ['Han fick inte komma in i Sverige', 'Han har kommit till Stockholm', 'Han har kapitulerat']]],
      keep:[['Vi är ju grannar.', 'Wir sind doch Nachbarn.'], ['Kommer tyskarna hit också?', 'Kommen die Deutschen auch hierher?']],
      src:['Wikipedia (englisch), „Timeline of Sweden during World War II“ (9.4.1940)', 'Wikipedia (englisch), „Operation Weserübung’s effects on Sweden“ (Dänemark und Norwegen, 62 Tage Kampf in Norwegen, König Haakon am 12.4. abgewiesen)'] },
    { title:'Tågen', when:'juni 1941', date:'En station vid linjen mot Norge, midsommar 1941',
      hook:'På järnvägen rullar tåg som ingen vill prata om.',
      recap:['April 1940: Tyskland går in i Danmark och Norge. Sven ligger med sitt kompani vid norska gränsen och ser flyktingar komma över.',
        'April 1940: Deutschland marschiert in Dänemark und Norwegen ein. Sven liegt mit seiner Kompanie an der norwegischen Grenze und sieht Flüchtlinge herüberkommen.'],
      body:`Jag heter Karin och jag har arbetat på stationen i tolv år. Jag säljer biljetter, skriver fraktsedlar och vet när varje tåg ska komma. Men sedan förra sommaren går det tåg här som inte står i någon tidtabell för vanligt folk.

Det är tyska soldater. I juli förra året gick regeringen med på att tyska soldater med permission får resa genom Sverige, mellan Norge och Tyskland. Vi kallar dem permittenter. Tågen går nästan varje dag. Soldaterna sitter i våra vagnar och tittar ut på våra skogar.

Vi pratar inte om det. Inte på stationen, inte i affären. Man vet aldrig vem som lyssnar.

Vid midsommar händer något nytt. Det är inte längre soldater på väg hem till sina familjer. Det är en hel tysk division, med vapen och utrustning, som ska genom Sverige från Norge till Finland. Regeringen har sagt ja efter långa och hårda diskussioner.

Några av mina grannar står vid spåret och vinkar. Soldaterna vinkar tillbaka. Andra står tysta med armarna i kors. Själv står jag i biljettluckan och räknar vagnar. Jag räknar för att slippa tänka.

Min bror säger att vi köper oss fria från kriget, tåg för tåg. Jag vet inte om han har rätt. Men jag vet att varje tåg som rullar förbi här tar kriget lite närmare.`,
      q:[['Wer fährt seit dem Sommer 1940 durch Schweden?', ['Deutsche Soldaten auf Heimaturlaub', 'Norwegische Flüchtlinge', 'Schwedische Rekruten'], 'gick regeringen med på att tyska soldater med permission får resa genom Sverige', 'Vem reser genom Sverige sedan sommaren 1940?', ['Tyska soldater på permission', 'Norska flyktingar', 'Svenska rekryter']],
         ['Was ist neu zu Mittsommer 1941?', ['Eine ganze deutsche Division mit Waffen fährt nach Finnland', 'Die Züge werden gestoppt', 'Karin bekommt eine neue Stelle'], 'Det är en hel tysk division, med vapen och utrustning, som ska genom Sverige från Norge till Finland.', 'Vad är nytt vid midsommar 1941?', ['En hel tysk division med vapen ska till Finland', 'Tågen stoppas', 'Karin får ett nytt arbete']],
         ['Warum zählt Karin die Waggons?', ['Um nicht nachdenken zu müssen', 'Weil es ihre Arbeit ist', 'Um es der Zeitung zu melden'], 'Jag räknar för att slippa tänka.', 'Varför räknar Karin vagnarna?', ['För att slippa tänka', 'För att det är hennes arbete', 'För att berätta det för tidningen']]],
      keep:[['Vi pratar inte om det.', 'Wir reden nicht darüber.'], ['Man vet aldrig vem som lyssnar.', 'Man weiß nie, wer zuhört.']],
      src:['Wikipedia (englisch), „Timeline of Sweden during World War II“ (Abkommen vom 8.7.1940 über die Urlaubertransporte)', 'SVT, „70 år sedan tysktågen rullade genom Sverige“ (Engelbrecht-Division zu Mittsommer 1941, Menschen winken)'] },
    { title:'Tidningen', when:'hösten 1942', date:'Göteborg, hösten 1942',
      hook:'I Göteborg skriver en tidning det som andra inte vågar.',
      recap:['Sedan 1940 får tyska soldater på permission resa genom Sverige. Vid midsommar 1941 rullar en hel tysk division med vapen genom landet.',
        'Seit 1940 dürfen deutsche Soldaten auf Urlaub durch Schweden reisen. Zu Mittsommer 1941 rollt eine ganze deutsche Division mit Waffen durch das Land.'],
      body:`Jag heter Elsa, jag är tjugofem år och jag arbetar på Göteborgs Handels- och Sjöfartstidning. Vår chefredaktör heter Torgny Segerstedt. Han är över sextio, ofta trött och alltid arg på Hitler.

Redan 1933, när Hitler just hade kommit till makten, skrev han i tidningen: ”Herr Hitler är en förolämpning.” Hermann Göring blev rasande. Sedan dess har Segerstedt skrivit mot nazismen nästan varje dag.

Det är inte populärt i Stockholm. Regeringen vill inte reta Tyskland. Kungen har till och med kallat Segerstedt till slottet för att varna honom. Det hjälpte inte.

Det finns censur nu, fast ingen vill använda det ordet. Tidningar som skriver för hårt om Tyskland kan beslagtas, och vissa har fått transportförbud. Ibland står vi på redaktionen och diskuterar ett enda ord i en rubrik i en timme.

På spårvagnen hem ser jag affischen med den blågula tigern. ”En svensk tiger”, står det. Det betyder två saker: en svensk tiger, och en svensk som tiger, alltså håller tyst. Det är meningen att vi ska tänka på spioner. Jag tänker på något annat.

Till redaktionen kommer brev från Norge och Danmark, och ibland rykten om vad som händer med judarna i öst. Vi vet inte vad som är sant, och det som kanske är sant är för hemskt för att tro på.

I kväll ligger en artikel på mitt skrivbord. Jag tror att den är sann, men den är farlig. Ska vi trycka den?`,
      q:[['Was schrieb Segerstedt 1933?', ['„Herr Hitler ist eine Beleidigung.“', '„Schweden muss neutral bleiben.“', '„Der Krieg ist bald vorbei.“'], 'skrev han i tidningen: ”Herr Hitler är en förolämpning.”', 'Vad skrev Segerstedt 1933?', ['”Herr Hitler är en förolämpning.”', '”Sverige måste vara neutralt.”', '”Kriget är snart slut.”']],
         ['Was kann mit Zeitungen geschehen, die zu hart über Deutschland schreiben?', ['Sie können beschlagnahmt werden', 'Sie bekommen Geld vom Staat', 'Sie werden ins Deutsche übersetzt'], 'Tidningar som skriver för hårt om Tyskland kan beslagtas, och vissa har fått transportförbud.', 'Vad kan hända med tidningar som skriver för hårt om Tyskland?', ['De kan beslagtas', 'De får pengar av staten', 'De översätts till tyska']],
         ['Welche zwei Bedeutungen hat „En svensk tiger“?', ['Ein schwedischer Tiger und ein Schwede, der schweigt', 'Ein starker und ein schwacher Schwede', 'Ein Tier im Zoo und ein Soldat'], 'Det betyder två saker: en svensk tiger, och en svensk som tiger, alltså håller tyst.', 'Vilka två betydelser har ”En svensk tiger”?', ['En svensk tiger och en svensk som håller tyst', 'En stark och en svag svensk', 'Ett djur på zoo och en soldat']]],
      keep:[['Det hjälpte inte.', 'Es half nichts.'], ['Ska vi trycka den?', 'Sollen wir ihn drucken?']],
      src:['torgnysegerstedt.se, „Who was Torgny Segerstedt?“ (Kolumne vom 3.2.1933, Görings Reaktion)', 'Dagbladet, „Uredd redaktør“ (der König bestellt Segerstedt ins Schloss)', 'Forum för levande historia, „In what ways was freedom of the press challenged“ (Beschlagnahmen, Transportverbote)', 'Wikipedia (englisch), „En svensk tiger“ (Plakat von Bertil Almqvist, 1941, Statens informationsstyrelse; Doppelbedeutung)'] },
    { title:'Över sundet', when:'okt 1943', date:'Ett fiskeläge vid Öresund, oktober 1943',
      hook:'En natt i oktober hörs motorer ute på sundet.',
      recap:['I Göteborg skriver Torgny Segerstedts tidning mot Hitler, trots varningar och censur. Överallt sitter affischer: ”En svensk tiger”.',
        'In Göteborg schreibt Torgny Segerstedts Zeitung gegen Hitler, trotz Warnungen und Zensur. Überall hängen Plakate: „En svensk tiger“.'],
      body:`Jag heter Anna. Min man är fiskare, och vi bor i ett litet fiskeläge vid Öresund. När det är klart väder ser vi Danmark på andra sidan. I tre och ett halvt år har landet varit ockuperat av tyskarna.

Natten till den 2 oktober började tyskarna leta efter de danska judarna. Men många hade blivit varnade och hunnit gömma sig. Samma dag sa svensk radio att Sverige är berett att ta emot alla danska judar. Jag satt vid radion med min man. Han sa ingenting, men han gick ner till hamnen och stannade där hela natten.

Sedan började båtarna komma. Nästan varje natt kommer de nu: små fiskebåtar från den danska sidan, fulla av människor. Barn som sover i sina mammors armar. Gamla som inte kan gå själva. En kvinna som bara har en väska och ett fotografi.

Vi tar emot dem vid stranden, ger dem filtar och varm soppa och följer dem till polisen. I skolan har man ställt fram sängar. Ingen frågar vem som ska betala.

Tidningarna skriver att det redan är flera tusen. De flesta har betalat danska fiskare för att komma över, och många har förlorat allt de ägde. Men de lever.

Min man säger att han inte gör något märkvärdigt. ”Det är ju bara över sundet”, säger han.

I natt hör jag motorer igen, långt ute på vattnet. Hur många kommer i natt?`,
      q:[['Was sagt das schwedische Radio am 2. Oktober?', ['Schweden nimmt alle dänischen Juden auf', 'Schweden schließt die Grenze', 'Der Krieg ist vorbei'], 'Samma dag sa svensk radio att Sverige är berett att ta emot alla danska judar.', 'Vad sa svensk radio den 2 oktober?', ['Att Sverige tar emot alla danska judar', 'Att Sverige stänger gränsen', 'Att kriget är slut']],
         ['Wie kommen die Menschen über den Öresund?', ['In kleinen Fischerbooten von der dänischen Seite', 'Mit der Fähre', 'Über eine Brücke'], 'små fiskebåtar från den danska sidan, fulla av människor', 'Hur kommer människorna över Öresund?', ['I små fiskebåtar från den danska sidan', 'Med färjan', 'Över en bro']],
         ['Was tun Anna und die anderen am Strand?', ['Sie geben Decken und Suppe und bringen die Menschen zur Polizei', 'Sie schicken die Boote zurück', 'Sie verkaufen Fisch'], 'Vi tar emot dem vid stranden, ger dem filtar och varm soppa och följer dem till polisen.', 'Vad gör Anna och de andra vid stranden?', ['De ger filtar och soppa och följer folk till polisen', 'De skickar tillbaka båtarna', 'De säljer fisk']]],
      keep:[['Men de lever.', 'Aber sie leben.'], ['Ingen frågar vem som ska betala.', 'Niemand fragt, wer das bezahlen soll.']],
      src:['Wikipedia (englisch), „Rescue of the Danish Jews“ (Razzia in der Nacht zum 2.10.1943, Erklärung Schwedens am 2.10., Fahrt über den Öresund)', 'USHMM, „Danish Jews Escape“ (rund 7 200 Menschen von September bis Oktober 1943)', 'Humanity in Action (Bezahlung der Fischer, über 7 000 Menschen in wenigen Wochen)'] },
    { title:'De vita bussarna', when:'april 1945', date:'Norra Tyskland, april 1945',
      hook:'Vita bussar kör in i ett land som håller på att falla samman.',
      recap:['Hösten 1943 säger Sverige att landet tar emot de danska judarna. Natt efter natt kommer båtarna över Öresund, och flera tusen räddas.',
        'Im Herbst 1943 erklärt Schweden, es nehme die dänischen Juden auf. Nacht für Nacht kommen die Boote über den Öresund, und mehrere Tausend werden gerettet.'],
      body:`Jag heter Gunnar, och jag kör buss för Svenska Röda korset. Bussen är vitmålad, med den svenska flaggan på sidorna och röda kors på taket. Det är för att flygarna ska se vilka vi är.

Vi är i norra Tyskland, och landet faller sönder. Vägarna är fulla av flyktingar, trasiga bilar och soldater som går åt alla håll. Greve Folke Bernadotte från Röda korset har förhandlat med Heinrich Himmler, chefen för SS. Först gällde det bara fångar från Norge och Danmark. Nu får vi hämta fler.

I går körde vi till kvinnolägret Ravensbrück. Jag kan inte beskriva vad jag såg, och jag tänker inte försöka. Kvinnorna var så magra att vi kunde lyfta in dem i bussen som barn.

På vägen norrut blev en av kolonnerna beskjuten av allierade flygplan, trots de röda korsen. Flera kvinnor dog, efter allt de hade överlevt i lägret.

I morgon ska vi ta färjan från Köpenhamn till Malmö. Där väntar läkare och sjuksköterskor, varma bad och rena lakan.

En kvinna i min buss frågar hela tiden på tyska om det verkligen är Sverige vi åker till. Ja, säger jag, varje gång. Snart. Hon nickar och frågar igen en stund senare.

Jag är ingen hjälte. Jag kör bara bussen. Men jag kommer aldrig att glömma de här ansiktena.`,
      q:[['Warum sind die Busse weiß mit roten Kreuzen?', ['Damit die Flieger sehen, wer sie sind', 'Weil Weiß billiger ist', 'Weil es schwedische Busse aus Malmö sind'], 'Det är för att flygarna ska se vilka vi är.', 'Varför är bussarna vita med röda kors?', ['För att flygarna ska se vilka de är', 'För att vitt är billigare', 'För att det är bussar från Malmö']],
         ['Mit wem hat Folke Bernadotte verhandelt?', ['Mit Heinrich Himmler, dem Chef der SS', 'Mit dem schwedischen König', 'Mit dem norwegischen König'], 'Greve Folke Bernadotte från Röda korset har förhandlat med Heinrich Himmler, chefen för SS.', 'Med vem har Folke Bernadotte förhandlat?', ['Med Heinrich Himmler, chefen för SS', 'Med Sveriges kung', 'Med Norges kung']],
         ['Wie geht es morgen weiter?', ['Mit der Fähre von Kopenhagen nach Malmö', 'Zurück nach Ravensbrück', 'Mit dem Zug nach Stockholm'], 'I morgon ska vi ta färjan från Köpenhamn till Malmö.', 'Hur går resan vidare i morgon?', ['Med färjan från Köpenhamn till Malmö', 'Tillbaka till Ravensbrück', 'Med tåget till Stockholm']]],
      keep:[['Jag är ingen hjälte.', 'Ich bin kein Held.'], ['Nu får vi hämta fler.', 'Jetzt dürfen wir mehr holen.']],
      src:['Malmö museer, „Vad är de Vita bussarna?“ (weiße Busse mit Flagge und roten Kreuzen, Verhandlungen Bernadottes mit Himmler)', 'The Local, „The Swedish expedition that rescued thousands…“ (ab 21. April alle Nationalitäten, Beschuss am 25. April, Ankunft in Malmö am 28. April)', 'Svenska Röda korset, Aufstellung der Geretteten (15 345 aus den Lagern)'] },
    { title:'Freden', when:'maj 1945', date:'Stockholm, 7 maj 1945',
      hook:'En dag i maj fylls gatorna med människor.',
      recap:['April 1945: Svenska Röda korsets vita bussar hämtar fångar ur de tyska lägren och kör dem till Sverige.',
        'April 1945: Die weißen Busse des Schwedischen Roten Kreuzes holen Häftlinge aus den deutschen Lagern und bringen sie nach Schweden.'],
      body:`Det är jag igen, Sven. Jag är tjugosex nu, och jag har inte frusit på länge. I dag är jag i Stockholm, och hela staden är ute på gatorna.

På morgonen kom nyheten: Tyskland har kapitulerat. Kriget i Europa är slut. På Kungsgatan regnar det konfetti från fönstren, och människor som aldrig har sett varandra förut kramas.

Jag tänker på allt som har hänt de här åren. Norrmännen som kom ut ur skogen 1940. Tågen med tyska soldater, som stoppades först i augusti 1943, efter mer än två miljoner resor. De danska judarna, över 7 000, som kom över sundet på en enda höst. De vita bussarna, som har räddat över 15 000 människor ur lägren.

Och Torgny Segerstedt, han i Göteborg som skrev mot Hitler i tolv år. Han dog den 31 mars. Han fick aldrig se den här dagen.

Sverige har klarat sig. Vi har inte haft krig på över hundra år, och vi slapp den här gången också. Men jag kan inte bara jubla. Vi sålde järnmalm till Tyskland, vi lät deras soldater åka på våra tåg, och vi tittade ofta bort. Till slut hjälpte vi också. Var det tillräckligt?

En flicka ger mig en liten flagga. Jag viftar med den, som alla andra. I dag får vi vara glada. I morgon får vi fundera.`,
      q:[['Was ist die Nachricht am Morgen des 7. Mai 1945?', ['Deutschland hat kapituliert', 'Schweden tritt in den Krieg ein', 'Die Grenze nach Norwegen wird geschlossen'], 'På morgonen kom nyheten: Tyskland har kapitulerat.', 'Vilken nyhet kom på morgonen den 7 maj 1945?', ['Tyskland har kapitulerat', 'Sverige går in i kriget', 'Gränsen mot Norge stängs']],
         ['Wann wurden die Züge mit deutschen Soldaten gestoppt?', ['Im August 1943', 'Im April 1940', 'Im Mai 1945'], 'som stoppades först i augusti 1943, efter mer än två miljoner resor', 'När stoppades tågen med tyska soldater?', ['I augusti 1943', 'I april 1940', 'I maj 1945']],
         ['Was verkaufte Schweden an Deutschland?', ['Eisenerz', 'Waffen', 'Lebensmittel'], 'Vi sålde järnmalm till Tyskland', 'Vad sålde Sverige till Tyskland?', ['Järnmalm', 'Vapen', 'Mat']]],
      keep:[['Kriget i Europa är slut.', 'Der Krieg in Europa ist vorbei.'], ['I morgon får vi fundera.', 'Morgen dürfen wir nachdenken.']],
      src:['Sveriges Radio, „Tidslinje: Vägen till fred“ (Kapitulation am 7.5.1945, Konfetti auf der Kungsgatan)', 'Wikipedia (englisch), „Transit of German troops through Finland and Sweden“ (Ende am 15.8.1943, über zwei Millionen Fahrten)', 'Wikipedia (englisch), „Torgny Segerstedt“ (gestorben am 31.3.1945)', 'Wikipedia (englisch), „Sweden during World War II“ (Eisenerz für Deutschland); Svenska Röda korset (15 345 Gerettete)'] }
  ] }
],
es:[
// Paket 2 (24.99.0): Bergwerksunglück von San José, „Mit erfundener Figur“. Fakten geprüft am 28.11.2026 an den Quellen je Teil.
{ id:'los33', title:'Los 33', topic:'Geschichte', level:'B1', form:'figur',
  teaser:'Sesenta y nueve días bajo el desierto de Atacama, contados por una joven reportera.',
  intro:['El 5 de agosto de 2010, una mina se derrumba en el norte de Chile y 33 hombres quedan atrapados a 700 metros de profundidad. Camila, una joven reportera de Copiapó, cuenta lo que vive arriba, junto a las familias.',
    'Am 5. August 2010 stürzt im Norden Chiles ein Bergwerk ein, 33 Männer sind in 700 Metern Tiefe eingeschlossen. Camila, eine junge Reporterin aus Copiapó, erzählt, was sie oben bei den Familien erlebt.'],
  real:'Erfunden ist nur die Erzählerin Camila, alles andere ist belegt (Quellen unter jedem Teil). Die Nachricht der Bergleute steht im Original, alles andere Gesagte sinngemäß.',
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
  ] },
// Paket 3 (24.101.0): 23-F, „Du entscheidest“. Fakten geprüft am 28.11.2026 an den Quellen je Teil; Stand nach der Freigabe der
// Geheimdokumente am 25.2.2026.
{ id:'transistores', title:'La noche de los transistores', topic:'Geschichte', level:'B2', form:'wahl',
  teaser:'El 23 de febrero de 1981, un golpe de Estado contado en decisiones: ¿qué habrías hecho tú?',
  intro:['El 23 de febrero de 1981, guardias civiles armados asaltan el Congreso de los Diputados en Madrid. Durante unas dieciocho horas, la joven democracia española depende de lo que deciden unas pocas personas.',
    'Am 23. Februar 1981 stürmen bewaffnete Guardias Civiles das spanische Parlament in Madrid. Etwa achtzehn Stunden lang hängt die junge Demokratie davon ab, was wenige Menschen entscheiden.'],
  real:'Keine erfundenen Figuren; die Frage am Ende jedes Teils geht an dich. Tejeros Ruf steht im Original, sonst Gesagtes sinngemäß; Quellen unter jedem Teil.',
  cast:[['Antonio Tejero', 'Oberstleutnant der Guardia Civil, stürmt das Parlament', 1], ['Manuel Gutiérrez Mellado', 'General, stellvertretender Regierungschef', 1],
    ['Adolfo Suárez', 'scheidender Regierungschef', 1], ['Leopoldo Calvo-Sotelo', 'soll an diesem Tag Regierungschef werden', 1],
    ['Santiago Carrillo', 'Chef der Kommunisten', 2], ['Emilio Olabarrieta', 'Techniker der Cadena SER', 2], ['Jaime Milans del Bosch', 'Generalkapitän in Valencia', 2],
    ['José María García', 'Sportreporter, berichtet in der Nacht live', 3], ['Francisco Laína', 'leitet die Übergangsregierung', 3], ['Juan Carlos I', 'König', 3],
    ['Alfonso Armada', 'General, dem König nahe', 3]],
  words:[['diputado', 1], ['escaño', 1], ['guardia', 1], ['disparo', 1], ['golpe', 2], ['tanque', 2], ['emisora', 2], ['ocupar', 2], ['golpista', 3], ['mensaje', 4], ['rendirse', 4], ['manifestación', 5]],
  parts:[
    { title:'Las seis y veintitrés', when:'23 feb 1981', date:'Madrid, lunes 23 de febrero de 1981, por la tarde',
      body:`Es lunes por la tarde y el Congreso de los Diputados está lleno. Hace casi un mes que Adolfo Suárez anunció su dimisión como presidente del Gobierno, y hoy los diputados votan si Leopoldo Calvo-Sotelo será su sucesor. España vive tiempos difíciles: hay crisis económica, los atentados de ETA son constantes y en los cuarteles hay militares que no aceptan la democracia. Franco murió hace poco más de cinco años.

En el salón hay periodistas, fotógrafos y cámaras de Televisión Española. La radio retransmite la sesión en directo.

A las seis y veintitrés de la tarde se oyen ruidos en la puerta. Entra un teniente coronel de la Guardia Civil con una pistola en la mano: Antonio Tejero. Con él entran varios guardias con metralletas. En total, más de un centenar de guardias civiles ocupan el edificio. Tejero sube a la tribuna.

El vicepresidente del Gobierno, el general Manuel Gutiérrez Mellado, de 68 años, se levanta de su escaño y le ordena que se detenga. Los guardias intentan tirarlo al suelo. Entonces Tejero grita: «¡Quieto todo el mundo!». Y empiezan los disparos contra el techo.

Imagina que estás allí, en tu escaño. Las balas pasan por encima de tu cabeza, el ruido es terrible y no sabes qué va a pasar. ¿Qué haces: te tiras al suelo o te quedas sentado?`,
      q:[['Worüber stimmen die Abgeordneten an diesem Nachmittag ab?', ['Ob Leopoldo Calvo-Sotelo Regierungschef wird', 'Über eine neue Verfassung', 'Ob Adolfo Suárez weitermachen darf'], 'hoy los diputados votan si Leopoldo Calvo-Sotelo será su sucesor', '¿Qué votan los diputados esa tarde?', ['Si Leopoldo Calvo-Sotelo será presidente del Gobierno', 'Una nueva Constitución', 'Si Adolfo Suárez puede seguir']],
         ['Wer steht auf und stellt sich Tejero entgegen?', ['General Manuel Gutiérrez Mellado', 'Ein Fotograf', 'Leopoldo Calvo-Sotelo'], 'el general Manuel Gutiérrez Mellado, de 68 años, se levanta de su escaño', '¿Quién se levanta y se enfrenta a Tejero?', ['El general Manuel Gutiérrez Mellado', 'Un fotógrafo', 'Leopoldo Calvo-Sotelo']],
         ['Wie können viele Spanier die Sitzung verfolgen?', ['Das Radio überträgt sie live', 'Erst am nächsten Tag in der Zeitung', 'Per Telefon'], 'La radio retransmite la sesión en directo.', '¿Cómo pueden seguir muchos españoles la sesión?', ['La radio la retransmite en directo', 'En el periódico del día siguiente', 'Por teléfono']]],
      keep:[['Tejero sube a la tribuna.', 'Tejero steigt ans Rednerpult.'], ['Y empiezan los disparos contra el techo.', 'Und die Schüsse in die Decke beginnen.']],
      src:['Wikipedia (spanisch), „Golpe de Estado en España de 1981“ (18.23 Uhr, Abstimmung über Calvo-Sotelo)', 'Ara, „¡Quieto todo el mundo!: el 23-F, en 8 instantes“ (Gutiérrez Mellado, Schüsse, Ruf)', 'Fundación Juan March, Zeitungsarchiv 1981 (Radio überträgt die Abstimmung live)'] },
    { title:'Tres hombres sentados', when:'23 feb 1981', date:'Madrid y Valencia, lunes 23 de febrero de 1981, por la tarde',
      hook:'Lo que hicieron de verdad los diputados, y lo que pasa mientras tanto en Valencia.',
      recap:['Lunes 23 de febrero de 1981: mientras el Congreso vota al nuevo presidente del Gobierno, el teniente coronel Antonio Tejero entra con guardias civiles armados. Hay disparos contra el techo.',
        'Montag, 23. Februar 1981: Während das Parlament über den neuen Regierungschef abstimmt, dringt Oberstleutnant Antonio Tejero mit bewaffneten Guardias Civiles ein. Es fallen Schüsse in die Decke.'],
      body:`Casi todos hacen lo mismo: se tiran al suelo y se esconden detrás de los escaños. Solo tres hombres no lo hacen. Gutiérrez Mellado sigue de pie frente a los guardias, con los brazos en jarras. Adolfo Suárez, que se había levantado para ayudarlo, vuelve a sentarse en su escaño. Y el líder comunista Santiago Carrillo se queda sentado, inmóvil.

Pronto se sabe algo más: la radio sigue en el aire. Un técnico de la Cadena SER, Emilio Olabarrieta, ha dejado un micrófono abierto sin que los guardias lo noten, y muchos españoles oyen en directo los gritos y las metralletas. La cámara de Televisión Española apunta al techo, pero sigue grabando.

Un capitán anuncia a los diputados que pronto llegará una autoridad militar. Nadie sabe quién es.

Mientras tanto, en Valencia, el capitán general Jaime Milans del Bosch declara el estado de excepción, y decenas de tanques salen a las calles. Ya no hay duda: es un golpe de Estado. A las ocho menos cuarto, soldados ocupan también los estudios de Televisión Española en Madrid.

Ahora imagina que trabajas en una emisora de radio de Madrid. La televisión está ocupada, y nadie sabe si los soldados vendrán también a por vosotros. ¿Sigues contando lo que pasa o apagas los micrófonos?`,
      q:[['Wie viele Männer werfen sich nicht zu Boden?', ['Drei', 'Keiner', 'Etwa hundert'], 'Solo tres hombres no lo hacen.', '¿Cuántos hombres no se tiran al suelo?', ['Tres', 'Ninguno', 'Unos cien']],
         ['Wie hören viele Menschen, was im Parlament geschieht?', ['Über ein Mikrofon der Cadena SER, das offen bleibt', 'Über das Telefon eines Abgeordneten', 'Über eine Liveübertragung im Fernsehen'], 'ha dejado un micrófono abierto sin que los guardias lo noten', '¿Cómo oye mucha gente lo que pasa en el Congreso?', ['Por un micrófono de la Cadena SER que sigue abierto', 'Por el teléfono de un diputado', 'Por la televisión en directo']],
         ['Was geschieht in Valencia?', ['Der Generalkapitän ruft den Ausnahmezustand aus, Panzer fahren auf die Straßen', 'Es gibt eine große Demonstration für die Demokratie', 'Die Soldaten bleiben in den Kasernen'], 'el capitán general Jaime Milans del Bosch declara el estado de excepción', '¿Qué pasa en Valencia?', ['El capitán general declara el estado de excepción y salen los tanques', 'Hay una gran manifestación por la democracia', 'Los soldados se quedan en los cuarteles']]],
      keep:[['Solo tres hombres no lo hacen.', 'Nur drei Männer tun es nicht.'], ['Nadie sabe quién es.', 'Niemand weiß, wer das ist.']],
      src:['Ara, „¡Quieto todo el mundo!: el 23-F, en 8 instantes“ (die drei auf ihren Plätzen, SER und TVE)', 'The Objective, „23F: la improvisación que salvó a España“ und „Cien años de radio en España“ (Olabarrieta, offenes Mikrofon)', 'Wikipedia (spanisch), „Golpe de Estado en España de 1981“ (Valencia)', 'Diario de León, 25.2.2026 (TVE in Prado del Rey besetzt gegen 19.45 Uhr)'] },
    { title:'La noche de los transistores', when:'23 feb 1981', date:'España, noche del lunes 23 de febrero de 1981',
      hook:'Toda España con la radio pegada a la oreja, y un rey que tiene que decidir.',
      recap:['Casi todos los diputados se tiran al suelo; solo Gutiérrez Mellado, Suárez y Carrillo siguen en sus escaños. En Valencia salen los tanques, y en Madrid los soldados ocupan la televisión.',
        'Fast alle Abgeordneten werfen sich zu Boden; nur Gutiérrez Mellado, Suárez und Carrillo bleiben auf ihren Plätzen. In Valencia fahren Panzer auf, in Madrid besetzen Soldaten das Fernsehen.'],
      body:`Las radios siguen emitiendo. La Cadena SER, Radio Intercontinental y otras emisoras informan toda la noche, aunque los periodistas tienen miedo. A las diez y media, el periodista deportivo José María García se sube a una unidad móvil de la SER junto al Congreso y empieza a contar en directo lo que ve. En millones de casas nadie se acuesta: la gente escucha el transistor en la cocina, en el coche o en la cama. Por eso aquella noche se llama «la noche de los transistores». Dentro del Congreso, algunos diputados también tienen una pequeña radio y escuchan a escondidas lo que pasa fuera.

Como todo el Gobierno está secuestrado, los secretarios de Estado y los subsecretarios forman un gobierno provisional, dirigido por Francisco Laína, director de la Seguridad del Estado.

En el Palacio de la Zarzuela, el rey Juan Carlos pasa la noche al teléfono con los militares. Hacia las siete de la tarde ha decidido que el general Alfonso Armada, un hombre muy cercano a él, no entre en el palacio. A las diez y veinticinco envía un télex a todos los capitanes generales: quiere que se mantenga el orden constitucional. Pero los golpistas dicen que actúan en su nombre.

Ahora eres el rey. Un equipo de televisión puede venir a grabar un mensaje. Si hablas y los capitanes generales no te obedecen, lo pierdes todo. ¿Sales en televisión o esperas a saber quién está contigo?`,
      q:[['Was macht José María García um halb elf?', ['Er berichtet live aus einem Übertragungswagen am Parlament', 'Er geht ins Parlament hinein', 'Er überträgt ein Fußballspiel'], 'se sube a una unidad móvil de la SER junto al Congreso y empieza a contar en directo lo que ve', '¿Qué hace José María García a las diez y media?', ['Cuenta en directo desde una unidad móvil junto al Congreso', 'Entra en el Congreso', 'Retransmite un partido de fútbol']],
         ['Wer leitet die Übergangsregierung?', ['Francisco Laína, Leiter der Staatssicherheit', 'General Armada', 'Adolfo Suárez'], 'dirigido por Francisco Laína, director de la Seguridad del Estado', '¿Quién dirige el gobierno provisional?', ['Francisco Laína, director de la Seguridad del Estado', 'El general Armada', 'Adolfo Suárez']],
         ['Was schickt der König um 22.25 Uhr an die Generalkapitäne?', ['Ein Fernschreiben: Die verfassungsmäßige Ordnung soll bleiben', 'Den Befehl, die Abgeordneten festzunehmen', 'Eine Botschaft im Radio'], 'A las diez y veinticinco envía un télex a todos los capitanes generales', '¿Qué envía el rey a los capitanes generales a las diez y veinticinco?', ['Un télex: quiere que se mantenga el orden constitucional', 'Una orden de detener a los diputados', 'Un mensaje por la radio']]],
      keep:[['Las radios siguen emitiendo.', 'Die Radiosender senden weiter.'], ['Pero los golpistas dicen que actúan en su nombre.', 'Aber die Putschisten sagen, sie handelten in seinem Namen.']],
      src:['The Objective, „Cien años de radio en España“ (die Sender der Nacht)', 'Fundación Juan March, Zeitungsarchiv 1981 („La noche de los transistores“: García um 22.30 Uhr, Radios im Saal)', 'Público, „¿Quién es quién en el 23-F?“ (Laína und die Kommission der Staatssekretäre)', 'El Español, 26.2.2026, nach den freigegebenen Dokumenten (Armada nicht in die Zarzuela, Fernschreiben um 22.25 Uhr)'] },
    { title:'La una y catorce', when:'24 feb 1981', date:'Madrid, madrugada del martes 24 de febrero de 1981',
      hook:'Un mensaje grabado en el palacio, y un general en el Congreso.',
      recap:['Durante la noche, toda España escucha la radio. El rey Juan Carlos pasa horas al teléfono con los militares, mientras los golpistas dicen que actúan en su nombre.',
        'In der Nacht hört ganz Spanien Radio. König Juan Carlos telefoniert stundenlang mit den Militärs, während die Putschisten behaupten, in seinem Namen zu handeln.'],
      body:`El rey decide hablar. A las once y media de la noche, un equipo de Televisión Española llega por fin a la Zarzuela. Graba el mensaje del rey, que lleva el uniforme de capitán general del Ejército, y una hora después sale del palacio con la cinta.

Mientras tanto, el general Alfonso Armada ha ido al Congreso. Habla a solas con Tejero y le propone una salida: un gobierno presidido por el propio Armada, con políticos de casi todos los partidos. Tejero la rechaza. En ese gobierno habría socialistas y comunistas, y él no ha asaltado el Congreso para eso.

A la una y catorce, el rey aparece en las pantallas. Dice que la Corona no tolerará a quienes quieran interrumpir por la fuerza el proceso democrático. Catorce minutos después, Armada sale del Congreso sin nada. Poco después, Milans del Bosch ordena que los tanques vuelvan a los cuarteles de Valencia.

Pero Tejero no se rinde. Dentro, los diputados siguen en sus escaños, cansados y en silencio. Llevan más de siete horas allí.

Imagina que eres uno de los guardias civiles del Congreso. Te dijeron que todo se hacía en nombre del rey, y acabas de oír lo contrario por la radio. ¿Te quedas con Tejero o te vas?`,
      q:[['Was trägt der König in seiner Botschaft?', ['Die Uniform eines Generalkapitäns des Heeres', 'Einen dunklen Anzug', 'Freizeitkleidung'], 'que lleva el uniforme de capitán general del Ejército', '¿Qué lleva el rey en el mensaje?', ['El uniforme de capitán general del Ejército', 'Un traje oscuro', 'Ropa de calle']],
         ['Was schlägt Armada Tejero vor?', ['Eine Regierung unter Armada, mit Politikern fast aller Parteien', 'Sich bedingungslos zu ergeben', 'Ins Ausland zu fliehen'], 'un gobierno presidido por el propio Armada, con políticos de casi todos los partidos', '¿Qué le propone Armada a Tejero?', ['Un gobierno presidido por Armada, con políticos de casi todos los partidos', 'Rendirse sin condiciones', 'Huir al extranjero']],
         ['Was geschieht in Valencia nach der Botschaft?', ['Milans del Bosch schickt die Panzer in die Kasernen zurück', 'Noch mehr Panzer fahren auf', 'Milans del Bosch fährt nach Madrid'], 'Milans del Bosch ordena que los tanques vuelvan a los cuarteles de Valencia', '¿Qué pasa en Valencia después del mensaje?', ['Milans del Bosch ordena que los tanques vuelvan a los cuarteles', 'Salen más tanques a la calle', 'Milans del Bosch viaja a Madrid']]],
      keep:[['El rey decide hablar.', 'Der König entscheidet sich zu sprechen.'], ['Pero Tejero no se rinde.', 'Aber Tejero gibt nicht auf.']],
      src:['El Independiente, 25.2.2026, nach dem „Sucinto relato“ des Cesid (TVE in der Zarzuela um 23.30 Uhr, Uniform)', 'Wikipedia (spanisch), „Golpe de Estado en España de 1981“ (Armada bei Tejero, „chapuza“; Botschaft um 1.14 Uhr)', 'Diari de Tarragona, „Guía para no perderse en los papeles del 23-F“ (Armada geht 14 Minuten später, Rückzug in Valencia)', 'ABC, 24.2.1981 (Wortlaut der Botschaft)'] },
    { title:'Las doce del mediodía', when:'24 feb 1981', date:'Madrid, 24 y 27 de febrero de 1981; 25 de febrero de 2026',
      hook:'Una mañana fría y, cuarenta y cinco años después, unos papeles.',
      recap:['A la una y catorce, el rey defiende la Constitución en televisión. Milans del Bosch retira los tanques de Valencia, pero Tejero sigue en el Congreso con sus guardias.',
        'Um 1.14 Uhr verteidigt der König im Fernsehen die Verfassung. Milans del Bosch zieht die Panzer aus Valencia ab, aber Tejero bleibt mit seinen Guardias im Parlament.'],
      body:`Por la mañana, muchos guardias deciden por su cuenta: salen del Congreso por una ventana y se entregan. Tejero se queda cada vez más solo. A las once y veinticinco firma su rendición sobre el capó de un todoterreno, junto al edificio; por eso se habla del «pacto del capó». Los guardias de rango más bajo no serán juzgados. Hacia las doce salen los diputados, cansados, a una mañana fría. Han pasado unas dieciocho horas.

Tres días después, el viernes 27 de febrero, un millón y medio de personas llenan las calles de Madrid bajo el lema «Por la libertad, la democracia y la Constitución». Hay manifestaciones en toda España.

Un año después empieza el juicio. Al final, Tejero, Milans del Bosch y Armada son condenados a treinta años de cárcel.

El 25 de febrero de 2026, cuarenta y cinco años después, el Gobierno publica los documentos secretos del golpe. Confirman en lo esencial lo que ya se sabía. Ese mismo día muere Antonio Tejero, a los 93 años.

Ahora conoces el final. Pero piensa en aquella noche, cuando nadie sabía cómo iba a terminar. ¿Qué habrías hecho tú?`,
      q:[['Wo unterschreibt Tejero seine Kapitulation?', ['Auf der Motorhaube eines Geländewagens beim Parlament', 'Im Palast der Zarzuela', 'In einer Kaserne in Valencia'], 'firma su rendición sobre el capó de un todoterreno', '¿Dónde firma Tejero su rendición?', ['Sobre el capó de un todoterreno, junto al Congreso', 'En el Palacio de la Zarzuela', 'En un cuartel de Valencia']],
         ['Wie viele Menschen demonstrieren am 27. Februar in Madrid?', ['Anderthalb Millionen', 'Etwa fünfzigtausend', 'Zehn Millionen'], 'un millón y medio de personas llenan las calles de Madrid', '¿Cuántas personas se manifiestan en Madrid el 27 de febrero?', ['Un millón y medio', 'Unas cincuenta mil', 'Diez millones']],
         ['Was geschieht am 25. Februar 2026?', ['Die Regierung veröffentlicht die Geheimdokumente, und Tejero stirbt', 'Ein neuer Prozess beginnt', 'Der König hält wieder eine Rede'], 'el Gobierno publica los documentos secretos del golpe', '¿Qué pasa el 25 de febrero de 2026?', ['El Gobierno publica los documentos secretos y muere Tejero', 'Empieza un nuevo juicio', 'El rey da otro mensaje']]],
      keep:[['Tejero se queda cada vez más solo.', 'Tejero ist immer mehr allein.'], ['Han pasado unas dieciocho horas.', 'Etwa achtzehn Stunden sind vergangen.']],
      src:['Ara, „¡Quieto todo el mundo!“ (Guardias gehen am Morgen durchs Fenster); Economist & Jurist, „1982: los responsables del 23-F responden ante la Justicia“ (Pakt auf der Motorhaube)', 'Wikipedia (spanisch), „Golpe de Estado en España de 1981“ (11.25 Uhr, Urteile)', 'BOE, 19.2.2026, Ort der demokratischen Erinnerung (Demonstrationen vom 27.2.1981)', 'Ara, 25.2.2026 (Freigabe der Dokumente, Tod Tejeros)'] }
  ] },
// Paket 4 (24.102.0): Fall Grimaldos, „Ein Gegenstand erzählt“ (die Akte). Fakten geprüft am 28.11.2026 an den Quellen je Teil.
{ id:'cuenca', title:'El crimen de Cuenca', topic:'Geschichte', level:'B2', form:'ding',
  teaser:'En 1910 desaparece un pastor en La Mancha. Un expediente judicial cuenta lo que pasa después.',
  intro:['En agosto de 1910, un pastor desaparece cerca de Tresjuncos, en la provincia de Cuenca. Lo que sigue lo cuenta un narrador muy especial: el expediente del juzgado, que solo sabe lo que escriben en él.',
    'Im August 1910 verschwindet bei Tresjuncos in der Provinz Cuenca ein Schäfer. Was folgt, erzählt ein besonderer Erzähler: die Gerichtsakte, die nur weiß, was in ihr steht.'],
  real:'Die Akte als Erzählerin ist erfunden. Personen, Orte, Daten und Urteile sind belegt; was Beteiligte sagten, steht sinngemäß da. Quellen unter jedem Teil.',
  cast:[['José María Grimaldos', '„el Cepa“, Schäfer aus Tresjuncos', 1], ['León Sánchez', 'Vorarbeiter auf dem Gut, aus Osa de la Vega', 1], ['Gregorio Valero', 'Wächter auf dem Gut, aus Osa de la Vega', 1],
    ['Emilio Isasa Echenique', 'neuer Richter in Belmonte', 2], ['Galo Ponte', 'Minister', 4], ['Lola Salvador', 'Autorin', 5], ['Pilar Miró', 'Filmregisseurin', 5]],
  words:[['expediente', 1], ['juzgado', 1], ['denuncia', 1], ['acusar', 1], ['prueba', 1], ['archivar', 1], ['detención', 2], ['confesar', 2], ['culpable', 2], ['jurado', 3], ['indulto', 3], ['inocente', 4]],
  parts:[
    { title:'Una denuncia', when:'1910–1911', date:'Juzgado de Belmonte (Cuenca), 1910 y 1911',
      body:`Nazco en 1910, en el juzgado de Belmonte, un pueblo de la provincia de Cuenca. Soy un expediente: unas hojas de papel dentro de una carpeta, con un número en la tapa. Todo lo que sé es lo que escriben en mí.

Mi primera hoja es una denuncia. Un pastor de Tresjuncos, José María Grimaldos López, de 28 años, ha desaparecido. Lo llaman «el Cepa». El 20 de agosto vendió sus ovejas, fue a bañarse a la laguna de La Celadilla y no volvió.

Su familia acusa a dos hombres de Osa de la Vega, un pueblo cercano: León Sánchez, el mayoral de la finca donde trabajaba el Cepa, y Gregorio Valero, el guarda. Dicen que lo mataron para quedarse con el dinero de las ovejas.

Los dos hombres son detenidos. Pero no hay cuerpo, no hay testigos y no hay pruebas. El juez los deja libres.

En mis hojas se van acumulando declaraciones, sellos y firmas. Luego, nada. En septiembre de 1911 el caso se archiva, y a mí me guardan en una estantería, entre otros expedientes que ya nadie lee.

Desde allí oigo poco. Pero algo oigo. En Tresjuncos la gente sigue hablando, y la familia del Cepa no se rinde. En los pueblos pequeños, una sospecha no se archiva tan fácilmente como un papel.

¿Me abrirá alguien otra vez?`,
      q:[['Wann wurde der Schäfer zuletzt gesehen?', ['Am 20. August 1910, nachdem er seine Schafe verkauft hatte', 'Im September 1911', 'An Weihnachten 1910'], 'El 20 de agosto vendió sus ovejas, fue a bañarse a la laguna de La Celadilla y no volvió.', '¿Cuándo desaparece el pastor?', ['El 20 de agosto de 1910, después de vender sus ovejas', 'En septiembre de 1911', 'En Navidad de 1910']],
         ['Warum beschuldigt die Familie die zwei Männer?', ['Sie hätten ihn wegen des Geldes für die Schafe getötet', 'Sie hätten mit ihm gestritten', 'Sie hätten seine Schafe gestohlen'], 'Dicen que lo mataron para quedarse con el dinero de las ovejas.', '¿Por qué acusa la familia a los dos hombres?', ['Dicen que lo mataron para quedarse con el dinero de las ovejas', 'Dicen que se pelearon con él', 'Dicen que robaron sus ovejas']],
         ['Warum lässt der Richter die Männer frei?', ['Es gibt keine Leiche, keine Zeugen und keine Beweise', 'Sie haben ein Alibi', 'Der Schäfer ist wieder da'], 'Pero no hay cuerpo, no hay testigos y no hay pruebas.', '¿Por qué deja libres el juez a los dos hombres?', ['No hay cuerpo, ni testigos, ni pruebas', 'Tienen una coartada', 'El pastor ha vuelto']]],
      keep:[['Todo lo que sé es lo que escriben en mí.', 'Alles, was ich weiß, ist das, was man in mich hineinschreibt.'], ['El juez los deja libres.', 'Der Richter lässt sie frei.']],
      src:['Wikipedia (spanisch), „Crimen de Cuenca“ (Verschwinden am 20.8.1910, Anzeige in Belmonte, Einstellung im September 1911)', 'SensaCine, „Qué fue de Gregorio Valero y León Sánchez…“ (Verdacht wegen des Geldes für die Schafe)'] },
    { title:'Un juez nuevo', when:'1913', date:'Belmonte, 1913',
      hook:'Dos años en una estantería, y entonces llega alguien nuevo al juzgado.',
      recap:['En 1910 desaparece el pastor José María Grimaldos, «el Cepa». Su familia acusa a dos hombres de Osa de la Vega, pero no hay pruebas, y en 1911 el caso se archiva.',
        '1910 verschwindet der Schäfer José María Grimaldos, „el Cepa“. Seine Familie beschuldigt zwei Männer aus Osa de la Vega, aber es gibt keine Beweise, und 1911 wird der Fall eingestellt.'],
      body:`En 1913 me sacan del polvo. Ha llegado a Belmonte un juez nuevo, Emilio Isasa Echenique, y la familia del Cepa vuelve a insistir. El juez me lee entero, hoja por hoja. Después firma dos órdenes de detención: otra vez León Sánchez y Gregorio Valero.

La Guardia Civil se los lleva. Durante días están en el cuartel. Lo que ocurre allí no lo escribe nadie en mis hojas. Años más tarde se sabrá: los torturan para que confiesen y para que digan dónde está el cuerpo.

Y confiesan. Las declaraciones llegan a mí con letra limpia y ordenada, como si fueran verdad. Cada uno dice que el culpable es el otro. Sobre el cuerpo cuentan una historia, luego otra, luego otra distinta. Lo buscan donde ellos dicen, y no lo encuentran nunca.

A mí eso no me preocupa. Yo no busco cuerpos: yo guardo papeles. Y mis papeles dicen que hay un crimen y dos culpables.

El 11 de noviembre de 1913 me añaden una hoja especial: un certificado de defunción. Según ese papel, José María Grimaldos murió el 21 de agosto de 1910, asesinado por los dos hombres.

Ahora soy más grueso, más serio y más importante. Algún día me llevarán a Cuenca, ante un tribunal de verdad.`,
      q:[['Wer bringt den Fall 1913 wieder ins Rollen?', ['Ein neuer Richter, auf Drängen der Familie', 'Ein Journalist', 'Die beiden Männer selbst'], 'Ha llegado a Belmonte un juez nuevo, Emilio Isasa Echenique, y la familia del Cepa vuelve a insistir.', '¿Quién reabre el caso en 1913?', ['Un juez nuevo, porque la familia insiste', 'Un periodista', 'Los dos hombres']],
         ['Was steht nicht in der Akte?', ['Was in der Kaserne geschieht', 'Die Geständnisse', 'Der Totenschein'], 'Lo que ocurre allí no lo escribe nadie en mis hojas.', '¿Qué no está escrito en el expediente?', ['Lo que ocurre en el cuartel', 'Las confesiones', 'El certificado de defunción']],
         ['Was geschieht am 11. November 1913?', ['Ein Totenschein für Grimaldos kommt in die Akte', 'Die Männer werden freigelassen', 'Die Leiche wird gefunden'], 'El 11 de noviembre de 1913 me añaden una hoja especial: un certificado de defunción.', '¿Qué pasa el 11 de noviembre de 1913?', ['Le añaden al expediente un certificado de defunción', 'Los dos hombres salen libres', 'Encuentran el cuerpo']]],
      keep:[['Y confiesan.', 'Und sie gestehen.'], ['Yo no busco cuerpos: yo guardo papeles.', 'Ich suche keine Leichen: Ich bewahre Papiere auf.']],
      src:['Wikipedia (spanisch), „Crimen de Cuenca“ (Wiederaufnahme 1913, Richter Isasa, Folter, Geständnisse, Totenschein vom 11.11.1913)'] },
    { title:'El juicio', when:'1918–1925', date:'Audiencia Provincial de Cuenca, 1918',
      hook:'Cinco años después, el expediente viaja a Cuenca.',
      recap:['En 1913, un juez nuevo reabre el caso. León Sánchez y Gregorio Valero confiesan tras días en el cuartel de la Guardia Civil, y el Cepa es declarado muerto.',
        '1913 rollt ein neuer Richter den Fall wieder auf. León Sánchez und Gregorio Valero gestehen nach Tagen in der Kaserne der Guardia Civil, und el Cepa wird für tot erklärt.'],
      body:`En 1918 me ponen sobre una mesa larga, en la Audiencia Provincial de Cuenca. Delante hay un jurado popular: hombres de la provincia que tienen que decidir si dos vecinos son asesinos.

El juicio dura unas siete horas. En la sala se leen mis hojas: la denuncia, las confesiones, el certificado de defunción. Los abogados de los acusados casi no discuten si son culpables. Lo que intentan, sobre todo, es salvarlos del garrote, la pena de muerte.

El jurado delibera solo media hora. Culpables. León Sánchez y Gregorio Valero son condenados a dieciocho años de cárcel. Valero va a la prisión de San Miguel de los Reyes, en Valencia; Sánchez, a la de Cartagena.

Después vuelvo a una estantería, esta vez en Cuenca. Pasan los años. A veces llegan papeles nuevos y me los añaden al final: traslados, informes de la cárcel, peticiones de las familias.

En 1925 llegan dos indultos. El 4 de julio de 1925, después de doce años y dos meses presos, los dos hombres salen libres. Pero en mis hojas siguen siendo asesinos, y en sus pueblos también. Les cuesta encontrar trabajo, y mucha gente no quiere saber nada de ellos.

Yo creía que mi historia había terminado. Me equivocaba.`,
      q:[['Wie lange berät die Jury?', ['Nur eine halbe Stunde', 'Sieben Stunden', 'Drei Tage'], 'El jurado delibera solo media hora.', '¿Cuánto tiempo delibera el jurado?', ['Solo media hora', 'Siete horas', 'Tres días']],
         ['Was versuchen die Verteidiger vor allem?', ['Die Todesstrafe zu verhindern', 'Die Unschuld zu beweisen', 'Den Prozess zu verschieben'], 'Lo que intentan, sobre todo, es salvarlos del garrote, la pena de muerte.', '¿Qué intentan sobre todo los abogados?', ['Salvarlos de la pena de muerte', 'Demostrar que son inocentes', 'Retrasar el juicio']],
         ['Wann kommen die beiden Männer frei?', ['Am 4. Juli 1925, nach zwei Begnadigungen', 'Nach achtzehn Jahren', 'Gleich nach dem Prozess'], 'El 4 de julio de 1925, después de doce años y dos meses presos, los dos hombres salen libres.', '¿Cuándo salen libres los dos hombres?', ['El 4 de julio de 1925, tras dos indultos', 'Después de dieciocho años', 'Justo después del juicio']]],
      keep:[['Culpables.', 'Schuldig.'], ['Me equivocaba.', 'Ich irrte mich.']],
      src:['Wikipedia (spanisch), „Crimen de Cuenca“ (Prozess 1918, Gefängnisse, Begnadigung am 4.7.1925)', 'SensaCine, „Qué fue de Gregorio Valero y León Sánchez…“ (Geschworene, 18 Jahre)'] },
    { title:'Una carta de Mira', when:'1926–1935', date:'Tresjuncos y Madrid, 1926',
      hook:'Una carta llega a la parroquia de Tresjuncos.',
      recap:['En 1918, un jurado declara culpables a León Sánchez y Gregorio Valero, que pasan doce años en la cárcel. En 1925 salen libres, pero para todos siguen siendo asesinos.',
        '1918 erklärt eine Jury León Sánchez und Gregorio Valero für schuldig, sie sitzen zwölf Jahre im Gefängnis. 1925 kommen sie frei, aber für alle bleiben sie Mörder.'],
      body:`El 8 de febrero de 1926, el cura de Tresjuncos recibe una carta del cura de Mira, un pueblo a más de cien kilómetros. Le pide una partida de bautismo, porque alguien quiere casarse. El novio se llama José María Grimaldos López.

El cura de Tresjuncos esconde la carta. Pero poco después el propio Cepa aparece en el pueblo, vivo, dieciséis años mayor. El juez de Belmonte ordena detenerlo. Cuando le preguntan, cuenta que en 1910 llevaba el dinero de las ovejas en los bolsillos, tuvo un presentimiento y se marchó. Dice que nunca oyó hablar del juicio.

De repente, todas mis hojas mienten. El ministro Galo Ponte pide que se revise el caso. El 10 de julio de 1926, el Tribunal Supremo anula la sentencia de 1918, declara inocentes a León Sánchez y Gregorio Valero y anula también el certificado de defunción. El Estado tendrá que indemnizarlos.

Me miro y no me reconozco. Tengo dos confesiones de un crimen que nunca existió y el certificado de defunción de un hombre vivo que quiere casarse.

En 1935, el Estado da a los dos hombres una pensión de 3.000 pesetas al año. Se van a Madrid y trabajan como guardas en el parque del Retiro. Ese mismo año se juzga en Cuenca a guardias civiles, al secretario del juzgado y a los médicos forenses del caso. Todos salen absueltos.`,
      q:[['Was will der Pfarrer von Mira?', ['Eine Taufurkunde für eine Hochzeit', 'Geld für die Kirche', 'Die Akte des Falls'], 'Le pide una partida de bautismo, porque alguien quiere casarse.', '¿Qué le pide el cura de Mira?', ['Una partida de bautismo para una boda', 'Dinero para la iglesia', 'El expediente del caso']],
         ['Was entscheidet das Oberste Gericht am 10. Juli 1926?', ['Die beiden Männer sind unschuldig', 'Die Strafe wird verkürzt', 'Der Fall wird neu verhandelt'], 'declara inocentes a León Sánchez y Gregorio Valero', '¿Qué decide el Tribunal Supremo el 10 de julio de 1926?', ['Que los dos hombres son inocentes', 'Que la pena será más corta', 'Que habrá un nuevo juicio']],
         ['Wo arbeiten die beiden Männer später?', ['Als Wächter im Retiro-Park in Madrid', 'Auf dem Gut El Palomar', 'Beim Gericht in Cuenca'], 'Se van a Madrid y trabajan como guardas en el parque del Retiro.', '¿Dónde trabajan después los dos hombres?', ['Como guardas en el parque del Retiro, en Madrid', 'En la finca El Palomar', 'En el juzgado de Cuenca']]],
      keep:[['De repente, todas mis hojas mienten.', 'Plötzlich lügen alle meine Blätter.'], ['Me miro y no me reconozco.', 'Ich sehe mich an und erkenne mich nicht wieder.']],
      src:['Wikipedia (spanisch), „Crimen de Cuenca“ (Brief vom 8.2.1926, Urteil des Supremo vom 10.7.1926, Rente 1935, Prozess gegen die Beamten 1935)', 'eldiario.es, „El crimen de Cuenca, vigente cuarenta años después de su secuestro“ (Mira, gut hundert Kilometer von Tresjuncos)'] },
    { title:'Una película', when:'1979–1981', date:'Cuenca y Madrid, 1979 a 1981',
      hook:'Más de cincuenta años después, alguien quiere contar la historia con una cámara.',
      recap:['En 1926 se sabe la verdad sobre el Cepa. El Tribunal Supremo declara inocentes a León Sánchez y Gregorio Valero y anula el certificado de defunción.',
        '1926 kommt die Wahrheit über el Cepa ans Licht. Das Oberste Gericht erklärt León Sánchez und Gregorio Valero für unschuldig und hebt den Totenschein auf.'],
      body:`Pasan más de cincuenta años. Franco muere en 1975, y España empieza a vivir en democracia. Una escritora, Lola Salvador, escribe un libro sobre mi historia, y la directora de cine Pilar Miró decide hacer una película con él.

En el verano de 1979 ruedan en los mismos lugares donde empezó todo: Osa de la Vega, Tresjuncos, Belmonte, la laguna de La Celadilla. Por fin se cuenta lo que nunca se escribió en mis hojas: las torturas en el cuartel.

La película se llama «El crimen de Cuenca», y también hace historia. El Ministerio de Cultura no deja estrenarla. La jurisdicción militar la secuestra y procesa a Pilar Miró por injurias a la Guardia Civil. En febrero de 1980 la película se presenta en el Festival de Berlín, pero en España nadie puede verla.

Pilar Miró es la última persona civil juzgada por un tribunal militar en España. Al final, el Tribunal Supremo la absuelve, y en agosto de 1981 la película se estrena por fin en los cines. Es la única película prohibida en la España democrática.

Yo sigo en un archivo, con mis hojas amarillas. Todo lo que hay en mí está bien escrito, firmado y sellado. Y casi nada es verdad.`,
      q:[['Wo wird der Film gedreht?', ['An den Orten, wo alles begann', 'In einem Studio in Madrid', 'In Berlin'], 'En el verano de 1979 ruedan en los mismos lugares donde empezó todo', '¿Dónde se rueda la película?', ['En los mismos lugares donde empezó todo', 'En un estudio de Madrid', 'En Berlín']],
         ['Warum wird Pilar Miró angeklagt?', ['Wegen Beleidigung der Guardia Civil', 'Wegen Steuerbetrugs', 'Weil sie ohne Erlaubnis gedreht hat'], 'procesa a Pilar Miró por injurias a la Guardia Civil', '¿Por qué procesan a Pilar Miró?', ['Por injurias a la Guardia Civil', 'Por no pagar impuestos', 'Por rodar sin permiso']],
         ['Wann kommt der Film in Spanien in die Kinos?', ['Im August 1981', 'Im Februar 1980', 'Gleich nach dem Dreh 1979'], 'en agosto de 1981 la película se estrena por fin en los cines', '¿Cuándo se estrena la película en España?', ['En agosto de 1981', 'En febrero de 1980', 'Justo después del rodaje, en 1979']]],
      keep:[['Pasan más de cincuenta años.', 'Mehr als fünfzig Jahre vergehen.'], ['Y casi nada es verdad.', 'Und fast nichts davon ist wahr.']],
      src:['Wikipedia (spanisch), „Crimen de Cuenca“ (Buch und Drehbuch von Lola Salvador, Verbot, Militärjustiz)', 'eldiario.es (Dreh im Sommer 1979 an den Originalschauplätzen)', 'Economist & Jurist, „Inicia el juicio contra Pilar Miró…“ (15.4.1980, letzte Zivilistin vor einem Militärgericht, Freispruch)', 'SensaCine (Drehorte; einziger verbotener Film der Demokratie; Kinostart 17.8.1981)'] }
  ] }
]
};
