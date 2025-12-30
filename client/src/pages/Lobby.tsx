import React, { useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { AVATARS } from '../utils/assets';
import { PlayerCard } from '../components/game/PlayerCard';
import { useSocket } from '../context/SocketContext';
import { GameLayout } from '../components/layout/GameLayout';

export const Lobby: React.FC = () => {
  const { room, error, actions } = useGameLogic();
  const { socket } = useSocket();
  
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [joinCode, setJoinCode] = useState('');
  const [activeTab, setActiveTab] = useState<'1V1' | 'PARTY'>('1V1');
  const [isSearching, setIsSearching] = useState(false);

  // --- WAITING ROOM (Redesigned: Clean, No Icons) ---
  if (room) {
    const isHost = room.hostId === socket?.id;
    const canStart = isHost && (room.mode === 'MULTIPLAYER' ? room.players.length > 1 : room.players.length === 2);

    return (
      <GameLayout>
        <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6 mt-8">
             <div className="text-stone-400 text-xs font-black uppercase tracking-widest mb-2">ROOM CODE</div>
             <div className="text-6xl font-black text-rose-500 tracking-tight leading-none mb-4">{room.id}</div>
             
             {/* Text Only Badge */}
             <div className="inline-block px-4 py-2 bg-white rounded-xl text-sm font-black text-stone-600 shadow-sm border border-stone-100">
               {room.mode === '1V1' ? '1 VS 1' : 'PARTY MODE'}
             </div>
          </div>

          {/* Player Grid */}
          <div className="flex-1 overflow-y-auto pb-24 px-1 no-scrollbar">
            <div className="grid grid-cols-1 gap-3">
              {room.players.map(p => (
                <PlayerCard key={p.id} player={p} isMe={p.id === socket?.id} />
              ))}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-stone-100 p-4 pb-8 z-50">
            <div className="max-w-md mx-auto">
              {isHost ? (
                <button 
                  onClick={() => actions.startGame()}
                  disabled={!canStart}
                  className={`
                    w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-transform active:scale-95
                    ${canStart ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}
                  `}
                >
                  {canStart ? 'START GAME' : 'WAITING FOR PLAYERS...'}
                </button>
              ) : (
                <div className="w-full py-5 text-center text-rose-400 font-bold animate-pulse bg-stone-50 rounded-2xl">
                  Waiting for host to start...
                </div>
              )}
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  // --- MAIN MENU ---
  return (
    <GameLayout>
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center p-6 gap-6">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-rose-500 drop-shadow-sm">Cherry<br/>Pick<span className="text-rose-300">.</span></h1>
        </div>

        {/* Avatar Scroller (Clean, No Scrollbars) */}
        <div className="w-full bg-white/40 p-2 rounded-[2rem] backdrop-blur-sm border border-white/50">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-2 scroll-smooth snap-x">
            {AVATARS.map(a => {
              const isSelected = avatar === a;
              return (
                <button 
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`
                    flex-shrink-0 w-16 h-16 rounded-2xl transition-all duration-300 snap-center
                    ${isSelected 
                      ? 'bg-white shadow-lg scale-105 z-10' 
                      : 'bg-white/30 hover:bg-white/60 opacity-60'}
                  `}
                >
                  <img src={a} className="w-full h-full object-contain p-2" alt="fruit" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Name Input */}
        <input 
          type="text" placeholder="YOUR NAME" value={name} onChange={e => setName(e.target.value)}
          className="w-full h-16 rounded-2xl bg-white text-xl font-bold text-center text-stone-700 placeholder:text-stone-300 shadow-sm outline-none focus:ring-4 focus:ring-rose-100 transition-all uppercase"
        />

        {error && <div className="text-center text-rose-500 font-bold bg-rose-50 py-3 rounded-xl text-sm">{error}</div>}

        {/* Mode Tabs */}
        <div className="bg-stone-200/50 p-1.5 rounded-2xl flex">
          <button 
            onClick={() => setActiveTab('1V1')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === '1V1' ? 'bg-white text-rose-500 shadow-sm' : 'text-stone-400'}`}
          >
            1 vs 1
          </button>
          <button 
            onClick={() => setActiveTab('PARTY')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'PARTY' ? 'bg-white text-rose-500 shadow-sm' : 'text-stone-400'}`}
          >
            Party
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-3 min-h-[180px]">
          {activeTab === '1V1' ? (
            <>
              {!isSearching ? (
                <button 
                  disabled={!name}
                  onClick={() => { setIsSearching(true); actions.joinQueue(name, avatar); }}
                  className="w-full bg-rose-500 text-white h-16 rounded-2xl font-black text-lg shadow-lg shadow-rose-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  FIND MATCH
                </button>
              ) : (
                <div className="w-full h-16 flex items-center justify-center bg-white border-4 border-rose-100 text-rose-500 rounded-2xl font-bold animate-pulse">
                  SEARCHING...
                </div>
              )}
              
              <div className="flex items-center gap-4 opacity-40 my-2">
                <div className="h-0.5 bg-stone-300 flex-1"></div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">PRIVATE</span>
                <div className="h-0.5 bg-stone-300 flex-1"></div>
              </div>

              {/* Private Section */}
              <div className="flex gap-2">
                <input 
                  className="flex-[2] h-14 bg-white/50 px-4 rounded-xl font-bold text-center uppercase tracking-widest text-lg text-stone-700 outline-none focus:bg-white focus:ring-2 focus:ring-stone-200 transition-all"
                  placeholder="CODE" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                />
                <button 
                  disabled={!name || !joinCode}
                  onClick={() => actions.joinRoom(joinCode, name, avatar)}
                  className="flex-1 bg-stone-800 text-white rounded-xl font-bold active:scale-95 transition-all disabled:opacity-50"
                >
                  JOIN
                </button>
              </div>
              
              {/* THE GREEN BUTTON */}
              <button 
                onClick={() => actions.createRoom(name, avatar, '1V1')} 
                disabled={!name} 
                className="w-full h-14 bg-lime-500 hover:bg-lime-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-lime-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                CREATE PRIVATE ROOM
              </button>
            </>
          ) : (
            // Party Mode (Simplified to match)
            <>
               <button 
                  disabled={!name}
                  onClick={() => actions.createRoom(name, avatar, 'MULTIPLAYER')}
                  className="w-full bg-rose-500 text-white h-16 rounded-2xl font-black text-lg shadow-lg shadow-rose-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  CREATE PARTY
                </button>

                <div className="flex items-center gap-4 opacity-40 my-2">
                  <div className="h-0.5 bg-stone-300 flex-1"></div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">JOIN</span>
                  <div className="h-0.5 bg-stone-300 flex-1"></div>
                </div>

                <div className="flex gap-2">
                  <input 
                    className="flex-[2] h-14 bg-white/50 px-4 rounded-xl font-bold text-center uppercase tracking-widest text-lg text-stone-700 outline-none focus:bg-white focus:ring-2 focus:ring-stone-200 transition-all"
                    placeholder="CODE" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  />
                  <button 
                    disabled={!name || !joinCode}
                    onClick={() => actions.joinRoom(joinCode, name, avatar)}
                    className="flex-1 bg-stone-800 text-white rounded-xl font-bold active:scale-95 transition-all disabled:opacity-50"
                  >
                    JOIN
                  </button>
                </div>
            </>
          )}
        </div>
      </div>
    </GameLayout>
  );
};