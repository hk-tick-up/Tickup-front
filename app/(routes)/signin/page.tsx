'use client';

import React, { useState } from 'react';
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import Modal from '../../components/Modal';
import '../../css/User/SignIn.css';
// import anxios from "@/app/utils/axios";

const api = axios.create({
  //localhost
  baseURL: "http://localhost:8005/api/v1",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default function SignIn() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // SignIn.tsx
  // src/app/(routes)/signin/page.tsx

// src/app/(routes)/signin/page.tsx

const onSignIn = async (e: BaseSyntheticEvent) => {
  e.preventDefault();

  const formElement = e.target.closest("form");
  const data = {
      id: formElement.userId.value,
      password: formElement.password.value,
  };

  try {
      const loginResponse = await api.post("/users/sign-in", data);
      console.log("로그인 응답:", loginResponse.data);

      const token = loginResponse.data?.token;
      const userData = loginResponse.data?.user;

      if (!token || !userData) {
          throw new Error("로그인 응답 데이터가 올바르지 않습니다.");
      }

      // sessionStorage에 데이터 저장
      sessionStorage.setItem('bearer', token);
      sessionStorage.setItem('id', userData.id);
      sessionStorage.setItem('nickname', userData.nickname);

      // 저장 확인을 위한 로그
      console.log('sessionStorage 저장 상태:', {
          token: sessionStorage.getItem('bearer'),
          id: sessionStorage.getItem('id'),
          nickname: sessionStorage.getItem('nickname')
      });

      setModalMessage("로그인 성공했습니다.");
      setIsModalOpen(true);

      setTimeout(() => {
          router.push("/my");
      }, 1000);
  } catch (error) {
      console.error("로그인 실패:", error);
      let errorMessage = "로그인에 실패했습니다.";
      
      if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || errorMessage;
      }
      
      setModalMessage(errorMessage);
      setIsModalOpen(true);
  }
};


  return (
    <>
      <div className="sign-in-root bg-gradient-to-b from-white via-blue-100 to-blue-200">
        <div className="logo-position">
          <img src="/images/logo.png" className="logo-size" alt="로고" />
        </div>
        <div className="sign-in-main">
          <form onSubmit={onSignIn} className="sign-in-main">
            <div>
              <input
                id="userId"
                type="text"
                placeholder="아이디"
                className="sign-in-input"
                required
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                className="sign-in-input"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                title="로그인"
                value="로그인"
                className="sign-in-btn"
              >
                로그인
              </button>
            </div>
          </form>
          <Link href="/signup">
            <div className="link-style">회원가입</div>
          </Link>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className="text-center mb-4">{modalMessage}</p>
      </Modal>
    </>
  );
}

