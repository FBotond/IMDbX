"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  poster?: string;
  rating?: number;
}

export default function SearchMovieCard({
  id,
  title,
  year,
  poster,
  rating,
}: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    return stored.includes(id);
  });

  const toggleFavorite = () => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      const updated = stored.filter((movieId: number) => movieId !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      localStorage.setItem("favorites", JSON.stringify([...stored, id]));
      setIsFavorite(true);
    }
  };

  return (
    <div className="bg-blue-800 text-white rounded-xl shadow-md hover:bg-blue-700 transition p-4 flex flex-col items-center relative">

      {/* CLICKABLE POSTER + TITLE */}
      <Link href={`/movie/${id}`} className="w-full flex flex-col items-center">
        {poster ? (
          <Image
            src={poster}
            alt={title}
            width={200}
            height={300}
            className="rounded-lg object-cover mb-4 hover:opacity-80 transition"
          />
        ) : (
          <div className="w-[200px] h-[300px] bg-blue-900 flex items-center justify-center rounded-lg mb-4 text-blue-200">
            No Image
          </div>
        )}

        <h2 className="text-xl font-semibold mb-1 text-center hover:underline">
          {title}
        </h2>
      </Link>

      {/* YEAR */}
      <p className="text-blue-200 mb-1">{year}</p>

      {/* RATING */}
      {rating && (
        <p className="text-yellow-400 font-semibold mb-3">
          ⭐ {rating.toFixed(1)}
        </p>
      )}

      {/* FAVORITE BUTTON */}
      <button
        onClick={toggleFavorite}
        className={`mt-auto px-4 py-2 rounded-lg font-semibold transition ${
          isFavorite
            ? "bg-green-500 hover:bg-green-600"
            : "bg-white text-blue-800 hover:bg-blue-100"
        }`}
      >
        {isFavorite ? "Added ✅" : "Add to Favorites"}
      </button>
    </div>
  );
}
