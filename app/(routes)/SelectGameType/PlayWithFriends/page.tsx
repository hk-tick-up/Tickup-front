'use client';

import React, { useState } from 'react'
import '../../../css/GameRoom/root.css'
import '../../../css/GameRoom/playWithFreinds.css'
import BottomNav from '../../../components/BottomNav';
import Modal from '../../../components/Modal';
import Link from "next/link";
import { useRouter } from 'next/navigation';

const createRoom = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/v1/gameroom/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "gameType": "Basic",
                "userRole": "user"
            })
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(text);
        }
        if (!response.ok) {
            throw new Error(data.message || text || "방 생성에 실패하였습니다." );
        }
        console.log(data);

        return data.gameRoomId;
    } catch (error: unknown) {
        console.error("방 생성 중에 오류가 발생하였습니다.");
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("알 수 없는 오류가 발생했습니다.");
        }
    }
};

export default function Component() {
    const [gameRoomId, setGameRoomId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const joinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/v1/gameroom/join/${gameRoomId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(text);
            }

            if (!response.ok) {
                throw new Error(data.message || text || "방 입장에 실패했습니다.");
            }

            router.push('/game/room');
        } catch (error : unknown) {
            console.error("방 입장 중 오류 발생:", error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("알 수 없는 오류가 발생했습니다.");
            }
            setIsModalOpen(true);
        }
    };

    const handleCreateRoom = async () => {
        try {
            const newRoomId = await createRoom();
            router.push(`/game/room?id=${newRoomId}`);
        } catch (error: unknown) {
            if(error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("알 수 없는 오류가 발생했습니다.");
            }
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className='relative container'>
                <div className='position-back-button fixed w-full'>
                    <Link href="/game"><img src="../images/back.png" alt="뒤로 가기" /></Link>
                </div>
                <div className='box-position'>
                    <div className="font-[Freesentation-9Black] custom-title-font">
                        <p>모의 투자 게임으로</p>
                        <p>나만의 투자 시작하기!</p>
                    </div>
                    <div className='font-[Youth] custom-color-gray middle-components-position'>
                        <div className='adjustment-position'>
                            <div className='flex items-center'><img src='../images/GameRoom/hands.png' className='pr-1 h-6' alt="손" />
                            <div className='notice-text'>친구와 함께 플레이 해요</div></div>
                        </div>
                        <form onSubmit={joinRoom}>
                            <div className='flex space-x-3 items-center'>
                                <input 
                                    value={gameRoomId} 
                                    onChange={(e) => setGameRoomId(e.target.value)} 
                                    placeholder='초대코드를 입력하세요' 
                                    type="text" 
                                />
                                <div>
                                    <button type="submit" className='join-button'>입장</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className='font-[Youth] custom-color-gray share-box'>
                        <p className='adjustment-position'>함께 하고 싶은 친구를 불러주세요!</p>
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

