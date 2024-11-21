'use client';

import { useRouter } from "next/navigation";

export default function GoBackTo(){
  const router = useRouter();
  
  return (
    <button onClick={() => router.back()}>
      뒤로 가기
    </button>
  );
}