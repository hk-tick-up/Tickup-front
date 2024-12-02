'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from "next/link";
import BottomNav from '../../../components/bottomNav';
import Modal from '../../../components/Modal';
import '../../../css/WaitingRoom/root.css'
import '../../../css/WaitingRoom/playWithFreinds.css'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const createRoom = async () => {
    try {
        const url = `${API_BASE_URL}/api/v1/waiting-room/create-private`;
        console.log('요청 URL:', url);

        const requestBody = {
            GameType: "BASIC",
            userRole: "User"
        };

        console.log('요청 본문:', JSON.stringify(requestBody));

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        console.log('응답 상태:', response.status);
        console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

        const responseData = await response.text();
        console.log('응답 본문:', responseData);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseData}`);
        }

        let data;
        try {
            data = JSON.parse(responseData);
        } catch (error) {
            console.error('JSON 파싱 실패:', error);
            throw new Error('서버로부터 잘못된 응답 형식');
        }

        console.log('파싱된 응답 데이터:', data);
        if (data && data.gameRoomCode) {
            return data.gameRoomCode;
        } else {
            throw new Error('서버 응답에 방 코드가 없습니다');
        }
    } catch (error) {
        console.error("방 생성 중 오류 발생:", error);
        throw error;
    }
};

export default function Component() {
    const [gameRoomCode, setGameRoomCode] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const joinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = `${API_BASE_URL}/api/v1/waiting-room/join-private/${gameRoomCode}`;
            console.log('요청 URL:', url);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            console.log('응답 상태:', response.status);
            console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

            const responseData = await response.text();
            console.log('응답 본문:', responseData);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data;
            try {
                data = JSON.parse(responseData);
            } catch (error) {
                console.error('JSON 파싱 실패:', error);
                throw new Error('서버로부터 잘못된 응답 형식');
            }

            console.log('파싱된 응답 데이터:', data);
            if (data && data.gameRoomCode) {
                console.log(`/game/waiting/${data.gameRoomCode}로 이동 중...`);
                router.push(`/game/waiting/${data.gameRoomCode}`);
            } else {
                throw new Error('서버 응답에 방 코드가 없습니다');
            }
        } catch (error) {
            console.error("방 입장 중 오류 발생:", error);
            setErrorMessage(error instanceof Error ? error.message : "방 입장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            setIsModalOpen(true);
        }
    };

    const handleCreateRoom = async () => {
        try {
            console.log('방 생성 시작...');
            const newRoomCode = await createRoom();
            console.log('방 생성 성공, 코드:', newRoomCode);
            if (newRoomCode) {
                console.log(`/game/waiting/${newRoomCode}로 이동 중...`);
                router.push(`/game/waiting/${newRoomCode}`);
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

