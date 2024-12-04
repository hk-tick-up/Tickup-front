'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from "next/link";
import BottomNav from '../../../components/BottomNav';
import Modal from '../../../components/Modal';
import '../../../css/WaitingRoom/root.css'
import '../../../css/WaitingRoom/playWithFreinds.css'
import { useSocket } from '@/app/hooks/useSocket';

import * as StompJs from "@stomp/stompjs";
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8007';


export default function Component() {
    const [gameRoomCode, setGameRoomCode] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ token: '', userId: '', nickname: '' });

    
    useEffect(() => {
        const token = sessionStorage.getItem('bearer');
        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');

        if(!token || !userId || !nickname ){ 
            throw new Error("로그인이 필요합니다.");
            router.push('/signin');
            return;
        }

        setUserInfo({ token, userId, nickname });
    }, []);

    const createRoom = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/create-private`;
            
            console.log(url);
            console.log('방 생성 요청:', {
                url,
                token: userInfo.token.substring(0, 20) + '...' // 토큰 일부만 로그
            });
    
            const requestBody = {
                GameType: "Basic",
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
    
            if (!response.ok) {
                if (response.status === 401) {
                    sessionStorage.clear(); // 인증 실패시 세션 스토리지 클리어
                    window.location.href = '/signin';
                    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
                }
                const errorText = await response.text();
                throw new Error(errorText || '방 생성에 실패했습니다.');
            }
    
            const data = await response.json();
            if (!data || !data.gameRoomCode) {
                throw new Error('방 코드를 받지 못했습니다.');
            }
    // /game/waiting-room/${data.gameRoomCode}
    const stompClient = new StompJs.Client({
        //localhost
        brokerURL: "ws://localhost:8007/ws"
        ,debug: console.log
    });
    
    stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe(`/topic/waiting-room/${data.gameRoomId}`, (greeting) => {
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
    
            sessionStorage.setItem('currentRoomCode', data.gameRoomCode);
            sessionStorage.setItem('isHost', 'true');
    
            return data.gameRoomCode;
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
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/join/${gameRoomId}`;
            
            // request body 추가
            const requestBody = {
                userId: userInfo.userId,
                nickname: userInfo.nickname
            };
    
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userInfo.token}`
                },
                credentials: "include",
                body: JSON.stringify(requestBody)  // request body 추가
            });
    
            console.log('서버 응답 상태:', response.status);
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('서버 에러 응답:', errorData);
                throw new Error(errorData || '방 입장에 실패했습니다.');
            }
    
            const data = await response.json();
            console.log('서버 응답 데이터:', data);
    
            sessionStorage.setItem('currentRoomCode', gameRoomCode);
    
            const stompClient = new StompJs.Client({
                brokerURL: `${process.env.NEXT_PUBLIC_SOCKET_URL}/ws`,
                connectHeaders: {
                    Authorization: `Bearer ${userInfo.token}`
                },
            });
    
            stompClient.onConnect = function (frame) {
                console.log('STOMP 연결 성공:', frame);
                stompClient.subscribe(`/topic/room/${gameRoomId}`, function (message) {
                    console.log('메시지 수신:', message.body);
                    // 여기에서 수신된 메시지를 처리하는 로직을 추가할 수 있습니다.
                });

                // 방에 입장했음을 서버에 알림
                stompClient.publish({
                    destination: `/app/room/${gameRoomId}/join`,
                    body: JSON.stringify({ userId: userInfo.userId, nickname: userInfo.nickname })
                });

                // 연결 성공 후 라우팅
                router.push(`/game/waiting/${gameRoomId}`);
            };

            stompClient.onStompError = function (frame) {
                console.error('STOMP 에러:', frame.headers['message']);
                console.error('추가 상세:', frame.body);
                setErrorMessage("웹소켓 연결 중 오류가 발생했습니다.");
                setIsModalOpen(true);
            };

            stompClient.activate();
        } catch (error) {
            console.error("방 입장 중 오류:", error);
            setErrorMessage(error instanceof Error ? error.message : "방 입장 중 오류가 발생했습니다.");
            setIsModalOpen(true);
        }
    };

    const handleCreateRoom = async () => {
        try {
            console.log('방 생성 시작...');
            const gameRoomId = await createRoom();
            console.log('방 생성 성공, 코드:', gameRoomId);
            if (gameRoomId) {
                console.log(`/game/waiting/${gameRoomId}로 이동 중...`);
                router.push(`/game/waiting/${gameRoomId}`);
            } else {
                throw new Error('방 코드가 undefined입니다');
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
                                <img src='/images/WaitingRoom/hands.png' className='pr-1 h-6' alt="손" />
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

