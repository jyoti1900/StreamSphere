"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

type AdminAlertProps = {
  type: "error" | "success";
  message: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
};

const styles = {
  error: {
    container: "border-[rgba(215,55,45,0.35)] bg-[rgba(65,15,15,0.3)]",
    icon: "text-[rgb(215,55,45)]",
    title: "text-[rgb(215,55,45)]",
    bar: "linear-gradient(to right, rgb(175,35,30), rgb(215,55,45))",
  },
  success: {
    container: "border-[rgba(34,197,94,0.35)] bg-[rgba(22,101,52,0.2)]",
    icon: "text-green-400",
    title: "text-green-400",
    bar: "linear-gradient(to right, rgb(22,101,52), rgb(34,197,94))",
  },
};

export default function AdminAlert({
  type,
  message,
  onDismiss,
  autoDismissMs,
}: AdminAlertProps) {
  const style = styles[type];
  const Icon = type === "error" ? AlertCircle : CheckCircle;

  useEffect(() => {
    if (!autoDismissMs || !onDismiss) return;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss, message]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${style.container}`}
      role="alert"
    >
      <div className="h-0.5 w-full" style={{ background: style.bar }} />
      <div className="flex items-start gap-3 p-4">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${style.title}`}>
            {type === "error" ? "Error" : "Success"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-200">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-lg p-1 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
