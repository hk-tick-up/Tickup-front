'use client';

import SignUpForm from '@/app/components/sign-up/SignUpForm';
import { Suspense } from 'react';

const SignUpPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm/>
    </Suspense>
  );
}

export default SignUpPage;