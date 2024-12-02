import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

export function initializeSocket(server: HTTPServer) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('새로운 클라이언트가 연결되었습니다.');

        socket.on('updateStatus', ({userId, status}) => {
            socket.broadcast.emit('userStatusUpdate', { userId, status });
        });

        socket.on('startGame', (gameData) => {
            console.log('게임 시작:', gameData);
            startGameService(gameData);
            io.emit('gameStart', gameData);
        });
    });

    return io;
}

interface TEMPGAMEDATA {
  tempData:string;
}

async function startGameService(gameData: TEMPGAMEDATA) {
    try {
        const response = await fetch(process.env.GAME_SERVICE_URL || 'http://localhost:4000/start', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(gameData),
        });
        const data = await response.json();
        console.log('게임 서비스 응답', data);
    } catch (error) {
        console.error('게임 서비스 오류:' ,error);
    }
    
}