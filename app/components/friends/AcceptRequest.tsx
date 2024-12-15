import { logout } from "@/app/utils/logout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";

type username = {
  id: string;
  nickname: string;
  status: string;
}

interface Props{
  found: username;
}

const AcceptRequest = ({found}:Props) => {
  const BACKEND_USER_URL = process.env.NEXT_PUBLIC_BACKEND_USER_URL;
  const base_url = `${BACKEND_USER_URL}`;
  
  const router = useRouter();
  
  const header = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
    }
  };

  const deleteFriend = (e:BaseSyntheticEvent) => {
    e.preventDefault();
  }
  const acceptFriend = (e:BaseSyntheticEvent) => {
    e.preventDefault();
  }
  const declineFriend = (e:BaseSyntheticEvent) => {
    e.preventDefault();
  }
  const requestFriend = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    axios.post(`${base_url}/friends`,{
      friendId: found.id
    },header)
      .then(response => {
        // 요청 성공했다면 "신청중"으로 버튼 변경
        e.target.innerText = "요청 중"
        window.location.reload()
      }).catch(error=>{
        if(error.status === 401){
          logout();
          router.push("/signin?back=true");
        }
        else{
          console.error(error);
        }
      })
  }

  return (
    <div>
      {/*
        YOU: 본인
        FRIEND: 친구관계
        REQUEST: 상대로부터 친구요청이 존재
        NOTYET: 친구요청 없음
       */}
      <p>친구 상태: {found.status}</p>
      { found.status === "YOU" && <div>
        <p>본인 계정입니다.</p>
      </div> }
      { found.status === "FRIEND" && <div>
        친구 삭제
      </div> }
      {/* 추후 친구 차단 기능 추가 */}
      { found.status === "REQUEST" && <div>
        친구 수락 친구 거절
      </div> }
      { found.status === "NOTYET" && <div>
        <button onClick={requestFriend}>친구 신청</button>
      </div> }
    </div>
  )
}

export default AcceptRequest;