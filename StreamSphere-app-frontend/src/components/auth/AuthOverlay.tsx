"use client";

import Image from "next/image";
import { X, User, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthAlert from "@/components/auth/AuthAlert";
import { authToast } from "@/components/auth/authToast";
import { useAuth, API_BASE_URL, parseLoginResponse } from "@/context/AuthContext";
import {
  visitorAvatar,
  visitorBtnPrimary,
  visitorInput,
  visitorTextAccent,
} from "@/styles/brandColors";

type AuthOverlayProps = {
  onClose: () => void;
};

export default function AuthOverlay({ onClose }: AuthOverlayProps) {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const handleRegisterRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/registration");
    setTimeout(() => onClose(), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setAlert({ type: "error", message: "Please enter a valid email address" });
    }
    if (!password.trim()) {
      return setAlert({ type: "error", message: "Password is required" });
    }
    if (password.length < 6) {
      return setAlert({ type: "error", message: "Password must be at least 6 characters long" });
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        let errorMessage = data?.message || "Login failed";
        if (typeof errorMessage !== "string") {
          errorMessage = Array.isArray(errorMessage) ? errorMessage.join(", ") : "Login failed";
        }
        if (errorMessage.includes("exist") || errorMessage.includes("Invalid")) {
          errorMessage = "Email or password is incorrect";
        } else if (errorMessage.includes("blocked")) {
          errorMessage = "Your account has been blocked. Please contact support.";
        } else if (data?.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.join(", ");
        }

        throw new Error(errorMessage);
      }

      const { token, userData } = parseLoginResponse(data, email);
      const didLogin = login(userData, token);

      if (!didLogin) {
        throw new Error("Login failed: could not save session");
      }

      const welcomeName =
        userData.firstName ||
        userData.email?.split("@")[0] ||
        email.split("@")[0] ||
        "User";
      authToast.success(`Welcome back, ${welcomeName}!`);

      setTimeout(() => {
        onClose();
        router.push("/visitor");
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setAlert({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.firstName || user?.data?.firstName || "";
  const lastName = user?.lastName || user?.data?.lastName || "";
  const displayName =
    `${firstName} ${lastName}`.trim() ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{
          background:
            "linear-gradient(160deg, rgba(65,15,15,0.3) 0%, rgba(24,24,27,0.95) 40%, rgb(18,18,20) 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(to right, rgb(175,35,30), rgb(215,55,45), rgb(175,35,30))",
          }}
        />

        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(215, 55, 45, 0.12)" }}
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:border-[rgba(215,55,45,0.35)] hover:bg-[rgba(175,35,30,0.2)] hover:text-[rgb(215,55,45)]"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="relative p-8 pt-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative h-11 w-9">
              <Image
                src="/logo/short-logo.png"
                alt="StreamSphere"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="font-bold text-white">StreamSphere</p>
              <p className="text-xs uppercase tracking-wider text-[rgb(215,55,45)]">
                Sign In
              </p>
            </div>
          </div>

          {user ? (
            <div className="py-2 text-center">
              <div
                className={`mx-auto mb-5 h-20 w-20 text-3xl ${visitorAvatar}`}
                style={{
                  backgroundColor: "rgba(175, 35, 30, 0.2)",
                  color: "rgb(215, 55, 45)",
                }}
              >
                <User size={36} />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Welcome, {displayName}!
              </h2>
              <p className="mb-8 text-sm text-zinc-400">You are currently signed in.</p>
              <button
                onClick={() => {
                  logout({ redirect: false });
                  onClose();
                  authToast.logoutSuccess();
                }}
                className={`${visitorBtnPrimary} w-full`}
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Enter your credentials to continue watching.
              </p>

              {alert && (
                <div className="mt-4">
                  <AuthAlert
                    type={alert.type}
                    message={alert.message}
                    onDismiss={() => setAlert(null)}
                  />
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
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
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (alert) setAlert(null);
                    }}
                    className={visitorInput}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/password/forgotpassword"
                    onClick={onClose}
                    className="text-sm text-zinc-400 transition hover:text-[rgb(215,55,45)]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${visitorBtnPrimary} mt-1 w-full ${loading ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-zinc-400">
                <span className="mr-2">New to StreamSphere?</span>
                <button
                  onClick={handleRegisterRedirect}
                  className="cursor-pointer font-medium text-white transition hover:text-[rgb(215,55,45)]"
                >
                  Sign up now
                </button>
                <p className="mt-5 text-xs text-zinc-500">
                  By continuing, you agree to our Terms of Use and Privacy Policy.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-zinc-500">
                <ShieldCheck className={`h-3.5 w-3.5 ${visitorTextAccent}`} />
                Secure streaming experience
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
