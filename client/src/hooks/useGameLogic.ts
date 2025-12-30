import { useState, useEffect } from 'react';
// removed unused useNavigate
import { useSocket } from '../context/SocketContext';
import type { Room, JoinRoomPayload, CreateRoomPayload } from '../types';

export const useGameLogic = () => {
  const { socket, isConnected } = useSocket();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_update', (updatedRoom: Room) => {
      console.log('📦 Room Updated:', updatedRoom);
      setRoom(updatedRoom);
      setError(null);
    });

    socket.on('game_started', () => {
      // Transition logic
    });

    socket.on('error', (err: { message: string }) => {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off('room_update');
      socket.off('game_started');
      socket.off('error');
    };
  }, [socket]);

  const createRoom = (name: string, avatar: string, mode: '1V1' | 'MULTIPLAYER') => {
    if (!socket) return;
    const payload: CreateRoomPayload = { name, avatar, mode };
    socket.emit('create_room', payload);
  };

  const joinRoom = (roomId: string, name: string, avatar: string) => {
    if (!socket) return;
    const payload: JoinRoomPayload = { roomId, name, avatar };
    socket.emit('join_room', payload);
  };

  const startGame = () => {
    if (!socket) return;
    socket.emit('start_game');
  };

  const submitGuess = (number: number) => {
    if (!socket) return;
    socket.emit('submit_guess', { number });
  };

  return {
    room,
    error,
    isConnected,
    actions: {
      createRoom,
      joinRoom,
      startGame,
      submitGuess
    }
  };
};