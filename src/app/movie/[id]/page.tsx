"use client";

import { useEffect, useState, use } from "react";
import { getMovieDetails } from "@/lib/tmdb";
import Image from "next/image";
import useSession from "@/hooks/useSession";
import { supabase } from "@/lib/supabaseClient";

export default function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const movieId = parseInt(id);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const session = useSession();

  // 🔥 NEW — film megnyitás logolása a recommendation rendszerhez
  useEffect(() => {
    if (!session) return;

    supabase.from("search_logs").insert({
      user_id: session.user.id,
      action: "open_movie",
      value: movieId.toString(),
    });
  }, [session, movieId]);

  // Supabase: kedvenc státusz betöltése
  useEffect(() => {
    const loadFavorite = async () => {
      if (!session) {
        setIsFavorite(false);
        return;
      }

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId)
        .maybeSingle();

      setIsFavorite(!!data);
    };

    loadFavorite();
  }, [session, movieId]);

  // Load movie details
  useEffect(() => {
    async function load() {
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [movieId]);

  // Supabase kedvenc hozzáadás / törlés
  const toggleFavorite = async () => {
    if (!session) return;

    setFavLoading(true);

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movieId);

      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({
        user_id: session.user.id,
        movie_id: movieId,
      });

      setIsFavorite(true);
    }

    setFavLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-800">
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        Movie not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* BACKDROP */}
      {movie.backdrop_path && (
        <div
          className="w-full flex justify-center py-8"
          style={{ marginTop: "1rem" }}
        >
          <div className="max-w-6xl w-full px-4 flex justify-center">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt="Backdrop"
              width={1200}
              height={700}
              className="rounded-xl shadow-md object-cover"
            />
          </div>
        </div>
      )}

      {/* MAIN INFO */}
      <div className="w-full flex justify-center py-10">
        <div className="max-w-6xl w-full px-4">
          <div
            className="flex flex-col md:flex-row gap-10 items-start"
            style={{ marginTop: "1rem" }}
          >
            {/* POSTER */}
            <div className="flex justify-center md:justify-start w-full md:w-auto">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/no-poster.jpg"
                }
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg shadow-md"
              />
            </div>

            {/* TEXT INFO */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-1xl !font-bold text-blue-800 mb-2">
                {movie.title}
              </h1>

              <p className="text-gray-600 text-lg mb-4">
                {movie.release_date?.substring(0, 4)} • {movie.runtime} min
              </p>

              {/* Genres */}
              <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
                {movie.genres?.map((g: any) => (
                  <span
                    key={g.id}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <p className="text-yellow-500 font-bold text-xl mb-6">
                ⭐ {movie.vote_average?.toFixed(1)}
              </p>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {movie.overview}
              </p>

              {/* FAVORITE BUTTON — csak bejelentkezve */}
              {session && (
                <button
                  onClick={toggleFavorite}
                  disabled={favLoading}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    isFavorite
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-blue-800 hover:bg-blue-700 text-white"
                  } ${favLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {favLoading
                    ? "Saving..."
                    : isFavorite
                    ? "Added to Favorites ✔"
                    : "Add to Favorites"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
