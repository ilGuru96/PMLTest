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

/* ============================================================
   RECRUITMENT SYSTEM
   ============================================================
   Unificato direttamente nel CORE.
   CORE 2 chiama showRecruitmentPrompt() dopo una vittoria.
   Le funzioni sono esportate su window perché i pulsanti delle
   schermate generate dinamicamente usano onclick.
   ============================================================ */

window.showRecruitmentPrompt = (
  pokemon,
  reward,
  starter1,
  starter2
) => {

  if(!pokemon){
    return;
  }

  window._pendingRecruitment = {
    pokemon,
    reward,
    starter1,
    starter2
  };

  const freeSlot =
    (PKM_RUN?.teamSlots || [])
      .some(slot => !slot) ||
    !PKM_RUN?.secondActive;

  if(freeSlot){

    modal(`
      <div class="center victory-box">

        <h2>⭐ RECLUTAMENTO</h2>

        ${recruitCard(
          pokemon,
          "POKÉMON DA RECLUTARE"
        )}

        <button
          type="button"
          onclick="window.acceptRecruitment()"
        >
          ✓ ACCETTA
        </button>

        <button
          type="button"
          onclick="window.rejectRecruitment()"
        >
          ✕ RIFIUTA
        </button>

      </div>
    `);

  }else{

    showFullTeamSwitch();

  }
};

window.compareRecruitment = (
  key
) => {

  const pending =
    window._pendingRecruitment;

  if(!pending){
    return false;
  }

  const options =
    getFullTeamSwitchOptions();

  const option =
    options.find(
      item =>
        String(item.key) ===
        String(key)
    );

  if(!option || !option.pokemon){
    return false;
  }

  window._pendingReplacement = {
    key:String(option.key),
    label:option.label,
    pokemon:option.pokemon
  };

  modal(`
    <div class="recruitment-box recruit-compare">

      <h2>
        🔄 CONFRONTA
      </h2>

      <div class="recruit-compare-grid">

        ${recruitCard(
          option.pokemon,
          option.label
        )}

        <div class="recruit-compare-arrow">
          →
        </div>

        ${recruitCard(
          pending.pokemon,
          "NUOVO POKÉMON"
        )}

      </div>

      <p class="recruit-compare-note">
        Il Pokémon a sinistra verrà sostituito
        da quello nuovo.
      </p>

      <div class="recruit-compare-actions">

        <button
          type="button"
          onclick="window.backRecruitmentSelection()"
        >
          INDIETRO
        </button>

        <button
          type="button"
          onclick="window.confirmRecruitReplacement()"
        >
          ✓ CONFERMA SOSTITUZIONE
        </button>

      </div>

    </div>
  `);

  return true;
};

window.backRecruitmentSelection = () => {

  if(!window._pendingRecruitment){
    return;
  }

  window._pendingReplacement = null;

  showFullTeamSwitch();
};

window.confirmRecruitReplacement = () => {

  const pending =
    window._pendingRecruitment;

  const replacement =
    window._pendingReplacement;

  if(!pending || !replacement){
    return false;
  }

  const pokemon =
    pending.pokemon;

  if(!pokemon){
    return false;
  }

  const key =
    String(replacement.key);

  let ok = false;

  if(key === "s2"){

    if(!PKM_RUN?.secondActive){
      return false;
    }

    PKM_RUN.secondActive =
      pokemon;

    ok = true;

  }else{

    const index =
      Number(key);

    if(
      !Number.isInteger(index) ||
      index < 0 ||
      index >= 3 ||
      !PKM_RUN?.teamSlots?.[index]
    ){
      return false;
    }

    PKM_RUN.teamSlots[index] =
      pokemon;

    ok = true;
  }

  if(!ok){
    msg(
      "Impossibile completare la sostituzione."
    );
    return false;
  }

  renderTeamSlots();
  PokeMisteryRL.UI.refreshBottomPanel();

  const oldName =
    replacement.pokemon?.nome ||
    "Pokémon";

  const newName =
    pokemon.nome ||
    "Pokémon";

  const reward =
    pending.reward || 0;

  window._pendingRecruitment = null;
  window._pendingReplacement = null;

  modal(`
    <div class="center victory-box">

      <h2>
        ⭐ RECLUTAMENTO RIUSCITO
      </h2>

      <p>
        ${newName} ha sostituito ${oldName}.
      </p>

      <p>
        +${reward}¥
      </p>

      <button
        type="button"
        onclick="window.next('Vittoria!')"
      >
        CONTINUA
      </button>

    </div>
  `);

  return true;
};

window.acceptRecruitment = () => {

  const pending =
    window._pendingRecruitment;

  if(!pending){
    return;
  }

  const added =
    PokeMisteryRL.TeamRoster.recruitPokemon(
      pending.pokemon
    );

  if(!added){
    showFullTeamSwitch();
    return;
  }

  const name =
    pending.pokemon?.nome ||
    "Pokémon";

  const reward =
    pending.reward || 0;

  window._pendingRecruitment = null;

  PokeMisteryRL.UI.refreshBottomPanel();

  modal(`
    <div class="center victory-box">

      <h2>
        ⭐ RECLUTAMENTO RIUSCITO
      </h2>

      <p>
        ${name} è entrato nella squadra.
      </p>

      <p>
        +${reward}¥
      </p>

      <button
        type="button"
        onclick="window.next('Vittoria!')"
      >
        CONTINUA
      </button>

    </div>
  `);
};

window.rejectRecruitment = () => {

  const pending =
    window._pendingRecruitment;

  if(!pending){
    return;
  }

  const reward =
    pending.reward || 0;

  window._pendingRecruitment = null;
  window._pendingReplacement = null;

  modal(`
    <div class="center victory-box">

      <h2>
        VITTORIA!
      </h2>

      <p>
        Hai rifiutato
        ${pending.pokemon?.nome || "Pokémon"}.
      </p>

      <p>
        +${reward}¥
      </p>

      <button
        type="button"
        onclick="window.next('Vittoria!')"
      >
        CONTINUA
      </button>

    </div>
  `);
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

    if(PokeMisteryRL?.UI?.refreshBottomPanel){
      PokeMisteryRL.UI.refreshBottomPanel();
    }

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
   CORE UNIFICATO - CORE 1 + CORE 2
   Tutte le funzioni dei due CORE sono nello stesso scope.
   Nessun bridge di caricamento tra CORE 1 e CORE 2.
   ============================================================ */

// #region 11 - MAPPA | 11 - PROGRESSIONE
PokeMisteryRL.Map = (() => {
  const buildMap = () => {
    // Ogni riga ha un numero diverso di nodi rispetto alla successiva.
    // La struttura è fissa per evitare righe consecutive uguali.
    // Riga 0 = 1 nodo di partenza, con ESATTAMENTE 3 uscite verso la riga 1.
    const layout = [1, 3, 4, 5, 3, 2, 1];
    PKM_RUN.map = [];

    for (let r = 0; r < layout.length; r++) {
      const cols = layout[r];
      const row = [];

      for (let c = 0; c < cols; c++) {
        let type = "free";

        if (r === 0) {
          type = "free";
        } else if (r === layout.length - 1) {
          type = "boss";
        } else if (r === layout.length - 2) {
          type = c === 0 ? "rifugio" : rand(["fight", "shop", "skill", "event"]);
        } else {
          const rnd = Math.random();
          type = rnd < 0.45 ? "fight"
               : rnd < 0.65 ? "shop"
               : rnd < 0.80 ? "skill"
               : rnd < 0.90 ? "rifugio"
               : "event";
        }

        const node = {
          id: `r${r}c${c}`,
          row: r,
          col: c,
          type,
          ok: r === 0,
          done: false,
          kid: []
        };

        // Per ogni nodo fight/boss scegliamo subito il Pokémon da mostrare.
        // Usiamo solo PKM_DB, che è già disponibile nel CORE.
        if(type === "fight" || type === "boss"){

          const enemyStage =
            type === "boss"
              ? (PKM_RUN.floor < 3 ? 1 : PKM_RUN.floor < 6 ? 2 : 3)
              : (PKM_RUN.floor < 2 ? 1 : PKM_RUN.floor < 5 ? 2 : 3);

          const candidates =
            Object.values(PKM_DB).filter(
              p => Number(p.stage) === Number(enemyStage)
            );

          if(candidates.length){
            const chosen = rand(candidates);

            node.enemyPreview = {
              id: chosen.id,
              nome: chosen.nome,
              immagine: chosen.immagine,
              stage: Number(chosen.stage)
            };
          }
        }

        row.push(node);
      }

      PKM_RUN.map.push(row);
    }

    // Crea i collegamenti senza mai duplicare una scelta nella stessa riga.
    // Per ogni nodo vengono usate solo colonne realmente esistenti.
    for (let r = 0; r < PKM_RUN.map.length - 1; r++) {
      const cur = PKM_RUN.map[r];
      const nxt = PKM_RUN.map[r + 1];

      cur.forEach((node) => {
        const choices = new Set();

        // Caso speciale: il primo nodo deve avere sempre tutte e 3 le uscite.
        if (r === 0) {
          for (let c = 0; c < nxt.length; c++) choices.add(c);
        } else {
          const ratio = nxt.length / cur.length;
          const center = Math.round(node.col * ratio);

          // Centro + vicini: massimo 3 scelte, tutte uniche.
          [center - 1, center, center + 1].forEach((c) => {
            if (c >= 0 && c < nxt.length) choices.add(c);
          });

          // Protezione per eventuali configurazioni future con una sola colonna.
          if (!choices.size) choices.add(Math.min(node.col, nxt.length - 1));
        }

        node.kid = [...choices];
      });
    }

    // La riga 1 deve presentare 3 scelte distinte e non duplicare mai lo stesso nodo.
    // I nodi sono identificati dalla loro colonna, quindi Set/kid garantisce l'unicità.
  };
  const drawMapLines = () => {
    const svg=$("mapSvg"), map=$("map"); if(!svg||!map||!PKM_RUN?.map?.length) return; svg.innerHTML=""; const rect=map.getBoundingClientRect(); svg.style.left=map.offsetLeft+"px"; svg.style.top=map.offsetTop+"px"; svg.style.width=map.offsetWidth+"px"; svg.style.height=map.offsetHeight+"px"; svg.setAttribute("width",map.offsetWidth); svg.setAttribute("height",map.offsetHeight); svg.setAttribute("viewBox",`0 0 ${map.offsetWidth} ${map.offsetHeight}`);
    PKM_RUN.map.forEach(row=>{ row.forEach(node=>{ const from=$(`n-${node.id}`); if(!from)return; node.kid.forEach(childCol=>{ const child=PKM_RUN.map[node.row+1]?.find(i=>i.col===childCol); if(!child)return; const to=$(`n-${child.id}`); if(!to)return; const a=from.getBoundingClientRect(), b=to.getBoundingClientRect(); const cx1=a.left-rect.left+a.width/2, cy1=a.top-rect.top+a.height/2, cx2=b.left-rect.left+b.width/2, cy2=b.top-rect.top+b.height/2; const dx=cx2-cx1, dy=cy2-cy1, dist=Math.hypot(dx,dy); if(!dist)return; const nx=dx/dist, ny=dy/dist; const line=document.createElementNS("http://www.w3.org/2000/svg","line"); line.setAttribute("x1",cx1+nx*a.width/2); line.setAttribute("y1",cy1+ny*a.height/2); line.setAttribute("x2",cx2-nx*b.width/2); line.setAttribute("y2",cy2-ny*b.height/2); line.classList.add("map-line"); const isCurrent=node.row===PKM_RUN.row && node.col===PKM_RUN.col && child.ok; line.classList.add(isCurrent?"available":"done"); svg.appendChild(line); }); }); });
  };
  return { buildMap, drawMapLines };
})();
PokeMisteryRL.Progress = (() => {
  const pick = (node) => {
    if(busy||!node?.ok||PKM_RUN?.dead) return; busy=1;
    const real=PKM_RUN.map[node.row]?.[node.col]; if(!real||!real.ok){busy=0;return;}
    real.done=true; PKM_RUN.map.forEach(r=>r.forEach(n=>n.ok=false)); PKM_RUN.row=node.row; PKM_RUN.col=node.col; PokeMisteryRL.UI.render();
    switch(real.type){ case "free": next(); break; case "fight": typeof fight==="function"?fight(false):next(); break; case "boss": typeof fight==="function"?fight(true):next(); break; case "skill": skill(); break; case "shop": shop(); break; case "rifugio": rifugio(); break; case "event": eggEvent(); break; default: next(); break; }
  };
  const next = (message="") => {
    if(!PKM_RUN)return; const current=PKM_RUN.map[PKM_RUN.row]?.[PKM_RUN.col]; if(!current)return;
    if(current.type==="boss"){ PKM_RUN.floor++; const a=getActivePokemon(); if(a){a.hp=a.maxHp; PKM_RUN.hp=a.maxHp;} PokeMisteryRL.Map.buildMap(); PKM_RUN.row=0; PKM_RUN.col=0; PKM_RUN.map[0][0].ok=true; }
    else { PKM_RUN.map.forEach(r=>r.forEach(n=>n.ok=false)); const nextRow=PKM_RUN.map[PKM_RUN.row+1]; if(nextRow){ current.kid.forEach(c=>{ if(nextRow[c]) nextRow[c].ok=true; }); if(!nextRow.some(n=>n.ok)) nextRow.forEach(n=>n.ok=true); PKM_RUN.row++; const first=nextRow.find(n=>n.ok); if(first) PKM_RUN.col=first.col; } }
    if(message) msg(message); closeModal(); busy=0; PokeMisteryRL.UI.render(); checkEvolve();
  };
  return { pick, next };
})();
const { pick, next } = PokeMisteryRL.Progress;
// #endregion
// #region 12 - FELICITA / SKILL / RIFUGIO | 13 - SHOP / EVENTI / UI
PokeMisteryRL.Effects = (() => {
  const updateHPBar = () => {

    const a =
      getActivePokemon();

    if(!a){
      return;
    }

    const maxHp =
      Math.max(
        1,
        Number(a.maxHp) || 1
      );

    const hp =
      clamp(
        Number(a.hp) || 0,
        0,
        maxHp
      );

    const percent =
      hp / maxHp * 100;

    const bar =
      $("hpFillSide");

    if(bar){
      bar.style.width =
        percent + "%";
    }

    const text =
      $("hpTextSide");

    if(text){
      text.textContent =
        `HP ${hp}/${maxHp}`;
    }

  };
  const addFel = (v) => { const a=getActivePokemon(); if(!a)return; const old=a.fel; a.fel=clamp(a.fel+Number(v||0),0,100); PKM_RUN.fel=a.fel; if(old<100&&a.fel>=100) msg("FEL 100!"); PokeMisteryRL.UI.refreshBottomPanel(); };
  const consumeFel = (v) => { const a=getActivePokemon(); if(!a||a.fel<v)return false; a.fel-=v; PKM_RUN.fel=a.fel; PokeMisteryRL.UI.refreshBottomPanel(); return true; };
  const getSkillPreview = (
    pokemon,
    level
  ) => {

    if(!pokemon){
      return null;
    }

    const currentLevel =
      Number(pokemon.sk) || 1;

    /*
     * Skill attualmente equipaggiata:
     * usa sempre quella realmente salvata nel Pokémon.
     */
    if(
      Number(level) === currentLevel &&
      typeof PokeMisteryRL_SkillSystem !== "undefined" &&
      typeof PokeMisteryRL_SkillSystem.getActiveSkill === "function"
    ){
      return (
        PokeMisteryRL_SkillSystem.getActiveSkill(
          pokemon
        ) || null
      );
    }

    /*
     * Skill futura:
     * la memorizziamo solo sul Pokémon.
     * Nessuna modifica a PKM_RUN o alla procedura di start.
     */
    if(!Array.isArray(pokemon.__skillPreview)){
      pokemon.__skillPreview = [];
    }

    const cached =
      pokemon.__skillPreview.find(
        item =>
          Number(item.level) === Number(level)
      );

    if(cached){
      return cached.skill;
    }

    if(
      typeof PokeMisteryRL_SkillSystem === "undefined" ||
      typeof PokeMisteryRL_SkillSystem.getSkill !== "function"
    ){
      return null;
    }

    const skill =
      PokeMisteryRL_SkillSystem.getSkill(
        pokemon,
        Number(level)
      );

    if(!skill){
      return null;
    }

    pokemon.__skillPreview.push({
      level: Number(level),
      skill
    });

    return skill;
  };


  const upgradeSkillTarget = (
    target
  ) => {

    const pokemon =
      target === "s2"
        ? PKM_RUN?.secondActive
        : getActivePokemon();

    if(!pokemon){
      msg(
        target === "s2"
          ? "S2 non equipaggiato."
          : "S1 non disponibile."
      );
      return false;
    }

    const currentLevel =
      Number(pokemon.sk) || 1;

    if(currentLevel >= 3){
      msg(
        `${pokemon.nome}: SKILL MAX`
      );
      return false;
    }

    const nextLevel =
      currentLevel + 1;

    const selected =
      getSkillPreview(
        pokemon,
        nextLevel
      );

    if(!selected){
      msg(
        `Nessuna skill LV ${nextLevel} disponibile.`
      );
      return false;
    }

    /*
     * Applica esattamente la skill visualizzata.
     */
    pokemon.skills =
      [selected];

    pokemon.sk =
      nextLevel;

    if(target === "s1"){
      PKM_RUN.sk =
        pokemon.sk;
    }

    PokeMisteryRL.UI.refreshBottomPanel();

    msg(
      `${pokemon.nome}: ${selected.name || selected.nome}`
    );

    return true;
  };


  const upgradeSkill = () =>
    upgradeSkillTarget("s1");


  

const getCurrentSkillNode = () => {

  return (
    PKM_RUN?.map?.[PKM_RUN.row]?.[PKM_RUN.col] ||
    null
  );
};


const isSkillRerollAvailable = () => {

  const node =
    getCurrentSkillNode();

  return (
    node?.type === "skill" &&
    node.rerollUsed !== true
  );
};


const consumeSkillReroll = () => {

  const node =
    getCurrentSkillNode();

  if(
    node &&
    node.type === "skill"
  ){
    node.rerollUsed = true;
  }
};


const showSkillRerollResult = (
  pokemon,
  oldSkill,
  newSkill
) => {

  const oldName =
    oldSkill?.name ||
    oldSkill?.nome ||
    "--";

  const newName =
    newSkill?.name ||
    newSkill?.nome ||
    "--";

  const oldPower =
    oldSkill?.pwr ??
    oldSkill?.power ??
    "--";

  const newPower =
    newSkill?.pwr ??
    newSkill?.power ??
    "--";

  modal(`
    <div class="center skill-result-node">

      <h2>
        🔄 REROLL SKILL
      </h2>

      <p class="skill-node-subtitle">
        La skill di ${pokemon.nome} è cambiata.
      </p>

      <div class="skill-result-flow">

        <div class="skill-move-box skill-result-old">

          <small>
            PRIMA
          </small>

          <strong>
            ${oldName}
          </strong>

          <span>
            PWR ${oldPower}
          </span>

        </div>

        <div class="skill-arrow">
          →
        </div>

        <div class="skill-move-box skill-result-new">

          <small>
            DOPO
          </small>

          <strong>
            ${newName}
          </strong>

          <span>
            PWR ${newPower}
          </span>

        </div>

      </div>

      <button
        type="button"
        onclick="next()"
      >
        CONTINUA
      </button>

    </div>
  `);
};


const rerollSkillTarget = (
  target
) => {

  const pokemon =
    target === "s2"
      ? PKM_RUN?.secondActive
      : getActivePokemon();

  if(!pokemon){
    msg(
      target === "s2"
        ? "S2 non equipaggiato."
        : "S1 non disponibile."
    );
    return false;
  }

  const currentLevel =
    Number(pokemon.sk) || 1;

  /*
   * Un solo reroll per nodo Skill.
   */
  if(!isSkillRerollAvailable()){
    msg(
      "Reroll già usato in questo nodo Skill."
    );
    return false;
  }

  /*
   * Il reroll è disponibile solo a LV3.
   */
  if(currentLevel !== 3){
    msg(
      "Il reroll è disponibile solo a SKILL LV3."
    );
    return false;
  }

  const COST =
    50;

  if(
    Number(PKM_RUN.bits) < COST
  ){
    msg(
      `Servono ${COST} monete.`
    );
    return false;
  }

  if(
    typeof PokeMisteryRL_SkillSystem === "undefined" ||
    typeof PokeMisteryRL_SkillSystem.getSkill !== "function"
  ){
    msg(
      "Skill System non disponibile."
    );
    return false;
  }

  const oldSkill =
    PokeMisteryRL_SkillSystem.getActiveSkill(
      pokemon
    );

  /*
   * Una sola estrazione della nuova skill LV3.
   */
  const newSkill =
    PokeMisteryRL_SkillSystem.getSkill(
      pokemon,
      currentLevel
    );

  if(!newSkill){
    msg(
      "Nessuna skill LV3 disponibile."
    );
    return false;
  }

  /*
   * Applica prima la nuova skill e poi consuma il reroll.
   */
  pokemon.skills =
    [newSkill];

  pokemon.sk =
    currentLevel;

  PKM_RUN.bits =
    Math.max(
      0,
      Number(PKM_RUN.bits) - COST
    );

  consumeSkillReroll();

  /*
   * Elimina la preview precedente LV3,
   * così la prossima visita del sistema usa lo stato reale.
   */
  if(
    Array.isArray(pokemon.__skillPreview)
  ){
    pokemon.__skillPreview =
      pokemon.__skillPreview.filter(
        item =>
          Number(item.level) !== currentLevel
      );
  }

  PokeMisteryRL.UI.refreshBottomPanel();

  /*
   * Mostra il confronto prima di chiudere il nodo.
   * CONTINUA usa next(), esattamente come il potenziamento.
   */
  showSkillRerollResult(
    pokemon,
    oldSkill,
    newSkill
  );

  return true;
};


const buildSkillCard = (
  target,
  pokemon
) => {

  if(!pokemon){

    return `
      <div class="skill-choice-card skill-choice-empty">

        <div class="skill-choice-head">
          <b>${target}</b>
          <span>S2 NON EQUIPAGGIATO</span>
        </div>

      </div>
    `;
  }

  const level =
    Number(pokemon.sk) || 1;

  const nextLevel =
    level + 1;

  const rerollAvailable =
    isSkillRerollAvailable();

  const currentSkill =
    getSkillPreview(
      pokemon,
      level
    );

  const nextSkill =
    level < 3
      ? getSkillPreview(
          pokemon,
          nextLevel
        )
      : null;

  const currentName =
    currentSkill?.name ||
    currentSkill?.nome ||
    "--";

  const nextName =
    nextSkill?.name ||
    nextSkill?.nome ||
    "MAX";

  const currentPower =
    currentSkill?.pwr ??
    currentSkill?.power ??
    "--";

  const nextPower =
    nextSkill?.pwr ??
    nextSkill?.power ??
    "--";

  const action =
    level === 3 && rerollAvailable
      ? `
          <button
            type="button"
            onclick="rerollSkillTarget('${target.toLowerCase()}')"
          >
            🔄 REROLL LV3 — 50 💰
          </button>
        `
      : level === 3
        ? `
            <button
              type="button"
              disabled
            >
              🔄 REROLL GIÀ USATO
            </button>
          `
      : nextSkill
        ? `
          <button
            type="button"
            onclick="upgradeSkillTarget('${target.toLowerCase()}'); next();"
          >
            ⭐ POTENZIA ${target}
          </button>
        `
        : `
          <button
            type="button"
            disabled
          >
            ⭐ MAX
          </button>
        `;

  return `
    <div class="skill-choice-card">

      <div class="skill-choice-head">

        <b>${target}</b>

        <span>
          ${pokemon.nome}
        </span>

        <em>
          SKILL LV ${level}
        </em>

      </div>

      <div class="skill-choice-body">

        <div class="skill-choice-sprite">

          <img
            src="${sprite(pokemon.immagine)}"
            alt="${pokemon.nome}"
          >

        </div>

        <div class="skill-choice-moves">

          <div class="skill-move-box">

            <small>
              ATTUALE
            </small>

            <strong>
              ${currentName}
            </strong>

            <span>
              PWR ${currentPower}
            </span>

          </div>

          <div class="skill-arrow">
            →
          </div>

          <div class="skill-move-box skill-move-next">

            <small>
              ${level < 3 ? "DIVENTA" : "REROLL"}
            </small>

            <strong>
              ${
                level < 3
                  ? nextName
                  : "SKILL LV3"
              }
            </strong>

            <span>
              ${
                level < 3
                  ? `PWR ${nextPower}`
                  : "50 💰"
              }
            </span>

          </div>

        </div>

      </div>

      ${action}

    </div>
  `;
};


const skill = () => {

    const s1 =
      PKM_RUN?.activePokemon || null;

    const s2 =
      PKM_RUN?.secondActive || null;

    if(!s1){
      return;
    }

    modal(`
      <div class="center skill-node">

        <h2>⚡ SKILL</h2>

        <p class="skill-node-subtitle">
          Scegli quale Pokémon potenziare.
        </p>

        <div class="skill-choice-list">

          ${buildSkillCard("S1", s1)}

          ${buildSkillCard("S2", s2)}

        </div>

        <button
          type="button"
          onclick="next()"
        >
          AVANTI
        </button>

      </div>
    `);
  };


  const rifugio = () => modal(`<div class="center"><h2>🏠 RIFUGIO</h2><button onclick="const p=getActivePokemon(); p.hp=clamp(p.hp+50,0,p.maxHp); addFel(15); refreshBottomPanel(); next('+50 HP +15 FEL');">RIPOSA</button><button onclick="next()">AVANTI</button></div>`);
  return { updateHPBar, addFel, consumeFel, upgradeSkill, upgradeSkillTarget, rerollSkillTarget, skill, rifugio };
})();
const { updateHPBar, addFel, consumeFel, upgradeSkill, upgradeSkillTarget, rerollSkillTarget, skill, rifugio } = PokeMisteryRL.Effects;
window.rerollSkillTarget = rerollSkillTarget;
window.upgradeSkillTarget = upgradeSkillTarget;
// #endregion
// #region 14 - BATTAGLIA | 15 - HUD | 16 - GAMEOVER

PokeMisteryRL.Battle = (() => {

  // POKEMON NEMICI

  const getPokemonByStage = (s) =>
    Object.values(PKM_DB).filter(
      p => Number(p.stage) === Number(s)
    );


  const getEnemyStage = (f, isBoss) =>
    isBoss
      ? (f < 3 ? 1 : f < 6 ? 2 : 3)
      : (f < 2 ? 1 : f < 5 ? 2 : 3);


  const getEnemyStats = (id) => {

    const p = PKM_DB[id];

    if (!p) {
      return {
        hp: 20,
        atk: 10,
        satk: 10,
        dif: 10,
        spd: 10
      };
    }

    const st =
      getStatsFromBST(
        p.bst,
        p.stage
      );

    if (PKM_RUN.floor >= 6) {

      const b =
        1 + (PKM_RUN.floor - 5) * 0.12;

      st.hp =
        Math.floor(st.hp * b);

      st.atk =
        Math.floor(st.atk * b);

      st.satk =
        Math.floor(st.satk * b);

      st.dif =
        Math.floor(st.dif * b);

      st.spd =
        Math.floor(st.spd * b);
    }

    return st;
  };


  const createEnemy = (isBoss) => {

    const currentNode =
      PKM_RUN?.map?.[PKM_RUN.row]?.[PKM_RUN.col] ||
      null;

    /*
     * IL NODO HA GIA' DECISO IL POKEMON DA MOSTRARE.
     * Il fight usa ESATTAMENTE quello sprite/quel Pokémon.
     */
    let base = null;

    if(
      currentNode?.enemyPreview?.id != null
    ){

      base =
        PKM_DB[currentNode.enemyPreview.id] ||
        Object.values(PKM_DB).find(
          p =>
            String(p.id) ===
            String(currentNode.enemyPreview.id)
        ) ||
        null;
    }

    /*
     * Fallback di sicurezza: se il nodo non ha preview,
     * manteniamo la vecchia selezione casuale.
     */
    if(!base){

      const stage =
        getEnemyStage(
          PKM_RUN.floor,
          isBoss
        );

      const pool =
        getPokemonByStage(stage);

      if(!pool.length){
        return null;
      }

      base =
        rand(pool);
    }

    const stats =
      getEnemyStats(base.id);

    /*
     * Questo è lo stesso livello mostrato nella card del fight:
     * enemyLevel = floor + 2.
     */
    const encounterLevel =
      Math.max(
        1,
        Number(PKM_RUN.floor) + 2
      );

    return {

      id: base.id,

      nome: base.nome,

      immagine: base.immagine,

      tipi: [...base.tipi],

      stage: base.stage,

      level: encounterLevel,

      hp: stats.hp,

      maxHp: stats.hp,

      stats
    };
  };


  // BATTAGLIA

  const fight = (isBoss = false) => {

    try {

      const starter1 =
        PKM_RUN?.activePokemon;

      const starter2 =
        PKM_RUN?.secondActive;


      // S1 È OBBLIGATORIO
      // S2 È FACOLTATIVO

      if (!starter1) {

        busy = 0;

        msg(
          "Serve S1 per combattere."
        );

        return;
      }


      const enemy =
        createEnemy(isBoss);


      if (!enemy) {

        busy = 0;

        next();

        return;
      }


      // STATO BATTAGLIA

      PKM_RUN.battle = {

        enemy,

        hp: enemy.hp,

        maxHp: enemy.maxHp,

        stats: enemy.stats,

        boss: !!isBoss,

        turn: 0,

        phase: 0

      };


      // COSTRUISCE LA SCHERMATA

      modal(
        PokeMisteryRL.UI.buildBattleTemplate(
          isBoss,
          PKM_RUN.floor
        )
      );


      PokeMisteryRL.UI.updateBattleHP();


      log(
        isBoss
          ? `⚠️ ${enemy.nome} BOSS!`
          : `⚔️ ${enemy.nome} selvatico!`,
        isBoss
          ? "boss"
          : ""
      );


      setTimeout(
        autoTurn,
        700
      );


    } catch (e) {

      console.error(e);

      busy = 0;

      closeModal();

      next();
    }
  };


  // UTILITY BATTAGLIA

  const getStarter1 = () =>
    PKM_RUN?.activePokemon || null;


  const getStarter2 = () =>
    PKM_RUN?.secondActive || null;


  const getAliveStarters = () => {

    return [

      getStarter1(),

      getStarter2()

    ].filter(
      p =>
        p &&
        Number(p.hp) > 0
    );
  };


  const isTeamDead = () =>
    getAliveStarters().length === 0;


  // ATTACCO

  const attack = (
    attacker,
    target,
    targetIsEnemy = false
    ) => {

    if (!attacker || !target) {
      return false;
    }


    if (Number(attacker.hp) <= 0) {
      return false;
    }


    if (
      !targetIsEnemy &&
      Number(target.hp) <= 0
    ) {
      return false;
    }


    const attackerStats =
      attacker.stats || {};


    const targetStats =
      targetIsEnemy
        ? PKM_RUN.battle.stats
        : target.stats || {};


    const mult =
      getTypeMultiplier(

        attacker.tipi?.[0] ||
          "normale",

        target.tipi || []
      );


    const base =
      Math.max(

        8,

        Math.floor(

          (Number(attackerStats.atk) * 50) /

          (Number(targetStats.dif) + 30)

        ) + 5

      );


    const crit =
      Math.random() < 0.15;


    const dmg =
      Math.max(

        1,

        Math.floor(

          base *
          mult *
          (crit ? 1.7 : 1)

        )

      );


    // DANNO

    if (targetIsEnemy) {

      const battle =
        PKM_RUN.battle;

      battle.hp =
        clamp(

          battle.hp - dmg,

          0,

          battle.maxHp

        );


      battle.enemy.hp =
        battle.hp;


    } else {

      target.hp =
        clamp(

          target.hp - dmg,

          0,

          target.maxHp

        );
    }


    // LOG

    log(

      `${attacker.nome} usa Attacco! -${dmg}` +

      `${crit ? " CRIT!" : ""} ` +

      `${getMultLabel(mult)}`
    );


    // ANIMAZIONE

    const targetName =
      targetIsEnemy
        ? "enemy"
        : target === getStarter2()
          ? "s2"
          : "s1";


    PokeMisteryRL.UI.spawnDamage(

      targetName,

      dmg,

      crit
        ? "crit"
        : "normal"
    );


    PokeMisteryRL.UI.hitShake(
      targetName
    );


    PokeMisteryRL.UI.updateBattleHP();


    return true;
  };


  // TURNO AUTOMATICO

  const autoTurn = () => {

    if (!PKM_RUN?.battle) {
      return;
    }


    const battle =
      PKM_RUN.battle;


    const s1 =
      getStarter1();

    const s2 =
      getStarter2();

    const enemy =
      battle.enemy;


    // CONTROLLO GAME OVER

    if (isTeamDead()) {

      gameover();

      return;
    }


    // CONTROLLO VITTORIA

    if (battle.hp <= 0) {

      win();

      return;
    }


    // CREA LISTA DEGLI ATTACCANTI VIVI

    const attackers = [

      s1,

      s2,

      enemy

    ].filter(
      p =>
        p &&
        Number(p.hp) > 0
    );


    // ORDINE PER SPD

    attackers.sort(
      (a, b) =>
        Number(b.stats?.spd ?? 0) -
        Number(a.stats?.spd ?? 0)
    );


    // ESEGUI UN ATTACCO ALLA VOLTA

    const attacker =
      attackers[battle.phase];


    if (!attacker) {

      battle.phase = 0;

      battle.turn++;


      setTimeout(
        autoTurn,
        900
      );

      return;
    }


    // IL NEMICO ATTACCA

    if (attacker === enemy) {

      const targets =
        getAliveStarters();


      if (!targets.length) {

        gameover();

        return;
      }


      // PRIORITÀ HP:
      // S2 PRIMA, POI S1

      let target = null;


      if (
        s2 &&
        Number(s2.hp) > 0
      ) {

        target = s2;

      } else if (
        s1 &&
        Number(s1.hp) > 0
      ) {

        target = s1;

      }


      if (!target) {

        gameover();

        return;
      }


      const enemyStats =
        battle.stats;


      const targetStats =
        target.stats || {};


      const eMult =
        getTypeMultiplier(

          enemy.tipi?.[0] ||
            "normale",

          target.tipi || []
        );


      const eBase =
        Math.max(

          5,

          Number(enemyStats.atk) -

          Math.floor(
            Number(targetStats.dif) * 0.35
          )

        );


      const eDmg =
        Math.max(

          1,

          Math.floor(
            eBase * eMult
          )

        );


      target.hp =
        clamp(

          target.hp - eDmg,

          0,

          target.maxHp

        );


      // Mantieni PKM_RUN.hp compatibile
      if (target === s1) {

        PKM_RUN.hp =
          target.hp;
      }


      log(

        `${enemy.nome} colpisce ${target.nome} -${eDmg}`

      );


      const targetName =
        target === s2
          ? "s2"
          : "s1";


      PokeMisteryRL.UI.spawnDamage(

        targetName,

        eDmg

      );


      PokeMisteryRL.UI.hitShake(
        targetName
      );


      PokeMisteryRL.UI.updateBattleHP();


      PokeMisteryRL.UI.refreshBottomPanel();


      // GAME OVER

      if (isTeamDead()) {

        setTimeout(
          gameover,
          500
        );

        return;
      }
    }


    // ATTACCO S1 / S2

    else {

      if (battle.hp <= 0) {

        win();

        return;
      }


      attack(

        attacker,

        enemy,

        true

      );


      if (battle.hp <= 0) {

        setTimeout(
          win,
          500
        );

        return;
      }
    }


    // PROSSIMO ATTACCANTE

    battle.phase++;


    setTimeout(
      autoTurn,
      650
    );
  };


  // FUGA

  const flee = () => {

    if (
      !PKM_RUN?.battle ||
      PKM_RUN.battle.boss
    ) {
      return;
    }


    addFel(-20);


    PKM_RUN.battle =
      null;


    busy = 0;


    next(
      "Fuga -20 FEL"
    );
  };


  // VITTORIA + RECLUTAMENTO
  const win = () => {
    if (!PKM_RUN?.battle) return;

    const battle = PKM_RUN.battle;
    const starter1 = PKM_RUN.activePokemon;
    const starter2 = PKM_RUN.secondActive;
    const reward = battle.boss ? 150 : 50;
    const levelReward = battle.boss ? 2 : 1;

    PKM_RUN.bits += reward;

    if (starter1) PokeMisteryRL_LevelSystem.levelUp(starter1, levelReward);
    if (starter2) PokeMisteryRL_LevelSystem.levelUp(starter2, levelReward);

    const defeated = battle.enemy;
    const recruited = PokeMisteryRL.TeamRoster.prepareRecruitment(defeated);

    // Chiudiamo lo stato di battaglia prima di mostrare la scelta.
    PKM_RUN.battle = null;
    busy = 0;
    PokeMisteryRL.UI.refreshBottomPanel();

    if (recruited) {
      if (typeof window.showRecruitmentPrompt === "function") {
        window.showRecruitmentPrompt(recruited, reward, starter1, starter2);
      } else {
        console.error("Recruitment system non disponibile");
        modal(`
          <div class="center victory-box">
            <h2>VITTORIA!</h2>
            <p>+${reward}¥</p>
            <button type="button" onclick="window.next('Vittoria!')">CONTINUA</button>
          </div>
        `);
      }
      return;
    }

    modal(`
      <div class="center victory-box">
        <h2>VITTORIA!</h2>
        <p>+${reward}¥</p>
        <p style="opacity:.7">Impossibile preparare il reclutamento.</p>
        <button onclick="next('Vittoria!')">CONTINUA</button>
      </div>
    `);
  };

  // GAME OVER

  const gameover = () => {

    if (!PKM_RUN) {
      return;
    }


    PKM_RUN.battle =
      null;


    PKM_RUN.dead =
      true;


    busy = 0;


    const s1 =
      PKM_RUN.activePokemon;


    const s2 =
      PKM_RUN.secondActive;


    const s1Dead =
      !s1 ||
      Number(s1.hp) <= 0;


    const s2Dead =
      !s2 ||
      Number(s2.hp) <= 0;


    const deadNames = [

      s1Dead
        ? s1?.nome
        : null,

      s2Dead
        ? s2?.nome
        : null

    ].filter(Boolean);


    modal(`

      <div class="center">

        <h2 style="color:#ff4444">
          SEI MORTO
        </h2>

        <p>

          ${
            deadNames.length
              ? deadNames.join(" e ")
              : "I tuoi Pokémon"
          }

          sono esausti...

        </p>

        <button
          onclick="location.reload()"
        >
          RIPROVA
        </button>

      </div>

    `);
  };


  return {

    fight,

    autoTurn,

    flee,

    win,

    gameover

  };

})();


// UI

PokeMisteryRL.UI = (() => {


  // BOTTOM PANEL

  let teamPreviewIndex = 0;

  const getReserveTeam = () => {
    if(!PKM_RUN) return [];
    return (PKM_RUN.teamSlots || []).filter(Boolean);
  };

  const getRunInventory = () => {
    if(!PKM_RUN) return [];
    const raw = Array.isArray(PKM_RUN.inventory)
      ? PKM_RUN.inventory
      : (Array.isArray(PKM_RUN.items) ? PKM_RUN.items : []);
    return raw;
  };

  const getRunEggs = () => {
    if(!PKM_RUN) return [];
    const raw = Array.isArray(PKM_RUN.eggs)
      ? PKM_RUN.eggs
      : (Array.isArray(PKM_RUN.uova) ? PKM_RUN.uova : []);
    return raw;
  };

  const formatInventoryEntry = (item) => {
    if(item == null) return null;
    if(typeof item === "string") return { name:item, qty:1, icon:"📦" };
    if(typeof item === "number") return { name:"Oggetto", qty:item, icon:"📦" };
    return {
      name:item.nome || item.name || item.id || "Oggetto",
      qty:Number(item.qty ?? item.quantity ?? item.quantita ?? 1) || 1,
      icon:item.icon || item.emoji || "📦"
    };
  };

  const formatEggEntry = (egg) => {
    if(egg == null) return null;
    if(typeof egg === "string") return { name:egg, qty:1, icon:"🥚" };
    return {
      name:egg.nome || egg.name || egg.id || "Uovo",
      qty:Number(egg.qty ?? egg.quantity ?? egg.quantita ?? 1) || 1,
      icon:egg.icon || egg.emoji || "🥚"
    };
  };

  const refreshTeamViewer = () => {
    const box = $("teamViewer");
    const count = $("teamCount");
    const name = $("teamViewerName");
    const lv = $("teamViewerLevel");
    const img = $("teamViewerSprite");
    const prev = $("teamPrevBtn");
    const nextBtn = $("teamNextBtn");
    if(!box || !count || !name || !lv || !img) return;

    const team = getReserveTeam();
    if(!team.length){
      teamPreviewIndex = 0;
      count.textContent = "0/3";
      name.textContent = "Nessun Pokémon";
      lv.textContent = "";
      img.style.display = "none";
      if(prev) prev.disabled = true;
      if(nextBtn) nextBtn.disabled = true;
      return;
    }

    teamPreviewIndex = Math.max(0, Math.min(teamPreviewIndex, team.length - 1));
    const p = team[teamPreviewIndex];
    count.textContent = `${teamPreviewIndex + 1}/${team.length}`;
    name.textContent = p.nome || "Pokémon";
    lv.textContent = `LV ${PokeMisteryRL_LevelSystem.getLevel(p)}`;
    img.src = sprite(p.immagine);
    img.alt = p.nome || "Pokémon";
    img.style.display = "block";
    /*
     * I pulsanti devono essere gestiti direttamente qui, dopo ogni
     * refresh del Bottom. In questo modo un re-render non lascia
     * i vecchi handler o uno stato disabled errato.
     */
    const canRotate = team.length > 1;

    if(prev){
      prev.disabled = !canRotate;
      prev.style.pointerEvents = canRotate ? "auto" : "none";
      prev.onclick = canRotate
        ? function(e){
            e.preventDefault();
            e.stopPropagation();
            changeTeamPreview(-1);
          }
        : null;
    }

    if(nextBtn){
      nextBtn.disabled = !canRotate;
      nextBtn.style.pointerEvents = canRotate ? "auto" : "none";
      nextBtn.onclick = canRotate
        ? function(e){
            e.preventDefault();
            e.stopPropagation();
            changeTeamPreview(1);
          }
        : null;
    }
  };

  const changeTeamPreview = (delta) => {
    const team = getReserveTeam();

    if(!team.length){
      teamPreviewIndex = 0;
      refreshTeamViewer();
      return;
    }

    const step = Number(delta) || 0;

    teamPreviewIndex =
      (teamPreviewIndex + step + team.length) % team.length;

    refreshTeamViewer();
  };

  const showInventory = () => {
    const main = $("rightMainPanel");
    const inv = $("rightInventoryPanel");
    if(main) main.style.display = "none";
    if(inv) inv.style.display = "flex";
    refreshInventoryPanel();
  };

  const hideInventory = () => {
    const main = $("rightMainPanel");
    const inv = $("rightInventoryPanel");
    if(inv) inv.style.display = "none";
    if(main) main.style.display = "flex";
  };

  const refreshInventoryPanel = () => {
    const itemsEl = $("inventoryItems");
    const eggsEl = $("inventoryEggs");
    const incubatorSteps = $("incubatorStepsInv");
    if(!itemsEl || !eggsEl) return;

    const items = getRunInventory().map(formatInventoryEntry).filter(Boolean);
    const eggs = getRunEggs().map(formatEggEntry).filter(Boolean);

    itemsEl.innerHTML = items.length
      ? items.map(x => `<div class="inventory-entry"><span class="inventory-icon">${x.icon}</span><span class="inventory-name">${x.name}</span><b>x${x.qty}</b></div>`).join("")
      : `<div class="inventory-empty">Inventario vuoto</div>`;

    eggsEl.innerHTML = eggs.length
      ? eggs.map(x => `<div class="inventory-entry"><span class="inventory-icon">${x.icon}</span><span class="inventory-name">${x.name}</span><b>x${x.qty}</b></div>`).join("")
      : `<div class="inventory-empty">Nessun uovo</div>`;

    const inc = PKM_RUN?.incubator || PKM_RUN?.incubatore || {};
    if(incubatorSteps){
      const steps = Number(inc.steps ?? inc.passi ?? inc.remaining ?? inc.passirimanenti ?? 0) || 0;
      incubatorSteps.textContent = `Passi: ${steps}`;
    }
  };

  const buildBottomPanelTemplate = () => `

  <div id="bottomPanel" class="bottom-v8">

    <div class="b8-left">
      <div id="starter1Box" class="b8-pokemon-slot" onclick="openStarterPreview()">
        <img id="sideSprite" src="" alt="Starter 1">
      </div>

      <div id="starter2Slot" class="b8-pokemon-slot" onclick="openSecondPreview()">
        <span id="starter2Placeholder">+ S2</span>
        <img id="starter2Sprite" src="" alt="Starter 2" style="display:none">
      </div>
    </div>

    <div class="b8-center">
      <div class="b8-top">
        <span id="sideName" class="b8-name">-</span>
        <span class="b8-lv">LV <b id="levelVal">1</b></span>
        <div id="sideTyping" class="b8-typing"></div>
      </div>

      <div class="b8-bars">
        <div class="b8-bar-row">
          <span class="b8-icon">❤️</span>
          <div class="b8-bar-bg"><div id="hpFillSide" class="b8-fill hp" style="width:0%"></div></div>
          <span id="hpTextSide" class="b8-value">HP 0/0</span>
        </div>
      </div>

      <div class="b8-stats">
        <span>ATK <b id="atkVal">0</b></span>
        <span>DEF <b id="defVal">0</b></span>
        <span>SPD <b id="spdVal">0</b></span>
      </div>

      <div id="s2HudSection" class="b8-s2-section" style="display:none">
        <div class="b8-s2-header">
          <span id="s2Name" class="b8-s2-name">Partner</span>
          <span id="s2Level" class="b8-s2-level">LV 1</span>
          <div id="s2Typing" class="b8-typing b8-s2-typing"></div>
        </div>
        <div class="b8-bars">
          <div class="b8-bar-row">
            <span class="b8-icon">❤️</span>
            <div class="b8-bar-bg"><div id="s2HpBar" class="b8-fill hp" style="width:0%"></div></div>
            <span id="s2HpTxt" class="b8-value">HP</span>
          </div>
        </div>
        <div class="b8-stats">
          <span>ATK <b id="s2AtkVal">0</b></span>
          <span>DEF <b id="s2DefVal">0</b></span>
          <span>SPD <b id="s2SpdVal">0</b></span>
        </div>
      </div>

      <div
        id="quickItemSlots"
        class="b8-quick-items"
        aria-label="Oggetti rapidi"
      >
        ${Array.from({length:5},(_,i)=>`
          <div
            class="b8-quick-item empty"
            data-quick-item-slot="${i}"
          >
            <span class="quick-item-icon">+</span>
            <small></small>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="b8-right">

      <div id="rightMainPanel" class="b8-right-main">
        <div class="b8-money">
          <span class="b8-money-icon">💰</span>
          <b id="bits">0</b>
        </div>

        <div class="b8-incubator">
          <span>🥚</span>
          <div>
            <b>INCUBATORE</b>
            <small id="incubatorSteps">Passi: 0</small>
          </div>
        </div>

        <div id="teamViewer" class="b8-team-viewer">
          <div class="b8-team-header">
            <span>SQUADRA</span>
            <b id="teamCount">0/3</b>
          </div>
          <div class="b8-team-image-wrap">
            <button id="teamPrevBtn" class="team-nav" onclick="changeTeamPreview(-1)">◀</button>
            <img id="teamViewerSprite" src="" alt="Squadra" style="display:none">
            <button id="teamNextBtn" class="team-nav" onclick="changeTeamPreview(1)">▶</button>
          </div>
          <div id="teamViewerName" class="b8-team-viewer-name">Nessun Pokémon</div>
          <small id="teamViewerLevel" class="b8-team-viewer-level"></small>
        </div>

        <button class="b8-inventory-btn" onclick="showInventory()">🎒 INVENTARIO</button>
      </div>

      <div id="rightInventoryPanel" class="b8-inventory-panel" style="display:none">
        <div class="b8-inventory-title">🎒 INVENTARIO</div>

        <div class="b8-inventory-section">
          <b>OGGETTI</b>
          <div id="inventoryItems" class="inventory-list"></div>
        </div>

        <div class="b8-inventory-section">
          <b>UOVA</b>
          <div id="inventoryEggs" class="inventory-list"></div>
        </div>

        <div class="b8-inventory-incubator">
          🥚 <span id="incubatorStepsInv">Passi: 0</span>
        </div>

        <button class="b8-inventory-close" onclick="hideInventory()">◀ INDIETRO</button>
      </div>

    </div>
  </div>

  <section id="runLogPanel" class="run-log-panel">
    <button id="runLogToggle" class="run-log-toggle" onclick="toggleRunLog()">
      <span>📜 RUN LOG</span><span id="runLogArrow">▼</span>
    </button>
    <div id="runLogContent" class="run-log-content"></div>
  </section>

  `;

  const refreshBottomPanel = () => {

    if (!PKM_RUN) {
      return;
    }


    const p =
      getActivePokemon();


    if (!p) {
      return;
    }


    const sE =
      $("sideSprite");


    if (sE) {

      sE.src =
        sprite(
          p.immagine
        );
    }


    if ($("sideName")) {

      $("sideName").textContent =
        p.nome;
    }


    const level =
      PokeMisteryRL_LevelSystem.getLevel(
        p
      );


    if ($("levelVal")) {

      $("levelVal").textContent =
        level;
    }


    if ($("bits")) {

      $("bits").textContent =
        PKM_RUN.bits ?? 0;
    }


    if ($("atkVal")) {

      $("atkVal").textContent =
        p.stats?.atk ?? 0;
    }


    if ($("defVal")) {

      $("defVal").textContent =
        p.stats?.dif ?? 0;
    }


    if ($("spdVal")) {

      $("spdVal").textContent =
        p.stats?.spd ?? 0;
    }


    const s2 =
      PKM_RUN.secondActive;

    const s2Section =
      $("s2HudSection");

    if (s2Section) {

      if (s2) {

        s2Section.style.display =
          "block";

        if ($("s2Name")) {
          $("s2Name").textContent =
            s2.nome || "Partner";
        }

        if ($("s2Level")) {
          $("s2Level").textContent =
            `LV ${PokeMisteryRL_LevelSystem.getLevel(s2)}`;
        }

        if ($("s2Typing")) {
          $("s2Typing").innerHTML =
            (s2.tipi || [])
              .map(getTypingBadge)
              .join("");
        }

        const s2MaxHp =
          Math.max(
            1,
            Number(s2.maxHp) || 1
          );

        const s2Hp =
          clamp(
            Number(s2.hp) || 0,
            0,
            s2MaxHp
          );

        const s2Percent =
          clamp(
            s2Hp / s2MaxHp * 100,
            0,
            100
          );

        if ($("s2HpBar")) {
          $("s2HpBar").style.width =
            s2Percent + "%";
        }

        if ($("s2HpTxt")) {
          $("s2HpTxt").textContent =
            `${s2Hp}/${s2MaxHp}`;
        }

        if ($("s2AtkVal")) {
          $("s2AtkVal").textContent =
            s2.stats?.atk ?? 0;
        }

        if ($("s2DefVal")) {
          $("s2DefVal").textContent =
            s2.stats?.dif ?? 0;
        }

        if ($("s2SpdVal")) {
          $("s2SpdVal").textContent =
            s2.stats?.spd ?? 0;
        }

      } else {

        s2Section.style.display =
          "none";

      }
    }


    updateHPBar();


    if ($("sideTyping")) {

      $("sideTyping").innerHTML =

        (p.tipi || [])

          .map(
            getTypingBadge
          )

          .join("");
    }


    /*
     * OGGETTI RAPIDI — 5 slot del DB_ITEMS nel CENTER.
     * Mostriamo gli oggetti realmente presenti nella run.
     */

    /*
     * Dettaglio oggetto rapido.
     * Il click apre descrizione + pulsante EQUIPAGGIA.
     */
    if(!window.__quickItemDetailHandlers){

      window.__quickItemDetailHandlers = true;

      window.openQuickItemDetail = (
        itemId
      ) => {

        const db =
          window.PokeMisteryRL_Items?.DB_ITEMS ||
          window.DB_ITEMS ||
          null;

        const item =
          db && typeof db === "object"
            ? (
                db[itemId] ||
                Object.values(db).find(
                  x =>
                    x &&
                    String(x.id) ===
                    String(itemId)
                )
              )
            : null;

        if(!item){
          msg("Oggetto non disponibile.");
          return;
        }

        const name =
          item.nome ||
          item.name ||
          item.id ||
          "Oggetto";

        const description =
          item.descrizione ||
          item.description ||
          item.effetto ||
          item.effect ||
          "Nessuna descrizione disponibile.";

        const rarity =
          item.rarita ||
          item.rarity ||
          "comune";

        modal(`
          <div class="center quick-item-detail">

            <div class="quick-item-detail-icon">
              ${item.icon || "◈"}
            </div>

            <h2>
              ${name}
            </h2>

            <div class="quick-item-detail-rarity">
              ${rarity}
            </div>

            <p class="quick-item-detail-description">
              ${description}
            </p>

            <button
              type="button"
              onclick="equipQuickItem('${String(item.id).replace(/'/g,"\\'")}')"
            >
              ⭐ EQUIPAGGIA
            </button>

            <button
              type="button"
              onclick="closeModal()"
            >
              INDIETRO
            </button>

          </div>
        `);
      };

      window.equipQuickItem = (
        itemId
      ) => {

        if(!PKM_RUN){
          return false;
        }

        const db =
          window.PokeMisteryRL_Items?.DB_ITEMS ||
          window.DB_ITEMS ||
          null;

        const item =
          db && typeof db === "object"
            ? (
                db[itemId] ||
                Object.values(db).find(
                  x =>
                    x &&
                    String(x.id) ===
                    String(itemId)
                )
              )
            : null;

        if(!item){
          msg("Oggetto non disponibile.");
          return false;
        }

        /*
         * Se il sistema oggetti esterno espone un metodo di equipaggiamento,
         * usiamolo. In caso contrario salviamo comunque l'oggetto selezionato
         * nello stato run senza consumarlo.
         */
        const api =
          window.PokeMisteryRL_Items ||
          null;

        let equipped = false;

        const methods = [
          "equipItem",
          "equip",
          "setEquipped"
        ];

        for(const method of methods){

          if(
            api &&
            typeof api[method] === "function"
          ){

            try{

              const result =
                api[method](
                  item.id,
                  PKM_RUN.activePokemon
                );

              if(result !== false){
                equipped = true;
              }

            }catch(e){

              console.warn(
                "Equip item API error:",
                e
              );

            }

            break;
          }
        }

        if(!equipped){

          if(!Array.isArray(PKM_RUN.equippedItems)){
            PKM_RUN.equippedItems = [];
          }

          const oldIndex =
            PKM_RUN.equippedItems.findIndex(
              x =>
                x &&
                String(x.id) ===
                String(item.id)
            );

          const record = {
            id:item.id,
            nome:item.nome || item.name || item.id,
            icon:item.icon || item.emoji || "📦"
          };

          if(oldIndex >= 0){
            PKM_RUN.equippedItems[oldIndex] =
              record;
          }else{
            PKM_RUN.equippedItems.push(
              record
            );
          }
        }

        refreshBottomPanel();

        msg(
          `⭐ ${item.nome || item.name || item.id} equipaggiato!`
        );

        closeModal();

        return true;
      };

    }


    const quickItemSlots =
      $("quickItemSlots");

    if(quickItemSlots){

      const inventory =
        Array.isArray(PKM_RUN.items)
          ? PKM_RUN.items
          : Array.isArray(PKM_RUN.inventory)
            ? PKM_RUN.inventory
            : [];

      const db =
        window.PokeMisteryRL_Items?.DB_ITEMS ||
        window.DB_ITEMS ||
        null;

      const getDbItem = (entry) => {

        if(!entry){
          return null;
        }

        const id =
          typeof entry === "object"
            ? entry.id
            : entry;

        if(
          db &&
          typeof db === "object"
        ){

          return (
            db[id] ||
            Object.values(db).find(
              item =>
                item &&
                String(item.id) ===
                String(id)
            ) ||
            null
          );

        }

        return null;
      };

      const quickItems =
        inventory
          .map(entry => {

            const item =
              getDbItem(entry);

            const qty =
              typeof entry === "object"
                ? Number(
                    entry.qty ??
                    entry.quantity ??
                    entry.quantita ??
                    1
                  ) || 1
                : 1;

            return {
              item,
              qty
            };

          })
          .filter(
            x =>
              x.item &&
              x.qty > 0
          )
          .slice(0,5);

      const slots =
        quickItemSlots.querySelectorAll(
          "[data-quick-item-slot]"
        );

      slots.forEach(
        (slot,index) => {

          const data =
            quickItems[index];

          if(!data){

            slot.classList.add("empty");

            slot.innerHTML =
              `<span class="quick-item-icon">+</span><small></small>`;

            slot.title =
              "Slot oggetto vuoto";

            return;
          }

          const item =
            data.item;

          slot.classList.remove("empty");

          slot.innerHTML = `
            <span class="quick-item-icon">
              ${item.icon || "◈"}
            </span>

            <small>
              x${data.qty}
            </small>
          `;

          slot.title =
            `${item.nome || item.name || item.id} x${data.qty}`;

        }
      );

    }


    renderTeamSlots();
    refreshTeamViewer();

    const inc = PKM_RUN?.incubator || PKM_RUN?.incubatore || {};
    const steps = Number(inc.steps ?? inc.passi ?? inc.remaining ?? inc.passirimanenti ?? 0) || 0;
    if($("incubatorSteps")) $("incubatorSteps").textContent = `Passi: ${steps}`;
    refreshInventoryPanel();
  };


  // MAPPA

  const render = () => {

    if (!PKM_RUN) {
      return;
    }


    refreshBottomPanel();


    const map =
      $("map");


    if (!map) {
      return;
    }


    map.replaceChildren();


    const icons = {

      free: "⬇️",

      fight: "⚔️",

      boss: "👹",

      meat: "🍖",

      skill: "📈",

      shop: "🏪",

      event: "❓",

      rifugio: "🏠"

    };


    PKM_RUN.map.forEach(row => {

      const rowEl =
        document.createElement(
          "div"
        );


      rowEl.className =
        "map-row";


      row.forEach(node => {

        let cn =
          "node " +
          node.type;


        if (node.done) {

          cn += " done";

        } else if (

          node.row === PKM_RUN.row &&

          node.col === PKM_RUN.col

        ) {

          cn += " current";

        } else if (node.ok) {

          cn += " available";

        } else {

          cn += " locked";
        }


        const el =
          document.createElement(
            "div"
          );


        el.id =
          `n-${node.id}`;


        el.className =
          cn;


        /*
         * I nodi non attivi restano presenti come placeholder.
         * Soprattutto: NON ricevono pick(), così un click su un nodo
         * non raggiungibile non può bloccare la run.
         */
        const activeNode =
          node.ok === true ||
          (node.row === PKM_RUN.row && node.col === PKM_RUN.col);

        const isBattleNode =
          node.type === "fight" ||
          node.type === "boss";

        if(
          isBattleNode &&
          node.enemyPreview &&
          node.enemyPreview.immagine &&
          (node.ok || node.done || activeNode)
        ){

          el.innerHTML = `
            <span class="map-enemy-preview-crop" aria-hidden="true">
              <img
                class="map-enemy-preview-final"
                src="${sprite(node.enemyPreview.immagine)}"
                alt="${node.enemyPreview.nome || "Nemico"}"
              >
            </span>
            <span class="map-sword-final" aria-hidden="true">⚔️</span>
          `;

          el.onclick =
            () => pick(node);

        }else if (activeNode || node.done) {

          el.textContent =
            icons[node.type] ||
            "❓";

          el.onclick =
            () => pick(node);

        } else {

          el.classList.add("map-placeholder");
          el.textContent = "•";
          el.onclick = null;
          el.removeAttribute("onclick");
          el.setAttribute("aria-hidden", "true");
          el.title = "Nodo non disponibile";

        }


        rowEl.appendChild(el);

      });


      map.appendChild(rowEl);

    });


    if (!mapResizeObserver) {

      mapResizeObserver =
        new ResizeObserver(

          () =>
            PokeMisteryRL.Map
              .drawMapLines()

        );

      mapResizeObserver.observe(
        map
      );
    }


    setTimeout(

      PokeMisteryRL.Map
        .drawMapLines,

      50

    );
  };


  // BATTLE HP

  const updateBattleHP = () => {

    if(!PKM_RUN?.battle){
      return;
    }

    const s1 =
      PKM_RUN.activePokemon;

    const s2 =
      PKM_RUN.secondActive;

    const battle =
      PKM_RUN.battle;

    const enemy =
      battle.enemy;


    const updateOne = (
      pokemon,
      hp,
      maxHp,
      barId,
      textId
    ) => {

      if(!pokemon){
        return;
      }

      const safeMax =
        Math.max(
          1,
          Number(maxHp) || 1
        );

      const safeHp =
        clamp(
          Number(hp) || 0,
          0,
          safeMax
        );

      const percent =
        safeHp / safeMax * 100;


      const bar =
        $(barId);

      if(bar){
        bar.style.width =
          `${percent}%`;
      }


      const text =
        $(textId);

      if(text){
        text.textContent =
          `HP ${safeHp}/${safeMax}`;
      }

    };


    updateOne(
      s1,
      s1?.hp,
      s1?.maxHp,
      "battleS1HpBar",
      "battleS1HpTxt"
    );


    /*
     * S2: aggiorna direttamente il pannello del fight.
     * Non dipende dal pannello Bottom e non usa ID duplicati.
     */
    if(s2){

      const s2Max =
        Math.max(
          1,
          Number(s2.maxHp) || 1
        );

      const s2Current =
        clamp(
          Number(s2.hp) || 0,
          0,
          s2Max
        );

      const s2Percent =
        s2Current / s2Max * 100;

      const s2Bar =
        document.querySelector(
          "#battleFinal #battleS2HpBar"
        );

      if(s2Bar){
        s2Bar.style.width =
          `${s2Percent}%`;
      }

      const s2Text =
        document.querySelector(
          "#battleFinal #battleS2HpTxt"
        );

      if(s2Text){
        s2Text.textContent =
          `HP ${s2Current}/${s2Max}`;
      }

    }


    updateOne(
      enemy,
      battle.hp,
      battle.maxHp,
      "battleEnemyHpBar",
      "battleEnemyHpTxt"
    );


    const s2Sprite =
      document.querySelector(
        "#battleFinal .bf-sprite.s2"
      );


    if(
      s2Sprite &&
      s2 &&
      Number(s2.hp) <= 0
    ){
      s2Sprite.classList.add(
        "dead"
      );
    }

  };


  // BATTLE TEMPLATE

  const buildBattleTemplate =
    (isBoss, floor) => {

      const s1 = PKM_RUN?.activePokemon;
      const s2 = PKM_RUN?.secondActive;
      const battle = PKM_RUN?.battle;
      const enemy = battle?.enemy;

      if(!s1 || !enemy){
        return `
          <div id="battleFinal">
            <div class="center">
              <h2>BATTAGLIA NON DISPONIBILE</h2>
              <p>S1 o il nemico non sono disponibili.</p>
            </div>
          </div>
        `;
      }

      const buildCard = (
        pokemon,
        cls,
        hpBarId,
        hpTextId,
        enemyCard = false
      ) => {

        if(!pokemon){
          return `
            <div class="bf-hp ${cls} empty">
              <div class="bf-name-row">
                <b>S2</b>
              </div>
              <div class="bar">
                <div id="${hpBarId}" style="width:0%"></div>
              </div>
              <span id="${hpTextId}">HP 0/0</span>
            </div>
          `;
        }

        const hpValue = enemyCard
          ? Number(battle?.hp) || 0
          : Number(pokemon.hp) || 0;

        const maxHpValue = Math.max(
          1,
          Number(
            enemyCard
              ? battle?.maxHp
              : pokemon.maxHp
          ) || 1
        );

        const hpPercent = clamp(
          hpValue / maxHpValue * 100,
          0,
          100
        );

        return `
          <div class="bf-hp ${cls}">

            <div class="bf-name-row">
              <b>${pokemon.nome}</b>
            </div>

            <div class="bar">
              <div
                id="${hpBarId}"
                style="width:${hpPercent}%"
              ></div>
            </div>

            <span
              id="${hpTextId}"
              class="bf-hp-text"
            >
              HP ${hpValue}/${maxHpValue}
            </span>

          </div>
        `;
      };

      const enemyCard = {
        ...enemy,
        hp:battle.hp,
        maxHp:battle.maxHp
      };

      return `
        <div id="battleFinal">

          <div class="bf-top">

            ${buildCard(
              s1,
              "blue",
              "battleS1HpBar",
              "battleS1HpTxt"
            )}

            ${buildCard(
              s2,
              "green",
              "battleS2HpBar",
              "battleS2HpTxt"
            )}

            ${buildCard(
              enemyCard,
              "red",
              "battleEnemyHpBar",
              "battleEnemyHpTxt",
              true
            )}

          </div>

          <div class="bf-field">

            <div class="bf-sprite s1">
              <img
                src="${sprite(s1.immagine)}"
                alt="${s1.nome}"
              >
            </div>

            ${
              s2
                ? `
                  <div class="bf-sprite s2">
                    <img
                      src="${sprite(s2.immagine)}"
                      alt="${s2.nome}"
                    >
                  </div>
                `
                : `
                  <div class="bf-sprite s2 empty">
                    <div class="bf-empty-slot">S2</div>
                  </div>
                `
            }

            <div class="bf-sprite enemy">
              <img
                src="${sprite(enemy.immagine)}"
                alt="${enemy.nome}"
              >
            </div>

          </div>

          <div class="bf-logRow">

            <div
              class="bf-log"
              id="blog"
            ></div>

            <div class="bf-fleeBox">

              ${
                !isBoss
                  ? `
                    <button
                      class="btn-flee"
                      onclick="flee()"
                    >
                      🏃 FUGGI
                    </button>
                  `
                  : ""
              }

            </div>

          </div>

        </div>
      `;
    };


  const hitShake = (target) => {

    let selector;


    if (target === "enemy") {

      selector =
        ".bf-sprite.enemy";

    } else if (target === "s2") {

      selector =
        ".bf-sprite.s2";

    } else {

      selector =
        ".bf-sprite.s1";
    }


    const w =
      document.querySelector(
        selector
      );


    if (!w) {
      return;
    }


    w.classList.remove(
      "hit"
    );


    void w.offsetWidth;


    w.classList.add(
      "hit"
    );
  };


  // DAMAGE NUMBERS

  const spawnDamage =
    (
      target,
      value,
      type = "normal"
    ) => {

      let selector;


      if (target === "enemy") {

        selector =
          ".bf-sprite.enemy";

      } else if (target === "s2") {

        selector =
          ".bf-sprite.s2";

      } else {

        selector =
          ".bf-sprite.s1";
      }


      const w =
        document.querySelector(
          selector
        );


      if (!w) {
        return;
      }


      const el =
        document.createElement(
          "div"
        );


      el.className =
        `dmg-num ${target} ${type}`;


      el.textContent =

        type === "heal"

          ? `+${fmt(value)}`

          : type === "crit"

            ? `${fmt(value)}!`

            : `-${fmt(value)}`;


      w.appendChild(el);


      setTimeout(

        () => el.remove(),

        900

      );
    };


  // INFO POKEMON

  const openPokeInfo = (index) => {

    const pokemon =

      index === -1

        ? getActivePokemon()

        : PKM_RUN?.teamSlots?.[index];


    if (!pokemon) {
      return;
    }


    if ($("pokeInfoSprite"))

      $("pokeInfoSprite").src =
        sprite(
          pokemon.immagine
        );


    if ($("pokeInfoName"))

      $("pokeInfoName").textContent =

        pokemon.nome +

        (
          index === -1
            ? " [STARTER]"
            : ""
        );


    if ($("pokeInfoTypes"))

      $("pokeInfoTypes").innerHTML =

        pokemon.tipi

          .map(
            getTypingBadge
          )

          .join("");


    if ($("piHp"))

      $("piHp").textContent =
        `${pokemon.hp}/${pokemon.maxHp}`;


    if ($("piAtk"))

      $("piAtk").textContent =
        pokemon.stats.atk;


    if ($("piAtkR"))

      $("piAtkR").textContent =

        pokemon.rolls?.atk

          ? `(${fmtIV(
              pokemon.rolls.atk
            )})`

          : "";


    if ($("piDef"))

      $("piDef").textContent =
        pokemon.stats.dif;


    if ($("piDefR"))

      $("piDefR").textContent =

        pokemon.rolls?.dif

          ? `(${fmtIV(
              pokemon.rolls.dif
            )})`

          : "";


    if ($("piSpd"))

      $("piSpd").textContent =
        pokemon.stats.spd;


    if ($("piSpdR"))

      $("piSpdR").textContent =

        pokemon.rolls?.spd

          ? `(${fmtIV(
              pokemon.rolls.spd
            )})`

          : "";


    if ($("piCrit"))

      $("piCrit").textContent =
        pokemon.crit ?? 0;


    if ($("piEva"))

      $("piEva").textContent =
        pokemon.eva ?? 0;


    if ($("piStun"))

      $("piStun").textContent =
        pokemon.stun ?? 0;


    if ($("piFel"))

      $("piFel").textContent =
        pokemon.fel ?? 0;


    const actions =
      $("pokeInfoActions");


    if (actions) {

      actions.innerHTML =

        index >= 0

          ? `

            <button
              class="danger"
              onclick="releasePoke(${index})"
            >
              Abbandona
            </button>

          `

          : `

            <small class="small">

              Starter attuale -

              LV ${
                PokeMisteryRL_LevelSystem
                  .getLevel(pokemon)
              }

            </small>

          `;
    }


    $("pokeInfo")
      ?.classList.remove(
        "hidden"
      );
  };


  const closePokeInfo = () =>
    $("pokeInfo")
      ?.classList.add(
        "hidden"
      );


  return {

    buildBottomPanelTemplate,

    refreshBottomPanel,

    render,

    updateBattleHP,

    buildBattleTemplate,

    hitShake,

    spawnDamage,

    openPokeInfo,

    closePokeInfo

  };

})();


  
const recruitLevel = (p) =>
  Math.max(1, Number(p?.level) || 1);

const recruitSkill = (p) => {

  if(!p) return null;

  if(
    Array.isArray(p.skills) &&
    p.skills.length
  ){
    return p.skills[p.skills.length - 1];
  }

  return null;
};

const recruitCard = (
  pokemon,
  title
) => {

  if(!pokemon){
    return `
      <div class="recruit-empty">
        Nessun Pokémon
      </div>
    `;
  }

  const sk =
    recruitSkill(pokemon);

  return `
    <div class="recruit-card">

      <div class="recruit-card-title">
        ${title}
      </div>

      <div class="recruit-card-main">

        <div class="recruit-card-sprite">
          <img
            src="${sprite(pokemon.immagine)}"
            alt="${pokemon.nome || "Pokémon"}"
          >
        </div>

        <div class="recruit-card-info">

          <b class="recruit-name">
            ${pokemon.nome || "Pokémon"}
          </b>

          <span>
            LV ${recruitLevel(pokemon)}
          </span>

          <span>
            HP ${pokemon.hp ?? 0}/${pokemon.maxHp ?? 0}
          </span>

          <div class="recruit-skill">
            <small>SKILL</small>
            <b>
              ${
                sk?.name ||
                sk?.nome ||
                "--"
              }
            </b>
            <span>
              PWR ${
                sk?.pwr ??
                sk?.power ??
                "--"
              }
            </span>
          </div>

        </div>

      </div>

      <div class="recruit-stats">

        <div>
          <small>ATK</small>
          <b>${pokemon.stats?.atk ?? 0}</b>
        </div>

        <div>
          <small>DEF</small>
          <b>${pokemon.stats?.dif ?? 0}</b>
        </div>

        <div>
          <small>SPD</small>
          <b>${pokemon.stats?.spd ?? 0}</b>
        </div>

      </div>

    </div>
  `;
};

const getFullTeamSwitchOptions = () => {

  const options = [];

  if(PKM_RUN?.secondActive){

    options.push({
      key:"s2",
      label:"S2",
      pokemon:PKM_RUN.secondActive
    });
  }

  (PKM_RUN?.teamSlots || [])
    .forEach(
      (pokemon,index) => {

        if(!pokemon) return;

        options.push({
          key:String(index),
          label:`RISERVA ${index + 1}`,
          pokemon
        });
      }
    );

  return options;
};

const showFullTeamSwitch = () => {

  const pending =
    window._pendingRecruitment;

  if(!pending){
    return;
  }

  const options =
    getFullTeamSwitchOptions();

  modal(`
    <div class="recruitment-box recruit-full-team">

      <button
        type="button"
        class="recruit-close-x"
        onclick="closeModal(); busy=0; PokeMisteryRL.UI.render();"
      >
        ✕
      </button>

      <h2>
        ⭐ NUOVO POKÉMON
      </h2>

      ${recruitCard(
        pending.pokemon,
        "POKÉMON DA RECLUTARE"
      )}

      <div class="recruit-divider">
        SQUADRA PIENA — SCEGLI CHI SOSTITUIRE
      </div>

      <div class="recruit-options">

        ${
          options.length
            ? options.map(option => `
                <button
                  type="button"
                  class="recruit-option" data-recruit-key="${option.key}"
                  onclick="event.preventDefault(); event.stopPropagation(); window.compareRecruitment('${option.key}');"
                >

                  <img
                    src="${sprite(option.pokemon.immagine)}"
                    alt="${option.pokemon.nome || "Pokémon"}"
                  >

                  <span>
                    <b>
                      ${option.pokemon.nome || "Pokémon"}
                    </b>
                    <small>
                      ${option.label} · LV ${recruitLevel(option.pokemon)}
                    </small>
                  </span>

                  <strong>
                    SOSTITUISCI
                  </strong>

                </button>
              `).join("")
            : `
                <div class="recruit-empty">
                  Nessun Pokémon sostituibile.
                </div>
              `
        }

      </div>

    </div>
  `);
};

// EXPORT

const {
  render,
  refreshBottomPanel,
  buildBottomPanelTemplate
} =
  PokeMisteryRL.UI;


const {
  fight,
  flee,
  gameover
} =
  PokeMisteryRL.Battle;


const openPokeInfo =
  PokeMisteryRL.UI.openPokeInfo;


const closePokeInfo =
  PokeMisteryRL.UI.closePokeInfo;


// #endregion
// #region 17 - EXPORT + 18 - AVVIO
window.openStarterPreview = () => {

  const p = PKM_RUN?.activePokemon;

  if(!p){
    msg("Nessuno Starter1 disponibile");
    return;
  }

  fillPreview(p, `
    <p style="opacity:.5;font-size:11px">
      Starter principale
    </p>
  `);
};

window.openSecondPreview = () => {

  if(!PKM_RUN) return;

  const s1 =
    PKM_RUN.activePokemon;

  const current =
    PKM_RUN.secondActive;

  if(!s1){
    msg("Nessuno Starter1 disponibile");
    return;
  }

  const team =
    (PKM_RUN.teamSlots || [])
      .map((p,i) => ({p,i}))
      .filter(
        x =>
          x.p &&
          x.p !== s1
      );

  let choices = `
    <div style="
      margin-top:10px;
      padding-top:8px;
      border-top:1px solid rgba(49,85,121,.45);
    ">
      <div style="
        font-size:11px;
        font-weight:bold;
        margin-bottom:7px;
        color:#55d9ff;
      ">
        ⭐ SCEGLI COMPAGNO S2
      </div>

      <div style="
        font-size:9px;
        opacity:.65;
        margin-bottom:7px;
      ">
        Seleziona un Pokémon della squadra.
      </div>
  `;

  if(!team.length){

    choices += `
      <div style="
        padding:10px;
        text-align:center;
        opacity:.6;
        font-size:9px;
      ">
        Nessun altro Pokémon nella squadra.
      </div>
    `;

  }else{

    choices += `
      <div class="s2-choice-list">

        ${team.map(({p,i}) => {

          const isCurrent =
            current === p;

          const types =
            (p.tipi || [])
              .slice(0,2)
              .map(
                t =>
                  `<span class="type-badge type-${t}">${t}</span>`
              )
              .join("");

          return `
            <button
              type="button"
              class="s2-choice-card ${isCurrent ? "selected" : ""}"
              data-s2-index="${i}"
              onclick="PokeMisteryRL.TeamRoster.equipAsSecond(${i}); return false;"
            >

              <img
                src="${sprite(p.immagine)}"
                alt="${p.nome || "Pokémon"}"
              >

              <div class="s2-choice-info">

                <b>
                  ${p.nome || "Pokémon"}
                </b>

                <span>
                  LV ${p.level || 1}
                </span>

                <span>
                  HP ${p.hp ?? 0}/${p.maxHp ?? 0}
                </span>

                <span class="s2-choice-types">
                  ${types}
                </span>

              </div>

              ${
                isCurrent
                  ? `<strong class="s2-current">S2</strong>`
                  : ""
              }

            </button>
          `;

        }).join("")}

      </div>
    `;
  }

  choices += `</div>`;

  if(current){

    choices += `
      <div style="margin-top:8px">

        <button
          type="button"
          onclick="unequipSecond()"
        >
          ⬇️ Togli compagno
        </button>

        <button
          type="button"
          onclick="releaseSecond()"
          class="danger"
        >
          🗑️ Rilascia S2
        </button>

      </div>
    `;
  }

  /*
   * La tab S2 mostra S2 sopra, non S1.
   * Se S2 non è ancora equipaggiato, mostriamo un placeholder
   * mantenendo la stessa struttura della tab S1.
   */
  if(current){

    fillPreview(
      current,
      choices
    );

  }else{

    /*
     * Nessun S2 equipaggiato:
     * niente anteprima vuota e niente S1 al posto di S2.
     * Mostriamo solo il box informativo + la lista dei Pokémon
     * disponibili come compagno.
     */
    modal(`
      <div class="center">

        <div style="
          padding:10px;
          border:1px solid rgba(49,85,121,.55);
          border-radius:10px;
          background:rgba(7,19,33,.75);
          margin-bottom:8px;
        ">

          <div style="
            font-size:12px;
            font-weight:bold;
            color:#55d9ff;
            margin-bottom:5px;
          ">
            S2 NON EQUIPAGGIATO
          </div>

          <div style="
            font-size:9px;
            opacity:.7;
          ">
            Scegli un Pokémon della squadra da usare come compagno S2.
          </div>

        </div>

        ${choices}

        <button
          type="button"
          class="s2-tab-close"
          onclick="closeModal(); busy=0; PokeMisteryRL.UI.render();"
          aria-label="Chiudi"
          title="Chiudi"
        >
          ✕
        </button>

      </div>
    `);

  }
};

window.openTeamPreview = (i) => {
  const p = PKM_RUN?.teamSlots?.[i];
  if (!p) return;

  // usa fillPreview se esiste, altrimenti fallback manuale
  if (typeof fillPreview === 'function') {
    fillPreview(p, `
      <p style="font-size:11px;opacity:.6;margin:0 0 8px">ID ${p.id} | ${(p.tipi||[]).join('/')} | LV ${p.level||1} | HP ${p.hp}/${p.maxHp}</p>
      <div class="pp-actions" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button onclick="equipAsSecond(${i})">⭐ Imposta compagno</button>
        ${typeof equipToStarter === 'function'? `<button onclick="equipToStarter(0,${i})">➡️ S1</button><button onclick="equipToStarter(1,${i})">➡️ S2</button>` : ``}
        <button onclick="releasePoke(${i})">🗑️ Rilascia</button>
      </div>
    `);
  } else {
    // fallback vecchio se fillPreview non c'è
    document.getElementById('ppSprite').src = sprite(p.immagine);
    document.getElementById('ppName').textContent = p.nome;
    document.getElementById('ppLevel').textContent = `LV ${p.level||1}`;
    document.getElementById('ppHpText').textContent = `${p.hp}/${p.maxHp}`;
    document.getElementById('ppTypes').innerHTML = (p.tipi||[]).map(t=>`<span class="type-badge type-${t}">${t}</span>`).join('');
    document.getElementById('ppCustomContent').innerHTML = `
      <p style="font-size:11px;opacity:.6">ID ${p.id} | ${(p.tipi||[]).join('/')}</p>
      <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
        <button onclick="equipAsSecond(${i})">⭐ Equipaggia come Starter2</button>
        <button onclick="releasePoke(${i})">🗑️ Rilascia</button>
      </div>`;
    document.getElementById('pokePreview').classList.remove('hidden');
  }
};
window.PKM_RUN = PKM_RUN;
window.start = window.startPokemon = PokeMisteryRL.Run.startPokemon;
window.pick = pick; window.next = next; window.flee = flee;
window.quickReset = PokeMisteryRL.Run.quickReset;
window.goMenu = PokeMisteryRL.Run.goMenu;
window.skill = skill; window.rifugio = rifugio; window.upgradeSkill = upgradeSkill;
window.addFel = addFel; window.consumeFel = consumeFel;
window.toggleRunLog = toggleRunLog;
window.showInventory = () => PokeMisteryRL.UI.showInventory();
window.hideInventory = () => PokeMisteryRL.UI.hideInventory();
window.changeTeamPreview = (d) => PokeMisteryRL.UI.changeTeamPreview(d);
const shop = () => {

  if(!PKM_RUN){
    return;
  }

  const db =
    window.PokeMisteryRL_Items?.DB_ITEMS ||
    window.DB_ITEMS ||
    null;

  const items =
    db && typeof db === "object"
      ? Object.values(db).filter(item => item && item.id)
      : [];

  if(!items.length){
    modal(`
      <div class="center">
        <h2>🛒 NEGOZIO</h2>
        <p>Il database oggetti non è ancora disponibile.</p>
        <button onclick="next('Negozio non disponibile')">
          CONTINUA
        </button>
      </div>
    `);
    return;
  }

  const rarityPrice = {
    comune: 50,
    non_comune: 100,
    rara: 175,
    epica: 300,
    leggendaria: 500
  };

  const pool = [...items];
  const offers = [];

  while(pool.length && offers.length < 3){
    const index =
      Math.floor(Math.random() * pool.length);

    const item =
      pool.splice(index,1)[0];

    offers.push({
      item,
      price:
        rarityPrice[item.rarita] ??
        rarityPrice.comune
    });
  }

  modal(`
    <div class="center shop-box">

      <h2>🛒 NEGOZIO</h2>

      <p>
        💰 <b>${Number(PKM_RUN.bits) || 0}</b>
      </p>

      <div class="shop-list">
        ${
          offers.map(({item,price}) => `
            <div class="shop-card">

              <div class="shop-icon">
                ${item.icon || "◈"}
              </div>

              <div class="shop-name">
                ${item.nome || item.id}
              </div>

              <div class="shop-rarity">
                ${item.rarita || "comune"}
              </div>

              <div class="shop-effect">
                ${item.effetto || "—"}
              </div>

              <div class="shop-price">
                💰 ${price}
              </div>

              <button
                type="button"
                onclick="buyShopItem('${String(item.id).replace(/'/g,"\\'")}',${price})"
              >
                ACQUISTA
              </button>

            </div>
          `).join("")
        }
      </div>

      <button type="button" onclick="next('Negozio visitato')">
        ESCI
      </button>

    </div>
  `);
};

const buyShopItem = (itemId, price) => {

  if(!PKM_RUN){
    return false;
  }

  const db =
    window.PokeMisteryRL_Items ||
    null;

  const item =
    db?.get?.(itemId) ||
    window.DB_ITEMS?.[itemId] ||
    null;

  if(!item){
    msg("Oggetto non disponibile.");
    return false;
  }

  const cost =
    Math.max(0, Math.floor(Number(price) || 0));

  const money =
    Math.max(0, Math.floor(Number(PKM_RUN.bits) || 0));

  if(money < cost){
    msg(`Servono ${cost} 💰.`);
    return false;
  }

  if(!Array.isArray(PKM_RUN.items)){
    PKM_RUN.items = [];
  }

  const existing =
    PKM_RUN.items.find(
      entry =>
        entry &&
        String(entry.id) === String(item.id)
    );

  if(existing){
    existing.qty =
      Math.max(0, Number(existing.qty) || 0) + 1;
  }else{
    PKM_RUN.items.push({
      id: item.id,
      qty: 1
    });
  }

  PKM_RUN.bits =
    money - cost;

  refreshBottomPanel();

  msg(`🛒 ${item.nome} acquistato!`);

  shop();

  return true;
};

window.shop = shop;
window.buyShopItem = buyShopItem;

const eggEvent = () => {

  if(!PKM_RUN){
    return;
  }

  if(!Array.isArray(PKM_RUN.eggs)){
    PKM_RUN.eggs = [];
  }

  PKM_RUN.eggs.push({
    id:`egg_${Date.now()}_${Math.floor(Math.random()*10000)}`,
    nome:"Uovo Pokémon",
    name:"Uovo Pokémon",
    icon:"🥚",
    qty:1,
    passi:1,
    steps:1
  });

  PokeMisteryRL.UI.refreshBottomPanel();

  msg("🥚 Hai trovato un Uovo Pokémon!");

  modal(`
    <div class="center">
      <h2>🥚 UOVO POKÉMON!</h2>

      <div style="font-size:58px;line-height:1;margin:12px 0">🥚</div>

      <p>
        Hai ottenuto un <b>Uovo Pokémon</b>!
      </p>

      <p style="opacity:.65;font-size:10px">
        L'uovo è stato aggiunto al tuo inventario.
      </p>

      <button onclick="next('Hai trovato un Uovo Pokémon!')">
        CONTINUA
      </button>
    </div>
  `);
};
window.eggEvent = eggEvent;
window.getPokemon = getPokemon; window.getActivePokemon = getActivePokemon;
window.getTeamStats = getTeamStats; window.PKM_DB = PKM_DB;
window.renderMap = render; window.refreshBottomPanel = refreshBottomPanel;
window.evolvePokemon = evolvePokemon; window.checkEvolve = checkEvolve;
window.openPokeInfo = openPokeInfo; window.closePokeInfo = closePokeInfo;
window.closeEvolutionPrompt = closeEvolutionPrompt;
window.releasePoke = releasePoke; window.swapToActive = swapToActive;

window.unequipSecond = unequipSecond;
window.releaseSecond = releaseSecond;
window.openSecondPreview = openSecondPreview;
document.addEventListener("DOMContentLoaded", () => {
  buildPokemonDB();
  $("menu")?.classList.remove("hidden");
  console.log(`PokeMisteryRL Core v8.1 - ${Object.keys(PKM_DB).length} Pokémon - MODULAR`);
});
// #endregion

;

  (function(){
  if(window.__bottomTeamInteractionFix) return;
  window.__bottomTeamInteractionFix=true;

  document.addEventListener("click",function(e){
    const el=e.target.closest("#bottomContainer [data-team-index],#bottomContainer .team-slot");
    if(!el) return;

    const i=Number(el.dataset.teamIndex ?? el.dataset.index);
    if(!Number.isInteger(i) || !window.PKM_RUN) return;

    const p=PKM_RUN.teamSlots?.[i];
    if(!p) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if(typeof PokeMisteryRL?.TeamRoster?.openTeamPreview==="function"){
      PokeMisteryRL.TeamRoster.openTeamPreview(i);
    }else if(typeof PokeMisteryRL?.UI?.openPokeInfo==="function"){
      PokeMisteryRL.UI.openPokeInfo(p,i);
    }
  },true);
})();

(function(){
  function getInventory(){
    const r=window.PKM_RUN||{};
    return r.inventory ?? r.items ?? {};
  }

  window.openBottomInventory=function(){
    const right=document.querySelector("#bottomContainer .b8-right") ||
                document.getElementById("bottomRightPanel");
    if(!right) return;

    let panel=document.getElementById("bottomInventoryPanel");
    if(!panel){
      panel=document.createElement("div");
      panel.id="bottomInventoryPanel";
      panel.className="bottom-inventory-panel";
      right.dataset.originalHtml=right.innerHTML;
      right.innerHTML="";
      right.appendChild(panel);
    }

    const items=getInventory();
    const entries=Array.isArray(items)
      ? items.map((x,i)=>({
          name:x?.nome||x?.name||`Oggetto ${i+1}`,
          qty:x?.quantita??x?.qty??1
        }))
      : Object.entries(items).map(([name,qty])=>({name,qty}));

    panel.innerHTML=`
      <div class="bip-head">
        <b>🎒 INVENTARIO</b>
        <button type="button" onclick="closeBottomInventory()">✕</button>
      </div>
      <div class="bip-title">OGGETTI</div>
      <div class="bip-list">
        ${entries.length
          ? entries.map(x=>`<div class="bip-row"><span>${x.name}</span><b>x${x.qty}</b></div>`).join("")
          : `<div class="bip-empty">Inventario vuoto</div>`}
      </div>
    `;
  }

  window.closeBottomInventory=function(){
    const right=document.querySelector("#bottomContainer .b8-right") ||
                document.getElementById("bottomRightPanel");
    if(!right || right.dataset.originalHtml===undefined) return;

    right.innerHTML=right.dataset.originalHtml;
    delete right.dataset.originalHtml;
  }

  document.addEventListener("click",function(e){
    const b=e.target.closest("#bottomContainer button");
    if(!b) return;
    const t=(b.textContent||"").toLowerCase();
    if(t.includes("inventario") || t.includes("🎒")){
      e.preventDefault();
      e.stopImmediatePropagation();
      openBottomInventory();
    }
  },true);
})();

(function(){
  if(window.__s2CompanionSlotFix) return;
  window.__s2CompanionSlotFix = true;

  document.addEventListener("click", function(e){
    var slot = e.target.closest ? e.target.closest("#starter2Slot") : null;
    if(!slot) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if(typeof window.openSecondPreview === "function"){
      window.openSecondPreview();
    }
  }, true);
})();

(function(){
  if(window.__modalOrderFix) return;
  window.__modalOrderFix=true;

  var stack=[];

  function isVisible(el){
    return el && !el.classList.contains("hidden") &&
      getComputedStyle(el).display !== "none";
  }

  function sync(){
    stack=stack.filter(isVisible);
    document.body.classList.toggle("modal-child-open", stack.length>1);
  }

  document.addEventListener("click",function(e){
    var modal=e.target.closest(".modal,.modal-box,#pokePreview,[role='dialog']");
    if(!modal || !isVisible(modal)) return;

    var close=e.target.closest(
      ".modal-close,[data-close],.close-btn,.close,.pp-close"
    );

    if(close && stack.length){
      var top=stack[stack.length-1];
      if(top!==modal){
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    }
  },true);

  var observer=new MutationObserver(function(){
    var visible=[].slice.call(document.querySelectorAll(
      ".modal,.modal-box,#pokePreview,[role='dialog']"
    )).filter(isVisible);

    visible.forEach(function(el){
      if(stack.indexOf(el)<0) stack.push(el);
    });

    stack=stack.filter(isVisible);
    sync();
  });

  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:["class","style","hidden"]});
})();

(function(){
  if(window.__strictModalLockFix) return;
  window.__strictModalLockFix=true;

  function visible(el){
    if(!el) return false;
    var cs=getComputedStyle(el);
    return !el.classList.contains("hidden") &&
           cs.display!=="none" &&
           cs.visibility!=="hidden";
  }

  function topModal(){
    var all=[].slice.call(document.querySelectorAll(
      "#modal,#pokePreview,.modal,[role='dialog']"
    ));
    var visibleOnes=all.filter(visible);
    return visibleOnes.length ? visibleOnes[visibleOnes.length-1] : null;
  }

  /*
   * BLOCCA COMPLETAMENTE il click sullo sfondo.
   * Prima il click poteva arrivare alla mappa e farla tornare visibile.
   */
  document.addEventListener("pointerdown",function(e){
    var top=topModal();
    if(!top) return;

    if(!top.contains(e.target)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);

  document.addEventListener("click",function(e){
    var top=topModal();
    if(!top) return;

    /*
     * Qualsiasi click fuori dalla finestra più recente viene ignorato.
     * Non chiude la finestra e soprattutto non raggiunge la mappa.
     */
    if(!top.contains(e.target)){
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
  },true);

  /*
   * Escape non deve chiudere una finestra sottostante.
   * Se esiste una finestra aperta, agisce solo sulla più recente
   * attraverso il suo eventuale pulsante di chiusura.
   */
  document.addEventListener("keydown",function(e){
    if(e.key!=="Escape") return;

    var top=topModal();
    if(!top) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    var close=top.querySelector(
      ".modal-close,[data-close],.close-btn,.close,.pp-close"
    );

    if(close) close.click();
  },true);
})();

(function(){
  if(window.__absoluteModalBackdropBlock) return;
  window.__absoluteModalBackdropBlock=true;

  function blockBackdrop(e){
    var preview=document.getElementById("pokePreview");
    var modal=document.getElementById("modal");

    /*
     * #pokePreview è il backdrop fixed.
     * Un click sul backdrop NON deve mai chiudere la tab
     * e NON deve mai arrivare alla mappa.
     */
    if(preview && !preview.classList.contains("hidden") && e.target===preview){
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }

    /*
     * Stessa protezione per il modal principale.
     */
    if(modal && !modal.classList.contains("hidden") && e.target===modal){
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }

  document.addEventListener("pointerdown",blockBackdrop,true);
  document.addEventListener("mousedown",blockBackdrop,true);
  document.addEventListener("mouseup",blockBackdrop,true);
  document.addEventListener("click",blockBackdrop,true);
  document.addEventListener("touchstart",blockBackdrop,true);
  document.addEventListener("touchend",blockBackdrop,true);

  /*
   * Se il gioco ha handler globali che reagiscono a pointer events,
   * il backdrop li intercetta direttamente.
   */
  function install(){
    var preview=document.getElementById("pokePreview");
    var modal=document.getElementById("modal");

    if(preview && !preview.__backdropLock){
      preview.__backdropLock=true;
      ["pointerdown","mousedown","mouseup","click","touchstart","touchend"]
        .forEach(function(type){
          preview.addEventListener(type,function(e){
            if(e.target===preview){
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          },true);
        });
    }

    if(modal && !modal.__backdropLock){
      modal.__backdropLock=true;
      ["pointerdown","mousedown","mouseup","click","touchstart","touchend"]
        .forEach(function(type){
          modal.addEventListener(type,function(e){
            if(e.target===modal){
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          },true);
        });
    }
  }

  install();

  new MutationObserver(install).observe(document.body,{
    childList:true,
    subtree:true
  });
})();

(function(){
  if(window.__s2DirectSwapCapture) return;
  window.__s2DirectSwapCapture = true;

  document.addEventListener("click", function(e){

    var card =
      e.target && e.target.closest
        ? e.target.closest(".s2-choice-card")
        : null;

    if(!card){
      return;
    }

    var index =
      card.getAttribute("data-s2-index");

    if(index === null){
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    if(typeof window.equipAsSecond === "function"){
      window.equipAsSecond(Number(index));
    }

  }, true);
})();

(function(){
  if(window.__quickItemClickHandler) return;
  window.__quickItemClickHandler = true;

  document.addEventListener("click",function(e){

    const slot =
      e.target.closest
        ? e.target.closest(
            "#quickItemSlots [data-quick-item-slot]"
          )
        : null;

    if(!slot){
      return;
    }

    const index =
      Number(
        slot.getAttribute(
          "data-quick-item-slot"
        )
      );

    const inventory =
      Array.isArray(window.PKM_RUN?.items)
        ? window.PKM_RUN.items
        : Array.isArray(window.PKM_RUN?.inventory)
          ? window.PKM_RUN.inventory
          : [];

    const entries =
      inventory
        .filter(Boolean)
        .slice(0,5);

    const entry =
      entries[index];

    if(!entry){
      return;
    }

    const itemId =
      typeof entry === "object"
        ? entry.id
        : entry;

    if(itemId == null){
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    if(typeof window.openQuickItemDetail === "function"){
      window.openQuickItemDetail(itemId);
    }

  },true);
})();



/* ============================================================
   GLOBAL WINDOW API - COMPLETE COMPATIBILITY EXPORTS
   ------------------------------------------------------------
   Esporta verso window le funzioni già definite dal CORE 2 e
   richieste dai markup generati dinamicamente / HTML.
   Non crea una seconda implementazione e non altera la logica.
   ============================================================ */
(function(){

  const api = {
    start: typeof startPokemon === "function"
      ? startPokemon
      : PokeMisteryRL?.Run?.startPokemon,

    startPokemon: typeof startPokemon === "function"
      ? startPokemon
      : PokeMisteryRL?.Run?.startPokemon,

    pick,
    next,
    flee,
    skill,
    rifugio,
    upgradeSkill,
    addFel,
    consumeFel,
    toggleRunLog,

    shop,
    buyShopItem,
    eggEvent,

    getPokemon,
    getActivePokemon,
    getTeamStats,
    renderMap: render,
    refreshBottomPanel,

    evolvePokemon,
    checkEvolve,
    closeEvolutionPrompt,

    openPokeInfo,
    closePokeInfo,

    releasePoke,
    swapToActive,
    equipAsSecond,
    unequipSecond,
    releaseSecond,

    openStarterPreview,
    openSecondPreview,
    openTeamPreview,

    quickReset: PokeMisteryRL?.Run?.quickReset,
    goMenu: PokeMisteryRL?.Run?.goMenu,

    openQuickItemDetail: window.openQuickItemDetail,
    equipQuickItem: window.equipQuickItem,

    openBottomInventory: window.openBottomInventory
  };

  Object.keys(api).forEach(function(name){
    if(typeof api[name] === "function"){
      window[name] = api[name];
    }
  });

  window.PKM_RUN = PKM_RUN;

})();



