'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { visitorBtnPrimary, visitorPage, visitorSurface, visitorTextAccent } from '@/styles/brandColors';

export default function PaymentFailedPage() {
  return (
    <main className={`${visitorPage} flex min-h-screen items-center justify-center px-6`}>
      <div className={`max-w-md p-8 text-center ${visitorSurface}`}>
        <XCircle size={56} className={`mx-auto mb-4 ${visitorTextAccent}`} />

        <h1 className="text-2xl font-bold">Payment Failed</h1>
        <p className="mt-2 text-zinc-400">
          Something went wrong. Please try again.
        </p>

        <Link href="/visitor/payment" className={`${visitorBtnPrimary} mt-6 inline-block`}>
          Retry Payment
        </Link>
      </div>
    </main>
  );
}
