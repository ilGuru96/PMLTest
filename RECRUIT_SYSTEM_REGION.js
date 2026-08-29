/* PokeMisteryRL - extracted RECRUITMENT UI region
 * Contains the post-fight recruitment/replacement screens.
 * Depends on PokeMisteryRL.TeamRoster, modal(), sprite(), next(), render().
 * DO NOT load alongside the old inline copy until Core is rewired.
 */

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

  window._pendingReplacement =
    null;

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

  window._pendingRecruitment =
    null;

  window._pendingReplacement =
    null;

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
        onclick="next('Vittoria!')"
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

  window._pendingRecruitment =
    null;

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
        onclick="next('Vittoria!')"
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

  window._pendingRecruitment =
    null;

  window._pendingReplacement =
    null;

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
        onclick="next('Vittoria!')"
      >
        CONTINUA
      </button>

    </div>
  `);
};
