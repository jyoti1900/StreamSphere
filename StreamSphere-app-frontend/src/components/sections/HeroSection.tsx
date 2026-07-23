"use client";

import Link from "next/link";
import {
  visitorBtnPrimary,
} from "@/styles/brandColors";

type HeroMovie = {
  id: string;
  title: string;
  description: string;
  director: string;
  cast: string;
  duration: string;
  backdrop: string;
  category: string;
};

export default function HeroSection({ movie }: { movie: HeroMovie }) {
  return (
    <section
      className="relative flex min-h-[85vh] items-end bg-cover bg-center md:items-center"
      style={{ backgroundImage: `url("${movie.backdrop}")` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(9,9,11)] via-[rgb(9,9,11)]/75 to-[rgb(9,9,11)]/20 md:bg-gradient-to-r md:from-[rgb(9,9,11)] md:via-[rgb(9,9,11)]/80 md:to-transparent" />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-1 w-full"
        style={{
          background: "linear-gradient(to right, rgb(175,35,30), rgb(215,55,45), transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl px-4 pb-10 max-sm:pl-6 md:px-12 md:pl-14 md:pb-0">
        <h1 className="mb-2 text-4xl font-extrabold sm:text-5xl md:text-7xl">{movie.title}</h1>

        <p className="mb-4 line-clamp-3 text-sm text-zinc-300 sm:text-base">{movie.description}</p>

        <div className="mb-6 space-y-1 text-xs text-zinc-400 sm:text-sm">
          <p>
            <span className="text-zinc-500">Director:</span> {movie.director}
          </p>
          <p>
            <span className="text-zinc-500">Cast:</span> {movie.cast}
          </p>
          <p>
            <span className="text-zinc-500">Duration:</span> {movie.duration}
          </p>
        </div>

        <Link
          href={`/visitor/movie/${movie.id}`}
          onClick={() => localStorage.setItem("lastCategory", movie.category)}
        >
          <button className={visitorBtnPrimary}>Watch Now</button>
        </Link>
      </div>
    </section>
  );
}
