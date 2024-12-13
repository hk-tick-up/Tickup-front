import { useState } from "react";

type friend = {
  id: string;
  nickname: string;
}

const Sends = () => {
  // 보낸 요청들
  // 백엔드에 엔드포인트 추가하거나 수정해야
  // GET /friend-requests에 쿼리 붙여서 보낸/받은 요청 구분
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

export default Sends;