import { Room, Player, CreateRoomPayload } from '../types';
import { v4 as uuidv4 } from 'uuid';

class RoomManager {
  private static instance: RoomManager;
  
  // Primary Store: RoomID -> Room Data
  private rooms: Map<string, Room>;
  
  // Reverse Lookup: SocketID -> RoomID (For fast disconnect handling)
  private playerRoomMap: Map<string, string>;

  private constructor() {
    this.rooms = new Map();
    this.playerRoomMap = new Map();
  }

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public createRoom(socketId: string, payload: CreateRoomPayload): Room {
    const roomId = this.generateRoomId();
    
    const host: Player = {
      id: socketId,
      name: payload.name,
      avatar: payload.avatar,
      lives: 5,
      currentGuess: null,
      isBot: false,
      isReady: true,
      isHost: true
    };

    const newRoom: Room = {
      id: roomId,
      hostId: socketId,
      players: [host],
      status: 'LOBBY',
      mode: payload.mode,
      roundNumber: 0,
      lastResult: null,
      createdAt: Date.now()
    };

    this.rooms.set(roomId, newRoom);
    this.playerRoomMap.set(socketId, roomId);
    return newRoom;
  }

  public joinRoom(socketId: string, roomId: string, name: string, avatar: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    if (room.status !== 'LOBBY') {
      throw new Error('Game already in progress');
    }
    if (room.players.length >= 5) { // Max cap
      throw new Error('Room is full');
    }

    const newPlayer: Player = {
      id: socketId,
      name,
      avatar,
      lives: 5,
      currentGuess: null,
      isBot: false,
      isReady: false,
      isHost: false
    };

    room.players.push(newPlayer);
    this.playerRoomMap.set(socketId, roomId);
    return room;
  }

  public getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  public getRoomBySocketId(socketId: string): Room | undefined {
    const roomId = this.playerRoomMap.get(socketId);
    if (!roomId) return undefined;
    return this.rooms.get(roomId);
  }

  public removePlayer(socketId: string): { roomId: string, remainingPlayers: Player[] } | null {
    const roomId = this.playerRoomMap.get(socketId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Remove player
    room.players = room.players.filter(p => p.id !== socketId);
    this.playerRoomMap.delete(socketId);

    // If room is empty, delete it
    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return { roomId, remainingPlayers: [] };
    }

    // If host left, assign new host
    if (room.hostId === socketId && room.players.length > 0) {
      room.hostId = room.players[0].id;
      room.players[0].isHost = true;
    }

    return { roomId, remainingPlayers: room.players };
  }

  // Helper: Generates a 6-character clean room code (Uppercase)
  private generateRoomId(): string {
    let result = '';
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 to avoid confusion
    const length = 6;
    do {
      result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } while (this.rooms.has(result)); // Ensure uniqueness
    return result;
  }
}

export default RoomManager.getInstance();