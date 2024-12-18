'use client';

import Link from "next/link";

export default function MoveToQuiz() {
  return (
    <div className="border border-black">
      <Link href="/study/quiz">
        <img alt="icon"/>
        <div>초보부터 고수까지, 모두를 위한 지식</div>
        <img alt="icon"/>
        <div>더 많은 퀴즈를 풀어보세요!</div>
      </Link>
    </div>
  );
}