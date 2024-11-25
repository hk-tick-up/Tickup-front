'use client';

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";

export default function SignIn(){
  const router = useRouter();

  const onSignIn = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    
    const formElement = e.target.closest('form');
    const data = {
      "id": formElement.userId.value,
      "password": formElement.password.value
    };

    axios.post("http://localhost:8000/api/v1/users/sign-in", data, {
      headers: {
          "Content-Type": "application/json",
      },
      withCredentials: true
    })
    .then(response => {
      console.log(response.data);
      sessionStorage.setItem("bearer", response.data);
      // 로그인 성공
      alert("로그인 성공했습니다.");
      
      // 세션에 id, nickname 저장: 다시 axios, id nickname 불러와 세션스토리지에 저장하기
      axios.get("http://localhost:8000/api/v1/users/self", {
        headers: {
          "Authorization": `Bearer ${response.data}`
        }
      })
      .then(res => {
        console.log(res.data);
        sessionStorage.setItem("id", res.data.id);
        sessionStorage.setItem("nickname", res.data.nickname);
      })
      .catch(error => {
        console.error(error);
      });
      // 리다이렉트
      router.push("/my");
    })
    .catch(error => {
      console.error(error);
      // 로그인 실패
      alert("로그인 정보가 없습니다.");
    });
  };
  return (
    <div className="flex flex-col items-center">
      <div className="border border-black p-2 w-2/3 max-w-xl min-w-xs">
        <form onSubmit={onSignIn} className="space-y-2 w-full">
          <div className="flex flex-row justify-center w-full px-2">
            <label htmlFor="userId" className="inline-block w-20 text-right pr-2">ID</label>
            <input id="userId" type="text" placeholder=" user id" className="border border-black w-full max-w-52" required/>
          </div>
          <div className="flex flex-row justify-center w-full px-2">
            <label htmlFor="password" className="inline-block w-20 text-right pr-2">password</label>
            <input id="password" type="password" placeholder=" password" className="border border-black w-full max-w-52" required/>
          </div>
          <div className="flex flex-row space-x-4 justify-center">
            <Link href="/signup" className="bg-[#EEF2F5] rounded-[15px] px-[15px] py-[10px]">회원가입</Link>
            <button type="submit" title="로그인" value="로그인" className="bg-[#EEF2F5] rounded-[15px] px-[15px] py-[10px]">로그인</button>
          </div>
        </form>
      </div>
    </div>
  )
}