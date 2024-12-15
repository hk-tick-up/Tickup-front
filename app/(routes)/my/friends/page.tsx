'use client';

import Find from "@/app/components/friends/Find";
import Friends from "@/app/components/friends/Friends";
import Requests from "@/app/components/friends/Requests";
import Sends from "@/app/components/friends/Sends";
// import Find from "@/app/components/friends/find";
// import Friends from "@/app/components/friends/friends";
// import Requests from "@/app/components/friends/requests";
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

      <p>기능1: 친구 목록</p>
      <p>1. 친구 목록</p>
      <p>2. 친구 삭제 버튼</p>
      <p>3. 친구 프로필 보기</p>

      <p>기능2: 유저 검색 및 친구 요청</p>
      <p>1. 유저 이름(id)로 검색하기</p>
      <p>2. 친구 요청하기</p>
      <p>3. 유저 프로필 보기</p>
      <p>4. 임의 유저 친구 추천</p>

      <div className="border border-black">
        <Find/>
        {/* <div className="flex flex-row space-x-2">
          <button className="border border-black" onClick={onClickFriends} title="">친구 목록</button>
          <button className="border border-black" onClick={onClickRequests} title="">받은 요청</button>
        </div>
        {tab === "friends" && <Friends/> }
        {tab === "requests" && <Requests/> } */}
        <Sends/> {/* 보낸 요청 */}
        <Requests/> {/* 받은 요청 */}
        <Friends/> {/* 친구 관계 */}
      </div>
    </div>
  )
}