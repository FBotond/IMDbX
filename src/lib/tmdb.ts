const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Keresés név alapján
export async function searchMovies(query: string) {
  if (!query) return await getPopularMovies();

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );

  if (!res.ok) throw new Error("Failed to fetch movies");
  const data = await res.json();
  return data.results || [];
}

// Legnépszerűbb filmek lekérése
export async function getPopularMovies() {
  const res = await fetch("/api/popular");
  if (!res.ok) throw new Error("Failed to fetch popular movies");

  const data = await res.json();
  return data.results || [];
}

// Film adatainak lekérése
export async function getMovieDetails(id: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
  );

  if (!res.ok) throw new Error("Failed to fetch movie details");
  return await res.json();
}


