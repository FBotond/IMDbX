"use client";

import Image from "next/image";

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  poster?: string;
  rating?: number;
}

export default function MovieCard({ id, title, year, poster, rating }: MovieCardProps) {
  return (
    <div className="bg-blue-800 text-white rounded-xl shadow-md hover:bg-blue-700 transition p-4 flex flex-col items-center relative">
      {poster ? (
        <Image
          src={poster}
          alt={title}
          width={200}
          height={300}
          className="rounded-lg object-cover mb-4"
        />
      ) : (
        <div className="w-[200px] h-[300px] bg-blue-900 flex items-center justify-center rounded-lg mb-4 text-blue-200">
          No Image
        </div>
      )}

      <h2 className="text-xl font-semibold mb-1 text-center">{title}</h2>
      <p className="text-blue-200 mb-1">{year}</p>
      {rating && <p className="text-yellow-400 font-semibold mb-3">⭐ {rating.toFixed(1)}</p>}
    </div>
  );
}
