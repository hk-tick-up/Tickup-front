'use client';

import SignUpForm from '@/app/components/signup/signupform';
import { Suspense } from 'react';

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm/>
    </Suspense>
  );
}