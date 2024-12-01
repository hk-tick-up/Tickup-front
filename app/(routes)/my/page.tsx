'use client';

import BottomNav from "@/app/components/bottomNav";
import LinkTo from "@/app/components/linkTo/linkTo";
import GameRules from "@/app/components/myPage/gameRule";
import Profile from "@/app/components/myPage/profile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function My () {
  const router = useRouter();
  const [loginChecked, setLoginChecked] = useState<boolean>(false);

  useEffect(()=>{
    if(!sessionStorage.getItem("id"))
      router.push("/signin");
    setLoginChecked(true);
  },[router]);
  
  return (
    <div className="px-5 w-full">
      {loginChecked && 
        <>
          <p className="text-lg font-bold py-5">마이 페이지</p>
          <GameRules/> {/* 게임 규칙 설명서 */}
          <Profile/> {/* 환영 인사, 누적 포인트, 대표 이미지 */}
            {/* 게임 전적 확인 */}
            {/* 친구 목록 관리 */}
            {/* 게임 분석 리포트 모아보기 */}

          <div className="flex flex-col space-y-2">
            <LinkTo href="/my/info" innerContents={<p>내 정보 수정하기</p>} />
            <LinkTo href="/my/friends" innerContents={<p>친구 목록 보기</p>} />
            {/* <LinkTo href="/my/etc" innerContents={<p>기타 기능</p>}/> */} {/* 기타 기능들.. */}
          </div>

          <div className="my-4">
            <LinkTo href="/signout" innerContents={<p>로그아웃</p>} />
          </div>

          <BottomNav/>
          <div className="h-[110px]"></div> {/* 하단바 고려 */}
        </>
      }
    </div>
  );
}