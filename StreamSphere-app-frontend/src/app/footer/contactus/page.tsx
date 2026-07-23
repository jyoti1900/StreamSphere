"use client";

import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, MessageSquare } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Footer from "@/components/layout/Footer";
import { API_BASE_URL } from "@/context/AuthContext";

const SUPPORT_EMAIL = "streamsphere1234@gmail.com";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const timerRef = useRef<number | null>(null);

  const showTemporaryMessage = (msg: string, errorFlag: boolean) => {
    setResponseMessage(msg);
    setIsError(errorFlag);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setResponseMessage(null);
      timerRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to send message",
        );
      }

      showTemporaryMessage("Message sent successfully!", false);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Contact Form Error:", error);
      showTemporaryMessage(error.message || "Something went wrong", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "w-full min-h-[48px] rounded-2xl border border-zinc-800 bg-black/60 px-4 py-3 text-[15px] text-white placeholder:text-zinc-500 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-red-900/30 to-black px-6 pt-16 pb-8 sm:px-10 sm:pt-20 sm:pb-1 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.14),_transparent_40%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Breadcrumb */}
          {/* <nav className="mb-6 text-sm text-zinc-400" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-red-400">
                  Home
                </Link>
              </li>

              <li className="text-zinc-600">/</li>

              <li>
                <Link
                  href="/footer/helpcenter"
                  className="transition hover:text-red-400"
                >
                  Help Center
                </Link>
              </li>

              <li className="text-zinc-600">/</li>

              <li className="font-medium text-white">Contact us</li>
            </ol>
          </nav> */}

          {/* Hero Content */}
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-red-500 sm:text-sm">
              Get in touch
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Contact us
            </h1>

            <p className="text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              Questions, billing, playback, or feedback — send a message and we
              will route it to the right team.
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-16 sm:px-10 sm:pt-10 sm:pb-20 lg:px-16 lg:pb-24">
        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* LEFT SIDE */}
          <aside className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/85 via-zinc-950 to-black shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/[0.07] blur-3xl"
                aria-hidden
              />

              <div className="relative p-8 sm:p-9 lg:p-10">
                {/* Heading */}
                <header>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500 sm:text-sm">
                    Ways to reach us
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    StreamSphere support
                  </h2>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
                    One team across email and tickets — clear channels, quick
                    follow-ups.
                  </p>
                </header>

                {/* Support Items */}
                <div className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
                  {[
                    {
                      icon: Mail,
                      title: "Email",
                      content: (
                        <>
                          <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=streamsphere1234@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block break-all text-[15px] font-medium text-red-500 underline-offset-2 transition hover:text-red-400 hover:underline"
                          >
                            {SUPPORT_EMAIL}
                          </a>

                          <p className="text-sm leading-6 text-zinc-500">
                            Typical reply within 24 hours
                          </p>
                        </>
                      ),
                    },
                    {
                      icon: MapPin,
                      title: "Office",
                      content: (
                        <>
                          <p className="text-[15px] font-medium text-zinc-100">
                            StreamSphere HQ
                          </p>

                          <p className="text-sm leading-6 text-zinc-500">
                            NewTown, Sector V, Kolkata — 700003
                          </p>
                        </>
                      ),
                    },
                    {
                      icon: Clock,
                      title: "Support hours",
                      content: (
                        <>
                          <p className="text-[15px] font-medium text-zinc-100">
                            24 / 7 email coverage
                          </p>

                          <p className="text-sm leading-6 text-zinc-500">
                            Write any time — we monitor the inbox continuously.
                          </p>
                        </>
                      ),
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="group">
                        <div className="flex gap-4 sm:gap-5">
                          <div className="flex shrink-0 items-start pt-0.5">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-600/90 bg-zinc-950 text-red-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition group-hover:border-red-500/30 group-hover:text-red-400">
                              <Icon
                                className="h-5 w-5"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-white sm:text-lg">
                              {item.title}
                            </h3>

                            <div className="mt-2.5 space-y-1.5">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE - FORM */}
          <section className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-red-500/35 bg-gradient-to-b from-zinc-900/95 to-black p-6 shadow-[0_0_80px_rgba(239,68,68,0.14)] sm:p-8 lg:p-10">
              {/* Glow */}
              <div
                className="pointer-events-none absolute -top-20 right-0 h-44 w-44 rounded-full bg-red-500/20 blur-3xl sm:right-8"
                aria-hidden
              />

              {/* Heading */}
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
                  Write to us
                </p>

                <h2 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  <MessageSquare
                    className="h-7 w-7 shrink-0 text-red-500"
                    aria-hidden
                  />

                  <span>Send a message</span>
                </h2>

                <p className="max-w-xl text-sm leading-6 text-zinc-400">
                  Include your account email if the issue is about billing or
                  sign-in — it helps us verify you safely.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Full name
                    </label>

                    <input
                      id="fullName"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={fieldClass}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={fieldClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe the issue or question in a few sentences..."
                    className={`${fieldClass} min-h-[160px] resize-y py-3`}
                    required
                  />
                </div>

                {/* Custom Alert */}
                {responseMessage && (
                  <div
                    className={`mb-2 rounded-2xl border px-4 py-3 text-sm font-medium ${isError
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-green-500/30 bg-green-500/10 text-green-400"
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      <span>
                        {isError ? "❌" : "✅"}
                      </span>

                      <span>{responseMessage}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 text-sm font-semibold text-black transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-black/25 border-t-black"
                        aria-hidden
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-zinc-500">
                  We use your details only to respond. We never sell your
                  information.
                </p>
              </form>
            </div>
          </section>
        </div>

        {/* Quick Links */}
        <section className="mt-16 space-y-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-red-500">
                Self-serve
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Need quick help?
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-400">
              Many answers are already documented — open Help Center or FAQ
              before you wait on email.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              {
                title: "Help Center",
                desc: "Guides, topics, troubleshooting.",
                href: "/footer/helpcenter",
              },
              {
                title: "FAQ",
                desc: "Short answers to common questions.",
                href: "/footer/faq",
              },
              {
                title: "Cookies",
                desc: "How we use cookies on StreamSphere.",
                href: "/footer/cookies",
              },
              {
                title: "Privacy",
                desc: "How we handle your data.",
                href: "/footer/privacypolicy",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-3xl border border-zinc-700/80 bg-zinc-900/90 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-red-500/40 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-red-400">
                  {card.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {card.desc}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-500">
                  Open
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative mt-20 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950/80 to-black px-6 py-12 text-center sm:mt-24 sm:px-12 sm:py-16 lg:mt-28">
          {/* Glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-red-500/5 blur-3xl"
            aria-hidden
          />

          <h2 className="relative text-2xl font-semibold tracking-tight sm:text-3xl">
            We are here to help
          </h2>

          <p className="relative mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:mt-5 sm:text-base sm:leading-8">
            Prefer email? Tap below — same inbox as the form, fastest path for
            account-sensitive requests.
          </p>

          <div className="relative mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-4">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=streamsphere1234@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full min-h-[3.25rem] items-center justify-center rounded-2xl bg-red-500 px-12 py-4 text-[17px] font-semibold text-black transition hover:bg-red-400 sm:w-auto sm:min-w-[12.5rem] sm:px-14 sm:py-[1.125rem]"
            >
              Email support
            </a>

            <Link
              href="/footer/faq"
              className="inline-flex w-full min-h-[3.25rem] items-center justify-center rounded-2xl border-2 border-zinc-600 bg-zinc-950/50 px-12 py-4 text-[17px] font-semibold text-white transition hover:border-red-500/55 hover:text-red-400 sm:w-auto sm:min-w-[12.5rem] sm:px-14 sm:py-[1.125rem]"
            >
              Browse FAQ
            </Link>
          </div>
        </section>
      </div>

      {/* Footer Links */}
      <Footer />
    </main>
  );
}
