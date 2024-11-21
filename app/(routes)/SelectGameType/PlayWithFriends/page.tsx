'use client';

import React from 'react'
import { useState } from "react";
import '../../../css/GameRoom/root.css'
import '../../../css/GameRoom/playWithFreinds.css'
import BottomNav from '../../../components/BottomNav';
import Link from "next/link";
import { NextRequest } from 'next/server';

const creatRoom = async () => {
    const response = await fetch("http://localhost:8080/api/v1/gameroom/create", {
        method: "POST",
        headers: ({
            "Content-Type" : "application/json"
        }),
        body: JSON.stringify({
            "gameType": "Basic",
            "userRole": "user"
        })
    });
    console.log(await response.json());
};


export async function POST(request: NextRequest) {
    const data = await request.json();
    return Response.json(data);
}

export default function Component() {
    const [gameRoomId, setGameRoomId] = useState("");
    const joinRoom = async () => {
        const response = await fetch(`http://localhost:8080/api/v1/gameroom/join/${gameRoomId}`, {
            method: "POST",
            headers: ({
                "Content-Type": "application/json"
            })
        })
    }

    return (
        <>
            <div className='relatve container'>
                <div className='position-back-button fixed w-full'>
                    <a href="/game"><img src="../images/back.png" /></a>
                </div>
                <div className='box-position'>
                    <div className="font-[Freesentation-9Black] custom-title-font">
                        <p>모의 투자 게임으로</p>
                        <p>나만의 투자 시작하기!</p>
                    </div>
                    <div className='font-[Youth] custom-color-gray middle-components-position'>
                        <div className='adjustment-position'>
                            <div className='flex items-center'><img src='../images/GameRoom/hands.png' className='pr-1 h-6' />
                            <div className='notice-text'>친구와 함께 플레이 해요</div></div>
                        </div>
                        <div>
                            <div className='flex space-x-3 items-center'>
                                <input value={gameRoomId} onChange={(e) => setGameRoomId(e.target.value)} placeholder='초대코드를 입력하세요' type="text" />
                                <div>
                                    <Link href="/game/room">
                                    <button onClick={joinRoom} className='join-button'>입장</button>
                                    </Link>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className='font-[Youth] custom-color-gray share-box'>
                        <p className='adjustment-position'>함께 하고 싶은 친구를 불러주세요!</p>
                        <div>
                            <Link href="/game/room">
                            <button onClick={creatRoom} className='share-button'>코드를 만들어 공유하기</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav/>
        </>
    )
}