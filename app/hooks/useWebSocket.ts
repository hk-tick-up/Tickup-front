import { useState, useEffect, useCallback } from 'react';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (gameRoomId: string) => {
 const [stompClient, setStompClient] = useState<StompJs.Client | null>(null);
 const [isConnected, setIsConnected] = useState(false);
 const [error, setError] = useState<Error | null>(null);
 const [subscriptions, setSubscriptions] = useState<StompJs.StompSubscription[]>([]);

 const initializeWebSocket = useCallback(() => {
     const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://192.168.1.6:8007/ws";
     const token = sessionStorage.getItem('bearer');
     
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
             'gameRoomId': gameRoomId
         },
         debug: (str) => {
             console.log('STOMP: ' + str);
         },
         // 자동 재연결 비활성화
         reconnectDelay: 5000, // Update: Added reconnectDelay
         // heartbeat 간격 증가
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
                 `/topic/waiting-room/${gameRoomId}`,
                 (message) => {
                     console.log('Received message:', message.body);
                 }
             );
             
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

 }, [gameRoomId]);

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
 }, []);

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

