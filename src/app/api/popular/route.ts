import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();

  if (!res.ok) {
    console.error("❌ TMDb popular route error:", data);
    return NextResponse.json({ error: "Failed to fetch popular movies" }, { status: res.status });
  }

  return NextResponse.json(data);
}
