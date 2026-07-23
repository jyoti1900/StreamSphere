"use client";

import Link from "next/link";
import { getContentCardColors } from "@/styles/contentCardColors";
import { visitorCard } from "@/styles/brandColors";
import PosterRgbEffects from "@/components/shared/PosterRgbEffects";

type MoviePosterCardProps = {
  id: string;
  title: string;
  poster: string;
  category?: string;
  index: number;
};

export default function MoviePosterCard({
  id,
  title,
  poster,
  category = "",
  index,
}: MoviePosterCardProps) {
  const colors = getContentCardColors(category, index);
  const href = `/visitor/movie/${id}${category ? `?category=${category}` : ""}`;

  return (
    <Link
      href={href}
      className="group w-[140px] flex-shrink-0 cursor-pointer sm:w-[160px] md:w-[180px] lg:w-[200px]"
      style={{ ["--card-accent" as string]: colors.hoverText }}
    >
      <div
        className={`relative aspect-[2/3] w-full overflow-hidden transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-2xl ${visitorCard}`}
      >
        <img
          src={poster}
          alt={title}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 select-none"
        />

        <PosterRgbEffects colors={colors} title={title} category={category} />
      </div>

      <p className="mt-2 w-full line-clamp-1 text-sm text-zinc-400 transition-colors duration-300 group-hover:text-[color:var(--card-accent)]">
        {title}
      </p>
    </Link>
  );
}
