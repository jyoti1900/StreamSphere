"use client";

import { useEffect, useMemo, useState } from "react";
import { BillingCycle, PaymentMethodType, Plan } from "@/types/payment";
import {
  PaymentHeader,
  PlanSelector,
  PlanCard,
  PaymentMethod,
  OrderSummary,
  SecurePayButton,
} from "@/components/payment";
import { fetchPaymentPlans } from "@/lib/payment";
import { visitorPage, visitorSurface } from "@/styles/brandColors";

export default function PaymentPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("upi");
  const [plans, setPlans] = useState<Record<BillingCycle, Plan> | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState("");

  useEffect(() => {
    let active = true;

    fetchPaymentPlans()
      .then((data) => {
        if (active) {
          setPlans(data);
          setPlansError("");
        }
      })
      .catch((error) => {
        if (active) {
          setPlans(null);
          setPlansError(
            error instanceof Error ? error.message : "Unable to load subscription plans"
          );
        }
      })
      .finally(() => {
        if (active) setLoadingPlans(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedPlan = useMemo(
    () => (plans ? plans[cycle] : null),
    [plans, cycle]
  );

  return (
    <main className={`${visitorPage} relative overflow-hidden`}>
      <div
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(215, 55, 45, 0.08)" }}
      />

      <div className="relative px-6 py-16">
        <PaymentHeader />

        {loadingPlans ? (
          <p className="mt-16 text-center text-zinc-500">Loading subscription plans...</p>
        ) : plansError || !selectedPlan ? (
          <div className={`mx-auto mt-16 max-w-lg p-8 text-center ${visitorSurface}`}>
            <p className="text-[rgb(215,55,45)]">{plansError || "Plans unavailable"}</p>
            <p className="mt-2 text-sm text-zinc-500">
              Payment details could not be loaded from the server. Please try again later.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex justify-center">
              <PlanSelector cycle={cycle} setCycle={setCycle} />
            </div>

            <div className="mx-auto mt-10 grid max-w-6xl items-start gap-10 md:grid-cols-3">
              <div className="space-y-8 md:col-span-2">
                <PlanCard plan={selectedPlan} />
                <PaymentMethod method={paymentMethod} setMethod={setPaymentMethod} />
              </div>

              <div
                className={`h-fit p-6 ${visitorSurface}`}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(65,15,15,0.15) 0%, rgba(24,24,27,0.55) 100%)",
                }}
              >
                <OrderSummary planId={selectedPlan.id} />
                <SecurePayButton planId={selectedPlan.id} paymentMethod={paymentMethod} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
