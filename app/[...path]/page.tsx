import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StudyDesk from "../study-desk";
import { findStudyPage, routeHref, siteOrigin } from "../../lib/site-pages";
type Props = { params: Promise<{ path: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = (await params).path.join("/");
  const page = findStudyPage(route);
  if (!page)
    return {
      title: "Page not found | GO DAILY",
      robots: { index: false, follow: true },
    };
  const url = siteOrigin + routeHref(route);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: "GO DAILY",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}
export default async function Page({ params }: Props) {
  const route = (await params).path.join("/");
  if (!findStudyPage(route) || route === "syllabus") notFound();
  return <StudyDesk initialRoute={route} />;
}
