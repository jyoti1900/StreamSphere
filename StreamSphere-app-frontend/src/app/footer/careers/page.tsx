import Footer from '@/components/layout/Footer';
import { ArrowRight, Briefcase, Sparkles, Users, ShieldCheck, BookOpen, Globe, LifeBuoy, Mail, MapPin, ChevronRight, Heart } from 'lucide-react';

const cultureItems = [
  {
    title: 'Innovation First',
    description: 'We design systems, interfaces, and experiences that set the standard for premium streaming.',
    icon: Sparkles,
  },
  {
    title: 'Collaboration',
    description: 'Cross-functional teams build stories together with shared ownership and meaningful feedback.',
    icon: Users,
  },
  {
    title: 'Ownership',
    description: 'Every team member leads with accountability, creativity, and product excellence.',
    icon: Briefcase,
  },
  {
    title: 'Continuous Learning',
    description: 'We invest in people, craft, and emerging streaming technologies every single day.',
    icon: BookOpen,
  },
  {
    title: 'Diversity & Inclusion',
    description: 'A culture of open voices, fresh perspectives, and stories that reflect millions of viewers.',
    icon: Globe,
  },
  {
    title: 'User Obsession',
    description: 'Every decision is anchored in delighting audiences with faster, cleaner, and richer playback.',
    icon: Heart,
  },
];

const benefitItems = [
  {
    title: 'Flexible Work',
    description: 'Work from home, office, or a hybrid rhythm that keeps creativity moving.',
    icon: ShieldCheck,
  },
  {
    title: 'Health Benefits',
    description: 'Comprehensive coverage designed for wellbeing, energy, and focus.',
    icon: LifeBuoy,
  },
  {
    title: 'Learning Budget',
    description: 'Access courses, conferences, and coaching to sharpen your streaming expertise.',
    icon: BookOpen,
  },
  {
    title: 'Team Events',
    description: 'Cinematic launch nights, offsite experiences, and collaborative brand sessions.',
    icon: Users,
  },
  {
    title: 'Career Growth',
    description: 'Clear paths, mentorship, and leadership development for ambitious builders.',
    icon: ArrowRight,
  },
  {
    title: 'Streaming Allowance',
    description: 'Enjoy premium content, creative research tools, and entertainment access on us.',
    icon: Sparkles,
  },
];

const roles = [
  {
    title: 'Frontend Developer',
    department: 'Product Engineering',
    type: 'Full-time',
    location: 'Kolkata / Remote',
    description: 'Build immersive interfaces, polished animations, and high-performance streaming experiences.',
  },
  {
    title: 'Backend Developer',
    department: 'Platform Services',
    type: 'Full-time',
    location: 'Kolkata',
    description: 'Power the streaming stack, APIs, and content delivery systems behind every viewer session.',
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    type: 'Full-time',
    location: 'Hybrid',
    description: 'Own deployment reliability, CI/CD, and cloud resilience for an always-on service.',
  },
  {
    title: 'UI/UX Designer',
    department: 'Design Studio',
    type: 'Full-time',
    location: 'Remote-friendly',
    description: 'Craft premium visual journeys, motion design, and polished brand-first interfaces.',
  },
  {
    title: 'QA Engineer',
    department: 'Quality Assurance',
    type: 'Full-time',
    location: 'Kolkata',
    description: 'Shape quality frameworks, automated testing, and flawless playback experiences.',
  },
  {
    title: 'Content Operations Specialist',
    department: 'Content Experience',
    type: 'Full-time',
    location: 'Kolkata',
    description: 'Manage content flow, metadata accuracy, and viewer-ready streaming releases.',
  },
];

const processSteps = [
  'Application Review',
  'Initial Discussion',
  'Technical / Skill Assessment',
  'Team Interview',
  'Final Decision',
];

export default function Page() {
  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-zinc-900/60 bg-[#050505]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.18),_transparent_45%)] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-10 lg:px-12">
          <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
            <a href="/" className="transition hover:text-white">Home</a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-zinc-400">Careers</span>
          </nav>
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-red-300 shadow-[0_0_40px_rgba(248,113,113,0.12)]">
              <Briefcase className="h-4 w-4" />
              JOIN OUR TEAM
            </div>
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">Careers at StreamSphere</h1>
            <p className="max-w-3xl text-lg leading-8 text-zinc-400 sm:text-xl">
              Build the future of streaming entertainment and create exceptional viewing experiences for millions of fans. Join a premium team shaping the next generation of cinematic OTT storytelling.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/60 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.32em] text-red-400">Why Work at StreamSphere</p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">A premium introduction to innovation, entertainment, and growth.</h2>
              <p className="max-w-2xl text-base leading-8 text-zinc-400">
                We combine streaming technology with creative storytelling to deliver cinematic experiences that feel effortless, immersive, and unforgettable. Our collective mission is to keep viewers connected to stories they love while empowering every team member to innovate.
              </p>
            </div>
            <div className="rounded-[2rem] border border-zinc-800/80 bg-zinc-950/90 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
              <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-3xl border border-zinc-800/80 bg-zinc-900/80 p-6 transition hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/95">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Innovation beyond the screen</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">Create new ways for audiences to discover and enjoy premium viewing moments.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-3xl border border-zinc-800/80 bg-zinc-900/80 p-6 transition hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/95">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Creative culture</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">Work in a collaborative environment with designers, engineers, and storytellers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-3xl border border-zinc-800/80 bg-zinc-900/80 p-6 transition hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/95">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Growth opportunities</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">Grow your career with a user-first mindset and an industry-leading streaming platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/60 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="space-y-8 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-red-400">Company Culture</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">A culture built for bold creators and technical excellence.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cultureItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group rounded-[2rem] border border-zinc-800/80 bg-zinc-950/90 p-6 transition hover:-translate-y-1 hover:border-red-500/40 hover:bg-zinc-900/90">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-500/10 text-red-300 transition group-hover:bg-red-500/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/60 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="space-y-8 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-red-400">Benefits & Perks</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Premium perks designed for life at StreamSphere.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {benefitItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group rounded-[2rem] border border-zinc-800/70 bg-zinc-950/85 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-red-500/40 hover:bg-zinc-900/95">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-zinc-900 text-red-400 transition group-hover:bg-red-500/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="open-roles" className="border-b border-zinc-900/60 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="space-y-8 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-red-400">Open Positions</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Join a team that defines premium streaming.
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-8 text-zinc-400">
              Explore roles shaped for engineers, creatives, and operations specialists who want to deliver exceptional viewer experiences.
            </p>
          </div>
          <div className="mt-12 grid gap-6 xl:grid-cols-2">
            {roles.map((role) => (
              <article key={role.title} className="group rounded-[2rem] border border-zinc-800/80 bg-zinc-950/90 p-8 transition hover:-translate-y-1 hover:border-red-500/40 hover:bg-zinc-900/95">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-red-400">{role.department}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{role.title}</h3>
                  </div>
                  <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-300">
                    {role.type}
                  </div>
                </div>
                <p className="mt-6 text-sm leading-7 text-zinc-400">{role.description}</p>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/70 pt-6">
                  <span className="text-sm text-zinc-500">{role.location}</span>
                  <a href="#cta" className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400">
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/60 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="space-y-8 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-red-400">Hiring Process</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">A smooth, thoughtful process for exceptional candidates.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            {processSteps.map((step, index) => (
              <div key={step} className="rounded-[2rem] border border-zinc-800/70 bg-zinc-950/90 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-red-500/40 hover:bg-zinc-900/95">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-300 text-lg font-semibold">{index + 1}</div>
                <h3 className="mt-6 text-lg font-semibold text-white">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/60 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.32em] text-red-400">Life at StreamSphere</p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Build products users love in a culture defined by imagination and precision.</h2>
              <p className="max-w-2xl text-base leading-8 text-zinc-400">
                We deliver polished, fast, and high-quality streaming moments through a modern engineering culture that values curiosity, ownership, and team collaboration. It is a place where ambitious work is matched by thoughtful support.
              </p>
            </div>
            <div className="space-y-6 rounded-[2rem] border border-zinc-800/80 bg-zinc-950/90 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.28)]">
              <div className="space-y-4 rounded-[1.75rem] bg-zinc-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-red-400">Working environment</p>
                <p className="text-sm leading-7 text-zinc-400">A high-energy studio where product teams build with speed, discipline, and premium polish.</p>
              </div>
              <div className="space-y-4 rounded-[1.75rem] bg-zinc-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-red-400">Innovation culture</p>
                <p className="text-sm leading-7 text-zinc-400">From concept to launch, we move quickly while preserving quality, clarity, and viewer-first thinking.</p>
              </div>
              <div className="space-y-4 rounded-[1.75rem] bg-zinc-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-red-400">Team collaboration</p>
                <p className="text-sm leading-7 text-zinc-400">Cross-disciplinary teams solve complex challenges together, always focused on product impact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
          <div className="rounded-[2.5rem] border border-zinc-800/70 bg-zinc-950/90 p-12 text-center shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.32em] text-red-400">Ready to Build the Future of Streaming?</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Ready to Build the Future of Streaming?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400">
              If you are passionate about premium experiences and love working in a cinematic product environment, StreamSphere is where your next chapter begins.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#open-roles" className="inline-flex items-center justify-center rounded-full bg-red-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-red-400">
                View Open Roles
              </a>
              <a href="/footer/contact-us" className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-transparent px-8 py-4 text-sm font-semibold text-zinc-200 transition hover:border-red-500 hover:text-white">
                Contact Recruitment
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
