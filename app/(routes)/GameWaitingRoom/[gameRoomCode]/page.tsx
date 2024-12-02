'use client';

import React, { useEffect, useState, useCallback } from 'react'
import { useSocket } from '@/app/hooks/useSocket';
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import io, { Socket } from 'socket.io-client';
import '../../../css/WaitingRoom/root.css'
import '../../../css/WaitingRoom/gameWaitingRoom.css'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3007';

interface User {
    id: string;
    nickname: string;
    status: '대기중' | '준비완료';
}

export default function WaitingRoom() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter();
    const params = useParams();
    const gameRoomCode = params.gameRoomCode as string;

    const { socket, isConnected, error, reconnect } = useSocket(gameRoomCode);

    const joinRoom = useCallback(() => {
        if (socket && isConnected) {
            console.log('Attempting to join room');
            const nickname = sessionStorage.getItem("nickname") || '알 수 없음';
            const initialUser: User = {
                id: socket.id,
                nickname: nickname,
                status: '대기중'
            };
            setCurrentUser(initialUser);
            socket.emit('joinRoom', { gameRoomCode, user: initialUser });
        }
    }, [socket, isConnected, gameRoomCode]);

    useEffect(() => {
        if (isConnected) {
            joinRoom();
        }
    }, [isConnected, joinRoom]);

    useEffect(() => {
        if (socket) {
            socket.on('userJoined', (user: User) => {
                console.log('User joined:', user);
                setUsers(prevUsers => [...prevUsers, user]);
            });

            socket.on('updateUsers', (updatedUsers: User[]) => {
                console.log('Users updated:', updatedUsers);
                setUsers(updatedUsers);
            });

            const handleGameStart = () => {
                console.log('게임 시작, 리다이렉트 중...');
                router.push(`/game/play/${gameRoomCode}`);
            };

            socket.on('gameStart', handleGameStart);

            return () => {
                socket.off('userJoined');
                socket.off('updateUsers');
                socket.off('gameStart', handleGameStart);
            };
        }
    }, [socket, router, gameRoomCode]);

    const handleReady = useCallback(() => {
        if (socket && currentUser) {
            const newStatus = currentUser.status === '대기중' ? '준비완료' : '대기중';
            socket.emit('updateStatus', { gameRoomCode, userId: currentUser.id, status: newStatus });
        }
    }, [socket, currentUser, gameRoomCode]);

    const handleStart = useCallback(() => {
        if (socket) {
            socket.emit('startGame', { gameRoomCode });
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
                                <div className="flex-1 text-xl">{index + 1}. {user.nickname}</div> 
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