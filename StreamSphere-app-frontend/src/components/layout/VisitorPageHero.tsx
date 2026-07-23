type VisitorPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  compact?: boolean;
};

export default function VisitorPageHero({
  eyebrow,
  title,
  description,
  compact = false,
}: VisitorPageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden border-b border-white/5 ${
        compact ? "py-12 md:py-14" : "py-16 md:py-20"
      }`}
      style={{
        background:
          "linear-gradient(135deg, rgba(65,15,15,0.35) 0%, rgba(9,9,11,0.95) 45%, rgb(9,9,11) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(215, 55, 45, 0.12)" }}
      />
      <div className="relative px-4 sm:px-6 md:pl-[96px] md:pr-12">
        {eyebrow && (
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[rgb(215,55,45)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
