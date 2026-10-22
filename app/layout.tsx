import type { Metadata } from "next";
import "./globals.css";
import AuthBridge from "./auth-bridge";
import AppearanceControl from "./appearance-control";

export const metadata: Metadata = {
  title: "GO DAILY — UPSC Prelims & Mains Study Desk",
  description:
    "Study UPSC Prelims and Mains with chapter-wise original practice, official PYQ paper links, Philosophy and PSIR optionals. Made by ABHISHEK SINGH.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL
        : "http://localhost:3000"),
  ),
  robots: { index: true, follow: true },
  verification: { google: "vxTi0nbf0Jiz33iMjnoJ4_bIiZfj7TR8BeFAIvlYSqk" },
  authors: [{ name: "ABHISHEK SINGH" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('go-daily:appearance');document.documentElement.dataset.theme=(m==='dark'||m!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}",
          }}
        />
      </head>
      <body className="antialiased">
        <AuthBridge />
        {children}
        <AppearanceControl />
      </body>
    </html>
  );
}
