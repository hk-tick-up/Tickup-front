import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// CORS 미들웨어 설정
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // 클라이언트 주소
    methods: ["GET", "POST"],
    credentials: true
}));

// Socket.IO 서버 설정
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000", // 클라이언트 주소
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'] // 웹소켓을 우선적으로 사용
});

// ... Socket.IO 이벤트 핸들러 ...

const PORT = process.env.PORT || 3007;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

