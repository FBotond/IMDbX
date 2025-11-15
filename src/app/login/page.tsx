"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setError(error.message);

    router.push("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-6">
      <div className="bg-blue-100 border border-blue-300 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded-lg border border-blue-300"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded-lg border border-blue-300"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
