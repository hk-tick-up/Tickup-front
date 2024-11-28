'use client';

import axios from "axios"
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import { ArrowLeft } from 'lucide-react';
import '../../css/User/SignUp.css'

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
    <div className="signup-root">
      <div>
        <button onClick={() => router.back()} className="back-btn">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <p className="pt-1">뒤로가기</p>
        </button>
      </div>

      <form onSubmit={onSignUp} className="signup-form-main">
        <div className="input-group">
          <div className="input-title">아이디</div>
          <input id="userId" type="text" placeholder="아이디" required />
        </div>

        <div className="input-group">
          <div className="input-title">비밀번호</div>
          <input id="password" type="password" placeholder="비밀번호" required />
        </div>

        <div className="input-group">
          <div className="input-title">비밀번호 확인</div>
          <input type="password" placeholder="비밀번호 확인" required />
        </div>

        <div className="input-group">
          <div className="input-title">닉네임</div>
          <input id="nickname" type="text" placeholder="닉네임" required />
        </div>

        <div className="input-group">
          <div className="input-title">생년월일</div>
          <input id="age" type="text" placeholder="YYYYDDMM" maxLength={8}/>
        </div>

        <div className="input-group">
          <div className="input-title">성별</div>
          <div className="gender-select">
            <label>
              <input type="radio" name="gender" value="MALE" required />
              <span>남성</span>
            </label>
            <label>
              <input type="radio" name="gender" value="FEMALE" required />
              <span>여성</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <div className="input-title">직업</div>
          <select id="job" className="input-field" required>
            <option value="">직업 선택</option>
            <option value="student">학생</option>
            <option value="employee">회사원</option>
            <option value="self-employed">자영업</option>
            <option value="other">기타</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          TickUp 시작하기
        </button>
      </form>
    </div>
  );
}