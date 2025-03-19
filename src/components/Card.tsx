import { useState } from 'react';
import { Pokemon } from '@/lib/services/pokemonService';
import { Modal } from './Modal';

interface CardProps {
  pokemon: Pokemon;
  details:
    | {
        sprites?: {
          front_default?: string;
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
    | undefined;
}

export function Card({ pokemon, details }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="group relative cursor-pointer" onClick={openModal}>
        <div className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          {details?.sprites?.front_default ? (
            <img
              src={details.sprites.front_default}
              alt={pokemon.name}
              className="w-3/4 h-3/4 object-contain transform hover:scale-110 transition-transform duration-200"
              style={{
                imageRendering: 'pixelated',
              }}
            />
          ) : (
            <p className="text-xl font-bold">{pokemon.name}</p>
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700 dark:text-gray-200">
              <span className="capitalize">{pokemon.name}</span>
            </h3>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        pokemon={{
          name: pokemon.name,
          sprites: details?.sprites,
          abilities: details?.abilities,
        }}
      />
    </>
  );
}
