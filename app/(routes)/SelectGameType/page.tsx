// 게임방식 선택하는 페이지
import React from 'react'
import '../../css/GameRoom/root.css';

export default function Component() {
    return (
        <div className="bg-gray-100 flex-1 flex flex-col items-center py-5">
            <div className="font-[Freesentation-9Black] text-2xl">
                <p>모의 투자 게임으로</p>
                <p>나만의 투자 시작하기!</p>
            </div>
            <div className="font-[Youth] py-8 custom-color-gray">
                <p>원하는 게임 방식을 선택하면</p>
                <p>모의 투자 게임이 시작돼요</p>
            </div>
            <div className="flex justify-center space-x-10">
                <div>
                    <button className="">
                        <img src="/images/GameRoom/dice.png" className="custom-img select-random-btn" />
                        <p className="font-[Youth] text-lg">랜덤 매칭</p>
                    </button>
                </div>
                <div>
                    <button className=''>
                        <img src="/images/GameRoom/together.png" className="custom-img select-together-btn" />
                        <p className="font-[Youth] text-lg">함께 하기</p>
                        </button>
                </div>
            </div>
        </div>
    )
}