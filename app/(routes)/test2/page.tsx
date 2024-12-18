'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ReportModal from '@/app/components/RePortModal';

export default function LoadingExample() {


//   useEffect(() => {
    // 예시: 3초 후에 로딩 상태를 false로 변경
    // const timer = setTimeout(() => {
    //   setIsLoading(false);
    // }, 10000);

//     return () => clearTimeout(timer);
//   }, []);


  return (
    <div>
        <ReportModal isOpen={true} onClose={function (): void {
              throw new Error('Function not implemented.');
          } } />
    </div>
  );
}

