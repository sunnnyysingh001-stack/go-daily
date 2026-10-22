"use client";
import { useMemo, useState } from "react";
import {
  Bookmark,
  Check,
  ArrowUpRight,
  Target,
  BookOpen,
  RotateCcw,
  Download,
} from "lucide-react";
import { allChapters, subjects } from "../data/curriculum";
import { questionsFor } from "../lib/questions";
import {
  useSaved,
  EMPTY_PROGRESS,
  EMPTY_BOOKMARKS,
  type Bookmarks,
  type SavedBookmark,
  PREFIX,
} from "../lib/study-storage";
export function BookmarkButton({
  id,
  title,
  href,
  kind,
}: {
  id: string;
  title: string;
  href: string;
  kind: SavedBookmark["kind"];
}) {
  const { value, set, ready } = useSaved<Bookmarks>(
    "bookmarks",
    EMPTY_BOOKMARKS,
  );
  const saved = !!value[id];
  return (
    <button
      className={"save-button " + (saved ? "is-saved" : "")}
      disabled={!ready}
      aria-pressed={saved}
      aria-label={(saved ? "Remove bookmark: " : "Bookmark: ") + title}
      onClick={() =>
        set((old) => {
          const next = { ...old };
          if (next[id]) delete next[id];
          else
            next[id] = {
              id,
              title,
              href,
              kind,
              saved: new Date().toISOString(),
            };
          return next;
        })
      }
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
export function StudySculpture() {
  return (
    <div className="study-sculpture" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="sculpture-stack">
        <div className="slab slab-bottom">REVISE</div>
        <div className="slab slab-middle">PRACTISE</div>
        <div className="slab slab-top">
          <BookOpen size={30} />
          <span>
            ONE DAY
            <br />
            CLOSER.
          </span>
        </div>
      </div>
      <i className="orbit-dot" />
    </div>
  );
}
export default function ProgressDesk({
  compact = false,
}: {
  compact?: boolean;
}) {
  const progress = useSaved("progress", EMPTY_PROGRESS),
    bookmarks = useSaved("bookmarks", EMPTY_BOOKMARKS);
  const [tab, setTab] = useState("progress"),
    [filter, setFilter] = useState("All"),
    [exportMessage, setExportMessage] = useState("");
  const stats = useMemo(() => {
    let attempted = 0,
      correct = 0;
    const mistakes: {
      chapter: string;
      name: string;
      index: number;
      prompt: string;
      chosen: string;
      correct: string;
      explanation: string;
    }[] = [];
    const chapters = allChapters.map((c) => {
      const qs = questionsFor(c.id),
        answers = progress.value[c.id]?.answers || {};
      let done = 0,
        right = 0;
      qs.forEach((q, i) => {
        const a = answers[q.id];
        if (!Number.isInteger(a) || a < 0 || a > 3) return;
        done++;
        if (a === q.answer) right++;
        else
          mistakes.push({
            chapter: c.id,
            name: c.name,
            index: i,
            prompt: q.prompt,
            chosen: q.options[a],
            correct: q.options[q.answer],
            explanation: q.explanation,
          });
      });
      attempted += done;
      correct += right;
      return {
        ...c,
        done,
        right,
        updated: progress.value[c.id]?.updated || "",
      };
    });
    return {
      attempted,
      correct,
      mistakes,
      chapters,
      accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
    };
  }, [progress.value]);
  const latest = [...stats.chapters]
    .filter((c) => c.updated)
    .sort((a, b) => b.updated.localeCompare(a.updated))[0];
  const saved = Object.values(bookmarks.value).sort((a, b) =>
    b.saved.localeCompare(a.saved),
  );
  function backup() {
    try {
      const data: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(PREFIX))
          data[k] = JSON.parse(localStorage.getItem(k) || "null");
      }
      const url = URL.createObjectURL(
        new Blob(
          [
            JSON.stringify(
              { version: 1, exported: new Date().toISOString(), data },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "go-daily-study-backup.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportMessage(
        "Backup downloaded. Keep this file with your study notes.",
      );
    } catch {
      setExportMessage(
        "Browser storage is unavailable. Please download Mains answers individually.",
      );
    }
  }
  return (
    <section className={"progress-desk " + (compact ? "compact" : "")}>
      <div className="section-heading">
        <div>
          <span className="eyebrow dark">YOUR PERSONAL STUDY DESK</span>
          {compact ? (
            <h2>Small steps. Visible progress.</h2>
          ) : (
            <h1>Your learning, remembered.</h1>
          )}
          <p>
            Pick up where you left off, and give difficult concepts another
            look.
          </p>
        </div>
        {compact ? (
          <a className="button outline" href="/progress">
            Open my desk
            <ArrowUpRight size={17} />
          </a>
        ) : (
          <button className="button outline" onClick={backup}>
            <Download size={16} />
            Download backup
          </button>
        )}
      </div>
      <div className="progress-metrics">
        <div
          className="metric-ring"
          style={
            {
              "--progress": (stats.attempted / 2500) * 100 + "%",
            } as React.CSSProperties
          }
        >
          <span>
            <b>{Math.round((stats.attempted / 2500) * 100)}%</b>
            <small>completed</small>
          </span>
        </div>
        <div>
          <Target size={20} />
          <b>
            {stats.attempted}
            <small>/ 2,500</small>
          </b>
          <span>questions attempted</span>
        </div>
        <div>
          <Check size={20} />
          <b>{stats.attempted ? stats.accuracy + "%" : "—"}</b>
          <span>answer accuracy</span>
        </div>
        <div>
          <Bookmark size={20} />
          <b>{saved.length}</b>
          <span>saved for later</span>
        </div>
        <div>
          <RotateCcw size={20} />
          <b>{stats.mistakes.length}</b>
          <span>to revisit</span>
        </div>
      </div>
      <p className="storage-caption" role="status">
        {progress.error || bookmarks.error
          ? "Browser storage is unavailable. Changes may be lost when you close this page."
          : "Saved on this browser. Use My account to save or load a cloud backup between devices."}{" "}
        {exportMessage}
      </p>
      {latest && (
        <a className="resume-card" href={"/chapter/" + latest.id}>
          <span>
            <span className="eyebrow dark">CONTINUE YOUR LAST CHAPTER</span>
            <b>{latest.name}</b>
            <small>{latest.done} of 100 answered</small>
          </span>
          <ArrowUpRight size={24} />
        </a>
      )}
      {!compact && (
        <>
          <div className="segmented desk-tabs">
            {[
              ["progress", "Chapter progress"],
              ["bookmarks", "Bookmarks"],
              ["mistakes", "Mistake notebook"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={tab === id ? "chosen" : ""}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === "progress" && (
            <div className="progress-chapters">
              {subjects.map((s) => (
                <article key={s.id}>
                  <h2>{s.name}</h2>
                  {stats.chapters
                    .filter((c) => c.subject === s.id)
                    .map((c) => (
                      <a href={"/chapter/" + c.id} key={c.id}>
                        <span>
                          {c.name}
                          <small>
                            {c.done}/100 answered · {c.right} correct
                          </small>
                        </span>
                        <div
                          className="progress-track"
                          aria-label={`${c.done}% answered`}
                        >
                          <span style={{ width: c.done + "%" }} />
                        </div>
                        <ArrowUpRight size={16} />
                      </a>
                    ))}
                </article>
              ))}
            </div>
          )}
          {tab === "bookmarks" && (
            <>
              <div className="toolbar">
                <label>
                  Show{" "}
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {["All", "Question", "Chapter", "News"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="saved-list">
                {saved
                  .filter((x) => filter === "All" || x.kind === filter)
                  .map((x) => (
                    <article key={x.id}>
                      <div>
                        <span className="tag">{x.kind}</span>
                        <h3>
                          <a href={x.href}>{x.title}</a>
                        </h3>
                      </div>
                      <BookmarkButton {...x} />
                    </article>
                  ))}
              </div>
              {!saved.filter((x) => filter === "All" || x.kind === filter)
                .length && (
                <div className="empty">
                  <Bookmark />
                  <h3>Your reading list starts here.</h3>
                  <p>
                    Use Save on a question, chapter or news card to keep it
                    here.
                  </p>
                  <a className="button outline" href="/">
                    Explore the syllabus
                  </a>
                </div>
              )}
            </>
          )}
          {tab === "mistakes" && (
            <>
              {stats.mistakes.length > 0 && (
                <p className="fine">
                  Incorrect answers appear here automatically. Retry a question
                  in its chapter; a correct answer removes it from this list.
                </p>
              )}
              <div className="mistake-list">
                {stats.mistakes.map((m) => (
                  <article key={m.chapter + m.index}>
                    <span className="tag">
                      {m.name} · Q{m.index + 1}
                    </span>
                    <h3>{m.prompt}</h3>
                    <details>
                      <summary>Review answer and explanation</summary>
                      <p className="mistake-choice">Your answer: {m.chosen}</p>
                      <p>
                        <strong>Correct answer:</strong> {m.correct}
                      </p>
                      <p>{m.explanation}</p>
                    </details>
                    <a
                      className="button outline"
                      href={"/chapter/" + m.chapter + "?q=" + m.index}
                    >
                      Revisit question
                      <ArrowUpRight size={16} />
                    </a>
                  </article>
                ))}
              </div>
              {!stats.mistakes.length && (
                <div className="empty">
                  <Check />
                  <h3>No mistakes to revisit yet.</h3>
                  <p>
                    Complete a practice question to start building your revision
                    record.
                  </p>
                  <a className="button outline" href="/">
                    Start practising
                  </a>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
