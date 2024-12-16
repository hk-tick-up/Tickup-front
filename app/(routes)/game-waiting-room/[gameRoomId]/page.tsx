'use client';

import React, { useEffect, useState, useCallback } from 'react'
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';
// import { ParticipantsInfo } from '@/app/types/ParticipantsInfo';
import { ParticipantsInfo, createInitialUser } from '@/app/types/Game';
import '@/app/css/waiting-room/root.css'
import '@/app/css/waiting-room/game-waiting-room.css'
import Modal from '../../../components/Modal'
import * as StompJs from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { resolve } from 'path';
import { rejects } from 'assert';


export default function WaitingRoom() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<ParticipantsInfo[]>([]);
    const [currentUser, setCurrentUser] = useState<ParticipantsInfo | null>(null);
    const [gameRoomCode, setGameRoomCode] = useState<string | null>(null);
    const [gameType, setGameType] = useState<'Basic' | 'Private' | 'Contest'>('Basic');
    const [errorMessage, setErrorMessage] = useState("");
    const [subscriptionIds, setSubscriptionIds] = useState<string[]>([]);
    const router = useRouter();
    const params = useParams();
    const gameRoomId = params.gameRoomId as string;
    const [shouldConnect, setShouldConnect] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { stompClient, setStompClient, isConnected } = useWebSocket(gameRoomId);
    // const { userStatus, setUserStatus } = useState<'준비 완료' | '대기중' >('대기중');
    
    const handleMessageReceived = useCallback((data: ParticipantsInfo[]) => {
        if (!data) return;
        const updatedUsers = data.map(user => ({
            ...user,
            status: user.userStatus || '대기중' // 기본값 설정
        }));
        setUsers(updatedUsers.sort((a, b) => a.orderNum - b.orderNum));
        setIsLoading(false);
        const currentUserInfo = updatedUsers.find(u => u.userId === currentUser?.userId);
        if (currentUserInfo) {
        setCurrentUser(prev => ({
            ...prev!,
            userStatus: currentUserInfo.userStatus
        }));
    }
}, [currentUser]);

    useEffect(() => {
        if (!shouldConnect || !stompClient || !isConnected) return;

        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');
        const token = sessionStorage.getItem('bearer');
        const code = sessionStorage.getItem('gameRoomCode');
        const storedGameType = sessionStorage.getItem('gameType') as 'Basic' | 'Private';
        const currentRoomId = sessionStorage.getItem('currentRoomId');

        if (!userId || !nickname || !token) {
            alert('로그인이 필요합니다.');
            router.push('/signin');
            return;
        }

        if (code) {
            setGameRoomCode(code);
            setGameType(storedGameType || 'Basic');
        }
    
        const initialUser = createInitialUser(
            userId,
            nickname,
            gameRoomId,
            storedGameType || 'Basic',
        );
        initialUser.userStatus = '대기중';
        setCurrentUser(initialUser);
        // setUsers([initialUser]);

        if (stompClient && isConnected) {
            const setupConnection = async () => {
                try {
                    subscriptionIds.forEach(id => {
                        if (stompClient.active) {
                            stompClient.unsubscribe(id);
                        }
                    });
                    setSubscriptionIds([]);

                    const subscription = stompClient.subscribe(
                        `/topic/waiting-room/${gameRoomId}`,
                        (message) => {
                            const participantsList: ParticipantsInfo[] = JSON.parse(message.body);
                            const updatedList = participantsList.map(user => ({
                                ...user,
                                userStatus: user.userStatus || '대기중'
                            }));
                            
                            setUsers(updatedList.sort((a, b) => a.orderNum - b.orderNum));
                            
                            const currentUserInfo = updatedList.find(u => u.userId === currentUser?.userId);
                            if (currentUserInfo) {
                                setCurrentUser(prev => ({
                                    ...prev!,
                                    status: currentUserInfo.userStatus
                                }));
                            }
                        }
                    );

                    setSubscriptionIds([subscription.id]);

                    // 초기 사용자 정보 전송
                    await new Promise(resolve => setTimeout(resolve, 10)); // 연결 안정화를 위한 짧은 대기
                    
                    stompClient.publish({
                        destination: `/app/waiting-room/${gameRoomId}`,
                        body: JSON.stringify(initialUser)
                    });

                    setIsLoading(false);
                    
                } catch (error) {
                    console.error('연결 설정 중 오류가 발생했습니다:', error);
                    setIsLoading(false);
                    setErrorMessage("연결 중 오류가 발생했습니다. 페이지를 새로고침해 주세요.");
                    setIsModalOpen(true);
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
    }, [ isConnected, shouldConnect, gameRoomId, gameType]);

    const handleReady = useCallback(() => {
        if (!stompClient?.active || !currentUser) return;

        const newStatus = currentUser.userStatus === '대기중' ? '준비완료' : '대기중';

        setCurrentUser(prev => 
            prev ? { ...prev, userStatus: newStatus } : null
        );

        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.userId === currentUser.userId 
                    ? { ...user, userStatus: currentUser.userStatus }
                    : user
            )
        );
        
        stompClient.publish({
            destination: `/app/waiting-room/${gameRoomId}/status`,
            body: JSON.stringify({
                userId: currentUser.userId,
                userStatus: newStatus
            })
        });


    }, [stompClient, currentUser, gameRoomId]);

    const handleStart = useCallback(() => {
        if (!stompClient?.active || !currentUser) return;
        if (!users.every(user => user.orderNum === 1 || user.userStatus === '준비완료')) return;

        stompClient.publish({
            destination: `/app/waiting-room/${gameRoomId}/start`,
            body: JSON.stringify({
                type: 'START_GAME',
                gameRoomId
            })
        });
    },  [stompClient, currentUser, users, gameRoomId]);

    

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

    if (isLoading) {
        return <LoadingSpinner message="방에 입장중입니다" />;
    }


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
                    <li key={user.userId}>
                        <div className="flex w-full mx-10 justify-between gap-20 items-center">
                            <div className="flex-1 text-xl">
                                {user.orderNum}. <span className={user.userId === currentUser?.userId ? 'font-bold' : ''}>{user.nickname}</span>
                            </div>
                            <div className="flex-1 flex justify-center">
                                <p className={user.userStatus === '대기중' ? 'status-wait' : 'status-ready'}>
                                    {user.userStatus}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
                <div className="mt-6 flex justify-center">
                    {currentUser && users.length > 0 && (
                        users.find(u => u.userId === currentUser.userId)?.orderNum === 1 ? (
                            <button
                                onClick={handleStart}
                                disabled={!users.every(user => user.orderNum === 1 || user.userStatus === '준비완료')}
                                className={`px-6 py-3 rounded-lg ${
                                    users.every(user => user.orderNum === 1 || user.userStatus === '준비완료')
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                }`}
                            >
                                게임 시작
                            </button>
                        ) : (
                            <button
                            onClick={handleReady}
                            className={`px-6 py-3 rounded-lg ${
                                currentUser?.userStatus === '준비완료'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                            {currentUser?.userStatus === '준비완료' ? '준비 취소' : '준비 완료'}
                        </button>
                        )
                    )}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>{errorMessage}</p>
            </Modal>
        </div>
    );
}