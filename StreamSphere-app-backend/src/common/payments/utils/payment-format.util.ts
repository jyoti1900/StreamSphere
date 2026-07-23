import { PaymentOrderStatus } from '../schema/payment-order.schema';

export interface PaymentDetailView {
  user: string;
  email: string;
  amount: string;
  method: string | null;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

export function formatPaymentStatus(
  status: PaymentOrderStatus,
): 'paid' | 'pending' | 'failed' {
  if (status === PaymentOrderStatus.PAID) {
    return 'paid';
  }

  if (status === PaymentOrderStatus.FAILED) {
    return 'failed';
  }

  return 'pending';
}

export function formatPaymentMethod(method?: string | null): string | null {
  if (!method?.trim()) {
    return null;
  }

  const normalized = method.trim().toLowerCase();
  const methodMap: Record<string, string> = {
    upi: 'UPI',
    card: 'card',
    netbanking: 'net banking',
    wallet: 'wallet',
    emi: 'EMI',
  };

  return methodMap[normalized] ?? method;
}

export function formatPaymentAmount(amount: number, currency = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : `${currency} `;
  return `${symbol}${amount}`;
}

export function formatPaymentDate(value?: Date | string | null): string {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

export function buildPaymentDetailView(input: {
  firstName?: string;
  lastName?: string;
  email?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string | null;
  status: PaymentOrderStatus;
  createdAt?: Date | string;
}): PaymentDetailView {
  const fullName = [input.firstName, input.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    user: fullName || 'Unknown User',
    email: input.email ?? '',
    amount: formatPaymentAmount(input.amount, input.currency),
    method: formatPaymentMethod(input.paymentMethod),
    status: formatPaymentStatus(input.status),
    date: formatPaymentDate(input.createdAt),
  };
}
