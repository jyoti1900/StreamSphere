"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import { API_BASE_URL } from "@/context/AuthContext";
import AuthPageShell from "@/components/auth/AuthPageShell";
import AuthAlert from "@/components/auth/AuthAlert";
import { visitorBtnPrimary, visitorInput } from "@/styles/brandColors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setAlert({ type: "error", message: "Please enter a valid email address" });
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      setAlert({ type: "success", message: "Reset link sent to your email. Please check your inbox." });
      setEmail("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setAlert({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Forgot Password"
      subtitle="We'll email you a secure link to reset your password."
      heroTitle="Account recovery made simple."
      heroDescription="Enter the email linked to your account and we'll send instructions to reset your password."
    >
      {alert && (
        <div className="mb-4">
          <AuthAlert
            type={alert.type}
            message={alert.message}
            onDismiss={() => setAlert(null)}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (alert) setAlert(null);
            }}
            className={visitorInput}
            placeholder="you@example.com"
            required
          />
        </div>

        <p className="text-sm text-zinc-400">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <button
          type="submit"
          disabled={loading}
          className={`${visitorBtnPrimary} w-full ${loading ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <Mail className="mr-2 h-4 w-4" />
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-400">
        <span className="mr-2">Remember your password?</span>
        <Link href="/login" className="font-medium text-white hover:text-[rgb(215,55,45)]">
          Back to login
        </Link>
      </div>
    </AuthPageShell>
  );
}
