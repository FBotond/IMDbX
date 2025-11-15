"use client";

import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "@/lib/tmdb";
import SearchMovieCard from "../components/SearchMovieCard";

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [genres, setGenres] = useState<any[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const pageSize = 20; // 4 sor * 5 oszlop desktopon, 10 sor * 2 oszlop mobilon

  useEffect(() => {
    async function loadPopular() {
      try {
        const movies = await getPopularMovies();
        setResults(movies);
      } catch {
        setError("Failed to load popular movies.");
      } finally {
        setLoading(false);
      }
    }
    loadPopular();
  }, []);

  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Failed to load genres");
      }
    }
    loadGenres();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setPage(1); // keresésnél vissza 1. oldalra

    try {
      const movies = await searchMovies(query);
      setResults(movies);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setGenre("");
    setLanguage("");
    setRatingFilter("all");
    setSortOrder("newest");
    setQuery("");
    setResults([]);
    setPage(1);

    try {
      const movies = await getPopularMovies();
      setResults(movies);
    } catch {
      setResults([]);
    }
  };

  // LAPOZÁS – a megfelelő szelet kivágása
  // APPLY FILTERS
  let filtered = [...results];

  // filter by genre
  if (genre) {
    filtered = filtered.filter((movie) =>
      movie.genre_ids?.includes(parseInt(genre))
    );
  }

  // filter by language
  if (language) {
    filtered = filtered.filter((movie) => movie.original_language === language);
  }

  // filter by rating
  if (ratingFilter === "low") {
    filtered = filtered.filter((m) => m.vote_average < 5.0);
  }
  if (ratingFilter === "mid") {
    filtered = filtered.filter(
      (m) => m.vote_average >= 5.1 && m.vote_average <= 7.9
    );
  }
  if (ratingFilter === "high") {
    filtered = filtered.filter((m) => m.vote_average >= 8.0);
  }

  // SORT RESULTS BY RELEASE DATE
  filtered.sort((a, b) => {
    const d1 = new Date(a.release_date).getTime();
    const d2 = new Date(b.release_date).getTime();
    return sortOrder === "newest" ? d2 - d1 : d1 - d2;
  });

  const startIndex = (page - 1) * pageSize;
  const paginatedResults = filtered.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-6 pb-20">
      <div
        className="w-full text-center max-w-7xl mx-auto flex flex-col px-4"
        style={{ marginTop: "1rem" }}
      >
        <h1
          className="text-4xl font-extrabold text-blue-800"
          style={{ marginBottom: "1rem" }}
        >
          Here you can search for movies!
        </h1>

        {/* FILTER BAR ─ MOBILE: collapsed, DESKTOP: normal */}
        <div
          className="
    bg-blue-100 border border-blue-300 p-4 rounded-xl shadow-md w-full 
    mb-20
  "
          style={{ marginBottom: "1rem" }}
        >
          {/* --- MOBILE ONLY: TOGGLE BUTTON --- */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:hidden w-full px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold mb-4"
          >
            {filtersOpen ? "Hide Filters ▲" : "Show Filters ▼"}
          </button>

          {/* --- FILTER CONTENT --- */}
          <div className={`${filtersOpen ? "block" : "hidden"} sm:block`}>
            <div className="flex flex-col sm:flex-row w-full items-center sm:items-end">
              {/* BAL OLDAL – GENRE */}
              <div className="flex-1 flex justify-start mb-6 sm:mb-0">
                <div className="flex flex-col text-center sm:text-left">
                  <label className="font-semibold text-blue-800 mb-1">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">All</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* KÖZÉPSŐ BLOKK – LANGUAGE / RATING / SORT */}
              <div className="flex-[2] flex flex-col sm:flex-row gap-2 sm:gap-32 justify-center items-center text-center sm:text-left">
                {/* LANGUAGE */}
                <div className="flex flex-col">
                  <label className="font-semibold text-blue-800 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">All</option>
                    <option value="en">English</option>
                    <option value="hu">Hungarian</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>

                {/* RATING */}
                <div className="flex flex-col">
                  <label className="font-semibold text-blue-800 mb-1">
                    Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="all">All</option>
                    <option value="low">Below 5.0</option>
                    <option value="mid">5.1 – 7.9</option>
                    <option value="high">8.0 and above</option>
                  </select>
                </div>

                {/* SORT */}
                <div className="flex flex-col">
                  <label className="font-semibold text-blue-800 mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
              </div>

              {/* RESET BUTTON (desktop jobb oldal) */}
              <div className="flex-1 font-semibold text-white flex justify-end mt-6 sm:mt-0 !pr-2 sm:pr-10">
                <button
                  onClick={handleResetFilters}
                  className="px-8 py-2 !bg-blue-800 !text-white !font-semibold !rounded-lg !hover:bg-blue-700 transition shadow-sm !mb-2 md:w-1/4 w-full"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCHBAR BLOCK */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row sm:justify-between items-center w-full gap-6 sm:gap-20"
          style={{ marginBottom: "1rem" }}
        >
          <div className="bg-blue-800 text-white p-6 rounded-xl shadow-md w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 bg-blue-700 text-white placeholder-blue-300 rounded-lg border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="bg-blue-800 text-white p-4 rounded-xl shadow-md w-full sm:w-1/8 md:w-1/8">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-2 bg-white text-blue-800 font-semibold rounded-lg hover:bg-blue-100 transition"
            >
              Search
            </button>
          </div>
        </form>

        {loading && <p className="text-gray-600 text-lg">Loading...</p>}
        {error && <p className="text-red-600 text-lg">{error}</p>}

        {!loading && !error && paginatedResults.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-10 justify-items-center">
              {paginatedResults.map((movie) => (
                <SearchMovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  year={
                    movie.release_date
                      ? parseInt(movie.release_date.substring(0, 4))
                      : "N/A"
                  }
                  rating={movie.vote_average}
                  poster={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : undefined
                  }
                  movieData={movie} // 🔥 TELJES TMDb ADAT!
                />
              ))}
            </div>

            {/* LAPOZÓ GOMBOK */}
            <div className="flex justify-center items-center gap-6 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-5 py-2 rounded-lg font-semibold transition ${
                  page === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-800 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>

              <span className="font-semibold text-blue-800">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-5 py-2 rounded-lg font-semibold transition ${
                  page === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-800 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {!loading && !error && results.length === 0 && (
          <p className="text-gray-500 text-lg" style={{ marginTop: "4rem" }}>
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
