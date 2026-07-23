"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type AdminHorizontalScrollProps = {
  children: ReactNode;
  className?: string;
};

export default function AdminHorizontalScroll({
  children,
  className = "",
}: AdminHorizontalScrollProps) {
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

    const timers = [100, 400].map((ms) => setTimeout(updateButtons, ms));

    return () => {
      timers.forEach(clearTimeout);
      row.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
      resizeObserver.disconnect();
    };
  }, [children, updateButtons]);

  const scroll = (direction: "left" | "right") => {
    const row = rowRef.current;
    if (!row) return;

    row.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });

    setTimeout(updateButtons, 400);
  };

  const showLeft = canScroll && !atStart;
  const showRight = canScroll && !atEnd;

  return (
    <div className={`relative ${className}`}>
      {showLeft && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-zinc-950 to-transparent" />
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/95 text-white shadow-lg transition hover:bg-red-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </>
      )}

      {showRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-zinc-950 to-transparent" />
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/95 text-white shadow-lg transition hover:bg-red-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={rowRef}
        className="overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {children}
      </div>
    </div>
  );
}
