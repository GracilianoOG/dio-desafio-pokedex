import { Pokemon } from "./models/Pokemon.js";

export const pokeApi = {};

const convertPokeApiDetailToPokemon = details => {
  const { name, id, types, sprites } = details;
  const typeNames = types.map(typeSlot => typeSlot.type.name);
  const [type] = typeNames;
  const photo = sprites.other.dream_world.front_default;

  return new Pokemon(name, id, type, typeNames, photo);
};

pokeApi.getPokemonDetail = async pokemon => {
  const response = await fetch(pokemon.url);
  const pokeDetail = await response.json();
  return convertPokeApiDetailToPokemon(pokeDetail);
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
