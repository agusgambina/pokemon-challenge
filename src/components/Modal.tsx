import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemon: {
    name: string;
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
    } | undefined;
    abilities?: {
      ability: {
        name: string;
        url: string;
      };
      is_hidden: boolean;
      slot: number;
    }[] | undefined;
  };
}

export function Modal({ isOpen, onClose, pokemon }: ModalProps) {
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);
  
  if (!isOpen) return null;
  
  const sprites = [
    { url: pokemon.sprites?.front_default, label: 'Default Front' },
    { url: pokemon.sprites?.back_default, label: 'Default Back' },
    { url: pokemon.sprites?.front_shiny, label: 'Shiny Front' },
    { url: pokemon.sprites?.back_shiny, label: 'Shiny Back' },
    { url: pokemon.sprites?.other?.['official-artwork']?.front_default, label: 'Official Artwork' },
    { url: pokemon.sprites?.other?.dream_world?.front_default, label: 'Dream World' },
    { url: pokemon.sprites?.other?.home?.front_default, label: 'Home' },
  ].filter(sprite => sprite.url);
  
  const handleNext = () => {
    setCurrentSpriteIndex((prevIndex) => 
      prevIndex === sprites.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevious = () => {
    setCurrentSpriteIndex((prevIndex) => 
      prevIndex === 0 ? sprites.length - 1 : prevIndex - 1
    );
  };
  
  const currentSprite = sprites.length > 0 ? sprites[currentSpriteIndex] : null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold capitalize text-gray-800 dark:text-white">
            {pokemon.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          {sprites.length > 0 && currentSprite ? (
            <div className="relative w-full aspect-square mb-6">
              <img
                src={currentSprite.url}
                alt={`${pokemon.name} - ${currentSprite.label}`}
                className="w-full h-full object-contain"
                style={{
                  imageRendering: 'pixelated',
                }}
              />
              {sprites.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="w-full aspect-square mb-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No sprite available</p>
            </div>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {sprites.length > 0 && currentSprite ? `${currentSpriteIndex + 1}/${sprites.length}: ${currentSprite.label}` : ''}
          </p>
          
          <div className="w-full">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Abilities:</h3>
            {pokemon.abilities && pokemon.abilities.length > 0 ? (
              <ul className="space-y-2">
                {pokemon.abilities.map((abilityInfo) => (
                  <li key={abilityInfo.ability.name} className="flex items-start">
                    <span className="font-medium capitalize">{abilityInfo.ability.name}</span>
                    {abilityInfo.is_hidden && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full">
                        Hidden
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No abilities available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 