'use client';


import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { WebSocketContext } from '../layout';
import styles from '../css/GameProgressBar.module.css';

interface GameProgressBarProps {
    initialTurn: number;
    // initialTotalTurns: number; -> api로 한 번만 호출로 변경
}

export default function GameProgressBar({ initialTurn }: GameProgressBarProps) {
    const [turn, setTurn] = useState(initialTurn); // 현재 턴 수
    const [totalTurns, setTotalTurns] = useState(0); // 총 턴 수 (api)
    const [remainingTime, setRemainingTime] = useState(0); // 제한 시간
    const { stompClient } = useContext(WebSocketContext);

    // 총 턴 수 가져오기
    useEffect(() => {
        async function fetchTotalTurns() {
            try {
                const response = await fetch("http://localhost:8080/api/v1/gamelogic/total-turns");
            }
        }
    })

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
