/*
============================================================
 PokeMisteryRL — DB_ITEMS
 Versione: 1.0
 ------------------------------------------------------------
 DATABASE PURO DEGLI OGGETTI.

 Questo file contiene SOLO i dati degli oggetti.
 La logica degli effetti è gestita da:
 ITEM_SYSTEM_REGION_GITHUB.js

 Struttura:
 {
   id,
   nome,
   effetto,
   rarita,
   tipo,
   ...campi tecnici opzionali
 }
============================================================
*/

window.PokeMisteryRL_Items = window.PokeMisteryRL_Items || {};

window.PokeMisteryRL_Items.DB_ITEMS = {

  /* ==========================================================
     01. OGGETTI SPECIALI
     ========================================================== */

  bitorzolello: {
    id: "bitorzolello",
    nome: "Bitorzolello (Rocky Helmet)",
    effetto: "ON HIT RECEIVED → ENEMY HP −16.67%.",
    rarita: null,
    tipo: "reazione"
  },

  avanzi: {
    id: "avanzi",
    nome: "Avanzi (Leftovers)",
    effetto: "END TURN → HP +X%.",
    rarita: null,
    tipo: "cura"
  },

  evolcondensa: {
    id: "evolcondensa",
    nome: "Evolcondensa (Eviolite)",
    effetto: "DEF ×1.50; ATK ×0.80.",
    rarita: null,
    tipo: "statistica"
  },

  vulneropolizza: {
    id: "vulneropolizza",
    nome: "Vulneropolizza (Weakness Policy)",
    effetto: "S2 SUPER-EFFECTIVE HIT → S1 ATK +X% FOR NEXT TURN.",
    rarita: null,
    tipo: "sinergia"
  },

  palla_fumo: {
    id: "palla_fumo",
    nome: "Palla Fumo (Smoke Ball)",
    effetto: "HP <20% → DODGE 1 HIT/TURN WITH X% CHANCE.",
    rarita: null,
    tipo: "evasione"
  },

  assorbisfera: {
    id: "assorbisfera",
    nome: "Assorbisfera (Life Orb)",
    effetto: "ATK ×1.30; ON ATTACK → HP −X%.",
    rarita: null,
    tipo: "potenziamento"
  },


  /* ==========================================================
     02. POTENZIATORI DI TIPO
     ========================================================== */

  carbonella: {
    id: "carbonella",
    nome: "Carbonella",
    effetto: "DMG [FIRE] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "fuoco",
    bonus_danno: 0.20
  },

  acqua_magica: {
    id: "acqua_magica",
    nome: "Acqua Magica",
    effetto: "DMG [WATER] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "acqua",
    bonus_danno: 0.20
  },

  miracolseme: {
    id: "miracolseme",
    nome: "Miracolseme",
    effetto: "DMG [GRASS] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "erba",
    bonus_danno: 0.20
  },

  magnete: {
    id: "magnete",
    nome: "Magnete",
    effetto: "DMG [ELECTRIC] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "elettro",
    bonus_danno: 0.20
  },

  gelomai: {
    id: "gelomai",
    nome: "Gelomai",
    effetto: "DMG [ICE] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "ghiaccio",
    bonus_danno: 0.20
  },

  soffice_sabbia: {
    id: "soffice_sabbia",
    nome: "Soffice Sabbia",
    effetto: "DMG [GROUND] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "terra",
    bonus_danno: 0.20
  },

  cinturANera: {
    id: "cinturanera",
    nome: "Cinturanera",
    effetto: "DMG [FIGHTING] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "lotta",
    bonus_danno: 0.20
  },

  beccaffilato: {
    id: "beccaffilato",
    nome: "Beccaffilato",
    effetto: "DMG [FLYING] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "volante",
    bonus_danno: 0.20
  },

  cucchiaiorto: {
    id: "cucchiaiorto",
    nome: "Cucchiaiorto",
    effetto: "DMG [PSYCHIC] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "psico",
    bonus_danno: 0.20
  },

  argentovivo: {
    id: "argentovivo",
    nome: "Argentovivo",
    effetto: "DMG [BUG] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "coleottero",
    bonus_danno: 0.20
  },

  pietradura: {
    id: "pietradura",
    nome: "Pietradura",
    effetto: "DMG [ROCK] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "roccia",
    bonus_danno: 0.20
  },

  spettrotarga: {
    id: "spettrotarga",
    nome: "Spettrotarga",
    effetto: "DMG [GHOST] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "spettro",
    bonus_danno: 0.20
  },

  dente_di_drago: {
    id: "dente_di_drago",
    nome: "Dente di Drago",
    effetto: "DMG [DRAGON] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "drago",
    bonus_danno: 0.20
  },

  occhialineri: {
    id: "occhialineri",
    nome: "Occhialineri",
    effetto: "DMG [DARK] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "buio",
    bonus_danno: 0.20
  },

  metalcoperta: {
    id: "metalcoperta",
    nome: "Metalcoperta",
    effetto: "DMG [STEEL] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "acciaio",
    bonus_danno: 0.20
  },

  velenaculeo: {
    id: "velenoCuleo",
    nome: "Velenaculeo",
    effetto: "DMG [POISON] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "veleno",
    bonus_danno: 0.20
  },

  fiocco_rosa: {
    id: "fiocco_rosa",
    nome: "Fiocco Rosa",
    effetto: "DMG [FAIRY] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "folletto",
    bonus_danno: 0.20
  },

  sciarpaseta: {
    id: "sciarpaseta",
    nome: "Sciarpaseta",
    effetto: "DMG [NORMAL] ×1.20.",
    rarita: null,
    tipo: "potenziamento_tipo",
    tipo_mossa: "normale",
    bonus_danno: 0.20
  },


  /* ==========================================================
     03. OGGETTI DI CURA / UTILITÀ
     ========================================================== */

  pozione: {
    id: "pozione",
    nome: "Pozione",
    effetto: "ACTIVE HP +20.",
    rarita: "comune",
    tipo: "cura"
  },

  super_pozione: {
    id: "super_pozione",
    nome: "Super Pozione",
    effetto: "ACTIVE HP +50.",
    rarita: "non_comune",
    tipo: "cura"
  },

  iper_pozione: {
    id: "iper_pozione",
    nome: "Iper Pozione",
    effetto: "ACTIVE HP +100.",
    rarita: "rara",
    tipo: "cura"
  },

  rivitalizzante: {
    id: "rivitalizzante",
    nome: "Rivitalizzante",
    effetto: "FAINTED ALLY → REVIVE WITH HP VALUE DEFINED BY EFFECT.",
    rarita: "epica",
    tipo: "cura"
  },

  caramella_rara: {
    id: "caramella_rara",
    nome: "Caramella Rara",
    effetto: "SELECTED POKÉMON LV +1.",
    rarita: "rara",
    tipo: "crescita"
  },

  amuleto: {
    id: "amuleto",
    nome: "Amuleto",
    effetto: "RUN BONUS +X, AS DEFINED BY EFFECT.",
    rarita: "epica",
    tipo: "bonus"
  },

  uovo_pokemon: {
    id: "uovo_pokemon",
    nome: "Uovo Pokémon",
    effetto: "CONTAINS 1 POKÉMON; HATCHING HANDLED BY EGG SYSTEM.",
    rarita: "rara",
    tipo: "uovo"
  }

};


/* ============================================================
   API MINIMA DEL DATABASE
   ============================================================ */

window.PokeMisteryRL_Items.get = function(itemId){
  if(!itemId) return null;

  var key =
    String(itemId)
      .trim()
      .toLowerCase();

  return (
    window.PokeMisteryRL_Items.DB_ITEMS[key] ||
    null
  );
};

window.PokeMisteryRL_Items.getAll = function(){
  return Object.values(
    window.PokeMisteryRL_Items.DB_ITEMS
  );
};

window.PokeMisteryRL_Items.getByRarity = function(rarita){
  var rarity =
    String(rarita || "")
      .trim()
      .toLowerCase();

  return window.PokeMisteryRL_Items
    .getAll()
    .filter(function(item){
      return String(item.rarita || "")
        .toLowerCase() === rarity;
    });
};

window.PokeMisteryRL_Items.getByType = function(tipo){
  var type =
    String(tipo || "")
      .trim()
      .toLowerCase();

  return window.PokeMisteryRL_Items
    .getAll()
    .filter(function(item){
      return String(item.tipo || "")
        .toLowerCase() === type;
    });
};


/* ============================================================
   COMPATIBILITÀ
   ============================================================ */

window.DB_ITEMS =
  window.PokeMisteryRL_Items.DB_ITEMS;

console.log(
  "✅ DB_ITEMS caricato:",
  Object.keys(window.DB_ITEMS).length,
  "oggetti"
);
