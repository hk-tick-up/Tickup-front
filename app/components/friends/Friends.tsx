import { logout } from "@/app/utils/logout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type friend = {
  id: string;
  nickname: string;
}

const Friends = () => {
  // const base_url = "http://localhost:8005/api/v1/users"
  const base_url = "http://back-service:8005/api/v1/users"
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
      if(error.status === 401){
        logout();
        router.push("/signin?back=true");
      }
      else{
        console.error(error);
      }
    })
  },[]);

  return (
    <div>
      <div title="친구 목록">
        { friends.length > 0 ?
          friends.map((value, index)=>
          <div key={index}>친구 닉네임: {value.nickname}</div>
        ):<p>친구 요청을 보내 보세요</p>}
      </div>
    </div>
  )
}

export default Friends;