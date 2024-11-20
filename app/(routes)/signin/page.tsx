'use client';

import axios from "axios";
import { BaseSyntheticEvent } from "react";

export default function SignIn(){
  const onSignIn = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    
    const formElement = e.target.closest('form');
    const data = new URLSearchParams();
    data.append("username", formElement.userId.value);
    data.append("password", formElement.password.value);
    console.log(data);

    axios.post("http://localhost:8000/api/v1/users/sign-in", data, {
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true
    })
    .then(response => {
      console.log(response.data);
      // 로그인 성공, 
    })
    .catch(error => {
      console.error(error);
      // 로그인 실패, 새로고침
    });
  };
  return (
    <div className="flex flex-col items-center">
      <div className="border border-black p-2 w-1/2 max-w-96">
        <form onSubmit={onSignIn} className="flex flex-col items-center space-y-2">
          <div>
            <label htmlFor="userId" className="inline-block w-20 text-right">ID</label>
            <input id="userId" type="text" placeholder=" user id" className="border border-black ml-2 w-52" required/>
          </div>
          <div>
            <label htmlFor="password" className="inline-block w-20 text-right">password</label>
            <input id="password" type="password" placeholder=" password" className="border border-black ml-2 w-52" required/>
          </div>
          <button type="submit" title="로그인" value="로그인" className="border border-black m-2 p-2">로그인</button>
        </form>
      </div>
    </div>
  )
}