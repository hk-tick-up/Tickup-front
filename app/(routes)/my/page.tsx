import BottomNav from "@/app/components/bottomNav";
import GameRules from "@/app/components/myPage/gameRule";
import Profile from "@/app/components/myPage/profile";

export default function My () {
  return (
    <div className="px-5 w-full">
      <p className="text-lg font-bold py-5">마이 페이지</p>
      <div className="flex flex-col items-center">
        <GameRules/> {/* 게임 규칙 설명서 */}
        <Profile/> {/* 환영 인사, 누적 포인트, 대표 이미지 */}
        {/* 게임 전적 확인 */}
        {/* 친구 목록 관리 */}
        {/* 게임 분석 리포트 모아보기 */}

        {/* 내 정보 수정 */}
        {/* 친구 보기? */}
        {/* 기타 기능들.. */}
        <BottomNav page="my"/>
      </div>
    </div>
  );
}