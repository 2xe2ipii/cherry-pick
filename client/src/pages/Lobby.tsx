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
  const [activeTab, setActiveTab] = useState<'1V1' | 'PARTY'>('1V1');
  const [isSearching, setIsSearching] = useState(false);

  // --- WAITING ROOM (Unchanged) ---
  if (room) {
    const isHost = room.hostId === socket?.id;
    const canStart = isHost && (room.mode === 'MULTIPLAYER' ? room.players.length > 1 : room.players.length === 2);

    return (
      <GameLayout>
        <div className="flex-1 flex flex-col items-center p-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black text-rose-500 mb-1">Room: {room.id}</h1>
            <div className="inline-block px-3 py-1 bg-white rounded-full text-stone-400 font-bold text-sm shadow-sm">
              {room.mode === '1V1' ? 'Fruit Fight (1v1)' : 'Party Bowl'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8 overflow-y-auto pb-20">
            {room.players.map(p => (
              <PlayerCard key={p.id} player={p} isMe={p.id === socket?.id} />
            ))}
          </div>

          <div className="fixed bottom-6 w-full max-w-xs px-4">
            {isHost ? (
              <Button fullWidth variant={canStart ? "primary" : "secondary"} disabled={!canStart} onClick={() => actions.startGame()}>
                {canStart ? 'START GAME' : 'WAITING FOR PLAYERS...'}
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

  // --- LOGIN / MAIN MENU ---
  return (
    <GameLayout>
      <div className="flex-1 flex flex-col justify-center items-center gap-6 p-6">
        <h1 className="text-5xl font-black text-rose-500 drop-shadow-sm mb-2">Cherry Pick 🍒</h1>

        {/* Avatar Selection (Fixed: Centered & Sticker Look) */}
        <div className="flex items-center gap-2 p-3 bg-stone-200/50 rounded-3xl backdrop-blur-sm shadow-inner">
          {AVATARS.map(a => {
            const isSelected = avatar === a;
            return (
              <button 
                key={a}
                onClick={() => setAvatar(a)}
                className={`
                  relative w-12 h-12 rounded-2xl transition-all duration-300 ease-spring
                  ${isSelected 
                    ? 'bg-white scale-110 shadow-lg z-10'  // No vertical shift, just pop
                    : 'bg-transparent opacity-50 hover:opacity-100 hover:bg-white/50'}
                `}
              >
                <img src={a} className="w-full h-full object-contain p-1" alt="avatar" />
              </button>
            );
          })}
        </div>

        <input 
          type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)}
          className="w-full max-w-xs px-6 py-4 rounded-2xl border-4 border-white bg-white/80 text-xl font-bold focus:border-rose-400 outline-none text-center shadow-sm text-stone-700 placeholder:text-stone-300"
        />

        {error && <div className="text-rose-500 font-bold bg-rose-100 px-4 py-2 rounded-lg text-sm">{error}</div>}

        {/* Tabs */}
        <div className="flex bg-white/50 p-1 rounded-2xl w-full max-w-xs">
          <button 
            onClick={() => setActiveTab('1V1')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === '1V1' ? 'bg-white text-rose-500 shadow-sm' : 'text-stone-500'}`}
          >
            1 VS 1
          </button>
          <button 
            onClick={() => setActiveTab('PARTY')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'PARTY' ? 'bg-white text-rose-500 shadow-sm' : 'text-stone-500'}`}
          >
            PARTY
          </button>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-xs min-h-[16rem] flex flex-col justify-start pt-2 gap-3">
          
          {/* 1V1 TAB CONTENT */}
          {activeTab === '1V1' && (
            <>
              {isSearching ? (
                 <div className="bg-white py-4 rounded-2xl text-center font-bold text-rose-500 animate-pulse border-4 border-rose-100">
                   Searching for opponent...
                 </div>
              ) : (
                <Button variant="primary" disabled={!name} onClick={() => { setIsSearching(true); actions.joinQueue(name, avatar); }}>
                  FIND MATCH
                </Button>
              )}
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-300"></div>
                <span className="flex-shrink mx-4 text-stone-400 text-xs font-bold uppercase">Or Private</span>
                <div className="flex-grow border-t border-stone-300"></div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CODE" 
                  value={joinCode} 
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 rounded-2xl border-4 border-white bg-white/80 font-bold text-center outline-none uppercase tracking-widest text-stone-600 focus:border-stone-400"
                />
                <Button className="w-24" variant="danger" disabled={!name || !joinCode} onClick={() => actions.joinRoom(joinCode, name, avatar)}>
                  JOIN
                </Button>
              </div>

              <Button variant="secondary" disabled={!name} onClick={() => actions.createRoom(name, avatar, '1V1')}>
                CREATE PRIVATE ROOM
              </Button>
            </>
          )}

          {/* PARTY TAB CONTENT */}
          {activeTab === 'PARTY' && (
            <>
              <Button variant="primary" disabled={!name} onClick={() => actions.createRoom(name, avatar, 'MULTIPLAYER')}>
                CREATE PARTY
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-300"></div>
                <span className="flex-shrink mx-4 text-stone-400 text-xs font-bold uppercase">Or Join</span>
                <div className="flex-grow border-t border-stone-300"></div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CODE" 
                  value={joinCode} 
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 rounded-2xl border-4 border-white bg-white/80 font-bold text-center outline-none uppercase tracking-widest text-stone-600 focus:border-stone-400"
                />
                <Button className="w-24" variant="danger" disabled={!name || !joinCode} onClick={() => actions.joinRoom(joinCode, name, avatar)}>
                  JOIN
                </Button>
              </div>
              
              <div className="flex-1"></div>
            </>
          )}
        </div>
      </div>
    </GameLayout>
  );
};