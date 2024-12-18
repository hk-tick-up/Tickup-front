'use client';

import React from 'react';
import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ message = "로딩중", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-[#F3F8FD]", className)}>
      <div className="loader9"></div>
      {message && (
        <p className="mt-4 text-lg font-medium text-[#286DB1]">{message}</p>
      )}
      <style jsx>{`
        .loader9 {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 12px;
          background-color: #286DB1;
        }

        .loader9:before, .loader9:after {
          content: "";
          position: absolute;
          top: 0px;
          width: 12px;
          height: 12px;
          border-radius: 12px;
          background-color: #286DB1;
        }

        .loader9:before {
          left: -25px;
          animation: loader9LeftDot 1.5s ease-in-out infinite;
        }

        .loader9:after {
          left: 25px;
          animation: loader9RightDot 1.5s ease-in-out infinite;
        }

        @keyframes loader9LeftDot {
          0% { left: -25px; opacity: 0.8; }
          50% { left: 0px; opacity: 0.1; }
          100% { left: -25px; opacity: 0.8; }
        }

        @keyframes loader9RightDot {
          0% { left: 25px; opacity: 0.8; }
          50% { left: 0px; opacity: 0.1; }
          100% { left: 25px; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

