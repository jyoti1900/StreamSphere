'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Download, Mail, MapPin, Play, Users, Zap, Globe } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function PressPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Cinematic Red Glow Background */}
        <div className="absolute inset-0 -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute inset-0 -bottom-20 -left-20 w-60 h-60 bg-red-600/10 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-300">Press</span>
          </div>

          {/* Red Badge */}
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/50">
            <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">MEDIA & PRESS</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Press & Media Center
          </h1>

          {/* Supporting Text */}
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Welcome to StreamSphere's Press & Media Center. Discover the latest news, brand assets, and media resources about our premium streaming platform dedicated to delivering exceptional entertainment experiences worldwide.
          </p>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">About StreamSphere</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                StreamSphere is a next-generation OTT streaming platform revolutionizing how audiences discover and enjoy premium entertainment. We combine cutting-edge technology with curated content to create exceptional viewing experiences.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Founded with a mission to democratize premium entertainment, StreamSphere focuses on innovation, user experience, and content excellence. Our platform serves millions of users globally with seamless streaming, personalized recommendations, and exclusive content.
              </p>
              <div className="flex gap-4">
                <div>
                  <div className="text-3xl font-bold text-red-500">50M+</div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-500">150+</div>
                  <p className="text-gray-400 text-sm">Countries</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-500">5000+</div>
                  <p className="text-gray-400 text-sm">Titles</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-12 h-96 flex items-center justify-center border border-zinc-700">
              <div className="text-center">
                <Play className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-400">StreamSphere Branding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Highlights Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Press Highlights</h2>
            <p className="text-gray-400 text-lg">Key metrics and milestones showcasing StreamSphere's growth and impact</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Highlight Card 1 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
              <div className="flex items-start justify-between mb-4">
                <Globe className="w-8 h-8 text-red-500" />
                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-semibold">Q4 2024</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Global Platform Expansion</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                StreamSphere expanded to 50 million users across 150 countries, establishing itself as a leading premium streaming destination worldwide.
              </p>
            </div>

            {/* Highlight Card 2 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
              <div className="flex items-start justify-between mb-4">
                <Users className="w-8 h-8 text-red-500" />
                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-semibold">Engagement</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Record User Engagement</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Users spend an average of 4.2 hours daily on StreamSphere, with 95% subscriber retention rate demonstrating exceptional content satisfaction.
              </p>
            </div>

            {/* Highlight Card 3 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
              <div className="flex items-start justify-between mb-4">
                <Zap className="w-8 h-8 text-red-500" />
                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-semibold">Technology</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Streaming Innovation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Launched proprietary AI-driven recommendation engine, supporting 4K HDR streaming, and multi-device synchronization for seamless viewing.
              </p>
            </div>

            {/* Highlight Card 4 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
              <div className="flex items-start justify-between mb-4">
                <Play className="w-8 h-8 text-red-500" />
                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-semibold">Content</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Content Expansion</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Added 500+ original titles and exclusive content library featuring Hollywood blockbusters, international films, and premium series productions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Resources Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Media Resources</h2>
            <p className="text-gray-400 text-lg">Essential information and materials for media professionals</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Resource Card 1 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">Company Overview</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Comprehensive information about StreamSphere's mission, vision, leadership team, and organizational structure for media inquiries.
              </p>
              <button className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                <Download className="w-4 h-4" />
                Download Overview
              </button>
            </div>

            {/* Resource Card 2 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">Executive Information</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Leadership profiles, executive bios, and high-resolution headshots of StreamSphere's executive team for media coverage.
              </p>
              <button className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                <Download className="w-4 h-4" />
                Download Bios
              </button>
            </div>

            {/* Resource Card 3 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">Product Information</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Detailed specifications about StreamSphere's platform features, technology stack, and content offerings for technical journalists.
              </p>
              <button className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                <Download className="w-4 h-4" />
                Download Product Kit
              </button>
            </div>

            {/* Resource Card 4 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">Platform Facts</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Key statistics, user demographics, content library details, and market positioning information for press releases and articles.
              </p>
              <button className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                <Download className="w-4 h-4" />
                Download Fact Sheet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Assets Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Brand Assets</h2>
            <p className="text-gray-400 text-lg">Official logos, brand guidelines, and promotional materials</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Asset Card 1 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <div className="bg-zinc-900 rounded h-40 mb-6 flex items-center justify-center border border-zinc-600">
                <span className="text-gray-500 text-sm">Logo Preview</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Logo Package</h3>
              <p className="text-gray-400 text-sm mb-6">High-resolution logos in various formats (PNG, SVG, EPS) and color variations.</p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            {/* Asset Card 2 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <div className="bg-zinc-900 rounded h-40 mb-6 flex items-center justify-center border border-zinc-600">
                <span className="text-gray-500 text-sm">Guidelines Preview</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Brand Guidelines</h3>
              <p className="text-gray-400 text-sm mb-6">Comprehensive brand guidelines covering color usage, typography, and brand voice.</p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            {/* Asset Card 3 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <div className="bg-zinc-900 rounded h-40 mb-6 flex items-center justify-center border border-zinc-600">
                <span className="text-gray-500 text-sm">Promotional Preview</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Promotional Materials</h3>
              <p className="text-gray-400 text-sm mb-6">Marketing banners, social media templates, and promotional graphics in HD quality.</p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            {/* Asset Card 4 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <div className="bg-zinc-900 rounded h-40 mb-6 flex items-center justify-center border border-zinc-600">
                <span className="text-gray-500 text-sm">Media Kit Preview</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Media Kit</h3>
              <p className="text-gray-400 text-sm mb-6">Complete media kit with advertising specifications and audience demographics data.</p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Press Releases Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Recent Press Releases</h2>
            <p className="text-gray-400 text-lg">Latest announcements and news from StreamSphere</p>
          </div>

          <div className="space-y-6">
            {/* Press Release 1 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-500 text-sm font-semibold mb-2">December 15, 2024</p>
                  <h3 className="text-2xl font-bold text-white mb-3">StreamSphere Launches AI-Powered Personalization Engine</h3>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                StreamSphere announced the launch of its next-generation AI recommendation system, utilizing advanced machine learning algorithms to deliver hyper-personalized content suggestions to users worldwide, resulting in a 40% increase in user engagement and content discovery.
              </p>
              <button className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                Read Full Release
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Press Release 2 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-500 text-sm font-semibold mb-2">December 8, 2024</p>
                  <h3 className="text-2xl font-bold text-white mb-3">StreamSphere Expands to 150 Countries in Record-Breaking Expansion</h3>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                StreamSphere announced its expansion to 150 countries, reaching 50 million active users globally. The expansion includes localized content, multi-language support, and regional partnerships to serve international audiences with premium entertainment experiences tailored to local preferences.
              </p>
              <button className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                Read Full Release
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Press Release 3 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-500 text-sm font-semibold mb-2">November 28, 2024</p>
                  <h3 className="text-2xl font-bold text-white mb-3">StreamSphere Partners with Major Content Studios for Exclusive Releases</h3>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                StreamSphere announced strategic partnerships with five major content studios to bring exclusive films and series to the platform. The partnership enables early access to blockbuster releases, original productions, and premium content available only on StreamSphere for subscribers.
              </p>
              <button className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                Read Full Release
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Press Release 4 */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-8 border border-zinc-700 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-red-500 text-sm font-semibold mb-2">November 15, 2024</p>
                  <h3 className="text-2xl font-bold text-white mb-3">StreamSphere Achieves 95% User Retention Rate in Latest User Study</h3>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Independent studies show StreamSphere achieved a 95% subscriber retention rate, highest in the industry. Users average 4.2 hours daily on the platform, demonstrating strong engagement through premium content offerings, seamless user experience, and innovative features.
              </p>
              <button className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                Read Full Release
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Media Contact</h2>
            <p className="text-gray-400 text-lg">Get in touch with our media relations team</p>
          </div>

          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-12 border border-zinc-700">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">Media Relations</h3>
                <div className="space-y-8">
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold mb-2">Email</p>
                    <a href="mailto:streamsphere1234@gmail.com" className="text-xl text-red-500 hover:text-red-400 transition-colors font-semibold break-all">
                      streamsphere1234@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold mb-2">Address</p>
                    <p className="text-white text-lg leading-relaxed">
                      NewTown, Sector V<br />
                      Kolkata - 700003<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-zinc-900 rounded p-8 border border-zinc-600">
                  <h4 className="text-lg font-bold text-white mb-4">Response Time</h4>
                  <p className="text-gray-400 mb-6">
                    Our media relations team typically responds to press inquiries within 24 hours during business days. For urgent media requests, please mark your email as "URGENT MEDIA REQUEST" in the subject line.
                  </p>
                  <h4 className="text-lg font-bold text-white mb-4">What We Provide</h4>
                  <ul className="text-gray-400 space-y-2 text-sm">
                    <li>• Press releases and media kits</li>
                    <li>• Executive interviews and quotes</li>
                    <li>• High-resolution images and videos</li>
                    <li>• Background information and statistics</li>
                    <li>• Product demonstrations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Cinematic Red Glow Background */}
        <div className="absolute inset-0 -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl opacity-40"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Looking for More Information?
          </h2>
          <p className="text-lg text-gray-400 mb-12 leading-relaxed">
            Have questions about StreamSphere? Need exclusive media content? Connect with our media relations team to discuss partnerships, coverage opportunities, or interview requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50">
              Contact Media Team
            </button>
            <button className="px-8 py-3 border-2 border-red-600 text-red-500 hover:bg-red-600/10 font-bold rounded transition-all duration-300">
              Explore StreamSphere
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}