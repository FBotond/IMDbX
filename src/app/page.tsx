export const metadata = {
  title: "Welcome | IMDbX",
};

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-800 to-blue-500 text-white text-center">
      <div className="p-10 bg-white/10 rounded-2xl backdrop-blur-md shadow-lg">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to IMDbX!</h1>
        <p className="text-lg text-blue-100 mb-8">
          Your personalized movie searching and recommendation platform.
        </p>
        <Link
          href="/home"
          className="px-8 py-3 border-2 border-white text-blue-300 font-semibold rounded-lg shadow-md bg-transparent hover:bg-white hover:text-blue-700 transition"
        >
          Enter IMDbX →
        </Link>
      </div>
    </div>
  );
}
