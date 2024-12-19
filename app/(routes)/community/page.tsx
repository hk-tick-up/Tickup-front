/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import BottomBlank from "@/app/components/BottomBlank";
import BottomNav from "@/app/components/BottomNav";
import Find from "@/app/components/friends/Find";
import Friends from "@/app/components/friends/Friends";
import Requests from "@/app/components/friends/Requests";
import Sends from "@/app/components/friends/Sends";
// import Find from "@/app/components/friends/find";
// import Friends from "@/app/components/friends/friends";
// import Requests from "@/app/components/friends/requests";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function MyFriends(){
  const [tab, setTab] = useState<string>("friends");
  const router = useRouter();

    useEffect(()=>{
      if(!sessionStorage.getItem("id"))
        router.push("/signin");
    },[]);

  const onClickFriends = () => {
    setTab("friends");
  };
  const onClickRequests = () => {
    setTab("requests");
  };

  return (
    <div>
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
      <BottomBlank/>
      <BottomNav/>
    </div>
  )
}