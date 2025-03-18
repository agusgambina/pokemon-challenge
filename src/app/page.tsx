'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pokemonService } from '@/lib/services/pokemonService';
import type { Pokemon } from '@/lib/services/pokemonService';
import { Card } from '@/components/Card';

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
      style={{ padding: '10%' }}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full"></main>
      <div className="bg-white dark:bg-gray-900 w-full">
        <div className="w-full px-4 py-16 sm:px-6 sm:py-24">
          {/* Search Bar */}
          <div className="relative max-w-md w-full mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search..."
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
            {pokemons?.map((pokemon) => (
              <Card
                key={pokemon.name}
                pokemon={pokemon}
                details={pokemonDetails[pokemon.name] as { sprites?: { front_default?: string } }}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => {
                if (offset > 0) {
                  setOffset(offset - limit);
                }
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              disabled={offset === 0}
            >
              Previous
            </button>
            <div className="flex items-center space-x-2">
              <span className="dark:text-gray-200">Page</span>
              <input
                type="number"
                min="1"
                max={Math.ceil(page)}
                value={Math.floor(offset / limit) + 1}
                onChange={(e) => {
                  const pageNum = parseInt(e.target.value);
                  if (pageNum >= 1 && pageNum <= Math.ceil(page)) {
                    setOffset((pageNum - 1) * limit);
                  }
                }}
                className="w-16 px-2 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
              <span className="dark:text-gray-200">of {Math.ceil(page)}</span>
            </div>
            <button
              onClick={() => {
                if (offset + limit < page * limit) {
                  setOffset(offset + limit);
                }
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              disabled={offset + limit >= page * limit}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
