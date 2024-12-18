import React, { useState } from 'react';

interface JoinRoomFormProps {
    onJoin: (gameRoomCode: string) => void;
}

export default function JoinRoomForm({ onJoin }: JoinRoomFormProps) {
    const [gameRoomCode, setGameRoomCode] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (gameRoomCode.trim()) {
        onJoin(gameRoomCode);
        } else {
        alert("초대 코드를 입력해주세요.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
    );
}

