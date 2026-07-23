import Footer from '@/components/layout/Footer';
import React from 'react';

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <section className="border-b border-zinc-800 bg-gradient-to-b from-black via-red-900/30 to-black py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
              Terms of Use
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              StreamSphere Terms of Use
            </h1>

            <p className="text-lg leading-8 text-zinc-300">
              These Terms of Use govern your access to and use of StreamSphere. By creating an account, purchasing a subscription, or using our platform, you agree to comply with these terms and all applicable laws.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
        <div className="grid gap-8">
          <article className="space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl shadow-black/20">

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
              <p className="text-zinc-300 leading-8">
                By accessing or using StreamSphere, you agree to be bound by these Terms of Use. If you do not agree to these terms, please discontinue use of our platform immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. Eligibility to Use the Platform</h2>
              <p className="text-zinc-300 leading-8">
                You must be at least 18 years old or have appropriate parental or guardian consent to use StreamSphere. By using the platform, you confirm that you meet the eligibility requirements applicable in your jurisdiction.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
              <p className="text-zinc-300 leading-8">
                Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You agree to provide accurate and updated information during registration and account usage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. Subscription &amp; Billing</h2>
              <p className="text-zinc-300 leading-8">
                Certain services on StreamSphere require an active subscription. Subscription plans may renew automatically depending on the selected plan unless canceled before the next billing cycle.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Payment Terms</h2>
              <p className="text-zinc-300 leading-8">
                Payments are securely processed through Razorpay and authorized payment providers. StreamSphere does not directly store complete debit or credit card information. Subscription fees are billed according to the selected plan and applicable taxes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Content Usage Restrictions</h2>
              <p className="text-zinc-300 leading-8">
                All content available on StreamSphere is intended solely for personal and non-commercial streaming purposes. Users may not copy, reproduce, redistribute, record, publicly display, or pirate any content available on the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">7. Intellectual Property Rights</h2>
              <p className="text-zinc-300 leading-8">
                All trademarks, branding, designs, software, videos, and media available on StreamSphere are protected by copyright and intellectual property laws. Unauthorized usage may result in legal action.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">8. User Conduct &amp; Prohibited Activities</h2>
              <p className="text-zinc-300 leading-8">
                Users agree not to engage in activities that may disrupt platform operations, compromise security, distribute malicious software, abuse platform resources, or violate applicable laws and regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">9. Streaming Quality &amp; Service Availability</h2>
              <p className="text-zinc-300 leading-8">
                Streaming quality may vary depending on internet connectivity, device compatibility, and network conditions. StreamSphere does not guarantee uninterrupted or error-free service availability at all times.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">10. Account Suspension &amp; Termination</h2>
              <p className="text-zinc-300 leading-8">
                StreamSphere reserves the right to suspend or terminate accounts that violate these Terms of Use, misuse the platform, engage in fraudulent activities, or infringe intellectual property rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">11. Third-Party Services</h2>
              <p className="text-zinc-300 leading-8">
                Our platform may integrate third-party services for payment processing, analytics, authentication, and content delivery. StreamSphere is not responsible for the policies or practices of external providers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">12. Disclaimer of Warranties</h2>
              <p className="text-zinc-300 leading-8">
                StreamSphere is provided on an “as-is” and “as-available” basis without warranties of any kind. We do not guarantee uninterrupted service, complete accuracy, or continuous availability of all platform features.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">13. Limitation of Liability</h2>
              <p className="text-zinc-300 leading-8">
                To the maximum extent permitted by applicable law, StreamSphere shall not be liable for indirect, incidental, consequential, or special damages arising from the use or inability to use the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">14. Privacy &amp; Data Usage</h2>
              <p className="text-zinc-300 leading-8">
                Your use of StreamSphere is also governed by our Privacy Policy. By using the platform, you acknowledge that your information may be collected, processed, and used in accordance with our privacy practices.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">15. Changes to Terms</h2>
              <p className="text-zinc-300 leading-8">
                StreamSphere may modify these Terms of Use periodically to reflect service updates, operational changes, or legal requirements. Continued use of the platform after updates constitutes acceptance of the revised terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">16. Governing Law</h2>
              <p className="text-zinc-300 leading-8">
                These Terms of Use shall be governed by and interpreted in accordance with the laws of India. Any disputes arising in connection with these terms shall fall under the jurisdiction of the courts located in Kolkata.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">17. Contact Information</h2>

              <div className="space-y-3 text-zinc-300 leading-8">
                <p>
                  If you have questions regarding these Terms of Use, please contact us at{' '}
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
  );
}