"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X, Home, Search, Film, DollarSign, User, Library } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { visitorAvatar } from "@/styles/brandColors";

const navItems = [
  { icon: Home, label: "Home", path: "/visitor", id: "home" },
  { icon: Search, label: "Search", path: "/visitor/search", id: "search" },
  { icon: Film, label: "Categories", path: "/visitor/category", id: "category" },
  { icon: Library, label: "My Library", path: "/visitor/library", id: "library" },
  { icon: DollarSign, label: "Payment", path: "/visitor/payment", id: "payment" },
];

type SideNavbarProps = {
  onProfileClick?: () => void;
};

function isActivePath(pathname: string, path: string) {
  if (path === "/visitor") return pathname === "/visitor";
  return pathname.startsWith(path);
}

export default function SideNavbar({ onProfileClick }: SideNavbarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleNavigation = (item: (typeof navItems)[number]) => {
    router.push(item.path);
    setOpen(false);
  };

  const handleProfileAction = () => {
    if (user) {
      router.push("/visitor/profile");
    } else {
      onProfileClick?.();
    }
    setOpen(false);
  };

  const fallbackUsername = user?.email ? user.email.split("@")[0] : "";
  const userInitial = fallbackUsername ? fallbackUsername.charAt(0).toUpperCase() : "U";
  const displayWelcomeName =
    user?.firstName ||
    (fallbackUsername
      ? fallbackUsername.charAt(0).toUpperCase() + fallbackUsername.slice(1)
      : "User");

  const profileActive = pathname.startsWith("/visitor/profile");

  const navButtonClass = (active: boolean) =>
    `flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
      active
        ? "border-[rgba(215,55,45,0.45)] bg-gradient-to-br from-[rgb(175,35,30)] to-[rgb(215,55,45)] text-white shadow-lg shadow-[rgba(65,15,15,0.4)] scale-105"
        : "border-transparent text-zinc-400 hover:border-[rgba(215,55,45,0.25)] hover:bg-[rgba(175,35,30,0.15)] hover:text-[rgb(215,55,45)] hover:scale-110"
    }`;

  const mobileNavClass = (active: boolean) =>
    `flex cursor-pointer items-center gap-4 rounded-xl px-3 py-3 transition ${
      active
        ? "border border-[rgba(215,55,45,0.35)] bg-[rgba(175,35,30,0.2)] text-[rgb(215,55,45)]"
        : "text-zinc-300 hover:bg-[rgba(175,35,30,0.1)] hover:text-[rgb(215,55,45)]"
    }`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden">
        <div
          className="flex items-center justify-between px-4 py-3 backdrop-blur-xl"
          style={{ background: "rgba(9, 9, 11, 0.9)" }}
        >
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 text-white transition hover:border-[rgba(215,55,45,0.35)] hover:bg-[rgba(175,35,30,0.15)] hover:text-[rgb(215,55,45)]"
          >
            <Menu size={20} />
          </button>

          <div className="relative right-1 h-8 w-28">
            <Image
              src="/logo/streamsphere-logo.png"
              alt="StreamSphere Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgb(175,35,30), rgb(215,55,45), transparent)",
          }}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col items-center border-r border-white/5 py-6 backdrop-blur-xl md:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(65,15,15,0.2) 0%, rgba(9,9,11,0.95) 35%, rgb(9,9,11) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgb(215,55,45), rgb(175,35,30), transparent)",
          }}
        />

        <div className="relative mb-6 h-14 w-14">
          <div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ backgroundColor: "rgba(215, 55, 45, 0.12)" }}
          />
          <Image
            src="/logo/short-logo.png"
            alt="StreamSphere Logo"
            fill
            className="relative object-contain"
            priority
          />
        </div>

        <div className="relative mt-2 flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.path);

            return (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => handleNavigation(item)}
                  className={navButtonClass(active)}
                  aria-label={item.label}
                >
                  <item.icon size={20} />
                </button>

                <span
                  className="pointer-events-none absolute left-14 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[rgba(215,55,45,0.2)] bg-[rgb(18,18,20)] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                  style={{ boxShadow: "0 4px 20px rgba(65, 15, 15, 0.35)" }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative mt-auto mb-10 group">
          <button
            onClick={handleProfileAction}
            className={`${navButtonClass(profileActive)} ${!user ? "border-white/5" : ""}`}
            aria-label={user ? "My Profile" : "Sign In"}
          >
            {user ? (
              <div className={`h-10 w-10 text-sm ${visitorAvatar}`}>{userInitial}</div>
            ) : (
              <User size={26} />
            )}
          </button>

          <span
            className="pointer-events-none absolute left-14 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[rgba(215,55,45,0.2)] bg-[rgb(18,18,20)] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
            style={{ boxShadow: "0 4px 20px rgba(65, 15, 15, 0.35)" }}
          >
            {user ? "My Profile" : "Sign In"}
          </span>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 p-6"
            style={{
              background:
                "linear-gradient(160deg, rgba(65,15,15,0.35) 0%, rgb(12,12,14) 45%, rgb(9,9,11) 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(215,55,45), rgb(65,15,15))",
              }}
            />

            <div className="mb-8 flex items-center justify-between">
              <div className="relative h-10 w-32">
                <Image
                  src="/logo/streamsphere-logo.png"
                  alt="StreamSphere Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white transition hover:border-[rgba(215,55,45,0.35)] hover:bg-[rgba(175,35,30,0.2)] hover:text-[rgb(215,55,45)]"
              >
                <X size={18} />
              </button>
            </div>

            {user && (
              <div
                className="mb-6 rounded-xl border border-[rgba(215,55,45,0.2)] p-4"
                style={{
                  background:
                    "linear-gradient(to right, rgba(175,35,30,0.15), transparent)",
                }}
              >
                <p className="text-xs uppercase tracking-wider text-[rgb(215,55,45)]">
                  Welcome back
                </p>
                <p className="text-lg font-bold text-white">{displayWelcomeName}</p>
              </div>
            )}

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.path);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className={mobileNavClass(active)}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                );
              })}

              <div
                onClick={handleProfileAction}
                className={`mt-4 border-t border-white/10 pt-4 ${mobileNavClass(profileActive)}`}
              >
                {user ? (
                  <div className={`h-9 w-9 text-sm ${visitorAvatar}`}>{userInitial}</div>
                ) : (
                  <User size={24} />
                )}
                <span className="font-medium">{user ? "My Profile" : "Sign In"}</span>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
