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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ token: '', userId: '', nickname: '' });
    const [gameRoomCode, setGameRoomCode] = useState("");
    
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
    }, [router]);

    const createRoom = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/create-private`;
            
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
                    sessionStorage.clear();
                    window.location.href = '/signin';
                    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
                }
                const errorText = await response.text();
                throw new Error(errorText || '방 생성에 실패했습니다.');
            }
    
            const data = await response.json();

            if (!data || !data.id) {
                throw new Error('방 생성에 에러가 발생했습니다. 다시 시도해주세요.');
            }

            const roomId = data.id;
            const roomCode = data.gameRoomCode;


            sessionStorage.setItem('currentRoomId', roomId.toString());
            sessionStorage.setItem('waitingRoomCode', roomCode);
            sessionStorage.setItem('isHost', 'true');

            const stompClient = new StompJs.Client({
                //localhost
                brokerURL: "ws://localhost:8007/ws",
                connectHeaders: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
    
            stompClient.onConnect = (frame) => {
                console.log('Connected: ' + frame);
                stompClient.subscribe(`/topic/waiting-room/${roomId}`, (greeting) => {
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
    
            return roomId;
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/join/${gameRoomCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`방을 찾을 수 없습니다.`);
            }    
    
            const data = await response.json();
            
            if (data && data.roomId) {
                const roomId = data.roomId;
                sessionStorage.setItem('currentRoomId', roomId.toString());
                sessionStorage.setItem('waitingRoomCode', gameRoomCode);
    
                const stompClient = new StompJs.Client({
                //localhost
                brokerURL: "ws://localhost:8007/ws",
                connectHeaders: {
                    Authorization: `Bearer ${userInfo.token}`
                },
            });
    
                stompClient.onConnect = function (frame) {
                    console.log('STOMP 연결 성공:', frame);
                    stompClient.subscribe(`/topic/waiting-room/${roomId}`, function (message) {
                        console.log('메시지 수신:', message.body);
                    });

                    stompClient.publish({
                        destination: `/app/waiting-room/${roomId}`,
                        body: JSON.stringify({ userId: userInfo.userId, nickname: userInfo.nickname })
                    });

                    router.push(`/game/waiting/${roomId}`);
                };

                stompClient.onStompError = function (frame) {
                    console.error('STOMP 에러:', frame.headers['message']);
                    console.error('추가 상세:', frame.body);
                    setErrorMessage("웹소켓 연결 중 오류가 발생했습니다.");
                    setIsModalOpen(true);
                };

                stompClient.activate();
            } else {
                throw new Error("방 정보를 받을 수 없습니다.");
            }
        } catch (error) {
            console.error("방 입장 중 오류:", error);
            setErrorMessage(error instanceof Error ? error.message : "방 입장 중 오류가 발생했습니다.");
            setIsModalOpen(true);
        }
    };

    const handleCreateRoom = async () => {
        try {
            console.log('방 생성 시작...');
            const roomId = await createRoom();
            if (roomId) {
                console.log(`/game/waiting/${roomId}로 이동 중...`);
                router.push(`/game/waiting/${roomId}`);
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

