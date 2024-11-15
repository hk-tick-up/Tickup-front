'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../css/GameProgressBar.module.css'
// import { io, Socket } from 'socket.io-client' // 주석 처리

interface GameProgressBarProps {
    initialTurn: number
    initialTotalTurns: number
}

export default function GameProgressBar({ initialTurn, initialTotalTurns }: GameProgressBarProps) {
    const [turn, setTurn] = useState(initialTurn)
    const [totalTurns, setTotalTurns] = useState(initialTotalTurns)

    //UI 확인 위헤 웹소켓 부분 주석처리

    // const [socket, setSocket] = useState<Socket | null>(null) // 주석 처리

    
    // useEffect(() => {
    //     const newSocket = io('http://your-spring-boot-server-url')
    //     setSocket(newSocket)

    //     return () => {
    //         newSocket.disconnect()
    //     }
    // }, [])

    // useEffect(() => {
    //     if (!socket) return

    //     socket.on('turnUpdate', (data: { turn: number, totalTurns: number }) => {
    //         setTurn(data.turn)
    //         setTotalTurns(data.totalTurns)
    //     })

    //     socket.on('error', (error) => {
    //         console.error('WebSocket error:', error)
    //     })

    //     return () => {
    //         socket.off('turnUpdate')
    //         socket.off('error')
    //     }
    // }, [socket])
    

    return (
        <div className={styles.container}>
            <button className={styles.exitButton}>
                <Image 
                    src="/images/gamelogic/exitgame_icon.png" 
                    alt="Exit" 
                    width={24} 
                    height={24} 
                />
            </button>
            <div className={styles.turnCounter}>
                Turn {turn}/{totalTurns}
            </div>
        </div>
    )
}
