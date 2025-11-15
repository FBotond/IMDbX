"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi"; // Fi = Feather Icons


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-800 text-white px-10 py-4 shadow-md">
      <div className="flex justify-between items-center w-full">
        {/* BAL OLDAL - LOGO */}
        <div className="flex-shrink-0">
          <Link
            href="/home"
            className="flex items-center space-x-2 hover:opacity-90 transition"
          >
            <Image
              src="/Logo.jpg"
              alt="IMDbX Logo"
              width={45}
              height={45}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold tracking-wide">IMDbX</span>
          </Link>
        </div>

        {/* HAMBURGER - MOBILON */}
        <button
          type="button"
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          title={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>


        {/* ASZTALI MENÜ */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-10">
          {/* KÖZÉPSŐ BLOKK */}
          <div className="flex justify-center flex-1">
            <div className="flex justify-between w-[500px] text-lg">
              <Link href="/search" className="hover:text-blue-300 transition">
                Search
              </Link>
              <Link href="/favorites" className="hover:text-blue-300 transition">
                Favorites
              </Link>
              <Link
                href="/recommendation"
                className="hover:text-blue-300 transition"
              >
                Recommendation
              </Link>
            </div>
          </div>

          {/* JOBB OLDAL - LOGOUT */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="px-5 py-2 border-2 border-white text-white font-semibold rounded-lg bg-transparent hover:bg-white hover:text-blue-800 transition"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* MOBIL MENÜ (lenyíló) */}
      {menuOpen && (
        <div className="flex flex-col items-center mt-4 space-y-4 md:hidden text-lg">
          <Link
            href="/search"
            className="hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Search
          </Link>
          <Link
            href="/favorites"
            className="hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Favorites
          </Link>
          <Link
            href="/recommendation"
            className="hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Recommendation
          </Link>
          <Link
            href="/"
            className="px-5 py-2 border-2 border-white text-white font-semibold rounded-lg bg-transparent hover:bg-white hover:text-blue-800 transition"
            onClick={() => setMenuOpen(false)}
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
}
