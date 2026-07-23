import { cookies } from "next/headers";
import HeroSection from "@/components/sections/HeroSection";
import ContentRow from "@/components/sections/ContentRow";
import Footer from "@/components/layout/Footer";
import ContinueWatchingRow from "@/components/sections/ContinueWatchingRow";
import { API_BASE_URL } from "@/lib/apiConfig";
import { visitorPageVisible } from "@/styles/brandColors";
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
async function getMovies(token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/grouped`, {
      cache: "no-store",
      headers: token
        ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
        : {},
    });

    if (!res.ok) return [];
    const data = await res.json();
    const categories = data.categories || data.data || data || [];

    const allMovies = categories.flatMap((cat: any) =>
      (cat.movies || []).map((movie: any) => {
        // Resolve complex client poster structures safely
        let poster = "";
        if (typeof movie.posterimage === "object") {
          poster = movie.posterimage?.signedUrl || "";
        } else if (typeof movie.posterimage === "string") {
          poster = movie.posterimage;
        }

        // Resolve complex client backdrop structures safely
        let backdrop = "";
        if (typeof movie.thumnailimage === "object") {
          backdrop = movie.thumnailimage?.signedUrl || "";
        } else if (typeof movie.thumnailimage === "string") {
          backdrop = movie.thumnailimage;
        }

        const categoryName = (cat.name || cat.category || "").toLowerCase();

        return {
          id: movie._id,
          _id: movie._id, 
          title: movie.title || "Untitled",
          description: movie.description || "",
          director: movie.directors?.[0] || "Unknown",
          cast: movie.cast?.map((c: any) => c.name).join(", ") || "N/A",
          duration: formatDuration(movie.duration),
          rating: parseFloat(String(movie.ageRating || "0")),
          poster,
          posterUrl: poster, 
          backdrop,
          genre: categoryName,
          category: categoryName,
          createdAt: movie.createdAt || new Date(),
        };
      })
    );

    // Filter out potential duplicate cross-category entries and sort newest first
    return allMovies
      .filter(
        (value: any, index: number, self: any[]) =>
          self.findIndex((t) => t.id === value.id) === index
      )
      .sort((a: any, b: any) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });
  } catch (err) {
    console.error("Error fetching movies:", err);
    return [];
  }
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const allMovies = await getMovies(token);

  // Use the already sorted newest-first list directly
  const latestMovies = [...allMovies];
  
  // Hero Movie (The absolute newest one)
  const heroMovie = latestMovies.length > 0 ? latestMovies[0] : null;

  // Recently Added (Last 10)
  const recentlyAdded = latestMovies.slice(0, 10);

  // Trending (From last 15 uploaded, rating > 7)
  const trendingFilms = latestMovies
    .slice(0, 15)
    .filter(m => m.rating > 7);

  // Top Rated (Overall top 10, rating > 8)
  const topRated = [...allMovies]
    .filter(m => m.rating > 8)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Helper function to grab movies by Genre matching lowercase tokens
  const getGenre = (genre: string) => {
    return allMovies.filter(m => m.genre && m.genre.includes(genre.toLowerCase()));
  };

  return (
    <main className={visitorPageVisible}>
      {/* Pass the newest movie to the Hero Section */}
      {heroMovie && <HeroSection movie={heroMovie} />}
      
      <div className="pb-20 pt-4">
        <div
          className="mx-4 mb-6 rounded-2xl border border-white/5 sm:mx-6 md:mx-8 lg:mx-10"
          style={{ background: "rgba(24, 24, 27, 0.25)" }}
        >
          <ContinueWatchingRow movies={allMovies} />
        </div>

        <div className="space-y-2">
        <ContentRow title="Recently Added Films" items={recentlyAdded} />
        <ContentRow title="Trending Films" items={trendingFilms} />
        <ContentRow title="Top Rated Films" items={topRated} />
        
        {/* Dynamic Genre Rows */}
        <ContentRow title="Action Films" items={getGenre("action")} />
        <ContentRow title="Sci-Fi Films" items={getGenre("sci")} />
        <ContentRow title="Thriller Films" items={getGenre("thriller")} />
        <ContentRow title="Adventure Films" items={getGenre("adventure")} />
        <ContentRow title="Comedy Films" items={getGenre("comedy")} />
        <ContentRow title="Drama Films" items={getGenre("drama")} />
        <ContentRow title="Anime" items={getGenre("anime")} />
        </div>
      </div>
      
      <Footer/>
    </main>
  );
}
