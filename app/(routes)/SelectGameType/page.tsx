'use client';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import BottomNav from '../../components/BottomNav';
import '../../css/WaitingRoom/root.css'
import '../../css/WaitingRoom/selectGame.css';
import { error } from 'console';
import * as StompJs from "@stomp/stompjs";


// const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws';

export default function Component() {
    const [isLoading, setIsLoading] = useState(false);
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
    const router = useRouter();
    // const { socket, isConnected, error, reconnect } = useSocket(gameRoomCode);
    
    const matching = async () => {
        setIsLoading(true);
        router.push('/game/loading');

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/random-join`;
        const token = sessionStorage.getItem('bearer');
        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');

        if(!token || !userId || !nickname) {
            throw new Error("로그인이 필요합니다.");
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    "GameType": "Basic",
                    "userRole": "user"
                    // ,"is_public": true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            if(data.id) {
                router.push(`/game/room/${data.id}`);
            } else {
                throw new Error('ROOM ID not found in response');
            }

            const stompClient = new StompJs.Client({
                //localhost
                brokerURL: 'ws://localhost:8007/ws'
                ,debug: console.log
            });
            stompClient.onConnect = (frame) => {
                console.log('Connected: ' + frame);
                stompClient.subscribe(`/topic/waiting-room/${data.gameRoomCode}`, (greeting) => {
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

            return data.gameRoomCode;
        } catch (error) {
            console.error("매칭 중 오류:", error);
            alert("매칭 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
                            <img src="/images/WaitingRoom/dice.png" className="custom-img select-random-btn" />
                            <p className="font-design text-lg">랜덤 매칭</p>
                        </button>
                    </div>
                    <div>
                        <Link href="/game/together">
                            <button>
                                <img src="/images/WaitingRoom/together.png" className="custom-img select-together-btn" />
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

