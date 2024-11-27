

import Link from 'next/link'
import BottomNav from './components/BottomNav'

export default function HomePage() {
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
              김한토님 반가워요
            </div>
            <div className='flex'>
              <div><img src='/images/icon/money.png' className='money-icon-position' /></div>
              <div>Point</div>
            </div>
          </div>
        </header>
        <section className='py-5'> Banner?</section>

        {/* 메인 카드 섹션 */}
        <main>
          <div className='flex py-5 gap-5 items-center'> 
            <Link href ="/game">
              <div className='main-block main-game-btn'>
                <div className='cutom-title'>
                  <p>모의투자</p>
                  <p>게임하기</p>
                </div>
                <div>
                  <img src='/images/group_1.png' />
                </div>
              </div>
            </Link>
            <div className='side-block'>
              <div className='mini-block'>
                <div>오늘의 금융 퀴즈</div>
                <div className='inblock-icon'><img src='/images/books.png' /></div>
              </div>
              <div className='mini-block'>
                <div>친구들과 토론하기</div>
                <div className='inblock-icon'><img src='/images/speech_bubble.png' /></div>
              </div>
            </div>
          </div>
          <div className='other-service-block'>
            <div>이런 서비스도 있어요</div>
            <div className='blank1'></div>
          </div>
        </main>

        {/* 하단 배너 */}
        <footer>
          <div className='footer-block-big'>
            <div>
              <p>게임을 플레이하면</p>
              <p>결과에 따른 분석 리포트를 보여드려요!</p>
            </div>
            <div className='flex'>
              <p className='footer-announce'>분석 리포트로 투자 추가 공부하기</p>
              <p><img src='/images/detective.png' className='footer-icon-detective'/></p>
            </div>
          </div>
          <div> <img src='/images/icon/right-arrow.png'className="footer-icon-arrow " /> </div>
          
        </footer>
        {/* <Link href="/analysis" className="block">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold mb-2">게임을 플레이하면</p>
                <p className="font-semibold">결과에 따라 분석 리포트를 보여드려요!</p>
                <div className="text-sm text-gray-500 mt-2">
                  분석 리포트로 투자 추가 공부하기 👨‍🎓
                </div>
              </div>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link> */}
      </div>
      <BottomNav />
    </>
  )
}

