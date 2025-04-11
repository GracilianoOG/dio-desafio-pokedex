import { showModal } from "./modal.js";
import { Pokemon } from "./models/Pokemon.js";

class PokeApi {
  convertPokeApiDetailToPokemon(details) {
    const { name, id, types, sprites } = details;
    const typeNames = types.map(typeSlot => typeSlot.type.name);
    const [type] = typeNames;
    const photo = sprites.other.dream_world.front_default;

    return new Pokemon(name, id, type, typeNames, photo);
  }

  async getPokemonDetail(pokemon) {
    try {
      const response = await fetch(pokemon.url);
      if (!response.ok)
        throw new Error("Erro HTTP! Status: " + response.status);
      const pokeDetail = await response.json();
      return this.convertPokeApiDetailToPokemon(pokeDetail);
    } catch ({ name, message }) {
      showModal(name, message);
      console.error(`Erro "${name}" ao buscar detalhes do Pokemón: ${message}`);
    }
  }

  async getPokemons(offset = 0, limit = 10) {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Erro HTTP! Status: " + response.status);
      const data = await response.json();
      const pokemons = data.results;
      const detailRequests = pokemons.map(this.getPokemonDetail.bind(this));
      const pokemonDetails = Promise.all(detailRequests);

      return pokemonDetails;
    } catch ({ name, message }) {
      showModal(name, message);
      console.error(`Erro "${name}" ao buscar Pokemóns: ${message}`);
    }
  }
}

export const pokeApi = new PokeApi();
