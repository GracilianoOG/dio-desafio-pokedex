import { closeModal, showModal } from "./modal.js";
import { pokeApi } from "./PokeApi.js";

const pokemonList = document.getElementById("pokemonList");
const pokemonModal = document.getElementById("modal");
const loadMoreButton = document.getElementById("loadMoreButton");
const maxRecords = 151;
const limit = 10;
let offset = 0;

const createPokemonElement = pokemon => {
  const { name, number, type, types, photo, weight, height } = pokemon;

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

          <img class="avatar" loading="lazy" src="${photo}" alt="${name}">

          <div class="extra">
            <p class="info">
              <img loading="lazy" src="https://www.svgrepo.com/show/315964/scale-weight.svg" alt="Weight">
              ${(weight / 10).toFixed(1)} KG
            </p>
            <p class="info">
              <img loading="lazy" src="https://www.svgrepo.com/show/411400/measure.svg" alt="Height">
              ${(height / 10).toFixed(1)} M
            </p>
          </div>
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
  } catch ({ name, message }) {
    const msg = `Erro "${name}" ao carregar os Pokémons na tela: ${message}`;
    showModal(name, msg);
    console.error(msg);
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
  closeModal();
});

pokemonModal.querySelector("#modalClose").addEventListener("click", closeModal);

loadPokemonItens(offset, limit);
