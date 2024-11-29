'use client';

import React, { useState } from 'react';
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import Modal from '../../components/Modal';
import '../../css/User/SignIn.css';

export default function SignIn(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const onSignIn = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    
    const formElement = e.target.closest('form');
    const data = {
      "id": formElement.userId.value,
      "password": formElement.password.value
    };

    axios.post("http://localhost:8005/api/v1/users/sign-in", data, {
      headers: {
          "Content-Type": "application/json",
      },
      withCredentials: true
    })
    .then(response => {
      console.log(response.data);
      sessionStorage.setItem("bearer", response.data);
      // 로그인 성공
      setModalMessage("로그인 성공했습니다.");
      setIsModalOpen(true);
      
      // 세션에 id, nickname 저장: 다시 axios, id nickname 불러와 세션스토리지에 저장하기
      axios.get("http://localhost:8005/api/v1/users/self", {
        headers: {
          "Authorization": `Bearer ${response.data}`
        }
      })
      .then(res => {
        console.log(res.data);
        sessionStorage.setItem("id", res.data.id);
        sessionStorage.setItem("nickname", res.data.nickname);
        // 리다이렉트
        if(searchParams.get("back")) router.back()
        else router.push("/my");
      })
      .catch(error => {
        console.error(error);
        setModalMessage("사용자 정보를 가져오는데 실패했습니다.");
        setIsModalOpen(true);
      });
    })
    .catch(error => {
      console.error(error);
      // 로그인 실패
      setModalMessage("로그인 정보가 없습니다.");
      setIsModalOpen(true);
    });
  };

  return (
    <>
    <div className="splash-main bg-gradient-to-b from-white via-blue-100 to-blue-200">
      <div className='logo-position'> 
        <img src="/images/logo.png" className='logo-size' alt="로고" /> 
      </div>
      <div className="sign-in-main">
        <form onSubmit={onSignIn} className="sign-in-main">
          <div><input id="userId" type="text" placeholder="아이디" required/></div>
          <div><input id="password" type="password" placeholder="비밀번호" required/></div>
          <div><button type="submit" title="로그인" value="로그인">로그인</button> </div>
        </form>
          <Link href="/signup"><div className="link-style">회원가입</div></Link>
      </div>
    </div>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <p className="text-center mb-4">{modalMessage}</p>
    </Modal>
    </>
  )
}

