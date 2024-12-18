'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function LoadingExample() {
  const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
    // 예시: 3초 후에 로딩 상태를 false로 변경
    // const timer = setTimeout(() => {
    //   setIsLoading(false);
    // }, 10000);

//     return () => clearTimeout(timer);
//   }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">로딩이 완료되었습니다!</h1>
    </div>
  );
}

