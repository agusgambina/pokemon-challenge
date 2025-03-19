'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pokemonService } from '@/lib/services/pokemonService';
import type { Pokemon, PokemonDetail } from '@/lib/services/pokemonService';
import SearchBar from '@/components/SearchBar';
import PaginationControls from '@/components/PaginationControls';
import Grid from '@/components/Grid';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const limit = 20;
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<Record<string, unknown>>({});
  const [offset, setOffset] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      async function fetchPokemons() {
        try {
          const pokemons = await pokemonService.getPokemons(limit, offset);
          setPokemons(pokemons.results);
          setPage(Math.ceil(pokemons.count / limit));

          // Fetch details for each Pokemon
          const details = await Promise.all(
            pokemons.results.map(async (pokemon) => {
              const detail = await pokemonService.getPokemon(pokemon.name);
              return [pokemon.name, detail];
            })
          );
          setPokemonDetails(Object.fromEntries(details));
        } catch (error) {
          console.error('Error fetching Pokemons:', error);
        }
      }
      fetchPokemons();
    }
  }, [user, limit, offset]);

  // Don't render anything while checking authentication
  if (loading || !user) {
    return null;
  }

  if (!pokemons) return <div>Loading...</div>;

  return (
    <div
      className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen w-full gap-16 font-[family:var(--font-geist-sans)]"
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full"></main>
      <div className="bg-white dark:bg-gray-900 w-full">
        <div className="w-full px-4 py-16 sm:px-6 sm:py-24">
          <SearchBar />

          <Grid pokemons={pokemons} pokemonDetails={pokemonDetails as Record<string, PokemonDetail>} />

          <PaginationControls offset={offset} setOffset={setOffset} page={page} limit={limit} />
        </div>
      </div>
    </div>
  );
}
