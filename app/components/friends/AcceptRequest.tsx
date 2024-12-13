type username = {
  id: string;
  nickname: string;
  status: string;
}

interface Props{
  found: username;
}

const AcceptRequest = ({found}:Props) => {
  return (
    <div>
      {/*
        YOU: 본인
        FRIEND: 친구관계
        REQUEST: 상대로부터 친구요청이 존재
        NOTYET: 친구요청 없음
       */}
      <p>친구 상태: {found.status}</p>
      { found.status === "YOU" && <div></div> }
      { found.status === "FRIEND" && <div></div> }
      { found.status === "REQUEST" && <div></div> }
      { found.status === "NOTYET" && <div></div> }
    </div>
  )
}

export default AcceptRequest;