'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { visitorBtnPrimary, visitorPage, visitorSurface } from '@/styles/brandColors';

export default function PaymentSuccessPage() {
  const { user } = useAuth();

  const expiry = user?.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className={`${visitorPage} flex min-h-screen items-center justify-center px-6`}>
      <div className={`max-w-md p-8 text-center ${visitorSurface}`}>
        <CheckCircle size={56} className="mx-auto mb-4 text-green-500" />

        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p className="mt-2 text-zinc-400">
          Your Premium subscription is now active. Enjoy 1080p and 4K streaming.
        </p>
        {expiry && (
          <p className="mt-2 text-sm text-zinc-500">
            Active until {expiry}
          </p>
        )}

        <Link href="/visitor" className={`${visitorBtnPrimary} mt-6 inline-block`}>
          Start Watching
        </Link>
      </div>
    </main>
  );
}
