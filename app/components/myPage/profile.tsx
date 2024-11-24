import LinkTo from "../linkTo/linkTo";
import LinkToBracket from "../linkTo/linkToBracket";

export default function Profile(){
  const tempProfileImage = "/images/linkTo/ghost.png";

  return (
    <div className="py-5 w-full">
      <p className="py-3 text-center">님 환영합니다!</p>
      <p className="text-center"><span className="py-3 text-[#666666]">누적포인트</span> <span className="text-[#286DB1]">p</span></p>
      <div className="rounded-[100px] w-[200px] h-[200px] my-5">
        {/* 프로필 이미지가 전부 회색 영역까지 포함할 것 인가? 가운데 이미지만 남길 것 인가? */}
        <img src={tempProfileImage} alt="profile picture"/>
      </div>
      <div className="flex flex-row my-5 space-x-8">
        <LinkTo href="/" innerContents={<>
          <div className="w-full h-[120px] flex flex-col items-center justify-center">
            <img className="w-20 h-14 mb-5" src="/images/linkTo/game.png" alt="icon"/>
            <p className="font-bold">게임 전적 확인하기</p>
          </div>
        </>}/>
        <LinkTo href="/" innerContents={<>
          <div className="w-full h-[120px] flex flex-col items-center justify-center">
            <img className="w-15 h-15 mb-5" src="/images/linkTo/friend.png" alt="icon"/>
            <p className="font-bold">친구 목록 관리하기</p>
          </div>
        </>}/>
      </div>
      <LinkToBracket href="/" innerContents={<>
        <p className="font-bold">
          게임을 플레이하면<br/>결과에 따른 분석 리포트를 보여드려요!<br/>
          <span className="text-[#666666] text-sm">분석 리포트로 투자 추가 공부하기</span>
          <img className="inline pl-1" src="/images/linkTo/personResearch.png" alt="icon"/>
        </p>
      </>}/>
      <div className="h-[100px]"></div>
    </div>
  )
}