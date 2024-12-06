'use client';

import SignInForm from '@/app/components/sign-in/SignInForm';
import { Suspense } from 'react';
import '../../css/user/sign-in.css'

const SignInPage = () => {
  return (
    <div className="splash-main bg-gradient-to-b from-white via-blue-100 to-blue-200">
      <div className='logo-position'> 
        <img src="/images/logo.png" className='sign-in-logo-size' alt="로고" /> 
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}


export default SignInPage;