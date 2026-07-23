"use client";

import { Building2, CreditCard, Smartphone } from "lucide-react";
import { PaymentMethodType } from "@/types/payment";

type Props = {
  method: PaymentMethodType;
  setMethod: (method: PaymentMethodType) => void;
};

const METHODS: {
  id: PaymentMethodType;
  label: string;
  description: string;
  icon: typeof Smartphone;
}[] = [
  {
    id: "upi",
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm & more",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Card",
    description: "Debit or credit card",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    description: "All major banks supported",
    icon: Building2,
  },
];

const selectedStyle =
  "border-[rgb(215,55,45)] bg-[rgba(175,35,30,0.12)]";
const defaultStyle =
  "border-white/10 bg-[rgba(9,9,11,0.5)] hover:bg-white/5";

export default function PaymentMethod({ method, setMethod }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Method</h3>

      <div className="grid gap-3 sm:grid-cols-3">
        {METHODS.map(({ id, label, description, icon: Icon }) => {
          const selected = method === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${selected ? selectedStyle : defaultStyle}`}
            >
              <Icon
                className={`mb-3 h-5 w-5 ${selected ? "text-[rgb(215,55,45)]" : "text-zinc-400"}`}
              />
              <span className="font-medium text-white">{label}</span>
              <span className="mt-1 text-xs text-zinc-500">{description}</span>
              {selected && (
                <span className="mt-2 text-xs font-semibold text-[rgb(215,55,45)]">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500">
        Payments are processed securely via Razorpay. Only UPI, card, and net banking are
        supported.
      </p>
    </div>
  );
}
