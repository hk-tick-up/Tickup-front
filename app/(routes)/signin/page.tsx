'use client';

import SignInForm from '@/app/components/sign-in/SignInForm';
import { Suspense } from 'react';

const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm/>
    </Suspense>
  );
}

export default SignInPage;