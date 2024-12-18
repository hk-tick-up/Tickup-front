
export default function Mark(){
  return (
    <div></div>
  )
}

// /* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

// import GoBackTo from "@/app/components/common/goBackTo";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation"
// import { useEffect } from "react";

// export default function Mark(){
//   const searchParams = useSearchParams();
//   const answers = searchParams.get("answers");
//   const selected = searchParams.get("selected");

//   useEffect(() => {
//     window.history.replaceState({}, '', '/study/quiz');
//   }, []);
  
//   return (
//     <div>
//       <p>adsf</p>
//       <Link href="/study/quiz">
//         <div>퀴즈로 돌아가기</div>
//       </Link>
//     </div>
//   )
// }