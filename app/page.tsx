'use client';

import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from 'next/image'
import BottomNav from './components/BottomNav'
import FooterBlock from './components/FooterBlock'
import FooterBlock_v2 from './components/FooterBlock_v2'
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
            <Link href="/game" className="flex-1">
              <div className='main-block main-game-btn'>
                <div className='custom-title'>
                  <p>모의투자</p>
                  <p>게임하기</p>
                </div>
                <div>
                  <Image src='/images/group_1.png' alt="게임하기" width={156} height={156} />
                </div>
              </div>
            </Link>
            <div className='side-block'>
              <div className='mini-block'>
                <div>오늘의 금융 퀴즈</div>
                <div className='inblock-icon'><Image src='/images/books.png' alt="퀴즈" width={40} height={40} /></div>
              </div>
              <div className='mini-block'>
                <div>친구들과 토론하기</div>
                <div className='inblock-icon'><Image src='/images/speech_bubble.png' alt="토론" width={40} height={40} /></div>
              </div>
            </div>
          </div>
          <div className='other-service-block'>
            <div>이런 서비스도 있어요</div>
            <div>
              <ul>
                <li><p><Image src='/images/icon/money-fly.png' alt="돈다발" width={50} height={50} /></p><p>해외 주식<br/>공부하기</p></li>
                <li><p><Image src='/images/icon/down-chart.png' alt="하향차트" width={50} height={50} /></p><p>실제 경제뉴스<br/>보러가기</p></li>
                <li><p><Image src='/images/linkTo/bulb.png' alt="전구" width={35} height={50} /></p><p>증권 상품<br/>구경하기</p></li>
                <li><p><Image src='/images/icon/medal.png' alt="메달" width={50} height={50} /></p><p>상위 10%의<br/>비결</p></li>
              </ul>
            </div>
          </div>
        </main>

        {/* 하단 배너 */}
        <div className="test-custom-1">마이페이지</div>
        <div className="section-position">
          <section className="section-custom">
            <FooterBlock 
              title="게임을 플레이하면"
              subtitle="결과에 따른 분석 리포트를 보여드려요!"
              announcement="분석 리포트로 투자 추가 공부하기"
              iconSrc="/images/detective.png"
              iconAlt="탐정"
            />
          </section>
          <section className="section-custom">
            <FooterBlock_v2
              title="캐릭터 키우는"
              subtitle="포인트 모으기 꿀팁"
              announcement="포인트 모아서 귀여운 나만의 캐릭터 성장시키기"
              iconSrc="/images/icon/jar-of-honey.png"
              iconAlt="꿀단지"
            />
          </section>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

