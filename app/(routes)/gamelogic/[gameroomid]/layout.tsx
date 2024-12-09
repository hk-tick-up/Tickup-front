'use client';

import React from 'react';
import TopNavBar from './components/TopNavBar';
import GameProgressBar from './components/GameProgressBar';
import { WebSocketProvider } from './context/WebSocketContext';
import { StockProvider } from './context/StockContext'; // StockProvider 추가
import './css/layout.css';

export default function GameLogicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 더미 데이터 설정
    const initialTurn = 1; // 초기 턴 (더미 값)
    const initialTotalTurns = 5; // 총 턴 수 (더미 값)

    return (
        <WebSocketProvider>
            <StockProvider> {/* StockProvider 추가 */}
                <div className="screen">
                    <div className="header">
                        <GameProgressBar initialTurn={initialTurn} />
                        <TopNavBar />
                    </div>

                    <div className="space-between" />

                    <main className="main-container">
                        {/* 본문 내용 */}
                        {children}
                    </main>
                </div>
            </StockProvider>
        </WebSocketProvider>
    );
}
