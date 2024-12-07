import React from 'react'
import '@/app/css/waiting-room/root.css'
import '@/app/css/waiting-room/loading.css'

export default function Component() {
    return (
        <div className='relatve container'>
            <div className='position-back-button fixed w-full'>
                <a href="/game"><img src="../images/back.png" /></a>
            </div>
            <div className='bg-gray-100 flex flex-1 flex-col items-center justify-center'>
                <div className="font-[Freesentation-9Black] custom-title-font">
                    <p>모의 투자 게임으로</p>
                    <p>나만의 투자 시작하기!</p>
                </div>
                <div className='runnig-img-position'>
                    <img src='/images/waiting-room/running.png' />
                </div>
                <div className='font-design text-lg custom-color-gray position-discription'>
                    <p>게임을 함께 할 플레이어들을 매칭중입니다.</p>
                    <p>잠시만 기다려주세요.</p>
                </div>
            </div>
        </div>
    )
}