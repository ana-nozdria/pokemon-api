const express = require("express");
const router = express.Router();
const { getPokemonByDexNumber, addPokemon } = require("../../db/pokemon-db.js");

// TODO Add an API endpoint here.
// When sending a GET request for /:dexNumber (:dexNumber is a path param),
// return the JSON representation of the correct Pokemon, or return a 404 error
// if that Pokemon is not found.

router.get("/:dexNumber", function(req, res) {
    const dexParam = req.params.dexNumber;
    const retrieveDex = getPokemonByDexNumber(dexParam);

    if (retrieveDex) {
        res.json(retrieveDex);
    } else {
        res.sendStatus(404);
    }
});

router.post("/add", async function(req, res) {
    const dexNumber = req.body.newDex;

    try {
        //general - most of info except for dexEntry
        const apiResGeneral = await fetch(`https://pokeapi.co/api/v2/pokemon/${dexNumber}`);
        const jsonGeneral = await apiResGeneral.json();

        //only for dexEntry
        const apiResDexEntry = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${dexNumber}`);
        const jsonEntry = await apiResDexEntry.json();

        const entries = jsonEntry.flavor_text_entries;
        const filteredentries = filterEntriesByLanguage(entries, "en"); //retrieve only entries in eng
        const textLength = filteredentries.length - 1; //to get the last entry in the filtered array, assuming last = newest
        const latestEntryinEng = filteredentries[textLength].flavor_text;

        const typeNames = displayAllTypes(jsonGeneral.types); //display all types

        const sprites = jsonGeneral.sprites;
        const imageURLBig = sprites.other.home.front_default || sprites.other['official-artwork'].front_default; //if the OG img is unavailable

        const result = await addPokemon(
            jsonGeneral.id,
            capitaliseFirstLetter(jsonGeneral.name),
            imageURLBig,
            jsonGeneral.sprites.front_default,
            typeNames,
            capitaliseFirstLetter(latestEntryinEng)
        );

        res.cookie("newDexNumber", jsonGeneral.id);
        return res.sendStatus(result);
    } catch (error) { //I found it to be the only working way to prevent the server from crashing ¯\_(ツ)_/¯
        //400 - bad request, which is the same as invalid dexNumber (?)
        return res.sendStatus(400);
    }
});

function filterEntriesByLanguage(entries, languageName) {
    return entries.filter(entry => entry.language.name === languageName);
}

function capitaliseFirstLetter(entry) {
    return `${entry.charAt(0).toUpperCase()}${entry.slice(1)}`;
};

function displayAllTypes(types) {
//I didn't add space after comma because on the screenshot (under Task 5) there was none, so I decided to keep my data display consistent
    return types.map(type => capitaliseFirstLetter(type.type.name)).join(','); 
}

module.exports = router;
