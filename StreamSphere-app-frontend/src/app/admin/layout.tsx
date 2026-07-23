"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminHeader from "./AdminHeader";
import { isAdminAuthenticated } from "./lib/adminApi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isAdminAuthenticated() && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(220,38,38,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.05),_transparent_50%)]" />

      <div className="relative flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
