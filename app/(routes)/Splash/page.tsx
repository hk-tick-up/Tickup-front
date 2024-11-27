'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// import { Logo } from '@/components/logo'
// import { motion } from 'framer-motion'

export default function SplashPage() {
    const router = useRouter()

    useEffect(() => {
    // 3초 후에 메인 페이지로 이동
    // const timer = setTimeout(() => {
    //   router.push('/')
    // }, 3000)

    return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-100 to-blue-200">
            <div> <img src="/images/tickup-logo.png" className='logo-size' /> </div>
        <div className='splash-title'>
            함께하는 모의투자 게임
        </div>
    </div>
    )
}

