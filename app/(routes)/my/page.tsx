'use client';

// import BottomNav from "@/app/components/bottomNav";
import LinkTo from "@/app/components/linkTo/linkTo";
import GameRules from "@/app/components/myPage/gameRule";
import Profile from "@/app/components/myPage/profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import '../../css/User/MyPage.css';

export default function My () {
  const router = useRouter();

  useEffect(()=>{
    if(!sessionStorage.getItem("id"))
      router.push("/signin");
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
        <div className="font-custom-1 ">마이 페이지</div>
        <div className="my-page-box-1 "> 
          <div className="content-position-1">
            <div className="content-position-2">
              <p>전구</p><p>게임 규칙 설명서</p>
            </div>
            <div>
              화살표
            </div>
          </div>
        </div>
          <div>
            <div className="main-contetn-position-1">
              <div className="content-position-3">
                <div className="font-custom-2">김한토 님 환영합니다!</div>
                <div>로그아웃</div>
              </div>
              <div>누적 포인트 20P</div>
              <div className="profile-img-position">프로필 이미지</div>
            </div>
            <section>
              <div className="section-btn">게임 전적 확인하기</div>
              <div className="section-btn">친구 목록 관리하기</div>
            </section>
            <div>레포트</div>
          </div>
      </div>
      <div> 네비게이션 바</div>
    </>
  );
}