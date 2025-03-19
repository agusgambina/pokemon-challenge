import { Card } from "./Card";
import { Pokemon, PokemonDetail } from "@/lib/services/pokemonService";

export default function Grid({ pokemons, pokemonDetails }: { pokemons: Pokemon[], pokemonDetails: Record<string, PokemonDetail> }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
      {pokemons?.map((pokemon) => (
        <Card
          key={pokemon.name}
          pokemon={pokemon}
          details={
            pokemonDetails[pokemon.name] as {
              sprites?: { front_default?: string };
            }
          }
        />
      ))}
    </div>
  );
}
