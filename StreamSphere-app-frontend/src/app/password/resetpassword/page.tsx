"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";
import { API_BASE_URL } from "@/context/AuthContext";
import AuthPageShell from "@/components/auth/AuthPageShell";
import AuthAlert from "@/components/auth/AuthAlert";
import { authToast } from "@/components/auth/authToast";
import { visitorBtnPrimary, visitorInput } from "@/styles/brandColors";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!token) {
      return setAlert({ type: "error", message: "Invalid reset link" });
    }
    if (!password.trim()) {
      return setAlert({ type: "error", message: "Password is required" });
    }
    if (password.length < 8) {
      return setAlert({ type: "error", message: "Password must be at least 8 characters long" });
    }
    if (!confirmPassword.trim()) {
      return setAlert({ type: "error", message: "Please confirm your password" });
    }
    if (password !== confirmPassword) {
      return setAlert({ type: "error", message: "Passwords do not match" });
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/reset-password/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      authToast.success("Password reset successfully");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setAlert({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4">
        <AuthAlert
          type="error"
          message="This reset link is invalid or has expired."
        />
        <Link href="/password/forgotpassword" className={`${visitorBtnPrimary} inline-flex`}>
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <>
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
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (alert) setAlert(null);
            }}
            className={visitorInput}
            placeholder="New password"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (alert) setAlert(null);
            }}
            className={visitorInput}
            placeholder="Confirm password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`${visitorBtnPrimary} w-full ${loading ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthPageShell
      title="Reset Password"
      subtitle="Create a new secure password for your account."
      heroTitle="Set a new password."
      heroDescription="Choose a strong password to keep your StreamSphere account secure."
    >
      <Suspense
        fallback={
          <p className="text-center text-sm text-zinc-400">Loading reset form...</p>
        }
      >
        <ResetPasswordForm />
      </Suspense>

      <div className="mt-6 text-center text-sm text-zinc-400">
        <Link href="/login" className="font-medium text-white hover:text-[rgb(215,55,45)]">
          Back to login
        </Link>
      </div>
    </AuthPageShell>
  );
}
