import { Pokemon } from '@/lib/services/pokemonService';

interface CardProps {
  pokemon: Pokemon;
  details: {
    sprites?: {
      front_default?: string;
    };
  };
}

export function Card({ pokemon, details }: CardProps) {
  return (
    <div className="group relative">
      <div className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
        {details?.sprites?.front_default ? (
          <img
            src={details.sprites.front_default}
            alt={pokemon.name}
            className="w-3/4 h-3/4 object-contain image-rendering-pixelated transform hover:scale-110 transition-transform duration-200"
            style={{
              imageRendering: 'pixelated',
              imageRendering: '-moz-crisp-edges',
              imageRendering: '-webkit-crisp-edges',
            }}
          />
        ) : (
          <p className="text-xl font-bold">{pokemon.name}</p>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 dark:text-gray-200">
            <a href={pokemon.url}>
              <span aria-hidden="true" className="absolute inset-0" />
              {pokemon.name}
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
} 