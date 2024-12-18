'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { useRankingStore } from '../lib/store/useRankingStore';
import { usePathname } from 'next/navigation';

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
    const subscriptionRef = useRef<any>(null);
    const { setRankings } = useRankingStore();
    const pathname = usePathname();

    // Extract gameRoomId from URL
    const gameRoomId = pathname.split('/')[2]; // gameroomid 추출

    // Initialize WebSocket client
    useEffect(() => {
        if (!clientRef.current) {
            console.log("Initializing WebSocket connection...");
            const socket = new SockJS(`${process.env.NEXT_PUBLIC_GAME_LOGIC_API_URL}/ws`, null, {
                withCredentials: true,
            });

            const client = new Client({
                webSocketFactory: () => socket as WebSocket,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('WebSocket connected');
                    setStompClient(client);
                },
                onStompError: (error) => {
                    console.error('STOMP error', error);
                },
                onWebSocketClose: () => {
                    console.log('WebSocket connection closed');
                },
            });

            client.activate();
            clientRef.current = client;
        }

        return () => {
            if (clientRef.current?.active) {
                console.log('Deactivating WebSocket client');
                clientRef.current.deactivate();
                clientRef.current = null;
                setStompClient(null);
            }
        };
    }, []);

    // Subscribe to rankings
    const subscribeToRankings = useCallback(() => {
        if (!stompClient || !stompClient.connected || !gameRoomId) {
            console.log('Subscription not possible yet. Waiting for valid stompClient and gameRoomId.');
            return;
        }

        // Unsubscribe from previous subscription
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        subscriptionRef.current = stompClient.subscribe(
            `/topic/gameRoom/${gameRoomId}/rankings`,
            (message: IMessage) => {
                try {
                    const data = JSON.parse(message.body);
                    console.log('Received rankings update:', data);
                    setRankings(data);
                } catch (error) {
                    console.error('Error processing rankings message:', error);
                }
            }
        );

        console.log(`Subscribed to rankings for gameRoomId: ${gameRoomId}`);
    }, [stompClient, gameRoomId, setRankings]);

    // Effect to handle subscription updates
    useEffect(() => {
        if (stompClient && gameRoomId) {
            subscribeToRankings();
        }

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
                console.log('Unsubscribed from rankings');
            }
        };
    }, [stompClient, gameRoomId, subscribeToRankings]);

    return (
        <WebSocketContext.Provider value={{ stompClient }}>
            {children}
        </WebSocketContext.Provider>
    );
};
