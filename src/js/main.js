import { pokeApi } from "./PokeApi.js";

const pokemonList = document.getElementById("pokemonList");
const pokemonModal = document.getElementById("modal");
const loadMoreButton = document.getElementById("loadMoreButton");
const maxRecords = 151;
const limit = 10;
let offset = 0;

const createPokemonElement = pokemon => {
  const { name, number, type, types, photo } = pokemon;

  return `
    <li>
      <button class="pokemon ${type}" data-id="${number}">
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
      </button>
    </li>
`;
};

const loadPokemonItens = async (offset, limit) => {
  try {
    const pokemons = await pokeApi.getPokemons(offset, limit);
    const pokemonCards = pokemons.map(pokemon => createPokemonElement(pokemon));
    pokemonList.innerHTML += pokemonCards.join("");
  } catch (err) {
    console.error("Erro ao carregar os Pokémons na tela: " + err);
  } finally {
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = loadMoreButton.dataset.ready;
  }
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

const showCardDetails = e => {
  const card = e.target.closest(".pokemon");
  if (!card) return;
  const selectedCard = pokemonList.querySelector(
    `.selected:not([data-id="${card.dataset.id}"])`
  );
  if (selectedCard) selectedCard.classList.remove("selected");
  card.classList.toggle("selected");
};

loadMoreButton.addEventListener("click", loadMorePokemons);
pokemonList.addEventListener("click", showCardDetails);

pokemonModal.addEventListener("click", e => {
  if (e.target !== e.currentTarget) return;
  pokemonModal.classList.toggle("hidden");
});

loadPokemonItens(offset, limit);
