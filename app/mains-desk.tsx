"use client";
import { useState } from "react";
import { useSaved } from "../lib/study-storage";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  PenLine,
  Library,
  Check,
  Download,
  Search,
  Compass,
} from "lucide-react";
import {
  mainsPapers,
  mainsTotals,
  syllabusUrl,
  type MainsPaper,
  type MainsChapter,
} from "../data/mains-curriculum";
import papers from "../data/mains-papers.json";
const officialArchive =
  "https://www.upsc.gov.in/examinations/previous-question-papers/archives";
function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={16} />
    </a>
  );
}
function PaperLibrary({ paperId }: { paperId?: string }) {
  const [year, setYear] = useState("all"),
    [filter, setFilter] = useState(paperId || "all"),
    [query, setQuery] = useState("");
  const selection = papers.filter(
    (p) =>
      (filter === "all" || p.paper === filter) &&
      (year === "all" || p.year === +year) &&
      p.label.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="mains-library">
      <div className="section-heading">
        <div>
          <span className="eyebrow dark">OFFICIAL PYQ LIBRARY</span>
          <h2>Study the question in its original paper.</h2>
          <p>
            2016–2026 · {papers.length} official PDF links across the included
            papers.
          </p>
        </div>
        <Library size={29} />
      </div>
      <p className="mains-note">
        These are complete official papers, not transcribed questions or model
        answers. Chapter-level PYQ tagging is not yet verified. Use the
        chapter's concept list to find relevant questions in the selected PDF.
        Availability varies by paper and language; this is not an all-years
        archive.
      </p>
      <div className="mains-filters">
        <label>
          Paper
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All included papers</option>
            {mainsPapers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Year
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">All years</option>
            {[...new Set(papers.map((p) => p.year))].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>
        <label className="mains-search">
          Find a language or paper
          <div>
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Hindi, English, Essay"
            />
          </div>
        </label>
      </div>
      <p className="fine" role="status">
        {selection.length} papers match your filters. PDFs open at UPSC in a new
        tab.
      </p>
      <div className="mains-paper-grid">
        {selection.map((p) => (
          <a
            key={p.year + p.label + p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mains-paper-year">{p.year}</span>
            <span>
              <b>{p.label}</b>
              <small>UPSC · Official PDF</small>
            </span>
            <ArrowUpRight size={18} />
          </a>
        ))}
      </div>
      {!selection.length && (
        <div className="empty">
          <h3>No paper matches these filters</h3>
          <p>Try a different year or clear your search.</p>
          <button
            className="button outline"
            onClick={() => {
              setYear("all");
              setFilter("all");
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="mains-source-row">
        <Link href="https://www.upsc.gov.in/examinations/previous-question-papers">
          Current UPSC papers
        </Link>
        <Link href={officialArchive}>Older official archive</Link>
      </div>
    </section>
  );
}
function AnswerPractice({
  paper,
  chapter,
}: {
  paper: MainsPaper;
  chapter: MainsChapter;
}) {
  const [index, setIndex] = useState(0),
    [tab, setTab] = useState("practice");
  const draftStore = useSaved<Record<number, string>>(
    "drafts:" + paper.id + ":" + chapter.id,
    {},
  );
  const drafts = draftStore.value,
    setDrafts = draftStore.set;
  const reviewStore = useSaved<Record<number, string[]>>(
    "reviews:" + paper.id + ":" + chapter.id,
    {},
  );
  const reviews = reviewStore.value,
    setReviews = reviewStore.set;
  const draft = drafts[index] || "",
    review = reviews[index] || [];
  const setDraft = (value: string) =>
    setDrafts((previous) => ({ ...previous, [index]: value }));
  const setReview = (value: string[]) =>
    setReviews((previous) => ({ ...previous, [index]: value }));
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const isEssay = paper.id === "essay",
    isLanguage = paper.group === "Qualifying",
    isCase = paper.id === "gs4" && chapter.id === "4";
  const target = isEssay
    ? 1000
    : isLanguage
      ? 250
      : isCase
        ? 250
        : index === 0
          ? 150
          : 250;
  const minutes = isEssay
    ? 60
    : isLanguage
      ? 20
      : isCase
        ? 20
        : index === 0
          ? 8
          : 12;
  const checks = [
    "I answered the directive and every part of the question.",
    "My key concepts are defined and used accurately.",
    "My claims have relevant reasoning or verified examples.",
    "I considered an objection, trade-off or alternative.",
    "My conclusion follows from the argument.",
  ];
  function download() {
    const blob = new Blob(
      [
        `${paper.name} / ${chapter.name}\nOriginal practice question\n${chapter.questions[index]}\n\n${draft}\n\nSelf-review: ${review.length}/${checks.length} checked`,
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `go-daily-${paper.id}-chapter-${chapter.id}-draft.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="mains-tabs" aria-label="Chapter sections">
        {[
          { id: "practice", label: "Answer writing", Icon: PenLine },
          { id: "analysis", label: "Chapter analysis", Icon: Compass },
          { id: "pyq", label: "Official PYQs", Icon: Library },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id)}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
      {tab === "practice" && (
        <div className="mains-writing-layout">
          <section className="mains-answer">
            <div className="mains-answer-top">
              <span className="tag">ORIGINAL PRACTICE</span>
              <span>
                {index + 1} / {chapter.questions.length}
              </span>
            </div>
            <div className="mains-question-picker">
              {chapter.questions.map((q, i) => (
                <button
                  key={q}
                  className={index === i ? "active" : ""}
                  onClick={() => {
                    setIndex(i);
                  }}
                >
                  Question {i + 1}
                </button>
              ))}
            </div>
            <h2>{chapter.questions[index]}</h2>
            <div className="mains-target">
              <span>Suggested: {isEssay ? "1,000–1,200" : target} words</span>
              <span>{minutes} min practice</span>
            </div>
            <p className="fine">
              Suggested targets are for these original exercises, not official
              marking rules. Drafts and review checklists are saved on this
              browser and device. Download a copy for backup; clearing browser
              data removes local drafts.
            </p>
            <label className="mains-draft-label" htmlFor="mains-draft">
              Your answer
            </label>
            {draftStore.error && (
              <p role="alert">
                Browser saving is unavailable. Download your draft before
                leaving.
              </p>
            )}
            <textarea
              disabled={!draftStore.ready}
              id="mains-draft"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Start with a short outline. State your argument, develop it with evidence, and close with a reasoned conclusion."
            />
            <div className="mains-draft-bottom">
              <span role="status">
                {words} words{" "}
                <span className="muted">
                  / {isEssay ? "1,000–1,200" : target} suggested
                </span>
              </span>
              <button
                className="button outline"
                onClick={download}
                disabled={!draft.trim()}
              >
                <Download size={16} />
                Download draft
              </button>
            </div>
            <div className="mains-self-review">
              <h3>Review your answer</h3>
              <p className="fine">
                A self-review checklist, not an automated score or UPSC
                evaluation.
              </p>
              {checks.map((c) => (
                <label key={c}>
                  <input
                    type="checkbox"
                    checked={review.includes(c)}
                    onChange={(e) =>
                      setReview(
                        e.target.checked
                          ? [...review, c]
                          : review.filter((x) => x !== c),
                      )
                    }
                  />
                  <span>{c}</span>
                </label>
              ))}
              <span className="fine">
                {review.length} of {checks.length} reviewed
              </span>
            </div>
          </section>
          <aside className="mains-coach">
            <span className="eyebrow dark">THINK BEFORE YOU WRITE</span>
            <h3>The analytical lens</h3>
            <p>{chapter.analysis}</p>
            <div className="mains-coach-rule" />
            <h4>Build the answer</h4>
            <p>{paper.method}</p>
            <div className="mains-pitfall">
              <b>Watch for this</b>
              <p>{chapter.pitfall}</p>
            </div>
            <button className="text-button" onClick={() => setTab("analysis")}>
              Open chapter guide
              <ChevronRight size={16} />
            </button>
          </aside>
        </div>
      )}
      {tab === "analysis" && (
        <div className="mains-analysis">
          <article>
            <span className="eyebrow dark">01 / CONCEPT MAP</span>
            <h2>What to study</h2>
            <p>{chapter.scope}</p>
            <span className="eyebrow dark">02 / ARGUMENT & EVALUATION</span>
            <h2>How to analyse it</h2>
            <p>{chapter.analysis}</p>
            <span className="eyebrow dark">03 / ANSWER STRUCTURE</span>
            <h2>Turn knowledge into an answer</h2>
            <p>{paper.method}</p>
            <div className="mains-pitfall">
              <b>Common mistake</b>
              <p>{chapter.pitfall}</p>
            </div>
          </article>
          <aside className="mains-coach">
            <h3>Your evidence notebook</h3>
            <ol>
              <li>Record one precise definition or theoretical claim.</li>
              <li>
                Add a verified example, argument or institutional illustration.
              </li>
              <li>Note a serious objection and your response.</li>
              <li>Keep the source and date beside factual evidence.</li>
            </ol>
            <p className="fine">
              These are original editorial study guides, not official model
              answers, topic-frequency analysis or predictions.
            </p>
            <Link href={syllabusUrl}>Check the official syllabus</Link>
          </aside>
        </div>
      )}
      {tab === "pyq" && <PaperLibrary key={paper.id} paperId={paper.id} />}
    </>
  );
}
export default function MainsDesk({
  route,
  go,
}: {
  route: string;
  go: (route: string) => void;
}) {
  const [, paperId, chapterId] = route.split("/");
  const paper = mainsPapers.find((p) => p.id === paperId),
    chapter = paper?.chapters.find((c) => c.id === chapterId);
  const [category, setCategory] = useState("All papers"),
    [search, setSearch] = useState("");
  if (paperId === "papers" || (paper && chapterId === "papers"))
    return (
      <>
        <div className="breadcrumbs">
          <button onClick={() => go("mains")}>Mains syllabus</button>
          <ChevronRight size={14} />
          <span>PYQ library</span>
        </div>
        <PaperLibrary key={paper?.id || "all"} paperId={paper?.id} />
      </>
    );
  if ((paperId && !paper) || (chapterId && !chapter))
    return (
      <div className="empty">
        <h2>This Mains chapter could not be found</h2>
        <button className="button primary" onClick={() => go("mains")}>
          Open Mains syllabus
        </button>
      </div>
    );
  if (paper)
    return (
      <>
        <div className="breadcrumbs">
          <button onClick={() => go("mains")}>Mains syllabus</button>
          <ChevronRight size={14} />
          <button onClick={() => go("mains/" + paper.id)}>{paper.short}</button>
          {chapter && (
            <>
              <ChevronRight size={14} />
              <span>{chapter.name}</span>
            </>
          )}
        </div>
        <div className="page-heading">
          <span className="eyebrow dark">
            {paper.group.toUpperCase()} /{" "}
            {chapter ? "CHAPTER " + chapter.id : "PAPER GUIDE"}
          </span>
          <h1>{chapter?.name || paper.name}</h1>
          <p>{chapter?.scope || paper.summary}</p>
        </div>
        {chapter ? (
          <AnswerPractice
            key={paper.id + chapter.id}
            paper={paper}
            chapter={chapter}
          />
        ) : (
          <>
            <div className="mains-paper-intro">
              <div>
                <BookOpen size={22} />
                <b>{paper.chapters.length} chapters</b>
                <span>
                  {paper.chapters.reduce((n, c) => n + c.questions.length, 0)}{" "}
                  original questions
                </span>
              </div>
              <button
                className="button outline"
                onClick={() => go("mains/" + paper.id + "/papers")}
              >
                Browse official papers
                <ArrowUpRight size={16} />
              </button>
            </div>
            <p className="mains-note">{paper.method}</p>
            <div className="chapter-list">
              {paper.chapters.map((c, i) => (
                <button
                  className="chapter-card"
                  key={c.id}
                  onClick={() => go("mains/" + paper.id + "/" + c.id)}
                >
                  <span className="chapter-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2>{c.name}</h2>
                    <p>{c.scope}</p>
                    <span className="tag">
                      {c.questions.length} original questions
                    </span>
                    <span className="chapter-meta">
                      {" "}
                      · Analysis & answer writing
                    </span>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>
            <PaperLibrary key={paper.id} paperId={paper.id} />
          </>
        )}
      </>
    );
  const filtered = mainsPapers.filter(
    (p) =>
      (category === "All papers" || p.group === category) &&
      `${p.name} ${p.summary} ${p.chapters.map((c) => c.name + " " + c.scope).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <section className="mains-hero">
        <div>
          <span className="eyebrow">THE MAINS STUDY DESK</span>
          <h1>
            Go beyond the fact.
            <br />
            <em>Build the argument.</em>
          </h1>
          <p>
            Syllabus first. Chapters next. Purposeful answer writing, every day.
          </p>
          <div className="mains-hero-actions">
            <a
              className="button mains-light"
              href="#mains-syllabus"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("mains-syllabus")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore the syllabus
              <ChevronRight size={17} />
            </a>
            <button
              onClick={() => go("mains/papers")}
              className="mains-hero-link"
            >
              Official PYQ library
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
        <div className="mains-hero-index">
          <span>YOUR WRITING ROUTE</span>
          <div>
            <b>01</b>Understand the syllabus
          </div>
          <div>
            <b>02</b>Study the chapter
          </div>
          <div>
            <b>03</b>Analyse. Write. Review.
          </div>
          <small>Philosophy + PSIR optionals included</small>
        </div>
      </section>
      <div className="mains-stats">
        <div>
          <b>{mainsPapers.length}</b>
          <span>paper guides</span>
        </div>
        <div>
          <b>{mainsTotals.chapters}</b>
          <span>study chapters</span>
        </div>
        <div>
          <b>{mainsTotals.questions}</b>
          <span>original prompts</span>
        </div>
        <div>
          <b>2016–26</b>
          <span>official PDF coverage</span>
        </div>
      </div>
      <section id="mains-syllabus">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark">
              01 / SYLLABUS → SUBJECT → CHAPTER → QUESTION
            </span>
            <h2>Your Mains syllabus</h2>
            <p>GS and Essay for every aspirant. Explore either optional.</p>
          </div>
          <Link href={syllabusUrl}>Official syllabus</Link>
        </div>
        <div className="mains-scheme">
          <b>Merit papers: 1,750 marks</b>
          <span>Essay 250 · GS I–IV 1,000 · one optional, two papers 500</span>
          <small>
            English and Indian language papers are qualifying. Check the
            official notification for rules and exemptions.
          </small>
        </div>
        <div className="mains-browse">
          <div className="mains-tabs">
            {["All papers", "General Studies", "Optionals", "Qualifying"].map(
              (g) => (
                <button
                  key={g}
                  className={category === g ? "active" : ""}
                  onClick={() => setCategory(g)}
                >
                  {g}
                </button>
              ),
            )}
          </div>
          <label className="mains-quick-search">
            <Search size={17} />
            <input
              aria-label="Search Mains subjects and chapters"
              placeholder="Find a subject or topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="mains-subject-grid">
          {filtered.map((p, i) => (
            <button
              key={p.id}
              className={
                "mains-subject-card " +
                (p.group === "Optionals" ? "optional" : "")
              }
              onClick={() => go("mains/" + p.id)}
            >
              <div>
                <span className="micro">
                  {p.group === "Optionals"
                    ? "OPTIONAL PAPER"
                    : p.group === "Qualifying"
                      ? "QUALIFYING"
                      : "MERIT PAPER"}
                </span>
                <span className="mains-card-icon">
                  {p.group === "Optionals" ? (
                    <Compass size={21} />
                  ) : (
                    <BookOpen size={21} />
                  )}
                </span>
              </div>
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <div className="mains-card-foot">
                <span>
                  {p.chapters.length} chapters ·{" "}
                  {p.chapters.reduce((n, c) => n + c.questions.length, 0)}{" "}
                  prompts
                </span>
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>
        {!filtered.length && (
          <div className="empty">
            <h3>No matching subject</h3>
            <button
              className="button outline"
              onClick={() => {
                setSearch("");
                setCategory("All papers");
              }}
            >
              Show all papers
            </button>
          </div>
        )}
      </section>
      <div className="mains-bottom-note">
        <Check size={20} />
        <p>
          <b>Know what you are practising.</b> Chapter groupings and analysis
          are editorial, based on the official syllabus. Practice prompts are
          original. The PYQ library links complete UPSC papers; verified
          chapter-wise transcriptions and official model answers are not
          included.
        </p>
      </div>
    </>
  );
}
