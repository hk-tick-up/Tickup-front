import React from 'react'
import '../../css/GameRoom/root.css'
import '../../css/GameRoom/gameWaitingRoom.css'

export default function Component() {
    return (
        <div className='relatve container'>
            <div className='position-back-button fixed w-full'>
                <a href="/game"><img src="../images/exitgame_icon.png" className='w-7'/></a>
            </div>
            <div className='box-position'>
                <div className='flex space-x-1'>
                    <div>#5RF2</div>
                    <div><img src='../images/GameRoom/copy-darkgray.png' className='w-5'/></div>
                </div>
            </div>
            <div className='user-list-position'>
                <ul>
                    <li>1</li>
                    <li>1<p className='status-ready'>준비완료</p></li>
                    <li>1 <p className='status-wait'>대기중</p></li>
                    <li>1</li>
                    <li>1</li>
                </ul>
            </div>
            <div className='box-position'>
                <div className='game-btn'>시작하기</div>
            </div>
        </div>
    )
}