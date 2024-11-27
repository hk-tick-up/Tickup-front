'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface WebSocketContextType {
    stompClient: Client | null;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error('useWebSocket must be used within WebSocketProvider');
    return context;
};

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket as any,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => console.log('WebSocket connected'),
            onStompError: (error) => console.error('STOMP error', error),
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ stompClient }}>
            {children}
        </WebSocketContext.Provider>
    );
};
