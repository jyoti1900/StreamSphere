"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MovieProgress } from "@/types/movieProgress";

type MovieContextType = {
  getProgress: (movieId: string) => MovieProgress | null;
  updateProgress: (movieId: string, time: number) => void;
  markCompleted: (movieId: string) => void;
  setRating: (movieId: string, rating: number) => void;
};

const MovieContext = createContext<MovieContextType | null>(null);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [movieState, setMovieState] = useState<
    Record<string, MovieProgress>
  >({});
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("movie-progress");
    if (saved) {
      setMovieState(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("movie-progress", JSON.stringify(movieState));
    }
  }, [movieState, mounted]);

  const getProgress = (movieId: string) => {
    return movieState[movieId] || null;
  };

  const updateProgress = (movieId: string, time: number) => {
    setMovieState((prev) => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        lastTime: time,
        completed: false,
      },
    }));
  };

  const markCompleted = (movieId: string) => {
    setMovieState((prev) => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        lastTime: prev[movieId]?.lastTime || 0,
        completed: true,
      },
    }));
  };

  const setRating = (movieId: string, rating: number) => {
    setMovieState((prev) => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        rating,
      },
    }));
  };

  return (
    <MovieContext.Provider
      value={{
        getProgress,
        updateProgress,
        markCompleted,
        setRating,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovie() {
  const ctx = useContext(MovieContext);
  if (!ctx) {
    throw new Error("useMovie must be used inside MovieProvider");
  }
  return ctx;
}