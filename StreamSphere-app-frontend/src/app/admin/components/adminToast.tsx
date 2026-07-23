"use client";

import toast from "react-hot-toast";
import { AlertCircle, CheckCircle, X } from "lucide-react";

function AdminToastContent({
  type,
  message,
  visible,
  onDismiss,
}: {
  type: "error" | "success";
  message: string;
  visible: boolean;
  onDismiss: () => void;
}) {
  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle;

  return (
    <div
      className={`pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${
        isError
          ? "border-[rgba(215,55,45,0.35)] bg-[rgba(24,24,27,0.95)]"
          : "border-[rgba(34,197,94,0.35)] bg-[rgba(24,24,27,0.95)]"
      }`}
    >
      <div
        className="w-1 shrink-0"
        style={{
          background: isError
            ? "linear-gradient(to bottom, rgb(215,55,45), rgb(65,15,15))"
            : "linear-gradient(to bottom, rgb(34,197,94), rgb(22,101,52))",
        }}
      />
      <div className="flex flex-1 items-start gap-3 p-4">
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${isError ? "text-[rgb(215,55,45)]" : "text-green-400"}`}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              isError ? "text-[rgb(215,55,45)]" : "text-green-400"
            }`}
          >
            {isError ? "Error" : "Success"}
          </p>
          <p className="mt-1 text-sm text-zinc-200">{message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

const ERROR_HINTS = [
  "fail",
  "error",
  "invalid",
  "required",
  "cannot",
  "unable",
  "reject",
  "network",
  "missing",
  "please select",
  "please upload",
  "only mp4",
  "no movie",
];

const SUCCESS_HINTS = [
  "success",
  "uploaded",
  "created",
  "updated",
  "added",
  "completed",
  "deleted successfully",
];

export function inferAdminToastType(message: string): "error" | "success" {
  const lower = message.toLowerCase();
  if (ERROR_HINTS.some((hint) => lower.includes(hint))) return "error";
  if (SUCCESS_HINTS.some((hint) => lower.includes(hint))) return "success";
  return "error";
}

export const adminToast = {
  error(message: string, duration = 4500) {
    toast.custom(
      (t) => (
        <AdminToastContent
          type="error"
          message={message}
          visible={t.visible}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration }
    );
  },
  success(message: string, duration = 3500) {
    toast.custom(
      (t) => (
        <AdminToastContent
          type="success"
          message={message}
          visible={t.visible}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration }
    );
  },
  show(message: string, type?: "error" | "success") {
    const resolved = type ?? inferAdminToastType(message);
    if (resolved === "success") adminToast.success(message);
    else adminToast.error(message);
  },
};
