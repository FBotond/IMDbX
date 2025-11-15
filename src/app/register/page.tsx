"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Registration successful! Check your email to verify your account."
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleRegister}
        className="bg-blue-100 p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-blue-800 mb-4">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>

        {message && (
          <p className="text-center text-blue-800 font-semibold mt-4">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
