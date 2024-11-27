'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function SignOut() {
  const router = useRouter();

  useEffect(()=>{
    if(sessionStorage.getItem("id")){
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("nickname");
      sessionStorage.removeItem("bearer");
      // logout success
      alert("로그아웃 되었습니다.");
      router.push("/");
    }
    else{
      // logout failed
      alert("로그인 되어있지 않습니다.");
      router.push("/");
    }
    
  },[]);

  return (
    <div></div>
  );
}