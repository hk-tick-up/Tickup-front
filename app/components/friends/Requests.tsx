import { useState } from "react";

type friend = {
  id: string;
  nickname: string;
}

const Requests = () => {
  // 받은 요청들
  const [friends, setFriends] = useState<Array<friend>>([]);
  return (
    <div title="친구 목록">
      { friends.length > 0 ?
        friends.map((value, index)=>
        <div key={index}>친구 닉네임: {value.nickname}</div>
      ):<p>친구 요청을 보내 보세요</p>}
    </div>
  )
}

export default Requests;