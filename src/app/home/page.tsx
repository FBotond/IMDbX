"use client";

import { useEffect, useState } from "react";
import SearchMovieCard from "@/app/components/SearchMovieCard";

export default function HomePage() {
  const [hottestMovie, setHottestMovie] = useState<any>(null);
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // 🔥 Lekérjük a nap legnépszerűbb filmjét
  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
        );
        const data = await res.json();
        setHottestMovie(data.results?.[0]); // első film
      } catch (err) {
        console.error(err);
      }
    }

    loadTrending();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12 flex flex-col items-center">
      {/* Üdvözlő üzenet */}
      <h1
        className="!text-5xl !font-extrabold text-blue-800 mb-16 text-center"
        style={{ marginTop: "1rem" }}
      >
        Welcome to IMDbX!
      </h1>

      {/* Nap legnépszerűbb filmje */}
      {hottestMovie && (
        <div
          className="max-w-5xl w-full flex flex-col md:flex-row items-center md:items-start gap-10 mb-20"
          style={{ marginTop: "3rem" }}
        >
          {/* Bal oldali szöveg */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-blue-800">
              This is the hottest movie of today:
            </h2>
          </div>

          {/* Jobb oldali MovieCard */}
          <div className="flex-1 flex justify-center">
            <SearchMovieCard
              id={hottestMovie.id}
              title={hottestMovie.title}
              year={
                hottestMovie.release_date
                  ? parseInt(hottestMovie.release_date.substring(0, 4))
                  : "N/A"
              }
              rating={hottestMovie.vote_average}
              poster={
                hottestMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${hottestMovie.poster_path}`
                  : undefined
              }
            />
          </div>
        </div>
      )}

      {/* KÜLÖN LEÍRÁS BLOKK */}
      <div className="max-w-4xl w-full text-center md:text-left mb-20">
        <p
          className="text-gray-700 text-lg italic"
          style={{ marginTop: "2rem" }}
        >
          {/* Későbbi leírás */}
          IMDbX is a moviedatabase website built with Next.js 13 and TypeScript.
          It utilizes The Movie Database (TMDb) API to fetch movie data and
          display it to users. Here's what it can do:
        </p>
        <p
          className="text-gray-700 text-lg italic"
          style={{ marginTop: "1rem" }}
        >
          - You can search for movies, view details, and explore trending films
          in the Search page.
        </p>
        <p className="text-gray-700 text-lg italic">
          - If you register you can add movies to your favourites list in the
          Favourites page.
        </p>
        <p className="text-gray-700 text-lg italic">
          - Based on your search history and Favorites list, it can recommend
          you movies tailored to your liking.
        </p>
      </div>
    </div>
  );
}
