import React from 'react'
import '../../../css/GameRoom/root.css'
import '../../../css/GameRoom/playWithFreinds.css'
import BottomNav from '../../../components/BottomNav';

export default function Component() {
    return (
        <>
            <div className='relatve container'>
                <div className='bg-gray-100 position-back-button fixed w-full'>
                    <a href="/game"><img src="../images/back.png" /></a>
                </div>
                <div className='bg-gray-100 flex flex-1 flex-col items-center justify-center'>
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
                                <input placeholder='초대코드를 입력하세요'/>
                                <div><button className='join-button'>입장</button></div>
                            </div>
                        </div>
                    </div>
                    <div className='font-[Youth] custom-color-gray share-box'>
                        <p className='adjustment-position'>함께 하고 싶은 친구를 불러주세요!</p>
                        <div>
                            <button className='share-button'>코드를 만들어 공유하기</button>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav/>
        </>
    )
}