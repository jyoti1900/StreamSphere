import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookies Policy | StreamSphere',
  description:
    'StreamSphere Cookies Policy explains how we use cookies to deliver secure OTT streaming, personalize recommendations and manage sessions.',
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <section className="border-b border-zinc-800 bg-gradient-to-b from-black via-red-900/30 to-black py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
              Cookies
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              StreamSphere Cookies Policy
            </h1>

            <p className="text-lg leading-8 text-zinc-300">
              StreamSphere uses cookies and related technologies to support secure account access, personalized recommendations, and reliable streaming performance across our OTT platform.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
        <div className="grid gap-8">
          <article className="space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl shadow-black/20">

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
              <p className="text-zinc-300 leading-8">
                This Cookies Policy explains how StreamSphere collects and uses cookies and similar tracking technologies when you visit our OTT platform. Cookies help us remember your preferences, maintain your login session, analyze performance, and deliver a smooth streaming experience.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. What Are Cookies</h2>
              <p className="text-zinc-300 leading-8">
                Cookies are small text files stored on your device by your browser. They contain information that helps our platform recognize your device, preserve your session, and tailor content. Cookies may be created by StreamSphere or by trusted third-party services we use to support our platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. Types of Cookies We Use</h2>

              <div className="space-y-4 text-zinc-300 leading-8">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Essential Cookies
                  </h3>

                  <p>
                    Essential cookies are required to operate StreamSphere and keep your session active. These cookies enable core functions such as login state, account management, subscription validation, and secure navigation through the service.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Authentication Cookies
                  </h3>

                  <p>
                    Authentication cookies help verify your identity and maintain a secure login session. They support account access, session handling, and may work alongside JWT or session-based mechanisms without storing full payment credentials.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Analytics Cookies
                  </h3>

                  <p>
                    Analytics cookies collect information about how you use StreamSphere so we can improve recommendations, performance, and the overall streaming experience. We use this data to understand viewing patterns and optimize playback quality.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Preference Cookies
                  </h3>

                  <p>
                    Preference cookies remember your viewing preferences, language choice, and interface settings. They help StreamSphere deliver a more personalized experience on future visits.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. How We Use Cookies</h2>
              <p className="text-zinc-300 leading-8">
                We use cookies to keep your account secure, remember your chosen settings, tailor recommendations, and monitor streaming performance. Cookies also help us detect potential issues, support Razorpay subscription workflows, and keep your watch history aligned with your preferences.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Third-Party Cookies</h2>
              <p className="text-zinc-300 leading-8">
                Some cookies are set by third-party services that support our platform. These can include analytics providers, content delivery partners, and payment processors. We only work with trusted vendors and do not store complete debit or credit card details in cookies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Streaming &amp; Performance Analytics</h2>
              <p className="text-zinc-300 leading-8">
                Performance analytics cookies help us measure playback quality, buffer times, and device compatibility. This data enables StreamSphere to refine content delivery and recommend shows based on your viewing behavior.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">7. Managing Cookie Preferences</h2>
              <p className="text-zinc-300 leading-8">
                You can manage your cookie preferences through your browser settings. While some cookies are necessary for basic streaming and account functionality, you can choose to block non-essential cookies to limit tracking or personalization.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">8. Browser Cookie Controls</h2>
              <p className="text-zinc-300 leading-8">
                Most browsers allow you to view, delete, or disable cookies. Consult your browser’s privacy settings to update how cookies are handled. If you clear cookies, you may need to sign in again and some preferences may reset.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">9. Data Protection &amp; Security</h2>
              <p className="text-zinc-300 leading-8">
                StreamSphere uses industry-standard security measures to protect cookies and the data they support. We limit access to necessary systems, protect session cookies against unauthorized use, and keep personal data safe while complying with applicable privacy practices.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">10. Changes to This Cookies Policy</h2>
              <p className="text-zinc-300 leading-8">
                We may update this Cookies Policy to reflect changes in our services or applicable laws. When we do, we will post the revised policy on this page and apply updated cookie practices going forward.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">11. Contact Information</h2>

              <div className="space-y-3 text-zinc-300 leading-8">
                <p>
                  If you have questions regarding this Cookies Policy, please contact us at{' '}
                  <a
                    href="mailto:streamsphere1234@gmail.com"
                    className="text-red-500 hover:text-red-400"
                  >
                    streamsphere1234@gmail.com
                  </a>.
                </p>

                <p>
                  Company Address: NewTown, Sector V, Kolkata - 700003
                </p>
              </div>
            </section>

          </article>
        </div>
      </section>

      <Footer />
    </main>
  )
}