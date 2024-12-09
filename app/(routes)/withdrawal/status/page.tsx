'use client';

import { BACKEND_URL } from "@/constants/backend-url";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react"

const WithdrawalStatus = () => {
  const base_url = `${BACKEND_URL}/api/v1/users`;
  const router = useRouter();
  const [requestedAt, setRequestedAt] = useState<Date | null>(null); // Date 객체로 저장
  const [deleteAt, setDeleteAt] = useState<Date | null>(null); // Date 객체로 저장

  useEffect(()=>{
    axios.get(`${base_url}/withdrawal`,{headers:{Authorization:`Bearer ${sessionStorage.getItem("bearer")}`}})
    .then(response => {
      console.log(response.data);
      setRequestedAt(new Date(response.data));
    }).catch(error => {
      console.error(error);
    });
  },[]);

  useEffect(()=>{
    if(!requestedAt) return;

    const temp = new Date(requestedAt); // requestedAt을 Date 객체로 변환
    temp.setDate(temp.getDate() + 7); // 7일 더하기
    setDeleteAt(temp); // 로컬 시간대 ISO 문자열로 저장
  },[requestedAt]);

  const formatLocalDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    // const hours = String(date.getHours()).padStart(2, "0");
    // const minutes = String(date.getMinutes()).padStart(2, "0");
    // const seconds = String(date.getSeconds()).padStart(2, "0");
    // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return `${year}-${month}-${day}`;
  };

  const cancelWithdrawal = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    axios.put(`${base_url}/withdrawal`,{},{headers:{Authorization: `Bearer ${sessionStorage.getItem("bearer")}`}})
    .then(response => {
      console.log(response.data);
      alert(response.data);
      router.push("/signout");
    }).catch(error => {
      console.log(error);
    });
  }
  const goToHome = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    router.push("/");
  }

  return (
    <div>
      <p>회원탈퇴를 요청하셨습니다.</p>
      <p>탈퇴 요청 시점: {requestedAt ? formatLocalDateTime(requestedAt) : "데이터 없음"}</p>
      <p>탈퇴 처리 시점: {deleteAt ? formatLocalDateTime(deleteAt) : "데이터 없음"}</p>
      <button onClick={cancelWithdrawal}>회원탈퇴 취소</button>
      <button onClick={goToHome}>돌아가기</button>
    </div>
  )
}

export default WithdrawalStatus;