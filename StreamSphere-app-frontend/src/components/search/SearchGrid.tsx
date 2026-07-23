"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import SearchSkeleton from "./SearchSkeleton";
import { useAuth, API_BASE_URL } from "@/context/AuthContext";
import { visitorEmptyState } from "@/styles/brandColors";

interface Movie {
  id: string;
  title: string;
  genre: string;
  poster: string;
}

interface Props {
  query: string;
  activeGenre: string | null;
}

export default function SearchGrid({ query, activeGenre }: Props) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [results, setResults] = useState<Movie[]>([]);

  const searchTerm = query.toLowerCase();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const authToken = token || localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/movies/grouped`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        if (!res.ok) return;

        const data = await res.json();
        const categories = data.categories || data.data || data || [];
        if (!Array.isArray(categories)) return;

        const allMovies = categories.flatMap((cat: any) =>
          (cat.movies || []).map((movie: any) => {
            let poster = "";

            if (typeof movie.posterimage === "object") {
              poster = movie.posterimage?.signedUrl || "";
            } else if (typeof movie.posterimage === "string") {
              poster = movie.posterimage;
            }

            const genre = cat.name || cat.category || "Unknown";

            return {
              id: movie._id,
              title: movie.title || "Untitled",
              genre,
              poster: poster || "/fallback.jpg",
            };
          })
        );

        setMovies(allMovies);
        setResults(allMovies);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = movies.filter((movie) => {
        const matchesQuery =
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.genre.toLowerCase().includes(searchTerm);

        const matchesGenre = activeGenre
          ? movie.genre.toLowerCase() === activeGenre.toLowerCase()
          : true;

        return matchesQuery && matchesGenre;
      });

      setResults(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeGenre, movies, searchTerm]);

  if (loading) return <SearchSkeleton />;

  if (!results.length) {
    return (
      <div className={`mx-6 ${visitorEmptyState}`}>
        <p className="text-xl text-white">No results found.</p>
        <p className="mt-2 text-sm">
          Try another title or explore different genres.
        </p>
      </div>
    );
  }

  return (
    <section className="px-6 pb-20">
      <p className="mb-6 text-sm text-zinc-500">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
