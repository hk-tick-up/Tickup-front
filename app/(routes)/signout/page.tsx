'use client';

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react"

const SignOut = () => {
  const router = useRouter();
  const isLoggedOut = useRef(false);

  useEffect(()=>{
    if(isLoggedOut.current) return;
    isLoggedOut.current = true;
    
    console.log("signout page entered");
    if(sessionStorage.getItem("id")){
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("nickname");
      sessionStorage.removeItem("bearer");
      // logout success
      // alert("로그아웃 되었습니다.");
      console.log("logged out");
      router.push("/");
    }
    else{
      // logout failed
      // alert("로그인 되어있지 않습니다.");
      console.log("was not login")
      router.push("/");
    }
    
  },[router]);

  return (
    <div>
      <p>로그아웃 중 입니다..</p>
    </div>
  );
}

export default SignOut;