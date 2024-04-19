const express = require("express");
const { getAllPokemon, getPokemonByDexNumber } = require("../db/pokemon-db");
const router = express.Router();

router.get("/", function (req, res) {
  // TODO Add necessary data to res.locals before rendering the "home" page.

  let getSpecificPokemon = null;
  const newDex = req.cookies.newDexNumber;

  if (newDex) {
    getSpecificPokemon = getPokemonByDexNumber(newDex);
    res.clearCookie("newDexNumber");
  } else {
    getSpecificPokemon = getPokemonByDexNumber(136);
  }

  res.locals.pokemon = getAllPokemon; //That's for the buttons

  // For details section:
  res.locals.selectedName = getSpecificPokemon.name;
  res.locals.imageUrl = getSpecificPokemon.imageUrl;
  res.locals.dexNumber = getSpecificPokemon.dexNumber;
  res.locals.types = getSpecificPokemon.types;
  res.locals.dexEntry = getSpecificPokemon.dexEntry;

  res.render("home");
});

module.exports = router;