import Footer from '@/components/layout/Footer';
import { ArrowRight, BarChart3, ChevronRight, Cpu, Globe2, Heart, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  {
    title: 'Personalized recommendations',
    description: 'Discover content tailored to your taste with AI-driven insight and curated playlists.',
    icon: Sparkles,
  },
  {
    title: 'Cross-device streaming',
    description: 'Start on any device and continue seamlessly across your TV, phone, or tablet.',
    icon: Globe2,
  },
  {
    title: 'HD & adaptive playback',
    description: 'Enjoy crisp visuals with intelligent streaming that adjusts to your bandwidth.',
    icon: PlayCircle,
  },
  {
    title: 'Secure accounts',
    description: 'Built-in account protection and privacy controls for every member of your household.',
    icon: ShieldCheck,
  },
  {
    title: 'Modern UI experience',
    description: 'Sleek menus, fast navigation, and cinematic discovery tools for premium browsing.',
    icon: Cpu,
  },
  {
    title: 'Fast streaming performance',
    description: 'Low-latency playback and instant load times for a truly immersive watch session.',
    icon: BarChart3,
  },
];

const stats = [
  { label: 'Movies & Shows', value: '12K+', description: 'Curated library of entertainment across genres.' },
  { label: 'Active Users', value: '1.8M', description: 'Community of dedicated StreamSphere subscribers.' },
  { label: 'Streaming Hours', value: '42M+', description: 'Premium viewing time every month around the globe.' },
  { label: 'Device Compatibility', value: '8+', description: 'Designed for TV, mobile, tablet, desktop and connected devices.' },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <section className="relative overflow-hidden bg-[#050505] py-16 px-6 sm:px-10 lg:px-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.22),_transparent_55%)] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-60" />
        <div className="relative mx-auto max-w-6xl">
          <nav className="mb-6 text-sm text-zinc-400">
            <ol className="flex items-center gap-3">
              <li>Home</li>
              <li className="inline-flex items-center text-red-500"><ChevronRight className="h-4 w-4" /></li>
              <li className="text-white">About Us</li>
            </ol>
          </nav>
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.12)]">
              <Sparkles className="h-4 w-4 text-red-300" />
              Premium OTT Experience
            </div>
            <div className="relative overflow-hidden">
              <div className="absolute -left-16 top-6 h-56 w-56 rounded-full bg-red-500/20 blur-3xl" aria-hidden="true" />
              <h1 className="relative text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                About StreamSphere
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              StreamSphere is the cinematic home for premium entertainment, designed to deliver a refined streaming journey with intelligent personalization, effortless discovery, and immersive playback.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-black/30 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.35)] sm:p-12">
          <div className="space-y-6">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Platform introduction</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">The future of OTT entertainment, reimagined.</h2>
              <p className="text-base leading-8 text-zinc-300 sm:text-lg">
                StreamSphere blends premium cinematic design with smart recommendations, fast playback, and intuitive discovery. Our vision is to create an entertainment ecosystem that feels personal, polished, and effortless for every viewer.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-[0_20px_40px_rgba(255,0,50,0.05)]">
                <p className="text-xl font-semibold text-white">Curated for your taste</p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">Every recommendation is crafted to match your mood, viewing history, and cinematic preferences.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-[0_20px_40px_rgba(255,0,50,0.05)]">
                <p className="text-xl font-semibold text-white">A modern entertainment ecosystem</p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">From launch to binge, the experience is seamless across devices with a consistent premium interface.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Mission & Vision</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Built for cinematic storytelling and meaningful connection.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="group rounded-[2rem] border border-white/10 bg-[#0d0d0d]/95 p-8 transition duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-[#151515] sm:p-10">
              <div className="mb-4 inline-flex items-center gap-3 text-red-300">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.35em]">Our Mission</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">Empower every viewer.</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                We aim to make premium entertainment accessible, intuitive, and thrilling. Every interaction is designed to feel cinematic and effortless.
              </p>
            </div>
            <div className="group rounded-[2rem] border border-white/10 bg-[#0d0d0d]/95 p-8 transition duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-[#151515] sm:p-10">
              <div className="mb-4 inline-flex items-center gap-3 text-red-300">
                <Heart className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.35em]">Our Vision</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">A premium home for modern streaming.</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                StreamSphere is built to evolve with storytelling, delivering richer discovery, smarter playback, and a stronger connection to what matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Why Choose StreamSphere</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Streaming designed around you.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="group rounded-[1.75rem] border border-white/10 bg-[#090909]/95 p-6 transition duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-[#111111]">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-red-500/10 text-red-300 shadow-[0_20px_40px_rgba(239,68,68,0.08)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-black/30 p-8 shadow-[0_40px_90px_rgba(255,0,0,0.08)] sm:p-12">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Streaming Experience</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Every moment built for binge-worthy enjoyment.</h2>
              <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                StreamSphere keeps your watchlist, continue watching queue, and curated recommendations in one cinematic interface. Enjoy smooth playback with adaptive quality and multi-device consistency.
              </p>
            </div>
            <div className="space-y-5 rounded-[1.75rem] border border-white/10 bg-[#090909]/95 p-6 sm:p-8">
              <div className="space-y-3">
                <p className="text-lg font-semibold text-white">Personalized watchlists</p>
                <p className="text-sm leading-7 text-zinc-400">Your favorites and recommended titles are organized for effortless access at every visit.</p>
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-white">Continue watching</p>
                <p className="text-sm leading-7 text-zinc-400">Pick up exactly where you left off with intelligent session sync across devices.</p>
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-white">Smart playback optimization</p>
                <p className="text-sm leading-7 text-zinc-400">Playback automatically adjusts for quality, speed, and reliability so you stay immersed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Platform Highlights</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">A premium service with measurable impact.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-[#090909]/95 p-6 text-center shadow-[0_20px_40px_rgba(255,0,0,0.06)]">
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">{stat.label}</p>
                <p className="mt-4 text-4xl font-semibold text-white">{stat.value}</p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-[#080808]/95 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.4)] sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Platform Philosophy</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Designed for audience-first streaming innovation.</h2>
              <p className="text-base leading-8 text-zinc-300 sm:text-lg">
                StreamSphere is guided by a simple principle: the best entertainment experience is one that feels effortless, immersive and built around real viewer needs.
              </p>
            </div>
            <div className="space-y-6 rounded-[1.75rem] border border-white/10 bg-black/70 p-8 sm:p-10">
              <div className="space-y-3">
                <p className="text-lg font-semibold text-white">User experience first</p>
                <p className="text-sm leading-7 text-zinc-400">Every screen, interaction and discovery path is crafted to be clear, cinematic, and visually engaging.</p>
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-white">Innovation without distraction</p>
                <p className="text-sm leading-7 text-zinc-400">Powerful features are presented with restraint so streaming remains smooth and captivating.</p>
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-white">Entertainment-first approach</p>
                <p className="text-sm leading-7 text-zinc-400">We prioritize story, atmosphere, and performance over cluttered interfaces and noisy presentation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#120000]/30 via-[#080808] to-[#020202] p-10 shadow-[0_50px_120px_rgba(255,0,0,0.12)] sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Ready to explore?</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Step into the future of streaming with StreamSphere.</h2>
              <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                Discover premium storytelling, intelligent personalization, and cinematic playback in one polished platform built for modern viewers.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="/visitor" className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/40">
                Explore Content
                <ArrowRight className="ml-3 h-4 w-4" />
              </a>
              <a href="/footer/contactus" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-red-500/30 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400/20">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
