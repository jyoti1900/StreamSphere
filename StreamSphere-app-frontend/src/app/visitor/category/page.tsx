"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import VisitorPageHero from "@/components/layout/VisitorPageHero";
import Link from "next/link";
import { useAuth, API_BASE_URL } from "@/context/AuthContext";
import { visitorCard, visitorEmptyState, visitorPage } from "@/styles/brandColors";

type Category = {
  _id: string;
  name: string;
  image?: {
    signedUrl: string;
  };
  isDeleted?: boolean;
};

const getCategories = async (token: string | null): Promise<Category[]> => {
  const res = await fetch(`${API_BASE_URL}/movie-catagory/list`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = result?.message || result?.error || JSON.stringify(result) || res.statusText;
    throw new Error(`Fetch failed: ${res.status} ${detail}`);
  }

  return Array.isArray(result)
    ? result
    : result?.categories || result?.data || [];
};

const getSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getCtaText = (name: string) =>
  name.toLowerCase().includes("series") ? "Explore series" : "Explore movies";

type CategoryColorScheme = {
  gradient: string;
  bar: string;
  hoverText: string;
  glow: string;
};

const categoryColorMap: Record<string, CategoryColorScheme> = {
  Action: {
    gradient:
      "linear-gradient(to top right, rgba(65,15,15,0.9) 0%, rgba(175,35,30,0.4) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(175,35,30), rgb(215,55,45))",
    hoverText: "rgb(215,55,45)",
    glow: "rgba(215, 55, 45, 0.2)",
  },
  Adventure: {
    gradient:
      "linear-gradient(to top right, rgba(20,83,45,0.9) 0%, rgba(34,197,94,0.35) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(22,101,52), rgb(34,197,94))",
    hoverText: "rgb(74,222,128)",
    glow: "rgba(34, 197, 94, 0.2)",
  },
  "Sci-Fi": {
    gradient:
      "linear-gradient(to top right, rgba(30,58,138,0.9) 0%, rgba(59,130,246,0.35) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(37,99,235), rgb(96,165,250))",
    hoverText: "rgb(96,165,250)",
    glow: "rgba(59, 130, 246, 0.2)",
  },
  Thriller: {
    gradient:
      "linear-gradient(to top right, rgba(24,24,27,0.95) 0%, rgba(113,113,122,0.4) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(63,63,70), rgb(161,161,170))",
    hoverText: "rgb(212,212,216)",
    glow: "rgba(161, 161, 170, 0.15)",
  },
  Romance: {
    gradient:
      "linear-gradient(to top right, rgba(131,24,67,0.9) 0%, rgba(244,114,182,0.35) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(190,24,93), rgb(244,114,182))",
    hoverText: "rgb(244,114,182)",
    glow: "rgba(244, 114, 182, 0.2)",
  },
  Comedy: {
    gradient:
      "linear-gradient(to top right, rgba(146,64,14,0.9) 0%, rgba(251,191,36,0.35) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(180,83,9), rgb(251,191,36))",
    hoverText: "rgb(251,191,36)",
    glow: "rgba(251, 191, 36, 0.2)",
  },
  Drama: {
    gradient:
      "linear-gradient(to top right, rgba(124,45,18,0.9) 0%, rgba(249,115,22,0.35) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(154,52,18), rgb(249,115,22))",
    hoverText: "rgb(251,146,60)",
    glow: "rgba(249, 115, 22, 0.2)",
  },
  Series: {
    gradient:
      "linear-gradient(to top right, rgba(76,29,149,0.9) 0%, rgba(139,92,246,0.35) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(109,40,217), rgb(167,139,250))",
    hoverText: "rgb(167,139,250)",
    glow: "rgba(139, 92, 246, 0.2)",
  },
  Horror: {
    gradient:
      "linear-gradient(to top right, rgba(69,10,10,0.95) 0%, rgba(127,29,29,0.45) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(127,29,29), rgb(185,28,28))",
    hoverText: "rgb(248,113,113)",
    glow: "rgba(185, 28, 28, 0.2)",
  },
  Anime: {
    gradient:
      "linear-gradient(to top right, rgba(14,116,144,0.9) 0%, rgba(34,211,238,0.35) 50%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(8,145,178), rgb(34,211,238))",
    hoverText: "rgb(34,211,238)",
    glow: "rgba(34, 211, 238, 0.2)",
  },
};

const defaultColorSchemes: CategoryColorScheme[] = [
  categoryColorMap.Action,
  categoryColorMap.Adventure,
  categoryColorMap["Sci-Fi"],
  categoryColorMap.Romance,
  categoryColorMap.Comedy,
  categoryColorMap.Drama,
  categoryColorMap.Series,
  categoryColorMap.Anime,
];

const getCategoryColors = (name: string, index: number): CategoryColorScheme => {
  const exact = categoryColorMap[name];
  if (exact) return exact;

  const normalized = Object.keys(categoryColorMap).find(
    (key) => key.toLowerCase() === name.toLowerCase()
  );
  if (normalized) return categoryColorMap[normalized];

  return defaultColorSchemes[index % defaultColorSchemes.length];
};

export default function CategoryPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const authToken = token || localStorage.getItem("authToken");
        const data = await getCategories(authToken);
        setCategories(
          Array.isArray(data) ? data.filter((category) => !category.isDeleted) : []
        );
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load categories. Please sign in and try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [mounted, token]);

  return (
    <div className={visitorPage}>
      <VisitorPageHero
        eyebrow="Explore by category"
        title="Movies"
        description="Stories shaped by genre, emotion, and experience."
        compact
      />

      <section className="px-4 py-12 sm:px-6 md:pl-[96px] md:pr-12">
        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl bg-white/5 sm:h-48 md:h-56"
              />
            ))}
          </div>
        ) : error ? (
          <div className={`${visitorEmptyState} text-[rgb(215,55,45)]`}>{error}</div>
        ) : categories.length === 0 ? (
          <div className={visitorEmptyState}>No categories found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {categories.map((category, index) => {
              const slug = getSlug(category.name);
              const imageUrl = category.image?.signedUrl ?? "";
              const cta = getCtaText(category.name);
              const colors = getCategoryColors(category.name, index);

              return (
                <Link key={category._id} href={`/visitor/category/${slug}`}>
                  <div
                    className={`group relative h-40 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] sm:h-48 md:h-56 ${visitorCard}`}
                    style={{ ["--card-accent" as string]: colors.hoverText }}
                  >
                    <div
                      className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
                      style={{ backgroundColor: colors.glow }}
                    />

                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
                    />

                    <div className="absolute inset-0 bg-[rgb(9,9,11)]/40 transition group-hover:bg-[rgb(9,9,11)]/20" />

                    <div
                      className="absolute inset-0 opacity-85 transition group-hover:opacity-95"
                      style={{ background: colors.gradient }}
                    />

                    <div
                      className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full"
                      style={{ background: colors.bar }}
                    />

                    <div className="relative z-10 flex h-full flex-col justify-end p-4 transition-transform duration-300 group-hover:-translate-y-1">
                      <h2 className="mb-1 text-lg font-semibold sm:text-xl">{category.name}</h2>

                      <span className="text-sm text-zinc-300 transition-colors duration-300 group-hover:text-[color:var(--card-accent)]">
                        {cta}
                        <span className="opacity-0 transition group-hover:opacity-100"> →</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
