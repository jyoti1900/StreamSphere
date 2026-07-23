"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  LogOut,
  Shield,
  Phone,
  CalendarDays,
  Crown,
  CreditCard,
  History,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { useAuth, AUTH_FLASH_KEY } from "@/context/AuthContext";
import { LOGOUT_SUCCESS_MESSAGE } from "@/components/auth/authToast";
import { fetchPlanHistory, type PlanHistoryItem } from "@/lib/payment";
import {
  getSubscriptionExpiresAt,
  getSubscriptionPlanLabel,
  getSubscriptionStatus,
} from "@/lib/premium";
import { updateUserProfile } from "@/lib/userAccount";
import {
  visitorAvatar,
  visitorBtnOutline,
  visitorBtnPrimary,
  visitorPage,
  visitorSurface,
  visitorTextAccent,
} from "@/styles/brandColors";

function getDisplayName(user: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;

  if (user.email) {
    const username = user.email.split("@")[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  }

  return "User";
}

function getUserInitial(user: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  if (user.firstName) return user.firstName.charAt(0).toUpperCase();
  if (user.lastName) return user.lastName.charAt(0).toUpperCase();
  return getDisplayName(user).charAt(0).toUpperCase();
}

function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusLabel(status: PlanHistoryItem["status"]) {
  if (status === "paid") return "Paid";
  if (status === "failed") return "Failed";
  return "Pending";
}

function statusClass(status: PlanHistoryItem["status"]) {
  if (status === "paid") {
    return "border-[rgba(34,197,94,0.35)] bg-[rgba(22,101,52,0.2)] text-green-400";
  }
  if (status === "failed") {
    return "border-[rgba(215,55,45,0.35)] bg-[rgba(65,15,15,0.25)] text-[rgb(215,55,45)]";
  }
  return "border-white/10 bg-white/5 text-zinc-400";
}

export default function ProfilePage() {
  const { user, token, isReady, logout, updateUser } = useAuth();
  const [planHistory, setPlanHistory] = useState<PlanHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!token) {
      setHistoryLoading(false);
      return;
    }

    let active = true;

    fetchPlanHistory(token)
      .then((data) => {
        if (active) setPlanHistory(data);
      })
      .finally(() => {
        if (active) setHistoryLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (!isReady) {
    return (
      <div className={`${visitorPage} flex items-center justify-center`}>
        <p className="animate-pulse text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${visitorPage} flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6`}>
        <p className="text-zinc-400">Please sign in to view your profile.</p>
        <Link href="/login" className={visitorBtnPrimary}>
          Sign In
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    sessionStorage.setItem(
      AUTH_FLASH_KEY,
      JSON.stringify({ message: LOGOUT_SUCCESS_MESSAGE })
    );
    logout();
  };

  const openEdit = () => {
    setEditError(null);
    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (editSaving) return;
    setEditOpen(false);
    setEditError(null);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setEditError("You are not logged in.");
      return;
    }

    setEditSaving(true);
    setEditError(null);

    try {
      const payload: Record<string, string> = {};
      const trimmedFirstName = editForm.firstName.trim();
      const trimmedLastName = editForm.lastName.trim();
      const trimmedEmail = editForm.email.trim();
      const trimmedPhone = editForm.phone.trim();

      if (trimmedFirstName && trimmedFirstName !== (user?.firstName || "")) payload.firstName = trimmedFirstName;
      if (trimmedLastName && trimmedLastName !== (user?.lastName || "")) payload.lastName = trimmedLastName;
      if (trimmedEmail && trimmedEmail !== (user?.email || "")) payload.email = trimmedEmail;
      if (trimmedPhone && trimmedPhone !== (user?.phone || "")) payload.phone = trimmedPhone;

      if (Object.keys(payload).length === 0) {
        closeEdit();
        return;
      }

      await updateUserProfile(token, payload);
      updateUser(payload);
      closeEdit();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setEditSaving(false);
    }
  };

  const displayName = getDisplayName(user);
  const userInitial = getUserInitial(user);

  const subscriptionStatus = getSubscriptionStatus(user);
  const planName = getSubscriptionPlanLabel(user);
  const expiryDate = getSubscriptionExpiresAt(user);
  const formattedExpiry = formatDate(expiryDate);

  const planStatusLabel =
    subscriptionStatus === "active"
      ? "Active"
      : subscriptionStatus === "expired"
        ? "Expired"
        : "No Plan";

  const planStatusClass =
    subscriptionStatus === "active"
      ? "border-[rgba(34,197,94,0.35)] bg-[rgba(22,101,52,0.2)] text-green-400"
      : subscriptionStatus === "expired"
        ? "border-[rgba(215,55,45,0.35)] bg-[rgba(65,15,15,0.25)] text-[rgb(215,55,45)]"
        : "border-white/10 bg-white/5 text-zinc-400";

  const planMessage =
    subscriptionStatus === "active"
      ? `Valid until ${formattedExpiry}`
      : subscriptionStatus === "expired"
        ? `Expired on ${formattedExpiry}`
        : "No active premium plan. Upgrade to unlock 1080p and 4K streaming.";

  const currentPlanTitle =
    subscriptionStatus === "active" && planName
      ? planName
      : subscriptionStatus === "expired" && planName
        ? planName
        : "Free Plan";

  return (
    <div className={`${visitorPage} mx-auto max-w-4xl px-4 pt-28 md:px-8`}>
      <h1 className="mb-8 text-3xl font-bold text-white">My Account</h1>

      <div className={`${visitorSurface} relative overflow-hidden p-8 shadow-2xl`}>
        <div
          className="pointer-events-none absolute left-0 top-0 h-32 w-full"
          style={{
            background: "linear-gradient(to right, rgba(65, 15, 15, 0.35), transparent)",
          }}
        />

        <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className={`h-24 w-24 min-w-[6rem] text-4xl ${visitorAvatar}`}>{userInitial}</div>

          <div className="w-full flex-1">
            <h2 className="mb-1 text-2xl font-bold text-white">{displayName}</h2>

            <div className="mb-4 flex items-center gap-2 text-zinc-400">
              <Shield size={16} className={visitorTextAccent} />
              <span className="text-sm uppercase tracking-wider">{user.role || "Viewer"} Account</span>
            </div>

            <div className="space-y-3 rounded-xl border border-white/5 bg-[rgba(9,9,11,0.5)] p-4">
              <div className="flex items-center gap-3 text-zinc-300">
                <User size={18} className="text-zinc-500" />
                <span>{displayName}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <Mail size={18} className="text-zinc-500" />
                <span className="break-all">{user.email || "No email provided"}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-zinc-300">
                  <Phone size={18} className="text-zinc-500" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 w-full md:mt-0 md:w-auto">
            <div className="flex w-full flex-col gap-3 md:w-auto">
              <button
                onClick={openEdit}
                className={`${visitorBtnPrimary} w-full gap-2 md:w-auto`}
              >
                <Pencil size={18} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className={`${visitorBtnOutline} w-full gap-2 md:w-auto`}
                style={{
                  backgroundColor: "rgba(175, 35, 30, 0.1)",
                  borderColor: "rgba(215, 55, 45, 0.35)",
                }}
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${visitorSurface} mt-8 p-8 shadow-2xl`}>
        <div className="mb-6 flex items-center gap-3">
          <Crown className={`h-5 w-5 ${visitorTextAccent}`} />
          <h2 className="text-xl font-bold text-white">Current Plan</h2>
        </div>

        <div className="rounded-xl border border-white/5 bg-[rgba(9,9,11,0.5)] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-zinc-500">Subscription</p>
              <p className="mt-1 text-lg font-semibold text-white">{currentPlanTitle}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                <CalendarDays size={16} />
                <span>{planMessage}</span>
              </div>
              {expiryDate && subscriptionStatus !== "none" && (
                <p className="mt-2 text-xs text-zinc-500">
                  Expiry date: {formattedExpiry}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${planStatusClass}`}
              >
                {planStatusLabel}
              </span>

              {subscriptionStatus !== "active" && (
                <Link href="/visitor/payment" className={visitorBtnPrimary}>
                  {subscriptionStatus === "expired" ? "Renew Premium" : "Upgrade to Premium"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`${visitorSurface} mt-8 p-8 shadow-2xl`}>
        <div className="mb-6 flex items-center gap-3">
          <History className={`h-5 w-5 ${visitorTextAccent}`} />
          <h2 className="text-xl font-bold text-white">Plan History</h2>
        </div>

        {historyLoading ? (
          <p className="text-sm text-zinc-500">Loading plan history...</p>
        ) : planHistory.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-[rgba(9,9,11,0.35)] p-8 text-center">
            <CreditCard className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
            <p className="text-zinc-400">No plan history found.</p>
            <p className="mt-1 text-sm text-zinc-500">
              You have not purchased a premium plan yet.
            </p>
            <Link href="/visitor/payment" className={`${visitorBtnPrimary} mt-4 inline-block`}>
              View Plans
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {planHistory.map((item, index) => (
              <div
                key={`${item.date}-${item.amount}-${index}`}
                className="rounded-xl border border-white/5 bg-[rgba(9,9,11,0.5)] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{item.user}</p>
                    <p className="mt-1 text-sm text-zinc-500">{item.email}</p>
                    <p className="mt-1 text-xs text-zinc-600">{formatDate(item.date)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {item.method && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        {item.method.toUpperCase()}
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                    <span className={`text-sm font-semibold ${visitorTextAccent}`}>{item.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[rgb(12,12,14)] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Edit Profile</h3>
                <p className="text-sm text-zinc-500">Update your account details.</p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-[rgba(215,55,45,0.35)] hover:bg-[rgba(175,35,30,0.15)] hover:text-white"
                aria-label="Close edit profile"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                    First name
                  </label>
                  <input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[rgba(215,55,45,0.35)] focus:bg-[rgba(9,9,11,0.6)]"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Last name
                  </label>
                  <input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[rgba(215,55,45,0.35)] focus:bg-[rgba(9,9,11,0.6)]"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[rgba(215,55,45,0.35)] focus:bg-[rgba(9,9,11,0.6)]"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Phone
                </label>
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[rgba(215,55,45,0.35)] focus:bg-[rgba(9,9,11,0.6)]"
                  placeholder="Phone"
                />
              </div>

              {editError && (
                <div className="rounded-xl border border-[rgba(215,55,45,0.35)] bg-[rgba(65,15,15,0.25)] px-4 py-3 text-sm text-[rgb(215,55,45)]">
                  {editError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={editSaving}
                  className={`${visitorBtnOutline} w-full justify-center sm:w-auto`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className={`${visitorBtnPrimary} w-full justify-center gap-2 disabled:opacity-70 sm:w-auto`}
                >
                  <Save size={18} />
                  {editSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
