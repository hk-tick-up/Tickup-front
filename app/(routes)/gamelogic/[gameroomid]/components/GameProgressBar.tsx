'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import Image from 'next/image';
import styles from '../css/GameProgressBar.module.css';
import { usePathname } from 'next/navigation';

interface GameProgressBarProps {}

export default function GameProgressBar({}: GameProgressBarProps) {
    const [turn, setTurn] = useState<number>(0);
    const [totalTurns, setTotalTurns] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [turnStartTime, setTurnStartTime] = useState<string | null>(null);
    const [updatingTurn, setUpdatingTurn] = useState(false); // 턴 업데이트 중 여부
    const { stompClient } = useWebSocket();

    const pathname = usePathname();
    const gameroomid = pathname.split('/')[2];

    console.log('Attempting WebSocket subscription to:', `/topic/game-room/${gameroomid}/game-process`);

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

                            // 메시지 구조에 따라 상태 업데이트
                            if (
                                data.currentTurn !== undefined &&
                                data.totalTurn !== undefined &&
                                data.remainingTime !== undefined &&
                                data.currentTurnStartTime !== undefined
                            ) {
                                setTurn(data.currentTurn);
                                setTotalTurns(data.totalTurn);
                                setTurnStartTime(data.currentTurnStartTime); // 서버의 turnStartTime 사용
                                syncRemainingTime(data.currentTurnStartTime, data.remainingTime); // 남은 시간 계산
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

    // 남은 시간 동기화 함수
    function syncRemainingTime(startTime: string, serverRemainingTime: number): void {
        const now = new Date().getTime();
        const turnStart = new Date(startTime).getTime();
        const elapsedTime = Math.floor((now - turnStart) / 1000); // 초 단위 경과 시간

        const syncedRemainingTime = Math.max(serverRemainingTime - elapsedTime, 0);
        setRemainingTime(syncedRemainingTime);
    }

    // 로컬 카운트다운
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prev) => {
                    const newTime = Math.max(prev - 1, 0);

                    // 제한 시간이 0이 되었을 때 현재 턴 확인
                    if (newTime === 0) {
                        clearInterval(timer!);

                        if (turn < totalTurns) {
                            // 현재 턴이 전체 턴 미만인 경우에만 턴 업데이트
                            updateTurn();
                        } else {
                            console.log('Game finished: No more turns to update.');
                        }
                    }

                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
                console.log('Cleared interval for countdown');
            }
        };
    }, [remainingTime, turn, totalTurns]);

    // 턴 업데이트 로직
    async function updateTurn() {
        if (!gameroomid) {
            console.warn('Room ID not available for turn update');
            return;
        }

        if (updatingTurn) {
            console.warn('Turn update already in progress');
            return;
        }

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
                // 서버에서 업데이트된 정보를 WebSocket으로 받을 것이므로 상태 변경은 불필요
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
