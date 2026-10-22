import { subjects } from "../data/curriculum";
import { mainsPapers } from "../data/mains-curriculum";
export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL
    : "http://localhost:3000");
export const routeHref = (route: string) =>
  route === "syllabus" ? "/" : "/" + route;
export type StudyPage = { route: string; title: string; description: string };
export const studyPages: StudyPage[] = [
  {
    route: "constitution",
    title: "The Constitution | GO DAILY",
    description:
      "Explore constitutional branches, schedules, amendments and revision notes.",
  },
  {
    route: "progress",
    title: "My Progress & Bookmarks | GO DAILY",
    description:
      "Resume saved chapters, review mistakes and organise bookmarked questions and news on this browser.",
  },
  {
    route: "syllabus",
    title: "GO DAILY — UPSC Prelims & Mains Study Desk",
    description:
      "Study UPSC Prelims and Mains with chapter-wise original practice, official PYQ paper links, Philosophy and PSIR optionals. Made by ABHISHEK SINGH.",
  },
  {
    route: "news",
    title: "UPSC Current Affairs: The Hindu, Indian Express & PIB | GO DAILY",
    description:
      "Explore selected The Hindu, The Indian Express and PIB coverage in daily, weekly and monthly views, with Prelims and Mains study prompts.",
  },
  {
    route: "papers",
    title: "UPSC Prelims Previous Year Papers | GO DAILY",
    description:
      "Find official UPSC Prelims GS I and CSAT paper links and a topic-reference index. Original practice is clearly separated from PYQs.",
  },
  ...subjects.flatMap((s) => [
    {
      route: "subject/" + s.id,
      title: s.name + " — UPSC Prelims | GO DAILY",
      description: s.syllabus,
    },
    ...s.chapters.map((c) => ({
      route: "chapter/" + c.id,
      title: c.name + " — Prelims Practice | GO DAILY",
      description: c.scope + " Practise original exercises with explanations.",
    })),
  ]),
  {
    route: "mains",
    title: "UPSC Mains, Philosophy & PSIR Preparation | GO DAILY",
    description:
      "Explore Essay, GS I–IV, Philosophy and PSIR: 68 study chapters, 136 original prompts, analytical guides and an answer-writing workspace.",
  },
  {
    route: "mains/papers",
    title: "UPSC Mains Previous Year Papers 2016–2026 | GO DAILY",
    description:
      "Browse 250 official UPSC paper links by year and subject, including Essay, GS, Philosophy, PSIR and qualifying languages. Availability varies by paper.",
  },
  ...mainsPapers.flatMap((p) => [
    {
      route: "mains/" + p.id,
      title: p.name + " — UPSC Mains | GO DAILY",
      description:
        p.summary +
        " Explore chapter guides, original questions and official paper links.",
    },
    ...p.chapters.map((c) => ({
      route: "mains/" + p.id + "/" + c.id,
      title: c.name + " — " + p.short + " | GO DAILY",
      description:
        c.scope + " Study the analytical guide and practise answer writing.",
    })),
    {
      route: "mains/" + p.id + "/papers",
      title: p.name + " Previous Year Papers | GO DAILY",
      description:
        "Browse official UPSC " +
        p.name +
        " paper PDFs by year. Full original papers, with coverage and availability clearly identified.",
    },
  ]),
];
export const findStudyPage = (route: string) =>
  studyPages.find((p) => p.route === route);
