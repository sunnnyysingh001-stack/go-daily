"use client";
import { useState } from "react";
import { BookmarkButton } from "./study-tools";
import {
  ExternalLink,
  RefreshCw,
  Search,
  PlayCircle,
  Newspaper,
  Landmark,
} from "lucide-react";
import { subjects } from "../data/curriculum";
import { newsPublisher, type NewsItem } from "../lib/news";
const day = (x: string) =>
  new Date(x).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const pretty = (x: string) =>
  new Date(x.length === 10 ? x + "T12:00:00+05:30" : x).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    },
  );
const stamp = (x: string) =>
  new Date(x).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }) + " IST";
export type Curation = {
  checked: string;
  edition: string;
  status: string;
  note: string;
  count: number;
};
export default function NewsDesk({
  items,
  loading,
  refresh,
  feedChecked,
  feedLive,
  lastFeedSuccess,
  curation,
}: {
  items: NewsItem[];
  loading: boolean;
  refresh: () => Promise<void>;
  feedChecked: string;
  feedLive: boolean;
  lastFeedSuccess: string | null;
  curation: Curation | null;
}) {
  const [date, setDate] = useState(() => day(new Date().toISOString()));
  const [period, setPeriod] = useState("daily"),
    [kind, setKind] = useState("all"),
    [subject, setSubject] = useState("all"),
    [query, setQuery] = useState("");
  const start =
    period === "monthly"
      ? date.slice(0, 7) + "-01"
      : period === "weekly"
        ? new Date(Date.parse(date + "T12:00:00Z") - 6 * 86400000)
            .toISOString()
            .slice(0, 10)
        : date;
  const end = period === "monthly" ? date.slice(0, 7) + "-31" : date;
  const edition = items
    .filter((n) => newsPublisher(n))
    .filter((n) => day(n.date) >= start && day(n.date) <= end);
  const selected = edition.filter(
    (n) =>
      (kind === "all" || newsPublisher(n) === kind) &&
      (subject === "all" || n.subject === subject) &&
      (!query ||
        (n.title + " " + n.source + " " + n.focus)
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const videos = edition.filter((n) => n.kind === "video").length,
    official = edition.filter((n) => n.kind === "official").length;
  async function check() {
    setDate(day(new Date().toISOString()));
    setPeriod("daily");
    await refresh();
  }
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow dark">02 / READ. ANALYSE. REVISE.</span>
        <h1>The current affairs desk</h1>
        <p>
          The Hindu · The Indian Express · PIB. Selected UPSC news, updated only
          on your command.
        </p>
      </div>
      <div className="news-source-guide">
        <div>
          <Newspaper size={22} />
          <b>Three sources only</b>
          <p>
            The Hindu, The Indian Express and PIB. Filter by publisher below.
          </p>
        </div>
        <div>
          <Landmark size={22} />
          <b>Check the source</b>
          <p>
            Official releases and publisher links to support your own
            verification.
          </p>
        </div>
        <div>
          <Newspaper size={22} />
          <b>Practise the connection</b>
          <p>
            Prelims revision cues and original Mains prompts alongside each
            selected topic.
          </p>
        </div>
      </div>
      <div className="news-controls">
        <div className="segmented">
          {["daily", "weekly", "monthly"].map((p) => (
            <button
              key={p}
              className={period === p ? "chosen" : ""}
              onClick={() => setPeriod(p)}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <label className="date-label">
          {period === "weekly"
            ? "Week ending"
            : period === "monthly"
              ? "Month"
              : "Edition"}
          <input
            aria-label="Edition date"
            type={period === "monthly" ? "month" : "date"}
            value={period === "monthly" ? date.slice(0, 7) : date}
            onChange={(e) => {
              if (e.target.value)
                setDate(
                  period === "monthly"
                    ? e.target.value + "-01"
                    : e.target.value,
                );
            }}
          />
        </label>
        <button
          className="button outline refresh"
          disabled={loading}
          onClick={check}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          {loading ? "Checking…" : "Reload published news"}
        </button>
      </div>
      <div className="feed-status" role="status">
        <span
          className={
            "status-pill " + (curation?.status === "updated" ? "is-live" : "")
          }
        >
          {curation ? "Saved update" : "Selected references"}
        </span>
        <span>
          {curation ? (
            <>
              Last curation: {stamp(curation.checked)}. {curation.note}
            </>
          ) : (
            <>
              Editions are manually published following requests in chat. Reload
              to see the latest published news.
            </>
          )}
        </span>
      </div>
      <div className="news-filter">
        <label className="search">
          <Search size={17} />
          <input
            placeholder="Search topics, publishers or study cues…"
            aria-label="Search current affairs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Filter publisher"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="all">All sources</option>
          <option value="The Hindu">The Hindu</option>
          <option value="The Indian Express">The Indian Express</option>
          <option value="PIB">PIB</option>
        </select>
        <select
          aria-label="Filter current affairs by subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="all">All subjects</option>
          <option value="mixed">Mixed syllabus</option>
          {subjects
            .filter((s) => s.paper === "GS I")
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.short}
              </option>
            ))}
        </select>
      </div>
      <div className="edition-heading">
        <h2>
          {period === "monthly"
            ? new Date(date + "T12:00:00Z").toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })
            : period === "weekly"
              ? "Seven days ending " + pretty(date)
              : pretty(date)}
        </h2>
        <span>{selected.length} selected references</span>
      </div>
      <p className="coverage-caption">
        {["The Hindu", "The Indian Express", "PIB"]
          .map(
            (p) =>
              p + ": " + edition.filter((n) => newsPublisher(n) === p).length,
          )
          .join(" · ")}
        . Counts show saved entries for this period. Zero means no verified
        entry is available. Weekly and monthly views group saved editions; this
        is selected coverage.
      </p>
      <details className="news-method">
        <summary>The Hindu through YouTube · supplementary study</summary>
        <p>
          YouTube newspaper-analysis videos may be used when their date, channel
          and content can be verified. Independent educators are not The Hindu.
          No verified video has been added for 15 October; search results are
          not an analysed edition.
        </p>
        <a
          className="text-button"
          href="https://www.youtube.com/results?search_query=The+Hindu+newspaper+analysis+15+October+2026+UPSC"
          target="_blank"
          rel="noopener noreferrer"
        >
          Search YouTube for the 15 October edition <ExternalLink size={14} />
        </a>
      </details>
      <div className="news-grid">
        {selected.map((n) => (
          <article
            className={
              "news-card " + (n.kind === "video" ? "video-reference" : "")
            }
            key={n.id}
          >
            <div className="news-card-top">
              <span className="tag">
                {n.subject === "mixed"
                  ? "Mixed syllabus"
                  : subjects.find((s) => s.id === n.subject)?.short}
              </span>
              <time dateTime={n.date}>{pretty(n.date)}</time>
            </div>
            <div className="source-type">
              {n.kind === "video" ? (
                <>
                  <PlayCircle size={18} />
                  YOUTUBE ANALYSIS
                </>
              ) : n.kind === "official" ? (
                <>
                  <Landmark size={16} />
                  OFFICIAL / POLICY SOURCE
                </>
              ) : (
                "NEWSPAPER HEADLINE"
              )}
            </div>
            <BookmarkButton
              id={"news:" + n.id}
              title={n.title}
              href={n.url}
              kind="News"
            />
            <h2>{n.title}</h2>
            <div className="news-source">{n.source}</div>
            {n.note && <p className="source-note">{n.note}</p>}
            {n.evidence === "reviewed" && n.summary && (
              <div className="source-summary">
                <span className="eyebrow dark">
                  SOURCE BRIEF · ORIGINAL ANALYSIS
                </span>
                <p>{n.summary}</p>
              </div>
            )}
            <div className="revision">
              <span className="eyebrow dark">PRELIMS CONNECTION</span>
              <p>{n.focus}</p>
              {n.mains && (
                <>
                  <span className="eyebrow dark">
                    MAINS PRACTICE · ORIGINAL PROMPT
                  </span>
                  <p>{n.mains}</p>
                </>
              )}
            </div>
            <div className="news-card-bottom">
              <a href={n.url} target="_blank" rel="noopener noreferrer">
                {n.kind === "video" ? "Watch on YouTube" : "Read source"}
                <ExternalLink size={14} />
              </a>
              <a
                className="text-button"
                href={n.chapter ? "/chapter/" + n.chapter : "/"}
              >
                {n.chapter ? "Revise chapter" : "Explore syllabus"}
              </a>
            </div>
          </article>
        ))}
      </div>
      {!selected.length && (
        <div className="empty">
          <Newspaper size={36} />
          <h3>No saved references for this selection</h3>
          <p>
            Try another date or source filter. Missing dates are not shown as
            complete editions.
          </p>
          <button
            className="button primary"
            disabled={!items.length}
            onClick={() => {
              setDate(day(items[0].date));
              setPeriod("daily");
              setKind("all");
              setSubject("all");
              setQuery("");
            }}
          >
            Open latest available edition
          </button>
        </div>
      )}
      <details className="news-method">
        <summary>Sources, freshness and update status</summary>
        <p>
          Only The Hindu, The Indian Express and PIB are included. “Reference”
          means only source metadata was verified; it is not a reviewed article
          summary. Source briefs paraphrase accessible reporting; study
          connections and practice prompts are GO DAILY analysis. Publisher
          subscriptions may be required for full articles.
        </p>
        <p>
          News is updated manually following requests in chat. Reloading
          retrieves the published archive; it does not collect new stories.
          Older editions remain available in the daily, weekly and monthly
          views.
        </p>
      </details>
    </>
  );
}
