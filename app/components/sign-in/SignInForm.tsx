'use client';

import React, { useRef, useState } from 'react';
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import Modal from '../Modal';
import '../../css/user/sign-in.css';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  sub: string; // 사용자 ID 등 토큰의 subject
  roles: string[]; // 사용자 역할
  iat?: number; // 발행 시간 (초 단위)
  exp?: number; // 만료 시간 (초 단위)
  deletionRequested?: boolean; // 추가한 boolean 속성
}

const SignInForm = () => {
  const base_url = "http://localhost:8005/api/v1/users"
  // const base_url = "http://back-service:8005/api/v1/users"
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const deletionRequested = useRef<boolean>(false);

  const onSignIn = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    
    const formElement = e.target.closest('form');
    const data = {
      "id": formElement.userId.value,
      "password": formElement.password.value
    };

    axios.post(`${base_url}/sign-in`, data, {
      headers: {
          "Content-Type": "application/json",
      },
      withCredentials: true
    })
    .then(response => {
      sessionStorage.setItem("bearer", response.data);
      
      // 로그인 성공
      setModalMessage("로그인 성공했습니다.");
      setIsModalOpen(true);
      
      // 세션에 id, nickname 저장: 다시 axios, id nickname 불러와 세션스토리지에 저장하기
      axios.get(`${base_url}/self`, {
        headers: {
          "Authorization": `Bearer ${response.data}`
        }
      })
      .then(res => {
        console.log(res.data);
        sessionStorage.setItem("id", res.data.id);
        sessionStorage.setItem("nickname", res.data.nickname);
        // 여기에서 token 디코딩해서 회원탈퇴 요청한 회원인지 확인, 탈퇴회원 전용 my페이지로 이동
        deletionRequested.current = getDeletionRequested(response.data);
        console.log(`getDeletionRequested = ${deletionRequested.current}`);

        // 모달 창 닫기 후 리다이렉트
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

  const redirectAfterModalClosed = () => {
    setIsModalOpen(false)
    console.log(`deletionRequested.current = ${deletionRequested.current}`);
    if(deletionRequested.current) router.push("/withdrawal/status");
    else if(searchParams.get("back")) router.back();
    else router.push("/my");
  }

  const getDeletionRequested = (token: string) => {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token); // 토큰 디코딩
      return decoded.deletionRequested || false; // deletionRequested 값 반환
    } catch (error) {
      console.error("Invalid token", error);
      return false; // 유효하지 않은 토큰의 경우 기본값 반환
    }
  }

  return (
    <>
    <div>
      <div className="sign-in-main">
        <form onSubmit={onSignIn} className="sign-in-main">
          <div><input id="userId" type="text" placeholder="아이디" className='sign-in-input' required/></div>
          <div><input id="password" type="password" placeholder="비밀번호" className='sign-in-input' required/></div>
          <div><button type="submit" title="로그인" value="로그인" className='sign-in-btn'>로그인</button> </div>
        </form>
          <Link href="/signup"><div className="link-style">회원가입</div></Link>
      </div>
    </div>
    <Modal isOpen={isModalOpen} onClose={redirectAfterModalClosed}>
      <p className="text-center mb-4">{modalMessage}</p>
    </Modal>
    </>
  )
}

export default SignInForm;