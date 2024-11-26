'use client'

import { useEffect, useRef } from "react"
import { io, Socket } from 'socket.io-client'

export function useSocket(url: string) {
    const socektRef = useRef<Socket | null>(null)

    useEffect(() => {
        const socekt = io(url)
        socektRef.current = socekt

        return () => {
            if (socekt) {
                socekt.disconnect()
            }
        }
    }, [url])
    
    return socektRef.current
}