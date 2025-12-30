export type GameStatus = 'LOBBY' | 'PLAYING' | 'REVEAL' | 'GAME_OVER';

export interface Player {
  id: string;             // Socket ID
  name: string;
  avatar: string;         // URL to 3D asset
  lives: number;          // Defaults to 5
  currentGuess: number | null;
  isBot: boolean;
  isReady: boolean;       // For Lobby status
  isHost: boolean;
}

export interface RoundResult {
  targetNumber: number;
  average: number;
  winnerId: string | null; // Null if everyone died (rare) or tie
  eliminatedIds: string[]; // Players who lost a life this round
  isRottenZero: boolean;   // Did someone pick 0?
  allGuesses: Record<string, number>; // { socketId: 45 }
}

export interface Room {
  id: string;             // 6-char code
  hostId: string;
  players: Player[];
  status: GameStatus;
  mode: '1V1' | 'MULTIPLAYER';
  roundNumber: number;
  lastResult: RoundResult | null;
  createdAt: number;      // For cleanup logic later
}

// Socket Payload Types (for type safety in controllers)
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