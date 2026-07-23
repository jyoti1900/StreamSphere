"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authToast } from "@/components/auth/authToast";
import { openRazorpayCheckout } from "@/lib/payment";
import { PaymentMethodType } from "@/types/payment";
import { visitorBtnPrimary } from "@/styles/brandColors";

type Props = {
  planId: string;
  paymentMethod: PaymentMethodType;
};

const METHOD_LABELS: Record<PaymentMethodType, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
};

export default function SecurePayButton({ planId, paymentMethod }: Props) {
  const router = useRouter();
  const { token, user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!token) {
      authToast.error("Please sign in to continue with payment.");
      router.push("/login?redirect=/visitor/payment");
      return;
    }

    setLoading(true);

    try {
      await openRazorpayCheckout({
        token,
        planId,
        paymentMethod,
        user,
        onVerified: (result) => {
          const updatedUser = {
            isPremium: true,
            subscriptionPlan: result.planId,
            subscriptionExpiresAt: result.subscriptionExpiresAt,
          };

          if (typeof updateUser === "function") {
            updateUser(updatedUser);
          }
        },
      });

      router.push("/visitor/payment/success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Payment could not be completed";

      if (message === "Payment cancelled") {
        authToast.error("Payment cancelled.");
        return;
      }

      authToast.error(message);
      router.push("/visitor/payment/failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`${visitorBtnPrimary} mt-6 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Opening Razorpay...
        </>
      ) : (
        `Pay with ${METHOD_LABELS[paymentMethod]}`
      )}
    </button>
  );
}
