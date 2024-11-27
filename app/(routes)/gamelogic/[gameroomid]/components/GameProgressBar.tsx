'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import Image from 'next/image';
import styles from '../css/GameProgressBar.module.css';
import { usePathname } from 'next/navigation';

interface GameProgressBarProps {
    initialTurn: number;
}

export default function GameProgressBar({ initialTurn }: GameProgressBarProps) {
    const [turn, setTurn] = useState(initialTurn);
    const [totalTurns, setTotalTurns] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [updatingTurn, setUpdatingTurn] = useState(false); // 턴 업데이트 중 여부
    const { stompClient } = useWebSocket();

    const pathname = usePathname();
    const gameroomid = pathname.split('/')[2];

    console.log('Attempting WebSocket subscription to:', `/topic/game-room/${gameroomid}/game-process`);

    // 초기 게임 상태 가져오기
    useEffect(() => {
        async function fetchInitGameProcess() {
            if (!gameroomid) {
                console.warn('Room ID not available');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/v1/gamelogic/${gameroomid}/init-game-process`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gameType: 'BASIC' }),
                });

                if (!response.ok) {
                    console.error('Failed to fetch initial game process:', response.statusText);
                    return;
                }

                const data = await response.json();
                setTotalTurns(data.totalTurns);
                setRemainingTime(data.remainingTime);
                setTurn(data.currentTurn || initialTurn);

                console.log('Initial game process fetched:', data);
            } catch (error) {
                console.error('Failed to fetch initial game process:', error);
            }
        }

        fetchInitGameProcess();
    }, [gameroomid]);

    // WebSocket 구독 및 메시지 처리
    useEffect(() => {
        if (stompClient && gameroomid) {
            const onConnect = () => {
                console.log('WebSocket connected:', stompClient.connected);

                // 구독 로직
                const subscription = stompClient.subscribe(
                    `/topic/game-room/${gameroomid}/game-process`,
                    (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            console.log('WebSocket message received:', data);

                            if (data.currentTurn !== undefined && data.remainingTime !== undefined) {
                                setTurn(data.currentTurn);
                                setRemainingTime(data.remainingTime);
                            } else {
                                console.warn('Invalid WebSocket message structure:', data);
                            }
                        } catch (error) {
                            console.error('Error processing WebSocket message:', error);
                        }
                    }
                );

                console.log('Subscribed to WebSocket topic:', `/topic/game-room/${gameroomid}/game-process`);

                return () => {
                    console.log('Unsubscribing from WebSocket topic');
                    subscription.unsubscribe();
                };
            };

            // 연결 상태에 따른 구독 처리
            if (stompClient.connected) {
                onConnect();
            } else {
                stompClient.onConnect = onConnect;
            }
        } else {
            console.warn('WebSocket is not connected. Unable to subscribe.');
        }

        return () => {
            if (stompClient) {
                console.log('Disconnecting WebSocket');
                stompClient.deactivate();
            }
        };
    }, [stompClient, gameroomid]);

    // 로컬 카운트다운 및 서버 턴 업데이트 요청
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prev) => Math.max(prev - 1, 0));
            }, 1000);
        } else if (remainingTime === 0 && !updatingTurn) {
            updateTurn();
        }

        return () => {
            if (timer) {
                clearInterval(timer);
                console.log('Cleared interval for countdown');
            }
        };
    }, [remainingTime]);

    async function updateTurn() {
        setUpdatingTurn(true); // 턴 업데이트 중 플래그 설정

        try {
            const response = await fetch(`http://localhost:8080/api/v1/gamelogic/${gameroomid}/update-turn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                console.error('Failed to advance turn:', response.statusText);
            } else {
                const data = await response.json();
                console.log('Turn successfully advanced:', data);
            }
        } catch (error) {
            console.error('Error updating turn:', error);
        } finally {
            setUpdatingTurn(false); // 플래그 해제
        }
    }

    if (!gameroomid || remainingTime === null || totalTurns === null) {
        return <div>Loading game room...</div>;
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
