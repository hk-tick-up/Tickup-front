'use client';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import BottomNav from '../../components/BottomNav';
import '@/app/css/waiting-room/root.css'
import '@/app/css//waiting-room/select-game.css';
// import { error } from 'console';
import * as StompJs from "@stomp/stompjs";

export default function Component() {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ token: '', userId: '', nickname: '' });
    //localhost
    const NEXT_PUBLIC_WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

    
    useEffect(() => {
        // isModalOpen, errorMessage 값 변화 시
    },[isModalOpen, errorMessage]);

    useEffect(() => {
        const token = sessionStorage.getItem('bearer');
        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');

        if(!token || !userId || !nickname ){ 
            router.push('/signin');
            throw new Error("로그인이 필요합니다.");
            // setErrorMessage("로그인이 필요합니다.");
            // setIsModalOpen(true);
        }

        setUserInfo({ token, userId, nickname });
    }, [router]);
    
    const matching = async () => {
        setIsLoading(true);
        router.push('/game/loading');
        //localhost
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/random-join`;

        const requestBody = {
            GameType: "Basic",
            userRole: "User"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userInfo.token.startsWith('Bearer ') ? userInfo.token : `Bearer ${userInfo.token}`
                },
                credentials: 'include',
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const gameType = data.gameType

            if (!data || !data.roomId) {
                throw new Error('방 정보를 받을 수 없습니다.');
            }

            sessionStorage.setItem('currentRoomId', data.roomId.toString());
            sessionStorage.setItem('gameType', gameType);

            const stompClient = new StompJs.Client({
                //localhost
                brokerURL: NEXT_PUBLIC_WEBSOCKET_URL,
                // brokerURL: 'http://192.168.1.6/ws',
                connectHeaders: {
                    Authorization: `Bearer ${userInfo.token}`
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });
            
            stompClient.onConnect = (frame) => {
                console.log('STOMP 연결 성공:', frame);
                stompClient.subscribe(`/topic/waiting-room/${data.roomId}`, (message) => {
                    console.log('메시지 수신:', message.body);
                });
    
                stompClient.publish({
                    destination: `/app/waiting-room/${data.roomId}/join`,
                    body: JSON.stringify({ userId: userInfo.userId, nickname: userInfo.nickname })
                });
    
                // 웹소켓 연결 성공 후 페이지 이동
                router.push(`/game/waiting/${data.roomId}`);
            };
            
            // stompClient.onWebSocketError = (error) => {
            //     console.error('WebSocket Error:', error);
            //     setErrorMessage("웹소켓 연결 중 오류가 발생했습니다.");
            //     setIsModalOpen(true);
            // };
    
            // stompClient.onStompError = (frame) => {
            //     console.error('STOMP Error:', frame.headers['message']);
            //     console.error('Additional details:', frame.body);
            //     setErrorMessage("STOMP 연결 중 오류가 발생했습니다.");
            //     setIsModalOpen(true);
            // };
    
            stompClient.activate();
    
        } catch (error) {
            console.error("매칭 중 오류:", error);
            setErrorMessage("매칭 중 오류가 발생했습니다. 다시 시도해 주세요.");
            setIsModalOpen(true);
            router.push("/game");
        } finally {
            setIsLoading(false);
        }
    };

    
    return (
        <>
            <div className="flex-1 items-center justify-center py-5 container">
                <div className="font-[Freesentation-9Black] custom-title-font">
                    <p>모의 투자 게임으로</p>
                    <p>나만의 투자 시작하기!</p>
                </div>
                <div className="font-design text-xl py-7 custom-color-gray">
                    <p>원하는 게임 방식을 선택하면</p>
                    <p>모의 투자 게임이 시작돼요</p>
                </div>
                <div className="flex justify-center space-x-10">
                    <div>
                        <button onClick={matching} disabled={isLoading}>
                            <img src="/images/waiting-room/dice.png" className="custom-img select-random-btn" />
                            <p className="font-design text-lg">랜덤 매칭</p>
                        </button>
                    </div>
                    <div>
                        <Link href="/game/together">
                            <button>
                                <img src="/images/waiting-room/together.png" className="custom-img select-together-btn" />
                                <p className="font-design text-lg">함께 하기</p>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <BottomNav />
        </>
    )
}

