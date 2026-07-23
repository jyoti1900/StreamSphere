"use client";

import { useEffect, useState } from "react";
import { fetchOrderSummary, type OrderSummaryResponse } from "@/lib/payment";
import { visitorTextAccent } from "@/styles/brandColors";

type Props = {
  planId: string;
};

export default function OrderSummary({ planId }: Props) {
  const [summary, setSummary] = useState<OrderSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetchOrderSummary(planId)
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch((err) => {
        if (active) {
          setSummary(null);
          setError(err instanceof Error ? err.message : "Unable to load order summary");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [planId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Order Summary</h3>
        <p className="text-sm text-zinc-500">Loading order summary...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Order Summary</h3>
        <p className="text-sm text-[rgb(215,55,45)]">{error || "Order summary unavailable"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{summary.title || "Order Summary"}</h3>

      <div className="space-y-3">
        {summary.items.map((item) => (
          <div key={item.label} className="flex justify-between text-sm text-zinc-400">
            <span>{item.label}</span>
            <span>{item.amountFormatted}</span>
          </div>
        ))}

        {summary.discount && (
          <div className="flex justify-between text-sm text-green-400">
            <span>{summary.discount.label}</span>
            <span>{summary.discount.amountFormatted}</span>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between font-semibold text-white">
          <span>{summary.total.label}</span>
          <span className={visitorTextAccent}>{summary.total.amountFormatted}</span>
        </div>
      </div>
    </div>
  );
}
