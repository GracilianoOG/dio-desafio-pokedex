import { pokeApi } from "./PokeApi.js";

const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const maxRecords = 151;
const limit = 10;
let offset = 0;

const createPokemonElement = pokemon => {
  const { name, number, type, types, photo } = pokemon;

  return `
    <li class="pokemon ${type}">
      <span class="number">#${number}</span>
      <h2 class="name">${name}</h2>
      <div class="detail">
        <ol class="types">
          ${types
            .map(pType => `<li class="type ${pType}">${pType}</li>`)
            .join("")}
        </ol>

        <img loading="lazy" src="${photo}" alt="${name}">
      </div>
    </li>
`;
};

const loadPokemonItens = async (offset, limit) => {
  const pokemons = (await pokeApi.getPokemons(offset, limit)) ?? [];
  const pokemonCards = pokemons.map(pokemon => createPokemonElement(pokemon));
  pokemonList.innerHTML += pokemonCards.join("");
  loadMoreButton.disabled = false;
  loadMoreButton.textContent = loadMoreButton.dataset.ready;
};

const loadMorePokemons = () => {
  offset += limit;
  const qtdRecordsNextPage = offset + limit;
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = loadMoreButton.dataset.loading;

  if (qtdRecordsNextPage < maxRecords) {
    loadPokemonItens(offset, limit);
    return;
  }

  const newLimit = maxRecords - offset;
  loadPokemonItens(offset, newLimit);
  loadMoreButton.parentElement.removeChild(loadMoreButton);
};

loadMoreButton.addEventListener("click", loadMorePokemons);

loadPokemonItens(offset, limit);
