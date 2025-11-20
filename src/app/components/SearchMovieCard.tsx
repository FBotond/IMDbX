"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useSession from "@/hooks/useSession"; // 🔥 MEGMARAD
import { supabase } from "@/lib/supabaseClient"; // 🔥 HOZZÁADVA

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
  const session = useSession(); // 🔥 MEGMARAD

  const [isFavorite, setIsFavorite] = useState<boolean>(false); // 🔥 localStorage törölve
  const [favLoading, setFavLoading] = useState<boolean>(false); // 🔥 HOZZÁADVA

  // 🔥 Supabase-ből betöltjük, hogy kedvenc-e
  useEffect(() => {
    const loadFavorite = async () => {
      if (!session) {
        setIsFavorite(false);
        return;
      }

      setFavLoading(true);

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("movie_id", id)
        .maybeSingle();

      setIsFavorite(!!data);
      setFavLoading(false);
    };

    loadFavorite();
  }, [session, id]);

  // 🔥 Supabase kedvenc hozzáadás / eltávolítás
  const toggleFavorite = async () => {
    if (!session) return;

    setFavLoading(true);

    if (isFavorite) {
      // TÖRLÉS
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", id);

      setIsFavorite(false);
    } else {
      // HOZZÁADÁS
      await supabase.from("favorites").insert({
        user_id: session.user.id,
        movie_id: id,
      });

      setIsFavorite(true);
    }

    setFavLoading(false);
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

      {/* FAVORITE BUTTON — csak bejelentkezve */}
      {session && (
        <button
          onClick={toggleFavorite}
          disabled={favLoading}
          className={`mt-auto px-4 py-2 rounded-lg font-semibold transition ${
            isFavorite
              ? "bg-green-500 hover:bg-green-600"
              : "bg-white text-blue-800 hover:bg-blue-100"
          } ${favLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {favLoading
            ? "Saving..."
            : isFavorite
            ? "Added ✅"
            : "Add to Favorites"}
        </button>
      )}
    </div>
  );
}
