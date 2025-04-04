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
  try {
    const response = await fetch(pokemon.url);
    if (!response.ok) throw new Error("Erro HTTP! Status: " + response.status);
    const pokeDetail = await response.json();
    return convertPokeApiDetailToPokemon(pokeDetail);
  } catch (err) {
    console.error("Erro ao buscar detalhes do Pokemón: " + err);
  }
};

pokeApi.getPokemons = async (offset = 0, limit = 10) => {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro HTTP! Status: " + response.status);
    const jsonBody = await response.json();
    const pokemons = jsonBody.results;
    const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
    const pokemonDetails = Promise.all(detailRequests);
    return pokemonDetails;
  } catch (err) {
    console.error("Erro ao buscar Pokemóns: " + err);
  }
};
