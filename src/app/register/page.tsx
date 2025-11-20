"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setMessage("");
    };
  }, []);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPassword(password: string) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!isValidEmail(email)) {
      setMessage("Invalid email format.");
      return;
    }

    if (!isValidPassword(password)) {
      setMessage(
        "Password must be at least 8 characters long and include letters and numbers."
      );
      return;
    }

    // regisztráció
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.code === "user_already_exists") {
        setMessage("This email is already registered.");
      } else {
        setMessage(error.message);
      }
      return;
    }

    setMessage(
      "Registration successful! Check your email to verify your account."
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleRegister}
        autoComplete="off"
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
          autoComplete="nope"
          name="new-email-field"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          name="new-password-field"
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
