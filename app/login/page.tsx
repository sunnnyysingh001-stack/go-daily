"use client";
import { useState } from "react";
import { getSupabase } from "../../lib/supabase";
export default function Login() {
  const [email, setEmail] = useState(""),
    [code, setCode] = useState(""),
    [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function act(kind: "google" | "send" | "verify") {
    const db = getSupabase();
    if (!db) {
      setMessage(
        "Sign-in is awaiting setup by the site owner. You can continue studying as a guest.",
      );
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      if (kind === "google") {
        const { error } = await db.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin + "/auth/callback" },
        });
        if (error) throw error;
      } else if (kind === "send") {
        const { error } = await db.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: true },
        });
        if (error) throw error;
        setSent(true);
        setMessage(
          "Check your inbox for the sign-in code. It may take a moment.",
        );
      } else {
        const { error } = await db.auth.verifyOtp({
          email: email.trim(),
          token: code.trim(),
          type: "email",
        });
        if (error) throw error;
        window.location.assign("/account");
      }
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-stage">
      <section className="auth-intro">
        <a href="/" className="eyebrow dark">
          GO DAILY / YOUR UPSC STUDY DESK
        </a>
        <h1>
          A little, every day.
          <br />
          Always yours.
        </h1>
        <p>
          Keep your preparation together, from your first question to your next
          revision.
        </p>
        <div className="auth-orbit" aria-hidden="true">
          <span>G↗</span>
        </div>
        <small>Made by ABHISHEK SINGH</small>
      </section>
      <section className="auth-card">
        <span className="eyebrow dark">WELCOME TO YOUR DESK</span>
        <h2>Make yourself at home.</h2>
        <p>
          Sign in to save study backups to your account and load them on another
          device.
        </p>
        <button
          className="button outline full"
          disabled={busy}
          onClick={() => act("google")}
        >
          Continue with Google
        </button>
        <div className="auth-divider">or use your email</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act(sent ? "verify" : "send");
          }}
        >
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              disabled={busy || sent}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          {sent && (
            <label>
              Sign-in code
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6,10}"
                minLength={6}
                maxLength={10}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </label>
          )}
          <button className="button primary full" disabled={busy}>
            {busy
              ? "Please wait…"
              : sent
                ? "Verify & sign in"
                : "Email me a code"}
          </button>
        </form>
        {sent && (
          <div className="auth-actions">
            <button
              disabled={busy}
              onClick={() => {
                setSent(false);
                setCode("");
              }}
            >
              Change email
            </button>
            <button disabled={busy} onClick={() => act("send")}>
              Resend code
            </button>
          </div>
        )}
        <p className="auth-message" role="status">
          {message}
        </p>
        <small>
          No password to remember. Your email is used for sign-in and account
          access.
        </small>
        <a href="/" className="text-button">
          Continue studying as a guest →
        </a>
      </section>
    </main>
  );
}
