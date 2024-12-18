/* eslint-disable @typescript-eslint/no-unused-vars */
import { logout } from "@/app/utils/logout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type friend = {
  id: string;
  nickname: string;
}

// 친구 목록
const Friends = () => {
  const BACKEND_USER_URL = process.env.NEXT_PUBLIC_BACKEND_USER_URL;

  const base_url = `${BACKEND_USER_URL}`;
  const [friends, setFriends] = useState<Array<friend>>([]);
  const router = useRouter();
  
  useEffect(()=>{
    const header = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
      }
    };
    axios.get(`${base_url}/friends`,header)
    .then(response => {
      setFriends(response.data);
    }).catch(error=>{
      console.error(error);
    })
  },[]);

  return (
    <div title="친구 목록">
      { friends.length > 0 ?
        friends.map((value, index)=>
        <div key={index}>친구 닉네임: {value.nickname}</div>
      ):<p>친구 요청을 보내 보세요</p>}
    </div>
  )
}

export default Friends;