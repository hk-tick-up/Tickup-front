'use client';
import axios from "axios";
import { BaseSyntheticEvent, KeyboardEvent, useEffect, useState } from 'react';
import AcceptRequest from "./AcceptRequest";

type username = {
  id: string;
  nickname: string;
  status: string;
}

const Find = () => {
  const BACKEND_USER_URL = process.env.NEXT_PUBLIC_BACKEND_USER_URL;

  const [userToFind, setUserToFind] = useState<string>("");
  const [found, setFound] = useState<username>();
  const [currentAccount, setCurrentAccount] = useState<string|null>("");
  
  const base_url = `${BACKEND_USER_URL}`;

  useEffect(()=>{
    setCurrentAccount(sessionStorage.getItem("id"));
  }, []);

  const setKeyword = (e:BaseSyntheticEvent) => {
    setUserToFind(e.target.value);
  }

  const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 여기서 버튼 클릭 함수를 호출
      findUser();
    }
  }

  const findUser = () => {
    axios.get(`${base_url}/username?user=${userToFind}`, {
      headers:{
        Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
      }
    }).then(response => {
      console.log(response.data);
      setFound(response.data)
    })
  }
  
  return (
    <div>
      <input className="border border-black" onChange={setKeyword} onKeyDown={handleKeyDown} type="text" placeholder="사용자 이름" title=""></input>
      <button className="border border-black" type="submit" onClick={findUser} title="검색">찾기</button>
      {
        found &&
        <div>
          <p>이 유저를 찾으셨나요?</p>
          <div className="flex flex-row justify-between">
            <p>닉네임(아이디): {found.nickname}<sub>{found.id}</sub></p>
            {/* 프로필사진? */}
            {/* 친구 신청 버튼 */}
              {/* 친구 여부에 따라 버튼 달라져야 */}
            <AcceptRequest found={found}/>
          </div>
        </div>
      }
      <p>현재 접속 중인 계정: {currentAccount}</p>
    </div>
  )
}

export default Find;