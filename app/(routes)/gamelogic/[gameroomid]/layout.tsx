"use client"

import TopNavBar from './components/TopNavBar';
import GameProgressBar from './components/GameProgressBar';
import './css/layout.css'
import { createContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs'
// import { error } from 'console';

export const WebSocketContext = createContext(null);

export default function GameLogicLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const [stompClient, setStompClient] = useState<Client | null>(null);

    
    useEffect(() => {
        // websocket 연결 설정
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket as any,
            onConnect: () => {
                console.log('WebSocket connected');
            },
            onStompError: (error) => {
                console.error('STOMP error', error)
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
            console.log('WebSocket disconnected');
        };
    }, []);


    // test 용 더미 데이터 사용
    const initialTurn = 1; // 더미 값
    const initialTotalTurns = 5; // 더미 값

    return (
        <WebSocketContext.Provider value={{ stompClient}}>
            <div className='screen'>

                <div className='header'>
                    <GameProgressBar initialTurn={initialTurn} initialTotalTurns={initialTotalTurns} />
                    <TopNavBar />
                </div>
                
                <div className='space-between'/>
                
                <main className='main-container'>
                    {/* 본문 내용 시작 */}
                    {children}
                </main>
            </div>
        </WebSocketContext.Provider>
    );
}
