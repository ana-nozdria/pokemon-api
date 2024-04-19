const { readJson, writeJson } = require("./db.js");
const path = require("path");

const POKEMON_FILE_NAME = path.join(__dirname, "../json/pokemon.json");

function getAllPokemon() {
  return readJson(POKEMON_FILE_NAME);
}

function getPokemonByDexNumber(dexNumber) {
  const list = getAllPokemon();
  return list.find((p) => p.dexNumber == dexNumber);
}

function addPokemon(
  dexNumber,
  name,
  imageUrl,
  smallImageUrl,
  types,
  dexEntry
) {
  const existingData = readJson(POKEMON_FILE_NAME);

  if (existingData.some((pokemon) => pokemon.dexNumber === dexNumber)) {
      return 409; //status - duplicate
  }

  existingData.push({
      dexNumber,
      name,
      imageUrl,
      smallImageUrl,
      types,
      dexEntry,
  });

  writeJson(existingData, POKEMON_FILE_NAME);
  return 200; //status - all clear
}

module.exports = {
  getAllPokemon,
  getPokemonByDexNumber,
  addPokemon
};
