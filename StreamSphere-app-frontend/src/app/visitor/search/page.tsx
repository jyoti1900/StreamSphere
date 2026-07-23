"use client";

import { useEffect, useState } from "react";

import {
  SearchHero,
  SearchFilters,
  SearchGrid,
} from "@/components/search";
import { visitorPage } from "@/styles/brandColors";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const [activeGenre, setActiveGenre] =
    useState<string | null>(null);

  const [genres, setGenres] = useState<string[]>([
    "Action",
    "Anime",
    "Sci-fi",
    "Romance",
    "Comedy",
    "Drama",
    "Adventure",
    "Horror",
    "Thriller",
  ]);

  // 🔥 FETCH CATEGORIES


  return (
    <main className={visitorPage}>
      <SearchHero
        query={query}
        setQuery={setQuery}
      />

      <div className="mt-6">
        <SearchFilters
          genres={genres}
          activeGenre={activeGenre}
          setActiveGenre={setActiveGenre}
        />
      </div>

      <SearchGrid
        query={query}
        activeGenre={activeGenre}
      />
    </main>
  );
}