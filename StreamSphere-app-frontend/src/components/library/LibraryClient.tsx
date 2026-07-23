"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import VisitorPageHero from "@/components/layout/VisitorPageHero";
import {
  useAuth,
  WATCHTIME_URLS,
  fetchContinueWatching,
} from "@/context/AuthContext";
import { Play, CheckCircle, Star, X } from "lucide-react";
import {
  visitorAvatar,
  visitorBtnPrimary,
  visitorCard,
  visitorEmptyState,
  visitorPage,
  visitorSectionAccent,
  visitorSectionBar,
  visitorSectionTitle,
  visitorStatPill,
} from "@/styles/brandColors";
import { getContentCardColors } from "@/styles/contentCardColors";
import PosterRgbEffects from "@/components/shared/PosterRgbEffects";

type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  genre: string;
  progressPercentage?: number;
};

type LibraryClientProps = {
  movies?: Movie[];
  accessToken?: string | null;
};

function getPosterUrl(movie: any): string {
  if (typeof movie?.posterimage === "object") {
    return movie.posterimage?.signedUrl || "";
  }
  if (typeof movie?.posterimage === "string") {
    return movie.posterimage;
  }
  return movie?.posterUrl || movie?.poster || "";
}

function mapWatchRecord(record: any): Movie | null {
  const movie = record?.movie;
  if (!movie) return null;

  const id = movie._id || movie.id;
  if (!id) return null;

  const genre =
    typeof movie.category === "object"
      ? (movie.category?.name || "").toLowerCase()
      : String(movie.category || movie.genre || "").toLowerCase();

  return {
    id: String(id),
    title: movie.title || "Untitled",
    posterUrl: getPosterUrl(movie),
    genre,
    progressPercentage: record.progressPercentage,
  };
}

function LibraryPosterCard({
  movie,
  index,
  children,
}: {
  movie: Movie;
  index: number;
  children?: ReactNode;
}) {
  const colors = getContentCardColors(movie.genre, index);

  return (
    <div
      className={`relative mb-2 aspect-[2/3] w-full overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl ${visitorCard}`}
      style={{ ["--card-accent" as string]: colors.hoverText }}
    >
      {children}
      <PosterRgbEffects
        colors={colors}
        title={movie.title}
        category={movie.genre}
        showTitleOverlay={false}
      />
    </div>
  );
}

export default function LibraryClient({ movies = [], accessToken }: LibraryClientProps) {
  const { user, token: contextToken } = useAuth();
  const token = accessToken || contextToken;

  const [inProgress, setInProgress] = useState<Movie[]>([]);
  const [history, setHistory] = useState<(Movie & { rating: number | null })[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [favoriteGenre, setFavoriteGenre] = useState<string>("None yet");
  const [watchedCount, setWatchedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);

  const [activeTab, setActiveTab] = useState<"progress" | "history">("progress");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) return;

    const loadLibrary = async () => {
      try {
        const payload = await fetchContinueWatching(token);
        if (!payload) return;

        const apiInProgress = (payload.inProgress || [])
          .map(mapWatchRecord)
          .filter(Boolean) as Movie[];

        const apiHistory = (payload.history || [])
          .map(mapWatchRecord)
          .filter(Boolean)
          .map((movie) => ({ ...movie, rating: null }));

        setInProgress(apiInProgress);
        setHistory(apiHistory);
        setWatchedCount(payload.watchedMoviesCount ?? apiHistory.length);
        setInProgressCount(payload.inProgressMoviesCount ?? apiInProgress.length);

        const genreCounts: Record<string, number> = {};
        apiHistory.forEach((movie) => {
          if (movie.genre) {
            genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
          }
        });

        let topGenre = "None yet";
        let maxCount = 0;
        for (const [genre, count] of Object.entries(genreCounts)) {
          if (count > maxCount) {
            topGenre = genre;
            maxCount = count;
          }
        }

        setFavoriteGenre(topGenre);

        if (movies.length > 0 && topGenre !== "None yet") {
          setRecommended(
            movies
              .filter(
                (m) =>
                  m.genre === topGenre &&
                  !apiHistory.some((h) => h.id === m.id) &&
                  !apiInProgress.some((p) => p.id === m.id)
              )
              .slice(0, 5)
          );
        } else {
          setRecommended([]);
        }
      } catch (err) {
        console.error("Failed to fetch watchtime API:", err);
      }
    };

    loadLibrary();
  }, [token, movies]);

  const handleRemoveProgress = async (e: React.MouseEvent, movieId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) return;

    try {
      const res = await fetch(WATCHTIME_URLS.remove(movieId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setInProgress((prev) => prev.filter((m) => m.id !== movieId));
        setInProgressCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to remove watchtime:", err);
    }
  };

  if (!mounted) return null;

  if (!token) {
    return (
      <div className={`${visitorPage} flex min-h-screen flex-col items-center justify-center gap-6 pt-20`}>
        <p className="text-zinc-400">Please sign in to view your library.</p>
        <Link href="/login">
          <button className={visitorBtnPrimary}>Sign In</button>
        </Link>
      </div>
    );
  }

  const displayName =
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");
  const libraryTitleName = user?.firstName || displayName;
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src =
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23121214'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%234b5563' font-family='sans-serif' font-size='10'>No Image</text></svg>";
  };

  return (
    <div>
      <VisitorPageHero
        eyebrow="Your collection"
        title={`${libraryTitleName}'s Library`}
        description="Pick up where you left off or revisit your watch history."
        compact
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-12">
        <div
          className="mb-12 flex flex-col items-center gap-6 rounded-2xl border border-[rgba(215,55,45,0.15)] p-8 md:flex-row"
          style={{ background: "linear-gradient(to right, rgba(65,15,15,0.25), transparent)" }}
        >
          <div className={`h-20 w-20 text-3xl ${visitorAvatar}`}>{userInitial}</div>
          <div className="text-center md:text-left">
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <span className={visitorStatPill}>
                Watched: <span className="font-bold text-white">{watchedCount}</span>
              </span>
              <span className={visitorStatPill}>
                In Progress: <span className="font-bold text-white">{inProgressCount}</span>
              </span>
              <span className={visitorStatPill}>
                Top Genre:{" "}
                <span className="font-bold capitalize text-[rgb(215,55,45)]">{favoriteGenre}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-6 border-b border-white/10">
          {(["progress", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative cursor-pointer pb-4 text-lg font-semibold transition-colors ${
                activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab === "progress" ? "Continue Watching" : "Watch History"}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 h-[2px] w-full rounded-t-full bg-[rgb(175,35,30)] shadow-[0_-2px_10px_rgba(175,35,30,0.45)]" />
              )}
            </button>
          ))}
        </div>

        <div className="mb-20 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {activeTab === "progress" && inProgress.length === 0 && (
            <div className={`col-span-full ${visitorEmptyState}`}>
              You don't have any movies in progress.
            </div>
          )}

          {activeTab === "history" && history.length === 0 && (
            <div className={`col-span-full ${visitorEmptyState}`}>
              You haven't finished any movies yet.
            </div>
          )}

          {activeTab === "progress" &&
            inProgress.map((movie, index) => (
              <Link key={movie.id} href={`/visitor/movie/${movie.id}`} className="group min-w-0 cursor-pointer">
                <LibraryPosterCard movie={movie} index={index}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    onError={handleImageError}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  {movie.progressPercentage != null && movie.progressPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 z-[3] h-1 bg-zinc-800">
                      <div
                        className="h-full bg-gradient-to-r from-[rgb(175,35,30)] to-[rgb(215,55,45)]"
                        style={{ width: `${movie.progressPercentage}%` }}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 z-[4] flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Play className="h-12 w-12 fill-white text-white drop-shadow-lg" />
                  </div>

                  <button
                    onClick={(e) => handleRemoveProgress(e, movie.id)}
                    className="absolute right-2 top-2 z-[5] rounded-full border border-white/10 bg-black/70 p-1.5 opacity-0 transition-all hover:bg-[rgb(175,35,30)] group-hover:opacity-100"
                    title="Remove from Continue Watching"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </LibraryPosterCard>
                <p className="line-clamp-1 text-sm font-semibold text-zinc-300 transition-colors duration-300 group-hover:text-[color:var(--card-accent)]">
                  {movie.title}
                </p>
              </Link>
            ))}

          {activeTab === "history" &&
            history.map((movie, index) => (
              <Link key={movie.id} href={`/visitor/movie/${movie.id}`} className="group min-w-0 cursor-pointer">
                <LibraryPosterCard movie={movie} index={index}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    onError={handleImageError}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute right-2 top-2 z-[4] rounded-full border border-white/10 bg-black/70 p-1">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </LibraryPosterCard>
                <div className="mt-0 flex items-center justify-between">
                  <p className="line-clamp-1 flex-1 text-sm font-semibold text-zinc-300 transition-colors duration-300 group-hover:text-[color:var(--card-accent)]">
                    {movie.title}
                  </p>
                  {movie.rating && (
                    <div className="ml-2 flex items-center text-xs font-bold text-yellow-500">
                      <Star className="mr-1 h-3 w-3 fill-yellow-500" /> {movie.rating}
                    </div>
                  )}
                </div>
              </Link>
            ))}
        </div>

        {history.length > 0 && recommended.length > 0 && (
          <div className="border-t border-white/10 pt-10">
            <div className={visitorSectionAccent}>
              <div className={visitorSectionBar} />
              <h2 className={`${visitorSectionTitle} capitalize`}>
                Because you like {favoriteGenre}
              </h2>
            </div>
            <p className="mb-6 text-sm text-zinc-400">
              Handpicked recommendations based on your watch history.
            </p>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recommended.map((movie, index) => (
                <Link key={movie.id} href={`/visitor/movie/${movie.id}`} className="group min-w-0 cursor-pointer">
                  <LibraryPosterCard movie={movie} index={index}>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      onError={handleImageError}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  </LibraryPosterCard>
                  <p className="line-clamp-1 text-sm font-semibold text-zinc-300 transition-colors duration-300 group-hover:text-[color:var(--card-accent)]">
                    {movie.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
