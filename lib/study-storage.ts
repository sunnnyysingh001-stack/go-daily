"use client";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
export let PREFIX = "go-daily:pending:v1:";
let accountReady = false;
export function setStorageUser(id: string | null) {
  const next = id ? "go-daily:account:" + id + ":v1:" : "go-daily:v1:";
  if (PREFIX === next && accountReady) return;
  PREFIX = next;
  accountReady = true;
  memory.clear();
  failedKeys.clear();
  window.dispatchEvent(new Event("go-daily-save"));
}
const memory = new Map<string, string>();
let storageFailed = false;
const failedKeys = new Set<string>();
function subscribe(fn: () => void) {
  window.addEventListener("storage", fn);
  window.addEventListener("go-daily-save", fn);
  return () => {
    window.removeEventListener("storage", fn);
    window.removeEventListener("go-daily-save", fn);
  };
}
export function clearSavedCache() {
  memory.clear();
  failedKeys.clear();
  window.dispatchEvent(new Event("go-daily-save"));
}
export function readSaved(key: string) {
  if (typeof window === "undefined" || !accountReady) return null;
  if (failedKeys.has(key)) return memory.get(key) ?? null;
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    storageFailed = true;
    return memory.get(key) ?? null;
  }
}
export function writeSaved(key: string, value: unknown) {
  if (!accountReady) throw Error("Account is still loading");
  const raw = JSON.stringify(value);
  memory.set(key, raw);
  try {
    localStorage.setItem(PREFIX + key, raw);
    failedKeys.delete(key);
  } catch {
    storageFailed = true;
    failedKeys.add(key);
  }
  window.dispatchEvent(new Event("go-daily-save"));
}
export function useSaved<T>(key: string, initial: T) {
  useSyncExternalStore(
    subscribe,
    () => PREFIX + String(accountReady),
    () => "pending",
  );
  const raw = useSyncExternalStore(
    subscribe,
    () => readSaved(key),
    () => null,
  );
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const value = useMemo(() => {
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as T)
        : initial;
    } catch {
      return initial;
    }
  }, [raw]);
  const set = (next: T | ((old: T) => T)) => {
    let old = initial;
    try {
      const v = readSaved(key);
      if (v) old = JSON.parse(v);
    } catch {
      /* Recover malformed local data. */
    }
    writeSaved(
      key,
      typeof next === "function" ? (next as (v: T) => T)(old) : next,
    );
  };
  return { value, set, ready: ready && accountReady, error: storageFailed };
}
export type ChapterProgress = {
  answers: Record<string, number>;
  index: number;
  updated: string;
};
export type Progress = Record<string, ChapterProgress>;
export type SavedBookmark = {
  id: string;
  title: string;
  href: string;
  kind: "Question" | "Chapter" | "News";
  saved: string;
};
export type Bookmarks = Record<string, SavedBookmark>;
export const EMPTY_PROGRESS: Progress = {};
export const EMPTY_BOOKMARKS: Bookmarks = {};
