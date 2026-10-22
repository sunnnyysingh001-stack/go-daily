"use client";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Monitor, Check, X } from "lucide-react";
type Mode = "light" | "dark" | "system";
const KEY = "go-daily:appearance";
export default function AppearanceControl() {
  const [mode, setMode] = useState<Mode>("system"),
    [dark, setDark] = useState(false),
    [open, setOpen] = useState(false),
    [error, setError] = useState(false),
    [ready, setReady] = useState(false);
  const wrap = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let initial: Mode = "system";
    try {
      const v = localStorage.getItem(KEY);
      if (v === "light" || v === "dark" || v === "system") initial = v;
    } catch {
      setError(true);
    }
    setMode(initial);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark = mode === "dark" || (mode === "system" && media.matches);
      document.documentElement.dataset.theme = isDark ? "dark" : "light";
      setDark(isDark);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mode, ready]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null)
        setMode(
          e.newValue === "dark" || e.newValue === "light"
            ? e.newValue
            : "system",
        );
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!open) return;
    wrap.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
    const outside = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  function choose(value: Mode) {
    setMode(value);
    try {
      localStorage.setItem(KEY, value);
      setError(false);
    } catch {
      setError(true);
    }
  }
  const Icon = mode === "system" ? Monitor : dark ? Moon : Sun;
  return (
    <div className="appearance-control" ref={wrap}>
      {open && (
        <section
          className="appearance-panel"
          id="appearance-panel"
          aria-label="Appearance settings"
        >
          <div className="appearance-heading">
            <div>
              <span>MAKE IT YOURS</span>
              <h2>Appearance</h2>
            </div>
            <button
              aria-label="Close appearance settings"
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <X size={18} />
            </button>
          </div>
          <fieldset>
            <legend className="appearance-legend">Choose a theme</legend>
            {(
              [
                {
                  value: "light",
                  title: "Light",
                  detail: "A fresh paper canvas",
                  Icon: Sun,
                },
                {
                  value: "dark",
                  title: "Dark",
                  detail: "A calmer evening desk",
                  Icon: Moon,
                },
                {
                  value: "system",
                  title: "Device",
                  detail: "Follow your device setting",
                  Icon: Monitor,
                },
              ] as const
            ).map((option) => (
              <label
                className={
                  "appearance-option " +
                  (mode === option.value ? "selected" : "")
                }
                key={option.value}
              >
                <input
                  type="radio"
                  name="appearance-mode"
                  value={option.value}
                  checked={mode === option.value}
                  onChange={() => choose(option.value)}
                />
                <option.Icon size={21} />
                <span>
                  <b>{option.title}</b>
                  <small>{option.detail}</small>
                </span>
                {mode === option.value && <Check size={17} />}
              </label>
            ))}
          </fieldset>
          <p role="status">
            {error
              ? "Theme applied for now. Browser storage could not save your preference."
              : mode === "system"
                ? `Using your device’s ${dark ? "dark" : "light"} appearance.`
                : "Your choice is saved on this browser."}
          </p>
        </section>
      )}
      <button
        ref={trigger}
        className={"appearance-trigger " + (open ? "expanded" : "")}
        aria-label={
          "Appearance: " +
          (mode === "system" ? "Device" : mode) +
          ". Choose light, dark or device theme"
        }
        aria-expanded={open}
        aria-controls="appearance-panel"
        onClick={() => setOpen((v) => !v)}
        title="Appearance"
      >
        <span className="appearance-icon">
          <Icon size={23} />
        </span>
        <span className="appearance-trigger-label">Appearance</span>
      </button>
    </div>
  );
}
