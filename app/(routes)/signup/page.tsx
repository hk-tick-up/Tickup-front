'use client';

import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";

export default function SignUp(){
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [isIdDuplicated, setIsIdDuplicated] = useState<boolean|undefined>(undefined);
  const [isNicknameDuplicated, setIsNicknameDuplicated] = useState<boolean|undefined>(undefined);

  const onSignUp = (e:BaseSyntheticEvent) => {
    e.preventDefault();

    if(isIdDuplicated === undefined){
      alert("Please check if your ID is duplicated or not.");
      return;
    }else if(isIdDuplicated){
      alert("Please chnage your ID. Then check duplicated.");
      return;
    }
    if(isNicknameDuplicated === undefined){
      alert("Please check if your nickname is duplicated or not.");
      return;
    }else if(isNicknameDuplicated){
      alert("Please chnage your nickname. Then check duplicated.");
      return;
    }
    if(password !== passwordCheck){
      alert("Please Check Password and Password Check");
      return;
    }
    
    const formElement = e.target.closest('form');
    const data = {
      id: formElement.userId.value,
      nickname: formElement.nickname.value,
      password: formElement.password.value,
      birthday: formElement.birthday.value,
      gender: formElement.gender.value,
      job: formElement.job.value
    };
    console.log(data);

    axios.post("http://localhost:8005/api/v1/users/sign-up", data)
    .then(response => {
      console.log(response.data);
      // Info: Account Created at 2024-11-20T11:21:39.368112

      alert("계정이 생성되었습니다.\n로그인 해주세요.");

      // 로그인 화면으로 리다이렉트
      // router.push('/signin');  // 페이지 이동

      if(searchParams.get("back")) router.replace("/signin?back");
        else router.push("/signin");
    })
    .catch(error => {
      console.error(error);
      // Error: Duplicated User ID
      // Error: Duplicated Nickname
    });
  }

  const getToday = () => {
    const localDate = new Date();
    const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
    return formattedDate;
  }

  const setPasswordHandler = (e:BaseSyntheticEvent) => {
    const input:HTMLInputElement = e.target;
    setPassword(input.value);
  }
  const setPasswordCheckHandler = (e:BaseSyntheticEvent) => {
    const input:HTMLInputElement = e.target;
    setPasswordCheck(input.value);
  }
  useEffect(()=>{
    const formElement = document.querySelector("form") as HTMLFormElement;
    const password1 = formElement.password;
    const password2 = formElement.passwordCheck;
    console.log(password1);
    console.log(password2);
    if(password2.value === password1.value)
      password2.style.color = "black";
    else
      password2.style.color = "red";
  },[password, passwordCheck])

  const checkDuplicatedId = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    const input:HTMLInputElement = e.target.parentElement.children[1];
    console.log(e.target.parentElement.userId);

    const data = {
      userId: input.value
    }
    axios.post("http://localhost:8005/api/v1/users/duplicateid",data)
    .then(response => {
      setIsIdDuplicated(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    })
  }
  const checkDuplicatedNickname = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    const input:HTMLInputElement = e.target.parentElement.children[1];

    const data = {
      nickname: input.value
    }
    axios.post("http://localhost:8005/api/v1/users/duplicatenickname",data)
    .then(response => {
      setIsNicknameDuplicated(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="border border-black p-2 w-2/3 max-w-xl min-w-xs">
        <form onSubmit={onSignUp} className="flex flex-col items-center space-y-2 w-full">
          
          <div className="w-full px-2">
            <label htmlFor="userId" className="inline-block w-20 text-right pr-2">ID</label>
            <input id="userId" type="text" placeholder=" user id" className="border border-black w-full max-w-52" required/>
            <button onClick={checkDuplicatedId}>check duplicated id</button>
          </div>

          <div className="w-full px-2">
            <label htmlFor="password" className="inline-block w-20 text-right pr-2">password</label>
            <input id="password" onChange={setPasswordHandler} type="password" placeholder=" password" className="border border-black w-full max-w-52" required/>
          </div>
          <div className="w-full px-2">
            <label htmlFor="passwordCheck" className="inline-block w-20 text-right pr-2">repeat password</label>
            <input id="passwordCheck" onChange={setPasswordCheckHandler} type="password" placeholder="repeat password" className="border border-black w-full max-w-52" required/>
          </div>

          <div className="w-full px-2">
            <label htmlFor="nickname" className="inline-block w-20 text-right pr-2">nickname</label>
            <input id="nickname" type="text" placeholder=" nickname" className="border border-black w-full max-w-52" required/>
            <button onClick={checkDuplicatedNickname}>check duplicated nickname</button>
          </div>

          <div className="w-full px-2">
          <label htmlFor="birthday" className="inline-block w-20 text-right pr-2">birthday</label>
          <input id="birthday" type="date" className="border border-black w-full max-w-52" max={getToday()} min="1990-01-01" required/>
          </div>
          <div className="w-full px-2">
            <label htmlFor="gender" className="inline-block w-20 text-right pr-2">gender</label>
            <select id="gender" className="border border-black w-full max-w-52" defaultValue="" required>
              <option value="" disabled>성별</option>
              <option value="MALE">남자</option>
              <option value="FEMALE">여자</option>
            </select>
          </div>
          <div className="w-full px-2">
            <label htmlFor="job" className="inline-block w-20 text-right pr-2">job</label>
            <input id="job" type="text" placeholder=" job" className="border border-black w-full max-w-52" required/>
          </div>
          <button type="submit" title="회원가입" value="회원가입" className="border border-black m-2 p-2">회원가입</button>
        </form>
      </div>
    </div>
  )
}