"use client";
import { useEffect } from "react";
import { getSupabase } from "../lib/supabase";
import { setStorageUser } from "../lib/study-storage";
export default function AuthBridge() {
  useEffect(() => {
    const db = getSupabase();
    if (!db) {
      setStorageUser(null);
      return;
    }
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, session) =>
      setStorageUser(session?.user.id ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);
  return null;
}
