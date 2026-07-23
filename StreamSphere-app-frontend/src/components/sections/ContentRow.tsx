"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { visitorScrollBtn, visitorSectionAccent, visitorSectionBar, visitorSectionTitle } from "@/styles/brandColors";
import MoviePosterCard from "./MoviePosterCard";

type Movie = {
  id: string;
  title: string;
  poster?: string;
  posterUrl?: string;
  category?: string;
  genre?: string;
};

type ContentRowProps = {
  title: string;
  items: Movie[];
};

export default function ContentRow({ title, items }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const updateButtons = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    const { scrollLeft, scrollWidth, clientWidth } = row;
    const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
    const scrollable = maxScrollLeft > 4;

    setCanScroll(scrollable);
    setAtStart(scrollLeft <= 4);
    setAtEnd(scrollLeft >= maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    updateButtons();

    const row = rowRef.current;
    if (!row) return;

    row.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    const resizeObserver = new ResizeObserver(updateButtons);
    resizeObserver.observe(row);

    const handleImageLoad = () => updateButtons();
    row.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", handleImageLoad);
    });

    const timers = [100, 400, 800].map((ms) => setTimeout(updateButtons, ms));

    return () => {
      timers.forEach(clearTimeout);
      row.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
      resizeObserver.disconnect();
      row.querySelectorAll("img").forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
      });
    };
  }, [items, updateButtons]);

  const scroll = (direction: "left" | "right") => {
    const row = rowRef.current;
    if (!row) return;

    row.scrollBy({
      left: direction === "left" ? -600 : 600,
      behavior: "smooth",
    });

    requestAnimationFrame(updateButtons);
    setTimeout(updateButtons, 400);
  };

  if (!items || items.length === 0) return null;

  const showLeft = canScroll && !atStart;
  const showRight = canScroll && !atEnd;

  return (
    <section className="relative px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <div className={visitorSectionAccent}>
        <div className={visitorSectionBar} />
        <h2 className={visitorSectionTitle}>{title}</h2>
      </div>

      <div className="relative">
        {/* Desktop / laptop arrows only — positioned inside so they are not clipped */}
        {showLeft && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 bottom-6 z-20 hidden w-14 bg-gradient-to-r from-[rgb(9,9,11)] to-transparent lg:block" />
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className={`absolute left-2 top-[calc(50%-14px)] z-40 hidden -translate-y-1/2 items-center justify-center lg:flex ${visitorScrollBtn}`}
            >
              <ChevronLeft size={26} />
            </button>
          </>
        )}

        {showRight && (
          <>
            <div className="pointer-events-none absolute right-0 top-0 bottom-6 z-20 hidden w-14 bg-gradient-to-l from-[rgb(9,9,11)] to-transparent lg:block" />
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className={`absolute right-2 top-[calc(50%-14px)] z-40 hidden -translate-y-1/2 items-center justify-center lg:flex ${visitorScrollBtn}`}
            >
              <ChevronRight size={26} />
            </button>
          </>
        )}

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide netflix-slider touch-pan-x md:px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((movie, index) => {
            const poster = movie.poster || movie.posterUrl || "/fallback.jpg";
            const category = movie.category || movie.genre || "";

            return (
              <MoviePosterCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster={poster}
                category={category}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
