import { Pokemon } from "./models/Pokemon.js";

export const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.name = pokeDetail.name;
  pokemon.number = pokeDetail.id;

  const types = pokeDetail.types.map(typeSlot => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

pokeApi.getPokemonDetail = pokemon => {
  return fetch(pokemon.url)
    .then(response => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = async (offset = 0, limit = 10) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  const response = await fetch(url);
  const jsonBody = await response.json();
  const pokemons = jsonBody.results;
  const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
  const pokemonDetails = Promise.all(detailRequests);
  return pokemonDetails;
};
