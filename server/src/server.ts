import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import RoomManager from './state/RoomManager';
import { GameController } from './controllers/GameController';

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all connections for dev (localhost vs IP)
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  GameController(io, socket);

  // 1. Create Room
  socket.on('create_room', (payload) => {
    try {
      const room = RoomManager.createRoom(socket.id, payload);
      socket.join(room.id);
      io.to(room.id).emit('room_update', room);
      console.log(`✅ Room created: ${room.id} by ${payload.name}`);
    } catch (e: any) {
      socket.emit('error', { message: e.message });
    }
  });

  // 2. Join Room
  socket.on('join_room', (payload) => {
    try {
      const room = RoomManager.joinRoom(socket.id, payload.roomId, payload.name, payload.avatar);
      socket.join(room.id);
      io.to(room.id).emit('room_update', room);
      console.log(`👤 ${payload.name} joined room ${payload.roomId}`);
    } catch (e: any) {
      socket.emit('error', { message: e.message });
    }
  });

  // 3. Disconnect Handling
  socket.on('disconnect', () => {
    const result = RoomManager.removePlayer(socket.id);
    if (result) {
      const { roomId, remainingPlayers } = result;
      if (remainingPlayers.length > 0) {
        io.to(roomId).emit('player_left', remainingPlayers);
        // Also send full room update to be safe
        const room = RoomManager.getRoom(roomId);
        if (room) io.to(roomId).emit('room_update', room);
      }
      console.log(`❌ Client disconnected: ${socket.id} from ${roomId}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🍒 Cherry Pick Server running on port ${PORT}`);
});