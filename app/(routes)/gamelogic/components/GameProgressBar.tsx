'use client';

import { FormEvent } from "react";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { io, Socket } from 'socket.io-client';
import styles from '../css/GameProgressBar.module.css';

interface GameProgressBarProps {
    initialTurn: number;
    initialTotalTurns: number;
}

export default function GameProgressBar({ initialTurn, initialTotalTurns }: GameProgressBarProps) {
    const [turn, setTurn] = useState(initialTurn);
    const [totalTurns, setTotalTurns] = useState(initialTotalTurns);
    const [socket, setSocket] = useState<Socket | null>(null);

  // 웹소켓 연결 설정
    useEffect(() => {
        const newSocket = io('http://your-spring-boot-server-url'); // 실제 서버 URL로 변경
        setSocket(newSocket);

        return () => {
        newSocket.disconnect();
        };
    }, []);

    // 웹소켓 이벤트 리스너 설정
    useEffect(() => {
        if (!socket) return;

        socket.on('turnUpdate', (data: { turn: number; totalTurns: number }) => {
            setTurn(data.turn);
            setTotalTurns(data.totalTurns);
        });
        
        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
        
        return () => {
            socket.off('turnUpdate');
            socket.off('error');
        };
    }, [socket]);
    
    return (
        <div className={styles.container}>
            <button className={styles.exitButton}>
                <Image src="/images/exitgame_icon.png" alt="Exit" width={24} height={24} />
            </button>
            <div className={styles.turnCounter}>
                Turn {turn}/{totalTurns}
            </div>
        </div>
    );
}
