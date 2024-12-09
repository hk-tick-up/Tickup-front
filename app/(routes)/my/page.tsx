'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";
import '../../css/User/my-page.css';
import '../../css/main.css'
import FooterBlock from '../../components/FooterBlock'
import BottomNav from '../../components/BottomNav'
import { LogOut } from 'lucide-react';

export default function My () {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>("");

  useEffect(()=>{
    if(!sessionStorage.getItem("id"))
      router.push("/signin");
    setNickname(sessionStorage.getItem("nickname"));

  },[]);
  
  return (
    // <div className="px-5 w-full">
    //   <p className="text-lg font-bold py-5">마이 페이지</p>
    //   <GameRules/> {/* 게임 규칙 설명서 */}
    //   <Profile/> {/* 환영 인사, 누적 포인트, 대표 이미지 */}
    //     {/* 게임 전적 확인 */}
    //     {/* 친구 목록 관리 */}
    //     {/* 게임 분석 리포트 모아보기 */}

    //   <div className="flex flex-col space-y-2">
    //     <LinkTo href="/my/info" innerContents={<p>내 정보 수정하기</p>} />
    //     <LinkTo href="/my/friends" innerContents={<p>친구 목록 보기</p>} />
    //     {/* <LinkTo href="/my/etc" innerContents={<p>기타 기능</p>}/> */} {/* 기타 기능들.. */}
    //   </div>

    //   <div className="my-4">
    //     <LinkTo href="/signout" innerContents={<p>로그아웃</p>} />
    //   </div>

    //   <BottomNav page="my"/>
    //   <div className="h-[110px]"></div> {/* 하단바 고려 */}
    // </div>
    <>
      <div className="my-page-root">
        <div className="content-position-1" >
          <div className="font-custom-1 ">마이 페이지</div>
          <div className=""><Link href="/signout"><p className="logout-custom mr-2">로그아웃<LogOut className="w-4 pb-1"/></p></Link></div>
        </div>
        <div className="my-page-box-1 "> 
          <div className="content-position-1 items-center">
            <div className="content-position-2">
              <p className="icon-position-2"><Image src='/images/link-to/bulb.png' alt="전구" width={11} height={11} /></p>
              <p>게임 규칙 설명서</p>
            </div>
            <div className="icon-position-1">
              <Image src='/images/icon/right-arrow.png' alt="화살표" width={11} height={11} />
            </div>
          </div>
        </div>
          <div>
            <div className="content-position-3">
              <div>
                <div className="font-custom-2">{nickname} 님 환영합니다!</div>
              </div>
              <div>누적 포인트 <span className="point-font-custom">20P</span></div>
              <div className="profile-img-position"><Image src='/images/link-to/ghost.png' alt="유령" width={200} height={200} /></div>
            </div>
            <section>
              <div className="section-btn">
                <div> <Image src='/images/link-to/game.png' alt="게임기" width={70} height={70} /></div>
                <div className="mt-2">
                  게임 전적 확인하기
                </div>
              </div>
              <div className="section-btn">
                <div><Image src='/images/link-to/friend.png' alt="그룹" width={60} height={60} /></div>
                <div> 친구 목록 관리하기</div>
              </div>
            </section>
            <footer className="footer-custom">
              <FooterBlock 
                title="게임을 플레이하면"
                subtitle="결과에 따른 분석 리포트를 보여드려요!"
                announcement="분석 리포트로 투자 추가 공부하기"
                iconSrc="/images/detective.png"
                iconAlt="탐정"
              />
          </footer>
          </div>
      </div>
      <div> 
        <BottomNav />
      </div>
    </>
  );
}