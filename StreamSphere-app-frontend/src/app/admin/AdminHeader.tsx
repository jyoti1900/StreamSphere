"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Film, FolderOpen, Users, CreditCard, LayoutDashboard } from "lucide-react";
import { clearAdminSession } from "./lib/adminApi";
const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/movies", label: "Movies", icon: Film },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payment", label: "Payments", icon: CreditCard },
];

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  const pageTitle = pathname
    .replace("/admin", "")
    .split("/")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

  const title = pageTitle || "Dashboard";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/admin/dashboard" className="flex shrink-0 items-center gap-3">
          <div className="relative h-10 w-8">
            <Image
              src="/logo/short-logo.png"
              alt="StreamSphere Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">            <p className="text-sm font-bold text-white">StreamSphere</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Admin</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-red-600/15 text-red-400 ring-1 ring-red-500/30"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-right lg:block">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">{today}</p>
            <p className="text-sm font-semibold text-white">{title}</p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-600/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 md:hidden">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                active ? "bg-red-600/20 text-red-400" : "text-zinc-400"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
