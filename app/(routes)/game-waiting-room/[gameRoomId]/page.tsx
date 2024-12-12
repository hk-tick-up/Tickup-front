'use client';

import React, { useEffect, useState, useCallback } from 'react'
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { useParams, useRouter } from 'next/navigation';
import '@/app/css/waiting-room/root.css'
import '@/app/css/waiting-room/game-waiting-room.css'
import Modal from '../../../components/Modal'
import * as StompJs from "@stomp/stompjs";
import SockJS from 'sockjs-client';

interface User {
    id: string;
    nickname: string;
    status: '대기중' | '준비완료';
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
    
    
    const { stompClient, setStompClient, isConnected, error, sendMessage, reconnect } = useWebSocket(gameRoomId);
    
    
    useEffect(() => {
        if (!shouldConnect) return;

        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');
        const token = sessionStorage.getItem('bearer');
        const code = sessionStorage.getItem('gameRoomCode');
        const storedGameType = sessionStorage.getItem('gameType') as 'Basic' | 'Private';
    
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
                    // 기존 구독 해제
                    subscriptionIds.forEach(id => {
                        stompClient.unsubscribe(id);
                    });

                    // 새로운 구독 생성 및 ID 저장
                    const newSubscription = stompClient.subscribe(
                        `/topic/waiting-room/${gameRoomId}`,
                        (message) => {
                            const data = JSON.parse(message.body);
                            switch (data.type) {
                                case 'USER_JOINED':
                                    setUsers(prev => [...prev, data.user]);
                                    break;
                                case 'USER_LEFT':
                                    setUsers(prev => prev.filter(user => user.id !== data.userId));
                                    break;
                                case 'UPDATE_USERS':
                                    setUsers(data.users);
                                    break;
                                case 'GAME_START':
                                    router.push(`/game/play/${gameRoomId}`);
                                    break;
                            }
                        }
                    );
                    
                    setSubscriptionIds(prev => [...prev, newSubscription.id]);
    
                    stompClient.publish({
                        destination: `/app/waiting-room/${gameRoomId}`,
                        body: JSON.stringify({
                            type: 'JOIN_ROOM',
                            gameRoomId,
                            user: initialUser
                        })
                    });
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
    }, [isConnected, stompClient, gameRoomId, router, shouldConnect, subscriptionIds]);

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
        try {
            const userId = sessionStorage.getItem('id');
            
            setShouldConnect(false);
            
            if (stompClient?.active) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        stompClient.publish({
                            destination: `/app/waiting-room/${gameRoomId}/leave`,
                            body: JSON.stringify({
                                type: 'LEAVE_ROOM',
                                userId: userId,
                                gameRoomId: gameRoomId
                            }),
                            headers: {}, 
                            skipContentLengthHeader: false,
                        });
                        resolve();
                    });

                    // 모든 저장된 구독 ID에 대해 구독 해제
                    subscriptionIds.forEach(id => {
                        stompClient.unsubscribe(id);
                    });
                    setSubscriptionIds([]); // 구독 ID 목록 초기화

                    await stompClient.deactivate();
                    
                    if (setStompClient) {
                        setStompClient(null);
                    }
                } catch (err) {
                    console.error('Error during STOMP cleanup:', err);
                }
            }

            sessionStorage.removeItem('currentRoomId');
            sessionStorage.removeItem('gameRoomCode');
            
            router.push('/game/together');
            
        } catch (error) {
            console.error('Error leaving room:', error);
            setShouldConnect(false);
            sessionStorage.removeItem('currentRoomId');
            sessionStorage.removeItem('gameRoomCode');
            router.push('/game/together');
        }
    }, [stompClient, setStompClient, gameRoomId, router, subscriptionIds]);
    
    useEffect(() => {
        return () => {
            setShouldConnect(false);
            if (stompClient?.active) {
                subscriptionIds.forEach(id => {
                    stompClient.unsubscribe(id);
                });
                stompClient.deactivate();
                if (setStompClient) {
                    setStompClient(null);
                }
            }
        };
    }, [stompClient, setStompClient, subscriptionIds]);

    const isHost = currentUser && users.length > 0 && currentUser.id === users[0].id;

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
            <div className="user-list-container mx-auto">
                <ul>
                    {users.map((user, index) => (
                        <li key={user.id}>
                            <div className="flex w-full mx-10 justify-between gap-20 items-center">
                                <div className="flex-1 text-xl">
                                    {index + 1}. <span className={user.id === currentUser?.id ? 'font-bold' : ''}>{user.nickname}</span>
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
                <div>
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
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>{errorMessage}</p>
            </Modal>
        </div>
    );
}