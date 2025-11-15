"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // PAGINATION
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // --- LOAD FAVORITES FROM LOCALSTORAGE ---
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

      // stored = csak ID-k, ezért TMDb adatokra van szükség
      async function loadDetails() {
        const fullData = await Promise.all(
          stored.map(async (id: number) => {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            return await res.json();
          })
        );
        setFavorites(fullData);
      }

      loadDetails();
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- LOAD GENRES (TMDb) ---
  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch {}
    }
    loadGenres();
  }, []);

  // --- REMOVE FAVORITE ---
  const removeFavorite = (id: number) => {
    const updated = favorites.filter((m) => m.id !== id);
    setFavorites(updated);
    localStorage.setItem(
      "favorites",
      JSON.stringify(updated.map((m) => m.id))
    );
  };

  // --- RESET FILTERS ---
  const handleResetFilters = () => {
    setGenre("");
    setLanguage("");
    setRatingFilter("all");
    setSortOrder("newest");
    setPage(1);
  };

  // APPLY FILTERS
  let filtered = [...favorites];

  if (genre) {
    filtered = filtered.filter((m) =>
      m.genres?.some((g: any) => g.id === parseInt(genre))
    );
  }

  if (language) {
    filtered = filtered.filter((m) => m.original_language === language);
  }

  if (ratingFilter === "low") filtered = filtered.filter((m) => m.vote_average < 5.0);
  if (ratingFilter === "mid") filtered = filtered.filter((m) => m.vote_average >= 5.1 && m.vote_average <= 7.9);
  if (ratingFilter === "high") filtered = filtered.filter((m) => m.vote_average >= 8.0);

  filtered.sort((a, b) => {
    const d1 = new Date(a.release_date).getTime();
    const d2 = new Date(b.release_date).getTime();
    return sortOrder === "newest" ? d2 - d1 : d1 - d2;
  });

  // PAGINATION
  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-800">
        Loading your favorites...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-20 flex justify-center">
      <div className="max-w-7xl w-full" style={{ marginTop: "1rem" }}>
        <h1
          className="text-3xl font-extrabold text-blue-800 text-center mb-10"
          style={{ marginBottom: "1rem" }}
        >
          Your Favorite Movies ⭐
        </h1>

        {/* FILTER BAR */}
        <div
          className="
            bg-blue-100 border border-blue-300 p-4 rounded-xl shadow-md w-full
          "
          style={{ marginBottom: "1rem" }}
        >
          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:hidden w-full px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold mb-4"
          >
            {filtersOpen ? "Hide Filters ▲" : "Show Filters ▼"}
          </button>

          {/* FILTER CONTENT */}
          <div className={`${filtersOpen ? "block" : "hidden"} sm:block`}>
            <div className="flex flex-col sm:flex-row w-full items-center sm:items-end">

              {/* LEFT – GENRE */}
              <div className="flex-1 flex justify-start mb-6 sm:mb-0">
                <div className="flex flex-col text-center sm:text-left">
                  <label className="font-semibold text-blue-800 mb-1">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-blue-300 bg-white"
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

              {/* CENTER BLOCK — LANGUAGE / RATING / SORT */}
              <div className="flex-[2] flex flex-col sm:flex-row gap-2 sm:gap-32 justify-center items-center text-center sm:text-left">
                <div className="flex flex-col">
                  <label className="font-semibold text-blue-800 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-blue-300 bg-white"
                  >
                    <option value="">All</option>
                    <option value="en">English</option>
                    <option value="hu">Hungarian</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-blue-800 mb-1">Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-blue-300 bg-white"
                  >
                    <option value="all">All</option>
                    <option value="low">Below 5.0</option>
                    <option value="mid">5.1 – 7.9</option>
                    <option value="high">8.0 and above</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-blue-800 mb-1">Sort</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-blue-300 bg-white"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
              </div>

              {/* RIGHT – RESET */}
              <div className="flex-1 flex justify-end mt-6 sm:mt-0 !pr-1 sm:pr-10">
                <button
                  onClick={handleResetFilters}
                  className="px-8 py-2 !bg-blue-800 !text-white !font-semibold !rounded-lg !hover:bg-blue-700 transition !mb-2 w-full sm:w-1/4"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {paginated.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">
            No favorites match your filters.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-10 justify-items-center">
              {paginated.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-blue-800 text-white p-4 rounded-xl shadow-md relative"
                >
                  <Link href={`/movie/${movie.id}`}>
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/no-poster.jpg"
                      }
                      alt={movie.title}
                      className="rounded-lg mb-4 cursor-pointer hover:opacity-80 transition"
                    />
                  </Link>

                  <h2 className="text-xl font-semibold">{movie.title}</h2>
                  <p className="text-blue-200">{movie.release_date?.slice(0, 4)}</p>
                  <p className="text-yellow-400 font-semibold mb-3">
                    ⭐ {movie.vote_average}
                  </p>

                  <button
                    onClick={() => removeFavorite(movie.id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
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
      </div>
    </div>
  );
}
