'use client';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav';
import GameOptions from '../select-game-type/components/GameOptions';
import { matchUser, connectToWaitingRoom } from '../select-game-type/services/matchingService';
import '@/app/css/waiting-room/root.css'
import '@/app/css/waiting-room/select-game.css';

export default function GamePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ token: '', userId: '', nickname: '' });

    useEffect(() => {
        const token = sessionStorage.getItem('bearer');
        const userId = sessionStorage.getItem('id');
        const nickname = sessionStorage.getItem('nickname');

    if (!token || !userId || !nickname) {
        router.push('/signin');
        throw new Error("로그인이 필요합니다.");
    }

    setUserInfo({ token, userId, nickname });
    }, [router]);

    const handleRandomMatch = async () => {
        setIsLoading(true);
        // router.push('/game/loading');

        try {
        const data = await matchUser(userInfo.token, userInfo.userId, userInfo.nickname);
        connectToWaitingRoom(userInfo.token, data.waitingRoomId, userInfo.userId, userInfo.nickname);
        router.push(`/game/waiting/${data.waitingRoomId}`);
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
            <GameOptions onRandomMatch={handleRandomMatch} isLoading={isLoading} />
        </div>
        <BottomNav />
        {isModalOpen && (
            <div className="modal">
            <p>{errorMessage}</p>
            <button onClick={() => setIsModalOpen(false)}>닫기</button>
            </div>
        )}
        </>
    )
}

