'use client';

import React, { useEffect, useState, useCallback } from 'react'
import { useWebSocket } from '@/app/hooks/useSocket';
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import io, { Socket } from 'socket.io-client';
import '../../../css/WaitingRoom/root.css'
import '../../../css/WaitingRoom/gameWaitingRoom.css'

import * as StompJs from "@stomp/stompjs";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8007/ws';

interface User {
    id: string;
    nickname: string;
    status: '대기중' | '준비완료';
}

export default function WaitingRoom() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [gameRoomCode, setGameRoomCode] = useState("");
    const [nickname, setNickname] = useState<string | null>("");
    const router = useRouter();
    const params = useParams();
    const gameRoomId = params.gameRoomId as string;

    const { socket, isConnected } = useWebSocket(gameRoomId);


    useEffect(() => {
        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');
        const token = sessionStorage.getItem('bearer');
        const code = sessionStorage.getItem('gameRoomCode');

        if(code != null ) setGameRoomCode(code);

        if (!userId || !nickname || !token) {
            alert('로그인이 필요합니다.');
            router.push('/signin');
            return;
        }

        const initialUser: User = {
            id: userId,
            nickname: nickname,
            status: '대기중'
        };
        setCurrentUser(initialUser);
        setUsers([initialUser]);

        if (!socket) return;
        // 유저 정보 확인 및 초기 설정
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
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
        };
    }, [socket, router, gameRoomId]);

    const handleReady = useCallback(() => {
        if (socket && currentUser) {
            socket.send(JSON.stringify({
                type: 'UPDATE_STATUS',
                gameRoomId,
                userId: currentUser.id,
                status: currentUser.status === '대기중' ? '준비완료' : '대기중'
            }));
        }
    }, [socket, currentUser, gameRoomId]);

    const handleStart = useCallback(() => {
        if (socket) {
            socket.send(JSON.stringify({
                type: 'START_GAME',
                gameRoomId
            }));
        }
    }, [socket, gameRoomId]);

    const copyRoomCode = async () => {
        const gameRoomCode = sessionStorage.getItem('gameRoomCode');
        try {
            await navigator.clipboard.writeText(gameRoomId);
            alert('방 코드가 복사되었습니다.');
        } catch (err) {
            console.error('복사 실패: ', err);
            alert('방 코드 복사에 실패했습니다. 직접 코드를 복사해주세요.');
        }
    };

    const leaveRoom = async () => {
        try {
            const userId = sessionStorage.getItem('id');

            const stompClient = new StompJs.Client({
                brokerURL: "ws://localhost:8007/ws",
                debug: console.log
            });
    
            await new Promise((resolve, reject) => {
                stompClient.onConnect = (frame) => {
                    console.log('Connected to WebSocket for leaving room');
                    
                    // 방 나가기 메시지 전송
                    stompClient.publish({
                        destination: `/app/waiting-room/${gameRoomId}/leave`,
                        body: JSON.stringify({
                            userId: userId,
                            gameRoomId: gameRoomId
                        }),
                        headers: {
                            'content-type': 'application/json'
                        }
                    });
    
                    // 연결 해제 및 리다이렉트
                    stompClient.deactivate().then(() => {
                        console.log('WebSocket connection closed');
                        sessionStorage.removeItem('currentRoomId');
                        sessionStorage.removeItem('gameRoomCode');
                        router.push('/game/together');
                    });
    
                    resolve(true);
            };

            stompClient.onWebSocketError = (error) => {
                console.error('WebSocket Error:', error);
                reject(error);
            };

            stompClient.activate();
        });

        // 연결 해제 및 세션 정리
        await stompClient.deactivate();
        sessionStorage.removeItem('currentRoomId');
        sessionStorage.removeItem('gameRoomCode');
        router.push('/game/together');

    } catch (error) {
        console.error('Error leaving room:', error);
        router.push('/game/together');
    }
};

    const isHost = currentUser && users.length > 0 && currentUser.id === users[0].id;


    return (
        <div className="relative container">
            <div className="position-back-button fixed w-full">
                <button onClick={leaveRoom}>
                    <img src="/images/exitgame_icon.png" className="w-7" alt="게임 나가기" />
                </button>
            </div>
            <div className="room-code">
                <span className="font-[Freesentation-9Black]">{gameRoomCode}</span>
                <button onClick={copyRoomCode} className='room-code-copy'>
                    <img src="/images/WaitingRoom/copy-darkgray.png" className="w-5 h-5" alt="방 코드 복사" />
                </button>
            </div>
            <div className="user-list-container mx-auto">
                <ul>
                    {users.map((user, index) => (
                        <li key={user.id}>
                            <div className="flex w-full mx-10 justify-between gap-20 items-center">
                                <div className="flex-1 text-xl">
                                {index + 1}. {user.nickname}
                                {user.id === currentUser?.id && ' (나)'}</div> 
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
        </div>
    )
}