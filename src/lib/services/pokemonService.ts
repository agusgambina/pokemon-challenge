export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonResponse {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}

export interface PokemonDetail {
  name: string;
  url: string;
}

export const pokemonService = {
  async getPokemons(limit?: number, offset?: number): Promise<PokemonResponse> {
    try {
      const pokemonApiUrl = `${process.env.NEXT_PUBLIC_POKEMON_API_URL!}/api/v2/pokemon/${limit ? `?limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`;
      const res = await fetch(pokemonApiUrl);
      const data: PokemonResponse = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      throw error;
    }
  },

  async getPokemon(name: string): Promise<Pokemon> {
    const pokemonApiUrl = `${process.env.NEXT_PUBLIC_POKEMON_API_URL!}/api/v2/pokemon/${name}`;
    const res = await fetch(pokemonApiUrl);
    const data: Pokemon = await res.json();
    return data;
  }
};