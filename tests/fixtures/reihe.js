// Testreihe für Rahmen und Ansicht der Reihen (nicht in der App): drei kurze Teile, Teil 1 im geplanten Stil.
module.exports = {
  id:'test', title:'Natten på Sveavägen', topic:'Geschichte', level:'B2', form:'live',
  teaser:'Mordet på Olof Palme, från skotten till svaret 34 år senare.',
  intro:['Den 28 februari 1986 skjuts statsminister Olof Palme ihjäl på väg hem från bion. Det här är berättelsen om natten, spåren och frågan som Sverige levde med i 34 år.',
    'Am 28. Februar 1986 wird Ministerpräsident Olof Palme auf dem Heimweg vom Kino erschossen. Die Geschichte der Nacht, der Spuren und der Frage, mit der Schweden 34 Jahre lebte.'],
  real:'Alles belegt: Daten, Orte, Personen. Keine erfundenen Figuren, keine erfundenen Zitate.',
  cast:[['Olof Palme', 'Ministerpräsident, Sozialdemokrat', 1], ['Lisbet Palme', 'seine Frau', 1], ['Ingvar Carlsson', 'stellvertretender Ministerpräsident', 3]],
  words:[['biograf', 1], ['livvakt', 1], ['sjukhus', 2], ['regering', 3]],
  parts:[
    { title:'Fredag kväll', when:'28 feb 1986', date:'Stockholm, fredag 28 februari 1986',
      body:`Det är fredag kväll i Stockholm, och det är kallt. På biografen Grand på Sveavägen har filmen just tagit slut. Ut på trottoaren kommer statsminister Olof Palme och hans fru Lisbet.

Paret har inga livvakter med sig. Palme har själv sagt att han inte behöver dem i kväll. Han vill kunna gå på bio som vem som helst.

Sedan går de söderut längs Sveavägen, mot tunnelbanan. Det är inte mycket folk ute. Vid hörnet av Tunnelgatan är klockan 23.21. En man kommer gående bakom dem.`,
      q:[['Wo waren Olof und Lisbet Palme an diesem Abend?', ['Im Kino', 'Im Theater', 'Bei Freunden'], 'På biografen Grand på Sveavägen har filmen just tagit slut.', 'Var har Olof och Lisbet Palme varit i kväll?', ['På bio', 'På teatern', 'Hos vänner']],
         ['Warum hatten sie keine Leibwächter dabei?', ['Palme hatte gesagt, dass er sie nicht braucht', 'Die Leibwächter waren krank', 'Es gab damals keine'], 'Palme har själv sagt att han inte behöver dem i kväll.', 'Varför har de inga livvakter med sig?', ['Palme har sagt att han inte behöver dem', 'Livvakterna är sjuka', 'Det fanns inga då']],
         ['Wohin gingen die beiden nach dem Film?', ['Richtung U-Bahn', 'Ins Regierungsgebäude', 'In ein Restaurant'], 'Sedan går de söderut längs Sveavägen, mot tunnelbanan.', 'Vart går de efter filmen?', ['Mot tunnelbanan', 'Till regeringskansliet', 'Till en restaurang']]],
      keep:[['Han vill kunna gå på bio som vem som helst.', 'Er möchte ins Kino gehen können wie jeder andere.'], ['Det är inte mycket folk ute.', 'Es sind nicht viele Leute unterwegs.']],
      src:['Åklagarmyndigheten, Beschluss vom 10. Juni 2020'] },
    { title:'Natten', when:'1 mars 1986', date:'Stockholm, lördag 1 mars 1986',
      hook:'En taxichaufför har sett allt. Han ropar ut det i taxiradion.',
      recap:['Olof och Lisbet Palme går hem från bion, utan livvakter. Vid hörnet av Tunnelgatan kommer en man gående bakom dem.', 'Olof und Lisbet Palme gehen ohne Leibwächter vom Kino nach Hause. An der Ecke Tunnelgatan kommt ein Mann hinter ihnen her.'],
      body:`Det går mycket fort. En taxichaufför som står vid rödljuset har sett allt. Han ropar ut det i taxiradion.

Snart kommer polis och ambulans. Olof Palme förs till Sabbatsbergs sjukhus. Strax efter midnatt säger läkarna att han är död.`,
      q:[['Wer hat alles gesehen?', ['Ein Taxifahrer', 'Ein Polizist', 'Ein Arzt'], 'En taxichaufför som står vid rödljuset har sett allt.'],
         ['Wohin wird Palme gebracht?', ['Ins Krankenhaus', 'Nach Hause', 'Zur Polizei'], 'Olof Palme förs till Sabbatsbergs sjukhus.'],
         ['Was sagen die Ärzte nach Mitternacht?', ['Dass er tot ist', 'Dass er überlebt', 'Nichts'], 'Strax efter midnatt säger läkarna att han är död.']],
      keep:[['Det går mycket fort.', 'Es geht sehr schnell.'], ['Snart kommer polis och ambulans.', 'Bald kommen Polizei und Krankenwagen.']],
      src:['Wikipedia, „Mordet på Olof Palme“'] },
    { title:'Morgonen', when:'1 mars 1986', date:'Stockholm, lördag 1 mars 1986',
      hook:'Sverige vaknar till nyheten.',
      recap:['Olof Palme skjuts på Sveavägen. Strax efter midnatt säger läkarna att han är död.', 'Olof Palme wird auf der Sveavägen erschossen. Kurz nach Mitternacht sagen die Ärzte, dass er tot ist.'],
      body:`På lördagsmorgonen vaknar Sverige till nyheten. I radio och tv talar man inte om något annat.

Ingvar Carlsson leder nu regeringen. Polisen söker efter en man i mörk rock.`,
      q:[['Worüber spricht man im Radio?', ['Über den Mord', 'Über das Wetter', 'Über Sport'], 'I radio och tv talar man inte om något annat.'],
         ['Wer leitet jetzt die Regierung?', ['Ingvar Carlsson', 'Lisbet Palme', 'Die Polizei'], 'Ingvar Carlsson leder nu regeringen.'],
         ['Wen sucht die Polizei?', ['Einen Mann in dunklem Mantel', 'Einen Taxifahrer', 'Eine Frau'], 'Polisen söker efter en man i mörk rock.']],
      keep:[['Polisen söker efter en man i mörk rock.', 'Die Polizei sucht einen Mann in dunklem Mantel.'], ['I radio och tv talar man inte om något annat.', 'Im Radio und Fernsehen spricht man über nichts anderes.']],
      src:['Wikipedia, „Mordet på Olof Palme“'] }
  ]
};
