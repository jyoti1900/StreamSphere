export interface SubscriptionPlan {
  id: string;
  name: string;
  originalAmount: number;
  discountPercent: number;
  discountAmount: number;
  grandTotal: number;
  /** Payable amount in INR (same as grandTotal) */
  amount: number;
  currency: string;
  durationDays: number;
  description: string;
}

export function calculateGrandTotal(
  originalAmount: number,
  discountPercent: number,
): number {
  return Math.round(originalAmount * (1 - discountPercent / 100));
}

export function buildSubscriptionPlan(input: {
  id: string;
  name: string;
  originalAmount: number;
  discountPercent: number;
  currency: string;
  durationDays: number;
  description: string;
}): SubscriptionPlan {
  const grandTotal = calculateGrandTotal(
    input.originalAmount,
    input.discountPercent,
  );
  const discountAmount = input.originalAmount - grandTotal;

  return {
    id: input.id,
    name: input.name,
    originalAmount: input.originalAmount,
    discountPercent: input.discountPercent,
    discountAmount,
    grandTotal,
    amount: grandTotal,
    currency: input.currency,
    durationDays: input.durationDays,
    description: input.description,
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  buildSubscriptionPlan({
    id: 'monthly',
    name: 'Monthly Premium',
    originalAmount: 199,
    discountPercent: 20,
    currency: 'INR',
    durationDays: 30,
    description: 'Full access to premium streaming for 30 days',
  }),
  buildSubscriptionPlan({
    id: 'yearly',
    name: 'Yearly Premium',
    originalAmount: 1999,
    discountPercent: 50,
    currency: 'INR',
    durationDays: 365,
    description: 'Full access to premium streaming for 1 year',
  }),
];

export function getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
}

export function toPaise(amountInRupees: number): number {
  return Math.round(amountInRupees * 100);
}

export interface OrderSummaryLine {
  label: string;
  amount: number;
  amountFormatted: string;
}

export interface OrderSummary {
  title: string;
  items: OrderSummaryLine[];
  discount: OrderSummaryLine;
  total: OrderSummaryLine;
}

export function formatInr(amount: number): string {
  const symbol = '₹';
  if (amount < 0) {
    return `-${symbol}${Math.abs(amount)}`;
  }
  return `${symbol}${amount}`;
}

export function buildOrderSummary(plan: SubscriptionPlan): OrderSummary {
  return {
    title: 'Order Summary',
    items: [
      {
        label: plan.name,
        amount: plan.originalAmount,
        amountFormatted: formatInr(plan.originalAmount),
      },
    ],
    discount: {
      label: `Discount (${plan.discountPercent}%)`,
      amount: -plan.discountAmount,
      amountFormatted: formatInr(-plan.discountAmount),
    },
    total: {
      label: 'Total',
      amount: plan.grandTotal,
      amountFormatted: formatInr(plan.grandTotal),
    },
  };
}

export function toPlanWithOrderSummary(plan: SubscriptionPlan) {
  return {
    ...plan,
    orderSummary: buildOrderSummary(plan),
  };
}
