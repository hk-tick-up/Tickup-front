'use client';

import SignInForm from '@/app/components/signin/signinform';
import { Suspense } from 'react';

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm/>
    </Suspense>
  );
}