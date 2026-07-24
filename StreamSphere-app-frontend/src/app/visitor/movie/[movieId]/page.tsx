import { cookies } from "next/headers";
import MovieClient from "./MovieClient";
import { API_BASE_URL } from "@/lib/apiConfig";

function formatDuration(value: unknown) {
  if (value === null || value === undefined || value === "") return "00:00:00";

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return "00:00:00";

  const totalSeconds = Math.round(numericValue);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":")
}

type PageProps = {
  params: Promise<{ movieId: string }>;
};

// This function cleans up broken IPs and relative paths from the database
const sanitizeImageUrl = (imgData: any) => {
  let url = "";
  
  if (typeof imgData === "object" && imgData?.signedUrl) {
    url = imgData.signedUrl;
  } else if (typeof imgData === "string") {
    url = imgData;
  }

  if (!url) return ""; 

  url = url.replace("http://localhost:3000", API_BASE_URL);

  if (url.startsWith("uploads/")) {
    url = `${API_BASE_URL}/${url}`;
  } else if (url.startsWith("/uploads/")) {
    url = `${API_BASE_URL}${url}`;
  }

  return url;
};

export default async function MovieDetailsPage({ params }: PageProps) {
  const { movieId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const res = await fetch(`${API_BASE_URL}/movies/grouped`, {
      cache: "no-store",
      headers: token
        ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
        : {},
    });

    if (!res.ok) {
      return (
        <div className="h-screen flex items-center justify-center bg-black text-gray-400">
          Movie not found (Server Error)
        </div>
      );
    }

    const data = await res.json();
    const categories = data.categories || data.data || data || [];

    const allMovies: any[] = [];
    categories.forEach((cat: any) => {
      if (Array.isArray(cat.movies)) {
        cat.movies.forEach((m: any) => {
          allMovies.push({
            ...m,
            movieCategory: (cat.name || cat.category || "").toLowerCase(),
          });
        });
      }
    });

    const activeMovie = allMovies.find((m: any) => m._id === movieId);
    
    if (!activeMovie) {
      return (
        <div className="h-screen flex items-center justify-center bg-black text-gray-400">
          Movie not found
        </div>
      );
    }

    const currentGenre = activeMovie.movieCategory;
    const relatedMoviesRaw = allMovies
      .filter((m: any) => m.movieCategory === currentGenre && m._id !== activeMovie._id)
      .filter((value: any, index: number, self: any[]) =>
        self.findIndex((t) => t._id === value._id) === index
      )
      .slice(0, 10);

    const backdrop = sanitizeImageUrl(activeMovie.thumnailimage) || sanitizeImageUrl(activeMovie.posterimage);

    const movie = {
      id: activeMovie._id,
      title: activeMovie.title || "Untitled",
      description: activeMovie.description || "No description provided.",
      director:
        Array.isArray(activeMovie.directors) && activeMovie.directors.length > 0
          ? activeMovie.directors[0]
          : "Unknown",
      cast:
        Array.isArray(activeMovie.cast) && activeMovie.cast.length > 0
          ? activeMovie.cast.map((c: any) => c.name).join(", ")
          : "N/A",
      duration: formatDuration(activeMovie.duration),
      backdrop, 
      genre: currentGenre,
    };

    const relatedMovies = relatedMoviesRaw.map((rm: any) => ({
      id: rm._id,
      title: rm.title,
      posterUrl: sanitizeImageUrl(rm.posterimage),
    }));

    return <MovieClient movie={movie} relatedMovies={relatedMovies} />;
  } catch (err) {
    console.error("Error fetching movie details:", err);
    return (
      <div className="h-screen flex items-center justify-center bg-black text-gray-400">
        Error loading movie details.
      </div>
    );
  }
}