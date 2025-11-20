"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  //Store previous URL for redirect after login
  useEffect(() => {
    const previousUrl = document.referrer;

    if (
      previousUrl &&
      !previousUrl.includes("/login") &&
      !previousUrl.includes("chrome://")
    ) {
      localStorage.setItem("redirectAfterLogin", previousUrl);
    }
  }, []);

  // Clear fields when leaving the page
  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setError("");
      setKeepLoggedIn(false);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    const loginResponse = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const { error: loginError, data } = loginResponse;

    if (loginError) {
      if (loginError.message.includes("Invalid login credentials")) {
        setError("Incorrect email or password.");
      } else {
        setError(loginError.message);
      }
      return;
    }

    //If NOT keep logged in: session-only login
    if (!keepLoggedIn) {
      // Delete all persistent tokens
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("supabase") || key.includes("sb-")) {
          localStorage.removeItem(key);
        }
      });

      Object.keys(sessionStorage).forEach((key) => {
        if (key.includes("supabase") || key.includes("sb-")) {
          sessionStorage.removeItem(key);
        }
      });

      // Store session in sessionStorage
      if (data?.session) {
        sessionStorage.setItem("sb-session", JSON.stringify(data.session));
      }

      // Tell middleware that sessionStorage session exists
      document.cookie = "sessionStorageSession=true; path=/";
    }

    //REDIRECT HANDLING

    const redirectUrl = localStorage.getItem("redirectAfterLogin");

    if (redirectUrl) {
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectUrl);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-6">
      <div className="bg-blue-100 border border-blue-300 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Login</h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col"
          autoComplete="off"
        >
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded-lg border border-blue-300 mb-3"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="nope"
            name="login-email-field"
          />

          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded-lg border border-blue-300 mb-3"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            name="login-password-field"
          />

          {/* Maradjak bejelentkezve */}
          <label className="flex items-center gap-2 mb-3 text-blue-800">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
            />
            Keep me logged in
          </label>

          {error && <p className="text-red-600 mb-3">{error}</p>}

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
