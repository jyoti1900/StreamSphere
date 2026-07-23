"use client";

import { useEffect, useState } from "react";
import ContentRow from "./ContentRow";
import { useAuth, fetchContinueWatching } from "@/context/AuthContext";

type Props = {
  movies: any[];
};

export default function ContinueWatchingRow({ movies }: Props) {
  const { token } = useAuth();
  const [continueMovies, setContinueMovies] = useState<any[]>([]);

  useEffect(() => {
    if (!token) {
      setContinueMovies([]);
      return;
    }

    const loadContinueWatching = async () => {
      const payload = await fetchContinueWatching(token);
      if (!payload?.inProgress?.length) {
        setContinueMovies([]);
        return;
      }

      const inProgressMovies = payload.inProgress
        .map((record: any) => {
          const apiMovie = record?.movie;
          if (!apiMovie) return null;

          const id = apiMovie._id || apiMovie.id;
          const matched = movies.find((m) => String(m.id || m._id) === String(id));

          if (matched) return matched;

          let poster = "";
          if (typeof apiMovie.posterimage === "object") {
            poster = apiMovie.posterimage?.signedUrl || "";
          } else if (typeof apiMovie.posterimage === "string") {
            poster = apiMovie.posterimage;
          }

          const category =
            typeof apiMovie.category === "object"
              ? (apiMovie.category?.name || "").toLowerCase()
              : String(apiMovie.category || apiMovie.genre || "").toLowerCase();

          return {
            id: String(id),
            title: apiMovie.title || "Untitled",
            poster,
            posterUrl: poster,
            category,
            genre: category,
          };
        })
        .filter(Boolean);

      setContinueMovies(inProgressMovies);
    };

    loadContinueWatching();
  }, [token, movies]);

  if (continueMovies.length === 0) return null;

  return <ContentRow title="Continue Watching" items={continueMovies} />;
}
