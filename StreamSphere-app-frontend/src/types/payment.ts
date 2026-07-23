export type BillingCycle = "monthly" | "yearly";

export type PaymentMethodType = "upi" | "card" | "netbanking";

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description: string;
}
