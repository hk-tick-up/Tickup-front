'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import BottomNav from '../../components/BottomNav';
import '../../css/WaitingRoom/root.css'
import '../../css/WaitingRoom/selectGame.css';

export default function Component() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    const matching = async () => {
        setIsLoading(true);
        router.push('/game/loading');

        try {
            const response = await fetch("http://localhost:8080/api/v1/waiting-room/random-join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "GameType": "Basic",
                    "userRole": "user",
                    "is_public": true
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            
            if (data.id) {
                router.push(`/game/room/${data.id}`);
            } else {
                throw new Error('Room ID not found in response');
            }
        } catch (error) {
            console.error("Error during matching:", error);
            alert("매칭 중 오류가 발생했습니다. 다시 시도해 주세요.");
            router.push('/game');
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
                <div className="font-[Youth] py-8 custom-color-gray">
                    <p>원하는 게임 방식을 선택하면</p>
                    <p>모의 투자 게임이 시작돼요</p>
                </div>
                <div className="flex justify-center space-x-10">
                    <div>
                        <button onClick={matching} disabled={isLoading}>
                            <img src="/images/WaitingRoom/dice.png" className="custom-img select-random-btn" />
                            <p className="font-[Youth] text-lg">랜덤 매칭</p>
                        </button>
                    </div>
                    <div>
                        <Link href="/game/together">
                            <button>
                                <img src="/images/WaitingRoom/together.png" className="custom-img select-together-btn" />
                                <p className="font-[Youth] text-lg">함께 하기</p>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <BottomNav />
        </>
    )
}

