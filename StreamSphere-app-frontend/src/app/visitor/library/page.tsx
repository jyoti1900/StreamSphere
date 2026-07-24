import { cookies } from "next/headers";
import LibraryClient from "@/components/library/LibraryClient";
import { API_BASE_URL } from "@/lib/apiConfig";
import { visitorPage } from "@/styles/brandColors";

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

export default async function LibraryPage() {
  let normalizedMovies: any[] = [];
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    const res = await fetch(`${API_BASE_URL}/movies/grouped`, {
      cache: "no-store",
      headers: token
        ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
        : {},
    });

    if (res.ok) {
      const data = await res.json();
      const categories = data.categories || data.data || data || [];

      const allMovies: any[] = [];

      categories.forEach((cat: any) => {
        if (Array.isArray(cat.movies)) {
          cat.movies.forEach((m: any) => {
            allMovies.push({
              id: m._id,
              title: m.title || "Untitled",
              posterUrl: sanitizeImageUrl(m.posterimage),
              genre: (cat.name || cat.category || "").toLowerCase(),
            });
          });
        }
      });

      normalizedMovies = allMovies.filter(
        (value: any, index: number, self: any[]) =>
          self.findIndex((t) => t.id === value.id) === index
      );
    }
  } catch (error) {
    console.error("Error fetching library movies:", error);
  }

  return (
    <main className={visitorPage}>
      <LibraryClient
        movies={normalizedMovies}
        accessToken={token ? decodeURIComponent(token) : null}
      />
    </main>
  );
}
