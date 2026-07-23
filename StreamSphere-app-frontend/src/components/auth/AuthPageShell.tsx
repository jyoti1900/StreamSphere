"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, X } from "lucide-react";
import {
  brandGradientBr,
  visitorPage,
  visitorShellGlow,
  visitorSurface,
} from "@/styles/brandColors";

type AuthPageShellProps = {
  title: string;
  subtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  closeHref?: string;
  children: ReactNode;
};

export default function AuthPageShell({
  title,
  subtitle,
  heroTitle = "Your next favorite story is waiting.",
  heroDescription = "Sign in to StreamSphere and pick up where you left off — movies, series, and your personal library in one place.",
  closeHref,
  children,
}: AuthPageShellProps) {
  const router = useRouter();

  return (
    <div className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 ${visitorPage}`}>
      <div className={visitorShellGlow} />
      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(175, 35, 30, 0.12)" }}
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(65, 15, 15, 0.25)" }}
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[rgba(24,24,27,0.55)] shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        {closeHref && (
          <button
            type="button"
            onClick={() => router.push(closeHref)}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:border-[rgba(215,55,45,0.35)] hover:bg-[rgba(175,35,30,0.2)] hover:text-[rgb(215,55,45)]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
        <div className={`hidden flex-col justify-between p-10 lg:flex ${brandGradientBr}`}>
          <Link href="/visitor" className="flex items-center gap-4">
            <div className="relative h-14 w-11">
              <Image
                src="/logo/short-logo.png"
                alt="StreamSphere Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div>
              <p className="text-lg font-bold text-white">StreamSphere</p>
              <p
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "rgba(255, 255, 255, 0.75)" }}
              >
                Streaming Platform
              </p>
            </div>
          </Link>

          <div>
            <h1 className="text-3xl font-bold leading-tight text-white">{heroTitle}</h1>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              {heroDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            <ShieldCheck className="h-4 w-4" />
            Secure streaming experience
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Link href="/visitor" className="relative h-12 w-10">
              <Image
                src="/logo/short-logo.png"
                alt="StreamSphere Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
            <div>
              <p className="font-bold text-white">StreamSphere</p>
              <p className="text-xs text-zinc-500">Welcome back</p>
            </div>
          </div>

          <div className={`${visitorSurface} p-6 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
