import { Server, Socket } from 'socket.io';
import RoomManager from '../state/RoomManager';
import { GameEngine } from '../logic/GameEngine';

// Hardcoded assets to ensure they work
const BOT_ASSETS = {
  grapes: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Grapes/3D/grapes_3d.png",
  melon: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Watermelon/3D/watermelon_3d.png"
};

export const GameController = (io: Server, socket: Socket) => {

  const getRoom = () => RoomManager.getRoomBySocketId(socket.id);

  // 1. Start Game (Host only)
  socket.on('start_game', () => {
    const room = getRoom();
    // In a real app with session persistence, we'd check userId, 
    // but for now we rely on the socket having host privileges
    if (!room || room.hostId !== socket.id) return;

    // FIX: Remove any existing bots to prevent duplicates if start is clicked twice
    room.players = room.players.filter(p => !p.isBot);

    if (room.mode === '1V1') {
      const bot1Id = `BOT_${Date.now()}_1`;
      const bot2Id = `BOT_${Date.now()}_2`;
      
      room.players.push({
        id: bot1Id, name: 'Sour Grape', 
        avatar: BOT_ASSETS.grapes, // FIX: Real URL
        lives: 5, currentGuess: null, isBot: true, isReady: true, isHost: false
      });
      room.players.push({
        id: bot2Id, name: 'Coconut', 
        avatar: BOT_ASSETS.melon, // FIX: Real URL
        lives: 5, currentGuess: null, isBot: true, isReady: true, isHost: false
      });
    }

    room.status = 'PLAYING';
    room.roundNumber = 1;
    
    // Broadcast to everyone
    io.to(room.id).emit('room_update', room); 
    io.to(room.id).emit('game_started', room);
  });

  // 2. Submit Guess
  socket.on('submit_guess', ({ number }: { number: number }) => {
    const room = getRoom();
    if (!room || room.status !== 'PLAYING') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player || player.lives <= 0) return;

    player.currentGuess = number;

    const activeHumans = room.players.filter(p => !p.isBot && p.lives > 0);
    const allGuessed = activeHumans.every(p => p.currentGuess !== null);

    if (allGuessed) {
      const inputs: Record<string, number> = {};
      activeHumans.forEach(p => {
        if (p.currentGuess !== null) inputs[p.id] = p.currentGuess;
      });

      const result = GameEngine.calculateRound(room, inputs);
      room.lastResult = result;
      room.status = 'REVEAL';

      io.to(room.id).emit('round_result', { room, result });

      // Auto-start next round after 5s
      setTimeout(() => {
        startNextRound(room.id);
      }, 5000);
    } else {
      io.to(room.id).emit('player_locked', { playerId: socket.id });
    }
  });

  const startNextRound = (roomId: string) => {
    const room = RoomManager.getRoom(roomId);
    if (!room) return;

    const survivors = room.players.filter(p => p.lives > 0);
    // In 1v1 with bots, we check if the human is dead or if bots are dead
    // Simplified: Game over if only 1 entity remains
    if (survivors.length <= 1) {
      room.status = 'GAME_OVER';
      io.to(roomId).emit('game_over', { winner: survivors[0] || null });
      // Send final room update so client sees GAME_OVER status
      io.to(roomId).emit('room_update', room);
      return;
    }

    room.players.forEach(p => p.currentGuess = null);
    room.status = 'PLAYING';
    room.roundNumber += 1;
    
    io.to(roomId).emit('new_round', room);
    io.to(roomId).emit('room_update', room);
  };
};