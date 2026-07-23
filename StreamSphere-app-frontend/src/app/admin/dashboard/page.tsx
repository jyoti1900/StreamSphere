"use client";

import { useRouter } from "next/navigation";
import { Film, FolderOpen, Users, CreditCard, ArrowUpRight, Server } from "lucide-react";
import { adminCard, adminPageSubtitle } from "../adminStyles";
import { ADMIN_API_BASE_URL } from "../lib/adminApi";

const SECTIONS = [
  {
    title: "Movies",
    description: "Upload, edit, and manage your streaming catalog.",
    href: "/admin/movies",
    icon: Film,
    accent: "from-red-600/20 to-orange-600/10",
    iconColor: "text-red-400",
  },
  {
    title: "Categories",
    description: "Organize titles into browsable collections.",
    href: "/admin/categories",
    icon: FolderOpen,
    accent: "from-blue-600/20 to-cyan-600/10",
    iconColor: "text-blue-400",
  },
  {
    title: "Users",
    description: "View accounts, roles, and access details.",
    href: "/admin/users",
    icon: Users,
    accent: "from-violet-600/20 to-purple-600/10",
    iconColor: "text-violet-400",
  },
  {
    title: "Payments",
    description: "Track subscriptions and transaction history.",
    href: "/admin/payment",
    icon: CreditCard,
    accent: "from-emerald-600/20 to-green-600/10",
    iconColor: "text-emerald-400",
  },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <p className={adminPageSubtitle}>Welcome back — here&apos;s your control center.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SECTIONS.map(({ title, description, href, icon: Icon, accent, iconColor }) => (
          <button
            key={href}
            type="button"
            onClick={() => router.push(href)}
            className={`group ${adminCard} relative overflow-hidden p-6 text-left transition hover:-translate-y-0.5 hover:border-white/20`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`} />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-xl bg-zinc-800/80 p-3 ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 transition group-hover:text-zinc-300" />
              </div>
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className={`${adminCard} p-6 lg:p-8`}>
        <h3 className="text-lg font-semibold text-white">Quick overview</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Use the navigation bar to jump between modules. Manage movie uploads, category posters,
          registered users, and payment records from a single modern admin workspace.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {["Content ready to publish", "User activity monitored", "Payments under review"].map(
            (item) => (
              <div
                key={item}
                className="rounded-xl border border-white/5 bg-zinc-800/30 px-4 py-3 text-sm text-zinc-300"
              >
                {item}
              </div>
            )
          )}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-zinc-800/30 px-4 py-3">
          <Server className="h-4 w-4 shrink-0 text-red-400" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-zinc-500">API Server</p>
            <a
              href={ADMIN_API_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm text-red-400 transition hover:text-red-300 hover:underline"
            >
              {ADMIN_API_BASE_URL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
