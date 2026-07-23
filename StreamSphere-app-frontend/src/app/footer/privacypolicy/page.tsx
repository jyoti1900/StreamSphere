import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <section className="border-b border-zinc-800 bg-gradient-to-b from-black via-red-950/35 to-black py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
              Privacy Policy
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute -left-12 top-2 h-56 w-56 rounded-full bg-red-500/15 blur-3xl" aria-hidden="true" />
              <h1 className="relative text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                StreamSphere Privacy Policy
              </h1>
            </div>
            <p className="text-lg leading-8 text-zinc-300">
              At StreamSphere, protecting your personal information is integral to delivering a premium streaming experience. This policy explains how we collect, use, and safeguard data when you engage with our OTT platform.
            </p>
            {/* <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 text-zinc-300 shadow-lg shadow-black/20">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Effective Date</p>
              <p className="mt-2 text-lg font-medium text-white">20/05/2026</p>
            </div> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
        <div className="grid gap-8">
          <article className="space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl shadow-black/20">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
              <p className="text-zinc-300 leading-8">
                StreamSphere provides on-demand streaming to users through our web and mobile applications. This Privacy Policy applies to personal information collected when you create an account, use our services, purchase subscriptions, or interact with our content recommendations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
              <div className="space-y-4 text-zinc-300 leading-8">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">Personal Information</h3>
                  <p>
                    We collect your name, email address, contact details, and other account-related information when you register or contact support.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">Account Information</h3>
                  <p>
                    Account-related data includes your username, authentication credentials, subscription status, and preferences for your viewing experience.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">Payment Information</h3>
                  <p>
                    We do not store full debit or credit card details. Payment processing is handled securely through Razorpay and related payment service providers.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">Device &amp; Usage Information</h3>
                  <p>
                    We collect device, browser, IP address, viewing history, streaming activity, and usage patterns to improve performance, recommendations, and content delivery.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. How We Use Information</h2>
              <p className="text-zinc-300 leading-8">
                We use your information to provide and maintain our service, process subscriptions, personalize recommendations, detect fraud, and deliver customer support. Data also helps us optimize platform performance and tailor content suggestions without compromising your privacy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. Cookies &amp; Tracking Technologies</h2>
              <p className="text-zinc-300 leading-8">
                StreamSphere uses cookies, local storage, and similar technologies to maintain your session, remember preferences, and analyze usage. These technologies support authentication, analytics, and secure operation of our website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Payment Processing</h2>
              <p className="text-zinc-300 leading-8">
                Subscription payments are processed through Razorpay. We only retain payment identifiers, transaction details, and billing records needed for order fulfillment, support, and compliance. Card information is handled by the payment provider and is not stored directly by StreamSphere.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Sharing of Information</h2>
              <p className="text-zinc-300 leading-8">
                We do not sell user data to third parties. Information may be shared with service providers who support our operations, such as payment processors, analytics providers, and customer support partners. We may also disclose data if required by law or to protect the safety of our users and systems.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">7. Data Retention</h2>
              <p className="text-zinc-300 leading-8">
                We retain personal data for as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer required, we delete or anonymize it in a secure manner.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">8. Security Practices</h2>
              <p className="text-zinc-300 leading-8">
                StreamSphere maintains industry-standard security practices to protect personal information. We use HTTPS encryption, secure authentication methods, access controls, and regular security reviews to safeguard data against unauthorized access.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">9. User Rights</h2>
              <p className="text-zinc-300 leading-8">
                You can access, update, or correct your account details by contacting our support team. If you have questions about your personal information, data usage, or account settings, we will assist you in a timely manner.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">10. Children's Privacy</h2>
              <p className="text-zinc-300 leading-8">
                Our services are intended for users who are old enough to create accounts and subscribe to streaming services. We do not knowingly collect personal information from children under 16. If we learn that a child has provided us with personal data, we will take steps to delete that information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">11. Third-Party Services</h2>
              <p className="text-zinc-300 leading-8">
                We use third-party providers for analytics, payment processing, content delivery, and support. These services may collect information in accordance with their own privacy policies. StreamSphere is not responsible for third-party privacy practices.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">12. Streaming Analytics &amp; Recommendations</h2>
              <p className="text-zinc-300 leading-8">
                Viewing history, watch patterns, and content interactions may be used to generate personalized recommendations and improve platform performance. Analytics help us understand usage trends and deliver a better streaming experience.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">13. Subscription &amp; Billing</h2>
              <p className="text-zinc-300 leading-8">
                Subscription billing information is used to manage your plan, process renewals, and communicate payment details. We retain only the data necessary for billing, support, and compliance with financial obligations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">14. Changes to This Privacy Policy</h2>
              <p className="text-zinc-300 leading-8">
                We may update this Privacy Policy to reflect changes in our practices, legal requirements, or service offerings. When updates are made, we will publish the revised policy with a new effective date. Continued use of StreamSphere constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">15. Contact Information</h2>
              <div className="space-y-3 text-zinc-300 leading-8">
                <p>
                  If you have questions about this policy or your data, please contact us at <a href="mailto:streamsphere1234@gmail.com" className="text-red-500 hover:text-red-400">streamsphere1234@gmail.com</a>.
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