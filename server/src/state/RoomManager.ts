import { Room, Player, CreateRoomPayload } from '../types';

class RoomManager {
  private static instance: RoomManager;
  
  private rooms: Map<string, Room>;
  private playerRoomMap: Map<string, string>;
  
  // NEW: Simple matchmaking queue (FIFO)
  private queue: { socketId: string, name: string, avatar: string }[];

  private constructor() {
    this.rooms = new Map();
    this.playerRoomMap = new Map();
    this.queue = [];
  }

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  // --- Matchmaking Logic ---
  public addToQueue(socketId: string, name: string, avatar: string): Room | null {
    // 1. Check if player is already in a room or queue
    if (this.playerRoomMap.has(socketId)) return null;
    if (this.queue.find(p => p.socketId === socketId)) return null;

    // 2. Add to queue
    this.queue.push({ socketId, name, avatar });

    // 3. Check if we have a match (2 players)
    if (this.queue.length >= 2) {
      const p1 = this.queue.shift()!;
      const p2 = this.queue.shift()!;

      // Create a room for them
      const roomId = this.generateRoomId();
      
      const host: Player = {
        id: p1.socketId, name: p1.name, avatar: p1.avatar,
        lives: 5, currentGuess: null, isBot: false, isReady: true, isHost: true
      };

      const challenger: Player = {
        id: p2.socketId, name: p2.name, avatar: p2.avatar,
        lives: 5, currentGuess: null, isBot: false, isReady: true, isHost: false
      };

      const newRoom: Room = {
        id: roomId,
        hostId: p1.socketId,
        players: [host, challenger],
        status: 'LOBBY', // Client will auto-start or wait for host
        mode: '1V1',
        roundNumber: 0,
        lastResult: null,
        createdAt: Date.now()
      };

      this.rooms.set(roomId, newRoom);
      this.playerRoomMap.set(p1.socketId, roomId);
      this.playerRoomMap.set(p2.socketId, roomId);

      return newRoom;
    }

    return null; // Waiting for match
  }

  public removeFromQueue(socketId: string) {
    this.queue = this.queue.filter(p => p.socketId !== socketId);
  }

  // --- Existing Methods (Keep these) ---
  public createRoom(socketId: string, payload: CreateRoomPayload): Room {
    const roomId = this.generateRoomId();
    const host: Player = {
      id: socketId, name: payload.name, avatar: payload.avatar,
      lives: 5, currentGuess: null, isBot: false, isReady: true, isHost: true
    };
    const newRoom: Room = {
      id: roomId, hostId: socketId, players: [host],
      status: 'LOBBY', mode: payload.mode, roundNumber: 0, lastResult: null, createdAt: Date.now()
    };
    this.rooms.set(roomId, newRoom);
    this.playerRoomMap.set(socketId, roomId);
    return newRoom;
  }

  public joinRoom(socketId: string, roomId: string, name: string, avatar: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found');
    if (room.status !== 'LOBBY') throw new Error('Game in progress');
    if (room.players.length >= (room.mode === '1V1' ? 2 : 5)) throw new Error('Room full');

    const newPlayer: Player = {
      id: socketId, name, avatar, lives: 5, currentGuess: null, isBot: false, isReady: false, isHost: false
    };
    room.players.push(newPlayer);
    this.playerRoomMap.set(socketId, roomId);
    return room;
  }

  public getRoom(roomId: string) { return this.rooms.get(roomId); }
  public getRoomBySocketId(socketId: string) { 
    const roomId = this.playerRoomMap.get(socketId);
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  public removePlayer(socketId: string) {
    // Also remove from queue if they disconnect while waiting
    this.removeFromQueue(socketId);

    const roomId = this.playerRoomMap.get(socketId);
    if (!roomId) return null;
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.players = room.players.filter(p => p.id !== socketId);
    this.playerRoomMap.delete(socketId);

    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return { roomId, remainingPlayers: [] };
    }
    
    // Host Migration
    if (room.hostId === socketId && room.players.length > 0) {
      room.hostId = room.players[0].id;
      room.players[0].isHost = true;
    }
    return { roomId, remainingPlayers: room.players };
  }

  private generateRoomId(): string {
    let result = '';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    do {
      result = '';
      for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    } while (this.rooms.has(result));
    return result;
  }
}

export default RoomManager.getInstance();