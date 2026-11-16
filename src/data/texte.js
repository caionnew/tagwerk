/* Lesetexte: eigene Texte (keine Übernahmen), Fakten geprüft. Je Text drei Verständnisfragen auf Deutsch,
   die erste Antwort ist die richtige (die App mischt die Reihenfolge), dazu die Textstelle mit der Antwort (wörtlich), und zwei Sätze zum Übernehmen mit Übersetzung.
   Absätze im Text mit Leerzeile trennen. Jeder Satz endet mit . ! oder ?, damit Vorlesen und Antippen satzweise gehen. */
const TEXTS = {
sv:[
{ id:'allemansratten', topic:'Natur', level:'B1', title:'Allemansrätten',
  body:`I Sverige får alla röra sig fritt i naturen, även på mark som någon annan äger. Det kallas allemansrätten. Du får vandra i skogen, bada i sjöar och plocka bär och svamp. Du får också tälta ett eller två dygn på samma ställe, om du inte är för nära ett hus.

Men rätten kommer med ansvar. Man ska inte störa djur eller människor, och man får inte skada träd eller lämna skräp efter sig. Att göra upp eld är ofta förbjudet på sommaren, när det är torrt. Regeln är enkel: inte störa, inte förstöra.

Allemansrätten är ingen vanlig lag med många paragrafer. Den är en gammal sedvänja som nämns i grundlagen.`,
  q:[['Was erlaubt die Allemansrätten?', ['Im Wald wandern und Beeren pflücken, auch auf fremdem Land', 'Überall Feuer machen', 'Bäume fällen, wenn man Holz braucht'], 'Du får vandra i skogen, bada i sjöar och plocka bär och svamp.'],
     ['Wie lange darf man an einem Ort zelten?', ['Ein oder zwei Tage', 'Eine Woche', 'Gar nicht'], 'Du får också tälta ett eller två dygn på samma ställe'],
     ['Was ist die Allemansrätten?', ['Eine alte Tradition, die im Grundgesetz erwähnt wird', 'Ein Gesetz mit vielen Paragrafen', 'Eine Regel nur für Nationalparks'], 'Den är en gammal sedvänja som nämns i grundlagen.']],
  keep:[['Du får vandra i skogen, bada i sjöar och plocka bär och svamp.', 'Du darfst im Wald wandern, in Seen baden und Beeren und Pilze sammeln.'],
        ['Regeln är enkel: inte störa, inte förstöra.', 'Die Regel ist einfach: nicht stören, nicht zerstören.']] },
{ id:'vasa', topic:'Geschichte', level:'B2', title:'Regalskeppet Vasa',
  body:`Den 10 augusti 1628 seglade det nya krigsskeppet Vasa ut från Stockholm. Skeppet var stort, vackert och fullt av kanoner. Kungen, Gustav II Adolf, ville visa hela Europa hur mäktigt Sverige var. Men efter bara drygt tusen meter kom en vindby. Vasa lutade, vatten forsade in genom kanonportarna och skeppet sjönk mitt i hamnen.

Skeppet var helt enkelt för smalt och för högt. Det låg kvar på botten i 333 år. I Östersjöns kalla vatten, som bara innehåller lite salt, kan skeppsmasken inte leva, och därför var träet väl bevarat. År 1961 lyftes Vasa upp. I dag står skeppet i Vasamuseet, ett av de mest besökta museerna i Skandinavien.`,
  q:[['Warum sank die Vasa?', ['Sie war zu schmal und zu hoch', 'Sie stieß gegen einen Felsen', 'Sie wurde im Krieg beschossen'], 'Skeppet var helt enkelt för smalt och för högt.'],
     ['Wann wurde das Schiff gehoben?', ['1961', '1628', '1990'], 'År 1961 lyftes Vasa upp.'],
     ['Warum blieb das Holz so gut erhalten?', ['Im wenig salzigen Wasser der Ostsee lebt der Schiffsbohrwurm nicht', 'Das Schiff war mit Metall verkleidet', 'Es lag tief im Sand vergraben'], 'kan skeppsmasken inte leva']],
  keep:[['Skeppet var helt enkelt för smalt och för högt.', 'Das Schiff war einfach zu schmal und zu hoch.'],
        ['År 1961 lyftes Vasa upp.', '1961 wurde die Vasa gehoben.']] },
{ id:'midnattssol', topic:'Natur', level:'B1', title:'Midnattssol och mörkertid',
  body:`Norr om polcirkeln är året fullt av kontraster. På sommaren går solen inte ner på flera veckor. I Kiruna kan man se midnattssolen från slutet av maj till mitten av juli. Många har svårt att sova och sätter upp mörka gardiner.

På vintern är det tvärtom. Då kommer solen inte upp över horisonten, och det kallas mörkertid. Helt mörkt är det ändå inte. Mitt på dagen blir himlen blå och rosa i några timmar, och snön lyser upp landskapet.

Den som bor i norr lär sig att leva med ljuset. På sommaren grillar folk mitt i natten, och på vintern tänder man levande ljus och letar efter norrsken.`,
  q:[['Wann sieht man in Kiruna die Mitternachtssonne?', ['Von Ende Mai bis Mitte Juli', 'Im Dezember', 'Das ganze Jahr über'], 'I Kiruna kan man se midnattssolen från slutet av maj till mitten av juli.'],
     ['Was ist „mörkertid“?', ['Die Zeit, in der die Sonne nicht über den Horizont kommt', 'Die Stunden nach Mitternacht', 'Ein Fest im Winter'], 'Då kommer solen inte upp över horisonten, och det kallas mörkertid.'],
     ['Wie ist es mittags in der „mörkertid“?', ['Der Himmel wird für einige Stunden blau und rosa', 'Es ist völlig schwarz', 'Die Sonne scheint kurz'], 'Mitt på dagen blir himlen blå och rosa i några timmar']],
  keep:[['På sommaren går solen inte ner på flera veckor.', 'Im Sommer geht die Sonne mehrere Wochen lang nicht unter.'],
        ['På vintern är det tvärtom.', 'Im Winter ist es umgekehrt.']] },
{ id:'astrid', topic:'Kultur', level:'B1', title:'Astrid Lindgren',
  body:`Astrid Lindgren föddes 1907 på en gård utanför Vimmerby i Småland. Som barn lekte hon mycket ute, och många av hennes berättelser handlar om fria barn i naturen.

Hon började skriva på allvar när hennes dotter Karin var sjuk och ville höra en saga. Karin hittade själv på namnet Pippi Långstrump. Boken kom ut 1945 och blev en succé. Pippi är starkare än alla vuxna, bor ensam med en häst och en apa och bestämmer själv över sitt liv.

Astrid Lindgren skrev också om Emil i Lönneberga, Ronja Rövardotter och bröderna Lejonhjärta. Hennes böcker är översatta till över hundra språk.`,
  q:[['Wer hat sich den Namen Pippi Langstrumpf ausgedacht?', ['Astrids Tochter Karin', 'Astrid Lindgren selbst', 'Ihr Verlag'], 'Karin hittade själv på namnet Pippi Långstrump.'],
     ['Wann erschien das erste Pippi-Buch?', ['1945', '1907', '1965'], 'Boken kom ut 1945 och blev en succé.'],
     ['Mit wem lebt Pippi zusammen?', ['Mit einem Pferd und einem Affen', 'Mit ihren Eltern', 'Mit einem Hund und einer Katze'], 'bor ensam med en häst och en apa']],
  keep:[['Hon började skriva på allvar när hennes dotter Karin var sjuk och ville höra en saga.', 'Sie begann ernsthaft zu schreiben, als ihre Tochter Karin krank war und ein Märchen hören wollte.'],
        ['Hennes böcker är översatta till över hundra språk.', 'Ihre Bücher sind in über hundert Sprachen übersetzt.']] },
{ id:'surstromming', topic:'Kurioses', level:'B1', title:'Surströmming',
  body:`Surströmming är strömming från Östersjön som får jäsa i flera månader. Fisken läggs först i saltlake och sedan i burkar. Under jäsningen bildas gaser, och därför kan burkarna bli runda och buckliga.

Lukten är berömd, och många tycker att den är fruktansvärd. Därför öppnar man burken utomhus, gärna under vatten eller i en hink. Den som vågar smaka äter fisken på tunnbröd med potatis, lök och gräddfil.

Traditionen är starkast i Norrland, särskilt längs Höga kusten. Säsongen börjar i augusti, och då bjuder många in till surströmmingsfest. Några älskar det, andra flyr så fort burken öppnas.`,
  q:[['Warum werden die Dosen rund?', ['Beim Gären entstehen Gase', 'Sie werden zu warm gelagert', 'Man füllt zu viel Fisch hinein'], 'Under jäsningen bildas gaser'],
     ['Wo öffnet man die Dose am besten?', ['Draußen, gern unter Wasser oder in einem Eimer', 'In der Küche am offenen Fenster', 'Im Kühlschrank'], 'Därför öppnar man burken utomhus, gärna under vatten eller i en hink.'],
     ['Womit isst man Surströmming?', ['Mit Tunnbröd, Kartoffeln, Zwiebeln und Sauerrahm', 'Mit Reis und Sojasoße', 'Mit süßem Gebäck'], 'äter fisken på tunnbröd med potatis, lök och gräddfil']],
  keep:[['Lukten är berömd, och många tycker att den är fruktansvärd.', 'Der Geruch ist berühmt, und viele finden ihn furchtbar.'],
        ['Några älskar det, andra flyr så fort burken öppnas.', 'Manche lieben es, andere fliehen, sobald die Dose geöffnet wird.']] },
{ id:'ishotellet', topic:'Reisen', level:'B1', title:'Ett hotell av is',
  body:`I Jukkasjärvi, inte långt från Kiruna, byggs ett hotell av is varje vinter. Isen tas från Torne älv på våren, sparas i kalla hallar och används när det blir kallt igen.

Konstnärer från hela världen formar rummen. Det finns sängar, stolar och lampor av is, och varje rum ser annorlunda ut. Inne är det runt minus fem grader. Gästerna sover i varma sovsäckar på renfällar.

På våren smälter hotellet och vattnet rinner tillbaka till älven. Sedan några år finns det också en del som är öppen hela året, med kylning som drivs av solenergi.`,
  q:[['Woher kommt das Eis?', ['Aus dem Fluss Torne älv', 'Aus einer Eisfabrik', 'Aus Grönland'], 'Isen tas från Torne älv på våren'],
     ['Wie kalt ist es in den Zimmern?', ['Etwa minus fünf Grad', 'Etwa null Grad', 'Etwa minus zwanzig Grad'], 'Inne är det runt minus fem grader.'],
     ['Was passiert im Frühling?', ['Das Hotel schmilzt, das Wasser fließt zurück in den Fluss', 'Es wird abgebaut und eingelagert', 'Es bleibt bis zum nächsten Winter stehen'], 'På våren smälter hotellet och vattnet rinner tillbaka till älven.']],
  keep:[['Inne är det runt minus fem grader.', 'Drinnen sind es etwa minus fünf Grad.'],
        ['Gästerna sover i varma sovsäckar på renfällar.', 'Die Gäste schlafen in warmen Schlafsäcken auf Rentierfellen.']] },
{ id:'foraldraledig', topic:'Gesellschaft', level:'B2', title:'Föräldraledighet',
  body:`I Sverige har föräldrar rätt till 480 dagar med föräldrapenning per barn. Dagarna kan delas mellan föräldrarna, men 90 dagar är reserverade för var och en av dem. Om en förälder inte tar sina dagar, försvinner de.

Systemet infördes 1974, och Sverige blev då det första landet i världen där även pappor kunde vara föräldralediga med ersättning. I dag är det vanligt att se pappor med barnvagn mitt på dagen. De kallas ibland lattepappor.

Ändå tar mammor fortfarande ut de flesta dagarna. Debatten handlar därför ofta om hur ledigheten ska delas mer jämnt.`,
  q:[['Wie viele Tage Elterngeld gibt es pro Kind?', ['480', '90', '365'], 'rätt till 480 dagar med föräldrapenning per barn'],
     ['Was passiert mit reservierten Tagen, die ein Elternteil nicht nimmt?', ['Sie verfallen', 'Der andere Elternteil bekommt sie', 'Man bekommt sie ausgezahlt'], 'Om en förälder inte tar sina dagar, försvinner de.'],
     ['Was war 1974 besonders?', ['Als erstes Land konnten auch Väter bezahlte Elternzeit nehmen', 'Das Kindergeld wurde abgeschafft', 'Kitas wurden kostenlos'], 'Systemet infördes 1974']],
  keep:[['Om en förälder inte tar sina dagar, försvinner de.', 'Wenn ein Elternteil seine Tage nicht nimmt, verfallen sie.'],
        ['I dag är det vanligt att se pappor med barnvagn mitt på dagen.', 'Heute sieht man oft Väter mit Kinderwagen mitten am Tag.']] },
{ id:'offentlighet', topic:'Politik', level:'B2', title:'Offentlighetsprincipen',
  body:`Redan 1766 fick Sverige en tryckfrihetsförordning, en av världens första lagar om pressfrihet. Den gav också alla rätt att läsa myndigheternas handlingar. Principen gäller fortfarande och kallas offentlighetsprincipen.

I praktiken betyder det att vem som helst kan vända sig till en kommun eller ett departement och begära ut brev, avtal eller mejl. Man behöver inte berätta vem man är eller varför man vill ha uppgifterna. Myndigheten får inte heller försöka ta reda på det. Handlingarna ska lämnas ut skyndsamt, ofta samma dag.

Det finns undantag. Uppgifter om någons hälsa, om försvaret eller om pågående brottsutredningar kan beläggas med sekretess. Men huvudregeln är öppenhet, och det är sekretessen som måste motiveras.

För journalister är principen ett viktigt verktyg. Många granskningar av slöseri och maktmissbruk har börjat med en enkel begäran om att få se ett dokument. Dessutom gäller meddelarfriheten: den som är anställd i offentlig sektor får i regel berätta för medierna om missförhållanden, och chefen får inte leta efter källan.

För utländska besökare kan det verka märkligt. För de flesta svenskar är det självklart att makten ska tåla insyn.`,
  q:[['Was muss man angeben, wenn man in Schweden ein Behördendokument anfordert?', ['Weder den eigenen Namen noch den Grund', 'Den Namen, aber nicht den Grund', 'Einen Presseausweis'], 'Man behöver inte berätta vem man är eller varför man vill ha uppgifterna.'],
     ['Was muss nach der Grundregel begründet werden?', ['Die Geheimhaltung, nicht die Offenheit', 'Jede Anfrage nach einem Dokument', 'Jede Veröffentlichung in der Presse'], 'det är sekretessen som måste motiveras'],
     ['Was bedeutet die meddelarfrihet?', ['Beschäftigte im öffentlichen Dienst dürfen Medien über Missstände informieren, und niemand darf nach ihnen suchen', 'Journalisten dürfen alle geheimen Akten lesen', 'Behörden müssen jede Woche eine Pressemitteilung veröffentlichen'], 'Dessutom gäller meddelarfriheten']],
  keep:[['Man behöver inte berätta vem man är eller varför man vill ha uppgifterna.', 'Man muss nicht sagen, wer man ist oder warum man die Angaben haben will.'],
        ['Men huvudregeln är öppenhet, och det är sekretessen som måste motiveras.', 'Aber die Grundregel ist Offenheit, und begründen muss man die Geheimhaltung.'],
        ['För de flesta svenskar är det självklart att makten ska tåla insyn.', 'Für die meisten Schweden ist es selbstverständlich, dass sich die Macht in die Karten schauen lassen muss.']] },
{ id:'grannenslon', topic:'Gesellschaft', level:'B2', title:'Grannens lön',
  body:`I många länder är lönen en privatsak. I Sverige har det länge varit annorlunda. Eftersom deklarationerna hamnar hos en myndighet, Skatteverket, räknas de som allmänna handlingar, och vem som helst har kunnat ringa och fråga vad en person tjänar.

Förr såldes till och med tjocka böcker, så kallade taxeringskalendrar, där man kunde slå upp grannar, kolleger och kändisar. I dag sköts det mesta av webbtjänster som Ratsit och Merinfo. Där kan man för en liten summa se inkomst, adress och ålder på nästan vem som helst. Tjänsterna har ett utgivningsbevis, och då gäller EU:s dataskyddsregler i stort sett inte.

Kritikerna tycker att det har gått för långt. Uppgifterna kan användas av bedragare, och den som blir hotad kan lättare hittas. Försvararna menar att öppenheten motverkar fusk och gör löneskillnader synliga.

Ett litet steg mot mer integritet togs 2024. Skatteverket bedömer sedan dess att inkomst av tjänst och inkomst av näringsverksamhet var för sig inte längre är offentliga, från och med inkomståret 2023. Den sammanlagda förvärvsinkomsten går däremot fortfarande att få fram.`,
  q:[['Warum konnte man in Schweden das Einkommen anderer erfragen?', ['Steuererklärungen gelten als öffentliche Akten', 'Arbeitgeber müssen Gehälter im Internet veröffentlichen', 'Jeder muss sein Gehalt den Nachbarn mitteilen'], 'räknas de som allmänna handlingar'],
     ['Welches Argument nennen die Befürworter der Offenheit?', ['Sie erschwert Betrug und macht Lohnunterschiede sichtbar', 'Sie bringt dem Staat Gebühren ein', 'Sie schützt Menschen, die bedroht werden'], 'Försvararna menar att öppenheten motverkar fusk och gör löneskillnader synliga.'],
     ['Was ist seit dem Einkommensjahr 2023 noch öffentlich?', ['Die Summe der Erwerbseinkommen', 'Nur das Einkommen aus selbstständiger Arbeit', 'Gar nichts mehr'], 'Den sammanlagda förvärvsinkomsten går däremot fortfarande att få fram.']],
  keep:[['I många länder är lönen en privatsak.', 'In vielen Ländern ist das Gehalt Privatsache.'],
        ['Kritikerna tycker att det har gått för långt.', 'Die Kritiker finden, dass es zu weit gegangen ist.'],
        ['Försvararna menar att öppenheten motverkar fusk och gör löneskillnader synliga.', 'Die Befürworter meinen, dass die Offenheit Betrug entgegenwirkt und Lohnunterschiede sichtbar macht.']] },
{ id:'kiruna', topic:'Orte', level:'B2', title:'En stad som flyttar',
  body:`Kiruna, långt norr om polcirkeln, byggdes kring en järnmalmsgruva. Statliga LKAB bryter malmen djupt under jorden, i en av världens största underjordiska gruvor. Men ju längre ner man bryter, desto mer rör sig marken ovanför. Sprickor kryper närmare husen i den gamla stadskärnan.

Därför bestämdes det för drygt tjugo år sedan att en stor del av staden skulle flytta några kilometer österut. Ett nytt centrum med stadshus, torg och affärer har vuxit fram. Tusentals bostäder har rivits och ersatts, och LKAB står för en stor del av kostnaden.

Vissa byggnader var för värdefulla för att rivas. Den röda träkyrkan från 1912, som en gång röstades fram till Sveriges vackraste byggnad, lyftes upp på fjärrstyrda specialvagnar i augusti 2025. Under två dagar rullade den fem kilometer genom staden, en halv kilometer i timmen, medan folk stod längs vägen och SVT sände direkt.

Flytten väcker blandade känslor. Gruvan ger jobb och skatteintäkter, och utan den skulle Kiruna knappast finnas. Men många invånare sörjer kvarter där de har vuxit upp, och för samebyarna i området innebär nya gruvplaner mindre betesmark för renarna.`,
  q:[['Warum muss Kiruna umziehen?', ['Der Bergbau unter der Stadt bringt den Boden in Bewegung', 'Der Fluss tritt jedes Frühjahr über die Ufer', 'Die Stadt soll näher an den Flughafen rücken'], 'Men ju längre ner man bryter, desto mer rör sig marken ovanför.'],
     ['Wie wurde die Kirche umgesetzt?', ['Am Stück auf Spezialfahrzeugen, in zwei Tagen', 'In Einzelteile zerlegt und neu aufgebaut', 'Mit Hubschraubern in mehreren Etappen'], 'Under två dagar rullade den fem kilometer genom staden'],
     ['Welcher Nachteil wird für die Samen genannt?', ['Weniger Weideland für die Rentiere', 'Höhere Mieten in der neuen Innenstadt', 'Längere Wege zur Kirche'], 'för samebyarna i området innebär nya gruvplaner mindre betesmark för renarna']],
  keep:[['Sprickor kryper närmare husen i den gamla stadskärnan.', 'Risse kriechen näher an die Häuser im alten Stadtkern heran.'],
        ['Vissa byggnader var för värdefulla för att rivas.', 'Manche Gebäude waren zu wertvoll, um sie abzureißen.'],
        ['Flytten väcker blandade känslor.', 'Der Umzug weckt gemischte Gefühle.']] },
{ id:'samer', topic:'Minderheiten', level:'C1', title:'Samernas rättigheter',
  body:`Samerna är Sveriges urfolk. De levde i Sápmi, som i dag sträcker sig över Norge, Sverige, Finland och Ryssland, långt innan det fanns några nationsgränser. Renskötseln är fortfarande en viktig del av kulturen, även om de flesta samer i dag har helt andra yrken.

Under 1900-talet förde staten en hård politik. Samiska barn skickades till nomadskolor, språket trycktes undan, och vid ett statligt institut för rasbiologi mätte forskare samers skallar. Sametinget, som är både ett folkvalt organ och en statlig myndighet, inrättades först 1993.

År 2020 kom en dom som fick stor betydelse. Högsta domstolen slog fast att Girjas sameby, och inte staten, har rätt att upplåta småviltsjakt och fiske på sitt område ovanför odlingsgränsen, alltså bestämma vem som får jaga och fiska där. Skälet var att samerna har använt marken sedan urminnes tider. Domen hyllades av många samer men väckte ilska hos en del jägare, och flera samer berättade efteråt om hot och trakasserier.

I september 2026 lämnade en sanningskommission sin slutrapport om statens politik mot samerna och dess följder. Kommissionen föreslår bland annat att staten ska be det samiska folket om ursäkt. Hur regeringen och riksdagen svarar är ännu inte avgjort.`,
  q:[['Was entschied das Oberste Gericht 2020?', ['Die Samengemeinde Girjas, nicht der Staat, vergibt Kleinwildjagd und Fischerei in ihrem Gebiet', 'Die Rentierhaltung wird verboten', 'Samen dürfen ohne Erlaubnis überall in Schweden jagen'], 'Högsta domstolen slog fast att Girjas sameby'],
     ['Worauf stützte sich das Urteil?', ['Auf die Nutzung des Landes seit unvordenklicher Zeit', 'Auf ein neues Gesetz des Reichstags', 'Auf einen Vertrag mit Norwegen'], 'Skälet var att samerna har använt marken sedan urminnes tider.'],
     ['Was schlägt die Wahrheitskommission unter anderem vor?', ['Eine Entschuldigung des Staates beim samischen Volk', 'Ein samisches Parlament in Norwegen', 'Die Abschaffung des Sametinget'], 'Kommissionen föreslår bland annat att staten ska be det samiska folket om ursäkt.']],
  keep:[['Samerna är Sveriges urfolk.', 'Die Samen sind Schwedens indigenes Volk.'],
        ['Under 1900-talet förde staten en hård politik.', 'Im 20. Jahrhundert verfolgte der Staat eine harte Politik.'],
        ['Skälet var att samerna har använt marken sedan urminnes tider.', 'Der Grund war, dass die Samen das Land seit unvordenklichen Zeiten genutzt haben.']] },
{ id:'friskolor', topic:'Bildung', level:'B2', title:'Skolor med vinst',
  body:`År 1992 genomförde regeringen Bildt en skolreform som har gjort Sverige ganska unikt. Sedan dess följer en skolpeng med varje elev, och familjen väljer skola. Pengarna går dit, oavsett om skolan drivs av kommunen, av en stiftelse eller av ett privat företag.

Det ovanliga är att aktiebolag får driva skolor och dela ut vinst till ägarna. Internationellt är det sällsynt att skattefinansierade skolor får gå med vinst. I Sverige är friskolorna avgiftsfria för familjerna, och den största skolkoncernen är börsnoterad.

Friskolorna har vuxit snabbt. Läsåret 2025/26 gick ungefär var sjätte grundskoleelev och nästan var tredje gymnasieelev i en fristående skola.

Anhängarna menar att valfriheten har gett fler alternativ och tvingat de kommunala skolorna att bli bättre. Kritikerna pekar på att vinstdrivande skolor ofta har färre behöriga lärare och att betygen har stigit snabbare än kunskaperna. De varnar också för att elever med välutbildade föräldrar samlas i vissa skolor, medan andra skolor får de tyngsta uppgifterna.

Forskningen ger inget entydigt svar, och frågan har delat riksdagen i årtionden.`,
  q:[['Was ist am schwedischen System international ungewöhnlich?', ['Steuerfinanzierte Schulen dürfen Gewinn an Eigentümer ausschütten', 'Eltern müssen hohes Schulgeld zahlen', 'Alle Schulen gehören dem Staat'], 'Det ovanliga är att aktiebolag får driva skolor och dela ut vinst till ägarna.'],
     ['Wie viele Gymnasiasten besuchen eine freie Schule?', ['Fast jeder dritte', 'Etwa jeder zehnte', 'Mehr als die Hälfte'], 'nästan var tredje gymnasieelev'],
     ['Was kritisieren die Gegner?', ['Weniger ausgebildete Lehrkräfte und Noten, die schneller steigen als das Wissen', 'Zu hohes Schulgeld für Familien', 'Zu wenig Auswahl für die Eltern'], 'Kritikerna pekar på att vinstdrivande skolor ofta har färre behöriga lärare']],
  keep:[['Sedan dess följer en skolpeng med varje elev, och familjen väljer skola.', 'Seitdem bekommt jedes Kind einen Schulgutschein mit, und die Familie wählt die Schule.'],
        ['Friskolorna har vuxit snabbt.', 'Die freien Schulen sind schnell gewachsen.'],
        ['Forskningen ger inget entydigt svar, och frågan har delat riksdagen i årtionden.', 'Die Forschung gibt keine eindeutige Antwort, und die Frage spaltet den Reichstag seit Jahrzehnten.']] },
{ id:'nato', topic:'Politik', level:'B2', title:'Från alliansfrihet till Nato',
  body:`Sverige har inte varit i krig sedan 1814. Under den långa freden växte bilden av ett neutralt land fram, en medlare mellan öst och väst. Under kalla kriget samarbetade Sverige visserligen i hemlighet med västmakterna, men officiellt stod landet utanför alla allianser.

Efter Rysslands fullskaliga invasion av Ukraina i februari 2022 svängde opinionen snabbt. Socialdemokraterna, som länge hade sagt nej, ändrade ståndpunkt, och i maj samma år lämnade Sverige in sin ansökan. Turkiet och Ungern dröjde med att godkänna den, så det tog nästan två år. Den 7 mars 2024 blev Sverige Natos 32:a medlem.

Försvaret byggs nu upp igen. Värnplikten, som hade vilat sedan 2010, aktiverades på nytt 2017 och gäller både kvinnor och män. I november 2024 fick alla hushåll en broschyr om hur man förbereder sig för kris och krig, med råd om vatten, mat och radio.

Kritiker menar att Sverige har gett upp en roll som fredsmäklare. Anhängarna svarar att neutraliteten aldrig var så neutral som den såg ut och att ett litet land behöver allierade.`,
  q:[['Wann war Schweden zuletzt im Krieg?', ['1814', '1945', '1905'], 'Sverige har inte varit i krig sedan 1814.'],
     ['Warum dauerte der Beitritt fast zwei Jahre?', ['Die Türkei und Ungarn stimmten erst spät zu', 'Das schwedische Parlament war dagegen', 'Schweden musste erst die Wehrpflicht einführen'], 'Turkiet och Ungern dröjde med att godkänna den'],
     ['Für wen gilt die Wehrpflicht heute?', ['Für Frauen und Männer', 'Nur für Männer', 'Nur für Freiwillige'], 'gäller både kvinnor och män']],
  keep:[['Efter Rysslands fullskaliga invasion av Ukraina i februari 2022 svängde opinionen snabbt.', 'Nach Russlands Großangriff auf die Ukraine im Februar 2022 schlug die öffentliche Meinung schnell um.'],
        ['Försvaret byggs nu upp igen.', 'Die Verteidigung wird jetzt wieder aufgebaut.'],
        ['Kritiker menar att Sverige har gett upp en roll som fredsmäklare.', 'Kritiker meinen, Schweden habe eine Rolle als Friedensvermittler aufgegeben.']] },
{ id:'systembolaget', topic:'Alltag', level:'B2', title:'Systembolaget',
  body:`Den som vill köpa vin, sprit eller starköl i en svensk butik måste gå till Systembolaget. Det statliga bolaget har ensamrätt på att sälja alkohol till privatpersoner, och man måste vara 20 år för att handla där. Butikerna har begränsade öppettider och är stängda på söndagar.

Bakgrunden är en lång kamp mot supandet. År 1922 röstade svenskarna om ett totalförbud mot alkohol, och förbudet föll knappt: 51 procent röstade nej. I stället fortsatte man med motboken, som redan hade införts några år tidigare. Den gav varje köpare en personlig ranson av sprit, och gifta kvinnor fick sällan någon egen motbok. Systemet avskaffades först 1955.

När Sverige gick med i EU 1995 fick monopolet finnas kvar, eftersom det motiveras med folkhälsan. Butikerna får inte locka till köp: det finns inga extrapriser, och personalen ska be om legitimation om kunden ser ut att vara under 25.

Många utländska besökare tycker att reglerna är krångliga. Ändå är monopolet populärt. I mätningar vill en klar majoritet av svenskarna behålla det, delvis för att sortimentet är stort och personalen kunnig.`,
  q:[['Wie knapp scheiterte das Alkoholverbot 1922?', ['51 Prozent stimmten dagegen', 'Es wurde fast einstimmig abgelehnt', 'Es wurde angenommen, aber nie umgesetzt'], '51 procent röstade nej'],
     ['Was war die Motbok?', ['Ein persönliches Heft mit einer Alkoholration', 'Ein Kochbuch der Abstinenzbewegung', 'Ein Ausweis für Restaurantbesitzer'], 'Den gav varje köpare en personlig ranson'],
     ['Warum durfte das Monopol nach dem EU-Beitritt bleiben?', ['Es wird mit der Volksgesundheit begründet', 'Weil es dem Staat viel Geld bringt', 'Weil die EU Alkohol überall stark besteuert'], 'eftersom det motiveras med folkhälsan']],
  keep:[['Butikerna har begränsade öppettider och är stängda på söndagar.', 'Die Läden haben eingeschränkte Öffnungszeiten und sind sonntags geschlossen.'],
        ['Systemet avskaffades först 1955.', 'Das System wurde erst 1955 abgeschafft.'],
        ['Ändå är monopolet populärt.', 'Trotzdem ist das Monopol beliebt.']] },
{ id:'miljonprogrammet', topic:'Wohnen', level:'B2', title:'Miljonprogrammet',
  body:`I mitten av 1960-talet var bostadsbristen akut. Folk flyttade från landsbygden till städerna, och många bodde trångt i gamla lägenheter utan badrum. Riksdagen beslutade därför att en miljon bostäder skulle byggas på tio år, och mellan 1965 och 1974 blev det faktiskt drygt en miljon.

Bilden av miljonprogrammet domineras av grå betonghus i förorter som Rinkeby, Rosengård eller Hammarkullen. Men ungefär en tredjedel av bostäderna var villor och radhus. För sin tid var lägenheterna dessutom moderna, med rymliga kök, balkong och grönområden mellan husen.

Redan efter några år fick en del områden dåligt rykte. De som hade råd flyttade vidare, och lägenheterna gick till dem som hade svårast att få bostad någon annanstans, ofta nyanlända. I dag finns flera av områdena på polisens lista över utsatta områden, med hög arbetslöshet och problem med kriminella nätverk.

Samtidigt bor ungefär var fjärde invånare i Sverige i en bostad från de här åren, och många trivs. Husen behöver renoveras, men kraftiga hyreshöjningar efter renoveringar tvingar ibland ut de boende. Frågan är hur man rustar upp utan att driva bort dem som bor där.`,
  q:[['Was beschloss der Reichstag Mitte der 1960er-Jahre?', ['Eine Million Wohnungen in zehn Jahren zu bauen', 'Alle alten Häuser abzureißen', 'Den Bau von Einfamilienhäusern zu verbieten'], 'Riksdagen beslutade därför att en miljon bostäder skulle byggas på tio år'],
     ['Welcher Anteil waren Einfamilien- und Reihenhäuser?', ['Etwa ein Drittel', 'Fast keiner', 'Mehr als die Hälfte'], 'Men ungefär en tredjedel av bostäderna var villor och radhus.'],
     ['Welches Problem bringt die Sanierung mit sich?', ['Starke Mieterhöhungen drängen Bewohner hinaus', 'Die Wohnungen werden kleiner', 'Die Balkone müssen entfernt werden'], 'kraftiga hyreshöjningar efter renoveringar tvingar ibland ut de boende']],
  keep:[['I mitten av 1960-talet var bostadsbristen akut.', 'Mitte der 1960er-Jahre war die Wohnungsnot akut.'],
        ['Redan efter några år fick en del områden dåligt rykte.', 'Schon nach wenigen Jahren bekamen manche Viertel einen schlechten Ruf.'],
        ['Frågan är hur man rustar upp utan att driva bort dem som bor där.', 'Die Frage ist, wie man saniert, ohne die Menschen zu vertreiben, die dort wohnen.']] }
],
es:[
{ id:'espanavaciada', topic:'Gesellschaft', level:'B2', title:'La España vaciada',
  body:`En las últimas décadas, miles de pueblos del interior de España han ido perdiendo a sus habitantes. Los jóvenes se marchan a las ciudades en busca de trabajo, y en muchos lugares solo quedan personas mayores. En algunas comarcas viven menos de diez personas por kilómetro cuadrado.

Para describir este fenómeno se habla de la España vaciada. El término no es casual: sugiere que el campo no se ha quedado vacío por sí solo, sino que lo han ido dejando atrás la economía y la política.

Sin embargo, hay señales de cambio. Desde que se extendió el teletrabajo, algunas familias han decidido instalarse en pueblos donde la vivienda es barata y la vida más tranquila. Que esta tendencia se mantenga dependerá, sobre todo, de que lleguen la fibra óptica, los médicos y las escuelas.`,
  q:[['Warum verlieren viele Dörfer Einwohner?', ['Junge Leute ziehen für Arbeit in die Städte', 'Die Dörfer werden abgerissen', 'Die Mieten sind dort zu hoch'], 'Los jóvenes se marchan a las ciudades en busca de trabajo'],
     ['Was drückt der Begriff „España vaciada“ aus?', ['Das Land wurde geleert, es ist nicht von selbst leer geworden', 'Die Dörfer sind nur im Sommer leer', 'Spanien hat zu wenig Wasser'], 'sugiere que el campo no se ha quedado vacío por sí solo'],
     ['Wovon hängt laut Text ab, ob der Trend anhält?', ['Von Glasfaser, Ärzten und Schulen', 'Vom Wetter', 'Von neuen Autobahnen'], 'dependerá, sobre todo, de que lleguen la fibra óptica, los médicos y las escuelas']],
  keep:[['Los jóvenes se marchan a las ciudades en busca de trabajo, y en muchos lugares solo quedan personas mayores.', 'Die Jungen ziehen auf der Suche nach Arbeit in die Städte, und an vielen Orten bleiben nur ältere Menschen.'],
        ['Que esta tendencia se mantenga dependerá, sobre todo, de que lleguen la fibra óptica, los médicos y las escuelas.', 'Ob dieser Trend anhält, hängt vor allem davon ab, dass Glasfaser, Ärzte und Schulen kommen.']] },
{ id:'lenguas', topic:'Sprache', level:'B2', title:'Las lenguas de España',
  body:`Aunque mucha gente piensa que en España solo se habla español, el país tiene varias lenguas oficiales. Además del castellano, el catalán, el gallego y el euskera son cooficiales en sus comunidades autónomas.

El euskera, la lengua del País Vasco, es un caso especial: no está emparentado con ninguna otra lengua conocida y ya se hablaba en la región mucho antes de que llegaran los romanos. Durante la dictadura de Franco, el uso público de estas lenguas estuvo muy limitado, por lo que muchas familias dejaron de transmitirlas a sus hijos.

Hoy, en cambio, se enseñan en las escuelas, y en Barcelona, Santiago o Bilbao es habitual que los carteles estén en dos idiomas. Para quien aprende español conviene saberlo: a veces la lengua de la calle no es la que uno espera.`,
  q:[['Welche Sprachen sind neben Spanisch in ihren Regionen Amtssprachen?', ['Katalanisch, Galicisch und Baskisch', 'Portugiesisch und Französisch', 'Englisch und Arabisch'], 'el catalán, el gallego y el euskera son cooficiales'],
     ['Was ist am Baskischen besonders?', ['Es ist mit keiner bekannten Sprache verwandt', 'Es ist die jüngste Sprache Spaniens', 'Es wird nur geschrieben, nicht gesprochen'], 'no está emparentado con ninguna otra lengua conocida'],
     ['Was geschah unter Franco?', ['Die öffentliche Nutzung dieser Sprachen war stark eingeschränkt', 'Sie wurden Pflichtfach in allen Schulen', 'Sie wurden offiziell gleichgestellt'], 'el uso público de estas lenguas estuvo muy limitado']],
  keep:[['Aunque mucha gente piensa que en España solo se habla español, el país tiene varias lenguas oficiales.', 'Obwohl viele denken, dass in Spanien nur Spanisch gesprochen wird, hat das Land mehrere Amtssprachen.'],
        ['Hoy, en cambio, se enseñan en las escuelas, y en Barcelona, Santiago o Bilbao es habitual que los carteles estén en dos idiomas.', 'Heute dagegen werden sie in den Schulen unterrichtet, und in Barcelona, Santiago oder Bilbao sind Schilder meist zweisprachig.']] },
{ id:'siesta', topic:'Alltag', level:'A2', title:'La siesta',
  body:`Mucha gente cree que en España todo el mundo duerme la siesta. No es verdad. La mayoría de los españoles trabaja por la tarde y no tiene tiempo para dormir.

Lo que sí es típico es una pausa larga a mediodía. En muchos pueblos las tiendas cierran entre las dos y las cinco. La gente come tranquilamente, a veces con la familia, y la comida de mediodía es la más importante del día.

En verano, cuando hace mucho calor, una siesta corta es una buena idea. Algunos médicos dicen que veinte minutos son suficientes. Si duermes más, puedes despertarte cansado.`,
  q:[['Schlafen alle Spanier Siesta?', ['Nein, die meisten arbeiten nachmittags', 'Ja, jeden Tag', 'Nur im Winter'], 'La mayoría de los españoles trabaja por la tarde y no tiene tiempo para dormir.'],
     ['Was ist in vielen Dörfern typisch?', ['Die Geschäfte schließen zwischen zwei und fünf', 'Die Geschäfte sind nachts offen', 'Mittags isst man nichts'], 'En muchos pueblos las tiendas cierran entre las dos y las cinco.'],
     ['Wie lang sollte eine Siesta laut einigen Ärzten sein?', ['Zwanzig Minuten', 'Zwei Stunden', 'Eine Stunde'], 'Algunos médicos dicen que veinte minutos son suficientes.']],
  keep:[['En muchos pueblos las tiendas cierran entre las dos y las cinco.', 'In vielen Dörfern schließen die Geschäfte zwischen zwei und fünf.'],
        ['Algunos médicos dicen que veinte minutos son suficientes.', 'Einige Ärzte sagen, dass zwanzig Minuten genügen.']] },
{ id:'castells', topic:'Kultur', level:'B1', title:'Los castells',
  body:`En Cataluña, en las fiestas de muchos pueblos, grupos de personas construyen torres humanas. Se llaman castells, que significa castillos en catalán.

Abajo, cientos de personas forman la pinya, una base fuerte que sostiene la torre. Encima suben los demás, de pie sobre los hombros de los otros. Cuanto más alto, más ligeros son. Arriba del todo sube un niño o una niña, que lleva casco y levanta la mano para saludar. En ese momento el castell está completo.

Esta tradición tiene más de doscientos años. Desde 2010 es Patrimonio Cultural Inmaterial de la Humanidad.`,
  q:[['Was bedeutet „castells“?', ['Burgen', 'Türme', 'Feste'], 'que significa castillos en catalán'],
     ['Wer steht ganz oben?', ['Ein Kind mit Helm', 'Der stärkste Mann', 'Die Leiterin der Gruppe'], 'Arriba del todo sube un niño o una niña, que lleva casco'],
     ['Seit wann sind die castells Weltkulturerbe?', ['Seit 2010', 'Seit 1810', 'Seit 1990'], 'Desde 2010 es Patrimonio Cultural Inmaterial de la Humanidad.']],
  keep:[['Cuanto más alto, más ligeros son.', 'Je höher, desto leichter sind sie.'],
        ['Esta tradición tiene más de doscientos años.', 'Diese Tradition ist über zweihundert Jahre alt.']] },
{ id:'camino', topic:'Reisen', level:'A2', title:'El Camino de Santiago',
  body:`Cada año, cientos de miles de personas caminan hacia Santiago de Compostela, una ciudad en Galicia, en el noroeste de España. Es el Camino de Santiago.

Hay muchos caminos diferentes. El más famoso, el Camino Francés, empieza en los Pirineos y tiene unos ochocientos kilómetros. Por la noche, los peregrinos duermen en albergues baratos.

Cada peregrino tiene una credencial, un pequeño pasaporte. En los albergues, bares e iglesias le ponen sellos. Quien camina por lo menos los últimos cien kilómetros recibe al final la Compostela, un certificado. Muchos dicen que lo más bonito no es la meta, sino la gente que conocen por el camino.`,
  q:[['Wo liegt Santiago de Compostela?', ['In Galicien, im Nordwesten Spaniens', 'In Andalusien', 'In Katalonien'], 'una ciudad en Galicia, en el noroeste de España'],
     ['Wofür ist die „credencial“?', ['Für Stempel unterwegs', 'Als Busfahrkarte', 'Als Eintritt in die Kathedrale'], 'Cada peregrino tiene una credencial, un pequeño pasaporte.'],
     ['Was bekommt man für die letzten 100 km zu Fuß?', ['Die Compostela, ein Zertifikat', 'Eine Medaille', 'Ein kostenloses Hotelzimmer'], 'recibe al final la Compostela, un certificado']],
  keep:[['Hay muchos caminos diferentes.', 'Es gibt viele verschiedene Wege.'],
        ['Por la noche, los peregrinos duermen en albergues baratos.', 'Nachts schlafen die Pilger in günstigen Herbergen.']] },
{ id:'galapagos', topic:'Natur', level:'B1', title:'Las islas Galápagos',
  body:`Las islas Galápagos están en el océano Pacífico, a unos mil kilómetros de la costa de Ecuador. Son islas volcánicas, y algunas todavía tienen volcanes activos.

Muchos animales de las islas no existen en ningún otro lugar del mundo. Hay tortugas gigantes que pueden vivir más de cien años, iguanas que nadan en el mar y pájaros con patas azules. Como casi no tienen enemigos, muchos animales no tienen miedo de las personas.

En 1835 llegó Charles Darwin. Lo que observó allí le ayudó más tarde a desarrollar su teoría de la evolución. Hoy casi todo el archipiélago es parque nacional, y muchas zonas solo se pueden visitar con un guía.`,
  q:[['Zu welchem Land gehören die Galápagos-Inseln?', ['Ecuador', 'Peru', 'Chile'], 'a unos mil kilómetros de la costa de Ecuador'],
     ['Warum haben viele Tiere keine Angst vor Menschen?', ['Sie haben kaum Feinde', 'Sie werden gefüttert', 'Sie sind gezüchtet'], 'Como casi no tienen enemigos, muchos animales no tienen miedo de las personas.'],
     ['Wer kam 1835 auf die Inseln?', ['Charles Darwin', 'Christoph Kolumbus', 'Alexander von Humboldt'], 'En 1835 llegó Charles Darwin.']],
  keep:[['Muchos animales de las islas no existen en ningún otro lugar del mundo.', 'Viele Tiere der Inseln gibt es nirgendwo sonst auf der Welt.'],
        ['En 1835 llegó Charles Darwin.', '1835 kam Charles Darwin.']] },
{ id:'machupicchu', topic:'Geschichte', level:'B1', title:'Machu Picchu',
  body:`Machu Picchu es una ciudad inca construida en el siglo quince en las montañas de Perú, a unos dos mil cuatrocientos metros de altura. Los incas la construyeron con piedras tan bien cortadas que entre ellas no cabe ni un cuchillo.

Cuando llegaron los españoles, la ciudad ya estaba abandonada, y nunca la encontraron. Por eso se conservó tan bien. En 1911 el explorador estadounidense Hiram Bingham la dio a conocer al mundo, aunque los campesinos de la zona siempre supieron que estaba allí.

Hoy es Patrimonio de la Humanidad y una de las ruinas más visitadas de América. Para protegerla, el número de visitantes por día está limitado.`,
  q:[['Wann wurde Machu Picchu gebaut?', ['Im 15. Jahrhundert', 'Im 18. Jahrhundert', 'Vor 3000 Jahren'], 'construida en el siglo quince'],
     ['Warum ist die Stadt so gut erhalten?', ['Die Spanier haben sie nie gefunden', 'Sie lag unter Schnee begraben', 'Sie wurde 1911 neu aufgebaut'], 'Cuando llegaron los españoles, la ciudad ya estaba abandonada, y nunca la encontraron.'],
     ['Was gilt heute für Besucher?', ['Die Zahl pro Tag ist begrenzt', 'Der Eintritt ist verboten', 'Man darf nur nachts hinein'], 'el número de visitantes por día está limitado']],
  keep:[['Cuando llegaron los españoles, la ciudad ya estaba abandonada, y nunca la encontraron.', 'Als die Spanier kamen, war die Stadt schon verlassen, und sie fanden sie nie.'],
        ['Por eso se conservó tan bien.', 'Deshalb blieb sie so gut erhalten.']] },
{ id:'muertos', topic:'Kultur', level:'A2', title:'El Día de Muertos',
  body:`En México, el 1 y el 2 de noviembre se celebra el Día de Muertos. No es un día triste. Las familias recuerdan a las personas que han muerto y creen que esos días vuelven a visitarlas.

En casa preparan una ofrenda, una especie de altar con fotos, velas y flores naranjas de cempasúchil. También ponen la comida favorita de los muertos y el pan de muerto, un pan dulce que solo se hace en esta época.

Muchas familias pasan la noche en el cementerio. Limpian las tumbas, las decoran con flores, comen juntos y a veces hay música. Las calaveras de azúcar, de muchos colores, son uno de los símbolos más conocidos de la fiesta.`,
  q:[['Wann wird der Día de Muertos gefeiert?', ['Am 1. und 2. November', 'Am 31. Dezember', 'Im Frühling'], 'el 1 y el 2 de noviembre se celebra el Día de Muertos'],
     ['Was ist eine „ofrenda“?', ['Eine Art Altar mit Fotos, Kerzen und Blumen', 'Ein Kostüm', 'Ein Lied'], 'preparan una ofrenda, una especie de altar con fotos, velas y flores'],
     ['Wie ist die Stimmung an diesen Tagen?', ['Nicht traurig, man erinnert sich gemeinsam', 'Sehr still und traurig', 'Wie an Weihnachten mit Geschenken'], 'No es un día triste.']],
  keep:[['No es un día triste.', 'Es ist kein trauriger Tag.'],
        ['Muchas familias pasan la noche en el cementerio.', 'Viele Familien verbringen die Nacht auf dem Friedhof.']] },
{ id:'tomatina', topic:'Kurioses', level:'A2', title:'La Tomatina',
  body:`Cada año, el último miércoles de agosto, el pueblo de Buñol, cerca de Valencia, se pone rojo. Es la Tomatina, una batalla de tomates.

Llegan a la plaza camiones llenos de tomates maduros, y durante una hora miles de personas se los tiran unos a otros. Las reglas son pocas: hay que aplastar los tomates antes de tirarlos, para no hacer daño, y no se puede romper la ropa de otros.

Cuando termina la batalla, las calles están cubiertas de una salsa roja. Los bomberos limpian todo con agua, y los participantes se lavan en duchas o en el río. Nadie sabe exactamente cómo empezó, pero la primera Tomatina fue en 1945.`,
  q:[['Wann findet die Tomatina statt?', ['Am letzten Mittwoch im August', 'Am ersten Sonntag im Mai', 'An Silvester'], 'el último miércoles de agosto'],
     ['Welche Regel gilt?', ['Tomaten vor dem Werfen zerdrücken', 'Nur Grün tragen', 'Nur Kinder dürfen werfen'], 'hay que aplastar los tomates antes de tirarlos'],
     ['Seit wann gibt es die Tomatina?', ['Seit 1945', 'Seit dem Mittelalter', 'Seit 2001'], 'la primera Tomatina fue en 1945']],
  keep:[['Cuando termina la batalla, las calles están cubiertas de una salsa roja.', 'Wenn die Schlacht vorbei ist, sind die Straßen mit einer roten Soße bedeckt.'],
        ['Nadie sabe exactamente cómo empezó, pero la primera Tomatina fue en 1945.', 'Niemand weiß genau, wie es anfing, aber die erste Tomatina war 1945.']] },
{ id:'hora', topic:'Alltag', level:'B2', title:'La hora equivocada',
  body:`Si se mira un mapa, España queda en la misma franja de longitud que el Reino Unido y Portugal. El meridiano de Greenwich incluso atraviesa el este del país. Sin embargo, sus relojes marcan la misma hora que Berlín o Varsovia.

El cambio tiene fecha exacta. La noche del 16 de marzo de 1940, a las once, los relojes saltaron directamente a medianoche. Suele contarse como un gesto de Franco hacia la Alemania nazi, aunque varios países de Europa occidental también adelantaron sus relojes durante la guerra y tampoco volvieron atrás. Canarias, en cambio, va una hora por detrás, y de ahí la famosa frase de la radio: «una hora menos en Canarias».

La consecuencia es que el sol sale y se pone tarde. En Galicia, en pleno verano, todavía hay luz pasadas las diez de la noche. Muchos expertos relacionan este desfase con los horarios españoles: se come a las dos, se cena a las diez y, según varios estudios, se duerme menos que en otros países europeos. Otros recuerdan que esos horarios tienen también otras raíces, como las largas jornadas partidas de la posguerra.

Volver a la hora de Greenwich se ha propuesto varias veces, pero el cambio nunca ha llegado. Al final, cambiar la hora es fácil; cambiar las costumbres, no tanto.`,
  q:[['Seit wann gilt in Spanien die mitteleuropäische Zeit?', ['Seit März 1940', 'Seit dem Beginn des Bürgerkriegs 1936', 'Seit dem EU-Beitritt 1986'], 'La noche del 16 de marzo de 1940, a las once, los relojes saltaron directamente a medianoche.'],
     ['Was ist auf den Kanaren anders?', ['Dort ist es eine Stunde früher', 'Dort gilt die Berliner Zeit', 'Dort gibt es keine Sommerzeit'], 'Canarias, en cambio, va una hora por detrás'],
     ['Welche weitere Ursache für die späten Essenszeiten wird genannt?', ['Lange geteilte Arbeitstage in der Nachkriegszeit', 'Die Hitze im Sommer', 'Das Fernsehprogramm'], 'como las largas jornadas partidas de la posguerra']],
  keep:[['Sin embargo, sus relojes marcan la misma hora que Berlín o Varsovia.', 'Dennoch zeigen seine Uhren dieselbe Zeit wie in Berlin oder Warschau.'],
        ['La consecuencia es que el sol sale y se pone tarde.', 'Die Folge ist, dass die Sonne spät auf- und untergeht.'],
        ['Al final, cambiar la hora es fácil; cambiar las costumbres, no tanto.', 'Letztlich ist es leicht, die Uhrzeit zu ändern; die Gewohnheiten zu ändern, weniger.']] },
{ id:'memoria', topic:'Geschichte', level:'C1', title:'La memoria que divide',
  body:`Durante décadas, el Valle de los Caídos, en la sierra, a unos cincuenta kilómetros de Madrid, fue la tumba de Francisco Franco. El monumento se construyó en parte con el trabajo de presos políticos, y en sus criptas reposan además más de treinta mil víctimas de la guerra civil, de ambos bandos, muchas trasladadas allí sin permiso de sus familias.

Tras la muerte de Franco en 1975, la Transición apostó por mirar hacia delante. La Ley de Amnistía de 1977 liberó a presos políticos, pero también impidió juzgar los crímenes del régimen. Muchos lo llaman el pacto del olvido.

Las cosas empezaron a cambiar en el siglo XXI. Asociaciones de familiares abrieron fosas comunes con voluntarios, porque decenas de miles de personas siguen desaparecidas. En octubre de 2019, el Gobierno de Pedro Sánchez exhumó a Franco y lo trasladó a un cementerio de El Pardo. La Ley de Memoria Democrática de 2022 rebautizó el lugar como Valle de Cuelgamuros y convirtió en tarea del Estado la búsqueda de los desaparecidos.

Para sus defensores, se trata de justicia y de dignidad para las víctimas. El Partido Popular y Vox la consideran una ley que reabre heridas y divide a los españoles, y han prometido derogarla. Mientras tanto, los forenses ya han sacado cientos de cuerpos de las criptas del valle.`,
  q:[['Wer liegt außer Franco im Valle de los Caídos begraben?', ['Mehr als 30.000 Opfer des Bürgerkriegs beider Seiten', 'Nur Generäle des Regimes', 'Die spanischen Könige'], 'más de treinta mil víctimas de la guerra civil, de ambos bandos'],
     ['Was bewirkte das Amnestiegesetz von 1977 auch?', ['Die Verbrechen des Regimes konnten nicht verfolgt werden', 'Franco wurde nachträglich verurteilt', 'Alle Massengräber wurden geöffnet'], 'pero también impidió juzgar los crímenes del régimen'],
     ['Wie stehen PP und Vox zum Gesetz von 2022?', ['Sie wollen es aufheben', 'Sie haben es gemeinsam eingebracht', 'Sie wollen es auf ganz Europa ausweiten'], 'y han prometido derogarla']],
  keep:[['Tras la muerte de Franco en 1975, la Transición apostó por mirar hacia delante.', 'Nach Francos Tod 1975 setzte die Transición darauf, nach vorn zu schauen.'],
        ['Las cosas empezaron a cambiar en el siglo XXI.', 'Im 21. Jahrhundert begann sich etwas zu ändern.'],
        ['Para sus defensores, se trata de justicia y de dignidad para las víctimas.', 'Für die Befürworter geht es um Gerechtigkeit und Würde für die Opfer.']] },
{ id:'marmenor', topic:'Umwelt', level:'B2', title:'Una laguna con derechos',
  body:`El Mar Menor, en Murcia, es la mayor laguna salada de Europa. Una estrecha franja de arena, La Manga, la separa del Mediterráneo. Durante décadas fue un paraíso para bañistas y familias.

Pero el agua se fue enfermando. Los fertilizantes de la agricultura intensiva del Campo de Cartagena llegaban a la laguna y alimentaban algas que dejaban el fondo sin oxígeno. En 2016 el agua se volvió verde y turbia, y en 2019 y 2021 aparecieron toneladas de peces muertos en las playas.

Entonces una profesora de Filosofía del Derecho, Teresa Vicente, propuso algo inédito: darle a la laguna personalidad jurídica, como si fuera una persona. Más de 600.000 ciudadanos firmaron la iniciativa popular, y en 2022 las Cortes la aprobaron con el apoyo de todos los grupos salvo Vox. Así, el Mar Menor se convirtió en el primer ecosistema de Europa con derechos propios: a existir, a evolucionar de forma natural y a ser protegido y restaurado.

En la práctica, cualquier ciudadano puede ahora defender la laguna ante los tribunales en su nombre. En 2024 el Tribunal Constitucional confirmó la ley. Los agricultores temen nuevas restricciones y critican que se les culpe solo a ellos. Lo que nadie discute es que el Mar Menor necesitará años para recuperarse.`,
  q:[['Was schadete der Lagune vor allem?', ['Dünger aus der intensiven Landwirtschaft', 'Öl aus Schiffen', 'Zu viele Fischer'], 'Los fertilizantes de la agricultura intensiva del Campo de Cartagena llegaban a la laguna'],
     ['Wie kam das Gesetz zustande?', ['Durch eine Bürgerinitiative mit mehr als 600.000 Unterschriften', 'Durch ein Urteil des Verfassungsgerichts', 'Durch eine EU-Richtlinie'], 'Más de 600.000 ciudadanos firmaron la iniciativa popular'],
     ['Was können Bürger heute tun?', ['Die Lagune in ihrem Namen vor Gericht verteidigen', 'Kostenlos in der Lagune fischen', 'Grundstücke an der Lagune beschlagnahmen'], 'cualquier ciudadano puede ahora defender la laguna ante los tribunales en su nombre']],
  keep:[['Durante décadas fue un paraíso para bañistas y familias.', 'Jahrzehntelang war sie ein Paradies für Badegäste und Familien.'],
        ['Pero el agua se fue enfermando.', 'Aber das Wasser wurde nach und nach krank.'],
        ['Lo que nadie discute es que el Mar Menor necesitará años para recuperarse.', 'Unbestritten ist, dass das Mar Menor Jahre brauchen wird, um sich zu erholen.']] },
{ id:'once', topic:'Gesellschaft', level:'B2', title:'La ONCE',
  body:`En muchas calles españolas hay un pequeño quiosco donde se venden los cupones de la ONCE, la Organización Nacional de Ciegos Españoles. Detrás de esta lotería hay una historia poco común.

La ONCE nació el 13 de diciembre de 1938, día de Santa Lucía, patrona de los ciegos, en plena guerra civil. Un grupo de personas ciegas rechazó una pensión y prefirió unir las pequeñas rifas que muchos ya vendían para ganarse la vida. Pocos meses después empezó a venderse el cupón.

Desde entonces, la lotería financia casi todo lo que hace la organización: escuelas, perros guía, libros en braille y apoyo para encontrar trabajo. Muchos vendedores son personas ciegas o con otra discapacidad, y para ellos el quiosco es un empleo estable.

Con los años, la ONCE amplió su labor a todas las personas con discapacidad. En 1988 creó una fundación, y hoy el grupo, que tiene también empresas de lavandería, hoteles y limpieza, emplea a más de 70.000 personas, la mayoría con alguna discapacidad.

Algunos critican que una organización social dependa del juego. La ONCE responde que su lotería es pública y está regulada, y que todo el beneficio vuelve a la sociedad.`,
  q:[['Was taten die blinden Gründer 1938?', ['Sie lehnten eine Rente ab und legten ihre Lotterien zusammen', 'Sie gründeten eine Partei', 'Sie verlangten eine Steuer zugunsten der Blinden'], 'Un grupo de personas ciegas rechazó una pensión'],
     ['Wofür verwendet die ONCE das Geld aus der Lotterie?', ['Für Schulen, Blindenhunde, Braille-Bücher und Arbeitsvermittlung', 'Vor allem für Sportvereine', 'Für den Bau von Kirchen'], 'Desde entonces, la lotería financia casi todo lo que hace la organización'],
     ['Wie viele Menschen beschäftigt die Gruppe heute?', ['Mehr als 70.000, die meisten mit Behinderung', 'Etwa 7.000', 'Nur die blinden Losverkäufer'], 'emplea a más de 70.000 personas']],
  keep:[['Detrás de esta lotería hay una historia poco común.', 'Hinter dieser Lotterie steckt eine ungewöhnliche Geschichte.'],
        ['Muchos vendedores son personas ciegas o con otra discapacidad, y para ellos el quiosco es un empleo estable.', 'Viele Verkäufer sind blind oder haben eine andere Behinderung, und für sie ist der Kiosk eine feste Stelle.'],
        ['Algunos critican que una organización social dependa del juego.', 'Manche kritisieren, dass eine soziale Organisation vom Glücksspiel abhängt.']] },
{ id:'chile', topic:'Politik', level:'C1', title:'Chile y sus dos constituciones fallidas',
  body:`En octubre de 2019, el Gobierno chileno subió treinta pesos el billete de metro en Santiago. Los estudiantes empezaron a saltarse los torniquetes, y en pocos días el país vivió las mayores protestas desde el fin de la dictadura. El lema lo resumía todo: «No son treinta pesos, son treinta años».

Las protestas apuntaban a la desigualdad, a las pensiones privadas y a una Constitución redactada en 1980, bajo Pinochet, aunque reformada muchas veces. Para calmar la crisis, los partidos acordaron abrir un proceso constituyente. En 2020, casi el 80 % votó a favor de escribir una nueva Constitución.

Una convención elegida, paritaria y con escaños reservados para los pueblos indígenas, redactó un texto muy progresista. En septiembre de 2022, con voto obligatorio, el 62 % lo rechazó. Sus críticos lo veían demasiado largo y radical; sus defensores culparon a las campañas de desinformación.

Se intentó de nuevo, esta vez con un consejo dominado por la derecha. En diciembre de 2023, el 56 % rechazó también esa propuesta. Chile sigue, por tanto, con la Constitución de 1980. Muchos chilenos hablan hoy de cansancio constitucional.`,
  q:[['Was war der Auslöser der Proteste 2019?', ['Eine Fahrpreiserhöhung der Metro um 30 Pesos', 'Eine verlorene Präsidentschaftswahl', 'Ein Erdbeben in Santiago'], 'En octubre de 2019, el Gobierno chileno subió treinta pesos el billete de metro en Santiago.'],
     ['Wie ging die Abstimmung im September 2022 aus?', ['62 Prozent lehnten den Entwurf ab', 'Der Entwurf wurde knapp angenommen', 'Die Abstimmung wurde abgesagt'], 'el 62 % lo rechazó'],
     ['Welche Verfassung gilt heute in Chile?', ['Die von 1980, mehrfach reformiert', 'Die Verfassung von 2022', 'Die Verfassung von 2023'], 'Chile sigue, por tanto, con la Constitución de 1980.']],
  keep:[['El lema lo resumía todo: «No son treinta pesos, son treinta años».', 'Der Slogan fasste alles zusammen: „Es geht nicht um dreißig Pesos, sondern um dreißig Jahre.“'],
        ['Se intentó de nuevo, esta vez con un consejo dominado por la derecha.', 'Man versuchte es erneut, diesmal mit einem von der Rechten dominierten Rat.'],
        ['Muchos chilenos hablan hoy de cansancio constitucional.', 'Viele Chilenen sprechen heute von Verfassungsmüdigkeit.']] },
{ id:'uruguay', topic:'Gesellschaft', level:'B2', title:'Cannabis en la farmacia',
  body:`En diciembre de 2013, Uruguay se convirtió en el primer país del mundo en regular por ley todo el mercado del cannabis, desde el cultivo hasta la venta. La ley se aprobó bajo el Gobierno de José Mujica, conocido por su vida austera. El argumento era sencillo: si el Estado controla el mercado, se lo quita a los narcotraficantes.

La ley ofrece tres caminos. Se pueden cultivar unas pocas plantas en casa, entrar en un club cannábico o comprar en una farmacia. En todos los casos hay que ser ciudadano o residente y estar inscrito en un registro estatal. Los turistas, por tanto, no pueden comprar.

La venta en farmacias empezó en julio de 2017. Cada persona puede comprar como máximo diez gramos por semana y cuarenta al mes, y la compra se confirma con la huella dactilar. El precio lo fija el Estado.

Al principio hubo un problema inesperado: varios bancos amenazaron con cerrar las cuentas de las farmacias por miedo a las normas de Estados Unidos, y algunas dejaron de vender. Hoy el sistema funciona, aunque son pocas las farmacias que participan. Los críticos señalan que el consumo no ha bajado; los defensores, que el mercado legal ha quitado clientes a los traficantes.`,
  q:[['Welches Ziel verfolgte das Gesetz?', ['Den Drogenhändlern den Markt wegzunehmen', 'Touristen anzuziehen', 'Cannabis nur für Kranke zu erlauben'], 'si el Estado controla el mercado, se lo quita a los narcotraficantes'],
     ['Wer darf in der Apotheke kaufen?', ['Registrierte Staatsbürger und Einwohner', 'Alle Erwachsenen, auch Touristen', 'Nur Mitglieder eines Clubs'], 'hay que ser ciudadano o residente y estar inscrito en un registro estatal'],
     ['Welches unerwartete Problem gab es?', ['Banken drohten, die Konten der Apotheken zu schließen', 'Es wuchs zu wenig Cannabis', 'Die Preise stiegen stark an'], 'varios bancos amenazaron con cerrar las cuentas de las farmacias']],
  keep:[['La ley ofrece tres caminos.', 'Das Gesetz bietet drei Wege.'],
        ['Los turistas, por tanto, no pueden comprar.', 'Touristen können also nicht kaufen.'],
        ['El precio lo fija el Estado.', 'Den Preis legt der Staat fest.']] },
{ id:'bolivia', topic:'Sprache', level:'B2', title:'Un Estado plurinacional',
  body:`Desde 2009, el nombre oficial de Bolivia es Estado Plurinacional de Bolivia. La nueva Constitución, aprobada en referéndum durante el primer Gobierno de Evo Morales, el primer presidente indígena del país, reconoce que en Bolivia conviven muchas naciones.

Su artículo quinto declara oficiales el castellano y las lenguas de 36 pueblos indígenas, desde el aimara y el quechua hasta idiomas que hablan solo unos cientos de personas. El Gobierno central y los departamentales deben usar al menos dos lenguas oficiales, y para trabajar en la administración pública se exige, en teoría, hablar dos de ellas.

También los símbolos cambiaron. Junto a la bandera roja, amarilla y verde, la wiphala, una bandera de cuadros de colores de los pueblos andinos, es ahora símbolo del Estado. La Constitución reconoce además la justicia indígena, que las comunidades aplican según sus propias normas.

Para muchos indígenas, que durante siglos fueron excluidos, fue un reconocimiento histórico. Sus críticos, sobre todo en las tierras bajas del oriente, vieron en el cambio un proyecto político del partido de Morales. En la práctica, el castellano sigue dominando en las escuelas, los tribunales y los medios.`,
  q:[['Welche Sprachen sind in Bolivien Amtssprachen?', ['Spanisch und die Sprachen von 36 indigenen Völkern', 'Nur Spanisch und Quechua', 'Spanisch und Englisch'], 'Su artículo quinto declara oficiales el castellano y las lenguas de 36 pueblos indígenas'],
     ['Was ist die Wiphala?', ['Eine bunt karierte Flagge der Andenvölker, heute Staatssymbol', 'Ein traditionelles Musikinstrument', 'Das bolivianische Parlament'], 'la wiphala, una bandera de cuadros de colores de los pueblos andinos'],
     ['Wie sieht es in der Praxis aus?', ['Spanisch dominiert weiterhin in Schulen, Gerichten und Medien', 'Die meisten Schulen unterrichten nur noch auf Aymara', 'Spanisch wurde aus den Gerichten verbannt'], 'En la práctica, el castellano sigue dominando en las escuelas, los tribunales y los medios.']],
  keep:[['También los símbolos cambiaron.', 'Auch die Symbole änderten sich.'],
        ['Para muchos indígenas, que durante siglos fueron excluidos, fue un reconocimiento histórico.', 'Für viele Indigene, die jahrhundertelang ausgeschlossen waren, war es eine historische Anerkennung.'],
        ['En la práctica, el castellano sigue dominando en las escuelas, los tribunales y los medios.', 'In der Praxis dominiert Spanisch weiterhin in Schulen, Gerichten und Medien.']] },
{ id:'barcelona', topic:'Wohnen', level:'B2', title:'Barcelona contra los pisos turísticos',
  body:`Barcelona recibe cada año millones de turistas, y muchos se alojan en pisos alquilados a través de plataformas como Airbnb. Para los vecinos de barrios como la Barceloneta o el Gòtic, eso significa maletas en la escalera, ruido y, sobre todo, alquileres cada vez más altos.

En junio de 2024, el alcalde Jaume Collboni anunció una medida drástica: la ciudad no renovará ninguna de las 10.101 licencias de pisos turísticos. Cuando caduquen, en noviembre de 2028, esas viviendas deberán volver al uso residencial. Un decreto de la Generalitat de 2023 permite a los ayuntamientos hacerlo.

Unas semanas después, miles de personas se manifestaron con pistolas de agua contra el turismo masivo. Las imágenes de turistas mojados en las terrazas dieron la vuelta al mundo.

El PP y el sector recurrieron el decreto, pero en 2025 el Tribunal Constitucional lo avaló. Los críticos recuerdan que los pisos turísticos son apenas un uno por ciento de las viviendas de la ciudad y temen que crezca el alquiler ilegal. El Ayuntamiento responde que cada piso cuenta en una ciudad donde, según sus datos, el alquiler ha subido alrededor de un setenta por ciento en una década.`,
  q:[['Was kündigte Bürgermeister Collboni 2024 an?', ['Keine der 10.101 Lizenzen für Ferienwohnungen zu verlängern', 'Eine Touristensteuer abzuschaffen', 'Neue Hotels nur noch am Stadtrand zu erlauben'], 'la ciudad no renovará ninguna de las 10.101 licencias de pisos turísticos'],
     ['Womit protestierten Anwohner im Sommer 2024?', ['Mit Wasserpistolen', 'Mit Kochtöpfen', 'Mit einem Generalstreik'], 'miles de personas se manifestaron con pistolas de agua'],
     ['Welchen Einwand bringen Kritiker vor?', ['Ferienwohnungen machen nur etwa ein Prozent des Wohnungsbestands aus', 'Touristen zahlen zu wenig Steuern', 'Die Lizenzen laufen erst 2050 aus'], 'los pisos turísticos son apenas un uno por ciento de las viviendas de la ciudad']],
  keep:[['Cuando caduquen, en noviembre de 2028, esas viviendas deberán volver al uso residencial.', 'Wenn sie im November 2028 auslaufen, müssen diese Wohnungen wieder normal bewohnt werden.'],
        ['Unas semanas después, miles de personas se manifestaron con pistolas de agua contra el turismo masivo.', 'Wenige Wochen später demonstrierten Tausende mit Wasserpistolen gegen den Massentourismus.'],
        ['Las imágenes de turistas mojados en las terrazas dieron la vuelta al mundo.', 'Die Bilder von nassen Touristen auf den Terrassen gingen um die Welt.']] }
]
};
const textSentences = body => body.split(/\n\s*\n/).map(p => p.trim().split(/(?<=[.!?])\s+(?=[A-ZÅÄÖÁÉÍÓÚÑ¿¡0-9])/));
