// hooks/useWebSocket.ts
import { useEffect, useState } from 'react';

export const useWebSocket = (gameRoomCode: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws`);

        // ws.onopen = () => {
        //     console.log('WebSocket Connected');
        //     setIsConnected(true);
        //     // 방 입장 메시지 전송
        //     ws.send(JSON.stringify({
        //         type: 'JOIN_ROOM',
        //         gameRoomCode: gameRoomCode,
        //         userId: sessionStorage.getItem('id'),
        //         nickname: sessionStorage.getItem('nickname')
        //     }));
        // };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setError('WebSocket connection error');
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
        };

        setSocket(ws);

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'LEAVE_ROOM',
                    gameRoomCode: gameRoomCode,
                    userId: sessionStorage.getItem('id')
                }));
                ws.close();
            }
        };
    }, [gameRoomCode]);

    return { socket, isConnected, error };
};