'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UpiPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/visitor/payment');
  }, [router]);

  return null;
}
