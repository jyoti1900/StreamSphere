"use client";

import Link from "next/link";
import { visitorCard } from "@/styles/brandColors";

interface Props {
  movie: {
    id: string;
    title: string;
    poster: string;
    genre: string;
  };
}

export default function MovieCard({ movie }: Props) {
  const categorySlug = movie.genre.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <Link href={`/visitor/movie/${movie.id}?category=${categorySlug}`}>
      <div className={`group relative cursor-pointer ${visitorCard}`}>
        <div className="aspect-[2/3] w-full bg-[rgb(18,18,20)]">
          <img
            src={movie.poster || "/fallback.jpg"}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgb(65,15,15)]/90 via-[rgb(9,9,11)]/40 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
          <div>
            <p className="text-xs uppercase tracking-wider text-[rgb(215,55,45)]">
              {movie.genre}
            </p>
            <h3 className="text-sm font-semibold text-white">{movie.title}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
