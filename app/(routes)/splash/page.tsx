'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import '@/app/css/main.css'

// import { Logo } from '@/components/logo'
// import { motion } from 'framer-motion'

const SplashPage = () => {
    // const router = useRouter()

    // useEffect(() => {
    // // 3초 후에 메인 페이지로 이동
    // const timer = setTimeout(() => {
    // router.push('/')
    // }, 3000)

    // return () => clearTimeout(timer)
    // }, [router])

    return (
        <div className="main-root bg-gradient-to-b from-white via-blue-100 to-blue-200 splash-root">
            <div className="content-wrapper">
                <div>
                    <div className='logo-position'> 
                        <img src="/images/logo.png" className='logo-size' /> 
                    </div>
                    <div className='splash-title'>TickUp</div>
                </div>
                <div className='splash-content'>
                    함께하는 모의투자 게임
                </div>
            </div>
        </div>
    )
}

export default SplashPage;