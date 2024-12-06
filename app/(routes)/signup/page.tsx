'use client';

import SignUpForm from '@/app/components/sign-up/SignUpForm';
import { Suspense } from 'react';
import '../../css/user/sign-up.css';

const SignUpPage = () => {
  return (
    <div className='sign-up-page'>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm/>
      </Suspense>
    </div>
  );
}

export default SignUpPage;