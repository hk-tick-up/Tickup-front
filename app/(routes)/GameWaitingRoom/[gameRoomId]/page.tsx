'use client';

import React, { useEffect, useState, useCallback } from 'react'
import { useWebSocket } from '@/app/hooks/useSocket';
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import io, { Socket } from 'socket.io-client';
import '../../../css/WaitingRoom/root.css'
import '../../../css/WaitingRoom/gameWaitingRoom.css'

import * as StompJs from "@stomp/stompjs";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3007/ws';

interface User {
    id: string;
    nickname: string;
    status: '대기중' | '준비완료';
}

export default function WaitingRoom() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [nickname, setNickname] = useState<string | null>("");
    const router = useRouter();
    const params = useParams();
    const gameRoomCode = params.gameRoomCode as string;

    const { socket, isConnected } = useWebSocket(gameRoomCode);


    useEffect(() => {
        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');
        const token = sessionStorage.getItem('bearer');

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
                    router.push(`/game/play/${gameRoomCode}`);
                    break;
            }
        };
    }, [socket, router, gameRoomCode]);

    const handleReady = useCallback(() => {
        if (socket && currentUser) {
            socket.send(JSON.stringify({
                type: 'UPDATE_STATUS',
                gameRoomCode,
                userId: currentUser.id,
                status: currentUser.status === '대기중' ? '준비완료' : '대기중'
            }));
        }
    }, [socket, currentUser, gameRoomCode]);

    const handleStart = useCallback(() => {
        if (socket) {
            socket.send(JSON.stringify({
                type: 'START_GAME',
                gameRoomCode
            }));
        }
    }, [socket, gameRoomCode]);

    const copyRoomCode = async () => {
        try {
            await navigator.clipboard.writeText(gameRoomCode);
            alert('방 코드가 복사되었습니다.');
        } catch (err) {
            console.error('복사 실패: ', err);
            alert('방 코드 복사에 실패했습니다. 직접 코드를 복사해주세요.');
        }
    };

    const leaveRoom = async () => {
        const stompClient = new StompJs.Client({
            //localhost
            brokerURL: "ws://localhost:8007/ws"
            ,debug: console.log
        });

        stompClient.onConnect = (frame) => {
            const stompClient = new StompJs.Client({
        //localhost
        brokerURL: "ws://localhost:8007/ws"
        ,debug: console.log
    });
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/topic/waiting-room/${data.gameRoomId}/leave`, (greeting) => {
            console.log(greeting)
            });
        };
        stompClient.onWebSocketError = (error) => {
            console.error('Error with websocket', error);
        };
        
        stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };
        
        stompClient.activate();
    }
    const isHost = currentUser && users.length > 0 && currentUser.id === users[0].id;


    return (
        <div className="relative container">
            <div className="position-back-button fixed w-full">
                <Link href="/game">
                    <img src="/images/exitgame_icon.png" className="w-7" alt="게임 나가기" />
                </Link>
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