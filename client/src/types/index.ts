// Shared type definitions used across the client.

export type GameStatus = 'LOBBY' | 'PLAYING' | 'REVEAL' | 'GAME_OVER';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  lives: number;
  currentGuess: number | null;
  isBot: boolean;
  isReady: boolean;
  isHost: boolean;
}

export interface RoundResult {
  targetNumber: number;
  average: number;
  winnerId: string | null;
  eliminatedIds: string[];
  isRottenZero: boolean;
  allGuesses: Record<string, number>;
}

export interface Room {
  id: string;
  hostId: string;
  players: Player[];
  status: GameStatus;
  mode: '1V1' | 'MULTIPLAYER';
  roundNumber: number;
  lastResult: RoundResult | null;
  createdAt: number;
}

// Payloads for socket events
export interface JoinRoomPayload {
  roomId: string;
  name: string;
  avatar: string;
}

export interface CreateRoomPayload {
  name: string;
  avatar: string;
  mode: '1V1' | 'MULTIPLAYER';
}