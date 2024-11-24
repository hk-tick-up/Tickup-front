'use client';


import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { WebSocketContext } from '../layout';
import styles from '../css/GameProgressBar.module.css';
import { usePathname } from 'next/navigation';

interface GameProgressBarProps {
    initialTurn: number;
    // initialTotalTurns: number; -> api로 한 번만 호출로 변경
}

export default function GameProgressBar({ initialTurn }: GameProgressBarProps) {
    const [turn, setTurn] = useState(initialTurn); // 현재 턴 수
    // 하드 코딩된 값들 수정 필요
    const [totalTurns, setTotalTurns] = useState(5); // 총 턴 수 (api) - 하드 코딩 5
    const [remainingTime, setRemainingTime] = useState(300); // 제한 시간 - 하드 코딩 300
    const { stompClient } = useContext(WebSocketContext);

     // usePathname으로 URL에서 gameroomid 추출
     const pathname = usePathname();
     const gameroomid = pathname.split('/')[2]; // '/gamelogic/1/myinvest'에서 '1' 추출

     useEffect(() => {
        console.log('Room ID:', gameroomid);
    }, [gameroomid]);

    // 총 턴 수 가져오기 (화면 출력 위해 잠시 주석처리)
    // useEffect(() => {
    //     async function fetchTotalTurns() {
    //         if(!gameroomid) {   
    //             console.warn('roomid not available');
    //             return;
    //         }

    //         try {
    //             const response = await fetch("http://localhost:8080/api/v1/gamelogic/total-turns");
    //             const data = await response.json();
    //             setTotalTurns(data.totalTurns);
    //         } catch (error) {
    //             console.error('Failed to fetch total turns: ', error);
    //         }
    //     }

    //     fetchTotalTurns();
    // }, [gameroomid]);
    useEffect(() => {
        async function fetchTotalTurns() {
            console.warn('Fetching totalTurns is skipped in hardcoded mode.');
            setTotalTurns(5); // 하드코딩된 값
        }

        fetchTotalTurns();
    }, []);


    // 웹소켓 통신
    // useEffect(() => {
    //     if (!stompClient || !gameroomid) {
    //         console.warn('WebSocket or roomid not ready');
    //         return;
    //     }
        
    //     const subscription = stompClient.subscribe(`/topic/${gameroomid}/game-progress`, (message) => {
    //         const data = JSON.parse(message.body);
    //         setTurn(data.turn); // 현재 턴 업데이트
    //         setRemainingTime(data.remainingTime); // 제한 시간 업데이트
    //     });

    //     return () => {
    //         subscription.unsubscribe();
    //     };
    // }, [stompClient, gameroomid]);
    
    // 웹소켓 통신 (하드코딩된 값으로 대체)
     useEffect(() => {
        console.warn('WebSocket communication is skipped in hardcoded mode.');

        // 하드코딩된 턴 및 제한 시간 감소 로직
        const timer = setInterval(() => {
            setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    

    // 로딩 상태 처리
    if (!gameroomid || !stompClient) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className={styles.container}>
            <button className={styles.exitButton}>
                <Image src="/images/exitgame_icon.png" alt="Exit" width={24} height={24} />
            </button>
            <div className={styles.turnCounter}>
                Turn {turn}/{totalTurns} (Time left: {remainingTime}s)
            </div>
        </div>
    );
}
