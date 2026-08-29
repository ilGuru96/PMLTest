/* PokeMisteryRL - extracted SKILL SYSTEM region
 * SOURCE: current Point 0
 * Depends on: DB_MOSSE / shared helpers.
 */

const PokeMisteryRL_SkillSystem = (() => {

  const CONFIG = {
    STARTING_SKILL_LEVEL: 1,
    STARTING_SKILL_COUNT: 1,
    MAX_SKILLS: 3
  };


  const normalizeTyping = (typing) => {

    if (Array.isArray(typing)) {
      typing = typing[0];
    }

    if (!typing) {
      return "normale";
    }

    return String(typing)
      .toLowerCase()
      .trim();

  };

  const getSkillDB = () => {

    // Evita ReferenceError se MOSSE_PKM.js non è ancora caricato.
    return (
      typeof SKILL_DB !== "undefined"
        ? SKILL_DB
        : null
    );

  };

  const randomItem = (array) => {

    if (!Array.isArray(array) || !array.length) {
      return null;
    }

    return array[
      Math.floor(
        Math.random() * array.length
      )
    ];

  };

  const normalizeSkill = (
    skill,
    skillLevel,
    typing
  ) => {

    if (!skill) {
      return null;
    }

    const name =
      skill.nome ??
      skill.name ??
      "Mossa";

    return {
      ...skill,

      // Nome originale del DB
      nome: name,

      // Nome standard usato dalla UI
      name: name,

      // Tipo usato per sapere da quale typing arriva
      type: normalizeTyping(typing),

      // Livello della skill
      skillLevel: Number(skillLevel) || 1
    };

  };

  // TIPO PRINCIPALE DEL POKÉMON

  const getPrimaryType = (pokemon) => {

    if (!pokemon) {
      return "normale";
    }

    // REGOLA DOPPIO TIPO:
    // viene usato esclusivamente il primo typing.
    return normalizeTyping(
      pokemon.tipi?.[0]
    );

  };

  // POOL DAL DATABASE

  const getPool = (
    typing,
    skillLevel = CONFIG.STARTING_SKILL_LEVEL
  ) => {

    const db = getSkillDB();

    if (!db) {
      console.warn(
        "PokeMisteryRL SkillSystem: SKILL_DB non disponibile. " +
        "Carica MOSSE_PKM.js prima del CORE."
      );

      return [];
    }

    const type =
      normalizeTyping(typing);

    const level =
      Number(skillLevel);

    return (
      db?.[type]?.[level] ||
      []
    );

  };

  // ESTRAE UNA MOSSA CASUALE

  const getRandomSkill = (
    typing,
    skillLevel = CONFIG.STARTING_SKILL_LEVEL
  ) => {

    const pool =
      getPool(
        typing,
        skillLevel
      );

    const skill =
      randomItem(pool);

    if (!skill) {
      return null;
    }

    return normalizeSkill(
      skill,
      skillLevel,
      typing
    );

  };

  // ESTRAE LA MOSSA DI UN POKÉMON

  const getSkill = (
    pokemon,
    skillLevel = CONFIG.STARTING_SKILL_LEVEL
  ) => {

    if (!pokemon) {
      return null;
    }

    const typing =
      getPrimaryType(pokemon);

    return getRandomSkill(
      typing,
      skillLevel
    );

  };

  // OTTIENE TUTTE LE MOSSE DISPONIBILI

  const getSkills = (
    pokemon,
    skillLevel = CONFIG.STARTING_SKILL_LEVEL
  ) => {

    if (!pokemon) {
      return [];
    }

    return getPool(
      getPrimaryType(pokemon),
      skillLevel
    );

  };

  // CONTROLLO MOSSA

  const isValidSkill = (
    skill,
    skillLevel = CONFIG.STARTING_SKILL_LEVEL
  ) => {

    if (!skill) {
      return false;
    }

    const level =
      Number(skillLevel);

    const name =
      skill.nome ??
      skill.name;

    if (!name) {
      return false;
    }

    const pool =
      getPool(
        skill.type,
        level
      );

    return pool.some(
      dbSkill =>
        (dbSkill.nome ?? dbSkill.name) === name
    );

  };

  // GENERA LA MOSSA INIZIALE

  const generateStartingSkill = (
    pokemon
  ) => {

    if (!pokemon) {
      return null;
    }

    return getSkill(
      pokemon,
      CONFIG.STARTING_SKILL_LEVEL
    );

  };

  // GENERA LE SKILL
  //
  // Per ora il Pokémon riceve SOLO la skill iniziale LV1.
  //
  // Non vengono generate automaticamente skill LV2/LV3.
  // Le eventuali skill future possono essere aggiunte tramite
  // learnSkill().
  //

  const generateSkills = (
    pokemon
  ) => {

    if (!pokemon) {
      return [];
    }

    const startingSkill =
      generateStartingSkill(
        pokemon
      );

    if (!startingSkill) {
      return [];
    }

    return [
      startingSkill
    ];

  };

  // ASSEGNA LE SKILL AL POKÉMON

  const assignSkills = (
    pokemon
  ) => {

    if (!pokemon) {
      return [];
    }

    const skills =
      generateSkills(
        pokemon
      );

    pokemon.skills =
      skills;

    return skills;

  };

  // AGGIUNGE UNA SKILL SPECIFICA

const learnSkill = (pokemon, skillLevel) => {

  if (!pokemon) {
    return null;
  }

  const level = Number(skillLevel);

  if (!Number.isFinite(level) || level < 1 || level > CONFIG.MAX_SKILLS) {
    return null;
  }

  const skill = getSkill(pokemon, level);

  if (!skill) {
    return null;
  }

  pokemon.skills = [skill];

  return skill;
};

  // OTTIENE UNA SKILL DEL POKÉMON

  const getPokemonSkill = (
    pokemon,
    skillLevel
  ) => {

    if (!pokemon?.skills) {
      return null;
    }

    return (
      pokemon.skills.find(
        skill =>
          Number(skill.skillLevel) ===
          Number(skillLevel)
      ) ||
      null
    );

  };

  // OTTIENE LA SKILL ATTIVA

  const getActiveSkill = (
    pokemon
  ) => {

    if (!pokemon) {
      return null;
    }

    return getPokemonSkill(
      pokemon,
      Number(pokemon.sk) || CONFIG.STARTING_SKILL_LEVEL
    );

  };

  // RIGENERA LE SKILL
  //
  // Utile quando cambia il typing, ad esempio dopo un'evoluzione.
  //

  const rerollSkills = (
    pokemon
  ) => {

    if (!pokemon) {
      return [];
    }

    return assignSkills(
      pokemon
    );

  };

  // API PUBBLICA

  return {

    CONFIG,

    normalizeTyping,

    getPrimaryType,

    getPool,

    getRandomSkill,

    getSkill,

    getSkills,

    isValidSkill,

    generateStartingSkill,

    generateSkills,

    assignSkills,

    learnSkill,

    getPokemonSkill,

    getActiveSkill,

    rerollSkills

  };

})();
