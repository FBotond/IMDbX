"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useSession from "@/hooks/useSession";
import SearchMovieCard from "@/app/components/SearchMovieCard";

export default function RecommendationPage() {
  const session = useSession();
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const TMDB = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    if (!session) return;

    async function load() {
      setLoading(true);

      // Users favorite movies from Supabase
      const { data: favRows } = await supabase
        .from("favorites")
        .select("movie_id")
        .eq("user_id", session.user.id);

      const favoriteIds = favRows?.map((r) => r.movie_id) || [];

      // Load search logs
      const { data: logs } = await supabase
        .from("search_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      // Count preferences
      const count = (arr: any[], action: string) =>
        arr.filter((l) => l.action === action).map((l) => l.value);

      const topGenre = mostFrequent(count(logs, "genre"));
      const topLang = mostFrequent(count(logs, "language"));
      const topRating = mostFrequent(count(logs, "rating"));
      const topOpenedMovies = mostFrequent(count(logs, "open_movie"));

      // TMDB calls
      let movies: any[] = [];

      // Similar to favorites
      for (const id of favoriteIds.slice(0, 3)) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB}`
        );
        const json = await res.json();
        movies.push(...json.results);
      }

      // Genre based
      if (topGenre) {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${topGenre}&api_key=${TMDB}`
        );
        const json = await res.json();
        movies.push(...json.results);
      }

      // Language based
      if (topLang) {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_original_language=${topLang}&api_key=${TMDB}`
        );
        const json = await res.json();
        movies.push(...json.results);
      }

      // Rating based
      if (topRating === "high") {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?vote_average.gte=8&api_key=${TMDB}`
        );
        const json = await res.json();
        movies.push(...json.results);
      }

      // Most opened movie similar
      if (topOpenedMovies) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${topOpenedMovies}/similar?api_key=${TMDB}`
        );
        const json = await res.json();
        movies.push(...json.results);
      }

      // Uniq by id
      const uniq = Object.values(
        movies.reduce((acc: any, m: any) => {
          acc[m.id] = m;
          return acc;
        }, {})
      );

      setRecommended(uniq.slice(0, 40));
      setLoading(false);
    }

    load();
  }, [session]);

  function mostFrequent(arr: any[]) {
    if (!arr.length) return null;

    const map: Record<string, number> = {};

    arr.forEach((v) => {
      map[v] = (map[v] || 0) + 1;
    });

    return Object.entries(map).sort(
      (a, b) => Number(b[1]) - Number(a[1])
    )[0][0];
  }

  if (!session)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-800">
        Please log in to see recommendations.
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-800">
        Loading recommendations...
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-6 py-20 flex justify-center">
      <div className="max-w-7xl w-full">
        <h1
          className="text-3xl font-bold text-blue-800 text-center mb-8"
          style={{ marginTop: "1rem" }}
        >
          Recommended For You 🎯
        </h1>

        {recommended.length === 0 ? (
          <p
            className="text-center text-gray-600"
            style={{ marginTop: "1rem" }}
          >
            Not enough activity for recommendations yet.
          </p>
        ) : (
          <div
            className="grid sm:grid-cols-2 md:grid-cols-5 gap-10 justify-items-center"
            style={{ marginTop: "1rem" }}
          >
            {recommended.map((movie: any) => (
              <SearchMovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={parseInt(movie.release_date?.slice(0, 4))}
                poster={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : undefined
                }
                rating={movie.vote_average}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
