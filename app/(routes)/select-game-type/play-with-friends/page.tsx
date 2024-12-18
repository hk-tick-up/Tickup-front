'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from "next/link";
import BottomNav from '../../../components/BottomNav';
import Modal from '../../../components/Modal';
import JoinRoomForm from '../components/JoinRoomForm';
import { createRoom, joinRoom } from '../services/waitingRoomService';
import '@/app/css/waiting-room/root.css';
import '@/app/css/waiting-room/play-with-friends.css';

export default function TogetherPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ token: '', userId: '', nickname: '' });

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

    const handleCreateRoom = async () => {
        try {
            console.log('방 생성 시작...');
            const data = await createRoom(userInfo.token);
            sessionStorage.setItem('waitingRoomId', data.waitingRoomId.toString());
            sessionStorage.setItem('gameRoomCode', data.gameRoomCode);
            sessionStorage.setItem('gameType', data.gameType);
            console.log(`/game/waiting/${data.waitingRoomId}로 이동 중...`);
            router.push(`/game/waiting/${data.waitingRoomId}`);
        } catch (error) {
            console.error("방 생성 중 오류 발생:", error);
            setErrorMessage(error instanceof Error ? error.message : "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            setIsModalOpen(true);
        }
    };

    const handleJoinRoom = async (gameRoomCode: string) => {
        try {
            const data = await joinRoom(userInfo.token, gameRoomCode);
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
                        <JoinRoomForm onJoin={handleJoinRoom} />
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

