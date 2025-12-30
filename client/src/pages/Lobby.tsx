import React, { useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { AVATARS } from '../utils/assets';
import { PlayerCard } from '../components/game/PlayerCard';
import { useSocket } from '../context/SocketContext';
import { Button } from '../components/common/Button';
import { GameLayout } from '../components/layout/GameLayout';

export const Lobby: React.FC = () => {
  const { room, error, actions } = useGameLogic();
  const { socket } = useSocket();
  
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [joinCode, setJoinCode] = useState('');

  // Waiting Room View
  if (room) {
    const isHost = room.hostId === socket?.id;
    
    return (
      <GameLayout>
        <div className="flex-1 flex flex-col items-center p-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black text-rose-500 mb-1">Room: {room.id}</h1>
            <p className="text-stone-400 font-bold">
              {room.players.length} Player{room.players.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8 overflow-y-auto pb-20">
            {room.players.map(p => (
              <PlayerCard key={p.id} player={p} isMe={p.id === socket?.id} />
            ))}
          </div>

          <div className="fixed bottom-6 w-full max-w-xs px-4">
            {isHost ? (
              <Button fullWidth variant="secondary" onClick={() => actions.startGame()}>
                START GAME
              </Button>
            ) : (
              <div className="text-center text-rose-400 font-bold animate-pulse bg-white/50 py-4 rounded-2xl">
                Waiting for host...
              </div>
            )}
          </div>
        </div>
      </GameLayout>
    );
  }

  // Login / Create View
  return (
    <GameLayout>
      <div className="flex-1 flex flex-col justify-center items-center gap-6 p-6">
        <h1 className="text-5xl font-black text-rose-500 drop-shadow-sm mb-4">Cherry Pick 🍒</h1>
        
        {/* Avatar Selector */}
        <div className="flex gap-3 mb-2 p-2 bg-white/40 rounded-full backdrop-blur-sm">
          {AVATARS.map(a => (
            <button 
              key={a}
              onClick={() => setAvatar(a)}
              className={`w-12 h-12 rounded-full transition-all ${avatar === a ? 'scale-125 shadow-lg ring-2 ring-rose-500' : 'opacity-60 hover:opacity-100'}`}
            >
              <img src={a} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>

        <input 
          type="text" 
          placeholder="Enter Name" 
          value={name} 
          onChange={e => setName(e.target.value)}
          className="w-full max-w-xs px-6 py-4 rounded-2xl border-4 border-white bg-white/80 text-xl font-bold focus:border-rose-400 outline-none text-center shadow-sm placeholder:text-stone-300 text-stone-700"
        />

        {error && <div className="text-rose-500 font-bold bg-rose-100 px-4 py-2 rounded-lg text-sm">{error}</div>}

        <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
          <Button 
            variant="primary" 
            disabled={!name}
            onClick={() => actions.createRoom(name, avatar, '1V1')}
          >
            CREATE ROOM
          </Button>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="CODE" 
              value={joinCode} 
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              className="w-28 px-4 rounded-2xl border-4 border-white bg-white/80 font-bold text-center outline-none uppercase tracking-widest text-stone-600 focus:border-stone-400"
            />
            <Button 
              className="flex-1"
              variant="danger"
              disabled={!name || !joinCode}
              onClick={() => actions.joinRoom(joinCode, name, avatar)}
            >
              JOIN
            </Button>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};