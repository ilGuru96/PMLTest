/* ============================================================
   PokeMisteryRL - CORE v8.1 MODULAR
   Puoi collassare ogni #region e/o spostarla in un file separato
   ============================================================ */

const PokeMisteryRL = {};
window.PokeMisteryRL = PokeMisteryRL;
// #region 01 - CONFIGURAZIONE + GLOBALI
PokeMisteryRL.Config = (() => {
  const SPRITE_BASE_URL = "https://cdn.jsdelivr.net/gh/ilGuru96/spritemon/";
  return { SPRITE_BASE_URL };
})();

// Stato globale condiviso
let PKM_RUN = null;
let busy = 0;
let timer = 0;
let mapResizeObserver = null;
let evoPromptShownFloor = -1;
const { SPRITE_BASE_URL } = PokeMisteryRL.Config;
// #endregion
// #region 02 - HELPER GENERALI
PokeMisteryRL.Helpers = (() => {
  const $ = id => document.getElementById(id);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const rand = arr => Array.isArray(arr) && arr.length? arr[Math.floor(Math.random() * arr.length)] : null;

  const sprite = (image) => {
    if (!image) return SPRITE_BASE_URL + "eevee.png";
    const v = String(image).trim();
    if (v.startsWith("http") || v.startsWith("data:")) return v;
    return SPRITE_BASE_URL + v;
  };
  const fmt = (n) => {
    n = Math.floor(Number(n) || 0);
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7? 0 : 1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4? 0 : 1) + "K";
    return n.toString();
  };
  const fmtIV = (v) =>!v? "" : v > 0? `+${v}` : `${v}`;
  const msg = (text) => {
    const el = $("eventLog");
    if (el) {
      el.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(() => el.textContent = "", 2000);
    }

    const logEl = $("runLogContent");
    if (logEl && text) {
      const line = document.createElement("div");
      line.className = "run-log-line";
      line.textContent = text;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
    }
  };
const modal = (html) => {
  const content = $("modalContent"), box = $("modal");
  if (!content || !box) return;
  content.innerHTML = html;
  box.classList.remove("hidden");
};

const closeModal = () => $("modal")?.classList.add("hidden");

document.addEventListener("click", (e) => {
  const box = $("modal");

  if (!box || box.classList.contains("hidden")) return;

  if (e.target === box) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});

const log = (text, cls = "") => {
  const el = $("blog");
  if (el) {
    el.innerHTML += `<div class="log-line ${cls}">${text}</div>`;
    el.scrollTop = el.scrollHeight;
  }

  const runLog = $("runLogContent");
  if (runLog && text) {
    const line = document.createElement("div");
    line.className = "run-log-line";
    line.textContent = String(text).replace(/<[^>]*>/g, "");
    runLog.appendChild(line);
    runLog.scrollTop = runLog.scrollHeight;
  }
};
  const ensureBoxStructure = () => {
    const gameBox = $("gameBox"), bottom = $("bottomContainer"), mapWrap = document.querySelector(".map-wrap");
    if (gameBox && bottom && mapWrap &&!gameBox.contains(bottom)) gameBox.appendChild(bottom);
  };
  return { $, clamp, rand, sprite, fmt, fmtIV, msg, modal, closeModal, log, ensureBoxStructure };
})();

const { $, clamp, rand, sprite, fmt, fmtIV, msg, modal, closeModal, log } = PokeMisteryRL.Helpers;
let runLogOpen = false;
const toggleRunLog = () => {
  runLogOpen = !runLogOpen;
  const content = $("runLogContent");
  const arrow = $("runLogArrow");
  if(content) content.style.display = runLogOpen ? "block" : "none";
  if(arrow) arrow.textContent = runLogOpen ? "▲" : "▼";
};

// #endregion
// #region 03 - TIPOLOGIE
PokeMisteryRL.Types = (() => {
  const TYPE_CHART = {
    normale:{}, fuoco:{erba:2,ghiaccio:2,coleottero:2,acciaio:2,fuoco:.5,acqua:.5,roccia:.5,drago:.5},
    acqua:{fuoco:2,terra:2,roccia:2,acqua:.5,erba:.5,drago:.5},
    erba:{acqua:2,terra:2,roccia:2,fuoco:.5,erba:.5,veleno:.5,volante:.5,coleottero:.5,drago:.5,acciaio:.5},
    elettro:{acqua:2,volante:2,erba:.5,elettro:.5,drago:.5,terra:0},
    ghiaccio:{erba:2,terra:2,volante:2,drago:2,fuoco:.5,acqua:.5,ghiaccio:.5,acciaio:.5},
    lotta:{normale:2,ghiaccio:2,roccia:2,buio:2,acciaio:2,veleno:.5,volante:.5,psico:.5,coleottero:.5,folletto:.5,spettro:0},
    veleno:{erba:2,folletto:2,veleno:.5,terra:.5,roccia:.5,spettro:.5,acciaio:0},
    terra:{fuoco:2,elettro:2,veleno:2,roccia:2,acciaio:2,erba:.5,coleottero:.5,volante:0},
    volante:{erba:2,lotta:2,coleottero:2,elettro:.5,roccia:.5,acciaio:.5},
    psico:{lotta:2,veleno:2,psico:.5,acciaio:.5,buio:0},
    coleottero:{erba:2,psico:2,buio:2,fuoco:.5,lotta:.5,volante:.5,spettro:.5,acciaio:.5,folletto:.5},
    roccia:{fuoco:2,ghiaccio:2,volante:2,coleottero:2,lotta:.5,terra:.5,acciaio:.5},
    spettro:{psico:2,spettro:2,buio:.5,normale:0},
    drago:{drago:2,acciaio:.5,folletto:0},
    buio:{psico:2,spettro:2,lotta:.5,buio:.5,folletto:.5},
    acciaio:{ghiaccio:2,roccia:2,folletto:2,fuoco:.5,acqua:.5,elettro:.5,acciaio:.5},
    folletto:{lotta:2,drago:2,buio:2,fuoco:.5,veleno:.5,acciaio:.5}
  };
  const getPokemonTypes = (p) =>!p? [] : Array.isArray(p.tipi)? p.tipi.map(t=>String(t).trim().toLowerCase()).filter(Boolean) : [];
  const getTypeMultiplier = (atkType, defTypes) => {
    if (!atkType ||!Array.isArray(defTypes)) return 1;
    const chart = TYPE_CHART[String(atkType).trim().toLowerCase()];
    if (!chart) return 1;
    return defTypes.reduce((m, t) => m * (chart[String(t).trim().toLowerCase()]?? 1), 1);
  };
  const getMultLabel = (m) => m===0? "INEFFICACE" : m>=2? "SUPEREFFICACE" : m<=0.5? "POCO EFFICACE" : "";
  const getTypingBadge = (type) => {
    const key = String(type||"").trim().toLowerCase(); if(!key) return "";
    const colors = {normale:"#d2d2bdff",fuoco:"#F08030",acqua:"#6890F0",erba:"#78C850",elettro:"#F8D030",ghiaccio:"#98D8D8",lotta:"#C03028",veleno:"#A040A0",terra:"#E0C068",volante:"#A890F0",psico:"#F85888",coleottero:"#A8B820",roccia:"#B8A038",spettro:"#705898",drago:"#7038F8",buio:"#705848",acciaio:"#B8B8D0",folletto:"#EE99AC"};
    return `<span class="type-badge type-${key}" style="background:${colors[key]||"#555"}">${key.toUpperCase()}</span>`;
  };
  return { TYPE_CHART, getPokemonTypes, getTypeMultiplier, getMultLabel, getTypingBadge };
})();
const { getPokemonTypes, getTypeMultiplier, getMultLabel, getTypingBadge } = PokeMisteryRL.Types;
// #endregion
// #region 04 - DATABASE POKEMON - LOADER FIX PER DB_PKM SENZA.js
PokeMisteryRL.Database = (() => {
  const PKM_DB = {};

  function normalizePokemonDatabase() {
    const source = window.PKM_ALL || window.DB_PKM || {};
    const flat = {};
    const addOne = (key, data) => {
      if (!data ||!data.id) return;
      flat[data.id] = {
        id: Number(data.id),
        nome: data.nome || data.name || key,
        immagine: sprite(data.immagine || data.image || (data.nome || "").toLowerCase() + ".png"),
        tipi: (data.tipi && data.tipi.length? data.tipi : data.types || []).map(t => String(t).toLowerCase()),
        stage: Number(data.stage || 1),
        bst: Number(data.bst || 300),
        evoluzione: data.evoluzione || data.evolution || null
      };
    };
    // se è { kanto: {1:{}} }
    if (source.kanto) {
      Object.entries(source.kanto).forEach(([k,v])=> addOne(k,v));
      if (source.johto) Object.entries(source.johto).forEach(([k,v])=> addOne(k,v));
    } else {
      Object.entries(source).forEach(([k,v])=> { if(v && v.id) addOne(k,v); });
    }
    return flat;
  }

  const buildPokemonDB = () => {
    Object.keys(PKM_DB).forEach(k => delete PKM_DB[k]);
    Object.assign(PKM_DB, normalizePokemonDatabase());
    console.log("PKM_DB:", Object.keys(PKM_DB).length + " Pokémon caricati");
    return PKM_DB;
  };

  const getPokemon = (id) => PKM_DB[Number(id)] || null;
  const getPokemonId = (value) => { var id=Number(value); return PKM_DB[id]? id : null; };

  // AUTO-LOAD DAL CDN - FIX PER NOME FILE SENZA.js
  async function loadRemoteDB() {
    if (Object.keys(window.PKM_ALL || {}).length > 10) { buildPokemonDB(); return; }
    try {
      var urls = [
        "https://cdn.jsdelivr.net/gh/ilGuru96/PokeMisteryLike@main/DB_PKM",
        "https://raw.githubusercontent.com/ilGuru96/PokeMisteryLike/main/DB_PKM"
      ];
      for (var u of urls) {
        var res = await fetch(u + "?t=" + Date.now());
        if (!res.ok) continue;
        var txt = await res.text();
        // il file è JS che definisce const PKM_ALL =...
        // lo eseguiamo in window
        var fn = new Function(txt + "\n; return typeof PKM_ALL!== 'undefined'? PKM_ALL : (typeof DB_PKM!== 'undefined'? DB_PKM : null);");
        var data = fn();
        if (data) {
          window.PKM_ALL = data.kanto? data.kanto : data;
          if (data.kanto && data.johto) window.PKM_ALL = {...data.kanto,...data.johto};
          buildPokemonDB();
          console.log("DB remoto caricato da", u);
          if (typeof buildStarterPool === 'function') buildStarterPool();
          if (window.PKM_RUN && window.PKM_RUN.team && window.PKM_RUN.team.length === 0) {
             if (typeof initGame === 'function') initGame();
          }
          if (typeof renderMenu === 'function') renderMenu();
          if (typeof render === 'function') render();

          return;
        }
      }
    } catch(e) { console.error("DB load fallito", e); }
  }

  loadRemoteDB();

  return { PKM_DB, buildPokemonDB, getPokemon, getPokemonId, loadRemoteDB };
})();

const { PKM_DB, buildPokemonDB, getPokemon, getPokemonId } = PokeMisteryRL.Database;
// #endregion
// #region 05 - STATISTICHE / ISTANZE
  PokeMisteryRL.Stats = (() => {
  const getStatsFromBST = (bst, stage=1) => {
    bst = Math.max(1, Number(bst)||1);
    const factor = stage===1?0.92:stage===2?1:stage===3?1.05:1.08;
    const total = bst * factor;
    return { hp:Math.max(1,Math.floor(total*0.30)), atk:Math.max(1,Math.floor(total*0.18)), satk:Math.max(1,Math.floor(total*0.18)), dif:Math.max(1,Math.floor(total*0.19)), spd:Math.max(1,Math.floor(total*0.15)) };
  };
  const rollPokemonStats = () => ({ atk:Math.floor(Math.random()*7)-3, satk:Math.floor(Math.random()*7)-3, dif:Math.floor(Math.random()*7)-3, spd:Math.floor(Math.random()*7)-3 });
  const createPokemonInstance = (id) => {
    const base = getPokemon(id); if(!base) return null;
    const stats = getStatsFromBST(base.bst, base.stage); const rolls = rollPokemonStats();
    const finalStats = { hp:stats.hp, atk:Math.max(1,stats.atk+rolls.atk), satk:Math.max(1,stats.satk+rolls.satk), dif:Math.max(1,stats.dif+rolls.dif), spd:Math.max(1,stats.spd+rolls.spd) };
    const pokemon = {
      id:base.id,
      nome:base.nome,
      immagine:base.immagine,
      tipi:[...base.tipi],
      stage:base.stage,
      bst:base.bst,
      stats:finalStats,
      rolls,
      crit:0,
      stun:0,
      eva:0,
      level:1,
      sk:1,
      fame:100,
      hp:finalStats.hp,
      maxHp:finalStats.hp
    };

    // Il SkillSystem viene definito più avanti nel file, ma questa
    // funzione viene eseguita solo dopo il caricamento completo del JS.
    if (
      typeof PokeMisteryRL_SkillSystem !== "undefined" &&
      typeof PokeMisteryRL_SkillSystem.assignSkills === "function"
    ) {
      PokeMisteryRL_SkillSystem.assignSkills(pokemon);
    }

    return pokemon;
  };
  const getActivePokemon = () => PKM_RUN?.activePokemon || null;
  const getFinalStats = () => { const p=getActivePokemon(); return p? {...p.stats} : {hp:0,atk:0,satk:0,dif:0,spd:0}; };
  const getD = () => { const p=getActivePokemon(); if(!p) return {nome:"-",immagine:"",typing:"Normale",stage:1}; return {nome:p.nome, immagine:p.immagine, typing:p.tipi.join("/"), stage:p.stage}; };
  return { getStatsFromBST, createPokemonInstance, getActivePokemon, getFinalStats, getD };
})();
const { getStatsFromBST, createPokemonInstance, getActivePokemon, getFinalStats, getD } = PokeMisteryRL.Stats;
// #endregion
// #region 06 - LEVEL SYSTEM - AUTONOMO - FINAL

;

// #endregion
// #region 07 - STATO RUN
PokeMisteryRL.Run = (() => {
const createRunState = (starter) => ({
    mode:"torre",
    activePokemon:starter, // STARTER1 FISSO - NON SI TOCCA MAI
    secondActive: null, // STARTER2 - quello che combatte e si cambia
    originPokemon:starter.id,
    level:starter.level, sk:starter.sk,
    floor:1, row:0, col:0, hp:starter.hp, maxHp:starter.maxHp, fame:starter.fame, bits:200,
    teamSlots:[null,null,null], map:[], battle:null, dead:false,
    inventory:[], eggs:[], incubator:{active:false, steps:0, total:0},
    effects:{ enemyBuff:1, nextEnemyDebuff:1, bossDebuff:1, mirror:false, swapStats:false }
  });
  const buildRunSkeleton = () => {
    clearTimeout(timer);
    if(mapResizeObserver){ mapResizeObserver.disconnect(); mapResizeObserver=null; }
    PKM_RUN=null; busy=0; evoPromptShownFloor=-1;
    $("modal")?.classList.add("hidden");
    if($("eventLog")) $("eventLog").textContent="";
    if($("mapSvg")) $("mapSvg").innerHTML="";
    if($("map")) $("map").innerHTML="";
    if($("bottomContainer")) $("bottomContainer").innerHTML = PokeMisteryRL.UI.buildBottomPanelTemplate();
  };
  const startPokemon = (pokemonId=null, modeName="torre") => {
    buildRunSkeleton(); buildPokemonDB();
    const available = Object.values(PKM_DB);
    if(!available.length){ console.error("PKM_ALL vuoto"); return; }
    const selectedId = getPokemonId(pokemonId)?? rand(available)?.id;
    const starter = createPokemonInstance(selectedId); if(!starter) return;
    starter.level = 5;
    starter.sk = Math.max(1, Number(starter.sk) || 1);
    PKM_RUN = createRunState(starter); PKM_RUN.mode = modeName;
    $("menu")?.classList.add("hidden"); $("game")?.classList.remove("hidden");
    PokeMisteryRL.Map.buildMap(); PokeMisteryRL.UI.render();
    const rolls = Object.entries(starter.rolls).filter(([,v])=>v!==0).map(([k,v])=>`${k.toUpperCase()} ${fmtIV(v)}`).join(" ");
    msg(`${starter.nome} pronto! ${rolls}`);
  };
  const quickReset = () => { if(busy) return; startPokemon(PKM_RUN?.originPokemon, PKM_RUN?.mode||"torre"); };
  const goMenu = () => { clearTimeout(timer); if(PKM_RUN?.battle) PKM_RUN.battle=null; $("modal")?.classList.add("hidden"); $("game")?.classList.add("hidden"); $("menu")?.classList.remove("hidden"); };
  return { createRunState, buildRunSkeleton, startPokemon, quickReset, goMenu };
})();
// #endregion
// #region 08 - TEAM | 09 - CATTURA | 10 - EVOLUZIONI

;



PokeMisteryRL.TeamRoster = (() => {

  const getFreeSlot = () =>
    !PKM_RUN?.teamSlots
      ? -1
      : PKM_RUN.teamSlots.findIndex(s => !s);

  const renderTeamSlots = () => {
    if(!PKM_RUN?.teamSlots) return;

    PKM_RUN.teamSlots.forEach((p, i) => {
      const el = $(`teamSlot${i}`);
      if(!el) return;

      if(!p){
        el.innerHTML = "+";
        el.classList.remove("filled");
        return;
      }

      el.classList.add("filled");
      el.innerHTML = `<img src="${sprite(p.immagine)}">`;
    });

    const s2 = $("starter2Slot");
    if(s2){
      const p2 = PKM_RUN.secondActive;
      if(!p2){
        s2.innerHTML = "+ S2";
        s2.classList.remove("filled");
      }else{
        s2.innerHTML = `<img src="${sprite(p2.immagine)}">`;
        s2.classList.add("filled");
      }
    }
  };

  const swapToActive = () => {
    msg("Starter1 fisso! Usa S2");
  };

  const equipAsSecond = (i) => {

    if(!PKM_RUN){
      return false;
    }

    const index =
      Number(i);

    if(
      !Number.isInteger(index) ||
      index < 0
    ){
      return false;
    }

    const team =
      PKM_RUN.teamSlots || [];

    const selected =
      team[index];

    if(!selected){
      return false;
    }

    const oldS2 =
      PKM_RUN.secondActive || null;

    /*
     * Cambio diretto:
     * riserva[index] <-> S2.
     */
    PKM_RUN.secondActive =
      selected;

    team[index] =
      oldS2;

    PKM_RUN.teamSlots =
      team;

    renderTeamSlots();
    PokeMisteryRL.UI.refreshBottomPanel();

    /*
     * Dopo la selezione chiudi automaticamente la schermata S2.
     * Non aprire anteprime o statistiche.
     */
    if(typeof closeTeamPreview === "function"){
      closeTeamPreview();
    }else if(typeof closePokeInfo === "function"){
      closePokeInfo();
    }else if(typeof closeModal === "function"){
      closeModal();
    }

    busy = 0;

    /*
     * NON aprire:
     * - openTeamPreview
     * - openPokeInfo
     * - openSecondPreview
     *
     * Il click serve solo a selezionare il nuovo S2.
     */
    return true;
  };


const unequipSecond = () => {
    if(!PKM_RUN?.secondActive) return;

    const slot = getFreeSlot();
    if(slot < 0){
      msg("Squadra piena");
      return;
    }

    PKM_RUN.teamSlots[slot] = PKM_RUN.secondActive;
    PKM_RUN.secondActive = null;
    closeTeamPreview();
    render();
  };

  const releaseSecond = () => {
    if(!PKM_RUN) return;
    PKM_RUN.secondActive = null;
    closeTeamPreview();
    render();
  };

  const releasePoke = (i) => {
    if(!PKM_RUN?.teamSlots) return;
    PKM_RUN.teamSlots[i] = null;
    closeTeamPreview();
    renderTeamSlots();
    PokeMisteryRL.UI.refreshBottomPanel();
  };

  // Prepara il Pokémon sconfitto per il reclutamento.
  // La cattura è sempre al 100%: l'unica scelta del giocatore è ACCETTARE o RIFIUTARE.
  const captureDefeatedPokemon = (enemy) =>
    prepareRecruitment(enemy);

  const prepareRecruitment = (
    enemy
  ) => {

    if(!enemy || !PKM_RUN){
      return null;
    }

    /*
     * Crea una nuova istanza solo per mantenere i dati strutturali
     * del Pokémon (id, sprite, typing, ecc.).
     */
    const captured =
      createPokemonInstance(enemy.id);

    if(!captured){
      return null;
    }

    /*
     * LIVELLO:
     * usa il livello reale dell'incontro, non quello dello starter
     * e non un valore calcolato dopo la vittoria.
     */
    const encounterLevel =
      Math.max(
        1,
        Number(enemy.level) ||
        Number(PKM_RUN.floor) + 2
      );

    captured.level =
      encounterLevel;

    /*
     * STATISTICHE:
     * il reclutato eredita quelle effettivamente usate nel fight.
     */
    if(enemy.stats){

      captured.stats = {
        hp: Number(enemy.stats.hp) || 1,
        atk: Number(enemy.stats.atk) || 1,
        satk: Number(enemy.stats.satk) || 1,
        dif: Number(enemy.stats.dif) || 1,
        spd: Number(enemy.stats.spd) || 1
      };

      captured.maxHp =
        Number(enemy.maxHp) ||
        captured.stats.hp ||
        1;

      captured.hp =
        captured.maxHp;
    }

    captured.id =
      enemy.id;

    captured.nome =
      enemy.nome;

    captured.immagine =
      enemy.immagine;

    captured.tipi =
      [...(enemy.tipi || captured.tipi || [])];

    captured.stage =
      enemy.stage ??
      captured.stage;

    captured.bst =
      enemy.bst ??
      captured.bst;

    return captured;
  };

  // Inserisce il nuovo Pokémon nella prima posizione disponibile.
  // Ordine: 3 slot riserva -> S2 se ancora libero.

  const replacePokemon = (
    target,
    pokemon
  ) => {

    if(!PKM_RUN || !pokemon){
      return false;
    }

    if(target === "s2"){

      if(!PKM_RUN.secondActive){
        return false;
      }

      PKM_RUN.secondActive = pokemon;

      renderTeamSlots();
      PokeMisteryRL.UI.refreshBottomPanel();

      return true;
    }

    const index =
      Number(target);

    if(
      !Number.isInteger(index) ||
      index < 0 ||
      index >= 3
    ){
      return false;
    }

    if(!PKM_RUN.teamSlots?.[index]){
      return false;
    }

    PKM_RUN.teamSlots[index] = pokemon;

    renderTeamSlots();
    PokeMisteryRL.UI.refreshBottomPanel();

    return true;
  };


  const recruitPokemon = (pokemon) => {
    if(!pokemon || !PKM_RUN) return false;

    const slot = getFreeSlot();
    if(slot >= 0){
      PKM_RUN.teamSlots[slot] = pokemon;
      renderTeamSlots();
      PokeMisteryRL.UI.refreshBottomPanel();
      return true;
    }

    // FIX: quando i 3 slot riserva sono pieni ma S2 è vuoto,
    // il quinto Pokémon deve poter entrare come Starter 2.
    if(!PKM_RUN.secondActive){
      PKM_RUN.secondActive = pokemon;
      renderTeamSlots();
      PokeMisteryRL.UI.refreshBottomPanel();
      return true;
    }

    return false;
  };

  return {
    replacePokemon,
    getFreeSlot,
    renderTeamSlots,
    swapToActive,
    releasePoke,
    equipAsSecond,
    unequipSecond,
    releaseSecond,
    prepareRecruitment,
    captureDefeatedPokemon,
    recruitPokemon
  };

})();



PokeMisteryRL.Evo = (() => {

  const getEvolutionTarget = (
    id = getActivePokemon()?.id
  ) => {

    const p = getPokemon(id);

    if(!p) return null;

    const e = p.evoluzione;

    if(!e) return null;

    return getPokemonId(
      e.out ?? e.a ?? e.to
    );
  };


  const getSecondActive = () =>
    PKM_RUN?.secondActive || null;


  const getFixedStarter = () =>
    PKM_RUN?.activePokemon || null; // STARTER1


  const checkEvolutionCondition = () => {

    const a = getActivePokemon();

    if(!a) return false;

    const p = getPokemon(a.id);

    if(!p?.evoluzione) return false;

    const t = getEvolutionTarget(a.id);

    if(!t) return false;

    const req = Number(p.evoluzione.lv ?? 0);

    if(req > 0 && a.level < req)
      return false;

    return true;
  };


  const canEvolve = () => {

    if(!PKM_RUN)
      return false;

    if(evoPromptShownFloor === PKM_RUN.floor)
      return false;

    return checkEvolutionCondition();
  };


  const checkEvolve = () => {

    if(!canEvolve())
      return false;

    showEvolutionPrompt();

    return true;
  };


  const showEvolutionPrompt = () => {

    const targetId = getEvolutionTarget();

    if(!targetId) return;

    const target = getPokemon(targetId);
    const active = getActivePokemon();

    if(!target || !active) return;

    evoPromptShownFloor = PKM_RUN.floor;

    busy = 1;

    modal(`
      <div class="center s2-no-companion-modal">

        <h2>⭐ EVOLUZIONE ⭐</h2>

        <p>${active.nome} può evolvere!</p>

        <button onclick="evolvePokemon(${target.id})">

          <img
            src="${sprite(target.immagine)}"
            style="width:48px;height:48px;image-rendering:pixelated"
          >

          <br>

          ${target.nome}

        </button>

        <button onclick="closeEvolutionPrompt()">
          RIMANDA
        </button>

      </div>
    `);
  };


  const closeEvolutionPrompt = () => {

    closeModal();

    busy = 0;

    PokeMisteryRL.UI.render();
  };


  const evolvePokemon = (newId) => {

    const active = getActivePokemon();
    const old = getPokemon(active?.id);
    const target = getPokemon(newId);

    if(!active || !target)
      return;

    active.id = target.id;
    active.nome = target.nome;
    active.immagine = target.immagine;
    active.tipi = [...target.tipi];
    active.stage = target.stage;
    active.bst = target.bst;

    // Dopo l'evoluzione il typing può cambiare: rigenera le skill
    // in base al nuovo Pokémon.
    if (
      typeof PokeMisteryRL_SkillSystem !== "undefined" &&
      typeof PokeMisteryRL_SkillSystem.assignSkills === "function"
    ) {
      PokeMisteryRL_SkillSystem.assignSkills(active);
    }

    PokeMisteryRL_LevelSystem.rebuildBaseStats(active);

    active.hp = active.maxHp;

    closeModal();
    busy = 0;
    PokeMisteryRL.UI.render();
    msg(`◈ ${old?.nome||"Pokémon"} → ${target.nome} ◈`);
  };


  return {
    getEvolutionTarget,
    canEvolve,
    checkEvolve,
    showEvolutionPrompt,
    closeEvolutionPrompt,
    evolvePokemon
  };

})();



/*
 * TEAM API
 * CORE 1 contiene ancora TeamRoster inline.
 * La regione Team estratta espone invece PokeMisteryRL.Team.
 * Per mantenere il CORE autonomo e compatibile con entrambe le forme,
 * il modulo Team viene costruito qui soltanto se non è già presente.
 */
PokeMisteryRL.Team = PokeMisteryRL.Team || (() => {

  const getCombinedTeam = () => {
    if (!PKM_RUN) return [];

    const team = [];

    if (PKM_RUN.activePokemon) {
      team.push(PKM_RUN.activePokemon);
    }

    if (PKM_RUN.secondActive) {
      team.push(PKM_RUN.secondActive);
    }

    if (Array.isArray(PKM_RUN.teamSlots)) {
      PKM_RUN.teamSlots.forEach(p => {
        if (p) team.push(p);
      });
    }

    return team;
  };

  const getTeamStats = () => {
    const team = getCombinedTeam();

    return team.reduce((stats, pokemon) => {
      if (!pokemon?.stats) return stats;

      stats.hp += Number(pokemon.stats.hp) || 0;
      stats.atk += Number(pokemon.stats.atk) || 0;
      stats.satk += Number(pokemon.stats.satk) || 0;
      stats.dif += Number(pokemon.stats.dif) || 0;
      stats.spd += Number(pokemon.stats.spd) || 0;

      return stats;
    }, {
      hp: 0,
      atk: 0,
      satk: 0,
      dif: 0,
      spd: 0
    });
  };

  return {
    getCombinedTeam,
    getTeamStats
  };

})();


const {
  getFreeSlot,
  renderTeamSlots,
  swapToActive,
  releasePoke,
  equipAsSecond,
  unequipSecond,
  releaseSecond,
  captureDefeatedPokemon
} = PokeMisteryRL.TeamRoster;


const {
  getEvolutionTarget,
  checkEvolve,
  evolvePokemon,
  closeEvolutionPrompt
} = PokeMisteryRL.Evo;



window.closeTeamPreview = () => {
  $("pokePreview")?.classList.add("hidden");
};



const fillPreview = (p, customHTML = "") => {

  $("ppSprite").src =
    typeof sprite === 'function'
      ? sprite(p.immagine)
      : p.immagine;

  $("ppName").textContent = p.nome;

  $("ppLevel").textContent =
    `LV ${p.level}`;

  $("ppTypes").innerHTML =
    (p.tipi || [])
      .map(t => `<span class="type-badge type-${t}">${t}</span>`)
      .join('');

  const hpPerc =
    Math.floor((p.hp / p.maxHp) * 100);

  $("ppHpFill").style.width =
    hpPerc + "%";

  $("ppHpText").textContent =
    `${p.hp}/${p.maxHp}`;

  $("ppk").textContent =
    p.stats.atk;

  $("ppDef").textContent =
    p.stats.dif;

  $("ppSpd").textContent =
    p.stats.spd;

  // FIX SKILL DB:
  // assegna le skill al Pokémon la prima volta che viene
  // aperta la preview, senza rigenerarle alle aperture successive.
  if (
    p &&
    typeof PokeMisteryRL_SkillSystem !== "undefined" &&
    typeof PokeMisteryRL_SkillSystem.assignSkills === "function" &&
    (!Array.isArray(p.skills) || p.skills.length === 0)
  ) {
    PokeMisteryRL_SkillSystem.assignSkills(p);
  }

const skill =
  typeof PokeMisteryRL_SkillSystem !== "undefined"
    ? PokeMisteryRL_SkillSystem.getPokemonSkill(
        p,
        Number(p.sk) || 1
      )
    : null;

  $("ppCustomContent").innerHTML = `
    <div class="pp-skills">
      <div id="ppSkill" class="pp-skill-pill">
        <span id="ppSkillName" class="pp-skill-name">
          ${skill?.name || "--"}
        </span>

        <span id="ppSkillPower" class="pp-skill-power">
          PWR ${skill?.pwr ?? "--"}
        </span>
      </div>
    </div>

    ${customHTML}
  `;

  $("pokePreview").classList.remove("hidden");
};






// #endregion

/* ============================================================
   CORE SPLIT HANDSHAKE - PART 1 READY
   ============================================================ */
window.PokeMisteryRL_CoreBridge = window.PokeMisteryRL_CoreBridge || {};
window.PokeMisteryRL_CoreBridge.part1Ready = true;
