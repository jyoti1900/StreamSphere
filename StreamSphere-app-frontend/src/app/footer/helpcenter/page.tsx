import Footer from "@/components/layout/Footer";

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-red-900/30 to-black px-6 py-16 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.12),_transparent_35%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-red-500">
                StreamSphere Support
              </p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                How can we help?
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                Browse expert guidance for streaming, billing, device setup, and account support across all your favorite devices.
              </p>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                <label htmlFor="support-search" className="sr-only">
                  Search help articles
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-black px-4 py-3 transition hover:border-red-500">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    id="support-search"
                    type="search"
                    placeholder="Type a question, topic or issue"
                    className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
                  <span>Recommended for you:</span>
                  <a href="#" className="font-medium text-white transition hover:text-red-400">
                    How to sign up for StreamSphere
                  </a>
                  <span className="text-zinc-600">·</span>
                  <a href="#" className="font-medium text-white transition hover:text-red-400">
                    Plans and pricing
                  </a>
                  <span className="text-zinc-600">·</span>
                  <a href="#" className="font-medium text-white transition hover:text-red-400">
                    Parental controls
                  </a>
                </div>
              </div>
            </div>
            <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl sm:p-8">
              <div className="rounded-3xl bg-zinc-950/70 p-5">
                <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-400">Fast support</h2>
                <p className="mt-3 text-2xl font-semibold text-white">Premium help at your fingertips</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Get answers for billing, devices, playback and account issues with expert guidance.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Account issues', value: 'Manage billing, password or profile' },
                  { label: 'Streaming problems', value: 'Buffering, playback or audio issues' },
                  { label: 'Device setup', value: 'Smart TVs, tablets and mobile devices' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-zinc-800 bg-black/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-zinc-900">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900/80 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-red-500">Explore Topics</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Browse support categories</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Find quick answers from our support hub covering billing, playback, devices and account management.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: 'Account & Billing',
                description: 'Subscription, payments, invoices and plan changes.',
                icon: (
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1v22" />
                    <path d="M5 6h14" />
                    <path d="M5 18h14" />
                  </svg>
                ),
              },
              {
                title: 'Streaming Issues',
                description: 'Buffering, playback errors and resolution fixes.',
                icon: (
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7h16" />
                    <path d="M4 12h10" />
                    <path d="M4 17h7" />
                  </svg>
                ),
              },
              {
                title: 'Watching & Playback',
                description: 'Playback settings, subtitles, audio and viewing tips.',
                icon: (
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                ),
              },
              {
                title: 'Device Compatibility',
                description: 'Supported devices, smart TVs, mobile and desktop help.',
                icon: (
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 5h18v14H3z" />
                    <path d="M8 21h8" />
                  </svg>
                ),
              },
              {
                title: 'Security & Privacy',
                description: 'Password protection, account safety and privacy control.',
                icon: (
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 11V7" />
                    <path d="M8 11h8" />
                    <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
              {
                title: 'Getting Started',
                description: 'Set up your first profile, device and streaming experience.',
                icon: (
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l7 12H5l7-12z" />
                    <path d="M5 22h14" />
                  </svg>
                ),
              },
            ].map((card) => (
              <a key={card.title} href="#" className="group rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-zinc-900">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-red-500 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.12)]">
                  {card.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{card.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-red-500">Popular Help Topics</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Fast answers for common questions</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'How to reset password',
                  'How to cancel subscription',
                  'Payment failed issue',
                  'Streaming buffering issue',
                  'Supported devices',
                  'Update payment method',
                  'Manage watch history',
                ].map((topic) => (
                  <a key={topic} href="#" className="rounded-3xl border border-zinc-800 bg-black/70 px-5 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-zinc-900">
                    <p className="text-base font-medium text-white">{topic}</p>
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
                <p className="text-sm uppercase tracking-[0.25em] text-red-500">Troubleshooting</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Resolve playback and device issues</h3>
                <ul className="mt-6 space-y-4 text-zinc-400">
                  <li className="rounded-3xl border border-zinc-800 bg-black/60 p-4 transition hover:border-red-500 hover:bg-zinc-900">
                    <p className="font-semibold text-white">Internet troubleshooting</p>
                    <p className="mt-2 text-sm leading-6">Check connection strength, restart your router and test your network speed.</p>
                  </li>
                  <li className="rounded-3xl border border-zinc-800 bg-black/60 p-4 transition hover:border-red-500 hover:bg-zinc-900">
                    <p className="font-semibold text-white">Browser compatibility</p>
                    <p className="mt-2 text-sm leading-6">Use supported browsers and keep your browser updated for optimal playback.</p>
                  </li>
                  <li className="rounded-3xl border border-zinc-800 bg-black/60 p-4 transition hover:border-red-500 hover:bg-zinc-900">
                    <p className="font-semibold text-white">Smart TV issues</p>
                    <p className="mt-2 text-sm leading-6">Restart the app and ensure your TV firmware is up to date.</p>
                  </li>
                  <li className="rounded-3xl border border-zinc-800 bg-black/60 p-4 transition hover:border-red-500 hover:bg-zinc-900">
                    <p className="font-semibold text-white">App restart guidance</p>
                    <p className="mt-2 text-sm leading-6">Close the app, clear background processes and relaunch StreamSphere.</p>
                  </li>
                  <li className="rounded-3xl border border-zinc-800 bg-black/60 p-4 transition hover:border-red-500 hover:bg-zinc-900">
                    <p className="font-semibold text-white">Cache clearing guidance</p>
                    <p className="mt-2 text-sm leading-6">Clear app cache on mobile and smart TV to restore smooth playback.</p>
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
                <p className="text-sm uppercase tracking-[0.25em] text-red-500">Billing & Subscription Help</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Manage payments with confidence</h3>
                <div className="mt-6 space-y-4 text-zinc-400">
                  <p className="rounded-3xl border border-zinc-800 bg-black/60 p-4">Razorpay payment support for Indian users ensures secure subscription processing.</p>
                  <p className="rounded-3xl border border-zinc-800 bg-black/60 p-4">View subscription renewals, upgrade plans, and track billing history from one place.</p>
                  <p className="rounded-3xl border border-zinc-800 bg-black/60 p-4">Resolve payment failures quickly and update your payment method without delay.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900/80 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 shadow-xl">
              <p className="text-sm uppercase tracking-[0.25em] text-red-500">Device Compatibility</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Stream on every screen</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                StreamSphere works across mobile, desktop, tablets, smart TVs and modern streaming devices with smooth playback and secure access.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Mobile devices', detail: 'iOS and Android apps with HD playback.' },
                  { title: 'Desktop browsers', detail: 'Chrome, Firefox, Edge and Safari supported.' },
                  { title: 'Smart TVs', detail: 'Samsung, LG, Sony and other certified tvs.' },
                  { title: 'Tablets', detail: 'Optimized streaming on iPad and Android tablets.' },
                  { title: 'Streaming devices', detail: 'Fire TV, Roku, Chromecast and Apple TV.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-zinc-800 bg-black/60 p-5 transition hover:border-red-500 hover:bg-zinc-900">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
              <p className="text-sm uppercase tracking-[0.25em] text-red-500">Quick Links</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Jump to the support tools you need</h3>
              <div className="mt-8 grid gap-3">
                {[
                  'Update Email',
                  'Update Password',
                  'Cancel Subscription',
                  'Review Billing History',
                  'Manage Devices',
                  'Contact Support',
                ].map((link) => (
                  <a key={link} href="#" className="rounded-3xl border border-zinc-800 bg-black/60 px-5 py-4 text-sm font-medium text-white transition hover:border-red-500 hover:bg-zinc-900">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-red-500/20 bg-gradient-to-b from-black via-red-900/10 to-black p-8 shadow-[0_40px_120px_rgba(244,63,94,0.12)] sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-red-500">Contact Support</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Need help from the StreamSphere team?</h2>
              <p className="max-w-2xl text-sm leading-7 text-zinc-300">
                Contact our premium support team for fast responses on billing, playback issues, device setup and account security.
              </p>
              <p className="text-sm text-zinc-400">
                Email us at{' '}
                <a href="mailto:streamsphere1234@gmail.com" className="text-red-500 hover:text-red-400">
                  streamsphere1234@gmail.com
                </a>
              </p>
            </div>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-8 text-white shadow-xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">Premium support</p>
                  <p className="mt-3 text-2xl font-semibold">Live guidance for your StreamSphere experience</p>
                </div>
                <div className="space-y-3 text-zinc-400">
                  <p>Fast answers for playback, devices, subscription and account security.</p>
                  <p>Available via email and support requests.</p>
                  <p>Company Address: NewTown, Sector V, Kolkata - 700003.</p>
                </div>
                <a
                  href="/footer/contactus"
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-red-500 px-6 py-4 text-sm font-semibold text-black transition hover:bg-red-400"
                >
                  Contact support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
