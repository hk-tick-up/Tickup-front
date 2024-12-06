'use client';

import axios from "axios"
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";

export default function Withdrawal(){
  // const base_url = "http://localhost:8005/api/v1/users";
  const base_url = "http://back-service:8005/api/v1/users";
  const router = useRouter();

  const requestMembershipWithdrawal = () => {
    axios.delete(`${base_url}/withdrawal`,{
      headers:{
        Authorization:`Bearer ${sessionStorage.getItem("bearer")}`
      }
    }).then(response => {
      console.log(response.data);
      alert(response.data);
      router.push("/signout");
    }).catch(error => {
      console.error(error);
    })
  }

  const goBack = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    router.back();
  }

  return (
    <div>
      <h1>회원탈퇴</h1>
      <p>회원탈퇴 버튼을 누른 시점으로부터 7일 후 실제로 탈퇴가 이루어집니다.</p>
      <p>7일의 유예기간 중에는 서비스 이용이 제한되며, 탈퇴를 무를 수 있습니다.</p>
      <p>회원탈퇴 버튼을 누른 즉시 로그아웃되며, 서비스 이용이 제한됩니다.</p>
      <button onClick={requestMembershipWithdrawal}>회원탈퇴</button>
      <button onClick={goBack}>돌아가기</button>
    </div>
  )
}