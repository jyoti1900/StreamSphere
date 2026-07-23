"use client";

import { useState, ReactNode } from "react";
import SideNavbar from "./SideNavbar";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { visitorShellBg, visitorShellGlow } from "@/styles/brandColors";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className={visitorShellBg}>
      <div className={visitorShellGlow} />

      <div className="relative flex">
        <SideNavbar onProfileClick={() => setShowAuth(true)} />

        <main className="w-full min-w-0 overflow-visible pt-14 md:ml-20 md:pt-0">
          {children}
        </main>
      </div>

      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
    </div>
  );
}
