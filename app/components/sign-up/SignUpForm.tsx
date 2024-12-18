'use client';

import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { ArrowLeft } from 'lucide-react';
import '@/app/css/user/sign-up.css';
// import { BACKEND_URL } from "@/constants/backend-url";

const SignUpForm = () => {
  //localhost
  // const base_url = `${BACKEND_URL}/api/v1/users`;
  const BACKEND_USER_URL = process.env.NEXT_PUBLIC_BACKEND_USER_URL;
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

    axios.post(`${BACKEND_USER_URL}/sign-up`, data)
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
    if(password2.value === password1.value)
      password2.style.color = "black";
    else
      password2.style.color = "red";
  },[password, passwordCheck])

  const checkDuplicatedId = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    // const parent:HTMLDivElement = e.target.parentElement;
    // const firstchild = parent.firstChild;
    const input:HTMLInputElement = e.target.parentElement.children[0];
    console.log(e.target.parentElement.userId);

    const data = {
      userId: input.value
    }
    axios.post(`${BACKEND_USER_URL}/duplicateid`,data)
    .then(response => {
      setIsIdDuplicated(response.data);
      console.log(response.data);
      if(response.data)
        alert(`${input.value}: This ID already exists.`);
      else
        alert(`${input.value}: You can use this ID.`);
    })
    .catch(error => {
      console.error(error);
    })
  }
  const checkDuplicatedNickname = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    const input:HTMLInputElement = e.target.parentElement.children[0];

    const data = {
      nickname: input.value
    }
    axios.post(`${BACKEND_USER_URL}/duplicatenickname`,data)
    .then(response => {
      setIsNicknameDuplicated(response.data);
      console.log(response.data);
      if(response.data)
        alert("This nickname already exists.");
      else
        alert("You can use this nickname.");
    })
    .catch(error => {
      console.error(error);
    })
  }

  return (
    <>
      <div className="signup-root">
        <div>
          <button onClick={() => router.back()} className="back-btn">
            <ArrowLeft className="w-5 h-5 mr-1" />
            <p className="text-custom">뒤로가기</p>
          </button>
        </div>
        <form className="signup-form-main" onSubmit={onSignUp}>
          <div className="input-group">
            <div className="input-title">아이디</div>
            <div className="custom-position-1">
              <input id="userId" type="text" placeholder="아이디" required />
              <button className="sign-up-btn" onClick={checkDuplicatedId} >중복확인</button>
            </div>
          </div>

          <div className="input-group">
            <div className="input-title">비밀번호</div>
            <input id="password"  onChange={setPasswordHandler} type="password" placeholder="비밀번호" required />
          </div>

          <div className="input-group">
            <div className="input-title">비밀번호</div>
            <input id="passwordCheck" onChange={setPasswordCheckHandler} type="password" placeholder="비밀번호 확인" required />
          </div>

          <div className="input-group">
            <div className="input-title">닉네임</div>
            <div className="custom-position-1">
              <input id="nickname" type="text" placeholder="닉네임" required />
              <button className="sign-up-btn" onClick={checkDuplicatedNickname} >중복확인</button>
            </div>
          </div>

          <div className="input-group">
            <div className="input-title">생년월일</div>
            <div>
              <input id="birthday" title="birthday" type="date" max={getToday()} min="1990-01-01" required/>
            </div>
          </div>

          <div className="input-group">
            <div className="input-title">성별</div>
            <div className="gender-select">
                <input type="radio" title="gender" name="gender" value="MALE" id="gender-male" required />
                  <span>남성</span>
                <input type="radio" title="gender" name="gender" value="FEMALE" id="gender-female" required />
                  <span>여성</span>
            </div>
          </div>

          <div className="input-group">
            <div className="input-title">직업</div>
            <select id="job" title="job" className="input-field" required>
              <option value="">직업 선택</option>
              <option value="woker">직장인</option>
              <option value="self-employed">자영업</option>
              <option value="university-student">대학생</option>
              <option value="high-school-student">고등학생</option>
              <option value="middle-school-student">중학생</option>
              <option value="elementary-school-student">초등학생</option>
              <option value="not-employed">무직</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            TickUp 시작하기
          </button>
        </form>
      </div>
      
    </>
    

  )
}

export default SignUpForm;