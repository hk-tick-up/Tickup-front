/* eslint-disable @typescript-eslint/no-unused-vars */
import { logout } from "@/app/utils/logout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

type friend = {
  id: string;
  nickname: string;
}

// 보낸 요청들
const Sends = () => {
  const BACKEND_USER_URL = process.env.NEXT_PUBLIC_BACKEND_USER_URL;

  const base_url = `${BACKEND_USER_URL}`;
  const [friends, setFriends] = useState<Array<friend>>([]);
  const router = useRouter();

  useEffect(()=>{
    getSentRequests();
  },[]);

  const getSentRequests = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
      }
    };
    axios.get(`${base_url}/friend-requests?send=true`,header)
    .then(response => {
      setFriends(response.data);
    }).catch(error=>{
      console.error(error);
    })
  }

  const deleteRequest = (e:BaseSyntheticEvent, targetId:string) => {
    e.preventDefault();

    console.log(`try to delete request to ${targetId}`);

    const header = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
      }
    };
    axios.delete(`${base_url}/friend-requests/${targetId}`, header)
    .then(response => {
      console.log(response.data);

      e.target.innerText = "취소 완료";
      e.target.disabled = true;
    }).catch(error=>{
      console.error(error);
    })
  }
  
  return (
    <div title="내 요청 목록">
      <p>내 요청 목록</p>
      { friends.length > 0 &&
        friends.map((value, index)=>
        <div className="flex flex-row justify-between" key={index}>
          <p>친구 닉네임: {value.nickname}</p>
          <button onClick={e => deleteRequest(e, value.id)}>취소버튼</button>
        </div>
      )}
    </div>
  )
}

export default Sends;