import Footer from "@/components/layout/Footer";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-red-900/30 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.16),_transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 sm:px-8 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-10 text-sm text-zinc-400" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a href="/" className="transition hover:text-red-400">
                  Home
                </a>
              </li>

              <li className="text-zinc-600">/</li>

              <li>
                <a
                  href="/footer/helpcenter"
                  className="transition hover:text-red-400"
                >
                  Help Center
                </a>
              </li>

              <li className="text-zinc-600">/</li>

              <li className="text-white">FAQ</li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
              Support Guide
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              StreamSphere FAQ & support article
            </h1>

            <p className="text-lg leading-8 text-zinc-300">
              Explore the premium support experience for StreamSphere, your
              cinematic OTT companion. Discover how our platform, viewing
              ecosystem, and tailored recommendations work together for an
              immersive streaming journey.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-8">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 px-6 py-10 shadow-[0_0_80px_rgba(255,0,0,0.06)] sm:px-10">
          <div className="max-w-4xl space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Platform overview
            </h2>

            <p className="text-base leading-8 text-zinc-300">
              StreamSphere is a premium OTT streaming service designed to
              deliver cinematic storytelling across every screen. From movie
              premieres to curated series, the platform blends elegant design,
              personalized recommendations, and secure account experiences.
            </p>

            <p className="text-base leading-8 text-zinc-300">
              Your account unlocks seamless browsing, fast playback, and a
              tailored watchlist that evolves with your viewing habits. Whether
              you are returning to a favorite title or discovering new
              originals, StreamSphere is built to make every session feel like a
              polished, immersive experience.
            </p>

            <p className="text-base leading-8 text-zinc-300">
              For the best results, keep your app or browser updated, stay
              signed in to your account, and let our recommendation engine
              suggest fresh content based on your history and preferences.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/80 px-6 py-10 shadow-[0_0_80px_rgba(255,0,0,0.05)] sm:px-10">
          <div className="max-w-5xl space-y-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Streaming & content
              </h2>

              <p className="mt-4 text-base leading-8 text-zinc-300">
                StreamSphere combines adaptive streaming with rich content
                management to give you smooth playback on every compatible
                device. Our service adapts to your network conditions while
                preserving cinematic quality.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-800 bg-black/20 p-6">
                  <h3 className="text-xl font-semibold text-white">
                    Watch history
                  </h3>

                  <p className="mt-3 text-zinc-300 leading-7">
                    StreamSphere keeps a secure history of the titles you watch,
                    making it easy to resume where you left off. Your recent
                    activity helps shape recommendations and keeps your content
                    journey consistent across devices.
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-black/20 p-6">
                  <h3 className="text-xl font-semibold text-white">
                    Recommendations
                  </h3>

                  <p className="mt-3 text-zinc-300 leading-7">
                    Personalized picks are curated from your viewing behavior,
                    stored preferences, and trending cinematic releases. The
                    more you explore, the more StreamSphere refines your content
                    feed.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-800 bg-black/20 p-6">
                  <h3 className="text-xl font-semibold text-white">
                    Streaming quality
                  </h3>

                  <p className="mt-3 text-zinc-300 leading-7">
                    Enjoy flexible streaming quality that adjusts to your
                    bandwidth, with support for high-definition playback on
                    capable devices. For a premium viewing experience, choose
                    the highest available quality in your playback settings.
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-black/20 p-6">
                  <h3 className="text-xl font-semibold text-white">
                    Personalized content
                  </h3>

                  <p className="mt-3 text-zinc-300 leading-7">
                    Our content recommendations are designed to feel like a
                    custom channel, showcasing originals, regional favorites,
                    and titles matched to your taste. Build your watchlist and
                    let the platform guide your next movie night.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <article className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-[0_0_50px_rgba(255,0,0,0.04)]">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Devices & plans
            </h2>

            <div className="mt-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">
                  Supported devices
                </h3>

                <p className="text-zinc-300 leading-7">
                  StreamSphere is available on smart TVs, streaming sticks,
                  mobile devices, tablets, and modern browsers. Enjoy
                  synchronized playback across devices with a single account and
                  keep your viewing progress in sync.
                </p>

                <ul className="space-y-2 text-zinc-300">
                  <li>Smart TVs and set-top boxes</li>
                  <li>iOS and Android phones</li>
                  <li>Tablets and desktop browsers</li>
                  <li>Chromecast and AirPlay-compatible devices</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">
                  Plans & pricing
                </h3>

                <p className="text-zinc-300 leading-7">
                  Choose a subscription tier that fits your viewing habits.
                  StreamSphere offers flexible premium plans with the best
                  features enabled for richer content access, personalized
                  recommendations, and device flexibility.
                </p>

                <div className="space-y-4 rounded-3xl border border-zinc-800 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-white">
                      Standard Plan
                    </span>

                    <span className="text-red-500">₹699/month</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-white">
                      Premium Plan
                    </span>

                    <span className="text-red-500">₹3999/month</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-[0_0_50px_rgba(255,0,0,0.04)]">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Getting started
            </h2>

            <div className="mt-6 space-y-5">
              {[
                {
                  title: 'Create your account',
                  description:
                    'Sign up with your email address, secure your login details, and verify your account to begin your StreamSphere membership.',
                },
                {
                  title: 'Choose a plan',
                  description:
                    'Select the subscription tier that suits your viewing preferences and complete checkout with Razorpay for secure payment processing.',
                },
                {
                  title: 'Set up your profile',
                  description:
                    'Personalize your account with favorite genres, add family profiles, and save titles to your watchlist.',
                },
                {
                  title: 'Start streaming',
                  description:
                    'Browse the catalog, tap play, and enjoy cinematic playback on your preferred device.',
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-zinc-800 bg-black/20 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                      <span className="text-sm font-semibold">
                        {index + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-zinc-300 leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-[0_0_70px_rgba(255,0,0,0.05)]">
          <div className="max-w-4xl space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Troubleshooting
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: 'Buffering issues',
                  detail:
                    'If playback pauses or stalls, check your connection, close other bandwidth-heavy apps, and refresh the player. A stable network improves streaming performance.',
                },
                {
                  title: 'Slow internet',
                  detail:
                    'For the best experience, use a connection with consistent speed. Lower video quality temporarily if your network is unstable.',
                },
                {
                  title: 'Browser support',
                  detail:
                    'StreamSphere works best on recent versions of Chrome, Edge, Safari, and Firefox. Enable hardware acceleration and clear cache if playback is inconsistent.',
                },
                {
                  title: 'Login issues',
                  detail:
                    'If you cannot sign in, verify your credentials, reset your password if needed, and confirm your account details in the email you registered with.',
                },
                {
                  title: 'Playback problems',
                  detail:
                    'Restart the app or browser, update to the latest version, and ensure your device software is current. Contact support if issues persist.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-zinc-800 bg-black/20 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-zinc-300 leading-7">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.5fr]">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-[0_0_80px_rgba(255,0,0,0.04)]">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Related FAQ articles
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: 'Account management tips',
                    subtitle:
                      'Learn how to manage profiles, passwords, and secure your StreamSphere account.',
                  },
                  {
                    title: 'Subscription and billing',
                    subtitle:
                      'Understand plan details, payments, and how to update your Razorpay subscription.',
                  },
                  {
                    title: 'Playback & streaming support',
                    subtitle:
                      'Find answers for video quality, buffering, and device compatibility.',
                  },
                ].map((item) => (
                  <a
                    key={item.title}
                    href="#"
                    className="group block rounded-3xl border border-zinc-800 bg-black/20 p-5 transition hover:border-red-500/30 hover:bg-zinc-800/80"
                  >
                    <h3 className="text-xl font-semibold text-white group-hover:text-red-400">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-zinc-400 leading-7">
                      {item.subtitle}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-[0_0_80px_rgba(255,0,0,0.04)]">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Contact support
              </h2>

              <p className="mt-4 text-zinc-300 leading-7">
                If you need direct assistance, our support team is available to
                help with account setup, playback issues, and subscription
                questions.
              </p>

              <div className="mt-8 rounded-3xl border border-red-500/20 bg-black/30 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-red-500">
                  Premium support
                </p>

                <p className="mt-4 text-xl font-semibold text-white">
                  Reach out to our team anytime.
                </p>

                <a
                  href="mailto:streamsphere1234@gmail.com"
                  className="mt-5 inline-flex text-red-500 hover:text-red-400"
                >
                  streamsphere1234@gmail.com
                </a>

                <p className="mt-6 text-sm leading-6 text-zinc-400">
                  NewTown, Sector V, Kolkata - 700003
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Links */}
      <Footer />
    </main>
  );
}