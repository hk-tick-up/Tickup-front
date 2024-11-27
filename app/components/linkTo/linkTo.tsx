import Link from "next/link";
import { ReactNode } from "react";

export default function LinkTo({href, innerContents}:{href:string, innerContents:ReactNode}){
  return (
    <Link href={href} className="w-full">
      <div className="bg-[#EEF2F5] rounded-[15px] px-[15px] py-[10px]">
        {innerContents}
      </div>
    </Link>
  )
}

// 사용 예시
/*
  <LinkTo href="/" innerContents={
    <div className="flex">
      <img src="" alt="icon"className="w-2 h-3"/>
      <p>게임 규칙 설명서</p>
    </div>
  }/>
*/