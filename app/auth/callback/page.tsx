"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "../../../lib/supabase";
export default function Callback() {
  const [message, setMessage] = useState("Completing secure sign-in…");
  useEffect(() => {
    let live = true;
    const db = getSupabase();
    if (!db) {
      setMessage("Sign-in is not configured.");
      return;
    }
    db.auth
      .getSession()
      .then(({ data, error }) => {
        if (!live) return;
        if (error || !data.session) {
          setMessage(
            "Sign-in could not be completed. Return to the login page and try again.",
          );
          return;
        }
        window.location.replace("/account");
      })
      .catch(() => setMessage("Sign-in failed. Please try again."));
    return () => {
      live = false;
    };
  }, []);
  return (
    <main className="auth-stage">
      <section className="auth-card">
        <h1>Welcome back.</h1>
        <p role="status">{message}</p>
        <a href="/login">Return to sign-in</a>
      </section>
    </main>
  );
}
