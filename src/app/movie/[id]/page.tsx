"use client";

import { useEffect, useState, use } from "react";
import { getMovieDetails } from "@/lib/tmdb";
import Image from "next/image";

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

  // Favorites check
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(stored.includes(movieId));
  }, [movieId]);

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

  const toggleFavorite = () => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      const updated = stored.filter((id: number) => id !== movieId);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      localStorage.setItem("favorites", JSON.stringify([...stored, movieId]));
      setIsFavorite(true);
    }
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
      {/* BACKDROP - középre igazítva + térközzel */}
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

      {/* MAIN INFO – igazítva a backdrop szélességéhez */}
      <div className="w-full flex justify-center py-10">
        <div className="max-w-6xl w-full px-4">
          <div
            className="flex flex-col md:flex-row gap-10 items-start"
            style={{ marginTop: "1rem" }}
          >
            {/* POSTER – mobilon középen, desktopon bal oldalon */}
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

            {/* TEXT INFO – a poster mellett egy sorban desktopon */}
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

              <button
                onClick={toggleFavorite}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  isFavorite
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-blue-800 hover:bg-blue-700 text-white"
                }`}
              >
                {isFavorite ? "Added to Favorites ✔" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
