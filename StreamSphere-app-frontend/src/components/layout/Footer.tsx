import Image from "next/image";
import Link from "next/link";
import { visitorTextAccent } from "@/styles/brandColors";

const linkClass =
  "text-zinc-400 transition hover:text-[rgb(215,55,45)]";

const sections = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/footer/aboutus" },
      { label: "Careers", href: "/footer/careers" },
      { label: "Press", href: "/footer/press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/footer/helpcenter" },
      { label: "Contact Us", href: "/footer/contactus" },
      { label: "FAQ", href: "/footer/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/footer/privacypolicy" },
      { label: "Terms of Use", href: "/footer/termsofuse" },
      { label: "Cookies", href: "/footer/cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/5">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(65,15,15,0.25) 0%, rgb(9,9,11) 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-0 h-48 w-48 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(215, 55, 45, 0.08)" }}
      />

      <div
        className="relative h-0.5 w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgb(175,35,30), rgb(215,55,45), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/visitor" className="inline-block">
              <Image
                src="/logo/streamsphere-logo.png"
                alt="StreamSphere"
                width={180}
                height={52}
                className="mb-4 object-contain"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              A modern streaming platform built for cinema lovers and creators.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="h-4 w-0.5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgb(215,55,45), rgb(65,15,15))",
                  }}
                />
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <span className="text-sm text-zinc-500">
            © {new Date().getFullYear()}{" "}
            <span className={visitorTextAccent}>StreamSphere</span>. All rights
            reserved.
          </span>
          <p className="text-xs text-zinc-600">
            Stream. Discover. Enjoy.
          </p>
        </div>
      </div>
    </footer>
  );
}
