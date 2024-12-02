import { useEffect, useState, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8007';

export function useSocket(gameRoomCode: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = useCallback(() => {
    console.log(`Attempting to connect to ${SOCKET_URL}`);
    if (socketRef.current?.connected) {
      console.log('Socket already connected');
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true, // Added forceNew
      query: { gameRoomCode }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
      setError(`연결 오류: ${err.message}. 재연결을 시도합니다...`);
    });

    newSocket.io.on('error', (err) => { // Modified error handling
      console.error('Socket.IO error:', err);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      setError(`Disconnected: ${reason}`);
    });

    socketRef.current = newSocket;
  }, [gameRoomCode]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket');
        socketRef.current.disconnect();
      }
    };
  }, [connectSocket]);

  const reconnect = useCallback(() => {
    console.log('Attempting to reconnect');
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    connectSocket();
  }, [connectSocket]);

  return { socket: socketRef.current, isConnected, error, reconnect };
}

