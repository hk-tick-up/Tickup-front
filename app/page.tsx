import Link from 'next/link'
import Image from 'next/image'
import BottomNav from './components/bottomNav'

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
              <div><Image src='/images/icon/money.png' alt="포인트" width={20} height={20} className='money-icon-position' /></div>
              <div>Point</div>
            </div>
          </div>
        </header>
        <section className='py-5'>Banner?</section>

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
        <footer>
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
        </footer>
      </div>
      <BottomNav />
    </>
  )
}

