"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase";
import {
  PREFIX,
  setStorageUser,
  writeSaved,
  clearSavedCache,
} from "../../lib/study-storage";
import { validateBackup } from "../../lib/account-backup";
export default function Account() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    const db = getSupabase();
    if (!db) {
      setReady(true);
      return;
    }
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStorageUser(session?.user.id ?? null);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function action(kind: "save" | "load" | "delete" | "logout") {
    const db = getSupabase();
    if (!db || !user) return;
    if (
      kind === "load" &&
      !confirm(
        "Replace this account’s progress on this browser with its last cloud backup?",
      )
    )
      return;
    if (
      kind === "save" &&
      !confirm(
        "Replace the cloud backup with this browser’s current study progress?",
      )
    )
      return;
    if (
      kind === "delete" &&
      !confirm(
        "Permanently delete your account and cloud backup? This cannot be undone.",
      )
    )
      return;
    setBusy(true);
    try {
      if (kind === "save") {
        const values: Record<string, unknown> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k?.startsWith(PREFIX))
            values[k.slice(PREFIX.length)] = JSON.parse(
              localStorage.getItem(k) || "null",
            );
        }
        const payload = validateBackup(values);
        const { error } = await db
          .from("study_backups")
          .upsert({
            user_id: user.id,
            payload,
            updated_at: new Date().toISOString(),
          });
        if (error) throw error;
        setMessage(
          "Cloud backup saved. On another device, sign in and choose Load cloud backup.",
        );
      }
      if (kind === "load") {
        const { data, error } = await db
          .from("study_backups")
          .select("payload,updated_at")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          setMessage(
            "No cloud backup yet. Save one from the device with your progress.",
          );
          return;
        }
        replaceLocal(validateBackup(data.payload));
        setMessage(
          "Loaded cloud backup from " +
            new Date(data.updated_at).toLocaleString(),
        );
      }
      if (kind === "delete") {
        const { error } = await db.rpc("delete_my_account");
        if (error) throw error;
        clearLocal();
        await db.auth.signOut({ scope: "local" });
        setStorageUser(null);
        window.location.assign("/");
      }
      if (kind === "logout") {
        const { error } = await db.auth.signOut();
        if (error) throw error;
        setStorageUser(null);
        window.location.assign("/login");
      }
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "The request failed. Your existing data has not been intentionally removed.",
      );
    } finally {
      setBusy(false);
    }
  }
  function clearLocal() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    clearSavedCache();
  }
  function replaceLocal(data: Record<string, unknown>) {
    clearLocal();
    Object.entries(data).forEach(([k, v]) => writeSaved(k, v));
  }
  async function importFile(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 1500000) throw Error("Backup is too large");
      const raw = JSON.parse(await file.text());
      if (raw.version !== 1 || !raw.data)
        throw Error("Choose a GO DAILY backup JSON");
      const mapped: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(raw.data)) {
        const marker = k.indexOf(":v1:");
        if (marker < 0) throw Error("Invalid backup key");
        mapped[k.slice(marker + 4)] = v;
      }
      const values = validateBackup(mapped);
      if (
        !confirm(
          "Replace this account’s browser progress with the imported backup?",
        )
      )
        return;
      replaceLocal(values);
      setMessage(
        "Backup imported on this browser. Choose Save cloud backup to keep it in your account.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Import failed");
    }
  }
  return (
    <main className="auth-stage">
      <section className="auth-card account-card">
        <a href="/" className="eyebrow dark">
          GO DAILY / YOUR ACCOUNT
        </a>
        <h1>Your desk, wherever you study.</h1>
        {!ready ? (
          <p>Checking your account…</p>
        ) : !user ? (
          <>
            <p>Sign in to manage cloud backups.</p>
            <a className="button primary" href="/login">
              Sign in
            </a>
          </>
        ) : (
          <>
            <p>{user.email}</p>
            <p>
              Progress saves locally while you study. Save a cloud backup before
              switching devices, then load it on the other device. Cloud backups
              are manual; simultaneous edits are not merged.
            </p>
            <div className="auth-actions">
              <button
                className="button primary"
                disabled={busy}
                onClick={() => action("save")}
              >
                Save cloud backup
              </button>
              <button
                className="button outline"
                disabled={busy}
                onClick={() => action("load")}
              >
                Load cloud backup
              </button>
            </div>
            <label>
              Bring progress from the old site
              <input
                type="file"
                accept="application/json,.json"
                disabled={busy}
                onChange={(e) => importFile(e.target.files?.[0])}
              />
            </label>
            <a href="/progress" className="button outline">
              Open my progress & download backup
            </a>
            <button disabled={busy} onClick={() => action("logout")}>
              Sign out
            </button>
            <details>
              <summary>Delete account</summary>
              <p>
                Removes your sign-in account and cloud backup, plus account
                progress from this browser. Export anything you need first.
              </p>
              <button
                disabled={busy}
                className="button outline"
                onClick={() => action("delete")}
              >
                Permanently delete my account
              </button>
            </details>
          </>
        )}
        <p role="status">{message}</p>
        <a href="/">Back to study desk →</a>
      </section>
    </main>
  );
}
