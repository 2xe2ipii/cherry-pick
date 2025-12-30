import React from 'react';
import type { Player } from '../../types';
import { FruitBasket } from './FruitBasket';

interface PlayerCardProps {
  player: Player;
  isMe?: boolean;
  showGuess?: boolean; // Only true during reveal phase
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isMe, showGuess }) => {
  return (
    <div className={`
      relative flex flex-col items-center p-4 rounded-3xl transition-all duration-300
      ${isMe ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-105 z-10' : 'bg-white/60 shadow-sm scale-100'}
      border-2 ${player.lives === 0 ? 'border-stone-200 opacity-60' : isMe ? 'border-rose-200' : 'border-transparent'}
    `}>
      
      {/* Status Badge */}
      {player.currentGuess !== null && !showGuess && player.lives > 0 && (
        <div className="absolute -top-2 right-4 bg-lime-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          READY
        </div>
      )}

      {/* Avatar */}
      <div className={`
        w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-rose-50 flex items-center justify-center mb-2 shadow-inner
        ${player.lives === 0 ? 'grayscale' : ''}
      `}>
        <img src={player.avatar} alt={player.name} className="w-16 h-16 object-contain drop-shadow-md" />
      </div>

      {/* Name */}
      <h3 className="font-bold text-stone-700 text-lg truncate max-w-[120px]">
        {player.name} {isMe && '(You)'}
      </h3>

      {/* Health */}
      <FruitBasket lives={player.lives} />

      {/* Reveal Number (Only shown at end of round) */}
      {showGuess && player.currentGuess !== null && (
        <div className="absolute -bottom-4 bg-stone-800 text-white font-black text-xl w-10 h-10 flex items-center justify-center rounded-full shadow-lg border-4 border-orange-50">
          {player.currentGuess}
        </div>
      )}
    </div>
  );
};