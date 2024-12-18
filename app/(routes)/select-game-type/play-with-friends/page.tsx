/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from "next/link";
import BottomNav from '../../../components/BottomNav';
import Modal from '../../../components/Modal';
import '@/app/css/waiting-room/root.css';
import '@/app/css/waiting-room/play-with-friends.css';
// import { useSocket } from '@/app/hooks/useSocket';

import * as StompJs from "@stomp/stompjs";


export default function Component() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ token: '', userId: '', nickname: '' });
    const [gameRoomCode, setGameRoomCode] = useState("");
    //localhost
    const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://192.168.1.6:8007/ws';
    
    useEffect(() => {
        const token = sessionStorage.getItem('bearer');
        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');

        if(!token || !userId || !nickname ){ 
            setErrorMessage("로그인이 필요합니다.");
            setIsModalOpen(true);
            router.push('/signin');
            return;
        }

        setUserInfo({ token, userId, nickname });
    }, [router]);

    const createRoom = async () => {
        try {
            //localhost
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/create-private`;
            const requestBody = {
                GameType: "Private",
                userRole: "User"
            };
    
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userInfo.token.startsWith('Bearer ') ? userInfo.token : `Bearer ${userInfo.token}`
                },
                credentials: "include",
                body: JSON.stringify(requestBody)
            });
        
            // const responseText = await response.text();

            if (!response.ok) {
                if (response.status === 401) {
                    sessionStorage.clear();
                    window.location.href = '/signin';
                    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
                }
                const errorText = await response.text();
                throw new Error(errorText || '방 생성에 실패했습니다.');
            }
    
            const data = await response.json();

            if (!data || !data.waitingRoomId) {  // waitingRoomId 대신 id 사용
                throw new Error('방 생성에 에러가 발생했습니다. 다시 시도해주세요.');
            }

            sessionStorage.setItem('waitingRoomId', data.waitingRoomId.toString());
            sessionStorage.setItem('gameRoomCode', data.gameRoomCode);
            sessionStorage.setItem('gameType', data.gameType);

            return data.waitingRoomId;
        } catch (error) {
            console.error("방 생성 중 오류 발생:", error);
            throw error;
        }
    };

    const joinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if(!gameRoomCode.trim()) {
            alert("초대 코드를 입력해주세요.");
            setIsModalOpen(true);
            return;
        }
    
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/join/${gameRoomCode}`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.token}`
                    },
                    credentials: "include"
                }
            );
    
            if (!response.ok) {
                throw new Error(`방을 찾을 수 없습니다. (${response.status})`);
            }
    
            const data = await response.json();
    
            if (!data || !data.waitingRoomId) {
                throw new Error("존재하지 않는 방입니다.");
            }

            sessionStorage.setItem('waitingRoomId', data.waitingRoomId.toString());
            sessionStorage.setItem('gameRoomCode', gameRoomCode);
            sessionStorage.setItem('gameType', 'Private');
    
            router.push(`/game/waiting/${data.waitingRoomId}`);
            
        } catch (error) {
            console.error("방 입장 중 오류:", error);
            setErrorMessage(error instanceof Error ? error.message : "방 입장 중 오류가 발생했습니다.");
            setIsModalOpen(true);
        }
    };

    const handleCreateRoom = async () => {
        try {
            console.log('방 생성 시작...');
            const waitingRoomId = await createRoom();
            if (waitingRoomId) {
                console.log(`/game/waiting/${waitingRoomId}로 이동 중...`);
                router.push(`/game/waiting/${waitingRoomId}`);
            } else {
                throw new Error('이동할 수 없습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error("방 생성 중 오류 발생:", error);
            setErrorMessage(error instanceof Error ? error.message : "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className='relative container'>
                <div className='position-back-button fixed w-full'>
                    <Link href="/game"><img src="/images/back.png" alt="뒤로 가기" /></Link>
                </div>
                <div className='box-position'>
                    <div className="font-[Freesentation-9Black] custom-title-font">
                        <p>모의 투자 게임으로</p>
                        <p>나만의 투자 시작하기!</p>
                    </div>
                    <div className='font-design custom-color-gray middle-components-position'>
                        <div className='adjustment-position'>
                            <div className='flex items-center'>
                                <img src='/images/waiting-room/hands.png' className='pr-1 h-6' alt="손" />
                                <div className='notice-text font-design'>친구와 함께 플레이 해요</div>
                            </div>
                        </div>
                        <form onSubmit={joinRoom}>
                            <div className='flex space-x-3 items-center'>
                                <input 
                                    id="gameRoomCode"
                                    value={gameRoomCode} 
                                    onChange={(e) => setGameRoomCode(e.target.value)} 
                                    placeholder='초대코드를 입력하세요' 
                                    type="text" 
                                />
                                <div>
                                    <button type="submit" className='join-button'>입장</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className='custom-color-gray share-box'>
                        <p className='adjustment-position font-design text-lg'>함께 하고 싶은 친구를 불러주세요!</p>
                        <div>
                            <button onClick={handleCreateRoom} className='share-button'>코드를 만들어 공유하기</button>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav/>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>{errorMessage}</p>
            </Modal>
        </>
    )
}

