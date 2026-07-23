"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import { useAuth, API_BASE_URL, parseLoginResponse, AUTH_FLASH_KEY } from "@/context/AuthContext";
import AuthPageShell from "@/components/auth/AuthPageShell";
import AuthAlert from "@/components/auth/AuthAlert";
import { authToast, LOGOUT_SUCCESS_MESSAGE } from "@/components/auth/authToast";
import {
  visitorBtnPrimary,
  visitorInput,
  visitorAvatar,
} from "@/styles/brandColors";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(AUTH_FLASH_KEY);
    if (!raw) return;

    try {
      const flash = JSON.parse(raw) as { type?: "error" | "success"; message?: string };
      if (flash?.message === LOGOUT_SUCCESS_MESSAGE) {
        authToast.logoutSuccess();
      } else if (flash?.message && flash?.type) {
        setAlert({ type: flash.type, message: flash.message });
      }
    } catch {
      // ignore invalid flash payload
    } finally {
      sessionStorage.removeItem(AUTH_FLASH_KEY);
    }
  }, []);

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
        if (errorMessage.includes("not found") || errorMessage.includes("invalid")) {
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
        router.push("/visitor");
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setAlert({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email?.split("@")[0] ||
      "User"
    : "";

  return (
    <AuthPageShell
      title={user ? `Welcome, ${displayName}!` : "Sign In"}
      subtitle={
        user
          ? "You are currently signed in to StreamSphere."
          : "Enter your credentials to continue watching."
      }
      heroTitle="Welcome back to StreamSphere."
      heroDescription="Access your library, continue watching, and discover new titles curated for you."
      closeHref="/visitor"
    >
      {user ? (
        <div className="text-center">
          <div
            className={`mx-auto mb-6 h-20 w-20 text-3xl ${visitorAvatar}`}
            style={{ backgroundColor: "rgba(175, 35, 30, 0.2)", color: "rgb(215, 55, 45)" }}
          >
            <User size={36} />
          </div>
          <button
            onClick={() => {
              logout({ redirect: false });
              authToast.logoutSuccess();
            }}
            className={`${visitorBtnPrimary} w-full`}
          >
            Log Out
          </button>
        </div>
      ) : (
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

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                className="text-sm text-zinc-400 transition hover:text-[rgb(215,55,45)]"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`${visitorBtnPrimary} w-full ${loading ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <Lock className="mr-2 h-4 w-4" />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-400">
            <span className="mr-2">New to StreamSphere?</span>
            <Link href="/registration" className="font-medium text-white hover:text-[rgb(215,55,45)]">
              Sign up now
            </Link>
            <p className="mt-4 text-xs text-zinc-500">
              By continuing, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </>
      )}
    </AuthPageShell>
  );
}
