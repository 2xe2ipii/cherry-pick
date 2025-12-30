import React from 'react';
import { FRUIT_ASSETS } from '../../utils/assets';

interface FruitBasketProps {
  lives: number;
}

/**
 * Displays a small indicator showing how many lives a player has left.
 *
 * Uses the cherry emoji by default to represent lives.  When lives
 * drop to zero, the icon is grayed out and the background dims.
 */
export const FruitBasket: React.FC<FruitBasketProps> = ({ lives }) => {
  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300
        ${lives === 0 ? 'bg-stone-200 opacity-50' : 'bg-white shadow-sm border border-stone-100'}
      `}
    >
      <img
        src={FRUIT_ASSETS.cherry}
        alt="Lives"
        className={`w-5 h-5 object-contain ${lives === 0 ? 'grayscale' : ''}`}
      />
      <span className={`font-black text-lg ${lives > 0 ? 'text-rose-500' : 'text-stone-400'}`}>x{lives}</span>
    </div>
  );
};