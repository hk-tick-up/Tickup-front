/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (waitingRoomId: string, onMessageReceived?: (data: any) => void) =>  {
    const [stompClient, setStompClient] = useState<StompJs.Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [subscriptions, setSubscriptions] = useState<StompJs.StompSubscription[]>([]);

    const initializeWebSocket = useCallback(() => {
        const userId = typeof window !== 'undefined' ? sessionStorage.getItem('id') : null;
        const nickname = typeof window !== 'undefined' ? sessionStorage.getItem('nickname') : null;
        const storedGameType = typeof window !== 'undefined' ? sessionStorage.getItem('gameType') as 'Basic' | 'Private' : 'Basic';
        const storedWaitingRoomId = typeof window !== 'undefined' ? sessionStorage.getItem('waitingRoomId') : null;
        const token = typeof window !== 'undefined' ? sessionStorage.getItem('bearer') : null;

        const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://192.168.1.6:8007/ws";


        if (!token) {
            setError(new Error('Authentication token not found'));
            return;
        }
     // 이미 활성화된 클라이언트가 있다면 재사용
        if (stompClient?.active) {
            return;
        }

    const client = new StompJs.Client({
        brokerURL: SOCKET_URL,
        connectHeaders: {
            'Authorization': `Bearer ${token}`,
            'waitingRoomId': waitingRoomId
        },
        debug: (str) => {
            console.log('STOMP: ' + str);
        },

        reconnectDelay: 5000,
        heartbeatIncoming: 25000,
        heartbeatOutgoing: 25000,
        connectionTimeout: 30000,
        onConnect: () => {
            console.log('STOMP 연결 성공');
            setIsConnected(true);
            setError(null);
             // 기존 구독이 있다면 제거
            subscriptions.forEach(sub => {
                try {
                    sub.unsubscribe();
                } catch (e) {
                    console.error('Subscription cleanup error:', e);
                }
            });

             // 새로운 구독 설정
            const newSubscription = client.subscribe(
                `/topic/waiting-room/${waitingRoomId}`,
                (message) => {
                    try {
                        const parsedData = JSON.parse(message.body);
                        onMessageReceived?.(parsedData);
                    } catch (e) {
                        console.error('Message parsing error:', e);
                    }
                }
            );

            client.publish({
                destination: `/app/waiting-room/${waitingRoomId}`,
                body: JSON.stringify({
                    userId: userId,
                    nickname: nickname,
                    gameType: storedGameType,
                    waitingRoomId: waitingRoomId
                })
            });
            
            setSubscriptions([newSubscription]);
        },
        onStompError: (frame) => {
            console.error('STOMP 에러:', frame);
            setError(new Error(`STOMP 에러: ${frame.headers.message}`));
        },
        onWebSocketClose: () => {
            console.log('WebSocket 연결 종료');
            setIsConnected(false);
             // 연결이 끊어졌을 때 상태 초기화
            setSubscriptions([]);
        },
        onWebSocketError: (event) => {
            console.error('WebSocket 에러:', event);
            setError(new Error('WebSocket 연결 에러가 발생했습니다.'));
        }
    });

        setStompClient(client);

        try {
            client.activate();
        } catch (error) {
            console.error('Activation error:', error);
            setError(error instanceof Error ? error : new Error('Unknown error during activation'));
        }

    }, [waitingRoomId]);

 // 컴포넌트 마운트 시에만 연결 초기화
    useEffect(() => {
        initializeWebSocket();

        // 컴포넌트 언마운트 시 정리
        return () => {
            if (stompClient?.active) {
                subscriptions.forEach(subscription => {
                    try {
                        subscription.unsubscribe();
                    } catch (error) {
                        console.error('Subscription cleanup error:', error);
                    }
                });
                setSubscriptions([]);
                stompClient.deactivate();
            }
        };
    }, [initializeWebSocket]);

    const sendMessage = useCallback((destination: string, body: any) => {
        if (stompClient?.active) {
            stompClient.publish({
                destination,
                body: JSON.stringify(body)
            });
        }
    }, [stompClient]);

    return {
        stompClient,
        setStompClient,
        isConnected,
        error,
        sendMessage
    };
    };

