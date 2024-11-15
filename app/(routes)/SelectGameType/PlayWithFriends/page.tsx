import React from 'react'
import '../../../css/GameRoom/root.css'
import '../../../css/GameRoom/playWithFreinds.css'

export default function Component() {
    return (
        <div className='bg-gray-100  min-h-screen flex flex-col relatve'>
            <div className='bg-gray-100 position-back-button fixed w-full'>
                <a href="/game"><img src="../images/back.png" /></a>
            </div>
            <div className='bg-gray-100 flex flex-1 flex-col items-center justify-center'>
                <div className="font-[Freesentation-9Black] custom-title-font">
                    <p>모의 투자 게임으로</p>
                    <p>나만의 투자 시작하기!</p>
                </div>
                <div>

                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}