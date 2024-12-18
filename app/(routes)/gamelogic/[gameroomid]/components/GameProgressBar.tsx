// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { useWebSocket } from '../context/WebSocketContext';
// import Image from 'next/image';
// import styles from '../css/GameProgressBar.module.css';
// import { usePathname } from 'next/navigation';


// interface GameStateUpdateRequest {
//     gameRoomId: number;
//     currentTurn: number;
//     playerId: string;
//     clientTime: string;
// }

// export default function GameProgressBar({ fetchInvestments }: { fetchInvestments: () => void }) {
//     const [turn, setTurn] = useState<number>(0);
//     const [totalTurns, setTotalTurns] = useState<number>(0);
//     const [remainingTime, setRemainingTime] = useState<number>(0);
//     const [turnEndTime, setTurnEndTime] = useState<string | null>(null);
//     const { stompClient } = useWebSocket();
//     const pathname = usePathname();
//     const gameRoomId = pathname.split('/')[2];

//     // 초기 상태 동기화
//     useEffect(() => {
//         if (!gameRoomId) {
//             console.warn('Game Room ID is missing');
//             return;
//         }

//         const fetchInitialState = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8080/api/v1/gamelogic/${gameRoomId}/serverTime`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
                
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch initial state');
//                 }
        
//                 const data = await response.json();
//                 console.log('Initial game state:', data);
        
//                 setTurn(data.currentTurn);
//                 setTotalTurns(data.totalTurns);
//                 setTurnEndTime(data.currentTurnEndTime);

//                 if (data.currentTurnEndTime) {  
//                     const endTime = new Date(data.currentTurnEndTime).getTime();
//                     const currentTime = new Date(data.now).getTime();
//                     const initialRemainingSeconds = Math.max(0, Math.floor((endTime - currentTime) / 1000));
//                     setRemainingTime(initialRemainingSeconds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching initial state:', error);
//             }
//         };

//         fetchInitialState();
//     }, [gameRoomId]);

//     // 턴 종료 알림 전송
//     const sendTurnEndNotification = useCallback(() => {
//         if (!stompClient || !gameRoomId) {
//             console.warn('StompClient or gameRoomId not available');
//             return;
//         }

//         if (!stompClient.connected) {
//             console.warn('STOMP client is not connected');
//             return;
//         }

//         // 현재 턴이 총 턴 수보다 크거나 같으면 턴 종료 알림을 보내지 않음
//         if (turn > totalTurns) {
//             console.log('Game has reached the final turn');
//             return;
//         }

//         const message: GameStateUpdateRequest = {
//             gameRoomId: parseInt(gameRoomId),
//             currentTurn: turn,
//             playerId: 'player-id',
//             clientTime: new Date().toISOString()
//         };

//         try {
//             stompClient.publish({
//                 destination: `/app/gameRoom/${gameRoomId}/turnEnd`,
//                 body: JSON.stringify(message)
//             });
//             console.log('Turn end notification sent:', message);

//             fetchInvestments(); // 턴이 끝난 후 보유 주식 현황 업데이트
//         } catch (error) {
//             console.error('Failed to send turn end notification:', error);
//         }
//     }, [stompClient, gameRoomId, turn, totalTurns, fetchInvestments]);

//     // 카운트다운 타이머
//     useEffect(() => {
//         let timer: NodeJS.Timeout;
    
//         if (remainingTime > 0) {
//             timer = setInterval(() => {
//                 setRemainingTime(prev => {
//                     const newTime = prev - 1;
//                     // 시간이 0이 되면 턴 종료 메시지 전송
//                     if (newTime <= 0) {
//                         sendTurnEndNotification();
//                         clearInterval(timer);
//                         return 0;
//                     }
//                     return newTime;
//                 });
//             }, 1000);
//         }
    
//         return () => {
//             if (timer) {
//                 clearInterval(timer);
//             }
//         };
//     }, [remainingTime, sendTurnEndNotification]);

//     // 웹소켓 구독 설정
//     useEffect(() => {
//         if (!stompClient || !gameRoomId) {
//             console.log('StompClient or gameRoomId not available');
//             return;
//         }

//         let subscription: any;
//         let connectionCheckInterval: NodeJS.Timeout;

//         const subscribe = () => {
//             if (stompClient.connected) {
//                 try {
//                     subscription = stompClient.subscribe(
//                         `/topic/gameRoom/${gameRoomId}/turnChange`,
//                         (message) => {
//                             try {
//                                 const data = JSON.parse(message.body);
//                                 console.log('Turn change received:', data);
                                
//                                 setTurn(data.nextTurn);
//                                 setTurnEndTime(data.nextTurnEndTime);
                                
//                                 const endTime = new Date(data.nextTurnEndTime).getTime();
//                                 const currentTime = Date.now();
//                                 const newRemainingSeconds = Math.max(0, Math.floor((endTime - currentTime) / 1000));
//                                 setRemainingTime(newRemainingSeconds);
//                             } catch (error) {
//                                 console.error('Error processing turn change message:', error);
//                             }
//                         }
//                     );
//                     console.log('Successfully subscribed to turn changes');
//                 } catch (error) {
//                     console.error('Error subscribing to turn changes:', error);
//                 }
//             }
//         };

//         // 연결 상태 확인 및 구독
//         connectionCheckInterval = setInterval(() => {
//             if (stompClient.connected && !subscription) {
//                 subscribe();
//             }
//         }, 1000);

//         return () => {
//             clearInterval(connectionCheckInterval);
//             if (subscription) {
//                 try {
//                     subscription.unsubscribe();
//                     console.log('Unsubscribed from turn changes');
//                 } catch (error) {
//                     console.error('Error unsubscribing:', error);
//                 }
//             }
//         };
//     }, [stompClient, gameRoomId]);

//     return (
//         <div className={styles.container}>
//             <button className={styles.exitButton}>
//                 <Image src="/images/exitgame_icon.png" alt="Exit" width={24} height={24} />
//             </button>
//             <div className={styles.turnCounter}>
//                 Turn {turn}/{totalTurns} (Time left: {remainingTime}s)
//             </div>
//         </div>
//     );
// }

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useInvestments } from '../context/InvestmentContext';
import Image from 'next/image';
import styles from '../css/GameProgressBar.module.css';

interface GameStateUpdateRequest {
    gameRoomId: number;
    currentTurn: number;
    playerId: string;
    clientTime: string;
}

export default function GameProgressBar({ gameRoomId }: { gameRoomId: string }) {
    const [turn, setTurn] = useState<number>(0);
    const [totalTurns, setTotalTurns] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const { stompClient } = useWebSocket();
    const { fetchInvestments } = useInvestments();
    const NEXT_PUBLIC_GAME_LOGIC_API_URL = process.env.NEXT_PUBLIC_GAME_LOGIC_API_URL;
    // 초기 상태 동기화
    useEffect(() => {
        const fetchInitialState = async () => {
            try {
                const response = await fetch(`${NEXT_PUBLIC_GAME_LOGIC_API_URL}/api/v1/gamelogic/${gameRoomId}/serverTime`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Failed to fetch initial state');

                const data = await response.json();
                console.log('Initial game state:', data);

                setTurn(data.currentTurn);
                setTotalTurns(data.totalTurns);

                const endTime = new Date(data.currentTurnEndTime).getTime();
                const currentTime = new Date(data.now).getTime();
                setRemainingTime(Math.max(0, Math.floor((endTime - currentTime) / 1000)));
            } catch (error) {
                console.error('Error fetching initial state:', error);
            }
        };

        fetchInitialState();
    }, [gameRoomId]);

    // 턴 종료 알림 전송
    const sendTurnEndNotification = useCallback(() => {
        if (!stompClient || !gameRoomId) return;

        const message: GameStateUpdateRequest = {
            gameRoomId: parseInt(gameRoomId),
            currentTurn: turn,
            playerId: 'player-id',
            clientTime: new Date().toISOString(),
        };

        try {
            stompClient.publish({
                destination: `/app/gameRoom/${gameRoomId}/turnEnd`,
                body: JSON.stringify(message),
            });
            console.log('Turn end notification sent:', message);

            fetchInvestments(gameRoomId); // 보유 주식 현황 업데이트
        } catch (error) {
            console.error('Failed to send turn end notification:', error);
        }
    }, [stompClient, gameRoomId, turn, fetchInvestments]);

    // 카운트다운 타이머
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        sendTurnEndNotification();
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [remainingTime, sendTurnEndNotification]);

    // 웹소켓 구독 설정
    useEffect(() => {
        if (!stompClient || !gameRoomId) return;

        let subscription: any;

        const subscribe = () => {
            if (stompClient.connected) {
                subscription = stompClient.subscribe(
                    `/topic/gameRoom/${gameRoomId}/turnChange`,
                    (message) => {
                        const data = JSON.parse(message.body);
                        console.log('Turn change received:', data);

                        setTurn(data.nextTurn);
                        const endTime = new Date(data.nextTurnEndTime).getTime();
                        const currentTime = Date.now();
                        setRemainingTime(Math.max(0, Math.floor((endTime - currentTime) / 1000)));
                    }
                );
                console.log('Subscribed to turn changes');
            }
        };

        if (stompClient.connected) subscribe();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [stompClient, gameRoomId]);

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
