"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth, fetchContinueWatching, findWatchRecord } from "@/context/AuthContext";
import MoviePosterCard from "@/components/sections/MoviePosterCard";
import { visitorBtnPrimary, visitorSectionAccent, visitorSectionBar, visitorSectionTitle, visitorTextAccent } from "@/styles/brandColors";

type Movie = {
  id: string;
  title: string;
  description: string;
  director: string;
  cast: string;
  duration: string;
  backdrop: string;
  genre: string;
};

type RelatedMovie = {
  id: string;
  title: string;
  posterUrl: string;
};

export default function MovieClient({
  movie,
  relatedMovies = [],
}: {
  movie: Movie;
  relatedMovies?: RelatedMovie[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const { user, token } = useAuth();

  const [hasProgress, setHasProgress] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      setHasProgress(false);
      setCompleted(false);
      setProgressPercentage(0);
      return;
    }

    const loadWatchStatus = async () => {
      const payload = await fetchContinueWatching(token);
      const record = findWatchRecord(payload, movie.id);

      if (!record) {
        setHasProgress(false);
        setCompleted(false);
        setProgressPercentage(0);
        return;
      }

      setCompleted(Boolean(record.completed));
      setProgressPercentage(Number(record.progressPercentage) || 0);
      setHasProgress(!record.completed && Number(record.watchTime) > 0);
    };

    loadWatchStatus();

    const savedRating = localStorage.getItem(`rating-${user?.email || user?.id || "guest"}-${movie.id}`);
    if (savedRating) setRating(Number(savedRating));
  }, [movie.id, token, user]);

  const handleWatchAction = (targetUrl: string) => {
    if (!token) {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md rounded-lg border border-white/10 bg-[rgb(18,18,20)] shadow-2xl ring-1 ring-[rgba(215,55,45,0.25)]`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-white">Authentication Required</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Please sign in or register to stream content on Streamsphere.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-800">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push("/login");
                }}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-bold text-[rgb(215,55,45)] transition-colors hover:text-[rgb(225,65,55)] focus:outline-none"
              >
                Sign In
              </button>
            </div>
          </div>
        ),
        { duration: 4000 }
      );
      return;
    }
    router.push(targetUrl);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src =
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23121829'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%234b5563' font-family='sans-serif' font-size='10'>No Image</text></svg>";
  };

  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0 z-0 h-[80vh] w-full overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 md:pl-[96px] md:pr-12 pb-20 pt-44">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 text-white">{movie.title}</h1>
          <p className="text-gray-300 mb-4 text-base leading-relaxed">{movie.description}</p>
          <p className="text-gray-400 text-sm mb-1">
            <span className="text-gray-500">Director:</span> {movie.director}
          </p>
          <p className="text-gray-400 text-sm mb-1">
            <span className="text-gray-500">Cast:</span> {movie.cast}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            <span className="text-gray-500">Duration:</span> {movie.duration}
          </p>

          {hasProgress && !completed && (
            <p className={`mb-4 text-sm ${visitorTextAccent}`}>
              Continue watching — {progressPercentage}% complete
            </p>
          )}

          <div className="flex gap-4 mt-6">
            {!hasProgress && !completed && (
              <button
                onClick={() => handleWatchAction(`/visitor/movie/${movie.id}/watch`)}
                className={`${visitorBtnPrimary} cursor-pointer shadow-lg`}
              >
                ▶ Play
              </button>
            )}

            {hasProgress && !completed && (
              <>
                <button
                  onClick={() => handleWatchAction(`/visitor/movie/${movie.id}/watch`)}
                  className={`${visitorBtnPrimary} cursor-pointer shadow-lg`}
                >
                  ▶ Resume
                </button>
                <button
                  onClick={() =>
                    handleWatchAction(`/visitor/movie/${movie.id}/watch?restart=true`)
                  }
                  className="px-6 py-3 border border-white/30 text-white rounded-md cursor-pointer font-bold hover:bg-white/10 transition"
                >
                  🔄 Start Again
                </button>
              </>
            )}

            {completed && (
              <>
                {rating > 0 ? (
                  <button
                    disabled
                    className="px-6 py-3 border border-green-500/50 bg-green-500/10 text-green-400 rounded-md font-bold cursor-default"
                  >
                    ✅ Rated {rating}/5
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRating(true)}
                    className="px-6 py-3 border border-white/30 text-white rounded-md cursor-pointer font-bold hover:bg-white/10 transition"
                  >
                    ⭐ Rate
                  </button>
                )}
                <button
                  onClick={() =>
                    handleWatchAction(`/visitor/movie/${movie.id}/watch?restart=true`)
                  }
                  className="px-6 py-3 border border-white/30 text-white rounded-md cursor-pointer font-bold hover:bg-white/10 transition"
                >
                  🔄 Watch Again
                </button>
              </>
            )}
          </div>
        </div>

        {relatedMovies.length > 0 && (
          <div className="mt-24 pt-8">
            <div className={visitorSectionAccent}>
              <div className={visitorSectionBar} />
              <h2 className={visitorSectionTitle}>People also like</h2>
            </div>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {relatedMovies.map((rm, index) => (
                <MoviePosterCard
                  key={rm.id}
                  id={rm.id}
                  title={rm.title}
                  poster={rm.posterUrl}
                  category={category || movie.genre}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showRating && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="w-80 rounded-xl border border-white/10 bg-[rgb(18,18,20)] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-center text-white">Rate this movie</h3>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => {
                    const key = `rating-${user?.email || user?.id || "guest"}-${movie.id}`;
                    localStorage.setItem(key, String(star));
                    setRating(star);
                    setShowRating(false);
                  }}
                  className="transition cursor-pointer text-3xl"
                >
                  <Star
                    size={32}
                    fill={star <= (hoverRating || rating) ? "#facc15" : "transparent"}
                    color={star <= (hoverRating || rating) ? "#facc15" : "#4b5563"}
                    className="transition-all duration-150 hover:scale-110"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRating(false)}
              className="w-full py-2 bg-gray-800 text-sm text-gray-300 rounded hover:bg-gray-700 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-black/80 backdrop-blur rounded-full text-sm font-bold border border-white/10 hover:bg-black transition shadow-xl text-white cursor-pointer"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
