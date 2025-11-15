/*export const metadata = {
  title: "Mainpage",
};*/

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-20 px-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-800">
          Welcome to IMDbX! 🎬
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Explore movies, rate your favorites, and discover new recommendations tailored to you.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 mt-10">
          <div className="bg-blue-800 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition">
            <h2 className="text-2xl font-semibold mb-2">🎥 Search</h2>
            <p className="text-blue-100">Find your favorite movies and TV shows.</p>
          </div>

          <div className="bg-blue-800 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition">
            <h2 className="text-2xl font-semibold mb-2">⭐ Favorites</h2>
            <p className="text-blue-100">Save movies you love for easy access later.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
