"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function useSession() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      // Ha sessionStorage-ban van session → session-only login volt
      const temp = sessionStorage.getItem("sb-session");
      if (temp) {
        try {
          const parsed = JSON.parse(temp);
          setSession(parsed);
          return;
        } catch {}
      }

      // Egyébként normál Supabase session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return session;
}
