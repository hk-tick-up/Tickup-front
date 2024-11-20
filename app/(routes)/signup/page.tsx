'use client';

import axios from "axios"
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";

export default function SignUp(){
  const router = useRouter();

  const onSignUp = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    
    const formElement = e.target.closest('form');
    const data = {
      id: formElement.userId.value,
      nickname: formElement.nickname.value,
      password: formElement.password.value,
      age: parseInt(formElement.age.value),
      gender: formElement.gender.value,
      job: formElement.job.value
    };
    console.log(data);

    axios.post("http://localhost:8000/api/v1/users/sign-up", data)
    .then(response => {
      console.log(response.data);
      // Info: Account Created at 2024-11-20T11:21:39.368112

      alert("계정이 생성되었습니다.\n로그인 해주세요.");

      // 로그인 화면으로 리다이렉트
      router.push('/signin');  // 페이지 이동
    })
    .catch(error => {
      console.error(error);
      // Error: Duplicated User ID
      // Error: Duplicated Nickname
    });
  }
  return (
    <div className="flex flex-col items-center">
      <div className="border border-black p-2 w-1/2 max-w-96">
        <form onSubmit={onSignUp} className="flex flex-col items-center space-y-2">
          <div>
            <label htmlFor="userId" className="inline-block w-20 text-right">ID</label>
            <input id="userId" type="text" placeholder=" user id" className="border border-black ml-2 w-52" required/>
          </div>
          <div>
            <label htmlFor="password" className="inline-block w-20 text-right">password</label>
            <input id="password" type="password" placeholder=" password" className="border border-black ml-2 w-52" required/>
          </div>
          <div>
            <label htmlFor="nickname" className="inline-block w-20 text-right">nickname</label>
            <input id="nickname" type="text" placeholder=" nickname" className="border border-black ml-2 w-52" required/>
          </div>
          <div>
            <label htmlFor="age" className="inline-block w-20 text-right">age</label>
            <input id="age" type="number" defaultValue={0} className="border border-black ml-2 w-52" max={200} min={0} required/>
          </div>
          <div>
            <label htmlFor="gender" className="inline-block w-20 text-right">gender</label>
            <select id="gender" className="border border-black ml-2 w-52" defaultValue="" required>
              <option value="" disabled>성별</option>
              <option value="MALE">남자</option>
              <option value="FEMALE">여자</option>
            </select>
          </div>
          <div>
            <label htmlFor="job" className="inline-block w-20 text-right">job</label>
            <input id="job" type="text" placeholder=" job" className="border border-black ml-2 w-52" required/>
          </div>
          <button type="submit" title="회원가입" value="회원가입" className="border border-black m-2 p-2">회원가입</button>
        </form>
      </div>
    </div>
  )
}