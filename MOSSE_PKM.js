const SKILL_DB = {
  normale: {
    1: [
      { nome:"Attacco Rapido", pwr:40 },
      { nome:"Azione", pwr:40 },
      { nome:"Botta", pwr:40 },
      { nome:"Bruciapelo", pwr:40 },
      { nome:"Echeggiavoce", pwr:40 },
      { nome:"Falsofinale", pwr:40 },
      { nome:"Giornopaga", pwr:40 },
      { nome:"Graffio", pwr:40 },
      { nome:"Campopulsar", pwr:50 },
      { nome:"Scontro", pwr:50 },
      { nome:"Taglio", pwr:50 },
      { nome:"Comete", pwr:60 },
    ],
    2: [
      { nome:"Incornata", pwr:65 },
      { nome:"Facciata", pwr:70 },
      { nome:"Bottintesta", pwr:70 },
      { nome:"Cantoantico", pwr:75 },
      { nome:"Extrarapido", pwr:80 },
      { nome:"Forza", pwr:80 },
      { nome:"Schianto", pwr:80 },
      { nome:"Corposcontro", pwr:85 },
    ],
    3: [
      { nome:"Baraonda", pwr:90 },
      { nome:"Granvoce", pwr:90 },
      { nome:"Giudizio", pwr:100 },
      { nome:"Ipertrapano", pwr:100 },
      { nome:"Colpo", pwr:120 },
      { nome:"Megacalcio", pwr:120 },
    ]
  },
  fuoco: {
    1: [
      { nome:"Braciere", pwr:40 },
      { nome:"Nitrocarica", pwr:50 },
      { nome:"Bruciatutto", pwr:60 },
      { nome:"Ruotafuoco", pwr:60 },
    ],
    2: [
      { nome:"Rogodenti", pwr:65 },
      { nome:"Pirolancio", pwr:70 },
      { nome:"Fuocopugno", pwr:75 },
      { nome:"Lavasbuffo", pwr:80 },
      { nome:"Fiammapatto", pwr:80 },
      { nome:"Calciardente", pwr:85 },
    ],
    3: [
      { nome:"Lanciafiamme", pwr:90 },
      { nome:"Ondacalda", pwr:95 },
      { nome:"Magmaclisma", pwr:100 },
      { nome:"Fuocobomba", pwr:110 },
      { nome:"Fuococarica", pwr:120 },
    ]
  },
  acqua: {
    1: [
      { nome:"Acquagetto", pwr:40 },
      { nome:"Bolla", pwr:40 },
      { nome:"Pistolacqua", pwr:40 },
      { nome:"Idropulsar", pwr:60 },
      { nome:"Pugnojet", pwr:60 },
    ],
    2: [
      { nome:"Acquadisale", pwr:65 },
      { nome:"Idrotaglio", pwr:70 },
      { nome:"Cascata", pwr:80 },
      { nome:"Idrovampata", pwr:80 },
      { nome:"Branchiomorso", pwr:85 },
    ],
    3: [
      { nome:"Surf", pwr:90 },
      { nome:"Idrondata", pwr:90 },
      { nome:"Idropompa", pwr:110 },
      { nome:"Ondaschianto", pwr:120 },
    ]
  },
  elettro: {
    1: [ { nome:"Tuonoshock", pwr:40 }, { nome:"Raggioscossa", pwr:50 }, { nome:"Elettrotela", pwr:55 }, { nome:"Elettrozap", pwr:60 }, { nome:"Ondashock", pwr:60 }, ],
    2: [ { nome:"Caricaparabola", pwr:65 }, { nome:"Fulmindenti", pwr:65 }, { nome:"Scintilla", pwr:65 }, { nome:"Elettroimpennata", pwr:70 }, { nome:"Invertivolt", pwr:70 }, { nome:"Saetta", pwr:70 }, { nome:"Tuonopugno", pwr:75 }, { nome:"Elettrogabbia", pwr:80 }, { nome:"Elettropizzico", pwr:80 }, { nome:"Overdrive", pwr:80 }, { nome:"Scarica", pwr:80 }, { nome:"Sprintaboom", pwr:80 }, { nome:"Beccoshock", pwr:85 }, ],
    3: [ { nome:"Fulmine", pwr:90 }, { nome:"Sprizzalampo", pwr:90 }, { nome:"Elettrotuffo", pwr:100 }, { nome:"Fulmiscatto", pwr:100 }, { nome:"Incrotuono", pwr:100 }, { nome:"Pugni Plasma", pwr:100 }, { nome:"Tempesta Tonante", pwr:100 }, { nome:"Ruota d’Aura", pwr:110 }, { nome:"Tuono", pwr:110 }, { nome:"Doppiolampo", pwr:120 }, { nome:"Elettrocannone", pwr:120 }, { nome:"Locomovolt", pwr:120 }, ]
  },
  erba: {
    1: [ { nome:"Fogliame", pwr:40 }, { nome:"Megassorbimento", pwr:40 }, { nome:"Ramostoccata", pwr:40 }, { nome:"Frustata", pwr:45 }, { nome:"Apripista", pwr:50 }, { nome:"Erboscivolata", pwr:55 }, { nome:"Foglielama", pwr:55 }, { nome:"Bomba Sciroppata", pwr:60 }, { nome:"Fogliamagica", pwr:60 }, { nome:"Pugnospine", pwr:60 }, ],
    2: [ { nome:"Vorticerba", pwr:65 }, { nome:"Prestigiafiore", pwr:70 }, { nome:"Tropicalcio", pwr:70 }, { nome:"Gigassorbimento", pwr:75 }, { nome:"Legnicorno", pwr:75 }, { nome:"Acido Malico", pwr:80 }, { nome:"Erbapatto", pwr:80 }, { nome:"Forza G", pwr:80 }, { nome:"Semebomba", pwr:80 }, { nome:"Spruzzatè", pwr:80 }, { nome:"Tamburattacco", pwr:80 }, ],
    3: [ { nome:"Energipalla", pwr:90 }, { nome:"Fendifoglia", pwr:90 }, { nome:"Fiortempesta", pwr:90 }, { nome:"Bombafrush", pwr:100 }, { nome:"Clava di Liane", pwr:100 }, { nome:"Infuriaseme", pwr:120 }, { nome:"Mazzuolegno", pwr:120 }, { nome:"Petalodanza", pwr:120 }, { nome:"Solarraggio", pwr:120 }, { nome:"Vigorcolpo", pwr:120 }, ]
  },
  ghiaccio: {
    1: [ { nome:"Geloscheggia", pwr:40 }, { nome:"Polneve", pwr:40 }, { nome:"Ventogelato", pwr:55 }, { nome:"Alitogelido", pwr:60 }, { nome:"Slavina", pwr:60 }, ],
    2: [ { nome:"Gelamondo", pwr:65 }, { nome:"Gelodenti", pwr:65 }, { nome:"Raggiaurora", pwr:65 }, { nome:"Liofilizzazione", pwr:70 }, { nome:"Gelopugno", pwr:75 }, { nome:"Vortighiaccio", pwr:80 }, { nome:"Scagliagelo", pwr:85 }, ],
    3: [ { nome:"Geloraggio", pwr:90 }, { nome:"Martelgelo", pwr:100 }, { nome:"Scricchiagelo", pwr:100 }, { nome:"Soffio d’Iceberg", pwr:100 }, { nome:"Bora", pwr:110 }, { nome:"Lancia Glaciale", pwr:120 }, ]
  },
  lotta: {
    1: [ { nome:"Crescipugno", pwr:40 }, { nome:"Pugnorapido", pwr:40 }, { nome:"Spaccaroccia", pwr:40 }, { nome:"Vuotonda", pwr:40 }, { nome:"Colpokarate", pwr:50 }, { nome:"Calciorullo", pwr:60 }, { nome:"Palmoforza", pwr:60 }, { nome:"Ribaltiro", pwr:60 }, { nome:"Tempestretta", pwr:60 }, { nome:"Vendetta", pwr:60 }, ],
    2: [ { nome:"Calciobasso", pwr:65 }, { nome:"Colpo di Mano", pwr:65 }, { nome:"Svegliopacca", pwr:70 }, { nome:"Vitaltiro", pwr:70 }, { nome:"Assorbipugno", pwr:75 }, { nome:"Breccia", pwr:75 }, { nome:"Schiacciacorpo", pwr:80 }, { nome:"Sferapulsar", pwr:80 }, { nome:"Sottomissione", pwr:80 }, { nome:"Spadamistica", pwr:85 }, { nome:"Stramontante", pwr:85 }, ],
    3: [ { nome:"Calcio Tonante", pwr:90 }, { nome:"Spadasolenne", pwr:90 }, { nome:"Triplodardo", pwr:90 }, { nome:"Calciosalto", pwr:100 }, { nome:"Dinamipugno", pwr:100 }, { nome:"Incrocolpo", pwr:100 }, { nome:"Martelpugno", pwr:100 }, { nome:"Schiacciatuffo", pwr:100 }, { nome:"Turborissa", pwr:100 }, { nome:"Turboschianto", pwr:100 }, { nome:"Calcio ad Ascia", pwr:120 }, { nome:"Focalcolpo", pwr:120 }, { nome:"Troppoforte", pwr:120 }, { nome:"Zuffa", pwr:120 }, ]
  },
  veleno: {
    1: [ { nome:"Acido", pwr:40 }, { nome:"Acidobomba", pwr:40 }, { nome:"Pulifumo", pwr:50 }, { nome:"Velenocoda", pwr:50 }, { nome:"Velenodenti", pwr:50 }, { nome:"Mille Fielespine", pwr:60 }, ],
    2: [ { nome:"Fango", pwr:65 }, { nome:"Velenoshock", pwr:65 }, { nome:"Velenocroce", pwr:70 }, { nome:"Artigli Fatali", pwr:80 }, { nome:"Velenpuntura", pwr:80 }, ],
    3: [ { nome:"Armaguscio", pwr:90 }, { nome:"Fangobomba", pwr:90 }, { nome:"Fangonda", pwr:95 }, { nome:"Intossicatena", pwr:100 }, { nome:"Turbotossina", pwr:100 }, { nome:"Rutto", pwr:120 }, { nome:"Sporcolancio", pwr:120 }, ]
  },
  terra: {
    1: [ { nome:"Ossomerang", pwr:50 }, { nome:"Colpodifango", pwr:55 }, { nome:"Battiterra", pwr:60 }, ],
    2: [ { nome:"Ossoclava", pwr:65 }, { nome:"Pantanobomba", pwr:65 }, { nome:"Sabbiardente", pwr:70 }, { nome:"Battipiedi", pwr:75 }, { nome:"Fossa", pwr:80 }, { nome:"Giravvita", pwr:80 }, ],
    3: [ { nome:"Forza Tellurica", pwr:90 }, { nome:"Geoforza", pwr:90 }, { nome:"Mille Frecce", pwr:90 }, { nome:"Mille Onde", pwr:90 }, { nome:"Forza Equina", pwr:95 }, { nome:"Tempesta Ardente", pwr:100 }, { nome:"Terremoto", pwr:100 }, { nome:"Scontro Frontale", pwr:120 }, { nome:"Spade Telluriche", pwr:120 }, ]
  },
  volante: {
    1: [ { nome:"Doppia Ala", pwr:40 }, { nome:"Raffica", pwr:40 }, { nome:"Acrobazia", pwr:55 }, { nome:"Aerasoio", pwr:60 }, { nome:"Aeroassalto", pwr:60 }, { nome:"Attacco d’Ala", pwr:60 }, { nome:"Cadutalibera", pwr:60 }, { nome:"Spennata", pwr:60 }, ],
    2: [ { nome:"Schiamazzo", pwr:65 }, { nome:"Eterelama", pwr:75 }, { nome:"Ali del Fato", pwr:80 }, { nome:"Perforbecco", pwr:80 }, { nome:"Rimbalzo", pwr:85 }, ],
    3: [ { nome:"Piombaflap", pwr:90 }, { nome:"Volo", pwr:90 }, { nome:"Aerocolpo", pwr:100 }, { nome:"Cannonbecco", pwr:100 }, { nome:"Tempesta Boreale", pwr:100 }, { nome:"Tifone", pwr:110 }, { nome:"Ascesa del Drago", pwr:120 }, { nome:"Baldeali", pwr:120 }, ]
  },
  psico: {
    1: [ { nome:"Doppioraggio", pwr:40 }, { nome:"Confusione", pwr:50 }, { nome:"Cuorestampo", pwr:60 }, ],
    2: [ { nome:"Psicoraggio", pwr:65 }, { nome:"Forza Mistica", pwr:70 }, { nome:"Psicotaglio", pwr:70 }, { nome:"Psicorumore", pwr:75 }, { nome:"Ali d’Aura", pwr:80 }, { nome:"Auraswoosh", pwr:80 }, { nome:"Cozzata Zen", pwr:80 }, { nome:"Extrasenso", pwr:80 }, { nome:"Forodimensionale", pwr:80 }, { nome:"Fotocollisione", pwr:80 }, { nome:"Inquietantesimo", pwr:80 }, { nome:"Psicolama", pwr:80 }, { nome:"Psicoshock", pwr:80 }, { nome:"Vastenergia", pwr:80 }, { nome:"Psicozanna", pwr:85 }, ],
    3: [ { nome:"Barrierassalto", pwr:90 }, { nome:"Psichico", pwr:90 }, { nome:"Sguardo Gelido", pwr:90 }, { nome:"Abbagliante", pwr:95 }, { nome:"Foschisfera", pwr:95 }, { nome:"Geyser Fotonico", pwr:100 }, { nome:"Mangiasogni", pwr:100 }, { nome:"Psicobotta", pwr:100 }, { nome:"Divinazione", pwr:120 }, { nome:"Sincrumore", pwr:120 }, ]
  },
  coleottero: {
    1: [ { nome:"Tagliofuria", pwr:40 }, { nome:"Balzo", pwr:50 }, { nome:"Entomoblocco", pwr:50 }, { nome:"Pungiglione", pwr:50 }, { nome:"Coleomorso", pwr:60 }, { nome:"Ventargenteo", pwr:60 }, ],
    2: [ { nome:"Rulloduro", pwr:65 }, { nome:"Retromarcia", pwr:70 }, { nome:"Strisciacolpo", pwr:70 }, { nome:"Segnoraggio", pwr:75 }, { nome:"Assalto", pwr:80 }, { nome:"Forbice X", pwr:80 }, { nome:"Sanguisuga", pwr:80 }, ],
    3: [ { nome:"Comandourto", pwr:90 }, { nome:"Ronzio", pwr:90 }, { nome:"Schermaglia", pwr:90 }, { nome:"Sferapolline", pwr:90 }, { nome:"Megacorno", pwr:120 }, ]
  },
  roccia: {
    1: [ { nome:"Rocciarapida", pwr:40 }, { nome:"Sotto Sale", pwr:40 }, { nome:"Abbattimento", pwr:50 }, { nome:"Sassata", pwr:50 }, { nome:"Forzantica", pwr:60 }, { nome:"Rocciotomba", pwr:60 }, ],
    2: [ { nome:"Rocciascure", pwr:65 }, { nome:"Frana", pwr:75 }, { nome:"Gemmoforza", pwr:80 }, ],
    3: [ { nome:"Taglio Poderoso", pwr:95 }, { nome:"Diamantempesta", pwr:100 }, { nome:"Pietrataglio", pwr:100 }, { nome:"Raggiometeora", pwr:120 }, ]
  },
  spettro: {
    1: [ { nome:"Furtivombra", pwr:40 }, { nome:"Omaggio ai KO", pwr:50 }, { nome:"Pugno Furibondo", pwr:50 }, { nome:"Corteo Spettrale", pwr:60 }, { nome:"Funestovento", pwr:60 }, { nome:"Pugnodombra", pwr:60 }, ],
    2: [ { nome:"Sciagura", pwr:65 }, { nome:"Ombrartigli", pwr:70 }, { nome:"Livore", pwr:75 }, { nome:"Cucitura d’Ombra", pwr:80 }, { nome:"Palla Ombra", pwr:80 }, { nome:"Ossotetro", pwr:85 }, ],
    3: [ { nome:"Ombrafurto", pwr:90 }, { nome:"Spettrotuffo", pwr:90 }, { nome:"Raggio d’Ombra", pwr:100 }, { nome:"Poltergeist", pwr:110 }, { nome:"Oscurotuffo", pwr:120 }, { nome:"Schegge Astrali", pwr:120 }, ]
  },
  drago: {
    1: [ { nome:"Doppiocolpo", pwr:40 }, { nome:"Tornado", pwr:40 }, { nome:"Dragofrecce", pwr:50 }, { nome:"Codadrago", pwr:60 }, { nome:"Dragospiro", pwr:60 }, { nome:"Vastoimpatto", pwr:60 }, ],
    2: [ { nome:"Alta Cucina", pwr:80 }, { nome:"Dragartigli", pwr:80 }, { nome:"Irregolaser", pwr:80 }, { nome:"Dragopulsar", pwr:85 }, ],
    3: [ { nome:"Marteldrago", pwr:90 }, { nome:"Cannone Dynamax", pwr:100 }, { nome:"Dragofuria", pwr:100 }, { nome:"Fendispazio", pwr:100 }, { nome:"Nucleocastigo", pwr:100 }, { nome:"Tabula Laser", pwr:100 }, { nome:"Clamorsquame", pwr:110 }, { nome:"Oltraggio", pwr:120 }, { nome:"Spadoncarica", pwr:120 }, ]
  },
  buio: {
    1: [ { nome:"Inseguimento", pwr:40 }, { nome:"Rivincita", pwr:50 }, { nome:"Urlorabbia", pwr:55 }, { nome:"Finta", pwr:60 }, { nome:"Furto", pwr:60 }, { nome:"Garanzia", pwr:60 }, { nome:"Morso", pwr:60 }, { nome:"Vorticolpo", pwr:60 }, ],
    2: [ { nome:"Lama Milleflutti", pwr:65 }, { nome:"Privazione", pwr:65 }, { nome:"Nottesferza", pwr:70 }, { nome:"Sbigoattacco", pwr:70 }, { nome:"Pugnotenebra", pwr:75 }, { nome:"Sfogarabbia", pwr:75 }, { nome:"Colpo Infernale", pwr:80 }, { nome:"Morsostretto", pwr:80 }, { nome:"Neropulsar", pwr:80 }, { nome:"Sgranocchio", pwr:80 }, { nome:"Supplicolpo", pwr:80 }, { nome:"Turbotenebra", pwr:80 }, { nome:"Zona Buiabuia", pwr:80 }, { nome:"Braccioteso", pwr:85 }, { nome:"Genufendente", pwr:85 }, { nome:"Urtoscuro", pwr:85 }, ],
    3: [ { nome:"Furia Ardente", pwr:90 }, { nome:"Ripicca", pwr:95 }, { nome:"Urtodimensionale", pwr:100 }, ]
  },
  acciaio: {
    1: [ { nome:"Pugnoscarica", pwr:40 }, { nome:"Ferrartigli", pwr:50 }, { nome:"Ingracolpo", pwr:50 }, { nome:"Tachiontaglio", pwr:50 }, { nome:"Bombagnete", pwr:60 }, { nome:"Pugni Corazzati", pwr:60 }, ],
    2: [ { nome:"Cristalcolpo", pwr:65 }, { nome:"Alacciaio", pwr:70 }, { nome:"Sottilcorno", pwr:70 }, { nome:"Cannonflash", pwr:80 }, { nome:"Colpo d’Ancora", pwr:80 }, { nome:"Metaltestata", pwr:80 }, ],
    3: [ { nome:"Meteorpugno", pwr:90 }, { nome:"Astrocarica", pwr:100 }, { nome:"Codacciaio", pwr:100 }, { nome:"Colpo Maestoso", pwr:100 }, { nome:"Slittaruote", pwr:100 }, { nome:"Taglio Maestoso", pwr:100 }, { nome:"Corsa all’Oro", pwr:120 }, ]
  },
  folletto: {
    1: [ { nome:"Incantavoce", pwr:40 }, { nome:"Vento di Fata", pwr:40 }, { nome:"Assorbibacio", pwr:50 }, ],
    2: [ { nome:"Frantumanima", pwr:75 }, { nome:"Ammaliavoce", pwr:80 }, { nome:"Magibrillio", pwr:80 }, ],
    3: [ { nome:"Carineria", pwr:90 }, { nome:"Vapore Incantato", pwr:90 }, { nome:"Forza Lunare", pwr:95 }, { nome:"Nebbioscoppio", pwr:100 }, { nome:"Tempesta Zefirea", pwr:100 }, { nome:"Turboincanto", pwr:100 }, { nome:"Sbrilluccibufera", pwr:120 }, ]
  },
};
// EXPORT CORRETTI
window.SKILL_DB = SKILL_DB;
window.MOSSE_DB = SKILL_DB;
window.PokeMisteryRL_SKILL_DB = SKILL_DB;
