"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Landmark,
  Search,
  Maximize2,
  Minimize2,
} from "lucide-react";
import data from "../data/constitution.json";
type Topic = {
  title: string;
  subtitle: string;
  articles: string;
  tags: string[];
  core: string;
  points: string[];
  upsc: string;
};
const topics = data.topics as Record<string, Topic>;
const tabs = [
  "Visual map",
  "12 Schedules",
  "Amendments",
  "Landmark cases",
  "Quick quiz",
];
const key = "go-daily:constitution:revised:v1";
export default function ConstitutionDesk() {
  const [tab, setTab] = useState(tabs[0]),
    [branch, setBranch] = useState<string | null>(null),
    [selected, setSelected] = useState<string | null>(null),
    [query, setQuery] = useState(""),
    [revised, setRevised] = useState<string[]>([]),
    [ready, setReady] = useState(false),
    [saveError, setSaveError] = useState(false),
    [wide, setWide] = useState(false),
    [answers, setAnswers] = useState<Record<number, number>>({});
  const detail = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!wide) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWide(false);
    };
    window.addEventListener("keydown", onKey);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = old;
    };
  }, [wide]);
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(value))
        setRevised(value.filter((v) => typeof v === "string"));
    } catch {
      setSaveError(true);
    }
    setReady(true);
  }, []);
  const category = data.categories.find((c) => c.id === branch),
    topic = selected ? topics[selected] : null;
  const term = query.trim().toLowerCase();
  const matches = (t: Topic) =>
    [t.title, t.subtitle, t.articles, t.core, ...t.tags, ...t.points]
      .join(" ")
      .toLowerCase()
      .includes(term);
  const ids = term
    ? Object.keys(topics).filter((id) => matches(topics[id]))
    : category?.children || [];
  function choose(id: string) {
    setSelected(id);
    if (window.matchMedia("(max-width: 1100px)").matches)
      setTimeout(
        () =>
          detail.current?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
            block: "start",
          }),
        0,
      );
  }
  function toggle() {
    if (!selected) return;
    const next = revised.includes(selected)
      ? revised.filter((v) => v !== selected)
      : [...revised, selected];
    setRevised(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }
  return (
    <section
      className={"coi-desk " + (wide ? "coi-wide" : "")}
      aria-label="The Constitution revision desk"
    >
      <header className="coi-heading">
        <div>
          <span className="eyebrow dark">POLITY / CONNECT THE IDEAS</span>
          <h1>The Constitution</h1>
          <p>
            A clear view of the principles, institutions and provisions that
            shape India.
          </p>
        </div>
        <button
          className="button outline"
          onClick={() => setWide(!wide)}
          aria-pressed={wide}
        >
          {wide ? <Minimize2 size={16} /> : <Maximize2 size={16} />}{" "}
          {wide ? "Exit focus" : "Focus view"}
        </button>
      </header>
      <div className="coi-controls">
        <label className="coi-search">
          <Search size={19} />
          <input
            aria-label="Search constitutional topics"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setTab(tabs[0]);
            }}
            placeholder="Find Article 21, duties, federalism…"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </label>
        <span className="coi-count">
          {revised.filter((id) => topics[id]).length} /{" "}
          {Object.keys(topics).length} topics revised
        </span>
      </div>
      <nav className="coi-tabs" aria-label="Revision views">
        {tabs.map((t) => (
          <button
            key={t}
            aria-current={tab === t ? "page" : undefined}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      {tab === tabs[0] ? (
        <div className="coi-layout">
          <div className="coi-canvas">
            <div className="coi-map-heading">
              <div>
                <span className="coi-overline">
                  {term
                    ? "SEARCH RESULTS"
                    : category
                      ? "EXPLORE THE BRANCH"
                      : "THE BIG PICTURE"}
                </span>
                <h2>
                  {term
                    ? `${ids.length} matching topics`
                    : category?.label || "One Constitution. Eight connections."}
                </h2>
              </div>
              {(category || term) && (
                <button
                  className="coi-back"
                  onClick={() => {
                    setBranch(null);
                    setSelected(null);
                    setQuery("");
                  }}
                >
                  <ArrowLeft size={16} />
                  All branches
                </button>
              )}
            </div>
            {!category && !term ? (
              <>
                <div className="coi-root">
                  <Landmark size={28} />
                  <div>
                    <strong>Constitution of India</strong>
                    <span>Choose a branch to explore its topics</span>
                  </div>
                </div>
                <div className="coi-branches">
                  {data.categories.map((c, i) => (
                    <button
                      key={c.id}
                      className="coi-node"
                      style={{ "--node-accent": c.color } as CSSProperties}
                      onClick={() => {
                        setBranch(c.id);
                        setSelected(null);
                      }}
                    >
                      <span className="coi-node-top">
                        <span>0{i + 1}</span>
                        <ArrowUpRight size={18} />
                      </span>
                      <strong>{c.label}</strong>
                      <span>{c.sub}</span>
                      <small>
                        {c.children.length} topics ·{" "}
                        {c.children.filter((id) => revised.includes(id)).length}{" "}
                        revised
                      </small>
                    </button>
                  ))}
                </div>
                <p className="coi-hint">
                  Select a branch → open a topic → revise the key provisions.
                </p>
              </>
            ) : (
              <div className="coi-topics">
                {ids.map((id) => (
                  <button
                    key={id}
                    className={
                      "coi-topic " + (selected === id ? "selected" : "")
                    }
                    onClick={() => choose(id)}
                    aria-pressed={selected === id}
                  >
                    <span className="coi-topic-meta">
                      {topics[id].articles}
                      {revised.includes(id) && <Check size={17} />}
                    </span>
                    <strong>{topics[id].title}</strong>
                    <span>{topics[id].subtitle}</span>
                    <small>Open revision notes ↗</small>
                  </button>
                ))}
                {!ids.length && (
                  <p>
                    No topics match. Try an Article number or a broader keyword.
                  </p>
                )}
              </div>
            )}
          </div>
          <aside ref={detail} className="coi-detail" tabIndex={-1}>
            <span className="coi-overline">YOUR REVISION NOTES</span>
            <h2>
              {topic?.title || category?.label || "Start with a connection"}
            </h2>
            <p className="coi-detail-sub">
              {topic?.subtitle ||
                category?.sub ||
                "Select any branch on the map to begin."}
            </p>
            {topic ? (
              <>
                <div className="coi-chips">
                  {topic.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <h3>Core idea</h3>
                <p>{topic.core}</p>
                <h3>Must remember</h3>
                <ul>
                  {topic.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="coi-angle">
                  <h3>UPSC lens</h3>
                  <p>{topic.upsc}</p>
                </div>
                <button
                  className={
                    "coi-revise " + (revised.includes(selected!) ? "done" : "")
                  }
                  onClick={toggle}
                  disabled={!ready}
                  aria-pressed={revised.includes(selected!)}
                >
                  <Check size={17} />
                  {revised.includes(selected!)
                    ? "Revised — mark unread"
                    : "Mark as revised"}
                </button>
              </>
            ) : (
              <>
                <p>
                  Build a mental link between the constitutional Part, its key
                  Articles and the ideas behind it.
                </p>
                <ol>
                  <li>Choose a branch.</li>
                  <li>Open a topic for clear revision notes.</li>
                  <li>Mark it revised when you can recall it.</li>
                </ol>
              </>
            )}
            <p className="coi-storage" role="status">
              {saveError
                ? "Browser saving is unavailable. Changes may be lost when you leave."
                : "Revision marks are saved on this browser and device."}
            </p>
          </aside>
        </div>
      ) : tab === tabs[4] ? (
        <div className="coi-quiz">
          <div className="coi-map-heading">
            <h2>Test your recall</h2>
            <button className="button outline" onClick={() => setAnswers({})}>
              Restart quiz
            </button>
          </div>
          <p role="status">
            {Object.keys(answers).length} / {data.quiz.length} answered ·{" "}
            {data.quiz.filter((q, i) => answers[i] === q.a).length} correct
          </p>
          {data.quiz.map((q, i) => (
            <article key={q.q} className="coi-quiz-card">
              <span className="coi-overline">QUESTION {i + 1}</span>
              <h3>{q.q}</h3>
              <div>
                {q.opts.map((o, j) => (
                  <button
                    key={o}
                    disabled={answers[i] !== undefined}
                    onClick={() => setAnswers({ ...answers, [i]: j })}
                    className={
                      answers[i] === undefined
                        ? ""
                        : j === q.a
                          ? "correct"
                          : answers[i] === j
                            ? "wrong"
                            : ""
                    }
                  >
                    {o}
                  </button>
                ))}
              </div>
              {answers[i] !== undefined && (
                <p role="status">
                  {answers[i] === q.a ? "Correct." : "Review this one."} Answer:{" "}
                  {q.opts[q.a]}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="coi-reference-grid">
          {(tab === tabs[1]
            ? data.schedules
            : tab === tabs[2]
              ? data.amendments
              : data.cases
          ).map((row, i) => (
            <article className="coi-reference" key={i}>
              <span className="coi-overline">
                {tab === tabs[1]
                  ? "SCHEDULE " + row[0]
                  : tab === tabs[2]
                    ? row[0]
                    : row[1]}
              </span>
              <h2>{tab === tabs[3] ? row[0] : row[1]}</h2>
              {row.length === 4 && (
                <span className="coi-reference-label">{row[2]}</span>
              )}
              <p>{row[row.length - 1]}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
