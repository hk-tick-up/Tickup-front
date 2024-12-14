'use client';

import React, { useEffect, useState, useCallback } from 'react'
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { useParams, useRouter } from 'next/navigation';
import '@/app/css/waiting-room/root.css'
import '@/app/css/waiting-room/game-waiting-room.css'
import Modal from '../../../components/Modal'
import * as StompJs from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { resolve } from 'path';
import { rejects } from 'assert';

interface User {
    id: string;
    nickname: string;
    status: '대기중' | '준비완료';
}   

interface ParticipantsInfo {
    orderNum: number;
    userId: string;
    nickname: string;
    gameType: string;
    currentRoomId: number;
}

export default function WaitingRoom() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [gameRoomCode, setGameRoomCode] = useState<string | null>(null);
    const [gameType, setGameType] = useState<'Basic' | 'Private' | 'Contest'>('Basic');
    const [errorMessage, setErrorMessage] = useState("");
    const [subscriptionIds, setSubscriptionIds] = useState<string[]>([]);
    const router = useRouter();
    const params = useParams();
    const gameRoomId = params.gameRoomId as string;
    const [shouldConnect, setShouldConnect] = useState(true);
    const { stompClient, setStompClient, isConnected } = useWebSocket(gameRoomId);
    
    
    useEffect(() => {
        if (!shouldConnect) return;

        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');
        const token = sessionStorage.getItem('bearer');
        const code = sessionStorage.getItem('gameRoomCode');
        const storedGameType = sessionStorage.getItem('gameType') as 'Basic' | 'Private';
        const currentRoomId = sessionStorage.getItem('currentRoomId');
    
        if (storedGameType === 'Private' && code) {
            setGameRoomCode(code);
            setGameType('Private');
        } else {
            setGameType('Basic');
        }

        if (!userId || !nickname || !token) {
            alert('로그인이 필요합니다.');
            router.push('/signin');
            return;
        }
    
        if (storedGameType) {
            setGameType(storedGameType);
        }
    
        if (storedGameType === 'Private' && code) {
            setGameRoomCode(code);
        }
    
        const initialUser: User = {
            id: userId,
            nickname: nickname,
            status: '대기중'
        };
        setCurrentUser(initialUser);
        setUsers([initialUser]);

    
        if (stompClient && isConnected) {
            const setupConnection = async () => {
                try {
                    subscriptionIds.forEach(id => {
                        stompClient.unsubscribe(id);
                    });      

                    const subscription = stompClient.subscribe(
                        `/topic/waiting-room/${currentRoomId}`,
                        (message) => {
                            const participantsList = JSON.parse(message.body);
                            const updatedUsers = participantsList.map((participant) => ({
                                id: participant.userId,
                                nickname: participant.nickname,
                                status: '대기중', // 상태 정보가 있다면 해당 값으로 설정
                            }));
                            setUsers(updatedUsers);
                        }
                    );
                    
                    setSubscriptionIds(prev => [...prev, subscription.id]);
                    
                } catch (error) {
                    console.error('Error setting up connection:', error);
                }
            };

            setupConnection();
            
        }
    
        return () => {
            if (stompClient?.active) {
                subscriptionIds.forEach(id => {
                    try {
                        stompClient.unsubscribe(id);
                    } catch (error) {
                        console.error('Error unsubscribing:', error);
                    }
                });
                setSubscriptionIds([]);
            }
        };
    }, []);

    const handleReady = useCallback(() => {
        if (stompClient?.active && currentUser) {
            stompClient.publish({
                destination: `/app/waiting-room/${gameRoomId}/status`,
                body: JSON.stringify({
                    type: 'UPDATE_STATUS',
                    gameRoomId,
                    userId: currentUser.id,
                    status: currentUser.status === '대기중' ? '준비완료' : '대기중'
                })
            });
        }
    }, [stompClient, currentUser, gameRoomId]);

    const handleStart = useCallback(() => {
        if (stompClient?.active) {
            stompClient.publish({
                destination: `/app/waiting-room/${gameRoomId}/start`,
                body: JSON.stringify({
                    type: 'START_GAME',
                    gameRoomId
                })
            });
        }
    }, [stompClient, gameRoomId]);

    const copyRoomCode = async () => {
        if (gameRoomCode) {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(gameRoomCode);
                    setErrorMessage('방 코드가 복사되었습니다.');
                } catch (err) {
                    console.error('복사 실패: ', err);
                    setErrorMessage('방 코드 복사에 실패했습니다. 직접 코드를 복사해주세요.');
                }
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = gameRoomCode;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    setErrorMessage('방 코드가 복사되었습니다.');
                } catch (err) {
                    console.error('복사 실패: ', err);
                    setErrorMessage('방 코드 복사에 실패했습니다. 직접 코드를 복사해주세요.');
                }
                document.body.removeChild(textArea);
            }
            setIsModalOpen(true);
        }
    };

    const leaveRoom = useCallback(async () => {
        const userId = sessionStorage.getItem('id');
        const token = sessionStorage.getItem('bearer'); 
        
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/leave/${gameRoomId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    credentials: 'include'
                }
            );
    
            if (!response.ok) {
                console.error('API Response not OK:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            if (stompClient?.active) {

                stompClient.publish({
                    destination: `/app/waiting-room/leave/${gameRoomId}`,
                    body: JSON.stringify({
                        type: 'LEAVE_ROOM',
                        userId: userId,
                        gameRoomId: gameRoomId
                    })
                });
    
                subscriptionIds.forEach(id => {
                    stompClient.unsubscribe(id);
                });
                setSubscriptionIds([]);
    
                await stompClient.deactivate();
                setStompClient(null);
            }
    
            sessionStorage.removeItem('currentRoomId');
            sessionStorage.removeItem('gameRoomCode');
            router.push('/game/together');
    
        } catch (error) {
            console.error('Error during room leave:', error);

            if (stompClient?.active) {
                try {
                    subscriptionIds.forEach(id => stompClient.unsubscribe(id));
                    setSubscriptionIds([]);
                    await stompClient.deactivate();
                    setStompClient(null);
                } catch (stompError) {
                    console.error('Error during STOMP cleanup:', stompError);
                }
            }
            
            setErrorMessage("서버 연결 중 오류가 발생했습니다. 다시 시도해주세요.");
            setIsModalOpen(true);
            
            sessionStorage.removeItem('currentRoomId');
            sessionStorage.removeItem('gameRoomCode');
            router.push('/game/together');
        }
    }, [gameRoomId, stompClient, setStompClient, subscriptionIds, router]);


    return (
        <div className="relative container">
            <div className="position-back-button fixed w-full">
                <button onClick={leaveRoom}>
                    <img src="/images/exit-game-icon.png" className="w-7" alt="게임 나가기" />
                </button>
            </div>
            
            <div className="room-code">
                {gameType === 'Basic' ? (
                    <span className="font-[Freesentation-9Black]">
                        No.{gameRoomId}
                    </span>
                ) : (
                    gameRoomCode && (
                        <>
                            <span className="font-[Freesentation-9Black]">
                                {gameRoomCode}
                            </span>
                            <button onClick={copyRoomCode} className='room-code-copy'>
                                <img 
                                    src="/images/waiting-room/copy-darkgray.png" 
                                    className="w-5 h-5" 
                                    alt="방 코드 복사" 
                                />
                            </button>
                        </>
                    )
                )}
            </div>
            {/* <div>
                <button onClick={dataDelever}> data</button>
            </div> */}
            <div className="user-list-container mx-auto">
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            <div className="flex w-full mx-10 justify-between gap-20 items-center">
                            <div className="flex-1 text-xl">
                                {user.orderNum}. <span className={user.id === currentUser?.id ? 'font-bold' : ''}>{user.nickname}</span>
                            </div>
                                <div className="flex-1 flex justify-center">
                                    <p className={user.status === '대기중' ? 'status-wait' : 'status-ready'}>
                                        {user.status}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                {/* <div>
                    {isHost ? ( 
                        <button
                            onClick={handleStart}
                            disabled={users.slice(1).some(user => user.status === '대기중')}
                            className={`${users.slice(1).every(user => user.status === '준비완료') ? 'bgame-btn' : 'not-yet cursor-not-allowed'}`}
                        >
                            시작하기
                        </button>
                    ) : (
                        <button
                            onClick={handleReady}
                            className={`game-btn ${currentUser?.status === '준비완료' ? 'cancle-btn' : 'game-btn'}`}
                        >
                            {currentUser?.status === '준비완료' ? '준비취소' : '준비완료'}
                        </button>
                    )}
                </div> */}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>{errorMessage}</p>
            </Modal>
        </div>
    );
}