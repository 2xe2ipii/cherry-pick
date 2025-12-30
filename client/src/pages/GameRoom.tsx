import React, { useEffect, useState } from 'react';
import type { Room } from '../types';
import { useGameLogic } from '../hooks/useGameLogic';
import { PlayerCard } from '../components/game/PlayerCard';
import { NumberPad } from '../components/game/NumberPad';
import { useSocket } from '../context/SocketContext';
import { GameLayout } from '../components/layout/GameLayout';

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
    <GameLayout>
      {/* 1. Header Info */}
      <div className="flex justify-between items-center p-6 pb-2">
        <div className="flex flex-col">
          <span className="text-xs font-black text-stone-400 uppercase tracking-widest">Room</span>
          <span className="text-xl font-black text-stone-700">{room.id}</span>
        </div>
        <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-stone-100">
          <span className="text-rose-500 font-black">ROUND {room.roundNumber}</span>
        </div>
      </div>

      {/* 2. The Arena (Player Grid) */}
      {/* We use flex-1 to fill space, but allow scroll if many players */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        
        {/* Result Overlay (Floating) */}
        {isReveal && room.lastResult && (
          <div className="mb-6 bg-white p-6 rounded-[2rem] shadow-xl text-center border-4 border-rose-100 animate-bounce-slow">
            <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Target Number</div>
            <div className="text-6xl font-black text-rose-500">{room.lastResult.targetNumber}</div>
            {room.lastResult.isRottenZero && (
              <div className="mt-2 text-xs font-bold bg-stone-800 text-white py-1 px-3 rounded-full inline-block">
                ☠️ ROTTEN ZERO
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pb-24">
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

      {/* 3. The Input Zone (Fixed Bottom) */}
      <div className={`
        fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-white/50 rounded-t-[2.5rem] 
        shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-spring
        ${room.status === 'PLAYING' ? 'translate-y-0' : 'translate-y-[120%]'}
      `}>
        <div className="p-6 pb-10">
          {myGuess === null ? (
            <NumberPad onSubmit={handleSubmit} />
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="text-6xl font-black text-rose-200">{myGuess}</div>
              <div className="text-rose-500 font-bold animate-pulse">Locked In</div>
              <div className="text-stone-400 text-sm font-medium">Waiting for others...</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Game Over Overlay */}
      {room.status === 'GAME_OVER' && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-[2.5rem] text-center shadow-2xl w-full max-w-sm">
            <div className="text-5xl mb-4">👑</div>
            <h2 className="text-3xl font-black text-stone-800 mb-6">GAME OVER</h2>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-rose-200 active:scale-95 transition-transform"
            >
              BACK TO LOBBY
            </button>
          </div>
        </div>
      )}
    </GameLayout>
  );
};