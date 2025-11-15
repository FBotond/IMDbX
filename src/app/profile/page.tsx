"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login");
      else setUser(data.session.user);
    });
  }, []);

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>

      <button
        className="px-6 py-2 bg-red-600 text-white rounded-lg"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
