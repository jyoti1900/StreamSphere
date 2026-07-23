import { visitorCard } from "@/styles/brandColors";

export default function SearchSkeleton() {
  return (
    <section className="px-6 pb-20">
      <div className="mb-6 h-4 w-24 animate-pulse rounded bg-white/5" />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-[2/3] animate-pulse bg-white/5 ${visitorCard}`}
          />
        ))}
      </div>
    </section>
  );
}
