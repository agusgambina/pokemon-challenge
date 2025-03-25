'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pokemonService } from '@/lib/services/pokemonService';
import type { PokemonDetail, Pokemon } from '@/lib/services/pokemonService';
import SearchBar from '@/components/SearchBar';
import PaginationControls from '@/components/PaginationControls';
import Grid from '@/components/Grid';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const limit = 20;
  const [offset, setOffset] = useState<number>(0);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchQuery = useDebounce(searchInput, 300);

  // Reset offset when search query changes
  useEffect(() => {
    setOffset(0);
  }, [debouncedSearchQuery]);

  const { data: queryPokemons } = useQuery({
    queryKey: ['pokemons', limit, offset, debouncedSearchQuery],
    queryFn: () => debouncedSearchQuery ? pokemonService.searchPokemon(debouncedSearchQuery) : pokemonService.getPokemons(limit, offset),
    enabled: !!user,
  });

  const pokemonQueries = useQueries({
    queries: (queryPokemons?.results ?? []).map((pokemon: Pokemon) => ({
      queryKey: ['pokemon', pokemon.name],
      queryFn: () => pokemonService.getPokemon(pokemon.name),
      enabled: !!user && !!pokemon.name,
    })),
  });

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Don't render anything while checking authentication
  if (loading || !user) {
    return null;
  }

  if (!queryPokemons) return <div>Loading...</div>;

  // Calculate details object from queries
  const pokemonDetails = queryPokemons.results.reduce((acc: Record<string, PokemonDetail>, pokemon: Pokemon, index: number) => {
    if (pokemonQueries[index].data) {
      acc[pokemon.name] = pokemonQueries[index].data;
    }
    return acc;
  }, {} as Record<string, PokemonDetail>);

  const page = Math.ceil(queryPokemons.count / limit);

  return (
    <div
      className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen w-full gap-16 font-[family:var(--font-geist-sans)]"
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full"></main>
      <div className="bg-white dark:bg-gray-900 w-full">
        <div className="w-full px-4 py-16 sm:px-6 sm:py-24">
          <SearchBar value={searchInput} onChange={setSearchInput} />

          <Grid pokemons={queryPokemons.results} pokemonDetails={pokemonDetails} />

          {!debouncedSearchQuery && (
            <PaginationControls offset={offset} setOffset={setOffset} page={page} limit={limit} />
          )}
        </div>
      </div>
    </div>
  );
}
