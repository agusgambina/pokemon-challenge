'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Pokemon {
  name: string;
  url: string;
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      async function fetchPosts() {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon/');
        const data = await res.json();
        console.log(data);
        setPokemons(data.results);
      }
      fetchPosts();
    }
  }, [user]);

  // Don't render anything while checking authentication
  if (loading || !user) {
    return null;
  }

  if (!pokemons) return <div>Loading...</div>;

  return (
    <div
      className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen gap-16 font-[family:var(--font-geist-sans)]"
      style={{ padding: '1%' }}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

          {/* Search Bar */}
          <div className="relative max-w-md w-full mx-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search..."
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {pokemons?.map((pokemon) => (
              <div key={pokemon.name} className="group relative">
                <div className="aspect-square w-full rounded-md bg-gray-200 flex items-center justify-center">
                  <p className="text-xl font-bold">{pokemon.name}</p>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={pokemon.url}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {pokemon.name}
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
