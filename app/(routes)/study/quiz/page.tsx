import GoBackTo from "@/app/components/common/back";
import Link from "next/link";

export default function SelectQuizLevel() {
  const LINKDESIGN = "border border-black pl-4";
  return (
    <div className="p-2 h-28 flex flex-col space-y-2">
      <p>(퀴즈 레벨 선택)</p>
      <GoBackTo link="/somewhere"/>
      <p>금융 지식 퀴즈</p>

      <div className={""+LINKDESIGN}>
        <Link href="/">
          <img alt="icon"/>
          <p>금융과 관련된 지식을 처음 접해보는 당신!</p>
          <p>왕초보 퀴즈에 도전하세요!</p>
          <img alt="arrow icon"/>
        </Link>
      </div>

      <div className={""+LINKDESIGN}>
        <Link href="/">
          <img alt="icon"/>
          <p>왕초보를 벗어나고 싶은 당신!</p>
          <p>Easy 퀴즈에 도전하세요!</p>
          <img alt="arrow icon"/>
        </Link>
      </div>

      <div className={""+LINKDESIGN}>
        <Link href="/">
          <img alt="icon"/>
          <p>투자 공부를 하며 자신감이 생긴 당신!</p>
          <p>Normal 퀴즈에 도전하세요!</p>
          <img alt="arrow icon"/>
        </Link>
      </div>

      <div className={""+LINKDESIGN}>
        <Link href="/">
          <img alt="icon"/>
          <p>어쩌구저쩌구 하고 싶은 당신!</p>
          <p>Hard 퀴즈에 도전하세요!</p>
          <img alt="arrow icon"/>
        </Link>
      </div>

      <div className={""+LINKDESIGN}>
        <Link href="/">
          <img alt="icon"/>
          <p>이제는 실제 투자에 도전해보고 싶은 당신!</p>
          <p>최고난도 퀴즈에 도전하세요!</p>
          <img alt="arrow icon"/>
        </Link>
      </div>
      
      <div className={""+LINKDESIGN}>
        <Link href="/">
          <img alt="icon"/>
          <p>퀴즈를 맞추면 포인트를 얻을 수 있어요!</p>
          <p>내가 모은 포인트를 확인해봐요!</p>
          <img alt="arrow icon"/>
        </Link>
      </div>
    </div>
  );
}