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
  sprites?: {
    front_default?: string;
    back_default?: string;
    front_shiny?: string;
    back_shiny?: string;
    other?: {
      'official-artwork'?: {
        front_default?: string;
      };
      dream_world?: {
        front_default?: string;
      };
      home?: {
        front_default?: string;
      };
    };
  };
  abilities?: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
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

  async getPokemon(name: string): Promise<PokemonDetail> {
    const pokemonApiUrl = `${process.env.NEXT_PUBLIC_POKEMON_API_URL!}/api/v2/pokemon/${name}`;
    const res = await fetch(pokemonApiUrl);
    const data: PokemonDetail = await res.json();
    return data;
  },

  async searchPokemon(query: string): Promise<PokemonResponse> {
    try {
      const pokemonApiUrl = `${process.env.NEXT_PUBLIC_POKEMON_API_URL!}/api/v2/pokemon?limit=151`;
      const res = await fetch(pokemonApiUrl);
      const data: PokemonResponse = await res.json();
      
      // Filter pokemons based on the search query
      const filteredResults = data.results.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
        ...data,
        results: filteredResults,
        count: filteredResults.length
      };
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      throw error;
    }
  }
};