import { pokeApi } from "./poke-api.js";

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
      <span class="name">${name}</span>
      <div class="detail">
        <ol class="types">
          ${types
            .map(pType => `<li class="type ${pType}">${pType}</li>`)
            .join("")}
        </ol>

        <img src="${photo}" alt="${name}">
      </div>
    </li>
`;
};

const loadPokemonItens = (offset, limit) => {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    pokemonList.innerHTML += pokemons
      .map(pokemon => createPokemonElement(pokemon))
      .join("");
  });
};

const loadMorePokemons = () => {
  offset += limit;

  const qtdRecordsNextPage = offset + limit;

  if (qtdRecordsNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
};

loadMoreButton.addEventListener("click", loadMorePokemons);

loadPokemonItens(offset, limit);
