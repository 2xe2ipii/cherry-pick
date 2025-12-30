import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { useGameLogic } from '../hooks/useGameLogic';
import { AVATARS } from '../utils/assets';
import { PlayerCard } from '../components/game/PlayerCard';
import { useSocket } from '../context/SocketContext';
import { GameLayout } from '../components/layout/GameLayout';

/**
 * The lobby page handles both the main menu and the waiting room for Cherry
 * Pick.  It has been updated to improve mobile usability and aesthetics:
 *
 *  - Avatar selection no longer scrolls horizontally; instead, all fruit
 *    avatars are shown in a responsive grid with smaller icons.  This
 *    eliminates the need for a scroll bar and makes it obvious which
 *    avatar is selected.
 *  - The page title uses vibrant gradient text with a drop shadow to give
 *    the “Cherry Pick” title more visual flair.  The dot is retained on
 *    the second line for continuity.
 *  - Overflow is allowed on the page so that input fields are not hidden
 *    behind on‑screen keyboards on mobile devices.
 */
export const Lobby: React.FC = () => {
  const { room, error, actions } = useGameLogic();
  const { socket } = useSocket();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  // Controls visibility of the avatar picker dropdown.  When true, a grid of
  // fruit icons appears below the name input allowing the user to select
  // their avatar without altering the overall page layout.
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [activeTab, setActiveTab] = useState<'1V1' | 'PARTY'>('1V1');
  const [isSearching, setIsSearching] = useState(false);

  // Copy-to-clipboard indicator and handler.  Defined outside conditional
  // branches to respect React's rules of hooks.
  const [copied, setCopied] = useState(false);
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // --- WAITING ROOM (Redesigned: Clean, No Icons) ---
  if (room) {
    const isHost = room.hostId === socket?.id;
    const canStart = isHost && (room.mode === 'MULTIPLAYER' ? room.players.length > 1 : room.players.length === 2);

    return (
      <GameLayout>
        <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-6">
          {/* Header with code and copy button */}
          <div className="text-center mb-8 mt-6">
            <div className="text-stone-400 text-xs font-black uppercase tracking-widest mb-2">Room Code</div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-6xl font-black text-rose-500 tracking-tight leading-none select-none">{room.id}</span>
              <button
                onClick={() => handleCopy(room.id)}
                className="p-2 bg-white rounded-full shadow-sm border border-stone-100 hover:bg-stone-50 active:scale-95 transition-transform"
                title="Copy code"
              >
                <Copy size={24} className="text-stone-500" />
              </button>
            </div>
            {copied && <div className="text-xs font-medium text-lime-600 mt-1">Copied!</div>}
            <div className="inline-block mt-2 px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm border border-stone-100 bg-white text-rose-500">
              {room.mode === '1V1' ? '1 VS 1' : 'Party Mode'}
            </div>
          </div>

          {/* Player area */}
          {room.mode === '1V1' ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-4">
              <div className="flex items-center justify-center gap-6">
                {/* Player One */}
                {room.players[0] && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md p-1">
                      <img src={room.players[0].avatar} alt={room.players[0].name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-bold text-rose-500">
                      {room.players[0].name} {room.players[0].id === socket?.id && '(You)'}
                    </span>
                  </div>
                )}

                <span className="text-3xl font-black text-stone-300">VS</span>

                {/* Player Two or placeholder */}
                {room.players[1] ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md p-1">
                      <img src={room.players[1].avatar} alt={room.players[1].name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-bold text-rose-500">
                      {room.players[1].name} {room.players[1].id === socket?.id && '(You)'}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <div className="w-20 h-20 rounded-full bg-stone-200 flex items-center justify-center">
                      <span className="text-4xl font-black text-stone-400">?</span>
                    </div>
                    <span className="text-sm font-medium text-stone-400">Waiting...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Party mode: fallback to grid of players
            <div className="flex-1 overflow-y-auto px-1 pb-24 no-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {room.players.map(p => (
                  <PlayerCard key={p.id} player={p} isMe={p.id === socket?.id} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="w-full mt-auto pt-6">
            {isHost ? (
              <button
                onClick={() => actions.startGame()}
                disabled={!canStart}
                className={`
                  w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-transform active:scale-95
                  ${canStart ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}
                `}
              >
                {canStart ? 'Start Game' : room.mode === '1V1' ? 'Waiting for Opponent...' : 'Waiting for Players...'}
              </button>
            ) : (
              <div className="w-full py-5 text-center text-rose-400 font-bold animate-pulse bg-stone-50 rounded-2xl">
                Waiting for host to start...
              </div>
            )}
          </div>
        </div>
      </GameLayout>
    );
  }

  // --- MAIN MENU ---
  return (
    <GameLayout>
      {/*
        Use a full‑height flex container without vertical scroll.  The order of
        elements is carefully arranged so that switching between modes does not
        cause the page to reflow.  A fixed‑height action area provides
        consistent spacing for both 1v1 and party modes, and an invisible
        placeholder button retains height when a control is not needed.
      */}
      <div className="h-full w-full max-w-md mx-auto flex flex-col p-6">

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-6xl font-extrabold leading-tight">
            <span className="block bg-gradient-to-br from-rose-500 via-pink-400 to-orange-300 text-transparent bg-clip-text drop-shadow-md">
              Cherry
            </span>
            <span className="block bg-gradient-to-br from-orange-300 via-yellow-400 to-lime-400 text-transparent bg-clip-text drop-shadow-md">
              Pick<span className="text-rose-300">.</span>
            </span>
          </h1>
        </div>

        {/* Name and Avatar Picker */}
        <div className="relative mb-4">
          {/* Row containing avatar selector and name input */}
          <div className="flex items-center gap-3">
            {/* Selected avatar button – opens a dropdown grid on click */}
            <button
              type="button"
              onClick={() => setAvatarPickerOpen(prev => !prev)}
              className="w-14 h-14 flex-shrink-0 rounded-full bg-white border border-stone-200 shadow-sm p-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              <img src={avatar} alt="selected avatar" className="w-full h-full object-contain" />
            </button>
            {/* Name input */}
            <input
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={e => setName(e.target.value)}
              className="flex-1 h-14 rounded-2xl bg-white text-xl font-bold text-center text-stone-700 placeholder:text-stone-300 shadow-sm outline-none focus:ring-4 focus:ring-rose-100 transition-all uppercase"
            />
          </div>
          {/* Avatar dropdown grid – appears below the row */}
          {avatarPickerOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/90 backdrop-blur-md border border-stone-100 rounded-2xl shadow-xl p-3 max-h-52 overflow-y-auto">
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map(a => {
                  const isSelected = avatar === a;
                  return (
                    <button
                      key={a}
                      onClick={() => {
                        setAvatar(a);
                        setAvatarPickerOpen(false);
                      }}
                      className={
                        'w-14 h-14 rounded-xl flex items-center justify-center transition-all ' +
                        (isSelected
                          ? 'bg-rose-100 shadow-inner ring-2 ring-rose-400'
                          : 'bg-white/50 hover:bg-white shadow')
                      }
                    >
                      <img src={a} alt="avatar" className="w-10 h-10 object-contain" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error && <div className="text-center text-rose-500 font-bold bg-rose-50 py-3 rounded-xl text-sm mb-4">{error}</div>}

        {/* Mode Tabs */}
        <div className="bg-stone-200/50 p-1.5 rounded-2xl flex mb-4">
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

        {/* Action Area: fixed height container that overlays 1v1 and party actions */}
        <div className="flex-none relative min-h-[230px] w-full mb-4">
          {/* 1v1 actions */}
          <div className={`${activeTab === '1V1' ? 'block' : 'hidden'} absolute inset-0 flex flex-col gap-3`}>
            {/* Top button: Find Match or Searching */}
            {!isSearching ? (
              <button
                disabled={!name}
                onClick={() => {
                  setIsSearching(true);
                  actions.joinQueue(name, avatar);
                }}
                className="w-full bg-rose-500 text-white h-16 rounded-2xl font-black text-lg shadow-lg shadow-rose-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                FIND MATCH
              </button>
            ) : (
              <div className="w-full h-16 flex items-center justify-center bg-white border-4 border-rose-100 text-rose-500 rounded-2xl font-bold animate-pulse">
                SEARCHING...
              </div>
            )}

            {/* Separator with label */}
            <div className="flex items-center gap-4 opacity-40">
              <div className="h-0.5 bg-stone-300 flex-1"></div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">PRIVATE</span>
              <div className="h-0.5 bg-stone-300 flex-1"></div>
            </div>

            {/* Join row */}
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

            {/* Bottom button: Create Private Room */}
            <button
              onClick={() => actions.createRoom(name, avatar, '1V1')}
              disabled={!name}
              className="w-full h-14 bg-lime-500 hover:bg-lime-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-lime-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              CREATE PRIVATE ROOM
            </button>
          </div>

          {/* Party actions */}
          <div className={`${activeTab === 'PARTY' ? 'block' : 'hidden'} absolute inset-0 flex flex-col gap-3`}>
            {/* Top button: Create Party */}
            <button
              disabled={!name}
              onClick={() => actions.createRoom(name, avatar, 'MULTIPLAYER')}
              className="w-full bg-rose-500 text-white h-16 rounded-2xl font-black text-lg shadow-lg shadow-rose-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              CREATE PARTY
            </button>

            {/* Separator with label */}
            <div className="flex items-center gap-4 opacity-40">
              <div className="h-0.5 bg-stone-300 flex-1"></div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">JOIN</span>
              <div className="h-0.5 bg-stone-300 flex-1"></div>
            </div>

            {/* Join row */}
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

            {/* Bottom button placeholder: invisible to preserve space */}
            <button className="w-full h-14 invisible" aria-hidden="true">
              placeholder
            </button>
          </div>
        </div>

        {/* Avatar picker moved next to the name input; bottom row removed */}

      </div>
    </GameLayout>
  );
};