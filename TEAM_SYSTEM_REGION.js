/* PokeMisteryRL - extracted TEAM SYSTEM region
 * Contains Team + TeamRoster (S1/S2/reserve/release/equip/recruit preparation).
 * DO NOT load alongside the old inline copy until Core is rewired.
 */

PokeMisteryRL.Team = (() => {

  const getCombinedTeam = () => {
    if(!PKM_RUN) return [];

    const team = [];

    if(PKM_RUN.activePokemon)
      team.push(PKM_RUN.activePokemon); // fisso

    if(PKM_RUN.secondActive)
      team.push(PKM_RUN.secondActive); // secondo

    (PKM_RUN.teamSlots || []).forEach(p => {
      if(p) team.push(p);
    });

    return team.slice(0, 5);
  };


  const getTeamStats = () => {

    const team = [];

    if(PKM_RUN?.activePokemon)
      team.push(PKM_RUN.activePokemon);

    if(PKM_RUN?.secondActive)
      team.push(PKM_RUN.secondActive);

    (PKM_RUN?.teamSlots || []).forEach(p => {
      if(p) team.push(p);
    });

    let hp = 0;
    let max = 0;
    let atk = 0;
    let def = 0;

    team.forEach(p => {
      hp += p.hp || 0;
      max += p.maxHp || 0;
      atk += p.stats?.atk || 0;
      def += p.stats?.dif || 0;
    });

    return { team, hp, max, atk, def };
  };


  return {
    getCombinedTeam,
    getTeamStats
  };

})();



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
    if(typeof closeModal === "function"){
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
    recruitPokemon
  };

})();
