'use client';

import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from 'next/image'
import BottomNav from './components/BottomNav'
import axios from "axios";
import './css/main.css'

export default function HomePage() {
  const [nickname, setNickname] = useState<string | null>("");
  const [point, setPoint] = useState<number>(0);

  useEffect(()=>{
    setNickname(sessionStorage.getItem("nickname"));

    //localhost
    axios.get("http://localhost:8005/api/v1/users/point", {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("bearer")}`
      }
    })
    .then(res => {
      console.log(res.data);
      setPoint(res.data);
    })
    .catch(error => {
      // console.error(error);
      console.log(error);
    });
  }, [])


  return (
    <>
      <div className="main-root">
        {/* 헤더 */}
        <header>
          <div className='main-title'>
            TickUp
          </div>
          <div className='user-summary'>
            <div>
            {nickname}님, 반가워요!
            </div>
            <div className='flex'>
              <div><Image src='/images/icon/money.png' alt="포인트" width={20} height={20} className='money-icon-position' /></div>
              <div>{point}P</div>
            </div>
          </div>
        </header>
        {/* 메인 카드 섹션 */}
        <main>
          <div className='flex py-5 gap-5 items-center'> 
            <Link href="/game">
              <div className='main-block main-game-btn'>
                <div className='cutom-title'>
                  <p>모의투자</p>
                  <p>게임하기</p>
                </div>
                <div>
                  <Image src='/images/group_1.png' alt="게임하기" width={120} height={120} />
                </div>
              </div>
            </Link>
            <div className='side-block'>
              <div className='mini-block'>
                <div>오늘의 금융 퀴즈</div>
                <div className='inblock-icon'><Image src='/images/books.png' alt="퀴즈" width={24} height={24} /></div>
              </div>
              <div className='mini-block'>
                <div>친구들과 토론하기</div>
                <div className='inblock-icon'><Image src='/images/speech_bubble.png' alt="토론" width={24} height={24} /></div>
              </div>
            </div>
          </div>
          <div className='other-service-block'>
            <div>이런 서비스도 있어요</div>
            <div className='blank1'></div>
          </div>
        </main>

        {/* 하단 배너 */}
        <div className="test-custom-1">마이페이지</div>
        <div className="section-position">
          <section>
            <div className='footer-block-big'>
              <div>
                <p>게임을 플레이하면</p>
                <p>결과에 따른 분석 리포트를 보여드려요!</p>
              </div>
              <div className='flex'>
                <p className='footer-announce'>분석 리포트로 투자 추가 공부하기</p>
                <p><Image src='/images/detective.png' alt="탐정" width={27} height={27} className='footer-icon-detective'/></p>
              </div>
            </div>
            <div><Image src='/images/icon/right-arrow.png' alt="화살표" width={15} height={15} className="footer-icon-arrow" /></div>    
          </section>
          <section>
            <div className='footer-block-big'>
              <div>
                <p>게임을 플레이하면</p>
                <p>결과에 따른 분석 리포트를 보여드려요!</p>
              </div>
              <div className='flex'>
                <p className='footer-announce'>분석 리포트로 투자 추가 공부하기</p>
                <p><Image src='/images/detective.png' alt="탐정" width={27} height={27} className='footer-icon-detective'/></p>
              </div>
            </div>
            <div><Image src='/images/icon/right-arrow.png' alt="화살표" width={15} height={15} className="footer-icon-arrow" /></div>    
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

