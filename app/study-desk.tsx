"use client";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Newspaper,
  Library,
  Landmark,
  Globe2,
  Leaf,
  FlaskConical,
  ChartNoAxesCombined,
  History,
  Brain,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  ExternalLink,
  RefreshCw,
  Layers,
  Search,
  Info,
  CheckCircle2,
} from "lucide-react";
import { subjects, allChapters, type Subject } from "../data/curriculum";
import { questionsFor } from "../lib/questions";
import type { NewsItem } from "../lib/news";
import newsSeed from "../data/news-seed.json";
import papers from "../data/papers.json";
import MainsDesk from "./mains-desk";
import dynamic from "next/dynamic";
const ConstitutionDesk = dynamic(() => import("./constitution-desk"), {
  loading: () => <p>Opening the Constitution revision desk…</p>,
});
import ProgressDesk, { BookmarkButton, StudySculpture } from "./study-tools";
import { useSaved, EMPTY_PROGRESS } from "../lib/study-storage";
import NewsDesk, { type Curation } from "./news-desk";
import currentSeed from "../data/current-affairs-seed.json";
import { studyPages, routeHref, findStudyPage } from "../lib/site-pages";
import pyqIndex from "../data/pyq-index.json";
const icons: Record<string, typeof Landmark> = {
  polity: Landmark,
  history: History,
  geography: Globe2,
  economy: ChartNoAxesCombined,
  environment: Leaf,
  science: FlaskConical,
  current: Globe2,
  csat: Brain,
};
const dateKey = (v: string) =>
  new Date(v).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const pretty = (v: string) =>
  new Date(v.length === 10 ? v + "T12:00:00+05:30" : v).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    },
  );
function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalLink size={14} />
    </a>
  );
}
export default function StudyDesk({
  initialRoute = "syllabus",
}: {
  initialRoute?: string;
}) {
  const [route] = useState(initialRoute),
    [mobile, setMobile] = useState(false),
    [paper, setPaper] = useState("GS I");
  const [news, setNews] = useState<NewsItem[]>([
      ...(currentSeed.items as NewsItem[]),
      ...newsSeed.items,
    ]),
    [checked, setChecked] = useState(newsSeed.checked),
    [newsMessage, setNewsMessage] = useState(
      "Loading the manually published archive…",
    ),
    [loading, setLoading] = useState(false),
    [live, setLive] = useState(false),
    [lastSuccess, setLastSuccess] = useState<string | null>(null);
  const [curation, setCuration] = useState<Curation | null>({
    checked: currentSeed.checked,
    edition: currentSeed.edition,
    status: "partial",
    note: currentSeed.note,
    count: 4,
  });
  const [period, setPeriod] = useState("daily"),
    [date, setDate] = useState(
      newsSeed.items[0]?.date.slice(0, 10) || "2026-10-08",
    ),
    [newsSubject, setNewsSubject] = useState("all"),
    [query, setQuery] = useState("");
  const savedProgress = useSaved("progress", EMPTY_PROGRESS);
  const chapterKey = route.split("/")[1] || "";
  const chapterRecord = savedProgress.value[chapterKey];
  const answers = chapterRecord?.answers || {};
  const qIndex = Math.max(0, Math.min(99, chapterRecord?.index || 0));
  const setAnswers = (next: Record<string, number>) =>
    savedProgress.set((old) => ({
      ...old,
      [chapterKey]: {
        answers: next,
        index: old[chapterKey]?.index || 0,
        updated: new Date().toISOString(),
      },
    }));
  const setQIndex = (index: number) =>
    savedProgress.set((old) => ({
      ...old,
      [chapterKey]: {
        answers: old[chapterKey]?.answers || {},
        index,
        updated: new Date().toISOString(),
      },
    }));
  const [selected, setSelected] = useState<number | null>(null),
    [mode, setMode] = useState("practice"),
    [year, setYear] = useState("all");
  useEffect(() => {
    if (!route.startsWith("chapter/")) return;
    const value = new URLSearchParams(location.search).get("q");
    if (value !== null && /^\d+$/.test(value) && +value < 100)
      setQIndex(+value);
  }, []);
  useEffect(() => {
    const read = () => {
      try {
        const legacy = decodeURIComponent(location.hash.slice(1));
        if (legacy && findStudyPage(legacy))
          location.replace(routeHref(legacy));
      } catch {
        /* Ignore malformed fragment links. */
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  async function refresh(initial = false) {
    setLoading(true);
    setDate(dateKey(new Date().toISOString()));
    if (!initial) setPeriod("daily");
    try {
      const r = await fetch("/api/news");
      if (!r.ok) throw Error();
      const data = (await r.json()) as {
        items: NewsItem[];
        checked: string;
        message: string;
        status: string;
        lastSuccessfulCheck?: string | null;
        curation?: Curation | null;
      };
      setNews(data.items);
      setCuration(data.curation || null);
      setLastSuccess(data.lastSuccessfulCheck || null);
      setChecked(data.checked);
      setNewsMessage(data.message);
      setLive(data.status === "live");
    } catch {
      setNewsMessage(
        "The news service could not be reached. The saved snapshot is still available.",
      );
      setLive(false);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh(true);
  }, []);
  const go = (r: string) => {
    location.assign(routeHref(r));
  };
  const [view, id] = route.split("/");
  const subject = subjects.find((s) => s.id === id);
  const chapter = allChapters.find((c) => c.id === id);
  const parent = subjects.find((s) => s.id === chapter?.subject);
  const questions = useMemo(
    () => questionsFor(view === "chapter" ? id : ""),
    [view, id],
  );
  const q = questions[qIndex];
  const answered = q ? answers[q.id] : undefined;
  const selectedNews = news.filter((n) => {
    const d = dateKey(n.date);
    const end = period === "monthly" ? date.slice(0, 7) + "-31" : date;
    const start =
      period === "monthly"
        ? date.slice(0, 7) + "-01"
        : period === "weekly"
          ? new Date(Date.parse(date + "T12:00:00Z") - 6 * 86400000)
              .toISOString()
              .slice(0, 10)
          : date;
    return (
      d >= start &&
      d <= end &&
      (newsSubject === "all" || n.subject === newsSubject) &&
      (!query || n.title.toLowerCase().includes(query.toLowerCase()))
    );
  });
  const newest = news[0];
  const marks = questions.reduce(
    (sum, x) =>
      sum +
      (answers[x.id] === undefined
        ? 0
        : answers[x.id] === x.answer
          ? 1
          : -1 / 3),
    0,
  );
  const scoreCount = questions.filter((x) => answers[x.id] === x.answer).length;
  const refs = chapter
    ? pyqIndex.filter((x) => x.chapter === chapter.id)
    : pyqIndex;
  const dateRange = news.length
    ? `${pretty(news[news.length - 1].date)} – ${pretty(news[0].date)}`
    : "No collected entries";
  function subjectCard(s: Subject) {
    const Icon = icons[s.id];
    return (
      <button
        key={s.id}
        className="subject-card"
        onClick={() => go("subject/" + s.id)}
        style={{ "--subject": s.color } as React.CSSProperties}
      >
        <div className="subject-top">
          <span className="subject-icon">
            <Icon size={23} />
          </span>
          <span className="micro">
            {s.paper === "GS II"
              ? "QUALIFYING PAPER"
              : `${s.chapters.length} CHAPTERS`}
          </span>
        </div>
        <h3>{s.name}</h3>
        <p>{s.syllabus}</p>
        <div className="subject-bottom">
          <span>{s.chapters.length * 100} practice questions</span>
          <ChevronRight size={19} />
        </div>
      </button>
    );
  }
  function paperLinks() {
    return (
      <div className="paper-links">
        {papers
          .filter((p) => year === "all" || p.year === +year)
          .map((p, i) => (
            <Out key={i} href={p.url}>
              <span>
                <b>{p.year}</b> {p.label}
              </span>
            </Out>
          ))}
      </div>
    );
  }
  function refView() {
    return (
      <>
        <div className="notice">
          <Info size={19} />
          <div>
            <b>Read the original papers.</b>
            <p>
              This topic index uses third-party classifications, not
              independently verified questions. Counts are reference matches,
              not guaranteed unique questions. Full papers and authoritative
              keys are linked at UPSC. The separate practice drills are original
              and are not PYQs.
            </p>
          </div>
        </div>
        <div className="toolbar">
          <label>
            Year{" "}
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="all">All years</option>
              {Array.from({ length: 18 }, (_, i) => 2026 - i).map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <Out href="https://www.upsc.gov.in/examinations/previous-question-papers/archives">
            UPSC paper archive
          </Out>
          <Out href="https://www.upsc.gov.in/examinations/answer-key">
            Official answer keys
          </Out>
        </div>
        {paperLinks()}
        <div className="ref-list">
          {refs
            .filter(
              (r) => year === "all" || r.years.some((y) => y.year === +year),
            )
            .map((r, i) => (
              <div key={i} className="ref-row">
                <div>
                  <span className="micro">{r.subject}</span>
                  <h3>{r.topic}</h3>
                  <p>
                    {r.years
                      .filter((y) => year === "all" || y.year === +year)
                      .map((y) => `${y.year} (${y.count})`)
                      .join(" · ")}
                  </p>
                </div>
                <Out href="https://www.upsc.gov.in/examinations/previous-question-papers/archives">
                  Find paper
                </Out>
              </div>
            ))}
        </div>
        {refs.length === 0 && (
          <div className="empty">
            <Library />
            <h3>Use the official paper archive</h3>
            <p>
              No checked topic index is included for this chapter. The original
              GS II papers contain CSAT questions.
            </p>
          </div>
        )}
        <p className="fine">
          <Out href="https://github.com/mahavishnu47/upsc-prelims-microthemes">
            Topic-index source and attribution
          </Out>
        </p>
      </>
    );
  }
  const navItems = [
    {
      key: "progress",
      label: "My progress & saved",
      Icon: ChartNoAxesCombined,
    },
    { key: "syllabus", label: "Prelims syllabus", Icon: BookOpen },
    { key: "constitution", label: "The Constitution", Icon: Landmark },
    { key: "mains", label: "Mains & optionals", Icon: Layers },
    { key: "news", label: "Current affairs", Icon: Newspaper },
    { key: "papers", label: "Prelims PYQs", Icon: Library },
  ];
  return (
    <div className="shell">
      <a
        className="skip"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      {mobile && (
        <button
          className="scrim"
          aria-label="Close menu"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={"sidebar " + (mobile ? "open" : "")}>
        <a className="brand" href="/">
          <span className="brand-mark">
            G<span>↗</span>
          </span>
          <div>
            GO DAILY<small>THE UPSC STUDY DESK</small>
          </div>
        </a>
        <button
          className="close-menu icon-button"
          onClick={() => setMobile(false)}
          aria-label="Close navigation"
        >
          <X />
        </button>
        <div className="sidebar-label">YOUR PREPARATION</div>
        <nav>
          {navItems.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={
                view === key ||
                (key === "syllabus" && ["subject", "chapter"].includes(view))
                  ? "active"
                  : ""
              }
              onClick={() => go(key)}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-label">PRELIMS SUBJECTS</div>
        <nav className="subject-nav">
          {subjects.map((s) => {
            const Icon = icons[s.id];
            return (
              <button
                key={s.id}
                onClick={() => go("subject/" + s.id)}
                className={
                  subject?.id === s.id || parent?.id === s.id ? "selected" : ""
                }
              >
                <Icon size={17} />
                {s.short}
                <span>{s.chapters.length}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <span className="tiny-line" />
          <b>A little, every day.</b>
          <p>Clarity. Consistency. Progress.</p>
          <small>
            Independent study resource.
            <br />
            Not affiliated with UPSC or The Hindu.
          </small>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="top-title">
            <button
              className="mobile-menu icon-button"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>
            <span>UPSC CIVIL SERVICES</span>
            <span className="divider" />
            <b>{view === "mains" ? "Mains & optionals" : "Prelims"}</b>
          </div>
          <div className="top-right">
            <span className="edition">
              {view === "mains" ? "ESSAY · GS · OPTIONALS" : "GS I + CSAT"}
            </span>
            <a className="avatar" href="/account" aria-label="My account">
              GD
            </a>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {view === "progress" && <ProgressDesk />}
          {view === "constitution" && <ConstitutionDesk />}

          {view === "mains" && <MainsDesk route={route} go={go} />}
          {view === "syllabus" && (
            <>
              <section className="hero">
                <div>
                  <span className="eyebrow">
                    ONE SYLLABUS. ONE DAY AT A TIME.
                  </span>
                  <h1 className="motion-title">
                    GO <span>DAILY</span>
                    <i>.</i>
                  </h1>
                  <p className="creator-credit">
                    Made by <strong>ABHISHEK SINGH</strong>
                  </p>
                  <p>
                    Know the syllabus. Understand the news. Practise with
                    purpose.
                  </p>
                </div>
                <StudySculpture />
                <div className="hero-stats">
                  <b>
                    25<span>study chapters</span>
                  </b>
                  <span />
                  <b>
                    2,500<span>original practice drills</span>
                  </b>
                </div>
                <div className="hero-line" />
              </section>
              <div className="study-launchpad">
                <a href="/constitution">
                  <small>01 / CONNECT THE IDEAS</small>
                  <strong>The Constitution ↗</strong>
                  <span>Explore branches, Articles and revision notes.</span>
                </a>
                <a href="/news">
                  <small>02 / READ WITH PURPOSE</small>
                  <strong>Current affairs ↗</strong>
                  <span>The Hindu, Indian Express and PIB study briefs.</span>
                </a>
                <a href="/progress">
                  <small>03 / KEEP YOUR MOMENTUM</small>
                  <strong>Progress & bookmarks ↗</strong>
                  <span>Resume chapters and revisit saved questions.</span>
                </a>
              </div>
              <div className="section-heading">
                <div>
                  <span className="eyebrow dark">01 / YOUR STARTING POINT</span>
                  <h2>The Prelims syllabus</h2>
                  <p>Choose a subject, open a chapter, start practising.</p>
                </div>
                <div className="segmented">
                  {["GS I", "GS II"].map((p) => (
                    <button
                      key={p}
                      className={paper === p ? "chosen" : ""}
                      onClick={() => setPaper(p)}
                    >
                      {p === "GS I" ? "General Studies" : "CSAT"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="exam-strip">
                <span>
                  <b>
                    {paper === "GS I"
                      ? "General Studies · Paper I"
                      : "CSAT · Paper II"}
                  </b>
                </span>
                <span>200 marks</span>
                <span>2 hours</span>
                <span>
                  {paper === "GS I" ? "Merit screening" : "33% qualifying"}
                </span>
                <Out href="https://www.upsc.gov.in/examinations/revised-syllabus-scheme">
                  Official syllabus
                </Out>
              </div>
              <button className="mains-home-entry" onClick={() => go("mains")}>
                <div>
                  <span className="eyebrow dark">NEW / THE MAINS DESK</span>
                  <h3>Essay, GS I–IV, Philosophy & PSIR</h3>
                  <p>
                    Explore chapters, original answer-writing practice and
                    official papers.
                  </p>
                </div>
                <ChevronRight size={24} />
              </button>
              <a className="mains-home-entry" href="/constitution">
                <div>
                  <span className="eyebrow dark">POLITY / VISUAL REVISION</span>
                  <h3>The Constitution</h3>
                  <p>
                    Interactive map, schedules, amendments and a quick revision
                    quiz.
                  </p>
                </div>
                <ChevronRight size={24} />
              </a>
              <ProgressDesk compact />
              <div className="home-columns">
                <div>
                  <div className="subject-grid">
                    {subjects.filter((s) => s.paper === paper).map(subjectCard)}
                  </div>
                  <div className="coverage-note">
                    <Layers size={20} />
                    <p>
                      <b>Practice and PYQs, clearly separated.</b> Each chapter
                      contains 100 original exercises. GS drills recombine 15
                      core concepts for revision; they are not 100 unique PYQs.
                      Chapter groupings are editorial study units, not official
                      UPSC chapters.
                    </p>
                  </div>
                </div>
                <aside className="today-panel">
                  <div className="panel-title">
                    <Newspaper size={20} />
                    <h3>The reading desk</h3>
                  </div>
                  <div className="reading-date">
                    {newest ? pretty(newest.date) : "Latest available"}
                  </div>
                  <p className="muted">
                    Newspaper analysis, official sources and UPSC study prompts.
                  </p>
                  {news.slice(0, 3).map((n) => (
                    <button
                      key={n.id}
                      className="mini-news"
                      onClick={() => {
                        setDate(dateKey(n.date));
                        setPeriod("daily");
                        go("news");
                      }}
                    >
                      <span className="tag">
                        {n.subject === "mixed"
                          ? "Mixed syllabus"
                          : subjects.find((s) => s.id === n.subject)?.short}
                      </span>
                      <h4>{n.title}</h4>
                      <span className="mini-meta">
                        {pretty(n.date)} <ChevronRight size={15} />
                      </span>
                    </button>
                  ))}
                  <button
                    className="button outline full"
                    onClick={() => go("news")}
                  >
                    Open current affairs
                  </button>
                  <div className="study-rule">
                    <span>THE DAILY HABIT</span>
                    <p>
                      Read for the concept.
                      <br />
                      Revise for the connection.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
          {view === "subject" && subject && (
            <>
              <div className="breadcrumbs">
                <button onClick={() => go("syllabus")}>Syllabus</button>
                <ChevronRight size={14} />
                <span>{subject.short}</span>
              </div>
              <div className="page-heading">
                <span className="eyebrow dark">{subject.paper} / SUBJECT</span>
                <h1>{subject.name}</h1>
                <p>{subject.syllabus}</p>
              </div>
              <div className="chapter-intro">
                <b>{subject.chapters.length} chapters</b>
                <span>
                  {subject.chapters.length * 100} original practice questions
                </span>
                <span>Official PYQ references available separately</span>
              </div>
              <div className="chapter-list">
                {subject.chapters.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => go("chapter/" + c.id)}
                    className="chapter-card"
                  >
                    <span className="chapter-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2>{c.name}</h2>
                      <p>{c.scope}</p>
                      <span className="tag">100 original exercises</span>{" "}
                      <span className="chapter-meta">
                        {c.facts
                          ? "15 core concepts · mixed statement drills"
                          : "Applied aptitude practice"}
                      </span>
                    </div>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </>
          )}
          {view === "chapter" && chapter && q && (
            <>
              <div className="breadcrumbs">
                <button onClick={() => go("syllabus")}>Syllabus</button>
                <ChevronRight size={14} />
                <button onClick={() => go("subject/" + parent?.id)}>
                  {parent?.short}
                </button>
                <ChevronRight size={14} />
                <span>{chapter.name}</span>
              </div>
              <div className="section-heading">
                <div>
                  <span className="eyebrow dark">
                    {chapter.paper} / CHAPTER PRACTICE
                  </span>
                  <h1 className="chapter-title">{chapter.name}</h1>
                  <p>{chapter.scope}</p>
                  <BookmarkButton
                    id={"chapter:" + chapter.id}
                    title={chapter.name}
                    href={"/chapter/" + chapter.id}
                    kind="Chapter"
                  />
                </div>
                <div className="segmented">
                  <button
                    className={mode === "practice" ? "chosen" : ""}
                    onClick={() => setMode("practice")}
                  >
                    Practice
                  </button>
                  <button
                    className={mode === "pyq" ? "chosen" : ""}
                    onClick={() => setMode("pyq")}
                  >
                    PYQ references
                  </button>
                </div>
              </div>
              {mode === "pyq" ? (
                refView()
              ) : (
                <>
                  <p className="practice-notice">
                    Original practice •{" "}
                    {chapter.facts
                      ? "100 combinations of 15 core concepts. Concepts repeat deliberately for revision."
                      : "100 aptitude exercises with worked answers."}{" "}
                    Not official PYQs.
                  </p>
                  <div className="quiz-layout">
                    <section className="question-card">
                      <div className="question-top">
                        <span className="question-num">
                          QUESTION {String(qIndex + 1).padStart(2, "0")}{" "}
                          <span>/ 100</span>
                        </span>
                        <span className="tag">{q.level}</span>
                      </div>
                      <BookmarkButton
                        id={"question:" + q.id}
                        title={q.prompt}
                        href={"/chapter/" + chapter.id + "?q=" + qIndex}
                        kind="Question"
                      />
                      <h2 className="question-text">{q.prompt}</h2>
                      <div
                        className="options"
                        role="radiogroup"
                        aria-label="Answer options"
                      >
                        {q.options.map((o, i) => (
                          <button
                            key={i}
                            role="radio"
                            aria-checked={(answered ?? selected) === i}
                            disabled={answered !== undefined}
                            className={
                              "option " +
                              ((answered ?? selected) === i ? "picked " : "") +
                              (answered !== undefined
                                ? i === q.answer
                                  ? "correct"
                                  : i === answered
                                    ? "incorrect"
                                    : ""
                                : "")
                            }
                            onClick={() => setSelected(i)}
                          >
                            <span className="option-letter">{"ABCD"[i]}</span>
                            <span>{o}</span>
                            {answered !== undefined && i === q.answer && (
                              <Check size={20} />
                            )}
                          </button>
                        ))}
                      </div>
                      {answered !== undefined ? (
                        <div
                          className={
                            "explanation " +
                            (answered === q.answer ? "success" : "review")
                          }
                          role="status"
                        >
                          <b>
                            {answered === q.answer
                              ? "Correct. Keep going."
                              : "Review the reasoning."}
                          </b>
                          <p>{q.explanation}</p>
                          <button
                            className="button outline"
                            onClick={() => {
                              const next = { ...answers };
                              delete next[q.id];
                              setAnswers(next);
                              setSelected(null);
                            }}
                          >
                            Retry this question
                          </button>
                        </div>
                      ) : (
                        <button
                          className="button primary"
                          disabled={selected === null || !savedProgress.ready}
                          onClick={() => {
                            if (selected !== null)
                              setAnswers({ ...answers, [q.id]: selected });
                          }}
                        >
                          Check answer
                        </button>
                      )}
                      <div className="question-footer">
                        <button
                          className="text-button"
                          disabled={qIndex === 0}
                          onClick={() => {
                            setQIndex(qIndex - 1);
                            setSelected(null);
                          }}
                        >
                          <ChevronLeft size={16} />
                          Previous
                        </button>
                        <span>
                          {Object.keys(answers).length} of 100 answered
                        </span>
                        <button
                          className="text-button"
                          disabled={qIndex === 99}
                          onClick={() => {
                            setQIndex(qIndex + 1);
                            setSelected(null);
                          }}
                        >
                          Next
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </section>
                    <aside className="question-side">
                      <h3>Your saved chapter progress</h3>
                      <div className="score-row">
                        <b>
                          {scoreCount}
                          <small>correct</small>
                        </b>
                        <b>
                          {Object.keys(answers).length}
                          <small>attempted</small>
                        </b>
                      </div>
                      <div className="progress-track">
                        <span
                          style={{ width: Object.keys(answers).length + "%" }}
                        />
                      </div>
                      <p className="fine">
                        Net score: {marks.toFixed(2)} / 100
                        <br />
                        Practice scoring: +1 correct, −⅓ wrong.
                        <br />
                        Progress is saved on this browser and device.
                      </p>
                      <div
                        className="question-map"
                        aria-label="Jump to a question"
                      >
                        {questions.map((item, i) => (
                          <button
                            aria-label={`Question ${i + 1}${answers[item.id] === undefined ? "" : ", answered"}`}
                            aria-current={i === qIndex ? "step" : undefined}
                            key={item.id}
                            className={
                              (i === qIndex ? "current " : "") +
                              (answers[item.id] === undefined
                                ? ""
                                : answers[item.id] === item.answer
                                  ? "done"
                                  : "wrong")
                            }
                            onClick={() => {
                              setQIndex(i);
                              setSelected(null);
                            }}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      {Object.keys(answers).length === 100 && (
                        <div className="finished">
                          <CheckCircle2 />
                          <b>Chapter complete</b>
                          <p>
                            {scoreCount}% accuracy. Revisit the marked questions
                            to revise.
                          </p>
                        </div>
                      )}
                      <button
                        className="button outline full"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Clear saved answers for this chapter? Bookmarks will be kept.",
                            )
                          ) {
                            setAnswers({});
                            setQIndex(0);
                            setSelected(null);
                          }
                        }}
                      >
                        Reset chapter progress
                      </button>
                    </aside>
                  </div>
                </>
              )}
            </>
          )}
          {view === "news" && (
            <NewsDesk
              items={news}
              loading={loading}
              refresh={() => refresh()}
              feedChecked={checked}
              feedLive={live}
              lastFeedSuccess={lastSuccess}
              curation={curation}
            />
          )}
          {view === "papers" && (
            <>
              <div className="page-heading">
                <span className="eyebrow dark">03 / LEARN FROM THE EXAM</span>
                <h1>Official papers. Original context.</h1>
                <p>
                  Open UPSC papers and answer keys, or explore the syllabus
                  topic index below.
                </p>
              </div>
              {refView()}
            </>
          )}
          {(![
            "syllabus",
            "subject",
            "chapter",
            "news",
            "papers",
            "mains",
            "progress",
          ].includes(view) ||
            (view === "subject" && !subject) ||
            (view === "chapter" && !chapter)) && (
            <div className="empty">
              <h1>This chapter could not be found</h1>
              <button className="button primary" onClick={() => go("syllabus")}>
                Return to syllabus
              </button>
            </div>
          )}
          <nav className="study-directory" aria-label="Explore study pages">
            <h2>Explore the study desk</h2>
            <div>
              {studyPages
                .filter((p) => {
                  if (p.route === route) return false;
                  if (view === "subject")
                    return (
                      p.route.startsWith("chapter/") &&
                      subject?.chapters.some(
                        (c) => "chapter/" + c.id === p.route,
                      )
                    );
                  if (view === "chapter")
                    return (
                      p.route === "subject/" + parent?.id ||
                      p.route === "syllabus"
                    );
                  if (view === "mains" && id && id !== "papers")
                    return (
                      p.route === "mains" ||
                      p.route === "mains/" + id ||
                      p.route.startsWith("mains/" + id + "/")
                    );
                  return (
                    [
                      "syllabus",
                      "constitution",
                      "mains",
                      "news",
                      "papers",
                      "mains/papers",
                    ].includes(p.route) ||
                    p.route.startsWith("subject/") ||
                    (p.route.startsWith("mains/") &&
                      p.route.split("/").length === 2)
                  );
                })
                .map((p) => (
                  <a key={p.route} href={routeHref(p.route)}>
                    {p.title.split(" — ")[0].split(" | ")[0]}
                  </a>
                ))}
            </div>
          </nav>
          <footer>
            <a href="/">
              GO DAILY<span>.</span>
            </a>
            <span className="footer-credit">
              Made by <strong>ABHISHEK SINGH</strong>
            </span>
            <p>Built for the long game. One focused session at a time.</p>
            <span>UPSC Prelims & Mains · Independent study resource</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
