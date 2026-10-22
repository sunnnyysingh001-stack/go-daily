import StudyDesk from "./study-desk";
import type { Metadata } from "next";
import { studyPages, siteOrigin } from "../lib/site-pages";
const home = studyPages[0];
export const metadata: Metadata = {
  alternates: { canonical: siteOrigin + "/" },
  openGraph: {
    title: home.title,
    description: home.description,
    url: siteOrigin + "/",
    siteName: "GO DAILY",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: home.title,
    description: home.description,
  },
};
export default function Page() {
  return <StudyDesk />;
}
