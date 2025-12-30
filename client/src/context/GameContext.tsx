import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import type { Room, JoinRoomPayload, CreateRoomPayload } from '../types';

interface GameContextType {
  room: Room | null;
  error: string | null;
  actions: {
    createRoom: (name: string, avatar: string, mode: '1V1' | 'MULTIPLAYER') => void;
    joinRoom: (roomId: string, name: string, avatar: string) => void;
    joinQueue: (name: string, avatar: string) => void;
    startGame: () => void;
    submitGuess: (number: number) => void;
  };
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- SINGLE SOURCE OF TRUTH FOR EVENTS ---
  useEffect(() => {
    if (!socket) return;

    socket.on('room_update', (updatedRoom: Room) => {
      console.log('📦 Room Updated:', updatedRoom);
      setRoom(updatedRoom); // Updates EVERYONE
      setError(null);
    });

    socket.on('error', (err: { message: string }) => {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off('room_update');
      socket.off('error');
    };
  }, [socket]);

  // --- ACTIONS ---
  const actions = {
    createRoom: (name: string, avatar: string, mode: '1V1' | 'MULTIPLAYER') => {
      socket?.emit('create_room', { name, avatar, mode } as CreateRoomPayload);
    },
    joinRoom: (roomId: string, name: string, avatar: string) => {
      socket?.emit('join_room', { roomId, name, avatar } as JoinRoomPayload);
    },
    joinQueue: (name: string, avatar: string) => {
      socket?.emit('join_queue', { name, avatar });
    },
    startGame: () => {
      socket?.emit('start_game');
    },
    submitGuess: (number: number) => {
      socket?.emit('submit_guess', { number });
    }
  };

  return (
    <GameContext.Provider value={{ room, error, actions }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameContext must be used within a GameProvider');
  return context;
};