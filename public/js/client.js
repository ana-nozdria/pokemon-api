window.addEventListener("load", function () {
  // TODO Add JavaScript code so that when the user clicks one of the Pokemon buttons,
  // detailed data about that Pokemon will be loaded from your own API, and displayed
  // in the appropriate place on the HTML page (overwriting any data which was already
  // there).
  const buttons = document.querySelectorAll("button[data-dexNumber]");
  const dexNumber = document.querySelector("#dexNumber"); //before I click on any Pokemon, the dexNumber should be my favourite Pokemon's one
  const img = document.querySelector("#pokemonFullImg");
  const name = document.querySelectorAll("#name");
  const type = document.querySelector("#type");
  const about = document.querySelector("#about");
  let chosenPokemon = null;

  buttons.forEach((button) => {
    const dexNumberAttr = button.getAttribute("data-dexNumber");

    if(dexNumber.innerHTML == dexNumberAttr) {
      selectPokemon(button);
    }

    button.addEventListener("click", () => getPokemonData(dexNumberAttr, button));
  });

  async function getPokemonData(dexNumberAttr, button) {
    const res = await fetch(`/api/pokemon/${dexNumberAttr}`);
    const pokemonData = await res.json();

    img.src = pokemonData.imageUrl;
    dexNumber.innerHTML = pokemonData.dexNumber;
    type.innerHTML = pokemonData.types;
    about.innerHTML = pokemonData.dexEntry;
    name.forEach((name) => {
      name.innerHTML = pokemonData.name;
    });

    selectPokemon(button);
  }

  function selectPokemon(button) {
    if (chosenPokemon) {
      chosenPokemon.classList.remove("selected");
    }

    chosenPokemon = button;
    chosenPokemon.classList.add("selected"); 
  }

  //Task 6
  const addNewBtn = document.querySelector("#add-new-btn");
  const inputField = document.querySelector("#pokemonInput");
  const newButton = document.querySelector("button[data-dexNumber]");

  addNewBtn.addEventListener("click", async function() {
    const dexNumber = inputField.value;

      const response = await fetch("/api/pokemon/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newDex: dexNumber }),
      });
  
      if (response.status === 200) {
  
        getPokemonData(dexNumber, newButton);
        location.reload();

      } else if (response.status === 400) {

        // Non-existent Pokemon
        alert("Something's wrong... Are you sure this Pokemon exists?");
        location.reload();

      } else if (response.status === 409) {

        // Duplicate Pokemon
        alert("Looks like this Pokemon is already on the list!");
        location.reload();
      }

  });
});