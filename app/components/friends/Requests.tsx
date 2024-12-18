/* eslint-disable @typescript-eslint/no-unused-vars */
import { logout } from "@/app/utils/logout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

type friend = {
  id: string;
  nickname: string;
}

// 받은 요청들
const Requests = () => {
  const BACKEND_USER_URL = process.env.NEXT_PUBLIC_BACKEND_USER_URL;

  const base_url = `${BACKEND_USER_URL}`;
  const [friends, setFriends] = useState<Array<friend>>([]);
  const router = useRouter();
  
  useEffect(()=>{
    getReceivedRequests();
  },[]);

  const getReceivedRequests = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
      }
    };
    axios.get(`${base_url}/friend-requests`,header)
    .then(response => {
      console.log(response.data)
      setFriends(response.data);
    }).catch(error=>{
      console.error(error);
    })
  }
  
    const acceptRequest = (e:BaseSyntheticEvent, targetId:string) => {
      e.preventDefault();
  
      console.log(`try to accept request to ${targetId}`);
  
      const header = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
        }
      };
      // axios 명령어, 링크 변경
      const requestBody = {
        friendId : targetId
      };
      axios.post(`${base_url}/friend-requests`, requestBody, header)
      .then(response => {
        console.log(response.data);
  
        e.target.innerText = "내 친구";
        e.target.disabled = true;
        window.location.reload();
      }).catch(error=>{
        console.error(error);
      })
    }
    
    const declineRequest = (e:BaseSyntheticEvent, targetId:string) => {
      e.preventDefault();
  
      console.log(`try to delete request to ${targetId}`);
  
      const header = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
        }
      };
      // axios 명령어, 링크 변경
      axios.delete(`${base_url}/friend-requests/${targetId}`, header)
      .then(response => {
        console.log(response.data);
        e.target.innerText = "요청 거절";
        e.target.disabled = true;
      }).catch(error=>{
        console.error(error);
      })
    }

  return (
    <div title="받은 요청 목록">
      <p>받은 요청 목록</p>
      { friends.length > 0 &&
        friends.map((value, index)=>
          <div className="flex flex-row justify-between" key={index}>
            <p>친구 닉네임: {value.nickname}</p>
            <div className="flex flex-row gap-x-1">
              <button onClick={e => acceptRequest(e, value.id)}>승낙버튼</button>
              <button onClick={e => declineRequest(e, value.id)}>거절버튼</button>
            </div>
          </div>
      )}
    </div>
  )
}

export default Requests;