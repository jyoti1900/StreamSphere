"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { adminBtnPrimary, adminInput, adminBrandGradient } from "../adminStyles";
import AdminAlert from "../components/AdminAlert";
import { adminLogin, setAdminSession, ADMIN_API_BASE_URL } from "../lib/adminApi";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { accessToken, admin } = await adminLogin(email.trim(), password);
      setAdminSession(accessToken, admin);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid admin credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(215, 55, 45, 0.14) 0%, transparent 55%), radial-gradient(ellipse at bottom right, rgba(65, 15, 15, 0.2) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(175, 35, 30, 0.12)" }}
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(65, 15, 15, 0.25)" }}
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        <div className={`hidden flex-col justify-between p-10 lg:flex ${adminBrandGradient}`}>
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-11">
              <Image
                src="/logo/short-logo.png"
                alt="StreamSphere Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div>
              <p className="text-lg font-bold text-white">StreamSphere</p>
              <p
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "rgba(255, 255, 255, 0.75)" }}
              >
                Admin Portal
              </p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold leading-tight text-white">
              Manage your streaming platform with confidence.
            </h1>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Secure access to movies, categories, users, and payments — all in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            <ShieldCheck className="h-4 w-4" />
            Authorized personnel only
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 lg:p-10">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-10">
                <Image
                  src="/logo/short-logo.png"
                  alt="StreamSphere Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className="font-bold text-white">StreamSphere Admin</p>
                <p className="text-xs text-zinc-500">Sign in to continue</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="mt-2 text-sm text-zinc-400">Sign in with your admin email and password.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={adminInput}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={adminInput}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <AdminAlert type="error" message={error} onDismiss={() => setError("")} />
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${adminBtnPrimary} flex w-full items-center justify-center py-3 disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
