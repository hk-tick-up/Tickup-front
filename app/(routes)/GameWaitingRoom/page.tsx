'use client'

import React from 'react'
import '../../css/GameRoom/root.css'
import '../../css/GameRoom/gameWaitingRoom.css'

import { useEffect, useState } from 'react'
import { Copy } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
// import { Button } from '@/components/ui/button'

type UserStatus = '대기중' | '준비완료'

interface User {
    id: number
    status: UserStatus
}

export default function Component() {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [users, setUsers] = useState<User[]>([
        { id: 1, status: '대기중' },
        { id: 2, status: '대기중' },
        { id: 3, status: '대기중' },
        { id: 4, status: '대기중' },
        { id: 5, status: '대기중' }
    ])
    const [currentUserId] = useState(2) // 임시로 2번 유저로 설정
    const roomCode = '#5RF2'

    // useEffect(() => {
    //     const newSocket = io('http://localhost:3001') // WebSocket 서버 URL을 적절히 수정해주세요
    //     setSocket(newSocket)

    //     newSocket.on('userStatusUpdate', ({ userId, status }) => {
    //         setUsers(prevUsers =>
    //             prevUsers.map(user =>
    //             user.id === userId ? { ...user, status } : user
    //             )
    //         )
    //     })
    //     return () => { newSocket.close() }
    // }, [])

    const handleReady = () => {
    const currentUser = users.find(user => user.id === currentUserId)
    if (!currentUser) return
        const newStatus = currentUser.status === '대기중' ? '준비완료' : '대기중'
        socket?.emit('updateStatus', { userId: currentUserId, status: newStatus })
        setUsers(prevUsers =>
            prevUsers.map(user =>
            user.id === currentUserId ? { ...user, status: newStatus } : user
            ) 
        )
    }

    const handleStartGame = () => {
        if (users.slice(1).every(user => user.status === '준비완료')) {
            socket?.emit('startGame')
        }
    }

    const copyRoomCode = async () => {
        try {
            await navigator.clipboard.writeText(roomCode)
            alert('방 코드가 복사되었습니다!')
        } catch (err) {
            console.error('복사 실패:', err)
        }
    }

    const isAllReady = users.slice(1).every(user => user.status === '준비완료')

    return (
        <>
            <div className="relative container">
                <div className="position-back-button fixed w-full">
                    <a href="/game">
                    <img src="../images/exitgame_icon.png" className="w-7" />
                    </a>
                </div>
            <div className="room-code">
                <span className="font-[Freesentation-9Black]">{roomCode}</span>
                <button onClick={copyRoomCode} className='room-code-copy'>
                    <img src="../images/GameRoom/copy-darkgray.png" className="w-5 h-5"/>
                </button>
            </div>
            <div className="user-list-container mx-auto">
                <ul> {users.map(user => (
                    <li key={user.id}>
                        <div className="flex w-full mx-10 justify-between gap-20 items-center">
                            <div className="flex-1 text-xl">{user.id}</div> 
                            <div className="flex-1 flex justify-center"> {user.status !== '대기중' && (
                            <p className="status-ready ">
                                {user.status}
                            </p> )} 
                                {user.status === '대기중' && (
                            <p className="status-wait">
                                {user.status}
                            </p>)}</div>
                            </div>
                    </li> ))}
                </ul>
                <div>
                    {currentUserId === 1 ? ( 
                    <button
                        onClick={handleStartGame}
                        disabled={!isAllReady}
                        className={` ${ isAllReady
                            ? 'bgame-btn'
                            : 'not-yet cursor-not-allowed' }`}>
                        시작하기
                    </button>) : (
                    <button
                        onClick={handleReady}
                        className={` game-btn ${
                        users[currentUserId - 1].status === '준비완료'
                            ? 'cancle-btn'
                            : 'game-btn'
                        }`}>
                    {users[currentUserId - 1].status === '준비완료' ? '준비취소' : '준비완료'}
                    </button> )}
                </div>
            </div>
        </div>

        </>
        // <div className='relatve container'>
        //     <div className='position-back-button fixed w-full'>
        //         <a href="/game"><img src="../images/exitgame_icon.png" className='w-7'/></a>
        //     </div>
        //     <div className='box-position'>
        //         <div className='flex space-x-1'>
        //             <div>#5RF2</div>
        //             <div><img src='../images/GameRoom/copy-darkgray.png' className='w-5'/></div>
        //         </div>
        //     </div>
        //     <div className='user-list-position'>
        //         <ul>
        //             <li>1</li>
        //             <li>2<p className='status-ready'>준비완료</p></li>
        //             <li>3 <p className='status-wait'>대기중</p></li>
        //             <li>4</li>
        //             <li>5</li>
        //         </ul>
        //     </div>
        //     <div className='box-position'>
        //         <div className='game-btn'>시작하기</div>
        //     </div>
        // </div>
    )
}