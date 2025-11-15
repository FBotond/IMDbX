"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // csak akkor jelenjen meg a Navbar, ha nem a főoldalon vagyunk
  const showNavbar = pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
