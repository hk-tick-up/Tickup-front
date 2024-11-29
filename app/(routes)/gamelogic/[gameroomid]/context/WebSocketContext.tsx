'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!clientRef.current) {
            const socket = new SockJS('http://localhost:8080/ws', null, {
                withCredentials: true,
            });

            const client = new Client({
                webSocketFactory: () => socket as any,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => console.log('WebSocket connected'),
                onStompError: (error) => console.error('STOMP error', error),
            });

            client.activate();
            clientRef.current = client;
            setStompClient(client);
        }

        return () => {
            if (clientRef.current?.active) {
                console.log('Deactivating WebSocket client');
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ stompClient }}>
            {children}
        </WebSocketContext.Provider>
    );
};
