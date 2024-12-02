'use client';

import React, { useState } from 'react';
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import Modal from '../../components/Modal';
import '../../css/User/SignIn.css';

const api = axios.create({
  baseURL: 'http://localhost:8005/api/v1',
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

  const onSignIn = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    const formElement = e.target.closest("form");
    const data = {
      id: formElement.userId.value,
      password: formElement.password.value,
    };

    try {
      // 로그인 요청
      const loginResponse = await api.post("/users/sign-in", data);
      
      if (!loginResponse.data) {
        throw new Error("로그인 응답이 비어있습니다.");
      }

      const token = loginResponse.data.token || loginResponse.data;
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      // 토큰 저장
      localStorage.setItem("bearer", token.toString().trim());

      try {
        // 사용자 정보 요청
        const userResponse = await api.get("/users/self", {
          headers: {
            Authorization: `Bearer ${token.toString().trim()}`
          }
        });

        if (userResponse.data && userResponse.data.id && userResponse.data.nickname) {
          localStorage.setItem("id", userResponse.data.id);
          localStorage.setItem("nickname", userResponse.data.nickname);
          
          setModalMessage("로그인 성공");
          setIsModalOpen(true);

          // 약간의 지연 후 리다이렉트
          setTimeout(() => {
            router.push("/my");
          }, 1000);
        } else {
          throw new Error("사용자 정보가 올바르지 않습니다.");
        }
      } catch (userError) {
        console.error("사용자 정보 조회 실패:", userError);
        throw new Error("사용자 정보를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      let errorMessage = "로그인에 실패했습니다.";
      
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
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

