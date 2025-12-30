import React from 'react';
import { FRUIT_ASSETS } from '../../utils/assets';

interface FruitBasketProps {
  lives: number; // 0 to 5
}

// Map life index to a specific fruit asset for variety
const LIFE_ICONS = [
  FRUIT_ASSETS.apple,
  FRUIT_ASSETS.orange,
  FRUIT_ASSETS.grapes,
  FRUIT_ASSETS.lemon,
  FRUIT_ASSETS.melon
];

export const FruitBasket: React.FC<FruitBasketProps> = ({ lives }) => {
  return (
    <div className="flex items-center gap-1 bg-white/40 px-3 py-2 rounded-full backdrop-blur-sm shadow-sm border border-white/50">
      {LIFE_ICONS.map((icon, index) => {
        // A life is active if the index is less than the current count
        const isAlive = index < lives;
        
        return (
          <div key={index} className="relative w-8 h-8 flex items-center justify-center">
            {/* The Active Fruit */}
            <img 
              src={icon} 
              alt="Life"
              className={`
                absolute w-full h-full object-contain transition-all duration-500 ease-spring
                ${isAlive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
              `} 
            />
            
            {/* The "Ghost" Placeholder (shows when life is lost) */}
            <div className={`
              w-4 h-4 rounded-full bg-stone-200/50 transition-all duration-500
              ${!isAlive ? 'scale-100' : 'scale-0'}
            `} />
          </div>
        );
      })}
    </div>
  );
};