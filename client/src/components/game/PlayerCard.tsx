import React from 'react';
import type { Player } from '../../types';
import { FruitBasket } from './FruitBasket';

interface PlayerCardProps {
  player: Player;
  isMe?: boolean;
  showGuess?: boolean;
}

/**
 * Displays a single player's status in the game lobby or during play.
 *
 * Highlights the current user and dims eliminated players.  Shows a small
 * ready indicator when a player has submitted their guess (but the round
 * hasn't been revealed yet), and optionally reveals the player's guess
 * when `showGuess` is true.
 */
export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isMe, showGuess }) => {
  const isDead = player.lives <= 0;

  return (
    <div
      className={`
        relative flex flex-col items-center p-4 rounded-3xl transition-all duration-300
        ${isMe ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-10' : 'bg-white/40 border border-white/60'}
        ${isDead ? 'opacity-50 grayscale' : ''}
      `}
    >
      {/* Ready Indicator (Hidden if dead or revealing) */}
      {player.currentGuess !== null && !showGuess && !isDead && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-lime-500 rounded-full shadow-[0_0_10px_rgba(132,204,22,0.6)] animate-pulse" />
      )}

      {/* Avatar */}
      <div
        className={`
          w-16 h-16 mb-2 transition-transform duration-500
          ${player.currentGuess !== null && !showGuess && !isDead ? 'scale-110 -translate-y-1' : 'scale-100'}
        `}
      >
        <img src={player.avatar} alt={player.name} className="w-full h-full object-contain drop-shadow-sm" />
      </div>

      {/* Name */}
      <h3 className={`font-bold text-sm mb-2 truncate max-w-full ${isMe ? 'text-rose-500' : 'text-stone-600'}`}>
        {player.name} {isMe && '(You)'}
      </h3>

      {/* Health */}
      <FruitBasket lives={player.lives} />

      {/* Reveal Number Bubble */}
      {showGuess && player.currentGuess !== null && (
        <div className="absolute -bottom-3 bg-stone-800 text-white font-black text-lg w-10 h-10 flex items-center justify-center rounded-full shadow-xl border-4 border-orange-50 z-20">
          {player.currentGuess}
        </div>
      )}
    </div>
  );
};