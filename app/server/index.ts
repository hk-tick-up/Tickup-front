import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ gameRoomCode, user }) => {
    console.log(`User ${user.nickname} joined room ${gameRoomCode}`);
    socket.join(gameRoomCode);
    io.to(gameRoomCode).emit('userJoined', user);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8007;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

