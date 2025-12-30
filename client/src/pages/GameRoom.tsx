import React, { useEffect, useState } from 'react';
import type { Room } from '../types';
import { useGameLogic } from '../hooks/useGameLogic';
import { PlayerCard } from '../components/game/PlayerCard';
import { NumberPad } from '../components/game/NumberPad';
import { useSocket } from '../context/SocketContext';

// Ensure "export const" is here
export const GameRoom: React.FC<{ room: Room }> = ({ room }) => {
  const { actions } = useGameLogic();
  const { socket } = useSocket();
  const [myGuess, setMyGuess] = useState<number | null>(null);

  useEffect(() => {
    const me = room.players.find(p => p.id === socket?.id);
    if (me?.currentGuess === null) {
      setMyGuess(null);
    }
  }, [room.roundNumber, socket?.id, room.players]);

  const handleSubmit = (val: number) => {
    setMyGuess(val);
    actions.submitGuess(val);
  };

  const isReveal = room.status === 'REVEAL' || room.status === 'GAME_OVER';

  return (
    <div className="h-[100dvh] w-full bg-orange-50 flex flex-col overflow-hidden">
      {/* Game Info */}
      <div className="flex-1 flex flex-col items-center p-4 gap-4 overflow-y-auto">
        <div className="flex justify-between w-full max-w-md items-center">
          <span className="text-stone-400 font-bold">ROUND {room.roundNumber}</span>
          <span className="bg-white px-3 py-1 rounded-full text-stone-600 font-bold text-sm shadow-sm">
            {room.id}
          </span>
        </div>

        {/* Result Banner */}
        {isReveal && room.lastResult && (
          <div className="bg-white p-4 rounded-3xl shadow-xl w-full max-w-xs text-center animate-bounce-slow border-2 border-rose-100">
            <div className="text-stone-400 text-sm font-bold uppercase mb-1">Target Number</div>
            <div className="text-5xl font-black text-rose-500 mb-2">{room.lastResult.targetNumber}</div>
            {room.lastResult.isRottenZero && (
              <div className="bg-stone-800 text-white text-xs px-2 py-1 rounded inline-block">
                ☠️ ROTTEN ZERO TRIGGERED!
              </div>
            )}
          </div>
        )}

        {/* Players Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md pb-20">
          {room.players.map(p => (
            <PlayerCard 
              key={p.id} 
              player={p} 
              isMe={p.id === socket?.id} 
              showGuess={isReveal}
            />
          ))}
        </div>
      </div>

      {/* Keypad */}
      {room.status === 'PLAYING' && (
        <div className="bg-white/50 backdrop-blur-md rounded-t-[3rem] p-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-white">
          <NumberPad onSubmit={handleSubmit} disabled={myGuess !== null} />
          {myGuess !== null && (
            <div className="text-center mt-2 text-rose-500 font-bold animate-pulse">
              Locked in! Waiting for others...
            </div>
          )}
        </div>
      )}
      
      {/* Game Over */}
      {room.status === 'GAME_OVER' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white p-8 rounded-3xl text-center shadow-2xl">
            <h2 className="text-3xl font-black text-stone-800 mb-4">GAME OVER</h2>
            <button 
              onClick={() => window.location.reload()}
              className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};