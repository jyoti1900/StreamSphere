"use client";

import { useEffect, useState } from "react";
import {
  adminBtnSecondary,
  adminInput,
  adminModal,
  adminModalOverlay,
  adminTableHead,
  adminTableRow,
  adminTableWrap,
} from "../adminStyles";

type Payment = {
  id: string;
  user: string;
  email: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  method: string;
  date: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const dummy: Payment[] = [
      {
        id: "1",
        user: "John Wick",
        email: "john@example.com",
        amount: 299,
        status: "paid",
        method: "UPI",
        date: "2026-04-03",
      },
      {
        id: "2",
        user: "Rahul Sharma",
        email: "rahul@gmail.com",
        amount: 499,
        status: "pending",
        method: "Card",
        date: "2026-04-02",
      },
      {
        id: "3",
        user: "Amit Das",
        email: "amit@gmail.com",
        amount: 199,
        status: "failed",
        method: "Net Banking",
        date: "2026-04-01",
      },
    ];

    setPayments(dummy);
  }, []);

  const filteredPayments = payments.filter((p) =>
    p.user.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-600/15 px-3 py-1 text-xs text-emerald-400">
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="rounded-full border border-yellow-500/30 bg-yellow-600/15 px-3 py-1 text-xs text-yellow-400">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="rounded-full border border-red-500/30 bg-red-600/15 px-3 py-1 text-xs text-red-400">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <input
          type="text"
          placeholder="Search by user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${adminInput} max-w-sm`}
        />
      </div>

      <div className={adminTableWrap}>
        <table className="w-full text-sm">
          <thead className={adminTableHead}>
            <tr>
              <th className="p-4 text-center">User</th>
              <th className="p-4 text-center">Email</th>
              <th className="p-4 text-center">Amount</th>
              <th className="p-4 text-center">Method</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className={adminTableRow}>
                <td className="p-4 text-center">{payment.user}</td>
                <td className="p-4 text-center text-zinc-300">{payment.email}</td>
                <td className="p-4 text-center font-medium text-white">₹{payment.amount}</td>
                <td className="p-4 text-center text-zinc-300">{payment.method}</td>
                <td className="p-4 text-center">{getStatusBadge(payment.status)}</td>
                <td className="p-4 text-center text-zinc-400">{payment.date}</td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="rounded-lg bg-blue-600/90 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayment && (
        <div className={adminModalOverlay}>
          <div className={`${adminModal} space-y-4`}>
            <h2 className="text-xl font-bold">Payment Details</h2>

            <div className="space-y-3 rounded-xl border border-white/5 bg-zinc-800/30 p-4 text-sm">
              <p><span className="text-zinc-500">User:</span> {selectedPayment.user}</p>
              <p><span className="text-zinc-500">Email:</span> {selectedPayment.email}</p>
              <p><span className="text-zinc-500">Amount:</span> ₹{selectedPayment.amount}</p>
              <p><span className="text-zinc-500">Method:</span> {selectedPayment.method}</p>
              <p><span className="text-zinc-500">Status:</span> {selectedPayment.status}</p>
              <p><span className="text-zinc-500">Date:</span> {selectedPayment.date}</p>
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className={`${adminBtnSecondary} w-full`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
