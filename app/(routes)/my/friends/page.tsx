'use client';

import Find from "@/app/components/friends/find";
import Friends from "@/app/components/friends/friends";
import Requests from "@/app/components/friends/requests";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react"

export default function MyFriends(){
  const [tab, setTab] = useState<string>("friends");

  const onClickFriends = () => {
    setTab("friends");
  };
  const onClickRequests = () => {
    setTab("requests");
  };

  return (
    <div>
      <p>MyFriends</p>

      <p>TAB1: Friends component</p>
      <p>1. 친구 목록</p>
      <p>2. 친구 삭제 버튼</p>
      <p>3. 친구 프로필 보기</p>

      <p>TAB2: Requests Component</p>
      <p>1. 유저 이름(id)로 검색하기</p>
      <p>2. 친구 요청하기</p>
      <p>3. 유저 프로필 보기</p>
      <p>4. 임의 유저 친구 추천</p>

      <div className="border border-black">
        <Find/>
        <div className="flex flex-row space-x-2">
          <button className="border border-black" onClick={onClickFriends} title="">친구 목록</button>
          <button className="border border-black" onClick={onClickRequests} title="">받은 요청</button>
          <Link href="/find">
            <div className="w-8 h-6 bg-black rounded-lg flex justify-center items-center">
              <Image width={20} height={20} src="/images/findUser/ic-search.png" alt="유저 검색" />
            </div>
          </Link>
        </div>
        {tab === "friends" && <Friends/> }
        {tab === "requests" && <Requests/> }
      </div>
    </div>
  )
}