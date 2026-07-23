import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import VisitorPageHero from "@/components/layout/VisitorPageHero";
import {
  visitorCard,
  visitorEmptyState,
  visitorPage,
} from "@/styles/brandColors";
import { API_BASE_URL } from "@/lib/apiConfig";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

    if (!Array.isArray(categories)) return [];

    const allMovies = categories.flatMap((cat: any) =>
      (cat.movies || []).map((movie: any) => ({
        ...movie,
        categoryName: cat.name || cat.category,
      }))
    );

    return allMovies;
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

export default async function CategoryListingPage({ params }: PageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  const movies = await getMovies(token);

  const filteredMovies = movies.filter((movie: any) => {
    if (!movie.categoryName || !slug) return false;
    return getSlug(movie.categoryName) === slug;
  });

  const displayTitle = slug
    ? slug === "series"
      ? "Series"
      : `${slug.replace(/-/g, " ")} Movies`
    : "Movies";

  return (
    <div className={visitorPage}>
      <VisitorPageHero
        eyebrow="Category"
        title={displayTitle}
        description={`Browse ${filteredMovies.length} title${filteredMovies.length === 1 ? "" : "s"} in this collection.`}
        compact
      />

      <div className="relative px-4 py-10 sm:px-6 md:pl-[96px] md:pr-12">
        <Link
          href="/visitor/category"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[rgb(215,55,45)]"
        >
          ← Back to Categories
        </Link>

        {filteredMovies.length === 0 ? (
          <div className={visitorEmptyState}>
            <p className="text-lg text-white">No films here yet.</p>
            <p className="mt-2 text-sm">Stay tuned for new releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMovies.map((movie: any) => {
              let poster = movie.posterimage || movie.poster || "";

              if (
                typeof movie.posterimage === "object" &&
                movie.posterimage?.signedUrl
              ) {
                poster = movie.posterimage.signedUrl;
              }

              return (
                <Link
                  key={movie._id}
                  href={`/visitor/movie/${movie._id}?category=${slug}`}
                  className="group"
                >
                  <div className={`relative aspect-[2/3] overflow-hidden ${visitorCard}`}>
                    <Image
                      src={poster || "/fallback.jpg"}
                      alt={movie.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(65,15,15,0.9), transparent 60%)",
                      }}
                    />
                  </div>

                  <p className="mt-2 line-clamp-1 text-sm font-medium text-zinc-300 transition group-hover:text-[rgb(215,55,45)]">
                    {movie.title}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
