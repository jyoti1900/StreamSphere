import { API_BASE_URL } from "@/context/AuthContext";
import { BillingCycle, PaymentMethodType, Plan } from "@/types/payment";
import { applyPremiumSubscription } from "@/lib/premium";

export type SubscriptionPlanApi = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  durationDays: number;
  description: string;
};

export type CreateOrderResponse = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  plan: {
    id: string;
    name: string;
    description: string;
  };
};

export type VerifyPaymentResponse = {
  message: string;
  planId: string;
  subscriptionExpiresAt: string;
};

export type PlanHistoryItem = {
  user: string;
  email: string;
  amount: string;
  method: string | null;
  status: "paid" | "pending" | "failed";
  date: string;
};

export type OrderSummaryLine = {
  label: string;
  amount: number;
  amountFormatted: string;
};

export type OrderSummaryResponse = {
  title: string;
  items: OrderSummaryLine[];
  discount?: OrderSummaryLine | null;
  total: OrderSummaryLine;
};

function readApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const record = data as Record<string, unknown>;
  const message = record.message;

  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message) return message;
  if (typeof record.error === "string" && record.error) return record.error;

  return fallback;
}

export function formatPlanAmount(amount: number, currency = "INR") {
  if (currency === "INR") return `₹${amount}`;
  return `${currency} ${amount}`;
}

export function mapApiPlanToUiPlan(apiPlan: SubscriptionPlanApi): Plan {
  return {
    id: apiPlan.id,
    name: apiPlan.name,
    price: apiPlan.amount,
    currency: apiPlan.currency,
    durationDays: apiPlan.durationDays,
    description: apiPlan.description,
  };
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlanApi[]> {
  const res = await fetch(`${API_BASE_URL}/payments/plans`, {
    headers: { accept: "application/json" },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(readApiError(data, "Unable to load subscription plans"));
  }

  const plans = Array.isArray(data) ? data : data?.data;

  if (!Array.isArray(plans) || plans.length === 0) {
    throw new Error("No subscription plans available");
  }

  return plans;
}

export async function fetchPaymentPlans(): Promise<Record<BillingCycle, Plan>> {
  const apiPlans = await fetchSubscriptionPlans();
  const monthly = apiPlans.find((plan) => plan.id === "monthly");
  const yearly = apiPlans.find((plan) => plan.id === "yearly");

  if (!monthly || !yearly) {
    throw new Error("Monthly and yearly plans are required from the backend");
  }

  return {
    monthly: mapApiPlanToUiPlan(monthly),
    yearly: mapApiPlanToUiPlan(yearly),
  };
}

export async function fetchOrderSummary(planId: string): Promise<OrderSummaryResponse> {
  const res = await fetch(
    `${API_BASE_URL}/payments/order-summary?planId=${encodeURIComponent(planId)}`,
    { headers: { accept: "application/json" } }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(readApiError(data, "Unable to load order summary"));
  }

  const summary = data?.data || data;
  if (!summary || typeof summary !== "object") {
    throw new Error("Invalid order summary response");
  }

  return summary as OrderSummaryResponse;
}

export async function createPaymentOrder(
  token: string,
  planId: string
): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ planId }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(readApiError(data, "Failed to create payment order"));
  }

  return data?.data || data;
}

export async function fetchPlanHistory(token: string): Promise<PlanHistoryItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/plan-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });

    if (res.status === 404) {
      return [];
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return [];
    }

    const list = Array.isArray(data) ? data : data?.data;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function verifyPayment(
  token: string,
  payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }
): Promise<VerifyPaymentResponse> {
  const res = await fetch(`${API_BASE_URL}/payments/verify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(readApiError(data, "Payment verification failed"));
  }

  return data?.data || data;
}

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);

  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type CheckoutUser = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
};

function getRazorpayMethodConfig(selected?: PaymentMethodType) {
  const allowed = {
    upi: true,
    card: true,
    netbanking: true,
    wallet: false,
    emi: false,
    paylater: false,
  };

  if (!selected) return allowed;

  return {
    upi: selected === "upi",
    card: selected === "card",
    netbanking: selected === "netbanking",
    wallet: false,
    emi: false,
    paylater: false,
  };
}

export async function openRazorpayCheckout(options: {
  token: string;
  planId: string;
  paymentMethod?: PaymentMethodType;
  user?: CheckoutUser | null;
  onVerified?: (result: VerifyPaymentResponse) => void;
}): Promise<void> {
  const order = await createPaymentOrder(options.token, options.planId);
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded || !window.Razorpay) {
    throw new Error("Unable to load Razorpay checkout. Please try again.");
  }

  const fullName = [options.user?.firstName, options.user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay!({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "StreamSphere",
      description: order.plan.description || order.plan.name,
      order_id: order.orderId,
      prefill: {
        name: fullName || undefined,
        email: options.user?.email || undefined,
        contact: options.user?.phone || options.user?.mobile || undefined,
      },
      notes: {
        planId: order.plan.id,
      },
      theme: {
        color: "#AF231E",
      },
      method: getRazorpayMethodConfig(options.paymentMethod),
      handler: async (response) => {
        try {
          const verified = await verifyPayment(options.token, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          applyPremiumSubscription({
            planId: verified.planId,
            subscriptionExpiresAt: verified.subscriptionExpiresAt,
          });

          options.onVerified?.(verified);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled"));
        },
      },
    });

    checkout.on("payment.failed", () => {
      reject(new Error("Payment failed"));
    });

    checkout.open();
  });
}
