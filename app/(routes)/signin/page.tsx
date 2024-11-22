'use client';

import axios from "axios";
import { BaseSyntheticEvent } from "react";

export default function SignIn(){
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
      // 리다이렉트(어디로?)
    })
    .catch(error => {
      console.error(error);
      // 로그인 실패, 새로고침?
    });
  };
  return (
    <div className="flex flex-col items-center">
      <div className="border border-black p-2 w-2/3 max-w-xl min-w-xs">
        <form onSubmit={onSignIn} className="flex flex-col items-center space-y-2 w-full">
          <div className="w-full px-2">
            <label htmlFor="userId" className="inline-block w-20 text-right pr-2">ID</label>
            <input id="userId" type="text" placeholder=" user id" className="border border-black w-full max-w-52" required/>
          </div>
          <div className="w-full px-2">
            <label htmlFor="password" className="inline-block w-20 text-right pr-2">password</label>
            <input id="password" type="password" placeholder=" password" className="border border-black w-full max-w-52" required/>
          </div>
          <button type="submit" title="로그인" value="로그인" className="border border-black m-2 p-2">로그인</button>
        </form>
      </div>
    </div>
  )
}